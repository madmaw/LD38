///<reference path="BaseMonster.ts"/>

module Level.Description {
    export class MonsterBoulder extends BaseMonster {
        constructor(id: number, color: Color, tileX: number, tileY: number) {
            super(id, color, MonsterType.Boulder, tileX, tileY);
        }

        canBeSquishedBy(room: Room, squisher: Monster, squisherColor: Color): Color {
            return Color.BLACK;
        }

        copySelf(room: Room, color: Color): Monster {
            return new MonsterBoulder(room.nextId(), color, this.tileX, this.tileY);
        }
    
    }
}