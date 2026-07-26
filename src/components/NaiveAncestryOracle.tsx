import React, { memo, useMemo, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';
import { HelpCircle, Info, Dna, History } from 'lucide-react';

const mapCodeToName = (code: string): string => {
  const mapping: Record<string, string> = {
    'AFR': 'African',
    'AMR': 'Native/Mixed American',
    'EUR': 'European',
    'EAS': 'East Asian',
    'SAS': 'South Asian',
    'SIB': 'Siberian',
    'OCE': 'Oceanian',
    'MENA': 'Middle Eastern / North African',
    'Native_American_unadmixed': 'Native American (Unadmixed)',
    'AMR_admixed': 'Native American (Admixed)',
    'NAT': 'Native American',
    'MID': 'Middle Eastern',
    'ASI': 'Asian',
    'GLOBAL': 'Global Reference'
  };
  return mapping[code] || code;
};

const REGION_COLORS: Record<string, string> = {
  EUR: '#3b82f6', // European -> Blue
  AFR: '#10b981', // African -> Green
  EAS: '#ef4444', // East Asian -> Red
  SAS: '#f59e0b', // South Asian -> Yellow
  AMR: '#a855f7', // Native/Mixed American -> Purple
  NAT: '#ec4899', // Native American -> Pink
  Native_American_unadmixed: '#ec4899',
  AMR_admixed: '#db2777',
  OCE: '#06b6d4', // Oceanian -> Cyan
  MENA: '#f97316', // Middle Eastern / North African -> Orange
  MID: '#d97706', // Middle Eastern -> Amber
  SIB: '#14b8a6', // Siberian -> Teal
  ASI: '#6366f1', // Asian -> Indigo
  GLOBAL: '#64748b' // Global Reference -> Slate
};

const POPULATION_IMPLICATIONS: Record<string, { title: string; subtitle: string; description: string; gradient: string }> = {
  EUR: {
    title: 'West Eurasian Ancestry',
    subtitle: 'Yamnaya Steppe & Neolithic Farming Convergence',
    description: 'Reflects ancestral contributions from Yamnaya steppe pastoralists, early Neolithic farmers, and Western hunter-gatherers. Features genetic signatures adapted to Northern latitudes, including lactase persistence (milk tolerance) and high frequencies of light iris/skin pigmentation variants.',
    gradient: 'from-blue-500/10 via-sky-500/5 to-transparent'
  },
  AFR: {
    title: 'Sub-Saharan African Ancestry',
    subtitle: 'Deep Evolutionary Diversity & Adaptive Immunity',
    description: 'Traces roots to early modern human lineages that did not experience the Out-of-Africa bottleneck, retaining the highest baseline genetic diversity in the world. Includes critical adaptive alleles for immunological defense, such as malaria-protective null-antigens.',
    gradient: 'from-emerald-500/10 via-teal-500/5 to-transparent'
  },
  EAS: {
    title: 'East Asian Ancestry',
    subtitle: 'Agrarian Expansions & Physiological Adaptations',
    description: 'Points to ancestral roots stemming from early agricultural developments in the Yellow and Yangtze river basins. Includes highly selected alleles governing distinct physical phenotypes, such as thicker hair shafts (EDAR gene) and alcohol flush reactions (ALDH2 variant).',
    gradient: 'from-red-500/10 via-rose-500/5 to-transparent'
  },
  SAS: {
    title: 'South Asian Ancestry',
    subtitle: 'ANI & ASI Crossroads Convergence',
    description: 'Reflects a historic confluence between Ancestral North Indians (ANI) and Ancestral South Indians (ASI). This genetic makeup represents a major historical corridor, combining Eurasian affinities with deep, indigenous South Asian ancestral markers.',
    gradient: 'from-amber-500/10 via-yellow-500/5 to-transparent'
  },
  AMR: {
    title: 'Indigenous American Ancestry',
    subtitle: 'Beringian Migration & Founder Lineages',
    description: 'Highlights genetic signatures derived from ancient populations that crossed the Bering land bridge (Beringia). Characterized by high frequencies of specific founder variants and immunological adaptations to varied high-altitude and tropical habitats.',
    gradient: 'from-purple-500/10 via-fuchsia-500/5 to-transparent'
  },
  NAT: {
    title: 'Indigenous American Ancestry',
    subtitle: 'Beringian Migration & Founder Lineages',
    description: 'Highlights genetic signatures derived from ancient populations that crossed the Bering land bridge (Beringia). Characterized by high frequencies of specific founder variants and immunological adaptations to varied high-altitude and tropical habitats.',
    gradient: 'from-pink-500/10 via-rose-500/5 to-transparent'
  },
  Native_American_unadmixed: {
    title: 'Indigenous American Ancestry',
    subtitle: 'Beringian Migration & Founder Lineages',
    description: 'Highlights genetic signatures derived from ancient populations that crossed the Bering land bridge (Beringia). Characterized by high frequencies of specific founder variants and immunological adaptations to varied high-altitude and tropical habitats.',
    gradient: 'from-pink-500/10 via-rose-500/5 to-transparent'
  },
  AMR_admixed: {
    title: 'Admixed American Ancestry',
    subtitle: 'Tri-Hybrid Colonial Admixture Convergence',
    description: 'Illustrates the complex genetic history of post-colonial admixture in the Americas. Shows a convergence of European, Sub-Saharan African, and Indigenous American markers within single chromosomal segments.',
    gradient: 'from-pink-500/10 via-purple-500/5 to-transparent'
  },
  MENA: {
    title: 'Middle Eastern & North African Ancestry',
    subtitle: 'Levantine Corridor & Neolithic Core',
    description: 'Represents lineages originating in the Fertile Crescent and North Africa. Key crossroads of early human migrations out of Africa and the cradle of agriculture, characterized by deep shared genetic roots with both Africa and West Eurasia.',
    gradient: 'from-orange-500/10 via-amber-500/5 to-transparent'
  },
  MID: {
    title: 'Middle Eastern Ancestry',
    subtitle: 'Levantine Corridor & Neolithic Core',
    description: 'Represents lineages originating in the Fertile Crescent and North Africa. Key crossroads of early human migrations out of Africa and the cradle of agriculture, characterized by deep shared genetic roots with both Africa and West Eurasia.',
    gradient: 'from-orange-500/10 via-amber-500/5 to-transparent'
  },
  SIB: {
    title: 'Siberian Ancestry',
    subtitle: 'Extreme Climate Adaptation & Genetic Bridges',
    description: 'Reflects adaptation to hyper-cold sub-arctic environments. Serves as a vital genetic link between ancestral North East Asians and the founding populations of the Americas, carrying unique adaptive signatures for cold climates and dietary fat metabolism.',
    gradient: 'from-teal-500/10 via-emerald-500/5 to-transparent'
  },
  OCE: {
    title: 'Oceanian Ancestry',
    subtitle: 'Deep Sahul Migration & Denisovan Introgression',
    description: 'Traces roots to the first wave of modern human migrations out of Africa to Sahul (Australia and New Guinea). Retains unique evolutionary footprints, including the highest proportions of archaic Denisovan genetic introgression.',
    gradient: 'from-cyan-500/10 via-blue-500/5 to-transparent'
  }
};

interface DriverSNP {
  rsid: string;
  gene: string;
  name: string;
  description: string;
  interpretations: Record<string, { state: 'Derived' | 'Ancestral' | 'Heterozygous'; text: string; impact: string }>;
  globalFreq: string;
}

const DRIVER_SNPS: DriverSNP[] = [
  {
    rsid: 'rs4988235',
    gene: 'MCM6 / LCT',
    name: 'Lactase Persistence Switch',
    description: 'Controls long-term active expression of the lactase enzyme in adulthood, allowing lactose digestion.',
    globalFreq: 'Highly selected in Europe (~85-90%); low in East Asia (~5%), Americas (~5%), and Sub-Saharan Africa (~10-20%).',
    interpretations: {
      'CC': { state: 'Ancestral', text: 'Lactase Non-Persistent', impact: 'You carry two copies of the ancestral allele, indicating standard post-weaning reduction in lactase enzyme expression.' },
      'TT': { state: 'Derived', text: 'Lactase Persistent', impact: 'You carry two copies of the derived allele, conferring adult lactase persistence. This is a classic signature of European dairy co-evolution.' },
      'TC': { state: 'Heterozygous', text: 'Lactase Persistent (Carrier)', impact: 'You carry one copy of the derived persistence allele, sufficient to maintain adult lactose tolerance.' },
      'CT': { state: 'Heterozygous', text: 'Lactase Persistent (Carrier)', impact: 'You carry one copy of the derived persistence allele, sufficient to maintain adult lactose tolerance.' }
    }
  },
  {
    rsid: 'rs3827760',
    gene: 'EDAR',
    name: 'Ectodysplasin A Receptor',
    description: 'Influences hair follicle thickness, active sweat gland density, and shovel-shaped incisor morphology.',
    globalFreq: 'Nearly fixed in East Asia (>93%) and Indigenous Americas (>90%); virtually absent in Europe and Africa (~0%).',
    interpretations: {
      'AA': { state: 'Ancestral', text: 'Ancestral EDAR Phenotype', impact: 'You carry two copies of the ancestral allele, dominant in European, African, and South Asian populations.' },
      'GG': { state: 'Derived', text: 'Derived East Asian / Native American Phenotype', impact: 'You carry two copies of the active derived G allele, associated with thick, straight hair shafts, increased sweat gland density, and modified dental/ear traits.' },
      'AG': { state: 'Heterozygous', text: 'Intermediate EDAR Phenotype', impact: 'You carry one copy of the active derived East Asian allele, resulting in intermediate hair thickness and dental/sweat gland features.' },
      'GA': { state: 'Heterozygous', text: 'Intermediate EDAR Phenotype', impact: 'You carry one copy of the active derived East Asian allele, resulting in intermediate hair thickness and dental/sweat gland features.' }
    }
  },
  {
    rsid: 'rs2814778',
    gene: 'ACKR1 / DARC',
    name: 'Duffy Antigen Receptor (Malaria Resistance)',
    description: 'Determines the presence of the Duffy antigen on red blood cells, which is targeted by Plasmodium vivax parasites.',
    globalFreq: 'Nearly fixed in Sub-Saharan Africa (>99% Duffy-Null); extremely rare in Europe, East Asia, and Indigenous Americas (<1%).',
    interpretations: {
      'TT': { state: 'Ancestral', text: 'Duffy Positive Erythrocytes', impact: 'You carry two copies of the ancestral allele. Your red blood cells express the Duffy antigen, standard in non-African populations.' },
      'CC': { state: 'Derived', text: 'Duffy-Null Phenotype (Vivax Malaria Protection)', impact: 'You carry two copies of the derived protective C allele, providing complete resistance to Plasmodium vivax malaria.' },
      'TC': { state: 'Heterozygous', text: 'Duffy Positive (Carrier)', impact: 'You carry one copy of the protective Duffy-null allele. You still express the Duffy antigen, though you carry the resistance trait.' },
      'CT': { state: 'Heterozygous', text: 'Duffy Positive (Carrier)', impact: 'You carry one copy of the protective Duffy-null allele. You still express the Duffy antigen, though you carry the resistance trait.' }
    }
  },
  {
    rsid: 'rs671',
    gene: 'ALDH2',
    name: 'Alcohol Flush Reaction',
    description: 'Encodes the aldehyde dehydrogenase 2 enzyme, which clears toxic acetaldehyde, a byproduct of ethanol breakdown.',
    globalFreq: 'Prevalent in East Asia (~30-50%); absent in Europe, Africa, and Indigenous Americas (~0%).',
    interpretations: {
      'GG': { state: 'Ancestral', text: 'Active Acetaldehyde Metabolism', impact: 'You carry two copies of the ancestral allele, encoding a fully active ALDH2 enzyme that clears acetaldehyde rapidly.' },
      'AA': { state: 'Derived', text: 'Severe Alcohol Flush Reaction', impact: 'You carry two copies of the derived inactive A allele (*2), leading to acetaldehyde accumulation, severe flushing, nausea, and rapid heartbeat upon alcohol intake.' },
      'AG': { state: 'Heterozygous', text: 'Moderate Alcohol Flush Reaction', impact: 'You carry one copy of the inactive allele, causing intermediate clearing rates. You likely experience flushing and light intolerance to alcohol.' },
      'GA': { state: 'Heterozygous', text: 'Moderate Alcohol Flush Reaction', impact: 'You carry one copy of the inactive allele, causing intermediate clearing rates. You likely experience flushing and light intolerance to alcohol.' }
    }
  },
  {
    rsid: 'rs12913832',
    gene: 'HERC2 / OCA2',
    name: 'Iris Melanin Regulator',
    description: 'Serves as an enhancer switch regulating OCA2 transcription, governing iris melanosome density.',
    globalFreq: 'Extremely high in Northern and Eastern Europe (>80%); low to absent in Africa, East Asia, and the Americas (~0-5%).',
    interpretations: {
      'AA': { state: 'Ancestral', text: 'Standard Melanin Deposition (Brown Eyes)', impact: 'You carry two copies of the ancestral allele, promoting standard melanin synthesis and resulting in brown/dark iris coloration.' },
      'GG': { state: 'Derived', text: 'Restricted Melanin Deposition (Blue/Green Eyes)', impact: 'You carry two copies of the derived G allele, restricting HERC2/OCA2 activity and yielding light-colored (blue/green) eyes.' },
      'AG': { state: 'Heterozygous', text: 'Intermediate Melanin Deposition (Hazel/Brown Eyes)', impact: 'You carry one copy of the derived light-eye allele, typically resulting in brown or hazel eyes, but carrying the trait.' },
      'GA': { state: 'Heterozygous', text: 'Intermediate Melanin Deposition (Hazel/Brown Eyes)', impact: 'You carry one copy of the derived light-eye allele, typically resulting in brown or hazel eyes, but carrying the trait.' }
    }
  },
  {
    rsid: 'rs1801282',
    gene: 'MC1R',
    name: 'Red Hair / Fair Skin Variant',
    description: 'Regulates synthesis of pheomelanin (red/yellow) versus eumelanin (black/brown) in melanocytes.',
    globalFreq: 'Most common in Celtic and Northern European cohorts (~10-25%); rare in other populations worldwide (<1%).',
    interpretations: {
      'GG': { state: 'Ancestral', text: 'Standard Pigmentation Pathway', impact: 'You carry two copies of the ancestral allele, enabling normal dark melanin synthesis pathways.' },
      'CC': { state: 'Derived', text: 'MC1R Loss-of-Function (Red Hair/Fair Skin)', impact: 'You carry two copies of the derived R151C variant, associated with red hair, fair skin, freckles, and poor tanning ability.' },
      'GC': { state: 'Heterozygous', text: 'Carrier of MC1R Fair Skin Trait', impact: 'You carry one copy of the red hair variant. You likely have normal hair coloring but may carry increased skin fairness or freckling.' },
      'CG': { state: 'Heterozygous', text: 'Carrier of MC1R Fair Skin Trait', impact: 'You carry one copy of the red hair variant. You likely have normal hair coloring but may carry increased skin fairness or freckling.' }
    }
  },
  {
    rsid: 'rs1426654',
    gene: 'SLC24A5',
    name: 'Skin Pigmentation (European Light Skin)',
    description: 'Major determinant of light skin pigmentation in Europeans. The derived allele is near-fixed in Europe and rare in Africa and East Asia.',
    interpretations: {
      'AA': { state: 'Derived', text: 'Two copies of the light-skin allele. Strongly associated with lighter skin pigmentation typical of European ancestry.', impact: 'Strongly associated with lighter skin; reduces eumelanin production.' },
      'AG': { state: 'Heterozygous', text: 'One copy of the light-skin allele. Intermediate effect on skin pigmentation.', impact: 'Moderate lightening of skin tone.' },
      'GA': { state: 'Heterozygous', text: 'One copy of the light-skin allele. Intermediate effect on skin pigmentation.', impact: 'Moderate lightening of skin tone.' },
      'GG': { state: 'Ancestral', text: 'Ancestral allele. Darker skin pigmentation, common in African and East Asian populations.', impact: 'Associated with darker skin tones.' }
    },
    globalFreq: 'Derived allele (A) ~99% in Europeans, <1% in sub-Saharan Africans, ~5% in East Asians.'
  },
  {
    rsid: 'rs1800414',
    gene: 'OCA2',
    name: 'Skin Pigmentation (East Asian Light Skin)',
    description: 'A key determinant of lighter skin in East Asians. The derived allele has been under strong positive selection in that region.',
    interpretations: {
      'GG': { state: 'Derived', text: 'Two copies of the East Asian light-skin allele. Typically leads to lighter skin in East Asian populations.', impact: 'Lighter skin pigmentation — convergent evolution with European light-skin alleles.' },
      'AG': { state: 'Heterozygous', text: 'One copy of the light-skin allele. Intermediate effect on skin pigmentation.', impact: 'Moderate lightening of skin in East Asian contexts.' },
      'GA': { state: 'Heterozygous', text: 'One copy of the light-skin allele. Intermediate effect on skin pigmentation.', impact: 'Moderate lightening of skin in East Asian contexts.' },
      'AA': { state: 'Ancestral', text: 'Ancestral allele. Associated with darker skin pigmentation; common in Africans and Europeans.', impact: 'Darker skin tones outside of East Asia.' }
    },
    globalFreq: 'Derived allele (G) ~90% in East Asians, ~5% in Europeans, nearly absent in Africans.'
  },
  {
    rsid: 'rs17822931',
    gene: 'ABCC11',
    name: 'Earwax Type & Body Odor',
    description: 'Determines earwax consistency (dry vs. wet) and axillary body odor. The derived allele causes dry earwax and reduced body odor.',
    interpretations: {
      'TT': { state: 'Derived', text: 'Two copies of the dry earwax allele. Common in East Asians; associated with dry, flaky earwax and less body odor.', impact: 'Dry earwax, reduced apocrine sweat gland activity.' },
      'CT': { state: 'Heterozygous', text: 'One copy each. Intermediate phenotype — earwax may be moist/dry mixed, body odor somewhat reduced.', impact: 'Mixed earwax type, moderately reduced body odor.' },
      'TC': { state: 'Heterozygous', text: 'One copy each. Intermediate phenotype — earwax may be moist/dry mixed, body odor somewhat reduced.', impact: 'Mixed earwax type, moderately reduced body odor.' },
      'CC': { state: 'Ancestral', text: 'Ancestral wet earwax allele. Predominant in Africans and Europeans; wet earwax and typical body odor.', impact: 'Wet earwax, normal apocrine gland function.' }
    },
    globalFreq: 'Derived allele (T) ~95% in East Asians, <5% in Europeans, ~1% in Africans.'
  },
  {
    rsid: 'rs334',
    gene: 'HBB',
    name: 'Sickle Cell Trait & Malaria Resistance',
    description: 'The sickle hemoglobin variant (HbS). Heterozygotes have strong protection against severe malaria; homozygotes have sickle cell disease.',
    interpretations: {
      'TT': { state: 'Derived', text: 'Two copies of the sickle cell allele (HbS disease). Severe red-blood-cell disorder with life-long health complications.', impact: 'Sickle cell disease — serious genetic condition.' },
      'AT': { state: 'Heterozygous', text: 'One sickle cell allele. Sickle cell trait — typically asymptomatic and provides strong resistance to falciparum malaria.', impact: 'Malaria resistance (heterozygote advantage). Mild risk under extreme hypoxia.' },
      'TA': { state: 'Heterozygous', text: 'One sickle cell allele. Sickle cell trait — typically asymptomatic and provides strong resistance to falciparum malaria.', impact: 'Malaria resistance (heterozygote advantage). Mild risk under extreme hypoxia.' },
      'AA': { state: 'Ancestral', text: 'Ancestral normal hemoglobin allele. Normal hemoglobin; no malaria resistance from this locus.', impact: 'Normal hemoglobin; no malaria resistance from this locus.' }
    },
    globalFreq: 'Derived allele (T) up to 15-20% in malaria-endemic sub-Saharan Africa; very rare elsewhere.'
  },
  {
    rsid: 'rs4953354',
    gene: 'EPAS1',
    name: 'High-Altitude Adaptation (Tibetan)',
    description: 'Key variant in the hypoxia-inducible factor pathway. The derived allele is highly enriched in Tibetans and helps them live at extreme high altitudes without excessive red blood cell production.',
    interpretations: {
      'CC': { state: 'Derived', text: 'Two copies of the Tibetan high-altitude adaptation allele. Associated with lower hemoglobin levels at high altitude, reducing risk of chronic mountain sickness.', impact: 'Efficient oxygen use at high altitude — typical Tibetan adaptation.' },
      'CG': { state: 'Heterozygous', text: 'One copy of the Tibetan adaptation allele. Intermediate hemoglobin phenotype at high altitude.', impact: 'Partial adaptation; some protection against high-altitude sickness.' },
      'GC': { state: 'Heterozygous', text: 'One copy of the Tibetan adaptation allele. Intermediate hemoglobin phenotype at high altitude.', impact: 'Partial adaptation; some protection against high-altitude sickness.' },
      'GG': { state: 'Ancestral', text: 'Ancestral allele. Common outside of high-altitude populations; higher hemoglobin levels at altitude.', impact: 'Standard hypoxic response; less adaptation to extreme high altitudes.' }
    },
    globalFreq: 'Derived allele (C) ~87% in Tibetans, <1% in Han Chinese, absent in other continental groups.'
  },
  {
    rsid: 'rs16891982',
    gene: 'SLC45A2 / MATP',
    name: 'European Light Skin (L374F)',
    description: 'Major determinant of skin and hair pigmentation in West Eurasians. The derived G allele (Phe374) reduces melanosome acidification, producing lighter skin.',
    globalFreq: 'Derived allele (G) ~98% in Europeans, <1% in Sub-Saharan Africans and East Asians.',
    interpretations: {
      'GG': { state: 'Derived', text: 'Two copies of European light-skin allele (Phe374)', impact: 'Strong skin lightening effect typical of European lineages.' },
      'CG': { state: 'Heterozygous', text: 'Carrier of European light-skin allele', impact: 'Intermediate skin lightening effect.' },
      'GC': { state: 'Heterozygous', text: 'Carrier of European light-skin allele', impact: 'Intermediate skin lightening effect.' },
      'CC': { state: 'Ancestral', text: 'Ancestral Leu374 allele', impact: 'Standard dark pigmentation; predominant in African and Asian populations.' }
    }
  },
  {
    rsid: 'rs174546',
    gene: 'FADS1 / FADS2',
    name: 'Fatty Acid Desaturase Adaptation',
    description: 'Regulates conversion of plant fatty acids to long-chain polyunsaturated fatty acids (PUFAs). Strongly selected in agricultural and cold-climate populations.',
    globalFreq: 'Derived allele (C) ~95% in South Asians, ~70% in Africans, ~60% in Europeans, and <5% in Greenlandic Inuit.',
    interpretations: {
      'CC': { state: 'Derived', text: 'Enhanced PUFA Synthesis Allele', impact: 'Efficient conversion of plant-derived ALA/LA to EPA/DHA; adaptation to plant-based agricultural diets.' },
      'CT': { state: 'Heterozygous', text: 'Intermediate Fatty Acid Metabolism', impact: 'Balanced lipid conversion capacity.' },
      'TC': { state: 'Heterozygous', text: 'Intermediate Fatty Acid Metabolism', impact: 'Balanced lipid conversion capacity.' },
      'TT': { state: 'Ancestral', text: 'Ancestral / Marine Lipid Adaptation', impact: 'Lower endogenous PUFA synthesis; optimized for high-fat marine mammal diets (e.g. Inuit).' }
    }
  },
  {
    rsid: 'rs1229984',
    gene: 'ADH1B',
    name: 'Fast Alcohol Oxidation (His48Arg)',
    description: 'Encodes alcohol dehydrogenase 1B. The derived T allele oxidizes ethanol to toxic acetaldehyde up to 100x faster, linked to ancient rice domestication in East Asia.',
    globalFreq: 'Derived allele (T) ~70-80% in Southeast China and Japan, ~10-20% in Middle East, <1% in Europe and Africa.',
    interpretations: {
      'TT': { state: 'Derived', text: 'Rapid Alcohol Oxidation (Super-Active ADH1B)', impact: 'Converts alcohol to acetaldehyde rapidly; protective against alcoholism, common in East Asia.' },
      'CT': { state: 'Heterozygous', text: 'Accelerated Alcohol Oxidation', impact: 'Intermediate rate of alcohol breakdown.' },
      'TC': { state: 'Heterozygous', text: 'Accelerated Alcohol Oxidation', impact: 'Intermediate rate of alcohol breakdown.' },
      'CC': { state: 'Ancestral', text: 'Standard Alcohol Oxidation', impact: 'Normal ethanol clearance rate typical of European and African lineages.' }
    }
  },
  {
    rsid: 'rs12097901',
    gene: 'EGLN1 / PHD2',
    name: 'Andean High-Altitude Adaptation',
    description: 'Prolyl hydroxylase domain enzyme in the HIF hypoxia pathway. Under strong selection in Quechua and Aymara high-altitude populations in the Andes.',
    globalFreq: 'Derived allele ~50-70% in Andean Indigenous populations, <2% in non-high-altitude populations.',
    interpretations: {
      'GG': { state: 'Derived', text: 'Andean Hypoxia Protection Phenotype', impact: 'Regulates hemoglobin levels under extreme altitude, preventing polycythemia and mountain sickness.' },
      'CG': { state: 'Heterozygous', text: 'Partial High-Altitude Protection', impact: 'Moderate adaptation to low-oxygen environments.' },
      'GC': { state: 'Heterozygous', text: 'Partial High-Altitude Protection', impact: 'Moderate adaptation to low-oxygen environments.' },
      'CC': { state: 'Ancestral', text: 'Standard Lowland Hypoxia Response', impact: 'Standard red blood cell response to altitude.' }
    }
  },
  {
    rsid: 'rs10166942',
    gene: 'TRPM8',
    name: 'Cold Temperature Receptor Adaptation',
    description: 'Transient receptor potential ion channel sensing cold temperature and menthol. The derived T allele has been selected in northern latitudes.',
    globalFreq: 'Derived allele (T) ~85% in Northern Europeans, ~40% in East Asians, ~5% in Sub-Saharan Africans.',
    interpretations: {
      'TT': { state: 'Derived', text: 'Cold Climate Adapted TRPM8 Receptor', impact: 'Associated with adaptation to cold environments and lower baseline migraine susceptibility.' },
      'CT': { state: 'Heterozygous', text: 'Intermediate Cold Sensitivity', impact: 'Moderate cold perception adaptation.' },
      'TC': { state: 'Heterozygous', text: 'Intermediate Cold Sensitivity', impact: 'Moderate cold perception adaptation.' },
      'CC': { state: 'Ancestral', text: 'Ancestral Warm-Climate Receptor', impact: 'Standard thermal sensation common in tropical climates.' }
    }
  },
  {
    rsid: 'rs1050828',
    gene: 'G6PD',
    name: 'G6PD Deficiency (A- Variant / Malaria Protection)',
    description: 'Glucose-6-phosphate dehydrogenase deficiency variant. Reduces red cell survival under oxidative stress, conferring strong resistance to falciparum malaria.',
    globalFreq: 'Derived allele (T) ~10-25% in Sub-Saharan Africa, <1% in Europe and East Asia.',
    interpretations: {
      'TT': { state: 'Derived', text: 'G6PD A- Variant (Malaria Protection)', impact: 'Provides high resistance to falciparum malaria; confers risk of hemolytic anemia with oxidative triggers.' },
      'CT': { state: 'Heterozygous', text: 'G6PD Heterozygous Carrier (Females)', impact: 'Mosaic expression conferring partial malaria protection with low hemolysis risk.' },
      'TC': { state: 'Heterozygous', text: 'G6PD Heterozygous Carrier (Females)', impact: 'Mosaic expression conferring partial malaria protection with low hemolysis risk.' },
      'CC': { state: 'Ancestral', text: 'Normal G6PD Enzyme Activity', impact: 'Standard red blood cell oxidative metabolism; no malaria protection from this locus.' }
    }
  },
  {
    rsid: 'rs1042602',
    gene: 'TYR',
    name: 'Tyrosinase Skin Pigmentation (Ser192Tyr)',
    description: 'Tyrosinase is the rate-limiting enzyme in melanin production. The derived A allele reduces enzyme activity, contributing to lighter skin in Europeans.',
    globalFreq: 'Derived allele (A) ~60% in Europeans, ~40% in South Asians, <2% in East Asians and Sub-Saharan Africans.',
    interpretations: {
      'AA': { state: 'Derived', text: 'European Light Skin Tyrosinase Allele', impact: 'Associated with lighter skin pigmentation and reduced melanin deposition.' },
      'AC': { state: 'Heterozygous', text: 'Intermediate Tyrosinase Activity', impact: 'Moderate skin lightening effect.' },
      'CA': { state: 'Heterozygous', text: 'Intermediate Tyrosinase Activity', impact: 'Moderate skin lightening effect.' },
      'CC': { state: 'Ancestral', text: 'Ancestral Full-Activity Tyrosinase', impact: 'Standard dark melanin synthesis.' }
    }
  },
  {
    rsid: 'rs12821256',
    gene: 'KITLG',
    name: 'Blonde Hair & Fair Skin Regulator',
    description: 'Upstream regulatory enhancer of KIT ligand controlling melanocyte migration. Strongly selected in Northern Europeans for blonde hair and fair skin.',
    globalFreq: 'Derived allele (C) ~70% in Northern Europe, ~5% in the Americas, <1% in Africa and Asia.',
    interpretations: {
      'CC': { state: 'Derived', text: 'Northern European Blonde / Fair Skin Allele', impact: 'Strongly associated with blonde hair and fair skin in European populations.' },
      'TC': { state: 'Heterozygous', text: 'Blonde Hair Trait Carrier', impact: 'Partial lightening effect on hair and skin.' },
      'CT': { state: 'Heterozygous', text: 'Blonde Hair Trait Carrier', impact: 'Partial lightening effect on hair and skin.' },
      'TT': { state: 'Ancestral', text: 'Ancestral Dark Hair / Skin Enhancer', impact: 'Standard dark hair and skin pigmentation.' }
    }
  },
  {
    rsid: 'rs10810640',
    gene: 'BNC2',
    name: 'Skin Saturation & Freckling Variant',
    description: 'Basonuclin 2 regulates skin pigmentation saturation, tanning responsiveness, and freckle formation in West Eurasians.',
    globalFreq: 'Derived allele (G) ~55% in Europeans, ~35% in South Asians, ~30% in East Asians, ~10% in Africans.',
    interpretations: {
      'GG': { state: 'Derived', text: 'Light Skin Saturation & Freckling Allele', impact: 'Associated with fair skin saturation, sun sensitivity, and freckling.' },
      'AG': { state: 'Heterozygous', text: 'Intermediate Freckling & Saturation', impact: 'Moderate effect on tanning and freckle tendency.' },
      'GA': { state: 'Heterozygous', text: 'Intermediate Freckling & Saturation', impact: 'Moderate effect on tanning and freckle tendency.' },
      'AA': { state: 'Ancestral', text: 'Ancestral Darker Saturation Allele', impact: 'Lower freckling propensity and standard tanning capacity.' }
    }
  },
  {
    rsid: 'rs601338',
    gene: 'FUT2',
    name: 'Secretor Status & Norovirus Resistance',
    description: 'Determines mucosal ABO blood group antigen secretion. Derived nonsense mutation (A) produces non-secretor status, granting resistance to GII.4 Norovirus.',
    globalFreq: 'Derived allele (A) ~45% in Europe and East Asia, ~35% in Sub-Saharan Africa.',
    interpretations: {
      'AA': { state: 'Derived', text: 'Non-Secretor Phenotype (Norovirus Resistant)', impact: 'No ABO antigens in saliva/mucosa; strongly protected against most common Norovirus strains.' },
      'GA': { state: 'Heterozygous', text: 'Secretor Phenotype (Carrier)', impact: 'ABO antigens present in body fluids; susceptible to Norovirus infection.' },
      'AG': { state: 'Heterozygous', text: 'Secretor Phenotype (Carrier)', impact: 'ABO antigens present in body fluids; susceptible to Norovirus infection.' },
      'GG': { state: 'Ancestral', text: 'Secretor Phenotype', impact: 'Normal ABO antigen secretion in body fluids.' }
    }
  },
  {
    rsid: 'rs497116',
    gene: 'CASP12',
    name: 'Sepsis Protection (Caspase-12 Loss-of-Function)',
    description: 'Premature stop codon in CASP12 inactivates inflammatory caspase-12. Strongly selected outside Africa to protect against lethal bacterial sepsis.',
    globalFreq: 'Derived allele (T) >98% in Europeans, East Asians, and Indigenous Americans, ~45% in Sub-Saharan Africans.',
    interpretations: {
      'TT': { state: 'Derived', text: 'Inactive Caspase-12 (Sepsis Resistant)', impact: 'Full protection against caspase-12 mediated severe sepsis; near-fixed outside Africa.' },
      'GT': { state: 'Heterozygous', text: 'Partial Sepsis Protection', impact: 'Intermediate inflammatory response to severe infections.' },
      'TG': { state: 'Heterozygous', text: 'Partial Sepsis Protection', impact: 'Intermediate inflammatory response to severe infections.' },
      'GG': { state: 'Ancestral', text: 'Active Caspase-12 (Ancestral Sepsis Risk)', impact: 'Functional enzyme; higher vulnerability to severe septic shock.' }
    }
  },
  {
    rsid: 'rs713598',
    gene: 'TAS2R38',
    name: 'Bitter Taste Sensitivity (PTC Taster Status)',
    description: 'Encodes bitter taste receptor 38. Governs ability to taste glucosinolate bitter compounds in cruciferous vegetables (broccoli, kale).',
    globalFreq: 'Derived allele (G) ~50% in Europeans and Africans, ~70% in East Asians.',
    interpretations: {
      'GG': { state: 'Derived', text: 'Non-Taster Phenotype (AVI Variant)', impact: 'Insensitive to PTC/PROP bitter taste; associated with higher vegetable intake.' },
      'CG': { state: 'Heterozygous', text: 'Intermediate Bitter Taster', impact: 'Moderate sensitivity to bitter plant compounds.' },
      'GC': { state: 'Heterozygous', text: 'Intermediate Bitter Taster', impact: 'Moderate sensitivity to bitter plant compounds.' },
      'CC': { state: 'Ancestral', text: 'High Bitter Taster Phenotype (PAV Variant)', impact: 'Strong sensitivity to PTC bitter compounds; protective against ingesting plant toxins.' }
    }
  },
  {
    rsid: 'rs1800562',
    gene: 'HFE',
    name: 'Celtic Iron Absorption (C282Y Hemochromatosis)',
    description: 'Major genetic variant driving iron hyper-absorption in North-Western Europeans ("Celtic mutation"). Historical adaptation to low-iron agricultural diets.',
    globalFreq: 'Derived allele (A) ~10-15% in Celtic/Irish and Northern Europeans, <1% outside Europe.',
    interpretations: {
      'AA': { state: 'Derived', text: 'Hereditary Hemochromatosis Risk (C282Y Homozygote)', impact: 'High iron absorption capacity; high risk for iron overload without monitoring.' },
      'GA': { state: 'Heterozygous', text: 'Carrier of Celtic Iron Absorption Allele', impact: 'Increased dietary iron absorption capacity without overt disease risk.' },
      'AG': { state: 'Heterozygous', text: 'Carrier of Celtic Iron Absorption Allele', impact: 'Increased dietary iron absorption capacity without overt disease risk.' },
      'GG': { state: 'Ancestral', text: 'Ancestral Standard Iron Absorption', impact: 'Normal iron regulation typical of global non-European populations.' }
    }
  },
  {
    rsid: 'rs738409',
    gene: 'PNPLA3',
    name: 'Fatty Liver & Indigenous American Lipid Adaptation (I148M)',
    description: 'Encodes adiponutrin. The derived G allele (Met148) is under strong selection in Indigenous Americans and Hispanics, predisposing to hepatic lipid storage.',
    globalFreq: 'Derived allele (G) ~45-70% in Indigenous Americans and Hispanics, ~25% in Europeans, ~15% in Africans.',
    interpretations: {
      'GG': { state: 'Derived', text: 'High Hepatic Lipid Storage (PNPLA3 Met148)', impact: 'Adapted for rapid lipid storage; increased susceptibility to fatty liver on high-sugar diets.' },
      'CG': { state: 'Heterozygous', text: 'Intermediate Lipid Storage Capacity', impact: 'Moderate hepatic fat retention.' },
      'GC': { state: 'Heterozygous', text: 'Intermediate Lipid Storage Capacity', impact: 'Moderate hepatic fat retention.' },
      'CC': { state: 'Ancestral', text: 'Standard Hepatic Triglyceride Clearance', impact: 'Ancestral fat metabolism pathway.' }
    }
  },
  {
    rsid: 'rs1801133',
    gene: 'MTHFR',
    name: 'Folate Metabolism & UV Adaptation (C677T)',
    description: 'Thermolabile MTHFR variant regulating methylenetetrahydrofolate reductase activity. T allele is selected in high-UV regions to balance folate breakdown vs. vitamin D.',
    globalFreq: 'Derived allele (T) ~40-50% in Mediterranean Europe and Mesoamerica, ~10-20% in Sub-Saharan Africa.',
    interpretations: {
      'TT': { state: 'Derived', text: 'Reduced MTHFR Activity (~30% of normal)', impact: 'Requires higher dietary folate/methylfolate intake; evolved under UV exposure trade-offs.' },
      'CT': { state: 'Heterozygous', text: 'Moderate MTHFR Activity (~65% of normal)', impact: 'Slightly reduced folate processing capacity.' },
      'TC': { state: 'Heterozygous', text: 'Moderate MTHFR Activity (~65% of normal)', impact: 'Slightly reduced folate processing capacity.' },
      'CC': { state: 'Ancestral', text: 'Optimal MTHFR Enzymatic Function', impact: 'Standard baseline folate conversion.' }
    }
  },
  {
    rsid: 'rs12255372',
    gene: 'TCF7L2',
    name: 'Thrifty Gene Glucose Regulation',
    description: 'Transcription factor in the Wnt signaling pathway. Key thrifty gene candidate under positive selection during ancestral periods of famine.',
    globalFreq: 'Derived allele (T) ~30% in Europeans, ~30% in Africans, ~5% in East Asians.',
    interpretations: {
      'TT': { state: 'Derived', text: 'Thrifty Insulin Expression Variant', impact: 'Adapted for maximum energy conservation during food scarcity; elevates Type 2 Diabetes risk on modern diets.' },
      'GT': { state: 'Heterozygous', text: 'Intermediate Glucose Homeostasis', impact: 'Moderate thrifty gene metabolic response.' },
      'TG': { state: 'Heterozygous', text: 'Intermediate Glucose Homeostasis', impact: 'Moderate thrifty gene metabolic response.' },
      'GG': { state: 'Ancestral', text: 'Ancestral Insulin Secretion Phenotype', impact: 'Baseline insulin response.' }
    }
  },
  {
    rsid: 'rs4680',
    gene: 'COMT',
    name: 'Dopamine Clearance (Warrior vs. Worrier Val158Met)',
    description: 'Catechol-O-methyltransferase enzyme activity. Met158 (A) reduces dopamine breakdown 4-fold, boosting cognitive focus; Val158 (G) increases stress resilience.',
    globalFreq: 'Derived allele (A) ~50% in Europeans, ~30% in East Asians, ~20% in Africans.',
    interpretations: {
      'AA': { state: 'Derived', text: 'Worrier Phenotype (Met/Met - High Dopamine)', impact: 'Superior cognitive focus, memory, and executive processing; higher stress sensitivity.' },
      'GA': { state: 'Heterozygous', text: 'Balanced Warrior-Worrier Profile (Val/Met)', impact: 'Intermediate dopamine clearance; optimal balance of focus and stress resilience.' },
      'AG': { state: 'Heterozygous', text: 'Balanced Warrior-Worrier Profile (Val/Met)', impact: 'Intermediate dopamine clearance; optimal balance of focus and stress resilience.' },
      'GG': { state: 'Ancestral', text: 'Warrior Phenotype (Val/Val - Fast Dopamine Clear)', impact: 'High stress resilience and pain tolerance; lower baseline dopamine levels under non-stress conditions.' }
    }
  },
  {
    rsid: 'rs2228570',
    gene: 'VDR',
    name: 'Vitamin D Receptor High-Latitude Adaptation (FokI)',
    description: 'Vitamin D receptor translation initiation site variant. The F (T) allele produces a shorter, more active VDR protein, selected in high-latitude environments.',
    globalFreq: 'Derived allele (T) ~65% in Europeans, ~55% in East Asians, ~35% in Africans.',
    interpretations: {
      'TT': { state: 'Derived', text: 'Enhanced VDR Transcriptional Activity (FokI F/F)', impact: 'More efficient vitamin D signaling and calcium absorption; high-latitude adaptation.' },
      'CT': { state: 'Heterozygous', text: 'Intermediate VDR Signaling Activity', impact: 'Balanced vitamin D receptor responsiveness.' },
      'TC': { state: 'Heterozygous', text: 'Intermediate VDR Signaling Activity', impact: 'Balanced vitamin D receptor responsiveness.' },
      'CC': { state: 'Ancestral', text: 'Ancestral VDR Protein Length (FokI f/f)', impact: 'Standard baseline vitamin D receptor activation.' }
    }
  },
  {
    rsid: 'rs1042713',
    gene: 'ADRB2',
    name: 'Beta-2 Adrenergic Receptor Energy Expenditure (Arg16Gly)',
    description: 'Regulates bronchodilation, lipolysis, and energy expenditure. Derived Gly16 allele is selected in cold-adapted and agricultural populations.',
    globalFreq: 'Derived allele (G) ~60% in Europeans, ~50% in East Asians, ~40% in Africans.',
    interpretations: {
      'GG': { state: 'Derived', text: 'Enhanced Receptor Down-regulation (Gly16/Gly16)', impact: 'Promotes fat retention and energy conservation; selected in cold climates.' },
      'AG': { state: 'Heterozygous', text: 'Intermediate Adrenergic Responsiveness', impact: 'Balanced lipolysis and airway reactivity.' },
      'GA': { state: 'Heterozygous', text: 'Intermediate Adrenergic Responsiveness', impact: 'Balanced lipolysis and airway reactivity.' },
      'AA': { state: 'Ancestral', text: 'Ancestral High-Lipolysis Phenotype (Arg16/Arg16)', impact: 'Higher baseline energy expenditure and bronchodilator sensitivity.' }
    }
  },
  {
    rsid: 'rs1799983',
    gene: 'NOS3 / eNOS',
    name: 'Nitric Oxide Vasodilation & Altitude Response (Glu298Asp)',
    description: 'Endothelial nitric oxide synthase. Regulates vascular tone, blood flow, and oxygen delivery under hypoxic high-altitude conditions.',
    globalFreq: 'Derived allele (T) ~30-40% in Europeans, ~10% in East Asians, ~5% in Africans.',
    interpretations: {
      'TT': { state: 'Derived', text: 'Modified Endothelial Nitric Oxide Production', impact: 'Altered vascular nitric oxide synthesis and blood pressure regulation.' },
      'GT': { state: 'Heterozygous', text: 'Intermediate Nitric Oxide Synthesis', impact: 'Balanced endothelial vasodilation capacity.' },
      'TG': { state: 'Heterozygous', text: 'Intermediate Nitric Oxide Synthesis', impact: 'Balanced endothelial vasodilation capacity.' },
      'GG': { state: 'Ancestral', text: 'Ancestral High-Activity eNOS Vasodilation', impact: 'Efficient baseline nitric oxide production.' }
    }
  },
  {
    rsid: 'rs1800629',
    gene: 'TNF-alpha',
    name: 'Pro-Inflammatory Immune Response (-308G>A)',
    description: 'Promoter variant altering tumor necrosis factor alpha transcription. The derived A allele increases TNF-alpha levels, providing immunity against malaria.',
    globalFreq: 'Derived allele (A) ~15-20% in Europeans and Africans, ~5% in East Asians.',
    interpretations: {
      'AA': { state: 'Derived', text: 'High TNF-Alpha Inflammatory Response (-308A/A)', impact: 'Robust innate immune response against pathogens; protective against severe malaria.' },
      'GA': { state: 'Heterozygous', text: 'Elevated TNF-Alpha Production', impact: 'Enhanced pathogen clearance with moderate inflammatory response.' },
      'AG': { state: 'Heterozygous', text: 'Elevated TNF-Alpha Production', impact: 'Enhanced pathogen clearance with moderate inflammatory response.' },
      'GG': { state: 'Ancestral', text: 'Ancestral Baseline TNF Transcription', impact: 'Standard baseline inflammatory signaling.' }
    }
  },
  {
    rsid: 'rs1799971',
    gene: 'OPRM1',
    name: 'Mu-Opioid Endorphin Sensitivity (A118G)',
    description: 'Primary mu-opioid receptor variant. G allele reduces receptor density, requiring higher endogenous endorphins for pain relief and social bonding.',
    globalFreq: 'Derived allele (G) ~45-50% in East Asians, ~15-20% in Europeans, ~2-5% in Sub-Saharan Africans.',
    interpretations: {
      'GG': { state: 'Derived', text: 'Reduced Mu-Opioid Receptor Density (118G/G)', impact: 'Altered endorphin binding; higher threshold for physical pain and social rejection.' },
      'AG': { state: 'Heterozygous', text: 'Intermediate Opioid Receptor Binding', impact: 'Moderate endorphin sensitivity.' },
      'GA': { state: 'Heterozygous', text: 'Intermediate Opioid Receptor Binding', impact: 'Moderate endorphin sensitivity.' },
      'AA': { state: 'Ancestral', text: 'Ancestral High-Sensitivity Mu-Opioid Receptor', impact: 'Strong baseline response to endogenous endorphins and opioid analgesics.' }
    }
  },
  {
    rsid: 'rs1800795',
    gene: 'IL6',
    name: 'Interleukin-6 Inflammatory Regulation (-174G>C)',
    description: 'Promoter SNP governing IL-6 cytokine production. Derived C allele lowers systemic inflammation, selected in European long-lived cohorts.',
    globalFreq: 'Derived allele (C) ~40% in Europeans, ~5% in Africans, <1% in East Asians.',
    interpretations: {
      'CC': { state: 'Derived', text: 'Low Systemic IL-6 Production Phenotype', impact: 'Lower baseline inflammation; associated with longevity and cardiovascular protection in Europeans.' },
      'GC': { state: 'Heterozygous', text: 'Intermediate IL-6 Inflammatory Response', impact: 'Balanced cytokine expression.' },
      'CG': { state: 'Heterozygous', text: 'Intermediate IL-6 Inflammatory Response', impact: 'Balanced cytokine expression.' },
      'GG': { state: 'Ancestral', text: 'Ancestral Higher IL-6 Inflammatory Output', impact: 'Robust early immune defense against bacterial pathogens.' }
    }
  },
  {
    rsid: 'rs1815739',
    gene: 'ACTN3',
    name: 'Alpha-Actinin-3 Muscle Performance (R577X)',
    description: 'Fast-twitch muscle fiber protein. Derived T (577X) allele eliminates alpha-actinin-3, favoring endurance and cold survival; ancestral R favors sprint/power.',
    globalFreq: 'Derived allele (T / X) ~55% in Europeans, ~50% in East Asians, ~15% in Sub-Saharan Africans.',
    interpretations: {
      'TT': { state: 'Derived', text: 'Alpha-Actinin-3 Null Phenotype (XX - Endurance)', impact: 'Optimized for endurance efficiency, metabolic economy, and cold tolerance.' },
      'CT': { state: 'Heterozygous', text: 'Balanced Power & Endurance Muscle (RX)', impact: 'Intermediate fast-twitch muscle function.' },
      'TC': { state: 'Heterozygous', text: 'Balanced Power & Endurance Muscle (RX)', impact: 'Intermediate fast-twitch muscle function.' },
      'CC': { state: 'Ancestral', text: 'Full Alpha-Actinin-3 Expression (RR - Sprint/Power)', impact: 'Optimized for explosive sprint, power, and high-force muscle contractions.' }
    }
  },
  {
    rsid: 'rs9939609',
    gene: 'FTO',
    name: 'FTO Thrifty Gene Metabolic Storage',
    description: 'Intronic regulator of IRX3/IRX5 expression in adipocytes. Derived A allele is a classic thrifty gene conferring increased energy storage efficiency.',
    globalFreq: 'Derived allele (A) ~42% in Europeans, ~30% in South Asians, ~15% in West Africans, ~10% in East Asians.',
    interpretations: {
      'AA': { state: 'Derived', text: 'Thrifty Energy Storage Phenotype (A/A)', impact: 'Highly efficient fat storage; evolved to survive famine, predisposing to higher BMI on modern diets.' },
      'AT': { state: 'Heterozygous', text: 'Intermediate Metabolic Storage Efficiency', impact: 'Moderate energy storage propensity.' },
      'TA': { state: 'Heterozygous', text: 'Intermediate Metabolic Storage Efficiency', impact: 'Moderate energy storage propensity.' },
      'TT': { state: 'Ancestral', text: 'Ancestral Lean Metabolic Phenotype (T/T)', impact: 'Lower baseline fat accumulation propensity.' }
    }
  }
];

export const NaiveAncestryOracle = memo(({ 
  results,
  userSnps = {},
  onOpenMethodology
}: { 
  results: any;
  userSnps?: Record<string, string>;
  onOpenMethodology?: () => void;
}) => {
  const [isChartReady, setIsChartReady] = useState(false);
  const [activeImplicationTab, setActiveImplicationTab] = useState<'implications' | 'drivers'>('implications');

  useEffect(() => {
    const timer = setTimeout(() => setIsChartReady(true), 150);
    return () => clearTimeout(timer);
  }, []);

  const naiveEstimates = results?.naiveEstimates || {};
  const hasData = Object.keys(naiveEstimates).length > 0;

  const chartData = useMemo(() => {
    return Object.entries(naiveEstimates).map(([code, value]) => ({
      code,
      name: mapCodeToName(code),
      value: Number(value),
    })).sort((a, b) => b.value - a.value);
  }, [naiveEstimates]);

  const dominantComponent = useMemo(() => {
    if (chartData.length === 0) return null;
    return chartData[0];
  }, [chartData]);

  const minorComponents = useMemo(() => {
    if (chartData.length <= 1) return [];
    return chartData.slice(1).filter(c => c.value >= 10);
  }, [chartData]);

  const matchedDrivers = useMemo(() => {
    return DRIVER_SNPS.map(driver => {
      let genotype = userSnps[driver.rsid] || userSnps[driver.rsid.toLowerCase()] || userSnps[driver.rsid.toUpperCase()];
      if (genotype) {
        genotype = genotype.trim().toUpperCase().replace(/[\s\/_]/g, '');
      }
      const interpretation = genotype ? driver.interpretations[genotype] : null;
      return {
        ...driver,
        userGenotype: genotype || 'Untested/Missing',
        interpretation: interpretation || {
          state: 'Ancestral' as const,
          text: 'Unknown or Untested Locus',
          impact: 'This specific genomic marker could not be resolved from your raw file or is not reported.'
        },
        isMatched: !!interpretation
      };
    }).filter(driver => driver.isMatched);
  }, [userSnps]);

  if (!hasData) {
    return (
      <div className="p-12 text-center text-slate-500 dark:text-slate-400">
        No Naive Ancestry Results Available - Please load and process a valid dataset.
      </div>
    );
  }

  const primaryImplication = dominantComponent ? POPULATION_IMPLICATIONS[dominantComponent.code] : null;

  return (
    <div className="bg-[#111213]/80 backdrop-blur-3xl border border-white/10 rounded-xl sm:rounded-2xl p-3 sm:p-5 shadow-xl text-white space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/5 pb-3">
        <div className="flex items-center gap-3">
          <div className="relative shrink-0">
            <img 
              src="https://writteninthegenome.blog/wp-content/uploads/2026/05/17794114671357483599285632974525.webp" 
              alt="Scout Score"
              className="w-10 h-10 rounded-lg object-cover"
            />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FF6B6B] to-[#FFE66D]">Scout Score</h2>
            <p className="text-[10px] font-bold text-[#4ECDC4] uppercase tracking-widest">Marker Frequency Est.</p>
          </div>
        </div>
        {onOpenMethodology && (
          <button
            onClick={onOpenMethodology}
            className="w-full sm:w-auto shrink-0 px-3.5 py-1.5 bg-white/10 hover:bg-white/20 border border-white/10 text-white font-bold text-xs uppercase tracking-widest rounded-lg transition-all shadow-sm flex items-center justify-center gap-1.5 backdrop-blur"
          >
            <HelpCircle className="w-3.5 h-3.5 text-[#FFE66D]" />
            Methodology
          </button>
        )}
      </div>

      <div className="h-[260px] sm:h-[300px] w-full min-w-0 relative bg-black/20 rounded-xl p-2 border border-white/5">
        {isChartReady ? (
          <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={260} debounce={1}>
            <BarChart data={chartData} layout="vertical" margin={{ left: 0, right: 10, top: 5, bottom: 5 }}>
              <XAxis type="number" hide />
              <YAxis dataKey="name" type="category" width={130} tick={{ fill: '#e2e8f0', fontSize: 11, fontWeight: 600 }} />
              <Tooltip contentStyle={{ backgroundColor: '#111213', borderColor: '#4ECDC4', color: '#fff', borderRadius: '0.75rem', fontSize: '0.75rem' }} />
              <Bar dataKey="value" fill="#4ECDC4" radius={[0, 6, 6, 0]}>
                {chartData.map((entry, index) => {
                  const color = REGION_COLORS[entry.code] || '#4ECDC4';
                  return <Cell key={`cell-${index}`} fill={color} />;
                })}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="w-full h-full bg-slate-900/40 rounded-xl animate-pulse" />
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
        {chartData.map((data) => {
          const color = REGION_COLORS[data.code] || '#FFE66D';
          return (
            <div key={data.name} className="flex justify-between items-center p-2.5 rounded-xl bg-white/5 border border-white/5 hover:border-[#4ECDC4]/50 transition-colors">
              <span className="font-bold text-slate-100 text-xs truncate flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: color }} />
                {data.name}
              </span>
              <span className="font-mono font-bold text-xs sm:text-sm ml-1" style={{ color }}>{(data.value || 0).toFixed(1)}%</span>
            </div>
          );
        })}
      </div>

      {/* Scout Score Implications Bento Area */}
      <div className="border-t border-white/10 pt-4 space-y-4">
        <div className="flex justify-center sm:justify-start">
          <div className="inline-flex bg-white/5 p-1 rounded-2xl border border-white/10 shadow-inner">
            <button
              onClick={() => setActiveImplicationTab('implications')}
              className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 ${
                activeImplicationTab === 'implications'
                  ? 'bg-gradient-to-r from-[#FF6B6B] to-[#FFE66D] text-black shadow-lg font-black'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <History className="w-4 h-4" />
              🧬 Evolutionary Implications
            </button>
            <button
              onClick={() => setActiveImplicationTab('drivers')}
              className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 ${
                activeImplicationTab === 'drivers'
                  ? 'bg-gradient-to-r from-[#FF6B6B] to-[#FFE66D] text-black shadow-lg font-black'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Dna className="w-4 h-4" />
              ⚡ Key Genomic Drivers
            </button>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {activeImplicationTab === 'implications' ? (
            <motion.div
              key="implications"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              {dominantComponent && primaryImplication ? (
                <div className="relative p-6 sm:p-8 rounded-[2rem] bg-white/[0.02] border border-white/10 overflow-hidden shadow-xl">
                  {/* Decorative glowing gradient */}
                  <div className={`absolute -right-24 -top-24 w-80 h-80 bg-gradient-to-br ${primaryImplication.gradient} rounded-full blur-[80px] pointer-events-none opacity-40`} />
                  
                  <div className="relative space-y-4">
                    <span className="px-3 py-1 bg-white/10 text-[#FFE66D] text-[9px] font-black uppercase tracking-widest rounded-full border border-white/10">
                      Primary Genetic Ancestry Signature ({dominantComponent.value.toFixed(1)}%)
                    </span>
                    
                    <div>
                      <h3 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
                        {primaryImplication.title}
                      </h3>
                      <p className="text-xs text-[#4ECDC4] font-bold uppercase tracking-wider mt-0.5">
                        {primaryImplication.subtitle}
                      </p>
                    </div>

                    <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-4xl font-semibold">
                      {primaryImplication.description}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="p-6 rounded-2xl bg-white/5 border border-white/5 text-center text-slate-400 text-xs font-bold uppercase tracking-wider">
                  No dominant ancestry signature resolved.
                </div>
              )}

              {minorComponents.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">
                    Secondary Ancestral Influences (&ge;10%)
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {minorComponents.map(component => {
                      const details = POPULATION_IMPLICATIONS[component.code];
                      if (!details) return null;
                      const color = REGION_COLORS[component.code] || '#FFE66D';
                      return (
                        <div key={component.code} className="p-5 rounded-2xl bg-white/[0.01] border border-white/5 hover:border-white/10 transition-colors flex flex-col justify-between gap-3">
                          <div>
                            <div className="flex items-center justify-between gap-2 mb-1.5">
                              <span className="font-bold text-white text-sm flex items-center gap-2">
                                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: color }} />
                                {details.title}
                              </span>
                              <span className="font-mono font-black text-sm" style={{ color }}>
                                {component.value.toFixed(1)}%
                              </span>
                            </div>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-2">
                              {details.subtitle}
                            </p>
                            <p className="text-[11px] text-slate-400 leading-relaxed font-semibold">
                              {details.description}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="drivers"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              <div className="p-4 rounded-2xl bg-teal-500/5 border border-teal-500/10 flex items-start gap-3">
                <Info className="w-4 h-4 text-[#4ECDC4] mt-0.5 shrink-0" />
                <div>
                  <h4 className="font-extrabold text-[#4ECDC4] text-xs uppercase tracking-wider mb-0.5">Matched High-Impact Selection Loci ({matchedDrivers.length})</h4>
                  <p className="text-slate-400 text-[11px] font-semibold leading-relaxed">
                    Displaying {matchedDrivers.length} matched evolutionary selection markers present in your raw DNA file out of 36 tracked driver loci.
                  </p>
                </div>
              </div>

              {matchedDrivers.length === 0 ? (
                <div className="p-8 text-center bg-black/20 border border-white/5 rounded-2xl text-slate-400 text-xs">
                  No tested High-Impact Selection Loci were identified in your uploaded raw DNA file.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {matchedDrivers.map(driver => {
                  const hasGenotype = driver.isMatched;
                  const stateColors = {
                    Derived: 'bg-[#4ECDC4]/10 border-[#4ECDC4]/20 text-[#4ECDC4]',
                    Ancestral: 'bg-blue-500/10 border-blue-500/20 text-blue-400',
                    Heterozygous: 'bg-[#FFE66D]/10 border-[#FFE66D]/20 text-[#FFE66D]'
                  };
                  const activeStyle = stateColors[driver.interpretation.state] || stateColors.Ancestral;

                  return (
                    <div
                      key={driver.rsid}
                      className={`p-5 rounded-2xl border transition-all duration-300 ${
                        hasGenotype
                          ? 'bg-white/[0.02] border-white/10 hover:border-[#4ECDC4]/30 shadow-md'
                          : 'bg-black/10 border-white/5 opacity-55 hover:opacity-80'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3 mb-2.5">
                        <div>
                          <h4 className="font-extrabold text-white text-xs sm:text-sm tracking-tight">{driver.name}</h4>
                          <span className="font-mono text-[9px] font-bold text-slate-500 mt-0.5 block dark:text-slate-400">
                            {driver.gene} &bull; {driver.rsid}
                          </span>
                        </div>
                        {hasGenotype ? (
                          <div className="flex flex-col items-end gap-1.5 shrink-0">
                            <span className="font-mono font-black text-sm px-2.5 py-0.5 rounded-lg bg-white/10 border border-white/10 text-white">
                              {driver.userGenotype}
                            </span>
                            <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded border ${activeStyle}`}>
                              {driver.interpretation.state}
                            </span>
                          </div>
                        ) : (
                          <span className="text-[9px] font-bold text-slate-500 bg-white/5 border border-white/5 px-2 py-0.5 rounded dark:text-slate-400">
                            Untested
                          </span>
                        )}
                      </div>

                      <p className="text-[11px] text-slate-400 font-semibold leading-relaxed mb-3">
                        {driver.description}
                      </p>

                      <div className="space-y-2.5 pt-2.5 border-t border-white/5">
                        <div>
                          <span className="text-[8px] font-black uppercase tracking-widest text-[#FFE66D] block mb-0.5">Genetic Impact</span>
                          <p className="text-[11px] text-slate-200 font-medium leading-relaxed">
                            {driver.interpretation.impact}
                          </p>
                        </div>
                        <div>
                          <span className="text-[8px] font-black uppercase tracking-widest text-slate-500 block mb-0.5 dark:text-slate-400">Global Frequency</span>
                          <p className="text-[10px] text-slate-400 font-semibold leading-relaxed">
                            {driver.globalFreq}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
});
