/// <reference path="BaseEntity.ts" />

module Level.Description {

    export class BaseMonster extends BaseEntity implements Monster {

        public sticky: boolean;

        constructor(id: number, color: Color, public monsterType: MonsterType, public tileX: number, public tileY: number) {
            super(id, EntityType.MONSTER, color);
            this.sticky = false;
        }

        canBeMovedIntoBy(room: Room, mover: Monster, moverColor: Color, direction: Direction): Color {
            // is the next tile over empty or contain a thing that can be pushed?
            let myColor;
            if (this.sticky) {
                myColor = this.getColor();
            } else {
                myColor = this.getColor().intersection(moverColor);
            }
            let canMove = this.canMove(room, myColor, direction);
            let canSquish = this.canBeSquishedBy(room, mover, myColor);
            return canMove.union(canSquish);

        }

        canMove(room: Room, myColor: Color, direction: Direction): Color {
            let wall = room.getWall(this.tileX, this.tileY, direction);
            let canMove;
            if (wall == null) {
                canMove = myColor;
            } else {
                if (this.sticky && wall.getColor().overlaps(myColor)) {
                    // can't move
                    canMove = Color.BLACK;
                } else {
                    // bits of us can move...
                    canMove = myColor.exclude(wall.getColor());
                }
            }
            if (!canMove.isBlack()) {
                // can we move onto the next tile
                let tile = room.getTile(this.tileX, this.tileY, direction);
                if (tile != null) {
                    let monsters = tile.monsters;
                    for (let monster of monsters) {
                        if (monster.getColor().overlaps(canMove)) {
                            let canKill: Color = monster.canBeKilledBy(room, this, canMove);
                            let canDie: Color = this.canReallyBeKilledBy(canMove, room, monster, monster.getColor());
                            let canPush = monster.canBeMovedIntoBy(room, this, canMove, direction);
                            // are there colours we can't push?
                            let cantPush = monster.getColor().exclude(canPush);
                            canPush = canMove.exclude(cantPush);

                            let canMerge = this.canMergeInto(canMove, room, monster);
                            let canSplit = this.canSplitOnto(canMove, room, monster);
                            let canDisplaceEntity = canKill.union(canDie).union(canMerge).union(canPush).union(canSplit);
                            canMove = canMove.intersection(canDisplaceEntity);
                            if (canMove.isBlack()) {
                                break;
                            }
                        }
                    }
                }
            }
            if (this.sticky && !canMove.contains(myColor)) {
                canMove = Color.BLACK;
            }
            return canMove;
        }


        move(room: Room, direction: Direction): Delta[] {
            let canMove = this.canMove(room, this.getColor(), direction);
            let result: Delta[] = [];
            if (!canMove.isBlack()) {
                // move
                let intersection = canMove.intersection(this.getColor());
                let remainder = this.getColor().exclude(intersection);

                if (!remainder.isBlack()) {
                    // create a duplicate
                    result.push(this.duplicate(room, remainder));
                    // reduce our number of colours
                    result.push(this.recolor(room, intersection));
                }

                let successfulMove = this.moveToTile(room, direction);
                result.push(successfulMove);
            } else {
                result.push(this.moveFailed(room, direction));
            }
            return result;
        }

        canSplitOnto(myColor: Color, room: Room, onto: Monster): Color {
            if (this.sticky) {
                // we can't split!
                return Color.BLACK;
            } else {
                return myColor.exclude(onto.getColor());
            }
        }

        canMergeInto(myColor: Color, room: Room, into: Monster): Color {
            let result;
            if (this.monsterType == into.monsterType) {
                if (this.sticky && into.sticky) {
                    if (into.getColor().overlaps(myColor)) {
                        result = Color.BLACK;
                    } else {
                        result = myColor;
                    }
                } else {
                    result = myColor.exclude(into.getColor());
                }
            } else {
                result = Color.BLACK;
            }
            return result;
        }

        beMovedIntoBy(room: Room, mover: Monster, direction: Direction): Delta[] {
            let color = this.getColor();
            let deltas: Delta[] = [];
            if (mover.getColor().overlaps(color)) {
                let movableColor;
                if (!this.sticky) {
                    movableColor = color.intersection(mover.getColor());
                } else {
                    movableColor = color;
                }
                let moveColor = this.canMove(room, movableColor, direction);
                let excludedColors = color.exclude(moveColor);
                if (!excludedColors.isBlack()) {
                    let survivingColors = excludedColors.exclude(mover.getColor());
                    if (moveColor.isBlack() || this.sticky) {
                        // or die entirely
                        deltas.push(this.die(room, this.monsterType != mover.monsterType));
                    } else {
                        // kill off our colours
                        let colorDelta = this.recolor(room, moveColor);
                        deltas.push(colorDelta);
                    }
                    if (!survivingColors.isBlack()) {
                        deltas.push(this.duplicate(room, survivingColors));
                    }
                }
                if (!moveColor.isBlack()) {
                    let moveDeltas = this.move(room, direction);
                    deltas.push.apply(deltas, moveDeltas);
                }
            }
            return deltas;
        }

        canBeSquishedBy(room: Room, squisher: Monster, squisherColor: Color): Color {
            return this.canReallyBeSquishedBy(this.getColor(), room, squisher, squisherColor);
        }

        canReallyBeSquishedBy(myColor: Color, room: Room, squisher: Monster, squisherColor: Color): Color {
            if (squisher.monsterType == MonsterType.Boulder) {
                if (this.sticky && squisherColor.overlaps(this.getColor())) {
                    return this.getColor();
                } else {
                    return this.getColor().intersection(squisherColor);
                }
            } else {
                return Color.BLACK;
            }
        }

        canBeKilledBy(room: Room, killer: Monster, killerColor: Color): Color {
            return this.canReallyBeKilledBy(this.getColor(), room, killer, killerColor);
        }

        canReallyBeKilledBy(myColor: Color, room: Room, killer: Monster, killerColor: Color): Color {
            return Color.BLACK;
        }

        moveFailed(room: Room, direction: Direction): Delta {
            return new Delta(this, DeltaType.MoveFail);
        } 

        moveToTile(room: Room, direction: Direction): Delta {
            let moveToWallDelta = new Delta(this, DeltaType.MoveToWall, new DeltaDataMoveToWall(this.tileX, this.tileY, direction, DeltaDataMoveType.Walk));
            moveToWallDelta.addChild(room.removeMonster(this));

            let wall = room.getWall(this.tileX, this.tileY, direction);
            let alive;
            if (wall != null) {
                let wallCrossing = wall.cross(room, this);
                alive = !wallCrossing.lethal;
                moveToWallDelta.addChildren(wallCrossing.daltas);
            } else {
                alive = true;
            }
            if (alive) {
                this.tileX += direction.dx;
                this.tileY += direction.dy;
                let tile = room.getTile(this.tileX, this.tileY);
                let monsters = tile.monsters;

                let moveToTileDelta = new Delta(this, DeltaType.MoveToTile, new DeltaDataMoveToTile(this.tileX, this.tileY, direction, DeltaDataMoveType.Walk));
                moveToWallDelta.addChild(moveToTileDelta);

                let remainingColor = this.color;
                // check for our death
                for (let i = monsters.length; i > 0;) {
                    i--;
                    let monster = monsters[i];
                    let killedColor = this.canReallyBeKilledBy(remainingColor, room, monster, monster.getColor());
                    if (!killedColor.isBlack()) {
                        // kill that color
                        remainingColor = remainingColor.exclude(killedColor);
                    }
                }
                // otherwhise notify of moves
                if (!remainingColor.isBlack()) {
                    moveToTileDelta.addChild(this.recolor(room, remainingColor));
                    for (let i = monsters.length; i > 0;) {
                        i--;
                        let monster = monsters[i];
                        if (monster != this) { 
                            let monsterDeltas = monster.beMovedIntoBy(room, this, direction);
                            moveToTileDelta.addChildren(monsterDeltas);
                        }
                    }
                    // merge colors
                    moveToTileDelta.addChildren(this.mergeColors(room));
                    moveToTileDelta.addChild(room.addMonster(this));
                } else {
                    // we died!
                    moveToTileDelta.addChild(this.die(room, true));
                }

            }

            return moveToWallDelta;

        }

        mergeColors(room: Room): Delta[] {
            let monsters = room.getTile(this.tileX, this.tileY).monsters;
            let deltas: Delta[] = [];
            
            for (let i= monsters.length; i > 0; ) {
                i--;
                let monster = monsters[i];
                if (this.monsterType == monster.monsterType) {
                    // merge
                    let color = this.getColor().union(monster.getColor());
                    this.sticky = this.sticky && monster.sticky;
                    deltas.push(this.kill(room, monster, false));
                    deltas.push(this.recolor(room, color));
                } 
            }
            return deltas;
        }

        duplicate(room: Room, color: Color): Delta {
            let duplicate = this.copySelf(room, color);
            if (duplicate != null) {
                duplicate.sticky = this.sticky;
                let result = new Delta(duplicate, DeltaType.MonsterAdded);
                result.addChild(room.addMonster(duplicate));
                return result;
            } else {
                return new Delta(this, DeltaType.DoNothing);
            }
        }

        die(room: Room, violent: boolean): Delta {
            return this.kill(room, this, violent);
        }

        kill(room: Room, monster: Monster, violent: boolean): Delta {
            let result = new Delta(monster, DeltaType.MonsterRemoved, new DeltaDataMonsterRemove(violent));
            result.addChild(room.removeMonster(monster));
            return result;
        }

        recolor(room: Room, color: Color): Delta {
            let tile = room.getTile(this.tileX, this.tileY);
            let wasComplete = tile.isComplete();
            let result = super.recolor(room, color);
            let isComplete = tile.isComplete();
            if (wasComplete != isComplete) {
                if (isComplete) {
                    result.addChild(new Delta(tile, DeltaType.TileActivate));
                } else {
                    result.addChild(new Delta(tile, DeltaType.TileDeactivate));
                }
            }
            return result;
        }


        copySelf(room: Room, color: Color): Monster {
            return null;
        }        
    }

}