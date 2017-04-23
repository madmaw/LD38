class DelegatingStateFactory {

    constructor(private stateFactories: { [_: string]: StateFactory }) {

    }

    create(): StateFactory {
        return (stateKey: StateKey) => {
            let result: State;
            let stateFactory = this.stateFactories[stateKey.type];
            if (stateFactory != null) {
                result = stateFactory(stateKey);
            } else {
                result = null;
            }
            return result;
        }
    }
}