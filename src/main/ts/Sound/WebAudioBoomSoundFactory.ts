module Sound {

    export class WebAudioBoomSoundFactory {

        private buffer: AudioBuffer;

        constructor(private audioContext: AudioContext, private sampleDurationSeconds: number) {
            if (this.audioContext) {
                var frameCount = this.sampleDurationSeconds * this.audioContext.sampleRate;
                this.buffer = audioContext.createBuffer(1, frameCount, this.audioContext.sampleRate);
                var data = this.buffer.getChannelData(0);
                for (var i = 0; i < frameCount; i++) {
                    data[i] = Math.random() * 2 - 1;
                }
            }
        }

        create(): Sound {
            return () => {
                let intensity = Math.random();
                if (this.audioContext) {
                    // set up the frequency
                    var now = this.audioContext.currentTime;
                    var durationSeconds = this.sampleDurationSeconds;

                    var staticNode = this.audioContext.createBufferSource();
                    staticNode.buffer = this.buffer;
                    staticNode.loop = true;

                    var filter = this.audioContext.createBiquadFilter();
                    filter.type = 'lowpass';
                    filter.Q.value = 1;
                    filter.frequency.value = 1200;

                    //decay
                    var gain = this.audioContext.createGain();
                    var decay = durationSeconds * 0.5;
                    linearRampGain(gain, now, intensity/2, intensity, durationSeconds, decay, null, durationSeconds);

                    staticNode.connect(filter);
                    filter.connect(gain);
                    gain.connect(this.audioContext.destination);


                    // die
                    setTimeout(function () {
                        filter.disconnect();
                        staticNode.disconnect();
                        staticNode.stop();
                    }, durationSeconds * 1000);



                    staticNode.start();
                }
            };
        }
    }

}