interface StateListener {
    (key: StateEvent): void;
}


enum StateEventType {
    LoadingComplete,
    GoHome,
    PlayLevel
}

class StateEvent {
    constructor(public type: StateEventType, public data?: StateEventDataLevelPlay | StateEventDataLoadingComplete) {

    }
}

class StateEventDataLoadingComplete {
    constructor(public images: { [_: string]: HTMLCanvasElement[] }) {

    }
}

class StateEventDataLevelPlay {
    constructor(public id: number) {

    }
}