module Level.Description {

    export enum MonsterType {
        Player, 
        Dragon, 
        Boulder
    }

    export interface Monster extends Level.Description.Entity {

        monsterType: MonsterType;
        tileX: number;
        tileY: number;
        sticky: boolean;

        canBeMovedIntoBy(room: Room, mover: Monster, moverColor: Color, direction: Direction): Color;

        canBeKilledBy(room: Room, killer: Monster, killerColor: Color): Color;

        beMovedIntoBy(room: Room, mover: Monster, direction: Direction): Delta[];

        move(room: Room, direction: Direction): Delta[];
    }
}