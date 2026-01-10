/**
 * Audio Module - Reusable Web Audio API utilities
 * Provides sound effects for the vending machine
 */

let audioCtx = null;

/**
 * Initialize the Web Audio API context
 * @returns {AudioContext} The audio context
 */
export const initAudio = () => {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  return audioCtx;
};

/**
 * Get the current audio context
 * @returns {AudioContext|null}
 */
export const getAudioContext = () => audioCtx;

/**
 * Play a descending scream sound effect
 * @param {Object} options - Sound configuration
 * @param {number} options.startFreq - Starting frequency (default: 800)
 * @param {number} options.endFreq - Ending frequency (default: 200)
 * @param {number} options.duration - Duration in seconds (default: 0.5)
 * @param {number} options.volume - Volume 0-1 (default: 0.1)
 */
export const playScream = (options = {}) => {
  const {
    startFreq = 800,
    endFreq = 200,
    duration = 0.5,
    volume = 0.1
  } = options;

  initAudio();
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();

  osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(startFreq, audioCtx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(endFreq, audioCtx.currentTime + duration);

  gain.gain.setValueAtTime(volume, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + duration);

  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.start();
  osc.stop(audioCtx.currentTime + duration);
};

/**
 * Play white noise / static sound effect
 * @param {Object} options - Sound configuration
 * @param {number} options.duration - Duration in seconds (default: 1)
 * @param {number} options.volume - Volume 0-1 (default: 0.1)
 */
export const playStatic = (options = {}) => {
  const {
    duration = 1,
    volume = 0.1
  } = options;

  initAudio();
  const bufferSize = 2 * audioCtx.sampleRate;
  const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
  const output = buffer.getChannelData(0);

  for (let i = 0; i < bufferSize; i++) {
    output[i] = (Math.random() * 2 - 1) * volume;
  }

  const noise = audioCtx.createBufferSource();
  noise.buffer = buffer;

  const gain = audioCtx.createGain();
  gain.gain.setValueAtTime(volume, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + duration);

  noise.connect(gain);
  gain.connect(audioCtx.destination);
  noise.start();
  noise.stop(audioCtx.currentTime + duration);
};

/**
 * Play a beep sound
 * @param {Object} options - Sound configuration
 * @param {number} options.frequency - Beep frequency (default: 440)
 * @param {number} options.duration - Duration in seconds (default: 0.1)
 * @param {number} options.volume - Volume 0-1 (default: 0.1)
 * @param {string} options.type - Oscillator type (default: 'sine')
 */
export const playBeep = (options = {}) => {
  const {
    frequency = 440,
    duration = 0.1,
    volume = 0.1,
    type = 'sine'
  } = options;

  initAudio();
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();

  osc.type = type;
  osc.frequency.setValueAtTime(frequency, audioCtx.currentTime);

  gain.gain.setValueAtTime(volume, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + duration);

  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.start();
  osc.stop(audioCtx.currentTime + duration);
};

/**
 * Play a coin insert sound
 */
export const playCoinSound = () => {
  playBeep({ frequency: 1200, duration: 0.05 });
  setTimeout(() => playBeep({ frequency: 1600, duration: 0.05 }), 50);
};

/**
 * Play an error sound
 */
export const playErrorSound = () => {
  playBeep({ frequency: 200, duration: 0.2, type: 'square' });
};

/**
 * Play a success sound
 */
export const playSuccessSound = () => {
  playBeep({ frequency: 800, duration: 0.1 });
  setTimeout(() => playBeep({ frequency: 1000, duration: 0.1 }), 100);
  setTimeout(() => playBeep({ frequency: 1200, duration: 0.15 }), 200);
};
