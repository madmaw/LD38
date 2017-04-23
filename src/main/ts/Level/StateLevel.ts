module Level {
    export class StateLevel implements State {

        private levelElementId: string;
        private canvasElementId: string;
        private victoryElementId: string;
        private helpElementId: string;
        private homeElementId: string;
        private restartElementId: string;
        private renderFactory: Level.Render.EntityRenderFactory;
        private renders: { [_: number]: Level.Render.EntityRender };
        private renderer: PIXI.CanvasRenderer | PIXI.WebGLRenderer;
        private stage: PIXI.Container;
        private running: boolean;
        private animations: Level.Render.Animation[];
        private cancellingAnimations: boolean;
        private won: boolean;
        private hammer: HammerManager;

        private listener: StateListener;        

        constructor(private images: { [_: string]: HTMLCanvasElement[] }, private sounds: { [_: string]: Sound.Sound }, private room: Level.Description.Room, private levelId: number, private nextLevelId: number) {
            this.levelElementId = 'level';
            this.canvasElementId = 'level-canvas';
            this.victoryElementId = 'level-victory';
            this.helpElementId = 'level-help';
            this.homeElementId = 'level-home';
            this.restartElementId = 'level-restart';
            
            this.renders = {};
            this.animations = [];
        }

        start(listener: StateListener): void {
            this.listener = listener;
            let levelElement = document.getElementById(this.levelElementId);
            let canvasElement = <HTMLCanvasElement>document.getElementById(this.canvasElementId);
            document.body.setAttribute('class', 'noOverflow');
            levelElement.removeAttribute('class');
            let victoryElement = document.getElementById(this.victoryElementId);
            victoryElement.setAttribute('class', 'hidden');

            let homeElement = document.getElementById(this.homeElementId);
            homeElement.onclick = () => {
                listener(new StateEvent(StateEventType.GoHome));
            };
            let restartElement = document.getElementById(this.restartElementId);
            restartElement.onclick = () => {
                listener(new StateEvent(StateEventType.PlayLevel, new StateEventDataLevelPlay(this.levelId)));
            };

            let helpElement = document.getElementById(this.helpElementId);
            if (this.room.helpText != null) {
                helpElement.removeAttribute('class');
                helpElement.innerText = this.room.helpText;
            } else {
                helpElement.setAttribute('class', 'hidden');
            }

            let tileWidth = 64;
            let tileHeight = 48;
            let roomWidth = this.room.width * tileWidth;
            let roomHeight = this.room.height * tileHeight;

            let expectedRoomWidth = 8 * tileWidth;
            let expectedRoomHeight = 8 * tileHeight;

            let width = document.body.clientWidth;
            let height = document.body.clientHeight;

            let scale = Math.max(1, Math.floor(Math.min(width / expectedRoomWidth, height / expectedRoomHeight)));

            let options: PIXI.RendererOptions = {
                view: canvasElement,
                backgroundColor: 0x444444,
                width: width,
                height: height
            };


            this.renderer = PIXI.autoDetectRenderer(options);
            this.stage = new PIXI.Container();
            this.stage.x = ((width - roomWidth) / 2) / scale;
            this.stage.y = ((height - roomHeight) / 2) / scale;
            this.stage.scale.set(scale);

            this.renderFactory = new Level.Render.PixiRenderFactory(
                this.images,
                this.renderer,
                this.stage,
                tileWidth,
                tileHeight, 
                this.sounds
            ).create();

            this.hammer = new Hammer(levelElement);
            this.hammer.get('swipe').set({ direction: Hammer.DIRECTION_ALL });
            this.hammer.on('swipe', (input: HammerInput) => {
                if (input.direction == Hammer.DIRECTION_UP) {
                    this.move(Direction.NORTH);
                } else if (input.direction == Hammer.DIRECTION_DOWN) {
                    this.move(Direction.SOUTH);
                } else if (input.direction == Hammer.DIRECTION_LEFT) {
                    this.move(Direction.WEST);
                } else if (input.direction == Hammer.DIRECTION_RIGHT) {
                    this.move(Direction.EAST);
                } 
            });
            this.hammer.on('tap', (input: HammerInput) => {
                this.move(Direction.NONE);
            });
            

            document.onkeydown = (event: KeyboardEvent) => {
                switch (event.keyCode) {
                    // w
                    case 87:
                    //up
                    case 38:
                        this.move(Direction.NORTH);
                        break;
                    // s
                    case 83:
                    // down
                    case 40:
                        this.move(Direction.SOUTH);
                        break;
                    // a
                    case 65:
                    // left
                    case 37:
                        this.move(Direction.WEST);
                        break;
                    // d
                    case 68:
                    // right
                    case 39:
                        this.move(Direction.EAST);
                        break;
                    default:
                        this.move(Direction.NONE);
                        break;

                }
            };

            this.running = true;
            let animate = (time: number) => {
                if (this.running) {
                    requestAnimationFrame(animate);
                    TWEEN.update(time);
                    this.renderer.render(this.stage);
                }
            };
            this.rerender();
            requestAnimationFrame(animate);
        }

        move(direction: Direction) {
            let helpElement = document.getElementById(this.helpElementId);
            helpElement.setAttribute('class', 'hidden');
            if (this.won) {
                this.listener(new StateEvent(StateEventType.PlayLevel, new StateEventDataLevelPlay(this.nextLevelId)));
            } else {
                // cancel any animations
                this.cancellingAnimations = true;
                for (let i = this.animations.length; i > 0;) {
                    i--;
                    let animation = this.animations[i];
                    animation.finish();
                }
                this.animations = [];
                this.cancellingAnimations = false;

                let deltas = this.room.move(direction);
                for (let delta of deltas) {
                    this.render(delta);
                }
                if (this.room.isComplete()) {
                    this.won = true;
                    let victoryElement = document.getElementById(this.victoryElementId);
                    victoryElement.removeAttribute('class');
                    // add in our victory image
                }
            }
        }

        render(delta: Level.Description.Delta) {
            let render = this.renders[delta.entity.id];
            if (render == null) {
                render = this.renderFactory(delta.entity);
                if (render != null) {
                    render.attach();
                    this.renders[delta.entity.id] = render;
                }
            }
            if (render != null) {
                let animation = render.applyDelta(delta);
                if (animation != null) {
                    this.animations.push(animation);
                    animation.onComplete(() => {
                        let index = this.animations.indexOf(animation);
                        if (index >= 0) {
                            this.animations.splice(index, 1);
                        }
                        for (let child of delta.children) {
                            this.render(child);
                        }
                    });
                    if (this.cancellingAnimations) {
                        animation.finish();
                    } else {
                        animation.start();
                    }
                }
            }
        }


        rerender() {
            for (let key in this.renders) {
                let render = this.renders[key];
                render.detach();
            }
            TWEEN.removeAll();
            this.renders = {};
            // recreate all the entities
            let entities = this.room.getAllEntites();
            for (let entity of entities) {
                let render = this.renderFactory(entity);
                if (render != null) {
                    render.attach();
                    this.renders[entity.id] = render;
                }
            }
            this.renderer.render(this.stage);
        }

        stop(): void {
            this.hammer.destroy();
            this.running = false;
            TWEEN.removeAll();
            document.body.removeAttribute('class');
            let levelElement = document.getElementById(this.levelElementId);
            levelElement.setAttribute('class', 'hidden');
        }
    }
}