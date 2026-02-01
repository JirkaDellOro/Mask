import OctoTexture from './octo-texture.js';

const startButton = document.querySelector('#start-button');
const stopButton = document.querySelector('#stop-button');
const tintSlider = document.querySelector('#tint-slider input');
const amplitudeSlider = document.querySelector('#amplitude-slider input');
const octavesSlider = document.querySelector('#octaves-slider input');
const tintTargetSlider = document.querySelector('#tint-target-slider input');
const amplitudeTargetSlider = document.querySelector('#amplitude-target-slider input');
const octavesTargetSlider = document.querySelector('#octaves-target-slider input');
const interSlider = document.querySelector('#inter-slider input');
const volumeSlider = document.querySelector('#volume-slider input');

let synth = null;

(function main() {
  startButton.addEventListener('pointerdown', () => {
    if (!synth) {
      const audioContext = new AudioContext();
      const tint = parseFloat(tintSlider.value);
      const amplitude = parseFloat(amplitudeSlider.value);
      const octaves = parseFloat(octavesSlider.value);
      const volume = parseFloat(volumeSlider.value);
      synth = new OctoTexture(audioContext, tint, amplitude, octaves, volume);

      stopButton.addEventListener('pointerdown', () => synth.stop());

      tintSlider.addEventListener('input', (event) => {
        const value = parseFloat(event.target.value);
        synth.setCurrentTint(value);
      });

      amplitudeSlider.addEventListener('input', (event) => {
        const value = parseFloat(event.target.value);
        synth.setCurrentAmplitude(value);
      });

      octavesSlider.addEventListener('input', (event) => {
        const value = parseFloat(event.target.value);
        synth.setCurrentOctaves(value);
      });

      tintTargetSlider.addEventListener('input', (event) => {
        const value = parseFloat(event.target.value);
        synth.setTargetTint(value);
      });

      amplitudeTargetSlider.addEventListener('input', (event) => {
        const value = parseFloat(event.target.value);
        synth.setTargetAmplitude(value);
      });

      octavesTargetSlider.addEventListener('input', (event) => {
        const value = parseFloat(event.target.value);
        synth.setTargetOctaves(value);
      });

      interSlider.addEventListener('input', (event) => {
        const value = parseFloat(event.target.value);
        synth.setInter(value);
      });

      volumeSlider.addEventListener('input', (event) => {
        const value = parseFloat(event.target.value);
        synth.setVolume(value);
      });
    }

    synth.start();
  });
}) ();
