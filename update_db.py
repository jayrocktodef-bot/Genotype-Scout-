import json
import os
import subprocess
import time

DB_PATH = 'src/data/master_health_pgx.json'
AUDIT_PATH = '/home/jequan/.gemini/antigravity/brain/47873f56-a14c-4d4f-92a3-c543f7590994/scratch/audit_results.json'
CLINVAR_SCRIPT = '/home/jequan/.gemini/config/plugins/science/skills/clinvar_database/scripts/clinvar_api.py'

NEW_TRAITS = {
  "rs113993960": {
    "gene": "CFTR",
    "name": "Cystic Fibrosis (deltaF508)",
    "description": "Most common Cystic Fibrosis causing variant",
    "risk_allele": "DEL",
    "impact": "high",
    "_group": "carrier_status"
  },
  "rs1815739": {
    "gene": "ACTN3",
    "name": "Muscle Performance (R577X)",
    "description": "Associated with fast-twitch muscle fiber composition",
    "risk_allele": "T",
    "impact": "low",
    "_group": "traits"
  },
  "rs17822931": {
    "gene": "ABCC11",
    "name": "Earwax and Body Odor Type",
    "description": "Determines wet vs dry earwax and body odor production",
    "risk_allele": "A",
    "impact": "low",
    "_group": "traits"
  },
  "rs80357906": {
    "gene": "BRCA1",
    "name": "Breast Cancer Risk",
    "description": "Pathogenic variant in BRCA1 associated with breast and ovarian cancer",
    "risk_allele": "T",
    "impact": "high",
    "_group": "cancer_risk"
  },
  "rs34637584": {
    "gene": "LRRK2",
    "name": "Parkinson's Disease (G2019S)",
    "description": "Most common genetic variant associated with Parkinson's disease",
    "risk_allele": "A",
    "impact": "high",
    "_group": "neurological"
  },
  "rs4988235": {
    "gene": "MCM6",
    "name": "Lactose Intolerance",
    "description": "Determines lactase persistence (ability to digest dairy) in adulthood",
    "risk_allele": "C",
    "impact": "moderate",
    "_group": "traits"
  },
  "rs713598": {
    "gene": "TAS2R38",
    "name": "Bitter Taste Perception",
    "description": "Ability to taste bitter compounds like PTC/PROP",
    "risk_allele": "G",
    "impact": "low",
    "_group": "traits"
  }
}

def run_uv(args):
    cmd = ['uv', 'run', CLINVAR_SCRIPT] + args
    result = subprocess.run(cmd, capture_output=True, text=True)
    return result.returncode == 0

def fetch_clinvar_for_rsid(rsid):
    search_out = f"temp_search_{rsid}.json"
    success = run_uv(['search', '--query', rsid, '--output', search_out])
    
    clinvar_data = None
    if success and os.path.exists(search_out):
        with open(search_out, 'r') as f:
            search_data = json.load(f)
        variant_ids = search_data.get('variant_ids', [])
        
        if variant_ids:
            summary_out = f"temp_summary_{rsid}.json"
            success = run_uv(['summary', '--variant_ids'] + variant_ids + ['--output', summary_out])
            if success and os.path.exists(summary_out):
                with open(summary_out, 'r') as f:
                    clinvar_data = json.load(f)
                os.remove(summary_out)
        os.remove(search_out)
    return clinvar_data

def update():
    with open(DB_PATH, 'r') as f:
        db = json.load(f)
        
    with open(AUDIT_PATH, 'r') as f:
        audit = json.load(f)
        
    for item in audit:
        rsid = item['rsid']
        cdata = item['clinvar_data']
        if cdata and len(cdata) > 0:
            top = cdata[0]
            db[rsid]['clinvar_significance'] = top.get('clinical_significance', 'Unknown')
            db[rsid]['clinvar_review_status'] = top.get('review_status', 'Unknown')
            db[rsid]['clinvar_phenotypes'] = top.get('phenotypes', [])
            
    # Add new traits
    for rsid, trait_data in NEW_TRAITS.items():
        print(f"Adding new trait {rsid}...")
        cdata = fetch_clinvar_for_rsid(rsid)
        if cdata and len(cdata) > 0:
            top = cdata[0]
            trait_data['clinvar_significance'] = top.get('clinical_significance', 'Unknown')
            trait_data['clinvar_review_status'] = top.get('review_status', 'Unknown')
            trait_data['clinvar_phenotypes'] = top.get('phenotypes', [])
        else:
            trait_data['clinvar_significance'] = 'Not found'
        
        db[rsid] = trait_data
        time.sleep(0.5)

    with open(DB_PATH, 'w') as f:
        json.dump(db, f, indent=2)
        
    print(f"Successfully updated database. Added {len(NEW_TRAITS)} new traits. Total traits: {len(db)}")

if __name__ == '__main__':
    update()
