module Level.Render {

    export class TilePixiEntityRender extends BaseEntityRender<Level.Description.Tile> {
        private sprite: PIXI.Sprite;
        constructor(
            private activeImages: HTMLCanvasElement[],
            private passiveImages: HTMLCanvasElement[],
            entity: Level.Description.Tile,
            container: PIXI.Container,
            tileWidth: number,
            tileHeight: number, 
            private activateSound: Sound.Sound, 
            private deactivateSound: Sound.Sound

        ) {
            super(entity, container, tileWidth, tileHeight);
        }

        attach(): void {
            let color = this.entity.getColor();
            if (!color.isBlack()) {
                let image;
                if (this.entity.isComplete()) {
                    image = this.activeImages[color.id];
                } else {
                    image = this.passiveImages[color.id];
                }

                this.sprite = new PIXI.Sprite(PIXI.Texture.fromCanvas(image));
                this.sprite.anchor.x = 0.5;
                this.sprite.anchor.y = 0.75;
                let x = this.entity.tileX * this.tileWidth + this.tileWidth / 2;
                let y = this.entity.tileY * this.tileHeight + this.tileHeight / 2;
                this.sprite.x = x;
                this.sprite.y = y;

                this.addChild(this.sprite);
            } else {
                this.sprite = null;
            }
        }

        detach(): void {
            if(this.sprite != null) {
                this.container.removeChild(this.sprite);
                this.setAmbientAnimation(null);
            
            }
        }

        applyDelta(delta: Level.Description.Delta): Animation {
            if (delta.type == Level.Description.DeltaType.TileActivate) {
                let image = this.activeImages[this.entity.getColor().id];
                this.sprite.texture = PIXI.Texture.fromCanvas(image);
                this.activateSound();
            } else if (delta.type == Level.Description.DeltaType.TileDeactivate) {
                let image = this.passiveImages[this.entity.getColor().id];
                this.sprite.texture = PIXI.Texture.fromCanvas(image);
                this.deactivateSound();
            }
            return new EmptyAnimation();
        }

        calculateZ(child: PIXI.DisplayObject): number {
            return this.entity.tileY * this.tileHeight - this.tileHeight * 100;
        }
    }

}