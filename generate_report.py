import json

DB_PATH = 'src/data/master_health_pgx.json'
AUDIT_PATH = '/home/jequan/.gemini/antigravity/brain/47873f56-a14c-4d4f-92a3-c543f7590994/scratch/audit_results.json'
REPORT_PATH = '/home/jequan/.gemini/antigravity/brain/47873f56-a14c-4d4f-92a3-c543f7590994/clinvar_health_audit.md'

with open(DB_PATH, 'r') as f:
    db = json.load(f)

with open(AUDIT_PATH, 'r') as f:
    audit = json.load(f)

lines = []
lines.append("# ClinVar Health Database Audit & Expansion Report\n")
lines.append("## Overview\n")
lines.append("We automatically queried the NCBI ClinVar API to check the existing health database for clinical consensus and expanded it with additional ACMG and lifestyle traits.\n")

lines.append("## 1. Audit Findings (Existing DB)\n")
lines.append("| RSID | Gene/Trait | DB Impact | ClinVar Significance | ClinVar Review Status |\n")
lines.append("|---|---|---|---|---|\n")

for item in audit:
    rsid = item['rsid']
    gene = item['db_data'].get('name', item['db_data'].get('gene', 'Unknown'))
    impact = item['db_data'].get('impact', 'unknown')
    
    cdata = item['clinvar_data']
    if cdata and len(cdata) > 0:
        sig = cdata[0].get('clinical_significance', 'Unknown')
        rev = cdata[0].get('review_status', 'Unknown')
    else:
        sig = "Not Found"
        rev = "N/A"
        
    lines.append(f"| {rsid} | {gene} | {impact} | {sig} | {rev} |\n")

lines.append("\n## 2. Expansion Findings (New Traits Added)\n")
lines.append("We automatically fetched ClinVar data for these newly added traits:\n")
lines.append("| RSID | Trait/Gene | ClinVar Significance | ClinVar Review Status |\n")
lines.append("|---|---|---|---|\n")

new_rsids = ["rs113993960", "rs1815739", "rs17822931", "rs80357906", "rs34637584", "rs4988235", "rs713598"]

for rsid in new_rsids:
    if rsid in db:
        gene = db[rsid].get('name', 'Unknown')
        sig = db[rsid].get('clinvar_significance', 'Unknown')
        rev = db[rsid].get('clinvar_review_status', 'Unknown')
        lines.append(f"| {rsid} | {gene} | {sig} | {rev} |\n")

with open(REPORT_PATH, 'w') as f:
    f.writelines(lines)
    
print("Report generated.")
