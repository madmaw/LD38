module Level.Render {

    export class PixiRenderFactory {

        constructor(
            private images: { [_: string]: HTMLCanvasElement[] },
            private renderer: PIXI.CanvasRenderer | PIXI.WebGLRenderer,
            private stage: PIXI.Container, 
            private tileWidth: number, 
            private tileHeight: number, 
            private sounds: { [_: string]: Sound.Sound }
        ) {

        }

        create(): EntityRenderFactory {
            
            return (entity: Level.Description.Entity) => {

                if (entity.entityType == Level.Description.EntityType.WALL) {
                    let images;
                    let wall = <Level.Description.Wall>entity;
                    if (wall.orientation == Level.Description.WallOrientation.VERTICAL) {
                        images = this.images['wall-vertical'];
                    } else {
                        images = this.images['wall-horizontal'];
                    }
                    return new WallPixiEntityRender(
                        images,
                        wall,
                        this.stage,
                        this.tileWidth,
                        this.tileHeight
                    );
                } else if (entity.entityType == Level.Description.EntityType.TILE) {
                    let passiveImages = this.images['tile'];
                    let activeImages = this.images['tile-active'];
                    let tile = <Level.Description.Tile>entity;
                    return new TilePixiEntityRender(
                        activeImages, 
                        passiveImages, 
                        tile, 
                        this.stage,
                        this.tileWidth,
                        this.tileHeight, 
                        this.sounds['activate'], 
                        this.sounds['deactivate']
                    );
                } else if (entity.entityType == Level.Description.EntityType.MONSTER) {
                    let images;
                    let monster = <Level.Description.Monster>entity;
                    if (monster.monsterType == Level.Description.MonsterType.Player) {
                        images = this.images['player'];
                    } else if (monster.monsterType == Level.Description.MonsterType.Dragon) {
                        images = this.images['dragon'];
                    } else if (monster.monsterType == Level.Description.MonsterType.Boulder) {
                        images = this.images['boulder'];
                    } else {
                        images = null;
                    }
                    if (images != null) {

                        return new MonsterPixiEntityRender(
                            images,
                            monster,
                            this.stage,
                            this.tileWidth,
                            this.tileHeight,
                            this.sounds['split'],
                            this.sounds['move'],
                            this.sounds['death']
                        );
                    } else {
                        return null;
                    }
                } else {
                    return null;
                }
            }
        }
    }

}