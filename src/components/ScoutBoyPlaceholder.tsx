import React, { useEffect, useState } from 'react';

interface ScoutBoyProps {
  message?: string;
  subMessage?: string;
}

export const ScoutBoyPlaceholder: React.FC<ScoutBoyProps> = ({
  message = 'UNDER CONSTRUCTION',
  subMessage = 'The Oracle is being rebuilt...',
}) => {
  const [frame, setFrame] = useState(0);

  // Animation frame cycler for the hammer swing
  useEffect(() => {
    const interval = setInterval(() => {
      setFrame((f) => (f + 1) % 4);
    }, 120);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-full min-h-[400px] flex items-center justify-center bg-black overflow-hidden select-none rounded-xl">
      {/* Retro scanline overlay */}
      <div
        className="pointer-events-none absolute inset-0 z-20 opacity-30"
        style={{
          backgroundImage:
            'repeating-linear-gradient(0deg, rgba(0,0,0,0.6) 0px, rgba(0,0,0,0.6) 1px, transparent 1px, transparent 3px)',
        }}
      />

      {/* CRT vignette */}
      <div
        className="pointer-events-none absolute inset-0 z-20"
        style={{
          background:
            'radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.85) 100%)',
        }}
      />

      <style>{`
        @keyframes blink {
          0%, 49% { opacity: 1; }
          50%, 100% { opacity: 0; }
        }
        @keyframes marquee {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
        @keyframes shake {
          0% { transform: translate(0, 0); }
          25% { transform: translate(-1px, 1px); }
          50% { transform: translate(1px, -1px); }
          75% { transform: translate(-1px, -1px); }
          100% { transform: translate(0, 0); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-2px); }
        }
        .pixel-font {
          font-family: 'Courier New', monospace;
          image-rendering: pixelated;
          text-shadow: 2px 2px 0 #000;
        }
        .pixel-canvas {
          image-rendering: pixelated;
          image-rendering: -moz-crisp-edges;
          image-rendering: crisp-edges;
        }
        .blink {
          animation: blink 1s steps(1) infinite;
        }
        .float-slow {
          animation: float 1.5s ease-in-out infinite;
        }
        .shake {
          animation: shake 0.1s linear infinite;
        }
        .marquee {
          animation: marquee 12s linear infinite;
          white-space: nowrap;
        }
      `}</style>

      <div className="relative z-10 flex flex-col items-center gap-6 px-4 w-full">
        {/* Marqee top strip */}
        <div className="w-full max-w-2xl overflow-hidden border-4 border-yellow-400 bg-blue-900 py-1">
          <div className="marquee text-yellow-400 pixel-font text-xs sm:text-sm tracking-widest font-bold">
            ★ WELCOME TO THE ORACLE ★ SCOUT BOY IS ON THE JOB ★ PLEASE STAND BY ★
          </div>
        </div>

        {/* Scene */}
        <div className="relative bg-slate-800 border-4 border-yellow-400 p-6 sm:p-8 shadow-[8px_8px_0_0_#000]">
          <div className="flex items-end justify-center gap-4">
            {/* Console / work station */}
            <svg
              width="96"
              height="80"
              viewBox="0 0 12 10"
              className="pixel-canvas float-slow"
              style={{ imageRendering: 'pixelated' }}
            >
              {/* Desk base */}
              <rect x="0" y="7" width="12" height="3" fill="#6b4423" />
              <rect x="0" y="7" width="12" height="1" fill="#8b5a2b" />

              {/* Monitor */}
              <rect x="2" y="1" width="8" height="6" fill="#2d3748" />
              <rect x="3" y="2" width="6" height="4" fill="#3b82f6" />
              <rect x="3" y="2" width="6" height="4" fill="#1e3a8a" opacity="0.5" />

              {/* Screen flicker pixels */}
              <rect x="4" y={2 + frame} width="1" height="1" fill="#22d3ee" />
              <rect x="6" y={4 - frame * 0.5} width="1" height="1" fill="#22d3ee" />
              <rect x="7" y={3 + frame * 0.5} width="1" height="1" fill="#22d3ee" />

              {/* Stand */}
              <rect x="5" y="7" width="2" height="1" fill="#2d3748" />

              {/* Keyboard */}
              <rect x="3" y="6" width="6" height="1" fill="#cbd5e0" />
              <rect x="4" y="6" width="1" height="1" fill="#4a5568" />
              <rect x="6" y="6" width="1" height="1" fill="#4a5568" />
            </svg>

            {/* Scout Boy character */}
            <div
              className="relative pixel-canvas"
              style={{ animation: 'float 0.6s ease-in-out infinite' }}
            >
              <svg
                width="64"
                height="96"
                viewBox="0 0 8 12"
                className="pixel-canvas"
                style={{ imageRendering: 'pixelated' }}
              >
                {/* Cap */}
                <rect x="1" y="0" width="6" height="1" fill="#dc2626" />
                <rect x="0" y="1" width="8" height="1" fill="#dc2626" />
                <rect x="0" y="2" width="2" height="1" fill="#dc2626" />
                <rect x="1" y="1" width="6" height="1" fill="#991b1b" />

                {/* Face */}
                <rect x="1" y="2" width="6" height="3" fill="#fcd9b8" />
                {/* Eyes depend on frame to feel alive */}
                <rect
                  x="2"
                  y="3"
                  width="1"
                  height="1"
                  fill={frame === 2 ? '#000' : '#1e293b'}
                />
                <rect
                  x="5"
                  y="3"
                  width="1"
                  height="1"
                  fill={frame === 2 ? '#000' : '#1e293b'}
                />
                {/* Mouth - gritted teeth when hammering */}
                <rect x="3" y="4" width="2" height="1" fill="#7c2d12" />

                {/* Body / shirt */}
                <rect x="1" y="5" width="6" height="3" fill="#facc15" />
                <rect x="1" y="5" width="6" height="1" fill="#eab308" />
                {/* Belt */}
                <rect x="1" y="7" width="6" height="1" fill="#78350f" />
                <rect x="3" y="7" width="2" height="1" fill="#fbbf24" />

                {/* Legs */}
                <rect x="2" y="8" width="1" height="2" fill="#1e3a8a" />
                <rect x="5" y="8" width="1" height="2" fill="#1e3a8a" />
                {/* Shoes */}
                <rect x="1" y="10" width="2" height="1" fill="#111827" />
                <rect x="5" y="10" width="2" height="1" fill="#111827" />

                {/* Left arm - static */}
                <rect x="0" y="5" width="1" height="3" fill="#fcd9b8" />
                <rect x="0" y="7" width="1" height="1" fill="#facc15" />

                {/* Right arm - the hammer arm, alternates */}
                {/* Arm resting position */}
                <rect
                  x={frame < 2 ? 7 : 7}
                  y={frame < 2 ? 5 : 4}
                  width="1"
                  height="3"
                  fill="#fcd9b8"
                />

                {/* Hammer */}
                {/* Handle */}
                <rect
                  x={frame < 2 ? 7 : 7}
                  y={frame < 2 ? 4 : 3}
                  width="1"
                  height="2"
                  fill="#92400e"
                />
                {/* Head of hammer swings down */}
                <g
                  style={{
                    transformOrigin: '7.5px 4px',
                    transform:
                      frame < 2
                        ? 'rotate(-30deg)'
                        : frame < 3
                        ? 'rotate(10deg)'
                        : 'rotate(25deg)',
                    transition: 'transform 0.05s linear',
                  }}
                >
                  <rect x="6.5" y="2" width="2" height="1.5" fill="#6b7280" />
                  <rect x="6.5" y="2" width="2" height="0.5" fill="#9ca3af" />
                </g>
              </svg>

              {/* Impact spark when hammer hits */}
              {frame === 3 && (
                <div className="absolute top-8 -right-2 text-yellow-300 text-xs font-bold pointer-events-none">
                  ✦
                </div>
              )}
            </div>
          </div>

          {/* Dust / construction particles */}
          <div className="mt-2 flex justify-center gap-2 h-4">
            {[0, 1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="w-1 h-1 bg-yellow-400"
                style={{
                  opacity: frame === 3 ? 1 : 0.2,
                  transform: `translateY(${frame === 3 ? -2 : 0}px)`,
                  transition: 'all 0.1s linear',
                }}
              />
            ))}
          </div>
        </div>

        {/* Sign */}
        <div className="relative bg-yellow-400 border-4 border-black px-6 py-3 shadow-[6px_6px_0_0_#000] -rotate-1 w-full max-w-sm">
          <div className="absolute -top-3 -left-2 w-2 h-2 bg-gray-800 border border-black" />
          <div className="absolute -top-3 -right-2 w-2 h-2 bg-gray-800 border border-black" />

          <h2 className="pixel-font text-black font-black text-lg sm:text-2xl tracking-widest text-center">
            {message}
          </h2>
          <div className="mt-1 flex items-center justify-center gap-1">
            <span className="text-black pixel-font text-[10px] sm:text-xs font-bold text-center">
              {subMessage}
            </span>
            <span className="text-black blink font-bold">█</span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full max-w-md bg-black border-4 border-yellow-400 p-1 shadow-[4px_4px_0_0_#000]">
          <div className="flex gap-1">
            {Array.from({ length: 20 }).map((_, i) => {
              return (
                <div
                  key={i}
                  className={`flex-1 h-3 ${
                    i < ((Math.floor(frame / 1) + i * 3) % 20)
                      ? 'bg-green-500'
                      : 'bg-green-900'
                  }`}
                />
              );
            })}
          </div>
        </div>

        {/* Hint text */}
        <p className="pixel-font text-[10px] sm:text-xs text-yellow-400 blink tracking-widest">
          ► INSERT COIN TO CONTINUE ◄
        </p>
      </div>
    </div>
  );
};

export default ScoutBoyPlaceholder;
