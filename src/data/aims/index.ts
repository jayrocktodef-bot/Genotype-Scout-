import african from './african.json';
import africanAmerican from './african_american.json';
import centralAsian from './central_asian.json';
import eastAsian from './east_asian.json';
import european from './european.json';
import global from './global.json';
import middleEastern from './middle_eastern.json';
import nativeAmerican from './native_american.json';
import northAfrican from './north_african.json';
import oceanian from './oceanian.json';
import southAsian from './south_asian.json';

// Build ALL_REGION_AIMS with verified global.json as foundational authority.
// Regional panels only augment unique markers and cannot overwrite global reference entries.
const POP_METRICS: Record<string, { name: string, color: string }> = {
    AFR: { name: 'African', color: '#2ECC71' },
    EUR: { name: 'European', color: '#3498DB' },
    EAS: { name: 'East Asian', color: '#E84B4B' },
    SAS: { name: 'South Asian', color: '#F1C40F' },
    AMR: { name: 'Native American', color: '#C25C1A' },
    OCE: { name: 'Oceanian', color: '#1ABC9C' },
    MENA: { name: 'Middle Eastern', color: '#E67E22' }
};

function classifyGlobalMarker(entry: any) {
    const freqs = entry.frequencies || {};
    const validKeys = Object.keys(POP_METRICS).filter(p => typeof freqs[p] === 'number');
    if (validKeys.length < 2) return;

    const vals = validKeys.map(p => freqs[p] as number);
    const spread = Math.max(...vals) - Math.min(...vals);
    const pBar = vals.reduce((a, b) => a + b, 0) / vals.length;
    const varP = vals.reduce((sum, p) => sum + (p - pBar) ** 2, 0) / vals.length;
    const fst = (pBar > 0.0001 && pBar < 0.9999) ? varP / (pBar * (1.0 - pBar)) : 0;

    const deviations = validKeys.map(p => {
        const others = validKeys.filter(o => o !== p).map(o => freqs[o] as number);
        const otherMean = others.reduce((a, b) => a + b, 0) / others.length;
        return { pop: p, dev: (freqs[p] as number) - otherMean, absDev: Math.abs((freqs[p] as number) - otherMean) };
    });

    deviations.sort((a, b) => b.absDev - a.absDev);
    const top1 = deviations[0];
    const top2 = deviations[1];
    const gap = top1.absDev - top2.absDev;

    entry.primaryMetric = {
        delta: Math.round(top1.dev * 10000) / 10000,
        fst: Math.round(fst * 10000) / 10000,
        spread: Math.round(spread * 10000) / 10000
    };
    entry.legacyRegion = 'Global';

    if (top1.absDev >= 0.35 && gap >= 0.10) {
        const targetMeta = POP_METRICS[top1.pop];
        entry.tier = 'diagnostic_single_region';
        entry.region = targetMeta.name;
        entry.color = targetMeta.color;
        entry.secondaryRegions = [POP_METRICS[top2.pop].name];
        if (!entry.description) {
            entry.description = `Ancestry Informative Marker diagnostic for ${targetMeta.name} lineage (Δ=${top1.dev > 0 ? '+' : ''}${top1.dev.toFixed(2)}, Fst=${fst.toFixed(2)}).`;
        }
    } else if (fst >= 0.15 || spread >= 0.35) {
        entry.tier = 'multi_way_informative';
        entry.region = 'Multi-Way Informative';
        entry.color = '#9B59B6';
        entry.secondaryRegions = [POP_METRICS[top1.pop].name, POP_METRICS[top2.pop].name];
    } else if (spread < 0.20 && fst < 0.08) {
        entry.tier = 'cosmopolitan';
        entry.region = 'Cosmopolitan';
        entry.color = '#95A5A6';
    } else {
        entry.tier = 'weakly_informative';
    }
}

// Build ALL_REGION_AIMS with metric-driven classification and regional panel enrichment.
const buildCleanAimDatabase = (): Record<string, any> => {
    const combined: Record<string, any> = {};

    // 1. Load authoritative reference and classify global markers by population genetics metrics
    for (const [k, v] of Object.entries(global)) {
        const entry = { ...(v as any) };
        if (entry.region === 'Global' || !entry.region) {
            classifyGlobalMarker(entry);
        }
        combined[k] = entry;
    }

    // 2. Augment with genuine unique regional panel markers
    const regionalPanels = [
        african,
        africanAmerican,
        centralAsian,
        eastAsian,
        european,
        middleEastern,
        nativeAmerican,
        northAfrican,
        oceanian,
        southAsian
    ];

    for (const panel of regionalPanels) {
        for (const [k, v] of Object.entries(panel as Record<string, any>)) {
            // Skip synthetic/padding markers
            if ((v as any).position === 1000000) continue;
            const freqs = (v as any).frequencies || {};
            const nonGlobalKeys = Object.keys(freqs).filter(f => f !== 'GLOBAL');
            if (nonGlobalKeys.length === 0 && freqs.GLOBAL !== undefined) continue;

            const base = k.toLowerCase().split('_')[0];
            const target = combined[k] || combined[base];
            if (!target) {
                combined[k] = { ...(v as any) };
            } else {
                // Enrich existing marker with regional frequencies, subfrequencies and annotations
                const panelEntry = v as any;
                if (panelEntry.frequencies) {
                    target.frequencies = {
                        ...panelEntry.frequencies,
                        ...(target.frequencies || {})
                    };
                }
                if (panelEntry.subFrequencies && Object.keys(panelEntry.subFrequencies).length > 0) {
                    target.subFrequencies = {
                        ...(target.subFrequencies || {}),
                        ...panelEntry.subFrequencies
                    };
                }
                if (panelEntry.deepFrequencies && Object.keys(panelEntry.deepFrequencies).length > 0) {
                    target.deepFrequencies = {
                        ...(target.deepFrequencies || {}),
                        ...panelEntry.deepFrequencies
                    };
                }

                // Provenance Protection: Determine whether the incoming panel entry is a generic stub
                const hasSubFreqs = panelEntry.subFrequencies && Object.keys(panelEntry.subFrequencies).length > 0;
                const hasDeepFreqs = panelEntry.deepFrequencies && Object.keys(panelEntry.deepFrequencies).length > 0;
                const desc = (panelEntry.description || '').toLowerCase();
                const isGenericDesc = desc.includes('informative marker with verified regional') && 
                                      !desc.includes('woodlands') && !desc.includes('indigenous') && 
                                      !desc.includes('sahelian') && !desc.includes('senegambian');
                const isPanelStub = !hasSubFreqs && !hasDeepFreqs && isGenericDesc && (panelEntry.trait === 'Ancestry' || !panelEntry.trait);
                const isTargetDiagnostic = target.tier === 'diagnostic_single_region';

                // Region Resolution: Never allow a generic stub or secondary panel to clobber an empirical diagnostic region
                if (panelEntry.region && panelEntry.region !== 'Global' && !isPanelStub) {
                    if (panelEntry.region === 'Native American' && !isTargetDiagnostic) {
                        // Curated Native American panel markers take precedence unless target is an empirical single-region diagnostic for another continent
                        target.region = panelEntry.region;
                        if (panelEntry.color) target.color = panelEntry.color;
                    } else if (!target.region || target.region === 'Global' || target.region === 'Cosmopolitan' || 
                        target.region === 'weakly_informative' || target.region === 'Multi-Way Informative') {
                        target.region = panelEntry.region;
                        if (panelEntry.color) target.color = panelEntry.color;
                    } else if (!isTargetDiagnostic && (panelEntry.weight || 0) > (target.weight || 0)) {
                        target.region = panelEntry.region;
                        if (panelEntry.color) target.color = panelEntry.color;
                    }
                }

                if (panelEntry.weight && (!target.weight || panelEntry.weight > target.weight)) {
                    target.weight = panelEntry.weight;
                }
                if (panelEntry.gene && (!target.gene || target.gene === 'Unknown' || target.gene === 'Intergenic')) {
                    target.gene = panelEntry.gene;
                }
                if (panelEntry.trait && (!target.trait || target.trait === 'Ancestry')) {
                    target.trait = panelEntry.trait;
                }
                if (panelEntry.description && (!target.description || target.description.includes('informative marker with verified regional'))) {
                    target.description = panelEntry.description;
                }
            }
        }
    }

    // 3. Final Lineage Semantic Consistency Audit
    // Ensures no marker description directly contradicts its assigned ancestral region
    for (const entry of Object.values(combined)) {
        const text = `${entry.trait || ''} ${entry.description || ''}`.toLowerCase();
        if (text.includes('sahelian') || text.includes('senegambian') || text.includes('mandinka') || 
            text.includes('wolof') || text.includes('fula') || text.includes('bantu') || 
            text.includes('yoruba') || text.includes('khoe-san') || text.includes('nilotic') || text.includes('pygmy')) {
            if (entry.region !== 'African') {
                entry.region = 'African';
                entry.color = '#2ECC71';
            }
        } else if (text.includes('ashkenazi') || text.includes('sephardic') || text.includes('levantine') || text.includes('arabian')) {
            if (entry.region === 'Global' || entry.region === 'European') {
                entry.region = 'Middle Eastern';
                entry.color = '#E67E22';
            }
        } else if (text.includes('melanesian') || text.includes('papuan') || text.includes('polynesian')) {
            if (entry.region !== 'Oceanian') {
                entry.region = 'Oceanian';
                entry.color = '#1ABC9C';
            }
        }
    }

    return combined;
};

export const ALL_REGION_AIMS = buildCleanAimDatabase();
