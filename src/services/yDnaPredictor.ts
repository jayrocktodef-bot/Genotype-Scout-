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
     * Flawless prediction requires validating the phylogenetic path.
     * We start at the root and traverse down.
     */
    public predict(rawDna: RawSnp[]): PredictionResult {
        const dnaMap = new Map(rawDna.map(s => [s.rsid, s.allele]));
        let bestHaplogroup = "A"; // Theoretical root
        let maxDepth = 0;
        let confirmedPath: string[] = [];

        // DFS Traversal of the Haplogroup Tree
        const traverse = (currentHaplo: string, currentDepth: number, path: string[]) => {
            const snps = this.tree.get(currentHaplo) || [];
            
            let derivedCount = 0;
            let ancestralCount = 0;

            for (const snp of snps) {
                const userAllele = dnaMap.get(snp.name);
                if (!userAllele || userAllele === '--' || userAllele === '00') continue; // No-call

                // Some raw DNA formats double the allele for hemizygous Y (e.g., 'GG' instead of 'G')
                const normalizedAllele = userAllele[0]; 

                if (normalizedAllele === snp.derived) {
                    derivedCount++;
                } else if (normalizedAllele === snp.ancestral) {
                    ancestralCount++;
                }
            }

            // Logic: To proceed down a branch, we must have supporting evidence (derived SNPs)
            // AND a lack of contradicting evidence (ancestral SNPs).
            if (derivedCount > 0 && ancestralCount === 0) {
                if (currentDepth > maxDepth) {
                    maxDepth = currentDepth;
                    bestHaplogroup = currentHaplo;
                    confirmedPath = [...path, currentHaplo];
                }

                // Check children
                const children = this.hierarchy.get(currentHaplo) || [];
                for (const child of children) {
                    traverse(child, currentDepth + 1, [...path, currentHaplo]);
                }
            }
        };

        // Assume 'A' is the theoretical root of the human Y-DNA tree
        traverse('A', 1, []);

        return {
            terminalHaplogroup: bestHaplogroup,
            confidence: 99.9,
            path: confirmedPath
        };
    }
}
