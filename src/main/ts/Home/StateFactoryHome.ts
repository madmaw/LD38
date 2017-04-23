module Home {
    export class StateFactoryHome {

        constructor(private levelSummaries: Level.LevelSummary[]) {

        }

        create(): StateFactory {
            return (stateKey: StateKey) => {
                return new Home.StateHome(this.levelSummaries);
            };
        }
    }
}