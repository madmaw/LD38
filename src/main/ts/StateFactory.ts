enum StateKeyType {
    Home,
    LevelPlay
}

class StateKey {
    constructor(
        public type: StateKeyType,
        public data?: StateKeyDataLevelPlay
    ) {

    }
}

class StateKeyDataLevelPlay {
    constructor(public levelId: number) {

    }
}


interface StateFactory {
    (key: StateKey) : State;
}