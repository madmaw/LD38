module Level.Render {

    export class TweenAnimation implements Animation {

        private callback: () => void;
        private tween: TWEEN.Tween; 
        private timeoutHandle: number;

        constructor(private target: any, private to: any, private duration: number, private updateCallback?: () => void, easing?: (k:number)=>number) {
            this.tween = new TWEEN.Tween(this.target).to(to, this.duration).onComplete(() => {
                this.callCallback();
            }).onUpdate(() => {
                if (this.updateCallback != null) {
                    this.updateCallback();
                }
            });
            if (easing != null) {
                this.tween.easing(easing);
            }
        }

        callCallback() {
            if (this.updateCallback != null) {
                this.updateCallback();
                this.updateCallback = null;
            }
            if (this.callback != null) {
                this.callback();
                this.callback = null;
            }
            if (this.timeoutHandle != null) {
                clearTimeout(this.timeoutHandle);
                this.timeoutHandle = null;
            }
        }

        finish(): void {
            this.tween.stop();

            for (let key in this.to) {
                this.target[key] = this.to[key];
            }

            this.callCallback();
        }

        start(): void {
            this.tween.start()
            // sometimes the tweens don't work!
            this.timeoutHandle = setTimeout(() => {
                this.callCallback();
            }, this.duration + 500);
        }

        stop():void {
            this.tween.stop();
        }

        onComplete(callback: () => void): void {
            this.callback = callback;
        }

    }

}