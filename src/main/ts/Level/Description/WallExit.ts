///<reference path="WallSolid.ts"/>

module Level.Description {

    export class WallExit extends WallSolid {

        constructor(id: number, color: Color, x: number, y: number) {
            super(id, color, x, y, WallOrientation.HORIZONTAL);
        }

        cross(room: Room, crosser: Monster): WallCrossing {
            let color = this.color.union(crosser.getColor());
            let delta = this.recolor(room, color);
            if (this.color.isWhite()) {
                // level complete
                delta.addChild(new Delta(this, DeltaType.LevelComplete));
            }
            return new WallCrossing(true, [delta]);
        }


    }
}