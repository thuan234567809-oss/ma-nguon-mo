/**
 * Procedural Web Audio synthesizer for F&B simulation soundscape.
 * Creates real-time ambient cafe murmur, cash register chimes, kitchen sizzle,
 * and rain effects without requiring external audio assets.
 */

class SoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private ambientGain: GainNode | null = null;
  private rainGain: GainNode | null = null;
  private isInitialized: boolean = false;

  private initContext() {
    if (this.ctx) return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    } catch {
      // AudioContext not available in some environments
    }
  }

  public init() {
    if (this.isInitialized) return;
    this.initContext();
    if (!this.ctx) return;
    this.isInitialized = true;
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.ambientGain) {
      this.ambientGain.gain.setValueAtTime(this.isMuted ? 0 : 0.05, this.ctx?.currentTime || 0);
    }
    if (this.rainGain) {
      this.rainGain.gain.setValueAtTime(this.isMuted ? 0 : 0.08, this.ctx?.currentTime || 0);
    }
    return this.isMuted;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  // Cash register cha-ching
  public playCashRegister() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gainNode = this.ctx.createGain();

    osc1.type = 'triangle';
    osc1.frequency.setValueAtTime(987.77, now); // B5
    osc1.frequency.exponentialRampToValueAtTime(1318.51, now + 0.12); // E6

    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(1318.51, now + 0.08); // E6
    osc2.frequency.exponentialRampToValueAtTime(1975.53, now + 0.25); // B6

    gainNode.gain.setValueAtTime(0.12, now);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

    osc1.connect(gainNode);
    osc2.connect(gainNode);
    gainNode.connect(this.ctx.destination);

    osc1.start(now);
    osc2.start(now + 0.08);
    osc1.stop(now + 0.35);
    osc2.stop(now + 0.35);
  }

  // Order ready bell (ding!)
  public playOrderBell() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(1760, now); // A6 bell
    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.8);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.8);
  }

  public playKitchenBell() {
    this.playOrderBell();
  }

  // Sizzle frying / coffee steam sound burst
  public playKitchenSizzle() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const bufferSize = this.ctx.sampleRate * 0.25;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 1800;
    filter.Q.value = 2.5;

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.04, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

    whiteNoise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    whiteNoise.start(now);
  }

  // Clean tactile UI click
  public playClick() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, now);
    osc.frequency.exponentialRampToValueAtTime(400, now + 0.04);

    gain.gain.setValueAtTime(0.05, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.04);
  }

  // Update weather rain sound level
  public setWeatherState(weather: string) {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    const isRaining = weather === 'rain' || weather === 'heavy_rain';
    if (!this.rainGain && isRaining) {
      // Create continuous rain noise generator
      const bufferSize = this.ctx.sampleRate * 2;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * 0.3;
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;
      noise.loop = true;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = weather === 'heavy_rain' ? 1400 : 800;

      this.rainGain = this.ctx.createGain();
      this.rainGain.gain.setValueAtTime(weather === 'heavy_rain' ? 0.05 : 0.025, this.ctx.currentTime);

      noise.connect(filter);
      filter.connect(this.rainGain);
      this.rainGain.connect(this.ctx.destination);
      noise.start();
    } else if (this.rainGain) {
      const targetGain = isRaining ? (weather === 'heavy_rain' ? 0.05 : 0.025) : 0;
      this.rainGain.gain.setTargetAtTime(targetGain, this.ctx.currentTime, 0.5);
    }
  }
}

export const soundEngine = new SoundEngine();
