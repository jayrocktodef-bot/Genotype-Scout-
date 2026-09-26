import { create } from 'zustand';

export const CURRENT_CONSENT_VERSION = '1.0.0';
export const CONSENT_STORAGE_KEY = 'genotype_scout_consent_v1';

export interface ConsentRecord {
  accepted: boolean;
  version: string;
  timestamp: string;
  userAgent?: string;
  acknowledgedClauses?: string[];
}

interface LegalConsentState {
  hasAcceptedTerms: boolean;
  acceptedAt: string | null;
  consentVersion: string;
  isLegalModalOpen: boolean;
  
  // Actions
  acceptTerms: (clauses?: string[]) => void;
  openLegalModal: () => void;
  closeLegalModal: () => void;
  revokeConsent: () => void;
}

function loadInitialConsent(): { hasAccepted: boolean; timestamp: string | null } {
  if (typeof window === 'undefined') {
    return { hasAccepted: false, timestamp: null };
  }
  try {
    const raw = localStorage.getItem(CONSENT_STORAGE_KEY);
    if (!raw) return { hasAccepted: false, timestamp: null };
    const parsed: ConsentRecord = JSON.parse(raw);
    if (parsed.accepted && parsed.version === CURRENT_CONSENT_VERSION) {
      return { hasAccepted: true, timestamp: parsed.timestamp };
    }
  } catch (e) {
    console.warn('Failed to parse legal consent record:', e);
  }
  return { hasAccepted: false, timestamp: null };
}

const initial = loadInitialConsent();

export const useLegalConsentStore = create<LegalConsentState>((set, get) => ({
  hasAcceptedTerms: initial.hasAccepted,
  acceptedAt: initial.timestamp,
  consentVersion: CURRENT_CONSENT_VERSION,
  // If not accepted yet, modal starts open on first visit
  isLegalModalOpen: !initial.hasAccepted,

  acceptTerms: (clauses = []) => {
    const timestamp = new Date().toISOString();
    const record: ConsentRecord = {
      accepted: true,
      version: CURRENT_CONSENT_VERSION,
      timestamp,
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
      acknowledgedClauses: clauses,
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
    });
  },
}));
