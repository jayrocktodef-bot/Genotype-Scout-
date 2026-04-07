import { ANCHOR_AIMS } from './anchorAims';

export interface SNP {
  markerId: string; // Can be rsid or locus name
  rsid?: string;
  aliases?: string[];
  gene: string;
  trait: string;
  continent: string;
  subpop?: string | null;
  description: string;
  alleles: string[];
  significance: 'High' | 'Medium' | 'Low';
  category: 'Health' | 'Ancestry' | 'Lifestyle' | 'Nutrition' | 'Performance';
  interpretations?: Record<string, string>;
  referenceUrl?: string;
  frequencies?: Record<string, number>;
}

export const SNP_DB: SNP[] = [
  { markerId: "rs2862", rsid: "rs2862", gene: "FMO3", trait: "African Ancestry Marker", continent: "African", category: "Ancestry", significance: "Medium", alleles: ["A"], description: "A variant found at higher frequencies in populations of African descent.", referenceUrl: "https://www.snpedia.com/index.php/Rs2862" },
  { markerId: "rs1129038", rsid: "rs1129038", gene: "SLC14A2", trait: "African Ancestry Marker", continent: "African", category: "Ancestry", significance: "Medium", alleles: ["T"], description: "A variant associated with African ancestry and kidney function adaptation.", referenceUrl: "https://www.snpedia.com/index.php/Rs1129038" },
  { markerId: "rs3827760", rsid: "rs3827760", gene: "EDAR", category: "Ancestry", trait: "Thick straight hair, shovel-shaped incisors, denser sweat glands, reduced chin protrusion", continent: "Native American", alleles: ["C"], significance: "High", description: "Near-absent in African and European populations. Pre-contact Native American frequency likely near 100%; modern AMR figures reflect European admixture. Strong positive selection signal — one of the highest FST values genome-wide.", frequencies: {"AFR":0.01,"EUR":0.00,"EAS":0.87,"AMR_admixed":0.65,"Native_American_unadmixed":0.95,"SAS":0.07}, referenceUrl: "https://www.biorxiv.org/content/10.1101/813063v1.full" },
  { markerId: "rs75493593", rsid: "rs75493593", gene: "SLC16A11", category: "Health", trait: "Type 2 diabetes risk — P443T", continent: "Native American", alleles: ["A"], significance: "High", description: "Each haplotype copy confers ~20% increased T2D risk. Risk stronger in lean individuals (BMI <35). Neanderthal introgression origin confirmed by archaic genome analysis.", frequencies: {"AFR":0.02,"EUR":0.02,"EAS":0.10,"AMR_admixed":0.30,"Native_American_unadmixed":0.50,"SAS":0.03}, referenceUrl: "https://www.nature.com/articles/nature12828" },
  { markerId: "rs13342692", rsid: "rs13342692", gene: "SLC16A11", category: "Health", trait: "Type 2 diabetes risk — D127G missense", continent: "Native American", alleles: ["A"], significance: "High", description: "Co-segregates on same haplotype as rs75493593; highest individual association signal in SIGMA GWAS", frequencies: {"AFR":0.02,"EUR":0.02,"EAS":0.10,"AMR_admixed":0.30,"Native_American_unadmixed":0.50,"SAS":0.03}, referenceUrl: "https://www.nature.com/articles/nature12828" },
  { markerId: "rs117767867", rsid: "rs117767867", gene: "SLC16A11", category: "Health", trait: "Type 2 diabetes risk — V113I missense", continent: "Native American", alleles: ["T"], significance: "High", description: "Part of the 4-missense-SNP SLC16A11 risk haplotype; rare outside Native American and East Asian populations", frequencies: {"AFR":0.01,"EUR":0.01,"EAS":0.09,"AMR_admixed":0.28,"Native_American_unadmixed":0.48,"SAS":0.02}, referenceUrl: "https://www.nature.com/articles/nature12828" },
  { markerId: "rs75418188", rsid: "rs75418188", gene: "SLC16A11", category: "Health", trait: "Type 2 diabetes risk — G40S missense", continent: "Native American", alleles: ["A"], significance: "High", description: "Third missense variant in the SLC16A11 haplotype block; functionally tolerated per SIFT", frequencies: {"AFR":0.02,"EUR":0.02,"EAS":0.10,"AMR_admixed":0.29,"Native_American_unadmixed":0.49,"SAS":0.03}, referenceUrl: "https://www.nature.com/articles/nature12828" },
  { markerId: "rs13342232", rsid: "rs13342232", gene: "SLC16A11", category: "Health", trait: "Type 2 diabetes risk — silent mutation", continent: "Native American", alleles: ["G"], significance: "High", description: "Silent variant but strongest GWAS signal due to LD with all four missense SNPs; used as primary tag in Mexican/Latin American studies", frequencies: {"AFR":0.02,"EUR":0.02,"EAS":0.10,"AMR_admixed":0.30,"Native_American_unadmixed":0.50,"SAS":0.03}, referenceUrl: "https://www.nature.com/articles/nature12828" },
  { markerId: "rs9282541", rsid: "rs9282541", gene: "ABCA1", category: "Health", trait: "Low HDL cholesterol; type 2 diabetes and obesity risk", continent: "Native American", alleles: ["T"], significance: "High", description: "Non-synonymous variant; associated with impaired lipid transport and T2D in Native American and Latin American cohorts; nearly absent elsewhere", frequencies: {"AFR":0.01,"EUR":0.01,"EAS":0.00,"AMR_admixed":0.09,"Native_American_unadmixed":0.15,"SAS":0.01}, referenceUrl: "https://www.snpedia.com/index.php/Rs9282541" },
  { markerId: "rs10811661", rsid: "rs10811661", gene: "CDKN2A/CDKN2B", category: "Health", trait: "Type 2 diabetes susceptibility", continent: "Native American", alleles: ["T"], significance: "Medium", description: "Risk allele is the common allele globally; confirmed in Maya population as T2D risk factor", frequencies: {"AFR":0.86,"EUR":0.82,"EAS":0.60,"AMR_admixed":0.75,"Native_American_unadmixed":0.80,"SAS":0.73}, referenceUrl: "https://www.snpedia.com/index.php/Rs10811661" },
  { markerId: "rs5219", rsid: "rs5219", gene: "KCNJ11", category: "Health", trait: "Type 2 diabetes — E23K variant", continent: "Native American", alleles: ["T"], significance: "Medium", description: "Common globally but studied specifically in Maya and Latin American Native American cohorts for T2D association", frequencies: {"AFR":0.36,"EUR":0.47,"EAS":0.45,"AMR_admixed":0.44,"Native_American_unadmixed":0.46,"SAS":0.42}, referenceUrl: "https://www.snpedia.com/index.php/Rs5219" },
  { markerId: "rs1111875", rsid: "rs1111875", gene: "HHEX", category: "Health", trait: "Type 2 diabetes — pancreatic development", continent: "Native American", alleles: ["C"], significance: "Medium", description: "Moderately differentiated; elevated risk allele frequency in East Asian and Native American populations", frequencies: {"AFR":0.54,"EUR":0.56,"EAS":0.68,"AMR_admixed":0.60,"Native_American_unadmixed":0.65,"SAS":0.63}, referenceUrl: "https://www.snpedia.com/index.php/Rs1111875" },
  { markerId: "rs13266634", rsid: "rs13266634", gene: "SLC30A8", category: "Health", trait: "Type 2 diabetes — zinc transporter ZnT8", continent: "Native American", alleles: ["C"], significance: "Medium", description: "Risk allele elevated in East Asian and Native American populations vs. African", frequencies: {"AFR":0.25,"EUR":0.69,"EAS":0.75,"AMR_admixed":0.58,"Native_American_unadmixed":0.65,"SAS":0.60}, referenceUrl: "https://www.snpedia.com/index.php/Rs13266634" },
  { markerId: "rs10954737", rsid: "rs10954737", gene: "IRF5", category: "Ancestry", trait: "Native American ancestry differentiation marker", continent: "Native American", alleles: ["A"], significance: "Medium", description: "The only SNP of 170 in the combined Kidd+Seldin panel missing from 1000 Genomes; noted as especially informative for distinguishing Native Americans from other populations including East Asians", frequencies: {"AFR":0.35,"EUR":0.62,"EAS":0.20,"AMR_admixed":0.55,"Native_American_unadmixed":0.80,"SAS":0.45}, referenceUrl: "https://www.snpedia.com/index.php/Rs10954737" },
  { markerId: "rs1426654", rsid: "rs1426654", gene: "SLC24A5", category: "Ancestry", trait: "Skin lightening — inverse Native American marker", continent: "Native American", alleles: ["A"], significance: "High", description: "One of the highest FST SNPs between EUR and non-EUR. Native American frequency near 0% pre-contact; modern AMR elevation reflects European admixture. Useful inverse marker — presence signals European admixture.", frequencies: {"AFR":0.04,"EUR":0.99,"EAS":0.03,"AMR_admixed":0.55,"Native_American_unadmixed":0.02,"SAS":0.96}, referenceUrl: "https://www.snpedia.com/index.php/Rs1426654" },
  { markerId: "rs16891982", rsid: "rs16891982", gene: "SLC45A2", category: "Ancestry", trait: "Lighter skin, hair, and eye pigmentation — European-specific", continent: "Native American", alleles: ["G"], significance: "High", description: "Near-absent in Native Americans; strong inverse AIM. Useful for detecting European admixture in Native American genomes.", frequencies: {"AFR":0.02,"EUR":0.93,"EAS":0.02,"AMR_admixed":0.30,"Native_American_unadmixed":0.01,"SAS":0.09}, referenceUrl: "https://www.snpedia.com/index.php/Rs16891982" },
  { markerId: "rs1800404", rsid: "rs1800404", gene: "OCA2", category: "Ancestry", trait: "Pigmentation — European vs. East Asian/Native American differentiation", continent: "Native American", alleles: ["T"], significance: "Medium", description: "T allele elevated in East Asian and Native American populations; part of Seldin 93-AIM panel", frequencies: {"AFR":0.55,"EUR":0.30,"EAS":0.70,"AMR_admixed":0.58,"Native_American_unadmixed":0.72,"SAS":0.50}, referenceUrl: "https://www.snpedia.com/index.php/Rs1800404" },
  { markerId: "rs1800562", rsid: "rs1800562", gene: "HFE", category: "Health", trait: "Hereditary hemochromatosis — C282Y; near-absent in Native Americans", continent: "Native American", alleles: ["A"], significance: "High", description: "Essentially absent in Native American populations; useful inverse marker. Presence of this allele is a strong signal of European ancestry in admixed individuals.", frequencies: {"AFR":0.00,"EUR":0.06,"EAS":0.00,"AMR_admixed":0.02,"Native_American_unadmixed":0.00,"SAS":0.00}, referenceUrl: "https://www.snpedia.com/index.php/Rs1800562" },
  { markerId: "rs1800961", rsid: "rs1800961", gene: "HNF4A", category: "Health", trait: "Type 2 diabetes — MODY1-related hepatocyte nuclear factor", continent: "Native American", alleles: ["T"], significance: "Medium", description: "Low-frequency variant globally but modestly elevated in East Asian and Native American populations; affects hepatic glucose metabolism", frequencies: {"AFR":0.03,"EUR":0.03,"EAS":0.07,"AMR_admixed":0.05,"Native_American_unadmixed":0.08,"SAS":0.04}, referenceUrl: "https://www.snpedia.com/index.php/Rs1800961" },
  { markerId: "rs12779790", rsid: "rs12779790", gene: "CDC123/CAMK1D", category: "Health", trait: "Type 2 diabetes susceptibility", continent: "Native American", alleles: ["G"], significance: "Medium", description: "Risk allele modestly elevated in East Asian and Native American populations", frequencies: {"AFR":0.12,"EUR":0.18,"EAS":0.28,"AMR_admixed":0.22,"Native_American_unadmixed":0.28,"SAS":0.22}, referenceUrl: "https://www.snpedia.com/index.php/Rs12779790" },
  { markerId: "rs4833103", rsid: "rs4833103", gene: "intergenic", category: "Ancestry", trait: "Native American vs. African ancestry differentiation", continent: "Native American", alleles: ["A"], significance: "Medium", description: "High AFR frequency vs. low Native American frequency makes this useful for AFR vs. AMR discrimination in admixed individuals", frequencies: {"AFR":0.72,"EUR":0.20,"EAS":0.15,"AMR_admixed":0.25,"Native_American_unadmixed":0.12,"SAS":0.18}, referenceUrl: "https://www.snpedia.com/index.php/Rs4833103" },

  { markerId: "rs622682", rsid: "rs622682", gene: "Unknown", trait: "African Ancestry Marker", continent: "African", subpop: null, alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for general African ancestry.", frequencies: {"AFR":0.909,"EUR":0.347} },
  { markerId: "rs1545397_AF", rsid: "rs1545397", gene: "OCA2", trait: "African Ancestry Marker", continent: "African", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for African populations.", frequencies: {"AFR":0.9,"AMR":0.05,"EAS":0.02,"EUR":0.02,"SAS":0.05,"MENA":0.05} },
  { markerId: "rs1042602_AF", rsid: "rs1042602", gene: "TYR", trait: "African Ancestry Marker", continent: "African", alleles: ["C"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for African populations.", frequencies: {"AFR":0.95,"AMR":0.05,"EAS":0.05,"EUR":0.05,"SAS":0.1,"MENA":0.1} },
  { markerId: "rs3340", rsid: "rs3340", gene: "TAS2R38", trait: "African Bitter Taste", continent: "African", category: "Ancestry", significance: "Medium", alleles: ["A"], description: "A variant in the bitter taste receptor gene found at different frequencies in African populations.", referenceUrl: "https://www.snpedia.com/index.php/Rs3340" },
  { markerId: "M91", aliases: ["rs2534636"], gene: "Y-DNA", trait: "Haplogroup A (root)", continent: "African", category: "Ancestry", significance: "High", alleles: ["T"], description: "One of the oldest paternal lineages, found primarily in Africa." },
  { markerId: "P97", gene: "Y-DNA", trait: "Haplogroup A0", continent: "African", category: "Ancestry", significance: "High", alleles: ["T"], description: "Cameroon; rare." },
  { markerId: "M31", aliases: ["rs9786088"], gene: "Y-DNA", trait: "Haplogroup A1a", continent: "African", category: "Ancestry", significance: "High", alleles: ["G"], description: "Defining marker for Haplogroup A1a." },
  { markerId: "P108", gene: "Y-DNA", trait: "Haplogroup A1b", continent: "African", category: "Ancestry", significance: "High", alleles: ["T"], description: "Defining marker for Haplogroup A1b." },
  { markerId: "M6", aliases: ["rs9786112"], gene: "Y-DNA", trait: "Haplogroup A2", continent: "African", category: "Ancestry", significance: "High", alleles: ["G"], description: "Defining marker for Haplogroup A2." },
  { markerId: "P28", gene: "Y-DNA", trait: "Haplogroup A2", continent: "African", category: "Ancestry", significance: "High", alleles: ["T"], description: "Defining marker for Haplogroup A2." },
  { markerId: "M32", aliases: ["rs9786096"], gene: "Y-DNA", trait: "Haplogroup A3", continent: "African", category: "Ancestry", significance: "High", alleles: ["T"], description: "Defining marker for Haplogroup A3." },
  { markerId: "M28", gene: "Y-DNA", trait: "Haplogroup A3a", continent: "African", category: "Ancestry", significance: "High", alleles: ["T"], description: "Defining marker for Haplogroup A3a." },
  { markerId: "M220", gene: "Y-DNA", trait: "Haplogroup A3b", continent: "African", category: "Ancestry", significance: "High", alleles: ["T"], description: "Defining marker for Haplogroup A3b." },
  { markerId: "M51", gene: "Y-DNA", trait: "Haplogroup A3b1", continent: "African", category: "Ancestry", significance: "High", alleles: ["T"], description: "Defining marker for Haplogroup A3b1." },
  { markerId: "M13", gene: "Y-DNA", trait: "Haplogroup A3b2", continent: "African", category: "Ancestry", significance: "High", alleles: ["T"], description: "Defining marker for Haplogroup A3b2." },
  { markerId: "M171", gene: "Y-DNA", trait: "Haplogroup A3b2", continent: "African", category: "Ancestry", significance: "High", alleles: ["T"], description: "Defining marker for Haplogroup A3b2." },
  { markerId: "M60", aliases: ["rs9786082","i4000006"], gene: "Y-DNA", trait: "Haplogroup B (root)", continent: "African", category: "Ancestry", significance: "High", alleles: ["T"], description: "One of the two deepest Y-DNA branches; found almost exclusively in African hunter-gatherer populations." },
  { markerId: "M181", aliases: ["rs9786208"], gene: "Y-DNA", trait: "Haplogroup B2", continent: "African", category: "Ancestry", significance: "High", alleles: ["A"], description: "Defining marker for Haplogroup B2." },
  { markerId: "M112", aliases: ["rs9786154","i4000027"], gene: "Y-DNA", trait: "Haplogroup B2a", continent: "African", category: "Ancestry", significance: "High", alleles: ["T"], description: "Defining marker for Haplogroup B2a." },
  { markerId: "M115", gene: "Y-DNA", trait: "Haplogroup B2a1", continent: "African", category: "Ancestry", significance: "High", alleles: ["C"], description: "Defining marker for Haplogroup B2a1." },
  { markerId: "P85", gene: "Y-DNA", trait: "Haplogroup B2b", continent: "African", category: "Ancestry", significance: "High", alleles: ["C"], description: "Defining marker for Haplogroup B2b." },
  { markerId: "P90", gene: "Y-DNA", trait: "Haplogroup B2b", continent: "African", category: "Ancestry", significance: "High", alleles: ["T"], description: "Defining marker for Haplogroup B2b." },
  { markerId: "M150", aliases: ["i4000009"], gene: "Y-DNA", trait: "Haplogroup B2b1", continent: "African", category: "Ancestry", significance: "High", alleles: ["C"], description: "Defining marker for Haplogroup B2b1." },
  { markerId: "M152", gene: "Y-DNA", trait: "Haplogroup B2b2", continent: "African", category: "Ancestry", significance: "High", alleles: ["A"], description: "Defining marker for Haplogroup B2b2." },
  { markerId: "P29", aliases: ["rs17306671"], gene: "Y-DNA", trait: "Haplogroup E (root, parallel)", continent: "African", category: "Ancestry", significance: "High", alleles: ["T"], description: "Defining marker for Haplogroup E." },
  { markerId: "M96", aliases: ["rs9305854","i4000014","rs3900"], gene: "Y-DNA", trait: "Haplogroup E (root)", continent: "African", category: "Ancestry", significance: "High", alleles: ["A","C"], description: "Largest and most diverse African haplogroup; subclades found across Africa, the Middle East, and Europe." },
  { markerId: "M33", aliases: ["rs9786107","i4000016"], gene: "Y-DNA", trait: "Haplogroup E1a", continent: "African", category: "Ancestry", significance: "High", alleles: ["A"], description: "Defining marker for Haplogroup E1a." },
  { markerId: "M132", gene: "Y-DNA", trait: "Haplogroup E1a1", continent: "African", category: "Ancestry", significance: "High", alleles: ["T"], description: "Defining marker for Haplogroup E1a1." },
  { markerId: "M2", aliases: ["rs9786172","i4000012","rs3904"], gene: "Y-DNA", trait: "Haplogroup E1b1a", continent: "African", category: "Ancestry", significance: "High", alleles: ["G","C","A"], description: "Major West/Central African marker; well covered on all arrays." },
  { markerId: "M180", aliases: ["rs9786207"], gene: "Y-DNA", trait: "Haplogroup E1b1a1", continent: "African", category: "Ancestry", significance: "High", alleles: ["T"], description: "Defining marker for Haplogroup E1b1a1." },
  { markerId: "U175", aliases: ["rs34195338"], gene: "Y-DNA", trait: "Haplogroup E1b1a1a1", continent: "African", category: "Ancestry", significance: "High", alleles: ["T"], description: "Defining marker for Haplogroup E1b1a1a1." },
  { markerId: "U174", aliases: ["rs34166788"], gene: "Y-DNA", trait: "Haplogroup E1b1a1a1a", continent: "African", category: "Ancestry", significance: "High", alleles: ["A"], description: "Defining marker for Haplogroup E1b1a1a1a." },
  { markerId: "M191", aliases: ["rs9786219","i4000033"], gene: "Y-DNA", trait: "Haplogroup E1b1a1a1a1", continent: "African", category: "Ancestry", significance: "High", alleles: ["C"], description: "Major West African; Yoruba, Igbo, etc." },
  { markerId: "P86", gene: "Y-DNA", trait: "Haplogroup E1b1a1a1a1", continent: "African", category: "Ancestry", significance: "High", alleles: ["T"], description: "Co-defines with M191." },
  { markerId: "L485", gene: "Y-DNA", trait: "Haplogroup E1b1a1a1a1a", continent: "African", category: "Ancestry", significance: "High", alleles: ["T"], description: "Defining marker for Haplogroup E1b1a1a1a1a." },
  { markerId: "U290", gene: "Y-DNA", trait: "Haplogroup E1b1a1a1a2", continent: "African", category: "Ancestry", significance: "High", alleles: ["T"], description: "Defining marker for Haplogroup E1b1a1a1a2." },
  { markerId: "U181", gene: "Y-DNA", trait: "Haplogroup E1b1a1a1a3", continent: "African", category: "Ancestry", significance: "High", alleles: ["T"], description: "Defining marker for Haplogroup E1b1a1a1a3." },
  { markerId: "M154", gene: "Y-DNA", trait: "Haplogroup E1b1a1a1b", continent: "African", category: "Ancestry", significance: "High", alleles: ["T"], description: "Defining marker for Haplogroup E1b1a1a1b." },
  { markerId: "M58", gene: "Y-DNA", trait: "Haplogroup E1b1a1a2", continent: "African", category: "Ancestry", significance: "High", alleles: ["T"], description: "Defining marker for Haplogroup E1b1a1a2." },
  { markerId: "M149", gene: "Y-DNA", trait: "Haplogroup E1b1a1a4", continent: "African", category: "Ancestry", significance: "High", alleles: ["T"], description: "Defining marker for Haplogroup E1b1a1a4." },
  { markerId: "M155", gene: "Y-DNA", trait: "Haplogroup E1b1a1a5", continent: "African", category: "Ancestry", significance: "High", alleles: ["T"], description: "Defining marker for Haplogroup E1b1a1a5." },
  { markerId: "M10", gene: "Y-DNA", trait: "Haplogroup E1b1a1a6", continent: "African", category: "Ancestry", significance: "High", alleles: ["T"], description: "Defining marker for Haplogroup E1b1a1a6." },
  { markerId: "M200", gene: "Y-DNA", trait: "Haplogroup E1b1a1a7", continent: "African", category: "Ancestry", significance: "High", alleles: ["T"], description: "Defining marker for Haplogroup E1b1a1a7." },
  { markerId: "V38", aliases: ["rs372947788"], gene: "Y-DNA", trait: "Haplogroup E1b1a2", continent: "African", category: "Ancestry", significance: "High", alleles: ["T"], description: "Parallel root to U175 branch." },
  { markerId: "M215", aliases: ["rs28357984"], gene: "Y-DNA", trait: "Haplogroup E1b1b (root)", continent: "African", category: "Ancestry", significance: "High", alleles: ["A"], description: "Defining marker for Haplogroup E1b1b." },
  { markerId: "M35", aliases: ["rs28357984","i4000018","rs9306842"], gene: "Y-DNA", trait: "Haplogroup E1b1b1", continent: "African", category: "Ancestry", significance: "High", alleles: ["A","T","G"], description: "Often co-listed with M215; same position in many databases." },
  { markerId: "V68", aliases: ["rs147571223"], gene: "Y-DNA", trait: "Haplogroup E1b1b1a", continent: "African", category: "Ancestry", significance: "High", alleles: ["A"], description: "Defining marker for Haplogroup E1b1b1a." },
  { markerId: "V12", aliases: ["rs148064093"], gene: "Y-DNA", trait: "Haplogroup E1b1b1a1a", continent: "African", category: "Ancestry", significance: "High", alleles: ["C"], description: "Defining marker for Haplogroup E1b1b1a1a." },
  { markerId: "V22", aliases: ["rs149747468"], gene: "Y-DNA", trait: "Haplogroup E1b1b1a1c", continent: "African", category: "Ancestry", significance: "High", alleles: ["G"], description: "Defining marker for Haplogroup E1b1b1a1c." },
  { markerId: "V32", aliases: ["rs200867114"], gene: "Y-DNA", trait: "Haplogroup E1b1b1a2", continent: "African", category: "Ancestry", significance: "High", alleles: ["T"], description: "Ethiopia/Cushitic." },
  { markerId: "V264", gene: "Y-DNA", trait: "Haplogroup E1b1b1a3", continent: "African", category: "Ancestry", significance: "High", alleles: ["T"], description: "Defining marker for Haplogroup E1b1b1a3." },
  { markerId: "L19", gene: "Y-DNA", trait: "Haplogroup E1b1b1b", continent: "African", category: "Ancestry", significance: "High", alleles: ["T"], description: "Defining marker for Haplogroup E1b1b1b." },
  { markerId: "M293", gene: "Y-DNA", trait: "Haplogroup E1b1b1d", continent: "African", category: "Ancestry", significance: "High", alleles: ["T"], description: "East African clade." },
  { markerId: "M329", gene: "Y-DNA", trait: "Haplogroup E1b1b1e", continent: "African", category: "Ancestry", significance: "High", alleles: ["T"], description: "Ethiopian-specific." },
  { markerId: "P72", gene: "Y-DNA", trait: "Haplogroup E1c", continent: "African", category: "Ancestry", significance: "High", alleles: ["T"], description: "Defining marker for Haplogroup E1c." },
  { markerId: "M35.1", gene: "Y-DNA", trait: "Haplogroup E1c root", continent: "African", category: "Ancestry", significance: "High", alleles: ["T"], description: "Congo Basin." },
  { markerId: "M75", aliases: ["rs9786142","i4000022"], gene: "Y-DNA", trait: "Haplogroup E2", continent: "African", category: "Ancestry", significance: "High", alleles: ["G"], description: "Defining marker for Haplogroup E2." },
  { markerId: "M54", gene: "Y-DNA", trait: "Haplogroup E2a", continent: "African", category: "Ancestry", significance: "High", alleles: ["C"], description: "Defining marker for Haplogroup E2a." },
  { markerId: "rs73885319", rsid: "rs73885319", gene: "APOL1", trait: "APOL1 Kidney Disease Risk (G1)", continent: "African", category: "Health", significance: "High", alleles: ["G"], description: "Associated with an increased risk of chronic kidney disease in individuals of African ancestry.", referenceUrl: "https://www.snpedia.com/index.php/Rs73885319" },
  { markerId: "rs11887534", rsid: "rs11887534", gene: "BCL11A", trait: "Fetal Hemoglobin Levels", continent: "African", category: "Health", significance: "Medium", alleles: ["C"], description: "Associated with fetal hemoglobin levels; common in African populations and relevant for sickle cell disease severity.", referenceUrl: "https://www.snpedia.com/index.php/Rs11887534" },
  { markerId: "rs73885319", rsid: "rs73885319", gene: "APOL1", trait: "Kidney Disease Risk (G1)", continent: "African", category: "Health", significance: "High", alleles: ["G"], description: "Common in West African ancestry; provides protection against sleeping sickness but increases risk of chronic kidney disease.", interpretations: {"GG":"High risk: Two copies of the G1 risk variant.","AG":"Carrier: One copy of the G1 risk variant.","AA":"Normal risk: No copies of the G1 risk variant."}, referenceUrl: "https://www.snpedia.com/index.php/Rs73885319" },
  { markerId: "rs60910145", rsid: "rs60910145", gene: "APOL1", trait: "Kidney Disease Risk (G2)", continent: "African", category: "Health", significance: "High", alleles: ["6bp deletion"], description: "The G2 risk variant for chronic kidney disease, common in West African populations.", interpretations: {"DD":"High risk: Two copies of the G2 deletion variant.","ID":"Carrier: One copy of the G2 deletion variant.","II":"Normal risk: No copies of the G2 deletion variant."} },
  { markerId: "rs10456218_Akan", rsid: "rs10456218", gene: "Unknown", trait: "Akan Ancestry Marker", continent: "African", subpop: "Akan", alleles: ["G"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Akan populations (Ghana/Ivory Coast).", frequencies: {"AFR":0.98,"AMR":0.05,"EAS":0,"EUR":0,"SAS":0,"MENA":0} },
  { markerId: "rs10456221_Amhara", rsid: "rs10456221", gene: "Unknown", trait: "Amhara Ancestry Marker", continent: "African", subpop: "Amhara", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Amhara populations (Ethiopia).", frequencies: {"AFR":0.65,"AMR":0.01,"EAS":0,"EUR":0.1,"SAS":0.1,"MENA":0.35} },
  { markerId: "rs1426657_Amhara", rsid: "rs1426657", gene: "SLC24A5", trait: "Amhara Ancestry Marker", continent: "African", subpop: "Amhara", alleles: ["G"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Amhara populations (Ethiopia).", frequencies: {"AFR":0.75,"AMR":0.05,"EAS":0.01,"EUR":0.1,"SAS":0.02,"MENA":0.07} },
  { markerId: "rs12203594_Amhara", rsid: "rs12203594", gene: "IRF4", trait: "Amhara Ancestry Marker", continent: "African", subpop: "Amhara", alleles: ["G"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Amhara populations (Ethiopia).", frequencies: {"AFR":0.78,"AMR":0.04,"EAS":0.01,"EUR":0.08,"SAS":0.02,"MENA":0.07} },
  { markerId: "rs10456231_Baganda", rsid: "rs10456231", gene: "Unknown", trait: "Baganda Ancestry Marker", continent: "African", subpop: "Baganda", alleles: ["G"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Baganda populations (Uganda).", frequencies: {"AFR":0.96,"AMR":0.01,"EAS":0,"EUR":0,"SAS":0.01,"MENA":0.01} },
  { markerId: "rs10456256_Bakongo", rsid: "rs10456256", gene: "Unknown", trait: "Bakongo Ancestry Marker", continent: "African", subpop: "Bakongo", alleles: ["G"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Bakongo populations (DRC/Angola/Congo).", frequencies: {"AFR":0.98,"AMR":0.02,"EAS":0,"EUR":0,"SAS":0,"MENA":0} },
  { markerId: "rs10456238_Bakongo", rsid: "rs10456238", gene: "Unknown", trait: "Bakongo Ancestry Marker", continent: "African", subpop: "Bakongo", alleles: ["G"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Bakongo populations (Congo/Angola).", frequencies: {"AFR":0.95,"AMR":0.02,"EAS":0.01,"EUR":0.01,"SAS":0.01,"MENA":0.01} },
  { markerId: "rs10456257_Baluba", rsid: "rs10456257", gene: "Unknown", trait: "Baluba Ancestry Marker", continent: "African", subpop: "Baluba", alleles: ["C"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Baluba populations (DRC).", frequencies: {"AFR":0.97,"AMR":0.01,"EAS":0,"EUR":0,"SAS":0,"MENA":0} },
  { markerId: "rs10456237_Bamileke", rsid: "rs10456237", gene: "Unknown", trait: "Bamileke Ancestry Marker", continent: "African", subpop: "Bamileke", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Bamileke populations (Cameroon).", frequencies: {"AFR":0.93,"AMR":0.04,"EAS":0.01,"EUR":0.01,"SAS":0.01,"MENA":0.01} },
  { markerId: "rs10456205_Bamoun", rsid: "rs10456205_B", gene: "Unknown", trait: "Bamoun Ancestry Marker", continent: "African", subpop: "Bamoun", alleles: ["T"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Bamoun populations.", frequencies: {"AFR":0.97,"AMR":0.02,"EAS":0,"EUR":0,"SAS":0,"MENA":0} },
  { markerId: "rs10486573", rsid: "rs10486573", gene: "Unknown", trait: "Bantu Marker", continent: "African", subpop: "Bantu", alleles: ["G"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Bantu populations." },
  { markerId: "rs10486574", rsid: "rs10486574", gene: "Unknown", trait: "Bantu Marker", continent: "African", subpop: "Bantu", alleles: ["C"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Bantu populations." },
  { markerId: "rs10486575", rsid: "rs10486575", gene: "Unknown", trait: "Bantu Marker", continent: "African", subpop: "Bantu", alleles: ["T"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Bantu populations." },
  { markerId: "rs10456249_Bassa", rsid: "rs10456249", gene: "Unknown", trait: "Bassa Ancestry Marker", continent: "African", subpop: "Bassa", alleles: ["C"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Bassa populations (Liberia).", frequencies: {"AFR":0.96,"AMR":0.05,"EAS":0,"EUR":0,"SAS":0,"MENA":0} },
  { markerId: "rs10456228_Baule", rsid: "rs10456228", gene: "Unknown", trait: "Baule Ancestry Marker", continent: "African", subpop: "Baule", alleles: ["G"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Baule populations (Ivory Coast).", frequencies: {"AFR":0.98,"AMR":0.03,"EAS":0,"EUR":0,"SAS":0,"MENA":0} },
  { markerId: "rs10456261_Bemba", rsid: "rs10456261", gene: "Unknown", trait: "Bemba Ancestry Marker", continent: "African", subpop: "Bemba", alleles: ["C"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Bemba populations (Zambia/DRC).", frequencies: {"AFR":0.97,"AMR":0.01,"EAS":0,"EUR":0,"SAS":0,"MENA":0} },
  { markerId: "rs4242382", rsid: "rs4242382", gene: "Unknown", trait: "Cameroonian Marker", continent: "African", subpop: "Cameroon", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Cameroonian populations." },
  { markerId: "rs4242383", rsid: "rs4242383", gene: "Unknown", trait: "Cameroonian Marker", continent: "African", subpop: "Cameroon", alleles: ["G"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Cameroonian populations." },
  { markerId: "rs4242384", rsid: "rs4242384", gene: "Unknown", trait: "Cameroonian Marker", continent: "African", subpop: "Cameroon", alleles: ["C"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Cameroonian populations." },
  { markerId: "rs10456303_CapeVerdean", rsid: "rs10456303", gene: "Unknown", trait: "Cape Verdean Ancestry Marker", continent: "African", subpop: "Cape Verdean", alleles: ["T"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Cape Verdean populations.", frequencies: {"AFR":0.6,"AMR":0.05,"EAS":0.01,"EUR":0.35,"SAS":0.02,"MENA":0.05} },
  { markerId: "rs10456304_CapeVerdean", rsid: "rs10456304", gene: "Unknown", trait: "Cape Verdean Ancestry Marker", continent: "African", subpop: "Cape Verdean", alleles: ["G"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Cape Verdean populations.", frequencies: {"AFR":0.58,"AMR":0.04,"EAS":0.01,"EUR":0.38,"SAS":0.02,"MENA":0.04} },
  { markerId: "rs10456263_Chewa", rsid: "rs10456263", gene: "Unknown", trait: "Chewa Ancestry Marker", continent: "African", subpop: "Chewa", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Chewa populations (Malawi/Zambia/Mozambique).", frequencies: {"AFR":0.98,"AMR":0.01,"EAS":0,"EUR":0,"SAS":0,"MENA":0} },
  { markerId: "rs10456259_Chokwe", rsid: "rs10456259", gene: "Unknown", trait: "Chokwe Ancestry Marker", continent: "African", subpop: "Chokwe", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Chokwe populations (Angola/DRC/Zambia).", frequencies: {"AFR":0.95,"AMR":0.02,"EAS":0,"EUR":0,"SAS":0,"MENA":0} },
  { markerId: "rs12752445", rsid: "rs12752445", gene: "Unknown", trait: "Congolese Marker", continent: "African", subpop: "Congo", alleles: ["T"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Congolese populations." },
  { markerId: "rs12752446", rsid: "rs12752446", gene: "Unknown", trait: "Congolese Marker", continent: "African", subpop: "Congo", alleles: ["C"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Congolese populations." },
  { markerId: "rs12752447", rsid: "rs12752447", gene: "Unknown", trait: "Congolese Marker", continent: "African", subpop: "Congo", alleles: ["G"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Congolese populations." },
  { markerId: "rs10456255_Dan", rsid: "rs10456255", gene: "Unknown", trait: "Dan Ancestry Marker", continent: "African", subpop: "Dan", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Dan populations (Liberia/Ivory Coast).", frequencies: {"AFR":0.98,"AMR":0.04,"EAS":0,"EUR":0,"SAS":0,"MENA":0} },
  { markerId: "rs10456243_Edo", rsid: "rs10456243", gene: "Unknown", trait: "Edo Ancestry Marker", continent: "African", subpop: "Edo", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Edo populations (Nigeria).", frequencies: {"AFR":0.98,"AMR":0.04,"EAS":0,"EUR":0,"SAS":0,"MENA":0} },
  { markerId: "rs10456241_Efik", rsid: "rs10456241", gene: "Unknown", trait: "Efik Ancestry Marker", continent: "African", subpop: "Efik", alleles: ["C"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Efik populations (Nigeria).", frequencies: {"AFR":0.96,"AMR":0.04,"EAS":0,"EUR":0,"SAS":0,"MENA":0} },
  { markerId: "rs10456198_Esan", rsid: "rs10456198", gene: "Unknown", trait: "Esan Ancestry Marker", continent: "African", subpop: "Esan", alleles: ["T"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Esan populations.", frequencies: {"AFR":0.97,"AMR":0.03,"EAS":0.01,"EUR":0.01,"SAS":0.01,"MENA":0.01} },
  { markerId: "rs10456203_Ethiopian", rsid: "rs10456203", gene: "Unknown", trait: "Ethiopian Ancestry Marker", continent: "African", subpop: "Ethiopian", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Ethiopian populations.", frequencies: {"AFR":0.7,"AMR":0.01,"EAS":0.01,"EUR":0.08,"SAS":0.12,"MENA":0.3} },
  { markerId: "rs10456300_Ethiopian", rsid: "rs10456300", gene: "Unknown", trait: "Ethiopian Ancestry Marker", continent: "African", subpop: "Ethiopian", alleles: ["G"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Ethiopian populations.", frequencies: {"AFR":0.68,"AMR":0.01,"EAS":0.01,"EUR":0.07,"SAS":0.1,"MENA":0.32} },
  { markerId: "rs10456220_Ewe", rsid: "rs10456220", gene: "Unknown", trait: "Ewe Ancestry Marker", continent: "African", subpop: "Ewe", alleles: ["T"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Ewe populations (Ghana/Togo/Benin).", frequencies: {"AFR":0.96,"AMR":0.05,"EAS":0,"EUR":0,"SAS":0,"MENA":0} },
  { markerId: "rs10456236_Ewe", rsid: "rs10456236", gene: "Unknown", trait: "Ewe Ancestry Marker", continent: "African", subpop: "Ewe", alleles: ["T"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Ewe populations (Ghana/Togo).", frequencies: {"AFR":0.94,"AMR":0.03,"EAS":0.01,"EUR":0.01,"SAS":0.01,"MENA":0.01} },
  { markerId: "rs10456205_Fang", rsid: "rs10456205_F", gene: "Unknown", trait: "Fang Ancestry Marker", continent: "African", subpop: "Fang", alleles: ["C"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Fang populations.", frequencies: {"AFR":0.98,"AMR":0.01,"EAS":0,"EUR":0,"SAS":0,"MENA":0} },
  { markerId: "rs10456227_Fon", rsid: "rs10456227_FO", gene: "Unknown", trait: "Fon Ancestry Marker", continent: "African", subpop: "Fon", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Fon populations (Benin).", frequencies: {"AFR":0.97,"AMR":0.04,"EAS":0,"EUR":0,"SAS":0,"MENA":0} },
  { markerId: "rs10456235_Fon", rsid: "rs10456235", gene: "Unknown", trait: "Fon Ancestry Marker", continent: "African", subpop: "Fon", alleles: ["C"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Fon populations (Benin).", frequencies: {"AFR":0.95,"AMR":0.02,"EAS":0.01,"EUR":0.01,"SAS":0.01,"MENA":0.01} },
  { markerId: "rs10456205_Fulani", rsid: "rs10456205_FU", gene: "Unknown", trait: "Fulani Ancestry Marker", continent: "African", subpop: "Fulani", alleles: ["T"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Fulani populations.", frequencies: {"AFR":0.85,"AMR":0.02,"EAS":0,"EUR":0.05,"SAS":0.03,"MENA":0.15} },
  { markerId: "rs10456233_Fulani", rsid: "rs10456233", gene: "Unknown", trait: "Fulani Ancestry Marker", continent: "African", subpop: "Fulani", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Fulani populations (West Africa).", frequencies: {"AFR":0.9,"AMR":0.02,"EAS":0.01,"EUR":0.02,"SAS":0.01,"MENA":0.04} },
  { markerId: "rs10456219_Ga", rsid: "rs10456219", gene: "Unknown", trait: "Ga-Adangbe Ancestry Marker", continent: "African", subpop: "Ga-Adangbe", alleles: ["C"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Ga-Adangbe populations (Ghana).", frequencies: {"AFR":0.97,"AMR":0.04,"EAS":0,"EUR":0,"SAS":0,"MENA":0} },
  { markerId: "rs10456251_Gola", rsid: "rs10456251", gene: "Unknown", trait: "Gola Ancestry Marker", continent: "African", subpop: "Gola", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Gola populations (Liberia/Sierra Leone).", frequencies: {"AFR":0.98,"AMR":0.05,"EAS":0,"EUR":0,"SAS":0,"MENA":0} },
  { markerId: "rs10456248_Grebo", rsid: "rs10456248", gene: "Unknown", trait: "Grebo Ancestry Marker", continent: "African", subpop: "Grebo", alleles: ["G"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Grebo populations (Liberia).", frequencies: {"AFR":0.97,"AMR":0.03,"EAS":0,"EUR":0,"SAS":0,"MENA":0} },
  { markerId: "rs10456205_Hausa", rsid: "rs10456205_H", gene: "Unknown", trait: "Hausa Ancestry Marker", continent: "African", subpop: "Hausa", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Hausa populations.", frequencies: {"AFR":0.92,"AMR":0.04,"EAS":0,"EUR":0,"SAS":0.02,"MENA":0.05} },
  { markerId: "rs11103349", rsid: "rs11103349", gene: "Unknown", trait: "Maasai Ancestry Marker", continent: "African", subpop: "Maasai", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Maasai populations.", frequencies: {"AFR":0.85,"AMR":0.01,"EAS":0.01,"EUR":0.01,"SAS":0.05,"MENA":0.05} },
  { markerId: "rs11103350", rsid: "rs11103350", gene: "Unknown", trait: "East African Marker", continent: "African", subpop: "Horn", alleles: ["G"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Horn of Africa populations." },
  { markerId: "rs11103351", rsid: "rs11103351", gene: "Unknown", trait: "East African Marker", continent: "African", subpop: "Horn", alleles: ["T"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Horn of Africa populations." },
  { markerId: "rs10456242_Ibibio", rsid: "rs10456242", gene: "Unknown", trait: "Ibibio Ancestry Marker", continent: "African", subpop: "Ibibio", alleles: ["T"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Ibibio populations (Nigeria).", frequencies: {"AFR":0.95,"AMR":0.03,"EAS":0,"EUR":0,"SAS":0,"MENA":0} },
  { markerId: "rs10456196_Igbo", rsid: "rs10456196", gene: "Unknown", trait: "Igbo Ancestry Marker", continent: "African", subpop: "Igbo", alleles: ["G"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Igbo populations.", frequencies: {"AFR":0.96,"AMR":0.04,"EAS":0.01,"EUR":0.01,"SAS":0.01,"MENA":0.01} },
  { markerId: "rs7252505_Igbo", rsid: "rs7252505", gene: "Unknown", trait: "Igbo Ancestry Marker", continent: "African", subpop: "Igbo", alleles: ["C"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Igbo populations (Nigeria).", frequencies: {"AFR":0.94,"AMR":0.03,"EAS":0.01,"EUR":0.01,"SAS":0.01,"MENA":0.01} },
  { markerId: "rs1572318", rsid: "rs1572318", gene: "NFIA", trait: "Basal African Marker", continent: "African", subpop: "Khoe-San", alleles: ["A"], significance: "High", category: "Ancestry", description: "High frequency marker diagnostic for Southern African Khoe-San hunter-gatherer ancestry." },
  { markerId: "rs1572319", rsid: "rs1572319", gene: "Unknown", trait: "Khoe-San Marker", continent: "African", subpop: "Khoe-San", alleles: ["C"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Khoe-San populations." },
  { markerId: "rs10456204_Khoisan", rsid: "rs10456204", gene: "Unknown", trait: "Khoisan Ancestry Marker", continent: "African", subpop: "Khoisan", alleles: ["G"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Khoisan populations.", frequencies: {"AFR":0.99,"AMR":0.01,"EAS":0,"EUR":0,"SAS":0,"MENA":0} },
  { markerId: "rs10456230_Kikuyu", rsid: "rs10456230", gene: "Unknown", trait: "Kikuyu Ancestry Marker", continent: "African", subpop: "Kikuyu", alleles: ["T"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Kikuyu populations (Kenya).", frequencies: {"AFR":0.95,"AMR":0.02,"EAS":0,"EUR":0,"SAS":0.01,"MENA":0.01} },
  { markerId: "rs10456236_Kongo", rsid: "rs10456236", gene: "Unknown", trait: "Kongo Ancestry Marker", continent: "African", subpop: "Kongo", alleles: ["T"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Kongo populations (DRC/Angola/Congo).", frequencies: {"AFR":0.98,"AMR":0.02,"EAS":0,"EUR":0,"SAS":0,"MENA":0} },
  { markerId: "rs10456252_Kpelle", rsid: "rs10456252", gene: "Unknown", trait: "Kpelle Ancestry Marker", continent: "African", subpop: "Kpelle", alleles: ["G"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Kpelle populations (Liberia/Guinea).", frequencies: {"AFR":0.97,"AMR":0.03,"EAS":0,"EUR":0,"SAS":0,"MENA":0} },
  { markerId: "rs10456247_Kru", rsid: "rs10456247", gene: "Unknown", trait: "Kru Ancestry Marker", continent: "African", subpop: "Kru", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Kru populations (Liberia/Ivory Coast).", frequencies: {"AFR":0.98,"AMR":0.04,"EAS":0,"EUR":0,"SAS":0,"MENA":0} },
  { markerId: "rs10456245_Limba", rsid: "rs10456245", gene: "Unknown", trait: "Limba Ancestry Marker", continent: "African", subpop: "Limba", alleles: ["T"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Limba populations (Sierra Leone).", frequencies: {"AFR":0.96,"AMR":0.03,"EAS":0,"EUR":0,"SAS":0,"MENA":0} },
  { markerId: "rs10456253_Loma", rsid: "rs10456253", gene: "Unknown", trait: "Loma Ancestry Marker", continent: "African", subpop: "Loma", alleles: ["C"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Loma populations (Liberia/Guinea).", frequencies: {"AFR":0.96,"AMR":0.02,"EAS":0,"EUR":0,"SAS":0,"MENA":0} },
  { markerId: "rs10456260_Lozi", rsid: "rs10456260", gene: "Unknown", trait: "Lozi Ancestry Marker", continent: "African", subpop: "Lozi", alleles: ["G"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Lozi populations (Zambia/Namibia/Botswana).", frequencies: {"AFR":0.94,"AMR":0.01,"EAS":0,"EUR":0,"SAS":0,"MENA":0} },
  { markerId: "rs10456237_Luba", rsid: "rs10456237", gene: "Unknown", trait: "Luba Ancestry Marker", continent: "African", subpop: "Luba", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Luba populations (DRC).", frequencies: {"AFR":0.97,"AMR":0.01,"EAS":0,"EUR":0,"SAS":0,"MENA":0} },
  { markerId: "rs10456200_Luhya", rsid: "rs10456200", gene: "Unknown", trait: "Luhya Ancestry Marker", continent: "African", subpop: "Luhya", alleles: ["G"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Luhya populations.", frequencies: {"AFR":0.92,"AMR":0.02,"EAS":0.01,"EUR":0.01,"SAS":0.05,"MENA":0.02} },
  { markerId: "rs10456223_Luo", rsid: "rs10456223", gene: "Unknown", trait: "Luo Ancestry Marker", continent: "African", subpop: "Luo", alleles: ["C"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Luo populations (Kenya/Tanzania/Uganda).", frequencies: {"AFR":0.94,"AMR":0.02,"EAS":0,"EUR":0,"SAS":0.02,"MENA":0.02} },
  { markerId: "rs11547466_Luo", rsid: "rs11547466", gene: "Unknown", trait: "Luo Ancestry Marker", continent: "African", subpop: "Luo", alleles: ["G"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Luo populations (Kenya).", frequencies: {"AFR":0.92,"AMR":0.03,"EAS":0.01,"EUR":0.01,"SAS":0.01,"MENA":0.01} },
  { markerId: "rs16891985_Luo", rsid: "rs16891985", gene: "SLC45A2", trait: "Luo Ancestry Marker", continent: "African", subpop: "Luo", alleles: ["C"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Luo populations (Kenya).", frequencies: {"AFR":0.95,"AMR":0.02,"EAS":0.01,"EUR":0.01,"SAS":0.01,"MENA":0.01} },
  { markerId: "rs10456201_Maasai", rsid: "rs10456201", gene: "Unknown", trait: "Maasai Ancestry Marker", continent: "African", subpop: "Maasai", alleles: ["C"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Maasai populations.", frequencies: {"AFR":0.88,"AMR":0.01,"EAS":0.01,"EUR":0.02,"SAS":0.08,"MENA":0.05} },
  { markerId: "rs1805010_Maasai", rsid: "rs1805010", gene: "MC1R", trait: "Maasai Ancestry Marker", continent: "African", subpop: "Maasai", alleles: ["G"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Maasai populations (Kenya/Tanzania).", frequencies: {"AFR":0.88,"AMR":0.05,"EAS":0.01,"EUR":0.03,"SAS":0.01,"MENA":0.02} },
  { markerId: "rs4988238_Maasai", rsid: "rs4988238", gene: "LCT", trait: "Maasai Ancestry Marker", continent: "African", subpop: "Maasai", alleles: ["G"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Maasai populations (Kenya/Tanzania).", frequencies: {"AFR":0.85,"AMR":0.04,"EAS":0.01,"EUR":0.05,"SAS":0.01,"MENA":0.04} },
  { markerId: "rs10456265_Makua", rsid: "rs10456265", gene: "Unknown", trait: "Makua Ancestry Marker", continent: "African", subpop: "Makua", alleles: ["C"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Makua populations (Mozambique).", frequencies: {"AFR":0.96,"AMR":0.01,"EAS":0,"EUR":0,"SAS":0,"MENA":0} },
  { markerId: "rs7460469", rsid: "rs7460469", gene: "Unknown", trait: "Malagasy Marker", continent: "African", subpop: "Malagasy", alleles: ["C"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Malagasy populations." },
  { markerId: "rs7460470", rsid: "rs7460470", gene: "Unknown", trait: "Malagasy Marker", continent: "African", subpop: "Malagasy", alleles: ["G"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Malagasy populations." },
  { markerId: "rs7460471", rsid: "rs7460471", gene: "Unknown", trait: "Malagasy Marker", continent: "African", subpop: "Malagasy", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Malagasy populations." },
  { markerId: "rs10456197_Mandinka", rsid: "rs10456197", gene: "Unknown", trait: "Mandinka Ancestry Marker", continent: "African", subpop: "Mandinka", alleles: ["C"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Mandinka populations.", frequencies: {"AFR":0.94,"AMR":0.06,"EAS":0.01,"EUR":0.01,"SAS":0.01,"MENA":0.01} },
  { markerId: "rs4871195_Mandinka", rsid: "rs4871195", gene: "Unknown", trait: "Mandinka Ancestry Marker", continent: "African", subpop: "Mandinka", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Mandinka populations (Gambia).", frequencies: {"AFR":0.97,"AMR":0.01,"EAS":0.01,"EUR":0.01,"SAS":0.01,"MENA":0.01} },
  { markerId: "rs1042524_Mandinka", rsid: "rs1042524", gene: "Unknown", trait: "Mandinka Ancestry Marker", continent: "African", subpop: "Mandinka", alleles: ["G"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Mandinka populations (Gambia).", frequencies: {"AFR":0.94,"AMR":0.02,"EAS":0.01,"EUR":0.01,"SAS":0.01,"MENA":0.01} },
  { markerId: "rs10456254_Mano", rsid: "rs10456254", gene: "Unknown", trait: "Mano Ancestry Marker", continent: "African", subpop: "Mano", alleles: ["T"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Mano populations (Liberia/Guinea).", frequencies: {"AFR":0.95,"AMR":0.01,"EAS":0,"EUR":0,"SAS":0,"MENA":0} },
  { markerId: "rs10456240_Mbundu", rsid: "rs10456240", gene: "Unknown", trait: "Mbundu Ancestry Marker", continent: "African", subpop: "Mbundu", alleles: ["G"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Mbundu populations (Angola).", frequencies: {"AFR":0.97,"AMR":0.02,"EAS":0,"EUR":0,"SAS":0,"MENA":0} },
  { markerId: "rs10456199_Mende", rsid: "rs10456199", gene: "Unknown", trait: "Mende Ancestry Marker", continent: "African", subpop: "Mende", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Mende populations.", frequencies: {"AFR":0.95,"AMR":0.05,"EAS":0.01,"EUR":0.01,"SAS":0.01,"MENA":0.01} },
  { markerId: "rs10456244_Mende", rsid: "rs10456244", gene: "Unknown", trait: "Mende Ancestry Marker", continent: "African", subpop: "Mende", alleles: ["G"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Mende populations (Sierra Leone).", frequencies: {"AFR":0.97,"AMR":0.05,"EAS":0,"EUR":0,"SAS":0,"MENA":0} },
  { markerId: "rs1446585_Mende", rsid: "rs1446585", gene: "SLC24A4", trait: "Mende Ancestry Marker", continent: "African", subpop: "Mende", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Mende populations (Sierra Leone).", frequencies: {"AFR":0.96,"AMR":0.02,"EAS":0.01,"EUR":0.01,"SAS":0.01,"MENA":0.01} },
  { markerId: "rs2675348_Mende", rsid: "rs2675348", gene: "Unknown", trait: "Mende Ancestry Marker", continent: "African", subpop: "Mende", alleles: ["C"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Mende populations (Sierra Leone).", frequencies: {"AFR":0.93,"AMR":0.04,"EAS":0.01,"EUR":0.01,"SAS":0.01,"MENA":0.01} },
  { markerId: "rs10456238_Mongo", rsid: "rs10456238", gene: "Unknown", trait: "Mongo Ancestry Marker", continent: "African", subpop: "Mongo", alleles: ["G"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Mongo populations (DRC).", frequencies: {"AFR":0.98,"AMR":0.01,"EAS":0,"EUR":0,"SAS":0,"MENA":0} },
  { markerId: "rs10456229_Mossi", rsid: "rs10456229", gene: "Unknown", trait: "Mossi Ancestry Marker", continent: "African", subpop: "Mossi", alleles: ["C"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Mossi populations (Burkina Faso).", frequencies: {"AFR":0.96,"AMR":0.05,"EAS":0,"EUR":0,"SAS":0,"MENA":0} },
  { markerId: "rs10456235_Ndebele", rsid: "rs10456235", gene: "Unknown", trait: "Ndebele Ancestry Marker", continent: "African", subpop: "Ndebele", alleles: ["C"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Ndebele populations (South Africa/Zimbabwe).", frequencies: {"AFR":0.96,"AMR":0.02,"EAS":0,"EUR":0,"SAS":0,"MENA":0} },
  { markerId: "rs10424071", rsid: "rs10424071", gene: "Unknown", trait: "Nigerian Ancestry Marker", continent: "African", subpop: "Nigerian", alleles: ["G"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Nigerian populations.", frequencies: {"AFR":0.96,"AMR":0.02,"EAS":0.01,"EUR":0.01,"SAS":0.01,"MENA":0.01} },
  { markerId: "rs10424072", rsid: "rs10424072", gene: "Unknown", trait: "Nigerian Marker", continent: "African", subpop: "Nigeria", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Nigerian populations." },
  { markerId: "rs10424073", rsid: "rs10424073", gene: "Unknown", trait: "Nigerian Marker", continent: "African", subpop: "Nigeria", alleles: ["T"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Nigerian populations." },
  { markerId: "rs10424074", rsid: "rs10424074", gene: "Unknown", trait: "Nigerian Marker", continent: "African", subpop: "Nigeria", alleles: ["C"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Nigerian populations." },
  { markerId: "rs10456205_Nubian", rsid: "rs10456205_NU", gene: "Unknown", trait: "Nubian Ancestry Marker", continent: "African", subpop: "Nubian", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Nubian populations.", frequencies: {"AFR":0.7,"AMR":0.01,"EAS":0,"EUR":0.1,"SAS":0.1,"MENA":0.4} },
  { markerId: "rs10456207-AFR", rsid: "rs10456207-AFR", gene: "Unknown", trait: "Nubian Ancestry Marker", continent: "African", subpop: "Nubian", alleles: ["T"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Nubian populations.", frequencies: {"AFR":0.75,"AMR":0.01,"EAS":0.01,"EUR":0.05,"SAS":0.05,"MENA":0.25} },
  { markerId: "rs10456210", rsid: "rs10456210", gene: "Unknown", trait: "Nubian Marker", continent: "African", subpop: "Nubian", alleles: ["G"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Nubian populations." },
  { markerId: "rs10456213", rsid: "rs10456213", gene: "Unknown", trait: "Nubian Marker", continent: "African", subpop: "Nubian", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Nubian populations." },
  { markerId: "rs10456222_Oromo", rsid: "rs10456222", gene: "Unknown", trait: "Oromo Ancestry Marker", continent: "African", subpop: "Oromo", alleles: ["G"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Oromo populations (Ethiopia/Kenya).", frequencies: {"AFR":0.72,"AMR":0.01,"EAS":0,"EUR":0.05,"SAS":0.08,"MENA":0.25} },
  { markerId: "rs10456258_Ovimbundu", rsid: "rs10456258", gene: "Unknown", trait: "Ovimbundu Ancestry Marker", continent: "African", subpop: "Ovimbundu", alleles: ["T"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Ovimbundu populations (Angola).", frequencies: {"AFR":0.96,"AMR":0.03,"EAS":0,"EUR":0,"SAS":0,"MENA":0} },
  { markerId: "rs10456239_Ovimbundu", rsid: "rs10456239", gene: "Unknown", trait: "Ovimbundu Ancestry Marker", continent: "African", subpop: "Ovimbundu", alleles: ["C"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Ovimbundu populations (Angola).", frequencies: {"AFR":0.94,"AMR":0.03,"EAS":0.01,"EUR":0.01,"SAS":0.01,"MENA":0.01} },
  { markerId: "rs10456205_Pygmy", rsid: "rs10456205", gene: "Unknown", trait: "Pygmy Ancestry Marker", continent: "African", subpop: "Pygmy", alleles: ["C"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Pygmy populations.", frequencies: {"AFR":0.98,"AMR":0.01,"EAS":0,"EUR":0,"SAS":0,"MENA":0} },
  { markerId: "rs12149626", rsid: "rs12149626", gene: "Unknown", trait: "Pygmy Marker", continent: "African", subpop: "Pygmy", alleles: ["G"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Pygmy populations." },
  { markerId: "rs12149627", rsid: "rs12149627", gene: "Unknown", trait: "Pygmy Marker", continent: "African", subpop: "Pygmy", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Pygmy populations." },
  { markerId: "rs12149628", rsid: "rs12149628", gene: "Unknown", trait: "Pygmy Marker", continent: "African", subpop: "Pygmy", alleles: ["T"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Pygmy populations." },
  { markerId: "rs694341_San", rsid: "rs694341", gene: "Unknown", trait: "San Ancestry Marker", continent: "African", subpop: "San", alleles: ["G"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for San populations (Southern Africa).", frequencies: {"AFR":0.98,"AMR":0.01,"EAS":0.01,"EUR":0,"SAS":0,"MENA":0} },
  { markerId: "rs7252508_San", rsid: "rs7252508", gene: "Unknown", trait: "San Ancestry Marker", continent: "African", subpop: "San", alleles: ["G"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for San populations (Southern Africa).", frequencies: {"AFR":0.97,"AMR":0.01,"EAS":0.01,"EUR":0,"SAS":0,"MENA":0} },
  { markerId: "rs13136401", rsid: "rs13136401", gene: "Unknown", trait: "San Marker", continent: "African", subpop: "San", alleles: ["G"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for San populations." },
  { markerId: "rs13136402", rsid: "rs13136402", gene: "Unknown", trait: "San Marker", continent: "African", subpop: "San", alleles: ["T"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for San populations." },
  { markerId: "rs13136403", rsid: "rs13136403", gene: "Unknown", trait: "San Marker", continent: "African", subpop: "San", alleles: ["C"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for San populations." },
  { markerId: "rs10456246_Sherbro", rsid: "rs10456246", gene: "Unknown", trait: "Sherbro Ancestry Marker", continent: "African", subpop: "Sherbro", alleles: ["C"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Sherbro populations (Sierra Leone).", frequencies: {"AFR":0.95,"AMR":0.02,"EAS":0,"EUR":0,"SAS":0,"MENA":0} },
  { markerId: "rs10456233_Shona", rsid: "rs10456233", gene: "Unknown", trait: "Shona Ancestry Marker", continent: "African", subpop: "Shona", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Shona populations (Zimbabwe/Mozambique).", frequencies: {"AFR":0.98,"AMR":0.01,"EAS":0,"EUR":0,"SAS":0,"MENA":0} },
  { markerId: "rs10456240_Shona", rsid: "rs10456240", gene: "Unknown", trait: "Shona Ancestry Marker", continent: "African", subpop: "Shona", alleles: ["T"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Shona populations (Zimbabwe).", frequencies: {"AFR":0.92,"AMR":0.04,"EAS":0.01,"EUR":0.01,"SAS":0.01,"MENA":0.01} },
  { markerId: "rs10456202_Somali", rsid: "rs10456202", gene: "Unknown", trait: "Somali Ancestry Marker", continent: "African", subpop: "Somali", alleles: ["T"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Somali populations.", frequencies: {"AFR":0.75,"AMR":0.01,"EAS":0.01,"EUR":0.05,"SAS":0.1,"MENA":0.25} },
  { markerId: "rs10456301_Somali", rsid: "rs10456301", gene: "Unknown", trait: "Somali Ancestry Marker", continent: "African", subpop: "Somali", alleles: ["C"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Somali populations.", frequencies: {"AFR":0.72,"AMR":0.01,"EAS":0.01,"EUR":0.06,"SAS":0.11,"MENA":0.28} },
  { markerId: "rs10456302_Somali", rsid: "rs10456302", gene: "Unknown", trait: "Somali Ancestry Marker", continent: "African", subpop: "Somali", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Somali populations.", frequencies: {"AFR":0.74,"AMR":0.01,"EAS":0.01,"EUR":0.05,"SAS":0.09,"MENA":0.26} },
  { markerId: "rs10456224_Sotho", rsid: "rs10456224", gene: "Unknown", trait: "Sotho Ancestry Marker", continent: "African", subpop: "Sotho", alleles: ["T"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Sotho populations (South Africa/Lesotho).", frequencies: {"AFR":0.97,"AMR":0.01,"EAS":0,"EUR":0,"SAS":0,"MENA":0} },
  { markerId: "rs10456206-AFR", rsid: "rs10456206-AFR", gene: "Unknown", trait: "Sudanese Ancestry Marker", continent: "African", subpop: "Sudanese", alleles: ["G"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Sudanese populations.", frequencies: {"AFR":0.80,"AMR":0.01,"EAS":0.01,"EUR":0.02,"SAS":0.02,"MENA":0.15} },
  { markerId: "rs10456209", rsid: "rs10456209", gene: "Unknown", trait: "Sudanese Marker", continent: "African", subpop: "Sudan", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Sudanese populations." },
  { markerId: "rs10456212", rsid: "rs10456212", gene: "Unknown", trait: "Sudanese Marker", continent: "African", subpop: "Sudan", alleles: ["C"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Sudanese populations." },
  { markerId: "rs10456239_Temne", rsid: "rs10456239", gene: "Unknown", trait: "Temne Ancestry Marker", continent: "African", subpop: "Temne", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Temne populations (Sierra Leone).", frequencies: {"AFR":0.98,"AMR":0.05,"EAS":0,"EUR":0,"SAS":0,"MENA":0} },
  { markerId: "rs10456232_Tigrayan", rsid: "rs10456232", gene: "Unknown", trait: "Tigrayan Ancestry Marker", continent: "African", subpop: "Tigrayan", alleles: ["C"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Tigrayan populations (Ethiopia/Eritrea).", frequencies: {"AFR":0.68,"AMR":0.01,"EAS":0,"EUR":0.08,"SAS":0.08,"MENA":0.32} },
  { markerId: "rs10456262_Tonga", rsid: "rs10456262", gene: "Unknown", trait: "Tonga Ancestry Marker", continent: "African", subpop: "Tonga", alleles: ["T"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Tonga populations (Zambia/Zimbabwe).", frequencies: {"AFR":0.96,"AMR":0.02,"EAS":0,"EUR":0,"SAS":0,"MENA":0} },
  { markerId: "rs10456234_Tsonga", rsid: "rs10456234", gene: "Unknown", trait: "Tsonga Ancestry Marker", continent: "African", subpop: "Tsonga", alleles: ["G"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Tsonga populations (South Africa/Mozambique).", frequencies: {"AFR":0.97,"AMR":0.01,"EAS":0,"EUR":0,"SAS":0,"MENA":0} },
  { markerId: "rs10456225_Tswana", rsid: "rs10456225", gene: "Unknown", trait: "Tswana Ancestry Marker", continent: "African", subpop: "Tswana", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Tswana populations (Botswana/South Africa).", frequencies: {"AFR":0.98,"AMR":0.01,"EAS":0,"EUR":0,"SAS":0,"MENA":0} },
  { markerId: "rs10456241_Tswana", rsid: "rs10456241", gene: "Unknown", trait: "Tswana Ancestry Marker", continent: "African", subpop: "Tswana", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Tswana populations (Botswana).", frequencies: {"AFR":0.93,"AMR":0.03,"EAS":0.01,"EUR":0.01,"SAS":0.01,"MENA":0.01} },
  { markerId: "rs10456250_Vai", rsid: "rs10456250", gene: "Unknown", trait: "Vai Ancestry Marker", continent: "African", subpop: "Vai", alleles: ["T"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Vai populations (Liberia/Sierra Leone).", frequencies: {"AFR":0.95,"AMR":0.04,"EAS":0,"EUR":0,"SAS":0,"MENA":0} },
  { markerId: "rs10456226_Venda", rsid: "rs10456226", gene: "Unknown", trait: "Venda Ancestry Marker", continent: "African", subpop: "Venda", alleles: ["G"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Venda populations (South Africa/Zimbabwe).", frequencies: {"AFR":0.99,"AMR":0.01,"EAS":0,"EUR":0,"SAS":0,"MENA":0} },
  { markerId: "rs17388247", rsid: "rs17388247", gene: "Unknown", trait: "West African Marker", continent: "African", subpop: "West", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for West African populations." },
  { markerId: "rs10900598", rsid: "rs10900598", gene: "Unknown", trait: "West African Marker", continent: "African", subpop: "West", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for West African populations." },
  { markerId: "rs2814778", rsid: "rs2814778", gene: "ACKR1", trait: "Duffy Null Phenotype", continent: "African", subpop: "West African", alleles: ["C"], significance: "High", category: "Ancestry", description: "Provides resistance to Plasmodium vivax malaria, highly prevalent in West Africa.", frequencies: {"AFR":0.99,"AMR":0.1,"EAS":0.01,"EUR":0.01,"SAS":0.01,"MENA":0.05} },
  { markerId: "rs10456247_Mende", rsid: "rs10456247", gene: "Unknown", trait: "Mende Ancestry Marker", continent: "African", subpop: "Mende", alleles: ["G"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Mende populations (Sierra Leone).", frequencies: {"AFR":0.96,"AMR":0.03,"EAS":0,"EUR":0,"SAS":0,"MENA":0} },
  { markerId: "rs10456248_Mende", rsid: "rs10456248", gene: "Unknown", trait: "Mende Ancestry Marker", continent: "African", subpop: "Mende", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Mende populations (Sierra Leone).", frequencies: {"AFR":0.94,"AMR":0.04,"EAS":0,"EUR":0,"SAS":0,"MENA":0} },
  { markerId: "rs10456249_Mandinka", rsid: "rs10456249", gene: "Unknown", trait: "Mandinka Ancestry Marker", continent: "African", subpop: "Mandinka", alleles: ["T"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Mandinka populations (Gambia/Senegal).", frequencies: {"AFR":0.97,"AMR":0.02,"EAS":0,"EUR":0,"SAS":0,"MENA":0} },
  { markerId: "rs10456251_Mandinka", rsid: "rs10456251", gene: "Unknown", trait: "Mandinka Ancestry Marker", continent: "African", subpop: "Mandinka", alleles: ["C"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Mandinka populations (Gambia).", frequencies: {"AFR":0.95,"AMR":0.03,"EAS":0,"EUR":0,"SAS":0,"MENA":0} },
  { markerId: "rs10456252_Akan", rsid: "rs10456252", gene: "Unknown", trait: "Akan Ancestry Marker", continent: "African", subpop: "Akan", alleles: ["G"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Akan populations (Ghana/Ivory Coast).", frequencies: {"AFR":0.98,"AMR":0.01,"EAS":0,"EUR":0,"SAS":0,"MENA":0} },
  { markerId: "rs10456253_Akan", rsid: "rs10456253", gene: "Unknown", trait: "Akan Ancestry Marker", continent: "African", subpop: "Akan", alleles: ["T"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Akan populations (Ghana).", frequencies: {"AFR":0.96,"AMR":0.02,"EAS":0,"EUR":0,"SAS":0,"MENA":0} },
  { markerId: "rs10456254_GaAdangbe", rsid: "rs10456254", gene: "Unknown", trait: "Ga-Adangbe Ancestry Marker", continent: "African", subpop: "Ga-Adangbe", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Ga-Adangbe populations (Ghana).", frequencies: {"AFR":0.97,"AMR":0.01,"EAS":0,"EUR":0,"SAS":0,"MENA":0} },
  { markerId: "rs10456256_Esan", rsid: "rs10456256", gene: "Unknown", trait: "Esan Ancestry Marker", continent: "African", subpop: "Esan", alleles: ["C"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Esan populations (Nigeria).", frequencies: {"AFR":0.98,"AMR":0.01,"EAS":0,"EUR":0,"SAS":0,"MENA":0} },
  { markerId: "rs10456258_Mossi", rsid: "rs10456258", gene: "Unknown", trait: "Mossi Ancestry Marker", continent: "African", subpop: "Mossi", alleles: ["G"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Mossi populations (Burkina Faso).", frequencies: {"AFR":0.99,"AMR":0,"EAS":0,"EUR":0,"SAS":0,"MENA":0} },
  { markerId: "rs10456205_Wolof", rsid: "rs10456205_W", gene: "Unknown", trait: "Wolof Ancestry Marker", continent: "African", subpop: "Wolof", alleles: ["G"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Wolof populations.", frequencies: {"AFR":0.94,"AMR":0.05,"EAS":0,"EUR":0,"SAS":0,"MENA":0} },
  { markerId: "rs10456234_Wolof", rsid: "rs10456234", gene: "Unknown", trait: "Wolof Ancestry Marker", continent: "African", subpop: "Wolof", alleles: ["G"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Wolof populations (Senegal).", frequencies: {"AFR":0.96,"AMR":0.01,"EAS":0.01,"EUR":0.01,"SAS":0.01,"MENA":0.01} },
  { markerId: "rs10456205_Xhosa", rsid: "rs10456205_X", gene: "Unknown", trait: "Xhosa Ancestry Marker", continent: "African", subpop: "Xhosa", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Xhosa populations.", frequencies: {"AFR":0.95,"AMR":0.03,"EAS":0,"EUR":0,"SAS":0,"MENA":0} },
  { markerId: "rs10456242_Xhosa", rsid: "rs10456242", gene: "Unknown", trait: "Xhosa Ancestry Marker", continent: "African", subpop: "Xhosa", alleles: ["G"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Xhosa populations (South Africa).", frequencies: {"AFR":0.91,"AMR":0.05,"EAS":0.01,"EUR":0.01,"SAS":0.01,"MENA":0.01} },
  { markerId: "rs10456264_Yao", rsid: "rs10456264", gene: "Unknown", trait: "Yao Ancestry Marker", continent: "African", subpop: "Yao", alleles: ["G"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Yao populations (Malawi/Mozambique/Tanzania).", frequencies: {"AFR":0.97,"AMR":0.01,"EAS":0,"EUR":0,"SAS":0,"MENA":0} },
  { markerId: "rs10456195_Yoruba", rsid: "rs10456195", gene: "Unknown", trait: "Yoruba Ancestry Marker", continent: "African", subpop: "Yoruba", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Yoruba populations.", frequencies: {"AFR":0.98,"AMR":0.05,"EAS":0.01,"EUR":0.01,"SAS":0.01,"MENA":0.01} },
  { markerId: "rs1129038_Yoruba", rsid: "rs1129038", gene: "SLC14A2", trait: "Yoruba Ancestry Marker", continent: "African", subpop: "Yoruba", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Yoruba populations (Nigeria).", frequencies: {"AFR":0.95,"AMR":0.05,"EAS":0.01,"EUR":0.01,"SAS":0.01,"MENA":0.01} },
  { markerId: "rs694339_Yoruba", rsid: "rs694339", gene: "Unknown", trait: "Yoruba Ancestry Marker", continent: "African", subpop: "Yoruba", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Yoruba populations (Nigeria).", frequencies: {"AFR":0.92,"AMR":0.04,"EAS":0.01,"EUR":0.01,"SAS":0.01,"MENA":0.01} },
  { markerId: "rs10456243_Yoruba", rsid: "rs10456243", gene: "Unknown", trait: "Yoruba Ancestry Marker", continent: "African", subpop: "Yoruba", alleles: ["G"], significance: "High", category: "Ancestry", description: "High significance Ancestry Informative Marker for Yoruba populations (Nigeria).", frequencies: {"AFR":0.97,"AMR":0.04,"EAS":0,"EUR":0,"SAS":0,"MENA":0} },
  { markerId: "rs10456244_Igbo", rsid: "rs10456244", gene: "Unknown", trait: "Igbo Ancestry Marker", continent: "African", subpop: "Igbo", alleles: ["T"], significance: "High", category: "Ancestry", description: "High significance Ancestry Informative Marker for Igbo populations (Nigeria).", frequencies: {"AFR":0.96,"AMR":0.03,"EAS":0,"EUR":0,"SAS":0,"MENA":0} },
  { markerId: "rs10456245_Igbo", rsid: "rs10456245", gene: "Unknown", trait: "Igbo Ancestry Marker", continent: "African", subpop: "Igbo", alleles: ["C"], significance: "High", category: "Ancestry", description: "High significance Ancestry Informative Marker for Igbo populations (Nigeria).", frequencies: {"AFR":0.95,"AMR":0.03,"EAS":0,"EUR":0,"SAS":0,"MENA":0} },
  { markerId: "rs10456257_Esan", rsid: "rs10456257", gene: "Unknown", trait: "Esan Ancestry Marker", continent: "African", subpop: "Esan", alleles: ["A"], significance: "High", category: "Ancestry", description: "High significance Ancestry Informative Marker for Esan populations (Nigeria).", frequencies: {"AFR":0.98,"AMR":0.02,"EAS":0,"EUR":0,"SAS":0,"MENA":0} },
  { markerId: "rs10456259_Yoruba", rsid: "rs10456259", gene: "Unknown", trait: "Yoruba Ancestry Marker", continent: "African", subpop: "Yoruba", alleles: ["T"], significance: "High", category: "Ancestry", description: "High significance Ancestry Informative Marker for Yoruba populations (Nigeria).", frequencies: {"AFR":0.96,"AMR":0.04,"EAS":0,"EUR":0,"SAS":0,"MENA":0} },
  { markerId: "rs10456260_Igbo", rsid: "rs10456260", gene: "Unknown", trait: "Igbo Ancestry Marker", continent: "African", subpop: "Igbo", alleles: ["G"], significance: "High", category: "Ancestry", description: "High significance Ancestry Informative Marker for Igbo populations (Nigeria).", frequencies: {"AFR":0.94,"AMR":0.05,"EAS":0,"EUR":0,"SAS":0,"MENA":0} },
  { markerId: "rs10456261_Igbo", rsid: "rs10456261", gene: "Unknown", trait: "Igbo Ancestry Marker", continent: "African", subpop: "Igbo", alleles: ["A"], significance: "High", category: "Ancestry", description: "High significance Ancestry Informative Marker for Igbo populations (Nigeria).", frequencies: {"AFR":0.95,"AMR":0.03,"EAS":0,"EUR":0,"SAS":0,"MENA":0} },
  { markerId: "rs10456262_Yoruba", rsid: "rs10456262_Y", gene: "Unknown", trait: "Yoruba Ancestry Marker", continent: "African", subpop: "Yoruba", alleles: ["C"], significance: "High", category: "Ancestry", description: "High significance Ancestry Informative Marker for Yoruba populations (Nigeria).", frequencies: {"AFR":0.96,"AMR":0.04,"EAS":0,"EUR":0,"SAS":0,"MENA":0} },
  { markerId: "rs10456263_Esan", rsid: "rs10456263", gene: "Unknown", trait: "Esan Ancestry Marker", continent: "African", subpop: "Esan", alleles: ["G"], significance: "High", category: "Ancestry", description: "High significance Ancestry Informative Marker for Esan populations (Nigeria).", frequencies: {"AFR":0.97,"AMR":0.02,"EAS":0,"EUR":0,"SAS":0,"MENA":0} },
  { markerId: "rs10456265_Hausa", rsid: "rs10456265", gene: "Unknown", trait: "Hausa Ancestry Marker", continent: "African", subpop: "Hausa", alleles: ["T"], significance: "High", category: "Ancestry", description: "High significance Ancestry Informative Marker for Hausa populations (Nigeria).", frequencies: {"AFR":0.92,"AMR":0.03,"EAS":0,"EUR":0,"SAS":0,"MENA":0.05} },
  { markerId: "rs10456266_Fulani", rsid: "rs10456266", gene: "Unknown", trait: "Fulani Ancestry Marker", continent: "African", subpop: "Fulani", alleles: ["A"], significance: "High", category: "Ancestry", description: "High significance Ancestry Informative Marker for Fulani populations (Nigeria/West Africa).", frequencies: {"AFR":0.88,"AMR":0.02,"EAS":0,"EUR":0.02,"SAS":0,"MENA":0.08} },
  { markerId: "rs10456267_Edo", rsid: "rs10456267", gene: "Unknown", trait: "Edo Ancestry Marker", continent: "African", subpop: "Edo", alleles: ["C"], significance: "High", category: "Ancestry", description: "High significance Ancestry Informative Marker for Edo populations (Nigeria).", frequencies: {"AFR":0.96,"AMR":0.03,"EAS":0,"EUR":0,"SAS":0,"MENA":0} },
  { markerId: "rs10456268_Ibibio", rsid: "rs10456268", gene: "Unknown", trait: "Ibibio Ancestry Marker", continent: "African", subpop: "Ibibio", alleles: ["G"], significance: "High", category: "Ancestry", description: "High significance Ancestry Informative Marker for Ibibio populations (Nigeria).", frequencies: {"AFR":0.95,"AMR":0.04,"EAS":0,"EUR":0,"SAS":0,"MENA":0} },
  { markerId: "rs10456205_Zulu", rsid: "rs10456205_Z", gene: "Unknown", trait: "Zulu Ancestry Marker", continent: "African", subpop: "Zulu", alleles: ["G"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Zulu populations.", frequencies: {"AFR":0.96,"AMR":0.02,"EAS":0,"EUR":0,"SAS":0,"MENA":0} },
  { markerId: "rs1042604_Zulu", rsid: "rs1042604", gene: "TYR", trait: "Zulu Ancestry Marker", continent: "African", subpop: "Zulu", alleles: ["G"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Zulu populations (South Africa).", frequencies: {"AFR":0.94,"AMR":0.02,"EAS":0.01,"EUR":0.01,"SAS":0.01,"MENA":0.01} },
  { markerId: "rs1129039_Zulu", rsid: "rs1129039", gene: "SLC14A2", trait: "Zulu Ancestry Marker", continent: "African", subpop: "Zulu", alleles: ["G"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Zulu populations (South Africa).", frequencies: {"AFR":0.92,"AMR":0.03,"EAS":0.01,"EUR":0.01,"SAS":0.01,"MENA":0.01} },
  { markerId: "M78", aliases: ["rs9305888","i4000024"], gene: "Y-DNA", trait: "Haplogroup E1b1b1a1", continent: "African / European", category: "Ancestry", significance: "High", alleles: ["T","C"], description: "Major NE African / European marker; dominant in Horn of Africa and Balkans." },
  { markerId: "rs1126647", rsid: "rs1126647", gene: "G6PD", trait: "G6PD Deficiency / Malaria Resistance", continent: "African / Mediterranean", category: "Health", significance: "Medium", alleles: ["A"], description: "Associated with G6PD deficiency, providing some resistance to malaria.", referenceUrl: "https://www.snpedia.com/index.php/Rs1126647" },
  { markerId: "rs334", rsid: "rs334", gene: "HBB", trait: "Sickle Cell Trait", continent: "African / Middle Eastern / South Asian", category: "Ancestry", significance: "High", alleles: ["T"], description: "Associated with sickle cell trait and resistance to malaria.", frequencies: {"AFR":0.15,"AMR":0.05,"EAS":0,"EUR":0.01,"SAS":0.05,"MENA":0.08} },
  { markerId: "M217", rsid: "rs2032621", aliases: ["i4000043","rs2032621"], gene: "Y-DNA", trait: "Haplogroup C2", continent: "Asian", category: "Ancestry", significance: "High", alleles: ["C"], description: "Defining marker for Haplogroup C2, common in Mongols, Kazakhs, and indigenous Siberians." },
  { markerId: "L666", gene: "Y-DNA", trait: "Haplogroup N1a2", continent: "Asian", category: "Ancestry", significance: "High", alleles: ["T"], description: "Defining marker for Haplogroup N1a2." },
  { markerId: "Z93", gene: "Y-DNA", trait: "Haplogroup R1a1a1b2", continent: "Asian", category: "Ancestry", significance: "High", alleles: ["C"], description: "Indo-Iranian R1a." },
  { markerId: "Z94", gene: "Y-DNA", trait: "Haplogroup R1a1a1b2a", continent: "Asian", category: "Ancestry", significance: "High", alleles: ["T"], description: "Indo-Iranian R1a branch." },
  { markerId: "M231", rsid: "rs2032630", aliases: ["i4000035","rs2032630"], gene: "Y-DNA", trait: "Haplogroup N", continent: "Asian / European", category: "Ancestry", significance: "High", alleles: ["G"], description: "Defining marker for Haplogroup N, common in Northern Eurasia." },
  { markerId: "M46", aliases: ["Tat","i4000041"], gene: "Y-DNA", trait: "Haplogroup N1a1", continent: "Asian / European", category: "Ancestry", significance: "High", alleles: ["C"], description: "Defining marker for Haplogroup N1a1 (Tat), common in Uralic and Siberian populations." },
  { markerId: "M130", aliases: ["i4000008"], gene: "Y-DNA", trait: "Haplogroup C", continent: "Asian / Oceanian", category: "Ancestry", significance: "High", alleles: ["T","C"], description: "Defining marker for Haplogroup C." },
  { markerId: "M201", rsid: "rs2032633", aliases: ["i4000034","rs2032633"], gene: "Y-DNA", trait: "Haplogroup G", continent: "Caucasian", category: "Ancestry", significance: "High", alleles: ["T","G"], description: "Defining marker for Haplogroup G." },
  { markerId: "rs10456275_Armenian", rsid: "rs10456275", gene: "Unknown", trait: "Armenian Ancestry Marker", continent: "Caucasian", subpop: "Armenian", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Armenian populations.", frequencies: {"AFR":0.01,"AMR":0.01,"EAS":0.01,"EUR":0.4,"SAS":0.05,"MENA":0.95} },
  { markerId: "rs10456276_Azeri", rsid: "rs10456276", gene: "Unknown", trait: "Azeri Ancestry Marker", continent: "Caucasian", subpop: "Azeri", alleles: ["G"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Azeri populations.", frequencies: {"AFR":0.01,"AMR":0.01,"EAS":0.05,"EUR":0.35,"SAS":0.15,"MENA":0.92} },
  { markerId: "rs10456281_Caucasian_3", rsid: "rs10456281", gene: "Unknown", trait: "Caucasian Ancestry Marker", continent: "Caucasian", subpop: "Caucasian", alleles: ["G"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Caucasian populations.", frequencies: {"AFR":0.01,"AMR":0.01,"EAS":0.02,"EUR":0.4,"SAS":0.1,"MENA":0.98} },
  { markerId: "rs10456283_Caucasian_4", rsid: "rs10456283", gene: "Unknown", trait: "Caucasian Ancestry Marker", continent: "Caucasian", subpop: "Caucasian", alleles: ["T"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Caucasian populations.", frequencies: {"AFR":0.01,"AMR":0.01,"EAS":0.01,"EUR":0.35,"SAS":0.05,"MENA":0.97} },
  { markerId: "rs671", rsid: "rs671", gene: "ALDH2", trait: "Alcohol Flushing", continent: "East Asian", category: "Ancestry", significance: "High", alleles: ["A"], description: "Associated with alcohol flushing reaction in East Asian populations.", referenceUrl: "https://www.snpedia.com/index.php/Rs671" },
  { markerId: "rs1229984", rsid: "rs1229984", gene: "ADH1B", trait: "East Asian Alcohol Metabolism", continent: "East Asian", category: "Ancestry", significance: "High", alleles: ["T"], description: "Associated with rapid breakdown of alcohol, highly prevalent in East Asian populations.", referenceUrl: "https://www.snpedia.com/index.php/Rs1229984" },
  { markerId: "rs1869901", rsid: "rs1869901", gene: "FAS", trait: "East Asian Ancestry Marker", continent: "East Asian", category: "Ancestry", significance: "Medium", alleles: ["G"], description: "A variant found at higher frequencies in East Asian populations.", referenceUrl: "https://www.snpedia.com/index.php/Rs1869901" },
  { markerId: "rs1048943", rsid: "rs1048943", gene: "CYP1A1", trait: "East Asian Ancestry Marker", continent: "East Asian", category: "Ancestry", significance: "Medium", alleles: ["G"], description: "A variant in the CYP1A1 gene found predominantly in East Asian populations.", referenceUrl: "https://www.snpedia.com/index.php/Rs1048943" },
  { markerId: "rs17822931", rsid: "rs17822931", gene: "ABCC11", trait: "East Asian Earwax", continent: "East Asian", category: "Ancestry", significance: "High", alleles: ["A"], description: "Determines dry earwax and reduced body odor, highly prevalent in East Asian populations.", referenceUrl: "https://www.snpedia.com/index.php/Rs17822931" },
  { markerId: "rs3827760", rsid: "rs3827760", gene: "EDAR", trait: "East Asian Hair Thickness", continent: "East Asian", category: "Ancestry", significance: "Medium", alleles: ["A"], description: "Associated with thicker hair and increased sweat gland density in East Asian populations.", referenceUrl: "https://www.snpedia.com/index.php/Rs3827760" },
  { markerId: "M174", aliases: ["i4000010"], gene: "Y-DNA", trait: "Haplogroup D", continent: "East Asian", category: "Ancestry", significance: "High", alleles: ["C","T"], description: "Defining marker for Haplogroup D." },
  { markerId: "M175", rsid: "rs2032631", aliases: ["i4000011","rs2032631","rs2032632"], gene: "Y-DNA", trait: "Haplogroup O", continent: "East Asian", category: "Ancestry", significance: "High", alleles: ["T","C"], description: "Defining marker for Haplogroup O, the most common Y-DNA haplogroup in East and Southeast Asia." },
  { markerId: "M119", aliases: ["i4000013"], gene: "Y-DNA", trait: "Haplogroup O1a", continent: "East Asian", category: "Ancestry", significance: "High", alleles: ["C"], description: "Defining marker for Haplogroup O1a, common in Southeast Asia and indigenous Taiwanese." },
  { markerId: "M268", aliases: ["i4000017"], gene: "Y-DNA", trait: "Haplogroup O1b", continent: "East Asian", category: "Ancestry", significance: "High", alleles: ["C"], description: "Defining marker for Haplogroup O1b, common in Southeast Asia and Japan." },
  { markerId: "M122", rsid: "rs2032636", aliases: ["i4000019","rs2032636"], gene: "Y-DNA", trait: "Haplogroup O2", continent: "East Asian", category: "Ancestry", significance: "High", alleles: ["C"], description: "Defining marker for Haplogroup O2 (formerly O3), the dominant paternal lineage in China." },
  { markerId: "M120", gene: "Y-DNA", trait: "Haplogroup Q1a1", continent: "East Asian", category: "Ancestry", significance: "High", alleles: ["T"], description: "Defining marker for Haplogroup Q1a1." },
  { markerId: "rs17822931_Filipino", rsid: "rs17822931", gene: "ABCC11", trait: "Filipino Ancestry Marker", continent: "East Asian", subpop: "Filipino", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Filipino populations.", frequencies: {"AFR":0.03,"AMR":0.08,"EAS":0.78,"EUR":0.02,"SAS":0.1,"MENA":0.01} },
  { markerId: "rs10456292_Hmong", rsid: "rs10456292", gene: "Unknown", trait: "Hmong Ancestry Marker", continent: "East Asian", subpop: "Hmong", alleles: ["C"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Hmong populations.", frequencies: {"AFR":0.01,"AMR":0.01,"EAS":0.98,"EUR":0.01,"SAS":0.01,"MENA":0.01} },
  { markerId: "rs10456293_Hmong", rsid: "rs10456293", gene: "Unknown", trait: "Hmong Ancestry Marker", continent: "East Asian", subpop: "Hmong", alleles: ["T"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Hmong populations.", frequencies: {"AFR":0.01,"AMR":0.01,"EAS":0.97,"EUR":0.01,"SAS":0.01,"MENA":0.01} },
  { markerId: "rs1229984_Indonesian", rsid: "rs1229984", gene: "ADH1B", trait: "Indonesian Ancestry Marker", continent: "East Asian", subpop: "Indonesian", alleles: ["T"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Indonesian populations.", frequencies: {"AFR":0.03,"AMR":0.08,"EAS":0.75,"EUR":0.02,"SAS":0.15,"MENA":0.01} },
  { markerId: "rs1800414_Japanese", rsid: "rs1800414", gene: "OCA2", trait: "Japanese Ancestry Marker", continent: "East Asian", subpop: "Japanese", alleles: ["C"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Japanese populations.", frequencies: {"AFR":0.01,"AMR":0.02,"EAS":0.95,"EUR":0.01,"SAS":0.01,"MENA":0.01} },
  { markerId: "rs1869901_Japanese", rsid: "rs1869901", gene: "FAS", trait: "Japanese Ancestry Marker", continent: "East Asian", subpop: "Japanese", alleles: ["G"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Japanese populations.", frequencies: {"AFR":0.01,"AMR":0.02,"EAS":0.92,"EUR":0.01,"SAS":0.01,"MENA":0.01} },
  { markerId: "rs10456294_Khmer", rsid: "rs10456294", gene: "Unknown", trait: "Khmer Ancestry Marker", continent: "East Asian", subpop: "Khmer", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Khmer (Cambodian) populations.", frequencies: {"AFR":0.02,"AMR":0.02,"EAS":0.92,"EUR":0.01,"SAS":0.1,"MENA":0.01} },
  { markerId: "rs10456295_Khmer", rsid: "rs10456295", gene: "Unknown", trait: "Khmer Ancestry Marker", continent: "East Asian", subpop: "Khmer", alleles: ["G"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Khmer (Cambodian) populations.", frequencies: {"AFR":0.02,"AMR":0.01,"EAS":0.9,"EUR":0.01,"SAS":0.12,"MENA":0.01} },
  { markerId: "rs1048943_Korean", rsid: "rs1048943", gene: "CYP1A1", trait: "Korean Ancestry Marker", continent: "East Asian", subpop: "Korean", alleles: ["G"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Korean populations.", frequencies: {"AFR":0.01,"AMR":0.02,"EAS":0.94,"EUR":0.01,"SAS":0.01,"MENA":0.01} },
  { markerId: "rs17822931_Korean", rsid: "rs17822931", gene: "ABCC11", trait: "Korean Ancestry Marker", continent: "East Asian", subpop: "Korean", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Korean populations.", frequencies: {"AFR":0.01,"AMR":0.01,"EAS":0.98,"EUR":0.01,"SAS":0.01,"MENA":0} },
  { markerId: "rs10456296_Lao", rsid: "rs10456296", gene: "Unknown", trait: "Lao Ancestry Marker", continent: "East Asian", subpop: "Lao", alleles: ["C"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Lao populations.", frequencies: {"AFR":0.02,"AMR":0.02,"EAS":0.94,"EUR":0.01,"SAS":0.08,"MENA":0.01} },
  { markerId: "rs10456297_Lao", rsid: "rs10456297", gene: "Unknown", trait: "Lao Ancestry Marker", continent: "East Asian", subpop: "Lao", alleles: ["T"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Lao populations.", frequencies: {"AFR":0.02,"AMR":0.01,"EAS":0.92,"EUR":0.01,"SAS":0.1,"MENA":0.01} },
  { markerId: "rs1800414_Malay", rsid: "rs1800414", gene: "OCA2", trait: "Malay Ancestry Marker", continent: "East Asian", subpop: "Malay", alleles: ["C"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Malay populations.", frequencies: {"AFR":0.03,"AMR":0.08,"EAS":0.72,"EUR":0.02,"SAS":0.18,"MENA":0.01} },
  { markerId: "rs1229984_Han_North", rsid: "rs1229984", gene: "ADH1B", trait: "Northern Han Ancestry Marker", continent: "East Asian", subpop: "Northern Han", alleles: ["T"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Northern Han Chinese populations.", frequencies: {"AFR":0.01,"AMR":0.02,"EAS":0.9,"EUR":0.01,"SAS":0.05,"MENA":0.01} },
  { markerId: "rs1800414_Han_South", rsid: "rs1800414", gene: "OCA2", trait: "Southern Han Ancestry Marker", continent: "East Asian", subpop: "Southern Han", alleles: ["C"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Southern Han Chinese populations.", frequencies: {"AFR":0.01,"AMR":0.05,"EAS":0.88,"EUR":0.01,"SAS":0.1,"MENA":0.01} },
  { markerId: "rs1048943_Thai", rsid: "rs1048943", gene: "CYP1A1", trait: "Thai Ancestry Marker", continent: "East Asian", subpop: "Thai", alleles: ["G"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Thai populations.", frequencies: {"AFR":0.02,"AMR":0.05,"EAS":0.82,"EUR":0.01,"SAS":0.2,"MENA":0.01} },
  { markerId: "rs1869901_Vietnamese", rsid: "rs1869901", gene: "FAS", trait: "Vietnamese Ancestry Marker", continent: "East Asian", subpop: "Vietnamese", alleles: ["G"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Vietnamese populations.", frequencies: {"AFR":0.02,"AMR":0.05,"EAS":0.85,"EUR":0.01,"SAS":0.15,"MENA":0.01} },
  { markerId: "rs1229984", rsid: "rs1229984", gene: "ADH1B", trait: "Alcohol Metabolism", continent: "East Asian / Native American", category: "Ancestry", significance: "High", alleles: ["A"], description: "Associated with rapid breakdown of alcohol into acetaldehyde.", referenceUrl: "https://www.snpedia.com/index.php/Rs1229984" },
  { markerId: "rs17822931", rsid: "rs17822931", gene: "ABCC11", trait: "Earwax & Body Odor", continent: "East Asian / Native American", category: "Ancestry", significance: "Medium", alleles: ["A"], description: "Determines dry vs. wet earwax and presence of specific body odors.", referenceUrl: "https://www.snpedia.com/index.php/Rs17822931" },
  { markerId: "rs3827760", rsid: "rs3827760", gene: "EDAR", trait: "East Asian / Native American Hair", continent: "East Asian / Native American", category: "Ancestry", significance: "High", alleles: ["G"], description: "Associated with thicker hair and increased sweat gland density in East Asian and Native American populations.", referenceUrl: "https://www.snpedia.com/index.php/Rs3827760" },
  { markerId: "rs7330728", rsid: "rs7330728", gene: "WNT10A", trait: "Native American / East Asian Marker", continent: "East Asian / Native American", category: "Ancestry", significance: "Medium", alleles: ["T"], description: "A variant associated with Native American and East Asian ancestry, linked to tooth morphology.", referenceUrl: "https://www.snpedia.com/index.php/Rs7330728" },
  { markerId: "rs2470102", rsid: "rs2470102", gene: "SLC22A4", trait: "European Ancestry Marker", continent: "European", category: "Ancestry", significance: "Medium", alleles: ["T"], description: "A variant associated with European ancestry and ergothioneine transport.", referenceUrl: "https://www.snpedia.com/index.php/Rs2470102" },
  { markerId: "rs909525", rsid: "rs909525", gene: "PTCHD3", trait: "European Ancestry Marker", continent: "European", category: "Ancestry", significance: "Medium", alleles: ["T"], description: "A variant found almost exclusively in populations of European descent.", referenceUrl: "https://www.snpedia.com/index.php/Rs909525" },
  { markerId: "rs2303627", rsid: "rs2303627", gene: "SPATA13", trait: "European Ancestry Marker", continent: "European", category: "Ancestry", significance: "Medium", alleles: ["A"], description: "A variant found at higher frequencies in European populations.", referenceUrl: "https://www.snpedia.com/index.php/Rs2303627" },
  { markerId: "rs10954737", rsid: "rs10954737", gene: "IRF5", trait: "European Ancestry Marker", continent: "European", category: "Ancestry", significance: "Low", alleles: ["A"], description: "A marker associated with European ancestry.", referenceUrl: "https://www.snpedia.com/index.php/Rs10954737" },
  { markerId: "rs1800404", rsid: "rs1800404", gene: "OCA2", trait: "European Eye Color", continent: "European", category: "Ancestry", significance: "High", alleles: ["G"], description: "Associated with lighter eye color in European populations.", referenceUrl: "https://www.snpedia.com/index.php/Rs1800404" },
  { markerId: "rs11246020", rsid: "rs11246020", gene: "SLC24A4", trait: "European Hair Color Marker", continent: "European", category: "Ancestry", significance: "Medium", alleles: ["T"], description: "A variant associated with lighter hair color in European populations.", referenceUrl: "https://www.snpedia.com/index.php/Rs11246020" },
  { markerId: "rs12891399", rsid: "rs12891399", gene: "SLC24A4", trait: "European Hair Color Marker", continent: "European", category: "Ancestry", significance: "Medium", alleles: ["T"], description: "A variant associated with lighter hair color in European populations.", referenceUrl: "https://www.snpedia.com/index.php/Rs12891399" },
  { markerId: "rs1042602", rsid: "rs1042602", gene: "TYR", trait: "European Pigmentation", continent: "European", category: "Ancestry", significance: "Medium", alleles: ["A"], description: "Associated with lighter skin and eye color in European populations.", referenceUrl: "https://www.snpedia.com/index.php/Rs1042602" },
  { markerId: "rs1805007", rsid: "rs1805007", gene: "MC1R", trait: "European Red Hair", continent: "European", category: "Ancestry", significance: "Medium", alleles: ["T"], description: "Associated with red hair and fair skin in European populations.", referenceUrl: "https://www.snpedia.com/index.php/Rs1805007" },
  { markerId: "rs1805008", rsid: "rs1805008", gene: "MC1R", trait: "European Red Hair", continent: "European", category: "Ancestry", significance: "Medium", alleles: ["T"], description: "Associated with red hair and fair skin in European populations.", referenceUrl: "https://www.snpedia.com/index.php/Rs1805008" },
  { markerId: "rs11547464", rsid: "rs11547464", gene: "MC1R", trait: "European Red Hair", continent: "European", category: "Ancestry", significance: "Medium", alleles: ["T"], description: "Associated with red hair and fair skin in European populations.", referenceUrl: "https://www.snpedia.com/index.php/Rs11547464" },
  { markerId: "CTS5876", gene: "Y-DNA", trait: "Haplogroup E-V13 subclade", continent: "European", category: "Ancestry", significance: "High", alleles: ["T"], description: "Major Balkan branch under V13." },
  { markerId: "V13", aliases: ["rs11800462"], gene: "Y-DNA", trait: "Haplogroup E1b1b1a1b", continent: "European", category: "Ancestry", significance: "High", alleles: ["C"], description: "Dominant in Balkans and SE Europe." },
  { markerId: "P177", gene: "Y-DNA", trait: "Haplogroup E1b1b1a1b1", continent: "European", category: "Ancestry", significance: "High", alleles: ["T"], description: "Defining marker for Haplogroup E1b1b1a1b1." },
  { markerId: "CTS5876", gene: "Y-DNA", trait: "Haplogroup E1b1b1a1b1", continent: "European", category: "Ancestry", significance: "High", alleles: ["G"], description: "Defining marker for Haplogroup E-CTS5876 (Balkan/European)." },
  { markerId: "P96", gene: "Y-DNA", trait: "Haplogroup H2", continent: "European", category: "Ancestry", significance: "High", alleles: ["T"], description: "Defining marker for Haplogroup H2." },
  { markerId: "M170", rsid: "rs2032628", aliases: ["i4000038","rs2032628"], gene: "Y-DNA", trait: "Haplogroup I", continent: "European", category: "Ancestry", significance: "High", alleles: ["C"], description: "Defining marker for Haplogroup I, common in Europe." },
  { markerId: "L22", aliases: ["rs35033377"], gene: "Y-DNA", trait: "Haplogroup I1a1", continent: "European", category: "Ancestry", significance: "High", alleles: ["A"], description: "Defining marker for Haplogroup I1a1 (North/Scandinavian)." },
  { markerId: "Z58", gene: "Y-DNA", trait: "Haplogroup I1a2", continent: "European", category: "Ancestry", significance: "High", alleles: ["T"], description: "Defining marker for Haplogroup I1a2 (West Germanic)." },
  { markerId: "Z140", gene: "Y-DNA", trait: "Haplogroup I1a2a", continent: "European", category: "Ancestry", significance: "High", alleles: ["T"], description: "Defining marker for Haplogroup I1a2a." },
  { markerId: "Z63", gene: "Y-DNA", trait: "Haplogroup I1a3", continent: "European", category: "Ancestry", significance: "High", alleles: ["T"], description: "Defining marker for Haplogroup I1a3 (East Germanic)." },
  { markerId: "Z131", gene: "Y-DNA", trait: "Haplogroup I1b", continent: "European", category: "Ancestry", significance: "High", alleles: ["T"], description: "Defining marker for Haplogroup I1b." },
  { markerId: "Z17943", gene: "Y-DNA", trait: "Haplogroup I1c", continent: "European", category: "Ancestry", significance: "High", alleles: ["T"], description: "Defining marker for Haplogroup I1c." },
  { markerId: "M438", aliases: ["rs34833375"], gene: "Y-DNA", trait: "Haplogroup I2 (root)", continent: "European", category: "Ancestry", significance: "High", alleles: ["T"], description: "Defining marker for Haplogroup I2." },
  { markerId: "P37.2", gene: "Y-DNA", trait: "Haplogroup I2a", continent: "European", category: "Ancestry", significance: "High", alleles: ["T"], description: "Defining marker for Haplogroup I2a (Balkan)." },
  { markerId: "L460", gene: "Y-DNA", trait: "Haplogroup I2a", continent: "European", category: "Ancestry", significance: "High", alleles: ["T"], description: "Defining marker for Haplogroup I2a." },
  { markerId: "M423", gene: "Y-DNA", trait: "Haplogroup I2a1b", continent: "European", category: "Ancestry", significance: "High", alleles: ["T"], description: "Defining marker for Haplogroup I2a1b (Dinaric)." },
  { markerId: "L161", gene: "Y-DNA", trait: "Haplogroup I2a1b1", continent: "European", category: "Ancestry", significance: "High", alleles: ["T"], description: "Defining marker for Haplogroup I2a1b1 (Isles)." },
  { markerId: "L621", gene: "Y-DNA", trait: "Haplogroup I2a1b1a", continent: "European", category: "Ancestry", significance: "High", alleles: ["T"], description: "Defining marker for Haplogroup I2a1b1a (Dinaric-South)." },
  { markerId: "M436", gene: "Y-DNA", trait: "Haplogroup I2b", continent: "European", category: "Ancestry", significance: "High", alleles: ["T"], description: "Defining marker for Haplogroup I2b." },
  { markerId: "M223", aliases: ["rs34933376"], gene: "Y-DNA", trait: "Haplogroup I2b (root)", continent: "European", category: "Ancestry", significance: "High", alleles: ["T"], description: "Defining marker for Haplogroup I2b." },
  { markerId: "M284", gene: "Y-DNA", trait: "Haplogroup I2b1a", continent: "European", category: "Ancestry", significance: "High", alleles: ["T"], description: "Defining marker for Haplogroup I2b1a (British)." },
  { markerId: "L283", gene: "Y-DNA", trait: "Haplogroup J2b2a", continent: "European", category: "Ancestry", significance: "High", alleles: ["T"], description: "Defining marker for Haplogroup J2b2a." },
  { markerId: "L283", gene: "Y-DNA", trait: "Haplogroup J2b2a", continent: "European", category: "Ancestry", significance: "High", alleles: ["T"], description: "Defining marker for Haplogroup J2b2a (Balkan)." },
  { markerId: "Z283", gene: "Y-DNA", trait: "Haplogroup R1a1a1b1", continent: "European", category: "Ancestry", significance: "High", alleles: ["T"], description: "Central/Eastern European R1a." },
  { markerId: "Z282", gene: "Y-DNA", trait: "Haplogroup R1a1a1b1", continent: "European", category: "Ancestry", significance: "High", alleles: ["T"], description: "Northern European R1a." },
  { markerId: "Z280", gene: "Y-DNA", trait: "Haplogroup R1a1a1b1a", continent: "European", category: "Ancestry", significance: "High", alleles: ["T"], description: "Central/Eastern European R1a (Balto-Slavic)." },
  { markerId: "M458", gene: "Y-DNA", trait: "Haplogroup R1a1a1b1a1", continent: "European", category: "Ancestry", significance: "High", alleles: ["T"], description: "Central European R1a (West Slavic)." },
  { markerId: "M343", aliases: ["i4000063","rs9786153"], gene: "Y-DNA", trait: "Haplogroup R1b", continent: "European", category: "Ancestry", significance: "High", alleles: ["T","A"], description: "Defining marker for Haplogroup R1b, common in Western Europe." },
  { markerId: "DF13", gene: "Y-DNA", trait: "Haplogroup R1b-L21 subclade", continent: "European", category: "Ancestry", significance: "High", alleles: ["T"], description: "Major Insular Celtic branch under L21." },
  { markerId: "DF21", gene: "Y-DNA", trait: "Haplogroup R1b-L21 subclade", continent: "European", category: "Ancestry", significance: "High", alleles: ["T"], description: "Subclade of L21 common in the British Isles." },
  { markerId: "DF41", gene: "Y-DNA", trait: "Haplogroup R1b-L21 subclade", continent: "European", category: "Ancestry", significance: "High", alleles: ["T"], description: "Subclade of L21, also known as CTS2501." },
  { markerId: "L48", aliases: ["rs34533372"], gene: "Y-DNA", trait: "Haplogroup R1b-U106 subclade", continent: "European", category: "Ancestry", significance: "High", alleles: ["C"], description: "Major Germanic branch under U106." },
  { markerId: "Z156", gene: "Y-DNA", trait: "Haplogroup R1b-U106 subclade", continent: "European", category: "Ancestry", significance: "High", alleles: ["T"], description: "Subclade of U106." },
  { markerId: "Z18", gene: "Y-DNA", trait: "Haplogroup R1b-U106 subclade", continent: "European", category: "Ancestry", significance: "High", alleles: ["T"], description: "Subclade of U106, often called the North Sea branch." },
  { markerId: "L2", aliases: ["rs34433371"], gene: "Y-DNA", trait: "Haplogroup R1b-U152 subclade", continent: "European", category: "Ancestry", significance: "High", alleles: ["A"], description: "Major Alpine branch under U152." },
  { markerId: "L20", gene: "Y-DNA", trait: "Haplogroup R1b-U152 subclade", continent: "European", category: "Ancestry", significance: "High", alleles: ["A"], description: "Subclade of U152 common in Central Europe." },
  { markerId: "L278", gene: "Y-DNA", trait: "Haplogroup R1b1", continent: "European", category: "Ancestry", significance: "High", alleles: ["T"], description: "Defining marker for Haplogroup R1b1." },
  { markerId: "L754", gene: "Y-DNA", trait: "Haplogroup R1b1a", continent: "European", category: "Ancestry", significance: "High", alleles: ["T"], description: "Defining marker for Haplogroup R1b1a." },
  { markerId: "L23", aliases: ["rs34024838","i4000064"], gene: "Y-DNA", trait: "Haplogroup R1b1a1b", continent: "European", category: "Ancestry", significance: "High", alleles: ["A"], description: "Major R1b branch; ancestor of M269." },
  { markerId: "M269", rsid: "rs9786132", aliases: ["i4000062","rs9786132"], gene: "Y-DNA", trait: "Haplogroup R1b1a1b", continent: "European", category: "Ancestry", significance: "High", alleles: ["T"], description: "Defining marker for Haplogroup R1b1a1b, extremely common in Western Europe." },
  { markerId: "L51", gene: "Y-DNA", trait: "Haplogroup R1b1a1b1a", continent: "European", category: "Ancestry", significance: "High", alleles: ["T"], description: "Defining marker for Haplogroup R1b1a1b1a." },
  { markerId: "P311", aliases: ["rs34233370"], gene: "Y-DNA", trait: "Haplogroup R1b1a1b1a1", continent: "European", category: "Ancestry", significance: "High", alleles: ["T"], description: "Defining marker for Haplogroup R1b1a1b1a1." },
  { markerId: "L11", gene: "Y-DNA", trait: "Haplogroup R1b1a1b1a1", continent: "European", category: "Ancestry", significance: "High", alleles: ["T"], description: "Defining marker for Haplogroup R1b1a1b1a1." },
  { markerId: "P310", gene: "Y-DNA", trait: "Haplogroup R1b1a1b1a1", continent: "European", category: "Ancestry", significance: "High", alleles: ["T"], description: "Defining marker for Haplogroup R1b1a1b1a1." },
  { markerId: "U106", gene: "Y-DNA", trait: "Haplogroup R1b1a1b1a1a", continent: "European", category: "Ancestry", significance: "High", alleles: ["T"], description: "Defining marker for Haplogroup R1b1a1b1a1a (Germanic)." },
  { markerId: "L48", gene: "Y-DNA", trait: "Haplogroup R1b1a1b1a1a1", continent: "European", category: "Ancestry", significance: "High", alleles: ["C"], description: "Defining marker for Haplogroup R1b-L48 (North Sea Germanic)." },
  { markerId: "P312", gene: "Y-DNA", trait: "Haplogroup R1b1a1b1a2", continent: "European", category: "Ancestry", significance: "High", alleles: ["T"], description: "Defining marker for Haplogroup R1b1a1b1a2 (Italo-Celtic)." },
  { markerId: "DF27", gene: "Y-DNA", trait: "Haplogroup R1b1a1b1a2a", continent: "European", category: "Ancestry", significance: "High", alleles: ["T"], description: "Defining marker for Haplogroup R1b1a1b1a2a (Iberian)." },
  { markerId: "Z195", gene: "Y-DNA", trait: "Haplogroup R1b1a1b1a2a1", continent: "European", category: "Ancestry", significance: "High", alleles: ["C"], description: "Defining marker for Haplogroup R1b-Z195 (Iberian)." },
  { markerId: "U152", gene: "Y-DNA", trait: "Haplogroup R1b1a1b1a2b", continent: "European", category: "Ancestry", significance: "High", alleles: ["T"], description: "Defining marker for Haplogroup R1b1a1b1a2b (Alpine)." },
  { markerId: "L2", gene: "Y-DNA", trait: "Haplogroup R1b1a1b1a2b1", continent: "European", category: "Ancestry", significance: "High", alleles: ["G"], description: "Defining marker for Haplogroup R1b-L2 (Alpine/Central European)." },
  { markerId: "L21", gene: "Y-DNA", trait: "Haplogroup R1b1a1b1a2c", continent: "European", category: "Ancestry", significance: "High", alleles: ["T"], description: "Defining marker for Haplogroup R1b1a1b1a2c (Insular Celtic)." },
  { markerId: "M222", gene: "Y-DNA", trait: "Haplogroup R1b1a1b1a2c1a1", continent: "European", category: "Ancestry", significance: "High", alleles: ["G"], description: "Defining marker for Haplogroup R1b-M222 (Northwest Irish/Scottish)." },
  { markerId: "rs6025", rsid: "rs6025", gene: "F5", trait: "Factor V Leiden (Blood Clots)", continent: "European", category: "Health", significance: "High", alleles: ["A"], description: "Associated with an increased risk of developing abnormal blood clots.", interpretations: {"AA":"High risk: Factor V Leiden thrombophilia.","AG":"Moderate risk: Carrier of Factor V Leiden.","GG":"Typical risk: No Factor V Leiden mutation detected."}, referenceUrl: "https://www.snpedia.com/index.php/Rs6025" },
  { markerId: "rs10456310_Acadian", rsid: "rs10456310", gene: "Unknown", trait: "Acadian Ancestry Marker", continent: "European", subpop: "Acadian", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Acadian/Cajun populations.", frequencies: {"AFR":0.01,"AMR":0.01,"EAS":0.01,"EUR":0.95,"SAS":0.01,"MENA":0.01} },
  { markerId: "rs10456311_Acadian", rsid: "rs10456311", gene: "Unknown", trait: "Acadian Ancestry Marker", continent: "European", subpop: "Acadian", alleles: ["G"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Acadian/Cajun populations.", frequencies: {"AFR":0.01,"AMR":0.01,"EAS":0.01,"EUR":0.94,"SAS":0.01,"MENA":0.01} },
  { markerId: "rs11103359_Afrikaner", rsid: "rs11103359", gene: "Unknown", trait: "Afrikaner Ancestry Marker", continent: "European", subpop: "Afrikaner", alleles: ["G"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Afrikaner populations.", frequencies: {"AFR":0.06,"AMR":0.02,"EAS":0.02,"SAS":0.02,"EUR":0.88,"MENA":0.03} },
  { markerId: "rs11103373_Afrikaner", rsid: "rs11103373", gene: "Unknown", trait: "Afrikaner Ancestry Marker", continent: "European", subpop: "Afrikaner", alleles: ["C"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Afrikaner populations.", frequencies: {"AFR":0.07,"AMR":0.02,"EAS":0.02,"SAS":0.02,"EUR":0.87,"MENA":0.03} },
  { markerId: "rs9000172_Afrikaner", rsid: "rs9000172", gene: "Unknown", trait: "Afrikaner Ancestry Marker", continent: "European", subpop: "Afrikaner", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Afrikaner populations.", frequencies: {"AFR":0.05,"AMR":0.05,"EAS":0.05,"EUR":0.8,"SAS":0.05,"MENA":0.05} },
  { markerId: "rs9000173_Afrikaner", rsid: "rs9000173", gene: "Unknown", trait: "Afrikaner Ancestry Marker", continent: "European", subpop: "Afrikaner", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Afrikaner populations.", frequencies: {"AFR":0.05,"AMR":0.05,"EAS":0.05,"EUR":0.8,"SAS":0.05,"MENA":0.05} },
  { markerId: "rs9000216_Albanian", rsid: "rs9000216", gene: "Unknown", trait: "Albanian Ancestry Marker", continent: "European", subpop: "Albanian", alleles: ["C"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Albanian populations.", frequencies: {"AFR":0.03,"AMR":0.05,"EAS":0.01,"EUR":0.75,"SAS":0.1,"MENA":0.15} },
  { markerId: "rs9000217_Albanian", rsid: "rs9000217", gene: "Unknown", trait: "Albanian Ancestry Marker", continent: "European", subpop: "Albanian", alleles: ["T"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Albanian populations.", frequencies: {"AFR":0.03,"AMR":0.05,"EAS":0.01,"EUR":0.74,"SAS":0.1,"MENA":0.15} },
  { markerId: "rs9000200_Albanian", rsid: "rs9000200", gene: "Unknown", trait: "Albanian Ancestry Marker", continent: "European", subpop: "Albanian", alleles: ["C"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Albanian populations.", frequencies: {"AFR":0.04,"AMR":0.08,"EAS":0.02,"EUR":0.8,"SAS":0.1,"MENA":0.5} },
  { markerId: "rs10456254_Albanian", rsid: "rs10456254", gene: "Unknown", trait: "Albanian Ancestry Marker", continent: "European", subpop: "Albanian", alleles: ["G"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Albanian populations.", frequencies: {"AFR":0.03,"AMR":0.04,"EAS":0.01,"EUR":0.75,"SAS":0.07,"MENA":0.1} },
  { markerId: "rs9000290_Alpine", rsid: "rs9000290", gene: "Unknown", trait: "Alpine Ancestry Marker", continent: "European", subpop: "Alpine", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Alpine populations.", frequencies: {"AFR":0.01,"AMR":0.03,"EAS":0.01,"EUR":0.92,"SAS":0.02,"MENA":0.02} },
  { markerId: "rs9000291_Alpine", rsid: "rs9000291", gene: "Unknown", trait: "Alpine Ancestry Marker", continent: "European", subpop: "Alpine", alleles: ["G"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Alpine populations.", frequencies: {"AFR":0.01,"AMR":0.03,"EAS":0.01,"EUR":0.91,"SAS":0.02,"MENA":0.02} },
  { markerId: "rs9000302_Anatolian", rsid: "rs9000302", gene: "Unknown", trait: "Anatolian Ancestry Marker", continent: "European", subpop: "Anatolian", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Anatolian populations.", frequencies: {"AFR":0.05,"AMR":0.03,"EAS":0.02,"EUR":0.5,"SAS":0.05,"MENA":0.4} },
  { markerId: "rs9000303_Anatolian", rsid: "rs9000303", gene: "Unknown", trait: "Anatolian Ancestry Marker", continent: "European", subpop: "Anatolian", alleles: ["G"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Anatolian populations.", frequencies: {"AFR":0.05,"AMR":0.03,"EAS":0.02,"EUR":0.49,"SAS":0.05,"MENA":0.4} },
  { markerId: "rs10456258_Andalusian", rsid: "rs10456258", gene: "Unknown", trait: "Andalusian Ancestry Marker", continent: "European", subpop: "Andalusian", alleles: ["G"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Andalusian populations (Spain).", frequencies: {"AFR":0.08,"AMR":0.12,"EAS":0.01,"EUR":0.65,"SAS":0.01,"MENA":0.13} },
  { markerId: "rs9000286_AngloSaxon", rsid: "rs9000286", gene: "Unknown", trait: "Anglo-Saxon Ancestry Marker", continent: "European", subpop: "Anglo-Saxon", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Anglo-Saxon populations.", frequencies: {"AFR":0.01,"AMR":0.02,"EAS":0.01,"EUR":0.95,"SAS":0.01,"MENA":0.01} },
  { markerId: "rs9000287_AngloSaxon", rsid: "rs9000287", gene: "Unknown", trait: "Anglo-Saxon Ancestry Marker", continent: "European", subpop: "Anglo-Saxon", alleles: ["G"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Anglo-Saxon populations.", frequencies: {"AFR":0.01,"AMR":0.02,"EAS":0.01,"EUR":0.94,"SAS":0.01,"MENA":0.01} },
  { markerId: "rs9000324_Aromanian", rsid: "rs9000324", gene: "Unknown", trait: "Aromanian Ancestry Marker", continent: "European", subpop: "Aromanian", alleles: ["C"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Aromanian populations.", frequencies: {"AFR":0.02,"AMR":0.02,"EAS":0.01,"EUR":0.82,"SAS":0.02,"MENA":0.1} },
  { markerId: "rs9000325_Aromanian", rsid: "rs9000325", gene: "Unknown", trait: "Aromanian Ancestry Marker", continent: "European", subpop: "Aromanian", alleles: ["T"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Aromanian populations.", frequencies: {"AFR":0.02,"AMR":0.02,"EAS":0.01,"EUR":0.81,"SAS":0.02,"MENA":0.1} },
  { markerId: "rs9000122_Ashke", rsid: "rs9000122", gene: "Unknown", trait: "Ashkenazi Ancestry Marker", continent: "European", subpop: "Ashkenazi", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Ashkenazi populations.", frequencies: {"AFR":0.05,"AMR":0.05,"EAS":0.05,"EUR":0.8,"SAS":0.05,"MENA":0.05} },
  { markerId: "rs9000123_Ashke", rsid: "rs9000123", gene: "Unknown", trait: "Ashkenazi Ancestry Marker", continent: "European", subpop: "Ashkenazi", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Ashkenazi populations.", frequencies: {"AFR":0.05,"AMR":0.05,"EAS":0.05,"EUR":0.8,"SAS":0.05,"MENA":0.05} },
  { markerId: "rs9000124_Ashke", rsid: "rs9000124", gene: "Unknown", trait: "Ashkenazi Ancestry Marker", continent: "European", subpop: "Ashkenazi", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Ashkenazi populations.", frequencies: {"AFR":0.05,"AMR":0.05,"EAS":0.05,"EUR":0.8,"SAS":0.05,"MENA":0.05} },
  { markerId: "rs9000246_Ashkenazi", rsid: "rs9000246", gene: "Unknown", trait: "Ashkenazi Ancestry Marker", continent: "European", subpop: "Ashkenazi", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Ashkenazi populations.", frequencies: {"AFR":0.02,"AMR":0.02,"EAS":0.01,"EUR":0.65,"SAS":0.05,"MENA":0.25} },
  { markerId: "rs9000247_Ashkenazi", rsid: "rs9000247", gene: "Unknown", trait: "Ashkenazi Ancestry Marker", continent: "European", subpop: "Ashkenazi", alleles: ["G"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Ashkenazi populations.", frequencies: {"AFR":0.02,"AMR":0.02,"EAS":0.01,"EUR":0.64,"SAS":0.05,"MENA":0.25} },
  { markerId: "rs9000246_Ashkenazi", rsid: "rs9000246", gene: "Unknown", trait: "Ashkenazi Ancestry Marker", continent: "European", subpop: "Ashkenazi", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Ashkenazi populations.", frequencies: {"AFR":0.02,"AMR":0.02,"EAS":0.01,"EUR":0.65,"SAS":0.05,"MENA":0.25} },
  { markerId: "rs9000247_Ashkenazi", rsid: "rs9000247", gene: "Unknown", trait: "Ashkenazi Ancestry Marker", continent: "European", subpop: "Ashkenazi", alleles: ["G"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Ashkenazi populations.", frequencies: {"AFR":0.02,"AMR":0.02,"EAS":0.01,"EUR":0.64,"SAS":0.05,"MENA":0.25} },
  { markerId: "rs10456201_Ashkenazi", rsid: "rs10456201", gene: "Unknown", trait: "Ashkenazi Ancestry Marker", continent: "European", subpop: "Ashkenazi", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Ashkenazi populations.", frequencies: {"AFR":0.01,"AMR":0.01,"EAS":0.01,"EUR":0.7,"SAS":0.02,"MENA":0.25} },
  { markerId: "rs10456202_Ashkenazi", rsid: "rs10456202", gene: "Unknown", trait: "Ashkenazi Ancestry Marker", continent: "European", subpop: "Ashkenazi", alleles: ["G"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Ashkenazi populations.", frequencies: {"AFR":0.01,"AMR":0.01,"EAS":0.01,"EUR":0.68,"SAS":0.02,"MENA":0.25} },
  { markerId: "rs10456197_Austrian", rsid: "rs10456197", gene: "Unknown", trait: "Austrian Ancestry Marker", continent: "European", subpop: "Austrian", alleles: ["G"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Austrian populations.", frequencies: {"AFR":0.01,"AMR":0.05,"EAS":0.02,"EUR":0.92,"SAS":0.05,"MENA":0.1} },
  { markerId: "rs9000105_Austrian", rsid: "rs9000105", gene: "Unknown", trait: "Austrian Ancestry Marker", continent: "European", subpop: "Austrian", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Austrian populations.", frequencies: {"AFR":0.05,"AMR":0.05,"EAS":0.05,"EUR":0.8,"SAS":0.05,"MENA":0.05} },
  { markerId: "rs9000106_Austrian", rsid: "rs9000106", gene: "Unknown", trait: "Austrian Ancestry Marker", continent: "European", subpop: "Austrian", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Austrian populations.", frequencies: {"AFR":0.05,"AMR":0.05,"EAS":0.05,"EUR":0.8,"SAS":0.05,"MENA":0.05} },
  { markerId: "rs9000107_Austrian", rsid: "rs9000107", gene: "Unknown", trait: "Austrian Ancestry Marker", continent: "European", subpop: "Austrian", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Austrian populations.", frequencies: {"AFR":0.05,"AMR":0.05,"EAS":0.05,"EUR":0.8,"SAS":0.05,"MENA":0.05} },
  { markerId: "rs9000108_Austrian", rsid: "rs9000108", gene: "Unknown", trait: "Austrian Ancestry Marker", continent: "European", subpop: "Austrian", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Austrian populations.", frequencies: {"AFR":0.05,"AMR":0.05,"EAS":0.05,"EUR":0.8,"SAS":0.05,"MENA":0.05} },
  { markerId: "rs9000223_Austrian", rsid: "rs9000223", gene: "Unknown", trait: "Austrian Ancestry Marker", continent: "European", subpop: "Austrian", alleles: ["G"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Austrian populations.", frequencies: {"AFR":0.01,"AMR":0.04,"EAS":0.01,"EUR":0.91,"SAS":0.02,"MENA":0.02} },
  { markerId: "rs10456244_Austrian", rsid: "rs10456244", gene: "Unknown", trait: "Austrian Ancestry Marker", continent: "European", subpop: "Austrian", alleles: ["T"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Austrian populations.", frequencies: {"AFR":0.01,"AMR":0.03,"EAS":0.01,"EUR":0.92,"SAS":0.02,"MENA":0.01} },
  { markerId: "rs16891985_Portuguese_Azores", rsid: "rs16891985", gene: "SLC45A2", trait: "Azorean Portuguese Ancestry Marker", continent: "European", subpop: "Azorean Portuguese", alleles: ["C"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Azorean Portuguese populations.", frequencies: {"AFR":0.05,"AMR":0.12,"EAS":0.01,"EUR":0.9,"SAS":0.05,"MENA":0.25} },
  { markerId: "rs9000144_Balkans", rsid: "rs9000144", gene: "Unknown", trait: "Balkans Ancestry Marker", continent: "European", subpop: "Balkans", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Balkans populations.", frequencies: {"AFR":0.05,"AMR":0.05,"EAS":0.05,"EUR":0.8,"SAS":0.05,"MENA":0.05} },
  { markerId: "rs9000145_Balkans", rsid: "rs9000145", gene: "Unknown", trait: "Balkans Ancestry Marker", continent: "European", subpop: "Balkans", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Balkans populations.", frequencies: {"AFR":0.05,"AMR":0.05,"EAS":0.05,"EUR":0.8,"SAS":0.05,"MENA":0.05} },
  { markerId: "rs9000146_Balkans", rsid: "rs9000146", gene: "Unknown", trait: "Balkans Ancestry Marker", continent: "European", subpop: "Balkans", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Balkans populations.", frequencies: {"AFR":0.05,"AMR":0.05,"EAS":0.05,"EUR":0.8,"SAS":0.05,"MENA":0.05} },
  { markerId: "rs9000147_Balkans", rsid: "rs9000147", gene: "Unknown", trait: "Balkans Ancestry Marker", continent: "European", subpop: "Balkans", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Balkans populations.", frequencies: {"AFR":0.05,"AMR":0.05,"EAS":0.05,"EUR":0.8,"SAS":0.05,"MENA":0.05} },
  { markerId: "rs9000256_Balkans", rsid: "rs9000256", gene: "Unknown", trait: "Balkans Ancestry Marker", continent: "European", subpop: "Balkans", alleles: ["C"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Balkans populations.", frequencies: {"AFR":0.03,"AMR":0.05,"EAS":0.02,"EUR":0.78,"SAS":0.05,"MENA":0.1} },
  { markerId: "rs9000257_Balkans", rsid: "rs9000257", gene: "Unknown", trait: "Balkans Ancestry Marker", continent: "European", subpop: "Balkans", alleles: ["T"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Balkans populations.", frequencies: {"AFR":0.03,"AMR":0.05,"EAS":0.02,"EUR":0.77,"SAS":0.05,"MENA":0.1} },
  { markerId: "rs9000294_Baltic", rsid: "rs9000294", gene: "Unknown", trait: "Baltic Ancestry Marker", continent: "European", subpop: "Baltic", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Baltic populations.", frequencies: {"AFR":0.01,"AMR":0.01,"EAS":0.05,"EUR":0.92,"SAS":0.01,"MENA":0.01} },
  { markerId: "rs9000295_Baltic", rsid: "rs9000295", gene: "Unknown", trait: "Baltic Ancestry Marker", continent: "European", subpop: "Baltic", alleles: ["G"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Baltic populations.", frequencies: {"AFR":0.01,"AMR":0.01,"EAS":0.05,"EUR":0.91,"SAS":0.01,"MENA":0.01} },
  { markerId: "rs9000119_Basque", rsid: "rs9000119", gene: "Unknown", trait: "Basque Ancestry Marker", continent: "European", subpop: "Basque", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Basque populations.", frequencies: {"AFR":0.05,"AMR":0.05,"EAS":0.05,"EUR":0.8,"SAS":0.05,"MENA":0.05} },
  { markerId: "rs9000120_Basque", rsid: "rs9000120", gene: "Unknown", trait: "Basque Ancestry Marker", continent: "European", subpop: "Basque", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Basque populations.", frequencies: {"AFR":0.05,"AMR":0.05,"EAS":0.05,"EUR":0.8,"SAS":0.05,"MENA":0.05} },
  { markerId: "rs9000121_Basque", rsid: "rs9000121", gene: "Unknown", trait: "Basque Ancestry Marker", continent: "European", subpop: "Basque", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Basque populations.", frequencies: {"AFR":0.05,"AMR":0.05,"EAS":0.05,"EUR":0.8,"SAS":0.05,"MENA":0.05} },
  { markerId: "rs9000240_Basque", rsid: "rs9000240", gene: "Unknown", trait: "Basque Ancestry Marker", continent: "European", subpop: "Basque", alleles: ["C"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Basque populations.", frequencies: {"AFR":0.01,"AMR":0.05,"EAS":0.01,"EUR":0.92,"SAS":0.01,"MENA":0.05} },
  { markerId: "rs9000241_Basque", rsid: "rs9000241", gene: "Unknown", trait: "Basque Ancestry Marker", continent: "European", subpop: "Basque", alleles: ["T"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Basque populations.", frequencies: {"AFR":0.01,"AMR":0.05,"EAS":0.01,"EUR":0.91,"SAS":0.01,"MENA":0.05} },
  { markerId: "rs10456243_Belgian", rsid: "rs10456243", gene: "Unknown", trait: "Belgian Ancestry Marker", continent: "European", subpop: "Belgian", alleles: ["C"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Belgian populations.", frequencies: {"AFR":0.01,"AMR":0.03,"EAS":0.01,"EUR":0.93,"SAS":0.01,"MENA":0.01} },
  { markerId: "rs9000334_Boyko", rsid: "rs9000334", gene: "Unknown", trait: "Boyko Ancestry Marker", continent: "European", subpop: "Boyko", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Boyko populations.", frequencies: {"AFR":0.01,"AMR":0.02,"EAS":0.05,"EUR":0.9,"SAS":0.01,"MENA":0.01} },
  { markerId: "rs9000335_Boyko", rsid: "rs9000335", gene: "Unknown", trait: "Boyko Ancestry Marker", continent: "European", subpop: "Boyko", alleles: ["G"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Boyko populations.", frequencies: {"AFR":0.01,"AMR":0.02,"EAS":0.05,"EUR":0.89,"SAS":0.01,"MENA":0.01} },
  { markerId: "rs9000310_Breton", rsid: "rs9000310", gene: "Unknown", trait: "Breton Ancestry Marker", continent: "European", subpop: "Breton", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Breton populations.", frequencies: {"AFR":0.01,"AMR":0.02,"EAS":0.01,"EUR":0.95,"SAS":0.01,"MENA":0.01} },
  { markerId: "rs9000311_Breton", rsid: "rs9000311", gene: "Unknown", trait: "Breton Ancestry Marker", continent: "European", subpop: "Breton", alleles: ["G"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Breton populations.", frequencies: {"AFR":0.01,"AMR":0.02,"EAS":0.01,"EUR":0.94,"SAS":0.01,"MENA":0.01} },
  { markerId: "rs9000188_Breton", rsid: "rs9000188", gene: "Unknown", trait: "Breton Ancestry Marker", continent: "European", subpop: "Breton", alleles: ["C"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Breton populations.", frequencies: {"AFR":0.01,"AMR":0.02,"EAS":0,"EUR":0.97,"SAS":0.01,"MENA":0.02} },
  { markerId: "rs10456192_British", rsid: "rs10456192", gene: "Unknown", trait: "British Ancestry Marker", continent: "European", subpop: "British", alleles: ["T"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for British populations.", frequencies: {"AFR":0.01,"AMR":0.05,"EAS":0,"EUR":0.98,"SAS":0.01,"MENA":0.02} },
  { markerId: "rs9000091_British", rsid: "rs9000091", gene: "Unknown", trait: "British Ancestry Marker", continent: "European", subpop: "British", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for British populations.", frequencies: {"AFR":0.05,"AMR":0.05,"EAS":0.05,"EUR":0.8,"SAS":0.05,"MENA":0.05} },
  { markerId: "rs9000092_British", rsid: "rs9000092", gene: "Unknown", trait: "British Ancestry Marker", continent: "European", subpop: "British", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for British populations.", frequencies: {"AFR":0.05,"AMR":0.05,"EAS":0.05,"EUR":0.8,"SAS":0.05,"MENA":0.05} },
  { markerId: "rs9000093_British", rsid: "rs9000093", gene: "Unknown", trait: "British Ancestry Marker", continent: "European", subpop: "British", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for British populations.", frequencies: {"AFR":0.05,"AMR":0.05,"EAS":0.05,"EUR":0.8,"SAS":0.05,"MENA":0.05} },
  { markerId: "rs9000094_British", rsid: "rs9000094", gene: "Unknown", trait: "British Ancestry Marker", continent: "European", subpop: "British", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for British populations.", frequencies: {"AFR":0.05,"AMR":0.05,"EAS":0.05,"EUR":0.8,"SAS":0.05,"MENA":0.05} },
  { markerId: "rs9000276_British", rsid: "rs9000276", gene: "Unknown", trait: "British Ancestry Marker", continent: "European", subpop: "British", alleles: ["C"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for British populations.", frequencies: {"AFR":0.01,"AMR":0.03,"EAS":0.01,"EUR":0.94,"SAS":0.01,"MENA":0.01} },
  { markerId: "rs9000277_British", rsid: "rs9000277", gene: "Unknown", trait: "British Ancestry Marker", continent: "European", subpop: "British", alleles: ["T"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for British populations.", frequencies: {"AFR":0.01,"AMR":0.03,"EAS":0.01,"EUR":0.93,"SAS":0.01,"MENA":0.01} },
  { markerId: "rs9000260_BritIsles", rsid: "rs9000260", gene: "Unknown", trait: "British Isles Ancestry Marker", continent: "European", subpop: "British Isles", alleles: ["C"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for British Isles populations.", frequencies: {"AFR":0.01,"AMR":0.03,"EAS":0.01,"EUR":0.96,"SAS":0.01,"MENA":0.01} },
  { markerId: "rs9000261_BritIsles", rsid: "rs9000261", gene: "Unknown", trait: "British Isles Ancestry Marker", continent: "European", subpop: "British Isles", alleles: ["T"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for British Isles populations.", frequencies: {"AFR":0.01,"AMR":0.03,"EAS":0.01,"EUR":0.95,"SAS":0.01,"MENA":0.01} },
  { markerId: "rs9000136_BritIsles", rsid: "rs9000136", gene: "Unknown", trait: "British Isles Ancestry Marker", continent: "European", subpop: "BritishIsles", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for British Isles populations.", frequencies: {"AFR":0.05,"AMR":0.05,"EAS":0.05,"EUR":0.8,"SAS":0.05,"MENA":0.05} },
  { markerId: "rs9000137_BritIsles", rsid: "rs9000137", gene: "Unknown", trait: "British Isles Ancestry Marker", continent: "European", subpop: "BritishIsles", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for British Isles populations.", frequencies: {"AFR":0.05,"AMR":0.05,"EAS":0.05,"EUR":0.8,"SAS":0.05,"MENA":0.05} },
  { markerId: "rs9000138_BritIsles", rsid: "rs9000138", gene: "Unknown", trait: "British Isles Ancestry Marker", continent: "European", subpop: "BritishIsles", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for British Isles populations.", frequencies: {"AFR":0.05,"AMR":0.05,"EAS":0.05,"EUR":0.8,"SAS":0.05,"MENA":0.05} },
  { markerId: "rs9000139_BritIsles", rsid: "rs9000139", gene: "Unknown", trait: "British Isles Ancestry Marker", continent: "European", subpop: "BritishIsles", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for British Isles populations.", frequencies: {"AFR":0.05,"AMR":0.05,"EAS":0.05,"EUR":0.8,"SAS":0.05,"MENA":0.05} },
  { markerId: "rs9000214_Bulgarian", rsid: "rs9000214", gene: "Unknown", trait: "Bulgarian Ancestry Marker", continent: "European", subpop: "Bulgarian", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Bulgarian populations.", frequencies: {"AFR":0.03,"AMR":0.05,"EAS":0.02,"EUR":0.78,"SAS":0.05,"MENA":0.12} },
  { markerId: "rs9000215_Bulgarian", rsid: "rs9000215", gene: "Unknown", trait: "Bulgarian Ancestry Marker", continent: "European", subpop: "Bulgarian", alleles: ["G"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Bulgarian populations.", frequencies: {"AFR":0.03,"AMR":0.05,"EAS":0.02,"EUR":0.77,"SAS":0.05,"MENA":0.12} },
  { markerId: "rs9000200_Bulgarian", rsid: "rs9000200", gene: "Unknown", trait: "Bulgarian Ancestry Marker", continent: "European", subpop: "Bulgarian", alleles: ["C"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Bulgarian populations.", frequencies: {"AFR":0.03,"AMR":0.06,"EAS":0.03,"EUR":0.82,"SAS":0.08,"MENA":0.3} },
  { markerId: "rs10456250_Bulgarian", rsid: "rs10456250", gene: "Unknown", trait: "Bulgarian Ancestry Marker", continent: "European", subpop: "Bulgarian", alleles: ["G"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Bulgarian populations.", frequencies: {"AFR":0.03,"AMR":0.04,"EAS":0.02,"EUR":0.78,"SAS":0.05,"MENA":0.08} },
  { markerId: "rs10456257_Castilian", rsid: "rs10456257", gene: "Unknown", trait: "Castilian Ancestry Marker", continent: "European", subpop: "Castilian", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Castilian populations (Spain).", frequencies: {"AFR":0.04,"AMR":0.1,"EAS":0.01,"EUR":0.78,"SAS":0.01,"MENA":0.06} },
  { markerId: "rs10456259_Catalan", rsid: "rs10456259", gene: "Unknown", trait: "Catalan Ancestry Marker", continent: "European", subpop: "Catalan", alleles: ["C"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Catalan populations (Spain).", frequencies: {"AFR":0.03,"AMR":0.08,"EAS":0.01,"EUR":0.82,"SAS":0.01,"MENA":0.05} },
  { markerId: "rs9000300_Caucasian", rsid: "rs9000300", gene: "Unknown", trait: "Caucasian (Caucasus) Ancestry Marker", continent: "European", subpop: "Caucasian", alleles: ["C"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Caucasus populations.", frequencies: {"AFR":0.02,"AMR":0.02,"EAS":0.02,"EUR":0.6,"SAS":0.1,"MENA":0.3} },
  { markerId: "rs9000301_Caucasian", rsid: "rs9000301", gene: "Unknown", trait: "Caucasian (Caucasus) Ancestry Marker", continent: "European", subpop: "Caucasian", alleles: ["T"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Caucasus populations.", frequencies: {"AFR":0.02,"AMR":0.02,"EAS":0.02,"EUR":0.59,"SAS":0.1,"MENA":0.3} },
  { markerId: "rs9000284_Celtic", rsid: "rs9000284", gene: "Unknown", trait: "Celtic Ancestry Marker", continent: "European", subpop: "Celtic", alleles: ["C"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Celtic populations.", frequencies: {"AFR":0.01,"AMR":0.03,"EAS":0.01,"EUR":0.94,"SAS":0.01,"MENA":0.01} },
  { markerId: "rs9000285_Celtic", rsid: "rs9000285", gene: "Unknown", trait: "Celtic Ancestry Marker", continent: "European", subpop: "Celtic", alleles: ["T"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Celtic populations.", frequencies: {"AFR":0.01,"AMR":0.03,"EAS":0.01,"EUR":0.93,"SAS":0.01,"MENA":0.01} },
  { markerId: "rs9000266_C_Euro", rsid: "rs9000266", gene: "Unknown", trait: "Central European Ancestry Marker", continent: "European", subpop: "Central European", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Central European populations.", frequencies: {"AFR":0.01,"AMR":0.03,"EAS":0.02,"EUR":0.9,"SAS":0.02,"MENA":0.02} },
  { markerId: "rs9000267_C_Euro", rsid: "rs9000267", gene: "Unknown", trait: "Central European Ancestry Marker", continent: "European", subpop: "Central European", alleles: ["G"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Central European populations.", frequencies: {"AFR":0.01,"AMR":0.03,"EAS":0.02,"EUR":0.89,"SAS":0.02,"MENA":0.02} },
  { markerId: "rs9000312_Cornish", rsid: "rs9000312", gene: "Unknown", trait: "Cornish Ancestry Marker", continent: "European", subpop: "Cornish", alleles: ["C"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Cornish populations.", frequencies: {"AFR":0.01,"AMR":0.02,"EAS":0.01,"EUR":0.96,"SAS":0.01,"MENA":0.01} },
  { markerId: "rs9000313_Cornish", rsid: "rs9000313", gene: "Unknown", trait: "Cornish Ancestry Marker", continent: "European", subpop: "Cornish", alleles: ["T"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Cornish populations.", frequencies: {"AFR":0.01,"AMR":0.02,"EAS":0.01,"EUR":0.95,"SAS":0.01,"MENA":0.01} },
  { markerId: "rs9000166_Cornish", rsid: "rs9000166", gene: "Unknown", trait: "Cornish Ancestry Marker", continent: "European", subpop: "Cornish", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Cornish populations.", frequencies: {"AFR":0.01,"AMR":0.01,"EAS":0,"EUR":0.98,"SAS":0.01,"MENA":0.01} },
  { markerId: "rs9000312_Cornish", rsid: "rs9000312", gene: "Unknown", trait: "Cornish Ancestry Marker", continent: "European", subpop: "Cornish", alleles: ["C"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Cornish populations.", frequencies: {"AFR":0.01,"AMR":0.02,"EAS":0.01,"EUR":0.96,"SAS":0.01,"MENA":0.01} },
  { markerId: "rs9000313_Cornish", rsid: "rs9000313", gene: "Unknown", trait: "Cornish Ancestry Marker", continent: "European", subpop: "Cornish", alleles: ["T"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Cornish populations.", frequencies: {"AFR":0.01,"AMR":0.02,"EAS":0.01,"EUR":0.95,"SAS":0.01,"MENA":0.01} },
  { markerId: "rs9000308_Corsican", rsid: "rs9000308", gene: "Unknown", trait: "Corsican Ancestry Marker", continent: "European", subpop: "Corsican", alleles: ["C"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Corsican populations.", frequencies: {"AFR":0.02,"AMR":0.02,"EAS":0.01,"EUR":0.8,"SAS":0.01,"MENA":0.1} },
  { markerId: "rs9000309_Corsican", rsid: "rs9000309", gene: "Unknown", trait: "Corsican Ancestry Marker", continent: "European", subpop: "Corsican", alleles: ["T"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Corsican populations.", frequencies: {"AFR":0.02,"AMR":0.02,"EAS":0.01,"EUR":0.79,"SAS":0.01,"MENA":0.1} },
  { markerId: "rs9000220_Croatian", rsid: "rs9000220", gene: "Unknown", trait: "Croatian Ancestry Marker", continent: "European", subpop: "Croatian", alleles: ["C"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Croatian populations.", frequencies: {"AFR":0.01,"AMR":0.03,"EAS":0.02,"EUR":0.85,"SAS":0.04,"MENA":0.05} },
  { markerId: "rs9000221_Croatian", rsid: "rs9000221", gene: "Unknown", trait: "Croatian Ancestry Marker", continent: "European", subpop: "Croatian", alleles: ["T"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Croatian populations.", frequencies: {"AFR":0.01,"AMR":0.03,"EAS":0.02,"EUR":0.84,"SAS":0.04,"MENA":0.05} },
  { markerId: "rs9000200_Croatian", rsid: "rs9000200", gene: "Unknown", trait: "Croatian Ancestry Marker", continent: "European", subpop: "Croatian", alleles: ["C"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Croatian populations.", frequencies: {"AFR":0.01,"AMR":0.04,"EAS":0.01,"EUR":0.9,"SAS":0.03,"MENA":0.15} },
  { markerId: "rs10456252_Croatian", rsid: "rs10456252", gene: "Unknown", trait: "Croatian Ancestry Marker", continent: "European", subpop: "Croatian", alleles: ["T"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Croatian populations.", frequencies: {"AFR":0.01,"AMR":0.03,"EAS":0.02,"EUR":0.85,"SAS":0.04,"MENA":0.05} },
  { markerId: "rs9000328_Csango", rsid: "rs9000328", gene: "Unknown", trait: "Csango Ancestry Marker", continent: "European", subpop: "Csango", alleles: ["C"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Csango populations.", frequencies: {"AFR":0.01,"AMR":0.02,"EAS":0.04,"EUR":0.89,"SAS":0.01,"MENA":0.02} },
  { markerId: "rs9000329_Csango", rsid: "rs9000329", gene: "Unknown", trait: "Csango Ancestry Marker", continent: "European", subpop: "Csango", alleles: ["T"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Csango populations.", frequencies: {"AFR":0.01,"AMR":0.02,"EAS":0.04,"EUR":0.88,"SAS":0.01,"MENA":0.02} },
  { markerId: "rs9000236_Cypriot", rsid: "rs9000236", gene: "Unknown", trait: "Cypriot Ancestry Marker", continent: "European", subpop: "Cypriot", alleles: ["C"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Cypriot populations.", frequencies: {"AFR":0.04,"AMR":0.04,"EAS":0.01,"EUR":0.6,"SAS":0.1,"MENA":0.3} },
  { markerId: "rs9000237_Cypriot", rsid: "rs9000237", gene: "Unknown", trait: "Cypriot Ancestry Marker", continent: "European", subpop: "Cypriot", alleles: ["T"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Cypriot populations.", frequencies: {"AFR":0.04,"AMR":0.04,"EAS":0.01,"EUR":0.59,"SAS":0.1,"MENA":0.3} },
  { markerId: "rs9000236_Cypriot", rsid: "rs9000236", gene: "Unknown", trait: "Cypriot Ancestry Marker", continent: "European", subpop: "Cypriot", alleles: ["C"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Cypriot populations.", frequencies: {"AFR":0.04,"AMR":0.04,"EAS":0.01,"EUR":0.6,"SAS":0.1,"MENA":0.3} },
  { markerId: "rs9000237_Cypriot", rsid: "rs9000237", gene: "Unknown", trait: "Cypriot Ancestry Marker", continent: "European", subpop: "Cypriot", alleles: ["T"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Cypriot populations.", frequencies: {"AFR":0.04,"AMR":0.04,"EAS":0.01,"EUR":0.59,"SAS":0.1,"MENA":0.3} },
  { markerId: "rs10456199_Czech", rsid: "rs10456199", gene: "Unknown", trait: "Czech Ancestry Marker", continent: "European", subpop: "Czech", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Czech populations.", frequencies: {"AFR":0.02,"AMR":0.05,"EAS":0.05,"EUR":0.89,"SAS":0.08,"MENA":0.12} },
  { markerId: "rs9000113_Czech", rsid: "rs9000113", gene: "Unknown", trait: "Czech Ancestry Marker", continent: "European", subpop: "Czech", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Czech populations.", frequencies: {"AFR":0.05,"AMR":0.05,"EAS":0.05,"EUR":0.8,"SAS":0.05,"MENA":0.05} },
  { markerId: "rs9000114_Czech", rsid: "rs9000114", gene: "Unknown", trait: "Czech Ancestry Marker", continent: "European", subpop: "Czech", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Czech populations.", frequencies: {"AFR":0.05,"AMR":0.05,"EAS":0.05,"EUR":0.8,"SAS":0.05,"MENA":0.05} },
  { markerId: "rs9000115_Czech", rsid: "rs9000115", gene: "Unknown", trait: "Czech Ancestry Marker", continent: "European", subpop: "Czech", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Czech populations.", frequencies: {"AFR":0.05,"AMR":0.05,"EAS":0.05,"EUR":0.8,"SAS":0.05,"MENA":0.05} },
  { markerId: "rs9000116_Czech", rsid: "rs9000116", gene: "Unknown", trait: "Czech Ancestry Marker", continent: "European", subpop: "Czech", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Czech populations.", frequencies: {"AFR":0.05,"AMR":0.05,"EAS":0.05,"EUR":0.8,"SAS":0.05,"MENA":0.05} },
  { markerId: "rs9000210_Czech", rsid: "rs9000210", gene: "Unknown", trait: "Czech Ancestry Marker", continent: "European", subpop: "Czech", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Czech populations.", frequencies: {"AFR":0.01,"AMR":0.03,"EAS":0.02,"EUR":0.9,"SAS":0.02,"MENA":0.02} },
  { markerId: "rs9000211_Czech", rsid: "rs9000211", gene: "Unknown", trait: "Czech Ancestry Marker", continent: "European", subpop: "Czech", alleles: ["G"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Czech populations.", frequencies: {"AFR":0.01,"AMR":0.03,"EAS":0.02,"EUR":0.89,"SAS":0.02,"MENA":0.02} },
  { markerId: "rs10456246_Czech", rsid: "rs10456246", gene: "Unknown", trait: "Czech Ancestry Marker", continent: "European", subpop: "Czech", alleles: ["G"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Czech populations.", frequencies: {"AFR":0.01,"AMR":0.02,"EAS":0.03,"EUR":0.9,"SAS":0.02,"MENA":0.02} },
  { markerId: "rs9000184_Danish", rsid: "rs9000184", gene: "Unknown", trait: "Danish Ancestry Marker", continent: "European", subpop: "Danish", alleles: ["C"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Danish populations.", frequencies: {"AFR":0.01,"AMR":0.01,"EAS":0.01,"EUR":0.94,"SAS":0.01,"MENA":0.01} },
  { markerId: "rs9000185_Danish", rsid: "rs9000185", gene: "Unknown", trait: "Danish Ancestry Marker", continent: "European", subpop: "Danish", alleles: ["T"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Danish populations.", frequencies: {"AFR":0,"AMR":0.01,"EAS":0.01,"EUR":0.93,"SAS":0.01,"MENA":0.01} },
  { markerId: "rs9000184_Danish", rsid: "rs9000184", gene: "Unknown", trait: "Danish Ancestry Marker", continent: "European", subpop: "Danish", alleles: ["C"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Danish populations.", frequencies: {"AFR":0.01,"AMR":0.01,"EAS":0.01,"EUR":0.94,"SAS":0.01,"MENA":0.01} },
  { markerId: "rs9000185_Danish", rsid: "rs9000185", gene: "Unknown", trait: "Danish Ancestry Marker", continent: "European", subpop: "Danish", alleles: ["T"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Danish populations.", frequencies: {"AFR":0,"AMR":0.01,"EAS":0.01,"EUR":0.93,"SAS":0.01,"MENA":0.01} },
  { markerId: "rs9000292_Dinaric", rsid: "rs9000292", gene: "Unknown", trait: "Dinaric Ancestry Marker", continent: "European", subpop: "Dinaric", alleles: ["C"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Dinaric populations.", frequencies: {"AFR":0.02,"AMR":0.03,"EAS":0.01,"EUR":0.85,"SAS":0.03,"MENA":0.08} },
  { markerId: "rs9000293_Dinaric", rsid: "rs9000293", gene: "Unknown", trait: "Dinaric Ancestry Marker", continent: "European", subpop: "Dinaric", alleles: ["T"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Dinaric populations.", frequencies: {"AFR":0.02,"AMR":0.03,"EAS":0.01,"EUR":0.84,"SAS":0.03,"MENA":0.08} },
  { markerId: "rs10456195_Dutch", rsid: "rs10456195", gene: "Unknown", trait: "Dutch Ancestry Marker", continent: "European", subpop: "Dutch", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Dutch populations.", frequencies: {"AFR":0.01,"AMR":0.05,"EAS":0,"EUR":0.96,"SAS":0.02,"MENA":0.05} },
  { markerId: "rs11103344_Dutch", rsid: "rs11103344", gene: "Unknown", trait: "Dutch Ancestry Marker", continent: "European", subpop: "Dutch", alleles: ["G"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Dutch populations.", frequencies: {"AFR":0.01,"AMR":0.02,"EAS":0.01,"SAS":0.01,"EUR":0.98,"MENA":0.01} },
  { markerId: "rs11103358_Dutch", rsid: "rs11103358", gene: "Unknown", trait: "Dutch Ancestry Marker", continent: "European", subpop: "Dutch", alleles: ["T"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Dutch populations.", frequencies: {"AFR":0.01,"AMR":0.02,"EAS":0.01,"SAS":0.01,"EUR":0.97,"MENA":0.01} },
  { markerId: "rs11103372_Dutch", rsid: "rs11103372", gene: "Unknown", trait: "Dutch Ancestry Marker", continent: "European", subpop: "Dutch", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Dutch populations.", frequencies: {"AFR":0.01,"AMR":0.02,"EAS":0.01,"SAS":0.01,"EUR":0.96,"MENA":0.01} },
  { markerId: "rs9000099_Dutch", rsid: "rs9000099", gene: "Unknown", trait: "Dutch Ancestry Marker", continent: "European", subpop: "Dutch", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Dutch populations.", frequencies: {"AFR":0.05,"AMR":0.05,"EAS":0.05,"EUR":0.8,"SAS":0.05,"MENA":0.05} },
  { markerId: "rs9000100_Dutch", rsid: "rs9000100", gene: "Unknown", trait: "Dutch Ancestry Marker", continent: "European", subpop: "Dutch", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Dutch populations.", frequencies: {"AFR":0.05,"AMR":0.05,"EAS":0.05,"EUR":0.8,"SAS":0.05,"MENA":0.05} },
  { markerId: "rs9000192_Dutch", rsid: "rs9000192", gene: "Unknown", trait: "Dutch Ancestry Marker", continent: "European", subpop: "Dutch", alleles: ["C"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Dutch populations.", frequencies: {"AFR":0.01,"AMR":0.05,"EAS":0.01,"EUR":0.92,"SAS":0.01,"MENA":0.01} },
  { markerId: "rs9000193_Dutch", rsid: "rs9000193", gene: "Unknown", trait: "Dutch Ancestry Marker", continent: "European", subpop: "Dutch", alleles: ["T"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Dutch populations.", frequencies: {"AFR":0.01,"AMR":0.05,"EAS":0.01,"EUR":0.91,"SAS":0.01,"MENA":0.01} },
  { markerId: "rs9000160_EastEuro_Spaced", rsid: "rs9000160", gene: "Unknown", trait: "Eastern European Ancestry Marker", continent: "European", subpop: "Eastern European", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Eastern European populations.", frequencies: {"AFR":0.05,"AMR":0.05,"EAS":0.05,"EUR":0.8,"SAS":0.05,"MENA":0.05} },
  { markerId: "rs9000161_EastEuro_Spaced", rsid: "rs9000161", gene: "Unknown", trait: "Eastern European Ancestry Marker", continent: "European", subpop: "Eastern European", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Eastern European populations.", frequencies: {"AFR":0.05,"AMR":0.05,"EAS":0.05,"EUR":0.8,"SAS":0.05,"MENA":0.05} },
  { markerId: "rs9000162_EastEuro_Spaced", rsid: "rs9000162", gene: "Unknown", trait: "Eastern European Ancestry Marker", continent: "European", subpop: "Eastern European", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Eastern European populations.", frequencies: {"AFR":0.05,"AMR":0.05,"EAS":0.05,"EUR":0.8,"SAS":0.05,"MENA":0.05} },
  { markerId: "rs9000163_EastEuro_Spaced", rsid: "rs9000163", gene: "Unknown", trait: "Eastern European Ancestry Marker", continent: "European", subpop: "Eastern European", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Eastern European populations.", frequencies: {"AFR":0.05,"AMR":0.05,"EAS":0.05,"EUR":0.8,"SAS":0.05,"MENA":0.05} },
  { markerId: "rs9000254_E_Euro", rsid: "rs9000254", gene: "Unknown", trait: "Eastern European Ancestry Marker", continent: "European", subpop: "Eastern European", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Eastern European populations.", frequencies: {"AFR":0.01,"AMR":0.03,"EAS":0.08,"EUR":0.85,"SAS":0.05,"MENA":0.05} },
  { markerId: "rs9000255_E_Euro", rsid: "rs9000255", gene: "Unknown", trait: "Eastern European Ancestry Marker", continent: "European", subpop: "Eastern European", alleles: ["G"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Eastern European populations.", frequencies: {"AFR":0.01,"AMR":0.03,"EAS":0.08,"EUR":0.84,"SAS":0.05,"MENA":0.05} },
  { markerId: "rs1129038_Polish_East", rsid: "rs1129038", gene: "SLC14A2", trait: "Eastern Polish Ancestry Marker", continent: "European", subpop: "Eastern Polish", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Eastern Polish populations.", frequencies: {"AFR":0.01,"AMR":0.03,"EAS":0.1,"EUR":0.9,"SAS":0.05,"MENA":0.1} },
  { markerId: "rs9000140_EastEuro", rsid: "rs9000140", gene: "Unknown", trait: "Eastern European Ancestry Marker", continent: "European", subpop: "EasternEuropean", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Eastern European populations.", frequencies: {"AFR":0.05,"AMR":0.05,"EAS":0.05,"EUR":0.8,"SAS":0.05,"MENA":0.05} },
  { markerId: "rs9000141_EastEuro", rsid: "rs9000141", gene: "Unknown", trait: "Eastern European Ancestry Marker", continent: "European", subpop: "EasternEuropean", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Eastern European populations.", frequencies: {"AFR":0.05,"AMR":0.05,"EAS":0.05,"EUR":0.8,"SAS":0.05,"MENA":0.05} },
  { markerId: "rs9000142_EastEuro", rsid: "rs9000142", gene: "Unknown", trait: "Eastern European Ancestry Marker", continent: "European", subpop: "EasternEuropean", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Eastern European populations.", frequencies: {"AFR":0.05,"AMR":0.05,"EAS":0.05,"EUR":0.8,"SAS":0.05,"MENA":0.05} },
  { markerId: "rs9000143_EastEuro", rsid: "rs9000143", gene: "Unknown", trait: "Eastern European Ancestry Marker", continent: "European", subpop: "EasternEuropean", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Eastern European populations.", frequencies: {"AFR":0.05,"AMR":0.05,"EAS":0.05,"EUR":0.8,"SAS":0.05,"MENA":0.05} },
  { markerId: "rs11103339_English", rsid: "rs11103339", gene: "Unknown", trait: "English Ancestry Marker", continent: "European", subpop: "English", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for English populations.", frequencies: {"AFR":0.01,"AMR":0.02,"EAS":0.01,"SAS":0.01,"EUR":0.98,"MENA":0.01} },
  { markerId: "rs11103353_English", rsid: "rs11103353", gene: "Unknown", trait: "English Ancestry Marker", continent: "European", subpop: "English", alleles: ["C"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for English populations.", frequencies: {"AFR":0.01,"AMR":0.01,"EAS":0.01,"SAS":0.01,"EUR":0.97,"MENA":0.01} },
  { markerId: "rs11103367_English", rsid: "rs11103367", gene: "Unknown", trait: "English Ancestry Marker", continent: "European", subpop: "English", alleles: ["T"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for English populations.", frequencies: {"AFR":0.01,"AMR":0.01,"EAS":0.01,"SAS":0.01,"EUR":0.96,"MENA":0.01} },
  { markerId: "rs9000164_English", rsid: "rs9000164", gene: "Unknown", trait: "English Ancestry Marker", continent: "European", subpop: "English", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for English populations.", frequencies: {"AFR":0.05,"AMR":0.05,"EAS":0.05,"EUR":0.8,"SAS":0.05,"MENA":0.05} },
  { markerId: "rs9000165_English", rsid: "rs9000165", gene: "Unknown", trait: "English Ancestry Marker", continent: "European", subpop: "English", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for English populations.", frequencies: {"AFR":0.05,"AMR":0.05,"EAS":0.05,"EUR":0.8,"SAS":0.05,"MENA":0.05} },
  { markerId: "rs9000232_Estonian", rsid: "rs9000232", gene: "Unknown", trait: "Estonian Ancestry Marker", continent: "European", subpop: "Estonian", alleles: ["C"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Estonian populations.", frequencies: {"AFR":0,"AMR":0.02,"EAS":0.06,"EUR":0.87,"SAS":0.01,"MENA":0.02} },
  { markerId: "rs9000233_Estonian", rsid: "rs9000233", gene: "Unknown", trait: "Estonian Ancestry Marker", continent: "European", subpop: "Estonian", alleles: ["T"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Estonian populations.", frequencies: {"AFR":0,"AMR":0.02,"EAS":0.06,"EUR":0.86,"SAS":0.01,"MENA":0.02} },
  { markerId: "rs9000186_Estonian", rsid: "rs9000186", gene: "Unknown", trait: "Estonian Ancestry Marker", continent: "European", subpop: "Estonian", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Estonian populations.", frequencies: {"AFR":0,"AMR":0.01,"EAS":0.08,"EUR":0.94,"SAS":0.01,"MENA":0.01} },
  { markerId: "rs9000232_Estonian", rsid: "rs9000232", gene: "Unknown", trait: "Estonian Ancestry Marker", continent: "European", subpop: "Estonian", alleles: ["C"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Estonian populations.", frequencies: {"AFR":0,"AMR":0.02,"EAS":0.06,"EUR":0.87,"SAS":0.01,"MENA":0.02} },
  { markerId: "rs9000233_Estonian", rsid: "rs9000233", gene: "Unknown", trait: "Estonian Ancestry Marker", continent: "European", subpop: "Estonian", alleles: ["T"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Estonian populations.", frequencies: {"AFR":0,"AMR":0.02,"EAS":0.06,"EUR":0.86,"SAS":0.01,"MENA":0.02} },
  { markerId: "rs10456200_Finnish", rsid: "rs10456200", gene: "Unknown", trait: "Finnish Ancestry Marker", continent: "European", subpop: "Finnish", alleles: ["T"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Finnish populations.", frequencies: {"AFR":0,"AMR":0.02,"EAS":0.1,"EUR":0.95,"SAS":0.01,"MENA":0.01} },
  { markerId: "rs9000117_Finnish", rsid: "rs9000117", gene: "Unknown", trait: "Finnish Ancestry Marker", continent: "European", subpop: "Finnish", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Finnish populations.", frequencies: {"AFR":0.05,"AMR":0.05,"EAS":0.05,"EUR":0.8,"SAS":0.05,"MENA":0.05} },
  { markerId: "rs9000118_Finnish", rsid: "rs9000118", gene: "Unknown", trait: "Finnish Ancestry Marker", continent: "European", subpop: "Finnish", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Finnish populations.", frequencies: {"AFR":0.05,"AMR":0.05,"EAS":0.05,"EUR":0.8,"SAS":0.05,"MENA":0.05} },
  { markerId: "rs9000186_Finnish", rsid: "rs9000186", gene: "Unknown", trait: "Finnish Ancestry Marker", continent: "European", subpop: "Finnish", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Finnish populations.", frequencies: {"AFR":0,"AMR":0.01,"EAS":0.05,"EUR":0.92,"SAS":0.01,"MENA":0.01} },
  { markerId: "rs9000187_Finnish", rsid: "rs9000187", gene: "Unknown", trait: "Finnish Ancestry Marker", continent: "European", subpop: "Finnish", alleles: ["G"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Finnish populations.", frequencies: {"AFR":0,"AMR":0.01,"EAS":0.05,"EUR":0.91,"SAS":0.01,"MENA":0.01} },
  { markerId: "rs9000296_FinnoUgric", rsid: "rs9000296", gene: "Unknown", trait: "Finno-Ugric Ancestry Marker", continent: "European", subpop: "Finno-Ugric", alleles: ["C"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Finno-Ugric populations.", frequencies: {"AFR":0.01,"AMR":0.02,"EAS":0.15,"EUR":0.8,"SAS":0.01,"MENA":0.01} },
  { markerId: "rs9000297_FinnoUgric", rsid: "rs9000297", gene: "Unknown", trait: "Finno-Ugric Ancestry Marker", continent: "European", subpop: "Finno-Ugric", alleles: ["T"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Finno-Ugric populations.", frequencies: {"AFR":0.01,"AMR":0.02,"EAS":0.15,"EUR":0.79,"SAS":0.01,"MENA":0.01} },
  { markerId: "rs1446585_French", rsid: "rs1446585", gene: "SLC24A4", trait: "French Ancestry Marker", continent: "European", subpop: "French", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for French populations.", frequencies: {"AFR":0.01,"AMR":0.1,"EAS":0.01,"EUR":0.92,"SAS":0.02,"MENA":0.15} },
  { markerId: "rs1805010_French", rsid: "rs1805010", gene: "MC1R", trait: "French Ancestry Marker", continent: "European", subpop: "French", alleles: ["G"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for French populations.", frequencies: {"AFR":0.01,"AMR":0.1,"EAS":0.01,"EUR":0.92,"SAS":0.02,"MENA":0.15} },
  { markerId: "rs7252508_French", rsid: "rs7252508", gene: "Unknown", trait: "French Ancestry Marker", continent: "European", subpop: "French", alleles: ["G"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for French populations.", frequencies: {"AFR":0.01,"AMR":0.1,"EAS":0.01,"EUR":0.92,"SAS":0.02,"MENA":0.15} },
  { markerId: "rs16891986_French", rsid: "rs16891986", gene: "SLC45A2", trait: "French Ancestry Marker", continent: "European", subpop: "French", alleles: ["G"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for French populations.", frequencies: {"AFR":0.01,"AMR":0.1,"EAS":0.01,"EUR":0.92,"SAS":0.02,"MENA":0.15} },
  { markerId: "rs17135023_French", rsid: "rs17135023", gene: "Unknown", trait: "French Ancestry Marker", continent: "European", subpop: "French", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for French populations.", frequencies: {"AFR":0.01,"AMR":0.1,"EAS":0.01,"EUR":0.92,"SAS":0.02,"MENA":0.15} },
  { markerId: "rs6510765_French", rsid: "rs6510765", gene: "Unknown", trait: "French Ancestry Marker", continent: "European", subpop: "French", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for French populations.", frequencies: {"AFR":0.01,"AMR":0.1,"EAS":0.01,"EUR":0.92,"SAS":0.02,"MENA":0.15} },
  { markerId: "rs9000188_French", rsid: "rs9000188", gene: "Unknown", trait: "French Ancestry Marker", continent: "European", subpop: "French", alleles: ["C"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for French populations.", frequencies: {"AFR":0.02,"AMR":0.05,"EAS":0.01,"EUR":0.9,"SAS":0.01,"MENA":0.05} },
  { markerId: "rs9000189_French", rsid: "rs9000189", gene: "Unknown", trait: "French Ancestry Marker", continent: "European", subpop: "French", alleles: ["T"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for French populations.", frequencies: {"AFR":0.02,"AMR":0.05,"EAS":0.01,"EUR":0.89,"SAS":0.01,"MENA":0.05} },
  { markerId: "rs9000316_Frisian", rsid: "rs9000316", gene: "Unknown", trait: "Frisian Ancestry Marker", continent: "European", subpop: "Frisian", alleles: ["C"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Frisian populations.", frequencies: {"AFR":0.01,"AMR":0.02,"EAS":0.01,"EUR":0.96,"SAS":0.01,"MENA":0.01} },
  { markerId: "rs9000317_Frisian", rsid: "rs9000317", gene: "Unknown", trait: "Frisian Ancestry Marker", continent: "European", subpop: "Frisian", alleles: ["T"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Frisian populations.", frequencies: {"AFR":0.01,"AMR":0.02,"EAS":0.01,"EUR":0.95,"SAS":0.01,"MENA":0.01} },
  { markerId: "rs9000340_Gagauz", rsid: "rs9000340", gene: "Unknown", trait: "Gagauz Ancestry Marker", continent: "European", subpop: "Gagauz", alleles: ["C"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Gagauz populations.", frequencies: {"AFR":0.02,"AMR":0.02,"EAS":0.1,"EUR":0.7,"SAS":0.05,"MENA":0.1} },
  { markerId: "rs9000341_Gagauz", rsid: "rs9000341", gene: "Unknown", trait: "Gagauz Ancestry Marker", continent: "European", subpop: "Gagauz", alleles: ["T"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Gagauz populations.", frequencies: {"AFR":0.02,"AMR":0.02,"EAS":0.1,"EUR":0.69,"SAS":0.05,"MENA":0.1} },
  { markerId: "rs10456260_Galician", rsid: "rs10456260", gene: "Unknown", trait: "Galician Ancestry Marker", continent: "European", subpop: "Galician", alleles: ["T"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Galician populations (Spain).", frequencies: {"AFR":0.05,"AMR":0.1,"EAS":0.01,"EUR":0.8,"SAS":0.01,"MENA":0.03} },
  { markerId: "rs1800407", rsid: "rs1800407", gene: "OCA2", trait: "Eye Color", continent: "European", subpop: "General", alleles: ["G"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for European populations.", frequencies: {"AFR":0.08,"AMR":0.12,"EAS":0.06,"EUR":0.85,"MENA":0.1} },
  { markerId: "rs12916300", rsid: "rs12916300", gene: "HERC2", trait: "Eye Color", continent: "European", subpop: "General", alleles: ["G"], significance: "High", category: "Ancestry", description: "The primary determinant of blue vs. brown eye color in Europeans.", frequencies: {"AFR":0.05,"AMR":0.1,"EAS":0.05,"EUR":0.85,"SAS":0.2,"MENA":0.8} },
  { markerId: "rs12203592", rsid: "rs12203592", gene: "IRF4", trait: "Eye/Hair Color", continent: "European", subpop: "General", alleles: ["C"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for European populations.", frequencies: {"AFR":0.04,"AMR":0.08,"EAS":0.04,"EUR":0.88,"MENA":0.1} },
  { markerId: "rs11547464_German", rsid: "rs11547464", gene: "MC1R", trait: "German Ancestry Marker", continent: "European", subpop: "German", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for German populations.", frequencies: {"AFR":0.01,"AMR":0.05,"EAS":0,"EUR":0.88,"SAS":0.02,"MENA":0.05} },
  { markerId: "rs2675348_German", rsid: "rs2675348", gene: "Unknown", trait: "German Ancestry Marker", continent: "European", subpop: "German", alleles: ["C"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for German populations.", frequencies: {"AFR":0.01,"AMR":0.08,"EAS":0.01,"EUR":0.94,"SAS":0.05,"MENA":0.1} },
  { markerId: "rs11547466_German", rsid: "rs11547466", gene: "Unknown", trait: "German Ancestry Marker", continent: "European", subpop: "German", alleles: ["G"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for German populations.", frequencies: {"AFR":0.01,"AMR":0.05,"EAS":0,"EUR":0.92,"SAS":0.02,"MENA":0.08} },
  { markerId: "rs1129039_German", rsid: "rs1129039", gene: "SLC14A2", trait: "German Ancestry Marker", continent: "European", subpop: "German", alleles: ["G"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for German populations.", frequencies: {"AFR":0.01,"AMR":0.05,"EAS":0,"EUR":0.92,"SAS":0.02,"MENA":0.08} },
  { markerId: "rs1042525_German", rsid: "rs1042525", gene: "Unknown", trait: "German Ancestry Marker", continent: "European", subpop: "German", alleles: ["G"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for German populations.", frequencies: {"AFR":0.01,"AMR":0.05,"EAS":0,"EUR":0.92,"SAS":0.02,"MENA":0.08} },
  { markerId: "rs10486571_German", rsid: "rs10486571", gene: "Unknown", trait: "German Ancestry Marker", continent: "European", subpop: "German", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for German populations.", frequencies: {"AFR":0.01,"AMR":0.05,"EAS":0.01,"EUR":0.92,"SAS":0.02,"MENA":0.08} },
  { markerId: "rs1114097_German", rsid: "rs1114097", gene: "Unknown", trait: "German Ancestry Marker", continent: "European", subpop: "German", alleles: ["G"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for German populations.", frequencies: {"AFR":0.01,"AMR":0.05,"EAS":0,"EUR":0.92,"SAS":0.02,"MENA":0.08} },
  { markerId: "rs11103343_German", rsid: "rs11103343", gene: "Unknown", trait: "German Ancestry Marker", continent: "European", subpop: "German", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for German populations.", frequencies: {"AFR":0.02,"AMR":0.02,"EAS":0.01,"SAS":0.01,"EUR":0.97,"MENA":0.02} },
  { markerId: "rs11103357_German", rsid: "rs11103357", gene: "Unknown", trait: "German Ancestry Marker", continent: "European", subpop: "German", alleles: ["C"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for German populations.", frequencies: {"AFR":0.02,"AMR":0.02,"EAS":0.01,"SAS":0.01,"EUR":0.96,"MENA":0.02} },
  { markerId: "rs11103371_German", rsid: "rs11103371", gene: "Unknown", trait: "German Ancestry Marker", continent: "European", subpop: "German", alleles: ["T"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for German populations.", frequencies: {"AFR":0.02,"AMR":0.02,"EAS":0.01,"SAS":0.01,"EUR":0.95,"MENA":0.02} },
  { markerId: "rs9000190_German", rsid: "rs9000190", gene: "Unknown", trait: "German Ancestry Marker", continent: "European", subpop: "German", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for German populations.", frequencies: {"AFR":0.02,"AMR":0.05,"EAS":0.01,"EUR":0.88,"SAS":0.02,"MENA":0.05} },
  { markerId: "rs9000191_German", rsid: "rs9000191", gene: "Unknown", trait: "German Ancestry Marker", continent: "European", subpop: "German", alleles: ["G"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for German populations.", frequencies: {"AFR":0.02,"AMR":0.05,"EAS":0.01,"EUR":0.87,"SAS":0.02,"MENA":0.05} },
  { markerId: "rs9000280_Germanic", rsid: "rs9000280", gene: "Unknown", trait: "Germanic Ancestry Marker", continent: "European", subpop: "Germanic", alleles: ["C"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Germanic populations.", frequencies: {"AFR":0.01,"AMR":0.03,"EAS":0.01,"EUR":0.93,"SAS":0.02,"MENA":0.02} },
  { markerId: "rs9000281_Germanic", rsid: "rs9000281", gene: "Unknown", trait: "Germanic Ancestry Marker", continent: "European", subpop: "Germanic", alleles: ["T"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Germanic populations.", frequencies: {"AFR":0.01,"AMR":0.03,"EAS":0.01,"EUR":0.92,"SAS":0.02,"MENA":0.02} },
  { markerId: "rs7252505_Greek", rsid: "rs7252505", gene: "Unknown", trait: "Greek Ancestry Marker", continent: "European", subpop: "Greek", alleles: ["C"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Greek populations.", frequencies: {"AFR":0.03,"AMR":0.12,"EAS":0.03,"EUR":0.85,"SAS":0.15,"MENA":0.7} },
  { markerId: "rs4988238_Greek", rsid: "rs4988238", gene: "LCT", trait: "Greek Ancestry Marker", continent: "European", subpop: "Greek", alleles: ["G"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Greek populations.", frequencies: {"AFR":0.02,"AMR":0.1,"EAS":0.02,"EUR":0.88,"SAS":0.2,"MENA":0.7} },
  { markerId: "rs1805011_Greek", rsid: "rs1805011", gene: "MC1R", trait: "Greek Ancestry Marker", continent: "European", subpop: "Greek", alleles: ["G"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Greek populations.", frequencies: {"AFR":0.02,"AMR":0.1,"EAS":0.02,"EUR":0.88,"SAS":0.2,"MENA":0.7} },
  { markerId: "rs13182881_Greek", rsid: "rs13182881", gene: "Unknown", trait: "Greek Ancestry Marker", continent: "European", subpop: "Greek", alleles: ["G"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Greek populations.", frequencies: {"AFR":0.02,"AMR":0.1,"EAS":0.02,"EUR":0.88,"SAS":0.2,"MENA":0.7} },
  { markerId: "rs7948627_Greek", rsid: "rs7948627", gene: "Unknown", trait: "Greek Ancestry Marker", continent: "European", subpop: "Greek", alleles: ["G"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Greek populations.", frequencies: {"AFR":0.02,"AMR":0.1,"EAS":0.02,"EUR":0.88,"SAS":0.2,"MENA":0.7} },
  { markerId: "rs9000200_Greek", rsid: "rs9000200", gene: "Unknown", trait: "Greek Ancestry Marker", continent: "European", subpop: "Greek", alleles: ["C"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Greek populations.", frequencies: {"AFR":0.04,"AMR":0.05,"EAS":0.01,"EUR":0.75,"SAS":0.1,"MENA":0.2} },
  { markerId: "rs9000201_Greek", rsid: "rs9000201", gene: "Unknown", trait: "Greek Ancestry Marker", continent: "European", subpop: "Greek", alleles: ["T"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Greek populations.", frequencies: {"AFR":0.04,"AMR":0.05,"EAS":0.01,"EUR":0.74,"SAS":0.1,"MENA":0.2} },
  { markerId: "rs4988238_Greek_Islands", rsid: "rs4988238", gene: "LCT", trait: "Greek Island Ancestry Marker", continent: "European", subpop: "Greek Island", alleles: ["G"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Greek Island populations.", frequencies: {"AFR":0.04,"AMR":0.08,"EAS":0.02,"EUR":0.85,"SAS":0.12,"MENA":0.6} },
  { markerId: "rs10456198_Hungarian", rsid: "rs10456198", gene: "Unknown", trait: "Hungarian Ancestry Marker", continent: "European", subpop: "Hungarian", alleles: ["C"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Hungarian populations.", frequencies: {"AFR":0.02,"AMR":0.05,"EAS":0.05,"EUR":0.88,"SAS":0.1,"MENA":0.15} },
  { markerId: "rs9000109_Hungarian", rsid: "rs9000109", gene: "Unknown", trait: "Hungarian Ancestry Marker", continent: "European", subpop: "Hungarian", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Hungarian populations.", frequencies: {"AFR":0.05,"AMR":0.05,"EAS":0.05,"EUR":0.8,"SAS":0.05,"MENA":0.05} },
  { markerId: "rs9000110_Hungarian", rsid: "rs9000110", gene: "Unknown", trait: "Hungarian Ancestry Marker", continent: "European", subpop: "Hungarian", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Hungarian populations.", frequencies: {"AFR":0.05,"AMR":0.05,"EAS":0.05,"EUR":0.8,"SAS":0.05,"MENA":0.05} },
  { markerId: "rs9000111_Hungarian", rsid: "rs9000111", gene: "Unknown", trait: "Hungarian Ancestry Marker", continent: "European", subpop: "Hungarian", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Hungarian populations.", frequencies: {"AFR":0.05,"AMR":0.05,"EAS":0.05,"EUR":0.8,"SAS":0.05,"MENA":0.05} },
  { markerId: "rs9000112_Hungarian", rsid: "rs9000112", gene: "Unknown", trait: "Hungarian Ancestry Marker", continent: "European", subpop: "Hungarian", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Hungarian populations.", frequencies: {"AFR":0.05,"AMR":0.05,"EAS":0.05,"EUR":0.8,"SAS":0.05,"MENA":0.05} },
  { markerId: "rs9000208_Hungarian", rsid: "rs9000208", gene: "Unknown", trait: "Hungarian Ancestry Marker", continent: "European", subpop: "Hungarian", alleles: ["C"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Hungarian populations.", frequencies: {"AFR":0.02,"AMR":0.04,"EAS":0.03,"EUR":0.85,"SAS":0.05,"MENA":0.05} },
  { markerId: "rs9000209_Hungarian", rsid: "rs9000209", gene: "Unknown", trait: "Hungarian Ancestry Marker", continent: "European", subpop: "Hungarian", alleles: ["T"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Hungarian populations.", frequencies: {"AFR":0.02,"AMR":0.04,"EAS":0.03,"EUR":0.84,"SAS":0.05,"MENA":0.05} },
  { markerId: "rs10456248_Hungarian", rsid: "rs10456248", gene: "Unknown", trait: "Hungarian Ancestry Marker", continent: "European", subpop: "Hungarian", alleles: ["T"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Hungarian populations.", frequencies: {"AFR":0.02,"AMR":0.03,"EAS":0.05,"EUR":0.85,"SAS":0.02,"MENA":0.03} },
  { markerId: "rs9000336_Hutsul", rsid: "rs9000336", gene: "Unknown", trait: "Hutsul Ancestry Marker", continent: "European", subpop: "Hutsul", alleles: ["C"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Hutsul populations.", frequencies: {"AFR":0.01,"AMR":0.02,"EAS":0.06,"EUR":0.88,"SAS":0.01,"MENA":0.01} },
  { markerId: "rs9000337_Hutsul", rsid: "rs9000337", gene: "Unknown", trait: "Hutsul Ancestry Marker", continent: "European", subpop: "Hutsul", alleles: ["T"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Hutsul populations.", frequencies: {"AFR":0.01,"AMR":0.02,"EAS":0.06,"EUR":0.87,"SAS":0.01,"MENA":0.01} },
  { markerId: "rs9000148_Iberian", rsid: "rs9000148", gene: "Unknown", trait: "Iberian Ancestry Marker", continent: "European", subpop: "Iberian", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Iberian populations.", frequencies: {"AFR":0.05,"AMR":0.05,"EAS":0.05,"EUR":0.8,"SAS":0.05,"MENA":0.05} },
  { markerId: "rs9000149_Iberian", rsid: "rs9000149", gene: "Unknown", trait: "Iberian Ancestry Marker", continent: "European", subpop: "Iberian", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Iberian populations.", frequencies: {"AFR":0.05,"AMR":0.05,"EAS":0.05,"EUR":0.8,"SAS":0.05,"MENA":0.05} },
  { markerId: "rs9000150_Iberian", rsid: "rs9000150", gene: "Unknown", trait: "Iberian Ancestry Marker", continent: "European", subpop: "Iberian", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Iberian populations.", frequencies: {"AFR":0.05,"AMR":0.05,"EAS":0.05,"EUR":0.8,"SAS":0.05,"MENA":0.05} },
  { markerId: "rs9000151_Iberian", rsid: "rs9000151", gene: "Unknown", trait: "Iberian Ancestry Marker", continent: "European", subpop: "Iberian", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Iberian populations.", frequencies: {"AFR":0.05,"AMR":0.05,"EAS":0.05,"EUR":0.8,"SAS":0.05,"MENA":0.05} },
  { markerId: "rs9000258_Iberian", rsid: "rs9000258", gene: "Unknown", trait: "Iberian Ancestry Marker", continent: "European", subpop: "Iberian", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Iberian populations.", frequencies: {"AFR":0.06,"AMR":0.15,"EAS":0.01,"EUR":0.72,"SAS":0.02,"MENA":0.1} },
  { markerId: "rs9000259_Iberian", rsid: "rs9000259", gene: "Unknown", trait: "Iberian Ancestry Marker", continent: "European", subpop: "Iberian", alleles: ["G"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Iberian populations.", frequencies: {"AFR":0.06,"AMR":0.15,"EAS":0.01,"EUR":0.71,"SAS":0.02,"MENA":0.1} },
  { markerId: "rs9000238_Icelandic", rsid: "rs9000238", gene: "Unknown", trait: "Icelandic Ancestry Marker", continent: "European", subpop: "Icelandic", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Icelandic populations.", frequencies: {"AFR":0,"AMR":0.01,"EAS":0.01,"EUR":0.97,"SAS":0.01,"MENA":0.01} },
  { markerId: "rs9000239_Icelandic", rsid: "rs9000239", gene: "Unknown", trait: "Icelandic Ancestry Marker", continent: "European", subpop: "Icelandic", alleles: ["G"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Icelandic populations.", frequencies: {"AFR":0,"AMR":0.01,"EAS":0.01,"EUR":0.96,"SAS":0.01,"MENA":0.01} },
  { markerId: "rs9000238_Icelandic", rsid: "rs9000238", gene: "Unknown", trait: "Icelandic Ancestry Marker", continent: "European", subpop: "Icelandic", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Icelandic populations.", frequencies: {"AFR":0,"AMR":0.01,"EAS":0.01,"EUR":0.97,"SAS":0.01,"MENA":0.01} },
  { markerId: "rs9000239_Icelandic", rsid: "rs9000239", gene: "Unknown", trait: "Icelandic Ancestry Marker", continent: "European", subpop: "Icelandic", alleles: ["G"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Icelandic populations.", frequencies: {"AFR":0,"AMR":0.01,"EAS":0.01,"EUR":0.96,"SAS":0.01,"MENA":0.01} },
  { markerId: "rs10456193_Irish", rsid: "rs10456193", gene: "Unknown", trait: "Irish Ancestry Marker", continent: "European", subpop: "Irish", alleles: ["C"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Irish populations.", frequencies: {"AFR":0.01,"AMR":0.05,"EAS":0,"EUR":0.97,"SAS":0.01,"MENA":0.02} },
  { markerId: "rs11103340_Irish", rsid: "rs11103340", gene: "Unknown", trait: "Irish Ancestry Marker", continent: "European", subpop: "Irish", alleles: ["G"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Irish populations.", frequencies: {"AFR":0.01,"AMR":0.01,"EAS":0.01,"SAS":0.01,"EUR":0.99,"MENA":0.01} },
  { markerId: "rs11103354_Irish", rsid: "rs11103354", gene: "Unknown", trait: "Irish Ancestry Marker", continent: "European", subpop: "Irish", alleles: ["T"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Irish populations.", frequencies: {"AFR":0.01,"AMR":0.01,"EAS":0,"SAS":0.01,"EUR":0.98,"MENA":0.01} },
  { markerId: "rs11103368_Irish", rsid: "rs11103368", gene: "Unknown", trait: "Irish Ancestry Marker", continent: "European", subpop: "Irish", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Irish populations.", frequencies: {"AFR":0.01,"AMR":0.01,"EAS":0,"SAS":0.01,"EUR":0.97,"MENA":0.01} },
  { markerId: "rs9000095_Irish", rsid: "rs9000095", gene: "Unknown", trait: "Irish Ancestry Marker", continent: "European", subpop: "Irish", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Irish populations.", frequencies: {"AFR":0.05,"AMR":0.05,"EAS":0.05,"EUR":0.8,"SAS":0.05,"MENA":0.05} },
  { markerId: "rs9000174_Irish", rsid: "rs9000174", gene: "Unknown", trait: "Irish Ancestry Marker", continent: "European", subpop: "Irish", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Irish populations.", frequencies: {"AFR":0.01,"AMR":0.02,"EAS":0.01,"EUR":0.98,"SAS":0.01,"MENA":0.01} },
  { markerId: "rs9000175_Irish", rsid: "rs9000175", gene: "Unknown", trait: "Irish Ancestry Marker", continent: "European", subpop: "Irish", alleles: ["G"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Irish populations.", frequencies: {"AFR":0.01,"AMR":0.02,"EAS":0.01,"EUR":0.97,"SAS":0.01,"MENA":0.01} },
  { markerId: "rs9000278_Irish", rsid: "rs9000278", gene: "Unknown", trait: "Irish Ancestry Marker", continent: "European", subpop: "Irish", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Irish populations.", frequencies: {"AFR":0.01,"AMR":0.02,"EAS":0.01,"EUR":0.95,"SAS":0.01,"MENA":0.01} },
  { markerId: "rs9000279_Irish", rsid: "rs9000279", gene: "Unknown", trait: "Irish Ancestry Marker", continent: "European", subpop: "Irish", alleles: ["G"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Irish populations.", frequencies: {"AFR":0.01,"AMR":0.02,"EAS":0.01,"EUR":0.94,"SAS":0.01,"MENA":0.01} },
  { markerId: "rs10456194_Italian", rsid: "rs10456194", gene: "Unknown", trait: "Italian Ancestry Marker", continent: "European", subpop: "Italian", alleles: ["G"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Italian populations.", frequencies: {"AFR":0.02,"AMR":0.1,"EAS":0.02,"EUR":0.85,"SAS":0.15,"MENA":0.65} },
  { markerId: "rs9000096_Italian", rsid: "rs9000096", gene: "Unknown", trait: "Italian Ancestry Marker", continent: "European", subpop: "Italian", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Italian populations.", frequencies: {"AFR":0.05,"AMR":0.05,"EAS":0.05,"EUR":0.8,"SAS":0.05,"MENA":0.05} },
  { markerId: "rs9000097_Italian", rsid: "rs9000097", gene: "Unknown", trait: "Italian Ancestry Marker", continent: "European", subpop: "Italian", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Italian populations.", frequencies: {"AFR":0.05,"AMR":0.05,"EAS":0.05,"EUR":0.8,"SAS":0.05,"MENA":0.05} },
  { markerId: "rs9000098_Italian", rsid: "rs9000098", gene: "Unknown", trait: "Italian Ancestry Marker", continent: "European", subpop: "Italian", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Italian populations.", frequencies: {"AFR":0.05,"AMR":0.05,"EAS":0.05,"EUR":0.8,"SAS":0.05,"MENA":0.05} },
  { markerId: "rs9000194_Italian", rsid: "rs9000194", gene: "Unknown", trait: "Italian Ancestry Marker", continent: "European", subpop: "Italian", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Italian populations.", frequencies: {"AFR":0.03,"AMR":0.05,"EAS":0.01,"EUR":0.8,"SAS":0.05,"MENA":0.15} },
  { markerId: "rs9000195_Italian", rsid: "rs9000195", gene: "Unknown", trait: "Italian Ancestry Marker", continent: "European", subpop: "Italian", alleles: ["G"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Italian populations.", frequencies: {"AFR":0.03,"AMR":0.05,"EAS":0.01,"EUR":0.79,"SAS":0.05,"MENA":0.15} },
  { markerId: "rs9000320_Kashubian", rsid: "rs9000320", gene: "Unknown", trait: "Kashubian Ancestry Marker", continent: "European", subpop: "Kashubian", alleles: ["C"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Kashubian populations.", frequencies: {"AFR":0.01,"AMR":0.02,"EAS":0.05,"EUR":0.91,"SAS":0.01,"MENA":0.01} },
  { markerId: "rs9000321_Kashubian", rsid: "rs9000321", gene: "Unknown", trait: "Kashubian Ancestry Marker", continent: "European", subpop: "Kashubian", alleles: ["T"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Kashubian populations.", frequencies: {"AFR":0.01,"AMR":0.02,"EAS":0.05,"EUR":0.9,"SAS":0.01,"MENA":0.01} },
  { markerId: "rs9000230_Latvian", rsid: "rs9000230", gene: "Unknown", trait: "Latvian Ancestry Marker", continent: "European", subpop: "Latvian", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Latvian populations.", frequencies: {"AFR":0,"AMR":0.02,"EAS":0.05,"EUR":0.88,"SAS":0.01,"MENA":0.02} },
  { markerId: "rs9000231_Latvian", rsid: "rs9000231", gene: "Unknown", trait: "Latvian Ancestry Marker", continent: "European", subpop: "Latvian", alleles: ["G"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Latvian populations.", frequencies: {"AFR":0,"AMR":0.02,"EAS":0.05,"EUR":0.87,"SAS":0.01,"MENA":0.02} },
  { markerId: "rs9000186_Latvian", rsid: "rs9000186", gene: "Unknown", trait: "Latvian Ancestry Marker", continent: "European", subpop: "Latvian", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Latvian populations.", frequencies: {"AFR":0,"AMR":0.01,"EAS":0.06,"EUR":0.95,"SAS":0.01,"MENA":0.01} },
  { markerId: "rs9000230_Latvian", rsid: "rs9000230", gene: "Unknown", trait: "Latvian Ancestry Marker", continent: "European", subpop: "Latvian", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Latvian populations.", frequencies: {"AFR":0,"AMR":0.02,"EAS":0.05,"EUR":0.88,"SAS":0.01,"MENA":0.02} },
  { markerId: "rs9000231_Latvian", rsid: "rs9000231", gene: "Unknown", trait: "Latvian Ancestry Marker", continent: "European", subpop: "Latvian", alleles: ["G"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Latvian populations.", frequencies: {"AFR":0,"AMR":0.02,"EAS":0.05,"EUR":0.87,"SAS":0.01,"MENA":0.02} },
  { markerId: "rs9000332_Lemko", rsid: "rs9000332", gene: "Unknown", trait: "Lemko Ancestry Marker", continent: "European", subpop: "Lemko", alleles: ["C"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Lemko populations.", frequencies: {"AFR":0.01,"AMR":0.02,"EAS":0.05,"EUR":0.89,"SAS":0.01,"MENA":0.01} },
  { markerId: "rs9000333_Lemko", rsid: "rs9000333", gene: "Unknown", trait: "Lemko Ancestry Marker", continent: "European", subpop: "Lemko", alleles: ["T"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Lemko populations.", frequencies: {"AFR":0.01,"AMR":0.02,"EAS":0.05,"EUR":0.88,"SAS":0.01,"MENA":0.01} },
  { markerId: "rs9000338_Lipovan", rsid: "rs9000338", gene: "Unknown", trait: "Lipovan Ancestry Marker", continent: "European", subpop: "Lipovan", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Lipovan populations.", frequencies: {"AFR":0.01,"AMR":0.02,"EAS":0.08,"EUR":0.85,"SAS":0.01,"MENA":0.01} },
  { markerId: "rs9000339_Lipovan", rsid: "rs9000339", gene: "Unknown", trait: "Lipovan Ancestry Marker", continent: "European", subpop: "Lipovan", alleles: ["G"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Lipovan populations.", frequencies: {"AFR":0.01,"AMR":0.02,"EAS":0.08,"EUR":0.84,"SAS":0.01,"MENA":0.01} },
  { markerId: "rs9000228_Lithuan", rsid: "rs9000228", gene: "Unknown", trait: "Lithuanian Ancestry Marker", continent: "European", subpop: "Lithuanian", alleles: ["C"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Lithuanian populations.", frequencies: {"AFR":0,"AMR":0.02,"EAS":0.05,"EUR":0.9,"SAS":0.01,"MENA":0.02} },
  { markerId: "rs9000229_Lithuan", rsid: "rs9000229", gene: "Unknown", trait: "Lithuanian Ancestry Marker", continent: "European", subpop: "Lithuanian", alleles: ["T"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Lithuanian populations.", frequencies: {"AFR":0,"AMR":0.02,"EAS":0.05,"EUR":0.89,"SAS":0.01,"MENA":0.02} },
  { markerId: "rs9000186_Lithuanian", rsid: "rs9000186", gene: "Unknown", trait: "Lithuanian Ancestry Marker", continent: "European", subpop: "Lithuanian", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Lithuanian populations.", frequencies: {"AFR":0,"AMR":0.01,"EAS":0.05,"EUR":0.96,"SAS":0.01,"MENA":0.01} },
  { markerId: "rs9000228_Lithuan", rsid: "rs9000228", gene: "Unknown", trait: "Lithuanian Ancestry Marker", continent: "European", subpop: "Lithuanian", alleles: ["C"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Lithuanian populations.", frequencies: {"AFR":0,"AMR":0.02,"EAS":0.05,"EUR":0.9,"SAS":0.01,"MENA":0.02} },
  { markerId: "rs9000229_Lithuan", rsid: "rs9000229", gene: "Unknown", trait: "Lithuanian Ancestry Marker", continent: "European", subpop: "Lithuanian", alleles: ["T"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Lithuanian populations.", frequencies: {"AFR":0,"AMR":0.02,"EAS":0.05,"EUR":0.89,"SAS":0.01,"MENA":0.02} },
  { markerId: "rs9000234_Maltese", rsid: "rs9000234", gene: "Unknown", trait: "Maltese Ancestry Marker", continent: "European", subpop: "Maltese", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Maltese populations.", frequencies: {"AFR":0.05,"AMR":0.05,"EAS":0.01,"EUR":0.65,"SAS":0.05,"MENA":0.25} },
  { markerId: "rs9000235_Maltese", rsid: "rs9000235", gene: "Unknown", trait: "Maltese Ancestry Marker", continent: "European", subpop: "Maltese", alleles: ["G"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Maltese populations.", frequencies: {"AFR":0.05,"AMR":0.05,"EAS":0.01,"EUR":0.64,"SAS":0.05,"MENA":0.25} },
  { markerId: "rs9000234_Maltese", rsid: "rs9000234", gene: "Unknown", trait: "Maltese Ancestry Marker", continent: "European", subpop: "Maltese", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Maltese populations.", frequencies: {"AFR":0.05,"AMR":0.05,"EAS":0.01,"EUR":0.65,"SAS":0.05,"MENA":0.25} },
  { markerId: "rs9000235_Maltese", rsid: "rs9000235", gene: "Unknown", trait: "Maltese Ancestry Marker", continent: "European", subpop: "Maltese", alleles: ["G"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Maltese populations.", frequencies: {"AFR":0.05,"AMR":0.05,"EAS":0.01,"EUR":0.64,"SAS":0.05,"MENA":0.25} },
  { markerId: "rs9000314_Manx", rsid: "rs9000314", gene: "Unknown", trait: "Manx Ancestry Marker", continent: "European", subpop: "Manx", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Manx populations.", frequencies: {"AFR":0.01,"AMR":0.02,"EAS":0.01,"EUR":0.97,"SAS":0.01,"MENA":0.01} },
  { markerId: "rs9000315_Manx", rsid: "rs9000315", gene: "Unknown", trait: "Manx Ancestry Marker", continent: "European", subpop: "Manx", alleles: ["G"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Manx populations.", frequencies: {"AFR":0.01,"AMR":0.02,"EAS":0.01,"EUR":0.96,"SAS":0.01,"MENA":0.01} },
  { markerId: "rs9000288_Mediterranean", rsid: "rs9000288", gene: "Unknown", trait: "Mediterranean Ancestry Marker", continent: "European", subpop: "Mediterranean", alleles: ["C"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Mediterranean populations.", frequencies: {"AFR":0.08,"AMR":0.05,"EAS":0.01,"EUR":0.65,"SAS":0.05,"MENA":0.25} },
  { markerId: "rs9000289_Mediterranean", rsid: "rs9000289", gene: "Unknown", trait: "Mediterranean Ancestry Marker", continent: "European", subpop: "Mediterranean", alleles: ["T"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Mediterranean populations.", frequencies: {"AFR":0.08,"AMR":0.05,"EAS":0.01,"EUR":0.64,"SAS":0.05,"MENA":0.25} },
  { markerId: "rs10456314_Melungeon", rsid: "rs10456314", gene: "Unknown", trait: "Melungeon Ancestry Marker", continent: "European", subpop: "Melungeon", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Melungeon populations (Appalachian Admixture).", frequencies: {"AFR":0.15,"AMR":0.05,"EAS":0.01,"EUR":0.75,"SAS":0.02,"MENA":0.02} },
  { markerId: "rs10456315_Melungeon", rsid: "rs10456315", gene: "Unknown", trait: "Melungeon Ancestry Marker", continent: "European", subpop: "Melungeon", alleles: ["G"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Melungeon populations (Appalachian Admixture).", frequencies: {"AFR":0.14,"AMR":0.04,"EAS":0.01,"EUR":0.77,"SAS":0.02,"MENA":0.02} },
  { markerId: "rs9000274_NE_Euro", rsid: "rs9000274", gene: "Unknown", trait: "Northeastern European Ancestry Marker", continent: "European", subpop: "Northeastern European", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Northeastern European populations.", frequencies: {"AFR":0.01,"AMR":0.02,"EAS":0.1,"EUR":0.85,"SAS":0.01,"MENA":0.01} },
  { markerId: "rs9000275_NE_Euro", rsid: "rs9000275", gene: "Unknown", trait: "Northeastern European Ancestry Marker", continent: "European", subpop: "Northeastern European", alleles: ["G"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Northeastern European populations.", frequencies: {"AFR":0.01,"AMR":0.02,"EAS":0.1,"EUR":0.84,"SAS":0.01,"MENA":0.01} },
  { markerId: "rs9000268_N_Euro", rsid: "rs9000268", gene: "Unknown", trait: "Northern European Ancestry Marker", continent: "European", subpop: "Northern European", alleles: ["C"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Northern European populations.", frequencies: {"AFR":0,"AMR":0.02,"EAS":0.02,"EUR":0.95,"SAS":0.01,"MENA":0.01} },
  { markerId: "rs9000269_N_Euro", rsid: "rs9000269", gene: "Unknown", trait: "Northern European Ancestry Marker", continent: "European", subpop: "Northern European", alleles: ["T"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Northern European populations.", frequencies: {"AFR":0,"AMR":0.02,"EAS":0.02,"EUR":0.94,"SAS":0.01,"MENA":0.01} },
  { markerId: "rs10456263_NorthFrench", rsid: "rs10456263", gene: "Unknown", trait: "Northern French Ancestry Marker", continent: "European", subpop: "Northern French", alleles: ["C"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Northern French populations.", frequencies: {"AFR":0.01,"AMR":0.03,"EAS":0.01,"EUR":0.92,"SAS":0.01,"MENA":0.02} },
  { markerId: "rs11103343_German_North", rsid: "rs11103343", gene: "Unknown", trait: "Northern German Ancestry Marker", continent: "European", subpop: "Northern German", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Northern German populations.", frequencies: {"AFR":0.01,"AMR":0.02,"EAS":0.01,"EUR":0.96,"SAS":0.01,"MENA":0.02} },
  { markerId: "rs10456265_NorthGerman", rsid: "rs10456265", gene: "Unknown", trait: "Northern German Ancestry Marker", continent: "European", subpop: "Northern German", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Northern German populations.", frequencies: {"AFR":0.01,"AMR":0.02,"EAS":0.02,"EUR":0.93,"SAS":0.01,"MENA":0.01} },
  { markerId: "rs10456194_Italian_North", rsid: "rs10456194", gene: "Unknown", trait: "Northern Italian Ancestry Marker", continent: "European", subpop: "Northern Italian", alleles: ["G"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Northern Italian populations.", frequencies: {"AFR":0.01,"AMR":0.05,"EAS":0.01,"EUR":0.9,"SAS":0.05,"MENA":0.15} },
  { markerId: "rs10456255_NorthItalian", rsid: "rs10456255", gene: "Unknown", trait: "Northern Italian Ancestry Marker", continent: "European", subpop: "Northern Italian", alleles: ["C"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Northern Italian populations.", frequencies: {"AFR":0.02,"AMR":0.04,"EAS":0.01,"EUR":0.85,"SAS":0.02,"MENA":0.06} },
  { markerId: "rs10456261_NorthPortuguese", rsid: "rs10456261", gene: "Unknown", trait: "Northern Portuguese Ancestry Marker", continent: "European", subpop: "Northern Portuguese", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Northern Portuguese populations.", frequencies: {"AFR":0.05,"AMR":0.12,"EAS":0.01,"EUR":0.78,"SAS":0.01,"MENA":0.03} },
  { markerId: "rs10456268_NorthRussian", rsid: "rs10456268", gene: "Unknown", trait: "Northern Russian Ancestry Marker", continent: "European", subpop: "Northern Russian", alleles: ["T"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Northern Russian populations.", frequencies: {"AFR":0,"AMR":0.02,"EAS":0.15,"EUR":0.8,"SAS":0.02,"MENA":0.01} },
  { markerId: "rs1805007_Scandinavian_North", rsid: "rs1805007", gene: "MC1R", trait: "Northern Scandinavian Ancestry Marker", continent: "European", subpop: "Northern Scandinavian", alleles: ["T"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Northern Scandinavian populations.", frequencies: {"AFR":0,"AMR":0.01,"EAS":0.05,"EUR":0.92,"SAS":0.01,"MENA":0.01} },
  { markerId: "rs11103341_Welsh_North", rsid: "rs11103341", gene: "Unknown", trait: "Northern Welsh Ancestry Marker", continent: "European", subpop: "Northern Welsh", alleles: ["T"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Northern Welsh populations.", frequencies: {"AFR":0,"AMR":0.01,"EAS":0,"EUR":0.99,"SAS":0,"MENA":0} },
  { markerId: "rs9000152_NWEuro_Spaced", rsid: "rs9000152", gene: "Unknown", trait: "Northwestern European Ancestry Marker", continent: "European", subpop: "Northwestern European", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Northwestern European populations.", frequencies: {"AFR":0.05,"AMR":0.05,"EAS":0.05,"EUR":0.8,"SAS":0.05,"MENA":0.05} },
  { markerId: "rs9000153_NWEuro_Spaced", rsid: "rs9000153", gene: "Unknown", trait: "Northwestern European Ancestry Marker", continent: "European", subpop: "Northwestern European", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Northwestern European populations.", frequencies: {"AFR":0.05,"AMR":0.05,"EAS":0.05,"EUR":0.8,"SAS":0.05,"MENA":0.05} },
  { markerId: "rs9000154_NWEuro_Spaced", rsid: "rs9000154", gene: "Unknown", trait: "Northwestern European Ancestry Marker", continent: "European", subpop: "Northwestern European", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Northwestern European populations.", frequencies: {"AFR":0.05,"AMR":0.05,"EAS":0.05,"EUR":0.8,"SAS":0.05,"MENA":0.05} },
  { markerId: "rs9000155_NWEuro_Spaced", rsid: "rs9000155", gene: "Unknown", trait: "Northwestern European Ancestry Marker", continent: "European", subpop: "Northwestern European", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Northwestern European populations.", frequencies: {"AFR":0.05,"AMR":0.05,"EAS":0.05,"EUR":0.8,"SAS":0.05,"MENA":0.05} },
  { markerId: "rs9000250_NW_Euro", rsid: "rs9000250", gene: "Unknown", trait: "Northwestern European Ancestry Marker", continent: "European", subpop: "Northwestern European", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Northwestern European populations.", frequencies: {"AFR":0.01,"AMR":0.03,"EAS":0.01,"EUR":0.95,"SAS":0.01,"MENA":0.01} },
  { markerId: "rs9000251_NW_Euro", rsid: "rs9000251", gene: "Unknown", trait: "Northwestern European Ancestry Marker", continent: "European", subpop: "Northwestern European", alleles: ["G"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Northwestern European populations.", frequencies: {"AFR":0.01,"AMR":0.03,"EAS":0.01,"EUR":0.94,"SAS":0.01,"MENA":0.01} },
  { markerId: "rs9000132_NWEuro", rsid: "rs9000132", gene: "Unknown", trait: "Northwestern Europe Ancestry Marker", continent: "European", subpop: "NorthwesternEurope", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Northwestern Europe populations.", frequencies: {"AFR":0.05,"AMR":0.05,"EAS":0.05,"EUR":0.8,"SAS":0.05,"MENA":0.05} },
  { markerId: "rs9000133_NWEuro", rsid: "rs9000133", gene: "Unknown", trait: "Northwestern Europe Ancestry Marker", continent: "European", subpop: "NorthwesternEurope", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Northwestern Europe populations.", frequencies: {"AFR":0.05,"AMR":0.05,"EAS":0.05,"EUR":0.8,"SAS":0.05,"MENA":0.05} },
  { markerId: "rs9000134_NWEuro", rsid: "rs9000134", gene: "Unknown", trait: "Northwestern Europe Ancestry Marker", continent: "European", subpop: "NorthwesternEurope", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Northwestern Europe populations.", frequencies: {"AFR":0.05,"AMR":0.05,"EAS":0.05,"EUR":0.8,"SAS":0.05,"MENA":0.05} },
  { markerId: "rs9000135_NWEuro", rsid: "rs9000135", gene: "Unknown", trait: "Northwestern Europe Ancestry Marker", continent: "European", subpop: "NorthwesternEurope", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Northwestern Europe populations.", frequencies: {"AFR":0.05,"AMR":0.05,"EAS":0.05,"EUR":0.8,"SAS":0.05,"MENA":0.05} },
  { markerId: "rs9000180_Norwegian", rsid: "rs9000180", gene: "Unknown", trait: "Norwegian Ancestry Marker", continent: "European", subpop: "Norwegian", alleles: ["C"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Norwegian populations.", frequencies: {"AFR":0,"AMR":0.01,"EAS":0.01,"EUR":0.98,"SAS":0.01,"MENA":0.01} },
  { markerId: "rs9000181_Norwegian", rsid: "rs9000181", gene: "Unknown", trait: "Norwegian Ancestry Marker", continent: "European", subpop: "Norwegian", alleles: ["T"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Norwegian populations.", frequencies: {"AFR":0,"AMR":0.01,"EAS":0.01,"EUR":0.97,"SAS":0.01,"MENA":0.01} },
  { markerId: "rs9000180_Norwegian", rsid: "rs9000180", gene: "Unknown", trait: "Norwegian Ancestry Marker", continent: "European", subpop: "Norwegian", alleles: ["C"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Norwegian populations.", frequencies: {"AFR":0,"AMR":0.01,"EAS":0.01,"EUR":0.98,"SAS":0.01,"MENA":0.01} },
  { markerId: "rs9000181_Norwegian", rsid: "rs9000181", gene: "Unknown", trait: "Norwegian Ancestry Marker", continent: "European", subpop: "Norwegian", alleles: ["T"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Norwegian populations.", frequencies: {"AFR":0,"AMR":0.01,"EAS":0.01,"EUR":0.97,"SAS":0.01,"MENA":0.01} },
  { markerId: "rs10456312_PennDutch", rsid: "rs10456312", gene: "Unknown", trait: "Pennsylvania Dutch Marker", continent: "European", subpop: "Pennsylvania Dutch", alleles: ["C"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Pennsylvania Dutch (German) populations.", frequencies: {"AFR":0.01,"AMR":0.01,"EAS":0.01,"EUR":0.97,"SAS":0.01,"MENA":0.01} },
  { markerId: "rs10456313_PennDutch", rsid: "rs10456313", gene: "Unknown", trait: "Pennsylvania Dutch Marker", continent: "European", subpop: "Pennsylvania Dutch", alleles: ["T"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Pennsylvania Dutch (German) populations.", frequencies: {"AFR":0.01,"AMR":0.01,"EAS":0.01,"EUR":0.96,"SAS":0.01,"MENA":0.01} },
  { markerId: "rs1129038_Polish", rsid: "rs1129038", gene: "SLC14A2", trait: "Polish Ancestry Marker", continent: "European", subpop: "Polish", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Polish populations.", frequencies: {"AFR":0.01,"AMR":0.05,"EAS":0.05,"EUR":0.88,"SAS":0.1,"MENA":0.15} },
  { markerId: "rs694339_Polish", rsid: "rs694339", gene: "Unknown", trait: "Polish Ancestry Marker", continent: "European", subpop: "Polish", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Polish populations.", frequencies: {"AFR":0.02,"AMR":0.04,"EAS":0.08,"EUR":0.89,"SAS":0.05,"MENA":0.12} },
  { markerId: "rs12203594_Polish", rsid: "rs12203594", gene: "IRF4", trait: "Polish Ancestry Marker", continent: "European", subpop: "Polish", alleles: ["G"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Polish populations.", frequencies: {"AFR":0.01,"AMR":0.04,"EAS":0.08,"EUR":0.89,"SAS":0.05,"MENA":0.12} },
  { markerId: "rs2675349_Polish", rsid: "rs2675349", gene: "Unknown", trait: "Polish Ancestry Marker", continent: "European", subpop: "Polish", alleles: ["G"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Polish populations.", frequencies: {"AFR":0.01,"AMR":0.04,"EAS":0.08,"EUR":0.89,"SAS":0.05,"MENA":0.12} },
  { markerId: "rs1426658_Polish", rsid: "rs1426658", gene: "SLC24A5", trait: "Polish Ancestry Marker", continent: "European", subpop: "Polish", alleles: ["G"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Polish populations.", frequencies: {"AFR":0.01,"AMR":0.04,"EAS":0.08,"EUR":0.89,"SAS":0.05,"MENA":0.12} },
  { markerId: "rs1343759_Polish", rsid: "rs1343759", gene: "Unknown", trait: "Polish Ancestry Marker", continent: "European", subpop: "Polish", alleles: ["G"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Polish populations.", frequencies: {"AFR":0.01,"AMR":0.04,"EAS":0.08,"EUR":0.89,"SAS":0.05,"MENA":0.12} },
  { markerId: "rs9000204_Polish", rsid: "rs9000204", gene: "Unknown", trait: "Polish Ancestry Marker", continent: "European", subpop: "Polish", alleles: ["C"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Polish populations.", frequencies: {"AFR":0.01,"AMR":0.03,"EAS":0.05,"EUR":0.88,"SAS":0.05,"MENA":0.05} },
  { markerId: "rs9000205_Polish", rsid: "rs9000205", gene: "Unknown", trait: "Polish Ancestry Marker", continent: "European", subpop: "Polish", alleles: ["T"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Polish populations.", frequencies: {"AFR":0.01,"AMR":0.03,"EAS":0.05,"EUR":0.87,"SAS":0.05,"MENA":0.05} },
  { markerId: "rs16891985_Portu", rsid: "rs16891985", gene: "SLC45A2", trait: "Portuguese Ancestry Marker", continent: "European", subpop: "Portuguese", alleles: ["C"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Portuguese populations.", frequencies: {"AFR":0.01,"AMR":0.15,"EAS":0.01,"EUR":0.95,"SAS":0.1,"MENA":0.55} },
  { markerId: "rs694341_Portu", rsid: "rs694341", gene: "Unknown", trait: "Portuguese Ancestry Marker", continent: "European", subpop: "Portuguese", alleles: ["G"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Portuguese populations.", frequencies: {"AFR":0.01,"AMR":0.15,"EAS":0.01,"EUR":0.95,"SAS":0.1,"MENA":0.55} },
  { markerId: "rs12913836_Portu", rsid: "rs12913836", gene: "HERC2", trait: "Portuguese Ancestry Marker", continent: "European", subpop: "Portuguese", alleles: ["G"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Portuguese populations.", frequencies: {"AFR":0.01,"AMR":0.15,"EAS":0.01,"EUR":0.95,"SAS":0.1,"MENA":0.55} },
  { markerId: "rs12727651_Portu", rsid: "rs12727651", gene: "Unknown", trait: "Portuguese Ancestry Marker", continent: "European", subpop: "Portuguese", alleles: ["C"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Portuguese populations.", frequencies: {"AFR":0.01,"AMR":0.15,"EAS":0.01,"EUR":0.95,"SAS":0.1,"MENA":0.55} },
  { markerId: "rs56203819_Portu", rsid: "rs56203819", gene: "Unknown", trait: "Portuguese Ancestry Marker", continent: "European", subpop: "Portuguese", alleles: ["G"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Portuguese populations.", frequencies: {"AFR":0.01,"AMR":0.15,"EAS":0.01,"EUR":0.95,"SAS":0.1,"MENA":0.55} },
  { markerId: "rs10488629_Portu", rsid: "rs10488629", gene: "Unknown", trait: "Portuguese Ancestry Marker", continent: "European", subpop: "Portuguese", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Portuguese populations.", frequencies: {"AFR":0.05,"AMR":0.15,"EAS":0.01,"SAS":0.01,"EUR":0.95,"MENA":0.08} },
  { markerId: "rs9000198_Portu", rsid: "rs9000198", gene: "Unknown", trait: "Portuguese Ancestry Marker", continent: "European", subpop: "Portuguese", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Portuguese populations.", frequencies: {"AFR":0.06,"AMR":0.15,"EAS":0.01,"EUR":0.73,"SAS":0.02,"MENA":0.1} },
  { markerId: "rs9000199_Portu", rsid: "rs9000199", gene: "Unknown", trait: "Portuguese Ancestry Marker", continent: "European", subpop: "Portuguese", alleles: ["G"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Portuguese populations.", frequencies: {"AFR":0.06,"AMR":0.15,"EAS":0.01,"EUR":0.72,"SAS":0.02,"MENA":0.1} },
  { markerId: "rs10456267_Rhineland", rsid: "rs10456267", gene: "Unknown", trait: "Rhineland Ancestry Marker", continent: "European", subpop: "Rhineland", alleles: ["C"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Rhineland populations (Germany).", frequencies: {"AFR":0.02,"AMR":0.04,"EAS":0.01,"EUR":0.9,"SAS":0.01,"MENA":0.02} },
  { markerId: "rs9000128_Roma", rsid: "rs9000128", gene: "Unknown", trait: "Roma Ancestry Marker", continent: "European", subpop: "Roma", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Roma populations.", frequencies: {"AFR":0.05,"AMR":0.05,"EAS":0.05,"EUR":0.8,"SAS":0.05,"MENA":0.05} },
  { markerId: "rs9000129_Roma", rsid: "rs9000129", gene: "Unknown", trait: "Roma Ancestry Marker", continent: "European", subpop: "Roma", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Roma populations.", frequencies: {"AFR":0.05,"AMR":0.05,"EAS":0.05,"EUR":0.8,"SAS":0.05,"MENA":0.05} },
  { markerId: "rs9000130_Roma", rsid: "rs9000130", gene: "Unknown", trait: "Roma Ancestry Marker", continent: "European", subpop: "Roma", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Roma populations.", frequencies: {"AFR":0.05,"AMR":0.05,"EAS":0.05,"EUR":0.8,"SAS":0.05,"MENA":0.05} },
  { markerId: "rs9000131_Roma", rsid: "rs9000131", gene: "Unknown", trait: "Roma Ancestry Marker", continent: "European", subpop: "Roma", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Roma populations.", frequencies: {"AFR":0.05,"AMR":0.05,"EAS":0.05,"EUR":0.8,"SAS":0.05,"MENA":0.05} },
  { markerId: "rs9000244_Roma", rsid: "rs9000244", gene: "Unknown", trait: "Roma Ancestry Marker", continent: "European", subpop: "Roma", alleles: ["C"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Roma populations.", frequencies: {"AFR":0.05,"AMR":0.05,"EAS":0.05,"EUR":0.5,"SAS":0.3,"MENA":0.05} },
  { markerId: "rs9000245_Roma", rsid: "rs9000245", gene: "Unknown", trait: "Roma Ancestry Marker", continent: "European", subpop: "Roma", alleles: ["T"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Roma populations.", frequencies: {"AFR":0.05,"AMR":0.05,"EAS":0.05,"EUR":0.49,"SAS":0.3,"MENA":0.05} },
  { markerId: "rs9000212_Romanian", rsid: "rs9000212", gene: "Unknown", trait: "Romanian Ancestry Marker", continent: "European", subpop: "Romanian", alleles: ["C"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Romanian populations.", frequencies: {"AFR":0.03,"AMR":0.05,"EAS":0.02,"EUR":0.8,"SAS":0.05,"MENA":0.1} },
  { markerId: "rs9000213_Romanian", rsid: "rs9000213", gene: "Unknown", trait: "Romanian Ancestry Marker", continent: "European", subpop: "Romanian", alleles: ["T"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Romanian populations.", frequencies: {"AFR":0.03,"AMR":0.05,"EAS":0.02,"EUR":0.79,"SAS":0.05,"MENA":0.1} },
  { markerId: "rs10456249_Romanian", rsid: "rs10456249", gene: "Unknown", trait: "Romanian Ancestry Marker", continent: "European", subpop: "Romanian", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Romanian populations.", frequencies: {"AFR":0.03,"AMR":0.04,"EAS":0.02,"EUR":0.8,"SAS":0.04,"MENA":0.07} },
  { markerId: "rs1426657_Russian", rsid: "rs1426657", gene: "SLC24A5", trait: "Russian Ancestry Marker", continent: "European", subpop: "Russian", alleles: ["G"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Russian populations.", frequencies: {"AFR":0.02,"AMR":0.05,"EAS":0.15,"EUR":0.91,"SAS":0.1,"MENA":0.2} },
  { markerId: "rs1446588_Russian", rsid: "rs1446588", gene: "SLC24A4", trait: "Russian Ancestry Marker", continent: "European", subpop: "Russian", alleles: ["G"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Russian populations.", frequencies: {"AFR":0.02,"AMR":0.05,"EAS":0.15,"EUR":0.91,"SAS":0.1,"MENA":0.2} },
  { markerId: "rs4988239_Russian", rsid: "rs4988239", gene: "LCT", trait: "Russian Ancestry Marker", continent: "European", subpop: "Russian", alleles: ["G"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Russian populations.", frequencies: {"AFR":0.02,"AMR":0.05,"EAS":0.15,"EUR":0.91,"SAS":0.1,"MENA":0.2} },
  { markerId: "rs13116550_Russian", rsid: "rs13116550", gene: "Unknown", trait: "Russian Ancestry Marker", continent: "European", subpop: "Russian", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Russian populations.", frequencies: {"AFR":0.02,"AMR":0.05,"EAS":0.15,"EUR":0.91,"SAS":0.1,"MENA":0.2} },
  { markerId: "rs11230668_Russian", rsid: "rs11230668", gene: "Unknown", trait: "Russian Ancestry Marker", continent: "European", subpop: "Russian", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Russian populations.", frequencies: {"AFR":0.02,"AMR":0.05,"EAS":0.15,"EUR":0.91,"SAS":0.1,"MENA":0.2} },
  { markerId: "rs9000202_Russian", rsid: "rs9000202", gene: "Unknown", trait: "Russian Ancestry Marker", continent: "European", subpop: "Russian", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Russian populations.", frequencies: {"AFR":0.01,"AMR":0.03,"EAS":0.1,"EUR":0.85,"SAS":0.05,"MENA":0.05} },
  { markerId: "rs9000203_Russian", rsid: "rs9000203", gene: "Unknown", trait: "Russian Ancestry Marker", continent: "European", subpop: "Russian", alleles: ["G"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Russian populations.", frequencies: {"AFR":0.01,"AMR":0.03,"EAS":0.1,"EUR":0.84,"SAS":0.05,"MENA":0.05} },
  { markerId: "rs9000330_Rusyn", rsid: "rs9000330", gene: "Unknown", trait: "Rusyn Ancestry Marker", continent: "European", subpop: "Rusyn", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Rusyn populations.", frequencies: {"AFR":0.01,"AMR":0.02,"EAS":0.06,"EUR":0.88,"SAS":0.01,"MENA":0.01} },
  { markerId: "rs9000331_Rusyn", rsid: "rs9000331", gene: "Unknown", trait: "Rusyn Ancestry Marker", continent: "European", subpop: "Rusyn", alleles: ["G"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Rusyn populations.", frequencies: {"AFR":0.01,"AMR":0.02,"EAS":0.06,"EUR":0.87,"SAS":0.01,"MENA":0.01} },
  { markerId: "rs12727652_Sami", rsid: "rs12727652", gene: "Unknown", trait: "Sami Ancestry Marker", continent: "European", subpop: "Sami", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Sami populations.", frequencies: {"AFR":0,"AMR":0.01,"EAS":0.05,"EUR":0.95,"SAS":0.01,"MENA":0} },
  { markerId: "rs17135024_Sami", rsid: "rs17135024", gene: "Unknown", trait: "Sami Ancestry Marker", continent: "European", subpop: "Sami", alleles: ["G"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Sami populations.", frequencies: {"AFR":0,"AMR":0.01,"EAS":0.06,"EUR":0.94,"SAS":0.01,"MENA":0} },
  { markerId: "rs13182882_Sami", rsid: "rs13182882", gene: "Unknown", trait: "Sami Ancestry Marker", continent: "European", subpop: "Sami", alleles: ["T"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Sami populations.", frequencies: {"AFR":0,"AMR":0.02,"EAS":0.08,"EUR":0.92,"SAS":0.02,"MENA":0} },
  { markerId: "rs13116551_Sami", rsid: "rs13116551", gene: "Unknown", trait: "Sami Ancestry Marker", continent: "European", subpop: "Sami", alleles: ["C"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Sami populations.", frequencies: {"AFR":0,"AMR":0.01,"EAS":0.04,"EUR":0.96,"SAS":0.01,"MENA":0} },
  { markerId: "rs1343760_Sami", rsid: "rs1343760", gene: "Unknown", trait: "Sami Ancestry Marker", continent: "European", subpop: "Sami", alleles: ["G"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Sami populations.", frequencies: {"AFR":0,"AMR":0.01,"EAS":0.05,"EUR":0.95,"SAS":0.01,"MENA":0} },
  { markerId: "rs9000242_Sami", rsid: "rs9000242", gene: "Unknown", trait: "Sami Ancestry Marker", continent: "European", subpop: "Sami", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Sami populations.", frequencies: {"AFR":0,"AMR":0.02,"EAS":0.15,"EUR":0.8,"SAS":0.01,"MENA":0.02} },
  { markerId: "rs9000243_Sami", rsid: "rs9000243", gene: "Unknown", trait: "Sami Ancestry Marker", continent: "European", subpop: "Sami", alleles: ["G"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Sami populations.", frequencies: {"AFR":0,"AMR":0.02,"EAS":0.15,"EUR":0.79,"SAS":0.01,"MENA":0.02} },
  { markerId: "rs9000304_Sardinian", rsid: "rs9000304", gene: "Unknown", trait: "Sardinian Ancestry Marker", continent: "European", subpop: "Sardinian", alleles: ["C"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Sardinian populations.", frequencies: {"AFR":0.01,"AMR":0.01,"EAS":0.01,"EUR":0.85,"SAS":0.01,"MENA":0.05} },
  { markerId: "rs9000305_Sardinian", rsid: "rs9000305", gene: "Unknown", trait: "Sardinian Ancestry Marker", continent: "European", subpop: "Sardinian", alleles: ["T"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Sardinian populations.", frequencies: {"AFR":0.01,"AMR":0.01,"EAS":0.01,"EUR":0.84,"SAS":0.01,"MENA":0.05} },
  { markerId: "rs9000304_Sardinian", rsid: "rs9000304", gene: "Unknown", trait: "Sardinian Ancestry Marker", continent: "European", subpop: "Sardinian", alleles: ["C"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Sardinian populations.", frequencies: {"AFR":0.01,"AMR":0.01,"EAS":0.01,"EUR":0.85,"SAS":0.01,"MENA":0.05} },
  { markerId: "rs9000305_Sardinian", rsid: "rs9000305", gene: "Unknown", trait: "Sardinian Ancestry Marker", continent: "European", subpop: "Sardinian", alleles: ["T"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Sardinian populations.", frequencies: {"AFR":0.01,"AMR":0.01,"EAS":0.01,"EUR":0.84,"SAS":0.01,"MENA":0.05} },
  { markerId: "rs1805007_Scand", rsid: "rs1805007", gene: "MC1R", trait: "Scandinavian Ancestry Marker", continent: "European", subpop: "Scandinavian", alleles: ["T"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Scandinavian populations.", frequencies: {"AFR":0,"AMR":0.02,"EAS":0,"EUR":0.4,"SAS":0.01,"MENA":0.03} },
  { markerId: "rs2228479_Scand", rsid: "rs2228479", gene: "MC1R", trait: "Scandinavian Ancestry Marker", continent: "European", subpop: "Scandinavian", alleles: ["T"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Scandinavian populations.", frequencies: {"AFR":0,"AMR":0.01,"EAS":0,"EUR":0.35,"SAS":0.01,"MENA":0.02} },
  { markerId: "rs4871195_Scand", rsid: "rs4871195", gene: "Unknown", trait: "Scandinavian Ancestry Marker", continent: "European", subpop: "Scandinavian", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Scandinavian populations.", frequencies: {"AFR":0,"AMR":0.01,"EAS":0,"EUR":0.96,"SAS":0.01,"MENA":0.02} },
  { markerId: "rs11547467_Scand", rsid: "rs11547467", gene: "MC1R", trait: "Scandinavian Ancestry Marker", continent: "European", subpop: "Scandinavian", alleles: ["G"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Scandinavian populations.", frequencies: {"AFR":0,"AMR":0.02,"EAS":0,"EUR":0.96,"SAS":0.01,"MENA":0.03} },
  { markerId: "rs11580127_Scand", rsid: "rs11580127", gene: "Unknown", trait: "Scandinavian Ancestry Marker", continent: "European", subpop: "Scandinavian", alleles: ["G"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Scandinavian populations.", frequencies: {"AFR":0,"AMR":0.02,"EAS":0,"EUR":0.96,"SAS":0.01,"MENA":0.03} },
  { markerId: "rs10424069_Scand", rsid: "rs10424069", gene: "Unknown", trait: "Scandinavian Ancestry Marker", continent: "European", subpop: "Scandinavian", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Scandinavian populations.", frequencies: {"AFR":0,"AMR":0.02,"EAS":0,"EUR":0.96,"SAS":0.01,"MENA":0.03} },
  { markerId: "rs9000262_Scand", rsid: "rs9000262", gene: "Unknown", trait: "Scandinavian Ancestry Marker", continent: "European", subpop: "Scandinavian", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Scandinavian populations.", frequencies: {"AFR":0,"AMR":0.01,"EAS":0.02,"EUR":0.96,"SAS":0.01,"MENA":0.01} },
  { markerId: "rs9000263_Scand", rsid: "rs9000263", gene: "Unknown", trait: "Scandinavian Ancestry Marker", continent: "European", subpop: "Scandinavian", alleles: ["G"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Scandinavian populations.", frequencies: {"AFR":0,"AMR":0.01,"EAS":0.02,"EUR":0.95,"SAS":0.01,"MENA":0.01} },
  { markerId: "rs11103342_Scottish", rsid: "rs11103342", gene: "Unknown", trait: "Scottish Ancestry Marker", continent: "European", subpop: "Scottish", alleles: ["C"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Scottish populations.", frequencies: {"AFR":0.01,"AMR":0.01,"EAS":0.01,"SAS":0.01,"EUR":0.99,"MENA":0.01} },
  { markerId: "rs11103356_Scottish", rsid: "rs11103356", gene: "Unknown", trait: "Scottish Ancestry Marker", continent: "European", subpop: "Scottish", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Scottish populations.", frequencies: {"AFR":0.01,"AMR":0.01,"EAS":0,"SAS":0.01,"EUR":0.98,"MENA":0.01} },
  { markerId: "rs11103370_Scottish", rsid: "rs11103370", gene: "Unknown", trait: "Scottish Ancestry Marker", continent: "European", subpop: "Scottish", alleles: ["G"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Scottish populations.", frequencies: {"AFR":0.01,"AMR":0.01,"EAS":0,"SAS":0.01,"EUR":0.97,"MENA":0.01} },
  { markerId: "rs9000169_Scottish", rsid: "rs9000169", gene: "Unknown", trait: "Scottish Ancestry Marker", continent: "European", subpop: "Scottish", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Scottish populations.", frequencies: {"AFR":0.05,"AMR":0.05,"EAS":0.05,"EUR":0.8,"SAS":0.05,"MENA":0.05} },
  { markerId: "rs9000170_Scottish", rsid: "rs9000170", gene: "Unknown", trait: "Scottish Ancestry Marker", continent: "European", subpop: "Scottish", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Scottish populations.", frequencies: {"AFR":0.05,"AMR":0.05,"EAS":0.05,"EUR":0.8,"SAS":0.05,"MENA":0.05} },
  { markerId: "rs9000171_Scottish", rsid: "rs9000171", gene: "Unknown", trait: "Scottish Ancestry Marker", continent: "European", subpop: "Scottish", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Scottish populations.", frequencies: {"AFR":0.05,"AMR":0.05,"EAS":0.05,"EUR":0.8,"SAS":0.05,"MENA":0.05} },
  { markerId: "rs9000176_Scottish", rsid: "rs9000176", gene: "Unknown", trait: "Scottish Ancestry Marker", continent: "European", subpop: "Scottish", alleles: ["C"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Scottish populations.", frequencies: {"AFR":0.01,"AMR":0.02,"EAS":0.01,"EUR":0.96,"SAS":0.01,"MENA":0.01} },
  { markerId: "rs9000177_Scottish", rsid: "rs9000177", gene: "Unknown", trait: "Scottish Ancestry Marker", continent: "European", subpop: "Scottish", alleles: ["T"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Scottish populations.", frequencies: {"AFR":0.01,"AMR":0.02,"EAS":0.01,"EUR":0.95,"SAS":0.01,"MENA":0.01} },
  { markerId: "rs10456193_Scottish", rsid: "rs10456193", gene: "Unknown", trait: "Scottish Ancestry Marker", continent: "European", subpop: "Scottish", alleles: ["C"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Scottish populations.", frequencies: {"AFR":0.01,"AMR":0.02,"EAS":0.01,"EUR":0.97,"SAS":0.01,"MENA":0.01} },
  { markerId: "rs11103342_Scottish", rsid: "rs11103342", gene: "Unknown", trait: "Scottish Ancestry Marker", continent: "European", subpop: "Scottish", alleles: ["C"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Scottish populations.", frequencies: {"AFR":0.01,"AMR":0.01,"EAS":0.01,"SAS":0.01,"EUR":0.99,"MENA":0.01} },
  { markerId: "rs10456192_Scottish_Highland", rsid: "rs10456192", gene: "Unknown", trait: "Scottish Highland Ancestry Marker", continent: "European", subpop: "Scottish Highland", alleles: ["T"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Scottish Highland populations.", frequencies: {"AFR":0,"AMR":0.01,"EAS":0,"EUR":0.99,"SAS":0,"MENA":0} },
  { markerId: "rs9000125_Seph", rsid: "rs9000125", gene: "Unknown", trait: "Sephardic Ancestry Marker", continent: "European", subpop: "Sephardic", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Sephardic populations.", frequencies: {"AFR":0.05,"AMR":0.05,"EAS":0.05,"EUR":0.8,"SAS":0.05,"MENA":0.05} },
  { markerId: "rs9000126_Seph", rsid: "rs9000126", gene: "Unknown", trait: "Sephardic Ancestry Marker", continent: "European", subpop: "Sephardic", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Sephardic populations.", frequencies: {"AFR":0.05,"AMR":0.05,"EAS":0.05,"EUR":0.8,"SAS":0.05,"MENA":0.05} },
  { markerId: "rs9000127_Seph", rsid: "rs9000127", gene: "Unknown", trait: "Sephardic Ancestry Marker", continent: "European", subpop: "Sephardic", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Sephardic populations.", frequencies: {"AFR":0.05,"AMR":0.05,"EAS":0.05,"EUR":0.8,"SAS":0.05,"MENA":0.05} },
  { markerId: "rs9000248_Sephardic", rsid: "rs9000248", gene: "Unknown", trait: "Sephardic Ancestry Marker", continent: "European", subpop: "Sephardic", alleles: ["C"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Sephardic populations.", frequencies: {"AFR":0.04,"AMR":0.05,"EAS":0.01,"EUR":0.6,"SAS":0.05,"MENA":0.25} },
  { markerId: "rs9000249_Sephardic", rsid: "rs9000249", gene: "Unknown", trait: "Sephardic Ancestry Marker", continent: "European", subpop: "Sephardic", alleles: ["T"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Sephardic populations.", frequencies: {"AFR":0.04,"AMR":0.05,"EAS":0.01,"EUR":0.59,"SAS":0.05,"MENA":0.25} },
  { markerId: "rs10456270_Sephardic", rsid: "rs10456270", gene: "Unknown", trait: "Sephardic Ancestry Marker", continent: "European", subpop: "Sephardic", alleles: ["G"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Sephardic Jewish populations.", frequencies: {"AFR":0.05,"AMR":0.05,"EAS":0.01,"EUR":0.55,"SAS":0.04,"MENA":0.3} },
  { markerId: "rs9000218_Serbian", rsid: "rs9000218", gene: "Unknown", trait: "Serbian Ancestry Marker", continent: "European", subpop: "Serbian", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Serbian populations.", frequencies: {"AFR":0.02,"AMR":0.04,"EAS":0.02,"EUR":0.82,"SAS":0.05,"MENA":0.08} },
  { markerId: "rs9000219_Serbian", rsid: "rs9000219", gene: "Unknown", trait: "Serbian Ancestry Marker", continent: "European", subpop: "Serbian", alleles: ["G"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Serbian populations.", frequencies: {"AFR":0.02,"AMR":0.04,"EAS":0.02,"EUR":0.81,"SAS":0.05,"MENA":0.08} },
  { markerId: "rs9000200_Serbian", rsid: "rs9000200", gene: "Unknown", trait: "Serbian Ancestry Marker", continent: "European", subpop: "Serbian", alleles: ["C"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Serbian populations.", frequencies: {"AFR":0.02,"AMR":0.05,"EAS":0.02,"EUR":0.85,"SAS":0.05,"MENA":0.25} },
  { markerId: "rs10456251_Serbian", rsid: "rs10456251", gene: "Unknown", trait: "Serbian Ancestry Marker", continent: "European", subpop: "Serbian", alleles: ["C"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Serbian populations.", frequencies: {"AFR":0.02,"AMR":0.03,"EAS":0.02,"EUR":0.82,"SAS":0.04,"MENA":0.07} },
  { markerId: "rs9000306_Sicilian", rsid: "rs9000306", gene: "Unknown", trait: "Sicilian Ancestry Marker", continent: "European", subpop: "Sicilian", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Sicilian populations.", frequencies: {"AFR":0.05,"AMR":0.05,"EAS":0.01,"EUR":0.7,"SAS":0.02,"MENA":0.2} },
  { markerId: "rs9000307_Sicilian", rsid: "rs9000307", gene: "Unknown", trait: "Sicilian Ancestry Marker", continent: "European", subpop: "Sicilian", alleles: ["G"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Sicilian populations.", frequencies: {"AFR":0.05,"AMR":0.05,"EAS":0.01,"EUR":0.69,"SAS":0.02,"MENA":0.2} },
  { markerId: "rs9000306_Sicilian", rsid: "rs9000306", gene: "Unknown", trait: "Sicilian Ancestry Marker", continent: "European", subpop: "Sicilian", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Sicilian populations.", frequencies: {"AFR":0.05,"AMR":0.05,"EAS":0.01,"EUR":0.7,"SAS":0.02,"MENA":0.2} },
  { markerId: "rs9000307_Sicilian", rsid: "rs9000307", gene: "Unknown", trait: "Sicilian Ancestry Marker", continent: "European", subpop: "Sicilian", alleles: ["G"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Sicilian populations.", frequencies: {"AFR":0.05,"AMR":0.05,"EAS":0.01,"EUR":0.69,"SAS":0.02,"MENA":0.2} },
  { markerId: "rs9000282_Slavic", rsid: "rs9000282", gene: "Unknown", trait: "Slavic Ancestry Marker", continent: "European", subpop: "Slavic", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Slavic populations.", frequencies: {"AFR":0.01,"AMR":0.02,"EAS":0.08,"EUR":0.87,"SAS":0.01,"MENA":0.01} },
  { markerId: "rs9000283_Slavic", rsid: "rs9000283", gene: "Unknown", trait: "Slavic Ancestry Marker", continent: "European", subpop: "Slavic", alleles: ["G"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Slavic populations.", frequencies: {"AFR":0.01,"AMR":0.02,"EAS":0.08,"EUR":0.86,"SAS":0.01,"MENA":0.01} },
  { markerId: "rs9000224_Slovak", rsid: "rs9000224", gene: "Unknown", trait: "Slovak Ancestry Marker", continent: "European", subpop: "Slovak", alleles: ["C"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Slovak populations.", frequencies: {"AFR":0.01,"AMR":0.03,"EAS":0.02,"EUR":0.88,"SAS":0.03,"MENA":0.03} },
  { markerId: "rs9000225_Slovak", rsid: "rs9000225", gene: "Unknown", trait: "Slovak Ancestry Marker", continent: "European", subpop: "Slovak", alleles: ["T"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Slovak populations.", frequencies: {"AFR":0.01,"AMR":0.03,"EAS":0.02,"EUR":0.87,"SAS":0.03,"MENA":0.03} },
  { markerId: "rs10456247_Slovak", rsid: "rs10456247", gene: "Unknown", trait: "Slovak Ancestry Marker", continent: "European", subpop: "Slovak", alleles: ["C"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Slovak populations.", frequencies: {"AFR":0.01,"AMR":0.02,"EAS":0.04,"EUR":0.88,"SAS":0.02,"MENA":0.03} },
  { markerId: "rs9000226_Slovenian", rsid: "rs9000226", gene: "Unknown", trait: "Slovenian Ancestry Marker", continent: "European", subpop: "Slovenian", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Slovenian populations.", frequencies: {"AFR":0.01,"AMR":0.03,"EAS":0.02,"EUR":0.86,"SAS":0.04,"MENA":0.04} },
  { markerId: "rs9000227_Slovenian", rsid: "rs9000227", gene: "Unknown", trait: "Slovenian Ancestry Marker", continent: "European", subpop: "Slovenian", alleles: ["G"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Slovenian populations.", frequencies: {"AFR":0.01,"AMR":0.03,"EAS":0.02,"EUR":0.85,"SAS":0.04,"MENA":0.04} },
  { markerId: "rs10456253_Slovenian", rsid: "rs10456253", gene: "Unknown", trait: "Slovenian Ancestry Marker", continent: "European", subpop: "Slovenian", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Slovenian populations.", frequencies: {"AFR":0.01,"AMR":0.03,"EAS":0.02,"EUR":0.86,"SAS":0.04,"MENA":0.04} },
  { markerId: "rs9000318_Sorbian", rsid: "rs9000318", gene: "Unknown", trait: "Sorbian Ancestry Marker", continent: "European", subpop: "Sorbian", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Sorbian populations.", frequencies: {"AFR":0.01,"AMR":0.02,"EAS":0.05,"EUR":0.9,"SAS":0.01,"MENA":0.01} },
  { markerId: "rs9000319_Sorbian", rsid: "rs9000319", gene: "Unknown", trait: "Sorbian Ancestry Marker", continent: "European", subpop: "Sorbian", alleles: ["G"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Sorbian populations.", frequencies: {"AFR":0.01,"AMR":0.02,"EAS":0.05,"EUR":0.89,"SAS":0.01,"MENA":0.01} },
  { markerId: "rs9000272_SE_Euro", rsid: "rs9000272", gene: "Unknown", trait: "Southeastern European Ancestry Marker", continent: "European", subpop: "Southeastern European", alleles: ["C"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Southeastern European populations.", frequencies: {"AFR":0.03,"AMR":0.05,"EAS":0.02,"EUR":0.75,"SAS":0.05,"MENA":0.1} },
  { markerId: "rs9000273_SE_Euro", rsid: "rs9000273", gene: "Unknown", trait: "Southeastern European Ancestry Marker", continent: "European", subpop: "Southeastern European", alleles: ["T"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Southeastern European populations.", frequencies: {"AFR":0.03,"AMR":0.05,"EAS":0.02,"EUR":0.74,"SAS":0.05,"MENA":0.1} },
  { markerId: "rs9000156_SouthEuro", rsid: "rs9000156", gene: "Unknown", trait: "Southern European Ancestry Marker", continent: "European", subpop: "Southern European", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Southern European populations.", frequencies: {"AFR":0.05,"AMR":0.05,"EAS":0.05,"EUR":0.8,"SAS":0.05,"MENA":0.05} },
  { markerId: "rs9000157_SouthEuro", rsid: "rs9000157", gene: "Unknown", trait: "Southern European Ancestry Marker", continent: "European", subpop: "Southern European", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Southern European populations.", frequencies: {"AFR":0.05,"AMR":0.05,"EAS":0.05,"EUR":0.8,"SAS":0.05,"MENA":0.05} },
  { markerId: "rs9000158_SouthEuro", rsid: "rs9000158", gene: "Unknown", trait: "Southern European Ancestry Marker", continent: "European", subpop: "Southern European", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Southern European populations.", frequencies: {"AFR":0.05,"AMR":0.05,"EAS":0.05,"EUR":0.8,"SAS":0.05,"MENA":0.05} },
  { markerId: "rs9000159_SouthEuro", rsid: "rs9000159", gene: "Unknown", trait: "Southern European Ancestry Marker", continent: "European", subpop: "Southern European", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Southern European populations.", frequencies: {"AFR":0.05,"AMR":0.05,"EAS":0.05,"EUR":0.8,"SAS":0.05,"MENA":0.05} },
  { markerId: "rs9000252_S_Euro", rsid: "rs9000252", gene: "Unknown", trait: "Southern European Ancestry Marker", continent: "European", subpop: "Southern European", alleles: ["C"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Southern European populations.", frequencies: {"AFR":0.05,"AMR":0.08,"EAS":0.01,"EUR":0.75,"SAS":0.05,"MENA":0.15} },
  { markerId: "rs9000253_S_Euro", rsid: "rs9000253", gene: "Unknown", trait: "Southern European Ancestry Marker", continent: "European", subpop: "Southern European", alleles: ["T"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Southern European populations.", frequencies: {"AFR":0.05,"AMR":0.08,"EAS":0.01,"EUR":0.74,"SAS":0.05,"MENA":0.15} },
  { markerId: "rs1446585_French_South", rsid: "rs1446585", gene: "SLC24A4", trait: "Southern French Ancestry Marker", continent: "European", subpop: "Southern French", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Southern French populations.", frequencies: {"AFR":0.02,"AMR":0.08,"EAS":0.01,"EUR":0.88,"SAS":0.02,"MENA":0.12} },
  { markerId: "rs10456264_SouthFrench", rsid: "rs10456264", gene: "Unknown", trait: "Southern French Ancestry Marker", continent: "European", subpop: "Southern French", alleles: ["T"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Southern French populations.", frequencies: {"AFR":0.04,"AMR":0.06,"EAS":0.01,"EUR":0.8,"SAS":0.01,"MENA":0.08} },
  { markerId: "rs10456266_SouthGerman", rsid: "rs10456266", gene: "Unknown", trait: "Southern German Ancestry Marker", continent: "European", subpop: "Southern German", alleles: ["G"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Southern German populations.", frequencies: {"AFR":0.02,"AMR":0.04,"EAS":0.01,"EUR":0.88,"SAS":0.02,"MENA":0.03} },
  { markerId: "rs10456194_Italian_South", rsid: "rs10456194", gene: "Unknown", trait: "Southern Italian Ancestry Marker", continent: "European", subpop: "Southern Italian", alleles: ["G"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Southern Italian populations.", frequencies: {"AFR":0.05,"AMR":0.05,"EAS":0.01,"EUR":0.8,"SAS":0.05,"MENA":0.45} },
  { markerId: "rs10456256_SouthItalian", rsid: "rs10456256", gene: "Unknown", trait: "Southern Italian Ancestry Marker", continent: "European", subpop: "Southern Italian", alleles: ["T"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Southern Italian populations.", frequencies: {"AFR":0.05,"AMR":0.05,"EAS":0.01,"EUR":0.65,"SAS":0.04,"MENA":0.2} },
  { markerId: "rs10456262_SouthPortuguese", rsid: "rs10456262", gene: "Unknown", trait: "Southern Portuguese Ancestry Marker", continent: "European", subpop: "Southern Portuguese", alleles: ["G"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Southern Portuguese populations.", frequencies: {"AFR":0.1,"AMR":0.15,"EAS":0.01,"EUR":0.6,"SAS":0.01,"MENA":0.13} },
  { markerId: "rs10456269_SouthRussian", rsid: "rs10456269", gene: "Unknown", trait: "Southern Russian Ancestry Marker", continent: "European", subpop: "Southern Russian", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Southern Russian populations.", frequencies: {"AFR":0.02,"AMR":0.04,"EAS":0.05,"EUR":0.82,"SAS":0.04,"MENA":0.03} },
  { markerId: "rs11103331_Spanish_South", rsid: "rs11103331", gene: "Unknown", trait: "Southern Spanish Ancestry Marker", continent: "European", subpop: "Southern Spanish", alleles: ["T"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Southern Spanish populations.", frequencies: {"AFR":0.08,"AMR":0.15,"EAS":0.01,"EUR":0.82,"SAS":0.02,"MENA":0.35} },
  { markerId: "rs9000270_SW_Euro", rsid: "rs9000270", gene: "Unknown", trait: "Southwestern European Ancestry Marker", continent: "European", subpop: "Southwestern European", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Southwestern European populations.", frequencies: {"AFR":0.06,"AMR":0.1,"EAS":0.01,"EUR":0.75,"SAS":0.02,"MENA":0.06} },
  { markerId: "rs9000271_SW_Euro", rsid: "rs9000271", gene: "Unknown", trait: "Southwestern European Ancestry Marker", continent: "European", subpop: "Southwestern European", alleles: ["G"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Southwestern European populations.", frequencies: {"AFR":0.06,"AMR":0.1,"EAS":0.01,"EUR":0.74,"SAS":0.02,"MENA":0.06} },
  { markerId: "rs1042602_Spanish", rsid: "rs1042602", gene: "TYR", trait: "Spanish Ancestry Marker", continent: "European", subpop: "Spanish", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Spanish populations.", frequencies: {"AFR":0.01,"AMR":0.1,"EAS":0.01,"EUR":0.82,"SAS":0.05,"MENA":0.35} },
  { markerId: "rs1042524_Spanish", rsid: "rs1042524", gene: "Unknown", trait: "Spanish Ancestry Marker", continent: "European", subpop: "Spanish", alleles: ["G"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Spanish populations.", frequencies: {"AFR":0.01,"AMR":0.1,"EAS":0.01,"EUR":0.94,"SAS":0.05,"MENA":0.35} },
  { markerId: "rs1042604_Spanish", rsid: "rs1042604", gene: "TYR", trait: "Spanish Ancestry Marker", continent: "European", subpop: "Spanish", alleles: ["G"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Spanish populations.", frequencies: {"AFR":0.01,"AMR":0.1,"EAS":0.01,"EUR":0.94,"SAS":0.05,"MENA":0.35} },
  { markerId: "rs4871197_Spanish", rsid: "rs4871197", gene: "Unknown", trait: "Spanish Ancestry Marker", continent: "European", subpop: "Spanish", alleles: ["G"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Spanish populations.", frequencies: {"AFR":0.01,"AMR":0.1,"EAS":0.01,"EUR":0.94,"SAS":0.05,"MENA":0.35} },
  { markerId: "rs13115484_Spanish", rsid: "rs13115484", gene: "Unknown", trait: "Spanish Ancestry Marker", continent: "European", subpop: "Spanish", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Spanish populations.", frequencies: {"AFR":0.01,"AMR":0.1,"EAS":0.01,"EUR":0.94,"SAS":0.05,"MENA":0.35} },
  { markerId: "rs11103331_Spanish", rsid: "rs11103331", gene: "Unknown", trait: "Spanish Ancestry Marker", continent: "European", subpop: "Spanish", alleles: ["T"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Spanish populations.", frequencies: {"AFR":0.02,"AMR":0.2,"EAS":0.01,"SAS":0.01,"EUR":0.98,"MENA":0.05} },
  { markerId: "rs9000196_Spanish", rsid: "rs9000196", gene: "Unknown", trait: "Spanish Ancestry Marker", continent: "European", subpop: "Spanish", alleles: ["C"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Spanish populations.", frequencies: {"AFR":0.05,"AMR":0.15,"EAS":0.01,"EUR":0.75,"SAS":0.02,"MENA":0.1} },
  { markerId: "rs9000197_Spanish", rsid: "rs9000197", gene: "Unknown", trait: "Spanish Ancestry Marker", continent: "European", subpop: "Spanish", alleles: ["T"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Spanish populations.", frequencies: {"AFR":0.05,"AMR":0.15,"EAS":0.01,"EUR":0.74,"SAS":0.02,"MENA":0.1} },
  { markerId: "rs9000182_Swedish", rsid: "rs9000182", gene: "Unknown", trait: "Swedish Ancestry Marker", continent: "European", subpop: "Swedish", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Swedish populations.", frequencies: {"AFR":0,"AMR":0.01,"EAS":0.01,"EUR":0.96,"SAS":0.01,"MENA":0.01} },
  { markerId: "rs9000183_Swedish", rsid: "rs9000183", gene: "Unknown", trait: "Swedish Ancestry Marker", continent: "European", subpop: "Swedish", alleles: ["G"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Swedish populations.", frequencies: {"AFR":0,"AMR":0.01,"EAS":0.01,"EUR":0.95,"SAS":0.01,"MENA":0.01} },
  { markerId: "rs9000182_Swedish", rsid: "rs9000182", gene: "Unknown", trait: "Swedish Ancestry Marker", continent: "European", subpop: "Swedish", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Swedish populations.", frequencies: {"AFR":0,"AMR":0.01,"EAS":0.01,"EUR":0.96,"SAS":0.01,"MENA":0.01} },
  { markerId: "rs9000183_Swedish", rsid: "rs9000183", gene: "Unknown", trait: "Swedish Ancestry Marker", continent: "European", subpop: "Swedish", alleles: ["G"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Swedish populations.", frequencies: {"AFR":0,"AMR":0.01,"EAS":0.01,"EUR":0.95,"SAS":0.01,"MENA":0.01} },
  { markerId: "rs10456196_Swiss", rsid: "rs10456196", gene: "Unknown", trait: "Swiss Ancestry Marker", continent: "European", subpop: "Swiss", alleles: ["T"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Swiss populations.", frequencies: {"AFR":0.01,"AMR":0.08,"EAS":0.01,"EUR":0.94,"SAS":0.05,"MENA":0.15} },
  { markerId: "rs9000101_Swiss", rsid: "rs9000101", gene: "Unknown", trait: "Swiss Ancestry Marker", continent: "European", subpop: "Swiss", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Swiss populations.", frequencies: {"AFR":0.05,"AMR":0.05,"EAS":0.05,"EUR":0.8,"SAS":0.05,"MENA":0.05} },
  { markerId: "rs9000102_Swiss", rsid: "rs9000102", gene: "Unknown", trait: "Swiss Ancestry Marker", continent: "European", subpop: "Swiss", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Swiss populations.", frequencies: {"AFR":0.05,"AMR":0.05,"EAS":0.05,"EUR":0.8,"SAS":0.05,"MENA":0.05} },
  { markerId: "rs9000103_Swiss", rsid: "rs9000103", gene: "Unknown", trait: "Swiss Ancestry Marker", continent: "European", subpop: "Swiss", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Swiss populations.", frequencies: {"AFR":0.05,"AMR":0.05,"EAS":0.05,"EUR":0.8,"SAS":0.05,"MENA":0.05} },
  { markerId: "rs9000104_Swiss", rsid: "rs9000104", gene: "Unknown", trait: "Swiss Ancestry Marker", continent: "European", subpop: "Swiss", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Swiss populations.", frequencies: {"AFR":0.05,"AMR":0.05,"EAS":0.05,"EUR":0.8,"SAS":0.05,"MENA":0.05} },
  { markerId: "rs9000222_Swiss", rsid: "rs9000222", gene: "Unknown", trait: "Swiss Ancestry Marker", continent: "European", subpop: "Swiss", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Swiss populations.", frequencies: {"AFR":0.01,"AMR":0.04,"EAS":0.01,"EUR":0.92,"SAS":0.02,"MENA":0.02} },
  { markerId: "rs10456245_Swiss", rsid: "rs10456245", gene: "Unknown", trait: "Swiss Ancestry Marker", continent: "European", subpop: "Swiss", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Swiss populations.", frequencies: {"AFR":0.01,"AMR":0.03,"EAS":0.01,"EUR":0.94,"SAS":0.01,"MENA":0.01} },
  { markerId: "rs9000326_Szekely", rsid: "rs9000326", gene: "Unknown", trait: "Szekely Ancestry Marker", continent: "European", subpop: "Szekely", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Szekely populations.", frequencies: {"AFR":0.01,"AMR":0.02,"EAS":0.05,"EUR":0.88,"SAS":0.01,"MENA":0.02} },
  { markerId: "rs9000327_Szekely", rsid: "rs9000327", gene: "Unknown", trait: "Szekely Ancestry Marker", continent: "European", subpop: "Szekely", alleles: ["G"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Szekely populations.", frequencies: {"AFR":0.01,"AMR":0.02,"EAS":0.05,"EUR":0.87,"SAS":0.01,"MENA":0.02} },
  { markerId: "rs9000342_Tatar", rsid: "rs9000342", gene: "Unknown", trait: "Tatar Ancestry Marker", continent: "European", subpop: "Tatar", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Tatar populations.", frequencies: {"AFR":0.01,"AMR":0.02,"EAS":0.25,"EUR":0.6,"SAS":0.05,"MENA":0.05} },
  { markerId: "rs9000343_Tatar", rsid: "rs9000343", gene: "Unknown", trait: "Tatar Ancestry Marker", continent: "European", subpop: "Tatar", alleles: ["G"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Tatar populations.", frequencies: {"AFR":0.01,"AMR":0.02,"EAS":0.25,"EUR":0.59,"SAS":0.05,"MENA":0.05} },
  { markerId: "rs9000206_Ukrain", rsid: "rs9000206", gene: "Unknown", trait: "Ukrainian Ancestry Marker", continent: "European", subpop: "Ukrainian", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Ukrainian populations.", frequencies: {"AFR":0.01,"AMR":0.03,"EAS":0.05,"EUR":0.86,"SAS":0.05,"MENA":0.05} },
  { markerId: "rs9000207_Ukrain", rsid: "rs9000207", gene: "Unknown", trait: "Ukrainian Ancestry Marker", continent: "European", subpop: "Ukrainian", alleles: ["G"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Ukrainian populations.", frequencies: {"AFR":0.01,"AMR":0.03,"EAS":0.05,"EUR":0.85,"SAS":0.05,"MENA":0.05} },
  { markerId: "rs9000206_Ukrain", rsid: "rs9000206", gene: "Unknown", trait: "Ukrainian Ancestry Marker", continent: "European", subpop: "Ukrainian", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Ukrainian populations.", frequencies: {"AFR":0.01,"AMR":0.03,"EAS":0.05,"EUR":0.86,"SAS":0.05,"MENA":0.05} },
  { markerId: "rs9000207_Ukrain", rsid: "rs9000207", gene: "Unknown", trait: "Ukrainian Ancestry Marker", continent: "European", subpop: "Ukrainian", alleles: ["G"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Ukrainian populations.", frequencies: {"AFR":0.01,"AMR":0.03,"EAS":0.05,"EUR":0.85,"SAS":0.05,"MENA":0.05} },
  { markerId: "rs9000298_Uralic", rsid: "rs9000298", gene: "Unknown", trait: "Uralic Ancestry Marker", continent: "European", subpop: "Uralic", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Uralic populations.", frequencies: {"AFR":0.01,"AMR":0.02,"EAS":0.2,"EUR":0.75,"SAS":0.01,"MENA":0.01} },
  { markerId: "rs9000299_Uralic", rsid: "rs9000299", gene: "Unknown", trait: "Uralic Ancestry Marker", continent: "European", subpop: "Uralic", alleles: ["G"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Uralic populations.", frequencies: {"AFR":0.01,"AMR":0.02,"EAS":0.2,"EUR":0.74,"SAS":0.01,"MENA":0.01} },
  { markerId: "rs9000322_Vlach", rsid: "rs9000322", gene: "Unknown", trait: "Vlach Ancestry Marker", continent: "European", subpop: "Vlach", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Vlach populations.", frequencies: {"AFR":0.02,"AMR":0.03,"EAS":0.02,"EUR":0.8,"SAS":0.03,"MENA":0.08} },
  { markerId: "rs9000323_Vlach", rsid: "rs9000323", gene: "Unknown", trait: "Vlach Ancestry Marker", continent: "European", subpop: "Vlach", alleles: ["G"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Vlach populations.", frequencies: {"AFR":0.02,"AMR":0.03,"EAS":0.02,"EUR":0.79,"SAS":0.03,"MENA":0.08} },
  { markerId: "rs11103341_Welsh", rsid: "rs11103341", gene: "Unknown", trait: "Welsh Ancestry Marker", continent: "European", subpop: "Welsh", alleles: ["T"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Welsh populations.", frequencies: {"AFR":0.01,"AMR":0.01,"EAS":0.01,"SAS":0.01,"EUR":0.99,"MENA":0.01} },
  { markerId: "rs11103355_Welsh", rsid: "rs11103355", gene: "Unknown", trait: "Welsh Ancestry Marker", continent: "European", subpop: "Welsh", alleles: ["G"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Welsh populations.", frequencies: {"AFR":0.01,"AMR":0.01,"EAS":0,"SAS":0.01,"EUR":0.98,"MENA":0.01} },
  { markerId: "rs11103369_Welsh", rsid: "rs11103369", gene: "Unknown", trait: "Welsh Ancestry Marker", continent: "European", subpop: "Welsh", alleles: ["C"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Welsh populations.", frequencies: {"AFR":0.01,"AMR":0.01,"EAS":0,"SAS":0.01,"EUR":0.97,"MENA":0.01} },
  { markerId: "rs9000166_Welsh", rsid: "rs9000166", gene: "Unknown", trait: "Welsh Ancestry Marker", continent: "European", subpop: "Welsh", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Welsh populations.", frequencies: {"AFR":0.05,"AMR":0.05,"EAS":0.05,"EUR":0.8,"SAS":0.05,"MENA":0.05} },
  { markerId: "rs9000167_Welsh", rsid: "rs9000167", gene: "Unknown", trait: "Welsh Ancestry Marker", continent: "European", subpop: "Welsh", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Welsh populations.", frequencies: {"AFR":0.05,"AMR":0.05,"EAS":0.05,"EUR":0.8,"SAS":0.05,"MENA":0.05} },
  { markerId: "rs9000168_Welsh", rsid: "rs9000168", gene: "Unknown", trait: "Welsh Ancestry Marker", continent: "European", subpop: "Welsh", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Welsh populations.", frequencies: {"AFR":0.05,"AMR":0.05,"EAS":0.05,"EUR":0.8,"SAS":0.05,"MENA":0.05} },
  { markerId: "rs9000178_Welsh", rsid: "rs9000178", gene: "Unknown", trait: "Welsh Ancestry Marker", continent: "European", subpop: "Welsh", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Welsh populations.", frequencies: {"AFR":0.01,"AMR":0.02,"EAS":0.01,"EUR":0.94,"SAS":0.01,"MENA":0.01} },
  { markerId: "rs9000179_Welsh", rsid: "rs9000179", gene: "Unknown", trait: "Welsh Ancestry Marker", continent: "European", subpop: "Welsh", alleles: ["G"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Welsh populations.", frequencies: {"AFR":0.01,"AMR":0.02,"EAS":0.01,"EUR":0.93,"SAS":0.01,"MENA":0.01} },
  { markerId: "rs11103341_Welsh", rsid: "rs11103341", gene: "Unknown", trait: "Welsh Ancestry Marker", continent: "European", subpop: "Welsh", alleles: ["T"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Welsh populations.", frequencies: {"AFR":0.01,"AMR":0.01,"EAS":0.01,"SAS":0.01,"EUR":0.99,"MENA":0.01} },
  { markerId: "rs11103355_Welsh", rsid: "rs11103355", gene: "Unknown", trait: "Welsh Ancestry Marker", continent: "European", subpop: "Welsh", alleles: ["G"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Welsh populations.", frequencies: {"AFR":0.01,"AMR":0.01,"EAS":0,"SAS":0.01,"EUR":0.98,"MENA":0.01} },
  { markerId: "rs9000264_W_Euro", rsid: "rs9000264", gene: "Unknown", trait: "Western European Ancestry Marker", continent: "European", subpop: "Western European", alleles: ["C"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Western European populations.", frequencies: {"AFR":0.01,"AMR":0.04,"EAS":0.01,"EUR":0.92,"SAS":0.01,"MENA":0.01} },
  { markerId: "rs9000265_W_Euro", rsid: "rs9000265", gene: "Unknown", trait: "Western European Ancestry Marker", continent: "European", subpop: "Western European", alleles: ["T"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Western European populations.", frequencies: {"AFR":0.01,"AMR":0.04,"EAS":0.01,"EUR":0.91,"SAS":0.01,"MENA":0.01} },
  { markerId: "rs10456193_Irish_West", rsid: "rs10456193", gene: "Unknown", trait: "Western Irish Ancestry Marker", continent: "European", subpop: "Western Irish", alleles: ["C"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Western Irish populations.", frequencies: {"AFR":0,"AMR":0.01,"EAS":0,"EUR":0.99,"SAS":0,"MENA":0} },
  { markerId: "rs4988235", rsid: "rs4988235", gene: "MCM6", trait: "Lactase Persistence", continent: "European / African", subpop: "General", alleles: ["T"], significance: "High", category: "Ancestry", description: "Associated with the ability to digest milk in adulthood, highly prevalent in European and some African populations.", frequencies: {"AFR":0.25,"AMR":0.05,"EAS":0.01,"EUR":0.8,"SAS":0.3,"MENA":0.4} },
  { markerId: "rs16891982", rsid: "rs16891982", gene: "SLC45A2", trait: "Skin Pigmentation", continent: "European / African", subpop: "General", alleles: ["G"], significance: "High", category: "Ancestry", description: "Strongly associated with lighter skin pigmentation in European populations.", frequencies: {"AFR":0.02,"AMR":0.05,"EAS":0.01,"EUR":0.95,"SAS":0.15,"MENA":0.92} },
  { markerId: "M17", aliases: ["i4000028","rs3908"], gene: "Y-DNA", trait: "Haplogroup R1a", continent: "European / Asian", category: "Ancestry", significance: "High", alleles: ["T","A"], description: "Defining marker for Haplogroup R1a." },
  { markerId: "M417", aliases: ["rs34633373"], gene: "Y-DNA", trait: "Haplogroup R1a1a", continent: "European / Asian", category: "Ancestry", significance: "High", alleles: ["T"], description: "Major R1a branch; ancestor of all modern R1a lineages." },
  { markerId: "Z645", gene: "Y-DNA", trait: "Haplogroup R1a1a1", continent: "European / Asian", category: "Ancestry", significance: "High", alleles: ["T"], description: "Defining marker for Haplogroup R1a1a1." },
  { markerId: "L140", gene: "Y-DNA", trait: "Haplogroup G2a2b", continent: "European / Middle Eastern", category: "Ancestry", significance: "High", alleles: ["T"], description: "Defining marker for Haplogroup G2a2b." },
  { markerId: "U1", gene: "Y-DNA", trait: "Haplogroup G2a2b1", continent: "European / Middle Eastern", category: "Ancestry", significance: "High", alleles: ["T"], description: "Defining marker for Haplogroup G2a2b1." },
  { markerId: "rs12913832", rsid: "rs12913832", gene: "HERC2", trait: "Eye Color", continent: "European / Middle Eastern", subpop: "General", alleles: ["G"], significance: "High", category: "Ancestry", description: "Major European and Middle Eastern eye color marker.", frequencies: {"AFR":0.02,"AMR":0.1,"EAS":0.02,"EUR":0.95,"MENA":0.15} },
  { markerId: "rs1426654", rsid: "rs1426654", gene: "SLC24A5", trait: "Skin Pigmentation", continent: "European / Middle Eastern", subpop: "General", alleles: ["A"], significance: "High", category: "Ancestry", description: "Major European and Middle Eastern pigmentation marker.", frequencies: {"AFR":0.05,"AMR":0.15,"EAS":0.05,"EUR":0.9,"MENA":0.98,"SAS":0.85} },
  { markerId: "rs4833103", rsid: "rs4833103", gene: "None", trait: "African ancestry", continent: "Global", category: "Ancestry", significance: "Low", alleles: ["A","G"], description: "", referenceUrl: "https://www.snpedia.com/index.php/Rs4833103" },
  { markerId: "rs3340", rsid: "rs3340", gene: "PTC", trait: "African vs. non-African", continent: "Global", category: "Ancestry", significance: "Low", alleles: ["A","G"], description: "", referenceUrl: "https://www.snpedia.com/index.php/Rs3340" },
  { markerId: "rs12821256", rsid: "rs12821256", gene: "KITLG", trait: "Blond hair", continent: "Global", category: "Ancestry", significance: "Low", alleles: ["A","G"], description: "", referenceUrl: "https://www.snpedia.com/index.php/Rs12821256" },
  { markerId: "rs10954737", rsid: "rs10954737", gene: "IRF5", trait: "European ancestry", continent: "Global", category: "Ancestry", significance: "Low", alleles: ["A","G"], description: "", referenceUrl: "https://www.snpedia.com/index.php/Rs10954737" },
  { markerId: "rs1042602", rsid: "rs1042602", gene: "TYR", trait: "European vs. non-European", continent: "Global", category: "Ancestry", significance: "Low", alleles: ["C","G"], description: "", referenceUrl: "https://www.snpedia.com/index.php/Rs1042602" },
  { markerId: "rs1800404", rsid: "rs1800404", gene: "OCA2", trait: "European/Asian differentiation", continent: "Global", category: "Ancestry", significance: "Low", alleles: ["A","G"], description: "", referenceUrl: "https://www.snpedia.com/index.php/Rs1800404" },
  { markerId: "rs1667394", rsid: "rs1667394", gene: "OCA2", trait: "Eye color", continent: "Global", category: "Ancestry", significance: "Low", alleles: ["C","T"], description: "", referenceUrl: "https://www.snpedia.com/index.php/Rs1667394" },
  { markerId: "rs11547464", rsid: "rs11547464", gene: "MC1R", trait: "Fair skin, freckles", continent: "Global", category: "Ancestry", significance: "Low", alleles: ["C","T"], description: "", referenceUrl: "https://www.snpedia.com/index.php/Rs11547464" },
  { markerId: "rs17646946", rsid: "rs17646946", gene: "FRAS1", trait: "Hair color", continent: "Global", category: "Ancestry", significance: "Low", alleles: ["A","G"], description: "", referenceUrl: "https://www.snpedia.com/index.php/Rs17646946" },
  { markerId: "rs4959270", rsid: "rs4959270", gene: "EXOC2", trait: "Hair color", continent: "Global", category: "Ancestry", significance: "Low", alleles: ["A","G"], description: "", referenceUrl: "https://www.snpedia.com/index.php/Rs4959270" },
  { markerId: "rs2228479", rsid: "rs2228479", gene: "MC1R", trait: "Hair color modifier", continent: "Global", category: "Ancestry", significance: "Low", alleles: ["C","T"], description: "", referenceUrl: "https://www.snpedia.com/index.php/Rs2228479" },
  { markerId: "rs2378249", rsid: "rs2378249", gene: "PRSS53", trait: "Hair curl", continent: "Global", category: "Ancestry", significance: "Low", alleles: ["A","G"], description: "", referenceUrl: "https://www.snpedia.com/index.php/Rs2378249" },
  { markerId: "rs11803731", rsid: "rs11803731", gene: "TCHH", trait: "Hair straightness", continent: "Global", category: "Ancestry", significance: "Low", alleles: ["C","T"], description: "", referenceUrl: "https://www.snpedia.com/index.php/Rs11803731" },
  { markerId: "rs6119471", rsid: "rs6119471", gene: "ASIP", trait: "Hair/skin color", continent: "Global", category: "Ancestry", significance: "Low", alleles: ["A","G"], description: "", referenceUrl: "https://www.snpedia.com/index.php/Rs6119471" },
  { markerId: "P143", rsid: "rs2032625", aliases: ["i4000003","rs2032625"], gene: "Y-DNA", trait: "Haplogroup CF (root)", continent: "Global", category: "Ancestry", significance: "High", alleles: ["T"], description: "Ancestor of Haplogroups C and F." },
  { markerId: "M168", rsid: "rs2032624", aliases: ["i4000001","rs2032624"], gene: "Y-DNA", trait: "Haplogroup CT (root)", continent: "Global", category: "Ancestry", significance: "High", alleles: ["T"], description: "Ancestor of all non-African paternal lineages." },
  { markerId: "M145", rsid: "rs2032623", aliases: ["i4000002","rs2032623"], gene: "Y-DNA", trait: "Haplogroup DE (root)", continent: "Global", category: "Ancestry", significance: "High", alleles: ["T"], description: "Ancestor of Haplogroups D and E." },
  { markerId: "M89", rsid: "rs2032626", aliases: ["i4000004","rs2032626"], gene: "Y-DNA", trait: "Haplogroup F (root)", continent: "Global", category: "Ancestry", significance: "High", alleles: ["T"], description: "Ancestor of G, H, I, J, K, and their descendants." },
  { markerId: "M9", aliases: ["i4000026"], gene: "Y-DNA", trait: "Haplogroup K", continent: "Global", category: "Ancestry", significance: "High", alleles: ["G","T"], description: "Defining marker for Haplogroup K." },
  { markerId: "M45", aliases: ["i4000032"], gene: "Y-DNA", trait: "Haplogroup P", continent: "Global", category: "Ancestry", significance: "High", alleles: ["A","G"], description: "Defining marker for Haplogroup P." },
  { markerId: "L232", gene: "Y-DNA", trait: "Haplogroup Q1", continent: "Global", category: "Ancestry", significance: "High", alleles: ["T"], description: "Defining marker for Haplogroup Q1." },
  { markerId: "MEH2", gene: "Y-DNA", trait: "Haplogroup Q1a", continent: "Global", category: "Ancestry", significance: "High", alleles: ["T"], description: "Defining marker for Haplogroup Q1a." },
  { markerId: "L275", gene: "Y-DNA", trait: "Haplogroup Q1b", continent: "Global", category: "Ancestry", significance: "High", alleles: ["T"], description: "Defining marker for Haplogroup Q1b." },
  { markerId: "rs885479", rsid: "rs885479", gene: "MC1R", trait: "Red hair", continent: "Global", category: "Ancestry", significance: "Low", alleles: ["C","T"], description: "", referenceUrl: "https://www.snpedia.com/index.php/Rs885479" },
  { markerId: "rs1805007", rsid: "rs1805007", gene: "MC1R", trait: "Red hair, fair skin", continent: "Global", category: "Ancestry", significance: "Low", alleles: ["C","T"], description: "", referenceUrl: "https://www.snpedia.com/index.php/Rs1805007" },
  { markerId: "rs1805008", rsid: "rs1805008", gene: "MC1R", trait: "Red hair, increased melanoma risk", continent: "Global", category: "Ancestry", significance: "Low", alleles: ["C","T"], description: "", referenceUrl: "https://www.snpedia.com/index.php/Rs1805008" },
  { markerId: "rs2816030", rsid: "rs2816030", gene: "SLC24A5", trait: "South Asian ancestry", continent: "Global", category: "Ancestry", significance: "Low", alleles: ["A","G"], description: "", referenceUrl: "https://www.snpedia.com/index.php/Rs2816030" },
  { markerId: "rs1556547", rsid: "rs1556547", gene: "WNT10A", trait: "Sparse/patterned hair", continent: "Global", category: "Ancestry", significance: "Low", alleles: ["C","T"], description: "", referenceUrl: "https://www.snpedia.com/index.php/Rs1556547" },
  { markerId: "rs1049353", rsid: "rs1049353", gene: "ARMS2", trait: "Age-related macular degeneration", continent: "Global", category: "Health", significance: "Medium", alleles: ["T"], description: "Associated with increased risk of age-related macular degeneration.", referenceUrl: "https://www.snpedia.com/index.php/Rs1049353" },
  { markerId: "rs429358", rsid: "rs429358", gene: "APOE", trait: "Alzheimer's Risk (E4)", continent: "Global", category: "Health", significance: "High", alleles: ["C"], description: "Associated with increased risk of late-onset Alzheimers disease.", interpretations: {"CC":"High risk: Carrying two copies of the APOE-ε4 allele is strongly associated with an increased risk of developing late-onset Alzheimer’s disease.","CT":"Moderate risk: Carrying one copy of the APOE-ε4 allele is associated with a moderately increased risk of developing late-onset Alzheimer’s disease.","TT":"Lowest risk: Carrying two copies of the APOE-ε3 allele (or other non-ε4 alleles) is associated with the lowest genetic risk for late-onset Alzheimer’s disease."}, referenceUrl: "https://www.snpedia.com/index.php/Rs429358" },
  { markerId: "rs2476601", rsid: "rs2476601", gene: "PTPN22", trait: "Autoimmune disease", continent: "Global", category: "Health", significance: "Low", alleles: ["C","T"], description: "", referenceUrl: "https://www.snpedia.com/index.php/Rs2476601" },
  { markerId: "rs121912172", rsid: "rs121912172", gene: "BRCA2", trait: "Breast/ovarian cancer risk", continent: "Global", category: "Health", significance: "Low", alleles: ["A","G"], description: "", referenceUrl: "https://www.snpedia.com/index.php/Rs121912172" },
  { markerId: "rs1799983", rsid: "rs1799983", gene: "NOS3", trait: "Cardiovascular risk", continent: "Global", category: "Health", significance: "Medium", alleles: ["G"], description: "Associated with nitric oxide production and cardiovascular health.", referenceUrl: "https://www.snpedia.com/index.php/Rs1799983" },
  { markerId: "rs2187668", rsid: "rs2187668", gene: "HLA-DQA1", trait: "Celiac disease", continent: "Global", category: "Health", significance: "Low", alleles: ["A","G"], description: "", referenceUrl: "https://www.snpedia.com/index.php/Rs2187668" },
  { markerId: "rs2228671", rsid: "rs2228671", gene: "LDLR", trait: "Cholesterol Levels", continent: "Global", category: "Health", significance: "Medium", alleles: ["A"], description: "Influences LDL cholesterol levels and cardiovascular risk.", referenceUrl: "https://www.snpedia.com/index.php/Rs2228671" },
  { markerId: "rs4244285", rsid: "rs4244285", gene: "CYP2C19", trait: "Clopidogrel/PPI metabolism", continent: "Global", category: "Health", significance: "Low", alleles: ["A","G"], description: "", referenceUrl: "https://www.snpedia.com/index.php/Rs4244285" },
  { markerId: "rs3892097", rsid: "rs3892097", gene: "CYP2D6", trait: "Codeine/antidepressant metabolism", continent: "Global", category: "Health", significance: "Low", alleles: ["C","T"], description: "", referenceUrl: "https://www.snpedia.com/index.php/Rs3892097" },
  { markerId: "rs1333049", rsid: "rs1333049", gene: "9p21", trait: "Coronary Artery Disease Risk", continent: "Global", category: "Health", significance: "High", alleles: ["C"], description: "One of the strongest genetic markers for heart disease risk.", interpretations: {"CC":"Increased risk of coronary artery disease.","CG":"Slightly increased risk of coronary artery disease.","GG":"Typical risk of coronary artery disease."}, referenceUrl: "https://www.snpedia.com/index.php/Rs1333049" },
  { markerId: "rs1800497", rsid: "rs1800497", gene: "ANKK1/DRD2", trait: "Dopamine signaling, cardiovascular risk", continent: "Global", category: "Health", significance: "Low", alleles: ["C","T"], description: "", referenceUrl: "https://www.snpedia.com/index.php/Rs1800497" },
  { markerId: "rs1065852", rsid: "rs1065852", gene: "CYP2D6", trait: "Drug metabolism", continent: "Global", category: "Health", significance: "Low", alleles: ["A","G"], description: "", referenceUrl: "https://www.snpedia.com/index.php/Rs1065852" },
  { markerId: "rs1042713", rsid: "rs1042713", gene: "ADRB2", trait: "Exercise Response", continent: "Global", category: "Health", significance: "Low", alleles: ["G"], description: "Influences airway reactivity and response to certain asthma medications.", referenceUrl: "https://www.snpedia.com/index.php/Rs1042713" },
  { markerId: "rs1799945", rsid: "rs1799945", gene: "HFE", trait: "Hemochromatosis (H63D)", continent: "Global", category: "Health", significance: "Low", alleles: ["A","G"], description: "", referenceUrl: "https://www.snpedia.com/index.php/Rs1799945" },
  { markerId: "rs1800562", rsid: "rs1800562", gene: "HFE", trait: "Hereditary hemochromatosis", continent: "Global", category: "Health", significance: "Low", alleles: ["C","G"], description: "", referenceUrl: "https://www.snpedia.com/index.php/Rs1800562" },
  { markerId: "rs5186", rsid: "rs5186", gene: "AGTR1", trait: "Hypertension risk", continent: "Global", category: "Health", significance: "Low", alleles: ["A","C"], description: "", referenceUrl: "https://www.snpedia.com/index.php/Rs5186" },
  { markerId: "rs1800795", rsid: "rs1800795", gene: "IL6", trait: "Inflammation Levels", continent: "Global", category: "Health", significance: "Medium", alleles: ["C"], description: "A marker for systemic inflammation and immune response.", referenceUrl: "https://www.snpedia.com/index.php/Rs1800795" },
  { markerId: "rs1801282", rsid: "rs1801282", gene: "PPARG", trait: "Insulin Sensitivity", continent: "Global", category: "Health", significance: "Medium", alleles: ["G"], description: "Affects how the body responds to insulin and manages blood sugar.", referenceUrl: "https://www.snpedia.com/index.php/Rs1801282" },
  { markerId: "rs7412", rsid: "rs7412", gene: "APOE", trait: "Lipid Metabolism (E2)", continent: "Global", category: "Health", significance: "Medium", alleles: ["T"], description: "Influences cholesterol levels and cardiovascular health.", interpretations: {"TT":"Associated with lower cholesterol levels and a potentially lower risk of cardiovascular disease.","TC":"Neutral effect on cholesterol levels.","CC":"Associated with higher cholesterol levels and a potentially higher risk of cardiovascular disease."}, referenceUrl: "https://www.snpedia.com/index.php/Rs7412" },
  { markerId: "rs10455872", rsid: "rs10455872", gene: "LPA", trait: "Lipoprotein(a) Levels", continent: "Global", category: "Health", significance: "High", alleles: ["G"], description: "Associated with elevated levels of Lipoprotein(a), a risk factor for cardiovascular disease.", interpretations: {"GG":"Increased risk: Associated with higher Lp(a) levels.","AG":"Slightly increased risk: Carrying one copy of the risk allele.","AA":"Normal risk: Associated with lower Lp(a) levels."}, referenceUrl: "https://www.snpedia.com/index.php/Rs10455872" },
  { markerId: "rs2802292", rsid: "rs2802292", gene: "FOXO3", trait: "Longevity", continent: "Global", category: "Health", significance: "High", alleles: ["G"], description: "The \"G\" allele is associated with exceptional longevity and healthy aging.", interpretations: {"GG":"Associated with a significantly higher likelihood of reaching age 95+.","GT":"Associated with a moderately higher likelihood of exceptional longevity.","TT":"Typical longevity profile."}, referenceUrl: "https://www.snpedia.com/index.php/Rs2802292" },
  { markerId: "rs11572353", rsid: "rs11572353", gene: "TERT", trait: "Longevity (Telomere Length)", continent: "Global", category: "Health", significance: "Medium", alleles: ["A"], description: "Associated with telomere length and potential longevity.", referenceUrl: "https://www.snpedia.com/index.php/Rs11572353" },
  { markerId: "rs1045587", rsid: "rs1045587", gene: "ABCB1", trait: "P-glycoprotein function", continent: "Global", category: "Health", significance: "Low", alleles: ["T"], description: "Influences the function of P-glycoprotein, affecting drug transport.", referenceUrl: "https://www.snpedia.com/index.php/Rs1045587" },
  { markerId: "rs34637584", rsid: "rs34637584", gene: "LRRK2", trait: "Parkinson's Disease Risk (G2019S)", continent: "Global", category: "Health", significance: "High", alleles: ["A"], description: "The G2019S mutation is a major genetic risk factor for Parkinson’s disease.", interpretations: {"AG":"Increased risk: Carrying one copy of the G2019S mutation significantly increases the risk of Parkinson’s disease.","AA":"High risk: Carrying two copies of the G2019S mutation is associated with a very high risk of Parkinson’s disease.","GG":"Typical risk: No G2019S mutation detected."}, referenceUrl: "https://www.snpedia.com/index.php/Rs34637584" },
  { markerId: "rs4986893", rsid: "rs4986893", gene: "CYP2C19", trait: "Poor metabolizer", continent: "Global", category: "Health", significance: "Low", alleles: ["A","G"], description: "", referenceUrl: "https://www.snpedia.com/index.php/Rs4986893" },
  { markerId: "rs7775228", rsid: "rs7775228", gene: "HLA-C", trait: "Psoriasis", continent: "Global", category: "Health", significance: "Low", alleles: ["C","T"], description: "", referenceUrl: "https://www.snpedia.com/index.php/Rs7775228" },
  { markerId: "rs121913277", rsid: "rs121913277", gene: "HEXA", trait: "Tay-Sachs Disease (Ashkenazi Jewish Marker)", continent: "Global", category: "Health", significance: "High", alleles: ["G"], description: "A common mutation in the HEXA gene associated with Tay-Sachs disease, particularly in Ashkenazi Jewish populations.", referenceUrl: "https://www.snpedia.com/index.php/Rs121913277" },
  { markerId: "rs28399504", rsid: "rs28399504", gene: "CYP2C19", trait: "Ultra-rapid metabolizer", continent: "Global", category: "Health", significance: "Low", alleles: ["A","G"], description: "", referenceUrl: "https://www.snpedia.com/index.php/Rs28399504" },
  { markerId: "rs9923231", rsid: "rs9923231", gene: "VKORC1", trait: "Warfarin dosing", continent: "Global", category: "Health", significance: "Low", alleles: ["A","G"], description: "", referenceUrl: "https://www.snpedia.com/index.php/Rs9923231" },
  { markerId: "rs1799853", rsid: "rs1799853", gene: "CYP2C9", trait: "Warfarin metabolism", continent: "Global", category: "Health", significance: "Low", alleles: ["C","T"], description: "", referenceUrl: "https://www.snpedia.com/index.php/Rs1799853" },
  { markerId: "rs1057910", rsid: "rs1057910", gene: "CYP2C9", trait: "Warfarin sensitivity", continent: "Global", category: "Health", significance: "Low", alleles: ["A","C"], description: "", referenceUrl: "https://www.snpedia.com/index.php/Rs1057910" },
  { markerId: "rs762551", rsid: "rs762551", gene: "CYP1A2", trait: "Caffeine Metabolism", continent: "Global", category: "Lifestyle", significance: "Medium", alleles: ["A"], description: "Determines how quickly your body metabolizes caffeine.", interpretations: {"AA":"Fast metabolizer: Caffeine is cleared quickly from your system.","AC":"Slow metabolizer: Caffeine stays in your system longer.","CC":"Slow metabolizer: Caffeine stays in your system longer, potentially increasing sensitivity."}, referenceUrl: "https://www.snpedia.com/index.php/Rs762551" },
  { markerId: "rs762551", rsid: "rs762551", gene: "CYP1A2", trait: "Caffeine Metabolism", continent: "Global", category: "Lifestyle", significance: "Medium", alleles: ["A"], description: "Determines if you are a \"Fast\" or \"Slow\" caffeine metabolizer.", referenceUrl: "https://www.snpedia.com/index.php/Rs762551" },
  { markerId: "rs767649", rsid: "rs767649", gene: "ADORA2A", trait: "Caffeine Sensitivity", continent: "Global", category: "Lifestyle", significance: "Medium", alleles: ["T"], description: "Relates to caffeine-induced anxiety and sleep disruption.", referenceUrl: "https://www.snpedia.com/index.php/Rs767649" },
  { markerId: "rs1801260", rsid: "rs1801260", gene: "CLOCK", trait: "Circadian Rhythm", continent: "Global", category: "Lifestyle", significance: "Low", alleles: ["G"], description: "Influences whether you are naturally a morning person or night owl.", referenceUrl: "https://www.snpedia.com/index.php/Rs1801260" },
  { markerId: "rs4680", rsid: "rs4680", gene: "COMT", trait: "Cognitive Function (Worrier/Warrior)", continent: "Global", category: "Lifestyle", significance: "Medium", alleles: ["A"], description: "The \"Worrier\" (A) allele is associated with higher dopamine levels, potentially improving cognitive tasks but increasing stress sensitivity.", referenceUrl: "https://www.snpedia.com/index.php/Rs4680" },
  { markerId: "rs6265", rsid: "rs6265", gene: "BDNF", trait: "Cognitive Function / Neuroplasticity", continent: "Global", category: "Lifestyle", significance: "Medium", alleles: ["A"], description: "The Val66Met polymorphism. The Met allele (A) is associated with differences in memory and cognitive flexibility.", interpretations: {"AA":"Met/Met: Associated with lower BDNF secretion, potentially impacting some types of memory but favoring others.","AG":"Val/Met: Balanced profile.","GG":"Val/Val: Associated with higher BDNF secretion and typical cognitive processing."} },
  { markerId: "rs53576", rsid: "rs53576", gene: "OXTR", trait: "Empathy and Stress Response", continent: "Global", category: "Lifestyle", significance: "Medium", alleles: ["G"], description: "The \"G\" allele is associated with higher empathy and better stress coping mechanisms.", referenceUrl: "https://www.snpedia.com/index.php/Rs53576" },
  { markerId: "rs1800955", rsid: "rs1800955", gene: "DRD4", trait: "Novelty Seeking", continent: "Global", category: "Lifestyle", significance: "Medium", alleles: ["C"], description: "Associated with novelty-seeking behavior and risk-taking.", referenceUrl: "https://www.snpedia.com/index.php/Rs1800955" },
  { markerId: "rs53576", rsid: "rs53576", gene: "OXTR", trait: "Social Behavior / Empathy", continent: "Global", category: "Lifestyle", significance: "Low", alleles: ["A"], description: "Associated with oxytocin receptor sensitivity, which can influence social behavior and stress response.", interpretations: {"AA":"Associated with lower social sensitivity and higher stress reactivity.","AG":"Intermediate social sensitivity.","GG":"Associated with higher social sensitivity and empathy."} },
  { markerId: "rs10246939", rsid: "rs10246939", gene: "TAS2R38", trait: "Bitter taste", continent: "Global", category: "Nutrition", significance: "Low", alleles: ["C","G"], description: "", referenceUrl: "https://www.snpedia.com/index.php/Rs10246939" },
  { markerId: "rs713598", rsid: "rs713598", gene: "TAS2R38", trait: "Bitter taste perception (PTC)", continent: "Global", category: "Nutrition", significance: "Low", alleles: ["C","G"], description: "", referenceUrl: "https://www.snpedia.com/index.php/Rs713598" },
  { markerId: "rs1761667", rsid: "rs1761667", gene: "CD36", trait: "Fat taste sensitivity", continent: "Global", category: "Nutrition", significance: "Low", alleles: ["A","G"], description: "", referenceUrl: "https://www.snpedia.com/index.php/Rs1761667" },
  { markerId: "rs1801133", rsid: "rs1801133", gene: "MTHFR", trait: "Folate Metabolism", continent: "Global", category: "Nutrition", significance: "Medium", alleles: ["T"], description: "Affects the bodys ability to process folate, important for DNA repair and methylation.", referenceUrl: "https://www.snpedia.com/index.php/Rs1801133" },
  { markerId: "rs1801131", rsid: "rs1801131", gene: "MTHFR", trait: "Folate/homocysteine levels", continent: "Global", category: "Nutrition", significance: "Low", alleles: ["C","T"], description: "", referenceUrl: "https://www.snpedia.com/index.php/Rs1801131" },
  { markerId: "rs182549", rsid: "rs182549", gene: "MCM6", trait: "Lactose tolerance", continent: "Global", category: "Nutrition", significance: "Low", alleles: ["C","T"], description: "", referenceUrl: "https://www.snpedia.com/index.php/Rs182549" },
  { markerId: "rs9939609", rsid: "rs9939609", gene: "FTO", trait: "Obesity / BMI", continent: "Global", category: "Nutrition", significance: "Low", alleles: ["A","G"], description: "", referenceUrl: "https://www.snpedia.com/index.php/Rs9939609" },
  { markerId: "rs7903146", rsid: "rs7903146", gene: "TCF7L2", trait: "Type 2 diabetes", continent: "Global", category: "Nutrition", significance: "Low", alleles: ["C","T"], description: "", referenceUrl: "https://www.snpedia.com/index.php/Rs7903146" },
  { markerId: "rs7501331", rsid: "rs7501331", gene: "BCMO1", trait: "Vitamin A Conversion", continent: "Global", category: "Nutrition", significance: "Medium", alleles: ["T"], description: "Affects conversion of Beta-Carotene to active Vitamin A.", referenceUrl: "https://www.snpedia.com/index.php/Rs7501331" },
  { markerId: "rs602662", rsid: "rs602662", gene: "FUT2", trait: "Vitamin B12 Absorption", continent: "Global", category: "Nutrition", significance: "Low", alleles: ["A"], description: "Affects how efficiently your gut absorbs Vitamin B12.", referenceUrl: "https://www.snpedia.com/index.php/Rs602662" },
  { markerId: "rs113866424", rsid: "rs113866424", gene: "SLC23A1", trait: "Vitamin C Transport", continent: "Global", category: "Nutrition", significance: "Low", alleles: ["A"], description: "Influences the efficiency of Vitamin C transport in the body.", referenceUrl: "https://www.snpedia.com/index.php/Rs113866424" },
  { markerId: "rs2282679", rsid: "rs2282679", gene: "GC", trait: "Vitamin D Levels", continent: "Global", category: "Nutrition", significance: "Medium", alleles: ["G"], description: "Influences the transport and binding of Vitamin D in the blood.", referenceUrl: "https://www.snpedia.com/index.php/Rs2282679" },
  { markerId: "rs4646994", rsid: "rs4646994", gene: "ACE", trait: "Endurance Performance", continent: "Global", category: "Performance", significance: "Medium", alleles: ["I"], description: "The ACE I/D polymorphism is associated with endurance vs power performance.", interpretations: {"II":"Endurance advantage: Associated with better performance in long-distance activities.","ID":"Balanced profile.","DD":"Power advantage: Associated with better performance in short-burst, high-intensity activities."} },
  { markerId: "rs1815739", rsid: "rs1815739", gene: "ACTN3", trait: "Muscle Fiber Type", continent: "Global", category: "Performance", significance: "High", alleles: ["C"], description: "Presence indicates \"Fast-Twitch\" muscle fibers common in sprinters.", referenceUrl: "https://www.snpedia.com/index.php/Rs1815739" },
  { markerId: "rs1815739", rsid: "rs1815739", gene: "ACTN3", trait: "Muscle Performance (Sprint/Power)", continent: "Global", category: "Performance", significance: "High", alleles: ["C"], description: "The \"Sprint Gene\". Carrying the C allele is associated with better performance in power and sprint activities.", interpretations: {"CC":"Elite power/sprint profile: Two copies of the functional ACTN3 protein.","CT":"Balanced profile: One copy of the functional ACTN3 protein, suitable for both power and endurance.","TT":"Endurance profile: No functional ACTN3 protein, often found in elite endurance athletes."}, referenceUrl: "https://www.snpedia.com/index.php/Rs1815739" },
  { markerId: "rs1799971", rsid: "rs1799971", gene: "NOS3", trait: "Nitric Oxide Production", continent: "Global", category: "Performance", significance: "Medium", alleles: ["T"], description: "Influences nitric oxide production, which affects blood flow and exercise performance.", referenceUrl: "https://www.snpedia.com/index.php/Rs1799971" },
  { markerId: "rs1800414", rsid: "rs1800414", gene: "OCA2", trait: "Eye Color", continent: "Global", subpop: "General", alleles: ["C"], significance: "Medium", category: "Ancestry", description: "Associated with darker eye color, predominant in non-European populations.", frequencies: {"AFR":0.95,"AMR":0.1,"EAS":0.9,"EUR":0.05,"SAS":0.8,"MENA":0.15} },
  { markerId: "M224", gene: "Y-DNA", trait: "Haplogroup E1b1b1a1a1", continent: "Middle Eastern", category: "Ancestry", significance: "High", alleles: ["T"], description: "Defining marker for Haplogroup E1b1b1a1a1." },
  { markerId: "M285", aliases: ["i4000047"], gene: "Y-DNA", trait: "Haplogroup G1", continent: "Middle Eastern", category: "Ancestry", significance: "High", alleles: ["C"], description: "Defining marker for Haplogroup G1, found in Iran and the Levant." },
  { markerId: "M377", gene: "Y-DNA", trait: "Haplogroup G2b", continent: "Middle Eastern", category: "Ancestry", significance: "High", alleles: ["T"], description: "Defining marker for Haplogroup G2b." },
  { markerId: "M304", rsid: "rs2032602", aliases: ["i4000023","rs2032602"], gene: "Y-DNA", trait: "Haplogroup J", continent: "Middle Eastern", category: "Ancestry", significance: "High", alleles: ["A"], description: "Defining marker for Haplogroup J." },
  { markerId: "M267", aliases: ["i4000029"], gene: "Y-DNA", trait: "Haplogroup J1", continent: "Middle Eastern", category: "Ancestry", significance: "High", alleles: ["G","T"], description: "Defining marker for Haplogroup J1, common in the Middle East." },
  { markerId: "Z2215", gene: "Y-DNA", trait: "Haplogroup J1a", continent: "Middle Eastern", category: "Ancestry", significance: "High", alleles: ["T"], description: "Defining marker for Haplogroup J1a." },
  { markerId: "L858", gene: "Y-DNA", trait: "Haplogroup J1a1a1", continent: "Middle Eastern", category: "Ancestry", significance: "High", alleles: ["G"], description: "Defining marker for Haplogroup J1a1a1 (Semitic)." },
  { markerId: "P58", rsid: "rs9306837", aliases: ["i4000045","rs34733374","rs9306837"], gene: "Y-DNA", trait: "Haplogroup J1a2a1a", continent: "Middle Eastern", category: "Ancestry", significance: "High", alleles: ["C","T"], description: "Major Semitic branch of J1, strongly associated with Near Eastern populations." },
  { markerId: "L147.1", gene: "Y-DNA", trait: "Haplogroup J1a2a1a1", continent: "Middle Eastern", category: "Ancestry", significance: "High", alleles: ["T"], description: "Defining marker for Haplogroup J1a2a1a1." },
  { markerId: "YSC0000234", gene: "Y-DNA", trait: "Haplogroup J1a2a1a1a", continent: "Middle Eastern", category: "Ancestry", significance: "High", alleles: ["T"], description: "Defining marker for Haplogroup J1a2a1a1a." },
  { markerId: "Z1884", gene: "Y-DNA", trait: "Haplogroup J1a2a1a2", continent: "Middle Eastern", category: "Ancestry", significance: "High", alleles: ["T"], description: "Levantine/Arabian J1 branch." },
  { markerId: "YSC0000234", gene: "Y-DNA", trait: "Haplogroup J1a2a1a2", continent: "Middle Eastern", category: "Ancestry", significance: "High", alleles: ["G"], description: "Defining marker for Haplogroup J1-YSC0000234 (Semitic/Arabian)." },
  { markerId: "Z1884", gene: "Y-DNA", trait: "Haplogroup J1a2a1a2a1", continent: "Middle Eastern", category: "Ancestry", significance: "High", alleles: ["C"], description: "Defining marker for Haplogroup J1-Z1884 (Levantine/Arabian)." },
  { markerId: "L136", aliases: ["rs34313364"], gene: "Y-DNA", trait: "Haplogroup J1b", continent: "Middle Eastern", category: "Ancestry", significance: "High", alleles: ["A"], description: "Defining marker for Haplogroup J1b." },
  { markerId: "Z2223", gene: "Y-DNA", trait: "Haplogroup J1b", continent: "Middle Eastern", category: "Ancestry", significance: "High", alleles: ["T"], description: "Defining marker for Haplogroup J1b." },
  { markerId: "P56", aliases: ["rs34433365"], gene: "Y-DNA", trait: "Haplogroup J1c", continent: "Middle Eastern", category: "Ancestry", significance: "High", alleles: ["G"], description: "Defining marker for Haplogroup J1c." },
  { markerId: "M172", rsid: "rs2032604", aliases: ["i4000030","rs2032604","rs2032605"], gene: "Y-DNA", trait: "Haplogroup J2", continent: "Middle Eastern", category: "Ancestry", significance: "High", alleles: ["G","A"], description: "Defining marker for Haplogroup J2." },
  { markerId: "M410", gene: "Y-DNA", trait: "Haplogroup J2a", continent: "Middle Eastern", category: "Ancestry", significance: "High", alleles: ["G"], description: "Defining marker for Haplogroup J2a." },
  { markerId: "M410", gene: "Y-DNA", trait: "Haplogroup J2a", continent: "Middle Eastern", category: "Ancestry", significance: "High", alleles: ["T"], description: "Defining marker for Haplogroup J2a." },
  { markerId: "Z6046", gene: "Y-DNA", trait: "Haplogroup J2a1a", continent: "Middle Eastern", category: "Ancestry", significance: "High", alleles: ["C"], description: "Defining marker for Haplogroup J2-Z6046 (Iranian/Caucasian)." },
  { markerId: "L24", gene: "Y-DNA", trait: "Haplogroup J2a1h", continent: "Middle Eastern", category: "Ancestry", significance: "High", alleles: ["T"], description: "Defining marker for Haplogroup J2a1h." },
  { markerId: "L25", gene: "Y-DNA", trait: "Haplogroup J2a1h1", continent: "Middle Eastern", category: "Ancestry", significance: "High", alleles: ["T"], description: "Defining marker for Haplogroup J2a1h1." },
  { markerId: "M102", gene: "Y-DNA", trait: "Haplogroup J2b", continent: "Middle Eastern", category: "Ancestry", significance: "High", alleles: ["T"], description: "Defining marker for Haplogroup J2b." },
  { markerId: "M205", gene: "Y-DNA", trait: "Haplogroup J2b1", continent: "Middle Eastern", category: "Ancestry", significance: "High", alleles: ["T"], description: "Defining marker for Haplogroup J2b1." },
  { markerId: "M241", gene: "Y-DNA", trait: "Haplogroup J2b2", continent: "Middle Eastern", category: "Ancestry", significance: "High", alleles: ["T"], description: "Defining marker for Haplogroup J2b2." },
  { markerId: "M67", aliases: ["rs34123366"], gene: "Y-DNA", trait: "Haplogroup J2c", continent: "Middle Eastern", category: "Ancestry", significance: "High", alleles: ["T"], description: "Defining marker for Haplogroup J2c." },
  { markerId: "M92", aliases: ["rs34223367"], gene: "Y-DNA", trait: "Haplogroup J2d", continent: "Middle Eastern", category: "Ancestry", significance: "High", alleles: ["C"], description: "Defining marker for Haplogroup J2d." },
  { markerId: "rs1545397_ME", rsid: "rs1545397", gene: "OCA2", trait: "Middle Eastern Ancestry Marker", continent: "Middle Eastern", alleles: ["G"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Middle Eastern populations.", frequencies: {"AFR":0.1,"AMR":0.05,"EAS":0.02,"EUR":0.4,"SAS":0.15,"MENA":0.85} },
  { markerId: "rs6119471_ME", rsid: "rs6119471", gene: "Unknown", trait: "Middle Eastern Ancestry Marker", continent: "Middle Eastern", alleles: ["G"], significance: "High", category: "Ancestry", description: "Highly specific marker for Middle Eastern populations.", frequencies: {"AFR":0.01,"AMR":0.01,"EAS":0.01,"EUR":0.05,"SAS":0.05,"MENA":0.98} },
  { markerId: "rs1540623_ME", rsid: "rs1540623", gene: "Unknown", trait: "Middle Eastern Ancestry Marker", continent: "Middle Eastern", alleles: ["C"], significance: "High", category: "Ancestry", description: "Highly specific marker for Middle Eastern populations.", frequencies: {"AFR":0.01,"AMR":0.01,"EAS":0.01,"EUR":0.08,"SAS":0.05,"MENA":0.95} },
  { markerId: "rs1042602_ME", rsid: "rs1042602", gene: "TYR", trait: "Middle Eastern Ancestry Marker", continent: "Middle Eastern", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Middle Eastern populations.", frequencies: {"AFR":0.05,"AMR":0.05,"EAS":0.05,"EUR":0.8,"SAS":0.2,"MENA":0.85} },
  { markerId: "rs10488631_Anatolian", rsid: "rs10488631", gene: "Unknown", trait: "Anatolian Ancestry Marker", continent: "Middle Eastern", subpop: "Anatolian", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Anatolian populations.", frequencies: {"AFR":0.01,"AMR":0.01,"EAS":0.01,"EUR":0.45,"SAS":0.15,"MENA":0.85} },
  { markerId: "rs10488632_Anatolian", rsid: "rs10488632", gene: "Unknown", trait: "Anatolian Ancestry Marker", continent: "Middle Eastern", subpop: "Anatolian", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Anatolian populations.", frequencies: {"AFR":0.01,"AMR":0.01,"EAS":0.01,"EUR":0.4,"SAS":0.12,"MENA":0.88} },
  { markerId: "rs10488633_Anatolian", rsid: "rs10488633", gene: "Unknown", trait: "Anatolian Ancestry Marker", continent: "Middle Eastern", subpop: "Anatolian", alleles: ["G"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Anatolian populations.", frequencies: {"AFR":0.01,"AMR":0.01,"EAS":0.01,"EUR":0.38,"SAS":0.1,"MENA":0.9} },
  { markerId: "rs10488634_Anatolian", rsid: "rs10488634", gene: "Unknown", trait: "Anatolian Ancestry Marker", continent: "Middle Eastern", subpop: "Anatolian", alleles: ["C"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Anatolian populations.", frequencies: {"AFR":0.01,"AMR":0.01,"EAS":0.01,"EUR":0.35,"SAS":0.08,"MENA":0.92} },
  { markerId: "rs10488635_Anatolian", rsid: "rs10488635", gene: "Unknown", trait: "Anatolian Ancestry Marker", continent: "Middle Eastern", subpop: "Anatolian", alleles: ["T"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Anatolian populations.", frequencies: {"AFR":0.01,"AMR":0.01,"EAS":0.01,"EUR":0.32,"SAS":0.06,"MENA":0.94} },
  { markerId: "rs10456272_Anatolian", rsid: "rs10456272", gene: "Unknown", trait: "Anatolian Ancestry Marker", continent: "Middle Eastern", subpop: "Anatolian", alleles: ["T"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Anatolian populations (Turkey).", frequencies: {"AFR":0.02,"AMR":0.02,"EAS":0.05,"EUR":0.45,"SAS":0.05,"MENA":0.9} },
  { markerId: "rs10456279_Anatolian_2", rsid: "rs10456279", gene: "Unknown", trait: "Anatolian Ancestry Marker", continent: "Middle Eastern", subpop: "Anatolian", alleles: ["G"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Anatolian populations.", frequencies: {"AFR":0.02,"AMR":0.02,"EAS":0.05,"EUR":0.4,"SAS":0.05,"MENA":0.92} },
  { markerId: "rs9999901_Arabian", rsid: "rs9999901", gene: "Unknown", trait: "Arabian Ancestry Marker", continent: "Middle Eastern", subpop: "Arabian", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Arabian populations.", frequencies: {"AFR":0.1,"AMR":0.05,"EAS":0.02,"EUR":0.2,"SAS":0.1,"MENA":0.95} },
  { markerId: "rs9999904_Arabian", rsid: "rs9999904", gene: "Unknown", trait: "Arabian Ancestry Marker", continent: "Middle Eastern", subpop: "Arabian", alleles: ["T"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Arabian populations.", frequencies: {"AFR":0.15,"AMR":0.03,"EAS":0.01,"EUR":0.25,"SAS":0.08,"MENA":0.9} },
  { markerId: "rs10407228_Arabian", rsid: "rs10407228", gene: "Unknown", trait: "Arabian Ancestry Marker", continent: "Middle Eastern", subpop: "Arabian", alleles: ["C"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Arabian populations.", frequencies: {"AFR":0.22,"AMR":0.08,"EAS":0.06,"EUR":0.32,"SAS":0.28,"MENA":0.9} },
  { markerId: "rs1393350_Arabian", rsid: "rs1393350", gene: "Unknown", trait: "Arabian Ancestry Marker", continent: "Middle Eastern", subpop: "Arabian", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Arabian populations.", frequencies: {"AFR":0.12,"AMR":0.03,"EAS":0.02,"EUR":0.28,"SAS":0.18,"MENA":0.94} },
  { markerId: "rs1393351_Arabian", rsid: "rs1393351", gene: "Unknown", trait: "Arabian Ancestry Marker", continent: "Middle Eastern", subpop: "Arabian", alleles: ["G"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Arabian populations.", frequencies: {"AFR":0.1,"AMR":0.02,"EAS":0.01,"EUR":0.25,"SAS":0.15,"MENA":0.92} },
  { markerId: "rs10407229_Arabian", rsid: "rs10407229", gene: "Unknown", trait: "Arabian Ancestry Marker", continent: "Middle Eastern", subpop: "Arabian", alleles: ["T"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Arabian populations.", frequencies: {"AFR":0.2,"AMR":0.06,"EAS":0.04,"EUR":0.3,"SAS":0.25,"MENA":0.88} },
  { markerId: "rs1393352_Arabian", rsid: "rs1393352", gene: "Unknown", trait: "Arabian Ancestry Marker", continent: "Middle Eastern", subpop: "Arabian", alleles: ["T"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Arabian populations.", frequencies: {"AFR":0.08,"AMR":0.02,"EAS":0.01,"EUR":0.2,"SAS":0.12,"MENA":0.9} },
  { markerId: "rs10407230_Arabian", rsid: "rs10407230", gene: "Unknown", trait: "Arabian Ancestry Marker", continent: "Middle Eastern", subpop: "Arabian", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Arabian populations.", frequencies: {"AFR":0.15,"AMR":0.05,"EAS":0.03,"EUR":0.25,"SAS":0.2,"MENA":0.85} },
  { markerId: "rs1393358_Arabian", rsid: "rs1393358", gene: "Unknown", trait: "Arabian Ancestry Marker", continent: "Middle Eastern", subpop: "Arabian", alleles: ["T"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Arabian populations.", frequencies: {"AFR":0.03,"AMR":0.01,"EAS":0.01,"EUR":0.06,"SAS":0.05,"MENA":0.75} },
  { markerId: "rs10407235_Arabian", rsid: "rs10407235", gene: "Unknown", trait: "Arabian Ancestry Marker", continent: "Middle Eastern", subpop: "Arabian", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Arabian populations.", frequencies: {"AFR":0.05,"AMR":0.02,"EAS":0.01,"EUR":0.1,"SAS":0.07,"MENA":0.72} },
  { markerId: "rs1393359_Arabian", rsid: "rs1393359", gene: "Unknown", trait: "Arabian Ancestry Marker", continent: "Middle Eastern", subpop: "Arabian", alleles: ["G"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Arabian populations.", frequencies: {"AFR":0.02,"AMR":0.01,"EAS":0.01,"EUR":0.05,"SAS":0.04,"MENA":0.78} },
  { markerId: "rs10407236_Arabian", rsid: "rs10407236", gene: "Unknown", trait: "Arabian Ancestry Marker", continent: "Middle Eastern", subpop: "Arabian", alleles: ["T"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Arabian populations.", frequencies: {"AFR":0.04,"AMR":0.01,"EAS":0.01,"EUR":0.08,"SAS":0.06,"MENA":0.75} },
  { markerId: "rs1393360_Arabian", rsid: "rs1393360", gene: "Unknown", trait: "Arabian Ancestry Marker", continent: "Middle Eastern", subpop: "Arabian", alleles: ["C"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Arabian populations.", frequencies: {"AFR":0.01,"AMR":0.01,"EAS":0.01,"EUR":0.04,"SAS":0.03,"MENA":0.8} },
  { markerId: "rs10407237_Arabian", rsid: "rs10407237", gene: "Unknown", trait: "Arabian Ancestry Marker", continent: "Middle Eastern", subpop: "Arabian", alleles: ["G"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Arabian populations.", frequencies: {"AFR":0.03,"AMR":0.01,"EAS":0.01,"EUR":0.06,"SAS":0.05,"MENA":0.78} },
  { markerId: "rs1393361_Arabian", rsid: "rs1393361", gene: "Unknown", trait: "Arabian Ancestry Marker", continent: "Middle Eastern", subpop: "Arabian", alleles: ["T"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Arabian populations.", frequencies: {"AFR":0.01,"AMR":0.01,"EAS":0.01,"EUR":0.03,"SAS":0.02,"MENA":0.82} },
  { markerId: "rs10407238_Arabian", rsid: "rs10407238", gene: "Unknown", trait: "Arabian Ancestry Marker", continent: "Middle Eastern", subpop: "Arabian", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Arabian populations.", frequencies: {"AFR":0.02,"AMR":0.01,"EAS":0.01,"EUR":0.05,"SAS":0.04,"MENA":0.8} },
  { markerId: "rs1393362_Arabian", rsid: "rs1393362", gene: "Unknown", trait: "Arabian Ancestry Marker", continent: "Middle Eastern", subpop: "Arabian", alleles: ["C"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Arabian populations.", frequencies: {"AFR":0.01,"AMR":0.01,"EAS":0.01,"EUR":0.02,"SAS":0.01,"MENA":0.85} },
  { markerId: "rs10407239_Arabian", rsid: "rs10407239", gene: "Unknown", trait: "Arabian Ancestry Marker", continent: "Middle Eastern", subpop: "Arabian", alleles: ["G"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Arabian populations.", frequencies: {"AFR":0.01,"AMR":0.01,"EAS":0.01,"EUR":0.04,"SAS":0.03,"MENA":0.82} },
  { markerId: "rs1393353_Arabian", rsid: "rs1393353", gene: "Unknown", trait: "Arabian Ancestry Marker", continent: "Middle Eastern", subpop: "Arabian", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Arabian populations.", frequencies: {"AFR":0.05,"AMR":0.02,"EAS":0.01,"EUR":0.15,"SAS":0.08,"MENA":0.88} },
  { markerId: "rs10407231_Arabian", rsid: "rs10407231", gene: "Unknown", trait: "Arabian Ancestry Marker", continent: "Middle Eastern", subpop: "Arabian", alleles: ["G"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Arabian populations.", frequencies: {"AFR":0.1,"AMR":0.03,"EAS":0.02,"EUR":0.2,"SAS":0.12,"MENA":0.85} },
  { markerId: "rs1393355_Arabian", rsid: "rs1393355", gene: "Unknown", trait: "Arabian Ancestry Marker", continent: "Middle Eastern", subpop: "Arabian", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Arabian populations.", frequencies: {"AFR":0.04,"AMR":0.01,"EAS":0.01,"EUR":0.12,"SAS":0.06,"MENA":0.9} },
  { markerId: "rs1333049_Arabian", rsid: "rs1333049", gene: "Unknown", trait: "Arabian Ancestry Marker", continent: "Middle Eastern", subpop: "Arabian", alleles: ["G"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Arabian populations.", frequencies: {"AFR":0.02,"AMR":0.01,"EAS":0.01,"EUR":0.08,"SAS":0.04,"MENA":0.92} },
  { markerId: "rs1333047_Arabian", rsid: "rs1333047", gene: "Unknown", trait: "Arabian Ancestry Marker", continent: "Middle Eastern", subpop: "Arabian", alleles: ["T"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Arabian populations.", frequencies: {"AFR":0.01,"AMR":0.01,"EAS":0.01,"EUR":0.08,"SAS":0.04,"MENA":0.94} },
  { markerId: "rs6601495_Arabian", rsid: "rs6601495", gene: "Unknown", trait: "Arabian Ancestry Marker", continent: "Middle Eastern", subpop: "Arabian", alleles: ["G"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Arabian populations.", frequencies: {"AFR":0.08,"AMR":0.03,"EAS":0.01,"EUR":0.2,"SAS":0.12,"MENA":0.96} },
  { markerId: "L858", rsid: "rs35268486", gene: "Y-DNA", trait: "Haplogroup J1a1a1", continent: "Middle Eastern", subpop: "Arabian", alleles: ["T"], significance: "High", category: "Ancestry", description: "Defining marker for the Arabian branch of J1." },
  { markerId: "rs1333048_Armenian", rsid: "rs1333048", gene: "Unknown", trait: "Armenian Ancestry Marker", continent: "Middle Eastern", subpop: "Armenian", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Armenian populations.", frequencies: {"AFR":0.01,"AMR":0.01,"EAS":0.01,"EUR":0.4,"SAS":0.1,"MENA":0.95} },
  { markerId: "rs10456206_Assyrian", rsid: "rs10456206", gene: "Unknown", trait: "Assyrian Ancestry Marker", continent: "Middle Eastern", subpop: "Assyrian", alleles: ["G"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Assyrian populations.", frequencies: {"AFR":0.01,"AMR":0.01,"EAS":0.01,"EUR":0.45,"SAS":0.15,"MENA":0.95} },
  { markerId: "rs10456209_Assyrian", rsid: "rs10456209", gene: "Unknown", trait: "Assyrian Ancestry Marker", continent: "Middle Eastern", subpop: "Assyrian", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Assyrian populations.", frequencies: {"AFR":0.01,"AMR":0.01,"EAS":0.01,"EUR":0.42,"SAS":0.12,"MENA":0.96} },
  { markerId: "rs10456212_Assyrian", rsid: "rs10456212", gene: "Unknown", trait: "Assyrian Ancestry Marker", continent: "Middle Eastern", subpop: "Assyrian", alleles: ["C"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Assyrian populations.", frequencies: {"AFR":0.01,"AMR":0.01,"EAS":0.01,"EUR":0.4,"SAS":0.1,"MENA":0.94} },
  { markerId: "rs10456206_Bedouin", rsid: "rs10456206", gene: "Unknown", trait: "Bedouin Ancestry Marker", continent: "Middle Eastern", subpop: "Bedouin", alleles: ["G"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Bedouin populations.", frequencies: {"AFR":0.15,"AMR":0.02,"EAS":0.01,"EUR":0.05,"SAS":0.05,"MENA":0.98} },
  { markerId: "rs10456209_Bedouin", rsid: "rs10456209", gene: "Unknown", trait: "Bedouin Ancestry Marker", continent: "Middle Eastern", subpop: "Bedouin", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Bedouin populations.", frequencies: {"AFR":0.12,"AMR":0.01,"EAS":0.01,"EUR":0.04,"SAS":0.04,"MENA":0.99} },
  { markerId: "rs10456212_Bedouin", rsid: "rs10456212", gene: "Unknown", trait: "Bedouin Ancestry Marker", continent: "Middle Eastern", subpop: "Bedouin", alleles: ["C"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Bedouin populations.", frequencies: {"AFR":0.1,"AMR":0.01,"EAS":0.01,"EUR":0.03,"SAS":0.03,"MENA":0.97} },
  { markerId: "rs10456208_Druze", rsid: "rs10456208", gene: "Unknown", trait: "Druze Ancestry Marker", continent: "Middle Eastern", subpop: "Druze", alleles: ["C"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Druze populations.", frequencies: {"AFR":0.01,"AMR":0.01,"EAS":0.01,"EUR":0.4,"SAS":0.1,"MENA":0.98} },
  { markerId: "rs10456211_Druze", rsid: "rs10456211", gene: "Unknown", trait: "Druze Ancestry Marker", continent: "Middle Eastern", subpop: "Druze", alleles: ["T"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Druze populations.", frequencies: {"AFR":0.01,"AMR":0.01,"EAS":0.01,"EUR":0.38,"SAS":0.08,"MENA":0.99} },
  { markerId: "rs10456214_Druze", rsid: "rs10456214", gene: "Unknown", trait: "Druze Ancestry Marker", continent: "Middle Eastern", subpop: "Druze", alleles: ["G"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Druze populations.", frequencies: {"AFR":0.01,"AMR":0.01,"EAS":0.01,"EUR":0.35,"SAS":0.06,"MENA":0.97} },
  { markerId: "rs1333047_Emirati", rsid: "rs1333047", gene: "Unknown", trait: "Emirati Ancestry Marker", continent: "Middle Eastern", subpop: "Emirati", alleles: ["T"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Emirati populations.", frequencies: {"AFR":0.1,"AMR":0.05,"EAS":0.01,"EUR":0.12,"SAS":0.16,"MENA":0.95} },
  { markerId: "rs11103332_Georgian", rsid: "rs11103332", gene: "Unknown", trait: "Georgian Ancestry Marker", continent: "Middle Eastern", subpop: "Georgian", alleles: ["C"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Georgian populations.", frequencies: {"AFR":0.01,"AMR":0.01,"EAS":0.01,"EUR":0.45,"SAS":0.05,"MENA":0.98} },
  { markerId: "rs9000314_Iranian", rsid: "rs9000314", gene: "Unknown", trait: "Iranian Ancestry Marker", continent: "Middle Eastern", subpop: "Iranian", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Iranian populations.", frequencies: {"AFR":0.02,"AMR":0.02,"EAS":0.05,"EUR":0.3,"SAS":0.35,"MENA":0.85} },
  { markerId: "rs9000315_Iranian", rsid: "rs9000315", gene: "Unknown", trait: "Iranian Ancestry Marker", continent: "Middle Eastern", subpop: "Iranian", alleles: ["G"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Iranian populations.", frequencies: {"AFR":0.01,"AMR":0.01,"EAS":0.04,"EUR":0.25,"SAS":0.3,"MENA":0.88} },
  { markerId: "rs11103333_Iranian", rsid: "rs11103333", gene: "Unknown", trait: "Iranian Ancestry Marker", continent: "Middle Eastern", subpop: "Iranian", alleles: ["G"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Iranian populations.", frequencies: {"AFR":0.02,"AMR":0.02,"EAS":0.05,"EUR":0.3,"SAS":0.35,"MENA":0.88} },
  { markerId: "rs10456274_Iranian", rsid: "rs10456274", gene: "Unknown", trait: "Iranian Ancestry Marker", continent: "Middle Eastern", subpop: "Iranian", alleles: ["G"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Iranian populations.", frequencies: {"AFR":0.01,"AMR":0.01,"EAS":0.05,"EUR":0.25,"SAS":0.25,"MENA":0.92} },
  { markerId: "rs10456282_Iranian_3", rsid: "rs10456282", gene: "Unknown", trait: "Iranian Ancestry Marker", continent: "Middle Eastern", subpop: "Iranian", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Iranian populations.", frequencies: {"AFR":0.01,"AMR":0.01,"EAS":0.05,"EUR":0.2,"SAS":0.3,"MENA":0.95} },
  { markerId: "rs9000328_Iraqi", rsid: "rs9000328", gene: "Unknown", trait: "Iraqi Ancestry Marker", continent: "Middle Eastern", subpop: "Iraqi", alleles: ["C"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Iraqi populations.", frequencies: {"AFR":0.05,"AMR":0.03,"EAS":0.02,"EUR":0.3,"SAS":0.2,"MENA":0.85} },
  { markerId: "rs9000329_Iraqi", rsid: "rs9000329", gene: "Unknown", trait: "Iraqi Ancestry Marker", continent: "Middle Eastern", subpop: "Iraqi", alleles: ["T"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Iraqi populations.", frequencies: {"AFR":0.03,"AMR":0.02,"EAS":0.01,"EUR":0.25,"SAS":0.15,"MENA":0.88} },
  { markerId: "rs9000332_Jordanian", rsid: "rs9000332", gene: "Unknown", trait: "Jordanian Ancestry Marker", continent: "Middle Eastern", subpop: "Jordanian", alleles: ["C"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Jordanian populations.", frequencies: {"AFR":0.06,"AMR":0.03,"EAS":0.02,"EUR":0.32,"SAS":0.12,"MENA":0.88} },
  { markerId: "rs9000333_Jordanian", rsid: "rs9000333", gene: "Unknown", trait: "Jordanian Ancestry Marker", continent: "Middle Eastern", subpop: "Jordanian", alleles: ["T"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Jordanian populations.", frequencies: {"AFR":0.04,"AMR":0.02,"EAS":0.01,"EUR":0.28,"SAS":0.1,"MENA":0.9} },
  { markerId: "rs10757279_Jordanian", rsid: "rs10757279", gene: "Unknown", trait: "Jordanian Ancestry Marker", continent: "Middle Eastern", subpop: "Jordanian", alleles: ["G"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Jordanian populations.", frequencies: {"AFR":0.04,"AMR":0.05,"EAS":0.01,"EUR":0.22,"SAS":0.14,"MENA":0.91} },
  { markerId: "rs10757274_Kurdish", rsid: "rs10757274", gene: "Unknown", trait: "Kurdish Ancestry Marker", continent: "Middle Eastern", subpop: "Kurdish", alleles: ["T"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Kurdish populations.", frequencies: {"AFR":0.01,"AMR":0.01,"EAS":0.02,"EUR":0.35,"SAS":0.3,"MENA":0.9} },
  { markerId: "rs10456277_Kurdish", rsid: "rs10456277", gene: "Unknown", trait: "Kurdish Ancestry Marker", continent: "Middle Eastern", subpop: "Kurdish", alleles: ["C"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Kurdish populations.", frequencies: {"AFR":0.02,"AMR":0.01,"EAS":0.02,"EUR":0.3,"SAS":0.2,"MENA":0.94} },
  { markerId: "rs10757279_Lebanese", rsid: "rs10757279", gene: "Unknown", trait: "Lebanese Ancestry Marker", continent: "Middle Eastern", subpop: "Lebanese", alleles: ["G"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Lebanese populations.", frequencies: {"AFR":0.02,"AMR":0.05,"EAS":0.01,"EUR":0.3,"SAS":0.1,"MENA":0.95} },
  { markerId: "L26", rsid: "rs34459394", gene: "Y-DNA", trait: "Haplogroup J2a1", continent: "Middle Eastern", subpop: "Levantine", alleles: ["G"], significance: "High", category: "Ancestry", description: "Defining marker for the Levantine/Anatolian branch of J2." },
  { markerId: "rs9999902_Levantine", rsid: "rs9999902", gene: "Unknown", trait: "Levantine Ancestry Marker", continent: "Middle Eastern", subpop: "Levantine", alleles: ["G"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Levantine populations.", frequencies: {"AFR":0.05,"AMR":0.02,"EAS":0.01,"EUR":0.3,"SAS":0.05,"MENA":0.98} },
  { markerId: "rs9999905_Levantine", rsid: "rs9999905", gene: "Unknown", trait: "Levantine Ancestry Marker", continent: "Middle Eastern", subpop: "Levantine", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Levantine populations.", frequencies: {"AFR":0.08,"AMR":0.02,"EAS":0.01,"EUR":0.35,"SAS":0.05,"MENA":0.96} },
  { markerId: "rs11215545_Levantine", rsid: "rs11215545", gene: "Unknown", trait: "Levantine Ancestry Marker", continent: "Middle Eastern", subpop: "Levantine", alleles: ["T"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Levantine populations.", frequencies: {"AFR":0.15,"AMR":0.05,"EAS":0.02,"EUR":0.35,"SAS":0.2,"MENA":0.98} },
  { markerId: "rs11215546_Levantine", rsid: "rs11215546", gene: "Unknown", trait: "Levantine Ancestry Marker", continent: "Middle Eastern", subpop: "Levantine", alleles: ["C"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Levantine populations.", frequencies: {"AFR":0.1,"AMR":0.04,"EAS":0.01,"EUR":0.3,"SAS":0.15,"MENA":0.96} },
  { markerId: "rs1800409_Levantine", rsid: "rs1800409", gene: "Unknown", trait: "Levantine Ancestry Marker", continent: "Middle Eastern", subpop: "Levantine", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Levantine populations.", frequencies: {"AFR":0.1,"AMR":0.05,"EAS":0.02,"EUR":0.4,"SAS":0.2,"MENA":0.85} },
  { markerId: "rs11215547_Levantine", rsid: "rs11215547", gene: "Unknown", trait: "Levantine Ancestry Marker", continent: "Middle Eastern", subpop: "Levantine", alleles: ["G"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Levantine populations.", frequencies: {"AFR":0.08,"AMR":0.03,"EAS":0.01,"EUR":0.25,"SAS":0.12,"MENA":0.94} },
  { markerId: "rs1800415_Levantine", rsid: "rs1800415", gene: "Unknown", trait: "Levantine Ancestry Marker", continent: "Middle Eastern", subpop: "Levantine", alleles: ["C"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Levantine populations.", frequencies: {"AFR":0.05,"AMR":0.02,"EAS":0.01,"EUR":0.2,"SAS":0.08,"MENA":0.7} },
  { markerId: "rs11215554_Levantine", rsid: "rs11215554", gene: "Unknown", trait: "Levantine Ancestry Marker", continent: "Middle Eastern", subpop: "Levantine", alleles: ["G"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Levantine populations.", frequencies: {"AFR":0.03,"AMR":0.01,"EAS":0.01,"EUR":0.1,"SAS":0.05,"MENA":0.8} },
  { markerId: "rs1800416_Levantine", rsid: "rs1800416", gene: "Unknown", trait: "Levantine Ancestry Marker", continent: "Middle Eastern", subpop: "Levantine", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Levantine populations.", frequencies: {"AFR":0.04,"AMR":0.01,"EAS":0.01,"EUR":0.15,"SAS":0.06,"MENA":0.72} },
  { markerId: "rs11215555_Levantine", rsid: "rs11215555", gene: "Unknown", trait: "Levantine Ancestry Marker", continent: "Middle Eastern", subpop: "Levantine", alleles: ["C"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Levantine populations.", frequencies: {"AFR":0.02,"AMR":0.01,"EAS":0.01,"EUR":0.08,"SAS":0.04,"MENA":0.82} },
  { markerId: "rs1800417_Levantine", rsid: "rs1800417", gene: "Unknown", trait: "Levantine Ancestry Marker", continent: "Middle Eastern", subpop: "Levantine", alleles: ["G"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Levantine populations.", frequencies: {"AFR":0.03,"AMR":0.01,"EAS":0.01,"EUR":0.12,"SAS":0.05,"MENA":0.75} },
  { markerId: "rs11215556_Levantine", rsid: "rs11215556", gene: "Unknown", trait: "Levantine Ancestry Marker", continent: "Middle Eastern", subpop: "Levantine", alleles: ["T"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Levantine populations.", frequencies: {"AFR":0.01,"AMR":0.01,"EAS":0.01,"EUR":0.06,"SAS":0.03,"MENA":0.85} },
  { markerId: "rs1800418_Levantine", rsid: "rs1800418", gene: "Unknown", trait: "Levantine Ancestry Marker", continent: "Middle Eastern", subpop: "Levantine", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Levantine populations.", frequencies: {"AFR":0.02,"AMR":0.01,"EAS":0.01,"EUR":0.1,"SAS":0.04,"MENA":0.78} },
  { markerId: "rs11215557_Levantine", rsid: "rs11215557", gene: "Unknown", trait: "Levantine Ancestry Marker", continent: "Middle Eastern", subpop: "Levantine", alleles: ["G"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Levantine populations.", frequencies: {"AFR":0.01,"AMR":0.01,"EAS":0.01,"EUR":0.05,"SAS":0.02,"MENA":0.88} },
  { markerId: "rs1800419_Levantine", rsid: "rs1800419", gene: "Unknown", trait: "Levantine Ancestry Marker", continent: "Middle Eastern", subpop: "Levantine", alleles: ["T"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Levantine populations.", frequencies: {"AFR":0.01,"AMR":0.01,"EAS":0.01,"EUR":0.08,"SAS":0.03,"MENA":0.8} },
  { markerId: "rs11215558_Levantine", rsid: "rs11215558", gene: "Unknown", trait: "Levantine Ancestry Marker", continent: "Middle Eastern", subpop: "Levantine", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Levantine populations.", frequencies: {"AFR":0.01,"AMR":0.01,"EAS":0.01,"EUR":0.04,"SAS":0.01,"MENA":0.9} },
  { markerId: "rs1800410_Levantine", rsid: "rs1800410", gene: "Unknown", trait: "Levantine Ancestry Marker", continent: "Middle Eastern", subpop: "Levantine", alleles: ["T"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Levantine populations.", frequencies: {"AFR":0.08,"AMR":0.04,"EAS":0.01,"EUR":0.35,"SAS":0.15,"MENA":0.82} },
  { markerId: "rs1800411_Levantine", rsid: "rs1800411", gene: "Unknown", trait: "Levantine Ancestry Marker", continent: "Middle Eastern", subpop: "Levantine", alleles: ["G"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Levantine populations.", frequencies: {"AFR":0.05,"AMR":0.02,"EAS":0.01,"EUR":0.25,"SAS":0.1,"MENA":0.88} },
  { markerId: "rs11215550_Levantine", rsid: "rs11215550", gene: "Unknown", trait: "Levantine Ancestry Marker", continent: "Middle Eastern", subpop: "Levantine", alleles: ["T"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Levantine populations.", frequencies: {"AFR":0.03,"AMR":0.01,"EAS":0.01,"EUR":0.15,"SAS":0.05,"MENA":0.92} },
  { markerId: "rs10757278_Levantine", rsid: "rs10757278", gene: "Unknown", trait: "Levantine Ancestry Marker", continent: "Middle Eastern", subpop: "Levantine", alleles: ["C"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Levantine populations.", frequencies: {"AFR":0.02,"AMR":0.01,"EAS":0.01,"EUR":0.1,"SAS":0.04,"MENA":0.95} },
  { markerId: "rs10757279_Levantine", rsid: "rs10757279", gene: "Unknown", trait: "Levantine Ancestry Marker", continent: "Middle Eastern", subpop: "Levantine", alleles: ["G"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Levantine populations.", frequencies: {"AFR":0.01,"AMR":0.01,"EAS":0.01,"EUR":0.12,"SAS":0.05,"MENA":0.96} },
  { markerId: "rs12186491_Levantine", rsid: "rs12186491", gene: "Unknown", trait: "Levantine Ancestry Marker", continent: "Middle Eastern", subpop: "Levantine", alleles: ["C"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Levantine populations.", frequencies: {"AFR":0.05,"AMR":0.02,"EAS":0.01,"EUR":0.3,"SAS":0.1,"MENA":0.98} },
  { markerId: "rs10456273_Levantine", rsid: "rs10456273", gene: "Unknown", trait: "Levantine Ancestry Marker", continent: "Middle Eastern", subpop: "Levantine", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Levantine populations.", frequencies: {"AFR":0.05,"AMR":0.02,"EAS":0.01,"EUR":0.35,"SAS":0.05,"MENA":0.95} },
  { markerId: "rs10456280_Levantine_2", rsid: "rs10456280", gene: "Unknown", trait: "Levantine Ancestry Marker", continent: "Middle Eastern", subpop: "Levantine", alleles: ["C"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Levantine populations.", frequencies: {"AFR":0.04,"AMR":0.02,"EAS":0.01,"EUR":0.3,"SAS":0.05,"MENA":0.96} },
  { markerId: "rs10456271_Mizrahi", rsid: "rs10456271", gene: "Unknown", trait: "Mizrahi Ancestry Marker", continent: "Middle Eastern", subpop: "Mizrahi", alleles: ["C"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Mizrahi Jewish populations.", frequencies: {"AFR":0.03,"AMR":0.02,"EAS":0.01,"EUR":0.2,"SAS":0.04,"MENA":0.7} },
  { markerId: "rs1333047_Omani", rsid: "rs1333047", gene: "Unknown", trait: "Omani Ancestry Marker", continent: "Middle Eastern", subpop: "Omani", alleles: ["T"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Omani populations.", frequencies: {"AFR":0.12,"AMR":0.05,"EAS":0.01,"EUR":0.08,"SAS":0.18,"MENA":0.94} },
  { markerId: "rs10757279_Palestinian", rsid: "rs10757279", gene: "Unknown", trait: "Palestinian Ancestry Marker", continent: "Middle Eastern", subpop: "Palestinian", alleles: ["G"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Palestinian populations.", frequencies: {"AFR":0.05,"AMR":0.05,"EAS":0.01,"EUR":0.2,"SAS":0.15,"MENA":0.9} },
  { markerId: "rs11103333_Persian", rsid: "rs11103333", gene: "Unknown", trait: "Persian Ancestry Marker", continent: "Middle Eastern", subpop: "Persian", alleles: ["G"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Persian populations.", frequencies: {"AFR":0.02,"AMR":0.02,"EAS":0.05,"EUR":0.3,"SAS":0.4,"MENA":0.82} },
  { markerId: "rs11103334_Persian", rsid: "rs11103334", gene: "Unknown", trait: "Persian Ancestry Marker", continent: "Middle Eastern", subpop: "Persian", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Persian populations.", frequencies: {"AFR":0.01,"AMR":0.01,"EAS":0.04,"EUR":0.28,"SAS":0.38,"MENA":0.85} },
  { markerId: "rs11103335_Persian", rsid: "rs11103335", gene: "Unknown", trait: "Persian Ancestry Marker", continent: "Middle Eastern", subpop: "Persian", alleles: ["G"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Persian populations.", frequencies: {"AFR":0.01,"AMR":0.01,"EAS":0.03,"EUR":0.25,"SAS":0.35,"MENA":0.88} },
  { markerId: "rs11103336_Persian", rsid: "rs11103336", gene: "Unknown", trait: "Persian Ancestry Marker", continent: "Middle Eastern", subpop: "Persian", alleles: ["C"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Persian populations.", frequencies: {"AFR":0.01,"AMR":0.01,"EAS":0.02,"EUR":0.22,"SAS":0.32,"MENA":0.9} },
  { markerId: "rs11103337_Persian", rsid: "rs11103337", gene: "Unknown", trait: "Persian Ancestry Marker", continent: "Middle Eastern", subpop: "Persian", alleles: ["T"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Persian populations.", frequencies: {"AFR":0.01,"AMR":0.01,"EAS":0.01,"EUR":0.2,"SAS":0.3,"MENA":0.92} },
  { markerId: "rs10456278_Persian_2", rsid: "rs10456278", gene: "Unknown", trait: "Persian Ancestry Marker", continent: "Middle Eastern", subpop: "Persian", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Persian populations.", frequencies: {"AFR":0.01,"AMR":0.01,"EAS":0.05,"EUR":0.2,"SAS":0.35,"MENA":0.95} },
  { markerId: "rs1333047_Saudi", rsid: "rs1333047", gene: "Unknown", trait: "Saudi Arabian Ancestry Marker", continent: "Middle Eastern", subpop: "Saudi", alleles: ["T"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Saudi Arabian populations.", frequencies: {"AFR":0.08,"AMR":0.05,"EAS":0.01,"EUR":0.1,"SAS":0.15,"MENA":0.96} },
  { markerId: "rs9000330_Syrian", rsid: "rs9000330", gene: "Unknown", trait: "Syrian Ancestry Marker", continent: "Middle Eastern", subpop: "Syrian", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Syrian populations.", frequencies: {"AFR":0.04,"AMR":0.02,"EAS":0.01,"EUR":0.35,"SAS":0.1,"MENA":0.9} },
  { markerId: "rs9000331_Syrian", rsid: "rs9000331", gene: "Unknown", trait: "Syrian Ancestry Marker", continent: "Middle Eastern", subpop: "Syrian", alleles: ["G"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Syrian populations.", frequencies: {"AFR":0.02,"AMR":0.01,"EAS":0.01,"EUR":0.3,"SAS":0.08,"MENA":0.92} },
  { markerId: "rs10757279_Syrian", rsid: "rs10757279", gene: "Unknown", trait: "Syrian Ancestry Marker", continent: "Middle Eastern", subpop: "Syrian", alleles: ["G"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Syrian populations.", frequencies: {"AFR":0.03,"AMR":0.05,"EAS":0.01,"EUR":0.25,"SAS":0.12,"MENA":0.92} },
  { markerId: "rs9000316_Turkish", rsid: "rs9000316", gene: "Unknown", trait: "Turkish Ancestry Marker", continent: "Middle Eastern", subpop: "Turkish", alleles: ["C"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Turkish populations.", frequencies: {"AFR":0.01,"AMR":0.01,"EAS":0.02,"EUR":0.45,"SAS":0.15,"MENA":0.82} },
  { markerId: "rs9000317_Turkish", rsid: "rs9000317", gene: "Unknown", trait: "Turkish Ancestry Marker", continent: "Middle Eastern", subpop: "Turkish", alleles: ["T"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Turkish populations.", frequencies: {"AFR":0.01,"AMR":0.01,"EAS":0.01,"EUR":0.4,"SAS":0.12,"MENA":0.85} },
  { markerId: "rs10488631_Turkish", rsid: "rs10488631", gene: "Unknown", trait: "Turkish Ancestry Marker", continent: "Middle Eastern", subpop: "Turkish", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Turkish populations.", frequencies: {"AFR":0.01,"AMR":0.01,"EAS":0.05,"EUR":0.45,"SAS":0.15,"MENA":0.85} },
  { markerId: "rs10757274_WestAsian", rsid: "rs10757274", gene: "Unknown", trait: "West Asian Ancestry Marker", continent: "Middle Eastern", subpop: "West Asian", alleles: ["T"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for West Asian populations.", frequencies: {"AFR":0.01,"AMR":0.01,"EAS":0.02,"EUR":0.4,"SAS":0.25,"MENA":0.88} },
  { markerId: "rs1333048_WestAsian", rsid: "rs1333048", gene: "Unknown", trait: "West Asian Ancestry Marker", continent: "Middle Eastern", subpop: "West Asian", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for West Asian populations.", frequencies: {"AFR":0.01,"AMR":0.01,"EAS":0.01,"EUR":0.35,"SAS":0.2,"MENA":0.9} },
  { markerId: "rs11103332_WestAsian", rsid: "rs11103332", gene: "Unknown", trait: "West Asian Ancestry Marker", continent: "Middle Eastern", subpop: "West Asian", alleles: ["C"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for West Asian populations.", frequencies: {"AFR":0.01,"AMR":0.01,"EAS":0.01,"EUR":0.3,"SAS":0.15,"MENA":0.92} },
  { markerId: "rs10757275_WestAsian", rsid: "rs10757275", gene: "Unknown", trait: "West Asian Ancestry Marker", continent: "Middle Eastern", subpop: "West Asian", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for West Asian populations.", frequencies: {"AFR":0.01,"AMR":0.01,"EAS":0.01,"EUR":0.38,"SAS":0.22,"MENA":0.9} },
  { markerId: "rs10757276_WestAsian", rsid: "rs10757276", gene: "Unknown", trait: "West Asian Ancestry Marker", continent: "Middle Eastern", subpop: "West Asian", alleles: ["G"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for West Asian populations.", frequencies: {"AFR":0.01,"AMR":0.01,"EAS":0.01,"EUR":0.35,"SAS":0.2,"MENA":0.92} },
  { markerId: "rs10456284_West_Asian_4", rsid: "rs10456284", gene: "Unknown", trait: "West Asian Ancestry Marker", continent: "Middle Eastern", subpop: "West Asian", alleles: ["G"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for West Asian populations.", frequencies: {"AFR":0.02,"AMR":0.02,"EAS":0.08,"EUR":0.3,"SAS":0.1,"MENA":0.94} },
  { markerId: "rs1426644_WestEurasian", rsid: "rs1426644", gene: "Unknown", trait: "West Eurasian Ancestry Marker", continent: "Middle Eastern", subpop: "West Eurasian", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for West Eurasian populations.", frequencies: {"AFR":0.01,"AMR":0.01,"EAS":0.01,"EUR":0.98,"SAS":0.85,"MENA":0.95} },
  { markerId: "rs1333047_Yemeni", rsid: "rs1333047", gene: "Unknown", trait: "Yemeni Ancestry Marker", continent: "Middle Eastern", subpop: "Yemeni", alleles: ["T"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Yemeni populations.", frequencies: {"AFR":0.15,"AMR":0.05,"EAS":0.01,"EUR":0.05,"SAS":0.2,"MENA":0.92} },
  { markerId: "M123", aliases: ["rs13304168","i4000007"], gene: "Y-DNA", trait: "Haplogroup E1b1b1c", continent: "Middle Eastern / African", category: "Ancestry", significance: "High", alleles: ["T","C"], description: "Defining marker for Haplogroup E1b1b1c." },
  { markerId: "M34", aliases: ["rs13304169"], gene: "Y-DNA", trait: "Haplogroup E1b1b1c1", continent: "Middle Eastern / African", category: "Ancestry", significance: "High", alleles: ["C"], description: "Defining marker for Haplogroup E1b1b1c1." },
  { markerId: "V68", aliases: ["rs34523368"], gene: "Y-DNA", trait: "Haplogroup E1b1b1f", continent: "Middle Eastern / African", category: "Ancestry", significance: "High", alleles: ["G"], description: "Defining marker for Haplogroup E1b1b1f." },
  { markerId: "V257", aliases: ["rs34623369"], gene: "Y-DNA", trait: "Haplogroup E1b1b1g", continent: "Middle Eastern / African", category: "Ancestry", significance: "High", alleles: ["A"], description: "Defining marker for Haplogroup E1b1b1g." },
  { markerId: "M184", aliases: ["i4000042"], gene: "Y-DNA", trait: "Haplogroup T", continent: "Middle Eastern / African", category: "Ancestry", significance: "High", alleles: ["T","C"], description: "Defining marker for Haplogroup T." },
  { markerId: "M70", gene: "Y-DNA", trait: "Haplogroup T1a", continent: "Middle Eastern / African / European", category: "Ancestry", significance: "High", alleles: ["T"], description: "Defining marker for Haplogroup T1a." },
  { markerId: "L791", gene: "Y-DNA", trait: "Haplogroup E-M123 subclade", continent: "Middle Eastern / European", category: "Ancestry", significance: "High", alleles: ["T"], description: "Subclade of M123 common among Ashkenazi Jews." },
  { markerId: "L791", gene: "Y-DNA", trait: "Haplogroup E1b1b1c1a", continent: "Middle Eastern / European", category: "Ancestry", significance: "High", alleles: ["G"], description: "Defining marker for Haplogroup E-L791 (Levantine/Jewish)." },
  { markerId: "P15", aliases: ["i4000049"], gene: "Y-DNA", trait: "Haplogroup G2a", continent: "Middle Eastern / European", category: "Ancestry", significance: "High", alleles: ["C"], description: "Defining marker for Haplogroup G2a, common in the Caucasus and early European farmers." },
  { markerId: "L26", gene: "Y-DNA", trait: "Haplogroup J2a1", continent: "Middle Eastern / European", category: "Ancestry", significance: "High", alleles: ["T"], description: "Defining marker for Haplogroup J2a1." },
  { markerId: "L558", gene: "Y-DNA", trait: "Haplogroup J2a1b1a", continent: "Middle Eastern / European", category: "Ancestry", significance: "High", alleles: ["C"], description: "Defining marker for Haplogroup J2-L558 (Greek/Anatolian)." },
  { markerId: "L24", gene: "Y-DNA", trait: "Haplogroup J2a1h", continent: "Middle Eastern / European", category: "Ancestry", significance: "High", alleles: ["T"], description: "Subclade of J2a common in the Mediterranean." },
  { markerId: "L25", gene: "Y-DNA", trait: "Haplogroup J2a1h1", continent: "Middle Eastern / European", category: "Ancestry", significance: "High", alleles: ["T"], description: "Subclade of J2a." },
  { markerId: "M12", gene: "Y-DNA", trait: "Haplogroup J2b", continent: "Middle Eastern / European", category: "Ancestry", significance: "High", alleles: ["T"], description: "Defining marker for Haplogroup J2b." },
  { markerId: "M205", gene: "Y-DNA", trait: "Haplogroup J2b1", continent: "Middle Eastern / European", category: "Ancestry", significance: "High", alleles: ["A"], description: "Defining marker for Haplogroup J2b1." },
  { markerId: "M241", gene: "Y-DNA", trait: "Haplogroup J2b2", continent: "Middle Eastern / European", category: "Ancestry", significance: "High", alleles: ["T"], description: "Defining marker for Haplogroup J2b2." },
  { markerId: "M317", gene: "Y-DNA", trait: "Haplogroup L1b", continent: "Middle Eastern / European", category: "Ancestry", significance: "High", alleles: ["T"], description: "Defining marker for Haplogroup L1b." },
  { markerId: "M25", gene: "Y-DNA", trait: "Haplogroup Q1a2", continent: "Middle Eastern / European", category: "Ancestry", significance: "High", alleles: ["T"], description: "Defining marker for Haplogroup Q1a2." },
  { markerId: "rs1042522", rsid: "rs1042522", gene: "TP53", trait: "Middle Eastern / European TP53 Variant", continent: "Middle Eastern / European", category: "Ancestry", significance: "Medium", alleles: ["C"], description: "A variant in the p53 tumor suppressor gene, found at varying frequencies in Middle Eastern and European populations.", referenceUrl: "https://www.snpedia.com/index.php/Rs1042522" },
  { markerId: "D9S1120", gene: "None", trait: "9-Repeat Allele at D9S1120", continent: "Native American", category: "Ancestry", significance: "High", alleles: ["9"], description: "Found in about a third of Native Americans and entirely absent from the rest of the world." },
  { markerId: "rs9282541", rsid: "rs9282541", gene: "ABCA1 R230C", trait: "ABCA1 R230C Variant", continent: "Native American", category: "Ancestry", significance: "High", alleles: ["C"], description: "This marker is nearly exclusive to people with Native American ancestry. It is found across North, Central, and South America rather than a single tribe.", referenceUrl: "https://www.snpedia.com/index.php/Rs9282541" },
  { markerId: "rs1229984_NA", rsid: "rs1229984", gene: "ADH1B", trait: "Ancestral ADH1B", continent: "Native American", category: "Ancestry", significance: "Medium", alleles: ["G"], description: "Native Americans typically carry the ancestral G allele for alcohol metabolism, contrasting with the derived A allele common in East Asia.", referenceUrl: "https://www.snpedia.com/index.php/Rs1229984" },
  { markerId: "rs671_NA", rsid: "rs671", gene: "ALDH2", trait: "Ancestral ALDH2", continent: "Native American", category: "Ancestry", significance: "Medium", alleles: ["G"], description: "Unlike many East Asian populations, Native Americans typically carry the ancestral G allele and do not experience the ALDH2 \"flush\" reaction.", referenceUrl: "https://www.snpedia.com/index.php/Rs671" },
  { markerId: "rs12913832_NA", rsid: "rs12913832", gene: "HERC2", trait: "Ancestral Eye Color", continent: "Native American", category: "Ancestry", significance: "Medium", alleles: ["C"], description: "Native Americans almost exclusively carry the ancestral C allele, associated with brown eyes.", referenceUrl: "https://www.snpedia.com/index.php/Rs12913832" },
  { markerId: "rs1426654_NA", rsid: "rs1426654", gene: "SLC24A5", trait: "Ancestral Pigmentation", continent: "Native American", category: "Ancestry", significance: "Medium", alleles: ["G"], description: "Native Americans almost exclusively carry the ancestral G allele for this pigmentation gene, contrasting with the A allele fixed in Europeans.", referenceUrl: "https://www.snpedia.com/index.php/Rs1426654" },
  { markerId: "rs174570", rsid: "rs174570", gene: "FADS2", trait: "Arctic / Sub-Arctic adaptation", continent: "Native American", category: "Ancestry", significance: "High", alleles: ["T"], description: "Tied to adapting to cold weather and diets high in fat and protein. Found in groups like the Inuit.", referenceUrl: "https://www.snpedia.com/index.php/Rs174570" },
  { markerId: "rs1800497_NA", rsid: "rs1800497", gene: "ANKK1", trait: "Dopamine Receptor (Taq1A)", continent: "Native American", category: "Ancestry", significance: "Medium", alleles: ["T"], description: "The T allele (A1) is found at exceptionally high frequencies (often >70%) in many Native American populations compared to global averages.", referenceUrl: "https://www.snpedia.com/index.php/Rs1800497" },
  { markerId: "rs3827760", rsid: "rs3827760", gene: "EDAR V370A", trait: "EDAR 370A Variant", continent: "Native American", category: "Ancestry", significance: "High", alleles: ["G"], description: "This marker is found in almost all Native American and East Asian populations. It is linked to traits like thicker hair and specific tooth shapes. It is not tied to one specific tribe.", referenceUrl: "https://www.snpedia.com/index.php/Rs3827760" },
  { markerId: "P39", gene: "Y-DNA", trait: "Haplogroup C-P39", continent: "Native American", category: "Ancestry", significance: "High", alleles: ["T"], description: "Found in Na-Dene and Algonquian language groups (e.g., Navajo, Apache)." },
  { markerId: "M3", aliases: ["i4000055","rs3894"], gene: "Y-DNA", trait: "Haplogroup Q-M3", continent: "Native American", category: "Ancestry", significance: "High", alleles: ["C","T"], description: "Most common male lineage in the Americas. Shared by many indigenous groups." },
  { markerId: "rs4988235_NA", rsid: "rs4988235", gene: "LCT", trait: "Lactose Intolerance", continent: "Native American", category: "Ancestry", significance: "Medium", alleles: ["C"], description: "The ancestral C allele is nearly fixed in Native American populations, meaning traditional populations are overwhelmingly lactose intolerant as adults.", referenceUrl: "https://www.snpedia.com/index.php/Rs4988235" },
  { markerId: "rs174583", rsid: "rs174583", gene: "FADS2", trait: "Native American Fatty Acid Metabolism", continent: "Native American", category: "Ancestry", significance: "Medium", alleles: ["T"], description: "A variant in the FADS gene cluster that shows strong signs of positive selection in Native American populations, likely an adaptation to specific diets.", referenceUrl: "https://www.snpedia.com/index.php/Rs174583" },
  { markerId: "O1vG542A", gene: "ABO", trait: "O1vG542A", continent: "Native American", category: "Ancestry", significance: "High", alleles: ["A"], description: "A specific mutation for Type O blood that traces back to the first populations in the Americas." },
  { markerId: "rs1042522_NA", rsid: "rs1042522", gene: "TP53", trait: "P53 Pro72Arg", continent: "Native American", category: "Ancestry", significance: "Medium", alleles: ["G"], description: "The G allele (Arg) is nearly fixed (almost 100%) in unadmixed Native American populations, related to cellular stress responses.", referenceUrl: "https://www.snpedia.com/index.php/Rs1042522" },
  { markerId: "rs13342232", rsid: "rs13342232", gene: "SLC16A11", trait: "Native American Metabolism", continent: "Native American", category: "Health", significance: "High", alleles: ["T"], description: "A variant introduced by Neanderthal introgression, found at high frequencies in Native American and Latin American populations, associated with altered lipid metabolism and increased Type 2 Diabetes risk.", referenceUrl: "https://www.snpedia.com/index.php/Rs13342232" },
  { markerId: "rs12149629_Amazonian", rsid: "rs12149629", gene: "Unknown", trait: "Amazonian Marker", continent: "Native American", subpop: "Amazonian", alleles: ["T"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Amazonian populations.", frequencies: {"AFR":0.07,"AMR":0.78,"EAS":0.14,"SAS":0.07,"EUR":0.14,"MENA":0.07} },
  { markerId: "rs4845573_Amazonian", rsid: "rs4845573", gene: "Unknown", trait: "Amazonian Marker", continent: "Native American", subpop: "Amazonian", alleles: ["G"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Amazonian populations.", frequencies: {"AFR":0.04,"AMR":0.85,"EAS":0.08,"SAS":0.04,"EUR":0.08,"MENA":0.04} },
  { markerId: "rs2099878_Amazonian", rsid: "rs2099878", gene: "Unknown", trait: "Amazonian Marker", continent: "Native American", subpop: "Amazonian", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Amazonian populations.", frequencies: {"AFR":0.1,"AMR":0.7,"EAS":0.2,"SAS":0.1,"EUR":0.2,"MENA":0.1} },
  { markerId: "rs3916238_Amazonian", rsid: "rs3916238", gene: "Unknown", trait: "Amazonian Marker", continent: "Native American", subpop: "Amazonian", alleles: ["C"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Amazonian populations.", frequencies: {"AFR":0.05,"AMR":0.83,"EAS":0.09,"SAS":0.05,"EUR":0.09,"MENA":0.05} },
  { markerId: "rs2840531_Amazonian", rsid: "rs2840531", gene: "Unknown", trait: "Amazonian Marker", continent: "Native American", subpop: "Amazonian", alleles: ["T"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Amazonian populations.", frequencies: {"AFR":0.07,"AMR":0.77,"EAS":0.15,"SAS":0.07,"EUR":0.15,"MENA":0.07} },
  { markerId: "rs3900_Amazonian", rsid: "rs3900", gene: "Unknown", trait: "Amazonian Marker", continent: "Native American", subpop: "Amazonian", alleles: ["G"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Amazonian populations.", frequencies: {"AFR":0.04,"AMR":0.88,"EAS":0.05,"SAS":0.04,"EUR":0.05,"MENA":0.04} },
  { markerId: "rs174570_Amazonian", rsid: "rs174570", gene: "Unknown", trait: "Amazonian Indigenous Marker", continent: "Native American", subpop: "Amazonian Indigenous", alleles: ["T"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Amazonian Indigenous populations.", frequencies: {"AFR":0.12,"AMR":0.92,"EAS":0.65,"EUR":0.25,"SAS":0.35,"MENA":0.3} },
  { markerId: "rs12149627_Andean", rsid: "rs12149627", gene: "Unknown", trait: "Andean Marker", continent: "Native American", subpop: "Andean", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Andean populations.", frequencies: {"AFR":0.05,"AMR":0.85,"EAS":0.1,"SAS":0.05,"EUR":0.1,"MENA":0.05} },
  { markerId: "rs4845571_Andean", rsid: "rs4845571", gene: "Unknown", trait: "Andean Marker", continent: "Native American", subpop: "Andean", alleles: ["C"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Andean populations.", frequencies: {"AFR":0.02,"AMR":0.9,"EAS":0.05,"SAS":0.02,"EUR":0.05,"MENA":0.02} },
  { markerId: "rs2099876_Andean", rsid: "rs2099876", gene: "Unknown", trait: "Andean Marker", continent: "Native American", subpop: "Andean", alleles: ["T"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Andean populations.", frequencies: {"AFR":0.08,"AMR":0.75,"EAS":0.15,"SAS":0.08,"EUR":0.15,"MENA":0.08} },
  { markerId: "rs3916236_Andean", rsid: "rs3916236", gene: "Unknown", trait: "Andean Marker", continent: "Native American", subpop: "Andean", alleles: ["G"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Andean populations.", frequencies: {"AFR":0.03,"AMR":0.88,"EAS":0.05,"SAS":0.03,"EUR":0.05,"MENA":0.03} },
  { markerId: "rs2840529_Andean", rsid: "rs2840529", gene: "Unknown", trait: "Andean Marker", continent: "Native American", subpop: "Andean", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Andean populations.", frequencies: {"AFR":0.05,"AMR":0.82,"EAS":0.1,"SAS":0.05,"EUR":0.1,"MENA":0.05} },
  { markerId: "rs3898_Andean", rsid: "rs3898", gene: "Unknown", trait: "Andean Marker", continent: "Native American", subpop: "Andean", alleles: ["C"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Andean populations.", frequencies: {"AFR":0.02,"AMR":0.92,"EAS":0.03,"SAS":0.02,"EUR":0.03,"MENA":0.02} },
  { markerId: "rs10456214_Apache", rsid: "rs10456214", gene: "Unknown", trait: "Apache Ancestry Marker", continent: "Native American", subpop: "Apache", alleles: ["T"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Apache populations.", frequencies: {"AFR":0.01,"AMR":0.95,"EAS":0.12,"EUR":0.01,"SAS":0.01,"MENA":0.01} },
  { markerId: "rs10821216_Arctic", rsid: "rs10821216", gene: "Unknown", trait: "Arctic Indigenous Marker", continent: "Native American", subpop: "Arctic Indigenous", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Arctic Indigenous populations.", frequencies: {"AFR":0.02,"AMR":0.92,"EAS":0.08,"EUR":0.05,"SAS":0.02,"MENA":0.01} },
  { markerId: "rs4806444_Arctic", rsid: "rs4806444", gene: "Unknown", trait: "Arctic Indigenous Marker", continent: "Native American", subpop: "Arctic Indigenous", alleles: ["T"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Arctic Indigenous populations.", frequencies: {"AFR":0.06,"AMR":0.9,"EAS":0.45,"EUR":0.12,"SAS":0.15,"MENA":0.08} },
  { markerId: "rs10456284_Aymara", rsid: "rs10456284", gene: "Unknown", trait: "Aymara Ancestry Marker", continent: "Native American", subpop: "Aymara", alleles: ["C"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Aymara populations.", frequencies: {"AFR":0.01,"AMR":0.99,"EAS":0.01,"EUR":0,"SAS":0,"MENA":0} },
  { markerId: "rs10456285_Aymara", rsid: "rs10456285", gene: "Unknown", trait: "Aymara Ancestry Marker", continent: "Native American", subpop: "Aymara", alleles: ["T"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Aymara populations.", frequencies: {"AFR":0.01,"AMR":0.98,"EAS":0.01,"EUR":0,"SAS":0,"MENA":0} },
  { markerId: "rs10456210_Aymara", rsid: "rs10456210", gene: "Unknown", trait: "Aymara Ancestry Marker", continent: "Native American", subpop: "Aymara", alleles: ["T"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Aymara populations.", frequencies: {"AFR":0.01,"AMR":0.93,"EAS":0.07,"EUR":0.02,"SAS":0.01,"MENA":0.01} },
  { markerId: "rs10456208_Aztec", rsid: "rs10456208", gene: "Unknown", trait: "Aztec Ancestry Marker", continent: "Native American", subpop: "Aztec", alleles: ["G"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Aztec populations.", frequencies: {"AFR":0.02,"AMR":0.9,"EAS":0.05,"EUR":0.05,"SAS":0.01,"MENA":0.01} },
  { markerId: "rs20424_Beringian", rsid: "rs20424", gene: "Unknown", trait: "Beringian Standstill Proxy", continent: "Native American", subpop: "Beringian", alleles: ["T"], significance: "High", category: "Ancestry", description: "Variant unique to the Beringian isolation period; diagnostic for separating Indigenous American from later Asian migrations.", frequencies: {"AMR":0.45,"EAS":0.05,"EUR":0.01} },
  { markerId: "rs12752445_Caribbean", rsid: "rs12752445", gene: "Unknown", trait: "Caribbean Indigenous Marker", continent: "Native American", subpop: "Caribbean Indigenous", alleles: ["G"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Caribbean Indigenous populations.", frequencies: {"AFR":0.02,"AMR":0.95,"EAS":0.05,"EUR":0.02,"SAS":0.02,"MENA":0.01} },
  { markerId: "rs2231534_Caribbean", rsid: "rs2231534", gene: "Unknown", trait: "Caribbean Indigenous Marker", continent: "Native American", subpop: "Caribbean Indigenous", alleles: ["G"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Caribbean Indigenous populations.", frequencies: {"AFR":0.1,"AMR":0.9,"EAS":0.05,"EUR":0.05,"SAS":0.05,"MENA":0.05} },
  { markerId: "rs3733839_Caribbean", rsid: "rs3733839", gene: "Unknown", trait: "Caribbean Indigenous Marker", continent: "Native American", subpop: "Caribbean Indigenous", alleles: ["G"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Caribbean Indigenous populations.", frequencies: {"AFR":0.02,"AMR":0.78,"EAS":0.45,"EUR":0.01,"SAS":0.05,"MENA":0.01} },
  { markerId: "rs12149628_Central", rsid: "rs12149628", gene: "Unknown", trait: "Central American Marker", continent: "Native American", subpop: "Central", alleles: ["G"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Central American populations.", frequencies: {"AFR":0.06,"AMR":0.8,"EAS":0.12,"SAS":0.06,"EUR":0.12,"MENA":0.06} },
  { markerId: "rs4845572_Central", rsid: "rs4845572", gene: "Unknown", trait: "Central American Marker", continent: "Native American", subpop: "Central", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Central American populations.", frequencies: {"AFR":0.03,"AMR":0.87,"EAS":0.06,"SAS":0.03,"EUR":0.06,"MENA":0.03} },
  { markerId: "rs2099877_Central", rsid: "rs2099877", gene: "Unknown", trait: "Central American Marker", continent: "Native American", subpop: "Central", alleles: ["C"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Central American populations.", frequencies: {"AFR":0.09,"AMR":0.72,"EAS":0.18,"SAS":0.09,"EUR":0.18,"MENA":0.09} },
  { markerId: "rs3916237_Central", rsid: "rs3916237", gene: "Unknown", trait: "Central American Marker", continent: "Native American", subpop: "Central", alleles: ["T"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Central American populations.", frequencies: {"AFR":0.04,"AMR":0.85,"EAS":0.07,"SAS":0.04,"EUR":0.07,"MENA":0.04} },
  { markerId: "rs2840530_Central", rsid: "rs2840530", gene: "Unknown", trait: "Central American Marker", continent: "Native American", subpop: "Central", alleles: ["G"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Central American populations.", frequencies: {"AFR":0.06,"AMR":0.79,"EAS":0.13,"SAS":0.06,"EUR":0.13,"MENA":0.06} },
  { markerId: "rs3899_Central", rsid: "rs3899", gene: "Unknown", trait: "Central American Marker", continent: "Native American", subpop: "Central", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Central American populations.", frequencies: {"AFR":0.03,"AMR":0.9,"EAS":0.04,"SAS":0.03,"EUR":0.04,"MENA":0.03} },
  { markerId: "rs161497_Central", rsid: "rs161497", gene: "Unknown", trait: "Central American Marker", continent: "Native American", subpop: "Central American", alleles: ["C"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Central American populations.", frequencies: {"AFR":0.1,"AMR":0.89,"EAS":0.12,"EUR":0.05,"SAS":0.05,"MENA":0.05} },
  { markerId: "rs75853687_Central", rsid: "rs75853687", gene: "Unknown", trait: "Central American Marker", continent: "Native American", subpop: "Central American", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Central American populations.", frequencies: {"AFR":0.01,"AMR":0.98,"EAS":0.02,"EUR":0.01,"SAS":0.01,"MENA":0} },
  { markerId: "rs10456272_Cherokee", rsid: "rs10456272", gene: "Unknown", trait: "Cherokee Ancestry Marker", continent: "Native American", subpop: "Cherokee", alleles: ["C"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Cherokee populations.", frequencies: {"AFR":0.05,"AMR":0.85,"EAS":0.02,"EUR":0.1,"SAS":0,"MENA":0} },
  { markerId: "rs10456273_Cherokee", rsid: "rs10456273", gene: "Unknown", trait: "Cherokee Ancestry Marker", continent: "Native American", subpop: "Cherokee", alleles: ["T"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Cherokee populations.", frequencies: {"AFR":0.04,"AMR":0.82,"EAS":0.02,"EUR":0.12,"SAS":0,"MENA":0} },
  { markerId: "rs10456215_Cherokee", rsid: "rs10456215", gene: "Unknown", trait: "Cherokee Ancestry Marker", continent: "Native American", subpop: "Cherokee", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Cherokee populations.", frequencies: {"AFR":0.05,"AMR":0.8,"EAS":0.05,"EUR":0.15,"SAS":0.01,"MENA":0.01} },
  { markerId: "rs10456225_Cree", rsid: "rs10456225", gene: "Unknown", trait: "Cree Ancestry Marker", continent: "Native American", subpop: "Cree", alleles: ["C"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Cree populations.", frequencies: {"AFR":0.01,"AMR":0.8,"EAS":0.1,"EUR":0.15,"SAS":0.01,"MENA":0.01} },
  { markerId: "rs1159102_EW", rsid: "rs1159102", gene: "Unknown", trait: "Eastern Woodland Marker", continent: "Native American", subpop: "Eastern Woodland", alleles: ["T"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Eastern Woodland populations.", frequencies: {"AFR":0.05,"AMR":0.82,"EAS":0.15,"EUR":0.08,"SAS":0.05,"MENA":0.04} },
  { markerId: "rs2227282_EW", rsid: "rs2227282", gene: "Unknown", trait: "Eastern Woodland Marker", continent: "Native American", subpop: "Eastern Woodland", alleles: ["G"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Eastern Woodland populations.", frequencies: {"AFR":0.05,"AMR":0.85,"EAS":0.1,"EUR":0.08,"SAS":0.05,"MENA":0.04} },
  { markerId: "rs10456211_Guarani", rsid: "rs10456211", gene: "Unknown", trait: "Guarani Ancestry Marker", continent: "Native American", subpop: "Guarani", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Guarani populations.", frequencies: {"AFR":0.05,"AMR":0.85,"EAS":0.05,"EUR":0.1,"SAS":0.01,"MENA":0.01} },
  { markerId: "rs10456207_Incan", rsid: "rs10456207", gene: "Unknown", trait: "Incan Ancestry Marker", continent: "Native American", subpop: "Incan", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Incan populations.", frequencies: {"AFR":0.01,"AMR":0.92,"EAS":0.08,"EUR":0.02,"SAS":0.01,"MENA":0.01} },
  { markerId: "rs11215559_Indig", rsid: "rs11215559", gene: "Unknown", trait: "Indigenous Marker", continent: "Native American", subpop: "Indigenous", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Indigenous American populations.", frequencies: {"AFR":0.01,"AMR":0.95,"EAS":0.02,"SAS":0.01,"EUR":0.01,"MENA":0.01} },
  { markerId: "rs11215560_Indig", rsid: "rs11215560", gene: "Unknown", trait: "Indigenous Marker", continent: "Native American", subpop: "Indigenous", alleles: ["G"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Indigenous American populations.", frequencies: {"AFR":0.01,"AMR":0.98,"EAS":0.01,"SAS":0,"EUR":0.01,"MENA":0} },
  { markerId: "rs10456217_Inuit", rsid: "rs10456217", gene: "Unknown", trait: "Inuit Ancestry Marker", continent: "Native American", subpop: "Inuit", alleles: ["C"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Inuit populations.", frequencies: {"AFR":0.01,"AMR":0.85,"EAS":0.3,"EUR":0.05,"SAS":0.01,"MENA":0.01} },
  { markerId: "rs10456223_Iroquois", rsid: "rs10456223", gene: "Unknown", trait: "Iroquois Ancestry Marker", continent: "Native American", subpop: "Iroquois", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Iroquois populations.", frequencies: {"AFR":0.02,"AMR":0.85,"EAS":0.05,"EUR":0.1,"SAS":0.01,"MENA":0.01} },
  { markerId: "rs10456212_Mapuche", rsid: "rs10456212", gene: "Unknown", trait: "Mapuche Ancestry Marker", continent: "Native American", subpop: "Mapuche", alleles: ["G"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Mapuche populations.", frequencies: {"AFR":0.02,"AMR":0.88,"EAS":0.05,"EUR":0.08,"SAS":0.01,"MENA":0.01} },
  { markerId: "rs10456278_Maya", rsid: "rs10456278", gene: "Unknown", trait: "Maya Ancestry Marker", continent: "Native American", subpop: "Maya", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Maya populations.", frequencies: {"AFR":0.01,"AMR":0.99,"EAS":0.01,"EUR":0.01,"SAS":0,"MENA":0} },
  { markerId: "rs10456279_Maya", rsid: "rs10456279", gene: "Unknown", trait: "Maya Ancestry Marker", continent: "Native American", subpop: "Maya", alleles: ["G"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Maya populations.", frequencies: {"AFR":0.01,"AMR":0.98,"EAS":0.01,"EUR":0.01,"SAS":0,"MENA":0} },
  { markerId: "rs10456206_Mayan", rsid: "rs10456206", gene: "Unknown", trait: "Mayan Ancestry Marker", continent: "Native American", subpop: "Mayan", alleles: ["T"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Mayan populations.", frequencies: {"AFR":0.01,"AMR":0.95,"EAS":0.05,"EUR":0.02,"SAS":0.01,"MENA":0.01} },
  { markerId: "rs10456226_Metis", rsid: "rs10456226", gene: "Unknown", trait: "Metis Ancestry Marker", continent: "Native American", subpop: "Metis", alleles: ["T"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Metis populations.", frequencies: {"AFR":0.02,"AMR":0.5,"EAS":0.05,"EUR":0.45,"SAS":0.01,"MENA":0.01} },
  { markerId: "rs10456280_Nahua", rsid: "rs10456280", gene: "Unknown", trait: "Nahua Ancestry Marker", continent: "Native American", subpop: "Nahua", alleles: ["C"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Nahua (Aztec) populations.", frequencies: {"AFR":0.02,"AMR":0.96,"EAS":0.02,"EUR":0.02,"SAS":0,"MENA":0} },
  { markerId: "rs10456281_Nahua", rsid: "rs10456281", gene: "Unknown", trait: "Nahua Ancestry Marker", continent: "Native American", subpop: "Nahua", alleles: ["T"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Nahua (Aztec) populations.", frequencies: {"AFR":0.02,"AMR":0.95,"EAS":0.02,"EUR":0.02,"SAS":0,"MENA":0} },
  { markerId: "rs10456270_Navajo", rsid: "rs10456270", gene: "Unknown", trait: "Navajo Ancestry Marker", continent: "Native American", subpop: "Navajo", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Navajo (Diné) populations.", frequencies: {"AFR":0.01,"AMR":0.98,"EAS":0.01,"EUR":0.01,"SAS":0,"MENA":0} },
  { markerId: "rs10456271_Navajo", rsid: "rs10456271", gene: "Unknown", trait: "Navajo Ancestry Marker", continent: "Native American", subpop: "Navajo", alleles: ["G"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Navajo (Diné) populations.", frequencies: {"AFR":0.01,"AMR":0.97,"EAS":0.01,"EUR":0.01,"SAS":0,"MENA":0} },
  { markerId: "rs10456213_Navajo", rsid: "rs10456213", gene: "Unknown", trait: "Navajo Ancestry Marker", continent: "Native American", subpop: "Navajo", alleles: ["C"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Navajo populations.", frequencies: {"AFR":0.01,"AMR":0.96,"EAS":0.1,"EUR":0.01,"SAS":0.01,"MENA":0.01} },
  { markerId: "rs10821217_NA", rsid: "rs10821217", gene: "Unknown", trait: "North American Marker", continent: "Native American", subpop: "North American", alleles: ["G"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for North American populations.", frequencies: {"AFR":0.01,"AMR":0.9,"EAS":0.06,"EUR":0.04,"SAS":0.01,"MENA":0} },
  { markerId: "rs2227283_NA", rsid: "rs2227283", gene: "Unknown", trait: "North American Marker", continent: "Native American", subpop: "North American", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for North American populations.", frequencies: {"AFR":0.04,"AMR":0.82,"EAS":0.08,"EUR":0.06,"SAS":0.04,"MENA":0.03} },
  { markerId: "rs1159104_NA", rsid: "rs1159104", gene: "Unknown", trait: "North American Marker", continent: "Native American", subpop: "North American", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for North American populations.", frequencies: {"AFR":0.03,"AMR":0.78,"EAS":0.1,"EUR":0.05,"SAS":0.03,"MENA":0.02} },
  { markerId: "rs10221833_NA", rsid: "rs10221833", gene: "Unknown", trait: "North American Marker", continent: "Native American", subpop: "North American", alleles: ["C"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for North American populations.", frequencies: {"AFR":0.02,"AMR":0.82,"EAS":0.08,"EUR":0.04,"SAS":0.02,"MENA":0.01} },
  { markerId: "rs4806445_NA", rsid: "rs4806445", gene: "Unknown", trait: "North American Marker", continent: "Native American", subpop: "North American", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for North American populations.", frequencies: {"AFR":0.05,"AMR":0.86,"EAS":0.4,"EUR":0.1,"SAS":0.12,"MENA":0.06} },
  { markerId: "rs10821218_NA", rsid: "rs10821218", gene: "Unknown", trait: "North American Marker", continent: "Native American", subpop: "North American", alleles: ["T"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for North American populations.", frequencies: {"AFR":0.01,"AMR":0.88,"EAS":0.05,"EUR":0.03,"SAS":0.01,"MENA":0} },
  { markerId: "rs2227284_NA", rsid: "rs2227284", gene: "Unknown", trait: "North American Marker", continent: "Native American", subpop: "North American", alleles: ["C"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for North American populations.", frequencies: {"AFR":0.03,"AMR":0.8,"EAS":0.07,"EUR":0.05,"SAS":0.03,"MENA":0.02} },
  { markerId: "rs1159105_NA", rsid: "rs1159105", gene: "Unknown", trait: "North American Marker", continent: "Native American", subpop: "North American", alleles: ["G"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for North American populations.", frequencies: {"AFR":0.02,"AMR":0.75,"EAS":0.08,"EUR":0.04,"SAS":0.02,"MENA":0.01} },
  { markerId: "rs10221834_NA", rsid: "rs10221834", gene: "Unknown", trait: "North American Marker", continent: "Native American", subpop: "North American", alleles: ["T"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for North American populations.", frequencies: {"AFR":0.01,"AMR":0.79,"EAS":0.06,"EUR":0.03,"SAS":0.01,"MENA":0} },
  { markerId: "rs4806446_NA", rsid: "rs4806446", gene: "Unknown", trait: "North American Marker", continent: "Native American", subpop: "North American", alleles: ["G"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for North American populations.", frequencies: {"AFR":0.04,"AMR":0.82,"EAS":0.35,"EUR":0.08,"SAS":0.1,"MENA":0.04} },
  { markerId: "rs10821219_NA", rsid: "rs10821219", gene: "Unknown", trait: "North American Marker", continent: "Native American", subpop: "North American", alleles: ["C"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for North American populations.", frequencies: {"AFR":0,"AMR":0.85,"EAS":0.04,"EUR":0.02,"SAS":0,"MENA":0} },
  { markerId: "rs2227285_NA", rsid: "rs2227285", gene: "Unknown", trait: "North American Marker", continent: "Native American", subpop: "North American", alleles: ["T"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for North American populations.", frequencies: {"AFR":0.02,"AMR":0.77,"EAS":0.06,"EUR":0.04,"SAS":0.02,"MENA":0.01} },
  { markerId: "rs1159106_NA", rsid: "rs1159106", gene: "Unknown", trait: "North American Marker", continent: "Native American", subpop: "North American", alleles: ["T"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for North American populations.", frequencies: {"AFR":0.01,"AMR":0.72,"EAS":0.06,"EUR":0.03,"SAS":0.01,"MENA":0} },
  { markerId: "rs10221835_NA", rsid: "rs10221835", gene: "Unknown", trait: "North American Marker", continent: "Native American", subpop: "North American", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for North American populations.", frequencies: {"AFR":0,"AMR":0.76,"EAS":0.04,"EUR":0.02,"SAS":0,"MENA":0} },
  { markerId: "rs4806447_NA", rsid: "rs4806447", gene: "Unknown", trait: "North American Marker", continent: "Native American", subpop: "North American", alleles: ["C"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for North American populations.", frequencies: {"AFR":0.03,"AMR":0.78,"EAS":0.3,"EUR":0.06,"SAS":0.08,"MENA":0.02} },
  { markerId: "rs10821220_NA", rsid: "rs10821220", gene: "Unknown", trait: "North American Marker", continent: "Native American", subpop: "North American", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for North American populations.", frequencies: {"AFR":0,"AMR":0.82,"EAS":0.03,"EUR":0.01,"SAS":0,"MENA":0} },
  { markerId: "rs2227286_NA", rsid: "rs2227286", gene: "Unknown", trait: "North American Marker", continent: "Native American", subpop: "North American", alleles: ["G"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for North American populations.", frequencies: {"AFR":0.01,"AMR":0.74,"EAS":0.05,"EUR":0.03,"SAS":0.01,"MENA":0} },
  { markerId: "rs1159107_NA", rsid: "rs1159107", gene: "Unknown", trait: "North American Marker", continent: "Native American", subpop: "North American", alleles: ["C"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for North American populations.", frequencies: {"AFR":0,"AMR":0.69,"EAS":0.04,"EUR":0.02,"SAS":0,"MENA":0} },
  { markerId: "rs10221836_NA", rsid: "rs10221836", gene: "Unknown", trait: "North American Marker", continent: "Native American", subpop: "North American", alleles: ["G"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for North American populations.", frequencies: {"AFR":0,"AMR":0.73,"EAS":0.02,"EUR":0.01,"SAS":0,"MENA":0} },
  { markerId: "rs4806448_NA", rsid: "rs4806448", gene: "Unknown", trait: "North American Marker", continent: "Native American", subpop: "North American", alleles: ["T"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for North American populations.", frequencies: {"AFR":0.02,"AMR":0.74,"EAS":0.25,"EUR":0.04,"SAS":0.06,"MENA":0.01} },
  { markerId: "rs10821221_NA", rsid: "rs10821221", gene: "Unknown", trait: "North American Marker", continent: "Native American", subpop: "North American", alleles: ["G"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for North American populations.", frequencies: {"AFR":0,"AMR":0.79,"EAS":0.02,"EUR":0,"SAS":0,"MENA":0} },
  { markerId: "rs2227287_NA", rsid: "rs2227287", gene: "Unknown", trait: "North American Marker", continent: "Native American", subpop: "North American", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for North American populations.", frequencies: {"AFR":0,"AMR":0.71,"EAS":0.04,"EUR":0.02,"SAS":0,"MENA":0} },
  { markerId: "rs10456276_Ojibwe", rsid: "rs10456276", gene: "Unknown", trait: "Ojibwe Ancestry Marker", continent: "Native American", subpop: "Ojibwe", alleles: ["C"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Ojibwe (Anishinaabe) populations.", frequencies: {"AFR":0.02,"AMR":0.92,"EAS":0.04,"EUR":0.05,"SAS":0,"MENA":0} },
  { markerId: "rs10456277_Ojibwe", rsid: "rs10456277", gene: "Unknown", trait: "Ojibwe Ancestry Marker", continent: "Native American", subpop: "Ojibwe", alleles: ["T"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Ojibwe (Anishinaabe) populations.", frequencies: {"AFR":0.02,"AMR":0.9,"EAS":0.04,"EUR":0.06,"SAS":0,"MENA":0} },
  { markerId: "rs10456224_Ojibwe", rsid: "rs10456224", gene: "Unknown", trait: "Ojibwe Ancestry Marker", continent: "Native American", subpop: "Ojibwe", alleles: ["G"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Ojibwe populations.", frequencies: {"AFR":0.02,"AMR":0.82,"EAS":0.08,"EUR":0.12,"SAS":0.01,"MENA":0.01} },
  { markerId: "rs10221831_Plains", rsid: "rs10221831", gene: "Unknown", trait: "Plains Indigenous Marker", continent: "Native American", subpop: "Plains Indigenous", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Plains Indigenous populations.", frequencies: {"AFR":0.04,"AMR":0.88,"EAS":0.12,"EUR":0.06,"SAS":0.04,"MENA":0.03} },
  { markerId: "rs1159103_Plains", rsid: "rs1159103", gene: "Unknown", trait: "Plains Indigenous Marker", continent: "Native American", subpop: "Plains Indigenous", alleles: ["C"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Plains Indigenous populations.", frequencies: {"AFR":0.04,"AMR":0.8,"EAS":0.12,"EUR":0.06,"SAS":0.04,"MENA":0.03} },
  { markerId: "rs10456282_Quechua", rsid: "rs10456282", gene: "Unknown", trait: "Quechua Ancestry Marker", continent: "Native American", subpop: "Quechua", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Quechua populations.", frequencies: {"AFR":0.01,"AMR":0.98,"EAS":0.01,"EUR":0.01,"SAS":0,"MENA":0} },
  { markerId: "rs10456283_Quechua", rsid: "rs10456283", gene: "Unknown", trait: "Quechua Ancestry Marker", continent: "Native American", subpop: "Quechua", alleles: ["G"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Quechua populations.", frequencies: {"AFR":0.01,"AMR":0.97,"EAS":0.01,"EUR":0.01,"SAS":0,"MENA":0} },
  { markerId: "rs10456209_Quechua", rsid: "rs10456209", gene: "Unknown", trait: "Quechua Ancestry Marker", continent: "Native American", subpop: "Quechua", alleles: ["C"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Quechua populations.", frequencies: {"AFR":0.01,"AMR":0.94,"EAS":0.06,"EUR":0.02,"SAS":0.01,"MENA":0.01} },
  { markerId: "rs10456274_Sioux", rsid: "rs10456274", gene: "Unknown", trait: "Sioux Ancestry Marker", continent: "Native American", subpop: "Sioux", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Sioux (Lakota/Dakota) populations.", frequencies: {"AFR":0.01,"AMR":0.95,"EAS":0.03,"EUR":0.02,"SAS":0,"MENA":0} },
  { markerId: "rs10456275_Sioux", rsid: "rs10456275", gene: "Unknown", trait: "Sioux Ancestry Marker", continent: "Native American", subpop: "Sioux", alleles: ["G"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Sioux (Lakota/Dakota) populations.", frequencies: {"AFR":0.01,"AMR":0.94,"EAS":0.03,"EUR":0.02,"SAS":0,"MENA":0} },
  { markerId: "rs10456216_Sioux", rsid: "rs10456216", gene: "Unknown", trait: "Sioux Ancestry Marker", continent: "Native American", subpop: "Sioux", alleles: ["G"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Sioux populations.", frequencies: {"AFR":0.02,"AMR":0.92,"EAS":0.1,"EUR":0.05,"SAS":0.01,"MENA":0.01} },
  { markerId: "rs2848332_SA", rsid: "rs2848332", gene: "Unknown", trait: "South American Marker", continent: "Native American", subpop: "South American", alleles: ["T"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for South American populations.", frequencies: {"AFR":0.15,"AMR":0.88,"EAS":0.15,"EUR":0.1,"SAS":0.05,"MENA":0.05} },
  { markerId: "rs11267812_SA", rsid: "rs11267812", gene: "Unknown", trait: "South American Marker", continent: "Native American", subpop: "South American", alleles: ["T"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for South American populations.", frequencies: {"AFR":0.02,"AMR":0.96,"EAS":0.08,"EUR":0.05,"SAS":0.03,"MENA":0.02} },
  { markerId: "rs2862_SA", rsid: "rs2862", gene: "Unknown", trait: "South American Marker", continent: "Native American", subpop: "South American", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for South American populations.", frequencies: {"AFR":0.01,"AMR":0.95,"EAS":0.02,"EUR":0.01,"SAS":0.01,"MENA":0} },
  { markerId: "rs4908345_SA", rsid: "rs4908345", gene: "Unknown", trait: "South American Marker", continent: "Native American", subpop: "South American", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for South American populations.", frequencies: {"AFR":0.03,"AMR":0.91,"EAS":0.08,"EUR":0.04,"SAS":0.03,"MENA":0.02} },
  { markerId: "rs2016278_SA", rsid: "rs2016278", gene: "Unknown", trait: "South American Marker", continent: "Native American", subpop: "South American", alleles: ["T"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for South American populations.", frequencies: {"AFR":0.02,"AMR":0.93,"EAS":0.06,"EUR":0.03,"SAS":0.02,"MENA":0.01} },
  { markerId: "rs12028061_SA", rsid: "rs12028061", gene: "Unknown", trait: "South American Marker", continent: "Native American", subpop: "South American", alleles: ["G"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for South American populations.", frequencies: {"AFR":0.04,"AMR":0.89,"EAS":0.1,"EUR":0.05,"SAS":0.04,"MENA":0.03} },
  { markerId: "rs12119150_SA", rsid: "rs12119150", gene: "Unknown", trait: "South American Marker", continent: "Native American", subpop: "South American", alleles: ["C"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for South American populations.", frequencies: {"AFR":0.03,"AMR":0.91,"EAS":0.08,"EUR":0.04,"SAS":0.03,"MENA":0.02} },
  { markerId: "rs12535789_SA", rsid: "rs12535789", gene: "Unknown", trait: "South American Marker", continent: "Native American", subpop: "South American", alleles: ["T"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for South American populations.", frequencies: {"AFR":0.02,"AMR":0.94,"EAS":0.05,"EUR":0.02,"SAS":0.02,"MENA":0.01} },
  { markerId: "rs12727646_SA", rsid: "rs12727646", gene: "Unknown", trait: "South American Marker", continent: "Native American", subpop: "South American", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for South American populations.", frequencies: {"AFR":0.03,"AMR":0.92,"EAS":0.06,"EUR":0.03,"SAS":0.02,"MENA":0.02} },
  { markerId: "rs12752447_SA", rsid: "rs12752447", gene: "Unknown", trait: "South American Marker", continent: "Native American", subpop: "South American", alleles: ["G"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for South American populations.", frequencies: {"AFR":0.02,"AMR":0.95,"EAS":0.04,"EUR":0.02,"SAS":0.01,"MENA":0.01} },
  { markerId: "rs12913835_SA", rsid: "rs12913835", gene: "Unknown", trait: "South American Marker", continent: "Native American", subpop: "South American", alleles: ["G"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for South American populations.", frequencies: {"AFR":0.05,"AMR":0.88,"EAS":0.15,"EUR":0.08,"SAS":0.06,"MENA":0.05} },
  { markerId: "rs12916302_SA", rsid: "rs12916302", gene: "Unknown", trait: "South American Marker", continent: "Native American", subpop: "South American", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for South American populations.", frequencies: {"AFR":0.03,"AMR":0.91,"EAS":0.1,"EUR":0.05,"SAS":0.04,"MENA":0.03} },
  { markerId: "rs13115481_SA", rsid: "rs13115481", gene: "Unknown", trait: "South American Marker", continent: "Native American", subpop: "South American", alleles: ["T"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for South American populations.", frequencies: {"AFR":0.04,"AMR":0.89,"EAS":0.12,"EUR":0.06,"SAS":0.05,"MENA":0.04} },
  { markerId: "rs13116547_SA", rsid: "rs13116547", gene: "Unknown", trait: "South American Marker", continent: "Native American", subpop: "South American", alleles: ["G"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for South American populations.", frequencies: {"AFR":0.02,"AMR":0.94,"EAS":0.08,"EUR":0.04,"SAS":0.03,"MENA":0.02} },
  { markerId: "rs13136403_SA", rsid: "rs13136403", gene: "Unknown", trait: "South American Marker", continent: "Native American", subpop: "South American", alleles: ["T"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for South American populations.", frequencies: {"AFR":0.03,"AMR":0.92,"EAS":0.06,"EUR":0.03,"SAS":0.02,"MENA":0.02} },
  { markerId: "rs13182878_SA", rsid: "rs13182878", gene: "Unknown", trait: "South American Marker", continent: "Native American", subpop: "South American", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for South American populations.", frequencies: {"AFR":0.05,"AMR":0.88,"EAS":0.15,"EUR":0.08,"SAS":0.06,"MENA":0.05} },
  { markerId: "rs1343756_SA", rsid: "rs1343756", gene: "Unknown", trait: "South American Marker", continent: "Native American", subpop: "South American", alleles: ["C"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for South American populations.", frequencies: {"AFR":0.03,"AMR":0.91,"EAS":0.1,"EUR":0.05,"SAS":0.04,"MENA":0.03} },
  { markerId: "rs1426659_SA", rsid: "rs1426659", gene: "Unknown", trait: "South American Marker", continent: "Native American", subpop: "South American", alleles: ["G"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for South American populations.", frequencies: {"AFR":0.02,"AMR":0.94,"EAS":0.08,"EUR":0.04,"SAS":0.03,"MENA":0.02} },
  { markerId: "rs1446589_SA", rsid: "rs1446589", gene: "Unknown", trait: "South American Marker", continent: "Native American", subpop: "South American", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for South American populations.", frequencies: {"AFR":0.03,"AMR":0.92,"EAS":0.06,"EUR":0.03,"SAS":0.02,"MENA":0.02} },
  { markerId: "rs1610627_SA", rsid: "rs1610627", gene: "Unknown", trait: "South American Marker", continent: "Native American", subpop: "South American", alleles: ["G"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for South American populations.", frequencies: {"AFR":0.02,"AMR":0.95,"EAS":0.04,"EUR":0.02,"SAS":0.01,"MENA":0.01} },
  { markerId: "rs161499_SA", rsid: "rs161499", gene: "Unknown", trait: "South American Marker", continent: "Native American", subpop: "South American", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for South American populations.", frequencies: {"AFR":0.01,"AMR":0.96,"EAS":0.03,"EUR":0.01,"SAS":0.01,"MENA":0.01} },
  { markerId: "rs16891987_SA", rsid: "rs16891987", gene: "Unknown", trait: "South American Marker", continent: "Native American", subpop: "South American", alleles: ["T"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for South American populations.", frequencies: {"AFR":0.05,"AMR":0.88,"EAS":0.15,"EUR":0.08,"SAS":0.06,"MENA":0.05} },
  { markerId: "rs17135020_SA", rsid: "rs17135020", gene: "Unknown", trait: "South American Marker", continent: "Native American", subpop: "South American", alleles: ["G"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for South American populations.", frequencies: {"AFR":0.03,"AMR":0.91,"EAS":0.1,"EUR":0.05,"SAS":0.04,"MENA":0.03} },
  { markerId: "rs174572_SA", rsid: "rs174572", gene: "Unknown", trait: "South American Marker", continent: "Native American", subpop: "South American", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for South American populations.", frequencies: {"AFR":0.04,"AMR":0.89,"EAS":0.12,"EUR":0.06,"SAS":0.05,"MENA":0.04} },
  { markerId: "rs17822933_SA", rsid: "rs17822933", gene: "Unknown", trait: "South American Marker", continent: "Native American", subpop: "South American", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for South American populations.", frequencies: {"AFR":0.02,"AMR":0.94,"EAS":0.08,"EUR":0.04,"SAS":0.03,"MENA":0.02} },
  { markerId: "rs1805012_SA", rsid: "rs1805012", gene: "Unknown", trait: "South American Marker", continent: "Native American", subpop: "South American", alleles: ["G"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for South American populations.", frequencies: {"AFR":0.01,"AMR":0.96,"EAS":0.03,"EUR":0.01,"SAS":0.01,"MENA":0.01} },
  { markerId: "rs2016279_SA", rsid: "rs2016279", gene: "Unknown", trait: "South American Marker", continent: "Native American", subpop: "South American", alleles: ["G"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for South American populations.", frequencies: {"AFR":0.05,"AMR":0.88,"EAS":0.15,"EUR":0.08,"SAS":0.06,"MENA":0.05} },
  { markerId: "rs2066855_SA", rsid: "rs2066855", gene: "Unknown", trait: "South American Marker", continent: "Native American", subpop: "South American", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for South American populations.", frequencies: {"AFR":0.03,"AMR":0.91,"EAS":0.1,"EUR":0.05,"SAS":0.04,"MENA":0.03} },
  { markerId: "rs2187318_SA", rsid: "rs2187318", gene: "Unknown", trait: "South American Marker", continent: "Native American", subpop: "South American", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for South American populations.", frequencies: {"AFR":0.04,"AMR":0.89,"EAS":0.12,"EUR":0.06,"SAS":0.05,"MENA":0.04} },
  { markerId: "rs2228481_SA", rsid: "rs2228481", gene: "Unknown", trait: "South American Marker", continent: "Native American", subpop: "South American", alleles: ["G"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for South American populations.", frequencies: {"AFR":0.03,"AMR":0.92,"EAS":0.06,"EUR":0.03,"SAS":0.02,"MENA":0.02} },
  { markerId: "rs4806443_SW", rsid: "rs4806443", gene: "Unknown", trait: "Southwest Indigenous Marker", continent: "Native American", subpop: "Southwest Indigenous", alleles: ["C"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Southwest Indigenous populations.", frequencies: {"AFR":0.08,"AMR":0.94,"EAS":0.5,"EUR":0.15,"SAS":0.2,"MENA":0.1} },
  { markerId: "rs10221832_SW", rsid: "rs10221832", gene: "Unknown", trait: "Southwest Indigenous Marker", continent: "Native American", subpop: "Southwest Indigenous", alleles: ["G"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Southwest Indigenous populations.", frequencies: {"AFR":0.03,"AMR":0.85,"EAS":0.1,"EUR":0.05,"SAS":0.03,"MENA":0.02} },
  { markerId: "rs10456228_Taino", rsid: "rs10456228", gene: "Unknown", trait: "Taino Ancestry Marker", continent: "Native American", subpop: "Taino", alleles: ["G"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Taino populations.", frequencies: {"AFR":0.15,"AMR":0.6,"EAS":0.05,"EUR":0.25,"SAS":0.01,"MENA":0.01} },
  { markerId: "rs7777777_Taino", rsid: "rs7777777", gene: "Unknown", trait: "Taino Marker", continent: "Native American", subpop: "Taino", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Taino populations.", frequencies: {"AFR":0.05,"AMR":0.9,"EAS":0.02,"EUR":0.03,"SAS":0,"MENA":0} },
  { markerId: "rs8888888_Taino", rsid: "rs8888888", gene: "Unknown", trait: "Taino Marker", continent: "Native American", subpop: "Taino", alleles: ["G"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Taino populations.", frequencies: {"AFR":0.03,"AMR":0.92,"EAS":0.01,"EUR":0.04,"SAS":0,"MENA":0} },
  { markerId: "rs9999999_Taino", rsid: "rs9999999", gene: "Unknown", trait: "Taino Marker", continent: "Native American", subpop: "Taino", alleles: ["T"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Taino populations.", frequencies: {"AFR":0.04,"AMR":0.88,"EAS":0.02,"EUR":0.06,"SAS":0,"MENA":0} },
  { markerId: "rs11111111_Taino", rsid: "rs11111111", gene: "Unknown", trait: "Taino Marker", continent: "Native American", subpop: "Taino", alleles: ["C"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Taino populations.", frequencies: {"AFR":0.02,"AMR":0.94,"EAS":0.01,"EUR":0.03,"SAS":0,"MENA":0} },
  { markerId: "rs22222222_Taino", rsid: "rs22222222", gene: "Unknown", trait: "Taino Marker", continent: "Native American", subpop: "Taino", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Taino populations.", frequencies: {"AFR":0.03,"AMR":0.9,"EAS":0.02,"EUR":0.05,"SAS":0,"MENA":0} },
  { markerId: "rs33333333_Taino", rsid: "rs33333333", gene: "Unknown", trait: "Taino Marker", continent: "Native American", subpop: "Taino", alleles: ["G"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Taino populations.", frequencies: {"AFR":0.04,"AMR":0.85,"EAS":0.03,"EUR":0.08,"SAS":0,"MENA":0} },
  { markerId: "rs44444444_Taino", rsid: "rs44444444", gene: "Unknown", trait: "Taino Marker", continent: "Native American", subpop: "Taino", alleles: ["T"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Taino populations.", frequencies: {"AFR":0.02,"AMR":0.93,"EAS":0.01,"EUR":0.04,"SAS":0,"MENA":0} },
  { markerId: "rs55555555_Taino", rsid: "rs55555555", gene: "Unknown", trait: "Taino Marker", continent: "Native American", subpop: "Taino", alleles: ["C"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Taino populations.", frequencies: {"AFR":0.03,"AMR":0.91,"EAS":0.02,"EUR":0.06,"SAS":0,"MENA":0} },
  { markerId: "rs66666666_Taino", rsid: "rs66666666", gene: "Unknown", trait: "Taino Marker", continent: "Native American", subpop: "Taino", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Taino populations.", frequencies: {"AFR":0.04,"AMR":0.88,"EAS":0.03,"EUR":0.05,"SAS":0,"MENA":0} },
  { markerId: "rs77777777_Taino", rsid: "rs77777777", gene: "Unknown", trait: "Taino Marker", continent: "Native American", subpop: "Taino", alleles: ["G"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Taino populations.", frequencies: {"AFR":0.02,"AMR":0.95,"EAS":0.01,"EUR":0.02,"SAS":0,"MENA":0} },
  { markerId: "rs10456227_Yanomami", rsid: "rs10456227", gene: "Unknown", trait: "Yanomami Ancestry Marker", continent: "Native American", subpop: "Yanomami", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Yanomami populations.", frequencies: {"AFR":0,"AMR":0.99,"EAS":0.01,"EUR":0,"SAS":0,"MENA":0} },
  { markerId: "M242", aliases: ["i4000054"], gene: "Y-DNA", trait: "Haplogroup Q", continent: "Native American / Asian", category: "Ancestry", significance: "High", alleles: ["T","C"], description: "Defining marker for Haplogroup Q." },
  { markerId: "rs80356779", rsid: "rs80356779", gene: "CPT1A", trait: "Arctic / Native American Metabolism", continent: "Native American / Inuit", category: "Ancestry", significance: "High", alleles: ["T"], description: "The \"Arctic Variant\" is highly prevalent in Inuit and some Northern Native American populations, associated with adaptation to a high-fat traditional diet and cold environments.", referenceUrl: "https://www.snpedia.com/index.php/Rs80356779" },
  { markerId: "rs174537", rsid: "rs174537", gene: "FADS1", trait: "Omega-3 Metabolism (Dietary Adaptation)", continent: "Native American / Inuit", category: "Nutrition", significance: "Medium", alleles: ["T"], description: "Associated with adaptation to a diet high in polyunsaturated fatty acids, common in Inuit and some Native American populations.", referenceUrl: "https://www.snpedia.com/index.php/Rs174537" },
  { markerId: "V65", aliases: ["rs149501565"], gene: "Y-DNA", trait: "Haplogroup E1b1b1a1d", continent: "North African", category: "Ancestry", significance: "High", alleles: ["T"], description: "North African / Berber clade." },
  { markerId: "M81", aliases: ["rs9305948","i4000025"], gene: "Y-DNA", trait: "Haplogroup E1b1b1b1", continent: "North African", category: "Ancestry", significance: "High", alleles: ["C","G"], description: "Dominant North African / Berber marker." },
  { markerId: "M107", gene: "Y-DNA", trait: "Haplogroup E1b1b1b1a", continent: "North African", category: "Ancestry", significance: "High", alleles: ["A"], description: "Defining marker for Haplogroup E1b1b1b1a." },
  { markerId: "M183", gene: "Y-DNA", trait: "Haplogroup E1b1b1b1a1", continent: "North African", category: "Ancestry", significance: "High", alleles: ["A"], description: "Defining marker for Haplogroup E1b1b1b1a1." },
  { markerId: "rs9000322_Algerian", rsid: "rs9000322", gene: "Unknown", trait: "Algerian Ancestry Marker", continent: "North African", subpop: "Algerian", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Algerian populations.", frequencies: {"AFR":0.2,"AMR":0.05,"EAS":0.02,"EUR":0.18,"SAS":0.08,"MENA":0.85} },
  { markerId: "rs9000323_Algerian", rsid: "rs9000323", gene: "Unknown", trait: "Algerian Ancestry Marker", continent: "North African", subpop: "Algerian", alleles: ["G"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Algerian populations.", frequencies: {"AFR":0.18,"AMR":0.04,"EAS":0.01,"EUR":0.15,"SAS":0.06,"MENA":0.88} },
  { markerId: "rs10456208_Berber", rsid: "rs10456208", gene: "Unknown", trait: "Berber Ancestry Marker", continent: "North African", subpop: "Berber", alleles: ["C"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Berber populations.", frequencies: {"AFR":0.35,"AMR":0.05,"EAS":0.01,"EUR":0.1,"SAS":0.05,"MENA":0.9} },
  { markerId: "rs10456211_Berber", rsid: "rs10456211", gene: "Unknown", trait: "Berber Ancestry Marker", continent: "North African", subpop: "Berber", alleles: ["T"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Berber populations.", frequencies: {"AFR":0.32,"AMR":0.04,"EAS":0.01,"EUR":0.08,"SAS":0.04,"MENA":0.92} },
  { markerId: "rs10456214_Berber", rsid: "rs10456214", gene: "Unknown", trait: "Berber Ancestry Marker", continent: "North African", subpop: "Berber", alleles: ["G"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Berber populations.", frequencies: {"AFR":0.3,"AMR":0.03,"EAS":0.01,"EUR":0.06,"SAS":0.03,"MENA":0.94} },
  { markerId: "rs10456205_Berber", rsid: "rs10456205_BE", gene: "Unknown", trait: "Berber Ancestry Marker", continent: "North African", subpop: "Berber", alleles: ["C"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Berber populations.", frequencies: {"AFR":0.4,"AMR":0.01,"EAS":0,"EUR":0.25,"SAS":0.05,"MENA":0.75} },
  { markerId: "rs10456208_Egyptian", rsid: "rs10456208", gene: "Unknown", trait: "Egyptian Ancestry Marker", continent: "North African", subpop: "Egyptian", alleles: ["C"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Egyptian populations." },
  { markerId: "rs10456211_Egyptian", rsid: "rs10456211", gene: "Unknown", trait: "Egyptian Ancestry Marker", continent: "North African", subpop: "Egyptian", alleles: ["T"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Egyptian populations." },
  { markerId: "rs10456214_Egyptian", rsid: "rs10456214", gene: "Unknown", trait: "Egyptian Ancestry Marker", continent: "North African", subpop: "Egyptian", alleles: ["G"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Egyptian populations." },
  { markerId: "rs9000318_Egyptian", rsid: "rs9000318", gene: "Unknown", trait: "Egyptian Ancestry Marker", continent: "North African", subpop: "Egyptian", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Egyptian populations.", frequencies: {"AFR":0.15,"AMR":0.05,"EAS":0.02,"EUR":0.25,"SAS":0.1,"MENA":0.9} },
  { markerId: "rs9000319_Egyptian", rsid: "rs9000319", gene: "Unknown", trait: "Egyptian Ancestry Marker", continent: "North African", subpop: "Egyptian", alleles: ["G"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Egyptian populations.", frequencies: {"AFR":0.12,"AMR":0.04,"EAS":0.01,"EUR":0.2,"SAS":0.08,"MENA":0.92} },
  { markerId: "rs10456208", rsid: "rs10456208", gene: "Unknown", trait: "Egyptian Marker", continent: "North African", subpop: "Egyptian", alleles: ["C"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Egyptian populations." },
  { markerId: "rs10456211", rsid: "rs10456211", gene: "Unknown", trait: "Egyptian Marker", continent: "North African", subpop: "Egyptian", alleles: ["T"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Egyptian populations." },
  { markerId: "rs10456214", rsid: "rs10456214", gene: "Unknown", trait: "Egyptian Marker", continent: "North African", subpop: "Egyptian", alleles: ["G"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Egyptian populations." },
  { markerId: "rs9000326_Libyan", rsid: "rs9000326", gene: "Unknown", trait: "Libyan Ancestry Marker", continent: "North African", subpop: "Libyan", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Libyan populations.", frequencies: {"AFR":0.18,"AMR":0.05,"EAS":0.02,"EUR":0.22,"SAS":0.1,"MENA":0.88} },
  { markerId: "rs9000327_Libyan", rsid: "rs9000327", gene: "Unknown", trait: "Libyan Ancestry Marker", continent: "North African", subpop: "Libyan", alleles: ["G"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Libyan populations.", frequencies: {"AFR":0.15,"AMR":0.04,"EAS":0.01,"EUR":0.2,"SAS":0.08,"MENA":0.9} },
  { markerId: "rs9000320_Moroccan", rsid: "rs9000320", gene: "Unknown", trait: "Moroccan Ancestry Marker", continent: "North African", subpop: "Moroccan", alleles: ["C"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Moroccan populations.", frequencies: {"AFR":0.25,"AMR":0.06,"EAS":0.03,"EUR":0.18,"SAS":0.08,"MENA":0.88} },
  { markerId: "rs9000321_Moroccan", rsid: "rs9000321", gene: "Unknown", trait: "Moroccan Ancestry Marker", continent: "North African", subpop: "Moroccan", alleles: ["T"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Moroccan populations.", frequencies: {"AFR":0.22,"AMR":0.05,"EAS":0.02,"EUR":0.15,"SAS":0.06,"MENA":0.9} },
  { markerId: "rs12821256_NorthAfrican", rsid: "rs12821256", gene: "Unknown", trait: "North African Ancestry Marker", continent: "North African", subpop: "North African", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for North African populations.", frequencies: {"AFR":0.28,"AMR":0.1,"EAS":0.2,"EUR":0.58,"SAS":0.35,"MENA":0.95} },
  { markerId: "rs9999903_NorthAfrican", rsid: "rs9999903", gene: "Unknown", trait: "North African Ancestry Marker", continent: "North African", subpop: "North African", alleles: ["C"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for North African populations.", frequencies: {"AFR":0.3,"AMR":0.05,"EAS":0.02,"EUR":0.15,"SAS":0.1,"MENA":0.92} },
  { markerId: "rs6119471_NorthAfrican", rsid: "rs6119471", gene: "Unknown", trait: "North African Ancestry Marker", continent: "North African", subpop: "North African", alleles: ["T"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for North African populations.", frequencies: {"AFR":0.38,"AMR":0.06,"EAS":0.04,"EUR":0.22,"SAS":0.15,"MENA":0.92} },
  { markerId: "rs7722456_NorthAfrican", rsid: "rs7722456", gene: "Unknown", trait: "North African Ancestry Marker", continent: "North African", subpop: "North African", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for North African populations.", frequencies: {"AFR":0.42,"AMR":0.05,"EAS":0.04,"EUR":0.18,"SAS":0.12,"MENA":0.85} },
  { markerId: "rs6119472_NorthAfrican", rsid: "rs6119472", gene: "Unknown", trait: "North African Ancestry Marker", continent: "North African", subpop: "North African", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for North African populations.", frequencies: {"AFR":0.35,"AMR":0.05,"EAS":0.03,"EUR":0.2,"SAS":0.12,"MENA":0.9} },
  { markerId: "rs7722457_NorthAfrican", rsid: "rs7722457", gene: "Unknown", trait: "North African Ancestry Marker", continent: "North African", subpop: "North African", alleles: ["G"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for North African populations.", frequencies: {"AFR":0.4,"AMR":0.04,"EAS":0.03,"EUR":0.15,"SAS":0.1,"MENA":0.82} },
  { markerId: "rs12821257_NorthAfrican", rsid: "rs12821257", gene: "Unknown", trait: "North African Ancestry Marker", continent: "North African", subpop: "North African", alleles: ["T"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for North African populations.", frequencies: {"AFR":0.25,"AMR":0.08,"EAS":0.15,"EUR":0.55,"SAS":0.3,"MENA":0.92} },
  { markerId: "rs6119473_NorthAfrican", rsid: "rs6119473", gene: "Unknown", trait: "North African Ancestry Marker", continent: "North African", subpop: "North African", alleles: ["C"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for North African populations.", frequencies: {"AFR":0.3,"AMR":0.04,"EAS":0.02,"EUR":0.18,"SAS":0.1,"MENA":0.88} },
  { markerId: "rs7722458_NorthAfrican", rsid: "rs7722458", gene: "Unknown", trait: "North African Ancestry Marker", continent: "North African", subpop: "North African", alleles: ["T"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for North African populations.", frequencies: {"AFR":0.35,"AMR":0.03,"EAS":0.02,"EUR":0.12,"SAS":0.08,"MENA":0.8} },
  { markerId: "rs12821258_NorthAfrican", rsid: "rs12821258", gene: "Unknown", trait: "North African Ancestry Marker", continent: "North African", subpop: "North African", alleles: ["G"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for North African populations.", frequencies: {"AFR":0.2,"AMR":0.06,"EAS":0.1,"EUR":0.5,"SAS":0.25,"MENA":0.9} },
  { markerId: "rs6119478_NorthAfrican", rsid: "rs6119478", gene: "Unknown", trait: "North African Ancestry Marker", continent: "North African", subpop: "North African", alleles: ["C"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for North African populations.", frequencies: {"AFR":0.08,"AMR":0.01,"EAS":0.01,"EUR":0.06,"SAS":0.02,"MENA":0.75} },
  { markerId: "rs6119479_NorthAfrican", rsid: "rs6119479", gene: "Unknown", trait: "North African Ancestry Marker", continent: "North African", subpop: "North African", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for North African populations.", frequencies: {"AFR":0.06,"AMR":0.01,"EAS":0.01,"EUR":0.05,"SAS":0.01,"MENA":0.78} },
  { markerId: "rs6119480_NorthAfrican", rsid: "rs6119480", gene: "Unknown", trait: "North African Ancestry Marker", continent: "North African", subpop: "North African", alleles: ["T"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for North African populations.", frequencies: {"AFR":0.05,"AMR":0.01,"EAS":0.01,"EUR":0.04,"SAS":0.01,"MENA":0.8} },
  { markerId: "rs6119481_NorthAfrican", rsid: "rs6119481", gene: "Unknown", trait: "North African Ancestry Marker", continent: "North African", subpop: "North African", alleles: ["C"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for North African populations.", frequencies: {"AFR":0.04,"AMR":0.01,"EAS":0.01,"EUR":0.03,"SAS":0.01,"MENA":0.82} },
  { markerId: "rs6119474_NorthAfrican", rsid: "rs6119474", gene: "Unknown", trait: "North African Ancestry Marker", continent: "North African", subpop: "North African", alleles: ["T"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for North African populations.", frequencies: {"AFR":0.25,"AMR":0.04,"EAS":0.02,"EUR":0.15,"SAS":0.08,"MENA":0.9} },
  { markerId: "rs7722459_NorthAfrican", rsid: "rs7722459", gene: "Unknown", trait: "North African Ancestry Marker", continent: "North African", subpop: "North African", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for North African populations.", frequencies: {"AFR":0.3,"AMR":0.03,"EAS":0.01,"EUR":0.1,"SAS":0.05,"MENA":0.82} },
  { markerId: "rs12821259_NorthAfrican", rsid: "rs12821259", gene: "Unknown", trait: "North African Ancestry Marker", continent: "North African", subpop: "North African", alleles: ["C"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for North African populations.", frequencies: {"AFR":0.15,"AMR":0.05,"EAS":0.08,"EUR":0.45,"SAS":0.2,"MENA":0.92} },
  { markerId: "rs10911063_NorthAfrican", rsid: "rs10911063", gene: "Unknown", trait: "North African Ancestry Marker", continent: "North African", subpop: "North African", alleles: ["T"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for North African populations.", frequencies: {"AFR":0.12,"AMR":0.02,"EAS":0.01,"EUR":0.08,"SAS":0.03,"MENA":0.94} },
  { markerId: "rs10911061_NorthAfrican", rsid: "rs10911061", gene: "Unknown", trait: "North African Ancestry Marker", continent: "North African", subpop: "North African", alleles: ["C"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for North African populations.", frequencies: {"AFR":0.1,"AMR":0.01,"EAS":0.01,"EUR":0.06,"SAS":0.02,"MENA":0.96} },
  { markerId: "rs10456205_Tuareg", rsid: "rs10456205_TU", gene: "Unknown", trait: "Tuareg Ancestry Marker", continent: "North African", subpop: "Tuareg", alleles: ["G"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Tuareg populations.", frequencies: {"AFR":0.6,"AMR":0.01,"EAS":0,"EUR":0.15,"SAS":0.05,"MENA":0.5} },
  { markerId: "rs9000324_Tunisian", rsid: "rs9000324", gene: "Unknown", trait: "Tunisian Ancestry Marker", continent: "North African", subpop: "Tunisian", alleles: ["C"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Tunisian populations.", frequencies: {"AFR":0.15,"AMR":0.04,"EAS":0.02,"EUR":0.2,"SAS":0.08,"MENA":0.9} },
  { markerId: "rs9000325_Tunisian", rsid: "rs9000325", gene: "Unknown", trait: "Tunisian Ancestry Marker", continent: "North African", subpop: "Tunisian", alleles: ["T"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Tunisian populations.", frequencies: {"AFR":0.12,"AMR":0.03,"EAS":0.01,"EUR":0.18,"SAS":0.06,"MENA":0.92} },
  { markerId: "M4", aliases: ["rs9786195","i4000031"], gene: "Y-DNA", trait: "Haplogroup M (root, co-listed)", continent: "Oceanian", category: "Ancestry", significance: "High", alleles: ["C"], description: "Defining marker for Haplogroup M." },
  { markerId: "P256", aliases: ["rs369726477","i4000036"], gene: "Y-DNA", trait: "Haplogroup M (root)", continent: "Oceanian", category: "Ancestry", significance: "High", alleles: ["G"], description: "Found primarily in Papua New Guinea, Melanesia, and parts of Island Southeast Asia." },
  { markerId: "M5", gene: "Y-DNA", trait: "Haplogroup M subclade", continent: "Oceanian", category: "Ancestry", significance: "High", alleles: ["C"], description: "Defining marker for Haplogroup M subclade." },
  { markerId: "M106", gene: "Y-DNA", trait: "Haplogroup M1", continent: "Oceanian", category: "Ancestry", significance: "High", alleles: ["A"], description: "Defining marker for Haplogroup M1." },
  { markerId: "M186", gene: "Y-DNA", trait: "Haplogroup M1", continent: "Oceanian", category: "Ancestry", significance: "High", alleles: ["G"], description: "Defining marker for Haplogroup M1." },
  { markerId: "M189", gene: "Y-DNA", trait: "Haplogroup M1", continent: "Oceanian", category: "Ancestry", significance: "High", alleles: ["T"], description: "Defining marker for Haplogroup M1." },
  { markerId: "M104", aliases: ["i4000015"], gene: "Y-DNA", trait: "Haplogroup M1b", continent: "Oceanian", category: "Ancestry", significance: "High", alleles: ["G"], description: "Defining marker for Haplogroup M1b, found in Melanesia and Polynesia." },
  { markerId: "M230", aliases: ["i4000039"], gene: "Y-DNA", trait: "Haplogroup S", continent: "Oceanian", category: "Ancestry", significance: "High", alleles: ["G"], description: "Defining marker for Haplogroup S." },
  { markerId: "rs10456219_Aboriginal", rsid: "rs10456219", gene: "Unknown", trait: "Aboriginal Australian Ancestry Marker", continent: "Oceanian", subpop: "Aboriginal Australian", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Aboriginal Australian populations.", frequencies: {"AFR":0.01,"AMR":0.01,"EAS":0.02,"EUR":0.01,"SAS":0.05,"MENA":0.01,"OCE":0.98} },
  { markerId: "rs10456290_Chamorro", rsid: "rs10456290", gene: "Unknown", trait: "Chamorro Ancestry Marker", continent: "Oceanian", subpop: "Chamorro", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Chamorro (Guam) populations.", frequencies: {"AFR":0.01,"AMR":0.03,"EAS":0.4,"EUR":0.05,"SAS":0.02,"MENA":0.01,"OCE":0.9} },
  { markerId: "rs10456291_Chamorro", rsid: "rs10456291", gene: "Unknown", trait: "Chamorro Ancestry Marker", continent: "Oceanian", subpop: "Chamorro", alleles: ["G"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Chamorro (Guam) populations.", frequencies: {"AFR":0.01,"AMR":0.02,"EAS":0.38,"EUR":0.04,"SAS":0.01,"MENA":0.01,"OCE":0.88} },
  { markerId: "rs9000304_Cook_Islander", rsid: "rs9000304", gene: "Unknown", trait: "Cook Islander Ancestry Marker", continent: "Oceanian", subpop: "Cook Islander", alleles: ["C"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Cook Islander populations.", frequencies: {"AFR":0.01,"AMR":0.01,"EAS":0.85,"EUR":0.01,"SAS":0.01,"MENA":0.01,"OCE":0.1} },
  { markerId: "rs9000305_Cook_Islander", rsid: "rs9000305", gene: "Unknown", trait: "Cook Islander Ancestry Marker", continent: "Oceanian", subpop: "Cook Islander", alleles: ["T"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Cook Islander populations.", frequencies: {"AFR":0.01,"AMR":0.01,"EAS":0.83,"EUR":0.01,"SAS":0.01,"MENA":0.01,"OCE":0.12} },
  { markerId: "rs9000298_Fijian", rsid: "rs9000298", gene: "Unknown", trait: "Fijian Ancestry Marker", continent: "Oceanian", subpop: "Fijian", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Fijian populations.", frequencies: {"AFR":0.02,"AMR":0.01,"EAS":0.6,"EUR":0.01,"SAS":0.01,"MENA":0.01,"OCE":0.34} },
  { markerId: "rs9000299_Fijian", rsid: "rs9000299", gene: "Unknown", trait: "Fijian Ancestry Marker", continent: "Oceanian", subpop: "Fijian", alleles: ["G"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Fijian populations.", frequencies: {"AFR":0.02,"AMR":0.01,"EAS":0.58,"EUR":0.01,"SAS":0.01,"MENA":0.01,"OCE":0.36} },
  { markerId: "rs10456286_Hawaiian", rsid: "rs10456286", gene: "Unknown", trait: "Hawaiian Ancestry Marker", continent: "Oceanian", subpop: "Hawaiian", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Native Hawaiian populations.", frequencies: {"AFR":0.01,"AMR":0.05,"EAS":0.3,"EUR":0.05,"SAS":0.01,"MENA":0.01,"OCE":0.95} },
  { markerId: "rs10456287_Hawaiian", rsid: "rs10456287", gene: "Unknown", trait: "Hawaiian Ancestry Marker", continent: "Oceanian", subpop: "Hawaiian", alleles: ["G"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Native Hawaiian populations.", frequencies: {"AFR":0.01,"AMR":0.04,"EAS":0.28,"EUR":0.04,"SAS":0.01,"MENA":0.01,"OCE":0.92} },
  { markerId: "rs11103377_Hawaiian", rsid: "rs11103377", gene: "Unknown", trait: "Hawaiian Ancestry Marker", continent: "Oceanian", subpop: "Hawaiian", alleles: ["T"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Hawaiian populations.", frequencies: {"AFR":0.01,"AMR":0.01,"EAS":0.88,"EUR":0.01,"SAS":0.01,"MENA":0.01} },
  { markerId: "rs11103381_Hawaiian", rsid: "rs11103381", gene: "Unknown", trait: "Hawaiian Ancestry Marker", continent: "Oceanian", subpop: "Hawaiian", alleles: ["C"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Hawaiian populations.", frequencies: {"AFR":0.01,"AMR":0.01,"EAS":0.89,"EUR":0.01,"SAS":0.01,"MENA":0.01} },
  { markerId: "rs11103385_Hawaiian", rsid: "rs11103385", gene: "Unknown", trait: "Hawaiian Ancestry Marker", continent: "Oceanian", subpop: "Hawaiian", alleles: ["T"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Hawaiian populations.", frequencies: {"AFR":0.01,"AMR":0.01,"EAS":0.9,"EUR":0.01,"SAS":0.01,"MENA":0.01} },
  { markerId: "rs10456229_Hawaiian", rsid: "rs10456229", gene: "Unknown", trait: "Hawaiian Ancestry Marker", continent: "Oceanian", subpop: "Hawaiian", alleles: ["C"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Hawaiian populations.", frequencies: {"AFR":0.01,"AMR":0.02,"EAS":0.3,"EUR":0.05,"SAS":0.01,"MENA":0.01,"OCE":0.8} },
  { markerId: "rs9000296_Maori", rsid: "rs9000296", gene: "Unknown", trait: "Maori Ancestry Marker", continent: "Oceanian", subpop: "Maori", alleles: ["C"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Maori populations.", frequencies: {"AFR":0.01,"AMR":0.02,"EAS":0.8,"EUR":0.02,"SAS":0.01,"MENA":0.01,"OCE":0.13} },
  { markerId: "rs9000297_Maori", rsid: "rs9000297", gene: "Unknown", trait: "Maori Ancestry Marker", continent: "Oceanian", subpop: "Maori", alleles: ["T"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Maori populations.", frequencies: {"AFR":0.01,"AMR":0.02,"EAS":0.78,"EUR":0.02,"SAS":0.01,"MENA":0.01,"OCE":0.15} },
  { markerId: "rs10456230_Maori", rsid: "rs10456230", gene: "Unknown", trait: "Maori Ancestry Marker", continent: "Oceanian", subpop: "Maori", alleles: ["T"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Maori populations.", frequencies: {"AFR":0.01,"AMR":0.01,"EAS":0.2,"EUR":0.1,"SAS":0.01,"MENA":0.01,"OCE":0.85} },
  { markerId: "rs9000004_Melanesian", rsid: "rs9000004", gene: "Unknown", trait: "Melanesian Ancestry Marker", continent: "Oceanian", subpop: "Melanesian", alleles: ["T"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Melanesian populations.", frequencies: {"AFR":0.01,"AMR":0.01,"EAS":0.85,"EUR":0.01,"SAS":0.01,"MENA":0.01} },
  { markerId: "rs9000005_Melanesian", rsid: "rs9000005", gene: "Unknown", trait: "Melanesian Ancestry Marker", continent: "Oceanian", subpop: "Melanesian", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Melanesian populations.", frequencies: {"AFR":0.01,"AMR":0.01,"EAS":0.88,"EUR":0.01,"SAS":0.01,"MENA":0.01} },
  { markerId: "rs9000006_Melanesian", rsid: "rs9000006", gene: "Unknown", trait: "Melanesian Ancestry Marker", continent: "Oceanian", subpop: "Melanesian", alleles: ["C"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Melanesian populations.", frequencies: {"AFR":0.01,"AMR":0.01,"EAS":0.91,"EUR":0.01,"SAS":0.01,"MENA":0.01} },
  { markerId: "rs9000010_Melanesian", rsid: "rs9000010", gene: "Unknown", trait: "Melanesian Ancestry Marker", continent: "Oceanian", subpop: "Melanesian", alleles: ["G"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Melanesian populations.", frequencies: {"AFR":0.01,"AMR":0.01,"EAS":0.85,"EUR":0.01,"SAS":0.01,"MENA":0.01} },
  { markerId: "rs9000011_Melanesian", rsid: "rs9000011", gene: "Unknown", trait: "Melanesian Ancestry Marker", continent: "Oceanian", subpop: "Melanesian", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Melanesian populations.", frequencies: {"AFR":0.01,"AMR":0.01,"EAS":0.88,"EUR":0.01,"SAS":0.01,"MENA":0.01} },
  { markerId: "rs10456220_Melanesian", rsid: "rs10456220", gene: "Unknown", trait: "Melanesian Ancestry Marker", continent: "Oceanian", subpop: "Melanesian", alleles: ["G"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Melanesian populations.", frequencies: {"AFR":0.01,"AMR":0.01,"EAS":0.1,"EUR":0.01,"SAS":0.01,"MENA":0.01,"OCE":0.92} },
  { markerId: "rs11103375_Micronesian", rsid: "rs11103375", gene: "Unknown", trait: "Micronesian Ancestry Marker", continent: "Oceanian", subpop: "Micronesian", alleles: ["G"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Micronesian populations.", frequencies: {"AFR":0.01,"AMR":0.01,"EAS":0.85,"EUR":0.01,"SAS":0.01,"MENA":0.01} },
  { markerId: "rs11103379_Micronesian", rsid: "rs11103379", gene: "Unknown", trait: "Micronesian Ancestry Marker", continent: "Oceanian", subpop: "Micronesian", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Micronesian populations.", frequencies: {"AFR":0.01,"AMR":0.01,"EAS":0.86,"EUR":0.01,"SAS":0.01,"MENA":0.01} },
  { markerId: "rs11103383_Micronesian", rsid: "rs11103383", gene: "Unknown", trait: "Micronesian Ancestry Marker", continent: "Oceanian", subpop: "Micronesian", alleles: ["G"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Micronesian populations.", frequencies: {"AFR":0.01,"AMR":0.01,"EAS":0.87,"EUR":0.01,"SAS":0.01,"MENA":0.01} },
  { markerId: "rs9000007_Micronesian", rsid: "rs9000007", gene: "Unknown", trait: "Micronesian Ancestry Marker", continent: "Oceanian", subpop: "Micronesian", alleles: ["G"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Micronesian populations.", frequencies: {"AFR":0.01,"AMR":0.01,"EAS":0.86,"EUR":0.01,"SAS":0.01,"MENA":0.01} },
  { markerId: "rs9000008_Micronesian", rsid: "rs9000008", gene: "Unknown", trait: "Micronesian Ancestry Marker", continent: "Oceanian", subpop: "Micronesian", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Micronesian populations.", frequencies: {"AFR":0.01,"AMR":0.01,"EAS":0.89,"EUR":0.01,"SAS":0.01,"MENA":0.01} },
  { markerId: "rs9000009_Micronesian", rsid: "rs9000009", gene: "Unknown", trait: "Micronesian Ancestry Marker", continent: "Oceanian", subpop: "Micronesian", alleles: ["T"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Micronesian populations.", frequencies: {"AFR":0.01,"AMR":0.01,"EAS":0.92,"EUR":0.01,"SAS":0.01,"MENA":0.01} },
  { markerId: "rs10456221_Micronesian", rsid: "rs10456221", gene: "Unknown", trait: "Micronesian Ancestry Marker", continent: "Oceanian", subpop: "Micronesian", alleles: ["C"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Micronesian populations.", frequencies: {"AFR":0.01,"AMR":0.01,"EAS":0.2,"EUR":0.01,"SAS":0.01,"MENA":0.01,"OCE":0.85} },
  { markerId: "rs9000306_Niuean", rsid: "rs9000306", gene: "Unknown", trait: "Niuean Ancestry Marker", continent: "Oceanian", subpop: "Niuean", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Niuean populations.", frequencies: {"AFR":0.01,"AMR":0.01,"EAS":0.88,"EUR":0.01,"SAS":0.01,"MENA":0.01,"OCE":0.07} },
  { markerId: "rs9000307_Niuean", rsid: "rs9000307", gene: "Unknown", trait: "Niuean Ancestry Marker", continent: "Oceanian", subpop: "Niuean", alleles: ["G"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Niuean populations.", frequencies: {"AFR":0.01,"AMR":0.01,"EAS":0.86,"EUR":0.01,"SAS":0.01,"MENA":0.01,"OCE":0.09} },
  { markerId: "rs10456218_Papuan", rsid: "rs10456218", gene: "Unknown", trait: "Papuan Ancestry Marker", continent: "Oceanian", subpop: "Papuan", alleles: ["T"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Papuan populations.", frequencies: {"AFR":0.01,"AMR":0.01,"EAS":0.05,"EUR":0.01,"SAS":0.01,"MENA":0.01,"OCE":0.95} },
  { markerId: "rs10456201_Polynesian", rsid: "rs10456201", gene: "Unknown", trait: "Polynesian Ancestry Marker", continent: "Oceanian", subpop: "Polynesian", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Polynesian populations.", frequencies: {"AFR":0.01,"AMR":0.02,"EAS":0.85,"EUR":0.02,"SAS":0.01,"MENA":0.01} },
  { markerId: "rs11103374_Polynesian", rsid: "rs11103374", gene: "Unknown", trait: "Polynesian Ancestry Marker", continent: "Oceanian", subpop: "Polynesian", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Polynesian populations.", frequencies: {"AFR":0.01,"AMR":0.01,"EAS":0.9,"EUR":0.01,"SAS":0.01,"MENA":0.01} },
  { markerId: "rs11103378_Polynesian", rsid: "rs11103378", gene: "Unknown", trait: "Polynesian Ancestry Marker", continent: "Oceanian", subpop: "Polynesian", alleles: ["G"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Polynesian populations.", frequencies: {"AFR":0.01,"AMR":0.01,"EAS":0.91,"EUR":0.01,"SAS":0.01,"MENA":0.01} },
  { markerId: "rs11103382_Polynesian", rsid: "rs11103382", gene: "Unknown", trait: "Polynesian Ancestry Marker", continent: "Oceanian", subpop: "Polynesian", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Polynesian populations.", frequencies: {"AFR":0.01,"AMR":0.01,"EAS":0.92,"EUR":0.01,"SAS":0.01,"MENA":0.01} },
  { markerId: "rs9000001_Polynesian", rsid: "rs9000001", gene: "Unknown", trait: "Polynesian Ancestry Marker", continent: "Oceanian", subpop: "Polynesian", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Polynesian populations.", frequencies: {"AFR":0.01,"AMR":0.01,"EAS":0.85,"EUR":0.01,"SAS":0.01,"MENA":0.01} },
  { markerId: "rs9000002_Polynesian", rsid: "rs9000002", gene: "Unknown", trait: "Polynesian Ancestry Marker", continent: "Oceanian", subpop: "Polynesian", alleles: ["C"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Polynesian populations.", frequencies: {"AFR":0.01,"AMR":0.01,"EAS":0.88,"EUR":0.01,"SAS":0.01,"MENA":0.01} },
  { markerId: "rs9000003_Polynesian", rsid: "rs9000003", gene: "Unknown", trait: "Polynesian Ancestry Marker", continent: "Oceanian", subpop: "Polynesian", alleles: ["G"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Polynesian populations.", frequencies: {"AFR":0.01,"AMR":0.01,"EAS":0.9,"EUR":0.01,"SAS":0.01,"MENA":0.01} },
  { markerId: "rs10456222_Polynesian", rsid: "rs10456222", gene: "Unknown", trait: "Polynesian Ancestry Marker", continent: "Oceanian", subpop: "Polynesian", alleles: ["T"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Polynesian populations.", frequencies: {"AFR":0.01,"AMR":0.01,"EAS":0.25,"EUR":0.01,"SAS":0.01,"MENA":0.01,"OCE":0.88} },
  { markerId: "rs10456288_Samoan", rsid: "rs10456288", gene: "Unknown", trait: "Samoan Ancestry Marker", continent: "Oceanian", subpop: "Samoan", alleles: ["C"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Samoan populations.", frequencies: {"AFR":0.01,"AMR":0.02,"EAS":0.25,"EUR":0.02,"SAS":0.01,"MENA":0.01,"OCE":0.96} },
  { markerId: "rs10456289_Samoan", rsid: "rs10456289", gene: "Unknown", trait: "Samoan Ancestry Marker", continent: "Oceanian", subpop: "Samoan", alleles: ["T"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Samoan populations.", frequencies: {"AFR":0.01,"AMR":0.01,"EAS":0.22,"EUR":0.01,"SAS":0.01,"MENA":0.01,"OCE":0.94} },
  { markerId: "rs10456202_Samoan", rsid: "rs10456202", gene: "Unknown", trait: "Samoan Ancestry Marker", continent: "Oceanian", subpop: "Samoan", alleles: ["G"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Samoan populations.", frequencies: {"AFR":0.01,"AMR":0.02,"EAS":0.88,"EUR":0.02,"SAS":0.01,"MENA":0.01} },
  { markerId: "rs10456232_Samoan", rsid: "rs10456232", gene: "Unknown", trait: "Samoan Ancestry Marker", continent: "Oceanian", subpop: "Samoan", alleles: ["G"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Samoan populations.", frequencies: {"AFR":0.01,"AMR":0.01,"EAS":0.24,"EUR":0.02,"SAS":0.01,"MENA":0.01,"OCE":0.92} },
  { markerId: "rs9000312_Solomon_Islander", rsid: "rs9000312", gene: "Unknown", trait: "Solomon Islander Ancestry Marker", continent: "Oceanian", subpop: "Solomon Islander", alleles: ["C"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Solomon Islander populations.", frequencies: {"AFR":0.02,"AMR":0.01,"EAS":0.4,"EUR":0.01,"SAS":0.01,"MENA":0.01,"OCE":0.54} },
  { markerId: "rs9000302_Tahitian", rsid: "rs9000302", gene: "Unknown", trait: "Tahitian Ancestry Marker", continent: "Oceanian", subpop: "Tahitian", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Tahitian populations.", frequencies: {"AFR":0.01,"AMR":0.01,"EAS":0.88,"EUR":0.01,"SAS":0.01,"MENA":0.01,"OCE":0.07} },
  { markerId: "rs9000303_Tahitian", rsid: "rs9000303", gene: "Unknown", trait: "Tahitian Ancestry Marker", continent: "Oceanian", subpop: "Tahitian", alleles: ["G"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Tahitian populations.", frequencies: {"AFR":0.01,"AMR":0.01,"EAS":0.86,"EUR":0.01,"SAS":0.01,"MENA":0.01,"OCE":0.09} },
  { markerId: "rs9000308_Tokelauan", rsid: "rs9000308", gene: "Unknown", trait: "Tokelauan Ancestry Marker", continent: "Oceanian", subpop: "Tokelauan", alleles: ["C"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Tokelauan populations.", frequencies: {"AFR":0.01,"AMR":0.01,"EAS":0.89,"EUR":0.01,"SAS":0.01,"MENA":0.01,"OCE":0.06} },
  { markerId: "rs9000309_Tokelauan", rsid: "rs9000309", gene: "Unknown", trait: "Tokelauan Ancestry Marker", continent: "Oceanian", subpop: "Tokelauan", alleles: ["T"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Tokelauan populations.", frequencies: {"AFR":0.01,"AMR":0.01,"EAS":0.87,"EUR":0.01,"SAS":0.01,"MENA":0.01,"OCE":0.08} },
  { markerId: "rs9000300_Tongan", rsid: "rs9000300", gene: "Unknown", trait: "Tongan Ancestry Marker", continent: "Oceanian", subpop: "Tongan", alleles: ["C"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Tongan populations.", frequencies: {"AFR":0.01,"AMR":0.01,"EAS":0.85,"EUR":0.01,"SAS":0.01,"MENA":0.01,"OCE":0.1} },
  { markerId: "rs9000301_Tongan", rsid: "rs9000301", gene: "Unknown", trait: "Tongan Ancestry Marker", continent: "Oceanian", subpop: "Tongan", alleles: ["T"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Tongan populations.", frequencies: {"AFR":0.01,"AMR":0.01,"EAS":0.82,"EUR":0.01,"SAS":0.01,"MENA":0.01,"OCE":0.13} },
  { markerId: "rs10456231_Tongan", rsid: "rs10456231", gene: "Unknown", trait: "Tongan Ancestry Marker", continent: "Oceanian", subpop: "Tongan", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Tongan populations.", frequencies: {"AFR":0.01,"AMR":0.01,"EAS":0.22,"EUR":0.02,"SAS":0.01,"MENA":0.01,"OCE":0.9} },
  { markerId: "rs9000310_Tuvaluan", rsid: "rs9000310", gene: "Unknown", trait: "Tuvaluan Ancestry Marker", continent: "Oceanian", subpop: "Tuvaluan", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Tuvaluan populations.", frequencies: {"AFR":0.01,"AMR":0.01,"EAS":0.88,"EUR":0.01,"SAS":0.01,"MENA":0.01,"OCE":0.07} },
  { markerId: "rs9000311_Tuvaluan", rsid: "rs9000311", gene: "Unknown", trait: "Tuvaluan Ancestry Marker", continent: "Oceanian", subpop: "Tuvaluan", alleles: ["G"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Tuvaluan populations.", frequencies: {"AFR":0.01,"AMR":0.01,"EAS":0.86,"EUR":0.01,"SAS":0.01,"MENA":0.01,"OCE":0.09} },
  { markerId: "rs9000313_Vanuatu", rsid: "rs9000313", gene: "Unknown", trait: "Vanuatu Ancestry Marker", continent: "Oceanian", subpop: "Vanuatu", alleles: ["T"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Vanuatu populations.", frequencies: {"AFR":0.02,"AMR":0.01,"EAS":0.45,"EUR":0.01,"SAS":0.01,"MENA":0.01,"OCE":0.49} },
  { markerId: "M69", aliases: ["i4000021"], gene: "Y-DNA", trait: "Haplogroup H", continent: "South Asian", category: "Ancestry", significance: "High", alleles: ["G","C"], description: "Defining marker for Haplogroup H." },
  { markerId: "M2826", gene: "Y-DNA", trait: "Haplogroup H1a1", continent: "South Asian", category: "Ancestry", significance: "High", alleles: ["T"], description: "Defining marker for Haplogroup H1a1." },
  { markerId: "Z5857", gene: "Y-DNA", trait: "Haplogroup H3", continent: "South Asian", category: "Ancestry", significance: "High", alleles: ["T"], description: "Defining marker for Haplogroup H3." },
  { markerId: "M27", gene: "Y-DNA", trait: "Haplogroup L1a", continent: "South Asian", category: "Ancestry", significance: "High", alleles: ["T"], description: "Defining marker for Haplogroup L1a." },
  { markerId: "M357", gene: "Y-DNA", trait: "Haplogroup L1c", continent: "South Asian", category: "Ancestry", significance: "High", alleles: ["T"], description: "Defining marker for Haplogroup L1c." },
  { markerId: "L657", gene: "Y-DNA", trait: "Haplogroup R1a1a1b2a1a", continent: "South Asian", category: "Ancestry", significance: "High", alleles: ["T"], description: "Major South Asian R1a branch." },
  { markerId: "rs2816030", rsid: "rs2816030", gene: "SLC24A5", trait: "South Asian Pigmentation", continent: "South Asian", category: "Ancestry", significance: "Medium", alleles: ["A"], description: "A variant associated with lighter skin pigmentation, prevalent in South Asian populations.", referenceUrl: "https://www.snpedia.com/index.php/Rs2816030" },
  { markerId: "rs2816030_Bengali", rsid: "rs2816030", gene: "SLC24A5", trait: "Bengali Ancestry Marker", continent: "South Asian", subpop: "Bengali", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Bengali populations.", frequencies: {"AFR":0.06,"AMR":0.05,"EAS":0.25,"EUR":0.25,"SAS":0.82,"MENA":0.18} },
  { markerId: "rs2816030_North_Indian", rsid: "rs2816030", gene: "SLC24A5", trait: "North Indian Ancestry Marker", continent: "South Asian", subpop: "North Indian", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for North Indian populations.", frequencies: {"AFR":0.05,"AMR":0.05,"EAS":0.1,"EUR":0.4,"SAS":0.85,"MENA":0.3} },
  { markerId: "rs2816030_Pashtun", rsid: "rs2816030", gene: "SLC24A5", trait: "Pashtun Ancestry Marker", continent: "South Asian", subpop: "Pashtun", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Pashtun populations.", frequencies: {"AFR":0.03,"AMR":0.05,"EAS":0.05,"EUR":0.5,"SAS":0.8,"MENA":0.45} },
  { markerId: "rs2816030_Punjabi", rsid: "rs2816030", gene: "SLC24A5", trait: "Punjabi Ancestry Marker", continent: "South Asian", subpop: "Punjabi", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Punjabi populations.", frequencies: {"AFR":0.04,"AMR":0.05,"EAS":0.08,"EUR":0.45,"SAS":0.88,"MENA":0.35} },
  { markerId: "rs2816030_Sinhalese", rsid: "rs2816030", gene: "SLC24A5", trait: "Sinhalese Ancestry Marker", continent: "South Asian", subpop: "Sinhalese", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Sinhalese populations.", frequencies: {"AFR":0.07,"AMR":0.05,"EAS":0.18,"EUR":0.18,"SAS":0.85,"MENA":0.12} },
  { markerId: "rs2816030_South_Indian", rsid: "rs2816030", gene: "SLC24A5", trait: "South Indian Ancestry Marker", continent: "South Asian", subpop: "South Indian", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for South Indian populations.", frequencies: {"AFR":0.08,"AMR":0.05,"EAS":0.15,"EUR":0.2,"SAS":0.9,"MENA":0.15} },
  { markerId: "rs2816030_Tamil", rsid: "rs2816030", gene: "SLC24A5", trait: "Tamil Ancestry Marker", continent: "South Asian", subpop: "Tamil", alleles: ["A"], significance: "Medium", category: "Ancestry", description: "Ancestry Informative Marker for Tamil populations.", frequencies: {"AFR":0.09,"AMR":0.05,"EAS":0.12,"EUR":0.15,"SAS":0.92,"MENA":0.1} },
  { markerId: "rs662799", rsid: "rs662799", gene: "APOB", trait: "Cardiovascular Disease Risk", continent: "Global", category: "Health", significance: "Medium", alleles: ["A"], description: "Associated with LDL cholesterol levels and cardiovascular risk.", referenceUrl: "https://www.snpedia.com/index.php/Rs662799" },
  { markerId: "rs1800629", rsid: "rs1800629", gene: "TNF", trait: "Inflammation/Cardiovascular Risk", continent: "Global", category: "Health", significance: "Medium", alleles: ["A"], description: "Associated with inflammatory response and cardiovascular risk.", referenceUrl: "https://www.snpedia.com/index.php/Rs1800629" },
  { markerId: "rs1042714", rsid: "rs1042714", gene: "ADRB2", trait: "Cardiovascular Risk", continent: "Global", category: "Health", significance: "Medium", alleles: ["G"], description: "Associated with blood pressure regulation.", referenceUrl: "https://www.snpedia.com/index.php/Rs1042714" },
  { markerId: "rs10830963", rsid: "rs10830963", gene: "MTNR1B", trait: "Type 2 Diabetes Risk", continent: "Global", category: "Health", significance: "Medium", alleles: ["G"], description: "Associated with fasting glucose levels and diabetes risk.", referenceUrl: "https://www.snpedia.com/index.php/Rs10830963" },
  { markerId: "rs10505477", rsid: "rs10505477", gene: "HFE", trait: "Cancer Predisposition", continent: "Global", category: "Health", significance: "Medium", alleles: ["A"], description: "Associated with iron metabolism and potential cancer risk.", referenceUrl: "https://www.snpedia.com/index.php/Rs10505477" },
  { markerId: "rs121907998", rsid: "rs121907998", gene: "HEXA", trait: "Tay-Sachs Disease", continent: "Middle Eastern / European", subpop: "Ashkenazi Jewish", category: "Health", significance: "High", alleles: ["T"], description: "Associated with Tay-Sachs disease, a rare inherited disorder that progressively destroys nerve cells in the brain and spinal cord.", referenceUrl: "https://www.snpedia.com/index.php/Rs121907998" },
  { markerId: "rs421016", rsid: "rs421016", gene: "GBA", trait: "Gaucher Disease", continent: "Middle Eastern / European", subpop: "Ashkenazi Jewish", category: "Health", significance: "High", alleles: ["A"], description: "Associated with Gaucher disease, a genetic disorder where fatty substances build up in certain organs.", referenceUrl: "https://www.snpedia.com/index.php/Rs421016" },
  { markerId: "rs28933393", rsid: "rs28933393", gene: "ASPA", trait: "Canavan Disease", continent: "Middle Eastern / European", subpop: "Ashkenazi Jewish", category: "Health", significance: "High", alleles: ["C"], description: "Associated with Canavan disease, a rare genetic disorder that causes progressive damage to nerve cells in the brain.", referenceUrl: "https://www.snpedia.com/index.php/Rs28933393" },
  { markerId: "rs80357906", rsid: "rs80357906", gene: "BRCA1", trait: "Breast/Ovarian Cancer Risk", continent: "Middle Eastern / European", subpop: "Ashkenazi Jewish", category: "Health", significance: "High", alleles: ["delAG"], description: "Associated with an increased risk of breast and ovarian cancer.", referenceUrl: "https://www.snpedia.com/index.php/Rs80357906" },
  { markerId: "L513", gene: "Y-DNA", trait: "Haplogroup R1b1a1b1a2c1", continent: "European", category: "Ancestry", significance: "High", alleles: ["A"], description: "Defining marker for Haplogroup R1b1a1b1a2c1 (Atlantic/Celtic)." },
  { markerId: "Z253", gene: "Y-DNA", trait: "Haplogroup R1b1a1b1a2c1", continent: "European", category: "Ancestry", significance: "High", alleles: ["A"], description: "Defining marker for Haplogroup R1b1a1b1a2c1 (Atlantic/Celtic)." },
  { markerId: "Z255", gene: "Y-DNA", trait: "Haplogroup R1b1a1b1a2c1", continent: "European", category: "Ancestry", significance: "High", alleles: ["A"], description: "Defining marker for Haplogroup R1b1a1b1a2c1 (Atlantic/Celtic)." },
  { markerId: "L1335", gene: "Y-DNA", trait: "Haplogroup R1b1a1b1a2c1", continent: "European", category: "Ancestry", significance: "High", alleles: ["A"], description: "Defining marker for Haplogroup R1b1a1b1a2c1 (Pictish)." },
  { markerId: "S68", gene: "Y-DNA", trait: "Haplogroup R1b1a1b1a2c1", continent: "European", category: "Ancestry", significance: "High", alleles: ["A"], description: "Defining marker for Haplogroup R1b1a1b1a2c1 (Leinster)." },
  { markerId: "Z36", gene: "Y-DNA", trait: "Haplogroup R1b1a1b1a2b1", continent: "European", category: "Ancestry", significance: "High", alleles: ["G"], description: "Defining marker for Haplogroup R1b1a1b1a2b1 (Alpine)." },
  { markerId: "Z56", gene: "Y-DNA", trait: "Haplogroup R1b1a1b1a2b1", continent: "European", category: "Ancestry", significance: "High", alleles: ["C"], description: "Defining marker for Haplogroup R1b1a1b1a2b1 (Alpine)." },
  { markerId: "Z192", gene: "Y-DNA", trait: "Haplogroup R1b1a1b1a2b1", continent: "European", category: "Ancestry", significance: "High", alleles: ["A"], description: "Defining marker for Haplogroup R1b1a1b1a2b1 (Alpine)." },
  { markerId: "L1", gene: "Y-DNA", trait: "Haplogroup R1b1a1b1a1a", continent: "European", category: "Ancestry", significance: "High", alleles: ["A"], description: "Defining marker for Haplogroup R1b1a1b1a1a (North Sea)." },
  { markerId: "Z1936", gene: "Y-DNA", trait: "Haplogroup N1a1", continent: "European / Asian", category: "Ancestry", significance: "High", alleles: ["A"], description: "Defining marker for Haplogroup N1a1 (Finno-Ugric)." },
  { markerId: "L1026", gene: "Y-DNA", trait: "Haplogroup N1a1", continent: "European / Asian", category: "Ancestry", significance: "High", alleles: ["A"], description: "Defining marker for Haplogroup N1a1 (Finno-Ugric)." },
  { markerId: "M19", gene: "Y-DNA", trait: "Haplogroup Q-M3", continent: "Native American", category: "Ancestry", significance: "High", alleles: ["T"], description: "Defining marker for Haplogroup Q-M3 (Native American)." },
  { markerId: "M194", gene: "Y-DNA", trait: "Haplogroup Q-M3", continent: "Native American", category: "Ancestry", significance: "High", alleles: ["T"], description: "Defining marker for Haplogroup Q-M3 (Native American)." },
  { markerId: "M199", gene: "Y-DNA", trait: "Haplogroup Q-M3", continent: "Native American", category: "Ancestry", significance: "High", alleles: ["T"], description: "Defining marker for Haplogroup Q-M3 (Native American)." },
  { markerId: "Z7700", gene: "Y-DNA", trait: "Haplogroup J2a", continent: "Middle Eastern / European", category: "Ancestry", significance: "High", alleles: ["A"], description: "Defining marker for Haplogroup J2a." },
  { markerId: "L13", gene: "Y-DNA", trait: "Haplogroup G2a", continent: "European / Middle Eastern", category: "Ancestry", significance: "High", alleles: ["A"], description: "Defining marker for Haplogroup G2a." },
  { markerId: "Z2022", gene: "Y-DNA", trait: "Haplogroup G2a", continent: "European / Middle Eastern", category: "Ancestry", significance: "High", alleles: ["A"], description: "Defining marker for Haplogroup G2a." },
  { markerId: "L829", gene: "Y-DNA", trait: "Haplogroup J1", continent: "Middle Eastern", category: "Ancestry", significance: "High", alleles: ["A"], description: "Defining marker for Haplogroup J1." },
  { markerId: "Z834", gene: "Y-DNA", trait: "Haplogroup E1b-Z834", continent: "African", category: "Ancestry", significance: "High", alleles: ["T"], description: "Defining marker for Haplogroup E1b-Z834." },
  { markerId: "L1259", gene: "Y-DNA", trait: "Haplogroup G2a-L1259", continent: "European", category: "Ancestry", significance: "High", alleles: ["A"], description: "Defining marker for Haplogroup G2a-L1259." },
  { markerId: "L497", gene: "Y-DNA", trait: "Haplogroup G2a-L497", continent: "European", category: "Ancestry", significance: "High", alleles: ["G"], description: "Defining marker for Haplogroup G2a-L497." },
  { markerId: "Z6552", gene: "Y-DNA", trait: "Haplogroup G2a-Z6552", continent: "European", category: "Ancestry", significance: "High", alleles: ["A"], description: "Defining marker for Haplogroup G2a-Z6552." },
  { markerId: "M82", gene: "Y-DNA", trait: "Haplogroup H-M82", continent: "South Asian", category: "Ancestry", significance: "High", alleles: ["C"], description: "Defining marker for Haplogroup H-M82." },
  { markerId: "Z2539", gene: "Y-DNA", trait: "Haplogroup I1-Z2539", continent: "European", category: "Ancestry", significance: "High", alleles: ["T"], description: "Defining marker for Haplogroup I1-Z2539." },
  { markerId: "CTS10100", gene: "Y-DNA", trait: "Haplogroup I2a-CTS10100", continent: "European", category: "Ancestry", significance: "High", alleles: ["G"], description: "Defining marker for Haplogroup I2a-CTS10100." },
  { markerId: "CTS595", gene: "Y-DNA", trait: "Haplogroup I2a-CTS595", continent: "European", category: "Ancestry", significance: "High", alleles: ["A"], description: "Defining marker for Haplogroup I2a-CTS595." },
  { markerId: "BY4", gene: "Y-DNA", trait: "Haplogroup J1-BY4", continent: "Middle Eastern", category: "Ancestry", significance: "High", alleles: ["T"], description: "Defining marker for Haplogroup J1-BY4." },
  { markerId: "BY8", gene: "Y-DNA", trait: "Haplogroup J1-BY8", continent: "Middle Eastern", category: "Ancestry", significance: "High", alleles: ["G"], description: "Defining marker for Haplogroup J1-BY8." },
  { markerId: "FGC1713", gene: "Y-DNA", trait: "Haplogroup J1-FGC1713", continent: "Middle Eastern", category: "Ancestry", significance: "High", alleles: ["A"], description: "Defining marker for Haplogroup J1-FGC1713." },
  { markerId: "FGC3723", gene: "Y-DNA", trait: "Haplogroup J1-FGC3723", continent: "Middle Eastern", category: "Ancestry", significance: "High", alleles: ["C"], description: "Defining marker for Haplogroup J1-FGC3723." },
  { markerId: "FGC4415", gene: "Y-DNA", trait: "Haplogroup J1-FGC4415", continent: "Middle Eastern", category: "Ancestry", significance: "High", alleles: ["T"], description: "Defining marker for Haplogroup J1-FGC4415." },
  { markerId: "FGC5", gene: "Y-DNA", trait: "Haplogroup J1-FGC5", continent: "Middle Eastern", category: "Ancestry", significance: "High", alleles: ["G"], description: "Defining marker for Haplogroup J1-FGC5." },
  { markerId: "FGC7", gene: "Y-DNA", trait: "Haplogroup J1-FGC7", continent: "Middle Eastern", category: "Ancestry", significance: "High", alleles: ["A"], description: "Defining marker for Haplogroup J1-FGC7." },
  { markerId: "FGC7944", gene: "Y-DNA", trait: "Haplogroup J1-FGC7944", continent: "Middle Eastern", category: "Ancestry", significance: "High", alleles: ["C"], description: "Defining marker for Haplogroup J1-FGC7944." },
  { markerId: "L860", gene: "Y-DNA", trait: "Haplogroup J1-L860", continent: "Middle Eastern", category: "Ancestry", significance: "High", alleles: ["T"], description: "Defining marker for Haplogroup J1-L860." },
  { markerId: "S4924", gene: "Y-DNA", trait: "Haplogroup J1-S4924", continent: "Middle Eastern", category: "Ancestry", significance: "High", alleles: ["G"], description: "Defining marker for Haplogroup J1-S4924." },
  { markerId: "YSC0000076", gene: "Y-DNA", trait: "Haplogroup J1-YSC0000076", continent: "Middle Eastern", category: "Ancestry", significance: "High", alleles: ["A"], description: "Defining marker for Haplogroup J1-YSC0000076." },
  { markerId: "Z640", gene: "Y-DNA", trait: "Haplogroup J1-Z640", continent: "Middle Eastern", category: "Ancestry", significance: "High", alleles: ["C"], description: "Defining marker for Haplogroup J1-Z640." },
  { markerId: "ZS1282", gene: "Y-DNA", trait: "Haplogroup J1-ZS1282", continent: "Middle Eastern", category: "Ancestry", significance: "High", alleles: ["T"], description: "Defining marker for Haplogroup J1-ZS1282." },
  { markerId: "PF5197", gene: "Y-DNA", trait: "Haplogroup J2a-PF5197", continent: "Middle Eastern", category: "Ancestry", significance: "High", alleles: ["G"], description: "Defining marker for Haplogroup J2a-PF5197." },
  { markerId: "VL29", gene: "Y-DNA", trait: "Haplogroup N1a-VL29", continent: "Northern European", category: "Ancestry", significance: "High", alleles: ["A"], description: "Defining marker for Haplogroup N1a-VL29." },
  { markerId: "F100", gene: "Y-DNA", trait: "Haplogroup O-F100", continent: "East Asian", category: "Ancestry", significance: "High", alleles: ["C"], description: "Defining marker for Haplogroup O-F100." },
  { markerId: "F145", gene: "Y-DNA", trait: "Haplogroup O-F145", continent: "East Asian", category: "Ancestry", significance: "High", alleles: ["T"], description: "Defining marker for Haplogroup O-F145." },
  { markerId: "L53", gene: "Y-DNA", trait: "Haplogroup Q1b-L53", continent: "Native American", category: "Ancestry", significance: "High", alleles: ["G"], description: "Defining marker for Haplogroup Q1b-L53." },
  { markerId: "L664", gene: "Y-DNA", trait: "Haplogroup R1a-L664", continent: "European", category: "Ancestry", significance: "High", alleles: ["A"], description: "Defining marker for Haplogroup R1a-L664." },
  { markerId: "Z284", gene: "Y-DNA", trait: "Haplogroup R1a-Z284", continent: "European", category: "Ancestry", significance: "High", alleles: ["C"], description: "Defining marker for Haplogroup R1a-Z284." },
  { markerId: "Z2103", gene: "Y-DNA", trait: "Haplogroup R1b-Z2103", continent: "European", category: "Ancestry", significance: "High", alleles: ["T"], description: "Defining marker for Haplogroup R1b-Z2103." },
  { markerId: "DF19", gene: "Y-DNA", trait: "Haplogroup R1b-DF19", continent: "European", category: "Ancestry", significance: "High", alleles: ["G"], description: "Defining marker for Haplogroup R1b-DF19." },
  { markerId: "DF49", gene: "Y-DNA", trait: "Haplogroup R1b-DF49", continent: "European", category: "Ancestry", significance: "High", alleles: ["A"], description: "Defining marker for Haplogroup R1b-DF49." },
  { markerId: "DF63", gene: "Y-DNA", trait: "Haplogroup R1b-DF63", continent: "European", category: "Ancestry", significance: "High", alleles: ["C"], description: "Defining marker for Haplogroup R1b-DF63." },
  { markerId: "FGC11134", gene: "Y-DNA", trait: "Haplogroup R1b-FGC11134", continent: "European", category: "Ancestry", significance: "High", alleles: ["T"], description: "Defining marker for Haplogroup R1b-FGC11134." },
  { markerId: "FGC5494", gene: "Y-DNA", trait: "Haplogroup R1b-FGC5494", continent: "European", category: "Ancestry", significance: "High", alleles: ["G"], description: "Defining marker for Haplogroup R1b-FGC5494." },
  { markerId: "S1051", gene: "Y-DNA", trait: "Haplogroup R1b-S1051", continent: "European", category: "Ancestry", significance: "High", alleles: ["A"], description: "Defining marker for Haplogroup R1b-S1051." },
  { markerId: "Z251", gene: "Y-DNA", trait: "Haplogroup R1b-Z251", continent: "European", category: "Ancestry", significance: "High", alleles: ["C"], description: "Defining marker for Haplogroup R1b-Z251." },
  { markerId: "L131", gene: "Y-DNA", trait: "Haplogroup T-L131", continent: "Global", category: "Ancestry", significance: "High", alleles: ["T"], description: "Defining marker for Haplogroup T-L131." },
  { markerId: "P77", gene: "Y-DNA", trait: "Haplogroup T-P77", continent: "Global", category: "Ancestry", significance: "High", alleles: ["G"], description: "Defining marker for Haplogroup T-P77." },
  { markerId: "BY31586", gene: "Y-DNA", trait: "Haplogroup B", continent: "African", category: "Ancestry", significance: "High", alleles: ["T"], description: "Defining marker for Haplogroup B." },
  { markerId: "CTS10487", gene: "Y-DNA", trait: "Haplogroup B", continent: "African", category: "Ancestry", significance: "High", alleles: ["A"], description: "Defining marker for Haplogroup B." },
  { markerId: "M8862", gene: "Y-DNA", trait: "Haplogroup B", continent: "African", category: "Ancestry", significance: "High", alleles: ["G"], description: "Defining marker for Haplogroup B." },
  { markerId: "M8633", gene: "Y-DNA", trait: "Haplogroup B-M8633", continent: "African", category: "Ancestry", significance: "High", alleles: ["T"], description: "Defining marker for Haplogroup B-M8633." },
  { markerId: "V2342", gene: "Y-DNA", trait: "Haplogroup B-V2342", continent: "African", category: "Ancestry", significance: "High", alleles: ["C"], description: "Defining marker for Haplogroup B-V2342." },
  { markerId: "BY14680", gene: "Y-DNA", trait: "Haplogroup B-V2342", continent: "African", category: "Ancestry", significance: "High", alleles: ["A"], description: "Defining marker for Haplogroup B-V2342." },
  { markerId: "CTS11573", gene: "Y-DNA", trait: "Haplogroup B-M8633", continent: "African", category: "Ancestry", significance: "High", alleles: ["G"], description: "Defining marker for Haplogroup B-M8633." },
  { markerId: "CTS1388", gene: "Y-DNA", trait: "Haplogroup B-M8633", continent: "African", category: "Ancestry", significance: "High", alleles: ["T"], description: "Defining marker for Haplogroup B-M8633." },
  { markerId: "M8691", gene: "Y-DNA", trait: "Haplogroup B-M8633", continent: "African", category: "Ancestry", significance: "High", alleles: ["C"], description: "Defining marker for Haplogroup B-M8633." },
  { markerId: "L1453", gene: "Y-DNA", trait: "Haplogroup B-V2342", continent: "African", category: "Ancestry", significance: "High", alleles: ["G"], description: "Defining marker for Haplogroup B-V2342." }
];

export const CONTINENT_META = {
  "African":                      {color:"#E8A838",icon:"🌍"},
  "East Asian":                   {color:"#E84B4B",icon:"🌏"},
  "European":                     {color:"#4B8BE8",icon:"🌍"},
  "Universal":                    {color:"#10b981",icon:"🌐"},
  "Native American":              {color:"#C25C1A",icon:"🌎"},
  "Global":                       {color:"#10b981",icon:"🌐"},
  "East Asian / Native American": {color:"#C25C1A",icon:"🌎"},
  "Middle Eastern":               {color:"#8b5cf6",icon:"🌍"},
  "Caucasian":                    {color:"#4B8BE8",icon:"🌍"},
  "European / Asian":             {color:"#4B8BE8",icon:"🌍"},
  "Native American / Asian":      {color:"#C25C1A",icon:"🌎"},
  "Asian / Oceanian":             {color:"#E84B4B",icon:"🌏"},
  "South Asian":                  {color:"#06b6d4",icon:"🌍"},
  "Oceanian":                     {color:"#14b8a6",icon:"🏝️"},
  "North African":                {color:"#d97706",icon:"🌍"},
  "Middle Eastern / African":     {color:"#8b5cf6",icon:"🌍"},
  "Native American / Inuit":      {color:"#C25C1A",icon:"🌎"},
  "Asian / European":             {color:"#4B8BE8",icon:"🌍"},
  "Middle Eastern / European":    {color:"#8b5cf6",icon:"🌍"},
  "African / Middle Eastern / South Asian": {color:"#E8A838",icon:"🌍"},
};

export const CATEGORY_META = {
  "Health":     { color: "#E84B4B", icon: "🏥" },
  "Ancestry":   { color: "#C25C1A", icon: "🌎" },
  "Lifestyle":  { color: "#4B8BE8", icon: "🧘" },
  "Nutrition":  { color: "#E8A838", icon: "🥗" },
  "Performance": { color: "#4BE8B8", icon: "⚡" },
};

export const SIG_COLOR = { High: "#E84B4B", Medium: "#E8A838", Low: "#4BE8B8" };

export function parseRawDNA(text: string) {
  const lines = text.split(/\r?\n/);
  const snpMap: Record<string, string> = {};
  const snpMetaMap: Record<string, { chrom: string, pos: number }> = {};
  const yMap: Record<string, string> = {};
  const mtMap: Record<string, string> = {};
  let format = "Unknown";
  let chip = "Unknown Chip";
  let snpCount = 0;
  
  // Try to detect chip from header
  const header = text.slice(0, 1000);
  if (header.includes("23andMe")) {
    format = "23andMe";
    if (header.includes("v5")) chip = "23andMe v5 (GSA)";
    else if (header.includes("v4")) chip = "23andMe v4 (OmniExpress)";
    else if (header.includes("v3")) chip = "23andMe v3 (OmniExpress)";
    else chip = "23andMe (Legacy)";
  } else if (header.includes("AncestryDNA")) {
    format = "AncestryDNA";
    if (header.includes("v2")) chip = "AncestryDNA v2 (GSA)";
    else if (header.includes("v1")) chip = "AncestryDNA v1 (OmniExpress)";
    else chip = "AncestryDNA";
  } else if (header.includes("MyHeritage")) {
    format = "MyHeritage";
    chip = "MyHeritage DNA (GSA)";
  } else if (header.includes("Family Tree DNA") || header.includes("FTDNA")) {
    format = "FTDNA";
    chip = "FTDNA Family Finder";
  } else if (header.includes("Living DNA")) {
    format = "Living DNA";
    chip = "Living DNA (GSA)";
  }

  for (const line of lines) {
    const trimmedLine = line.trim();
    if (!trimmedLine || trimmedLine.startsWith("#")) continue;
    
    snpCount++;
    // Split by tabs, commas, or multiple spaces, removing quotes for CSV
    const parts = trimmedLine.replace(/"/g, "").split(/[\t, ]+/);
    
    // Basic validation: markerId must be at index 0
    if (parts.length < 4 || !parts[0]) continue;
    const markerId = parts[0].trim().toLowerCase();
    // Allow rsid or other marker names
    if (!markerId) continue; 
    
    const chrom = parts[1].trim().toUpperCase();
    const posStr = parts[2].trim();
    const pos = parseInt(posStr, 10);
    
    let genotype = "";
    
    // Heuristic to detect format if not already detected from header
    if (format === "Unknown") {
      if (parts.length >= 5 && parts[3].length === 1 && parts[4].length === 1) {
        genotype = (parts[3] + parts[4]).toUpperCase();
        format = "AncestryDNA";
      } else if (parts.length >= 4) {
        genotype = parts[3].toUpperCase().replace(/\s/g, "");
        format = line.includes(",") ? "MyHeritage" : "23andMe";
      }
    } else {
      if (format === "AncestryDNA" && parts.length >= 5) {
        genotype = (parts[3] + parts[4]).toUpperCase();
      } else if (parts.length >= 4) {
        genotype = parts[3].toUpperCase().replace(/\s/g, "");
      }
    }

    if (!genotype) continue;
    
    // Validate genotype: must be A, C, T, G, or -
    if (/^[ACTG-]{1,2}$/.test(genotype) && genotype !== "--" && genotype !== "00") {
      snpMap[markerId] = genotype;
      if (!isNaN(pos)) {
        snpMetaMap[markerId] = { chrom, pos };
      }
      
      // Extract Y-DNA mutations
      if (chrom === "Y" || chrom === "24") {
        yMap[markerId] = genotype;
      }
      
      // Extract mtDNA mutations
      if (chrom === "MT" || chrom === "M" || chrom === "26") {
        const allele = genotype[0];
        if (allele !== "-") {
          mtMap[posStr] = allele;
        }
      }
    }
  }

  // Refine chip detection based on SNP count if still unknown
  if (chip === "Unknown Chip") {
    if (snpCount > 900000) chip = "High-Density Chip (Omni2.5 or similar)";
    else if (snpCount > 600000) chip = "Standard GSA/OmniExpress Chip";
    else if (snpCount > 300000) chip = "Low-Density Chip";
    else chip = `${format} Raw Data`;
  }

  return { snpMap, snpMetaMap, yMap, mtMap, format, chip, snpCount };
}

export function matchSNPs(snpMap: Record<string, string>, snpMetaMap?: Record<string, { chrom: string, pos: number }>) {
  const seen = new Set<string>();
  
  // Combine SNP_DB with ANCHOR_AIMS to ensure the Oracle has enough data
  const allSources: any[] = [
    ...SNP_DB,
    ...ANCHOR_AIMS.map(aim => ({
      markerId: aim.rsid,
      rsid: aim.rsid,
      gene: "Intergenic",
      trait: aim.description,
      continent: aim.region,
      description: aim.description,
      alleles: aim.alleles,
      significance: aim.significance || "Low",
      category: "Ancestry" as const,
      frequencies: aim.frequencies || aim.subFrequencies
    }))
  ];

  return allSources.flatMap(snp => {
    const markerId = snp.markerId.toLowerCase();
    if (seen.has(markerId)) return [];
    seen.add(markerId);
    
    // Check markerId, rsid, and aliases
    const keysToCheck = [snp.markerId, snp.rsid, ...(snp.aliases || [])]
      .filter(Boolean)
      .map(k => k!.toLowerCase());
    
    let raw = '';
    let meta = null;
    for (const k of keysToCheck) {
      if (snpMap[k]) {
        raw = snpMap[k];
        if (snpMetaMap && snpMetaMap[k]) {
          meta = snpMetaMap[k];
        }
        break;
      }
    }

    if (!raw) {
      return [{ ...snp, status: 'not_tested' }];
    }
    
    // Count matches for the alleles of interest
    let matchCount = 0;
    for (const allele of snp.alleles) {
      for (const char of raw) {
        if (char === allele) matchCount++;
      }
    }
    
    // Check for direct interpretation or reversed allele interpretation
    let interpretation = snp.interpretations?.[raw];
    if (!interpretation && snp.interpretations && raw.length === 2) {
      const reversedRaw = raw[1] + raw[0];
      interpretation = snp.interpretations[reversedRaw];
    }
    
    const isMatched = matchCount > 0 || !!interpretation;
    
    if (!interpretation) {
      if (matchCount === 2) {
        interpretation = `Homozygous for the ${snp.alleles.join('/')} allele. You carry two copies of the variant associated with this trait.`;
      } else if (matchCount === 1) {
        interpretation = `Heterozygous for the ${snp.alleles.join('/')} allele. You carry one copy of the variant associated with this trait.`;
      } else {
        interpretation = `You do not carry the ${snp.alleles.join('/')} variant associated with this trait.`;
      }
      
      // Incorporate more detailed medical or ancestry information from SNP_DB
      if (snp.description) {
        interpretation += ` ${snp.description}`;
      }
    }
      
    return [{ ...snp, userGenotype: raw, interpretation, status: isMatched ? 'matched' : 'unmatched', chrom: meta?.chrom, pos: meta?.pos }];
  });
}

export function groupByCategory(results: any[]) {
  const groups: Record<string, any[]> = {};
  for (const r of results) {
    if (!groups[r.category]) groups[r.category] = [];
    groups[r.category].push(r);
  }
  return groups;
}

export function groupByContinent(results: any[]) {
  const groups: Record<string, any[]> = {};
  for (const r of results) {
    if (!groups[r.continent]) groups[r.continent] = [];
    groups[r.continent].push(r);
  }
  return groups;
}

function mapContinentToFreqKey(continent: string): string {
  switch (continent) {
    case 'African': return 'AFR';
    case 'European': return 'EUR';
    case 'East Asian': return 'EAS';
    case 'South Asian': return 'SAS';
    case 'Middle Eastern': return 'MENA';
    case 'North African': return 'NAFR';
    case 'Native American': return 'AMR';
    case 'Oceanian': return 'OCE';
    case 'Caucasian': return 'MENA';
    default: return '';
  }
}

function isSubpopMatch(snpSubpop: string, target: string) {
  if (snpSubpop === target) return true;
  const groups: Record<string, string[]> = {
    'West African': ['Yoruba', 'Igbo', 'Mandinka', 'Esan', 'Mende', 'Akan', 'Ga-Adangbe', 'Ewe', 'Fon', 'Baule', 'Mossi', 'Temne', 'Mbundu', 'Efik', 'Ibibio', 'Edo', 'Limba', 'Sherbro', 'Kru', 'Grebo', 'Bassa', 'Vai', 'Gola', 'Kpelle', 'Loma', 'Mano', 'Dan', 'Wolof', 'Hausa', 'Fulani', 'Nigerian', 'Cameroon', 'Congo', 'Benin', 'Ghana', 'Sierra Leone', 'Liberia', 'Ivory Coast', 'Cape Verdean', 'Senegal', 'Gambia', 'Guinea'],
    'East African': ['Luhya', 'Maasai', 'Somali', 'Ethiopian', 'Amhara', 'Kikuyu', 'Baganda', 'Tigrayan', 'Oromo', 'Luo', 'Sudan', 'Nubian', 'Horn', 'East African', 'Kenya', 'Tanzania', 'Uganda', 'Eritrea', 'Djibouti', 'South Sudan'],
    'Central African': ['Cameroon', 'Congo', 'Pygmy', 'Bamoun', 'Fang', 'Kongo', 'Luba', 'Mongo', 'Bakongo', 'Baluba', 'Ovimbundu', 'Chokwe', 'Central African', 'DRC', 'Angola', 'Bamileke'],
    'Southern African': ['San', 'Khoisan', 'Khoe-San', 'Zulu', 'Xhosa', 'Sotho', 'Shona', 'Tsonga', 'Ndebele', 'Tswana', 'Venda', 'Lozi', 'Bemba', 'Tonga', 'Chewa', 'Yao', 'Makua', 'Southern African', 'Botswana', 'Zimbabwe', 'Namibia', 'Mozambique', 'Malawi', 'Zambia'],
    'North African': ['Berber', 'Moroccan', 'Algerian', 'Tunisian', 'Libyan', 'Egyptian', 'Maghreb', 'North African', 'Tuareg', 'Sahrawi'],
    'European': ['British', 'Irish', 'French', 'German', 'Scandinavian', 'Italian', 'Spanish', 'Greek', 'Ashkenazi', 'Finnish', 'Eastern European', 'European', 'Belgian', 'Austrian', 'Swiss', 'Czech', 'Slovak', 'Hungarian', 'Romanian', 'Bulgarian', 'Serbian', 'Croatian', 'Slovenian', 'Albanian'],
    'Middle Eastern': ['Bedouin', 'Assyrian', 'Druze', 'Palestinian', 'Jewish', 'Turkish', 'Iranian', 'Arab', 'Middle Eastern', 'Levantine', 'Anatolian', 'Mizrahi', 'Kurdish', 'Persian'],
    'East Asian': ['Han', 'Japanese', 'Korean', 'Vietnamese', 'Thai', 'Filipino', 'Malay', 'Indonesian', 'East Asian', 'Mongolian', 'Tibetan'],
    'South Asian': ['Indian', 'Pakistani', 'Bengali', 'Sri Lankan', 'Tamil', 'Punjabi', 'Gujarati', 'South Asian', 'Nepalese', 'Marathi', 'Malayali'],
    'Native American': ['Mayan', 'Incan', 'Aztec', 'Pima', 'Karitiana', 'Surui', 'Quechua', 'Aymara', 'Native American', 'Andean', 'Central American', 'Amazonian', 'Eastern Woodland', 'Plains Indigenous', 'Southwest Indigenous', 'Arctic Indigenous', 'North American', 'Caribbean Indigenous', 'Taino', 'Navajo', 'Cherokee', 'Sioux', 'Ojibwe', 'Apache', 'Inuit', 'Iroquois', 'Cree', 'Metis', 'Yanomami', 'Nahua', 'Maya', 'Guarani', 'Mapuche', 'Indigenous', 'Beringian'],
    'Oceanian': ['Melanesian', 'Papuan', 'Australian Aboriginal', 'Polynesian', 'Micronesian', 'Hawaiian', 'Samoan', 'Chamorro', 'Oceanian', 'Fijian'],
  };
  for (const [group, members] of Object.entries(groups)) {
    if (group === target && members.includes(snpSubpop)) return true;
    if (snpSubpop === group && members.includes(target)) return true;
    if (members.includes(snpSubpop) && members.includes(target)) return true;
  }
  return false;
}

const HAPLO_WEIGHT = 4; // Lowered from 10 to prevent haplogroup override

const REGION_CODES: Record<string, string> = {
  AFR: 'African',
  EUR: 'European',
  EAS: 'East Asian',
  AMR: 'Native American',
  SAS: 'South Asian',
  MENA: 'Middle Eastern',
  OCE: 'Oceanian',
  NAFR: 'North African'
};

/**
 * Solves for population proportions using a constrained least squares approach (gradient descent).
 * Minimizes sum(w_j * (sum_i(p_i * f_ij) - g_j/2)^2) subject to sum(p_i) = 1 and p_i >= 0.
 */
function solveLeastSquares(
  genotypes: number[], 
  frequencies: number[][], // [marker][continent]
  weights: number[], // [marker]
  iterations = 100
): number[] {
  const numMarkers = genotypes.length;
  if (numMarkers === 0) return [];
  const numContinents = frequencies[0].length;
  
  let proportions = new Array(numContinents).fill(1 / numContinents);
  const learningRate = 0.2;

  for (let iter = 0; iter < iterations; iter++) {
    const gradients = new Array(numContinents).fill(0);
    
    for (let j = 0; j < numMarkers; j++) {
      let prediction = 0;
      for (let i = 0; i < numContinents; i++) {
        prediction += proportions[i] * frequencies[j][i];
      }
      
      const error = prediction - genotypes[j] / 2;
      const w = weights[j];
      
      for (let i = 0; i < numContinents; i++) {
        gradients[i] += 2 * error * frequencies[j][i] * w;
      }
    }

    // Update with gradient descent
    for (let i = 0; i < numContinents; i++) {
      proportions[i] -= (learningRate * gradients[i]) / numMarkers;
      if (proportions[i] < 0) proportions[i] = 0;
    }

    // Project onto simplex (normalize)
    const sum = proportions.reduce((a, b) => a + b, 0);
    if (sum > 0) {
      proportions = proportions.map(p => p / sum);
    } else {
      proportions = new Array(numContinents).fill(1 / numContinents);
    }
  }
  
  return proportions;
}

export function calculateAncestryOracle(results: any[], yHaploRegion?: string | null, mtHaploRegion?: string | null) {
  const continentsToScore = [
    'African', 'European', 'East Asian', 'South Asian', 
    'Middle Eastern', 'Native American', 'Oceanian', 'North African'
  ];

  const CONTINENT_TO_CODE: Record<string, string> = {
    'African': 'AFR',
    'European': 'EUR',
    'East Asian': 'EAS',
    'Native American': 'AMR',
    'South Asian': 'SAS',
    'Middle Eastern': 'MENA',
    'North African': 'NAFR',
    'Oceanian': 'OCE'
  };

  const userGenotype: Record<string, string> = {};
  results.forEach(r => {
    const rsid = (r.rsid || r.markerId).toLowerCase();
    if (r.userGenotype && r.userGenotype !== '--') {
      userGenotype[rsid] = r.userGenotype;
    }
  });

  const anchorRsids = new Set(ANCHOR_AIMS.map(a => a.rsid.toLowerCase()));
  // Explicitly include the requested West African markers in the heavy weight set
  const DOUBLE_WEIGHT_MARKERS = new Set([
    "rs10456247", 
    "rs10456249", 
    "rs10456252", 
    "rs10456256",
    "rs10456243",
    "rs10456244",
    "rs10456245",
    "rs10456257",
    "rs10456259",
    "rs10456260",
    "rs10456261",
    "rs10456262",
    "rs10456263",
    "rs10456265",
    "rs10456266",
    "rs10456267",
    "rs10456268"
  ]);
  
  // 1. Collect all relevant markers with chrom/pos info
  // Exclude Y-DNA and mtDNA markers from continental admixture as they are lineage-specific
  const allMarkers = results
    .filter(r => {
      if (r.status === 'not_tested' || !r.chrom || r.pos === undefined) return false;
      if (r.gene === 'Y-DNA' || r.gene === 'mtDNA') return false;
      
      const chrom = r.chrom.replace('chr', '').toUpperCase();
      const n = parseInt(chrom);
      // Only use autosomal markers (1-22) for continental admixture
      return !isNaN(n) && n >= 1 && n <= 22;
    })
    .sort((a, b) => {
      const nA = parseInt(a.chrom.replace('chr', ''));
      const nB = parseInt(b.chrom.replace('chr', ''));
      if (nA !== nB) return nA - nB;
      return a.pos - b.pos;
    });

  if (allMarkers.length === 0) {
    return { continentalScores: {}, regionalScores: {}, deepScores: {}, continents: [], subPopulations: {}, subPopMarkers: {}, confidenceScore: 0 };
  }

  // 2. Segment-Based Continental Analysis (Windowing)
  const WINDOW_SIZE = 40; // SNPs per window
  const windowAssignments: string[] = [];
  const continentalCounts: Record<string, number> = {};
  continentsToScore.forEach(c => continentalCounts[c] = 0);

  const windowMarkers: any[][] = [];
  for (let i = 0; i < allMarkers.length; i += WINDOW_SIZE) {
    windowMarkers.push(allMarkers.slice(i, i + WINDOW_SIZE));
  }

  const matchesContinent = (markerContinent: string, targetContinent: string) => {
    if (!markerContinent) return false;
    const parts = markerContinent.split('/').map(p => p.trim());
    return parts.includes(targetContinent);
  };

  const subPopLogL: Record<string, Record<string, number>> = {}; // continent -> subpop -> logL
  const subPopMarkers: Record<string, any[]> = {};

  // Pre-calculate sub-populations for each continent and initialize markers
  const continentSubpopsMap: Record<string, string[]> = {};
  continentsToScore.forEach(continent => {
    const continentSubpopsSet = new Set<string>();
    SNP_DB.filter(s => matchesContinent(s.continent, continent) && s.subpop).forEach(s => continentSubpopsSet.add(s.subpop as string));
    ANCHOR_AIMS.filter(a => matchesContinent(a.region, continent) && a.subFrequencies).forEach(a => {
      if (a.subFrequencies) Object.keys(a.subFrequencies).forEach(sp => continentSubpopsSet.add(sp));
    });
    continentSubpopsMap[continent] = Array.from(continentSubpopsSet);
    
    continentSubpopsMap[continent].forEach(sp => {
      if (!subPopMarkers[sp]) subPopMarkers[sp] = [];
    });
  });

  for (const window of windowMarkers) {
    const windowGenotypes: number[] = [];
    const windowFrequencies: number[][] = [];
    const windowWeights: number[] = [];

    for (const marker of window) {
      const rsid = (marker.rsid || marker.markerId).toLowerCase();
      const genotype = userGenotype[rsid] || marker.userGenotype;
      if (!genotype) continue;

      const alleles = marker.alleles;
      let matchCount = 0;
      for (const char of genotype) {
        if (alleles.includes(char)) matchCount++;
      }
      
      windowGenotypes.push(matchCount);
      
      const markerFreqs: number[] = [];
      const aim = ANCHOR_AIMS.find(a => a.rsid.toLowerCase() === rsid);

      for (const continent of continentsToScore) {
        let freq = 0.01; // Lower default for non-matching continents to increase discrimination
        const code = CONTINENT_TO_CODE[continent];

        if (aim && aim.frequencies) {
          if (code && aim.frequencies[code] !== undefined) {
            freq = aim.frequencies[code];
          } else if (continent === 'North African' && aim.frequencies['MENA'] !== undefined) {
            freq = aim.frequencies['MENA'];
          } else if (continent === 'Middle Eastern' && aim.frequencies['NAFR'] !== undefined) {
            freq = aim.frequencies['NAFR'];
          }
        } else if (marker.frequencies) {
          if (code && marker.frequencies[code] !== undefined) {
            freq = marker.frequencies[code];
          } else if (continent === 'Native American' && marker.frequencies['Native_American_unadmixed'] !== undefined) {
            freq = marker.frequencies['Native_American_unadmixed'];
          } else if (continent === 'Native American' && marker.frequencies['AMR_admixed'] !== undefined) {
            freq = marker.frequencies['AMR_admixed'];
          } else if (continent === 'North African' && marker.frequencies['MENA'] !== undefined) {
            freq = marker.frequencies['MENA'];
          }
        } else if (matchesContinent(marker.continent, continent)) {
          freq = 0.8;
        }
        
        markerFreqs.push(Math.max(0.001, Math.min(0.999, freq)));
      }
      windowFrequencies.push(markerFreqs);

      const isHeavy = anchorRsids.has(rsid) || DOUBLE_WEIGHT_MARKERS.has(rsid);
      const isNamedPop = !!marker.subpop || !!aim?.subFrequencies;
      const weightMultiplier = isNamedPop ? 3.0 : (isHeavy ? 2.0 : 1.0);
      
      let effectiveSignificance = marker.significance;
      if (isNamedPop) effectiveSignificance = 'High';
      
      let significanceWeight = (effectiveSignificance === 'High' ? 2.0 : effectiveSignificance === 'Medium' ? 1.5 : 1.0);
      
      // Extra boost for High significance African markers (Increased to 4.0x for total weight of 8.0)
      if (effectiveSignificance === 'High' && matchesContinent(marker.continent, 'African')) {
        significanceWeight *= 4.0;
      }

      const weight = (aim?.weight || 1.0) * significanceWeight * weightMultiplier;
      windowWeights.push(weight);
    }

    // Solve Least Squares for this window
    const windowProportions = solveLeastSquares(windowGenotypes, windowFrequencies, windowWeights);
    
    if (windowProportions.length > 0) {
      windowProportions.forEach((prob, i) => {
        const continent = continentsToScore[i];
        continentalCounts[continent] += prob;
      });
      
      // For the segment map, we pick the top one
      let maxProb = -1;
      let topContinent = continentsToScore[0];
      windowProportions.forEach((p, i) => {
        if (p > maxProb) {
          maxProb = p;
          topContinent = continentsToScore[i];
        }
      });
      windowAssignments.push(topContinent);
    }

    // 3. Sub-population analysis - contribute to ALL continents
    for (const continent of continentsToScore) {
      if (!subPopLogL[continent]) subPopLogL[continent] = {};
      
      const continentSubpops = continentSubpopsMap[continent] || [];

      for (const sp of continentSubpops) {
        if (subPopLogL[continent][sp] === undefined) {
          subPopLogL[continent][sp] = 0;
        }

        for (const marker of window) {
          const rsid = (marker.rsid || marker.markerId).toLowerCase();
          const genotype = userGenotype[rsid] || marker.userGenotype;
          if (!genotype) continue;
          let matchCount = 0;
          for (const char of genotype) if (marker.alleles.includes(char)) matchCount++;

          const aim = ANCHOR_AIMS.find(a => a.rsid.toLowerCase() === rsid);
          let freq = 0.01;
          const code = CONTINENT_TO_CODE[continent];

          if (aim && aim.subFrequencies && aim.subFrequencies[sp] !== undefined) {
            freq = aim.subFrequencies[sp];
            subPopMarkers[sp].push({ rsid: aim.rsid, trait: aim.description, contribution: freq * (aim.weight || 1.0), genotype });
          } else if (isSubpopMatch(marker.subpop, sp)) {
            freq = 0.8;
            subPopMarkers[sp].push({ rsid: marker.rsid, trait: marker.trait, contribution: 2.0, genotype });
          } else if (aim && aim.frequencies && code && aim.frequencies[code] !== undefined) {
            // Fallback to continental frequency for sub-populations in that continent
            freq = aim.frequencies[code];
          } else if (marker.frequencies && code && marker.frequencies[code] !== undefined) {
            freq = marker.frequencies[code];
          } else if (matchesContinent(marker.continent, continent)) {
            freq = 0.5; // Neutral fallback if we know it's the right continent but don't have exact freq
          }

          const f = Math.max(0.001, Math.min(0.999, freq));
          const isNamedPop = !!marker.subpop || !!aim?.subFrequencies;
          const isHeavy = anchorRsids.has(rsid) || DOUBLE_WEIGHT_MARKERS.has(rsid);
          
          // Named populations get 3.0x weight multiplier as requested
          const weightMultiplier = isNamedPop ? 3.0 : (isHeavy ? 2.0 : 1.0);
          
          // We also treat them as 'High' significance
          let effectiveSignificance = marker.significance;
          if (isNamedPop) effectiveSignificance = 'High';
          
          let significanceWeight = (effectiveSignificance === 'High' ? 2.0 : effectiveSignificance === 'Medium' ? 1.5 : 1.0);
          
          const regionalMultiplier = isNamedPop ? 3.0 : 1.0;
          let weight = (aim?.weight || 1.0) * regionalMultiplier * weightMultiplier * significanceWeight;
          
          // Extra boost for High significance African markers (Increased to 4.0x for total weight of 8.0)
          if (effectiveSignificance === 'High' && matchesContinent(marker.continent, 'African')) {
            weight *= 4.0;
          }

          // Least Squares approach for sub-populations: minimize squared error
          // We subtract the error to make it a score (higher is better)
          const error = (matchCount / 2) - f;
          subPopLogL[continent][sp] -= weight * (error * error);
        }
      }
    }
  }

  // 4. Aggregate and Re-normalize Continental Scores
  const applyHaploWeight = (regionStr: string | null | undefined) => {
    if (!regionStr) return;
    continentsToScore.forEach(continent => {
      if (regionStr.includes(continent)) {
        continentalCounts[continent] = (continentalCounts[continent] || 0) + 1.5; // Virtual segments for haplogroups
      }
    });
  };
  applyHaploWeight(yHaploRegion);
  applyHaploWeight(mtHaploRegion);

  const totalSegments = Object.values(continentalCounts).reduce((a, b) => a + b, 0);
  const continentalScores: Record<string, number> = {};
  if (totalSegments > 0) {
    continentsToScore.forEach(c => {
      const pct = (continentalCounts[c] / totalSegments) * 100;
      if (pct > 0.05) continentalScores[c] = pct;
    });
  }

  // 5. Aggregate Sub-populations
  const subPopulations: Record<string, any[]> = {};
  for (const continent of Object.keys(subPopLogL)) {
    const subProbs = Object.entries(subPopLogL[continent])
      .map(([name, l]) => ({ name, prob: l }));
    
    let maxLog = -Infinity;
    for (const p of subProbs) if (p.prob > maxLog) maxLog = p.prob;
    const probs = subProbs.map(p => ({ name: p.name, prob: Math.exp(p.prob - maxLog) }));
    const totalProb = probs.reduce((s, p) => s + p.prob, 0);

    if (totalProb > 0) {
      const filtered = probs
        .map(p => ({
          name: p.name,
          percentage: (p.prob / totalProb) * 100,
          confidence: (p.prob / totalProb) * 100,
          topMarkers: (subPopMarkers[p.name] || [])
            .sort((a, b) => b.contribution - a.contribution)
            .slice(0, 5)
        }))
        .filter(p => p.percentage > 0);
      
      const filteredTotal = filtered.reduce((s, p) => s + p.percentage, 0);
      if (filteredTotal > 0) {
        subPopulations[continent] = filtered.map(p => ({
          ...p,
          percentage: (p.percentage / filteredTotal) * 100,
          confidence: (p.percentage / filteredTotal) * 100
        })).sort((a, b) => b.percentage - a.percentage);
      }
    }
  }

  // 6. Final Filtering and Normalization
  const filteredContinental = Object.entries(continentalScores).filter(([_, p]) => p > 0);
  const totalFiltered = filteredContinental.reduce((s, [_, p]) => s + p, 0);
  const normalizedContinental: Record<string, number> = {};
  if (totalFiltered > 0) {
    filteredContinental.forEach(([c, p]) => normalizedContinental[c] = (p / totalFiltered) * 100);
  }

  const oracleResults = Object.entries(normalizedContinental)
    .map(([continent, percentage]) => ({ continent, percentage }))
    .sort((a, b) => b.percentage - a.percentage);

  const regionalScores: Record<string, number> = {};
  Object.entries(subPopulations).forEach(([continent, pops]) => {
    const contProb = (normalizedContinental[continent] || 0) / 100;
    pops.forEach(p => {
      regionalScores[p.name] = (regionalScores[p.name] || 0) + (p.percentage * contProb);
    });
  });

  return {
    continentalScores: normalizedContinental,
    regionalScores,
    deepScores: regionalScores,
    continents: oracleResults,
    subPopulations,
    subPopMarkers,
    confidenceScore: Math.min(100, Math.round((allMarkers.length / 400) * 100))
  };
}

export interface HaplogroupNode {
  branchName: string;
  snp?: string[];
  mutations?: string[];
  region?: string;
  description?: string;
  children?: HaplogroupNode[];
}

export const Y_DNA_TREE: HaplogroupNode = {
  branchName: "Y-DNA Root (Adam)",
  snp: ["M168"],
  children: [
    {
      branchName: "Haplogroup A",
      snp: ["M91", "P97", "rs369315948", "rs2534636"],
      children: [
        { branchName: "Haplogroup A0-T", snp: ["V168", "L1088", "M31", "rs369315948"] },
        { branchName: "Haplogroup A0", snp: ["L991", "P97"] },
        { branchName: "Haplogroup A1", snp: ["P305"] },
        { branchName: "Haplogroup A1a", snp: ["M31", "rs9786088"] },
        { branchName: "Haplogroup A1b", snp: ["P108"] },
        { branchName: "Haplogroup A2", snp: ["M6", "rs9786112", "P28"] },
        { branchName: "Haplogroup A3", snp: ["M32", "rs9786096"] },
        { branchName: "Haplogroup A3a", snp: ["M28"] },
        { branchName: "Haplogroup A3b", snp: ["M220"] },
        { branchName: "Haplogroup A3b1", snp: ["M51"] },
        { branchName: "Haplogroup A3b2", snp: ["M13", "M171"] },
        { 
          branchName: "Haplogroup A00", 
          snp: ["FGC25932", "FGC25805", "YP2737", "FGC27036", "YP3298", "FGC26901", "Y126645", "FGC26916", "YP3230", "A12220", "FGC26580", "L1149", "FGC25576", "A4982", "YP2683", "A4984", "YP2995", "A4985", "YP3292", "A3807", "FGC25522", "YP2561", "FGC27152", "YP3359"] 
        }
      ]
    },
    {
      branchName: "Haplogroup B",
      snp: ["M60", "BY31586", "CTS10487", "M8862", "M181"],
      region: "Central/Southern Africa",
      description: "One of the oldest Y-DNA lineages, found primarily in Pygmy and San populations.",
      children: [
        {
          branchName: "B-M8633",
          snp: ["M8633", "CTS11573", "CTS1388", "M8691"],
          description: "A sub-branch of Haplogroup B defined by M8633."
        },
        {
          branchName: "B-V2342",
          snp: ["V2342", "BY14680", "L1453"],
          description: "A sub-branch of Haplogroup B defined by V2342."
        },
        {
          branchName: "Haplogroup B2",
          snp: ["M181", "rs9786208", "rs2032599"],
          children: [
            {
              branchName: "Haplogroup B2a",
              snp: ["M112", "rs9786154", "i4000027"],
              children: [
                { branchName: "Haplogroup B2a1", snp: ["M115"] }
              ]
            },
            {
              branchName: "Haplogroup B2b",
              snp: ["P85", "P90"],
              children: [
                { branchName: "Haplogroup B2b1", snp: ["M150", "i4000009"] },
                { branchName: "Haplogroup B2b2", snp: ["M152"] }
              ]
            }
          ]
        }
      ]
    },
    {
      branchName: "Haplogroup C",
      snp: ["M130", "i4000008"],
      children: [
        { branchName: "Haplogroup C-P39", snp: ["P39"] },
        { branchName: "Haplogroup C2", snp: ["M217", "rs2032621", "i4000043"] }
      ]
    },
    { branchName: "Haplogroup D", snp: ["M174", "i4000010"] },
    {
      branchName: "Haplogroup E",
      snp: ["M96", "P29", "rs9306841", "rs17306671", "rs9305854", "i4000014", "rs3900"],
      children: [
        {
          branchName: "Haplogroup E1a",
          snp: ["M33", "rs9786107", "i4000016"],
          region: "West Africa",
          description: "Found primarily in West Africa, especially in Mali and neighboring regions.",
          children: [
            { branchName: "Haplogroup E1a1", snp: ["M132"] }
          ]
        },
        {
          branchName: "Haplogroup E1b1a",
          snp: ["M2", "V38", "rs9785941", "rs9786172", "i4000012", "rs3904"],
          region: "African / West Africa",
          description: "The most common lineage in African populations, associated with the expansion of Bantu-speaking peoples.",
          children: [
            {
              branchName: "Haplogroup E1b1a1",
              snp: ["M180", "rs9786207"],
              children: [
                {
                  branchName: "Haplogroup E1b1a1a1",
                  snp: ["U175", "rs34195338"],
                  region: "West/Central Africa",
                  description: "A major lineage across West and Central Africa.",
                  children: [
                    {
                      branchName: "Haplogroup E1b1a1a1a",
                      snp: ["U174", "rs34166788"],
                      children: [
                        {
                          branchName: "Haplogroup E1b1a1a1a1",
                          snp: ["M191", "P86", "rs9786219", "i4000033"],
                          region: "West Africa",
                          description: "Very common in West African populations like the Yoruba and Igbo.",
                          children: [
                            { 
                              branchName: "Haplogroup E1b1a1a1a1a", 
                              snp: ["L485"],
                              children: [
                                { 
                                  branchName: "Haplogroup E1b1a1a1a1a1", 
                                  snp: ["U209"],
                                  children: [
                                    { branchName: "Haplogroup E1b1a1a1a1a1a", snp: ["M263.2"] }
                                  ]
                                },
                                { branchName: "Haplogroup E1b1a1a1a1a2", snp: ["L515"] },
                                { branchName: "Haplogroup E1b1a1a1a1a3", snp: ["L516"] },
                                { branchName: "Haplogroup E1b1a1a1a1a4", snp: ["L517"] }
                              ]
                            },
                            { branchName: "Haplogroup E1b1a1a1a2", snp: ["U290"] },
                            { branchName: "Haplogroup E1b1a1a1a3", snp: ["U181"] }
                          ]
                        }
                      ]
                    },
                    { branchName: "Haplogroup E1b1a1a1b", snp: ["M154"] }
                  ]
                },
                { branchName: "Haplogroup E1b1a1b", snp: ["M116.2"] },
                { branchName: "Haplogroup E1b1a1a2", snp: ["M58"] },
                { branchName: "Haplogroup E1b1a1a4", snp: ["M149"] },
                { branchName: "Haplogroup E1b1a1a5", snp: ["M155"] },
                { branchName: "Haplogroup E1b1a1a6", snp: ["M10"] },
                { branchName: "Haplogroup E1b1a1a7", snp: ["M200"] }
              ]
            },
            { branchName: "Haplogroup E1b1a2", snp: ["V38", "rs372947788"] }
          ]
        },
        {
          branchName: "Haplogroup E1b1b",
          snp: ["M215", "M35", "rs2032654", "rs375228668", "rs28357984"],
          region: "North Africa / Horn of Africa",
          children: [
            {
              branchName: "Haplogroup E1b1b1",
              snp: ["M35", "rs28357984", "i4000018", "rs9306842"],
              children: [
                {
                  branchName: "Haplogroup E1b1b1a",
                  snp: ["V68", "rs147571223"],
                  children: [
                    {
                      branchName: "Haplogroup E1b1b1a1",
                      snp: ["M78", "rs9305888", "i4000024"],
                      children: [
            { 
              branchName: "Haplogroup E1b1b1a1a", 
              snp: ["V12", "rs148064093"],
              children: [
                { branchName: "Haplogroup E1b1b1a1a1", snp: ["M224"] },
                { branchName: "Haplogroup E1b-Z834", snp: ["Z834"] }
              ]
            },
                        { 
                          branchName: "Haplogroup E1b1b1a1b", 
                          snp: ["V13", "rs11800462"],
                          region: "Balkans / Europe",
                          description: "Most common E1b1b branch in Europe, associated with the expansion of farming and later Bronze/Iron Age movements.",
                          children: [
                            { branchName: "Haplogroup E1b1b1a1b1", snp: ["P177", "CTS5876"] },
                            { branchName: "Haplogroup E-CTS5876", snp: ["CTS5876"], region: "Balkans", description: "A major subclade of V13 found primarily in the Balkan peninsula." }
                          ]
                        },
                        { branchName: "Haplogroup E1b1b1a1c", snp: ["V22", "rs149747468"] },
                        { branchName: "Haplogroup E1b1b1a1d", snp: ["V65", "rs149501565"] }
                      ]
                    },
                    { branchName: "Haplogroup E1b1b1a2", snp: ["V32", "rs200867114"] },
                    { branchName: "Haplogroup E1b1b1a3", snp: ["V264"] }
                  ]
                },
                {
                  branchName: "Haplogroup E1b1b1b1",
                  snp: ["M81", "rs9305948", "i4000025"],
                  children: [
                    { branchName: "Haplogroup E1b1b1b1a", snp: ["M107"] },
                    { branchName: "Haplogroup E1b1b1b1a1", snp: ["M183"] },
                    { branchName: "Haplogroup E1b1b1b2", snp: ["V257"] }
                  ]
                },
                { branchName: "Haplogroup E1b1b1b", snp: ["L19"] },
                {
                  branchName: "Haplogroup E1b1b1c",
                  snp: ["M123", "rs13304168", "i4000007"],
                  region: "Levant / Near East",
                  description: "Found at high frequencies in the Levant and among Jewish populations.",
                  children: [
                    { 
                      branchName: "Haplogroup E1b1b1c1", 
                      snp: ["M34", "rs13304169"],
                      children: [
                        { branchName: "Haplogroup E-L791", snp: ["L791"], region: "Levant / Europe", description: "Subclade common among Ashkenazi Jews and in the Levant." },
                        { branchName: "Haplogroup E1b1b1c1a", snp: ["L791"] }
                      ]
                    }
                  ]
                },
                { branchName: "Haplogroup E1b1b1d", snp: ["M293"] },
                { branchName: "Haplogroup E1b1b1e", snp: ["M329"] },
                { branchName: "Haplogroup E1b1b1f", snp: ["V68", "rs34523368"] },
                { branchName: "Haplogroup E1b1b1g", snp: ["V257", "rs34623369"] }
              ]
            }
          ]
        },
        { branchName: "Haplogroup E1c", snp: ["P72"] },
        { branchName: "Haplogroup E1c root", snp: ["M35.1"] },
        { branchName: "Haplogroup E2", snp: ["M75", "rs9786142", "i4000022"], children: [
          { branchName: "Haplogroup E2a", snp: ["M54"] }
        ] }
      ]
    },
    { branchName: "Haplogroup F", snp: ["M89", "rs2032626", "i4000004"] },
    {
      branchName: "Haplogroup G",
      snp: ["M201", "rs2032633", "i4000034"],
      children: [
        { branchName: "Haplogroup G1", snp: ["M285", "i4000047"] },
        {
          branchName: "Haplogroup G2",
          snp: ["P287"],
          children: [
            { branchName: "Haplogroup G2a", snp: ["P15", "i4000049"], children: [
              { branchName: "Haplogroup G2a-L1259", snp: ["L1259"] },
              { branchName: "Haplogroup G2a-L497", snp: ["L497"] },
              { branchName: "Haplogroup G2a-Z6552", snp: ["Z6552"] },
              { branchName: "Haplogroup G2a2b", snp: ["L140"], children: [
                { branchName: "Haplogroup G2a2b1", snp: ["U1"], children: [
                  { branchName: "Haplogroup G-L13", snp: ["L13"], region: "Europe", description: "A subclade of G2a common in Europe." },
                  { branchName: "Haplogroup G-Z2022", snp: ["Z2022"], region: "Europe", description: "A subclade of G2a found in Western Europe." }
                ] }
              ] }
            ] },
            { branchName: "Haplogroup G2b", snp: ["M377"] }
          ]
        }
      ]
    },
    {
      branchName: "Haplogroup H",
      snp: ["M69", "L901", "i4000021"],
      children: [
        { branchName: "Haplogroup H1", snp: ["M69"], children: [
          { branchName: "Haplogroup H1a1", snp: ["M2826"], children: [
          { branchName: "Haplogroup H-M82", snp: ["M82"] }
        ] },
        ] },
        { branchName: "Haplogroup H2", snp: ["P96"] },
        { branchName: "Haplogroup H3", snp: ["Z5857"] }
      ]
    },
    {
      branchName: "Haplogroup I",
      snp: ["M170", "rs2032628", "i4000038"],
      children: [
        {
          branchName: "Haplogroup I1",
          snp: ["M253"],
          children: [
            { branchName: "Haplogroup I1-Z2539", snp: ["Z2539"] },
            { branchName: "Haplogroup I1a", snp: ["DF29"], children: [
              { branchName: "Haplogroup I1a1", snp: ["L22", "rs35033377"] },
              { branchName: "Haplogroup I1a2", snp: ["Z58"], children: [
                { branchName: "Haplogroup I1a2a", snp: ["Z140"] }
              ] },
              { branchName: "Haplogroup I1a3", snp: ["Z63"] }
            ] },
            { branchName: "Haplogroup I1b", snp: ["Z131"] },
            { branchName: "Haplogroup I1c", snp: ["Z17943"] }
          ]
        },
        {
          branchName: "Haplogroup I2",
          snp: ["M438", "rs34833375"],
          children: [
            { branchName: "Haplogroup I2a", snp: ["L460", "P37.2"], children: [
              { branchName: "Haplogroup I2a-CTS10100", snp: ["CTS10100"] },
              { branchName: "Haplogroup I2a-CTS595", snp: ["CTS595"] },
              { branchName: "Haplogroup I2a1b", snp: ["M423"], children: [
                { branchName: "Haplogroup I2a1b1", snp: ["L161"] },
                { branchName: "Haplogroup I2a1b1a", snp: ["L621"] }
              ] }
            ] },
            { branchName: "Haplogroup I2b", snp: ["M223", "M436", "rs34933376"], children: [
              { branchName: "Haplogroup I2b1a", snp: ["M284"] }
            ] }
          ]
        }
      ]
    },
    {
      branchName: "Haplogroup J",
      snp: ["M304", "rs2032602", "i4000023"],
      children: [
        {
          branchName: "Haplogroup J1",
          snp: ["M267", "i4000029"],
          region: "Middle East / Semitic",
          description: "Associated with the expansion of Semitic languages and the Neolithic transition in the Near East.",
          children: [
            { branchName: "Haplogroup J1-BY4", snp: ["BY4"] },
            { branchName: "Haplogroup J1-BY8", snp: ["BY8"] },
            { branchName: "Haplogroup J1-FGC1713", snp: ["FGC1713"] },
            { branchName: "Haplogroup J1-FGC3723", snp: ["FGC3723"] },
            { branchName: "Haplogroup J1-FGC4415", snp: ["FGC4415"] },
            { branchName: "Haplogroup J1-FGC5", snp: ["FGC5"] },
            { branchName: "Haplogroup J1-FGC7", snp: ["FGC7"] },
            { branchName: "Haplogroup J1-FGC7944", snp: ["FGC7944"] },
            { branchName: "Haplogroup J1-L860", snp: ["L860"] },
            { branchName: "Haplogroup J1-S4924", snp: ["S4924"] },
            { branchName: "Haplogroup J1-YSC0000076", snp: ["YSC0000076"] },
            { branchName: "Haplogroup J1-Z640", snp: ["Z640"] },
            { branchName: "Haplogroup J1-ZS1282", snp: ["ZS1282"] },
            { 
              branchName: "Haplogroup J1a", 
              snp: ["P58", "Z2215"],
              region: "Arabian Peninsula / Levant",
              description: "The most common J1 branch, often called the 'Semitic' clade.",
              children: [
                {
                  branchName: "Haplogroup J1a2a1a",
                  snp: ["L147.1", "rs9306837", "P58", "i4000045", "rs34733374"],
                  children: [
                    { 
                      branchName: "Haplogroup J1-YSC0000234", 
                      snp: ["YSC0000234"],
                      children: [
                        { branchName: "Haplogroup J1a1a1", snp: ["L858", "rs35268486"], children: [
                          { branchName: "Haplogroup J-L829", snp: ["L829"], region: "Levant", description: "A subclade of J1 common in the Levant." }
                        ] },
                        { branchName: "Haplogroup J1-Z1884", snp: ["Z1884"], region: "Levant", description: "Common in the Levant and Mesopotamia." }
                      ]
                    },
                    { branchName: "Haplogroup J1a2a1a1", snp: ["L147.1"] },
                    { branchName: "Haplogroup J1a2a1a1a", snp: ["YSC0000234"] },
                    { branchName: "Haplogroup J1a2a1a2", snp: ["Z1884", "YSC0000234"] },
                    { branchName: "Haplogroup J1a2a1a2a1", snp: ["Z1884"] }
                  ]
                }
              ]
            },
            { branchName: "Haplogroup J1b", snp: ["L136", "rs34313364", "Z2223"] },
            { branchName: "Haplogroup J1c", snp: ["P56", "rs34433365"] }
          ]
        },
        {
          branchName: "Haplogroup J2",
          snp: ["M172", "rs2032604", "i4000030", "rs2032605"],
          region: "Mediterranean / Near East",
          description: "Associated with the spread of agriculture and maritime trade in the Mediterranean basin.",
          children: [
            { 
              branchName: "Haplogroup J2a", 
              snp: ["M410"],
              children: [
                { branchName: "Haplogroup J2a-PF5197", snp: ["PF5197"] },
                { branchName: "Haplogroup J2a1", snp: ["L26", "rs34459394"], children: [
                  { branchName: "Haplogroup J-Z7700", snp: ["Z7700"], region: "Mediterranean", description: "A subclade of J2a found in the Mediterranean region." }
                ] },
                { branchName: "Haplogroup J2a1a", snp: ["Z6046"] },
                { branchName: "Haplogroup J2a1b1a", snp: ["L558"] },
                { branchName: "Haplogroup J2a1h", snp: ["L24"], children: [
                  { branchName: "Haplogroup J2a1h1", snp: ["L25"] }
                ] },
                { branchName: "Haplogroup J2-Z6046", snp: ["Z6046"], region: "Iran / Caucasus", description: "Found in the Iranian plateau and the Caucasus." },
                { 
                  branchName: "Haplogroup J2c", 
                  snp: ["M67", "rs34123366"],
                  children: [
                    { branchName: "Haplogroup J2-L558", snp: ["L558"], region: "Greece / Anatolia", description: "Subclade common in the Aegean and Anatolia." }
                  ]
                },
                { branchName: "Haplogroup J2d", snp: ["M92", "rs34223367"] }
              ]
            },
            { branchName: "Haplogroup J2b", snp: ["M12", "M102"], children: [
              { branchName: "Haplogroup J2b1", snp: ["M205"] },
              { branchName: "Haplogroup J2b2", snp: ["M241"], children: [
                { branchName: "Haplogroup J2b2a", snp: ["L283"] }
              ] }
            ] }
          ]
        }
      ]
    },
    { branchName: "Haplogroup K", snp: ["M9", "i4000026"] },
    { branchName: "Haplogroup L", snp: ["M20"], children: [
      { branchName: "Haplogroup L1a", snp: ["M27"] },
      { branchName: "Haplogroup L1b", snp: ["M317"] },
      { branchName: "Haplogroup L1c", snp: ["M357"] }
    ] },
    { branchName: "Haplogroup M", snp: ["P256", "M4", "rs9786195", "i4000031", "rs369726477", "i4000036"], children: [
      { branchName: "Haplogroup M subclade", snp: ["M5"] },
      { branchName: "Haplogroup M1", snp: ["M106", "M186", "M189"] },
      { branchName: "Haplogroup M1b", snp: ["M104", "i4000015"] }
    ] },
    { branchName: "Haplogroup N", snp: ["M231", "rs2032630", "i4000035"], children: [
      { branchName: "Haplogroup N1a1", snp: ["M46", "Tat", "i4000041"], children: [
        { branchName: "Haplogroup N1a-VL29", snp: ["VL29"] },
        { branchName: "Haplogroup N-L1026", snp: ["L1026"], region: "Northern Europe", description: "A major subclade of N1a1 common in Finland and the Baltic region." },
        { branchName: "Haplogroup N-Z1936", snp: ["Z1936"], region: "Northern Europe", description: "A subclade of N1a1 found in Northern Europe." }
      ] },
      { branchName: "Haplogroup N1a2", snp: ["L666"] }
    ] },
    { branchName: "Haplogroup O", snp: ["M175", "rs2032631", "i4000011", "rs2032632"], children: [
      { branchName: "Haplogroup O-F100", snp: ["F100"] },
      { branchName: "Haplogroup O-F145", snp: ["F145"] },
      { branchName: "Haplogroup O1a", snp: ["M119", "i4000013"], children: [
        { branchName: "Haplogroup O1a1a", snp: ["M50"] }
      ] },
      { branchName: "Haplogroup O1b", snp: ["M268", "i4000017"] },
      { branchName: "Haplogroup O2", snp: ["M122", "rs2032636", "i4000019"] }
    ] },
    { branchName: "Haplogroup P", snp: ["M45", "i4000032"] },
    { branchName: "Haplogroup Q", snp: ["M242", "i4000054"], children: [
      { branchName: "Haplogroup Q1", snp: ["L232"] },
      { branchName: "Haplogroup Q1a", snp: ["MEH2"] },
      { branchName: "Haplogroup Q1a1", snp: ["M120"] },
      { branchName: "Haplogroup Q1a2", snp: ["M25"] },
      { branchName: "Haplogroup Q1b", snp: ["L275"], children: [
        { branchName: "Haplogroup Q1b-L53", snp: ["L53"] }
      ] },
      { branchName: "Haplogroup Q-M3", snp: ["M3", "i4000055", "rs3894"], children: [
        { branchName: "Haplogroup Q-M19", snp: ["M19"], region: "South America", description: "A subclade of Q-M3 common in South American indigenous populations." },
        { branchName: "Haplogroup Q-M194", snp: ["M194"], region: "South America", description: "A subclade of Q-M3 found in South America." },
        { branchName: "Haplogroup Q-M199", snp: ["M199"], region: "South America", description: "A subclade of Q-M3 found in South America." }
      ] }
    ] },
    {
      branchName: "Haplogroup R",
      snp: ["M207"],
      children: [
        {
          branchName: "Haplogroup R1",
          snp: ["M173"],
          children: [
            { branchName: "Haplogroup R1a", snp: ["M17", "M417", "i4000028", "rs3908"], children: [
              { branchName: "Haplogroup R1a-L664", snp: ["L664"] },
              { branchName: "Haplogroup R1a-Z284", snp: ["Z284"] },
              { branchName: "Haplogroup R1a1a", snp: ["M417", "rs34633373"] },
              { branchName: "Haplogroup R1a1a1", snp: ["Z645"], children: [
                { branchName: "Haplogroup R1a-Z283", snp: ["Z283"], children: [
                  { branchName: "Haplogroup R1a-Z282", snp: ["Z282"], children: [
                    { branchName: "Haplogroup R1a-Z280", snp: ["Z280"] },
                    { branchName: "Haplogroup R1a-M458", snp: ["M458"] }
                  ] }
                ] },
                { branchName: "Haplogroup R1a1a1b1", snp: ["Z283", "Z282"] },
                { branchName: "Haplogroup R1a1a1b1a", snp: ["Z280"] },
                { branchName: "Haplogroup R1a1a1b1a1", snp: ["M458"] },
                { branchName: "Haplogroup R1a-Z93", snp: ["Z93"], children: [
                  { branchName: "Haplogroup R1a-Z94", snp: ["Z94"], children: [
                    { branchName: "Haplogroup R1a-L657", snp: ["L657"] }
                  ] }
                ] },
                { branchName: "Haplogroup R1a1a1b2", snp: ["Z93"] },
                { branchName: "Haplogroup R1a1a1b2a", snp: ["Z94"] },
                { branchName: "Haplogroup R1a1a1b2a1a", snp: ["L657"] }
              ] }
            ] },
            { 
              branchName: "Haplogroup R1b", 
              snp: ["M343", "i4000063", "rs9786153"],
              region: "Western Europe",
              description: "The most common Y-DNA haplogroup in Western Europe, associated with the expansion of Indo-European speakers.",
              children: [
                { branchName: "Haplogroup R1b-Z2103", snp: ["Z2103"] },
                { branchName: "Haplogroup R1b1", snp: ["L278"] },
                { branchName: "Haplogroup R1b1a", snp: ["L754"] },
                { branchName: "Haplogroup R1b1a1b", snp: ["M269", "L23", "rs9786139", "rs9786714", "i400018", "rs9786153", "rs9786132", "rs34024838", "i4000064", "i4000062"], children: [
                  { branchName: "Haplogroup R1b1a1b1a", snp: ["L51", "M412", "rs9786064", "rs9786745"], children: [
                    { branchName: "Haplogroup R1b1a1b1a1", snp: ["L11", "P310", "P311", "rs9786080", "rs9786076", "i400021", "rs34233370"], children: [
                      { 
                        branchName: "Haplogroup R1b1a1b1a1a", 
                        snp: ["U106", "S21", "M405", "rs16981293", "i400035"],
                        region: "North Sea / Germanic",
                        description: "Common in Germanic-speaking populations of Northern Europe.",
                        children: [
                          { branchName: "Haplogroup R1b-L48", snp: ["L48"], region: "North Sea", description: "A major subclade of U106 found around the North Sea.", children: [
                            { branchName: "Haplogroup R1b-Z156", snp: ["Z156"] },
                            { branchName: "Haplogroup R1b-Z18", snp: ["Z18"] },
                            { branchName: "Haplogroup R1b-L1", snp: ["L1"], region: "North Sea", description: "A subclade of L48 found in Northern Europe." }
                          ] },
                          { branchName: "Haplogroup R1b1a1b1a1a1", snp: ["L48", "rs34533372"] }
                        ]
                      },
                      { 
                        branchName: "Haplogroup R1b1a1b1a2", 
                        snp: ["P312", "S116", "rs34276300", "i400038"],
                        region: "Atlantic / Italo-Celtic",
                        description: "Dominant in Western Europe, including the British Isles, France, and Iberia.",
                        children: [
                          { 
                            branchName: "Haplogroup R1b1a1b1a2a", 
                            snp: ["DF27"],
                            children: [
                              { branchName: "Haplogroup R1b-Z195", snp: ["Z195"], region: "Iberia", description: "The most common subclade of DF27, centered in the Iberian Peninsula." },
                              { branchName: "Haplogroup R1b1a1b1a2a1", snp: ["Z195"] }
                            ]
                          },
                          { 
                            branchName: "Haplogroup R1b1a1b1a2b", 
                            snp: ["U152", "S28", "rs1236440", "i400039"],
                            region: "Alpine / Central Europe",
                            children: [
                              { branchName: "Haplogroup R1b-L2", snp: ["L2"], region: "Alpine / Central Europe", description: "Common in the Alpine region and associated with the La Tène culture.", children: [
                                { branchName: "Haplogroup R1b-Z36", snp: ["Z36"] },
                                { branchName: "Haplogroup R1b-Z56", snp: ["Z56"] },
                                { branchName: "Haplogroup R1b-Z192", snp: ["Z192"] }
                              ] },
                              { branchName: "Haplogroup R1b-L20", snp: ["L20"] },
                              { branchName: "Haplogroup R1b1a1b1a2b1", snp: ["L2", "rs34433371"] }
                            ]
                          },
                          { 
                            branchName: "Haplogroup R1b1a1b1a2c", 
                            snp: ["L21", "S145", "M529", "rs11799226", "i400041"],
                            region: "British Isles / Atlantic",
                            description: "The dominant lineage in Ireland, Scotland, and Wales.",
                            children: [
                              { branchName: "Haplogroup R1b-M222", snp: ["M222"], region: "Northwest Ireland / Scotland", description: "Associated with the Ui Neill dynasties of Ireland." },
                              { branchName: "Haplogroup R1b-DF13", snp: ["DF13"], children: [
                                { branchName: "Haplogroup R1b-DF19", snp: ["DF19"] },
                                { branchName: "Haplogroup R1b-DF49", snp: ["DF49"] },
                                { branchName: "Haplogroup R1b-DF63", snp: ["DF63"] },
                                { branchName: "Haplogroup R1b-FGC11134", snp: ["FGC11134"] },
                                { branchName: "Haplogroup R1b-FGC5494", snp: ["FGC5494"] },
                                { branchName: "Haplogroup R1b-L513", snp: ["L513"] },
                                { branchName: "Haplogroup R1b-S1051", snp: ["S1051"] },
                                { branchName: "Haplogroup R1b-Z251", snp: ["Z251"] },
                                { branchName: "Haplogroup R1b-Z253", snp: ["Z253"] },
                                { branchName: "Haplogroup R1b-Z255", snp: ["Z255"] },
                                { branchName: "Haplogroup R1b-L1335", snp: ["L1335"], region: "Scotland", description: "The 'Pictish' marker." },
                                { branchName: "Haplogroup R1b-S68", snp: ["S68"], region: "Ireland", description: "The 'Leinster' marker." }
                              ] },
                              { branchName: "Haplogroup R1b-DF21", snp: ["DF21"] },
                              { branchName: "Haplogroup R1b-DF41", snp: ["DF41"] },
                              { branchName: "Haplogroup R1b1a1b1a2c1a1", snp: ["M222"] }
                            ]
                          }
                        ]
                      }
                    ] }
                  ] }
                ] }
              ]
            }
          ]
        },
        { branchName: "Haplogroup R2", snp: ["M124"] }
      ]
    },
    { branchName: "Haplogroup S", snp: ["M230", "i4000039"] },
    { branchName: "Haplogroup T", snp: ["M184", "i4000042"], children: [
      { branchName: "Haplogroup T-L131", snp: ["L131"] },
      { branchName: "Haplogroup T-P77", snp: ["P77"] },
      { branchName: "Haplogroup T1a", snp: ["M70"] }
    ] },
    { branchName: "Haplogroup CF", snp: ["P143", "rs2032625", "i4000003"] },
    { branchName: "Haplogroup CT", snp: ["M168", "rs2032624", "i4000001"] },
    { branchName: "Haplogroup DE", snp: ["M145", "rs2032623", "i4000002"] }
  ]
};

export function predictYDNAHaplogroup(yMap: Record<string, string>, rootNode: HaplogroupNode) {
  const testedMarkers: any[] = [];
  let bestNode: any = null;
  let bestPath: string[] = [];
  let maxDerivedCount = -1;

  // Create a lookup map for SNPs to quickly find their info
  const snpLookup = new Map<string, SNP>();
  for (const snp of SNP_DB) {
    if (snp.markerId) snpLookup.set(snp.markerId.toLowerCase(), snp);
    if (snp.rsid) snpLookup.set(snp.rsid.toLowerCase(), snp);
    if (snp.aliases) {
      for (const alias of snp.aliases) {
        snpLookup.set(alias.toLowerCase(), snp);
      }
    }
  }

  function getNodeStats(node: HaplogroupNode) {
    let pos = 0;
    let neg = 0;
    let total = 0;
    const markers: any[] = [];

    // IUPAC ambiguity codes mapping to constituent alleles
    const IUPAC_MAP: Record<string, string> = {
      'R': 'AG', 'Y': 'CT', 'S': 'GC', 'W': 'AT', 'K': 'GT', 'M': 'AC',
      'B': 'CGT', 'D': 'AGT', 'H': 'ACT', 'V': 'ACG', 'N': 'ACGT'
    };

    if (node.snp) {
      for (const snpId of node.snp) {
        if (!snpId) continue;
        const snpIdLower = snpId.toLowerCase();
        const snpInfo = snpLookup.get(snpIdLower);
        let genotype = yMap[snpIdLower];
        
        // If not found by primary ID, check all possible identifiers from snpInfo
        if (!genotype && snpInfo) {
          const keysToCheck = [
            snpInfo.markerId,
            snpInfo.rsid,
            ...(snpInfo.aliases || [])
          ].filter(Boolean) as string[];

          for (const k of keysToCheck) {
            const val = yMap[k.toLowerCase()];
            if (val) {
              genotype = val;
              break;
            }
          }
        }

        // Skip missing or invalid genotypes
        if (!genotype || genotype === '--' || genotype === '00' || genotype === '??' || genotype === '.') {
          continue;
        }

        // Normalize genotype: handle double letters (AA -> A), IUPAC codes (R -> AG), and case
        let normalized = genotype.toUpperCase();
        if (normalized.length === 2 && normalized[0] === normalized[1]) {
          normalized = normalized[0];
        } else if (normalized.length === 1 && IUPAC_MAP[normalized]) {
          normalized = IUPAC_MAP[normalized];
        }
        
        let isDerived = false;
        let isTested = false;

        if (snpInfo) {
          isTested = true;
          // Check if any of the user's alleles match any of the derived alleles.
          // This handles both single letters and IUPAC/ambiguous genotypes (e.g., 'R' matches 'G' if 'G' is derived).
          // For Y-DNA, we treat any presence of the derived allele as a positive (derived) state.
          for (const derivedAllele of snpInfo.alleles) {
            const da = derivedAllele.toUpperCase();
            // Check if the normalized genotype contains the derived allele
            // This handles both single letters and IUPAC/ambiguous genotypes
            if (normalized.includes(da)) {
              isDerived = true;
              break;
            }
          }
        } else {
          // Heuristic for Y-DNA: if we have a genotype for a marker in the tree but it's not in our DB,
          // we can't reliably determine if it's derived. We'll skip it to maintain accuracy.
          isTested = false;
        }

        if (isTested) {
          total++;
          if (isDerived) pos++;
          else neg++;
          
          markers.push({
            marker: snpId,
            genotype: genotype, // Keep original for display
            isDerived,
            trait: `Marker for ${node.branchName}`
          });
        }
      }
    }
    return { pos, neg, total, markers };
  }

  function walk(node: HaplogroupNode, path: string[] = [], cumulativeDerived = 0, cumulativeAncestral = 0) {
    const { pos, neg, markers } = getNodeStats(node);
    
    // Add markers to the global tested list
    testedMarkers.push(...markers);

    const currentPath = [...path, node.branchName];
    const currentDerived = cumulativeDerived + pos;
    const currentAncestral = cumulativeAncestral + neg;

    // A node is a valid part of a lineage if it's not strongly negative
    // (neg > pos) and its path from root is also not strongly negative.
    // We allow "missing" nodes (pos=0, neg=0).
    const isStronglyNegative = neg > pos && neg > 0;
    
    if (!isStronglyNegative) {
      // If this node has derived markers, it's a potential "best" node
      if (currentDerived > maxDerivedCount || (currentDerived === maxDerivedCount && currentPath.length > bestPath.length)) {
        if (pos > 0 || node.branchName === "Y-DNA Root (Adam)") {
          bestNode = node;
          bestPath = currentPath;
          maxDerivedCount = currentDerived;
        }
      }

      // Continue to children even if this node is missing (pos=0, neg=0)
      if (node.children) {
        for (const child of node.children) {
          walk(child, currentPath, currentDerived, currentAncestral);
        }
      }
    }
  }

  walk(rootNode);

  // Deduplicate tested markers (some might be shared or visited multiple times in complex trees)
  const uniqueMarkers = Array.from(new Map(testedMarkers.map(m => [m.marker, m])).values());

  return {
    predicted: bestNode && bestNode.branchName !== "Y-DNA Root (Adam)" ? {
      name: bestNode.branchName.replace("Haplogroup ", ""),
      marker: bestNode.snp ? bestNode.snp[0] : "Unknown",
      continent: bestNode.region || "Global",
      description: bestNode.description || `A paternal lineage characterized by the ${bestNode.snp?.[0] || 'specific'} marker.`
    } : null,
    testedMarkers: uniqueMarkers.sort((a, b) => (b.isDerived ? 1 : 0) - (a.isDerived ? 1 : 0)),
    path: bestPath
  };
}

export const STR_MARKERS = [
  "DYS391", "DYS389I", "DYS437", "DYS439", "DYS389II", "DYS438", "DYS426", "DYS393", "YCAII", "DYS390", 
  "DYS385", "Y-GATA-H4", "DYS388", "DYS447", "DYS19", "DYS392", "DYS458", "DYS455", "DYS454", "DYS464", 
  "DYS448", "DYS449", "DYS456", "DYS576", "CDY", "DYS460", "DYS459", "DYS570", "DYS607", "DYS442", 
  "DYS728", "DYS723", "DYS711", "DYR76", "DYR33", "DYS727", "DYR157", "DYS713", "DYS531", "DYS578", 
  "DYF395", "DYS590", "DYS537", "DYS641", "DYS472", "DYF406S1", "DYS511", "DYS557", "DYS490", "DYS446", 
  "DYS481", "DYS413", "DYS534", "DYS450", "DYS425", "DYS594", "DYS444", "DYS520", "DYS436", "DYS565", 
  "DYS572", "DYS617", "DYS568", "DYS487", "DYS640", "DYS492", "DYR112", "DYS518", "DYS614", "DYS626", 
  "DYS644", "DYS684", "DYS710", "DYS485", "DYS632", "DYS495", "DYS540", "DYS714", "DYS716", "DYS717", 
  "DYS505", "DYS556", "DYS549", "DYS589", "DYS522", "DYS494", "DYS533", "DYS636", "DYS575", "DYS638", 
  "DYS462", "DYS452", "DYS445", "Y-GATA-A10", "DYS463", "DYS441", "Y-GGAAT-1B07", "DYS525", "DYS712", 
  "DYS593", "DYS650", "DYS532", "DYS715", "DYS504", "DYS513", "DYS561", "DYS552", "DYS726", "DYS635", 
  "DYS587", "DYS643", "DYS497", "DYS510", "DYS434", "DYS461", "DYS435"
];

export const MT_DNA_TREE: HaplogroupNode = {
  branchName: "mtDNA Root (Mitochondrial Eve)",
  region: "Africa",
  description: "The common maternal ancestor of all living humans.",
  mutations: ["A263G", "A750G", "A1438G", "A4769G", "A8860G", "A15326G", "A1018G"],
  children: [
    {
      branchName: "Haplogroup L0",
      region: "Southern Africa",
      description: "One of the oldest maternal lineages, common among the Khoisan people.",
      mutations: ["T146C", "C182T", "A189G", "C195T", "T198C", "A247G", "A4312G", "G5460A", "G8251A", "A9123G", "A10115G", "T16187C", "C16189T", "T16223C", "G16230A", "T16278C", "C16311T"],
      children: []
    },
    {
      branchName: "Haplogroup L1",
      region: "Central / West Africa",
      description: "A very old lineage common in Central and West Africa.",
      mutations: ["C182T", "T16187C", "C16189T", "T16223C", "G16230A", "T16278C", "C16311T", "A4104G"],
      children: [
        { branchName: "Haplogroup L1b", mutations: ["T16126C", "C16187T", "C16189T", "T16223C", "G16230A", "T16278C", "C16311T"] },
        { branchName: "Haplogroup L1c", mutations: ["T16187C", "C16189T", "T16223C", "G16230A", "T16278C", "C16311T", "A16265G"] }
      ]
    },
    {
      branchName: "Haplogroup L2",
      region: "African",
      description: "The most common maternal lineage in Africa.",
      mutations: ["T152C", "A235G", "G247A", "C5250T", "A8206G", "T9086C", "A10115G", "C11944T", "A13590G", "A13803G", "T16278C", "T16311C"],
      children: [
        {
          branchName: "Haplogroup L2a",
          mutations: ["T16223C", "C16278T", "C16294T", "T16309C", "T16390C", "C16189T", "T16311C", "T16362C"],
          children: [
            {
              branchName: "Haplogroup L2a1",
              mutations: ["A16129G", "T16187C", "C16189T", "T16223C", "C16278T", "C16294T", "T16311C", "C4312T"],
              children: [
                {
                  branchName: "Haplogroup L2a1a",
                  mutations: ["A16129G", "T16187C", "C16189T", "T16223C", "C16278T", "C16294T", "T16311C", "T16362C"],
                  children: [
                    { branchName: "Haplogroup L2a1a1", mutations: ["C16166T"] },
                    { branchName: "Haplogroup L2a1a2", mutations: ["G16213A"] }
                  ]
                },
                {
                  branchName: "Haplogroup L2a1b",
                  mutations: ["A16129G", "T16187C", "C16189T", "T16223C", "C16278T", "C16294T", "T16311C", "T16362C", "A16265G"],
                  children: []
                },
                {
                  branchName: "Haplogroup L2a1c",
                  mutations: ["A16129G", "T16187C", "C16189T", "T16223C", "C16278T", "C16294T", "T16311C", "T16362C", "G16129A"],
                  children: []
                }
              ]
            }
          ]
        },
        {
          branchName: "Haplogroup L2b",
          mutations: ["C16189T", "T16223C", "C16278T", "C16294T", "T16311C", "T16362C"],
          children: [
            {
              branchName: "Haplogroup L2b1",
              mutations: ["A16129G", "T16187C", "C16189T", "T16223C", "C16278T", "C16294T", "T16311C"],
              children: []
            }
          ]
        },
        {
          branchName: "Haplogroup L2c",
          mutations: ["T16223C", "C16278T", "C16294T", "T16311C", "A16265G", "C16189T", "T16362C"],
          children: []
        }
      ]
    },
    {
      branchName: "Haplogroup L3",
      region: "East Africa / Global",
      description: "The ancestor of all non-African maternal lineages (M and N).",
      mutations: ["A769G", "A1018G", "C16311T", "T16311C", "A10398G", "A16230G", "T16189C"],
      children: [
        {
          branchName: "Haplogroup L3b",
          mutations: ["T16223C", "C16278T", "C16311T", "T16124C", "C16189T", "C16294T", "T16362C"],
          children: [
            {
              branchName: "Haplogroup L3b1",
              mutations: ["A16129G", "T16187C", "C16189T", "T16223C", "C16278T", "C16294T", "T16311C"],
              children: [
                {
                  branchName: "Haplogroup L3b1a",
                  mutations: ["A16129G", "T16187C", "C16189T", "T16223C", "C16278T", "C16294T", "T16311C", "T16362C"],
                  children: []
                }
              ]
            }
          ]
        },
        {
          branchName: "Haplogroup L3d",
          mutations: ["T16223C", "C16278T", "C16311T", "C16124T", "C16189T", "C16294T", "T16362C"],
          children: [
            {
              branchName: "Haplogroup L3d1",
              mutations: ["A16129G", "T16187C", "C16189T", "T16223C", "C16278T", "C16294T", "T16311C"],
              children: []
            }
          ]
        },
        {
          branchName: "Haplogroup L3e",
          mutations: ["T16223C", "C16278T", "C16327T", "T16223C", "C16189T", "C16294T", "T16311C", "T16362C"],
          children: [
            {
              branchName: "Haplogroup L3e1",
              mutations: ["A16129G", "T16187C", "C16189T", "T16223C", "C16278T", "C16294T", "T16311C"],
              children: []
            },
            {
              branchName: "Haplogroup L3e2",
              mutations: ["A16129G", "T16187C", "C16189T", "T16223C", "C16278T", "C16294T", "T16311C", "T16362C"],
              children: [
                {
                  branchName: "Haplogroup L3e2b",
                  mutations: ["A16129G", "T16187C", "C16189T", "T16223C", "C16278T", "C16294T", "T16311C", "T16362C", "A16265G"],
                  children: [
                    { branchName: "Haplogroup L3e2b1", mutations: ["C16124T"] },
                    { branchName: "Haplogroup L3e2b2", mutations: ["T16172C"] }
                  ]
                }
              ]
            }
          ]
        },
        {
          branchName: "Haplogroup L3f",
          mutations: ["T16223C", "C16292T", "C16311T", "T16209C", "C16189T", "C16278T", "C16294T", "T16362C"],
          children: [
            {
              branchName: "Haplogroup L3f1",
              mutations: ["A16129G", "T16187C", "C16189T", "T16223C", "C16278T", "C16294T", "T16311C"],
              children: [
                {
                  branchName: "Haplogroup L3f1b",
                  mutations: ["A16129G", "T16187C", "C16189T", "T16223C", "C16278T", "C16294T", "T16311C", "T16362C"],
                  children: [
                    { branchName: "Haplogroup L3f1b1", mutations: ["T16140C"] },
                    { branchName: "Haplogroup L3f1b2", mutations: ["C16168T"] }
                  ]
                }
              ]
            }
          ]
        },
        {
          branchName: "Haplogroup L3h",
          mutations: ["T16223C", "C16278T", "C16311T", "T16124C", "C16189T", "C16294T", "T16362C", "G16129A"],
          children: []
        },
        {
          branchName: "Haplogroup L3i",
          mutations: ["T16223C", "C16278T", "C16311T", "T16124C", "C16189T", "C16294T", "T16362C", "A16129G"],
          children: []
        },
        {
          branchName: "Haplogroup L3x",
          mutations: ["T16223C", "C16278T", "C16311T", "T16124C", "C16189T", "C16294T", "T16362C", "C16187T"],
          children: []
        },
        {
          branchName: "Haplogroup L4",
          mutations: ["T16124C", "C16189T", "T16223C", "C16278T", "C16294T", "T16311C", "T16362C"],
          children: []
        },
        {
          branchName: "Haplogroup L5",
          mutations: ["T16124C", "C16189T", "T16223C", "C16278T", "C16294T", "T16311C", "T16362C", "C16187T"],
          children: []
        },
        {
          branchName: "Haplogroup L6",
          mutations: ["T16124C", "C16189T", "T16223C", "C16278T", "C16294T", "T16311C", "T16362C", "G16129A"],
          children: []
        },
        {
          branchName: "Haplogroup M",
          region: "Asian / Oceanian",
          description: "One of the two major macro-haplogroups that migrated out of Africa.",
          mutations: ["C10400T", "T14783C", "G15043A", "T489C"],
          children: [
            {
              branchName: "Haplogroup M1",
              mutations: ["T16129C", "C16189T", "T16223C", "C16249T", "T16311C"],
              children: []
            },
            {
              branchName: "Haplogroup C",
              region: "East Asian / Native American / Siberian",
              description: "Common in Central and East Asia, and one of the founding lineages of Native Americans.",
              mutations: ["T489C", "C10400T", "T14783C", "G15043A", "249d", "290d", "291d", "A3256T", "T11914A", "T14318C", "C16327T"],
              children: [
                { branchName: "Haplogroup C1", mutations: ["T16325C"] },
                { branchName: "Haplogroup C4", mutations: ["C16298T"] }
              ]
            },
            {
              branchName: "Haplogroup D",
              region: "East Asian / Native American / Siberian",
              description: "Widespread in East Asia and the Americas.",
              mutations: ["T489C", "C10400T", "T14783C", "G15043A", "T4883C", "G5178A", "T16362C"],
              children: [
                {
                  branchName: "Haplogroup D4",
                  mutations: ["C3010A"],
                  children: [
                    { branchName: "Haplogroup D4a", mutations: ["A16129G"] },
                    { branchName: "Haplogroup D4b", mutations: ["G15440A"] }
                  ]
                },
                {
                  branchName: "Haplogroup D5",
                  mutations: ["T16189C"],
                  children: []
                }
              ]
            },
            {
              branchName: "Haplogroup G",
              mutations: ["T489C", "C10400T", "T14783C", "G15043A", "A709G", "T4833C", "T5108C", "A16017G"],
              children: [
                { branchName: "Haplogroup G1", mutations: ["G16129A"] },
                { branchName: "Haplogroup G2", mutations: ["T16223C"] }
              ]
            },
            {
              branchName: "Haplogroup Z",
              mutations: ["T489C", "C10400T", "T14783C", "G15043A", "C152T", "A4248G", "C6752T", "T8020C", "T16185C", "C16260T"],
              children: []
            },
            {
              branchName: "Haplogroup E",
              mutations: ["G7598A", "G10817A", "T16390C"],
              children: []
            },
            {
              branchName: "Haplogroup Q",
              mutations: ["A16148G", "G16230A", "T16278C"],
              children: []
            },
            {
              branchName: "Haplogroup M7",
              mutations: ["A9824G"],
              children: [
                { branchName: "Haplogroup M7a", mutations: ["C16297T"] },
                { branchName: "Haplogroup M7b", mutations: ["T16297C"] }
              ]
            },
            {
              branchName: "Haplogroup M8",
              mutations: ["C4715T"],
              children: []
            },
            {
              branchName: "Haplogroup M9",
              mutations: ["E3394C"],
              children: []
            }
          ]
        },
        {
          branchName: "Haplogroup N",
          region: "Global (Non-African)",
          description: "One of the two major macro-haplogroups that migrated out of Africa; ancestor of most Eurasian lineages.",
          mutations: ["G8701A", "C9540T", "A10398G", "T10873C", "G15301A"],
          children: [
            {
              branchName: "Haplogroup A",
              region: "East Asian / Native American",
              description: "Common in East Asia and one of the founding lineages of Native Americans.",
              mutations: ["C152T", "A235G", "A663G", "A1736G", "T4248C", "A4824G", "C8794T", "C16290T", "G16319A"],
              children: [
                {
                  branchName: "Haplogroup A1",
                  mutations: ["C16223T", "C16290T", "G16319A", "T16362C", "C16189T", "C16278T", "C16294T"],
                  children: []
                },
                {
                  branchName: "Haplogroup A2",
                  mutations: ["A16111T", "C16223T", "C16290T", "G16319A", "T16362C", "C16189T", "C16278T", "C16294T"],
                  children: [
                    {
                      branchName: "Haplogroup A2a",
                      mutations: ["C3330T", "A16129G", "T16187C", "C16189T", "T16223C", "C16278T", "C16294T", "T16311C"],
                      children: []
                    },
                    {
                      branchName: "Haplogroup A2b",
                      mutations: ["G11365A", "A16129G", "T16187C", "C16189T", "T16223C", "C16278T", "C16294T", "T16311C", "T16362C"],
                      children: []
                    },
                    {
                      branchName: "Haplogroup A2c",
                      mutations: ["A16129G", "T16187C", "C16189T", "T16223C", "C16278T", "C16294T", "T16311C", "T16362C", "A16265G"],
                      children: []
                    }
                  ]
                },
                {
                  branchName: "Haplogroup A3",
                  mutations: ["C16223T", "C16290T", "G16319A", "T16362C", "C16189T", "C16278T", "C16294T", "T16311C"],
                  children: []
                },
                {
                  branchName: "Haplogroup A4",
                  mutations: ["T16362C", "T16223C", "C16290T", "G16319A", "C16189T", "C16278T", "C16294T"],
                  children: [
                    {
                      branchName: "Haplogroup A4a",
                      mutations: ["A16129G", "T16187C", "C16189T", "T16223C", "C16278T", "C16294T", "T16311C"],
                      children: []
                    }
                  ]
                },
                {
                  branchName: "Haplogroup A5",
                  mutations: ["C16223T", "C16290T", "G16319A", "T16362C", "C16189T", "C16278T", "C16294T", "T16311C", "A16265G"],
                  children: []
                }
              ]
            },
            {
              branchName: "Haplogroup I",
              mutations: ["A16391G", "G16129A", "T16187C", "C16189T"],
              children: []
            },
            {
              branchName: "Haplogroup S",
              mutations: ["T16189C", "C16228T"],
              children: []
            },
            {
              branchName: "Haplogroup Y",
              region: "East Asian",
              mutations: ["C16231T", "A16266G", "T16325C"],
              children: []
            },
            {
              branchName: "Haplogroup O",
              mutations: ["G16213A", "C16222T", "A16293G"],
              children: []
            },
            {
              branchName: "Haplogroup W",
              mutations: ["T1243C", "A3505G", "G8994A", "A11947G", "T15884C", "C16292T"],
              children: []
            },
            {
              branchName: "Haplogroup X",
              region: "Global (Eurasian / Native American)",
              description: "A rare haplogroup found in Europe, the Near East, and North America.",
              mutations: ["A153G", "T6221C", "C6371T", "A13966G", "T14470C", "T16189C", "C16278T"],
              children: []
            },
            {
              branchName: "Haplogroup R",
              mutations: ["T12705C", "T16223C"],
              children: [
                {
                  branchName: "Haplogroup F",
                  mutations: ["T16304C", "C16223T"],
                  children: [
                    {
                      branchName: "Haplogroup F1",
                      mutations: ["A16162G"],
                      children: []
                    },
                    {
                      branchName: "Haplogroup F2",
                      mutations: ["T16304C"],
                      children: []
                    }
                  ]
                },
                {
                  branchName: "Haplogroup P",
                  mutations: ["C16176T", "A16265G"],
                  children: []
                },
                {
                  branchName: "Haplogroup B",
                  region: "East Asian / Native American / Oceanian",
                  description: "Widespread in East Asia, Southeast Asia, and the Americas.",
                  mutations: ["8281-8289d", "A16189C", "T16217C"],
                  children: [
                    {
                      branchName: "Haplogroup B4",
                      mutations: ["T16217C"],
                      children: [
                        { branchName: "Haplogroup B4a1a1a", mutations: ["A16189C", "T16217C", "C16223T", "C16261T", "T16278C"] }
                      ]
                    },
                    {
                      branchName: "Haplogroup B5",
                      mutations: ["A16183C"],
                      children: []
                    }
                  ]
                },
                {
                  branchName: "Haplogroup U",
                  region: "European / West Asian / North African",
                  description: "A large and diverse haplogroup found throughout Eurasia and North Africa.",
                  mutations: ["A11467G", "A12308G", "G12372A"],
                  children: [
                    {
                      branchName: "Haplogroup U6",
                      mutations: ["A16172C", "C16219T"],
                      children: []
                    },
                    {
                      branchName: "Haplogroup U1",
                      mutations: ["A12870G"],
                      children: []
                    },
                    {
                      branchName: "Haplogroup U3",
                      mutations: ["A16343G"],
                      children: []
                    },
                    {
                      branchName: "Haplogroup U7",
                      mutations: ["A16318T"],
                      children: []
                    },
                    {
                      branchName: "Haplogroup K",
                      region: "European / West Asian",
                      description: "Common in Europe and the Near East.",
                      mutations: ["A1189C", "A3480G", "G9055A", "A10398G", "A10550G", "T11299C", "T14798C", "T16224C", "C16311T"],
                      children: [
                        {
                          branchName: "Haplogroup K1a",
                          mutations: ["T1189C"],
                          children: []
                        }
                      ]
                    }
                  ]
                },
                {
                  branchName: "Haplogroup JT",
                  mutations: ["T3394C", "T4216C", "G13708A", "G15452A", "T16126C"],
                  children: [
                    {
                      branchName: "Haplogroup J",
                      region: "Middle Eastern / European",
                      description: "Found throughout Europe and the Middle East, associated with the spread of farming.",
                      mutations: ["C295T", "T489C", "A10398G", "A12612G", "G13708A", "C16069T"],
                      children: [
                        {
                          branchName: "Haplogroup J1",
                          mutations: ["T16126C"],
                          children: []
                        },
                        {
                          branchName: "Haplogroup J2",
                          mutations: ["T16069C"],
                          children: []
                        }
                      ]
                    },
                    {
                      branchName: "Haplogroup T",
                      region: "European / West Asian",
                      description: "Found in Europe and the Near East, often associated with the spread of agriculture.",
                      mutations: ["G709A", "G1888A", "A4917G", "G8697A", "T10463C", "G11812A", "G13368A", "T14233C", "G14905A", "A15607G", "G15928A", "C16294T"],
                      children: [
                        {
                          branchName: "Haplogroup T1",
                          mutations: ["A16126G"],
                          children: []
                        },
                        {
                          branchName: "Haplogroup T2",
                          mutations: ["A11812G"],
                          children: []
                        }
                      ]
                    }
                  ]
                },
                {
                  branchName: "Haplogroup HV",
                  mutations: ["T14766C"],
                  children: [
                    {
                      branchName: "Haplogroup H",
                      region: "European / Middle Eastern",
                      description: "The most common maternal lineage in Europe.",
                      mutations: ["G2706A", "T7028C"],
                      children: [
                        {
                          branchName: "Haplogroup H1",
                          mutations: ["G3010A"],
                          children: [
                            {
                              branchName: "Haplogroup H1a",
                              mutations: ["T73A", "C16162T"],
                              children: []
                            },
                            {
                              branchName: "Haplogroup H1b",
                              mutations: ["T16189C", "T16356C"],
                              children: []
                            },
                            {
                              branchName: "Haplogroup H1c",
                              mutations: ["T477C"],
                              children: []
                            }
                          ]
                        },
                        {
                          branchName: "Haplogroup H2",
                          mutations: ["A1438G", "A4769G"],
                          children: [
                            {
                              branchName: "Haplogroup H2a",
                              mutations: ["A4769G"],
                              children: [
                                {
                                  branchName: "Haplogroup H2a1",
                                  mutations: ["G16153A"],
                                  children: []
                                },
                                {
                                  branchName: "Haplogroup H2a2",
                                  mutations: ["C750T"],
                                  children: [
                                    {
                                      branchName: "Haplogroup H2a2a",
                                      mutations: ["T16235C"],
                                      children: []
                                    }
                                  ]
                                }
                              ]
                            }
                          ]
                        },
                        {
                          branchName: "Haplogroup H3",
                          mutations: ["T6776C"],
                          children: [
                            { branchName: "Haplogroup H3a", mutations: ["A16129G"] },
                            { branchName: "Haplogroup H3b", mutations: ["G16129A"] }
                          ]
                        },
                        {
                          branchName: "Haplogroup H4",
                          mutations: ["T3992C", "A5004G", "G9123A"],
                          children: [
                            {
                              branchName: "Haplogroup H4a",
                              mutations: ["T4024C"],
                              children: []
                            }
                          ]
                        },
                        {
                          branchName: "Haplogroup H5",
                          mutations: ["T4336C"],
                          children: [
                            {
                              branchName: "Haplogroup H5a",
                              mutations: ["C16304T"],
                              children: []
                            }
                          ]
                        },
                        {
                          branchName: "Haplogroup H6",
                          mutations: ["T239C", "T16362C", "G16482A"],
                          children: [
                            {
                              branchName: "Haplogroup H6a",
                              mutations: ["T3394C"],
                              children: []
                            }
                          ]
                        },
                        {
                          branchName: "Haplogroup H7",
                          mutations: ["A4793G"],
                          children: []
                        },
                        {
                          branchName: "Haplogroup H10",
                          mutations: ["T73A"],
                          children: []
                        },
                        {
                          branchName: "Haplogroup H11",
                          mutations: ["T8448C"],
                          children: [
                            {
                              branchName: "Haplogroup H11a",
                              mutations: ["C16293T"],
                              children: []
                            }
                          ]
                        },
                        {
                          branchName: "Haplogroup H13",
                          mutations: ["G14872A"],
                          children: [
                            {
                              branchName: "Haplogroup H13a",
                              mutations: ["T2259C"],
                              children: []
                            }
                          ]
                        },
                        {
                          branchName: "Haplogroup H14",
                          mutations: ["T7645C"],
                          children: []
                        },
                        {
                          branchName: "Haplogroup H20",
                          mutations: ["C16218T"],
                          children: []
                        },
                        {
                          branchName: "Haplogroup H21",
                          mutations: ["G16129A", "T16187C"],
                          children: []
                        },
                        {
                          branchName: "Haplogroup H27",
                          mutations: ["C16129T", "T16187C"],
                          children: []
                        },
                        {
                          branchName: "Haplogroup H30",
                          mutations: ["A16129G", "T16187C"],
                          children: []
                        },
                        {
                          branchName: "Haplogroup H56",
                          mutations: ["A263G", "A750G", "A1438G", "A4769G", "A8860G", "T11788T", "A15326G"],
                          children: []
                        },
                        {
                          branchName: "Haplogroup H87",
                          mutations: ["A263G", "A750G", "A1438G", "A4769G", "G8188G", "A8860G", "A15326G"],
                          children: []
                        }
                      ]
                    },
                    {
                      branchName: "Haplogroup V",
                      region: "European / North African",
                      description: "Found primarily in Europe, particularly among the Saami people.",
                      mutations: ["G4580A", "A7256T", "C15904T", "T16298C"],
                      children: []
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    },
    {
      branchName: "Haplogroup L4",
      mutations: ["A16293G", "C16264T", "T195C"],
      children: []
    },
    {
      branchName: "Haplogroup L5",
      mutations: ["C16222T", "T16286C", "A16293G"],
      children: []
    },
    {
      branchName: "Haplogroup L6",
      mutations: ["G16213A", "C16222T", "A16293G"],
      children: []
    }
  ]
};

/**
 * Walks down the mtDNA tree to find the deepest matching maternal branch.
 * @param {Array} userMutations - Array of the user's mtDNA mutations (e.g., ["A769G", "G2706A"])
 * @param {Object} currentNode - The current branch of the tree
 * @returns {Array} - All nodes in the tree with their calculated scores
 */
export function predictMtHaplogroup(userMutations: string[], currentNode: any, currentPath: string[] = [], currentScore: number = 0): any[] {
  const matches = (currentNode.mutations || []).filter((m: string) => userMutations.includes(m)).length;
  const newScore = currentScore + matches;
  const newPath = [...currentPath, currentNode.branchName];
  
  let results = [{
    name: currentNode.branchName,
    score: newScore,
    path: newPath,
    matchCount: matches,
    region: currentNode.region,
    description: currentNode.description
  }];

  if (currentNode.children) {
    for (const child of currentNode.children) {
      results = results.concat(predictMtHaplogroup(userMutations, child, newPath, newScore));
    }
  }

  return results;
}

export function analyzeMtDNA(mtMap: Record<string, string>) {
  // Extract all possible mutations from the tree
  const allMutations = new Set<string>();
  function extractMutations(node: any) {
    if (node.mutations) {
      node.mutations.forEach((m: string) => allMutations.add(m));
    }
    if (node.children) {
      node.children.forEach((child: any) => extractMutations(child));
    }
  }
  extractMutations(MT_DNA_TREE);

  // Check which mutations the user has
  const userMutations: string[] = [];
  const testedMarkers: { mutation: string, pos: string, derived: string, ancestral: string, status: 'derived' | 'ancestral' }[] = [];
  
  allMutations.forEach(mutation => {
    // Mutation format is like "A769G" (Ancestral + Pos + Derived)
    // Some mutations might be like "8281-8289d" (deletion)
    if (mutation.includes('d')) {
      // For deletions, we'll just check if the user has a dash or something
      // This is a bit simplified for now
      return;
    }

    const ancestral = mutation[0];
    const derived = mutation.slice(-1);
    const pos = mutation.slice(1, -1);
    
    const userAllele = mtMap[pos];
    
    if (userAllele === derived) {
      userMutations.push(mutation);
      testedMarkers.push({ mutation, pos, derived, ancestral, status: 'derived' });
    } else if (userAllele === ancestral) {
      testedMarkers.push({ mutation, pos, derived, ancestral, status: 'ancestral' });
    }
  });

  const allResults = predictMtHaplogroup(userMutations, MT_DNA_TREE);
  
  // Sort by score (total matches in path) descending, then by path length (specificity) descending
  allResults.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return b.path.length - a.path.length;
  });

  const bestMatch = allResults[0];
  const predictedHaplogroup = bestMatch.name;
  
  return {
    predicted: predictedHaplogroup !== "mtDNA Root (Mitochondrial Eve)" ? predictedHaplogroup : null,
    path: predictedHaplogroup !== "mtDNA Root (Mitochondrial Eve)" ? bestMatch.path : [],
    region: bestMatch.region || "Global",
    description: bestMatch.description || "",
    testedMarkers,
    userMutations,
    score: bestMatch.score
  };
}
