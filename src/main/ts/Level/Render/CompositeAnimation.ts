module Level.Render {

    export class CompositeAnimation implements Animation {

        private callback: () => void;

        constructor(private animations: Animation[]) {

        }

        onComplete(callback: () => void): void {
            if (this.animations.length == 0) {
                callback();
            } else {
                let count = 0;
                for (let animation of this.animations) {
                    animation.onComplete(() => {
                        count++;
                        if (count == this.animations.length) {
                            callback();
                        }
                    });
                }

            }
        }

        start(): void {
            for (let animation of this.animations) {
                animation.start();
            }
        }

        stop(): void {
            for (let animation of this.animations) {
                animation.stop();
            }
        }

        finish(): void {
            for (let animation of this.animations) {
                animation.finish();
            }
        }

    }

}