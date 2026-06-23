import { RawSnp, YTreeSnp, PredictionResult } from '../types/haplogroup';

export class YDnaPredictor {
    private tree: Map<string, YTreeSnp[]> = new Map(); // Haplogroup -> SNPs
    private hierarchy: Map<string, string[]> = new Map(); // Parent Haplogroup -> Child Haplogroups

    constructor(snpDatabase: YTreeSnp[]) {
        this.buildTree(snpDatabase);
    }

    private buildTree(database: YTreeSnp[]) {
        for (const snp of database) {
            // Map SNPs to their haplogroup
            if (!this.tree.has(snp.haplogroup)) {
                this.tree.set(snp.haplogroup, []);
            }
            this.tree.get(snp.haplogroup)!.push(snp);

            // Build parent-child hierarchy
            if (snp.parent) {
                if (!this.hierarchy.has(snp.parent)) {
                    this.hierarchy.set(snp.parent, []);
                }
                if (!this.hierarchy.get(snp.parent)!.includes(snp.haplogroup)) {
                    this.hierarchy.get(snp.parent)!.push(snp.haplogroup);
                }
            }
        }
    }

    /**
     * Hierarchy-aware prediction.
     * Traverses the phylogenetic tree and selects the deepest haplogroup
     * with the highest confidence based on marker evidence.
     */
    public predict(rawDna: RawSnp[]): PredictionResult {
        const dnaMap = new Map(rawDna.map(s => [s.rsid, s.allele]));
        
        let bestTerminalHaplogroup = "A";
        let bestConfidence = 0;
        let bestPath: string[] = [];
        let maxDepth = 0;

        const traverse = (currentHaplo: string, currentDepth: number, path: string[], cumulativeDerived: number, cumulativeAncestral: number) => {
            const snps = this.tree.get(currentHaplo) || [];
            
            let localDerived = 0;
            let localAncestral = 0;

            for (const snp of snps) {
                const userAllele = dnaMap.get(snp.name);
                if (!userAllele || userAllele === '--' || userAllele === '00' || userAllele === 'II') continue;

                const normalizedAllele = userAllele[0];

                if (normalizedAllele === snp.derived) {
                    localDerived++;
                } else if (normalizedAllele === snp.ancestral) {
                    localAncestral++;
                }
            }

            const totalDerived = cumulativeDerived + localDerived;
            const totalAncestral = cumulativeAncestral + localAncestral;
            
            // Confidence calculation: derived markers / (derived + ancestral markers)
            const confidence = totalDerived > 0 ? (totalDerived / (totalDerived + totalAncestral)) * 100 : 0;

            // Only proceed if we have at least one derived marker
            if (totalDerived > 0) {
                // If we are deeper or more confident, update our terminal haplogroup candidate
                if (currentDepth >= maxDepth && confidence >= bestConfidence) {
                    maxDepth = currentDepth;
                    bestTerminalHaplogroup = currentHaplo;
                    bestConfidence = confidence;
                    bestPath = [...path, currentHaplo];
                }

                // Recursively check children
                const children = this.hierarchy.get(currentHaplo) || [];
                for (const child of children) {
                    traverse(child, currentDepth + 1, [...path, currentHaplo], totalDerived, totalAncestral);
                }
            }
        };

        // Assume 'A' is the theoretical root of the human Y-DNA tree
        traverse('A', 1, [], 0, 0);

        return {
            terminalHaplogroup: bestTerminalHaplogroup,
            confidence: Math.round(bestConfidence * 100) / 100,
            path: bestPath
        };
    }
}
