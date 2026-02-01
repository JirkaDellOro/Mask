/***********************************************************
 * Octo Texture
 */
class OctoTexture {
  constructor(audioContext, tint = 0.5, amplitude = 0.5, octaves = 0.5, volume = 1) {
    this.audioContext = audioContext

    this.synth = new OctoSynth(audioContext, 8);

    this.tint = [tint, tint];
    this.amplitude = [amplitude, amplitude];
    this.octaves = [octaves, octaves];
    this.inter = 0;

    this.setTint(tint);
    this.setAmplitude(amplitude);
    this.setOctaves(octaves);
    this.setVolume(volume);
  }

  setTint(value) {
    this.synth.setPitch(value);
  }

  updateTint() {
    const inter = this.getInter(this.tint);
    this.setTint(inter);
  }

  setAmplitude(value) {
    this.synth.setCutoff(value);
    this.synth.setDetune(value);
  }

  updateAmplitute() {
    const inter = this.getInter(this.tint);
    this.setAmplitude(inter);
  }

  setOctaves(value) {
    const spread = 0.5 + 0.4 * value;
    this.synth.setSpread(spread);
  }

  updateOctaves() {
    const inter = this.getInter(this.tint);
    this.setOctaves(inter);
  }

  setCurrentTint(value) { 
    this.tint[0] = value;
    this.updateTint();
  }

  setCurrentAmplitude(value) {
    this.amplitude[0] = value;
    this.updateAmplitute();
  }

  setCurrentOctaves(value) {
    this.octaves[0] = value;
    this.updateOctaves();
  }

  setTargetTint(value) {
    this.tint[1] = value;
    this.updateTint();
  }

  setTargetAmplitude(value) {
    this.amplitude[1] = value;
    this.updateAmplitute();
  }

  setTargetOctaves(value) {
    this.octaves[1] = value;
    this.updateOctaves();
  }

  setInter(value) {
    this.inter = value;
    this.updateTint();
    this.updateAmplitute();
    this.updateOctaves();
  }

  getInter(param) {
    const c0 = 1 - this.inter;
    const c1 = this.inter;
    return c0 * param[0] + c1 * param[1];
  }

  setVolume(value) {
    this.synth.setVolume(value);
  }

  start() {
    this.synth.start();
  }

  stop() {
    this.synth.stop();
  }
};

/***********************************************************
 * Sequencer
 */
class Sequencer {
  constructor(audioContext, period) {
    this.audioContext = audioContext;
    this.period = period;
    this.queue = new Set();
    this.interval = null;

    this.onInterval = this.onInterval.bind(this);
  }

  start() {
    if (this.interval === null) {
      this.interval = setInterval(this.onInterval, 1000 * this.period);
    }
  }

  stop() {
    if (this.interval !== null) {
      clearInterval(this.interval);
      this.interval = null;
    }
  }

  add(time, callback, period = 0, delay = 0) {
    const event = { time, callback, period, delay };
    this.queue.add(event);
    return event;
  }

  onInterval() {
    const now = this.audioContext.currentTime;

    for (let event of this.queue) {
      let eventTime = Math.max(event.time, now);

      while (eventTime < now + this.period) {
        event.callback(eventTime + event.delay);

        if (event.period > 0) {
          eventTime += event.period;
        } else {
          eventTime = Infinity;
        }
      }

      if (eventTime !== Infinity) {
        event.time = eventTime;
      } else {
        this.queue.delete(event);
      }
    }
  }

  clear() {
    this.queue.clear();
  }
}

class KarplusStrong {
  constructor(audioContext, output, pitch = 4500, feedback = -0.5, cutoff = 500) {
    this.audioContext = audioContext;
    this.output = output;

    this.lowpass = null;
    this.delay = null;
    this.gain = null;

    this.setup();

    this.setPitch(pitch);
    this.setFeedback(feedback);
    this.setCutoff(cutoff);

    this.setPitch = this.setPitch.bind(this);
    this.setFeedback = this.setFeedback.bind(this);
    this.setCutoff = this.setCutoff.bind(this);
    this.pluck = this.pluck.bind(this);
  }

  setup() {
    const audioContext = this.audioContext;

    this.noiseBuffer = createNoiseBuffer(audioContext, 2);

    const lowpass = audioContext.createBiquadFilter();
    this.lowpass = lowpass;
    lowpass.type = 'lowpass';
    lowpass.frequency.value = 500;;
    lowpass.Q.value = -3;

    const delay = audioContext.createDelay(0.1);
    this.delay = delay;
    delay.delayTime.value = 0.01;

    const feedbackGain = audioContext.createGain();
    this.feedbackGain = feedbackGain;
    feedbackGain.gain.value = 0;

    const highpass = audioContext.createBiquadFilter();
    this.highpass = highpass;
    highpass.type = 'highpass';
    highpass.frequency.value = 20;
    highpass.Q.value = -6;

    lowpass.connect(this.output);
    lowpass.connect(delay);
    delay.connect(feedbackGain);
    feedbackGain.connect(highpass);
    highpass.connect(lowpass);
  }

  setPitch(value) {
    this.delay.delayTime.value = 1 / midiCentToHz(value);
  }

  setFeedback(value) {
    this.feedbackGain.gain.value = decibelTolinear(value);
  }

  setCutoff(value) {
    this.lowpass.frequency.value = midiCentToHz(value)
  }

  pluck(time = 0) {
    const audioContext = this.audioContext;

    const gain = audioContext.createGain();
    gain.connect(this.lowpass);
    gain.gain.setValueAtTime(0, time);
    gain.gain.linearRampToValueAtTime(1, time + 0.01);
    gain.gain.linearRampToValueAtTime(0, time + 0.01);

    const source = audioContext.createBufferSource();
    source.connect(gain);
    source.buffer = this.noiseBuffer;
    source.start(time, 0, 0.02);
  }
}

/***********************************************************
 * helper functions
 */
function midiCentToHz(value) {
  return 440 * Math.exp(0.0005776226504666211 * (value - 6900)); // 440 * pow(2, (value - 6900) / 1200)
};

function decibelTolinear(value) {
  return Math.exp(0.11512925464970229 * value); // pow(10, value / 20)
};

function createNoiseBuffer(audioContext, duration = 2) {
  const size = duration * audioContext.sampleRate;
  const buffer = audioContext.createBuffer(1, size, audioContext.sampleRate);
  const wave = buffer.getChannelData(0);

  for (let i = 0; i < size; i++) {
    wave[i] = Math.random() * 2 - 1;
  }

  return buffer;
}

