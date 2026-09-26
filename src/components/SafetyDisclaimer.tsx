import React from 'react';
import { ShieldAlert, Scale, AlertTriangle } from 'lucide-react';
import { useLegalConsentStore } from '../stores/useLegalConsentStore';

export const SafetyDisclaimer: React.FC = () => {
  const { openLegalModal, acceptedAt } = useLegalConsentStore();

  return (
    <div className="p-4 mb-6 bg-rose-950/80 border border-rose-500/50 rounded-xl text-xs sm:text-sm text-rose-100 shadow-md">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div className="flex items-start gap-2.5">
          <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p>
              <strong className="text-white uppercase tracking-wide">Research Use Only (RUO):</strong> Genotype Scout is an exploratory bioinformatics tool, NOT a diagnostic medical device. 
              Consumer genotyping microarrays (23andMe, AncestryDNA) exhibit documented <strong>40%–50%+ false-positive rates</strong> on rare clinical alleles due to probe cross-hybridization.
            </p>
            <p className="text-rose-200/80 text-[11px]">
              Never modify prescription medications, therapy doses, or health interventions without secondary clinical confirmation from a CLIA-certified / CAP-accredited laboratory and guidance from a licensed physician.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={openLegalModal}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 rounded-lg text-[11px] font-black uppercase tracking-wider shrink-0 transition-colors shadow-sm cursor-pointer"
          title="Review complete Clickwrap Agreement and Microarray Error Rate Acknowledgments"
        >
          <Scale className="w-3.5 h-3.5 text-amber-400" />
          <span>{acceptedAt ? 'Terms Acknowledged' : 'Review Legal Terms'}</span>
        </button>
      </div>
    </div>
  );
};
