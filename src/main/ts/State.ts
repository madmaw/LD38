interface State {
    start(listener: StateListener): void;

    stop(): void;
}