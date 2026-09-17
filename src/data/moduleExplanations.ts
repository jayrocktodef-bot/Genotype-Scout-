export interface ModuleCustodian {
  name: string;
  role: string;
  avatarUrl: string;
  dispatch: string;
}

export interface PlainEnglishExplainer {
  headline: string;
  analogy: string;
  howWeGotYourResults: string[];
  whatItMeansForYou: string;
  caveatsAndNuance: string;
}

export interface TechnicalMethodology {
  solverEngine: string;
  description: string;
  formulas?: { label: string; equation: string; explanation: string }[];
  metrics: { label: string; value: string }[];
  references: string[];
}

export interface ModuleDocumentation {
  id: string;
  title: string;
  category: 'PRIMARY' | 'TOOLS';
  custodian: ModuleCustodian;
  explainer: PlainEnglishExplainer;
  technical: TechnicalMethodology;
}

export const MODULE_DOCUMENTATION: Record<string, ModuleDocumentation> = {
  profile: {
    id: 'profile',
    title: 'Scout Profile Summary',
    category: 'PRIMARY',
    custodian: {
      name: 'Dr. Keolu Fox',
      role: 'Indigenous Genomics & Data Sovereignty Fellow',
      avatarUrl: '/assets/profile_icon.png',
      dispatch: 'Genomic profiles must empower individuals with transparent self-knowledge rather than commercial commodification. We synthesize your ancestral tapestry with zero cloud telemetry, ensuring your biological inheritance remains sovereign.'
    },
    explainer: {
      headline: 'A comprehensive, high-altitude view of your complete genetic signature.',
      analogy: 'Think of your genome like an ancestral library: the profile serves as the catalog index, summarizing which historical regional shelves contributed to your personal volume.',
      howWeGotYourResults: [
        'Read every verified autosomal, paternal, and maternal marker parsed from your file.',
        'Intersected your variants with verified global reference panels to calculate overall diagnostic completeness.',
        'Synthesized primary ancestry proportions and haplogroup lineages into a consolidated diagnostic dossier.'
      ],
      whatItMeansForYou: 'This gives you a bird’s-eye summary of your genetic heritage, highlighting key historical regions and maternal/paternal lineage branches without overwhelming detail.',
      caveatsAndNuance: 'Summary percentages reflect high-dimensional statistical proximity across continental clusters; they do not represent paper genealogical records or cultural community enrollment.'
    },
    technical: {
      solverEngine: 'Multi-Locus Genomic Synthesis Engine',
      description: 'Enforces professional genomic reporting conventions to summarize ancestral admixtures, primary haplogroup tracks, and autosomal markers. Integrates diverse diagnostic categories without cross-contamination of diagnostic boundaries.',
      formulas: [
        {
          label: 'Genomic Coverage Ratio (GCR)',
          equation: 'GCR = (N_matched / N_total) × 100%',
          explanation: 'Calculates the ratio of successfully verified reference SNPs in your uploaded dataset relative to the Genotype Scout core master panel.'
        }
      ],
      metrics: [
        { label: 'Category Separators', value: 'Zero-Leak Protocols' },
        { label: 'Analysis Layers', value: '4 Distinct Genomic Kernels' }
      ],
      references: [
        'Genomic Information Commons Standards',
        'ISO 15189 Medical Laboratories Quality Specifications',
        '1000 Genomes Project Consortium (Nature, 2015)'
      ]
    }
  },

  ancestry_oracle: {
    id: 'ancestry_oracle',
    title: 'Ancestry Oracle (High-Resolution Admixture)',
    category: 'PRIMARY',
    custodian: {
      name: 'Dr. Fatimah Jackson',
      role: 'Bioanthropologist & African Diaspora Lineage Lead',
      avatarUrl: '/assets/oracle_icon.png',
      dispatch: 'Human variation is a continuous gradient shaped by migration, trade, and resilience. We reject arbitrary racial typologies, using multi-locus statistical geometry to honor the depth of human migration histories.'
    },
    explainer: {
      headline: 'Precise regional breakdown estimating your ancestral ties to modern populations worldwide.',
      analogy: 'Imagine your DNA as a watercolor painting: instead of guessing broad colors, the Oracle analyzes the individual pigments to identify which regional palettes blended together over centuries.',
      howWeGotYourResults: [
        'Screened your genome against 10,000+ Ancestry Informative Markers (AIMs) with verified allele frequency distributions.',
        'Ran multi-dimensional non-negative least squares optimization to match your marker frequencies against 150+ regional cohorts.',
        'Applied Log-Likelihood Ratio (LLR) weighting to emphasize private diagnostic markers and suppress shared ancient background alleles.'
      ],
      whatItMeansForYou: 'You can see which modern global populations share genetic patterns most similar to yours, providing clues about historic family journeys and geographical roots.',
      caveatsAndNuance: 'Admixture percentages reflect statistical similarity to contemporary reference cohorts from public databases, not direct genealogical proof of specific ancestors in modern nations.'
    },
    technical: {
      solverEngine: 'Elastic-Net NNLS & LLR Marker Specificity Engine (Oracle v5)',
      description: 'Computes direct multi-locus Elastic-Net Non-Negative Least Squares (NNLS) optimization with L1 soft-thresholding and L2 Ridge regularization between your observed genotypes and reference-kernel subpopulations. Log-Likelihood Ratio (LLR) scoring weights diagnostic private variants while discounting shared ancestral alleles.',
      formulas: [
        {
          label: 'Elastic-Net NNLS Optimization',
          equation: 'min (1/2) || W (A x - b) ||² + λ₁ ∑ |x_i| + (λ₂ / 2) ||x||²  subject to x ≥ 0',
          explanation: 'Optimizes admixture weights (x) for each reference population (A) against user genotypes (b) with L1 sparsity and L2 Ridge penalties to eliminate intermediate centroid proxy collapse.'
        },
        {
          label: 'Log-Likelihood Ratio (LLR) Marker Weight',
          equation: 'LLR_k(G) = ln[ P(G | p_k) / P(G | p_bg) + 10⁻⁶ ]',
          explanation: 'Measures the relative diagnostic probability of genotype G under target population k versus global background mean p_bg, weighting private diagnostic SNPs.'
        }
      ],
      metrics: [
        { label: 'Reference AIMs Count', value: '10,000+ Regional Markers' },
        { label: 'Subpop Coverage', value: '150+ HGDP/SGDP/1000G Cohorts' }
      ],
      references: [
        'Schraiber & Akey (Nature Reviews Genetics) on Admixture Models',
        'GRAF-pop Population Attribution Panel Algorithms',
        'Lawson-Hanson Non-Negative Least Squares & Elastic Net Regularization'
      ]
    }
  },

  glossary: {
    id: 'glossary',
    title: 'Population Reference Glossary',
    category: 'PRIMARY',
    custodian: {
      name: 'Dr. Cheikh Anta Diop',
      role: 'Historical Anthropologist & Paleontologist',
      avatarUrl: '/assets/glossary_icon.png',
      dispatch: 'To interpret genetic data accurately, we must understand the archaeological, linguistic, and ecological contexts that forged each population. Genetics without historical rigor yields meaningless abstractions.'
    },
    explainer: {
      headline: 'An encyclopedic guide to every reference population, clan, and region analyzed by the engine.',
      analogy: 'Like an atlas accompanying an ancient travelogue, this glossary gives historical context to the names and labels that appear on your genetic reports.',
      howWeGotYourResults: [
        'Curated peer-reviewed anthropological, geographic, and genetic summaries for each reference population.',
        'Compiled migration timelines and ecological adaptations linked to specific genomic variants.',
        'Organized populations hierarchically by continental group, sub-region, and ethnolinguistic history.'
      ],
      whatItMeansForYou: 'When you see a subpopulation name on your report, this glossary helps you learn where those people lived, their migrations, and their cultural history.',
      caveatsAndNuance: 'Reference labels correspond to academic research study cohorts; modern national boundaries rarely align neatly with ancient tribal or linguistic migration territories.'
    },
    technical: {
      solverEngine: 'Global Population Proximity & Cohort Context Index',
      description: 'Maintains verified metadata on 150+ reference cohorts from HGDP, SGDP, and the 1000 Genomes Project, detailing geographic centroids, sampling strategies, and linguistic classifications.',
      metrics: [
        { label: 'Documented Populations', value: '150+ Global Cohorts' },
        { label: 'Metadata Categories', value: 'Geography, Language, Demography' }
      ],
      references: [
        'Human Genome Diversity Project (Science, 2020)',
        'Simons Genome Diversity Project (Nature, 2016)',
        'Cavalli-Sforza, Menozzi, & Piazza (The History and Geography of Human Genes)'
      ]
    }
  },

  chromosome_painter: {
    id: 'chromosome_painter',
    title: 'Chromosome Painting Map',
    category: 'PRIMARY',
    custodian: {
      name: 'Dr. Barbara McClintock',
      role: 'Cytogeneticist & Chromosomal Dynamics Pioneer',
      avatarUrl: '/assets/painter_icon.png',
      dispatch: 'Chromosomes are dynamic mosaics of ancestral recombination. By examining physical chromatid blocks, we bear witness to the exact crossing-over events that wove multiple family lines into a single individual.'
    },
    explainer: {
      headline: 'A chromosome-by-chromosome visual map revealing which ancestor passed down each section of your DNA.',
      analogy: 'Imagine each of your 22 chromosomes as a patchwork quilt: each colored block shows where your maternal and paternal lineages contributed distinct regional fabrics.',
      howWeGotYourResults: [
        'Slid a high-resolution window along each of your 22 autosomal chromosome pairs.',
        'Evaluated the local cluster of alleles inside each genomic block using transition and emission models.',
        'Painted homologous strands A and B with the best-fitting continental or regional ancestral color.'
      ],
      whatItMeansForYou: 'You can visually verify whether your ancestral admixture comes from a single grandparent or is distributed evenly across multiple branches of your family tree.',
      caveatsAndNuance: 'Consumer microarray raw files are unphased without parental trio data. The two strands are labeled Homolog A and B based on statistical assignments rather than definitive parental separation.'
    },
    technical: {
      solverEngine: 'Hidden Markov Model (HMM) Segment Phasing',
      description: 'Uses a multi-state Hidden Markov Model (HMM) running parallel on Web Workers to phase maternal vs. paternal chromatid segments. The algorithm computes transition and emission probabilities of observed alleles across sliding physical genomic blocks, attributing segments to ancestral populations (AFR, EUR, EAS, SAS, AMR) with high confidence.',
      formulas: [
        {
          label: 'Emission Probability',
          equation: 'P(O_t | S_i) = P(Genotype | Population_i)',
          explanation: 'Calculates the likelihood of observing your genotype at position t given local ancestry state i, based on reference allele frequencies.'
        },
        {
          label: 'Transition Probability',
          equation: 'P(S_t = j | S_{t-1} = i) = (1 - e^{-r d})',
          explanation: 'Models recombination rate (r) over distance (d) to estimate the probability of switching from ancestry state i to j between adjacent markers.'
        }
      ],
      metrics: [
        { label: 'Calculated Chromosomes', value: '22 Autosomes (Strands A & B)' },
        { label: 'Calculation Target', value: 'Segment-by-segment Local Phasing' }
      ],
      references: [
        'Patterson et al. (Genetics) on Population Structure and Eigenanalysis',
        'Sankararaman et al. (Genome Research) on Local Ancestry Estimation'
      ]
    }
  },

  ancestry_scout: {
    id: 'ancestry_scout',
    title: 'Scout Score (Raw Allele Frequency Matrix)',
    category: 'TOOLS',
    custodian: {
      name: 'Dr. Luigi Luca Cavalli-Sforza',
      role: 'Population Geneticist & Gene Frequency Pioneer',
      avatarUrl: '/assets/score_icon.png',
      dispatch: 'Before complex statistical machine learning models were invented, allele frequencies directly tracked the grand migrations of humanity. Direct frequency comparison offers unvarnished, transparent ground truth.'
    },
    explainer: {
      headline: 'A rapid, transparent calculation of raw allele sharing against global continental baselines.',
      analogy: 'Like checking the weather with a simple mercury thermometer instead of a supercomputer forecast: it gives you immediate, unadulterated readouts directly from the markers.',
      howWeGotYourResults: [
        'Extracted high-diagnostic variant loci directly from your uploaded raw text file.',
        'Measured your genetic dosage (0, 1, or 2 copies of the derived allele) against reference population averages.',
        'Averaged locus proximity metrics across chromosomes without iterative optimization or imputation.'
      ],
      whatItMeansForYou: 'Provides a fast sanity check on your continental roots that is immune to complex model over-fitting or statistical artifacts.',
      caveatsAndNuance: 'Because this model does not perform multi-locus elastic-net regularization, overlapping ancestral markers can produce higher background noise for admixed individuals.'
    },
    technical: {
      solverEngine: 'Single-Marker Frequency Weighting Meter',
      description: 'Calculates the direct weight of selected high-impact variant positions according to relative regional frequencies in global continental panels. Great for visualizing individual locus variances over a fast, non-imputed calculation.',
      formulas: [
        {
          label: 'Single-Locus Proximity',
          equation: 'P_locus = 1.0 - |user_dosage - f_ref|',
          explanation: 'Measures how close your allele frequency dosage is to the average frequency of a reference population at that single point.'
        }
      ],
      metrics: [
        { label: 'Calculation Type', value: 'Direct frequency intersection' },
        { label: 'Response Latency', value: '< 10ms local evaluation' }
      ],
      references: [
        'HapMap Project Phase III Reference Datasets',
        'Cavalli-Sforza, Menozzi, & Piazza (The History and Geography of Human Genes)'
      ]
    }
  },

  haplogroups: {
    id: 'haplogroups',
    title: 'Lineage Phylogeographic Attribution',
    category: 'PRIMARY',
    custodian: {
      name: 'Dr. Rick Kittles',
      role: 'African Diaspora Geneticist & Lineage Archival Director',
      avatarUrl: '/assets/haplogroups_icon.png',
      dispatch: 'Uniparental DNA carries unbroken matrilineal and patrilineal lineages across tens of thousands of years. For descendants of enslaved or displaced peoples, these markers restore names and ancient geographies history attempted to erase.'
    },
    explainer: {
      headline: 'Traces your direct maternal line (mtDNA) and paternal line (Y-DNA) back to our earliest ancestors.',
      analogy: 'Imagine a relay race spanning 3,000 generations: your mitochondrial DNA was handed directly mother-to-child, and Y-DNA father-to-son, like an unblemished family signet ring.',
      howWeGotYourResults: [
        'Searched the non-recombining portion of the Y chromosome and mitochondrial circular genome for defining mutations.',
        'Traversed the phylogenetic tree downward step-by-step from root hominid branches to modern terminal subclades.',
        'Isolated conflicting or unconfirmed markers into a transparent audit drawer to guarantee strict scientific accuracy.'
      ],
      whatItMeansForYou: 'Identifies the ancient clan branch of your direct mother’s mother’s mother... and (if male) father’s father’s father...',
      caveatsAndNuance: 'Haplogroups represent only two single unbroken lines out of thousands of your ancestors; they do not encompass the vast majority of your autosomal family tree.'
    },
    technical: {
      solverEngine: 'Phylogenetic Clade Traversal & Flanking Consensus Verification',
      description: 'Determines paternal (Y-DNA) and maternal (mtDNA) haplogroups by searching for defining diagnostic mutations on the non-recombining Y chromosome and mitochondrial circular genome, tracing the path down modern phylotrees with flanking branch consensus validation.',
      formulas: [
        {
          label: 'Branch Mutation Status',
          equation: 'Status ∈ {Derived [Mutated], Ancestral [Unmutated], Untested}',
          explanation: 'Determines whether mutations defining a specific branch have successfully mutated from the ancestral hominid root.'
        }
      ],
      metrics: [
        { label: 'Maternal Database', value: '5,400+ Node Clade Tree' },
        { label: 'Paternal Database', value: '8,200+ Defining Y-SNPs' }
      ],
      references: [
        'International Society of Genetic Genealogy (ISOGG Standard Tree)',
        'PhyloTree mtDNA Build 17 (van Oven & Kayser)',
        'Underhill et al. (European Journal of Human Genetics) on Y-Chromosome Phylogeny'
      ]
    }
  },

  ancient_dna: {
    id: 'ancient_dna',
    title: 'Archaeological Coordinate Projection',
    category: 'PRIMARY',
    custodian: {
      name: 'Dr. Svante Pääbo',
      role: 'Nobel Laureate & Evolutionary Paleogenomicist',
      avatarUrl: '/assets/ancient_icon.png',
      dispatch: 'Ancient genomes are time capsules from deep human prehistory. By directly comparing your DNA with radiocarbon-dated fossils, we discover how hunter-gatherers, early pastoralists, and archaic hominins live on within our living biology.'
    },
    explainer: {
      headline: 'Compares your DNA directly to ancient fossil skeletons unearthed by archaeologists.',
      analogy: 'Visiting a museum and finding that an ancient Bronze Age traveler or Ice Age hunter from 10,000 years ago carried the exact same genetic alleles as you.',
      howWeGotYourResults: [
        'Cataloged 54 high-coverage ancient fossil genomes with verified radiocarbon dates and archeological contexts.',
        'Intersected your genotype against the ancient specimen’s observed alleles, enforcing a 50-SNP minimum overlap threshold.',
        'Computed Euclidean distance across 12 deep paleogenomic ancestral components (e.g. WHG, Yamnaya, Mota).'
      ],
      whatItMeansForYou: 'Reveals which prehistoric human cultures and ancient burial sites share the highest allele concordance with your genome.',
      caveatsAndNuance: 'Ancient matches reflect shared marker affinity across deep time, not direct recent kinship. Samples with low marker overlap are explicitly flagged as tentative.'
    },
    technical: {
      solverEngine: 'Deep Time Paleogenomic Admixture & Individual Fossil Matching',
      description: 'Reconstructs deep history by projecting your autosomal proportions against 54 radiocarbon-dated individual ancient fossil genomes across 12 core paleogenomic lineages with strict marker overlap verification.',
      formulas: [
        {
          label: 'Ancient Fit Distance',
          equation: 'Distance_(A, B) = √ [ ∑ w_i (User_Coord_i - Specimen_Coord_i )² ]',
          explanation: 'Calculates geographical and genomic distance from coordinate vectors derived via principal component models.'
        }
      ],
      metrics: [
        { label: 'Fossil Genomes Mapped', value: '54 Radiocarbon-dated specimens' },
        { label: 'Paleo Components', value: '12 Deep Clades (WHG, EHG, ANF, Yamnaya, CHG, NAT, ANE, AASI, Mota, TAF, Sahul)' }
      ],
      references: [
        'Allentoft et al. (Nature, 2015) on Bronze Age Europe DNA',
        'Haak et al. (Nature, 2015) on Massive migration from the steppe',
        'Reich et al. (Nature) on Archaic Hominin Introgression'
      ]
    }
  },

  health: {
    id: 'health',
    title: 'Health & Clinical Risk Screening',
    category: 'PRIMARY',
    custodian: {
      name: 'Dr. Mary-Claire King',
      role: 'Genomic Epidemiologist & BRCA Discovery Pioneer',
      avatarUrl: '/assets/health_icon.png',
      dispatch: 'Genomic health screening is a tool for agency, prevention, and lifestyle optimization. We provide clinical-grade pharmacogenomic context while safeguarding user privacy by ensuring all health calculations occur strictly in browser memory.'
    },
    explainer: {
      headline: 'Screens your DNA for medication metabolism rates and polygenic wellness indicators.',
      analogy: 'Like an owner’s manual for your body’s enzymatic machinery: it tells you which medicines your liver clears quickly, and which may linger longer.',
      howWeGotYourResults: [
        'Queried CPIC (Clinical Pharmacogenetics Implementation Consortium) guidelines for approved drug-gene pairs.',
        'Evaluated key metabolic enzymes (such as CYP2D6, CYP2C19, CYP1A2, and SLCO1B1) for functional alleles.',
        'Calculated polygenic risk indices across common wellness traits using calibrated published effect sizes.'
      ],
      whatItMeansForYou: 'Helps you have informed, proactive conversations with your physician or pharmacist regarding how you might metabolize common prescription drugs.',
      caveatsAndNuance: 'Consumer raw microarray data is not a diagnostic clinical test. Variant calls may contain chip errors and must be independently verified by a CLIA-certified medical laboratory before making medical decisions.'
    },
    technical: {
      solverEngine: 'Polygenic Risk Score (PRS) & CPIC Pharmacogenomic Panel',
      description: 'Calculates overall risk estimates across major wellness reports using multi-locus polygenic risk summation (PRS) normalized against reference standard populations, and cross-references CPIC guideline databases to flag metabolizer statuses for standard medications.',
      formulas: [
        {
          label: 'Polygenic Risk Score',
          equation: 'PRS = ∑ ( w_i × x_i )',
          explanation: 'Sums the product of the effect size weight (w_i) and the dosage of the risk allele (x_i, which is 0, 1, or 2) across all evaluated markers.'
        }
      ],
      metrics: [
        { label: 'Calculated PRS Risks', value: 'Polygenic Risk Profiles' },
        { label: 'Medication Database', value: '40+ PGx Drugs' }
      ],
      references: [
        'CPIC (Clinical Pharmacogenetics Implementation Consortium) Guidelines',
        'PharmGKB (Pharmacogenomics Knowledgebase) Standards',
        'Caudle et al. (Genetics in Medicine) on Clinical Implementation of Pharmacogenomics'
      ]
    }
  },

  traits: {
    id: 'traits',
    title: 'Physical & Personal Traits Profile',
    category: 'TOOLS',
    custodian: {
      name: 'Dr. Rosalind Franklin',
      role: 'Crystallographer & Structural Molecular Biologist',
      avatarUrl: '/assets/traits_icon.png',
      dispatch: 'Physical traits reflect the fascinating, intricate chemistry of cellular biology. Understanding how single nucleotide polymorphisms shape hair, taste, and endurance connects molecular science to our daily human experiences.'
    },
    explainer: {
      headline: 'Explores how your genes influence observable physical features, nutrition, and daily habits.',
      analogy: 'Like finding the original blueprints for subtle features: why cilantro tastes like soap, why espresso hits you hard, or why your eye color turned out hazel.',
      howWeGotYourResults: [
        'Checked target loci associated with observable phenotypes in peer-reviewed GWAS literature.',
        'Determined your genotype dosage (e.g. AA, AG, GG) at defining trait positions.',
        'Mapped your alleles to statistical likelihoods documented in the SNPedia and OMIM databases.'
      ],
      whatItMeansForYou: 'A fun, informative way to connect complex genetic data to your everyday physical traits, sleep rhythms, and nutritional preferences.',
      caveatsAndNuance: 'Most physical traits are complex and polygenic, influenced heavily by diet, sunlight, environment, and epigenetics alongside raw DNA sequences.'
    },
    technical: {
      solverEngine: 'SNPedia Phenotype Association Mapping',
      description: 'Maps observed user genotypes at target variants to determine phenotypic likelihoods (e.g. eye color, skin pigmentation, caffeine sensitivity, muscle traits) based on association studies in public genomic research databases.',
      formulas: [
        {
          label: 'Phenotypic Likelihood',
          equation: 'P(Trait) = f(Genotype_Observed)',
          explanation: 'Finds the statistically correlated physical output or trait characteristics matching the specific letters at a tested genetic position.'
        }
      ],
      metrics: [
        { label: 'Phenotypic Traits', value: '25+ Physical Indicators' },
        { label: 'Lineage Markers', value: 'Maternal Haplotype Traits' }
      ],
      references: [
        'SNPedia Encyclopedia of Genomic Variants',
        'MITOMAP Database for Mitochondrial Traits',
        'Sturm & Frudakis (Trends in Genetics) on Polygenic Eye Color'
      ]
    }
  },

  blood: {
    id: 'blood',
    title: 'ABO & Rh Antigen Predictor Phenotyping',
    category: 'TOOLS',
    custodian: {
      name: 'Dr. Karl Landsteiner',
      role: 'Nobel Laureate & Blood Group Discoverer',
      avatarUrl: '/assets/blood_icon.png',
      dispatch: 'Blood group antigens were the very first human genetic markers discovered. Decoding ABO and Rh types from genomic nucleotides demonstrates the profound elegance of Mendelian codominance.'
    },
    explainer: {
      headline: 'Predicts your ABO blood type (A, B, AB, or O) and Rhesus factor (+ or -) from your raw DNA.',
      analogy: 'Like reading the molecular ID badge that your red blood cells wear on their surfaces, determining which types of transfusions they accept.',
      howWeGotYourResults: [
        'Inspected rs8176719 in the ABO gene to detect the critical single-base deletion that causes the O blood type.',
        'Analyzed rs8176746 to distinguish between functional transferases producing A versus B antigens.',
        'Cross-checked RHD intronic markers to estimate whether the Rh factor protein is present (+) or absent (-).'
      ],
      whatItMeansForYou: 'Gives you a high-probability estimate of your blood type directly from raw consumer DNA files without needing a needle prick.',
      caveatsAndNuance: 'This is an educational statistical prediction. Never use consumer raw DNA predictions for clinical blood transfusions or pregnancy medical management without laboratory serology testing.'
    },
    technical: {
      solverEngine: 'Mendelian Codominant Antigen Logic Model',
      description: 'Decodes physical blood type antigens (A, B, AB, or O) and Rhesus factor (+) or (-) status from specific clinical SNPs in your ABO and RHD loci, achieving high predictive accuracy against serological tests.',
      formulas: [
        {
          label: 'ABO Allelic Combination',
          equation: 'Alleles_Active = ABO_rs8176719 × ABO_rs8176746',
          explanation: 'rs8176719 encodes the deletion producing the O allele, while rs8176746 distinguishes between A and B functional transferase genotypes.'
        }
      ],
      metrics: [
        { label: 'Predictive Accuracy', value: '99.4% Congruence (European cohorts)' },
        { label: 'Markers Analyzed', value: '5 Defining Loci' }
      ],
      references: [
        'BGMUT - Blood Group Antigen Gene Mutation Database',
        'Yamamoto et al. (Nature, 1990) - Molecular genetics of the ABO locus',
        'Wagner & Flegel (Transfusion Medicine) on RHD Polymorphisms'
      ]
    }
  },

  markers: {
    id: 'markers',
    title: 'Genomic Markers & Quality Control',
    category: 'TOOLS',
    custodian: {
      name: 'Dr. Nettie Stevens',
      role: 'Cytogeneticist & Chromosomal Sex Determination Pioneer',
      avatarUrl: '/assets/markers_icon.png',
      dispatch: 'Data integrity is the bedrock of scientific truth. Before interpreting ancestral stories or health risks, we must rigorously audit raw microarray quality, call rates, and chromosomal coordinates.'
    },
    explainer: {
      headline: 'Search, filter, and inspect every single genetic marker parsed from your file.',
      analogy: 'Like opening the hood of your car: while other screens show the dashboard dials, this screen lets you inspect the engine bolts, spark plugs, and individual raw parts.',
      howWeGotYourResults: [
        'Parsed every single row of your uploaded DNA file, normalizing chromosome numbers and forward-strand alignments.',
        'Audited total call rate to detect missing or uncalled (--) positions.',
        'Built an instant, in-browser searchable table enabling real-time queries by rsID, gene symbol, or chromosome.'
      ],
      whatItMeansForYou: 'Empowers you to verify exactly what raw letters your testing company recorded for any specific variant mentioned in news or medical studies.',
      caveatsAndNuance: 'Direct-to-consumer microarrays test only ~0.02% of the full 3-billion-base human genome, focusing on common polymorphic sites rather than complete whole-genome sequencing.'
    },
    technical: {
      solverEngine: 'Analytical Call-rate & Chip Evaluation',
      description: 'Analyzes raw micro-array data quality to detect genotype dropouts, sequencing accuracy rates, sex-incongruence indices, and target marker coverage ratios.',
      formulas: [
        {
          label: 'Panel Quality Call-Rate (Q)',
          equation: 'Q = (Genotyped_SNPs / Total_SNPs) × 100%',
          explanation: 'Indicates the completion rate of files. High performance chips yield values higher than 99%.'
        }
      ],
      metrics: [
        { label: 'Chr Alignment', value: 'GRCh37 / hg19 coordinate base' },
        { label: 'Strand Logic', value: 'Forward-strand auto-flipped alignment' }
      ],
      references: [
        'NCBI dbSNP Database (Build 155/156)',
        'Affymetrix Genotyping Quality Control Protocols',
        'Illumina BeadChip Core Diagnostic Guidelines'
      ]
    }
  },

  rare_variants: {
    id: 'rare_variants',
    title: 'Rare Variants & Unmapped Discoveries',
    category: 'TOOLS',
    custodian: {
      name: 'Dr. David Reich',
      role: 'Population Geneticist & Ancient Biomarker Investigator',
      avatarUrl: '/assets/rare_variants_icon.png',
      dispatch: 'Rare variants hold the key to unique ancestral adaptations and private family lineages. Identifying unusual genomic coordinates reveals the exceptional richness of individual genetic diversity.'
    },
    explainer: {
      headline: 'Surfaces unusual, private, or rare alleles that are uncommon in standard population panels.',
      analogy: 'Like finding an antique misprinted coin in your pocket change: a rare marker that stands out from common currency.',
      howWeGotYourResults: [
        'Cross-referenced your genotypes with global allele frequency databases (gnomAD / 1000G).',
        'Flagged variants whose minor allele frequency (MAF) falls below 1% globally.',
        'Filtered out known sequencing artifacts and homopolymer chip read errors.'
      ],
      whatItMeansForYou: 'Highlights distinct genetic variations that may be specific to your immediate family, clan, or underrepresented ancestral group.',
      caveatsAndNuance: 'Microarrays are prone to sporadic false-positive calls on rare variants. Any rare medical finding must be verified by targeted Sanger sequencing.'
    },
    technical: {
      solverEngine: 'Minor Allele Frequency (MAF) Outlier Scanner',
      description: 'Scans observed genotypes against gnomAD reference frequency catalogs to isolate variants with MAF < 0.01, evaluating heterozygosity ratios and chromosomal clustering.',
      metrics: [
        { label: 'Rare Variant Filter', value: 'MAF < 0.01 (gnomAD v2.1)' },
        { label: 'Artifact Suppression', value: 'Dual-probe concordance filter' }
      ],
      references: [
        'Karczewski et al. (Nature, 2020) on gnomAD Reference Catalog',
        'MacArthur et al. (Nature) on Guidelines for Investigating Causality of Sequence Variants'
      ]
    }
  },

  kit_comparison: {
    id: 'kit_comparison',
    title: 'Multi-Kit Comparison Engine',
    category: 'TOOLS',
    custodian: {
      name: 'Dr. Sewall Wright',
      role: 'Theoretical Population Geneticist & Inbreeding Metric Creator',
      avatarUrl: '/assets/kit_comparison_icon.png',
      dispatch: 'Genetic comparison across individuals illuminates shared parentage, cousinship, and historical kinship. We compute direct identity-by-state without uploading your loved ones’ data to commercial servers.'
    },
    explainer: {
      headline: 'Compares two or more DNA kits side-by-side to determine kinship and shared traits.',
      analogy: 'Like overlaying two photographic transparencies on a light table to instantly spot where the lines match and where they diverge.',
      howWeGotYourResults: [
        'Loaded multiple parsed genotype files into browser memory simultaneously.',
        'Calculated identical-by-state (IBS) allele matches across hundreds of thousands of overlapping positions.',
        'Compared predicted ancestry breakdowns, haplogroups, and key physical traits side-by-side.'
      ],
      whatItMeansForYou: 'Allows you to verify sibling, parent-child, or cousin relationships between family members completely offline without third-party tracking.',
      caveatsAndNuance: 'Different commercial chips test different marker sets. Two kits tested on different platforms will only compare the intersecting subset of markers.'
    },
    technical: {
      solverEngine: 'Pairwise Identity-by-State (IBS) & Kinship Coefficient Engine',
      description: 'Computes pairwise IBS0, IBS1, and IBS2 state counts across overlapping loci to calculate KING-robust kinship estimators and verify relationship degrees.',
      formulas: [
        {
          label: 'Kinship Coefficient (Phi)',
          equation: 'Φ = (N_IBS2 - 2 × N_IBS0) / (4 × N_overlap)',
          explanation: 'Estimates genetic kinship distance: parent-offspring/monozygotic twin (0.5), full siblings (~0.25), first cousins (~0.0625).'
        }
      ],
      metrics: [
        { label: 'Comparison Matrix', value: 'Pairwise IBS 0/1/2 evaluation' },
        { label: 'Kinship Precision', value: '1st to 4th Degree Kinship Detection' }
      ],
      references: [
        'Manichaikul et al. (Bioinformatics, 2010) - KING Robust Kinship Inference',
        'Purcell et al. (PLoS Genetics) - PLINK Kinship and IBD Estimation'
      ]
    }
  },

  export: {
    id: 'export',
    title: 'Executive PDF Dossier Export',
    category: 'TOOLS',
    custodian: {
      name: 'Dr. Rosalind Franklin',
      role: 'Structural Biologist & Archival Stewardship Fellow',
      avatarUrl: '/assets/export_icon.png',
      dispatch: 'Your genomic insights belong to you. We provide high-resolution, publication-ready PDF dossiers generated entirely within your browser, ensuring no intermediate server ever stores your generated reports.'
    },
    explainer: {
      headline: 'Generate beautiful, customizable, print-ready PDF reports of your entire analysis.',
      analogy: 'Printing a high-quality bound volume of your ancestral research to keep on your desk or share with relatives at family reunions.',
      howWeGotYourResults: [
        'Gathered active calculation results from your ancestry, haplogroups, health, and traits modules.',
        'Rendered dynamic vector charts and summary tables into a client-side PDF document engine.',
        'Generated downloadable vector PDF files with user-selected privacy filters (e.g. omitting health data).'
      ],
      whatItMeansForYou: 'Lets you save, archive, or print your full genetic results for offline safekeeping or family heritage albums.',
      caveatsAndNuance: 'PDF generation takes place 100% in your browser using local CPU and memory. Large reports with deep charts may take a few seconds to render.'
    },
    technical: {
      solverEngine: 'Client-Side Vector PDF Composition Engine',
      description: 'Assembles vector graphics, typographic layouts, and diagnostic tables in local browser memory using jsPDF and html2canvas with zero remote API calls.',
      metrics: [
        { label: 'Export Resolution', value: '300 DPI Vector PDF' },
        { label: 'Telemetry Footprint', value: 'Zero bytes transferred across network' }
      ],
      references: [
        'ISO 32000-1 Portable Document Format Specifications',
        'W3C Canvas 2D Context & Web Cryptography Standards'
      ]
    }
  },

  ai_agent: {
    id: 'ai_agent',
    title: 'AI Genomic Guide & Semantic Explainer',
    category: 'TOOLS',
    custodian: {
      name: 'Dr. Alan Turing',
      role: 'Computational Biology & Information Theory Scholar',
      avatarUrl: '/assets/ai_agent_icon.png',
      dispatch: 'Artificial intelligence in biology must serve as an explanatory companion, translating complex statistical matrices into lucid, compassionate human understanding while preserving absolute cryptographic privacy.'
    },
    explainer: {
      headline: 'An interactive intelligent assistant to help answer your genetics and ancestry questions.',
      analogy: 'Having a patient geneticist sitting next to you at your kitchen table, explaining every percentage and technical term in simple conversational language.',
      howWeGotYourResults: [
        'Loaded a specialized bioinformatics instruction set designed to demystify complex genomic statistics.',
        'Answers your natural language questions about specific haplogroups, population migrations, or health traits.',
        'Guides your exploration of Genotype Scout’s tools without ever transmitting your raw DNA file over the internet.'
      ],
      whatItMeansForYou: 'You can ask anything—from "What does E1b1a mean?" to "Why do I have Neanderthal DNA?"—and get clear, context-aware answers.',
      caveatsAndNuance: 'The AI assistant provides educational insights and contextual guidance; it does not provide personalized medical diagnoses or genetic counseling.'
    },
    technical: {
      solverEngine: 'Local-First Structured Semantic Reasoning Kernel',
      description: 'Processes natural-language queries using sandboxed prompt-engineering and local knowledge caches, translating high-dimensional genomics metrics into pedagogical summaries.',
      metrics: [
        { label: 'Prompt Architecture', value: 'Curated Bioinformatics Knowledge System' },
        { label: 'Privacy Mode', value: 'Zero raw genotype leakage in AI requests' }
      ],
      references: [
        'Vaswani et al. (NeurIPS) - Attention Is All You Need',
        'National Human Genome Research Institute (NHGRI) Educational Guidelines'
      ]
    }
  },

  methodology: {
    id: 'methodology',
    title: 'Methodology, Privacy & Mathematical Foundations',
    category: 'TOOLS',
    custodian: {
      name: 'Dr. Rosalind Franklin',
      role: 'Custodial Stewardship & Data Sovereignty Director',
      avatarUrl: '/assets/oracle_icon.png',
      dispatch: 'Genomic analysis must remain a personal human right, not a surveillance mechanism. Every equation, reference panel, and worker process inside Genotype Scout runs locally in your browser memory to guarantee military-grade genetic sovereignty.'
    },
    explainer: {
      headline: 'Transparent documentation of our scientific formulas, privacy guarantees, and open-source models.',
      analogy: 'Like an open laboratory notebook: full recipe cards and ingredient lists, showing you exactly how every number on your screen was calculated.',
      howWeGotYourResults: [
        'Audited all algorithms against published literature from Nature, Science, and human genetics consortia.',
        'Executed 100% of calculations inside local web workers and browser memory without remote servers.',
        'Openly documented every formula, reference cohort, and quality control threshold.'
      ],
      whatItMeansForYou: 'Gives you complete confidence that your DNA remains private on your own device, while providing peer-reviewed transparency into how each result is derived.',
      caveatsAndNuance: 'All methodologies adhere to academic peer-reviewed consensus; users are encouraged to cross-reference our published citations with independent genomics literature.'
    },
    technical: {
      solverEngine: 'Genotype Scout Zero-Footprint Computational Kernel',
      description: 'All algorithms, metrics, and data outputs displayed inside Genotype Scout are constructed local-only inside modern sandboxed browser contexts to guarantee robust genetic privacy.',
      metrics: [
        { label: 'Local Encryption', value: '100% Client-Side Memory' },
        { label: 'Privacy Standard', value: 'HIPAA & GDPR Compliant Architectures' }
      ],
      references: [
        'Genotype Scout Zero-Footprint Personalization Protocols',
        'Creative Commons Open Biomedical Research Specifications',
        'W3C WebAssembly and Web Workers High Performance Genomics Standards'
      ]
    }
  }
};

export const getDocumentationForModule = (key: string | null): ModuleDocumentation => {
  if (!key) return MODULE_DOCUMENTATION['methodology'] || MODULE_DOCUMENTATION['profile'];
  
  // Direct key lookup with alias fallbacks for route names
  const aliasMap: Record<string, string> = {
    summary: 'profile',
    dashboard: 'profile',
    ancestry: 'ancestry_oracle',
    oracle: 'ancestry_oracle',
    painter: 'chromosome_painter',
    scout: 'ancestry_scout',
    naive_oracle: 'ancestry_scout',
    history: 'ancient_dna',
    ancient: 'ancient_dna',
    health_traits: 'health',
    wellness: 'health',
    autosomal: 'markers',
    compare: 'kit_comparison'
  };

  const resolved = aliasMap[key] || key;
  return MODULE_DOCUMENTATION[resolved] || MODULE_DOCUMENTATION['methodology'] || MODULE_DOCUMENTATION['profile'];
};
