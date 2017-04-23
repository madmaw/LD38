module Level.Description {
    export class Room {

        private nextEntityId: number;
        public tiles: Tile[][];
        public verticalWalls: Wall[][];
        public horizontalWalls : Wall[][];

        constructor(public width: number, public height: number, public helpText: string) {
            this.nextEntityId = 0;
            this.tiles = [];
            for (let x = 0; x < width; x++) {
                let tilesX: Level.Description.Tile[] = [];
                for (let y = 0; y < height; y++) {
                    let tile = new Level.Description.Tile(this.nextId(), Color.BLACK, x, y);
                    tilesX.push(tile);
                }
                this.tiles.push(tilesX);
            }
            this.verticalWalls = [];
            for (let x = 0; x < width + 1; x++) {
                let verticalWallsX: Level.Description.Wall[] = [];
                for (let y = 0; y < height; y++) {
                    verticalWallsX.push(null);
                }
                this.verticalWalls.push(verticalWallsX);
            }
            this.horizontalWalls = [];
            for (let x = 0; x < width; x++) {
                let horizontalWallsX: Wall[] = [];
                for (let y = 0; y < height + 1; y++) {
                    horizontalWallsX.push(null);
                }
                this.horizontalWalls.push(horizontalWallsX);
            }
        }

        public getWall(tileX: number, tileY: number, direction: Direction): Wall {
            let wall;
            if (direction.isVertical()) {
                wall = this.horizontalWalls[tileX][tileY + Math.max(0, direction.dy)];
            } else {
                wall = this.verticalWalls[tileX + Math.max(0, direction.dx)][tileY];
            }
            return wall;
        }

        public getTile(tileX: number, tileY: number, direction?: Direction): Tile {
            let dx;
            let dy;
            if (direction != null) {
                dx = direction.dx;
                dy = direction.dy;
            } else {
                dx = 0;
                dy = 0;
            }
            let x = tileX + dx;
            let y = tileY + dy;
            let tile;
            if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
                tile = this.tiles[x][y];
            } else {
                tile = null;
            }
            return tile;
        }

        public removeMonster(monster: Monster): Delta {
            let tile = this.tiles[monster.tileX][monster.tileY];
            let index = tile.monsters.indexOf(monster);
            if (index >= 0) {
                let wasComplete = tile.isComplete();
                tile.monsters.splice(index, 1);
                let isComplete = tile.isComplete();
                if (wasComplete && !isComplete) {
                    return new Delta(tile, DeltaType.TileDeactivate);
                }
            }
            return new Delta(tile, DeltaType.DoNothing);
        }

        public addMonster(monster: Monster): Delta {
            let tile = this.tiles[monster.tileX][monster.tileY];
            let wasComplete = tile.isComplete();
            tile.monsters.push(monster);
            let isComplete = tile.isComplete();
            if (!wasComplete && isComplete) {
                return new Delta(tile, DeltaType.TileActivate);
            }
            return new Delta(tile, DeltaType.DoNothing);
        }

        public setWall(wall: Wall): void {
            if (wall.orientation == WallOrientation.VERTICAL) {
                this.verticalWalls[wall.x][wall.y] = wall;
            } else {
                this.horizontalWalls[wall.x][wall.y] = wall;
            }
        }

        public getAllMonsters(): Monster[] {
            let monsters: Monster[] = [];
            for (let x = 0; x < this.width; x++) {
                for (let y = 0; y < this.height; y++) {
                    let tile = this.getTile(x, y);
                    let monsters = tile.monsters;
                    for (let monster of monsters) {
                        monsters.push(monster);
                    }
                }
            }
            return monsters;
        }

        public isComplete(): boolean {
            let complete = true;
            for (let x = 0; x < this.width; x++) {
                for (let y = 0; y < this.height; y++) {
                    let tile = this.getTile(x, y);
                    complete = complete && tile.isComplete();
                }
            }
            return complete;
        }

        public getAllEntites(): Entity[] {
            let entities: Entity[] = [];
            for (let x = 0; x < this.width; x++) {
                for (let y = 0; y < this.height; y++) {
                    let tile = this.getTile(x, y);
                    let monsters = tile.monsters;
                    for (let monster of monsters) {
                        entities.push(monster);
                    }
                    entities.push(tile);
                }
            }
            for (let x = 0; x <= this.width; x++) {
                for (let y = 0; y < this.height; y++) {
                    let wall = this.verticalWalls[x][y];
                    if (wall != null) {
                        entities.push(wall)
                    }
                }
            }
            for (let x = 0; x < this.width; x++) {
                for (let y = 0; y <= this.height; y++) {
                    let wall = this.horizontalWalls[x][y];
                    if (wall != null) {
                        entities.push(wall)
                    }
                }
            }
            return entities;
        }

        public nextId(): number {
            let id = this.nextEntityId;
            this.nextEntityId++;
            return id;
        }

        move(direction: Direction): Delta[] {
            let deltas: Delta[] = [];
            if (direction.dx != 0 || direction.dy != 0) {
                // work back in the opposite direction
                let dx;
                let dy;

                let x;
                if (direction.dx > 0) {
                    x = this.width - 1;
                    dx = -1;
                } else {
                    x = 0;
                    dx = 1;
                }
                while (x >= 0 && x < this.width) {
                    let y;
                    if (direction.dy > 0) {
                        y = this.height - 1;
                        dy = -1;
                    } else {
                        y = 0;
                        dy = 1;
                    }
                    while (y >= 0 && y < this.height) {
                        let tile = this.getTile(x, y);
                        let monsters = tile.monsters;
                        for (let i = monsters.length; i > 0;) {
                            i--;
                            let monster = monsters[i];
                            if (monster.monsterType == MonsterType.Player) {
                                let monsterDeltas = monster.move(this, direction);
                                deltas.push.apply(deltas, monsterDeltas);
                            }
                        }
                        y += dy;
                    }
                    x += dx;
                }

            }
            return deltas;
        }

    }
}