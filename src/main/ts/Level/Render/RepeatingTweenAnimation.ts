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
            let f = () => {
                this.goingTo = !this.goingTo;
                this.startNextAnimation();
            };
            this.tween = new TWEEN.Tween(this.target).to(to, this.duration).easing(TWEEN.Easing.Quadratic.InOut).onComplete(f).start();
            if (this.timeoutHandle != null) {
                clearTimeout(this.timeoutHandle);
            }
            // work around bug where tweens stop without feedback
            this.timeoutHandle = setTimeout(f, this.duration + 500);
            
        }

        start(): void {
            //weird bug where repeating animations don't start initially
            if (this.tween == null) {
                this.startNextAnimation();
            } else {
                this.tween.start()

            }
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