#!/usr/bin/env python3
"""Round 7 full run: compare panel frequency vectors vs Ensembl reference (per panel)."""
import json, os, sys

D = os.path.dirname(os.path.abspath(__file__))  # portable: repo round7/ dir
COMP = {"A": "T", "T": "A", "C": "G", "G": "C"}
POPMAP = {
    "AFR": ["1000GENOMES:phase_3:AFR", "gnomADg:afr"],
    "EAS": ["1000GENOMES:phase_3:EAS", "gnomADg:eas"],
    "EUR": ["1000GENOMES:phase_3:EUR", "gnomADg:nfe"],
    "SAS": ["1000GENOMES:phase_3:SAS", "gnomADg:sas"],
    "MENA": ["gnomADg:mid"],
}
SKIP_POPS = {"AMR", "NAT", "OCE", "SIB", "CAS"}

def ref_freq(variant, alt, pop_ids):
    pops = variant.get("populations") or []
    by_pop = {}
    for p in pops:
        by_pop.setdefault(p.get("population"), {})[p.get("allele")] = p.get("frequency")
    biallelic = set()
    for m in variant.get("mappings") or []:
        s = m.get("allele_string") or ""
        parts = [x.strip().upper() for x in s.replace("/", ",").split(",") if x.strip()]
        if len(parts) == 2 and all(len(x) == 1 for x in parts):
            biallelic = set(parts)
    for pid in pop_ids:
        d = by_pop.get(pid)
        if not d:
            continue
        if alt in d and isinstance(d[alt], (int, float)):
            return d[alt], pid, "direct"
        calt = COMP.get(alt)
        if calt in d and isinstance(d[calt], (int, float)):
            return d[calt], pid, "complement"
        if biallelic and alt in biallelic:
            other = (biallelic - {alt}).pop()
            if other in d and isinstance(d[other], (int, float)) and len(d) == 1:
                return 1.0 - d[other], pid, "inferred"
    return None, None, None

def compare(panel_name):
    panel = json.load(open(f"{D}/panels/{panel_name}.json"))
    snap = json.load(open(f"{D}/ensembl_ref_snapshot.json"))
    ref = snap["variants"]
    flags, no_ref = [], []
    for rs, v in panel.items():
        alleles = v.get("alleles") or []
        if not alleles:
            continue
        alt = alleles[0].upper()
        pfreqs = v.get("frequencies") or {}
        variant = ref.get(rs.lower())
        if not variant:
            no_ref.append(rs)
            continue
        issues, deltas, refvec, skipped = [], {}, {}, {}
        for pkey, pval in pfreqs.items():
            if pkey in SKIP_POPS:
                skipped[pkey] = pval
                continue
            if pkey not in POPMAP or not isinstance(pval, (int, float)):
                continue
            rf, pid, how = ref_freq(variant, alt, POPMAP[pkey])
            if rf is None:
                continue
            refvec[pkey] = rf
            d = abs(pval - rf)
            deltas[pkey] = round(d, 3)
            if d > 0.25:
                sev = "SEVERE" if d > 0.5 else "moderate"
                issues.append(f"[{sev}] delta {pkey}: panel {pval} vs ref {rf:.3f} ({pid},{how})")
        pvals = [x for k, x in pfreqs.items() if k not in SKIP_POPS and isinstance(x, (int, float))]
        rvals = list(refvec.values())
        if pvals and rvals and max(pvals) >= 0.9 and all(x <= 0.1 for x in pvals if x != max(pvals)):
            if max(rvals) - min(rvals) < 0.5:
                issues.append(f"[SEVERE] exclusivity contradicted: panel {max(pvals)}/{min(pvals)} vs ref spread {max(rvals)-min(rvals):.2f}")
        if pvals and rvals and len(refvec) >= 3:
            parg = max(pfreqs, key=lambda k: pfreqs[k] if isinstance(pfreqs[k], (int, float)) else -1)
            rarg = max(refvec, key=lambda k: refvec[k])
            if parg != rarg and pfreqs[parg] >= 0.7 and refvec[rarg] - refvec.get(parg, 0) > 0.25:
                issues.append(f"[SEVERE] inverted: panel peak {parg}={pfreqs[parg]} vs ref peak {rarg}={refvec[rarg]:.3f}")
        if issues:
            flags.append({"rsid": rs, "trait": v.get("trait"), "weight": v.get("weight"),
                          "panel_alt": alt, "deltas": deltas, "issues": issues,
                          "panel_freqs": dict(pfreqs),
                          "ref_freqs": {k: round(x, 4) for k, x in refvec.items()}})
    flags.sort(key=lambda f: (-sum("[SEVERE]" in i for i in f["issues"]), f["rsid"]))
    json.dump({"n_panel": len(panel), "n_no_ref": len(no_ref), "no_ref": no_ref,
               "n_flagged": len(flags), "flags": flags},
              open(f"{D}/{panel_name}.flags.json", "w"), indent=1)
    print(f"{panel_name}: {len(panel)} markers, {len(no_ref)} no_ref, {len(flags)} flagged", flush=True)

if __name__ == "__main__":
    for name in sys.argv[1:]:
        compare(name)
