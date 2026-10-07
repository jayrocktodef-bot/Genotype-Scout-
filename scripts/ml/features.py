import json
import math
from pathlib import Path

COMPLEMENTS = {'A': 'T', 'T': 'A', 'C': 'G', 'G': 'C'}
PALINDROMIC_SETS = [{'A', 'T'}, {'C', 'G'}]

def is_palindromic(alleles):
    st = set(a.upper() for a in alleles)
    return st in PALINDROMIC_SETS

def complement(allele):
    return COMPLEMENTS.get(allele.upper(), allele)

def build_feature_table(marker_table_path):
    """
    Parses the raw marker table and computes the canonical featureAllele and otherAllele.
    Returns a list of dicts: rsid, chrom, pos38, pos37, featureAllele, otherAllele, isPalindromic.
    """
    with open(marker_table_path) as f:
        data = json.load(f)
    
    features = []
    for m in data['markers']:
        ensembl = [a.upper() for a in m['ensembl_alleles']]
        
        panel = m['panel_allele'].upper()
        palindromic = is_palindromic(ensembl)
        
        feature_allele = None
        if panel in ensembl:
            feature_allele = panel
        elif not palindromic:
            comp_panel = complement(panel)
            if comp_panel in ensembl:
                feature_allele = comp_panel
                
        if not feature_allele:
            continue
            
        other_allele = next(a for a in ensembl if a != feature_allele)
        
        features.append({
            'rsid': m['rsid'],
            'chrom': m['chrom'],
            'pos38': m['pos38'],
            'pos37': m['pos37'],
            'featureAllele': feature_allele,
            'otherAllele': other_allele,
            'isPalindromic': palindromic
        })
        
    return features

def compute_dosage(gt_alleles, feature_allele, other_allele, is_palindromic):
    """
    Computes the dosage of feature_allele (0, 1, 2) from gt_alleles.
    Returns float('nan') if missing or unresolvable.
    gt_alleles: list/tuple of strings, e.g., ['A', 'G'].
    """
    if len(gt_alleles) != 2:
        return float('nan')
        
    gt1 = gt_alleles[0].upper()
    gt2 = gt_alleles[1].upper()
    
    f_all = feature_allele.upper()
    o_all = other_allele.upper()
    
    # 1. Exact Match
    if gt1 in (f_all, o_all) and gt2 in (f_all, o_all):
        return sum(1 for g in (gt1, gt2) if g == f_all)
        
    # 2. Complement Match (only if non-palindromic)
    if not is_palindromic:
        cf = complement(f_all)
        co = complement(o_all)
        if gt1 in (cf, co) and gt2 in (cf, co):
            return sum(1 for g in (gt1, gt2) if g == cf)
            
    return float('nan')

def save_canonical_table(features, out_path):
    with open(out_path, 'w') as f:
        json.dump({'features': features}, f, indent=2)
