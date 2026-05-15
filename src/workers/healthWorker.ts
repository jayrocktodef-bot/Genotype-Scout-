/**
 * healthWorker.ts
 * Dedicated Web Worker for heavy genomic health and trait evaluations.
 */
import { analyzeHealthProfile } from '../engines/health/comprehensiveHealthEngine';

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
    }
};

export {};
