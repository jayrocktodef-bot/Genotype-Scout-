import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { ErrorBoundary } from './components/ErrorBoundary.tsx';
import { hydrateReferenceDatabase } from './services/dbHydrator';
import { enforceCacheEpoch } from './utils/cacheManager';

// Enforce cache epoch and clear stale service workers / caches if needed
enforceCacheEpoch().catch(err => console.warn('[App] Cache epoch enforcement check failed:', err));

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
);

// Trigger background hydration of the genomic reference database
hydrateReferenceDatabase().catch(err => console.error('Genomic DB hydration failed:', err));

