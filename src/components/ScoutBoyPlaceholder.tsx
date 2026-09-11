import React, { useEffect, useState } from 'react';

interface ScoutBoyProps {
  message?: string;
  subMessage?: string;
}

export const ScoutBoyPlaceholder: React.FC<ScoutBoyProps> = ({
  message = 'UNDER CONSTRUCTION',
  subMessage = 'Oracle V3 is being recalibrated...',
}) => {
  const [frame, setFrame] = useState(0);
  const [progress, setProgress] = useState(38);
  const [showCoin, setShowCoin] = useState(true);
  const [viewMode, setViewMode] = useState<'sprite' | 'pixel'>('sprite');

  // Animation frame cycler for hammer swing & spark generation
  useEffect(() => {
    const interval = setInterval(() => {
      setFrame((f) => (f + 1) % 4);
    }, 180);
    return () => clearInterval(interval);
  }, []);

  // Progress ticker
  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress((prev) => (prev >= 98 ? 12 : prev + 2));
    }, 350);
    return () => clearInterval(progressInterval);
  }, []);

  // Retro coin blinker
  useEffect(() => {
    const coinInterval = setInterval(() => {
      setShowCoin((prev) => !prev);
    }, 700);
    return () => clearInterval(coinInterval);
  }, []);

  // 20-segment retro progress bar
  const renderSegmentedProgress = () => {
    const totalSegments = 20;
    const filledSegments = Math.floor((progress / 100) * totalSegments);
    return Array.from({ length: totalSegments }, (_, i) => (
      <div
        key={i}
        className="flex-1 h-full transition-colors duration-150"
        style={{
          backgroundColor: i < filledSegments ? '#22c55e' : '#1e293b',
          border: '1px solid #000',
          boxShadow:
            i < filledSegments
              ? 'inset 0 0 6px rgba(34,197,94,0.8)'
              : 'inset 0 0 4px rgba(0,0,0,0.6)',
        }}
      />
    ));
  };

  // Spark particles bursting on hammer impact
  const renderSparks = () => {
    if (frame !== 2 && frame !== 3) return null;
    const sparks = [
      { text: '✦', x: 52, y: 36, size: 18, color: '#fbbf24', delay: '0s' },
      { text: '✧', x: 50, y: 30, size: 14, color: '#f59e0b', delay: '0.05s' },
      { text: '✦', x: 56, y: 32, size: 16, color: '#22c55e', delay: '0.1s' },
      { text: '★', x: 48, y: 40, size: 12, color: '#ef4444', delay: '0.08s' },
    ];

    return sparks.map((s, i) => (
      <span
        key={i}
        style={{
          position: 'absolute',
          left: `${s.x}%`,
          top: `${s.y}%`,
          fontSize: `${s.size}px`,
          color: s.color,
          animation: 'sparkFly 0.4s ease-out forwards',
          animationDelay: s.delay,
          pointerEvents: 'none',
          zIndex: 25,
        }}
      >
        {s.text}
      </span>
    ));
  };

  // 8-bit DeepSeek pixel SVG representation of Scout Boy (locs, lab coat, jeans, green sneakers, beaker)
  const renderScoutBoyPixelSVG = () => (
    <svg
      width="140"
      height="180"
      viewBox="0 0 120 160"
      className="select-none"
      style={{
        imageRendering: 'pixelated',
        filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.8))',
      }}
    >
      {/* Dreadlocks / locs back layer */}
      <rect x="26" y="24" width="8" height="26" fill="#0f172a" />
      <rect x="34" y="16" width="8" height="34" fill="#111827" />
      <rect x="42" y="14" width="8" height="38" fill="#0f172a" />
      <rect x="50" y="14" width="8" height="38" fill="#111827" />
      <rect x="58" y="16" width="8" height="34" fill="#0f172a" />
      <rect x="66" y="22" width="8" height="28" fill="#111827" />
      <rect x="74" y="26" width="6" height="22" fill="#0f172a" />

      {/* Face & Ears (rich brown skin tone) */}
      <rect x="36" y="24" width="34" height="26" fill="#8d5524" />
      <rect x="32" y="32" width="4" height="8" fill="#78350f" />
      <rect x="70" y="32" width="4" height="8" fill="#78350f" />

      {/* Dreadlocks hanging forward over temples */}
      <rect x="32" y="22" width="6" height="22" fill="#111827" />
      <rect x="68" y="22" width="6" height="22" fill="#111827" />
      <rect x="30" y="36" width="4" height="14" fill="#0f172a" />
      <rect x="72" y="36" width="4" height="14" fill="#0f172a" />

      {/* Eyes with cheerful focus */}
      <rect x="42" y="31" width="6" height="6" fill="#ffffff" />
      <rect x="58" y="31" width="6" height="6" fill="#ffffff" />
      <rect x="45" y="33" width="3" height="4" fill="#0f172a" />
      <rect x="59" y="33" width="3" height="4" fill="#0f172a" />
      <rect x="46" y="33" width="1" height="1" fill="#ffffff" />
      <rect x="60" y="33" width="1" height="1" fill="#ffffff" />

      {/* Eyebrows */}
      <rect x="41" y="28" width="8" height="2" fill="#0f172a" />
      <rect x="57" y="28" width="8" height="2" fill="#0f172a" />

      {/* Nose */}
      <rect x="51" y="38" width="4" height="3" fill="#602809" />

      {/* Mouth (smiling while working) */}
      <rect x="45" y="43" width="16" height="4" fill="#0f172a" />
      <rect x="47" y="44" width="12" height="2" fill="#ffffff" />

      {/* Neck */}
      <rect x="47" y="50" width="12" height="6" fill="#8d5524" />

      {/* Inner shirt (dark blue/charcoal) */}
      <rect x="43" y="56" width="20" height="8" fill="#1e293b" />

      {/* White Scientist Lab Coat */}
      <rect x="30" y="56" width="13" height="40" fill="#f8fafc" />
      <rect x="63" y="56" width="13" height="40" fill="#f8fafc" />
      <rect x="43" y="64" width="20" height="32" fill="#ffffff" />

      {/* Coat Lapels & Seams */}
      <polygon points="36,56 44,70 41,70 33,56" fill="#e2e8f0" />
      <polygon points="70,56 62,70 65,70 73,56" fill="#e2e8f0" />
      <rect x="52" y="64" width="2" height="32" fill="#cbd5e1" />

      {/* Pockets */}
      <rect x="34" y="78" width="10" height="8" fill="#e2e8f0" />
      <rect x="62" y="78" width="10" height="8" fill="#e2e8f0" />
      <rect x="34" y="78" width="10" height="2" fill="#cbd5e1" />
      <rect x="62" y="78" width="10" height="2" fill="#cbd5e1" />

      {/* Right hand holding beaker with bubbling green DNA solution */}
      <rect x="76" y="60" width="12" height="8" fill="#f8fafc" />
      <rect x="88" y="62" width="6" height="6" fill="#8d5524" />
      {/* Beaker */}
      <rect x="91" y="54" width="12" height="18" fill="rgba(255,255,255,0.4)" stroke="#94a3b8" strokeWidth="1" />
      <rect x="92" y="63" width="10" height="8" fill="#22c55e" opacity="0.9" />
      {/* Bubbles */}
      <circle cx="95" cy="65" r="1.5" fill="#86efac" />
      <circle cx="98" cy="60" r="1" fill="#4ade80" />
      <circle cx="96" cy="56" r="1" fill="#86efac" />

      {/* Left arm: swinging the hammer */}
      <g
        style={{
          transformOrigin: '32px 58px',
          transform:
            frame === 0
              ? 'rotate(-25deg)'
              : frame === 1
              ? 'rotate(-10deg)'
              : frame === 2
              ? 'rotate(25deg)'
              : 'rotate(20deg)',
          transition: 'transform 0.08s ease-in-out',
        }}
      >
        <rect x="18" y="56" width="14" height="8" fill="#f8fafc" />
        <rect x="10" y="56" width="8" height="7" fill="#8d5524" />
        {/* Hammer Handle */}
        <rect x="4" y="44" width="6" height="28" fill="#78350f" rx="1" />
        {/* Hammer Head */}
        <rect x="-2" y="40" width="18" height="9" fill="#64748b" rx="1" />
        <rect x="-1" y="41" width="16" height="3" fill="#94a3b8" />
      </g>

      {/* Blue Denim Jeans */}
      <rect x="38" y="96" width="30" height="24" fill="#2563eb" />
      <rect x="38" y="96" width="30" height="3" fill="#1d4ed8" />
      <rect x="52" y="99" width="2" height="21" fill="#1e40af" />
      <rect x="38" y="118" width="13" height="18" fill="#1d4ed8" />
      <rect x="55" y="118" width="13" height="18" fill="#1d4ed8" />

      {/* Green Canvas Sneakers (Converse style: deep green with white toe caps) */}
      <rect x="34" y="136" width="17" height="8" fill="#15803d" rx="2" />
      <rect x="34" y="142" width="17" height="3" fill="#ffffff" />
      <rect x="32" y="138" width="5" height="6" fill="#ffffff" rx="1" />

      <rect x="55" y="136" width="17" height="8" fill="#15803d" rx="2" />
      <rect x="55" y="142" width="17" height="3" fill="#ffffff" />
      <rect x="69" y="138" width="5" height="6" fill="#ffffff" rx="1" />

      {/* White shoe laces */}
      <rect x="39" y="137" width="2" height="5" fill="#ffffff" />
      <rect x="43" y="137" width="2" height="5" fill="#ffffff" />
      <rect x="60" y="137" width="2" height="5" fill="#ffffff" />
      <rect x="64" y="137" width="2" height="5" fill="#ffffff" />
    </svg>
  );

  // Upload screen official mascot sprite with animated hammer & workshop interactions
  const renderUploadScreenSprite = () => (
    <div className="relative flex items-center justify-center select-none">
      {/* Bobbing Mascot with running / working bounce */}
      <div
        className="relative z-10 transition-transform duration-150"
        style={{
          transform:
            frame === 0
              ? 'translateY(-4px) rotate(-1deg)'
              : frame === 1
              ? 'translateY(0px) rotate(0deg)'
              : frame === 2
              ? 'translateY(3px) rotate(2deg) scale(0.98)'
              : 'translateY(-1px) rotate(1deg)',
        }}
      >
        <img
          src="/assets/scout_boy_scientist.png"
          alt="Scout Boy"
          className="w-40 sm:w-48 h-auto object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.85)]"
        />
      </div>

      {/* Overlay Hammer striking the terminal */}
      <div
        className="absolute -left-5 sm:-left-7 top-4 sm:top-6 z-20 transition-transform duration-75"
        style={{
          transformOrigin: 'bottom right',
          transform:
            frame === 0
              ? 'rotate(-38deg)'
              : frame === 1
              ? 'rotate(-15deg)'
              : frame === 2
              ? 'rotate(28deg) translateY(5px)'
              : 'rotate(12deg)',
        }}
      >
        <svg width="52" height="52" viewBox="0 0 24 24" className="drop-shadow-lg">
          {/* Wooden handle */}
          <rect x="10" y="6" width="4" height="16" fill="#92400e" rx="1" />
          <rect x="11" y="8" width="2" height="12" fill="#b45309" />
          {/* Steel head */}
          <rect x="3" y="2" width="18" height="7" fill="#475569" rx="1" />
          <rect x="4" y="3" width="16" height="2" fill="#94a3b8" />
          <rect x="3" y="7" width="18" height="2" fill="#334155" />
        </svg>
      </div>
    </div>
  );

  return (
    <div className="relative w-full h-full min-h-[460px] flex flex-col items-center justify-center bg-[#070b14] overflow-hidden select-none rounded-2xl border-4 border-slate-800 shadow-2xl p-4 sm:p-6 font-mono text-white">
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
        @keyframes blinkSlow {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.2; }
        }
        @keyframes sparkFly {
          0% { opacity: 0; transform: translate(0, 0) scale(0.6); }
          40% { opacity: 1; transform: translate(-6px, -12px) scale(1.3); }
          80% { opacity: 0.9; transform: translate(-14px, -22px) scale(1); }
          100% { opacity: 0; transform: translate(-20px, -30px) scale(0.4); }
        }
        @keyframes hazardScroll {
          0% { background-position: 0 0; }
          100% { background-position: 56px 0; }
        }
        @keyframes gearSpin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes pulseTerminal {
          0%, 100% { box-shadow: 0 0 15px rgba(34,197,94,0.4), 0 0 30px rgba(34,197,94,0.15); }
          50% { box-shadow: 0 0 25px rgba(34,197,94,0.7), 0 0 45px rgba(34,197,94,0.3); }
        }
      `}</style>

      {/* Top Hazard Warning Stripe */}
      <div
        className="absolute top-0 left-0 right-0 h-6 border-b-2 border-black z-30"
        style={{
          background:
            'repeating-linear-gradient(45deg, #fbbf24, #fbbf24 14px, #000 14px, #000 28px)',
          animation: 'hazardScroll 1.2s linear infinite',
        }}
      />

      {/* Bottom Hazard Warning Stripe */}
      <div
        className="absolute bottom-0 left-0 right-0 h-6 border-t-2 border-black z-30"
        style={{
          background:
            'repeating-linear-gradient(45deg, #fbbf24, #fbbf24 14px, #000 14px, #000 28px)',
          animation: 'hazardScroll 1.2s linear infinite',
        }}
      />

      {/* Ambient Celestial Particle Grid */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div
          className="w-full h-full"
          style={{
            backgroundImage:
              'radial-gradient(circle at 50% 50%, rgba(99,102,241,0.2) 0%, transparent 80%)',
          }}
        />
      </div>

      {/* CRT Scanline Overlay */}
      <div
        className="pointer-events-none absolute inset-0 z-40 opacity-25"
        style={{
          backgroundImage:
            'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.7) 2px, rgba(0,0,0,0.7) 4px)',
        }}
      />

      {/* Vignette Overlay */}
      <div
        className="pointer-events-none absolute inset-0 z-40"
        style={{
          background:
            'radial-gradient(ellipse at center, transparent 60%, rgba(0,0,0,0.85) 100%)',
        }}
      />

      {/* Top Ticker Marquee */}
      <div className="w-full max-w-xl overflow-hidden border-2 border-yellow-400 bg-black/80 py-1.5 px-2 rounded mt-4 z-20 shadow-md">
        <div className="whitespace-nowrap text-yellow-400 text-xs sm:text-sm tracking-widest font-black flex items-center gap-4"
             style={{ animation: 'marquee 14s linear infinite' }}>
          <span>★ ORACLE V3 UNDER CONSTRUCTION ★</span>
          <span>SCOUT BOY ON THE JOB</span>
          <span>RECALIBRATING POPULATION PANELS</span>
          <span>PLEASE STAND BY ★</span>
        </div>
      </div>

      {/* Center Workshop Scene */}
      <div className="relative z-20 flex flex-col items-center w-full max-w-xl my-4">
        {/* Retro Riveted Construction Sign */}
        <div className="relative bg-slate-900 border-4 border-yellow-400 px-6 py-3 rounded-lg shadow-[6px_6px_0_0_#000] text-center mb-5 -rotate-1">
          {/* Corner Screws */}
          <div className="absolute top-1 left-1 w-2 h-2 rounded-full bg-slate-400 border border-black" />
          <div className="absolute top-1 right-1 w-2 h-2 rounded-full bg-slate-400 border border-black" />
          <div className="absolute bottom-1 left-1 w-2 h-2 rounded-full bg-slate-400 border border-black" />
          <div className="absolute bottom-1 right-1 w-2 h-2 rounded-full bg-slate-400 border border-black" />

          {/* Rotating Gear Header */}
          <div
            className="inline-block text-xl text-yellow-400 mb-1"
            style={{ animation: 'gearSpin 4s linear infinite' }}
          >
            ⚙
          </div>

          <h2 className="text-xl sm:text-2xl font-black tracking-widest text-yellow-400 drop-shadow-[2px_2px_0_#000]">
            {message}
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 font-bold mt-0.5 tracking-wide">
            {subMessage}
          </p>
        </div>

        {/* Scout Boy & Oracle Mainframe Stage */}
        <div className="relative w-full min-h-[200px] flex items-end justify-center gap-4 sm:gap-8 bg-slate-950/70 border-2 border-slate-800 rounded-xl p-4 sm:p-6 shadow-inner">
          {/* Ambient Platform Glow */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 w-3/4 h-8 bg-gradient-to-r from-teal-500/20 via-indigo-500/30 to-amber-500/20 rounded-full blur-xl pointer-events-none" />

          {/* Impact Sparks */}
          {renderSparks()}

          {/* Scout Boy Character Area */}
          <div className="relative flex flex-col items-center">
            {viewMode === 'sprite' ? renderUploadScreenSprite() : renderScoutBoyPixelSVG()}

            {/* Character Base Pedestal */}
            <div className="w-24 h-3 bg-slate-800 border border-slate-600 rounded-full mt-1 flex items-center justify-center">
              <div className="w-12 h-1 bg-gradient-to-r from-teal-400 to-amber-400 rounded-full animate-pulse" />
            </div>
          </div>

          {/* Oracle Terminal Workstation */}
          <div
            className="relative w-36 sm:w-44 h-32 sm:h-36 bg-slate-900 border-4 border-slate-700 rounded-lg p-2 flex flex-col justify-between shadow-2xl z-15"
            style={{ animation: 'pulseTerminal 2.5s ease-in-out infinite' }}
          >
            {/* Terminal Screen Header */}
            <div className="flex items-center justify-between border-b border-slate-700 pb-1 text-[9px] text-teal-400 font-bold">
              <span>ORACLE_OS // V3</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            </div>

            {/* CRT Console Display */}
            <div className="relative flex-1 bg-black rounded border border-emerald-500/60 p-1.5 my-1 overflow-hidden font-mono text-[9px] sm:text-[10px] text-emerald-400 leading-tight">
              {/* Scanlines inside screen */}
              <div
                className="absolute inset-0 pointer-events-none opacity-30"
                style={{
                  backgroundImage:
                    'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,100,0.2) 2px, rgba(0,255,100,0.2) 4px)',
                }}
              />
              <div className="relative z-10 space-y-0.5">
                <div>&gt; STATUS: PATCHING</div>
                <div>&gt; ERR: 0xDEAD_AIMS</div>
                <div className="text-yellow-400">
                  &gt; SCOUT_BOY: TWEAKING
                </div>
                <div className="flex items-center gap-1 text-teal-300">
                  <span>&gt; REBUILDING</span>
                  <span className="animate-pulse">_█</span>
                </div>
              </div>
            </div>

            {/* Control Knobs & Cables */}
            <div className="flex items-center justify-between pt-1 border-t border-slate-800">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-slate-700 border border-slate-500" />
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
              </div>
              <span className="text-[8px] text-slate-500 font-black">EST. REV: V3.2</span>
            </div>
          </div>
        </div>

        {/* View Mode Switcher: Sprite vs 8-Bit Pixel */}
        <div className="flex items-center gap-2 mt-3 bg-black/60 border border-slate-800 rounded-full px-3 py-1 text-[11px]">
          <span className="text-slate-400 font-semibold">Avatar Style:</span>
          <button
            type="button"
            onClick={() => setViewMode('sprite')}
            className={`px-2 py-0.5 rounded-full transition-colors cursor-pointer ${
              viewMode === 'sprite'
                ? 'bg-amber-500 text-black font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Mascot Sprite
          </button>
          <button
            type="button"
            onClick={() => setViewMode('pixel')}
            className={`px-2 py-0.5 rounded-full transition-colors cursor-pointer ${
              viewMode === 'pixel'
                ? 'bg-amber-500 text-black font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            8-Bit Pixel
          </button>
        </div>

        {/* Progress Bar Container */}
        <div className="w-full max-w-md mt-4">
          <div className="flex justify-between text-[11px] text-slate-400 font-bold mb-1">
            <span>RECALIBRATION PROGRESS</span>
            <span className="text-emerald-400">{progress}%</span>
          </div>
          <div className="w-full h-5 bg-black border-2 border-yellow-400 p-0.5 rounded flex gap-0.5 shadow-md">
            {renderSegmentedProgress()}
          </div>
        </div>

        {/* Retro Flashing Text */}
        <div className="mt-3 flex items-center justify-center gap-4 text-xs tracking-widest font-black">
          <span
            className="transition-opacity duration-100"
            style={{
              color: showCoin ? '#fbbf24' : 'transparent',
              textShadow: showCoin ? '0 0 8px rgba(251,191,36,0.8)' : 'none',
            }}
          >
            ► INSERT COIN ◄
          </span>
          <span className="text-slate-600">|</span>
          <span
            className="text-teal-400"
            style={{ animation: 'blinkSlow 1.8s step-end infinite' }}
          >
            PLEASE STAND BY
          </span>
        </div>
      </div>
    </div>
  );
};

export default ScoutBoyPlaceholder;
