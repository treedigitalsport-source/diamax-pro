// DIAMAX PRO OS — Acoustic Web Audio Synthesizer (Zero-Dependency Sound System)
// Generates authentic baseball audio frequencies: hits, strikes, balls, out, home run, and bullpen alerts.

class DiamaxSoundSystem {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;

  constructor() {
    // Lazy AudioContext creation on first user interaction
  }

  private initContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
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

  public setMuted(muted: boolean): void {
    this.isMuted = muted;
  }

  public toggleMuted(): boolean {
    this.isMuted = !this.isMuted;
    return this.isMuted;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  // Tactical Keypad Click (650 Hz -> 320 Hz)
  public playClick(): void {
    if (this.isMuted) return;
    try {
      const ctx = this.initContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(650, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(320, ctx.currentTime + 0.05);
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.05);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.05);
    } catch {
      // Ignored for environments without audio permissions
    }
  }

  // Strike Umpire Chime (800 Hz -> 450 Hz)
  public playStrike(): void {
    if (this.isMuted) return;
    try {
      const ctx = this.initContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(450, ctx.currentTime + 0.12);
      gain.gain.setValueAtTime(0.22, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.12);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.12);
    } catch {}
  }

  // Ball Pitch Tone (380 Hz -> 290 Hz)
  public playBall(): void {
    if (this.isMuted) return;
    try {
      const ctx = this.initContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(380, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(290, ctx.currentTime + 0.14);
      gain.gain.setValueAtTime(0.18, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.14);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.14);
    } catch {}
  }

  // Bat Crack / Hit (Dual Harmony: 523.25 Hz C5 + 659.25 Hz E5)
  public playHit(): void {
    if (this.isMuted) return;
    try {
      const ctx = this.initContext();
      if (!ctx) return;
      [523.25, 659.25].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.06);
        gain.gain.setValueAtTime(0.24, ctx.currentTime + idx * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + idx * 0.06 + 0.18);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + idx * 0.06);
        osc.stop(ctx.currentTime + idx * 0.06 + 0.18);
      });
    } catch {}
  }

  // Home Run Celebration Fanfare (C5, E5, G5, C6)
  public playHomeRun(): void {
    if (this.isMuted) return;
    try {
      const ctx = this.initContext();
      if (!ctx) return;
      [523.25, 659.25, 783.99, 1046.50].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.08);
        gain.gain.setValueAtTime(0.28, ctx.currentTime + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + idx * 0.08 + 0.28);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + idx * 0.08);
        osc.stop(ctx.currentTime + idx * 0.08 + 0.28);
      });
    } catch {}
  }

  // Out / Double Play Sound (Sawtooth 220 Hz -> 110 Hz)
  public playOut(): void {
    if (this.isMuted) return;
    try {
      const ctx = this.initContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(110, ctx.currentTime + 0.18);
      gain.gain.setValueAtTime(0.20, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.18);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.18);
    } catch {}
  }

  // Medical Bullpen Alarm (70+ pitches in +55)
  public playBullpenAlert(): void {
    if (this.isMuted) return;
    try {
      const ctx = this.initContext();
      if (!ctx) return;
      [880, 440, 880, 440].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.1);
        gain.gain.setValueAtTime(0.15, ctx.currentTime + idx * 0.1);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + idx * 0.1 + 0.09);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + idx * 0.1);
        osc.stop(ctx.currentTime + idx * 0.1 + 0.09);
      });
    } catch {}
  }

  // Undo Action Sound (Reverse Sweep 240 Hz -> 680 Hz)
  public playUndo(): void {
    if (this.isMuted) return;
    try {
      const ctx = this.initContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(240, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(680, ctx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.16, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.08);
    } catch {}
  }

  // Voice Speech Synthesizer (Narración Táctica Web Speech API)
  public speak(text: string): void {
    if (this.isMuted || typeof window === 'undefined' || !window.speechSynthesis) return;
    try {
      window.speechSynthesis.cancel();
      const cleanText = (text || '')
        .replace(/<[^>]*>/g, ' ')
        .replace(/\[[^\]]*\]/g, ' ')
        .replace(/[•*#_]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();

      const sentences = cleanText.split('.');
      const spokenSummary = (sentences.slice(0, 2).join('.') + '.').substring(0, 220);

      const utterance = new SpeechSynthesisUtterance(spokenSummary);
      utterance.lang = 'es-ES';
      utterance.rate = 1.08;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    } catch {
      // Ignored for unsupported speech synthesis engines
    }
  }
}

export const soundSystem = new DiamaxSoundSystem();
