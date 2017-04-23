/// <reference path="BaseMonster.ts" />

module Level.Description {

    export class MonsterPlayer extends BaseMonster implements Monster {

        constructor(id: number, color: Color, tileX: number, tileY: number) {
            super(id, color, MonsterType.Player, tileX, tileY);
        }

        copySelf(room: Room, color: Color): Monster {
            return new MonsterPlayer(room.nextId(), color, this.tileX, this.tileY);
        }


        canReallyBeKilledBy(myColor: Color, room: Room, killer: Monster, killerColor: Color): Color {
            if (killer.monsterType == MonsterType.Dragon) {
                if (this.sticky && myColor.overlaps(killerColor)) {
                    return myColor;
                } else {
                    return myColor.intersection(killerColor);
                }
            } else {
                return Color.BLACK;
            }
        }


    }

}