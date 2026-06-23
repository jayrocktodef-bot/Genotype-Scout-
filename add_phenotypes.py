import json

PATH = 'src/data/raw_aims/appearance_traits.json'

new_traits = [
  {
    "rsid": "rs12896399",
    "category": "Eye Color",
    "interpretation": {
      "gene": "SLC24A4",
      "name": "SLC24A4 Eye Color",
      "risk_allele": "T",
      "category": "pigmentation",
      "trait": "Eye Color (Blue vs Brown)",
      "evidence": "strong",
      "GG": "Higher odds of lighter eye color (blue/green)",
      "GT": "Intermediate odds of lighter eye color",
      "TT": "Higher odds of darker eye color (brown/hazel)"
    }
  },
  {
    "rsid": "rs1393350",
    "category": "Eye Color",
    "interpretation": {
      "gene": "TYR",
      "name": "TYR Pigmentation",
      "risk_allele": "A",
      "category": "pigmentation",
      "trait": "Eye/Skin/Hair Color",
      "evidence": "strong",
      "GG": "Lighter eye, hair, and skin pigmentation",
      "GA": "Intermediate pigmentation",
      "AA": "Darker eye, hair, and skin pigmentation"
    }
  },
  {
    "rsid": "rs1015362",
    "category": "Dermatology",
    "interpretation": {
      "gene": "BNC2",
      "name": "Freckling Variant",
      "risk_allele": "T",
      "category": "pigmentation",
      "trait": "Freckles",
      "evidence": "strong",
      "CC": "Lower chance of freckling",
      "CT": "Moderate chance of freckling",
      "TT": "Higher chance of heavy freckling"
    }
  },
  {
    "rsid": "rs10427255",
    "category": "Misc Traits",
    "interpretation": {
      "gene": "ZEB2",
      "name": "Photic Sneeze Reflex",
      "risk_allele": "C",
      "category": "reflexes",
      "trait": "Sun Sneezing",
      "evidence": "moderate",
      "TT": "Typical sneeze reflex",
      "TC": "Slightly increased chance of photic sneezing",
      "CC": "High chance of sneezing when exposed to bright light"
    }
  },
  {
    "rsid": "rs6954203",
    "category": "Dietary",
    "interpretation": {
      "gene": "OR2M7",
      "name": "Asparagus Smell",
      "risk_allele": "G",
      "category": "olfactory",
      "trait": "Asparagus Anosmia",
      "evidence": "moderate",
      "AA": "Can smell asparagus in urine",
      "AG": "Reduced ability to smell asparagus",
      "GG": "Unable to smell asparagus in urine"
    }
  },
  {
    "rsid": "rs72921001",
    "category": "Dietary",
    "interpretation": {
      "gene": "OR6A2",
      "name": "Cilantro Preference",
      "risk_allele": "A",
      "category": "taste",
      "trait": "Cilantro Taste",
      "evidence": "moderate",
      "CC": "Typical cilantro taste",
      "CA": "May perceive a soapy taste in cilantro",
      "AA": "Strongly perceives cilantro as tasting like soap"
    }
  },
  {
    "rsid": "rs4680",
    "category": "Behavioral",
    "interpretation": {
      "gene": "COMT",
      "name": "Warrior vs Worrier",
      "risk_allele": "A",
      "category": "neurological",
      "trait": "Stress & Pain Tolerance",
      "evidence": "moderate",
      "GG": "Warrior: Higher stress tolerance, lower pain tolerance (Val/Val)",
      "GA": "Intermediate stress and pain tolerance (Val/Met)",
      "AA": "Worrier: Lower stress tolerance, higher pain tolerance (Met/Met)"
    }
  },
  {
    "rsid": "rs53576",
    "category": "Behavioral",
    "interpretation": {
      "gene": "OXTR",
      "name": "Oxytocin Receptor",
      "risk_allele": "A",
      "category": "neurological",
      "trait": "Empathy & Social Bonding",
      "evidence": "moderate",
      "GG": "Higher self-reported empathy and sociability",
      "GA": "Intermediate empathy levels",
      "AA": "Less empathetic responding, potentially lower stress resilience"
    }
  },
  {
    "rsid": "rs9939609",
    "category": "Metabolic",
    "interpretation": {
      "gene": "FTO",
      "name": "FTO Obesity Variant",
      "risk_allele": "A",
      "category": "weight",
      "trait": "Weight & Satiety",
      "evidence": "strong",
      "TT": "Typical weight regulation and satiety",
      "TA": "Slightly increased BMI risk and reduced satiety",
      "AA": "Higher risk for increased BMI; may feel less full after meals"
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
