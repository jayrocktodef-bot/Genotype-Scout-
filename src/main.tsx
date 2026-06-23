import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { ErrorBoundary } from './components/ErrorBoundary.tsx';
import { SpeedInsights } from "@vercel/speed-insights/react";
import { Analytics } from "@vercel/analytics/react";
import { hydrateReferenceDatabase } from './services/dbHydrator';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
      <SpeedInsights />
      <Analytics />
    </ErrorBoundary>
  </StrictMode>,
);

// Trigger background hydration of the genomic reference database
hydrateReferenceDatabase().catch(err => console.error('Genomic DB hydration failed:', err));
