module Level.Description {

    export enum EntityType {
        WALL, 
        MONSTER,
        TILE
    }

    export interface Entity {

        id: number;

        entityType: EntityType;
        
        getColor(): Color;
    }
}