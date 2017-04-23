module Level.Description {

    export enum DeltaType {
        MoveToTile, 
        MoveToWall, 
        MoveFail, 
        Recolor, 
        MonsterAdded, 
        MonsterRemoved,
        DoNothing,
        LevelComplete,
        TileActivate, 
        TileDeactivate

    }

    export class Delta {
        public children: Delta[];
        constructor(
            public entity: Level.Description.Entity,
            public type: DeltaType,
            public data?: DeltaDataMoveToTile | DeltaDataMoveToWall | DeltaDataRecolor
        ) {
            this.children = [];
        }

        public addChild(delta: Delta): Delta {
            this.children.push(delta);
            return this;
        }

        public addChildren(deltas: Delta[]): Delta {

            this.children.push.apply(this.children, deltas);
            return this;
        }

    }

    export enum DeltaDataMoveType {
        Walk, 
        Push
    }

    export class DeltaDataMoveToWall {
        constructor(public fromTileX: number, public fromTileY: number, public direction: Direction, public moveType: DeltaDataMoveType) {

        }
    }

    export class DeltaDataMoveToTile {
        constructor(public toTileX: number, public toTileY: number, public direction: Direction, public moveType: DeltaDataMoveType) {

        }
    }

    export class DeltaDataMoveFail {
        constructor(public fromTileX: number, public fromTileY: number, public direction: Direction, public moveType: DeltaDataMoveType) {

        }
    }

    export class DeltaDataRecolor {
        constructor(public toColor: Color) {

        }
    }
    
}