module Sound {

    export class WebAudioVibratoSoundFactory {
        constructor(
            private audioContext: AudioContext,
            private startFrequency: number,
            private endFrequency: number,
            private vibrations: number,
            private durationSeconds: number
        ) {
        }

        create(): Sound.Sound {
            return () => {
                if (this.audioContext) {
                    var now = this.audioContext.currentTime;

                    var oscillator = this.audioContext.createOscillator();
                    oscillator.frequency.setValueAtTime(this.startFrequency, now);
                    oscillator.frequency.linearRampToValueAtTime(this.endFrequency, now + this.durationSeconds);
                    oscillator.type = 'square';
                    oscillator.start();

                    var gain = this.audioContext.createGain();
                    linearRampGain(gain, now, 0.2, 0.1, 0, this.durationSeconds * 0.1, this.durationSeconds * 0.2, this.durationSeconds);

                    var vibrato = this.audioContext.createOscillator();
                    vibrato.frequency.value = this.vibrations / this.durationSeconds;
                    vibrato.type = 'sawtooth';
                    vibrato.start();

                    var vibratoGain = this.audioContext.createGain();
                    vibratoGain.gain.value = -1000;

                    oscillator.connect(gain);
                    //gain.connect(vibratoGain);
                    vibrato.connect(vibratoGain);
                    vibratoGain.connect((<any>oscillator.detune));
                    gain.connect(this.audioContext.destination);

                    setTimeout(function () {
                        oscillator.disconnect();
                        gain.disconnect();
                        vibratoGain.disconnect();
                        oscillator.stop();
                        vibrato.stop();
                    }, this.durationSeconds * 1000);
                }

            }
        }
    }

}