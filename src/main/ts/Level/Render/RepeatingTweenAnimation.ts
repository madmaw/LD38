module Level.Render {

    export class RepeatingTweenAnimation implements Animation {
        private tween: TWEEN.Tween;
        private goingTo: boolean;
        private timeoutHandle: number;

        constructor(private target: any, private from: any, private to: any, private duration: number) {
            this.goingTo = true;
        }

        finish(): void {
            if (this.tween != null) {
                this.tween.stop();
            }

            for (let key in this.from) {
                this.target[key] = this.from[key];
            }
        }

        startNextAnimation(): void {
            let to;
            if (this.goingTo) {
                to = this.to;
            } else {
                to = this.from;
            }
            this.tween = new TWEEN.Tween(this.target).to(to, this.duration).easing(TWEEN.Easing.Quadratic.InOut).onComplete(() => {
                this.goingTo = !this.goingTo;
                this.startNextAnimation();
            }).start();

        }

        start(): void {
            //weird bug where repeating animations don't start initially
            this.timeoutHandle = setTimeout(() => {
                if (this.tween == null) {
                    this.startNextAnimation();
                } else {
                    this.tween.start()

                }
            }, 40);
        }

        stop(): void {
            clearTimeout(this.timeoutHandle);
            if (this.tween != null) {
                this.tween.stop();
            }
        }

        onComplete(callback: () => void): void {
            // never compeltes
        }

    }


}