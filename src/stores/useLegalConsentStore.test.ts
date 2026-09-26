import { describe, it, expect, beforeEach, vi } from 'vitest';
import { 
  useLegalConsentStore, 
  CURRENT_CONSENT_VERSION, 
  CONSENT_STORAGE_KEY 
} from './useLegalConsentStore';

const createStorageMock = () => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => { store[key] = value.toString(); },
    removeItem: (key: string) => { delete store[key]; },
    clear: () => { store = {}; }
  };
};

describe('useLegalConsentStore (Clickwrap & Legal Onboarding)', () => {
  let storageMock: any;

  beforeEach(() => {
    storageMock = createStorageMock();
    Object.defineProperty(global, 'localStorage', {
      value: storageMock,
      writable: true,
      configurable: true,
    });
    Object.defineProperty(global, 'window', {
      value: { localStorage: storageMock },
      writable: true,
      configurable: true,
    });

    storageMock.clear();
    useLegalConsentStore.getState().revokeConsent();
  });

  it('starts unconsented with modal open on clean state', () => {
    const state = useLegalConsentStore.getState();
    expect(state.hasAcceptedTerms).toBe(false);
    expect(state.acceptedAt).toBeNull();
    expect(state.isLegalModalOpen).toBe(true);
    expect(state.consentVersion).toBe(CURRENT_CONSENT_VERSION);
  });

  it('accepts terms, stores record in localStorage, and closes modal', () => {
    const clauses = [
      'microarray_error_rate_ack',
      'research_use_only_ack',
      'clia_cap_confirmation_ack',
      'terms_of_service_liability_release_ack'
    ];

    useLegalConsentStore.getState().acceptTerms(clauses);

    const state = useLegalConsentStore.getState();
    expect(state.hasAcceptedTerms).toBe(true);
    expect(state.acceptedAt).toBeTruthy();
    expect(state.isLegalModalOpen).toBe(false);

    // Verify localStorage payload
    const raw = storageMock.getItem(CONSENT_STORAGE_KEY);
    expect(raw).toBeTruthy();
    const parsed = JSON.parse(raw!);
    expect(parsed.accepted).toBe(true);
    expect(parsed.version).toBe(CURRENT_CONSENT_VERSION);
    expect(parsed.acknowledgedClauses).toEqual(clauses);
  });

  it('prevents closing legal modal if terms have not been accepted', () => {
    useLegalConsentStore.getState().revokeConsent();
    expect(useLegalConsentStore.getState().hasAcceptedTerms).toBe(false);

    // Attempt to close without accepting
    useLegalConsentStore.getState().closeLegalModal();
    expect(useLegalConsentStore.getState().isLegalModalOpen).toBe(true);
  });

  it('allows closing legal modal if terms have already been accepted', () => {
    useLegalConsentStore.getState().acceptTerms();
    expect(useLegalConsentStore.getState().isLegalModalOpen).toBe(false);

    // Reopen modal to review
    useLegalConsentStore.getState().openLegalModal();
    expect(useLegalConsentStore.getState().isLegalModalOpen).toBe(true);

    // Close modal
    useLegalConsentStore.getState().closeLegalModal();
    expect(useLegalConsentStore.getState().isLegalModalOpen).toBe(false);
  });

  it('revoking consent resets state, clears localStorage, and re-opens modal', () => {
    useLegalConsentStore.getState().acceptTerms();
    expect(useLegalConsentStore.getState().hasAcceptedTerms).toBe(true);

    useLegalConsentStore.getState().revokeConsent();

    const state = useLegalConsentStore.getState();
    expect(state.hasAcceptedTerms).toBe(false);
    expect(state.acceptedAt).toBeNull();
    expect(state.isLegalModalOpen).toBe(true);
    expect(storageMock.getItem(CONSENT_STORAGE_KEY)).toBeNull();
  });
});
