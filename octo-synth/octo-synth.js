/***********************************************************
 * Octo Synth
 */
export default class OctoSynth {
  constructor(audioContext, numStrings = 8, pitch = 0.5, detune = 0.5, cutoff = 0.5, feedback = 0.5, volume = 0.5, tempo = 0.5, spread = 0.5) {
    this.audioContext = audioContext
    this.numStrings = numStrings;

    this.detuneFactors = [];
    this.strings = [];
    this.sequencer = null;
    this.events = [];
    this.delays = [];

    const outputGain = audioContext.createGain();
    outputGain.gain.value = 1;
    outputGain.connect(audioContext.destination);
    this.outputGain = outputGain;

    const merger = audioContext.createChannelMerger(2);
    merger.connect(outputGain);
    merger.channelCount = 1;
    merger.channelCountMode = "explicit";
    merger.channelInterpretation = "discrete";

    for (let i = 0; i < numStrings; i++) {
      const gain = audioContext.createGain();
      gain.connect(merger, 0, (i % 2 === 0));

      const string = new KarplusStrong(audioContext, gain);
      this.strings.push(string);

      const detuneFactor = (2 * i / (numStrings - 1)) - 1;
      this.detuneFactors.push(detuneFactor);
    }

    this.sequencer = new Sequencer(audioContext, 0.05);

    this.normPitch = pitch;
    this.normDetune = detune;
    this.updatePitchAndDetune();

    this.setCutoff(cutoff);
    this.setFeedback(feedback);

    this.normTempo = tempo;
    this.normSpread = spread;
    this.updateTempoAndSpread();

    this.setVolume(volume);
  }

  setPitch(value) {
    this.normPitch = value;
    this.updatePitchAndDetune();
  }

  setDetune(value) {
    this.normDetune = value;
    this.updatePitchAndDetune();
  }

  updatePitchAndDetune() {
    const pitch = 3300 + 2400 * this.normPitch;
    const detune = 20 * (20 ** this.normDetune);

    for (let i = 0; i < this.numStrings; i++) {
      const string = this.strings[i];
      const detuneFactor = this.detuneFactors[i];
      string.setPitch(pitch + detune * detuneFactor);
    }
  }

  setCutoff(value) {
    const cutoff = 6900 + 2400 * value;

    for (let string of this.strings) {
      string.setCutoff(cutoff);
    }
  }

  setFeedback(value) {
    const feedback = 2 * (value - 1);

    for (let string of this.strings) {
      string.setFeedback(feedback);
    }
  }

  setVolume(value) {
    let gainValue = 0;

    if (value > 0) {
      const level = 60 * (value - 1);
      gainValue = decibelTolinear(level);
    }

    this.outputGain.gain.value = gainValue;
  }

  setTempo(value) {
    this.normTempo = value;
    this.updateTempoAndSpread();
  }

  setSpread(value) {
    this.normSpread = value;
    this.updateTempoAndSpread();
  }

  updateTempoAndSpread() {
    for (let i = 0; i < this.numStrings; i++) {
      const event = this.events[i];

      const tempo = 60 * (4 ** this.normTempo);
      const period = 60 / tempo;
      const delay = this.normSpread * period * i;

      if (event) {
        event.delay = delay;
        event.period = period;
      } else {
        const string = this.strings[i];
        this.events[i] = this.sequencer.add(0, (time) => {
          string.pluck(time);
        }, period, delay);
      }
    }
  }

  start() {
    this.sequencer.start();
  }

  stop() {
    this.sequencer.stop();
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
