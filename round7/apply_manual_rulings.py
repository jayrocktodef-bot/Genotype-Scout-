#!/usr/bin/env python3
"""Round 7: apply Jequan's rulings on the manual_review list from the
judgment-call post-pass. Reads round7/panels/judgment_calls.report.json,
applies the rulings below to panels/*.json in place, and appends a
"rulings_applied" section to the report.

Ruling principle (Jequan, 2026-10-07): a trait label must not outrun the
measured data. For each manual_review entry (div > 0.5, peak != panel):

- Generic "Ancestry Informative Marker": no claim made -> KEEP.
- True-trait markers (pigmentation / immune / neanderthal / height): the trait
  describes real biology, not a contradicted ancestry -> KEEP.
- Named groups are checked against their known ancestral components:
    Ashkenazi  -> {EUR, MENA}      Afrikaner   -> {EUR, AFR}
    Cape Verdean -> {AFR, EUR}      Khmer       -> {EAS}
    Chamorro    -> {OCE}            Iranian     -> {MENA}
    Aymara      -> {AMR}            Acadian     -> {EUR}
    Maghreb     -> {NAFR, MENA}
  Peak inside components -> KEEP (plausible; super-pop data cannot adjudicate
  admixed groups further). Peak outside all components -> RELABEL to the
  measured peak continental label (the original label was likely wrong).
- "Caucasian": outdated term, always relabel to the measured peak.

Usage: python3 apply_manual_rulings.py <panels_dir>
"""
import json, os, re, sys
from collections import Counter

PANELS_DIR = sys.argv[1] if len(sys.argv) > 1 else os.path.join(
    os.path.dirname(os.path.abspath(__file__)), "panels")

CONT_LABEL = {"AFR": "African", "EUR": "European", "EAS": "East Asian",
              "SAS": "South Asian", "MENA": "Middle Eastern", "OCE": "Oceanian",
              "AMR": "Native American", "CAS": "Central Asian",
              "NAFR": "North African"}

COMPONENTS = {
    "ashkenazi": {"EUR", "MENA"},
    "afrikaner": {"EUR", "AFR"},
    "cape verdean": {"AFR", "EUR"},
    "khmer": {"EAS"},
    "chamorro": {"OCE"},
    "iranian": {"MENA"},
    "aymara": {"AMR"},
    "acadian": {"EUR"},
    "maghreb": {"NAFR", "MENA"},
}
ALWAYS_RELABEL = {"caucasian"}  # outdated terminology
TRUE_TRAIT = ("pigmentation", "immune", "neanderthal", "height")

report_path = os.path.join(PANELS_DIR, "judgment_calls.report.json")
report = json.load(open(report_path))
manual = report.get("manual_review", [])

panels = {}
for fn in os.listdir(PANELS_DIR):
    if fn.endswith(".json") and fn != "judgment_calls.report.json":
        fp = os.path.join(PANELS_DIR, fn)
        panels[fn[:-5]] = (fp, json.load(open(fp)))

applied, kept = [], []
for item in manual:
    rs, panel, peak = item["rsid"], item["panel"], item["peak"]
    if panel not in panels or rs not in panels[panel][1]:
        continue
    v = panels[panel][1][rs]
    trait = v.get("trait") or ""
    tl = trait.lower()

    # 1. generic label: no claim -> keep
    if tl.strip() == "ancestry informative marker":
        kept.append({**item, "ruling": "keep: generic label, no claim"})
        continue
    # 2. true-trait markers: keep
    if any(k in tl for k in TRUE_TRAIT):
        kept.append({**item, "ruling": "keep: true biological trait"})
        continue
    # 3. named groups
    group = next((g for g in list(COMPONENTS) + list(ALWAYS_RELABEL)
                  if re.search(r"\b" + re.escape(g) + r"\b", tl)), None)
    if group is None:
        kept.append({**item, "ruling": "keep: unrecognized label, needs human"})
        continue
    if group in ALWAYS_RELABEL or peak not in COMPONENTS[group]:
        new_trait = f"{CONT_LABEL[peak]} Ancestry Marker"
        applied.append({"rsid": rs, "panel": panel, "peak": peak,
                        "div": item["div"], "old_trait": trait,
                        "new_trait": new_trait,
                        "reason": "peak outside group's ancestral components"})
        v["trait"] = new_trait
    else:
        kept.append({**item, "ruling": f"keep: peak {peak} within {group} components"})

for name, (fp, data) in panels.items():
    json.dump(data, open(fp, "w"))

report["rulings_applied"] = applied
report["rulings_kept"] = kept
report["summary"]["rulings_applied"] = len(applied)
report["summary"]["rulings_kept"] = len(kept)
json.dump(report, open(report_path, "w"), indent=1)

print(f"rulings applied (relabel): {len(applied)}, kept: {len(kept)}")
print("relabel by panel:", dict(Counter(r["panel"] for r in applied)))
print("relabel groups:", dict(Counter(r["old_trait"] for r in applied)))
