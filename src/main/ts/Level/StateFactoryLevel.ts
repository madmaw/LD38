module Level {
    export class StateFactoryLevel {
        constructor(
            private images: { [_: string]: HTMLCanvasElement[] },
            private sounds: { [_: string]: Sound.Sound },
            private roomFactory: Level.Description.RoomFactory
        ) {

        }

        create(): StateFactory {
            return (stateKey: StateKey) => {
                if (stateKey.data instanceof StateKeyDataLevelPlay) {
                    let data = stateKey.data;
                    let room = this.roomFactory(data.levelId);
                    return new StateLevel(this.images, this.sounds, room, data.levelId, data.levelId + 1);
                } else {
                    return null;
                }
            }
        }
    }
}