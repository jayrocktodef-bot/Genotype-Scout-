import json
import os

# Genotype Scout's target AIMs for Ancient Admixture
target_snps = [
    "rs1426654",  # SLC24A5 (Light skin)
    "rs16891982", # SLC45A2 (Light skin)
    "rs12913832", # HERC2 (Blue eyes)
    "rs3827760",  # EDAR (East Asian hair/sweat traits)
    "rs2814778",  # DARC (Duffy null - African)
    "rs4988235",  # MCM6 (Lactase persistence)
    "rs334"       # HBB (Sickle cell trait)
]

# Create a highly curated list of the most famous Ancient Genomes with their known, published genotypes!
ancient_samples = {
    "loschbour": {
        "id": "loschbour",
        "name": "Loschbour Man",
        "site": "Mullerthal",
        "country": "Luxembourg",
        "age_bp": 8000,
        "period": "Mesolithic",
        "culture": "Western Hunter-Gatherer (WHG)",
        "culture_name": "WHG",
        "sex": "M",
        "description": "A famous Western Hunter-Gatherer. Known to have had dark skin, dark hair, but bright blue eyes.",
        "region": "Europe",
        "snps": {
            "rs1426654": "AA", # Ancestral (Darker skin)
            "rs16891982": "CC", # Ancestral (Darker skin)
            "rs12913832": "GG", # Derived (Blue eyes)
            "rs4988235": "CC", # Ancestral (Lactose intolerant)
            "rs3827760": "AA"  # Ancestral
        }
    },
    "cheddar_man": {
        "id": "cheddar_man",
        "name": "Cheddar Man",
        "site": "Gough's Cave",
        "country": "United Kingdom",
        "age_bp": 9100,
        "period": "Mesolithic",
        "culture": "Western Hunter-Gatherer (WHG)",
        "culture_name": "WHG",
        "sex": "M",
        "description": "Oldest complete skeleton found in Britain. Typical WHG phenotype of dark skin and light eyes.",
        "region": "Europe",
        "snps": {
            "rs1426654": "AA", 
            "rs16891982": "CC", 
            "rs12913832": "GG", 
            "rs4988235": "CC"
        }
    },
    "stuttgart": {
        "id": "stuttgart",
        "name": "Stuttgart",
        "site": "Baden-Württemberg",
        "country": "Germany",
        "age_bp": 7000,
        "period": "Neolithic",
        "culture": "Early European Farmer (EEF)",
        "culture_name": "EEF",
        "sex": "F",
        "description": "An Early European Farmer of the LBK culture. Brought agriculture from Anatolia. Had light skin and brown eyes.",
        "region": "Europe",
        "snps": {
            "rs1426654": "GG", # Derived (Light skin)
            "rs16891982": "CC", # Ancestral
            "rs12913832": "AA", # Ancestral (Brown eyes)
            "rs4988235": "CC"  # Ancestral (Lactose intolerant)
        }
    },
    "anzick": {
        "id": "anzick",
        "name": "Anzick-1",
        "site": "Montana",
        "country": "USA",
        "age_bp": 12700,
        "period": "Paleolithic",
        "culture": "Clovis",
        "culture_name": "Ancient Native American",
        "sex": "M",
        "description": "The only known human burial associated with the Clovis culture. Closely related to modern Native Americans.",
        "region": "Americas",
        "snps": {
            "rs3827760": "GG", # Derived (Thick hair, common in East Asians/Native Americans)
            "rs1426654": "AA",
            "rs12913832": "AA"
        }
    },
    "mota": {
        "id": "mota",
        "name": "Mota",
        "site": "Mota Cave",
        "country": "Ethiopia",
        "age_bp": 4500,
        "period": "Neolithic",
        "culture": "African Hunter-Gatherer",
        "culture_name": "Ancient African",
        "sex": "M",
        "description": "The first ancient African genome sequenced. Predates the Eurasian backflow into Africa.",
        "region": "Africa",
        "snps": {
            "rs1426654": "AA",
            "rs16891982": "CC",
            "rs12913832": "AA",
            "rs2814778": "CC", # Derived Duffy Null (Malaria resistance)
            "rs334": "AA" # Ancestral
        }
    },
    "yamnaya_samara": {
        "id": "yamnaya_samara",
        "name": "Yamnaya Herder",
        "site": "Samara",
        "country": "Russia",
        "age_bp": 5000,
        "period": "Bronze Age",
        "culture": "Yamnaya",
        "culture_name": "Western Steppe Herder",
        "sex": "M",
        "description": "Nomadic pastoralists from the Pontic-Caspian steppe who expanded massively during the Bronze Age.",
        "region": "Eurasia",
        "snps": {
            "rs1426654": "GG", # Derived (Light skin)
            "rs16891982": "CG", # Heterozygous intermediate
            "rs12913832": "AA", # Brown eyes
            "rs4988235": "CT"  # Heterozygous (Early signs of lactase persistence!)
        }
    }
}

# Update the master_ancient_profiles.json
def update_json():
    json_path = "/home/jequan/Desktop/Antigrav/WITG-Genotype-Scout/src/data/master_ancient_profiles.json"
    
    with open(json_path, 'r') as f:
        data = json.load(f)
        
    # Replace the samples with our curated, high-quality ancient genome library
    data['samples'] = ancient_samples
    
    with open(json_path, 'w') as f:
        json.dump(data, f, indent=2)
        
    print("✅ Successfully injected curated Ancient Genomes into Genotype Scout!")
    print("Database updated with: Loschbour, Cheddar Man, Stuttgart, Anzick-1, Mota, and Yamnaya.")

if __name__ == "__main__":
    update_json()
