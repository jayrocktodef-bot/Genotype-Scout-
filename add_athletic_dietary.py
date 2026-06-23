import json

PATH = 'src/data/raw_aims/appearance_traits.json'

new_traits = [
  # --- ATHLETIC TRAITS ---
  {
    "rsid": "rs8192678",
    "category": "Athletic",
    "interpretation": {
      "gene": "PPARGC1A",
      "name": "Aerobic Capacity",
      "risk_allele": "A",
      "category": "fitness",
      "trait": "Endurance vs Power",
      "evidence": "moderate",
      "GG": "Higher baseline aerobic capacity and endurance response",
      "GA": "Intermediate aerobic response",
      "AA": "Lower baseline aerobic capacity, potential advantage in power sports"
    }
  },
  {
    "rsid": "rs12722",
    "category": "Athletic",
    "interpretation": {
      "gene": "COL5A1",
      "name": "Tendon Flexibility & Injury",
      "risk_allele": "T",
      "category": "fitness",
      "trait": "Ligament Flexibility",
      "evidence": "moderate",
      "CC": "More flexible tendons, potentially higher endurance efficiency",
      "CT": "Average tendon flexibility",
      "TT": "Stiffer tendons, advantageous for jumping/sprinting but slightly higher injury risk"
    }
  },
  {
    "rsid": "rs699",
    "category": "Athletic",
    "interpretation": {
      "gene": "AGT",
      "name": "Power Sports Performance",
      "risk_allele": "G",
      "category": "fitness",
      "trait": "Power vs Endurance",
      "evidence": "moderate",
      "AA": "Better suited for endurance sports",
      "AG": "Balanced power and endurance",
      "GG": "Strongly associated with power and strength-based sports"
    }
  },
  # --- DIETARY TRAITS ---
  {
    "rsid": "rs838133",
    "category": "Dietary",
    "interpretation": {
      "gene": "FGF21",
      "name": "Sweet Tooth Variant",
      "risk_allele": "A",
      "category": "taste",
      "trait": "Sugar Preference",
      "evidence": "moderate",
      "GG": "Typical sugar consumption",
      "GA": "Slightly increased preference for sweet foods",
      "AA": "High likelihood of having a 'sweet tooth' and increased sugar intake"
    }
  },
  {
    "rsid": "rs2282679",
    "category": "Dietary",
    "interpretation": {
      "gene": "GC",
      "name": "Vitamin D Binding",
      "risk_allele": "C",
      "category": "vitamins",
      "trait": "Vitamin D Levels",
      "evidence": "strong",
      "AA": "Typical baseline Vitamin D levels",
      "AC": "Slightly lower baseline Vitamin D levels",
      "CC": "Significantly lower baseline Vitamin D levels, higher risk of deficiency"
    }
  },
  {
    "rsid": "rs601338",
    "category": "Dietary",
    "interpretation": {
      "gene": "FUT2",
      "name": "B12 Absorption (Non-Secretor)",
      "risk_allele": "A",
      "category": "vitamins",
      "trait": "Vitamin B12 Levels",
      "evidence": "strong",
      "GG": "Secretor: Lower baseline Vitamin B12 levels",
      "GA": "Secretor: Intermediate Vitamin B12 levels",
      "AA": "Non-Secretor: Higher baseline Vitamin B12 levels (protection against deficiency)"
    }
  },
  {
    "rsid": "rs174546",
    "category": "Dietary",
    "interpretation": {
      "gene": "FADS1",
      "name": "Omega-3/6 Processing",
      "risk_allele": "T",
      "category": "metabolism",
      "trait": "Fatty Acid Conversion",
      "evidence": "strong",
      "CC": "Efficient converter of plant-based Omega-3s (ALA) to EPA/DHA",
      "CT": "Moderate converter of plant-based Omega-3s",
      "TT": "Poor converter; may require direct EPA/DHA supplements (e.g., fish oil)"
    }
  },
  {
    "rsid": "rs5082",
    "category": "Dietary",
    "interpretation": {
      "gene": "APOA2",
      "name": "Saturated Fat Sensitivity",
      "risk_allele": "C",
      "category": "metabolism",
      "trait": "Weight response to Saturated Fat",
      "evidence": "strong",
      "TT": "Typical weight response to saturated fats",
      "TC": "Typical weight response to saturated fats",
      "CC": "High sensitivity; high saturated fat diet strongly linked to increased BMI"
    }
  }
]

def add_phenotypes():
    with open(PATH, 'r') as f:
        data = json.load(f)
        
    existing_rsids = {item['rsid'] for item in data}
    
    added_count = 0
    for trait in new_traits:
        if trait['rsid'] not in existing_rsids:
            data.append(trait)
            added_count += 1
            
    with open(PATH, 'w') as f:
        json.dump(data, f, indent=2)
        
    print(f"Successfully added {added_count} new phenotypes to appearance_traits.json.")

if __name__ == '__main__':
    add_phenotypes()
