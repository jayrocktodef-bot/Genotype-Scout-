import json
import math

with open('src/data/aims/native_american.json', 'r') as f:
    na_data = json.load(f)

with open('src/data/aims/european.json', 'r') as f:
    eu_data = json.load(f)

# Find samples
pima_maya = [s for s, v in na_data.get('samples', {}).items() if v.get('culture') in ['Pima', 'Maya']]
surui_kar = [s for s, v in na_data.get('samples', {}).items() if v.get('culture') in ['Surui', 'Karitiana']]
eur_samples = [s for s, v in eu_data.get('samples', {}).items()]

print(f"Pima/Maya: {len(pima_maya)}")
print(f"Surui/Kar: {len(surui_kar)}")
print(f"EUR: {len(eur_samples)}")
