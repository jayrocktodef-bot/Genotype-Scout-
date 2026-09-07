// Native Web Audio 8-Bit Chiptune Synthesizer (Zero dependencies, 0 KB assets)

class RetroAudioService {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private hasInteracted: boolean = false;

  constructor() {
    if (typeof window !== 'undefined') {
      const handleUserGesture = () => {
        this.hasInteracted = true;
        if (this.ctx && this.ctx.state === 'suspended') {
          this.ctx.resume().catch(() => {});
        }
      };
      window.addEventListener('click', handleUserGesture, { once: true });
      window.addEventListener('keydown', handleUserGesture, { once: true });
      window.addEventListener('touchstart', handleUserGesture, { once: true });
    }
  }

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined' || !this.hasInteracted) return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public toggleMute(): boolean {
    this.hasInteracted = true;
    this.isMuted = !this.isMuted;
    if (!this.isMuted) {
      this.playBlip(587, 0.05); // quick D5 feedback beep
    }
    return this.isMuted;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public setMuted(muted: boolean): void {
    this.isMuted = muted;
  }

  /**
   * Play a classic 8-bit square wave bleep
   */
  public playBlip(freq = 440, duration = 0.04, gainLevel = 0.04): void {
    if (this.isMuted) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'square'; // Authentic NES 8-bit square wave
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      // Fast decay envelope for classic retro click/blip
      gain.gain.setValueAtTime(gainLevel, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch {
      // Ignore audio failure if user has not interacted yet
    }
  }

  /**
   * Play retro level-up / victory fanfare (C5 -> E5 -> G5 -> C6)
   */
  public playFanfare(): void {
    if (this.isMuted) return;
    const notes = [
      { f: 523.25, d: 0.08, delay: 0 },
      { f: 659.25, d: 0.08, delay: 0.09 },
      { f: 783.99, d: 0.08, delay: 0.18 },
      { f: 1046.50, d: 0.25, delay: 0.27 }
    ];

    notes.forEach(n => {
      setTimeout(() => {
        this.playBlip(n.f, n.d, 0.06);
      }, n.delay * 1000);
    });
  }
}

export const retroAudio = new RetroAudioService();
