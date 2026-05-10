// src/utils/ancestry/grafAncEngine.ts
import { calculateSubPopResonance } from './subPopulationLogic';

const POP_NAME_MAP: Record<string, string> = {
  'GBR': 'British (England & Scotland)',
  'FIN': 'Finnish',
  'CEU': 'Northern & Western European',
  'IBS': 'Iberian (Spain & Portugal)',
  'TSI': 'Tuscan (Italy)',
  'YRI': 'Yoruba (Nigeria)',
  'LWK': 'Luhya (Kenya)',
  'GWD': 'Gambian (The Gambia)',
  'MSL': 'Mende (Sierra Leone)',
  'ESN': 'Esan (Nigeria)',
  'CHB': 'Han Chinese (Beijing)',
  'CHS': 'Southern Han Chinese',
  'JPT': 'Japanese (Tokyo)',
  'CDX': 'Chinese Dai',
  'KHV': 'Kinh Vietnamese',
  'GIH': 'Gujarati Indian',
  'PJL': 'Punjabi (Pakistan)',
  'BEB': 'Bengali (Bangladesh)',
  'STU': 'Sri Lankan Tamil',
  'ITU': 'Indian Telugu',
  'MXL': 'Mexican (USA)',
  'PUR': 'Puerto Rican',
  'CLM': 'Colombian',
  'PEL': 'Peruvian (Lima)',
  'ASW': 'African Ancestry (SW USA)',
  'ACB': 'African Caribbean (Barbados)'
};

/**
 * Global Regional Ancestry Factor (GRAF) Engine
 * Uses 10,000 SNPs to calculate fine-grained sub-population scores.
 */
export async function calculateRegionalScores(userGenotypes: Record<string, string>) {
  try {
    // We use a dynamic import to avoid blocking if the file is large or missing
    const results = await calculateSubPopResonance(userGenotypes);
    
    if (!results || results.length === 0) return [];

    // Format for EngineAncestryOracle: { population, distance, percentage }
    // Since we only have log-likelihoods (score), we convert them to a visual 'percentage'
    // and 'distance' for the UI.
    const topScore = results[0].score;
    
    return results.map(r => {
        // Convert log-likelihood difference to a 0-100 percentage-like confidence
        const relProb = Math.exp((r.score - topScore) / 10); // Smoothing factor 10
        return {
            population: POP_NAME_MAP[r.name] || r.name,
            score: r.score,
            percentage: relProb * 100, // This is relative resonance
            distance: Math.abs(r.score) / 100 // Inverse log-likelihood as a distance metric
        };
    });
  } catch (error) {
    console.error("GRAF Engine Error:", error);
    return [];
  }
}

