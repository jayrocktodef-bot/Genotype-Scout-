import React, { useMemo } from 'react';
import { ShieldCheck, Info, Map, Beaker, Dna, FileText } from 'lucide-react';
import { CHROMOSOME_LENGTHS } from './ChromosomePainter';

export interface NativeRootsViewProps {
  dataset: any;
  oracleResults: any;
  userSnps: Record<string, string>;
  mtData: any;
  yData: any;
  onOpenMethodology?: (moduleId: string) => void;
}

const check9bpDeletion = (userSnps: Record<string, string>) => {
  // Check for 9-bp deletion in region 8272-8289 on MT
  let tested = false;
  let present = false;
  const mtKeys = Object.keys(userSnps).filter(k => k.startsWith('MT:') || k.startsWith('26:') || k.includes('8281'));
  
  for (let pos = 8272; pos <= 8289; pos++) {
    const v1 = userSnps[`MT:${pos}`];
    const v2 = userSnps[`26:${pos}`];
    const v3 = userSnps[`rs1063198`]; // One of the known rsIDs in this region
    
    if (v1 || v2 || v3) {
      tested = true;
      const val = v1 || v2 || v3;
      if (val === '-' || val === 'D' || val === 'I/D' || val === '--') {
        present = true;
      }
    }
  }
  return { tested, present };
};

const getGenotypeStatus = (userSnps: Record<string, string>, rsid: string, ref: string, alt: string) => {
  const g = userSnps[rsid];
  if (!g || g === '--' || g === '??') return 'Not tested';
  if (g.includes(alt)) return g === `${alt}${alt}` ? 'Homozygous Alternate' : 'Heterozygous';
  return 'Reference';
};

export const NativeRootsView: React.FC<NativeRootsViewProps> = ({
  dataset,
  oracleResults,
  userSnps,
  mtData,
  yData,
  onOpenMethodology
}) => {

  const { segments, nativeVerdict, traitEdar, traitAbcc11, uniparental, confidenceReasons, eastAsianOverlap } = useMemo(() => {
    // 1. Pillar 1: Autosomal Segments (AMR / Indigenous American)
    let amrSegments: any[] = [];
    if (dataset?.analysis?.segments) {
      const allStrandA = dataset.analysis.segments.strandA || [];
      const allStrandB = dataset.analysis.segments.strandB || [];
      
      const processStrand = (strand: any[]) => {
        return strand.filter(s => s.continent === 'AMR' || s.continent === 'Indigenous American' || s.continent === 'NAT').map(s => {
          const lengthCm = (s.end - s.start) / 1000000; // rough proxy for cM length visualization
          const snpCount = Math.floor((s.end - s.start) / 5000); // rough proxy
          return { ...s, lengthCm, snpCount };
        });
      };
      amrSegments = [...processStrand(allStrandA), ...processStrand(allStrandB)];
    }
    
    let autosomalSignal = 'Not detected';
    const totalAmrLength = amrSegments.reduce((sum, s) => sum + s.lengthCm, 0);
    const hasHighConf = amrSegments.some(s => s.lengthCm >= 7 && s.snpCount >= 500);
    const hasModConf = amrSegments.some(s => s.lengthCm >= 3 && s.lengthCm < 7);
    
    // Fallback if no segments but ONNX has signal
    let onnxAmr = 0;
    let onnxEas = 0;
    if (oracleResults?.modern?.proportions) {
      onnxAmr = oracleResults.modern.proportions.AMR || oracleResults.modern.proportions.NAT || 0;
      onnxEas = oracleResults.modern.proportions.EAS || 0;
    }
    
    if (hasHighConf) autosomalSignal = 'High';
    else if (hasModConf) autosomalSignal = 'Moderate';
    else if (totalAmrLength > 0 || onnxAmr > 0.005) autosomalSignal = 'Trace';

    // 2. Pillar 2: Traits
    const edar = userSnps['rs3827760'] || 'Not tested'; // EDAR V370A
    const abcc11 = userSnps['rs17822931'] || 'Not tested'; // ABCC11
    
    const traitEdar = { genotype: edar, hasTrait: edar.includes('C') }; // Derived G>C
    const traitAbcc11 = { genotype: abcc11, hasTrait: abcc11.includes('A') }; // Derived G>A
    
    // 3. Pillar 3: Uniparental
    const { tested: mtTested, present: mt9bp } = check9bpDeletion(userSnps);
    
    const mtHaplo = mtData?.predicted || '';
    const yHaplo = yData?.predicted || '';
    
    const isMtB = mtHaplo.startsWith('B') || mtHaplo.includes(' Haplogroup B');
    const isYQ = yHaplo.startsWith('Q') && yHaplo.includes('M3');
    const yTested = !!yData?.predicted;
    
    // Confidence Framework
    let reasons: string[] = [];
    let verdict = 'Not detected';
    let eaOverlap = false;

    if (autosomalSignal === 'High') {
      verdict = 'Confirmed';
      reasons.push('High-confidence autosomal segments (>7cM) detected.');
    } else if (autosomalSignal === 'Moderate') {
      verdict = 'Likely';
      reasons.push('Moderate-confidence autosomal segments (3-7cM) detected. Provisional.');
    } else if (isMtB || isYQ) {
      verdict = 'Likely';
      reasons.push('Uniparental markers strongly associated with Indigenous populations detected.');
    } else if (autosomalSignal === 'Trace' || mt9bp || traitEdar.hasTrait) {
      verdict = 'Uncertain';
      reasons.push('Trace autosomal signals or shared deep-ancestry traits present.');
    } else {
      reasons.push('No significant autosomal, uniparental, or trait markers detected.');
    }

    if ((autosomalSignal === 'Trace' || autosomalSignal === 'Moderate') && onnxEas > 0.05) {
      eaOverlap = true;
      reasons.push('East Asian signal is also elevated: shared deep ancestry — cannot separate without corroborating pillars.');
    }

    return { 
      segments: amrSegments, 
      nativeVerdict: verdict, 
      traitEdar, 
      traitAbcc11, 
      uniparental: { mt9bp, mtTested, isMtB, isYQ, yTested, mtHaplo, yHaplo },
      confidenceReasons: reasons,
      eastAsianOverlap: eaOverlap
    };
  }, [dataset, oracleResults, userSnps, mtData, yData]);

  return (
    <div className="space-y-8 animate-fade-in max-w-5xl mx-auto">
      {/* Honesty Guardrails - Must be prominent */}
      <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-6">
        <h3 className="text-amber-500 font-bold mb-4 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5" /> Important Context & Limitations
        </h3>
        <ul className="space-y-2 text-sm text-amber-700/80 dark:text-amber-300/80">
          <li>• <strong>DNA cannot name a tribe:</strong> Tribal identity is genealogical, political, and communal — not biological.</li>
          <li>• <strong>Reference gap:</strong> This analysis is compared against Central and South American reference populations; no robust Northeastern Woodlands reference exists.</li>
          <li>• <strong>Next steps:</strong> Your next steps for confirming Native heritage should be genealogical (older relatives, paper trail, community records), not another DNA test.</li>
        </ul>
      </div>

      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-8 shadow-sm">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Native Roots Discovery</h2>
            <p className="text-slate-500 mt-2">A three-pillar evidence framework for Indigenous American ancestry.</p>
          </div>
          <div className={`px-6 py-3 rounded-2xl text-center border ${
            nativeVerdict === 'Confirmed' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600' :
            nativeVerdict === 'Likely' ? 'bg-teal-500/10 border-teal-500/20 text-teal-600' :
            nativeVerdict === 'Uncertain' ? 'bg-amber-500/10 border-amber-500/20 text-amber-600' :
            'bg-slate-100 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-500'
          }`}>
            <div className="text-xs font-bold uppercase tracking-widest opacity-70 mb-1">Verdict</div>
            <div className="text-xl font-black">{nativeVerdict}</div>
          </div>
        </div>

        <div className="space-y-4 mb-12">
          {confidenceReasons.map((reason, idx) => (
            <div key={idx} className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300">
              <Info className="w-4 h-4 text-teal-500" />
              {reason}
            </div>
          ))}
          {eastAsianOverlap && (
            <div className="flex items-center gap-3 text-sm text-rose-500 font-medium">
              <ShieldCheck className="w-4 h-4" />
              Note: Elevated East Asian signal detected. These populations share deep ancient ancestry.
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Pillar 1: Autosomal */}
          <div className="bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <Map className="w-5 h-5 text-indigo-500" /> Pillar 1: Autosomal
            </h3>
            {segments.length > 0 ? (
              <div className="space-y-3">
                <p className="text-sm text-slate-500 mb-4">Detected {segments.length} segment(s) matching Indigenous American references.</p>
                {segments.map((s, i) => (
                  <div key={i} className="bg-white dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700 text-xs">
                    <div className="flex justify-between font-bold mb-1">
                      <span>Chr {s.chromosome || '?'}</span>
                      <span className={s.lengthCm >= 7 ? 'text-emerald-500' : 'text-amber-500'}>
                        {s.lengthCm >= 7 ? 'High Conf' : 'Provisional'}
                      </span>
                    </div>
                    <div className="text-slate-500">Length: ~{s.lengthCm.toFixed(1)} cM ({s.snpCount} SNPs)</div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-500 italic">No significant autosomal segments detected.</p>
            )}
          </div>

          {/* Pillar 2: Traits */}
          <div className="bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <Beaker className="w-5 h-5 text-rose-500" /> Pillar 2: Traits
            </h3>
            <p className="text-xs text-slate-500 mb-4 border-b border-slate-200 dark:border-slate-700 pb-4">
              These variants are common in Native American and East Asian populations. (Not exclusive "Native American genes").
            </p>
            <div className="space-y-4">
              <div>
                <div className="text-sm font-bold text-slate-700 dark:text-slate-200">EDAR (rs3827760)</div>
                <div className="text-xs text-slate-500 mb-1">Associated with hair thickness & tooth morphology.</div>
                <div className={`text-xs font-medium px-2 py-1 rounded inline-block ${traitEdar.hasTrait ? 'bg-rose-500/10 text-rose-500' : 'bg-slate-200 dark:bg-slate-800 text-slate-600'}`}>
                  {traitEdar.genotype} {traitEdar.hasTrait && '(Derived)'}
                </div>
              </div>
              <div>
                <div className="text-sm font-bold text-slate-700 dark:text-slate-200">ABCC11 (rs17822931)</div>
                <div className="text-xs text-slate-500 mb-1">Associated with dry earwax.</div>
                <div className={`text-xs font-medium px-2 py-1 rounded inline-block ${traitAbcc11.hasTrait ? 'bg-rose-500/10 text-rose-500' : 'bg-slate-200 dark:bg-slate-800 text-slate-600'}`}>
                  {traitAbcc11.genotype} {traitAbcc11.hasTrait && '(Derived)'}
                </div>
              </div>
            </div>
          </div>

          {/* Pillar 3: Uniparental */}
          <div className="bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <Dna className="w-5 h-5 text-sky-500" /> Pillar 3: Uniparental
            </h3>
            <div className="space-y-4">
              <div className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                <div className="text-xs font-bold text-slate-500 uppercase mb-1">Maternal (mtDNA)</div>
                <div className="text-sm font-medium text-slate-900 dark:text-white mb-2">Haplogroup: {uniparental.mtHaplo || 'Not tested'}</div>
                {uniparental.isMtB && <div className="text-xs bg-sky-500/10 text-sky-500 px-2 py-1 rounded inline-block font-bold">Haplogroup B Badge</div>}
                
                <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-700">
                  <div className="text-xs text-slate-500 mb-1">9-bp Deletion (8272–8289)</div>
                  <div className="text-sm font-medium">
                    {!uniparental.mtTested ? 'Not tested' : uniparental.mt9bp ? 'Present' : 'Absent'}
                  </div>
                </div>
              </div>

              <div className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                <div className="text-xs font-bold text-slate-500 uppercase mb-1">Paternal (Y-DNA)</div>
                <div className="text-sm font-medium text-slate-900 dark:text-white mb-2">Haplogroup: {uniparental.yHaplo || 'Not tested'}</div>
                {uniparental.isYQ && <div className="text-xs bg-indigo-500/10 text-indigo-500 px-2 py-1 rounded inline-block font-bold">Haplogroup Q Badge</div>}
                {!uniparental.isYQ && uniparental.yTested && uniparental.yHaplo.startsWith('Q') && (
                  <div className="text-xs text-amber-500 mt-1">Resolution does not reach Q-M3.</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
