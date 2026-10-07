import json
import numpy as np
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent.parent
ML_DIR = ROOT / 'data' / 'ml'

CLASSES = ['European', 'African', 'East_Asian', 'South_Asian', 'Indigenous_American', 'Middle_Eastern', 'Oceanian']

def load_metadata():
    # Load TGP
    tgp_panel = {}
    with open(ML_DIR / 'tgp_panel.txt') as f:
        for line in f:
            if line.startswith('sample'): continue
            parts = line.strip().split()
            if len(parts) >= 3:
                tgp_panel[parts[0]] = (parts[1], parts[2])
                
    # Load HGDP
    hgdp_panel = {}
    with open(ROOT / 'scratch' / 'onnx' / 'hgdp_wgs.20190516.metadata.txt') as f:
        for line in f:
            if line.startswith('sample'): continue
            parts = line.strip().split('\t')
            if len(parts) > 8:
                hgdp_panel[parts[0]] = (parts[5], parts[8])
                
    return tgp_panel, hgdp_panel

def assign_class(sample_id, source, tgp_panel, hgdp_panel):
    if source == 'tgp':
        if sample_id not in tgp_panel: return None
        pop, super_pop = tgp_panel[sample_id]
        if super_pop == 'EUR': return 'European'
        if super_pop == 'EAS': return 'East_Asian'
        if super_pop == 'SAS': return 'South_Asian'
        if super_pop == 'AFR':
            if pop in ['ASW', 'ACB']: return None # exclude admixed
            return 'African'
        return None # AMR excluded (PUR, CLM, MXL, PEL)
        
    elif source == 'hgdp':
        if sample_id not in hgdp_panel: return None
        pop, region = hgdp_panel[sample_id]
        if pop in ['Karitiana', 'Surui', 'Pima', 'Maya']:
            return 'Indigenous_American'
        if pop in ['Bedouin', 'Druze', 'Palestinian', 'Mozabite']:
            return 'Middle_Eastern'
        if pop.startswith('Papuan') or pop == 'Bougainville':
            return 'Oceanian'
        return None
        
def process_source(source, tgp_panel, hgdp_panel, features_dict):
    path = ML_DIR / f'raw_{source}.npz'
    if not path.exists():
        print(f"Skipping {source}, not found.")
        return None
        
    d = np.load(path)
    samples = d['samples']
    markers = d['markers']
    ref = d['ref']
    alt = d['alt']
    alt_dosage = d['alt_dosage'].astype(np.float32)
    
    # Filter to samples that have a class
    labels = []
    keep_samples = []
    for i, s in enumerate(samples):
        cls = assign_class(s, source, tgp_panel, hgdp_panel)
        if cls:
            labels.append(cls)
            keep_samples.append(i)
            
    samples = samples[keep_samples]
    alt_dosage = alt_dosage[keep_samples, :]
    labels = np.array(labels)
    
    # Map to feature allele
    feat_dosage = np.full_like(alt_dosage, np.nan)
    feat_dosage[alt_dosage == -1] = np.nan
    
    for j, m in enumerate(markers):
        if m not in features_dict:
            continue
        feat = features_dict[m]['featureAllele']
        
        # If the extracted VCF alt matches the canonical feature allele
        if alt[j] == feat:
            mask = alt_dosage[:, j] != -1
            feat_dosage[mask, j] = alt_dosage[mask, j]
        # If the extracted VCF ref matches the canonical feature allele
        elif ref[j] == feat:
            mask = alt_dosage[:, j] != -1
            feat_dosage[mask, j] = 2.0 - alt_dosage[mask, j]
        # Otherwise it's unresolvable for this source
        
    return samples, markers, feat_dosage, labels

def main():
    tgp_panel, hgdp_panel = load_metadata()
    with open(ML_DIR / 'canonical_features.json') as f:
        features = json.load(f)['features']
        
    features_dict = {f['rsid']: f for f in features}
    
    res_tgp = process_source('tgp', tgp_panel, hgdp_panel, features_dict)
    res_hgdp = process_source('hgdp', tgp_panel, hgdp_panel, features_dict)
    
    if res_tgp is None or res_hgdp is None:
        return
        
    samp1, mark1, dos1, lab1 = res_tgp
    samp2, mark2, dos2, lab2 = res_hgdp
    
    # Intersect markers
    common_markers = np.intersect1d(mark1, mark2)
    
    # Filter dos1, dos2 to common_markers
    idx1 = [np.where(mark1 == m)[0][0] for m in common_markers]
    idx2 = [np.where(mark2 == m)[0][0] for m in common_markers]
    
    dos1 = dos1[:, idx1]
    dos2 = dos2[:, idx2]
    mark1 = common_markers
    mark2 = common_markers
    
    samples = np.concatenate([samp1, samp2])
    labels = np.concatenate([lab1, lab2])
    dosage = np.vstack([dos1, dos2])
    
    # Filter features based on palindromic MAF > 0.4
    keep_features = []
    final_features_meta = []
    
    for j, rsid in enumerate(mark1):
        if rsid not in features_dict: continue
        
        fmeta = features_dict[rsid]
        col = dosage[:, j]
        valid = col[~np.isnan(col)]
        if len(valid) == 0:
            continue
            
        mean_dosage = np.mean(valid)
        maf = min(mean_dosage / 2.0, 1.0 - (mean_dosage / 2.0))
        
        if fmeta['isPalindromic'] and maf > 0.40:
            continue
            
        fmeta['imputeMean'] = float(mean_dosage)
        keep_features.append(j)
        final_features_meta.append(fmeta)
        
    dosage = dosage[:, keep_features]
    
    # Mean Impute
    for j, fmeta in enumerate(final_features_meta):
        col = dosage[:, j]
        col[np.isnan(col)] = fmeta['imputeMean']
        
    np.savez_compressed(ML_DIR / 'dataset.npz', 
        samples=samples, 
        features=dosage, 
        labels=labels,
        marker_rsids=np.array([f['rsid'] for f in final_features_meta]))
        
    with open(ML_DIR / 'dataset_manifest.json', 'w') as f:
        json.dump({'features': final_features_meta}, f, indent=2)
        
    print(f"Dataset built. Samples: {len(samples)}, Features: {len(final_features_meta)}")

if __name__ == '__main__':
    main()
