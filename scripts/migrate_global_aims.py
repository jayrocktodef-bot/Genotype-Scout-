import json
import glob
import os

POP_MAP = {
    'AFR': ('African', '#2ECC71'),
    'EUR': ('European', '#3498DB'),
    'EAS': ('East Asian', '#E84B4B'),
    'SAS': ('South Asian', '#F1C40F'),
    'AMR': ('Native American', '#C25C1A'),
    'OCE': ('Oceanian', '#1ABC9C'),
    'MENA': ('Middle Eastern', '#E67E22')
}

def classify_marker(entry):
    freqs = entry.get('frequencies', {})
    valid = {p: freqs[p] for p in POP_MAP if p in freqs and isinstance(freqs[p], (int, float))}
    if len(valid) < 2:
        return ('weakly_informative', entry.get('region', 'Global'), entry.get('color', '#95A5A6'), {}, [])

    vals = list(valid.values())
    spread = max(vals) - min(vals)
    p_bar = sum(vals) / len(vals)
    var_p = sum((p - p_bar) ** 2 for p in vals) / len(vals)
    fst = var_p / (p_bar * (1.0 - p_bar)) if (0.0001 < p_bar < 0.9999) else 0.0

    deviations = {}
    for p, val in valid.items():
        others = [valid[o] for o in valid if o != p]
        other_mean = sum(others) / len(others)
        deviations[p] = val - other_mean

    sorted_devs = sorted(deviations.items(), key=lambda x: abs(x[1]), reverse=True)
    top1_pop, top1_dev = sorted_devs[0]
    top2_pop, top2_dev = sorted_devs[1]
    gap = abs(top1_dev) - abs(top2_dev)

    metric = {
        'delta': round(top1_dev, 4),
        'fst': round(fst, 4),
        'spread': round(spread, 4)
    }

    if abs(top1_dev) >= 0.35 and gap >= 0.10:
        reg_name, color = POP_MAP[top1_pop]
        return ('diagnostic_single_region', reg_name, color, metric, [POP_MAP[top2_pop][0]])
    elif fst >= 0.15 or spread >= 0.35:
        p1 = POP_MAP[top1_pop][0]
        p2 = POP_MAP[top2_pop][0]
        return ('multi_way_informative', 'Multi-Way Informative', '#9B59B6', metric, [p1, p2])
    elif spread < 0.20 and fst < 0.08:
        return ('cosmopolitan', 'Cosmopolitan', '#95A5A6', metric, [])
    else:
        return ('weakly_informative', 'Global', '#95A5A6', metric, [POP_MAP[top1_pop][0]])

def run_migration():
    # Load regional panels
    panels = {}
    for rf in sorted(glob.glob('src/data/aims/*.json')):
        pname = os.path.basename(rf).replace('.json', '')
        if pname != 'global':
            with open(rf) as fp:
                panels[pname] = json.load(fp)

    with open('src/data/master_aims_normalized.json') as fp:
        master = json.load(fp)

    migrated = {}
    stats = {
        'total': len(master),
        'regional_overlap_restored': 0,
        'diagnostic_reclassified': 0,
        'multi_way_annotated': 0,
        'cosmopolitan_annotated': 0,
        'weakly_informative_kept_global': 0,
        'already_regional': 0,
        'breakdown_by_diagnostic_region': {}
    }

    for k, v in master.items():
        entry = dict(v)
        orig_region = entry.get('region', 'Global')

        # Check regional panel overlap
        found_regional = None
        for pname, pdata in panels.items():
            if k in pdata or k.lower() in pdata:
                p_entry = pdata.get(k) or pdata.get(k.lower())
                if p_entry and p_entry.get('region') and p_entry.get('region') != 'Global':
                    found_regional = p_entry
                    break

        if orig_region == 'Global':
            if found_regional:
                entry['region'] = found_regional['region']
                entry['color'] = found_regional.get('color', entry.get('color'))
                entry['legacyRegion'] = 'Global'
                entry['tier'] = 'regional_panel_member'
                if found_regional.get('weight') and found_regional['weight'] > entry.get('weight', 1):
                    entry['weight'] = found_regional['weight']
                if found_regional.get('description'):
                    entry['description'] = found_regional['description']
                stats['regional_overlap_restored'] += 1
            else:
                tier, reg_name, color, metric, sec_regs = classify_marker(entry)
                entry['tier'] = tier
                entry['primaryMetric'] = metric
                entry['legacyRegion'] = 'Global'
                if sec_regs:
                    entry['secondaryRegions'] = sec_regs

                if tier == 'diagnostic_single_region':
                    entry['region'] = reg_name
                    entry['color'] = color
                    if not entry.get('description') or entry.get('description') == '':
                        entry['description'] = f"Ancestry Informative Marker diagnostic for {reg_name} lineage (Δ={metric['delta']:+.2f}, Fst={metric['fst']:.2f})."
                    stats['diagnostic_reclassified'] += 1
                    stats['breakdown_by_diagnostic_region'][reg_name] = stats['breakdown_by_diagnostic_region'].get(reg_name, 0) + 1
                elif tier == 'multi_way_informative':
                    entry['region'] = 'Multi-Way Informative'
                    entry['color'] = '#9B59B6'
                    if not entry.get('description') or entry.get('description') == '':
                        entry['description'] = f"Multi-way Ancestry Informative Marker ({' vs '.join(sec_regs)}, Fst={metric['fst']:.2f}, Δ={metric['spread']:.2f})."
                    stats['multi_way_annotated'] += 1
                elif tier == 'cosmopolitan':
                    entry['region'] = 'Cosmopolitan'
                    entry['color'] = '#95A5A6'
                    if not entry.get('description') or entry.get('description') == '':
                        entry['description'] = "Cosmopolitan pan-human marker with uniform continental allele frequencies."
                    stats['cosmopolitan_annotated'] += 1
                else:
                    entry['region'] = 'Global'
                    entry['color'] = '#95A5A6'
                    stats['weakly_informative_kept_global'] += 1
        else:
            stats['already_regional'] += 1

        migrated[k] = entry

    # Save migrated master file
    with open('src/data/master_aims_normalized.json', 'w') as fp:
        json.dump(migrated, fp, indent=2)

    print("=== MIGRATION COMPLETED SUCCESSFULLY ===")
    print(json.dumps(stats, indent=2))

if __name__ == '__main__':
    run_migration()
