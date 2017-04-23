module Sound {
    export class WebAudioToneSoundFactory {
        constructor(
            private audioContext: AudioContext,
            private oscillatorType: string,
            private startFrequency: number,
            private endFrequency: number,
            private frequencyRange: number,
            private attackSeconds: number,
            private decaySeconds: number,
            private sustainSeconds: number,
            private durationSeconds: number,
            private volumeScale = 1.0
        ) {

        }

        create(): Sound {
            return () => {
                let intensity = Math.random();
                if (this.audioContext) {

                    var now = this.audioContext.currentTime;


                    // base noise
                    var oscillator = this.audioContext.createOscillator();
                    oscillator.frequency.setValueAtTime(Math.max(1, this.startFrequency + this.frequencyRange * intensity), now);
                    oscillator.frequency.linearRampToValueAtTime(Math.max(1, this.endFrequency + this.frequencyRange * intensity), now + this.durationSeconds);
                    oscillator.type = this.oscillatorType;

                    //decay
                    var gain = this.audioContext.createGain();
                    linearRampGain(gain, now, 0.2 * this.volumeScale, 0.1 * this.volumeScale, this.attackSeconds, this.decaySeconds, this.sustainSeconds, this.durationSeconds);

                    // wire up
                    oscillator.connect(gain);
                    gain.connect(this.audioContext.destination);
                    oscillator.start();

                    // kill
                    setTimeout(function () {
                        oscillator.stop();
                    }, this.durationSeconds * 1000);

                }
            };
        }
    }
}