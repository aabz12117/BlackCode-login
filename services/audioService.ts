import { SoundType } from '../types';

class AudioService {
  private context: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private compressor: DynamicsCompressorNode | null = null;
  private isMuted: boolean = false;
  private masterVolume: number = 0.3;

  private init() {
    if (!this.context) {
      this.context = new (window.AudioContext || (window as any).webkitAudioContext)();

      // إنشاء سلسلة معالجة الصوت
      this.masterGain = this.context.createGain();
      this.compressor = this.context.createDynamicsCompressor();

      // ربط العقد
      this.masterGain.connect(this.compressor);
      this.compressor.connect(this.context.destination);

      // إعدادات الضاغط للحصول على صوت أفضل
      this.compressor.threshold.value = -24;
      this.compressor.knee.value = 30;
      this.compressor.ratio.value = 12;
      this.compressor.attack.value = 0.003;
      this.compressor.release.value = 0.25;

      this.masterGain.gain.value = this.masterVolume;
    }

    if (this.context.state === 'suspended') {
      this.context.resume();
    }
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.masterGain) {
      this.masterGain.gain.setValueAtTime(
        this.isMuted ? 0 : this.masterVolume,
        this.context!.currentTime
      );
    }
    return this.isMuted;
  }

  public setVolume(volume: number) {
    this.masterVolume = Math.max(0, Math.min(1, volume));
    if (this.masterGain && !this.isMuted) {
      this.masterGain.gain.setValueAtTime(
        this.masterVolume,
        this.context!.currentTime
      );
    }
  }

  public play(type: SoundType) {
    if (this.isMuted) return;
    this.init();
    if (!this.context || !this.masterGain) return;

    const now = this.context.currentTime;

    switch (type) {
      case 'click':
        this.playClick(now);
        break;
      case 'hover':
        this.playHover(now);
        break;
      case 'alert':
        this.playAlert(now);
        break;
      case 'success':
        this.playSuccess(now);
        break;
      case 'intro':
        this.playIntro(now);
        break;
      case 'error':
        this.playError(now);
        break;
      case 'notification':
        this.playNotification(now);
        break;
      case 'power-up':
        this.playPowerUp(now);
        break;
      case 'power-down':
        this.playPowerDown(now);
        break;
      case 'swoosh':
        this.playSwoosh(now);
        break;
      case 'typing':
        this.playTyping(now);
        break;
    }
  }

  private playTyping(now: number) {
    const osc = this.context!.createOscillator();
    const gain = this.context!.createGain();

    osc.connect(gain);
    gain.connect(this.masterGain!);

    osc.type = 'sine';
    osc.frequency.setValueAtTime(1800 + Math.random() * 400, now);
    osc.frequency.exponentialRampToValueAtTime(800, now + 0.03);

    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.03);

    osc.start(now);
    osc.stop(now + 0.03);
  }

  private playClick(now: number) {
    const osc = this.context!.createOscillator();
    const gain = this.context!.createGain();
    const filter = this.context!.createBiquadFilter();

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain!);

    osc.type = 'sine';
    osc.frequency.setValueAtTime(1000, now);
    osc.frequency.exponentialRampToValueAtTime(200, now + 0.08);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(2000, now);
    filter.Q.value = 1;

    gain.gain.setValueAtTime(0.6, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);

    osc.start(now);
    osc.stop(now + 0.08);
  }

  private playHover(now: number) {
    const osc = this.context!.createOscillator();
    const gain = this.context!.createGain();

    osc.connect(gain);
    gain.connect(this.masterGain!);

    osc.type = 'sine';
    osc.frequency.setValueAtTime(600, now);
    osc.frequency.exponentialRampToValueAtTime(800, now + 0.04);

    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.04);

    osc.start(now);
    osc.stop(now + 0.04);
  }

  private playAlert(now: number) {
    // صوت تنبيه بثلاث نغمات
    for (let i = 0; i < 3; i++) {
      const osc = this.context!.createOscillator();
      const gain = this.context!.createGain();

      osc.connect(gain);
      gain.connect(this.masterGain!);

      const startTime = now + (i * 0.15);

      osc.type = 'square';
      osc.frequency.setValueAtTime(800, startTime);

      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(0.4, startTime + 0.02);
      gain.gain.linearRampToValueAtTime(0.01, startTime + 0.12);

      osc.start(startTime);
      osc.stop(startTime + 0.12);
    }
  }

  private playSuccess(now: number) {
    // نغمة ماجور صاعدة
    const frequencies = [523.25, 659.25, 783.99]; // C5, E5, G5

    frequencies.forEach((freq, i) => {
      const osc = this.context!.createOscillator();
      const gain = this.context!.createGain();

      osc.connect(gain);
      gain.connect(this.masterGain!);

      const startTime = now + (i * 0.08);

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0.35, startTime);
      gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.3);

      osc.start(startTime);
      osc.stop(startTime + 0.3);
    });
  }

  private playError(now: number) {
    // نغمة خطأ منخفضة
    const osc = this.context!.createOscillator();
    const gain = this.context!.createGain();
    const filter = this.context!.createBiquadFilter();

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain!);

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(200, now);
    osc.frequency.exponentialRampToValueAtTime(100, now + 0.3);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(800, now);
    filter.frequency.exponentialRampToValueAtTime(200, now + 0.3);

    gain.gain.setValueAtTime(0.5, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);

    osc.start(now);
    osc.stop(now + 0.3);
  }

  private playNotification(now: number) {
    // نغمتين سريعتين
    [880, 1046.5].forEach((freq, i) => {
      const osc = this.context!.createOscillator();
      const gain = this.context!.createGain();

      osc.connect(gain);
      gain.connect(this.masterGain!);

      const startTime = now + (i * 0.08);

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0.3, startTime);
      gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.15);

      osc.start(startTime);
      osc.stop(startTime + 0.15);
    });
  }

  private playIntro(now: number) {
    // صوت سينمائي عميق
    const osc1 = this.context!.createOscillator();
    const osc2 = this.context!.createOscillator();
    const gain = this.context!.createGain();
    const filter = this.context!.createBiquadFilter();

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(filter);
    filter.connect(this.masterGain!);

    osc1.type = 'sawtooth';
    osc1.frequency.setValueAtTime(40, now);
    osc1.frequency.linearRampToValueAtTime(80, now + 1.5);
    osc1.frequency.linearRampToValueAtTime(60, now + 3);

    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(80, now);
    osc2.frequency.linearRampToValueAtTime(160, now + 1.5);
    osc2.frequency.linearRampToValueAtTime(120, now + 3);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(200, now);
    filter.frequency.linearRampToValueAtTime(800, now + 1.5);
    filter.frequency.linearRampToValueAtTime(300, now + 3);
    filter.Q.value = 5;

    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.4, now + 0.8);
    gain.gain.linearRampToValueAtTime(0.3, now + 2);
    gain.gain.linearRampToValueAtTime(0, now + 3);

    osc1.start(now);
    osc1.stop(now + 3);
    osc2.start(now);
    osc2.stop(now + 3);
  }

  private playPowerUp(now: number) {
    const osc = this.context!.createOscillator();
    const gain = this.context!.createGain();
    const filter = this.context!.createBiquadFilter();

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain!);

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(200, now);
    osc.frequency.exponentialRampToValueAtTime(1200, now + 0.4);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(400, now);
    filter.frequency.exponentialRampToValueAtTime(3000, now + 0.4);
    filter.Q.value = 2;

    gain.gain.setValueAtTime(0.4, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);

    osc.start(now);
    osc.stop(now + 0.4);
  }

  private playPowerDown(now: number) {
    const osc = this.context!.createOscillator();
    const gain = this.context!.createGain();
    const filter = this.context!.createBiquadFilter();

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain!);

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(1000, now);
    osc.frequency.exponentialRampToValueAtTime(100, now + 0.5);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(2000, now);
    filter.frequency.exponentialRampToValueAtTime(200, now + 0.5);
    filter.Q.value = 2;

    gain.gain.setValueAtTime(0.4, now);
    gain.gain.linearRampToValueAtTime(0.01, now + 0.5);

    osc.start(now);
    osc.stop(now + 0.5);
  }

  private playSwoosh(now: number) {
    const noise = this.context!.createBufferSource();
    const gain = this.context!.createGain();
    const filter = this.context!.createBiquadFilter();

    // إنشاء ضوضاء بيضاء
    const bufferSize = this.context!.sampleRate * 0.3;
    const buffer = this.context!.createBuffer(1, bufferSize, this.context!.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    noise.buffer = buffer;
    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain!);

    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(3000, now);
    filter.frequency.exponentialRampToValueAtTime(200, now + 0.3);
    filter.Q.value = 3;

    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);

    noise.start(now);
    noise.stop(now + 0.3);
  }

  public cleanup() {
    if (this.context) {
      this.context.close();
      this.context = null;
      this.masterGain = null;
      this.compressor = null;
    }
  }
}

export const audioService = new AudioService();