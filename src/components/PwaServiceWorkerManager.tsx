/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useRegisterSW } from 'virtual:pwa-register/react';
import { FlaskConical, CheckCircle } from 'lucide-react';

export interface PwaServiceWorkerManagerProps {
  onInstallPromptChange?: (promptEvent: any) => void;
}

export const PwaServiceWorkerManager: React.FC<PwaServiceWorkerManagerProps> = ({
  onInstallPromptChange,
}) => {
  // PWA Register service worker hooks
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    offlineReady: [offlineReady, setOfflineReady],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) {
      console.log('SW Registered: ', r);
    },
    onRegisterError(error) {
      console.log('SW registration error: ', error);
    },
  });

  // Listen for beforeinstallprompt event for PWA installation
  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      onInstallPromptChange?.(e);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, [onInstallPromptChange]);

  return (
    <AnimatePresence>
      {needRefresh && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          className="fixed bottom-6 right-6 z-[100] max-w-sm w-full bg-white dark:bg-slate-900 border border-teal-500/25 dark:border-teal-500/25 p-5 rounded-2xl shadow-2xl backdrop-blur-xl flex flex-col gap-3 animate-fade-up"
          role="alert"
        >
          <div className="flex items-start gap-3 text-left">
            <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950/20 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0">
              <FlaskConical className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h4 className="text-sm font-black text-slate-900 dark:text-slate-100 uppercase tracking-wider">Update Available</h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-normal font-medium">
                A new version of Genotype Scout is ready. Please save any active analysis before reloading.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 justify-end mt-1">
            <button
              onClick={() => setNeedRefresh(false)}
              className="px-3.5 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Later
            </button>
            <button
              onClick={() => updateServiceWorker(true)}
              className="px-4 py-1.5 bg-teal-600 hover:bg-teal-500 text-white rounded-lg text-[10px] font-black uppercase tracking-wider transition-colors shadow-lg shadow-teal-500/20 cursor-pointer"
            >
              Update Now
            </button>
          </div>
        </motion.div>
      )}

      {offlineReady && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          className="fixed bottom-6 right-6 z-[100] max-w-sm w-full bg-white dark:bg-slate-900 border border-teal-500/25 dark:border-teal-500/25 p-5 rounded-2xl shadow-2xl backdrop-blur-xl flex flex-col gap-3 animate-fade-up"
          role="alert"
        >
          <div className="flex items-start gap-3 text-left">
            <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950/20 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0">
              <CheckCircle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-black text-slate-900 dark:text-slate-100 uppercase tracking-wider">Ready Offline</h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-normal font-medium">
                App has been cached successfully and is fully ready for 100% offline-only genomic analysis.
              </p>
            </div>
          </div>
          <div className="flex justify-end mt-1">
            <button
              onClick={() => setOfflineReady(false)}
              className="px-4 py-1.5 bg-teal-600 hover:bg-teal-500 text-white rounded-lg text-[10px] font-black uppercase tracking-wider transition-colors shadow-lg shadow-teal-500/20 cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
