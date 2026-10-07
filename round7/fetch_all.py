#!/usr/bin/env python3
import json, os, time
from concurrent.futures import ThreadPoolExecutor
import urllib.request
import urllib.error

D = os.path.dirname(os.path.abspath(__file__))
RAW = os.path.join(D, "ensembl_raw")
os.makedirs(RAW, exist_ok=True)
need = [l.strip() for l in open(os.path.join(D, "union_need.txt")) if l.strip()]
todo = [r for r in need if not os.path.exists(os.path.join(RAW, r + ".json"))]
print(f"{len(todo)}/{len(need)} to fetch", flush=True)

def fetch_rsid(rs):
    url = f"https://rest.ensembl.org/variation/human/{rs}?pops=1;content-type=application/json"
    req = urllib.request.Request(url)
    req.add_header("Content-Type", "application/json")
    for attempt in range(3):
        try:
            with urllib.request.urlopen(req, timeout=60) as response:
                data = response.read()
                with open(os.path.join(RAW, rs + ".json"), "wb") as f:
                    f.write(data)
                return True
        except urllib.error.HTTPError as e:
            if e.code == 429:
                time.sleep(int(e.headers.get("Retry-After", 1)))
            else:
                time.sleep(3)
        except Exception:
            time.sleep(3)
    return False

start_time = time.time()
with ThreadPoolExecutor(max_workers=15) as ex:
    list(ex.map(fetch_rsid, todo))

print(f"fetch done in {time.time() - start_time:.1f}s")

variants = {}
for rs in need:
    p = os.path.join(RAW, rs + ".json")
    try:
        v = json.load(open(p))
        if isinstance(v, dict):
            variants[(v.get("name") or rs).lower()] = v
    except Exception:
        pass

pilot_path = os.path.join(D, "ensembl_ref_snapshot.json")
if os.path.exists(pilot_path):
    pilot = json.load(open(pilot_path))["variants"]
    variants.update(pilot)

from datetime import datetime, timezone
out = {"pulled_at": datetime.now(timezone.utc).isoformat(),
       "source": "Ensembl REST variation/human?pops=1 per-variant GET (GRCh38)",
       "variants": variants}
json.dump(out, open(pilot_path, "w"))
print(f"snapshot: {len(variants)} variants")
