// Web Audio API Synthesizer for Gothic Library Sound FX & Ambience

let audioCtx = null;
let ambientOsc = null;
let ambientGain = null;
let ambientFilter = null;
let isAmbientPlaying = false;

const getAudioContext = () => {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
};

/**
 * Play heavy wooden door creak & iron latch thud sound
 */
export const playDoorOpenSound = () => {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    // Heavy Low Thud (Door Unlocking & Creaking open)
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(60, now);
    osc.frequency.exponentialRampToValueAtTime(30, now + 1.2);

    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 1.2);

    // Friction creak noise
    const bufferSize = ctx.sampleRate * 0.8;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.sin(i / 100);
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(250, now);
    filter.Q.setValueAtTime(4, now);

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.01, now);
    noiseGain.gain.linearRampToValueAtTime(0.12, now + 0.4);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.9);

    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(ctx.destination);

    noise.start(now + 0.1);
    noise.stop(now + 0.9);
  } catch (e) {
    console.warn("Audio play blocked or unavailable", e);
  }
};

/**
 * Play crisp paper page-turn sweep sound
 */
export const playPageTurnSound = () => {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const duration = 0.25;

    const bufferSize = ctx.sampleRate * duration;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1);
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(800, now);
    filter.frequency.exponentialRampToValueAtTime(2200, now + 0.12);
    filter.frequency.exponentialRampToValueAtTime(400, now + duration);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.01, now);
    gain.gain.linearRampToValueAtTime(0.15, now + 0.08);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    noise.start(now);
    noise.stop(now + duration);
  } catch (e) {
    console.warn("Audio play blocked", e);
  }
};

/**
 * Play quill scratch / bookmark placement sound
 */
export const playQuillSound = () => {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(650, now);
    osc.frequency.exponentialRampToValueAtTime(950, now + 0.06);
    osc.frequency.exponentialRampToValueAtTime(450, now + 0.15);

    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.18);
  } catch (e) {
    console.warn("Audio play blocked", e);
  }
};

/**
 * Toggle ongoing ambient library hum (low candle crackle + deep room acoustic drone)
 */
export const toggleAmbientLibrarySound = (enable) => {
  try {
    const ctx = getAudioContext();
    if (!ctx) return false;

    if (enable && !isAmbientPlaying) {
      const now = ctx.currentTime;

      // Low room resonance drone
      ambientOsc = ctx.createOscillator();
      ambientGain = ctx.createGain();
      ambientFilter = ctx.createBiquadFilter();

      ambientOsc.type = 'sine';
      ambientOsc.frequency.setValueAtTime(55, now); // Low 55Hz room hum

      ambientFilter.type = 'lowpass';
      ambientFilter.frequency.setValueAtTime(120, now);

      ambientGain.gain.setValueAtTime(0.001, now);
      ambientGain.gain.linearRampToValueAtTime(0.06, now + 2); // Soft fade in

      ambientOsc.connect(ambientFilter);
      ambientFilter.connect(ambientGain);
      ambientGain.connect(ctx.destination);

      ambientOsc.start(now);
      isAmbientPlaying = true;
      return true;
    } else if (!enable && isAmbientPlaying) {
      if (ambientGain && audioCtx) {
        const now = audioCtx.currentTime;
        ambientGain.gain.linearRampToValueAtTime(0.001, now + 1);
        setTimeout(() => {
          if (ambientOsc) {
            ambientOsc.stop();
            ambientOsc.disconnect();
            ambientOsc = null;
          }
          isAmbientPlaying = false;
        }, 1050);
      } else {
        isAmbientPlaying = false;
      }
      return false;
    }
  } catch (e) {
    console.warn("Ambient sound error", e);
    isAmbientPlaying = false;
    return false;
  }
  return isAmbientPlaying;
};
