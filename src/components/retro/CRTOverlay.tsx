import React from 'react';

interface CRTOverlayProps {
  enabled?: boolean;
}

export const CRTOverlay: React.FC<CRTOverlayProps> = ({ enabled = true }) => {
  if (!enabled) return null;

  return (
    <div 
      className="pointer-events-none fixed inset-0 z-30 overflow-hidden select-none"
      aria-hidden="true"
    >
      {/* 1. Pure dark scanline striping (never adds white wash) */}
      <div 
        className="absolute inset-0 opacity-[0.20]" 
        style={{
          backgroundImage: 'linear-gradient(to bottom, transparent 50%, rgba(0, 0, 0, 0.7) 50%)',
          backgroundSize: '100% 4px'
        }}
      />

      {/* 2. Radial CRT Vignette (curved tube shadow) */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 70%, rgba(0, 0, 0, 0.5) 100%)',
          boxShadow: 'inset 0 0 60px rgba(0,0,0,0.6)'
        }}
      />
    </div>
  );
};

export default CRTOverlay;
