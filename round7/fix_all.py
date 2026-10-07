#!/usr/bin/env python3
"""Round 7 full run: apply fixes per panel. Writes {panel}.fixed.json + {panel}.report.json."""
import json, re, sys, os
from collections import Counter

D = os.path.dirname(os.path.abspath(__file__))  # portable: repo round7/ dir
COMP = {"A": "T", "T": "A", "C": "G", "G": "C"}
POPMAP = {
    "AFR": ["1000GENOMES:phase_3:AFR", "gnomADg:afr"],
    "EAS": ["1000GENOMES:phase_3:EAS", "gnomADg:eas"],
    "EUR": ["1000GENOMES:phase_3:EUR", "gnomADg:nfe"],
    "SAS": ["1000GENOMES:phase_3:SAS", "gnomADg:sas"],
    "MENA": ["gnomADg:mid"],
}
SKIP_POPS = {"AMR", "NAT", "OCE", "SIB", "CAS"}
CONTINENTAL_LABEL = {
    "african": "African Ancestry Marker", "african_american": "African Ancestry Marker",
    "european": "European Ancestry Marker", "east_asian": "East Asian Ancestry Marker",
    "south_asian": "South Asian Ancestry Marker", "central_asian": "Central Asian Ancestry Marker",
    "native_american": "Native American Ancestry Marker", "middle_eastern": "Middle Eastern Ancestry Marker",
    "north_african": "North African Ancestry Marker", "oceanian": "Oceanian Ancestry Marker",
    "global": "Ancestry Informative Marker",
}
# ethnic term -> 1000G population for group-divergence verification
GROUP_TO_POP = {
    'yoruba': '1000GENOMES:phase_3:YRI', 'esan': '1000GENOMES:phase_3:ESN',
    'luhya': '1000GENOMES:phase_3:LWK', 'mende': '1000GENOMES:phase_3:MSL',
    'gambian': '1000GENOMES:phase_3:GWD',
    'finnish': '1000GENOMES:phase_3:FIN', 'tuscan': '1000GENOMES:phase_3:TSI',
    'iberian': '1000GENOMES:phase_3:IBS', 'british': '1000GENOMES:phase_3:GBR',
    'han': '1000GENOMES:phase_3:CHB', 'japanese': '1000GENOMES:phase_3:JPT',
    'dai': '1000GENOMES:phase_3:CDX', 'kinh': '1000GENOMES:phase_3:KHV',
    'gujarati': '1000GENOMES:phase_3:GIH', 'punjabi': '1000GENOMES:phase_3:PJL',
    'bengali': '1000GENOMES:phase_3:BEB', 'telugu': '1000GENOMES:phase_3:ITU',
    'tamil': '1000GENOMES:phase_3:STU',
}
GROUP_CONTINENT = {'yoruba': 'AFR', 'esan': 'AFR', 'luhya': 'AFR', 'mende': 'AFR', 'gambian': 'AFR',
    'finnish': 'EUR', 'tuscan': 'EUR', 'iberian': 'EUR', 'british': 'EUR',
    'han': 'EAS', 'japanese': 'EAS', 'dai': 'EAS', 'kinh': 'EAS',
    'gujarati': 'SAS', 'punjabi': 'SAS', 'bengali': 'SAS', 'telugu': 'SAS', 'tamil': 'SAS'}
ETHNIC_RE = re.compile(r'\b(aboriginal|acholi|adyghe|afar|aimara|akan|algerian|amhara|aztec|baganda|bakongo|balochi|bamileke|bantu|basoga|basque|baule|bedouin|beja|bengali|berber|brahui|british|burkinabe|cameroonian|chadian|chadic|chechen|cherokee|colombian|congolese|coptic|cushitic|dai|dinka|djiboutian|druze|dutch|edo|efik|egyptian|eritrean|esan|ethiopian|ewe|filipino|finnish|fon|french|fulani|ga-adangbe|gabonese|gambian|german|ghanaian|gola|greek|guinean|gujarati|hadza|han|hausa|iberian|ibibio|idoma|igala|igbo|inca|irish|italian|ivorian|japanese|javanese|jola|jordanian|kalenjin|kanuri|khoe|khoisan|kikuyu|kinh|korean|kru|kurdish|lango|leonian|liberian|libyan|limba|luhya|luo|maasai|makrani|malay|malian|mandinka|maori|maya|mbundu|melanesian|mende|mexican|micronesian|moroccan|mossi|navajo|ndebele|nguni|nigerian|nigerien|nilotic|nubian|nuer|nupe|oromo|ovimbundu|palestinian|papuan|pathan|persian|peruvian|pima|polish|polynesian|puerto rican|punjabi|pygmy|quechua|russian|sahelian|samburu|san|sardinian|saudi|scottish|senegambian|serer|sherbro|shona|sierra|sindhi|sinhalese|somali|sotho|sotho-tswana|sudanese|susu|swazi|tamil|telugu|temne|thai|tigray|tigrinya|tiv|tsonga|tswana|tuareg|tunisian|turkana|turkish|tuscan|tutsi|vai|venda|vietnamese|welsh|wolof|xhosa|yemeni|yoruba|zulu)\b', re.I)

def ref_freq(variant, alt, pop_ids):
    pops = variant.get("populations") or []
    by_pop = {}
    for p in pops:
        by_pop.setdefault(p.get("population"), {})[p.get("allele")] = p.get("frequency")
    biallelic = set()
    for m in variant.get("mappings") or []:
        s = m.get("allele_string") or ""
        parts = [x.strip().upper() for x in s.replace("/", ",").split(",") if x.strip()]
        if len(parts) == 2 and all(len(x) == 1 for x in parts):
            biallelic = set(parts)
    for pid in pop_ids:
        d = by_pop.get(pid)
        if not d:
            continue
        if alt in d and isinstance(d[alt], (int, float)):
            return d[alt]
        calt = COMP.get(alt)
        if calt in d and isinstance(d[calt], (int, float)):
            return d[calt]
        if biallelic and alt in biallelic:
            other = (biallelic - {alt}).pop()
            if other in d and isinstance(d[other], (int, float)) and len(d) == 1:
                return 1.0 - d[other]
    return None

def divergence(vec):
    vals = [x for x in vec.values() if isinstance(x, (int, float))]
    return max(vals) - min(vals) if len(vals) >= 2 else 0.0

def fix_panel(name):
    panel = json.load(open(f"{D}/panels/{name}.json"))
    frep = json.load(open(f"{D}/{name}.flags.json"))
    snap = json.load(open(f"{D}/ensembl_ref_snapshot.json"))
    ref = snap["variants"]
    flags = {f["rsid"]: f for f in frep["flags"]}
    clabel = CONTINENTAL_LABEL.get(name, "Ancestry Informative Marker")
    # re-key discovery for no_ref: Ensembl current name differs (merged ID).
    # Primary source: snapshot variant names. Fallback: per-rsID raw files.
    rekeys = {}
    for rs in frep["no_ref"]:
        cur = None
        for key, v in snap["variants"].items():
            if key == rs.lower() and isinstance(v, dict):
                nm = (v.get("name") or "").lower()
                if nm and nm != rs.lower():
                    cur = nm
                break
        if not cur:
            p = f"{D}/ensembl_raw/{rs}.json"
            if os.path.exists(p):
                try:
                    v = json.load(open(p))
                    nm = (v.get("name") or "").lower()
                    if nm and nm != rs.lower():
                        cur = nm
                except Exception:
                    pass
        if cur:
            rekeys[rs] = cur
    fixed, report = {}, {"purged": [], "rekeyed": [], "vector_corrected": [],
                         "label_demoted": [], "contradiction_fixed": [], "unverifiable_freq": []}
    for rs, v in panel.items():
        v = dict(v)
        new_key = rekeys.get(rs, rs)
        if new_key != rs:
            report["rekeyed"].append({"from": rs, "to": new_key})
        alt = (v.get("alleles") or [""])[0].upper()
        variant = ref.get(rs.lower()) or ref.get(new_key)
        f = flags.get(rs)
        severe = f and any("[SEVERE]" in i for i in f["issues"])
        if variant and f:
            new_freqs = dict(v.get("frequencies") or {})
            for pkey in POPMAP:
                rf = ref_freq(variant, alt, POPMAP[pkey])
                if rf is not None:
                    new_freqs[pkey] = round(rf, 4)
            if severe and "AMR" in new_freqs:
                del new_freqs["AMR"]
            v["frequencies"] = new_freqs
            report["vector_corrected"].append(rs)
            checkable = {k: x for k, x in new_freqs.items() if k not in SKIP_POPS and isinstance(x, (int, float))}
            if divergence(checkable) < 0.15:
                report["purged"].append({"rsid": new_key, "reason": "uninformative after correction", "trait": v.get("trait")})
                continue
        elif not variant:
            report["unverifiable_freq"].append(rs)
        # label policy
        trait = str(v.get("trait", ""))
        desc = str(v.get("description", ""))
        m = ETHNIC_RE.search(trait)
        # contradiction: trait and description name different ethnic groups
        tm = set(x.lower() for x in ETHNIC_RE.findall(trait))
        dm = set(x.lower() for x in ETHNIC_RE.findall(desc))
        contra = bool(tm and dm and tm != dm and not (tm & dm))
        if m or contra:
            ethnic = m.group(1).lower() if m else None
            keep = False
            if ethnic in GROUP_TO_POP and variant:
                gf = ref_freq(variant, alt, [GROUP_TO_POP[ethnic]])
                cont = GROUP_CONTINENT.get(ethnic)
                af = ref_freq(variant, alt, POPMAP[cont]) if cont else None
                if gf is not None and af is not None and abs(gf - af) >= 0.25:
                    keep = True
            if not keep:
                old = trait
                v["trait"] = clabel
                v["description"] = (f"Ancestry informative marker. Prior sub-continental label removed: "
                                    f"no group-specific divergence evidence. Prior label: {old}.")
                (report["contradiction_fixed"] if contra else report["label_demoted"]).append(
                    {"rsid": new_key, "was": old})
        fixed[new_key] = v
    # provenance stamp on corrected
    for rs in report["vector_corrected"]:
        key = rekeys.get(rs, rs)
        if key in fixed:
            fixed[key]["frequencySource"] = "Ensembl REST 2026-10-04 (1000G p3 / gnomAD)"
    json.dump(fixed, open(f"{D}/{name}.fixed.json", "w"), indent=1)
    json.dump(report, open(f"{D}/{name}.report.json", "w"), indent=1)
    s = {k: len(v2) for k, v2 in report.items()}
    print(f"{name}: {len(panel)} -> {len(fixed)} | " + " ".join(f"{k}={n}" for k, n in s.items()), flush=True)

if __name__ == "__main__":
    for name in sys.argv[1:]:
        fix_panel(name)
