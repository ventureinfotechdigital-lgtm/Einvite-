/**
 * Web Audio API synthesizer for Indian Wedding ambient music & celebratory sound effects.
 * Synthesizes serene tanpura drone, sitar harmonics, and melodic bansuri/shehnai phrases.
 */

class WeddingAudioPlayer {
  private ctx: AudioContext | null = null;
  private isPlaying: boolean = false;
  private gainNode: GainNode | null = null;
  private intervals: number[] = [];
  private melodyTimeout: number | null = null;

  public init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public playWeddingMusic() {
    this.init();
    if (!this.ctx) return;
    if (this.isPlaying) return;

    this.isPlaying = true;
    const now = this.ctx.currentTime;

    // Master gain
    const masterGain = this.ctx.createGain();
    masterGain.gain.setValueAtTime(0.01, now);
    masterGain.gain.exponentialRampToValueAtTime(0.22, now + 2);
    masterGain.connect(this.ctx.destination);
    this.gainNode = masterGain;

    // 1. Tanpura / Sitar Drone (Sa - Pa resonance in D / C#)
    const baseFreq = 146.83; // D3
    const droneFreqs = [baseFreq, baseFreq * 1.5, baseFreq * 2, baseFreq * 0.75]; // D3, A3, D4, A2

    droneFreqs.forEach((freq, idx) => {
      if (!this.ctx || !this.gainNode) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = idx % 2 === 0 ? 'triangle' : 'sawtooth';
      osc.frequency.setValueAtTime(freq, now);

      // Subtle vibrato/shimmer
      const lfo = this.ctx.createOscillator();
      const lfoGain = this.ctx.createGain();
      lfo.frequency.setValueAtTime(0.2 + idx * 0.1, now);
      lfoGain.gain.setValueAtTime(0.8, now);
      lfo.connect(osc.frequency);
      lfo.start(now);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(450 + idx * 80, now);

      gain.gain.setValueAtTime(0.04 / (idx + 1), now);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.gainNode);

      osc.start(now);
    });

    // 2. Melodic Shehnai / Bansuri Phrase Generator (Raag Yaman / Bilawal - Auspicious wedding ragas)
    // Scale notes (D major / Yaman: D, E, F#, G#, A, B, C#)
    const yamanScale = [293.66, 329.63, 369.99, 415.30, 440.0, 493.88, 554.37, 587.33];
    let noteIndex = 0;

    const playMelodicNote = () => {
      if (!this.isPlaying || !this.ctx || !this.gainNode) return;

      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const noteGain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      // Pick traditional meandering phrase
      const steps = [0, 2, 4, 3, 2, 4, 5, 7, 6, 4, 2, 0, 1, 2, 4, 0];
      const noteFreq = yamanScale[steps[noteIndex % steps.length]];
      noteIndex++;

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(noteFreq, t);

      // Shehnai micro-pitch bend (Meend)
      osc.frequency.exponentialRampToValueAtTime(noteFreq * 1.01, t + 0.3);
      osc.frequency.exponentialRampToValueAtTime(noteFreq, t + 0.7);

      // Soft reedy acoustic filter
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(noteFreq * 1.8, t);
      filter.Q.setValueAtTime(2.5, t);

      const dur = 1.2 + Math.random() * 0.8;
      noteGain.gain.setValueAtTime(0.001, t);
      noteGain.gain.exponentialRampToValueAtTime(0.09, t + 0.3);
      noteGain.gain.exponentialRampToValueAtTime(0.001, t + dur);

      osc.connect(filter);
      filter.connect(noteGain);
      noteGain.connect(this.gainNode);

      osc.start(t);
      osc.stop(t + dur);

      const delayNext = dur * 800 + Math.random() * 600;
      this.melodyTimeout = window.setTimeout(playMelodicNote, delayNext);
    };

    playMelodicNote();
  }

  public stopWeddingMusic() {
    if (!this.isPlaying || !this.ctx) return;
    this.isPlaying = false;
    if (this.melodyTimeout) {
      clearTimeout(this.melodyTimeout);
      this.melodyTimeout = null;
    }
    if (this.gainNode) {
      const now = this.ctx.currentTime;
      this.gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 1);
      setTimeout(() => {
        if (this.ctx && !this.isPlaying) {
          this.ctx.close().then(() => {
            this.ctx = null;
          });
        }
      }, 1100);
    }
  }

  public toggleMusic(): boolean {
    if (this.isPlaying) {
      this.stopWeddingMusic();
      return false;
    } else {
      this.playWeddingMusic();
      return true;
    }
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  // Celebratory Chimes (when flower petals are showered)
  public playBlessingChime() {
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const chimes = [587.33, 739.99, 880.0, 1174.66, 1479.98];
    chimes.forEach((f, i) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(f, now + i * 0.08);
      gain.gain.setValueAtTime(0.07, now + i * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 1.2);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now + i * 0.08);
      osc.stop(now + i * 0.08 + 1.2);
    });
  }

  // Fireworks celebration pop
  public playFireworkSound() {
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    // Noise buffer for firework whoosh/crackle
    const bufferSize = this.ctx.sampleRate * 0.5;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(800, now);
    filter.frequency.exponentialRampToValueAtTime(150, now + 0.4);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);
    noise.start(now);
  }

  // Scratch card sound
  public playScratchSound() {
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(120 + Math.random() * 60, now);
    gain.gain.setValueAtTime(0.04, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.08);
  }

  // 3D Card crisp flip / whoosh sound
  public playCardFlipSound() {
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const bufferSize = Math.floor(this.ctx.sampleRate * 0.18);
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.4));
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1400, now);
    filter.frequency.exponentialRampToValueAtTime(450, now + 0.15);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.1, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);
    noise.start(now);
  }

  // Auspicious Temple Bell chime sound
  public playTempleBellSound() {
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const bellPartials = [
      { f: 880, g: 0.12, decay: 2.2 },
      { f: 1760, g: 0.06, decay: 1.4 },
      { f: 2640, g: 0.03, decay: 0.8 },
      { f: 3520, g: 0.015, decay: 0.5 },
    ];
    bellPartials.forEach((p) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(p.f, now);
      gain.gain.setValueAtTime(p.g, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + p.decay);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + p.decay);
    });
  }

  // Royal Wax Seal unfasten sound
  public playWaxSealSound() {
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(320, now);
    osc.frequency.exponentialRampToValueAtTime(80, now + 0.12);
    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.12);
  }

  // Sacred Cathedral Church Chimes sound (resonant pipe / church bells)
  public playChurchChimesSound() {
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    // Church bell strike notes (E4, G#4, B4, E5 chord spread with bell hums)
    const bellNotes = [
      { f: 329.63, delay: 0.0, decay: 3.5, gain: 0.15 },
      { f: 415.30, delay: 0.25, decay: 3.2, gain: 0.13 },
      { f: 493.88, delay: 0.50, decay: 3.0, gain: 0.12 },
      { f: 659.25, delay: 0.75, decay: 4.0, gain: 0.16 },
      { f: 1318.5, delay: 0.75, decay: 1.8, gain: 0.06 },
    ];

    bellNotes.forEach((n) => {
      if (!this.ctx) return;
      const t = now + n.delay;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(n.f, t);

      gain.gain.setValueAtTime(0.0001, t);
      gain.gain.exponentialRampToValueAtTime(n.gain, t + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + n.decay);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + n.decay);
    });
  }

  // Royal Rajasthan Palace Chime & Shehnai Flourish
  public playRajputanaChime() {
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    // Raga Bilawal / Maru Bihag celebratory ascending notes
    const notes = [
      { f: 293.66, t: 0.00, dur: 0.25 }, // D4
      { f: 369.99, t: 0.12, dur: 0.28 }, // F#4
      { f: 440.00, t: 0.26, dur: 0.32 }, // A4
      { f: 554.37, t: 0.42, dur: 0.45 }, // C#5
      { f: 587.33, t: 0.60, dur: 1.80 }, // D5
    ];

    notes.forEach((n) => {
      if (!this.ctx) return;
      const start = now + n.t;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(n.f, start);

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1600, start);

      gain.gain.setValueAtTime(0.001, start);
      gain.gain.exponentialRampToValueAtTime(0.12, start + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + n.dur);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(start);
      osc.stop(start + n.dur);
    });

    // Deep royal gong resonance
    const gong = this.ctx.createOscillator();
    const gongGain = this.ctx.createGain();
    gong.type = 'sine';
    gong.frequency.setValueAtTime(146.83, now + 0.5); // D3
    gongGain.gain.setValueAtTime(0.2, now + 0.5);
    gongGain.gain.exponentialRampToValueAtTime(0.0001, now + 3.2);
    gong.connect(gongGain);
    gongGain.connect(this.ctx.destination);
    gong.start(now + 0.5);
    gong.stop(now + 3.2);
  }
}

export const weddingAudio = new WeddingAudioPlayer();
