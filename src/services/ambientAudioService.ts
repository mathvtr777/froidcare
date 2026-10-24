// Web Audio API pure synthesized ambient sound generator for Froid Care
// 100% offline, privacy-friendly, zero external dependencies.

class AmbientAudioService {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private noiseNode: AudioNode | null = null;
  private lfoNode: OscillatorNode | null = null;
  private droneNode: OscillatorNode | null = null;
  private intervalId: number | null = null;
  private currentType: string = 'silence';

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(0, this.ctx.currentTime);
        this.masterGain.connect(this.ctx.destination);
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  private createPinkNoiseBuffer(): AudioBuffer | null {
    if (!this.ctx) return null;
    const bufferSize = this.ctx.sampleRate * 2; // 2 seconds loop
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;

    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.08;
      b6 = white * 0.115926;
    }
    return buffer;
  }

  public setSound(soundType: 'rain' | 'forest' | 'waves' | 'silence', isMuted: boolean) {
    this.currentType = soundType;

    if (isMuted || soundType === 'silence') {
      this.stop();
      return;
    }

    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    this.stopInternal();

    const now = this.ctx.currentTime;
    this.masterGain.gain.cancelScheduledValues(now);
    this.masterGain.gain.setValueAtTime(0.001, now);
    this.masterGain.gain.exponentialRampToValueAtTime(0.2, now + 1.2);

    if (soundType === 'rain') {
      // Gentle filtered pink noise + soft 432Hz sine drone
      const noiseBuffer = this.createPinkNoiseBuffer();
      if (noiseBuffer) {
        const source = this.ctx.createBufferSource();
        source.buffer = noiseBuffer;
        source.loop = true;

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(900, now);

        source.connect(filter);
        filter.connect(this.masterGain);
        source.start();
        this.noiseNode = source;
      }

      // 432Hz gentle harmonic drone
      const osc = this.ctx.createOscillator();
      const oscGain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(432, now);
      oscGain.gain.setValueAtTime(0.03, now);

      osc.connect(oscGain);
      oscGain.connect(this.masterGain);
      osc.start();
      this.droneNode = osc;
    } else if (soundType === 'waves') {
      // Ocean swell: Low-frequency oscillator modulates filter frequency
      const noiseBuffer = this.createPinkNoiseBuffer();
      if (noiseBuffer) {
        const source = this.ctx.createBufferSource();
        source.buffer = noiseBuffer;
        source.loop = true;

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(350, now);
        filter.Q.setValueAtTime(2, now);

        // LFO for wave swelling
        const lfo = this.ctx.createOscillator();
        lfo.type = 'sine';
        lfo.frequency.setValueAtTime(0.12, now); // ~8 sec ocean swell period

        const lfoGain = this.ctx.createGain();
        lfoGain.gain.setValueAtTime(320, now);

        lfo.connect(lfoGain);
        lfoGain.connect(filter.frequency);

        source.connect(filter);
        filter.connect(this.masterGain);

        source.start();
        lfo.start();
        this.noiseNode = source;
        this.lfoNode = lfo;
      }
    } else if (soundType === 'forest') {
      // Soft gentle breeze noise + gentle periodic warm bell tones
      const noiseBuffer = this.createPinkNoiseBuffer();
      if (noiseBuffer) {
        const source = this.ctx.createBufferSource();
        source.buffer = noiseBuffer;
        source.loop = true;

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(600, now);
        filter.Q.setValueAtTime(1.2, now);

        source.connect(filter);
        filter.connect(this.masterGain);
        source.start();
        this.noiseNode = source;
      }

      // Periodic warm pentatonic chimes
      const pentatonic = [528, 594, 660, 792, 880];
      this.intervalId = window.setInterval(() => {
        if (!this.ctx || !this.masterGain) return;
        const chime = this.ctx.createOscillator();
        const chimeGain = this.ctx.createGain();
        const cNow = this.ctx.currentTime;
        const freq = pentatonic[Math.floor(Math.random() * pentatonic.length)];

        chime.type = 'sine';
        chime.frequency.setValueAtTime(freq, cNow);

        chimeGain.gain.setValueAtTime(0, cNow);
        chimeGain.gain.linearRampToValueAtTime(0.025, cNow + 0.1);
        chimeGain.gain.exponentialRampToValueAtTime(0.0001, cNow + 2.5);

        chime.connect(chimeGain);
        chimeGain.connect(this.masterGain);

        chime.start(cNow);
        chime.stop(cNow + 2.6);
      }, 3500);
    }
  }

  private stopInternal() {
    if (this.intervalId !== null) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    if (this.droneNode) {
      try { this.droneNode.stop(); this.droneNode.disconnect(); } catch (_) {}
      this.droneNode = null;
    }
    if (this.lfoNode) {
      try { this.lfoNode.stop(); this.lfoNode.disconnect(); } catch (_) {}
      this.lfoNode = null;
    }
    if (this.noiseNode) {
      try { (this.noiseNode as AudioScheduledSourceNode).stop?.(); this.noiseNode.disconnect(); } catch (_) {}
      this.noiseNode = null;
    }
  }

  public stop() {
    if (this.ctx && this.masterGain) {
      const now = this.ctx.currentTime;
      this.masterGain.gain.cancelScheduledValues(now);
      this.masterGain.gain.linearRampToValueAtTime(0.0001, now + 0.4);
      setTimeout(() => {
        this.stopInternal();
      }, 450);
    } else {
      this.stopInternal();
    }
  }

  public setMuted(isMuted: boolean) {
    if (isMuted) {
      this.stop();
    } else {
      this.setSound(this.currentType as any, false);
    }
  }
}

export const ambientAudioService = new AmbientAudioService();
