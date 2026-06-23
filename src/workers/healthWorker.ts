/**
 * healthWorker.ts
 * Dedicated Web Worker for heavy genomic health and trait evaluations.
 */
import { analyzeHealthProfile } from '../engines/health/comprehensiveHealthEngine';
import { extractPlinkGenotype } from '../utils/plinkUtils';

self.onmessage = async (event: MessageEvent) => {
    const { type, payload } = event.data;

    if (type === 'ANALYZE_HEALTH') {
        try {
            const { userSnps } = payload;
            if (!userSnps || typeof userSnps !== 'object') {
                throw new Error("Invalid DNA data provided to worker");
            }

            // Execute the comprehensive analysis
            const results = analyzeHealthProfile(userSnps);

            // Send results back to main thread
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
    } else if (type === 'PLINK_ANALYZE_HEALTH') {
        try {
            const { bedBuffer, bimEntries, targetRsIds } = payload;
            const snpMap: Record<string, string> = {};
            
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
    }
};

export {};
