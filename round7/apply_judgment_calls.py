#!/usr/bin/env python3
"""Round 7 follow-up: apply the two judgment calls deterministically.

Call 1 (no false claims): markers with UNAMBIGUOUS divergence (div > 0.5) whose
trait names an ancestry contradicting the measured peak continent get relabeled
to the peak ancestry, preserving the rest of the trait string
(e.g. "Bambara Ancestry Marker" peaking SAS -> "South Asian Ancestry Marker";
"African Pigmentation Marker" peaking EAS -> "East Asian Pigmentation Marker").
No markers are moved between panels: with honest vectors, contrast markers are
legitimate panel members (large frequency differences in either direction inform
ancestry inference). Generic "Ancestry" traits make no false claim and are left
alone. Admixed-ethnicity labels (Ashkenazi, Afrikaner, ...) are skipped for
manual review.

Call 2 (no false confidence): weight is capped by measured max divergence, using
the same divergence definition as the Round 7 purge rule. Only demotions, never
promotions. Pure health/trait markers (no "ancestry" in trait) are skipped: their
weights encode biological importance, not ancestry informativeness, and flat
vectors are expected for them.

Markers below the purge floor (div < 0.15) that survived Round 7 are REPORTED,
not auto-purged (ancestry-trait only).

Usage: python3 apply_judgment_calls.py <panels_dir>
  Operates in place on <panels_dir>/*.json; writes judgment_calls.report.json.
  Run AFTER compare_all.py/fix_all.py on all panels, BEFORE validation.
"""
import json, os, re, sys, glob
from collections import Counter

PANELS_DIR = sys.argv[1] if len(sys.argv) > 1 else os.path.join(
    os.path.dirname(os.path.abspath(__file__)), "panels")

PANEL_CONT = {
    "african": "AFR", "african_american": "AFR", "european": "EUR",
    "middle_eastern": "MENA", "north_african": "NAFR", "oceanian": "OCE",
    "south_asian": "SAS", "central_asian": "CAS", "east_asian": "EAS",
    "native_american": "AMR", "global": "GLOBAL", "master": "MASTER",
}
CONT_LABEL = {"AFR": "African", "EUR": "European", "EAS": "East Asian",
              "SAS": "South Asian", "MENA": "Middle Eastern", "OCE": "Oceanian",
              "AMR": "Native American", "CAS": "Central Asian",
              "NAFR": "North African"}

# Ethnicity keyword -> continent. High-confidence only; admixed groups
# (Ashkenazi, Afrikaner, Cape Verdean, Malagasy, ...) are deliberately absent
# and fall through to manual review.
ETH = {
    'bambara': 'AFR', 'bamoun': 'AFR', 'songhai': 'AFR', 'khoikhoi': 'AFR',
    'bassa': 'AFR', 'kpelle': 'AFR', 'loma': 'AFR', 'bemba': 'AFR',
    'tigrayan': 'AFR', 'mandinka': 'AFR', 'yoruba': 'AFR', 'nigerian': 'AFR',
    'esan': 'AFR', 'gambian': 'AFR', 'mende': 'AFR', 'igbo': 'AFR',
    'bantu': 'AFR', 'biaka': 'AFR', 'mbuti': 'AFR', 'sandawe': 'AFR',
    'hadza': 'AFR', 'oromo': 'AFR', 'saharawi': 'AFR', 'mozabite': 'AFR',
    'dan': 'AFR', 'san': 'AFR', 'baluba': 'AFR', 'makua': 'AFR', 'fante': 'AFR',
    'akan': 'AFR', 'wolof': 'AFR', 'fulani': 'AFR', 'hausa': 'AFR', 'zulu': 'AFR',
    'xhosa': 'AFR', 'shona': 'AFR', 'kikuyu': 'AFR', 'lugbara': 'AFR',
    'english': 'EUR', 'spanish': 'EUR', 'sami': 'EUR', 'french': 'EUR',
    'italian': 'EUR', 'german': 'EUR', 'irish': 'EUR', 'british': 'EUR',
    'finnish': 'EUR', 'basque': 'EUR', 'sardinian': 'EUR', 'orcadian': 'EUR',
    'han': 'EAS', 'chinese': 'EAS', 'japanese': 'EAS', 'dai': 'EAS',
    'kinh': 'EAS', 'lao': 'EAS', 'tu': 'EAS', 'she': 'EAS', 'miaozu': 'EAS',
    'gujarati': 'SAS', 'punjabi': 'SAS', 'bengali': 'SAS', 'telugu': 'SAS',
    'tamil': 'SAS', 'sindhi': 'SAS', 'baloch': 'SAS', 'pashtun': 'SAS',
    'brahui': 'SAS', 'makrani': 'SAS',
    'arabian': 'MENA', 'levantine': 'MENA', 'bedouin': 'MENA', 'druze': 'MENA',
    'palestinian': 'MENA', 'anatolian': 'MENA', 'armenian': 'MENA',
    'azeri': 'MENA',
    'papuan': 'OCE', 'hawaiian': 'OCE', 'samoan': 'OCE', 'melanesian': 'OCE',
    'bougainville': 'OCE',
    'incan': 'AMR', 'quechua': 'AMR', 'pima': 'AMR', 'karitiana': 'AMR',
    'surui': 'AMR', 'mayan': 'AMR', 'colombian': 'AMR',
}

RELABEL_DIV_THRESHOLD = 0.5  # only unambiguous peaks trigger relabels

def weight_cap(div):
    if div < 0.15: return 0
    if div < 0.30: return 4
    if div < 0.50: return 6
    if div < 0.70: return 8
    return 10

def divergence(freqs):
    vals = [x for x in freqs.values() if isinstance(x, (int, float))]
    return max(vals) - min(vals) if vals else 0.0

def peak_continent(freqs):
    nums = {k: x for k, x in freqs.items() if isinstance(x, (int, float))}
    return max(nums, key=nums.get) if nums else None

def is_ancestry_marker(v):
    return "ancestry" in (v.get("trait") or "").lower()

def claimed_ancestry(trait):
    """Return (continent, matched_text) named by the trait, or (None, None)."""
    tl = trait.lower()
    for cont, label in CONT_LABEL.items():
        m = re.search(r'\b' + re.escape(label.lower()) + r'\b', tl)
        if m:
            return cont, m.group(0)
    for kw, cont in ETH.items():
        m = re.search(r'\b' + re.escape(kw) + r'\b', tl)
        if m:
            return cont, m.group(0)
    return None, None

panels = {}
for fp in sorted(glob.glob(os.path.join(PANELS_DIR, "*.json"))):
    name = os.path.basename(fp)[:-5]
    if name == "judgment_calls.report":
        continue
    panels[name] = (fp, json.load(open(fp)))

relabels, demoted, purge_misses, manual_review = [], [], [], []

for name, (fp, data) in panels.items():
    home = PANEL_CONT.get(name)
    for rs, v in data.items():
        freqs = {k: x for k, x in (v.get("frequencies") or {}).items()
                 if isinstance(x, (int, float))}
        if not freqs:
            continue
        peak = peak_continent(freqs)
        div = divergence(freqs)
        trait = v.get("trait") or ""

        # ---- Call 1: relabel false ancestry claims ----
        if (div > RELABEL_DIV_THRESHOLD and peak in CONT_LABEL
                and home is not None and peak != home and is_ancestry_marker(v)):
            claimed, matched = claimed_ancestry(trait)
            if claimed is not None and claimed != peak:
                new_trait = re.sub(re.escape(matched), CONT_LABEL[peak], trait,
                                   count=1, flags=re.IGNORECASE)
                # fix odd capitalization from substitution if needed
                relabels.append({"rsid": rs, "panel": name, "peak": peak,
                                 "div": round(div, 3), "old_trait": trait,
                                 "new_trait": new_trait})
                v["trait"] = new_trait
            elif claimed is None and trait.strip().lower() != "ancestry":
                manual_review.append({"rsid": rs, "panel": name, "peak": peak,
                                      "div": round(div, 3), "trait": trait[:60],
                                      "reason": "unmapped ethnicity label"})

        # ---- Call 2: weight demotion (ancestry markers only) ----
        if not is_ancestry_marker(v):
            continue
        w = v.get("weight")
        if not isinstance(w, (int, float)):
            continue
        cap = weight_cap(div)
        if cap == 0:
            purge_misses.append({"rsid": rs, "panel": name,
                                 "div": round(div, 3), "weight": w,
                                 "trait": trait[:60]})
        elif w > cap:
            demoted.append({"rsid": rs, "panel": name, "div": round(div, 3),
                            "old_weight": w, "new_weight": cap,
                            "trait": trait[:60]})
            v["weight"] = cap

for name, (fp, data) in panels.items():
    json.dump(data, open(fp, "w"))

report = {
    "relabels": relabels,
    "weight_demoted": demoted,
    "purge_misses": purge_misses,
    "manual_review": manual_review,
    "summary": {
        "relabels": len(relabels),
        "weights_demoted": len(demoted),
        "purge_misses": len(purge_misses),
        "manual_review": len(manual_review),
    },
}
json.dump(report, open(os.path.join(PANELS_DIR, "judgment_calls.report.json"), "w"),
          indent=1)
print(f"relabels={len(relabels)} demoted={len(demoted)} "
      f"purge_misses={len(purge_misses)} manual_review={len(manual_review)}")
print("relabels by panel:", dict(Counter(r["panel"] for r in relabels)))
print("demotions by panel:", dict(Counter(d["panel"] for d in demoted)))
