import { create } from 'zustand';

export const CURRENT_CONSENT_VERSION = '1.1.0';
export const CONSENT_STORAGE_KEY = 'genotype_scout_consent_v1';

export interface ConsentRecord {
  accepted: boolean;
  version: string;
  timestamp: string;
  userAgent?: string;
  acknowledgedClauses?: string[];
  ageAttested18Plus?: boolean;
  ageAttestedAt?: string | null;
  diseaseRiskConsent?: {
    accepted: boolean;
    version: string;
    timestamp: string | null;
  };
}

interface LegalConsentState {
  hasAcceptedTerms: boolean;
  acceptedAt: string | null;
  consentVersion: string;
  isLegalModalOpen: boolean;
  
  ageAttested18Plus: boolean;
  diseaseRiskConsentAccepted: boolean;
  
  // Actions
  acceptTerms: (clauses?: string[], ageAttested?: boolean, diseaseRiskOptIn?: boolean) => void;
  openLegalModal: () => void;
  closeLegalModal: () => void;
  revokeConsent: () => void;

  attestAge: (attested: boolean) => void;
  grantDiseaseRiskConsent: () => void;
  revokeDiseaseRiskConsent: () => void;
}

function loadInitialConsent(): { hasAccepted: boolean; timestamp: string | null; ageAttested: boolean; diseaseConsent: boolean } {
  if (typeof window === 'undefined') {
    return { hasAccepted: false, timestamp: null, ageAttested: false, diseaseConsent: false };
  }
  try {
    const raw = localStorage.getItem(CONSENT_STORAGE_KEY);
    if (!raw) return { hasAccepted: false, timestamp: null, ageAttested: false, diseaseConsent: false };
    const parsed: ConsentRecord = JSON.parse(raw);
    if (parsed.accepted && parsed.version === CURRENT_CONSENT_VERSION) {
      return { 
        hasAccepted: true, 
        timestamp: parsed.timestamp,
        ageAttested: !!parsed.ageAttested18Plus,
        diseaseConsent: !!parsed.diseaseRiskConsent?.accepted
      };
    }
  } catch (e) {
    console.warn('Failed to parse legal consent record:', e);
  }
  return { hasAccepted: false, timestamp: null, ageAttested: false, diseaseConsent: false };
}

const initial = loadInitialConsent();

export const useLegalConsentStore = create<LegalConsentState>((set, get) => ({
  hasAcceptedTerms: initial.hasAccepted,
  acceptedAt: initial.timestamp,
  consentVersion: CURRENT_CONSENT_VERSION,
  // If not accepted yet, modal starts open on first visit
  isLegalModalOpen: !initial.hasAccepted,
  
  ageAttested18Plus: initial.ageAttested,
  diseaseRiskConsentAccepted: initial.diseaseConsent,

  acceptTerms: (clauses = [], ageAttested = false, diseaseRiskOptIn = false) => {
    const timestamp = new Date().toISOString();
    const record: ConsentRecord = {
      accepted: true,
      version: CURRENT_CONSENT_VERSION,
      timestamp,
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
      acknowledgedClauses: clauses,
      ageAttested18Plus: ageAttested,
      ageAttestedAt: ageAttested ? timestamp : null,
      diseaseRiskConsent: {
        accepted: diseaseRiskOptIn,
        version: CURRENT_CONSENT_VERSION,
        timestamp: diseaseRiskOptIn ? timestamp : null,
      }
    };

    try {
      localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(record));
    } catch (e) {
      console.error('Failed to persist consent record:', e);
    }

    set({
      hasAcceptedTerms: true,
      acceptedAt: timestamp,
      isLegalModalOpen: false,
      ageAttested18Plus: ageAttested,
      diseaseRiskConsentAccepted: diseaseRiskOptIn,
    });
  },

  openLegalModal: () => set({ isLegalModalOpen: true }),

  closeLegalModal: () => {
    // Only allow manual dismissal if terms have already been accepted
    if (get().hasAcceptedTerms) {
      set({ isLegalModalOpen: false });
    }
  },

  revokeConsent: () => {
    try {
      localStorage.removeItem(CONSENT_STORAGE_KEY);
    } catch (e) {
      console.warn('Failed to clear consent storage:', e);
    }
    set({
      hasAcceptedTerms: false,
      acceptedAt: null,
      isLegalModalOpen: true,
      ageAttested18Plus: false,
      diseaseRiskConsentAccepted: false,
    });
  },

  attestAge: (attested: boolean) => {
    const recordRaw = localStorage.getItem(CONSENT_STORAGE_KEY);
    if (recordRaw) {
      try {
        const record = JSON.parse(recordRaw);
        record.ageAttested18Plus = attested;
        record.ageAttestedAt = attested ? new Date().toISOString() : null;
        if (!attested && record.diseaseRiskConsent) {
            record.diseaseRiskConsent.accepted = false;
        }
        localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(record));
      } catch (e) {}
    }
    set((state) => ({ ageAttested18Plus: attested, diseaseRiskConsentAccepted: attested ? state.diseaseRiskConsentAccepted : false }));
  },

  grantDiseaseRiskConsent: () => {
    const recordRaw = localStorage.getItem(CONSENT_STORAGE_KEY);
    if (recordRaw) {
      try {
        const record = JSON.parse(recordRaw);
        record.diseaseRiskConsent = { accepted: true, version: CURRENT_CONSENT_VERSION, timestamp: new Date().toISOString() };
        if (record.acknowledgedClauses && !record.acknowledgedClauses.includes('disease_risk_opt_in_ack')) {
          record.acknowledgedClauses.push('disease_risk_opt_in_ack');
        }
        localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(record));
      } catch (e) {}
    }
    set({ diseaseRiskConsentAccepted: true });
  },

  revokeDiseaseRiskConsent: () => {
    const recordRaw = localStorage.getItem(CONSENT_STORAGE_KEY);
    if (recordRaw) {
      try {
        const record = JSON.parse(recordRaw);
        if (record.diseaseRiskConsent) record.diseaseRiskConsent.accepted = false;
        if (record.acknowledgedClauses) {
          record.acknowledgedClauses = record.acknowledgedClauses.filter((c: string) => c !== 'disease_risk_opt_in_ack');
        }
        localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(record));
      } catch (e) {}
    }
    set({ diseaseRiskConsentAccepted: false });
  },
}));

export const useDiseaseRiskAccess = () => useLegalConsentStore((s) => s.ageAttested18Plus && s.diseaseRiskConsentAccepted);
