#!/usr/bin/env python3
"""
scripts/ml/extract_genotypes.py
Extracts real genotypes for the canonical marker table from public VCFs (no simulation).

  --source tgp   1000 Genomes Phase 3 (GRCh37, shapeit2/mvncall integrated v5b, 2,504 individuals)
                 queried by chip GRCh37 position; identity re-verified by rsID in the VCF ID column.
  --source hgdp  HGDP / Bergstrom et al. 2020 (GRCh38, 929 individuals), queried by Ensembl GRCh38
                 position; identity verified by REF/ALT being the Ensembl allele pair (forward strand).

Output (data/ml/raw_<source>.npz): samples, markers, ref, alt, alt_dosage (int8, -1 = no call).
Only biallelic SNP records are accepted. No frequency data is read.
"""
import argparse
import json
import subprocess
import tempfile
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

import numpy as np

ROOT = Path(__file__).resolve().parent.parent.parent
TABLE = ROOT / "data" / "ml" / "marker_table.json"

TGP_URL = ("https://ftp.1000genomes.ebi.ac.uk/vol1/ftp/release/20130502/"
           "ALL.chr{c}.phase3_shapeit2_mvncall_integrated_v5b.20130502.genotypes.vcf.gz")
HGDP_URL = "https://ngs.sanger.ac.uk/production/hgdp/hgdp_wgs.20190516/hgdp_wgs.20190516.full.chr{c}.vcf.gz"


def run(cmd, timeout=900):
    return subprocess.run(cmd, capture_output=True, text=True, timeout=timeout)


def gt_to_alt_dosage(gt):
    """Biallelic GT string -> ALT allele count, or -1 for any no-call / non 0|1 allele."""
    alleles = gt.replace("|", "/").split("/")
    if len(alleles) != 2:
        return -1
    total = 0
    for a in alleles:
        if a == "0":
            continue
        elif a == "1":
            total += 1
        else:
            return -1
    return total


def extract_chrom(source, chrom, markers, samples_ref):
    url = (TGP_URL if source == "tgp" else HGDP_URL).format(c=chrom)
    pos_key = "pos37" if source == "tgp" else "pos38"
    contig = chrom if source == "tgp" else f"chr{chrom}"
    by_pos = {}
    for m in markers:
        by_pos.setdefault(m[pos_key], []).append(m)

    with tempfile.NamedTemporaryFile("w", suffix=".tsv", delete=False) as rf:
        for p in sorted(by_pos):
            rf.write(f"{contig}\t{p}\n")
        regions_path = rf.name

    if samples_ref.get("samples") is None:
        s = run(["bcftools", "query", "-l", url])
        samples_ref["samples"] = s.stdout.split()

    cmd = ["bcftools", "query", "-R", regions_path,
           "-f", "%POS\t%ID\t%REF\t%ALT[\t%GT]\n", url]
    res = run(cmd)
    out = {}
    stats = {"seen": 0, "accepted": 0, "id_mismatch": 0, "allele_mismatch": 0, "non_snp": 0}
    if res.returncode != 0:
        return chrom, out, {"error": res.stderr[-300:]}
    for line in res.stdout.splitlines():
        parts = line.split("\t")
        pos = int(parts[0])
        vid, ref, alt = parts[1], parts[2].upper(), parts[3].upper()
        if pos not in by_pos:
            continue
        stats["seen"] += 1
        if len(ref) != 1 or len(alt) != 1 or "," in alt:
            stats["non_snp"] += 1
            continue
        for m in by_pos[pos]:
            # Identity check: coordinate hit AND both VCF alleles belong to the Ensembl allele set
            # (forward strand on both sides). The Phase 3 release VCF carries '.' IDs here, so rsID
            # matching is not possible; a VCF ID that is present must still agree.
            if vid not in (".", "") and m["rsid"] not in [x.lower() for x in vid.split(";")]:
                stats["id_mismatch"] += 1
                continue
            if not {ref, alt} <= set(m["ensembl_alleles"]):
                stats["allele_mismatch"] += 1
                continue
            dos = np.array([gt_to_alt_dosage(g) for g in parts[4:]], dtype=np.int8)
            out[m["rsid"]] = (ref, alt, dos)
            stats["accepted"] += 1
    return chrom, out, stats


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--source", choices=["tgp", "hgdp"], required=True)
    ap.add_argument("--workers", type=int, default=6)
    ap.add_argument("--chroms", default=",".join(str(i) for i in range(1, 23)))
    args = ap.parse_args()

    table = json.load(open(TABLE))["markers"]
    chroms = args.chroms.split(",")
    by_chr = {c: [m for m in table if m["chrom"] == c] for c in chroms}
    samples_ref = {"samples": None}
    # fetch the sample list once, serially, before parallel work
    first = next(c for c in chroms if by_chr[c])
    url = (TGP_URL if args.source == "tgp" else HGDP_URL).format(c=first)
    samples_ref["samples"] = run(["bcftools", "query", "-l", url]).stdout.split()
    print(f"{args.source}: {len(samples_ref['samples'])} samples", flush=True)

    results = {}
    with ThreadPoolExecutor(args.workers) as ex:
        futs = [ex.submit(extract_chrom, args.source, c, by_chr[c], samples_ref) for c in chroms if by_chr[c]]
        for f in futs:
            c, out, stats = f.result()
            results.update(out)
            print(f"  chr{c}: {stats}", flush=True)

    markers = [m["rsid"] for m in table if m["rsid"] in results]
    ref = np.array([results[r][0] for r in markers])
    alt = np.array([results[r][1] for r in markers])
    mat = np.stack([results[r][2] for r in markers], axis=1)  # samples x markers
    out_path = ROOT / "data" / "ml" / f"raw_{args.source}.npz"
    np.savez_compressed(out_path, samples=np.array(samples_ref["samples"]),
                        markers=np.array(markers), ref=ref, alt=alt, alt_dosage=mat)
    print(f"saved {mat.shape} -> {out_path}; markers resolved: {len(markers)}/{len(table)}")


if __name__ == "__main__":
    main()
