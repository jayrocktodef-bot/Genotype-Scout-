// src/utils/ancestry/subPopulationLogic.ts
import regionalWeights from '../../data/raw_aims/graf_10k_weights.json';
import grafIndex from '../../data/raw_aims/graf_10k_index.json';

const EUROPEAN_POPS = [
  "CEU", "GBR", "FIN", "IBS", "TSI"
];
const EUROPEAN_BOOST = 1.05; // 5% boost for European fine-mapping

// Helper for UI presentation of the real populations
export const POPULATION_NAMES: Record<string, string> = {
  "CEU": "Northwestern European (CEU)",
  "GBR": "British & Irish (GBR)",
  "FIN": "Finnish / Uralic (FIN)",
  "IBS": "Iberian (IBS)",
  "TSI": "Southern European / Italian (TSI)",
  "ACB": "African Caribbean (ACB)",
  "ASW": "African American (ASW)",
  "ESN": "Esan in Nigeria (ESN)",
  "GWD": "Gambian (GWD)",
  "LWK": "Luhya in Kenya (LWK)",
  "MSL": "Mende in Sierra Leone (MSL)",
  "YRI": "Yoruba in Nigeria (YRI)",
  "CDX": "Chinese Dai (CDX)",
  "CHB": "Han Chinese (CHB)",
  "CHS": "Southern Han Chinese (CHS)",
  "JPT": "Japanese (JPT)",
  "KHV": "Kinh in Vietnam (KHV)",
  "BEB": "Bengali (BEB)",
  "GIH": "Gujarati Indian (GIH)",
  "ITU": "Indian Telugu (ITU)",
  "PJL": "Punjabi (PJL)",
  "STU": "Sri Lankan Tamil (STU)",
  "CLM": "Colombian (CLM)",
  "MXL": "Mexican (MXL)",
  "PEL": "Peruvian (PEL)",
  "PUR": "Puerto Rican (PUR)",
  "hgdp_bantu_kenya": "Bantu (Kenya)",
  "hgdp_bantu_south_africa": "Bantu (South Africa)",
  "hgdp_biaka_pygmy": "Biaka Pygmy",
  "hgdp_mbuti_pygmy": "Mbuti Pygmy",
  "hgdp_mandenka": "Mandenka",
  "hgdp_san": "San (Southern Africa)",
  "hgdp_yoruba": "Yoruba (Nigeria)",
  "hgdp_colombian": "Colombian (HGDP)",
  "hgdp_karitiana": "Karitiana (Brazil)",
  "hgdp_maya": "Maya",
  "hgdp_pima": "Pima (Mexico)",
  "hgdp_surui": "Surui (Brazil)",
  "hgdp_balochi": "Balochi",
  "hgdp_brahui": "Brahui",
  "hgdp_burusho": "Burusho",
  "hgdp_hazara": "Hazara",
  "hgdp_kalash": "Kalash",
  "hgdp_makrani": "Makrani",
  "hgdp_pathan": "Pathan",
  "hgdp_sindhi": "Sindhi",
  "hgdp_uygur": "Uygur",
  "hgdp_cambodian": "Cambodian",
  "hgdp_dai": "Dai (HGDP)",
  "hgdp_daur": "Daur",
  "hgdp_han": "Han (HGDP)",
  "hgdp_hezhen": "Hezhen",
  "hgdp_japanese": "Japanese (HGDP)",
  "hgdp_lahu": "Lahu",
  "hgdp_miao": "Miao",
  "hgdp_mongola": "Mongola",
  "hgdp_naxi": "Naxi",
  "hgdp_oroqen": "Oroqen",
  "hgdp_she": "She",
  "hgdp_tu": "Tu",
  "hgdp_tujia": "Tujia",
  "hgdp_xibo": "Xibo",
  "hgdp_yakut": "Yakut",
  "hgdp_yi": "Yi",
  "hgdp_bedouin": "Bedouin",
  "hgdp_druze": "Druze",
  "hgdp_mozabite": "Mozabite",
  "hgdp_palestinian": "Palestinian",
  "hgdp_bougainville": "Bougainville",
  "hgdp_papuan": "Papuan",
  "sgdp_adygei": "Adygei (SGDP)",
  "sgdp_albanian": "Albanian (SGDP)",
  "sgdp_aleut": "Aleut (SGDP)",
  "sgdp_altaian": "Altaian (SGDP)",
  "sgdp_ami": "Ami (SGDP)",
  "sgdp_armenian": "Armenian (SGDP)",
  "sgdp_atayal": "Atayal (SGDP)",
  "sgdp_australian": "Australian (SGDP)",
  "sgdp_balochi": "Balochi (SGDP)",
  "sgdp_bantuherero": "Bantuherero (SGDP)",
  "sgdp_bantukenya": "Bantukenya (SGDP)",
  "sgdp_bantutswana": "Bantutswana (SGDP)",
  "sgdp_basque": "Basque (SGDP)",
  "sgdp_bedouinb": "Bedouinb (SGDP)",
  "sgdp_bengali": "Bengali (SGDP)",
  "sgdp_bergamo": "Bergamo (SGDP)",
  "sgdp_biaka": "Biaka (SGDP)",
  "sgdp_bougainville": "Bougainville (SGDP)",
  "sgdp_brahmin": "Brahmin (SGDP)",
  "sgdp_brahui": "Brahui (SGDP)",
  "sgdp_bulgarian": "Bulgarian (SGDP)",
  "sgdp_burmese": "Burmese (SGDP)",
  "sgdp_burusho": "Burusho (SGDP)",
  "sgdp_cambodian": "Cambodian (SGDP)",
  "sgdp_chechen": "Chechen (SGDP)",
  "sgdp_china_lahu": "China Lahu (SGDP)",
  "sgdp_chukchi": "Chukchi (SGDP)",
  "sgdp_cretan": "Cretan (SGDP)",
  "sgdp_czech": "Czech (SGDP)",
  "sgdp_dai": "Dai (SGDP)",
  "sgdp_daur": "Daur (SGDP)",
  "sgdp_druze": "Druze (SGDP)",
  "sgdp_dusun": "Dusun (SGDP)",
  "sgdp_english": "English (SGDP)",
  "sgdp_esan": "Esan (SGDP)",
  "sgdp_eskimo_chaplin": "Eskimo Chaplin (SGDP)",
  "sgdp_eskimo_naukan": "Eskimo Naukan (SGDP)",
  "sgdp_eskimo_sireniki": "Eskimo Sireniki (SGDP)",
  "sgdp_estonian": "Estonian (SGDP)",
  "sgdp_even": "Even (SGDP)",
  "sgdp_finnish": "Finnish (SGDP)",
  "sgdp_french": "French (SGDP)",
  "sgdp_gambian": "Gambian (SGDP)",
  "sgdp_georgian": "Georgian (SGDP)",
  "sgdp_greek": "Greek (SGDP)",
  "sgdp_han": "Han (SGDP)",
  "sgdp_hawaiian": "Hawaiian (SGDP)",
  "sgdp_hazara": "Hazara (SGDP)",
  "sgdp_hezhen": "Hezhen (SGDP)",
  "sgdp_hungarian": "Hungarian (SGDP)",
  "sgdp_icelandic": "Icelandic (SGDP)",
  "sgdp_ignore_han(discovery)": "Ignore Han(Discovery) (SGDP)",
  "sgdp_ignore_karitiana(discovery)": "Ignore Karitiana(Discovery) (SGDP)",
  "sgdp_ignore_papuan(discovery)": "Ignore Papuan(Discovery) (SGDP)",
  "sgdp_igorot": "Igorot (SGDP)",
  "sgdp_iranian": "Iranian (SGDP)",
  "sgdp_irula": "Irula (SGDP)",
  "sgdp_italian_north": "Italian North (SGDP)",
  "sgdp_itelmen": "Itelmen (SGDP)",
  "sgdp_japanese": "Japanese (SGDP)",
  "sgdp_jew_iraqi": "Jew Iraqi (SGDP)",
  "sgdp_jew_yemenite": "Jew Yemenite (SGDP)",
  "sgdp_jordanian": "Jordanian (SGDP)",
  "sgdp_ju_hoan_north": "Ju Hoan North (SGDP)",
  "sgdp_kalash": "Kalash (SGDP)",
  "sgdp_kapu": "Kapu (SGDP)",
  "sgdp_karitiana": "Karitiana (SGDP)",
  "sgdp_khomani_san": "Khomani San (SGDP)",
  "sgdp_khonda_dora": "Khonda Dora (SGDP)",
  "sgdp_kinh": "Kinh (SGDP)",
  "sgdp_korean": "Korean (SGDP)",
  "sgdp_kusunda": "Kusunda (SGDP)",
  "sgdp_kyrgyz_kyrgyzstan": "Kyrgyz Kyrgyzstan (SGDP)",
  "sgdp_lezgin": "Lezgin (SGDP)",
  "sgdp_luhya": "Luhya (SGDP)",
  "sgdp_luo": "Luo (SGDP)",
  "sgdp_madiga": "Madiga (SGDP)",
  "sgdp_makrani": "Makrani (SGDP)",
  "sgdp_mala": "Mala (SGDP)",
  "sgdp_malagasy": "Malagasy",
  "sgdp_mandenka": "Mandenka (SGDP)",
  "sgdp_mansi": "Mansi (SGDP)",
  "sgdp_maori": "Maori (SGDP)",
  "sgdp_masai": "Masai (SGDP)",
  "sgdp_mayan": "Mayan (SGDP)",
  "sgdp_mbuti": "Mbuti (SGDP)",
  "sgdp_mende": "Mende (SGDP)",
  "sgdp_mexico_zapotec": "Mexico Zapotec (SGDP)",
  "sgdp_miao": "Miao (SGDP)",
  "sgdp_mixe": "Mixe (SGDP)",
  "sgdp_mixtec": "Mixtec (SGDP)",
  "sgdp_mongola": "Mongola (SGDP)",
  "sgdp_mozabite": "Mozabite (SGDP)",
  "sgdp_naxi": "Naxi (SGDP)",
  "sgdp_norwegian": "Norwegian (SGDP)",
  "sgdp_orcadian": "Orcadian (SGDP)",
  "sgdp_oroqen": "Oroqen (SGDP)",
  "sgdp_palestinian": "Palestinian (SGDP)",
  "sgdp_papuan": "Papuan (SGDP)",
  "sgdp_pathan": "Pathan (SGDP)",
  "sgdp_piapoco": "Piapoco (SGDP)",
  "sgdp_pima": "Pima (SGDP)",
  "sgdp_polish": "Polish (SGDP)",
  "sgdp_punjabi": "Punjabi (SGDP)",
  "sgdp_quechua": "Quechua (SGDP)",
  "sgdp_relli": "Relli (SGDP)",
  "sgdp_russia_abkhasian": "Russia Abkhasian (SGDP)",
  "sgdp_russia_northossetian": "Russia Northossetian (SGDP)",
  "sgdp_russian": "Russian (SGDP)",
  "sgdp_saami": "Saami (SGDP)",
  "sgdp_saharawi": "Saharawi (SGDP)",
  "sgdp_samaritan": "Samaritan (SGDP)",
  "sgdp_sardinian": "Sardinian (SGDP)",
  "sgdp_she": "She (SGDP)",
  "sgdp_sindhi": "Sindhi (SGDP)",
  "sgdp_somali": "Somali (SGDP)",
  "sgdp_spanish": "Spanish (SGDP)",
  "sgdp_surui": "Surui (SGDP)",
  "sgdp_tajik": "Tajik (SGDP)",
  "sgdp_thai": "Thai (SGDP)",
  "sgdp_tlingit": "Tlingit (SGDP)",
  "sgdp_tu": "Tu (SGDP)",
  "sgdp_tubalar": "Tubalar (SGDP)",
  "sgdp_tujia": "Tujia (SGDP)",
  "sgdp_turkish": "Turkish (SGDP)",
  "sgdp_tuscan": "Tuscan (SGDP)",
  "sgdp_ulchi": "Ulchi (SGDP)",
  "sgdp_uyghur": "Uyghur (SGDP)",
  "sgdp_xibo": "Xibo (SGDP)",
  "sgdp_yadava": "Yadava (SGDP)",
  "sgdp_yakut": "Yakut (SGDP)",
  "sgdp_yi": "Yi (SGDP)",
  "sgdp_yoruba": "Yoruba (SGDP)"
};

/**
 * Calculates the resonance (likelihood) of 26 sub-populations.
 * This is the core of the "Engine" mode for high-precision ethnicity.
 */
export function calculateSubPopResonance(userGenotypes: Record<string, string>) {
  const popScores: Record<string, number> = {};
  const populations = Object.keys(Object.values(regionalWeights)[0] || {});

  if (populations.length === 0) return [];

  populations.forEach(pop => popScores[pop] = 0);

  Object.entries(userGenotypes).forEach(([rsid, genotype]) => {
    const weights = (regionalWeights as any)[rsid];
    if (!weights) return;

    const marker = (grafIndex as any)[rsid];
    if (!marker) return;

    const ref = marker.ref.toUpperCase();
    const alt = marker.alt.toUpperCase();

    const getComplement = (b: string) => {
      const map: Record<string, string> = { 'A': 'T', 'T': 'A', 'C': 'G', 'G': 'C' };
      return map[b] || b;
    };

    const compRef = getComplement(ref);
    const compAlt = getComplement(alt);

    populations.forEach(pop => {
      // Clamp p to [0.0001, 0.9999] to prevent log(0) and extreme likelihoods
      const rawWeight = weights[pop] !== undefined ? weights[pop] : 0.01;
      const p = Math.max(0.0001, Math.min(0.9999, rawWeight)); 
      const q = 1 - p;               // Freq of Ref Allele
      
      let prob = 1e-6; // Laplacian smoothing
      
      // Determine if genotype matches ref/alt on forward or complement strand
      const gUpper = genotype.toUpperCase();
      const isAltAlt = gUpper === (alt + alt) || gUpper === (compAlt + compAlt);
      const isRefRef = gUpper === (ref + ref) || gUpper === (compRef + compRef);
      const isHetero = gUpper.length === 2 && 
                      ((gUpper[0] === ref && gUpper[1] === alt) || 
                       (gUpper[0] === alt && gUpper[1] === ref) ||
                       (gUpper[0] === compRef && gUpper[1] === compAlt) || 
                       (gUpper[0] === compAlt && gUpper[1] === compRef));

      if (isAltAlt) prob = p * p;
      else if (isHetero) prob = 2 * p * q;
      else if (isRefRef) prob = q * q;
      else {
        // Fallback for strand flips or mismatched data (rarely hit now due to complement checks):
        // Try simple homozygous vs heterozygous check as a heuristic if strict base matching fails
        if (gUpper.length === 2 && gUpper[0] === gUpper[1]) {
           prob = Math.max(p * p, q * q); 
        } else {
           prob = 2 * p * q;
        }
      }
      
      // Apply boost for European AIMs
      const boost = EUROPEAN_POPS.includes(pop) ? EUROPEAN_BOOST : 1.0;
      popScores[pop] += Math.log(prob) * boost;
    });
  });

  // Sort by highest log-likelihood (least negative)
  return Object.entries(popScores)
    .map(([name, score]) => ({ name, score }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 10); // Return top 10 ethnic signatures for a broader look
}


