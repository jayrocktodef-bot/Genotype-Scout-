/**
 * Procedural Retro 8-bit / 16-bit Sound Synthesizer
 * Built entirely with browser-native Web Audio API — 0 external audio files needed!
 */

let audioCtx: AudioContext | null = null;
let isMuted = false;

// Initialize mute preference from storage
try {
  const stored = localStorage.getItem('scout_retro_sfx');
  if (stored !== null) {
    isMuted = stored === 'false';
  }
} catch {
  // Ignore storage access errors
}

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

interface ToneParams {
  freq: number;
  dur: number;
  type?: OscillatorType;
  vol?: number;
  slideTo?: number;
}

function playTone({ freq, dur, type = 'square', vol = 0.08, slideTo }: ToneParams) {
  if (isMuted) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);

    if (slideTo) {
      osc.frequency.exponentialRampToValueAtTime(Math.max(20, slideTo), ctx.currentTime + dur);
    }

    gain.gain.setValueAtTime(vol, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + dur);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + dur);
  } catch {
    // Audio synthesis failure safe guard
  }
}

let lastHoverTime = 0;

export const SFX = {
  isMuted: () => isMuted,
  setMuted: (muted: boolean) => {
    isMuted = muted;
    try {
      localStorage.setItem('scout_retro_sfx', muted ? 'false' : 'true');
    } catch {}
  },
  toggleMute: () => {
    SFX.setMuted(!isMuted);
    if (!isMuted) {
      SFX.select();
    }
    return isMuted;
  },

  // Subtle button / slot hover blip (throttled)
  hover: () => {
    const now = Date.now();
    if (now - lastHoverTime < 60) return;
    lastHoverTime = now;
    playTone({ freq: 880, dur: 0.03, vol: 0.03, type: 'square' });
  },

  // Button select chirp
  select: () => {
    playTone({ freq: 660, dur: 0.04, vol: 0.07, type: 'square' });
    setTimeout(() => {
      playTone({ freq: 1100, dur: 0.07, slideTo: 1400, vol: 0.08, type: 'square' });
    }, 45);
  },

  // Arcade Insert Coin / Credit Sound
  coin: () => {
    playTone({ freq: 988, dur: 0.08, vol: 0.1, type: 'square' });
    setTimeout(() => {
      playTone({ freq: 1319, dur: 0.18, vol: 0.12, type: 'square' });
    }, 75);
  },

  // Cartridge Slot Physical Insertion Clunk + Tone
  cartridgeInsert: () => {
    playTone({ freq: 140, dur: 0.1, vol: 0.12, slideTo: 60, type: 'triangle' });
    setTimeout(() => {
      playTone({ freq: 880, dur: 0.05, vol: 0.08, type: 'square' });
      setTimeout(() => {
        playTone({ freq: 1760, dur: 0.12, vol: 0.1, type: 'square' });
      }, 50);
    }, 100);
  },

  // Sci-fi scan / laser sweep
  laser: () => {
    playTone({ freq: 1800, dur: 0.14, slideTo: 220, vol: 0.07, type: 'sawtooth' });
  },

  // Retro Error / Warning Buzzer
  error: () => {
    playTone({ freq: 180, dur: 0.16, vol: 0.1, type: 'sawtooth' });
    setTimeout(() => {
      playTone({ freq: 130, dur: 0.22, vol: 0.1, type: 'sawtooth' });
    }, 110);
  },

  // Retro Boot Arpeggio
  boot: () => {
    const notes = [440, 554, 659, 880, 1108];
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        playTone({ freq, dur: 0.08, vol: 0.06, type: 'square' });
      }, idx * 60);
    });
  }
};
