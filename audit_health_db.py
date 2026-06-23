import json
import subprocess
import os
import time

DB_PATH = 'src/data/master_health_pgx.json'
CLINVAR_SCRIPT = '/home/jequan/.gemini/config/plugins/science/skills/clinvar_database/scripts/clinvar_api.py'

def run_uv(args):
    cmd = ['uv', 'run', CLINVAR_SCRIPT] + args
    result = subprocess.run(cmd, capture_output=True, text=True)
    if result.returncode != 0:
        print(f"Error running {' '.join(cmd)}: {result.stderr}")
    return result.returncode == 0

def audit_db():
    with open(DB_PATH, 'r') as f:
        db = json.load(f)
    
    audit_results = []
    
    # Process only the first 58 RSIDs (all of them)
    rsids = list(db.keys())
    
    for i, rsid in enumerate(rsids):
        print(f"[{i+1}/{len(rsids)}] Processing {rsid}...")
        
        # 1. Search
        search_out = f"temp_search_{rsid}.json"
        success = run_uv(['search', '--query', rsid, '--output', search_out])
        
        if not success or not os.path.exists(search_out):
            print(f"Failed to search {rsid}")
            continue
            
        with open(search_out, 'r') as f:
            search_data = json.load(f)
            
        variant_ids = search_data.get('variant_ids', [])
        
        if not variant_ids:
            audit_results.append({
                'rsid': rsid,
                'db_data': db[rsid],
                'clinvar_data': None,
                'status': 'Not found in ClinVar'
            })
            os.remove(search_out)
            continue
            
        # 2. Summary
        summary_out = f"temp_summary_{rsid}.json"
        summary_args = ['summary', '--variant_ids'] + variant_ids + ['--output', summary_out]
        success = run_uv(summary_args)
        
        if not success or not os.path.exists(summary_out):
            print(f"Failed to get summary for {rsid}")
            os.remove(search_out)
            continue
            
        with open(summary_out, 'r') as f:
            summary_data = json.load(f)
            
        audit_results.append({
            'rsid': rsid,
            'db_data': db[rsid],
            'clinvar_data': summary_data,
            'status': 'Found'
        })
        
        # Cleanup temp files
        os.remove(search_out)
        os.remove(summary_out)
        
        # Avoid rate limiting (just in case, NCBI allows 3/sec without API key)
        time.sleep(0.4)
        
    with open('/home/jequan/.gemini/antigravity/brain/47873f56-a14c-4d4f-92a3-c543f7590994/scratch/audit_results.json', 'w') as f:
        json.dump(audit_results, f, indent=2)

if __name__ == '__main__':
    audit_db()
    print("Audit complete! Results saved to scratch/audit_results.json")
