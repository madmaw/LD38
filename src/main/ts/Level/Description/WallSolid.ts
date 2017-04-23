///<reference path="BaseEntity.ts"/>

module Level.Description {

    export class WallSolid extends BaseEntity implements Wall {
        constructor(id: number, color: Color, public x: number, public y: number, public orientation: WallOrientation) {
            super(id, EntityType.WALL, color);
        }

        cross(room: Room, crosser: Monster): WallCrossing {
            return new WallCrossing(false, []);
        }
    }

}