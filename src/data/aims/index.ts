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
// Synthetic placeholder markers (position: 1000000 or dummy GLOBAL frequencies) are filtered out.
const buildCleanAimDatabase = (): Record<string, any> => {
    const combined: Record<string, any> = {};

    // 1. Load authoritative global reference first
    for (const [k, v] of Object.entries(global)) {
        combined[k] = v;
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
            if ((v as any).frequencies && (v as any).frequencies.GLOBAL !== undefined) continue;

            const base = k.toLowerCase().split('_')[0];
            // Do not overwrite existing verified global markers
            if (!combined[k] && !combined[base]) {
                combined[k] = v;
            }
        }
    }

    return combined;
};

export const ALL_REGION_AIMS = buildCleanAimDatabase();
