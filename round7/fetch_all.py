#!/usr/bin/env python3
"""Full run: fetch Ensembl pops=1 for union rsIDs. Resumable. 12 parallel."""
import json, os, subprocess, sys

D = "/home/hatch/workspace/aim-audit/round7/full"
RAW = os.path.join(D, "ensembl_raw")
os.makedirs(RAW, exist_ok=True)
need = [l.strip() for l in open(os.path.join(D, "union_need.txt")) if l.strip()]
todo = [r for r in need if not os.path.exists(os.path.join(RAW, r + ".json"))]
print(f"{len(todo)}/{len(need)} to fetch", flush=True)
lst = os.path.join(D, "fetch_list.txt")
open(lst, "w").write("\n".join(todo))
cmd = (f"cat {lst} | xargs -P 12 -I {{}} sh -c '"
       f"for a in 1 2 3; do "
       f"curl -s --max-time 60 \"https://rest.ensembl.org/variation/human/{{}}?pops=1;content-type=application/json\" "
       f"-o {RAW}/{{}}.json && break || sleep 3; done'")
r = subprocess.run(cmd, shell=True, capture_output=True, text=True, timeout=5400)
print("fetch done", r.returncode)
variants = {}
for rs in need:
    p = os.path.join(RAW, rs + ".json")
    try:
        v = json.load(open(p))
        if isinstance(v, dict):
            variants[(v.get("name") or rs).lower()] = v
    except Exception:
        pass
# merge pilot snapshot
pilot = json.load(open("/home/hatch/workspace/aim-audit/round7/ensembl_ref_snapshot.json"))["variants"]
variants.update(pilot)
from datetime import datetime, timezone
out = {"pulled_at": datetime.now(timezone.utc).isoformat(),
       "source": "Ensembl REST variation/human?pops=1 per-variant GET (GRCh38)",
       "variants": variants}
json.dump(out, open(os.path.join(D, "ensembl_ref_snapshot.json"), "w"))
print(f"snapshot: {len(variants)} variants")
