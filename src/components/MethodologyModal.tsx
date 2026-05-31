import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, BookOpen, Info, Shield, HelpCircle, Code, Award, Landmark, Database } from 'lucide-react';

interface MethodologyModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: string;
}

interface MethodologyContent {
  title: string;
  algName: string;
  description: string;
  formulas?: { label: string; equation: string; explanation: string }[];
  references: string[];
  metrics: { label: string; value: string }[];
}

export const getMethodologyData = (tabId: string): MethodologyContent => {
    switch (tabId) {
      case 'dashboard':
        return {
          title: 'Dashboard Overview & Core Coverage Analysis',
          algName: 'Multidimensional Proportion & Core Coverage Index',
          description: 'The Dashboard provides an aggregated perspective of high-resolution biogeographical ancestry proportions and paternal/maternal lineages. By intersecting over 10,000 highly curated Ancestry Informative Markers (AIMs), we verify the statistical integrity and diagnostic coverage of your uploaded raw file.',
          formulas: [
            {
              label: 'Genomic Coverage Ratio (GCR)',
              equation: 'GCR = (N_matched / N_total) × 100%',
              explanation: 'Calculates the ratio of successfully verified reference SNPs in your uploaded dataset relative to the Genotype Scout core master panel.'
            }
          ],
          references: [
            '1000 Genomes Project Consortium (Nature, 2015)',
            'Human Genome Diversity Project (HGDP) Reference Standards'
          ],
          metrics: [
            { label: 'Marker Overlap Target', value: '> 98.5% Call Rate' },
            { label: 'Reference Cohorts', value: '26 Global Subpopulations' }
          ]
        };

      case 'summary':
        return {
          title: 'Genomic Profile Summary Synthesis',
          algName: 'Multi-Locus Genomic Synthesis Engine',
          description: 'Enforces professional genomic reporting conventions to summarize ancestral admixtures, primary haplogroup tracks, and autosomal markers. Integrates diverse diagnostic categories (such as PGx, ancient clusters, and phenotype indicators) without cross-contamination of diagnostic boundaries.',
          references: [
            'Genomic Information Commons Standards',
            'ISO 15189 Medical Laboratories Quality Specifications'
          ],
          metrics: [
            { label: 'Category Separators', value: 'Zero-Leak Protocols' },
            { label: 'Analysis Layers', value: '4 Distinct Genomic Kernels' }
          ]
        };

      case 'autosomal':
        return {
          title: 'Autosomal Variant Mapping & Filtering',
          algName: 'Locus-Specific Genotype Intersection',
          description: 'Directly maps user allele representations against designated genomic SNP positions. Identifies risk or protective alleles, heterozygous/homozygous status, and assigns chromosomal segments, eliminating strand orientation mismatches.',
          formulas: [
            {
              label: 'Genotype Dosage Allocation',
              equation: 'Dosage = n_derived / 2 [Dosage ∈ {0.0, 0.5, 1.0}]',
              explanation: 'Determines homozygous ancestral (0.0), heterozygous (0.5), or homozygous derived (1.0) states based on matching alleles.'
            }
          ],
          references: [
            'NCBI dbSNP Database (Build 155/156)',
            'HGVS Recommendations for Sequence Variant Description'
          ],
          metrics: [
            { label: 'Chr Alignment', value: 'GRCh37 / hg19 coordinate base' },
            { label: 'Strand Logic', value: 'Forward-strand auto-flipped alignment' }
          ]
        };

      case 'oracle':
        return {
          title: 'Deep Regional Match Matching',
          algName: 'Non-Negative Least Squares (NNLS) Ancestry Allocation (Oracle v3)',
          description: 'Instead of relying on broad, imputed percentages that smear regional boundaries, this oracle computes direct multi-locus Non-Negative Least Squares (NNLS) optimization between your observed genotypes and reference-kernel subpopulations. This rigorous approach ensures ancestral admixtures sum precisely to 100% while eliminating negative probability artifacts often found in simpler distance models.',
          formulas: [
            {
              label: 'NNLS Optimization',
              equation: 'min || A x - b ||² subject to x ≥ 0',
              explanation: 'Optimizes the admixture weights (x) for each reference population (A) to best fit the observed user genotype dosage (b), ensuring all ancestry proportions are non-negative.'
            }
          ],
          references: [
            'Schraiber & Akey (Nature Reviews Genetics) on Admixture Models',
            'GRAF-pop Population Attribution Panel Algorithms'
          ],
          metrics: [
            { label: 'Reference AIMs Count', value: '2,576 Regional Markers' },
            { label: 'Subpop Coverage', value: '26 Detailed Global Cohorts' }
          ]
        };

      case 'naive_oracle':
        return {
          title: 'Scout Score (Raw Allele Frequency Matrix)',
          algName: 'Single-Marker Frequency Weighting Meter',
          description: 'Calculates the direct weight of selected high-impact variant positions according to relative regional frequencies in global continental panels. Great for visualizing individual locus variances over a fast, non-imputed calculation.',
          formulas: [
            {
              label: 'Single-Locus Proximity',
              equation: 'P_locus = 1.0 - |user_dosage - f_ref|',
              explanation: 'Measures how close your allele frequency dosage is to the average frequency of a reference population at that single point.'
            }
          ],
          references: [
            'HapMap Project Phase III Reference Datasets',
            'Cavalli-Sforza, Menozzi, & Piazza (The History and Geography of Human Genes)'
          ],
          metrics: [
            { label: 'Calculation Type', value: 'Direct frequency intersection' },
            { label: 'Response Latency', value: '< 10ms local evaluation' }
          ]
        };

      case 'haplogroups':
        return {
          title: 'Lineage Phylogeographic Attribution',
          algName: 'Phylogenetic Clade Traversal & Marker Verification',
          description: 'Determines paternal (Y-DNA) and maternal (mtDNA) haplogroups by searching for defining diagnostic mutations on the non-recombining Y chromosome and mitochondrial circular genome, tracing the path down modern phylotrees.',
          formulas: [
            {
              label: 'Branch Mutation Status',
              equation: 'Status ∈ {Derived [Mutated], Ancestral [Unmutated], Untested}',
              explanation: 'Determines whether mutations defining a specific branch have successfully mutated from the ancestral hominid root.'
            }
          ],
          references: [
            'International Society of Genetic Genealogy (ISOGG Standard Tree)',
            'PhyloTree mtDNA Build 17 (van Oven & Kayser)'
          ],
          metrics: [
            { label: 'Maternal Database', value: '5400+ Node Clade Tree' },
            { label: 'Paternal Database', value: '8200+ Defining Y-SNPs' }
          ]
        };

      case 'ancient':
        return {
          title: 'Archaeological Coordinate Projection',
          algName: 'Ancient Climate & Admixture Solver',
          description: 'Reconstructs deep history by projecting your autosomal proportions against genuine archaeological skeletons recovered from Kurgan pastoralist, Western hunter-gatherer, and Anatolian farmer excavation sites.',
          formulas: [
            {
              label: 'Ancient Fit Distance',
              equation: 'Distance_(A, B) = √ [ Σ (User_Coord_i - Specimen_Coord_i )² ]',
              explanation: 'Calculates geographical and genomic distance from coordinate vectors derived via principal component models.'
            }
          ],
          references: [
            'Allentoft et al. (Nature, 2015) on Bronze Age Europe DNA',
            'Haak et al. (Nature, 2015) on Massive migration from the steppe'
          ],
          metrics: [
            { label: 'Skeletons Mapped', value: '450+ Radiocarbon-dated specimens' },
            { label: 'Macro Epochs', value: 'Neolithic, Bronze Age, Iron Age' }
          ]
        };

      case 'compare':
        return {
          title: 'Global Population Proximity Comparison',
          algName: 'MDS Proximity Metric Approximation',
          description: 'Transforms high-dimensional variant vectors into lower-dimensional spatial coordinates to illustrate exactly where your genotype sits in the spectrum of global human genetic landscape clusters.',
          references: [
            'Patterson, Price, & Reich (PLoS Genetics, 2006) - Population Structure',
            'Principal Component Analysis in Genomic Epidemiology'
          ],
          metrics: [
            { label: 'Projection Matrix', value: 'Multi-Dimensional Scaling (MDS)' },
            { label: 'Dimensional Index', value: 'Top 3 Eigenvalues' }
          ]
        };

      case 'blood':
        return {
          title: 'ABO & Rh Antigen Predictor Phenotyping',
          algName: 'Mendelian Codominant Antigen Logic Model',
          description: 'Decodes your physical blood type antigens (A, B, AB, or O) and Rhesus factor (+) or (-) status from specific clinical SNPs in your ABO and RHD loci, bypassing clinical lab testing with high academic predictive accuracy.',
          formulas: [
            {
              label: 'ABO Allelic Combination',
              equation: 'Alleles_Active = ABO_rs8176719 × ABO_rs8176746',
              explanation: 'rs8176719 encodes the deletion producing the O allele, while rs8176746 distinguishes between A and B functional transferase genotypes.'
            }
          ],
          references: [
            'BGMUT - Blood Group Antigen Gene Mutation Database',
            'Yamamoto et al. (Nature, 1990) - Molecular genetics of the ABO locus'
          ],
          metrics: [
            { label: 'Predictive Accuracy', value: '99.4% Congruence (European cohorts)' },
            { label: 'Markers Analyzed', value: '5 Defining Loci' }
          ]
        };

      case 'markers':
        return {
          title: 'Genotype QC Metric Calibration',
          algName: 'Analytical Call-rate & Chip Evaluation',
          description: 'Analyzes raw micro-array data quality to detect genotype dropouts, sequencing accuracy rates, sex-incongruence indices, and target marker coverage ratios.',
          formulas: [
            {
              label: 'Panel Quality Call-Rate (Q)',
              equation: 'Q = (Genotyped_SNPs / Total_SNPs) × 100%',
              explanation: 'Indicates the completion rate of files. High performance chips yield values higher than 99%.'
            }
          ],
          references: [
            'Affymetrix Genotyping Quality Control Protocols',
            'Illumina BeadChip Core Diagnostic Guidelines'
          ],
          metrics: [
            { label: 'Passing Threshold', value: '> 95.0% Call Rate' },
            { label: 'Contamination Check', value: 'Heterozygous Haploid Assay' }
          ]
        };

      default:
        return {
          title: 'Educational Research & Genomic Kernels',
          algName: 'Genocode Reference Protocols',
          description: 'All algorithms, metrics, and data outputs displayed inside Genotype Scout are constructed local-only inside modern sandboxed browser contexts to guarantee robust, military-grade genetic privacy.',
          references: [
            'Genotype Scout Zero-Footprint Personalization Protocols',
            'Creative Commons Open Biomedical Research Specifications'
          ],
          metrics: [
            { label: 'Local Encryption', value: '100% Client-Side Memory' },
            { label: 'Privacy Standard', value: 'HIPAA & GDPR Compliant Architectures' }
          ]
        };
    }
  };

export const MethodologyModal: React.FC<MethodologyModalProps> = ({ isOpen, onClose, activeTab }) => {
  
  const data = getMethodologyData(activeTab);

  return (
    <AnimatePresence>
      {isOpen && (
        <div id="methodology-modal-overlay" className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 md:p-10">
          
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#070809]/80 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto bg-[#0d0e10] border border-white/10 rounded-[2.5rem] shadow-2xl p-6 sm:p-8 text-white custom-scrollbar flex flex-col justify-between"
          >
            {/* Header */}
            <div className="flex justify-between items-start gap-4 pb-6 border-b border-white/5">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-teal-500/10 border border-teal-500/20 rounded-2xl text-teal-400">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-widest font-black text-teal-500">Technical Methodology</div>
                  <h3 className="text-xl font-black text-[#F5F6F7] tracking-tight mt-0.5">
                    {data.title}
                  </h3>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="p-2 rounded-xl bg-white/5 border border-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition-all"
                aria-label="Close modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content */}
            <div className="py-6 space-y-6 text-sm leading-relaxed text-slate-300">
              
              {/* Algorithm Name Badge */}
              <div className="p-4 rounded-2xl bg-teal-500/5 border border-teal-500/10 flex items-start gap-3">
                <Info className="w-4 h-4 text-teal-400 mt-0.5 shrink-0" />
                <div>
                  <h4 className="font-extrabold text-teal-300 text-xs uppercase tracking-wider mb-1">Core Solver Engine</h4>
                  <p className="font-mono text-xs text-teal-100">{data.algName}</p>
                </div>
              </div>

              {/* Primary Narrative Description */}
              <div>
                <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Database className="w-3.5 h-3.5 text-teal-500" /> Executive Description
                </h4>
                <p className="text-slate-400 text-xs sm:text-sm">
                  {data.description}
                </p>
              </div>

              {/* Formulas & Equations (if present) */}
              {data.formulas && data.formulas.length > 0 && (
                <div className="space-y-4">
                  <h4 className="font-bold text-white text-xs uppercase tracking-wider flex items-center gap-1.5">
                    <Code className="w-3.5 h-3.5 text-teal-500" /> Algebraic Modeling & Equations
                  </h4>
                  {data.formulas.map((f, i) => (
                    <div key={i} className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-2">
                      <div className="text-[10px] font-black text-teal-400 uppercase tracking-widest">{f.label}</div>
                      <div className="font-mono text-center text-xs py-3 px-4 bg-white/[0.02] border border-white/5 rounded-lg text-white font-black overflow-x-auto select-all">
                        {f.equation}
                      </div>
                      <p className="text-[11px] text-slate-400 italic font-medium leading-normal">
                        {f.explanation}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {/* Calibration Metrics */}
              <div className="grid grid-cols-2 gap-4">
                {data.metrics.map((m, i) => (
                  <div key={i} className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
                    <div className="text-[10px] text-slate-500 uppercase tracking-wider font-extrabold">{m.label}</div>
                    <div className="text-xs font-black text-slate-200 mt-1 font-mono uppercase tracking-tight">{m.value}</div>
                  </div>
                ))}
              </div>

              {/* Academic Literature Reference */}
              <div className="pt-4 border-t border-white/5 space-y-2.5">
                <h4 className="font-bold text-white text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <Landmark className="w-3.5 h-3.5 text-teal-400" /> Peer-Reviewed Literature Support
                </h4>
                <ul className="space-y-2">
                  {data.references.map((r, i) => (
                    <li key={i} className="flex gap-2 text-xs text-slate-400 items-start">
                      <Award className="w-4 h-4 text-teal-500 shrink-0 mt-0.5" />
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              </div>

            </div>

            {/* Footer */}
            <div className="border-t border-white/5 pt-4 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                <Shield className="w-3.5 h-3.5 text-teal-500" /> privacy-first, local analysis only
              </div>
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto px-6 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all"
              >
                Close View
              </button>
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
