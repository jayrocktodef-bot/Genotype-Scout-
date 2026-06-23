import { useEffect, useRef } from 'react';

declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

interface AdBannerProps {
  /** Ad slot ID from AdSense (leave empty for auto ads) */
  slot?: string;
  /** Ad format: 'auto' | 'horizontal' | 'vertical' | 'rectangle' */
  format?: 'auto' | 'horizontal' | 'vertical' | 'rectangle';
  /** Additional CSS class names */
  className?: string;
  /** Whether to show a subtle label */
  showLabel?: boolean;
}

/**
 * Reusable Google AdSense banner component.
 * Handles ad initialization, responsive sizing, and graceful fallback.
 */
export default function AdBanner({ 
  slot, 
  format = 'auto', 
  className = '',
  showLabel = true 
}: AdBannerProps) {
  const adRef = useRef<HTMLDivElement>(null);
  const pushed = useRef(false);

  useEffect(() => {
    // Only push once per mount
    if (pushed.current) return;

    try {
      if (typeof window !== 'undefined' && window.adsbygoogle) {
        window.adsbygoogle.push({});
        pushed.current = true;
      }
    } catch (e) {
      // Ad blocker or script not loaded — fail silently
      console.debug('[AdBanner] Ad init skipped:', e);
    }
  }, []);

  // Map format to AdSense data attributes
  const formatStyle: Record<string, React.CSSProperties> = {
    auto: { display: 'block' },
    horizontal: { display: 'inline-block', width: '100%', height: '90px' },
    vertical: { display: 'inline-block', width: '160px', height: '600px' },
    rectangle: { display: 'inline-block', width: '336px', height: '280px' },
  };

  return (
    <div
      ref={adRef}
      className={`ad-banner-container overflow-hidden ${className}`}
    >
      {showLabel && (
        <p className="text-[8px] font-black text-slate-300 dark:text-slate-600 uppercase tracking-[0.2em] text-center mb-1 select-none">
          Advertisement
        </p>
      )}
      <ins
        className="adsbygoogle"
        style={formatStyle[format] || formatStyle.auto}
        data-ad-client="ca-pub-6734186229480105"
        {...(slot ? { 'data-ad-slot': slot } : {})}
        data-ad-format={format === 'auto' ? 'auto' : undefined}
        data-full-width-responsive={format === 'auto' ? 'true' : undefined}
      />
    </div>
  );
}
