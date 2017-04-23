module Level.Description {
    export enum WallOrientation {
        VERTICAL, 
        HORIZONTAL
    }

    export class WallCrossing {
        constructor(public lethal: boolean, public daltas: Delta[]) {

        }
    }

    export interface Wall extends Entity {
        x: number;
        y: number;
        orientation: WallOrientation;

        cross(room: Room, crosser: Monster): WallCrossing;
    }
}