module Level.Description {

    export class MonsterDragon extends BaseMonster {

        constructor(id: number, color: Color, tileX: number, tileY: number) {
            super(id, color, MonsterType.Dragon, tileX, tileY);
        }


    }

}