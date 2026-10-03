#!/usr/bin/env python3
"""
normalize_strands_grch38.py
One-time DB normalization conforming to Audit Finding H-3:
1. Normalizes every AIM record's alleles to forward (+) strand verified against Ensembl GRCh38.
   Frequency stays with the physical alleles[0] through complementing.
2. Identifies palindromic A/T and C/G SNPs and sets palindromic: true.
3. Calculates MAF for palindromic SNPs, tagging maf_flag: true and high_maf: true when MAF > 0.40.
4. Caches all Ensembl REST responses into src/data/reference/ensembl_cache.json.
"""

import glob
import json
import sys
import time
import urllib.request
from pathlib import Path

ROOT_DIR = Path(__file__).resolve().parent.parent
AIMS_DIR = ROOT_DIR / "src" / "data" / "aims"
MASTER_FILE = ROOT_DIR / "src" / "data" / "master_aims_normalized.json"
ENSEMBL_CACHE_FILE = ROOT_DIR / "src" / "data" / "reference" / "ensembl_cache.json"

COMPLEMENT = {"A": "T", "T": "A", "C": "G", "G": "C"}

def complement_base(base):
    return COMPLEMENT.get(base.upper(), base.upper())

def is_palindromic_alleles(a1, a2):
    if not a1 or not a2:
        return False
    u1, u2 = a1.upper(), a2.upper()
    return (u1 == "A" and u2 == "T") or (u1 == "T" and u2 == "A") or \
           (u1 == "C" and u2 == "G") or (u1 == "G" and u2 == "C")

def fetch_ensembl_batch(rsids):
    """
    Fetches GRCh38 mapping and allele_string for a list of rsIDs using Ensembl POST API.
    """
    url = "https://rest.ensembl.org/variation/homo_sapiens"
    headers = {"Content-Type": "application/json", "Accept": "application/json"}
    body = json.dumps({"ids": rsids}).encode("utf-8")
    req = urllib.request.Request(url, data=body, headers=headers)
    
    results = {}
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            data = json.loads(resp.read().decode("utf-8"))
            for rs, var_info in data.items():
                mappings = var_info.get("mappings", [])
                # Prefer mapping on autosome / chromosome with strand 1
                best_map = None
                for m in mappings:
                    if m.get("coord_system") == "chromosome" and m.get("seq_region_name") in [str(i) for i in range(1, 23)] + ["X", "Y", "MT"]:
                        best_map = m
                        break
                if not best_map and mappings:
                    best_map = mappings[0]

                if best_map:
                    allele_str = best_map.get("allele_string", "")
                    # Note: Ensembl allele_string in mappings is already on the forward strand of the seq_region
                    results[rs.lower()] = {
                        "chromosome": str(best_map.get("seq_region_name")),
                        "position": int(best_map.get("start")),
                        "alleles": allele_str
                    }
    except Exception as e:
        print(f"Warning: batch query failed for {len(rsids)} rsids: {e}")
    return results

def main():
    print("=" * 65)
    print("🧬 One-Time DB Strand Normalization (Ensembl GRCh38)")
    print("=" * 65)

    # 1. Load Ensembl Cache
    cache = {}
    if ENSEMBL_CACHE_FILE.exists():
        with open(ENSEMBL_CACHE_FILE) as f:
            cache = json.load(f)
    print(f"Loaded existing Ensembl cache with {len(cache):,} records.")

    # 2. Collect all unique rsIDs across panels
    all_files = sorted(glob.glob(str(AIMS_DIR / "*.json"))) + [str(MASTER_FILE)]
    all_rsids = set()
    for fpath in all_files:
        with open(fpath) as f:
            data = json.load(f)
        items = data if isinstance(data, list) else list(data.values())
        for item in items:
            rs = item.get("rsid", "").lower()
            if rs.startswith("rs"):
                all_rsids.add(rs)

    print(f"Total unique rsIDs across all panels: {len(all_rsids):,}")

    # 3. Identify missing rsIDs to hydrate from Ensembl if requested
    fetch_all = "--fetch-all" in sys.argv
    missing = [rs for rs in all_rsids if rs not in cache] if fetch_all else []
    if missing:
        print(f"rsIDs requiring Ensembl verification: {len(missing):,}")
        batch_size = 50
        for i in range(0, len(missing), batch_size):
            chunk = missing[i:i + batch_size]
            fetched = fetch_ensembl_batch(chunk)
            cache.update(fetched)
            print(f"  Fetched {len(fetched)}/{len(chunk)} (Total cached: {len(cache):,})")
            time.sleep(0.5)

        # Save updated cache
        with open(ENSEMBL_CACHE_FILE, "w") as f:
            json.dump(cache, f, indent=2)
        print(f"Updated Ensembl cache saved to {ENSEMBL_CACHE_FILE}")

    # 4. Normalize records across every panel file
    total_flipped = 0
    total_palindromic = 0
    total_high_maf = 0

    for fpath in all_files:
        with open(fpath) as f:
            data = json.load(f)

        is_list = isinstance(data, list)
        items = data if is_list else list(data.values())
        file_flipped = 0

        for item in items:
            rs = item.get("rsid", "").lower()
            ens = cache.get(rs)
            alleles = item.get("alleles", [])
            freqs = item.get("frequencies", {})

            # Compute MAF across all available population frequencies
            maf = 0.0
            for k, v in freqs.items():
                if isinstance(v, (int, float)):
                    m = min(float(v), 1.0 - float(v))
                    if m > maf:
                        maf = m

            # If Ensembl record exists, verify forward strand
            if ens and "alleles" in ens:
                ens_alleles = ens["alleles"].upper().split("/")
                ens_set = set(ens_alleles)

                # Determine if palindromic
                is_pal = len(ens_alleles) >= 2 and is_palindromic_alleles(ens_alleles[0], ens_alleles[1])
                if is_pal:
                    item["palindromic"] = True
                    total_palindromic += 1
                    if maf > 0.40:
                        item["maf_flag"] = True
                        item["high_maf"] = True
                        total_high_maf += 1

                # Check if alleles are on minus strand vs Ensembl
                if len(alleles) == 1:
                    a0 = alleles[0].upper()
                    if a0 not in ens_set and complement_base(a0) in ens_set:
                        # Flip to forward (+) strand; frequency stays with physical alleles[0]
                        item["alleles"] = [complement_base(a0)]
                        file_flipped += 1
                        total_flipped += 1
                elif len(alleles) >= 2:
                    a0, a1 = alleles[0].upper(), alleles[1].upper()
                    if not {a0, a1}.issubset(ens_set) and {complement_base(a0), complement_base(a1)}.issubset(ens_set):
                        item["alleles"] = [complement_base(a0), complement_base(a1)]
                        file_flipped += 1
                        total_flipped += 1
            else:
                # Fallback palindromic check from existing alleles
                if len(alleles) >= 2 and is_palindromic_alleles(alleles[0], alleles[1]):
                    item["palindromic"] = True
                    total_palindromic += 1
                    if maf > 0.40:
                        item["maf_flag"] = True
                        item["high_maf"] = True
                        total_high_maf += 1

        with open(fpath, "w") as f:
            json.dump(data, f, indent=2)

        print(f"  {Path(fpath).name}: normalized (flipped {file_flipped} records to forward strand)")

    print(f"\n✅ Total DB Normalization Complete:")
    print(f"   Flipped records to forward strand: {total_flipped}")
    print(f"   Tagged palindromic markers: {total_palindromic}")
    print(f"   Tagged high-MAF (>0.40) palindromic markers: {total_high_maf}")

if __name__ == "__main__":
    main()
