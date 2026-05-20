import sys
import subprocess

def convert_to_plink(raw_dna_file, output_prefix):
    """
    Parses a raw consumer DNA file and converts it to PLINK format.
    Requires PLINK 1.9 executable in the system PATH.
    """
    print(f"Parsing {raw_dna_file}...")
    
    # 1. Parse raw text file (simplified example for AncestryDNA structure)
    # This assumes AncestryDNA format: rsid, chromosome, position, genotype
    ped_file = f"{output_prefix}.ped"
    map_file = f"{output_prefix}.map"
    
    with open(raw_dna_file, 'r') as infile, \
         open(ped_file, 'w') as ped, \
         open(map_file, 'w') as map:
        
        # Write dummy family info for PED file
        ped.write("FAM001 IND001 0 0 1 -9 ")
        
        # Parse lines
        for line in infile:
            if line.startswith('#'): continue
            parts = line.split('\t')
            if len(parts) < 4: continue
            
            rsid, chrom, pos, genotype = parts[0], parts[1], parts[2], parts[3]
            
            # Write MAP file
            map.write(f"{chrom}\t{rsid}\t0\t{pos}\n")
            
            # Write PED file genotype
            # Assumes simple conversion (e.g., A -> A)
            alleles = list(genotype.strip())
            ped.write(f"{alleles[0]} {alleles[1]} ")
            
    print(f"Generated {ped_file} and {map_file}")
    
    # 2. Trigger PLINK command to create binary BED/BIM/FAM files
    try:
        subprocess.run(["plink", "--file", output_prefix, "--make-bed", "--out", output_prefix], check=True)
        print(f"Successfully generated {output_prefix}.bed, {output_prefix}.bim, {output_prefix}.fam")
    except subprocess.CalledProcessError as e:
        print(f"Error running PLINK: {e}")

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python plink_converter.py <raw_dna.txt> <output_prefix>")
    else:
        convert_to_plink(sys.argv[1], sys.argv[2])
