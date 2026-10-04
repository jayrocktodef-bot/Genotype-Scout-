#!/usr/bin/env python3
"""
scripts/diagnose_allele_alignment.py
Phase 0 (items 2 and 4): per-marker allele-alignment audit.

For each classifier feature and each validatable class, compare the mean
validation allele frequency (dosage/2 over that class's validation samples)
against the panel frequency f and against 1-f. If the validation counts the
same allele as the panel, r(val, f) is strongly positive and r(val, 1-f)
strongly negative. A reversal (or near-zero for both) indicates allele/strand
misalignment between how validation dosages were derived and how the panel
(training) frequencies are defined.
"""
import json
from pathlib import Path
import numpy as np

ROOT = Path(__file__).resolve().parent.parent
sidecar = json.load(open(ROOT / "public/models/genotype_scout_classifier.classes.json"))
master = json.load(open(ROOT / "src/data/master_aims_normalized.json"))
cache = json.load(open(ROOT / "src/data/reference/ensembl_cache.json"))
val = json.load(open(ROOT / "src/data/reference/validation_samples_1000g.json"))

CODE = {"European": "EUR", "African": "AFR", "East_Asian": "EAS",
        "South_Asian": "SAS", "Indigenous_American": "AMR"}
feats = sidecar["features"]
alts = sidecar["altAlleles"]
meta = val["metadata"]["samples"]
geno = val["sampleGenotypes"]

by_pop = {}
for s, p in meta.items():
    by_pop.setdefault(p, []).append(s)

present = [(i, rs) for i, rs in enumerate(feats) if rs in master]
print(f"Features in sidecar: {len(feats)}; present in master: {len(present)}; absent: {len(feats) - len(present)}")

# Cache allele orientation: is panel alleles[0] the Ensembl REF (first token)?
ref_is_alt = alt_is_ens_alt = unknown = 0
pal = 0
for i, rs in present:
    c = cache.get(rs)
    if not c or not c.get("alleles"):
        unknown += 1
        continue
    toks = c["alleles"].upper().split("/")
    a0 = master[rs]["alleles"][0].upper()
    if {toks[0], toks[1] if len(toks) > 1 else ""} in ({"A", "T"}, {"C", "G"}):
        pal += 1
    if a0 == toks[0]:
        ref_is_alt += 1
    else:
        alt_is_ens_alt += 1
print(f"panel alleles[0] == Ensembl REF: {ref_is_alt}; == Ensembl ALT: {alt_is_ens_alt}; no cache: {unknown}; palindromic: {pal}")

print("\nPer-class agreement between validation allele freq and panel freq (n markers, r(val,f), r(val,1-f), mean|val-f|, mean|val-(1-f)|):")
for pop, code in CODE.items():
    v_af, p_f = [], []
    for i, rs in present:
        f = master[rs]["frequencies"].get(code)
        if f is None:
            continue
        ds = [geno[s][rs] for s in by_pop[pop] if rs in geno[s]]
        if len(ds) < len(by_pop[pop]):
            continue
        v_af.append(np.mean(ds) / 2.0)
        p_f.append(float(f))
    v_af, p_f = np.array(v_af), np.array(p_f)
    r_f = np.corrcoef(v_af, p_f)[0, 1]
    r_1f = np.corrcoef(v_af, 1 - p_f)[0, 1]
    print(f"  {pop:<20} n={len(v_af):<5} r_f={r_f:+.3f} r_1mf={r_1f:+.3f} "
          f"|val-f|={np.mean(np.abs(v_af - p_f)):.3f} |val-(1-f)|={np.mean(np.abs(v_af - (1 - p_f))):.3f}")

# Marker-level classification of allele orientation using EUR and AFR together
ok = flip = ambiguous = 0
for i, rs in present:
    fE = master[rs]["frequencies"].get("EUR")
    fA = master[rs]["frequencies"].get("AFR")
    if fE is None or fA is None:
        continue
    dE = [geno[s][rs] for s in by_pop["European"] if rs in geno[s]]
    dA = [geno[s][rs] for s in by_pop["African"] if rs in geno[s]]
    if len(dE) < 5 or len(dA) < 5:
        continue
    vE, vA = np.mean(dE) / 2, np.mean(dA) / 2
    e_direct = abs(vE - fE) + abs(vA - fA)
    e_flip = abs(vE - (1 - fE)) + abs(vA - (1 - fA))
    if abs(e_direct - e_flip) < 0.2:
        ambiguous += 1
    elif e_direct < e_flip:
        ok += 1
    else:
        flip += 1
print(f"\nMarker orientation (EUR+AFR): direct-consistent={ok}, flipped={flip}, ambiguous={ambiguous}")

# Missingness structure: which markers are missing from validation, and their panel frequency profile
missing = [rs for i, rs in present if all(rs not in geno[s] for s in geno)]
print(f"Markers with no validation call in any sample: {len(missing)}")
