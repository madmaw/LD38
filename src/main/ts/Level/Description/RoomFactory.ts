module Level.Description {
    export interface RoomFactory {
        (levelId: number): Room;
    }
}
