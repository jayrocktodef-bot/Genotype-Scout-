/**
 * healthWorker.ts
 * Dedicated Web Worker for heavy genomic health and trait evaluations.
 */
import { analyzeHealthProfile } from '../engines/health/comprehensiveHealthEngine';
import { extractPlinkGenotype } from '../utils/plinkUtils';

self.onmessage = async (event: MessageEvent) => {
    try {
        const { type, payload } = event.data;
        let snpMap: Record<string, string> = {};

        if (type === 'ANALYZE_HEALTH') {
            const { userSnps } = payload;
            if (!userSnps || typeof userSnps !== 'object') {
                throw new Error("Invalid DNA data provided to worker");
            }
            snpMap = userSnps;
        } else if (type === 'PLINK_ANALYZE_HEALTH') {
            const { bedBuffer, bimEntries, targetRsIds } = payload;

            // Build fast lookup for .bim
            const bimLookup = new Map<string, number>();
            bimEntries.forEach((entry: any, index: number) => {
                bimLookup.set(entry.rsid, index);
            });
    
            // Extract targeted SNPs
            targetRsIds.forEach((rsid: string) => {
                const rowIdx = bimLookup.get(rsid);
                if (rowIdx !== undefined) {
                    snpMap[rsid] = extractPlinkGenotype(bedBuffer, rowIdx);
                }
            });
        } else {
            // Optional: handle unknown message types
            return;
        }

        // Common analysis and result posting logic
        const results = analyzeHealthProfile(snpMap);
        self.postMessage({
            type: 'HEALTH_RESULTS',
            payload: results
        });

    } catch (error: any) {
        self.postMessage({
            type: 'ERROR',
            payload: error.message
        });
    }
};

export {};
