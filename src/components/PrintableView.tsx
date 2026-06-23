import React from 'react';
import { ExportConfig } from './ExportModule';
import { Activity, AlertTriangle, Dna, FlaskConical, CheckCircle } from 'lucide-react';

const MODERN_POP_NAMES: Record<string, string> = {
  'Nilotic-Omotic': 'East African (Nilotic)',
  'Ancestral-South-Indian': 'South Asian (Dravidian)',
  'North-European-Baltic': 'North European & Baltic',
  'Uralic': 'Siberian & Uralic',
  'Australo-Melanesian': 'Australo-Melanesian',
  'East-Siberean': 'East Siberian',
  'Ancestral-Yayoi': 'Japanese (Yayoi)',
  'Caucasian-Near-Eastern': 'Caucasus & Near East',
  'Tibeto-Burman': 'Tibeto-Burman',
  'Austronesian': 'Southeast Asian (Austronesian)',
  'Central-African-Pygmean': 'Central African (Pygmy)',
  'Central-African-Hunter-Catherers': 'Central African Hunter-Gatherers',
  'Nilo-Sahrian': 'Nilo-Saharan',
  'North-African': 'North African',
  'Gedrosia-Caucasian': 'Caucasus & West Asian',
  'Cushitic': 'East African (Cushitic)',
  'Congo-Pygmean': 'Congo Basin (Pygmy)',
  'Bushmen': 'South African (Khoisan)',
  'South-Meso-Amerindian': 'Mesoamerican & South Amerindian',
  'South-West-European': 'Southwest European',
  'North-Amerindian': 'North Amerindian',
  'Arabic': 'Arabian',
  'North-Circumpolar': 'Arctic & Circumpolar',
  'Kalash': 'Hindukush (Kalash)',
  'Papuan-Australian': 'Papuan & Australian',
  'Baltic-Finnic': 'Baltic Finnic',
  'Bantu': 'West/Central African (Bantu)'
};

const formatPopName = (name: string) => {
  if (!name) return 'Unknown';
  return MODERN_POP_NAMES[name] || name.replace(/-/g, ' ');
};

interface PrintableViewProps {
  config: ExportConfig;
  dataset: any;
  healthImpacts: any[];
  oracleResults: any;
}

export const PrintableView: React.FC<PrintableViewProps> = ({ config, dataset, healthImpacts, oracleResults }) => {
  const dateStr = new Date().toLocaleDateString();

  // Filter medical impacts if needed
  let displayImpacts = healthImpacts || [];
  if (config.reportType === 'medical' && config.filters.highImpactOnly) {
    displayImpacts = displayImpacts.filter(h => 
      h.impact === 'High Risk' || 
      h.impact === 'Pathogenic' || 
      h.impact === 'Moderate' ||
      h.impact === 'Increased Risk' ||
      h.tags?.includes('PGx')
    );
  }

  // Helper to determine risk colors for print
  const getRiskColor = (impact: string) => {
    if (impact === 'High Risk' || impact === 'Pathogenic') return 'text-red-700 bg-red-100 border-red-300';
    if (impact === 'Moderate' || impact === 'Increased Risk') return 'text-orange-700 bg-orange-100 border-orange-300';
    if (impact === 'Benign' || impact === 'Typical') return 'text-green-700 bg-green-100 border-green-300';
    return 'text-slate-700 bg-slate-100 border-slate-300';
  };

  return (
    <div className="bg-white min-h-screen text-slate-900 p-8 md:p-12 font-sans print:m-0 print:p-0">
      
      {/* Report Header */}
      <div className="border-b-4 border-slate-900 pb-6 mb-8 flex justify-between items-end break-inside-avoid">
        <div>
          <h1 className="text-4xl font-black uppercase tracking-tight mb-2">
            {config.reportType === 'medical' ? 'Clinical Health Report' : 'Genetic Ancestry Report'}
          </h1>
          <div className="text-lg text-slate-600 font-medium">Genotype Scout Automated Analysis</div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold">{dataset?.name || 'Unknown Specimen'}</div>
          <div className="text-slate-500 font-mono text-sm">Date: {dateStr}</div>
          <div className="text-slate-500 font-mono text-sm">SNPs Analyzed: {dataset?.snpCount?.toLocaleString()}</div>
        </div>
      </div>

      {/* --- MEDICAL REPORT --- */}
      {config.reportType === 'medical' && (
        <div className="space-y-10">
          <div className="break-inside-avoid bg-slate-50 p-6 rounded-xl border border-slate-200">
            <h2 className="text-2xl font-black mb-4 flex items-center gap-3">
              <Activity className="w-6 h-6 text-rose-600" />
              Executive Summary
            </h2>
            <p className="text-slate-700">
              This report contains algorithmic predictions of health, carrier status, and pharmacogenomics (PGx) based on the provided genetic variant file. 
              {config.filters.highImpactOnly && " It has been strictly filtered to only show high-impact and pathogenic traits."}
            </p>
          </div>

          <div className="space-y-6">
            <h3 className="text-xl font-bold border-b border-slate-200 pb-2 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-orange-500" /> Detected Clinical Traits
            </h3>
            
            {displayImpacts.length === 0 ? (
              <div className="p-8 text-center text-slate-500 border border-slate-200 border-dashed rounded-xl">
                No notable health impacts detected based on current filters.
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {displayImpacts.map((impact: any, idx: number) => (
                  <div key={idx} className={`p-4 border rounded-xl break-inside-avoid flex flex-col gap-2 ${getRiskColor(impact.impact)}`}>
                    <div className="flex justify-between items-start">
                      <h4 className="font-bold text-lg">{impact.name}</h4>
                      <span className="px-3 py-1 bg-white/50 rounded-lg text-xs font-black uppercase tracking-wider">
                        {impact.impact}
                      </span>
                    </div>
                    <div className="text-sm font-medium">{impact.description}</div>
                    <div className="mt-2 text-xs font-mono font-bold bg-white/50 inline-flex px-2 py-1 rounded w-max">
                      Genotype: {impact.genotype}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* --- GENETIC REPORT --- */}
      {config.reportType === 'genetic' && (() => {
        const continentalScores = oracleResults?.primary?.continentalScores || dataset?.analysis?.oracleResults?.primary?.continentalScores || {};
        const continentalList = Object.entries(continentalScores)
          .map(([name, val]) => ({ name, value: Number(val) }))
          .sort((a, b) => b.value - a.value);

        const subPopulations = oracleResults?.primary?.subPopulations || dataset?.analysis?.oracleResults?.primary?.subPopulations || {};
        const affinityList = Object.values(subPopulations).flat()
          .sort((a: any, b: any) => a.distance - b.distance)
          .slice(0, 5);

        const subpopOracle = dataset?.analysis?.subpopulationOracle;
        const K61Mix = subpopOracle?.admixtureMix || [];
        const sortedK61 = [...K61Mix]
          .sort((a: any, b: any) => (b.percentage || 0) - (a.percentage || 0))
          .slice(0, 6);

        return (
          <div className="space-y-10">
            <div className="break-inside-avoid bg-slate-50 p-6 rounded-xl border border-slate-200">
              <h2 className="text-2xl font-black mb-4 flex items-center gap-3">
                <Dna className="w-6 h-6 text-teal-600" />
                Ancestry Overview
              </h2>
              <p className="text-slate-700">
                This report contains population admixture estimations, deep ancestry oracle models, and haplogroup predictions.
              </p>
            </div>

            {/* Continental Admixture Section */}
            {continentalList.length > 0 && (
              <div className="break-inside-avoid space-y-4">
                <h3 className="text-xl font-bold border-b border-slate-200 pb-2">Continental Admixture</h3>
                <div className="p-6 border border-slate-200 rounded-xl space-y-4">
                  {continentalList.map((entry) => (
                    <div key={entry.name} className="space-y-1">
                      <div className="flex justify-between text-sm font-bold text-slate-700">
                        <span>{entry.name}</span>
                        <span className="font-mono">{entry.value.toFixed(1)}%</span>
                      </div>
                      <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden border border-slate-200">
                        <div 
                          className="h-full rounded-full bg-teal-600" 
                          style={{ width: `${entry.value}%` }} 
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Human Origins (K61) Admixture Solver Section */}
            {(oracleResults?.breakdown || []).length > 0 && (
              <div className="break-inside-avoid space-y-4">
                <h3 className="text-xl font-bold border-b border-slate-200 pb-2">Human Origins (K61) Subpopulation Admixture</h3>
                <div className="grid grid-cols-2 gap-4">
                  {(oracleResults?.breakdown || []).slice(0, 8).map((comp: any, idx: number) => {
                    const visualWidth = Math.max(5, 100 - (comp.distance * 200));
                    return (
                      <div key={comp.subpop} className="border border-slate-200 rounded-lg p-3">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block mb-0.5">Population Match</span>
                            <h4 className="text-sm font-bold text-slate-800">{comp.name || comp.subpop}</h4>
                          </div>
                          <div className="text-right">
                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block mb-0.5">Distance</span>
                            <span className="font-mono font-black text-teal-700 text-base">{Number(comp.distance).toFixed(4)}</span>
                          </div>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                          <div 
                            className="h-full bg-teal-500 rounded-full" 
                            style={{ width: `${visualWidth}%` }} 
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Subpopulation Affinity Proximity */}
            {affinityList.length > 0 && (
              <div className="break-inside-avoid space-y-4">
                <h3 className="text-xl font-bold border-b border-slate-200 pb-2">Subpopulation Affinity (Genetic Proximity)</h3>
                <div className="p-6 border border-slate-200 rounded-xl space-y-3">
                  {affinityList.map((pop: any, idx: number) => {
                    const closeness = Math.max(0, 100 - (pop.distance / 20) * 100);
                    return (
                      <div key={pop.name || idx} className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className="font-bold text-slate-700">{idx + 1}. {formatPopName(pop.name)}</span>
                          <span className="font-mono font-bold text-slate-600">Distance: {pop.distance.toFixed(3)}</span>
                        </div>
                        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden border border-slate-200">
                          <div 
                            className={`h-full rounded-full ${pop.distance < 3 ? 'bg-emerald-600' : pop.distance < 6 ? 'bg-blue-600' : 'bg-slate-400'}`} 
                            style={{ width: `${closeness}%` }} 
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {dataset?.predictedYDNA && dataset.predictedYDNA.predicted && (
              <div className="break-inside-avoid space-y-4">
                <h3 className="text-xl font-bold border-b border-slate-200 pb-2">Paternal Haplogroup</h3>
                <div className="p-6 border border-slate-200 rounded-xl flex items-center justify-between bg-sky-50">
                  <div className="text-3xl font-black text-sky-800">{dataset.predictedYDNA.predicted}</div>
                  <div className="text-sky-600 font-bold uppercase text-sm">Y-DNA Lineage</div>
                </div>
              </div>
            )}

            {dataset?.predictedMtDNA && dataset.predictedMtDNA.predicted && (
              <div className="break-inside-avoid space-y-4">
                <h3 className="text-xl font-bold border-b border-slate-200 pb-2">Maternal Haplogroup</h3>
                <div className="p-6 border border-slate-200 rounded-xl flex items-center justify-between bg-fuchsia-50">
                  <div className="text-3xl font-black text-fuchsia-800">{dataset.predictedMtDNA.predicted}</div>
                  <div className="text-fuchsia-600 font-bold uppercase text-sm">mtDNA Lineage</div>
                </div>
              </div>
            )}
          </div>
        );
      })()}

      {/* --- FULL DATA TABLE (OPTIONAL) --- */}
      {config.filters.includeFullTable && dataset?.results && (
        <div className="mt-16 pt-8 border-t-2 border-slate-200">
          <h3 className="text-xl font-black mb-4 flex items-center gap-2 break-after-avoid">
            <FlaskConical className="w-5 h-5" /> Raw SNP Appendix
          </h3>
          <p className="text-xs text-slate-500 mb-6 break-after-avoid">Showing first 200 parsed markers.</p>
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b-2 border-slate-800 text-slate-800">
                <th className="py-2">RSID</th>
                <th className="py-2">Chromosome</th>
                <th className="py-2">Position</th>
                <th className="py-2">Genotype</th>
              </tr>
            </thead>
            <tbody>
              {dataset.results.slice(0, 200).map((snp: any, idx: number) => (
                <tr key={idx} className="border-b border-slate-100">
                  <td className="py-1">{snp.rsid}</td>
                  <td className="py-1">{snp.chromosome}</td>
                  <td className="py-1">{snp.position}</td>
                  <td className="py-1 font-bold">{snp.genotype}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-16 pt-8 text-center text-[10px] text-slate-400 font-mono border-t border-slate-100 break-inside-avoid">
        <CheckCircle className="w-4 h-4 mx-auto mb-2 text-slate-300" />
        Generated automatically by Genotype Scout. Not intended for diagnostic use.
      </div>

    </div>
  );
};
