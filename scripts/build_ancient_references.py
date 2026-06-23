#!/usr/bin/env python3
"""
build_ancient_references.py

A pipeline script to extract ancient genotypes and allele frequencies from the 
Allen Ancient DNA Resource (AADR) and integrate them into Genotype Scout's 
master_ancient_profiles.json.

Instructions:
1. Download the AADR dataset (e.g., v54.1.p1) from Harvard Dataverse.
2. Ensure you have the .geno, .snp, and .anno files.
3. Run this script:
   python3 build_ancient_references.py --anno v54.1.p1_1240K_public.anno \
                                       --snp v54.1.p1_1240K_public.snp \
                                       --geno v54.1.p1_1240K_public.geno \
                                       --aims ../src/data/master_ancient_profiles.json \
                                       --out master_ancient_profiles_v2.json
"""

import argparse
import json
import os
import pandas as pd
import numpy as np

def load_aims(aims_json_path):
    with open(aims_json_path, 'r') as f:
        data = json.load(f)
    # Return list of rsids we care about
    return list(data.get('markers', {}).keys()), data

def process_aadr(anno_path, snp_path, geno_path, ind_path, target_rsids, current_data, out_path):
    print(f"Loading AADR SNP map from {snp_path}...")
    # AADR .snp format: SNP_ID Chromosome Genetic_Pos Physical_Pos Ref_Allele Alt_Allele
    snp_df = pd.read_csv(snp_path, sep=r'\s+', header=None, 
                         names=['rsid', 'chr', 'gen_pos', 'phys_pos', 'ref', 'alt'])
    
    # Find the row indices for our target SNPs
    target_snps = snp_df[snp_df['rsid'].isin(target_rsids)].copy()
    target_snps['row_idx'] = target_snps.index
    print(f"Found {len(target_snps)} / {len(target_rsids)} target AIMs in AADR.")
    
    print(f"Loading AADR Annotations from {anno_path}...")
    anno_df = pd.read_csv(anno_path, sep='\t', low_memory=False)
    
    geno_col_to_anno_row = {}
    if ind_path:
        print(f"Loading .ind file from {ind_path} to map columns...")
        ind_df = pd.read_csv(ind_path, sep=r'\s+', header=None, names=['sample_id', 'sex', 'group'])
        
        # Build mapping from geno column index to anno_df row index based on 'Instance ID'
        for col_idx, row in ind_df.iterrows():
            sid = row['sample_id']
            # Find in anno_df
            match = anno_df[anno_df['Instance ID'] == sid]
            if len(match) > 0:
                geno_col_to_anno_row[col_idx] = match.index[0]
    else:
        # Assume perfect alignment
        for i in range(len(anno_df)):
            geno_col_to_anno_row[i] = i
            
    print(f"Processing genotypes from {geno_path}...")
    # Read only the lines corresponding to our target SNPs
    target_indices = set(target_snps['row_idx'].tolist())
    
    extracted_genotypes = {} # snp_rsid -> array of alleles (0,1,2,9)
    
    with open(geno_path, 'r') as f:
        for idx, line in enumerate(f):
            if idx == 0:
                num_cols = len(line.strip())
                if not ind_path and num_cols != len(anno_df):
                    raise ValueError(f"Dimension mismatch: .geno has {num_cols} columns, but .anno has {len(anno_df)} rows. You MUST provide a .ind file!")
            if idx in target_indices:
                rsid = target_snps.loc[target_snps['row_idx'] == idx, 'rsid'].values[0]
                extracted_genotypes[rsid] = np.array(list(line.strip()))
    
    print("Mapping AADR samples to Genotype Scout schema...")
    
    # Example: Let's extract 100 high-coverage ancient samples from distinct groups
    selected_samples = anno_df[anno_df['Group ID'].str.contains('Yamnaya|Neolithic|Hunter-Gatherer', case=False, na=False)].head(100)
    
    # Pre-calculate SNP missingness to filter out "useless" SNPs that are rarely called
    valid_sample_indices = set(selected_samples.index.tolist())
    useless_snps = []
    
    for rsid, geno_arr in extracted_genotypes.items():
        missing_count = 0
        total_valid = 0
        for idx in valid_sample_indices:
            if geno_arr[idx] == '9':
                missing_count += 1
            total_valid += 1
            
        if total_valid > 0 and (missing_count / total_valid) > 0.8:
            # If a SNP is missing in >80% of our selected samples, it's useless for ancient matching
            useless_snps.append(rsid)
            
    print(f"Filtering out {len(useless_snps)} useless SNPs (missing in >80% of samples).")
    for rsid in useless_snps:
        del extracted_genotypes[rsid]
    
    samples_dict = current_data.get('samples', {})
    
    for _, row in selected_samples.iterrows():
        sample_idx = row.name # index in .geno string
        sample_id = str(row.get('Instance ID', f"Sample_{sample_idx}"))
        group = str(row.get('Group ID', 'Unknown'))
        country = str(row.get('Country', 'Unknown'))
        age = row.get('Date mean in BP in years before 1950 CE [10000 ybp excluded]', 0)
        
        # Build Genotypes
        snps = {}
        missing_count = 0
        total_target_snps = len(extracted_genotypes)
        
        for rsid, geno_arr in extracted_genotypes.items():
            val = geno_arr[sample_idx]
            if val == '9':
                missing_count += 1
                continue # missing
                
            ref = target_snps.loc[target_snps['rsid'] == rsid, 'ref'].values[0]
            alt = target_snps.loc[target_snps['rsid'] == rsid, 'alt'].values[0]
            
            if val == '0':
                snps[rsid] = ref + ref
            elif val == '1':
                snps[rsid] = ref + alt
            elif val == '2':
                snps[rsid] = alt + alt
                
        # Filter out samples that are missing too many of our target AIMs
        call_rate = (total_target_snps - missing_count) / total_target_snps if total_target_snps > 0 else 0
        if call_rate < 0.5:
            print(f"Skipping {sample_id}: low coverage (Call rate: {call_rate:.2f})")
            continue
            
        if len(snps) > 0:
            samples_dict[sample_id.lower()] = {
                "id": sample_id.lower(),
                "name": sample_id,
                "site": str(row.get('Locality', 'Unknown')),
                "country": country,
                "age_bp": age,
                "period": "Ancient",
                "culture": group,
                "culture_name": group,
                "sex": str(row.get('Sex', 'U')),
                "description": f"AADR Reference from {group}",
                "region": "Global",
                "snps": snps
            }
            
    current_data['samples'] = samples_dict
    
    print(f"Writing updated JSON to {out_path}...")
    with open(out_path, 'w') as f:
        json.dump(current_data, f, indent=2)
        
    print("Done! Integrated new ancient samples into the database.")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Process AADR ancient genomes")
    parser.add_argument('--anno', required=True, help="Path to AADR .anno file")
    parser.add_argument('--snp', required=True, help="Path to AADR .snp file")
    parser.add_argument('--geno', required=True, help="Path to AADR .geno file")
    parser.add_argument('--ind', required=False, help="Optional path to AADR .ind file (required if .geno columns != .anno rows)")
    parser.add_argument('--aims', required=True, help="Path to master_ancient_profiles.json")
    parser.add_argument('--out', required=True, help="Output JSON path")
    
    args = parser.parse_args()
    
    target_rsids, current_data = load_aims(args.aims)
    process_aadr(args.anno, args.snp, args.geno, args.ind, target_rsids, current_data, args.out)
