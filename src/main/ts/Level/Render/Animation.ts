module Level.Render {
    export interface Animation {
        onComplete(callback: () => void): void;

        start(): void;

        stop(): void;

        finish(): void;
    }
}