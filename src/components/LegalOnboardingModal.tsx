import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, AlertTriangle, CheckCircle2, 
  ExternalLink, Lock, Scale, X, FileText,
  RotateCcw, Info, CheckCheck
} from 'lucide-react';
import { useLegalConsentStore, CURRENT_CONSENT_VERSION } from '../stores/useLegalConsentStore';

export const LegalOnboardingModal: React.FC = () => {
  const {
    hasAcceptedTerms,
    acceptedAt,
    isLegalModalOpen,
    acceptTerms,
    closeLegalModal,
    revokeConsent,
  } = useLegalConsentStore();

  const [ackMicroarray, setAckMicroarray] = useState(false);
  const [ackRUO, setAckRUO] = useState(false);
  const [ackCLIA, setAckCLIA] = useState(false);
  const [ackTerms, setAckTerms] = useState(false);
  const [hasDeclined, setHasDeclined] = useState(false);

  // If already accepted, auto-fill checkboxes for review display
  useEffect(() => {
    if (hasAcceptedTerms) {
      setAckMicroarray(true);
      setAckRUO(true);
      setAckCLIA(true);
      setAckTerms(true);
      setHasDeclined(false);
    } else {
      setAckMicroarray(false);
      setAckRUO(false);
      setAckCLIA(false);
      setAckTerms(false);
    }
  }, [hasAcceptedTerms, isLegalModalOpen]);

  if (!isLegalModalOpen) return null;

  const allChecked = ackMicroarray && ackRUO && ackCLIA && ackTerms;

  const handleAccept = () => {
    if (!allChecked) return;
    acceptTerms([
      'microarray_error_rate_ack',
      'research_use_only_ack',
      'clia_cap_confirmation_ack',
      'terms_of_service_liability_release_ack',
    ]);
  };

  const handleToggleAll = () => {
    const target = !allChecked;
    setAckMicroarray(target);
    setAckRUO(target);
    setAckCLIA(target);
    setAckTerms(target);
  };

  const handleAcceptAll = () => {
    setAckMicroarray(true);
    setAckRUO(true);
    setAckCLIA(true);
    setAckTerms(true);
    acceptTerms([
      'microarray_error_rate_ack',
      'research_use_only_ack',
      'clia_cap_confirmation_ack',
      'terms_of_service_liability_release_ack',
    ]);
  };

  const handleDecline = () => {
    setHasDeclined(true);
  };

  return (
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 md:p-6 bg-black/85 backdrop-blur-md overflow-y-auto animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="legal-modal-title"
    >
      <div className="relative w-full max-w-3xl my-auto bg-zinc-950 border border-amber-500/30 rounded-2xl shadow-2xl shadow-black/80 flex flex-col max-h-[92vh] overflow-hidden text-zinc-100">
        
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-zinc-900/80">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400">
              <ShieldAlert className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <h2 id="legal-modal-title" className="text-base sm:text-lg font-black tracking-tight text-white flex items-center gap-2">
                <span>Legal Terms & Scientific Advisory</span>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  v{CURRENT_CONSENT_VERSION}
                </span>
              </h2>
              <p className="text-[11px] font-medium text-zinc-400">
                Mandatory Clickwrap Acknowledgment for Commercial & Research Use
              </p>
            </div>
          </div>

          {hasAcceptedTerms && (
            <button
              onClick={closeLegalModal}
              className="p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition-colors"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Existing Acceptance Banner (if reviewing) */}
        {hasAcceptedTerms && (
          <div className="px-6 py-2.5 bg-emerald-950/70 border-b border-emerald-500/30 flex items-center justify-between text-xs text-emerald-200">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                <strong>Legally Acknowledged:</strong> Consented on {acceptedAt ? new Date(acceptedAt).toLocaleString() : 'previously'}.
              </span>
            </div>
            <button
              onClick={revokeConsent}
              className="text-[11px] font-bold text-rose-400 hover:text-rose-300 underline cursor-pointer"
            >
              Revoke Consent
            </button>
          </div>
        )}

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6 text-sm text-zinc-300 leading-relaxed custom-scrollbar">
          
          {hasDeclined ? (
            <div className="py-8 text-center space-y-4">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
                <AlertTriangle className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-black text-white">Terms Required for Access</h3>
              <p className="text-sm text-zinc-400 max-w-md mx-auto">
                Because consumer microarray data carries severe scientific false-positive error rates, 
                Genotype Scout strictly requires all users to acknowledge these limitations before viewing or analyzing genetic files.
              </p>
              <div className="pt-4">
                <button
                  onClick={() => setHasDeclined(false)}
                  className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-black uppercase text-xs tracking-wider transition-all cursor-pointer"
                >
                  Return to Legal Terms
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Section 1: Research Use Only (RUO) */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-white font-bold text-sm">
                  <FileText className="w-4 h-4 text-amber-400" />
                  <span>1. Research & Educational Use Only (RUO)</span>
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed pl-6">
                  Genotype Scout is an exploratory bioinformatics tool provided strictly for educational, historical, genealogical, 
                  and recreational research purposes. It is <strong>NOT a medical device</strong> and has not been cleared, reviewed, or approved 
                  by the U.S. Food and Drug Administration (FDA), European Medicines Agency (EMA), or any national health authority as 
                  Software as a Medical Device (SaMD). Genotype Scout does not provide clinical diagnoses, prognosis, medical recommendations, 
                  or prescription drug dosing directives.
                </p>
              </div>

              {/* Section 2: Mandatory Confirmatory Testing */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-white font-bold text-sm">
                  <Scale className="w-4 h-4 text-amber-400" />
                  <span>2. Mandatory Confirmatory Testing in CLIA/CAP Laboratories</span>
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed pl-6">
                  You strictly agree that you will <strong>NEVER alter medical prescriptions, drug dosages, surgery decisions, or health protocols</strong> based on this application. Any potentially pathogenic or pharmacogenomic variant identified within raw genotype files must be validated in an accredited medical laboratory certified under the Clinical Laboratory Improvement Amendments (CLIA) and accredited by the College of American Pathologists (CAP), with interpretation provided by a licensed physician or board-certified genetic counselor.
                </p>
              </div>

              {/* Section 3: Privacy & Client-Side Execution */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-white font-bold text-sm">
                  <Lock className="w-4 h-4 text-teal-400" />
                  <span>3. Complete Client-Side Local Execution & Zero Cloud Storage</span>
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed pl-6">
                  Genotype Scout executes all file ingestion, variant parsing, and statistical calculations 100% locally in your web browser 
                  via Web Workers and WebAssembly. No genetic sequence, SNP calls, kit identifiers, or personal telemetry are ever transmitted to 
                  or stored on any external server or cloud database.
                </p>
              </div>

              {/* Section 4: Disclaimer of Warranties & Liability Limitation */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-white font-bold text-sm">
                  <Info className="w-4 h-4 text-amber-400" />
                  <span>4. Disclaimer of Warranties & Limitation of Liability</span>
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed pl-6">
                  THE SOFTWARE IS PROVIDED &quot;AS IS&quot;, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO 
                  MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS 
                  BE LIABLE FOR ANY CLAIM, DAMAGES, MEDICAL COMPLICATIONS, EMOTIONAL DISTRESS, OR OTHER LIABILITY ARISING FROM THE USE OF OR 
                  RELIANCE UPON DATA GENERATED BY THIS SOFTWARE.
                </p>
              </div>

              {/* Scientific Advisory Note on Microarrays (Moved Down & Toned Down) */}
              <div className="p-3.5 sm:p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 text-zinc-300">
                <div className="flex items-start gap-3">
                  <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 shrink-0 mt-0.5">
                    <Info className="w-4 h-4" />
                  </div>
                  <div className="space-y-1.5 text-xs text-zinc-400">
                    <h3 className="text-xs sm:text-sm font-bold text-zinc-200">
                      Scientific Advisory: Consumer Microarray Limitations
                    </h3>
                    <p className="leading-relaxed">
                      Direct-to-consumer genotyping kits (23andMe, AncestryDNA, MyHeritage, FamilyTreeDNA) utilize hybridization microarrays optimized for common population markers. When evaluating rare variants, probe cross-hybridization can produce analytical false-positive calls (documented in independent evaluations by Tandy-Connor et al., <em>Genetics in Medicine</em> 2018, and Weedon et al., <em>BMJ</em> 2019).
                    </p>
                    <p className="text-[11px] text-zinc-400 font-medium">
                      Raw variant calls in consumer files are exploratory and should not be interpreted as definitive clinical or diagnostic results without secondary laboratory validation.
                    </p>
                  </div>
                </div>
              </div>

              {/* Interactive Assent Checkboxes */}
              <div className="pt-4 border-t border-zinc-800 space-y-3">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <h4 className="text-xs font-black uppercase tracking-wider text-amber-400">
                    Mandatory Affirmative Assent
                  </h4>
                  <button
                    type="button"
                    onClick={handleToggleAll}
                    className="text-[11px] font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 transition-all cursor-pointer"
                    title="Toggle all 4 requirements at once"
                  >
                    <CheckCheck className="w-3.5 h-3.5" />
                    <span>{allChecked ? 'Deselect All' : 'Select All (1-Click)'}</span>
                  </button>
                </div>

                <label className="flex items-start gap-3 p-3 rounded-xl bg-zinc-900/90 border border-zinc-800 hover:border-amber-500/40 transition-colors cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={ackMicroarray}
                    onChange={(e) => setAckMicroarray(e.target.checked)}
                    className="mt-0.5 w-4 h-4 rounded border-zinc-700 text-amber-500 focus:ring-amber-400 focus:ring-offset-zinc-900 bg-zinc-800 cursor-pointer"
                  />
                  <span className="text-xs text-zinc-300 group-hover:text-zinc-100">
                    <strong>Microarray Error Rate Acknowledgment:</strong> I understand that consumer DNA files (23andMe, AncestryDNA, etc.) have documented false-positive rates of 40% to 50%+ on rare variants due to hybridization probe artifacts, and raw calls cannot be treated as clinical truth.
                  </span>
                </label>

                <label className="flex items-start gap-3 p-3 rounded-xl bg-zinc-900/90 border border-zinc-800 hover:border-amber-500/40 transition-colors cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={ackRUO}
                    onChange={(e) => setAckRUO(e.target.checked)}
                    className="mt-0.5 w-4 h-4 rounded border-zinc-700 text-amber-500 focus:ring-amber-400 focus:ring-offset-zinc-900 bg-zinc-800 cursor-pointer"
                  />
                  <span className="text-xs text-zinc-300 group-hover:text-zinc-100">
                    <strong>Research Use Only (RUO):</strong> I acknowledge that Genotype Scout is an exploratory bioinformatics tool, is NOT a regulated medical device or clinical diagnostic service, and does NOT provide medical advice or prescribing directives.
                  </span>
                </label>

                <label className="flex items-start gap-3 p-3 rounded-xl bg-zinc-900/90 border border-zinc-800 hover:border-amber-500/40 transition-colors cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={ackCLIA}
                    onChange={(e) => setAckCLIA(e.target.checked)}
                    className="mt-0.5 w-4 h-4 rounded border-zinc-700 text-amber-500 focus:ring-amber-400 focus:ring-offset-zinc-900 bg-zinc-800 cursor-pointer"
                  />
                  <span className="text-xs text-zinc-300 group-hover:text-zinc-100">
                    <strong>Mandatory Clinical Confirmation:</strong> I agree that I will never alter medications, dosages, or health treatments without secondary clinical confirmation from a CLIA-certified / CAP-accredited laboratory and guidance from a licensed physician or genetic counselor.
                  </span>
                </label>

                <label className="flex items-start gap-3 p-3 rounded-xl bg-zinc-900/90 border border-zinc-800 hover:border-amber-500/40 transition-colors cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={ackTerms}
                    onChange={(e) => setAckTerms(e.target.checked)}
                    className="mt-0.5 w-4 h-4 rounded border-zinc-700 text-amber-500 focus:ring-amber-400 focus:ring-offset-zinc-900 bg-zinc-800 cursor-pointer"
                  />
                  <span className="text-xs text-zinc-300 group-hover:text-zinc-100">
                    <strong>Terms of Service & Liability Release:</strong> I have read, understood, and accept the Terms of Service, acknowledge the local-only data processing architecture, and agree to the complete limitation of liability.
                  </span>
                </label>
              </div>
            </>
          )}

        </div>

        {/* Modal Action Footer */}
        {!hasDeclined && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-6 py-4 border-t border-zinc-800 bg-zinc-900/90">
            <div className="text-[11px] font-mono text-zinc-500">
              {allChecked ? (
                <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  All 4 mandatory requirements acknowledged
                </span>
              ) : (
                <span className="text-zinc-400">
                  Click below to accept all terms with 1 click
                </span>
              )}
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              {!hasAcceptedTerms && (
                <button
                  type="button"
                  onClick={handleDecline}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-zinc-700 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 text-xs font-bold transition-colors cursor-pointer"
                >
                  Decline & Exit
                </button>
              )}

              <button
                type="button"
                onClick={handleAcceptAll}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl font-black uppercase text-xs tracking-wider transition-all duration-150 flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black shadow-lg shadow-amber-950/40 active:scale-95 cursor-pointer"
                title="Acknowledge all requirements and enter Genotype Scout in 1 click"
              >
                <CheckCheck className="w-4 h-4 text-black" />
                <span>{hasAcceptedTerms ? 'Update & Save Acknowledgment' : 'Accept All & Enter (1-Click)'}</span>
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
