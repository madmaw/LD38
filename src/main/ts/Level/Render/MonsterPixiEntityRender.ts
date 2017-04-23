/// <reference path="BaseEntityRender.ts" />

module Level.Render {

    export class MonsterPixiEntityRender extends BaseEntityRender<Level.Description.Monster> implements EntityRender {
        private sprite: PIXI.Sprite;
        constructor(
            private images: HTMLCanvasElement[],
            entity: Level.Description.Monster,
            container: PIXI.Container,
            tileWidth: number,
            tileHeight: number, 
            private splitSound: Sound.Sound,
            private moveSound: Sound.Sound, 
            private deathSound: Sound.Sound

        ) {
            super(entity, container, tileWidth, tileHeight);
        }

        attach(): void {
            let image = this.images[this.entity.getColor().id];
            this.sprite = new PIXI.Sprite(PIXI.Texture.fromCanvas(image));
            this.sprite.anchor.x = 0.5;
            this.sprite.blendMode = PIXI.BLEND_MODES.ADD;
            let x = this.entity.tileX * this.tileWidth + this.tileWidth / 2;
            let y = this.entity.tileY * this.tileHeight + this.tileHeight / 2;
            if (this.entity.monsterType == Level.Description.MonsterType.Boulder) {
                this.sprite.anchor.y = 0.5;
                y -= this.sprite.height / 2;
            } else {
                this.sprite.anchor.y = 1;
            }
            this.sprite.x = x;
            this.sprite.y = y;

            this.addChild(this.sprite);

            let animations: Animation[] = [];
            if (this.entity.monsterType != Level.Description.MonsterType.Boulder) {
                animations.push(new RepeatingTweenAnimation(this.sprite, { rotation: -Math.PI / 20 }, { rotation: Math.PI / 20 }, 600));
            }                
            if (!this.entity.sticky) {
                animations.push(new RepeatingTweenAnimation(this.sprite, { alpha: 0.5 }, { alpha: 1 }, 100));
            }
            if (animations.length > 0) {
                this.setAmbientAnimation(
                    new CompositeAnimation(animations)
                );
            }
        }

        detach(): void {
            this.container.removeChild(this.sprite);
            this.setAmbientAnimation(null);
        }

        applyDelta(delta: Level.Description.Delta): Animation {
            if (delta.type == Level.Description.DeltaType.MoveToWall && delta.data instanceof Level.Description.DeltaDataMoveToWall) {
                let data = <Level.Description.DeltaDataMoveToWall>delta.data;
                let animations: Animation[] = [];
                if (this.entity.monsterType == Level.Description.MonsterType.Player) {
                    let toX = data.fromTileX * this.tileWidth + this.tileWidth / 2 + data.direction.dx * this.tileWidth / 2;
                    let toY = data.fromTileY * this.tileHeight + this.tileHeight / 2 + data.direction.dy * this.tileHeight / 2 - this.tileHeight / 4;
                    animations.push(new TweenAnimation(this.sprite, { x: toX, y: toY }, 100, () => { this.reorderChild(this.sprite); }, TWEEN.Easing.Quadratic.In));

                    // play a bit of audio
                    this.moveSound();
                } else {
                    let toX = data.fromTileX * this.tileWidth + this.tileWidth / 2 + data.direction.dx * this.tileWidth / 2;
                    let toY = data.fromTileY * this.tileHeight + this.tileHeight / 2 + data.direction.dy * this.tileHeight / 2;
                    let to: any = { x: toX, y: toY };
                    if (this.entity.monsterType == Level.Description.MonsterType.Boulder) {
                        to.y -= this.sprite.height/2;
                        if (data.direction == Direction.WEST) {
                            to.rotation = -Math.PI;
                        } else {
                            to.rotation = Math.PI;
                        }
                        this.sprite.rotation = 0;
                    }
                    animations.push(new TweenAnimation(this.sprite, to, 200, () => { this.reorderChild(this.sprite); }, TWEEN.Easing.Quadratic.In));

                }
                return new CompositeAnimation(animations);
            } else if (delta.type == Level.Description.DeltaType.MoveToTile && delta.data instanceof Level.Description.DeltaDataMoveToTile) {
                let data = <Level.Description.DeltaDataMoveToTile>delta.data;
                
                let toX = data.toTileX * this.tileWidth + this.tileWidth / 2;
                let toY = data.toTileY * this.tileHeight + this.tileHeight / 2;
                let to: any = { x: toX, y: toY };
                if (this.entity.monsterType == Level.Description.MonsterType.Boulder) {
                    to.y -= this.sprite.height / 2;
                    if (data.direction == Direction.WEST) {
                        to.rotation = -Math.PI * 2;

                    } else {
                        to.rotation = Math.PI * 2;
                    }
                }
                return new TweenAnimation(this.sprite, to, 200, () => { this.reorderChild(this.sprite); }, TWEEN.Easing.Quadratic.Out);
            } else if (delta.type == Level.Description.DeltaType.Recolor && delta.data instanceof Level.Description.DeltaDataRecolor) {
                let data = <Level.Description.DeltaDataRecolor>delta.data;
                let image = this.images[data.toColor.id];
                this.sprite.texture = PIXI.Texture.fromCanvas(image);
                this.splitSound();
            } else if (delta.type == Level.Description.DeltaType.MonsterRemoved) {
                this.detach();
                if (delta.data instanceof Level.Description.DeltaDataMonsterRemove) {
                    if (delta.data.violent) {
                        this.deathSound();
                    }
                }
            } else {
                return new EmptyAnimation();
            }
        }
    }

}