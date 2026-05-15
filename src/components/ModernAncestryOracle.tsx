import React, { memo, useMemo, useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { ChevronDown, ChevronUp, Dna, History, User, MapPin, Download, Share2, FileImage, Loader2, Sparkles } from 'lucide-react';
import { PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, RadarChart, ResponsiveContainer, Tooltip } from 'recharts';
import { trackSickleCellHaplotype } from '../utils/ancestry/haplotypeTracker';
import { ChromosomePainter, ChromosomePainterRef } from './ChromosomePainter';
import { workerPoolEngine } from '../engines/ancestry/workerPoolEngine';
import { POPULATION_MAP } from '../utils/populationMapper';
import masterAims from '../data/master_aims_normalized.json';
import jsPDF from 'jspdf';

export const ModernAncestryOracle = memo(({ 
  results
}: { 
  results: any
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [viewMode, setViewMode] = useState<'primary' | 'comprehensive' | 'painter'>('primary');
  const painterRef = useRef<ChromosomePainterRef>(null);
  const [exporting, setExporting] = useState(false);
  const [calculatingLAI, setCalculatingLAI] = useState(false);
  const [localSegments, setLocalSegments] = useState<any>(null);

  useEffect(() => {
    return () => {
      workerPoolEngine.terminateAll();
    };
  }, []);

  const runHighResAnalysis = async () => {
    if (!results.allMarkers) return;
    setCalculatingLAI(true);
    try {
      const populations = Object.keys(POPULATION_MAP);
      const segments = await workerPoolEngine.runParallelAncestry(
        results.allMarkers,
        masterAims,
        populations
      );
      setLocalSegments(segments);
    } catch (err) {
      console.error("LAI Analysis Failed:", err);
    } finally {
      setCalculatingLAI(false);
    }
  };

  const segmentsToPainter = localSegments || results.segments || {};

  const exportAncestryReport = async () => {
    setExporting(true);
    try {
      const doc = new jsPDF({
        orientation: 'p',
        unit: 'mm',
        format: 'a4'
      });

      // Background
      doc.setFillColor(15, 23, 42);
      doc.rect(0, 0, 210, 297, 'F');

      // Header
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(28);
      doc.setFont('helvetica', 'bold');
      doc.text('GENOTYPE SCOUT', 105, 30, { align: 'center' });
      doc.setFontSize(10);
      doc.setTextColor(71, 85, 105);
      doc.text('PREMIUM GENOMIC ANCESTRY REPORT', 105, 38, { align: 'center' });

      // Add Snapshot
      if (painterRef.current) {
        const snapshot = painterRef.current.getSnapshot(3);
        doc.addImage(snapshot, 'PNG', 15, 50, 180, 220);
      }

      // Footer
      doc.setFontSize(8);
      doc.setTextColor(51, 65, 85);
      doc.text('© 2026 Genotype Scout Architect - Privacy-First Local Analysis', 105, 285, { align: 'center' });

      doc.save('GenotypeScout_Ancestry_Profile.pdf');
    } catch (err) {
      console.error("Export failed:", err);
    } finally {
      setExporting(false);
    }
  };
  
  const resultsToDisplay = viewMode === 'primary' ? results?.primary : results?.comprehensive;
  const continentalScores = resultsToDisplay?.continentalScores || {};
  
  const hbbMigration = useMemo(() => {
    return results.userSnps ? trackSickleCellHaplotype(results.userSnps) : null;
  }, [results.userSnps]);

  const chartData = useMemo(() => {
    return Object.entries(continentalScores).map(([key, value]) => ({
      subject: key === 'AMR' ? 'American' : (key === 'EAS' ? 'East Asian' : (key === 'SAS' ? 'South Asian' : (key === 'AFR' ? 'African' : (key === 'EUR' ? 'European' : key)))),
      A: Number(value),
      fullMark: 100,
    }));
  }, [continentalScores]);

  const hasData = Object.keys(continentalScores).length > 0;
  
  if (!hasData) {
    return (
      <div className="p-12 text-center text-slate-500">
        No Ancestry Results Available - Please load and process a valid dataset.
      </div>
    );
  }
  
  const getDisplayName = (code: string) => {
    const map: Record<string, string> = {
      'EUR': 'European',
      'AFR': 'African',
      'EAS': 'East Asian',
      'SAS': 'South Asian',
      'AMR': 'Native American'
    };
    return map[code] || code;
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-12"
    >
      {/* Standard Oracle Section */}
      <div className="p-8 sm:p-12 rounded-[2rem] sm:rounded-[3rem] bg-[#111213]/70 backdrop-blur-xl border border-white/10 shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h2 className="text-3xl sm:text-4xl font-black text-[#F5F6F7] mb-2 tracking-tighter">Ancestry Oracle V2</h2>
            <div className="flex flex-wrap items-center gap-3">
              <p className="text-xs sm:text-sm font-bold text-[#4599FF] uppercase tracking-widest">High-Precision Admixture Analysis</p>
            </div>
          </div>
          <div className="flex rounded-lg bg-black/40 p-1">
            <button
              onClick={() => setViewMode('primary')}
              className={`px-4 py-2 text-xs font-black uppercase tracking-widest rounded-md transition-colors ${viewMode === 'primary' ? 'bg-[#4599FF] text-white' : 'text-slate-500 hover:text-slate-300'}`}
            >
              Admixture
            </button>
            <button
              onClick={() => setViewMode('comprehensive')}
              className={`px-4 py-2 text-xs font-black uppercase tracking-widest rounded-md transition-colors ${viewMode === 'comprehensive' ? 'bg-[#4599FF] text-white' : 'text-slate-500 hover:text-slate-300'}`}
            >
              High-Res
            </button>
            <button
              onClick={() => setViewMode('painter')}
              className={`px-4 py-2 text-xs font-black uppercase tracking-widest rounded-md transition-colors ${viewMode === 'painter' ? 'bg-[#4599FF] text-white' : 'text-slate-500 hover:text-slate-300'}`}
            >
              Painter
            </button>
          </div>
        </div>

        {viewMode === 'painter' ? (
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
               <div>
                  <h4 className="text-xl font-black text-white">Chromosome Painting</h4>
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Local Ancestry Inference (LAI) visualization</p>
               </div>
               <div className="flex items-center gap-4">
                 {!localSegments && !results.segments && (
                   <button 
                    onClick={runHighResAnalysis}
                    disabled={calculatingLAI}
                    className="flex items-center gap-2 px-6 py-4 bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-900 text-white rounded-2xl text-xs font-bold uppercase tracking-widest transition-all shadow-xl shadow-emerald-500/20"
                   >
                     {calculatingLAI ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                     {calculatingLAI ? 'Synthesizing...' : 'Run Parallel High-Res LAI'}
                   </button>
                 )}
                 <button 
                  onClick={exportAncestryReport}
                  disabled={exporting}
                  className="flex items-center gap-2 px-6 py-4 bg-[#4599FF] hover:bg-blue-500 disabled:bg-blue-900 text-white rounded-2xl text-xs font-bold uppercase tracking-widest transition-all shadow-xl shadow-blue-500/20"
                 >
                   {exporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                   {exporting ? 'Generating PDF...' : 'Download High-Res Report'}
                 </button>
               </div>
            </div>
            <div className="min-h-[800px] relative">
              {calculatingLAI && (
                <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm rounded-[2rem]">
                  <div className="w-20 h-20 relative">
                    <Loader2 className="w-20 h-20 text-emerald-500 animate-spin" />
                    <Dna className="w-10 h-10 text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
                  </div>
                  <h5 className="text-xl font-black text-white mt-8 tracking-tight">Crunching 22 Chromosomes</h5>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-[0.2em] mt-2 italic">Multi-Threaded Worker Pool Active</p>
                </div>
              )}
              <ChromosomePainter ref={painterRef} segments={segmentsToPainter} />
            </div>
          </div>
        ) : (
          <>
            <div className="mb-10 rounded-2xl frosted-glass border border-white/5 text-[#F5F6F7]">
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full flex justify-between items-center p-6 text-left font-bold"
          >
            <h4>How this works</h4>
            {isExpanded ? <ChevronUp className="w-5 h-5"/> : <ChevronDown className="w-5 h-5"/>}
          </button>

          <motion.div
            initial={false}
            animate={{ height: isExpanded ? 'auto' : 0, opacity: isExpanded ? 1 : 0 }}
            className="overflow-hidden"
          >
            <p className="p-6 pt-0 text-sm text-slate-400 leading-relaxed">
              The Ancestry Oracle is not a classic "ethnicity calculator." While mainstream services use imputation to fill in genetic gaps based on statistical models, this engine processes your raw, exact genome data. By directly analyzing specific, high-precision Ancestry Informative Markers (AIMs), we produce results that reflect your unique genotype, providing a granular look at your genetic lineage without relying on probabilistic data smoothing.
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 sm:gap-12 items-center">
          <div className="h-[300px] sm:h-[450px] lg:col-span-2 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="65%" data={chartData} margin={{ top: 30, right: 30, bottom: 30, left: 30 }}>
                <PolarGrid stroke="#334155" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                <Radar
                  name="Ancestry"
                  dataKey="A"
                  stroke="#4599FF"
                  fill="#4599FF"
                  fillOpacity={0.3}
                />
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#475569', color: '#f8fafc', borderRadius: '1rem', backdropFilter: 'blur(8px)' }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          
          <div className="space-y-4 sm:space-y-6 lg:col-span-1">
            {Object.entries(continentalScores).map(([name, value]) => (
              <div key={name} className="flex items-center justify-between p-4 sm:p-6 rounded-xl sm:rounded-2xl bg-[#1a1b1d]/70 backdrop-blur-sm border border-white/5 hover:border-[#4599FF]/50 transition-colors">
                <span className="font-bold text-base sm:text-lg text-[#F5F6F7]">{getDisplayName(name)}</span>
                <span className="font-mono font-black text-lg sm:text-xl text-[#4599FF]">{Number(value).toFixed(1)}%</span>
              </div>
            ))}
          </div>
        </div>
        </>
      )}
    </div>


      {/* Forensic Detail Section */}
      {/* Whole panel details removed */}

      {/* Historical Haplotype Tracking for Sickle Cell / HBB */}
      {hbbMigration && (
        <div className="mt-12 p-8 rounded-[2rem] bg-red-500/5 border border-red-500/10 overflow-hidden relative group">
           <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
              <MapPin size={120} />
           </div>
           <div className="flex items-center gap-2 mb-6">
              <div className="p-1.5 rounded-lg bg-red-500/20">
                <MapPin className="w-4 h-4 text-red-500" />
              </div>
              <h4 className="text-sm font-black text-red-500 uppercase tracking-widest">Historical Haplotype Tracker</h4>
           </div>
           <div className="flex flex-col md:flex-row gap-8 relative z-10">
              <div className="flex-grow">
                 <div className="text-[10px] font-black text-red-500 uppercase tracking-[0.2em] mb-1">Variant Lineage Detected</div>
                 <h5 className="text-xl font-black text-white mb-4">{hbbMigration.type} Pattern (HBB)</h5>
                 <p className="text-sm text-slate-400 leading-relaxed max-w-xl">
                   {hbbMigration.narrative}
                 </p>
              </div>
              <div className="min-w-[280px] p-6 rounded-2xl bg-black/40 border border-white/5">
                 <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-4">Migration Path</div>
                 <div className="space-y-4">
                    {hbbMigration.path.split('→').map((node, i, arr) => (
                      <div key={node} className="flex items-center gap-3">
                        <div className="flex flex-col items-center">
                          <div className={`w-2 h-2 rounded-full ${i === 0 ? 'bg-red-500' : 'bg-slate-700'}`}></div>
                          {i < arr.length - 1 && <div className="w-[1px] h-4 bg-slate-800"></div>}
                        </div>
                        <span className={`text-xs ${i === 0 ? 'font-bold text-slate-200' : 'text-slate-500'}`}>{node.trim()}</span>
                      </div>
                    ))}
                 </div>
              </div>
           </div>
        </div>
      )}
    </motion.div>
  );
});
