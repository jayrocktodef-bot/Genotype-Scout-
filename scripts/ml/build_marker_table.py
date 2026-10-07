#!/usr/bin/env python3
"""
scripts/ml/build_marker_table.py
Builds the canonical marker table used by every ML script.

Universe: sidecar v2.0.0 features still present in master_aims_normalized.json
(the 64 purged rs1001-rs1270 grid markers are dropped). Coordinates:
  - GRCh38: Ensembl cache (src/data/reference/ensembl_cache.json), the validator's source of truth
  - GRCh37: consumer chip file coordinates (identity is re-verified by rsID against the
            1000G Phase 3 VCF ID column at extraction time)
Panel allele = master alleles[0] (uppercased). No frequencies are read or used.
"""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent.parent
OUT = ROOT / "data" / "ml" / "marker_table.json"


def main():
    sidecar = json.load(open(ROOT / "public/models/genotype_scout_classifier.classes.json"))
    master = json.load(open(ROOT / "src/data/master_aims_normalized.json"))
    cache = json.load(open(ROOT / "src/data/reference/ensembl_cache.json"))

    chip = {}
    with open(ROOT / "public/samples/Iberian_Portuguese_hu33FC53.txt") as f:
        for line in f:
            if line.startswith("#"):
                continue
            p = line.strip().split("\t")
            if len(p) >= 4:
                chip[p[0].lower()] = (p[1], int(p[2]))

    rows, dropped = [], {"not_in_master": 0, "no_cache": 0, "no_chip": 0, "bad_chr": 0, "indel_or_multi": 0, "chr_mismatch": 0}
    for rs in sidecar["features"]:
        if rs not in master:
            dropped["not_in_master"] += 1
            continue
        c = cache.get(rs)
        if not c or not c.get("alleles") or c.get("status") == "UNRESOLVED":
            dropped["no_cache"] += 1
            continue
        if rs not in chip:
            dropped["no_chip"] += 1
            continue
        chrom = str(c["chromosome"]).upper().replace("CHR", "")
        if chrom not in {str(i) for i in range(1, 23)}:
            dropped["bad_chr"] += 1
            continue
        if chip[rs][0].upper().replace("CHR", "") != chrom:
            dropped["chr_mismatch"] += 1
            continue
        ens = [a.upper() for a in c["alleles"].split("/")]
        a0 = master[rs]["alleles"][0].upper()
        if len(a0) != 1 or any(len(a) != 1 for a in ens):
            dropped["indel_or_multi"] += 1
            continue
        rows.append({
            "rsid": rs,
            "chrom": chrom,
            "pos38": int(c["position"]),
            "pos37": chip[rs][1],
            "ensembl_alleles": ens,
            "panel_allele": a0,
        })

    OUT.parent.mkdir(parents=True, exist_ok=True)
    json.dump({"n": len(rows), "dropped": dropped, "markers": rows}, open(OUT, "w"), indent=1)
    print(f"markers kept: {len(rows)}; dropped: {dropped}")


if __name__ == "__main__":
    main()
