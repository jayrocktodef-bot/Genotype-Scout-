#!/usr/bin/env python3
"""
fetch_1000g_validation.py
Extracts real held-out genotypes for selected AIM markers across 1000 Genomes Phase 3.
Saves to src/data/reference/validation_samples_1000g.json.
"""

import json
import subprocess
import sys
import time
from pathlib import Path
from collections import defaultdict

ROOT_DIR = Path(__file__).resolve().parent.parent
OUTPUT_PATH = ROOT_DIR / "src" / "data" / "reference" / "validation_samples_1000g.json"

# Selected representative 1000G individuals (5 per continental superpopulation = 25 total)
VALIDATION_SAMPLES = {
    # EUR (European)
    "HG00105": "European",
    "HG00112": "European",
    "HG00117": "European",
    "HG00125": "European",
    "HG00129": "European",
    # AFR (African)
    "HG01879": "African",
    "HG01882": "African",
    "HG01894": "African",
    "HG01956": "African",
    "HG01914": "African",
    # EAS (East Asian)
    "HG00473": "East_Asian",
    "HG00478": "East_Asian",
    "HG00500": "East_Asian",
    "HG00513": "East_Asian",
    "HG00524": "East_Asian",
    # SAS (South Asian)
    "HG01583": "South_Asian",
    "HG01593": "South_Asian",
    "HG01589": "South_Asian",
    "HG02733": "South_Asian",
    "HG02783": "South_Asian",
    # AMR (Indigenous / Admixed American)
    "HG00554": "Indigenous_American",
    "HG00732": "Indigenous_American",
    "HG00737": "Indigenous_American",
    "HG01177": "Indigenous_American",
    "HG01191": "Indigenous_American",
}

def main():
    scratch_file = ROOT_DIR / "scratch" / "selected_top1197.json"
    if not scratch_file.exists():
        print("Error: scratch/selected_top1197.json not found.")
        sys.exit(1)

    with open(scratch_file) as f:
        markers = json.load(f)

    # Load chip positions (GRCh37) from Iberian sample
    sample_chip = ROOT_DIR / "public" / "samples" / "Iberian_Portuguese_hu33FC53.txt"
    chip_positions = {}
    with open(sample_chip) as sf:
        for line in sf:
            if line.startswith("#"):
                continue
            parts = line.strip().split("\t")
            if len(parts) >= 4:
                chip_positions[parts[0].lower()] = int(parts[2])

    valid_markers = []
    for m in markers:
        rs = m["rsid"].lower()
        if rs in chip_positions:
            m["pos_grch37"] = chip_positions[rs]
            valid_markers.append(m)

    print(f"Loaded {len(valid_markers)} markers with verified GRCh37 chip coordinates.")
    sample_list = list(VALIDATION_SAMPLES.keys())
    sample_str = ",".join(sample_list)

    # Group markers by chromosome
    by_chr = defaultdict(list)
    for m in valid_markers:
        by_chr[m["chrom"]].append(m)

    sample_genotypes = {s: {} for s in sample_list}
    scratch_dir = ROOT_DIR / "scratch"
    scratch_dir.mkdir(parents=True, exist_ok=True)

    sorted_chroms = sorted(by_chr.keys(), key=lambda x: int(x) if x.isdigit() else 99)
    print(f"Beginning 1000G extraction across {len(sorted_chroms)} chromosomes for {len(sample_list)} samples...")

    for chrom in sorted_chroms:
        chr_markers = by_chr[chrom]
        chr_markers.sort(key=lambda x: x["pos_grch37"])
        pos_map = {m["pos_grch37"]: m for m in chr_markers}

        # Query all regions for this chromosome in a single comma-separated string
        regions = ",".join(f"{chrom}:{m['pos_grch37']}-{m['pos_grch37']}" for m in chr_markers)
        url = f"https://ftp.1000genomes.ebi.ac.uk/vol1/ftp/release/20130502/ALL.chr{chrom}.phase3_shapeit2_mvncall_integrated_v5b.20130502.genotypes.vcf.gz"

        cmd = [
            "bcftools", "query",
            "-s", sample_str,
            "-r", regions,
            "-f", "%POS\t%REF\t%ALT[\t%SAMPLE=%GT]\n",
            url
        ]

        t0 = time.time()
        try:
            res = subprocess.run(cmd, capture_output=True, text=True, timeout=120, cwd=scratch_dir)
            dt = time.time() - t0
            if res.returncode == 0 and res.stdout.strip():
                lines = [l for l in res.stdout.strip().split("\n") if l]
                found_count = 0
                for line in lines:
                    parts = line.split("\t")
                    if len(parts) < 4:
                        continue
                    pos = int(parts[0])
                    ref = parts[1].upper()
                    alt_str = parts[2].upper()
                    alts = alt_str.split(",")

                    if pos not in pos_map:
                        continue
                    marker_info = pos_map[pos]
                    target_alt = marker_info["alt"].upper()
                    found_count += 1

                    for sample_call in parts[3:]:
                        if "=" not in sample_call:
                            continue
                        sname, gt = sample_call.split("=")
                        if sname not in sample_genotypes:
                            continue

                        dosage = 0.0
                        called = False
                        for a in gt.replace("|", "/").split("/"):
                            allele_base = None
                            if a == "0":
                                allele_base = ref
                                called = True
                            elif a.isdigit() and 1 <= int(a) <= len(alts):
                                allele_base = alts[int(a) - 1]
                                called = True
                            if allele_base and allele_base == target_alt:
                                dosage += 1.0

                        if called:
                            sample_genotypes[sname][marker_info["rsid"]] = dosage
                print(f"  chr{chrom:<2}: retrieved {found_count}/{len(chr_markers)} markers in {dt:.1f}s")
            else:
                print(f"  chr{chrom:<2}: warning - returncode {res.returncode}, stdout lines: {len(res.stdout.splitlines())}")
        except Exception as e:
            print(f"  chr{chrom:<2}: error during query: {e}")

    # Build final payload
    payload = {
        "metadata": {
            "source": "1000 Genomes Project Phase 3 (GRCh37 Phased Genotypes)",
            "assembly": "GRCh37",
            "nSamples": len(sample_list),
            "samples": VALIDATION_SAMPLES
        },
        "sampleGenotypes": sample_genotypes
    }

    OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    with open(OUTPUT_PATH, "w") as f:
        json.dump(payload, f, indent=2)

    total_calls = sum(len(calls) for calls in sample_genotypes.values())
    print(f"\nSuccessfully saved {len(sample_list)} real 1000G samples with {total_calls} total marker calls to {OUTPUT_PATH}")

if __name__ == "__main__":
    main()
