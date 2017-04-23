/// <reference path="BaseEntityRender.ts" />

module Level.Render {

    export class WallPixiEntityRender extends BaseEntityRender<Level.Description.Wall> implements EntityRender {

        private sprite: PIXI.Sprite;
        constructor(
            private images: HTMLCanvasElement[],
            entity: Level.Description.Wall,
            container: PIXI.Container,
            tileWidth: number,
            tileHeight: number

        ) {
            super(entity, container, tileWidth, tileHeight);
        }

        attach(): void {
            let image = this.images[this.entity.getColor().id];
            this.sprite = new PIXI.Sprite(PIXI.Texture.fromCanvas(image));
            let x;
            let y;
            if (this.entity.orientation == Level.Description.WallOrientation.HORIZONTAL) {
                x = this.entity.x * this.tileWidth;
                y = this.entity.y * this.tileHeight;
            } else {
                x = this.entity.x * this.tileWidth - this.sprite.width / 2;
                y = (this.entity.y + 1) * this.tileHeight;
            }
            this.sprite.anchor.y = 1;
            this.sprite.x = x;
            this.sprite.y = y;
            this.addChild(this.sprite);
        }

        detach(): void {
            this.container.removeChild(this.sprite);
        }

        applyDelta(delta: Level.Description.Delta): Animation {
            if (delta.type == Level.Description.DeltaType.Recolor && delta.data instanceof Level.Description.DeltaDataRecolor) {
                let data = <Level.Description.DeltaDataRecolor>delta.data;
                let image = this.images[data.toColor.id];
                this.sprite.texture = PIXI.Texture.fromCanvas(image);
                return new EmptyAnimation();
            } else {
                return new EmptyAnimation();
            }
        }
    }
}