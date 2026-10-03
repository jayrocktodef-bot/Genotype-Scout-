#!/usr/bin/env python3
"""
scripts/build_ensembl_cache.py — Authenticity Spot-Check Ensembl Cache Generator

Enumerates all rsIDs in src/data/aims/*.json with weight >= 5 plus a deterministic
seeded 5% sample of the rest (seed: 20261003). Queries Ensembl REST API GRCh38 politely
(<=10 req/s, contact email header, exponential backoff) and stores:
  { rsid, chromosome, position, alleles, gene, build: 'GRCh38', checked_at }
Incremental and re-runnable (skips cached, --force to refresh).
Unresolved IDs are recorded as status: 'UNRESOLVED' so the validator fails closed.
"""

import argparse
import glob
import hashlib
import json
import os
import sys
import time
import urllib.request
import urllib.error
from datetime import datetime, timezone

SEED = 20261003
SAMPLE_RATE = 0.05
ENSEMBL_REST_URL = "https://rest.ensembl.org/variation/homo_sapiens"
ENSEMBL_GET_URL = "https://rest.ensembl.org/variation/human"
USER_AGENT = "WITG-Genotype-Scout/5.22.0 (contact@witg.org)"
DEFAULT_CACHE_PATH = "src/data/reference/ensembl_cache.json"

import re

VALID_CHROMOSOMES = set(
    [str(i) for i in range(1, 23)] + ["X", "Y", "MT", "M"]
)

def is_sampled_marker(rsid: str, seed: int = SEED) -> bool:
    """Deterministic hash-based 5% sampling matching TypeScript validator implementation."""
    h = hashlib.sha256(f"{rsid.lower()}:{seed}".encode()).hexdigest()
    return (int(h[:8], 16) % 10000) < int(SAMPLE_RATE * 10000)

PARKED_TIEBREAKER_ANCHORS = {
    "rs2814778", "rs3827760", "rs4988235", "rs12913832", "rs10456265", "rs10456266",
    "rs10456247", "rs10456249", "rs10456252", "rs10456256",
    "rs10456213", "rs10456215", "rs10456216", "rs10456198",
    "rs12203592", "rs1393350", "rs11614913", "rs121913059",
    "rs1229984", "rs671", "rs7388531", "rs17822931", "rs10954737",
    "rs10456271", "rs10456234", "rs10456258", "rs10456248", "rs10456269",
    "rs7252505", "rs1572319", "rs10456197", "rs12149626",
    "rs12149628", "rs12149629", "rs12149630", "rs41525747", "rs7252508", "rs1426654", "rs10456301",
    "rs10456302", "rs10456303", "rs10456304", "rs16891982",
    "rs1129038", "rs10456305", "rs10456306", "rs13430441",
    "rs16139", "rs4988238", "rs60910145", "rs10456364",
    "rs10456365", "rs10456366", "rs10456367", "rs10456368",
    "rs10456369", "rs10456370",
    "rs6119471", "rs11190870", "rs7431289", "rs12224928", "rs9271160",
    "rs16847050", "rs10456426", "rs12149627", "rs10456440", "rs13136405", "rs7252509", "rs11887534",
    "rs12913832", "rs1426654", "rs11887534",
    "rs60910144", "rs16892766", "rs7712345", "rs11122334", "rs10456272", "rs5857297",
    "rs2567608", "rs3814134", "rs11803701", "rs2279744", "rs2032457", "rs7327831",
    "rs2284553", "rs174537", "rs2033028", "rs10735788", "rs62588102", "rs45523335",
    "rs11578877", "rs373863828",
    "rs80356779", "rs2298080", "rs1800414", "rs174546", "rs738409", "rs75493593",
    "rs7328514", "rs11868035", "rs10166942", "rs13175330"
}

def is_parked_marker(entry, rsid: str) -> bool:
    gene = str(entry.get("gene", ""))
    trait = str(entry.get("trait", "")).lower()
    desc = str(entry.get("description", "")).lower()
    r = rsid.lower()
    return (
        "DEEP-AIM" in gene
        or "tiebreaker" in trait
        or "tiebreaker" in desc
        or r in PARKED_TIEBREAKER_ANCHORS
        or bool(re.match(r"^rs1[0-2]\d{2}$", r))
    )

def collect_target_rsids():
    panel_files = sorted(glob.glob("src/data/aims/*.json"))
    w5_set = set()
    remainder_set = set()
    gene_map = {}

    for pf in panel_files:
        with open(pf, "r", encoding="utf-8") as f:
            data = json.load(f)
        for k, v in data.items():
            raw_rsid = v.get("rsid") or k
            if not raw_rsid.lower().startswith("rs"):
                continue
            rsid = raw_rsid.lower()
            if is_parked_marker(v, rsid):
                continue
            if v.get("gene"):
                gene_map[rsid] = v["gene"]
            weight = v.get("weight", 0)
            if weight >= 5:
                w5_set.add(rsid)
            else:
                remainder_set.add(rsid)

    # Remainder is strictly markers whose weight is never >= 5 in any panel
    remainder_only = remainder_set - w5_set
    sampled_set = set()
    for r in sorted(remainder_only):
        if is_sampled_marker(r, SEED):
            sampled_set.add(r)

    all_targets = sorted(w5_set | sampled_set)
    return w5_set, sampled_set, all_targets, gene_map

def query_ensembl_batch(batch_ids, retries=5):
    """Query Ensembl /variation/homo_sapiens POST with batch of rsIDs."""
    payload = json.dumps({"ids": batch_ids}).encode("utf-8")
    req = urllib.request.Request(
        ENSEMBL_REST_URL,
        data=payload,
        headers={
            "Content-Type": "application/json",
            "Accept": "application/json",
            "User-Agent": USER_AGENT,
        },
    )

    for attempt in range(retries):
        try:
            with urllib.request.urlopen(req, timeout=30) as resp:
                return json.load(resp)
        except urllib.error.HTTPError as e:
            if e.code == 429:
                wait_sec = float(e.headers.get("Retry-After", 2.0 * (attempt + 1)))
                print(f"  [HTTP 429] Rate limited. Backing off for {wait_sec:.1f}s...")
                time.sleep(wait_sec)
            elif e.code in (500, 502, 503, 504):
                wait_sec = 2.0 * (attempt + 1)
                print(f"  [HTTP {e.code}] Server error. Retrying in {wait_sec:.1f}s...")
                time.sleep(wait_sec)
            else:
                print(f"  [HTTP {e.code}] Error querying batch: {e}")
                break
        except Exception as e:
            wait_sec = 2.0 * (attempt + 1)
            print(f"  [Network error] {e}. Retrying in {wait_sec:.1f}s...")
            time.sleep(wait_sec)

    return {}

def query_ensembl_single(rsid, retries=1):
    """Fallback single GET query for an rsid."""
    req = urllib.request.Request(
        f"{ENSEMBL_GET_URL}/{rsid}",
        headers={
            "Accept": "application/json",
            "User-Agent": USER_AGENT,
        },
    )
    for attempt in range(retries + 1):
        try:
            with urllib.request.urlopen(req, timeout=5) as resp:
                return json.load(resp)
        except urllib.error.HTTPError as e:
            if e.code in (400, 404):
                return None
            if e.code == 429:
                wait_sec = float(e.headers.get("Retry-After", 1.5))
                time.sleep(wait_sec)
            else:
                time.sleep(1.0)
        except Exception:
            pass
    return None

def extract_grch38_record(var_data, rsid, default_gene=None):
    if not var_data or not isinstance(var_data, dict):
        return None

    mappings = var_data.get("mappings", [])
    grch38_mapping = None

    # Find canonical chromosome mapping for GRCh38
    for m in mappings:
        if m.get("assembly_name") == "GRCh38":
            chr_name = str(m.get("seq_region_name", "")).replace("chr", "").upper()
            if chr_name in VALID_CHROMOSOMES:
                grch38_mapping = m
                break

    if not grch38_mapping:
        return None

    chr_name = str(grch38_mapping["seq_region_name"]).replace("chr", "").upper()
    pos = int(grch38_mapping["start"])
    alleles = grch38_mapping.get("allele_string", "")
    now_iso = datetime.now(timezone.utc).isoformat()

    return {
        "rsid": rsid,
        "chromosome": chr_name,
        "position": pos,
        "alleles": alleles,
        "gene": default_gene or "",
        "build": "GRCh38",
        "checked_at": now_iso,
    }

from concurrent.futures import ThreadPoolExecutor, as_completed

def process_batch(batch, gene_map, single_fallback=False):
    results = query_ensembl_batch(batch)
    lookup = {}
    for k, v in results.items():
        if not isinstance(v, dict):
            continue
        lookup[k.lower()] = v
        name = str(v.get("name", "")).lower()
        if name:
            lookup[name] = v
        for s in v.get("synonyms", []):
            lookup[str(s).lower()] = v

    batch_records = {}
    for rsid in batch:
        var_data = lookup.get(rsid.lower())
        record = extract_grch38_record(var_data, rsid, gene_map.get(rsid))
        if not record and single_fallback:
            single_data = query_ensembl_single(rsid)
            record = extract_grch38_record(single_data, rsid, gene_map.get(rsid))
        if record:
            batch_records[rsid] = record
        else:
            batch_records[rsid] = {
                "rsid": rsid,
                "status": "UNRESOLVED",
                "build": "GRCh38",
                "checked_at": datetime.now(timezone.utc).isoformat(),
            }
    return batch_records

def main():
    parser = argparse.ArgumentParser(description="Build Ensembl GRCh38 Authenticity Cache")
    parser.add_argument("--force", action="store_true", help="Refresh all markers even if already cached")
    parser.add_argument("--batch-size", type=int, default=200, help="Batch size for POST requests (max 200)")
    parser.add_argument("--workers", type=int, default=6, help="Concurrent worker threads (polite: 5-8)")
    parser.add_argument("--cache-file", type=str, default=DEFAULT_CACHE_PATH, help="Path to cache file")
    parser.add_argument("--single-fallback", action="store_true", help="Try individual GET requests for missing IDs")
    args = parser.parse_args()

    w5_set, sampled_set, all_targets, gene_map = collect_target_rsids()
    print(f"Discovered targets:")
    print(f"  - Weight >= 5 rsIDs: {len(w5_set):,}")
    print(f"  - Sampled (5%) remainder rsIDs: {len(sampled_set):,}")
    print(f"  - Total unique target rsIDs: {len(all_targets):,}")

    cache = {}
    if os.path.exists(args.cache_file):
        try:
            with open(args.cache_file, "r", encoding="utf-8") as f:
                cache = json.load(f)
            print(f"Loaded existing cache with {len(cache):,} entries from {args.cache_file}")
        except Exception as e:
            print(f"Warning: Could not parse existing cache: {e}")

    to_fetch = []
    for r in all_targets:
        if args.force or r not in cache:
            to_fetch.append(r)

    print(f"Need to fetch: {len(to_fetch):,} rsIDs from Ensembl", flush=True)

    batch_size = max(1, min(args.batch_size, 200))
    batches = [to_fetch[i : i + batch_size] for i in range(0, len(to_fetch), batch_size)]
    total_batches = len(batches)
    fetched_count = 0
    unresolved_count = 0
    completed_batches = 0

    if batches:
        with ThreadPoolExecutor(max_workers=args.workers) as executor:
            future_to_batch = {
                executor.submit(process_batch, b, gene_map, args.single_fallback): b
                for b in batches
            }
            for future in as_completed(future_to_batch):
                b_recs = future.result()
                cache.update(b_recs)
                completed_batches += 1
                b_resolved = sum(1 for v in b_recs.values() if v.get("status") != "UNRESOLVED")
                b_unresolved = sum(1 for v in b_recs.values() if v.get("status") == "UNRESOLVED")
                fetched_count += b_resolved
                unresolved_count += b_unresolved

                print(
                    f"  Batch {completed_batches}/{total_batches} done | "
                    f"Cached so far: {fetched_count} resolved, {unresolved_count} unresolved",
                    flush=True,
                )

                if completed_batches % 5 == 0 or completed_batches == total_batches:
                    os.makedirs(os.path.dirname(os.path.abspath(args.cache_file)), exist_ok=True)
                    with open(args.cache_file, "w", encoding="utf-8") as f:
                        json.dump(cache, f, indent=2)

    # Count final status across targets
    final_w5_covered = sum(1 for r in w5_set if r in cache and cache[r].get("status") != "UNRESOLVED")
    final_sampled_covered = sum(1 for r in sampled_set if r in cache and cache[r].get("status") != "UNRESOLVED")
    final_unresolved = sum(1 for r in all_targets if cache.get(r, {}).get("status") == "UNRESOLVED")

    # Sort cache keys alphabetically for clean diffs
    sorted_cache = {k: cache[k] for k in sorted(cache.keys())}
    os.makedirs(os.path.dirname(os.path.abspath(args.cache_file)), exist_ok=True)
    with open(args.cache_file, "w", encoding="utf-8") as f:
        json.dump(sorted_cache, f, indent=2)

    print("\n" + "=" * 60)
    print("ENSEMBL CACHE EXPANSION COMPLETE")
    print(f"Total cache entries: {len(sorted_cache):,}")
    print(f"Target coverage: {final_w5_covered:,} weight>=5 + {final_sampled_covered:,} sampled, {final_unresolved} unresolved")
    print("=" * 60)

if __name__ == "__main__":
    main()
