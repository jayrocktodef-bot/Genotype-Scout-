import mtDescriptions from './data/mitochondrial/mtDescriptions.json';

/**
 * Retrieves a brief explanation for a given marker ID or mutation.
 */
export const MT_MARKER_DESCRIPTIONS: Record<string, string> = mtDescriptions;

// Re-export data from snpDatabase
export * from './data/snpDatabase';

// Re-export constants
export * from './constants/genotypeConstants';
export * from './constants/haplogroups';

// Re-export types
export * from './types/genotype';

// Re-export utils
export * from './utils/genotypeUtils';

// Re-export services
export * from './services/dnaParser';
export * from './services/snpMatcher';
export * from './services/ancestryEngine';
export * from './services/haplogroupPredictor';
