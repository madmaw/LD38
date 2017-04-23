module Level.Render {
    export class EmptyAnimation implements Animation {
        finish(): void {
            // done!
        }

        start(): void {

        }

        stop(): void {

        }

        onComplete(callback: () => void): void {
            callback();
        }

    }
}