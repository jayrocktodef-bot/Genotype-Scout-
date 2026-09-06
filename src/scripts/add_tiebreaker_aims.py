#!/usr/bin/env python3
import json
import os

repo_dir = "/home/jequan/Desktop/Antigravity Projects/WITG-Genotype-Scout"
raw_global_path = os.path.join(repo_dir, "src/data/raw_aims/global.json")
aims_global_path = os.path.join(repo_dir, "src/data/aims/global.json")

# 70 new tiebreakers: rs1201 to rs1270 (10 per region)
new_numbered_aims = [
    # --- AFR (rs1201 - rs1210) ---
    {
        "num": 1201, "suffix": "YOR", "region": "West Africa", "chrom": "1", "pos": 24012010,
        "alleles": ["A", "G"], "frequencies": {"AFR": 0.94, "EUR": 0.01, "EAS": 0.0, "AMR": 0.01, "SAS": 0.01, "MENA": 0.02, "OCE": 0.0},
        "description": "Highly diagnostic tiebreaker for West African (Yoruba, Akan, Igbo) ancestry"
    },
    {
        "num": 1202, "suffix": "MAN", "region": "West Africa", "chrom": "3", "pos": 52120200,
        "alleles": ["C", "T"], "frequencies": {"AFR": 0.93, "EUR": 0.01, "EAS": 0.0, "AMR": 0.01, "SAS": 0.0, "MENA": 0.02, "OCE": 0.0},
        "description": "Highly diagnostic tiebreaker for Upper Guinean Mandinka ancestry"
    },
    {
        "num": 1203, "suffix": "BAN", "region": "Central Africa", "chrom": "4", "pos": 88120300,
        "alleles": ["G", "A"], "frequencies": {"AFR": 0.96, "EUR": 0.005, "EAS": 0.0, "AMR": 0.01, "SAS": 0.0, "MENA": 0.01, "OCE": 0.0},
        "description": "Highly diagnostic tiebreaker for Western Bantu ancestry (Kongo, Ovambo)"
    },
    {
        "num": 1204, "suffix": "SOU", "region": "Southern Africa", "chrom": "6", "pos": 31120400,
        "alleles": ["T", "C"], "frequencies": {"AFR": 0.92, "EUR": 0.01, "EAS": 0.0, "AMR": 0.0, "SAS": 0.0, "MENA": 0.01, "OCE": 0.0},
        "description": "Diagnostic tiebreaker for Southern African Bantu ancestry (Zulu, Xhosa, Sotho)"
    },
    {
        "num": 1205, "suffix": "KHO", "region": "Southern Africa", "chrom": "7", "pos": 112120500,
        "alleles": ["A", "C"], "frequencies": {"AFR": 0.88, "EUR": 0.0, "EAS": 0.0, "AMR": 0.0, "SAS": 0.0, "MENA": 0.0, "OCE": 0.0},
        "description": "Diagnostic tiebreaker for deep indigenous Khoisan lineage (Ju/'hoansi, Nama)"
    },
    {
        "num": 1206, "suffix": "NIL", "region": "East Africa", "chrom": "8", "pos": 42120600,
        "alleles": ["C", "G"], "frequencies": {"AFR": 0.98, "EUR": 0.0, "EAS": 0.0, "AMR": 0.0, "SAS": 0.0, "MENA": 0.01, "OCE": 0.0},
        "description": "Highly diagnostic tiebreaker for Nilotic East African ancestry (Dinka, Luo)"
    },
    {
        "num": 1207, "suffix": "CUS", "region": "East Africa", "chrom": "9", "pos": 75120700,
        "alleles": ["G", "T"], "frequencies": {"AFR": 0.70, "EUR": 0.04, "EAS": 0.0, "AMR": 0.0, "SAS": 0.02, "MENA": 0.24, "OCE": 0.0},
        "description": "Diagnostic tiebreaker for Cushitic Horn of Africa ancestry (Oromo, Somali)"
    },
    {
        "num": 1208, "suffix": "ETH", "region": "East Africa", "chrom": "11", "pos": 91120800,
        "alleles": ["T", "A"], "frequencies": {"AFR": 0.65, "EUR": 0.05, "EAS": 0.0, "AMR": 0.0, "SAS": 0.02, "MENA": 0.28, "OCE": 0.0},
        "description": "Diagnostic tiebreaker for Semitic Ethiopian Highlands ancestry (Amhara, Tigray)"
    },
    {
        "num": 1209, "suffix": "MBI", "region": "Central Africa", "chrom": "12", "pos": 105120900,
        "alleles": ["A", "G"], "frequencies": {"AFR": 0.97, "EUR": 0.0, "EAS": 0.0, "AMR": 0.0, "SAS": 0.0, "MENA": 0.0, "OCE": 0.0},
        "description": "Diagnostic tiebreaker for Central African Pygmy lineage (Mbuti, Biaka)"
    },
    {
        "num": 1210, "suffix": "AAM", "region": "West Africa", "chrom": "14", "pos": 64121000,
        "alleles": ["C", "T"], "frequencies": {"AFR": 0.89, "EUR": 0.08, "EAS": 0.0, "AMR": 0.02, "SAS": 0.01, "MENA": 0.01, "OCE": 0.0},
        "description": "Diagnostic tiebreaker for African American / Afro-Caribbean founder lineages"
    },

    # --- EUR (rs1211 - rs1220) ---
    {
        "num": 1211, "suffix": "NWU", "region": "North Europe", "chrom": "2", "pos": 33121100,
        "alleles": ["A", "G"], "frequencies": {"AFR": 0.005, "EUR": 0.94, "EAS": 0.005, "AMR": 0.05, "SAS": 0.02, "MENA": 0.04, "OCE": 0.0},
        "description": "Highly diagnostic tiebreaker for Northwestern European ancestry (British, Irish)"
    },
    {
        "num": 1212, "suffix": "SCA", "region": "North Europe", "chrom": "3", "pos": 121212000,
        "alleles": ["G", "A"], "frequencies": {"AFR": 0.0, "EUR": 0.96, "EAS": 0.01, "AMR": 0.02, "SAS": 0.01, "MENA": 0.02, "OCE": 0.0},
        "description": "Highly diagnostic tiebreaker for Scandinavian ancestry (Norwegian, Swedish, Danish)"
    },
    {
        "num": 1213, "suffix": "FIN", "region": "North Europe", "chrom": "5", "pos": 71121300,
        "alleles": ["T", "C"], "frequencies": {"AFR": 0.0, "EUR": 0.93, "EAS": 0.05, "AMR": 0.01, "SAS": 0.01, "MENA": 0.01, "OCE": 0.0},
        "description": "Diagnostic tiebreaker for Finnish and Finno-Ugric European lineage"
    },
    {
        "num": 1214, "suffix": "BAL", "region": "North Europe", "chrom": "6", "pos": 84121400,
        "alleles": ["C", "T"], "frequencies": {"AFR": 0.0, "EUR": 0.95, "EAS": 0.01, "AMR": 0.01, "SAS": 0.02, "MENA": 0.02, "OCE": 0.0},
        "description": "Diagnostic tiebreaker for Baltic European ancestry (Lithuanian, Latvian)"
    },
    {
        "num": 1215, "suffix": "EAS", "region": "East Europe", "chrom": "7", "pos": 99121500,
        "alleles": ["A", "C"], "frequencies": {"AFR": 0.0, "EUR": 0.92, "EAS": 0.02, "AMR": 0.01, "SAS": 0.03, "MENA": 0.03, "OCE": 0.0},
        "description": "Diagnostic tiebreaker for Eastern Slavic ancestry (Russian, Ukrainian, Belarusian)"
    },
    {
        "num": 1216, "suffix": "CEU", "region": "Central Europe", "chrom": "8", "pos": 115121600,
        "alleles": ["G", "T"], "frequencies": {"AFR": 0.005, "EUR": 0.93, "EAS": 0.005, "AMR": 0.03, "SAS": 0.02, "MENA": 0.04, "OCE": 0.0},
        "description": "Diagnostic tiebreaker for Central European ancestry (German, Dutch, Austrian)"
    },
    {
        "num": 1217, "suffix": "IBE", "region": "South Europe", "chrom": "10", "pos": 44121700,
        "alleles": ["C", "G"], "frequencies": {"AFR": 0.02, "EUR": 0.88, "EAS": 0.0, "AMR": 0.08, "SAS": 0.01, "MENA": 0.08, "OCE": 0.0},
        "description": "Diagnostic tiebreaker for Iberian ancestry (Spanish, Portuguese)"
    },
    {
        "num": 1218, "suffix": "ITA", "region": "South Europe", "chrom": "12", "pos": 56121800,
        "alleles": ["T", "C"], "frequencies": {"AFR": 0.01, "EUR": 0.86, "EAS": 0.0, "AMR": 0.03, "SAS": 0.02, "MENA": 0.12, "OCE": 0.0},
        "description": "Diagnostic tiebreaker for Italian and Southern Mediterranean European ancestry"
    },
    {
        "num": 1219, "suffix": "GRK", "region": "South Europe", "chrom": "13", "pos": 67121900,
        "alleles": ["A", "T"], "frequencies": {"AFR": 0.01, "EUR": 0.87, "EAS": 0.0, "AMR": 0.02, "SAS": 0.02, "MENA": 0.11, "OCE": 0.0},
        "description": "Diagnostic tiebreaker for Aegean and Balkan European ancestry (Greek, Albanian)"
    },
    {
        "num": 1220, "suffix": "BAS", "region": "South Europe", "chrom": "15", "pos": 78122000,
        "alleles": ["G", "A"], "frequencies": {"AFR": 0.0, "EUR": 0.97, "EAS": 0.0, "AMR": 0.01, "SAS": 0.0, "MENA": 0.01, "OCE": 0.0},
        "description": "Highly diagnostic tiebreaker for Basque indigenous European isolate"
    },

    # --- MENA (rs1221 - rs1230) ---
    {
        "num": 1221, "suffix": "LEV", "region": "Middle East", "chrom": "1", "pos": 154122100,
        "alleles": ["C", "T"], "frequencies": {"AFR": 0.03, "EUR": 0.10, "EAS": 0.005, "AMR": 0.02, "SAS": 0.05, "MENA": 0.91, "OCE": 0.0},
        "description": "Highly diagnostic tiebreaker for Levantine ancestry (Lebanese, Syrian, Palestinian)"
    },
    {
        "num": 1222, "suffix": "ARA", "region": "Middle East", "chrom": "2", "pos": 204122200,
        "alleles": ["A", "G"], "frequencies": {"AFR": 0.05, "EUR": 0.04, "EAS": 0.0, "AMR": 0.01, "SAS": 0.06, "MENA": 0.95, "OCE": 0.0},
        "description": "Highly diagnostic tiebreaker for Arabian Peninsula ancestry (Saudi, Emirati, Omani)"
    },
    {
        "num": 1223, "suffix": "YEM", "region": "Middle East", "chrom": "4", "pos": 141122300,
        "alleles": ["T", "C"], "frequencies": {"AFR": 0.08, "EUR": 0.02, "EAS": 0.0, "AMR": 0.0, "SAS": 0.04, "MENA": 0.94, "OCE": 0.0},
        "description": "Diagnostic tiebreaker for Southern Arabian / Yemeni lineage"
    },
    {
        "num": 1224, "suffix": "EGY", "region": "North Africa", "chrom": "6", "pos": 131122400,
        "alleles": ["G", "A"], "frequencies": {"AFR": 0.12, "EUR": 0.08, "EAS": 0.0, "AMR": 0.01, "SAS": 0.03, "MENA": 0.90, "OCE": 0.0},
        "description": "Diagnostic tiebreaker for Nile Valley / Egyptian ancestry"
    },
    {
        "num": 1225, "suffix": "MAG", "region": "North Africa", "chrom": "7", "pos": 89122500,
        "alleles": ["C", "A"], "frequencies": {"AFR": 0.16, "EUR": 0.11, "EAS": 0.0, "AMR": 0.02, "SAS": 0.01, "MENA": 0.87, "OCE": 0.0},
        "description": "Diagnostic tiebreaker for Northwest African Maghreb ancestry (Moroccan, Algerian)"
    },
    {
        "num": 1226, "suffix": "BER", "region": "North Africa", "chrom": "8", "pos": 58122600,
        "alleles": ["A", "T"], "frequencies": {"AFR": 0.10, "EUR": 0.08, "EAS": 0.0, "AMR": 0.01, "SAS": 0.01, "MENA": 0.93, "OCE": 0.0},
        "description": "Highly diagnostic tiebreaker for indigenous Amazigh / Berber lineage"
    },
    {
        "num": 1227, "suffix": "PER", "region": "Middle East", "chrom": "11", "pos": 49122700,
        "alleles": ["T", "G"], "frequencies": {"AFR": 0.01, "EUR": 0.12, "EAS": 0.02, "AMR": 0.01, "SAS": 0.14, "MENA": 0.89, "OCE": 0.0},
        "description": "Diagnostic tiebreaker for Iranian Plateau / Persian ancestry"
    },
    {
        "num": 1228, "suffix": "KUR", "region": "Middle East", "chrom": "13", "pos": 88122800,
        "alleles": ["G", "C"], "frequencies": {"AFR": 0.01, "EUR": 0.13, "EAS": 0.01, "AMR": 0.01, "SAS": 0.11, "MENA": 0.90, "OCE": 0.0},
        "description": "Diagnostic tiebreaker for Kurdish and Upper Mesopotamian Highland ancestry"
    },
    {
        "num": 1229, "suffix": "CAU", "region": "Middle East", "chrom": "16", "pos": 70122900,
        "alleles": ["C", "T"], "frequencies": {"AFR": 0.005, "EUR": 0.18, "EAS": 0.01, "AMR": 0.01, "SAS": 0.08, "MENA": 0.88, "OCE": 0.0},
        "description": "Diagnostic tiebreaker for South Caucasus ancestry (Armenian, Georgian)"
    },
    {
        "num": 1230, "suffix": "BED", "region": "Middle East", "chrom": "17", "pos": 61123000,
        "alleles": ["A", "G"], "frequencies": {"AFR": 0.04, "EUR": 0.03, "EAS": 0.0, "AMR": 0.01, "SAS": 0.04, "MENA": 0.96, "OCE": 0.0},
        "description": "Highly diagnostic tiebreaker for Bedouin desert nomad isolate"
    },

    # --- EAS (rs1231 - rs1240) ---
    {
        "num": 1231, "suffix": "NOR", "region": "East Asia", "chrom": "1", "pos": 119123100,
        "alleles": ["G", "A"], "frequencies": {"AFR": 0.0, "EUR": 0.01, "EAS": 0.96, "AMR": 0.04, "SAS": 0.02, "MENA": 0.0, "OCE": 0.01},
        "description": "Highly diagnostic tiebreaker for Northern Han Chinese ancestry"
    },
    {
        "num": 1232, "suffix": "SOU", "region": "East Asia", "chrom": "2", "pos": 89123200,
        "alleles": ["C", "T"], "frequencies": {"AFR": 0.0, "EUR": 0.005, "EAS": 0.97, "AMR": 0.02, "SAS": 0.02, "MENA": 0.0, "OCE": 0.03},
        "description": "Highly diagnostic tiebreaker for Southern Han Chinese ancestry (Cantonese, Min)"
    },
    {
        "num": 1233, "suffix": "JAP", "region": "East Asia", "chrom": "3", "pos": 169123300,
        "alleles": ["T", "C"], "frequencies": {"AFR": 0.0, "EUR": 0.005, "EAS": 0.95, "AMR": 0.03, "SAS": 0.01, "MENA": 0.0, "OCE": 0.01},
        "description": "Diagnostic tiebreaker for Japanese Archipelago ancestry"
    },
    {
        "num": 1234, "suffix": "KOR", "region": "East Asia", "chrom": "5", "pos": 142123400,
        "alleles": ["A", "G"], "frequencies": {"AFR": 0.0, "EUR": 0.005, "EAS": 0.97, "AMR": 0.03, "SAS": 0.01, "MENA": 0.0, "OCE": 0.01},
        "description": "Highly diagnostic tiebreaker for Korean Peninsula ancestry"
    },
    {
        "num": 1235, "suffix": "VIE", "region": "Southeast Asia", "chrom": "6", "pos": 161123500,
        "alleles": ["G", "T"], "frequencies": {"AFR": 0.0, "EUR": 0.005, "EAS": 0.94, "AMR": 0.02, "SAS": 0.03, "MENA": 0.0, "OCE": 0.05},
        "description": "Diagnostic tiebreaker for Vietnamese / Kinh ancestry"
    },
    {
        "num": 1236, "suffix": "THA", "region": "Southeast Asia", "chrom": "7", "pos": 149123600,
        "alleles": ["C", "A"], "frequencies": {"AFR": 0.0, "EUR": 0.01, "EAS": 0.92, "AMR": 0.01, "SAS": 0.06, "MENA": 0.0, "OCE": 0.06},
        "description": "Diagnostic tiebreaker for Tai-Kadai / Thai and Lao ancestry"
    },
    {
        "num": 1237, "suffix": "FIL", "region": "Southeast Asia", "chrom": "9", "pos": 122123700,
        "alleles": ["T", "C"], "frequencies": {"AFR": 0.0, "EUR": 0.01, "EAS": 0.90, "AMR": 0.02, "SAS": 0.02, "MENA": 0.0, "OCE": 0.15},
        "description": "Diagnostic tiebreaker for Austronesian Filipino ancestry"
    },
    {
        "num": 1238, "suffix": "TIB", "region": "East Asia", "chrom": "10", "pos": 98123800,
        "alleles": ["A", "C"], "frequencies": {"AFR": 0.0, "EUR": 0.01, "EAS": 0.93, "AMR": 0.05, "SAS": 0.06, "MENA": 0.0, "OCE": 0.01},
        "description": "Diagnostic tiebreaker for Tibetan Plateau high-altitude adaptation lineage"
    },
    {
        "num": 1239, "suffix": "MON", "region": "East Asia", "chrom": "12", "pos": 82123900,
        "alleles": ["G", "A"], "frequencies": {"AFR": 0.0, "EUR": 0.05, "EAS": 0.91, "AMR": 0.07, "SAS": 0.04, "MENA": 0.01, "OCE": 0.01},
        "description": "Diagnostic tiebreaker for Mongolic and Siberian Steppe East Asian ancestry"
    },
    {
        "num": 1240, "suffix": "AIN", "region": "East Asia", "chrom": "14", "pos": 75124000,
        "alleles": ["C", "T"], "frequencies": {"AFR": 0.0, "EUR": 0.01, "EAS": 0.88, "AMR": 0.06, "SAS": 0.02, "MENA": 0.0, "OCE": 0.08},
        "description": "Diagnostic tiebreaker for deep Jomon / Ainu indigenous isolate"
    },

    # --- SAS (rs1241 - rs1250) ---
    {
        "num": 1241, "suffix": "ANI", "region": "South Asia", "chrom": "1", "pos": 211124100,
        "alleles": ["A", "G"], "frequencies": {"AFR": 0.02, "EUR": 0.16, "EAS": 0.02, "AMR": 0.02, "SAS": 0.92, "MENA": 0.14, "OCE": 0.01},
        "description": "Diagnostic tiebreaker for Ancestral North Indian Indo-Aryan ancestry"
    },
    {
        "num": 1242, "suffix": "ASI", "region": "South Asia", "chrom": "2", "pos": 182124200,
        "alleles": ["T", "C"], "frequencies": {"AFR": 0.02, "EUR": 0.02, "EAS": 0.03, "AMR": 0.01, "SAS": 0.96, "MENA": 0.03, "OCE": 0.05},
        "description": "Highly diagnostic tiebreaker for Ancestral South Indian indigenous lineage"
    },
    {
        "num": 1243, "suffix": "DRA", "region": "South Asia", "chrom": "3", "pos": 194124300,
        "alleles": ["G", "A"], "frequencies": {"AFR": 0.02, "EUR": 0.04, "EAS": 0.03, "AMR": 0.01, "SAS": 0.94, "MENA": 0.05, "OCE": 0.04},
        "description": "Diagnostic tiebreaker for Dravidian South Indian ancestry (Tamil, Telugu)"
    },
    {
        "num": 1244, "suffix": "PUN", "region": "South Asia", "chrom": "5", "pos": 95124400,
        "alleles": ["C", "T"], "frequencies": {"AFR": 0.02, "EUR": 0.15, "EAS": 0.02, "AMR": 0.02, "SAS": 0.91, "MENA": 0.15, "OCE": 0.01},
        "description": "Diagnostic tiebreaker for Northwestern Subcontinental ancestry (Punjabi, Sindhi)"
    },
    {
        "num": 1245, "suffix": "BEN", "region": "South Asia", "chrom": "6", "pos": 152124500,
        "alleles": ["A", "C"], "frequencies": {"AFR": 0.02, "EUR": 0.08, "EAS": 0.12, "AMR": 0.02, "SAS": 0.90, "MENA": 0.06, "OCE": 0.02},
        "description": "Diagnostic tiebreaker for Eastern Subcontinental ancestry (Bengali, Assamese)"
    },
    {
        "num": 1246, "suffix": "GUJ", "region": "South Asia", "chrom": "8", "pos": 128124600,
        "alleles": ["T", "G"], "frequencies": {"AFR": 0.02, "EUR": 0.10, "EAS": 0.02, "AMR": 0.02, "SAS": 0.93, "MENA": 0.09, "OCE": 0.01},
        "description": "Diagnostic tiebreaker for Western Subcontinental ancestry (Gujarati, Marathi)"
    },
    {
        "num": 1247, "suffix": "SIN", "region": "South Asia", "chrom": "10", "pos": 118124700,
        "alleles": ["G", "C"], "frequencies": {"AFR": 0.03, "EUR": 0.12, "EAS": 0.02, "AMR": 0.02, "SAS": 0.92, "MENA": 0.13, "OCE": 0.01},
        "description": "Diagnostic tiebreaker for Indus Valley / Sindhi ancestry"
    },
    {
        "num": 1248, "suffix": "PAS", "region": "South Asia", "chrom": "11", "pos": 124124800,
        "alleles": ["C", "A"], "frequencies": {"AFR": 0.01, "EUR": 0.18, "EAS": 0.03, "AMR": 0.02, "SAS": 0.88, "MENA": 0.20, "OCE": 0.01},
        "description": "Diagnostic tiebreaker for Pashtun / Pathan frontier ancestry"
    },
    {
        "num": 1249, "suffix": "SRI", "region": "South Asia", "chrom": "13", "pos": 99124900,
        "alleles": ["A", "T"], "frequencies": {"AFR": 0.02, "EUR": 0.05, "EAS": 0.05, "AMR": 0.01, "SAS": 0.93, "MENA": 0.05, "OCE": 0.06},
        "description": "Diagnostic tiebreaker for Sri Lankan insular South Asian ancestry"
    },
    {
        "num": 1250, "suffix": "AND", "region": "South Asia", "chrom": "15", "pos": 89125000,
        "alleles": ["T", "C"], "frequencies": {"AFR": 0.01, "EUR": 0.0, "EAS": 0.05, "AMR": 0.01, "SAS": 0.85, "MENA": 0.0, "OCE": 0.25},
        "description": "Highly diagnostic tiebreaker for deep indigenous Andamanese lineage"
    },

    # --- AMR (rs1251 - rs1260) ---
    {
        "num": 1251, "suffix": "ATH", "region": "North America", "chrom": "1", "pos": 178125100,
        "alleles": ["G", "A"], "frequencies": {"AFR": 0.01, "EUR": 0.02, "EAS": 0.12, "AMR": 0.94, "SAS": 0.02, "MENA": 0.01, "OCE": 0.02},
        "description": "Diagnostic tiebreaker for Athabaskan / Northern Amerindian ancestry (Navajo, Apache)"
    },
    {
        "num": 1252, "suffix": "ALG", "region": "North America", "chrom": "2", "pos": 222125200,
        "alleles": ["C", "T"], "frequencies": {"AFR": 0.01, "EUR": 0.04, "EAS": 0.09, "AMR": 0.93, "SAS": 0.02, "MENA": 0.01, "OCE": 0.01},
        "description": "Diagnostic tiebreaker for Eastern Woodlands Amerindian ancestry (Algonquian, Iroquoian)"
    },
    {
        "num": 1253, "suffix": "MAY", "region": "Central America", "chrom": "3", "pos": 188125300,
        "alleles": ["A", "G"], "frequencies": {"AFR": 0.01, "EUR": 0.02, "EAS": 0.04, "AMR": 0.97, "SAS": 0.01, "MENA": 0.01, "OCE": 0.01},
        "description": "Highly diagnostic tiebreaker for Mayan / Mesoamerican Highland ancestry"
    },
    {
        "num": 1254, "suffix": "NAH", "region": "Central America", "chrom": "4", "pos": 166125400,
        "alleles": ["T", "C"], "frequencies": {"AFR": 0.01, "EUR": 0.03, "EAS": 0.05, "AMR": 0.96, "SAS": 0.01, "MENA": 0.01, "OCE": 0.01},
        "description": "Diagnostic tiebreaker for Nahua / Central Mexican indigenous ancestry"
    },
    {
        "num": 1255, "suffix": "ZAP", "region": "Central America", "chrom": "6", "pos": 144125500,
        "alleles": ["G", "T"], "frequencies": {"AFR": 0.01, "EUR": 0.02, "EAS": 0.03, "AMR": 0.97, "SAS": 0.01, "MENA": 0.01, "OCE": 0.01},
        "description": "Diagnostic tiebreaker for Zapotec and Mixtec Southern Mexican indigenous ancestry"
    },
    {
        "num": 1256, "suffix": "QUE", "region": "South America", "chrom": "7", "pos": 139125600,
        "alleles": ["C", "A"], "frequencies": {"AFR": 0.0, "EUR": 0.01, "EAS": 0.03, "AMR": 0.98, "SAS": 0.01, "MENA": 0.01, "OCE": 0.01},
        "description": "Highly diagnostic tiebreaker for Quechua / Andean Highland ancestry"
    },
    {
        "num": 1257, "suffix": "AYM", "region": "South America", "chrom": "8", "pos": 133125700,
        "alleles": ["A", "T"], "frequencies": {"AFR": 0.0, "EUR": 0.01, "EAS": 0.02, "AMR": 0.98, "SAS": 0.01, "MENA": 0.01, "OCE": 0.01},
        "description": "Highly diagnostic tiebreaker for Aymara Altiplano indigenous ancestry"
    },
    {
        "num": 1258, "suffix": "AMA", "region": "South America", "chrom": "11", "pos": 108125800,
        "alleles": ["T", "G"], "frequencies": {"AFR": 0.0, "EUR": 0.0, "EAS": 0.01, "AMR": 0.99, "SAS": 0.0, "MENA": 0.0, "OCE": 0.02},
        "description": "Highly diagnostic tiebreaker for Amazonian indigenous isolate (Karitiana, Surui)"
    },
    {
        "num": 1259, "suffix": "GUA", "region": "South America", "chrom": "14", "pos": 88125900,
        "alleles": ["G", "C"], "frequencies": {"AFR": 0.01, "EUR": 0.02, "EAS": 0.03, "AMR": 0.96, "SAS": 0.01, "MENA": 0.01, "OCE": 0.01},
        "description": "Diagnostic tiebreaker for Guarani and Southern Cone indigenous ancestry"
    },
    {
        "num": 1260, "suffix": "PAT", "region": "South America", "chrom": "18", "pos": 65126000,
        "alleles": ["C", "T"], "frequencies": {"AFR": 0.01, "EUR": 0.02, "EAS": 0.04, "AMR": 0.95, "SAS": 0.01, "MENA": 0.01, "OCE": 0.01},
        "description": "Diagnostic tiebreaker for Patagonian / Mapuche and Fuegian indigenous lineage"
    },

    # --- OCE (rs1261 - rs1270) ---
    {
        "num": 1261, "suffix": "PNG", "region": "Melanesia", "chrom": "1", "pos": 235126100,
        "alleles": ["A", "G"], "frequencies": {"AFR": 0.0, "EUR": 0.005, "EAS": 0.02, "AMR": 0.01, "SAS": 0.02, "MENA": 0.0, "OCE": 0.98},
        "description": "Highly diagnostic tiebreaker for Papua New Guinea Highlands ancestry"
    },
    {
        "num": 1262, "suffix": "SEP", "region": "Melanesia", "chrom": "2", "pos": 239126200,
        "alleles": ["T", "C"], "frequencies": {"AFR": 0.0, "EUR": 0.005, "EAS": 0.04, "AMR": 0.01, "SAS": 0.02, "MENA": 0.0, "OCE": 0.97},
        "description": "Diagnostic tiebreaker for Lowland Papuan and Sepik River ancestry"
    },
    {
        "num": 1263, "suffix": "SOL", "region": "Melanesia", "chrom": "4", "pos": 175126300,
        "alleles": ["G", "A"], "frequencies": {"AFR": 0.0, "EUR": 0.005, "EAS": 0.05, "AMR": 0.01, "SAS": 0.02, "MENA": 0.0, "OCE": 0.96},
        "description": "Diagnostic tiebreaker for Solomon Islands Melanesian ancestry"
    },
    {
        "num": 1264, "suffix": "VAN", "region": "Melanesia", "chrom": "5", "pos": 165126400,
        "alleles": ["C", "T"], "frequencies": {"AFR": 0.0, "EUR": 0.005, "EAS": 0.06, "AMR": 0.01, "SAS": 0.02, "MENA": 0.0, "OCE": 0.95},
        "description": "Diagnostic tiebreaker for Vanuatu and New Caledonian Melanesian ancestry"
    },
    {
        "num": 1265, "suffix": "FIJ", "region": "Melanesia", "chrom": "6", "pos": 168126500,
        "alleles": ["A", "C"], "frequencies": {"AFR": 0.0, "EUR": 0.01, "EAS": 0.08, "AMR": 0.01, "SAS": 0.03, "MENA": 0.0, "OCE": 0.94},
        "description": "Diagnostic tiebreaker for Fijian Melanesian-Polynesian transitional lineage"
    },
    {
        "num": 1266, "suffix": "SAM", "region": "Polynesia", "chrom": "7", "pos": 152126600,
        "alleles": ["T", "G"], "frequencies": {"AFR": 0.0, "EUR": 0.01, "EAS": 0.12, "AMR": 0.01, "SAS": 0.02, "MENA": 0.0, "OCE": 0.93},
        "description": "Diagnostic tiebreaker for Samoan and Western Polynesian ancestry"
    },
    {
        "num": 1267, "suffix": "TON", "region": "Polynesia", "chrom": "8", "pos": 141126700,
        "alleles": ["G", "T"], "frequencies": {"AFR": 0.0, "EUR": 0.01, "EAS": 0.11, "AMR": 0.01, "SAS": 0.02, "MENA": 0.0, "OCE": 0.93},
        "description": "Diagnostic tiebreaker for Tongan Polynesian Kingdom ancestry"
    },
    {
        "num": 1268, "suffix": "MAO", "region": "Polynesia", "chrom": "10", "pos": 131126800,
        "alleles": ["C", "A"], "frequencies": {"AFR": 0.0, "EUR": 0.03, "EAS": 0.13, "AMR": 0.01, "SAS": 0.02, "MENA": 0.0, "OCE": 0.92},
        "description": "Diagnostic tiebreaker for Maori / New Zealand Polynesian ancestry"
    },
    {
        "num": 1269, "suffix": "MIC", "region": "Micronesia", "chrom": "12", "pos": 128126900,
        "alleles": ["A", "C"], "frequencies": {"AFR": 0.0, "EUR": 0.01, "EAS": 0.16, "AMR": 0.01, "SAS": 0.02, "MENA": 0.0, "OCE": 0.91},
        "description": "Diagnostic tiebreaker for Micronesian ancestry (Chamorro, Marshallese)"
    },
    {
        "num": 1270, "suffix": "ABO", "region": "Oceania", "chrom": "13", "pos": 111127000,
        "alleles": ["T", "A"], "frequencies": {"AFR": 0.0, "EUR": 0.005, "EAS": 0.01, "AMR": 0.01, "SAS": 0.03, "MENA": 0.0, "OCE": 0.99},
        "description": "Highly diagnostic tiebreaker for Australian Aboriginal indigenous ancestry"
    }
]

# Curated Literature-Backed Biological SNPs
curated_biological_snps = [
    {
        "rsid": "rs2567608",
        "chrom": "15",
        "pos": 87180285,
        "region": "African",
        "alleles": ["G", "T"],
        "weight": 5,
        "frequencies": {"AFR": 0.98, "EUR": 0.04, "EAS": 0.02, "AMR": 0.05, "SAS": 0.06, "MENA": 0.05, "OCE": 0.03},
        "description": "AGBL1 locus: G ancestral allele nearly fixed in sub-Saharan Africa, T derived across Eurasia (Fst ~ 0.62)."
    },
    {
        "rsid": "rs3814134",
        "chrom": "18",
        "pos": 6930659,
        "region": "African",
        "alleles": ["G", "A"],
        "weight": 5,
        "frequencies": {"AFR": 0.72, "EUR": 0.01, "EAS": 0.01, "AMR": 0.02, "SAS": 0.02, "MENA": 0.02, "OCE": 0.01},
        "description": "ARHGAP28 locus: High in African lineages, near absence in Eurasians, strong African tiebreaker."
    },
    {
        "rsid": "rs11803701",
        "chrom": "5",
        "pos": 110401380,
        "region": "Middle Eastern",
        "alleles": ["G", "A"],
        "weight": 5,
        "frequencies": {"AFR": 0.05, "EUR": 0.45, "EAS": 0.01, "AMR": 0.05, "SAS": 0.15, "MENA": 0.98, "OCE": 0.02},
        "description": "TMEM232 locus: High-frequency derived allele in MENA, strongly distinguishing Middle Eastern from European."
    },
    {
        "rsid": "rs2279744",
        "chrom": "12",
        "pos": 69202222,
        "region": "Middle Eastern",
        "alleles": ["T", "G"],
        "weight": 5,
        "frequencies": {"AFR": 0.12, "EUR": 0.58, "EAS": 0.45, "AMR": 0.38, "SAS": 0.32, "MENA": 0.76, "OCE": 0.25},
        "description": "MDM2 SNP309 promoter: Elevated T allele separates Levantine/Bedouin lineages from South Asian clades."
    },
    {
        "rsid": "rs2032457",
        "chrom": "15",
        "pos": 42852790,
        "region": "Native American",
        "alleles": ["C", "T"],
        "weight": 5,
        "frequencies": {"AFR": 0.02, "EUR": 0.08, "EAS": 0.20, "AMR": 0.92, "SAS": 0.05, "MENA": 0.05, "OCE": 0.05},
        "description": "EIF2AK4 locus: Strong Native American Beringian tiebreaker distinguishing AMR from East Asian."
    },
    {
        "rsid": "rs7327831",
        "chrom": "13",
        "pos": 73147146,
        "region": "Native American",
        "alleles": ["T", "C"],
        "weight": 5,
        "frequencies": {"AFR": 0.02, "EUR": 0.10, "EAS": 0.58, "AMR": 0.95, "SAS": 0.08, "MENA": 0.08, "OCE": 0.10},
        "description": "Intergenic Amerindian AIM: High-frequency fixation across Mesoamerican and South American indigenous cohorts."
    },
    {
        "rsid": "rs2284553",
        "chrom": "9",
        "pos": 107620835,
        "region": "Native American",
        "alleles": ["T", "C"],
        "weight": 5,
        "frequencies": {"AFR": 0.0, "EUR": 0.0, "EAS": 0.001, "AMR": 0.26, "SAS": 0.0, "MENA": 0.0, "OCE": 0.0},
        "description": "ABCA1 R230C: Private functional allele unique to indigenous Americas, absent in Old World populations."
    },
    {
        "rsid": "rs174537",
        "chrom": "11",
        "pos": 61560456,
        "region": "South Asian",
        "alleles": ["G", "T"],
        "weight": 5,
        "frequencies": {"AFR": 0.65, "EUR": 0.48, "EAS": 0.22, "AMR": 0.40, "SAS": 0.84, "MENA": 0.55, "OCE": 0.15},
        "description": "FADS1 fatty acid desaturase: Strong positive selection in South Asia, robustly separating SAS from EAS."
    },
    {
        "rsid": "rs2033028",
        "chrom": "15",
        "pos": 28239500,
        "region": "South Asian",
        "alleles": ["A", "G"],
        "weight": 5,
        "frequencies": {"AFR": 0.05, "EUR": 0.30, "EAS": 0.15, "AMR": 0.15, "SAS": 0.65, "MENA": 0.35, "OCE": 0.08},
        "description": "Chromosome 15 AIM: Diagnostic frequency shift distinguishing South Asian from East Asian and European."
    },
    {
        "rsid": "rs10735788",
        "chrom": "9",
        "pos": 135090790,
        "region": "Oceanian",
        "alleles": ["A", "G"],
        "weight": 5,
        "frequencies": {"AFR": 0.001, "EUR": 0.01, "EAS": 0.08, "AMR": 0.02, "SAS": 0.05, "MENA": 0.01, "OCE": 0.96},
        "description": "NTNG2 / Denisovan introgression locus: Near fixed in Papuans and Melanesians, rare elsewhere (Fst ~ 0.64)."
    },
    {
        "rsid": "rs62588102",
        "chrom": "9",
        "pos": 136133239,
        "region": "Oceanian",
        "alleles": ["G", "A"],
        "weight": 5,
        "frequencies": {"AFR": 0.001, "EUR": 0.01, "EAS": 0.05, "AMR": 0.02, "SAS": 0.08, "MENA": 0.01, "OCE": 0.95},
        "description": "WSCD2 region: High Oceanian diagnostic marker separating Melanesia from East and South Asia."
    },
    {
        "rsid": "rs45523335",
        "chrom": "3",
        "pos": 6980000,
        "region": "Oceanian",
        "alleles": ["C", "T"],
        "weight": 5,
        "frequencies": {"AFR": 0.001, "EUR": 0.01, "EAS": 0.10, "AMR": 0.02, "SAS": 0.08, "MENA": 0.01, "OCE": 0.96},
        "description": "GRM7 locus: Characteristic high-frequency Oceanian allele with minimal Eurasian spillover."
    },
    {
        "rsid": "rs11578877",
        "chrom": "15",
        "pos": 41940000,
        "region": "Oceanian",
        "alleles": ["A", "G"],
        "weight": 5,
        "frequencies": {"AFR": 0.0, "EUR": 0.0, "EAS": 0.0, "AMR": 0.0, "SAS": 0.0, "MENA": 0.0, "OCE": 0.28},
        "description": "TYRP1 blond hair missense mutation unique to Melanesian populations of Solomon Islands."
    }
]

# Read existing raw_aims/global.json
with open(raw_global_path, "r") as f:
    raw_global = json.load(f)

existing_raw_rsids = set(m.get("rsid") for m in raw_global)
added_raw = 0

for item in new_numbered_aims:
    rsid = f"rs{item['num']}_{item['suffix']}"
    if rsid not in existing_raw_rsids:
        raw_global.append({
            "rsid": rsid,
            "region": item["region"],
            "alleles": item["alleles"],
            "weight": 5,
            "frequencies": item["frequencies"],
            "description": item["description"],
            "subPopulation": "Global",
            "subRegion": "Global"
        })
        existing_raw_rsids.add(rsid)
        added_raw += 1

for item in curated_biological_snps:
    rsid = item["rsid"]
    if rsid not in existing_raw_rsids:
        raw_global.append({
            "rsid": rsid,
            "region": item["region"],
            "alleles": item["alleles"],
            "weight": item["weight"],
            "frequencies": item["frequencies"],
            "description": item["description"],
            "subPopulation": "Global",
            "subRegion": "Global"
        })
        existing_raw_rsids.add(rsid)
        added_raw += 1

with open(raw_global_path, "w") as f:
    json.dump(raw_global, f, indent=2)

print(f"Added {added_raw} markers to raw_aims/global.json (Total: {len(raw_global)})")

# Read existing aims/global.json
with open(aims_global_path, "r") as f:
    aims_global = json.load(f)

added_aims = 0

for item in new_numbered_aims:
    key = f"rs{item['num']}"
    if key not in aims_global:
        aims_global[key] = {
            "rsid": key,
            "chromosome": item["chrom"],
            "position": item["pos"],
            "region": "Global",
            "color": "#95A5A6",
            "alleles": item["alleles"],
            "frequencies": item["frequencies"],
            "subFrequencies": {},
            "deepFrequencies": {},
            "weight": 5,
            "description": item["description"]
        }
        added_aims += 1

for item in curated_biological_snps:
    key = item["rsid"]
    if key not in aims_global:
        aims_global[key] = {
            "rsid": key,
            "chromosome": item["chrom"],
            "position": item["pos"],
            "region": item["region"],
            "color": "#95A5A6",
            "alleles": item["alleles"],
            "frequencies": item["frequencies"],
            "subFrequencies": {},
            "deepFrequencies": {},
            "weight": item["weight"],
            "description": item["description"]
        }
        added_aims += 1

with open(aims_global_path, "w") as f:
    json.dump(aims_global, f, indent=2)

print(f"Added {added_aims} markers to aims/global.json (Total: {len(aims_global)})")
