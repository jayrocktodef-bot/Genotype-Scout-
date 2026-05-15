import masterHealthTable from '../../data/master_health_pgx.json';
import { calculateMedicationSafety, MedicationReport } from './pgxCalculator';
import { callStarAlleles, StarAlleleResult } from './pypgxEngine';
import { calculateSecretorStatus } from './secretorCalculator';
import { calculateBloodType } from '../bloodTypeCalculator';
import { dietLogic } from '../dietaryCalculator';

export interface HealthProfile {
    pgxPhenotypes: StarAlleleResult[];
    clinicalRisks: MedicationReport[];
    bloodType: any;
    secretorStatus: any;
    dietaryTraits: any[];
}

/**
 * Orchestrates all health and trait evaluations in a single pass.
 * Designed to run inside a Web Worker to keep the UI thread responsive.
 */
export function analyzeHealthProfile(userSnps: Record<string, string>): HealthProfile {
    // 1. PGx Analysis (Standard Star Alleles)
    const genes = ['CYP2D6', 'CYP2C19', 'DPYD'];
    const pgxPhenotypes = genes.map(gene => callStarAlleles(gene, userSnps));

    // 2. Clinical Medication Safety (Rule-based)
    const clinicalRisks = calculateMedicationSafety(userSnps);

    // 3. Blood Type Prediction
    const bloodType = calculateBloodType(userSnps);

    // 4. Secretor Status
    const secretorStatus = calculateSecretorStatus(userSnps);

    // 5. Dietary & Wellness Traits
    const dietaryTraits = Object.entries(dietLogic).map(([key, config]) => {
        const geno = userSnps[config.rsid] || '--';
        return {
            trait: key,
            genotype: geno,
            ...config.interpret(geno)
        };
    });

    return {
        pgxPhenotypes,
        clinicalRisks,
        bloodType,
        secretorStatus,
        dietaryTraits
    };
}
