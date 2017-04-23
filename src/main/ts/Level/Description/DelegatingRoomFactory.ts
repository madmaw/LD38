module Level.Description {

    export class DelegatableRoomFactory {
        constructor(public levelSummary: LevelSummary, public roomFactory: RoomFactory) {

        }
    }

    export class DelegatingRoomFactory {

        constructor(public roomFactories: DelegatableRoomFactory[]) {

        }

        public getLevelSummaries(): LevelSummary[] {
            let levelSummaries: LevelSummary[] = [];
            for (let roomFactory of this.roomFactories) {
                levelSummaries.push(roomFactory.levelSummary);
            }
            return levelSummaries;
        }

        create(): RoomFactory {
            return (levelId: number) => {
                return this.roomFactories[levelId % this.roomFactories.length].roomFactory(levelId);
            }
        }

    }

}