var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Color = (function () {
    function Color(rgb, name) {
        this.rgb = rgb;
        this.name = name;
        var hex = '#';
        var id = 0;
        for (var _i = 0, rgb_1 = rgb; _i < rgb_1.length; _i++) {
            var v = rgb_1[_i];
            id = id << 1;
            if (v) {
                id = id | 1;
                hex += 'F';
            }
            else {
                hex += '0';
            }
        }
        this.hex = hex;
        this.id = id;
    }
    Color.prototype.hasRed = function () {
        return this.rgb[0];
    };
    Color.prototype.hasGreen = function () {
        return this.rgb[1];
    };
    Color.prototype.hasBlue = function () {
        return this.rgb[2];
    };
    Color.prototype.overlaps = function (color) {
        var result = false;
        for (var i = 0; i < this.rgb.length; i++) {
            var v1 = this.rgb[i];
            var v2 = color.rgb[i];
            result = result || (v1 && v2);
        }
        return result;
    };
    Color.prototype.contains = function (color) {
        var result = true;
        for (var i = 0; i < this.rgb.length; i++) {
            var v1 = this.rgb[i];
            var v2 = color.rgb[i];
            if (v2) {
                result = result && v1;
            }
        }
        return result;
    };
    Color.prototype.isBlack = function () {
        return this.id == 0;
    };
    Color.prototype.isWhite = function () {
        return this.id == Color.VALUES.length - 1;
    };
    Color.prototype.exclude = function (color) {
        var id = (~color.id) & this.id;
        return Color.VALUES[id];
    };
    Color.prototype.intersection = function (color) {
        var id = color.id & this.id;
        return Color.VALUES[id];
    };
    Color.prototype.union = function (color) {
        var id = color.id | this.id;
        return Color.VALUES[id];
    };
    return Color;
}());
Color.WHITE = new Color([true, true, true], 'white');
Color.YELLOW = new Color([true, true, false], 'yellow');
Color.MAGENTA = new Color([true, false, true], 'magenta');
Color.RED = new Color([true, false, false], 'red');
Color.CYAN = new Color([false, true, true], 'cyan');
Color.GREEN = new Color([false, true, false], 'green');
Color.BLUE = new Color([false, false, true], 'blue');
Color.BLACK = new Color([false, false, false], 'black');
Color.VALUES = [
    Color.BLACK,
    Color.BLUE,
    Color.GREEN,
    Color.CYAN,
    Color.RED,
    Color.MAGENTA,
    Color.YELLOW,
    Color.WHITE
];
var DelegatingStateFactory = (function () {
    function DelegatingStateFactory(stateFactories) {
        this.stateFactories = stateFactories;
    }
    DelegatingStateFactory.prototype.create = function () {
        var _this = this;
        return function (stateKey) {
            var result;
            var stateFactory = _this.stateFactories[stateKey.type];
            if (stateFactory != null) {
                result = stateFactory(stateKey);
            }
            else {
                result = null;
            }
            return result;
        };
    };
    return DelegatingStateFactory;
}());
var Direction = (function () {
    function Direction(dx, dy) {
        this.dx = dx;
        this.dy = dy;
    }
    Direction.prototype.isVertical = function () {
        return this.dy != 0;
    };
    return Direction;
}());
Direction.NORTH = new Direction(0, -1);
Direction.SOUTH = new Direction(0, 1);
Direction.EAST = new Direction(1, 0);
Direction.WEST = new Direction(-1, 0);
Direction.NONE = new Direction(0, 0);
Direction.VALUES = [
    Direction.NORTH,
    Direction.SOUTH,
    Direction.EAST,
    Direction.WEST
];
var Home;
(function (Home) {
    var StateFactoryHome = (function () {
        function StateFactoryHome(levelSummaries) {
            this.levelSummaries = levelSummaries;
        }
        StateFactoryHome.prototype.create = function () {
            var _this = this;
            return function (stateKey) {
                return new Home.StateHome(_this.levelSummaries);
            };
        };
        return StateFactoryHome;
    }());
    Home.StateFactoryHome = StateFactoryHome;
})(Home || (Home = {}));
var Home;
(function (Home) {
    var StateHome = (function () {
        function StateHome(levelSummaries) {
            this.levelSummaries = levelSummaries;
            this.homeElementId = 'home';
            this.levelsElementId = 'home-levels';
        }
        StateHome.prototype.start = function (listener) {
            // populate the levels
            var homeElement = document.getElementById(this.homeElementId);
            homeElement.removeAttribute('class');
            var levelsElement = document.getElementById(this.levelsElementId);
            while (levelsElement.firstChild != null) {
                levelsElement.removeChild(levelsElement.firstChild);
            }
            // render level descriptions
            for (var _i = 0, _a = this.levelSummaries; _i < _a.length; _i++) {
                var levelSummary = _a[_i];
                var unlocked = localStorage.getItem('level-' + levelSummary.id) || levelSummary.id == 0;
                var element = document.createElement('div');
                var innerHTML = '<div class="home-level-box"><p class="home-level-id">' + (!unlocked ? '<img class="home-level-lock" src="res/lock.png"/>' : (levelSummary.id + 1)) + '</p><p class="home-level-name">' + levelSummary.name + '</p></div>';
                element.innerHTML = innerHTML;
                element.setAttribute('class', 'home-level');
                if (unlocked) {
                    element.onclick = (function (id) {
                        return function (event) {
                            listener(new StateEvent(StateEventType.PlayLevel, new StateEventDataLevelPlay(id)));
                        };
                    })(levelSummary.id);
                }
                levelsElement.appendChild(element);
            }
        };
        StateHome.prototype.stop = function () {
            var homeElement = document.getElementById(this.homeElementId);
            homeElement.setAttribute('class', 'hidden');
        };
        return StateHome;
    }());
    Home.StateHome = StateHome;
})(Home || (Home = {}));
window.onload = function () {
    var colors = ['#fff', '#ff0', '#f0f', '#f00', '#0ff', '#0f0', '#00f'];
    var stateLoading = new Loading.StateLoading({
        'player': 'res/player_mask.png',
        'wall-horizontal': 'res/wall-horizontal.png',
        'wall-vertical': 'res/wall-vertical.png',
        'dragon': 'res/dragon.png',
        'boulder': 'res/boulder.png',
        'tile': 'res/tile.png',
        'tile-active': 'res/tile_complete.png'
    }, Color.VALUES);
    var currentState = null;
    var stateFactory;
    var eventHandler = function (event) {
        var state;
        if (event.type == StateEventType.LoadingComplete && (event.data instanceof StateEventDataLoadingComplete)) {
            var loadingResult = event.data;
            // create some factories
            var stateFactories = {};
            var roomFactories = [];
            var levelId = 0;
            var done = false;
            while (!done) {
                var id = 'level-' + (levelId + 1);
                var element = document.getElementById(id);
                if (element != null) {
                    var helpText = element.getAttribute('help');
                    roomFactories.push(new Level.Description.DelegatableRoomFactory(new Level.LevelSummary(levelId, element.getAttribute('name')), new Level.Description.TemplateRoomFactory(element.innerText, helpText).create()));
                    levelId++;
                }
                else {
                    done = true;
                }
            }
            var audioContext;
            var splitSound = void 0;
            var moveSound = void 0;
            var activateSound = void 0;
            var deactivateSound = void 0;
            var deathSound = void 0;
            if (window["AudioContext"] != null) {
                audioContext = new AudioContext();
                //    } else if (_w["webkitAudioContext"]) {
                //        audioContext = new webkitAudioContext();
                splitSound = new Sound.WebAudioBoomSoundFactory(audioContext, 0.2).create();
                moveSound = new Sound.WebAudioToneSoundFactory(audioContext, 'sawtooth', 250, 1000, 400, 0.01, 0.08, 0.12, 0.3, 0.3).create();
                activateSound = new Sound.WebAudioToneSoundFactory(audioContext, 'square', 250, 1000, 200, 0.01, 0.08, 0.1, 0.2, 0.2).create();
                deactivateSound = new Sound.WebAudioToneSoundFactory(audioContext, 'square', 1000, 250, 200, 0.01, 0.08, 0.1, 0.2, 0.2).create();
                ;
                deathSound = new Sound.WebAudioVibratoSoundFactory(audioContext, 200, 10, 6, 0.7).create();
            }
            else {
                splitSound = function () {
                };
                moveSound = splitSound;
                activateSound = splitSound;
                deactivateSound = splitSound;
                deathSound = splitSound;
            }
            var sounds = {};
            sounds['split'] = splitSound;
            sounds['move'] = moveSound;
            sounds['activate'] = activateSound;
            sounds['deactivate'] = deactivateSound;
            sounds['death'] = deathSound;
            var roomFactory = new Level.Description.DelegatingRoomFactory(roomFactories);
            stateFactories[StateKeyType.Home] = (new Home.StateFactoryHome(roomFactory.getLevelSummaries())).create();
            stateFactories[StateKeyType.LevelPlay] = (new Level.StateFactoryLevel(loadingResult.images, sounds, roomFactory.create())).create();
            stateFactory = new DelegatingStateFactory(stateFactories).create();
            state = stateFactory(new StateKey(StateKeyType.Home));
        }
        else if (event.type == StateEventType.PlayLevel && (event.data instanceof StateEventDataLevelPlay)) {
            // unlock that level
            localStorage.setItem("level-" + event.data.id, "" + true);
            state = stateFactory(new StateKey(StateKeyType.LevelPlay, new StateKeyDataLevelPlay(event.data.id)));
        }
        else if (event.type == StateEventType.GoHome) {
            state = stateFactory(new StateKey(StateKeyType.Home));
        }
        else {
            state = null;
        }
        if (state != null) {
            setState(state);
        }
    };
    var setState = function (state) {
        if (currentState != null) {
            currentState.stop();
        }
        currentState = state;
        if (state != null) {
            state.start(eventHandler);
        }
    };
    setState(stateLoading);
};
var Level;
(function (Level) {
    var Description;
    (function (Description) {
        var BaseEntity = (function () {
            function BaseEntity(id, entityType, color) {
                this.id = id;
                this.entityType = entityType;
                this.color = color;
            }
            BaseEntity.prototype.getColor = function () {
                return this.color;
            };
            BaseEntity.prototype.recolor = function (room, color) {
                if (color != this.getColor()) {
                    this.color = color;
                    return new Description.Delta(this, Description.DeltaType.Recolor, new Description.DeltaDataRecolor(color));
                }
                else {
                    return new Description.Delta(this, Description.DeltaType.DoNothing);
                }
            };
            return BaseEntity;
        }());
        Description.BaseEntity = BaseEntity;
    })(Description = Level.Description || (Level.Description = {}));
})(Level || (Level = {}));
/// <reference path="BaseEntity.ts" />
var Level;
(function (Level) {
    var Description;
    (function (Description) {
        var BaseMonster = (function (_super) {
            __extends(BaseMonster, _super);
            function BaseMonster(id, color, monsterType, tileX, tileY) {
                var _this = _super.call(this, id, Description.EntityType.MONSTER, color) || this;
                _this.monsterType = monsterType;
                _this.tileX = tileX;
                _this.tileY = tileY;
                _this.sticky = false;
                return _this;
            }
            BaseMonster.prototype.canBeMovedIntoBy = function (room, mover, moverColor, direction) {
                // is the next tile over empty or contain a thing that can be pushed?
                var myColor;
                if (this.sticky) {
                    myColor = this.getColor();
                }
                else {
                    myColor = this.getColor().intersection(moverColor);
                }
                var canMove = this.canMove(room, myColor, direction);
                var canSquish = this.canBeSquishedBy(room, mover, myColor);
                return canMove.union(canSquish);
            };
            BaseMonster.prototype.canMove = function (room, myColor, direction) {
                var wall = room.getWall(this.tileX, this.tileY, direction);
                var canMove;
                if (wall == null) {
                    canMove = myColor;
                }
                else {
                    if (this.sticky && wall.getColor().overlaps(myColor)) {
                        // can't move
                        canMove = Color.BLACK;
                    }
                    else {
                        // bits of us can move...
                        canMove = myColor.exclude(wall.getColor());
                    }
                }
                if (!canMove.isBlack()) {
                    // can we move onto the next tile
                    var tile = room.getTile(this.tileX, this.tileY, direction);
                    if (tile != null) {
                        var monsters = tile.monsters;
                        for (var _i = 0, monsters_1 = monsters; _i < monsters_1.length; _i++) {
                            var monster = monsters_1[_i];
                            if (monster.getColor().overlaps(canMove)) {
                                var canKill = monster.canBeKilledBy(room, this, canMove);
                                var canDie = this.canReallyBeKilledBy(canMove, room, monster, monster.getColor());
                                var canPush = monster.canBeMovedIntoBy(room, this, canMove, direction);
                                // are there colours we can't push?
                                var cantPush = monster.getColor().exclude(canPush);
                                canPush = canMove.exclude(cantPush);
                                var canMerge = this.canMergeInto(canMove, room, monster);
                                var canSplit = this.canSplitOnto(canMove, room, monster);
                                var canDisplaceEntity = canKill.union(canDie).union(canMerge).union(canPush).union(canSplit);
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
            };
            BaseMonster.prototype.move = function (room, direction) {
                var canMove = this.canMove(room, this.getColor(), direction);
                var result = [];
                if (!canMove.isBlack()) {
                    // move
                    var intersection = canMove.intersection(this.getColor());
                    var remainder = this.getColor().exclude(intersection);
                    if (!remainder.isBlack()) {
                        // create a duplicate
                        result.push(this.duplicate(room, remainder));
                        // reduce our number of colours
                        result.push(this.recolor(room, intersection));
                    }
                    var successfulMove = this.moveToTile(room, direction);
                    result.push(successfulMove);
                }
                else {
                    result.push(this.moveFailed(room, direction));
                }
                return result;
            };
            BaseMonster.prototype.canSplitOnto = function (myColor, room, onto) {
                if (this.sticky) {
                    // we can't split!
                    return Color.BLACK;
                }
                else {
                    return myColor.exclude(onto.getColor());
                }
            };
            BaseMonster.prototype.canMergeInto = function (myColor, room, into) {
                var result;
                if (this.monsterType == into.monsterType) {
                    if (this.sticky && into.sticky) {
                        if (into.getColor().overlaps(myColor)) {
                            result = Color.BLACK;
                        }
                        else {
                            result = myColor;
                        }
                    }
                    else {
                        result = myColor.exclude(into.getColor());
                    }
                }
                else {
                    result = Color.BLACK;
                }
                return result;
            };
            BaseMonster.prototype.beMovedIntoBy = function (room, mover, direction) {
                var color = this.getColor();
                var deltas = [];
                if (mover.getColor().overlaps(color)) {
                    var movableColor = void 0;
                    if (!this.sticky) {
                        movableColor = color.intersection(mover.getColor());
                    }
                    else {
                        movableColor = color;
                    }
                    var moveColor = this.canMove(room, movableColor, direction);
                    var excludedColors = color.exclude(moveColor);
                    if (!excludedColors.isBlack()) {
                        var survivingColors = excludedColors.exclude(mover.getColor());
                        if (moveColor.isBlack() || this.sticky) {
                            // or die entirely
                            deltas.push(this.die(room, this.monsterType != mover.monsterType));
                        }
                        else {
                            // kill off our colours
                            var colorDelta = this.recolor(room, moveColor);
                            deltas.push(colorDelta);
                        }
                        if (!survivingColors.isBlack()) {
                            deltas.push(this.duplicate(room, survivingColors));
                        }
                    }
                    if (!moveColor.isBlack()) {
                        var moveDeltas = this.move(room, direction);
                        deltas.push.apply(deltas, moveDeltas);
                    }
                }
                return deltas;
            };
            BaseMonster.prototype.canBeSquishedBy = function (room, squisher, squisherColor) {
                return this.canReallyBeSquishedBy(this.getColor(), room, squisher, squisherColor);
            };
            BaseMonster.prototype.canReallyBeSquishedBy = function (myColor, room, squisher, squisherColor) {
                if (squisher.monsterType == Description.MonsterType.Boulder) {
                    if (this.sticky && squisherColor.overlaps(this.getColor())) {
                        return this.getColor();
                    }
                    else {
                        return this.getColor().intersection(squisherColor);
                    }
                }
                else {
                    return Color.BLACK;
                }
            };
            BaseMonster.prototype.canBeKilledBy = function (room, killer, killerColor) {
                return this.canReallyBeKilledBy(this.getColor(), room, killer, killerColor);
            };
            BaseMonster.prototype.canReallyBeKilledBy = function (myColor, room, killer, killerColor) {
                return Color.BLACK;
            };
            BaseMonster.prototype.moveFailed = function (room, direction) {
                return new Description.Delta(this, Description.DeltaType.MoveFail);
            };
            BaseMonster.prototype.moveToTile = function (room, direction) {
                var moveToWallDelta = new Description.Delta(this, Description.DeltaType.MoveToWall, new Description.DeltaDataMoveToWall(this.tileX, this.tileY, direction, Description.DeltaDataMoveType.Walk));
                moveToWallDelta.addChild(room.removeMonster(this));
                var wall = room.getWall(this.tileX, this.tileY, direction);
                var alive;
                if (wall != null) {
                    var wallCrossing = wall.cross(room, this);
                    alive = !wallCrossing.lethal;
                    moveToWallDelta.addChildren(wallCrossing.daltas);
                }
                else {
                    alive = true;
                }
                if (alive) {
                    this.tileX += direction.dx;
                    this.tileY += direction.dy;
                    var tile = room.getTile(this.tileX, this.tileY);
                    var monsters = tile.monsters;
                    var moveToTileDelta = new Description.Delta(this, Description.DeltaType.MoveToTile, new Description.DeltaDataMoveToTile(this.tileX, this.tileY, direction, Description.DeltaDataMoveType.Walk));
                    moveToWallDelta.addChild(moveToTileDelta);
                    var remainingColor = this.color;
                    // check for our death
                    for (var i = monsters.length; i > 0;) {
                        i--;
                        var monster = monsters[i];
                        var killedColor = this.canReallyBeKilledBy(remainingColor, room, monster, monster.getColor());
                        if (!killedColor.isBlack()) {
                            // kill that color
                            remainingColor = remainingColor.exclude(killedColor);
                        }
                    }
                    // otherwhise notify of moves
                    if (!remainingColor.isBlack()) {
                        moveToTileDelta.addChild(this.recolor(room, remainingColor));
                        for (var i = monsters.length; i > 0;) {
                            i--;
                            var monster = monsters[i];
                            if (monster != this) {
                                var monsterDeltas = monster.beMovedIntoBy(room, this, direction);
                                moveToTileDelta.addChildren(monsterDeltas);
                            }
                        }
                        // merge colors
                        moveToTileDelta.addChildren(this.mergeColors(room));
                        moveToTileDelta.addChild(room.addMonster(this));
                    }
                    else {
                        // we died!
                        moveToTileDelta.addChild(this.die(room, true));
                    }
                }
                return moveToWallDelta;
            };
            BaseMonster.prototype.mergeColors = function (room) {
                var monsters = room.getTile(this.tileX, this.tileY).monsters;
                var deltas = [];
                for (var i = monsters.length; i > 0;) {
                    i--;
                    var monster = monsters[i];
                    if (this.monsterType == monster.monsterType) {
                        // merge
                        var color = this.getColor().union(monster.getColor());
                        this.sticky = this.sticky && monster.sticky;
                        deltas.push(this.kill(room, monster, false));
                        deltas.push(this.recolor(room, color));
                    }
                }
                return deltas;
            };
            BaseMonster.prototype.duplicate = function (room, color) {
                var duplicate = this.copySelf(room, color);
                if (duplicate != null) {
                    duplicate.sticky = this.sticky;
                    var result = new Description.Delta(duplicate, Description.DeltaType.MonsterAdded);
                    result.addChild(room.addMonster(duplicate));
                    return result;
                }
                else {
                    return new Description.Delta(this, Description.DeltaType.DoNothing);
                }
            };
            BaseMonster.prototype.die = function (room, violent) {
                return this.kill(room, this, violent);
            };
            BaseMonster.prototype.kill = function (room, monster, violent) {
                var result = new Description.Delta(monster, Description.DeltaType.MonsterRemoved, new Description.DeltaDataMonsterRemove(violent));
                result.addChild(room.removeMonster(monster));
                return result;
            };
            BaseMonster.prototype.recolor = function (room, color) {
                var tile = room.getTile(this.tileX, this.tileY);
                var wasComplete = tile.isComplete();
                var result = _super.prototype.recolor.call(this, room, color);
                var isComplete = tile.isComplete();
                if (wasComplete != isComplete) {
                    if (isComplete) {
                        result.addChild(new Description.Delta(tile, Description.DeltaType.TileActivate));
                    }
                    else {
                        result.addChild(new Description.Delta(tile, Description.DeltaType.TileDeactivate));
                    }
                }
                return result;
            };
            BaseMonster.prototype.copySelf = function (room, color) {
                return null;
            };
            return BaseMonster;
        }(Description.BaseEntity));
        Description.BaseMonster = BaseMonster;
    })(Description = Level.Description || (Level.Description = {}));
})(Level || (Level = {}));
var Level;
(function (Level) {
    var Description;
    (function (Description) {
        var DelegatableRoomFactory = (function () {
            function DelegatableRoomFactory(levelSummary, roomFactory) {
                this.levelSummary = levelSummary;
                this.roomFactory = roomFactory;
            }
            return DelegatableRoomFactory;
        }());
        Description.DelegatableRoomFactory = DelegatableRoomFactory;
        var DelegatingRoomFactory = (function () {
            function DelegatingRoomFactory(roomFactories) {
                this.roomFactories = roomFactories;
            }
            DelegatingRoomFactory.prototype.getLevelSummaries = function () {
                var levelSummaries = [];
                for (var _i = 0, _a = this.roomFactories; _i < _a.length; _i++) {
                    var roomFactory = _a[_i];
                    levelSummaries.push(roomFactory.levelSummary);
                }
                return levelSummaries;
            };
            DelegatingRoomFactory.prototype.create = function () {
                var _this = this;
                return function (levelId) {
                    return _this.roomFactories[levelId % _this.roomFactories.length].roomFactory(levelId);
                };
            };
            return DelegatingRoomFactory;
        }());
        Description.DelegatingRoomFactory = DelegatingRoomFactory;
    })(Description = Level.Description || (Level.Description = {}));
})(Level || (Level = {}));
var Level;
(function (Level) {
    var Description;
    (function (Description) {
        var DeltaType;
        (function (DeltaType) {
            DeltaType[DeltaType["MoveToTile"] = 0] = "MoveToTile";
            DeltaType[DeltaType["MoveToWall"] = 1] = "MoveToWall";
            DeltaType[DeltaType["MoveFail"] = 2] = "MoveFail";
            DeltaType[DeltaType["Recolor"] = 3] = "Recolor";
            DeltaType[DeltaType["MonsterAdded"] = 4] = "MonsterAdded";
            DeltaType[DeltaType["MonsterRemoved"] = 5] = "MonsterRemoved";
            DeltaType[DeltaType["DoNothing"] = 6] = "DoNothing";
            DeltaType[DeltaType["LevelComplete"] = 7] = "LevelComplete";
            DeltaType[DeltaType["TileActivate"] = 8] = "TileActivate";
            DeltaType[DeltaType["TileDeactivate"] = 9] = "TileDeactivate";
        })(DeltaType = Description.DeltaType || (Description.DeltaType = {}));
        var Delta = (function () {
            function Delta(entity, type, data) {
                this.entity = entity;
                this.type = type;
                this.data = data;
                this.children = [];
            }
            Delta.prototype.addChild = function (delta) {
                this.children.push(delta);
                return this;
            };
            Delta.prototype.addChildren = function (deltas) {
                this.children.push.apply(this.children, deltas);
                return this;
            };
            return Delta;
        }());
        Description.Delta = Delta;
        var DeltaDataMoveType;
        (function (DeltaDataMoveType) {
            DeltaDataMoveType[DeltaDataMoveType["Walk"] = 0] = "Walk";
            DeltaDataMoveType[DeltaDataMoveType["Push"] = 1] = "Push";
        })(DeltaDataMoveType = Description.DeltaDataMoveType || (Description.DeltaDataMoveType = {}));
        var DeltaDataMoveToWall = (function () {
            function DeltaDataMoveToWall(fromTileX, fromTileY, direction, moveType) {
                this.fromTileX = fromTileX;
                this.fromTileY = fromTileY;
                this.direction = direction;
                this.moveType = moveType;
            }
            return DeltaDataMoveToWall;
        }());
        Description.DeltaDataMoveToWall = DeltaDataMoveToWall;
        var DeltaDataMoveToTile = (function () {
            function DeltaDataMoveToTile(toTileX, toTileY, direction, moveType) {
                this.toTileX = toTileX;
                this.toTileY = toTileY;
                this.direction = direction;
                this.moveType = moveType;
            }
            return DeltaDataMoveToTile;
        }());
        Description.DeltaDataMoveToTile = DeltaDataMoveToTile;
        var DeltaDataMoveFail = (function () {
            function DeltaDataMoveFail(fromTileX, fromTileY, direction, moveType) {
                this.fromTileX = fromTileX;
                this.fromTileY = fromTileY;
                this.direction = direction;
                this.moveType = moveType;
            }
            return DeltaDataMoveFail;
        }());
        Description.DeltaDataMoveFail = DeltaDataMoveFail;
        var DeltaDataRecolor = (function () {
            function DeltaDataRecolor(toColor) {
                this.toColor = toColor;
            }
            return DeltaDataRecolor;
        }());
        Description.DeltaDataRecolor = DeltaDataRecolor;
        var DeltaDataMonsterRemove = (function () {
            function DeltaDataMonsterRemove(violent) {
                this.violent = violent;
            }
            return DeltaDataMonsterRemove;
        }());
        Description.DeltaDataMonsterRemove = DeltaDataMonsterRemove;
    })(Description = Level.Description || (Level.Description = {}));
})(Level || (Level = {}));
var Level;
(function (Level) {
    var Description;
    (function (Description) {
        var EmptyRoomFactory = (function () {
            function EmptyRoomFactory(width, height) {
                this.width = width;
                this.height = height;
            }
            EmptyRoomFactory.prototype.create = function () {
                var _this = this;
                return function () {
                    var room = new Description.Room(_this.width, _this.height, null);
                    // fill out walls
                    for (var x = 0; x < _this.width; x++) {
                        var topWall = void 0;
                        if (x == 3) {
                            topWall = new Description.WallExit(room.nextId(), Color.BLACK, x, 0);
                        }
                        else {
                            topWall = new Description.WallSolid(room.nextId(), Color.WHITE, x, 0, Description.WallOrientation.HORIZONTAL);
                        }
                        room.setWall(topWall);
                        var bottomWall = new Description.WallSolid(room.nextId(), Color.WHITE, x, _this.height, Description.WallOrientation.HORIZONTAL);
                        room.setWall(bottomWall);
                        if (x < _this.width - 1) {
                            var midWall = new Description.WallSolid(room.nextId(), Color.GREEN, x, Math.floor(_this.height / 2), Description.WallOrientation.HORIZONTAL);
                            room.setWall(midWall);
                        }
                    }
                    for (var y = 0; y < _this.height; y++) {
                        var leftWall = new Description.WallSolid(room.nextId(), Color.WHITE, 0, y, Description.WallOrientation.VERTICAL);
                        room.setWall(leftWall);
                        var rightWall = new Description.WallSolid(room.nextId(), Color.WHITE, _this.width, y, Description.WallOrientation.VERTICAL);
                        room.setWall(rightWall);
                        if (y < _this.height - 1) {
                            var midWall = new Description.WallSolid(room.nextId(), Color.YELLOW, Math.floor(_this.width / 2), y, Description.WallOrientation.VERTICAL);
                            room.setWall(midWall);
                        }
                    }
                    var player1 = new Description.MonsterPlayer(room.nextId(), Color.WHITE, 0, 0);
                    player1.sticky = false;
                    room.addMonster(player1);
                    var dragon = new Description.MonsterDragon(room.nextId(), Color.RED, 4, 4);
                    room.addMonster(dragon);
                    return room;
                };
            };
            return EmptyRoomFactory;
        }());
        Description.EmptyRoomFactory = EmptyRoomFactory;
    })(Description = Level.Description || (Level.Description = {}));
})(Level || (Level = {}));
var Level;
(function (Level) {
    var Description;
    (function (Description) {
        var EntityType;
        (function (EntityType) {
            EntityType[EntityType["WALL"] = 0] = "WALL";
            EntityType[EntityType["MONSTER"] = 1] = "MONSTER";
            EntityType[EntityType["TILE"] = 2] = "TILE";
        })(EntityType = Description.EntityType || (Description.EntityType = {}));
    })(Description = Level.Description || (Level.Description = {}));
})(Level || (Level = {}));
var Level;
(function (Level) {
    var Description;
    (function (Description) {
        var MonsterType;
        (function (MonsterType) {
            MonsterType[MonsterType["Player"] = 0] = "Player";
            MonsterType[MonsterType["Dragon"] = 1] = "Dragon";
            MonsterType[MonsterType["Boulder"] = 2] = "Boulder";
        })(MonsterType = Description.MonsterType || (Description.MonsterType = {}));
    })(Description = Level.Description || (Level.Description = {}));
})(Level || (Level = {}));
///<reference path="BaseMonster.ts"/>
var Level;
(function (Level) {
    var Description;
    (function (Description) {
        var MonsterBoulder = (function (_super) {
            __extends(MonsterBoulder, _super);
            function MonsterBoulder(id, color, tileX, tileY) {
                return _super.call(this, id, color, Description.MonsterType.Boulder, tileX, tileY) || this;
            }
            MonsterBoulder.prototype.canBeSquishedBy = function (room, squisher, squisherColor) {
                return Color.BLACK;
            };
            MonsterBoulder.prototype.copySelf = function (room, color) {
                return new MonsterBoulder(room.nextId(), color, this.tileX, this.tileY);
            };
            return MonsterBoulder;
        }(Description.BaseMonster));
        Description.MonsterBoulder = MonsterBoulder;
    })(Description = Level.Description || (Level.Description = {}));
})(Level || (Level = {}));
var Level;
(function (Level) {
    var Description;
    (function (Description) {
        var MonsterDragon = (function (_super) {
            __extends(MonsterDragon, _super);
            function MonsterDragon(id, color, tileX, tileY) {
                return _super.call(this, id, color, Description.MonsterType.Dragon, tileX, tileY) || this;
            }
            return MonsterDragon;
        }(Description.BaseMonster));
        Description.MonsterDragon = MonsterDragon;
    })(Description = Level.Description || (Level.Description = {}));
})(Level || (Level = {}));
/// <reference path="BaseMonster.ts" />
var Level;
(function (Level) {
    var Description;
    (function (Description) {
        var MonsterPlayer = (function (_super) {
            __extends(MonsterPlayer, _super);
            function MonsterPlayer(id, color, tileX, tileY) {
                return _super.call(this, id, color, Description.MonsterType.Player, tileX, tileY) || this;
            }
            MonsterPlayer.prototype.copySelf = function (room, color) {
                return new MonsterPlayer(room.nextId(), color, this.tileX, this.tileY);
            };
            MonsterPlayer.prototype.canReallyBeKilledBy = function (myColor, room, killer, killerColor) {
                if (killer.monsterType == Description.MonsterType.Dragon) {
                    if (this.sticky && myColor.overlaps(killerColor)) {
                        return myColor;
                    }
                    else {
                        return myColor.intersection(killerColor);
                    }
                }
                else {
                    return Color.BLACK;
                }
            };
            return MonsterPlayer;
        }(Description.BaseMonster));
        Description.MonsterPlayer = MonsterPlayer;
    })(Description = Level.Description || (Level.Description = {}));
})(Level || (Level = {}));
var Level;
(function (Level) {
    var Description;
    (function (Description) {
        var Room = (function () {
            function Room(width, height, helpText) {
                this.width = width;
                this.height = height;
                this.helpText = helpText;
                this.nextEntityId = 0;
                this.tiles = [];
                for (var x = 0; x < width; x++) {
                    var tilesX = [];
                    for (var y = 0; y < height; y++) {
                        var tile = new Level.Description.Tile(this.nextId(), Color.BLACK, x, y);
                        tilesX.push(tile);
                    }
                    this.tiles.push(tilesX);
                }
                this.verticalWalls = [];
                for (var x = 0; x < width + 1; x++) {
                    var verticalWallsX = [];
                    for (var y = 0; y < height; y++) {
                        verticalWallsX.push(null);
                    }
                    this.verticalWalls.push(verticalWallsX);
                }
                this.horizontalWalls = [];
                for (var x = 0; x < width; x++) {
                    var horizontalWallsX = [];
                    for (var y = 0; y < height + 1; y++) {
                        horizontalWallsX.push(null);
                    }
                    this.horizontalWalls.push(horizontalWallsX);
                }
            }
            Room.prototype.getWall = function (tileX, tileY, direction) {
                var wall;
                if (direction.isVertical()) {
                    wall = this.horizontalWalls[tileX][tileY + Math.max(0, direction.dy)];
                }
                else {
                    wall = this.verticalWalls[tileX + Math.max(0, direction.dx)][tileY];
                }
                return wall;
            };
            Room.prototype.getTile = function (tileX, tileY, direction) {
                var dx;
                var dy;
                if (direction != null) {
                    dx = direction.dx;
                    dy = direction.dy;
                }
                else {
                    dx = 0;
                    dy = 0;
                }
                var x = tileX + dx;
                var y = tileY + dy;
                var tile;
                if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
                    tile = this.tiles[x][y];
                }
                else {
                    tile = null;
                }
                return tile;
            };
            Room.prototype.removeMonster = function (monster) {
                var tile = this.tiles[monster.tileX][monster.tileY];
                var index = tile.monsters.indexOf(monster);
                if (index >= 0) {
                    var wasComplete = tile.isComplete();
                    tile.monsters.splice(index, 1);
                    var isComplete = tile.isComplete();
                    if (wasComplete && !isComplete) {
                        return new Description.Delta(tile, Description.DeltaType.TileDeactivate);
                    }
                }
                return new Description.Delta(tile, Description.DeltaType.DoNothing);
            };
            Room.prototype.addMonster = function (monster) {
                var tile = this.tiles[monster.tileX][monster.tileY];
                var wasComplete = tile.isComplete();
                tile.monsters.push(monster);
                var isComplete = tile.isComplete();
                if (!wasComplete && isComplete) {
                    return new Description.Delta(tile, Description.DeltaType.TileActivate);
                }
                return new Description.Delta(tile, Description.DeltaType.DoNothing);
            };
            Room.prototype.setWall = function (wall) {
                if (wall.orientation == Description.WallOrientation.VERTICAL) {
                    this.verticalWalls[wall.x][wall.y] = wall;
                }
                else {
                    this.horizontalWalls[wall.x][wall.y] = wall;
                }
            };
            Room.prototype.getAllMonsters = function () {
                var monsters = [];
                for (var x = 0; x < this.width; x++) {
                    for (var y = 0; y < this.height; y++) {
                        var tile = this.getTile(x, y);
                        var monsters_2 = tile.monsters;
                        for (var _i = 0, monsters_3 = monsters_2; _i < monsters_3.length; _i++) {
                            var monster = monsters_3[_i];
                            monsters_2.push(monster);
                        }
                    }
                }
                return monsters;
            };
            Room.prototype.isComplete = function () {
                var complete = true;
                for (var x = 0; x < this.width; x++) {
                    for (var y = 0; y < this.height; y++) {
                        var tile = this.getTile(x, y);
                        complete = complete && tile.isComplete();
                    }
                }
                return complete;
            };
            Room.prototype.getAllEntites = function () {
                var entities = [];
                for (var x = 0; x < this.width; x++) {
                    for (var y = 0; y < this.height; y++) {
                        var tile = this.getTile(x, y);
                        var monsters = tile.monsters;
                        for (var _i = 0, monsters_4 = monsters; _i < monsters_4.length; _i++) {
                            var monster = monsters_4[_i];
                            entities.push(monster);
                        }
                        entities.push(tile);
                    }
                }
                for (var x = 0; x <= this.width; x++) {
                    for (var y = 0; y < this.height; y++) {
                        var wall = this.verticalWalls[x][y];
                        if (wall != null) {
                            entities.push(wall);
                        }
                    }
                }
                for (var x = 0; x < this.width; x++) {
                    for (var y = 0; y <= this.height; y++) {
                        var wall = this.horizontalWalls[x][y];
                        if (wall != null) {
                            entities.push(wall);
                        }
                    }
                }
                return entities;
            };
            Room.prototype.nextId = function () {
                var id = this.nextEntityId;
                this.nextEntityId++;
                return id;
            };
            Room.prototype.move = function (direction) {
                var deltas = [];
                if (direction.dx != 0 || direction.dy != 0) {
                    // work back in the opposite direction
                    var dx = void 0;
                    var dy = void 0;
                    var x = void 0;
                    if (direction.dx > 0) {
                        x = this.width - 1;
                        dx = -1;
                    }
                    else {
                        x = 0;
                        dx = 1;
                    }
                    while (x >= 0 && x < this.width) {
                        var y = void 0;
                        if (direction.dy > 0) {
                            y = this.height - 1;
                            dy = -1;
                        }
                        else {
                            y = 0;
                            dy = 1;
                        }
                        while (y >= 0 && y < this.height) {
                            var tile = this.getTile(x, y);
                            var monsters = tile.monsters;
                            for (var i = monsters.length; i > 0;) {
                                i--;
                                var monster = monsters[i];
                                if (monster.monsterType == Description.MonsterType.Player) {
                                    var monsterDeltas = monster.move(this, direction);
                                    deltas.push.apply(deltas, monsterDeltas);
                                }
                            }
                            y += dy;
                        }
                        x += dx;
                    }
                }
                return deltas;
            };
            return Room;
        }());
        Description.Room = Room;
    })(Description = Level.Description || (Level.Description = {}));
})(Level || (Level = {}));
var Level;
(function (Level) {
    var Description;
    (function (Description) {
        var TemplateRoomFactory = (function () {
            function TemplateRoomFactory(template, helpText) {
                this.helpText = helpText;
                var lines = template.split('\n');
                var maxLineLength = 0;
                while (lines.length > 0 && lines[0].trim().length == 0) {
                    lines.splice(0, 1);
                }
                while (lines.length > 0 && lines[lines.length - 1].trim().length == 0) {
                    lines.splice(lines.length - 1, 1);
                }
                for (var i = lines.length; i > 0;) {
                    i--;
                    var line = lines[i];
                    maxLineLength = Math.max(maxLineLength, line.length);
                }
                this.height = Math.floor(lines.length / 2);
                this.width = Math.floor(maxLineLength / 4);
                this.lines = lines;
            }
            TemplateRoomFactory.prototype.create = function () {
                var _this = this;
                return function () {
                    var room = new Description.Room(_this.width, _this.height, _this.helpText);
                    // horizontal walls and tile color
                    var row = 0;
                    while (row < _this.lines.length) {
                        var line = _this.lines[row];
                        var i = 0;
                        var y = Math.floor(row / 2);
                        while (i < line.length) {
                            var x = Math.floor(i / 4);
                            if (y < room.height && x < room.width) {
                                var tileColorChar = line.charAt(i);
                                var tileColor = _this.toColor(tileColorChar);
                                if (tileColor != null) {
                                    room.getTile(x, y).color = tileColor;
                                }
                            }
                            var colorChar = line.charAt(i + 2);
                            var typeChar = line.charAt(i + 3);
                            if (typeChar != null) {
                                var color = _this.toColor(colorChar);
                                if (color != null) {
                                    var wall = _this.toWall(room, typeChar, color, x, y, Description.WallOrientation.HORIZONTAL);
                                    if (wall != null) {
                                        room.setWall(wall);
                                    }
                                }
                            }
                            i += 4;
                        }
                        row += 2;
                    }
                    // vertical walls and monsters
                    row = 1;
                    while (row < _this.lines.length) {
                        var y = Math.floor(row / 2);
                        var line = _this.lines[row];
                        var i = 0;
                        while (i < line.length) {
                            var wallColorChar = line.charAt(i);
                            var wallTypeChar = line.charAt(i + 1);
                            var x = Math.floor(i / 4);
                            if (wallTypeChar != null) {
                                var wallColor = _this.toColor(wallColorChar);
                                if (wallColor != null) {
                                    var wall = _this.toWall(room, wallTypeChar, wallColor, x, y, Description.WallOrientation.VERTICAL);
                                    if (wall != null) {
                                        room.setWall(wall);
                                    }
                                }
                            }
                            if (i + 3 < line.length) {
                                var monsterColorChar = line.charAt(i + 2);
                                var monsterTypeChar = line.charAt(i + 3);
                                if (monsterTypeChar != null) {
                                    var monsterColor = _this.toColor(monsterColorChar);
                                    if (monsterColor != null) {
                                        var monster = _this.toMonster(room, monsterTypeChar, monsterColor, monsterColorChar.toUpperCase() == monsterColorChar, x, y);
                                        if (monster != null) {
                                            room.addMonster(monster);
                                        }
                                    }
                                }
                            }
                            i += 4;
                        }
                        row += 2;
                    }
                    return room;
                };
            };
            TemplateRoomFactory.prototype.toMonster = function (room, typeChar, color, sticky, x, y) {
                var monster;
                switch (typeChar) {
                    case 'P':
                        monster = new Description.MonsterPlayer(room.nextId(), color, x, y);
                        break;
                    case 'D':
                        monster = new Description.MonsterDragon(room.nextId(), color, x, y);
                        break;
                    case 'B':
                        monster = new Description.MonsterBoulder(room.nextId(), color, x, y);
                        break;
                    default:
                        monster = null;
                        break;
                }
                if (monster != null) {
                    monster.sticky = sticky;
                }
                return monster;
            };
            TemplateRoomFactory.prototype.toWall = function (room, typeChar, color, x, y, orientation) {
                switch (typeChar) {
                    case '#':
                        return new Description.WallSolid(room.nextId(), color, x, y, orientation);
                    case 'E':
                        return new Description.WallExit(room.nextId(), color, x, y);
                    default:
                        return null;
                }
            };
            TemplateRoomFactory.prototype.toColor = function (c) {
                switch (c) {
                    case 'R':
                    case 'r':
                        return Color.RED;
                    case 'G':
                    case 'g':
                        return Color.GREEN;
                    case 'B':
                    case 'b':
                        return Color.BLUE;
                    case 'y':
                    case 'Y':
                        return Color.YELLOW;
                    case 'm':
                    case 'M':
                        return Color.MAGENTA;
                    case 'c':
                    case 'C':
                        return Color.CYAN;
                    case 'k':
                    case 'K':
                        return Color.BLACK;
                    case 'w':
                    case 'W':
                        return Color.WHITE;
                    default:
                        return null;
                }
            };
            return TemplateRoomFactory;
        }());
        Description.TemplateRoomFactory = TemplateRoomFactory;
    })(Description = Level.Description || (Level.Description = {}));
})(Level || (Level = {}));
var Level;
(function (Level) {
    var Description;
    (function (Description) {
        var Tile = (function (_super) {
            __extends(Tile, _super);
            function Tile(id, color, tileX, tileY) {
                var _this = _super.call(this, id, Description.EntityType.TILE, color) || this;
                _this.tileX = tileX;
                _this.tileY = tileY;
                _this.monsters = [];
                return _this;
            }
            Tile.prototype.isComplete = function () {
                var color = Color.BLACK;
                if (this.color != null && !this.color.isBlack()) {
                    var monsters = this.monsters;
                    for (var _i = 0, monsters_5 = monsters; _i < monsters_5.length; _i++) {
                        var monster = monsters_5[_i];
                        color = color.union(monster.getColor());
                    }
                }
                return color.contains(this.color);
            };
            return Tile;
        }(Description.BaseEntity));
        Description.Tile = Tile;
    })(Description = Level.Description || (Level.Description = {}));
})(Level || (Level = {}));
var Level;
(function (Level) {
    var Description;
    (function (Description) {
        var WallOrientation;
        (function (WallOrientation) {
            WallOrientation[WallOrientation["VERTICAL"] = 0] = "VERTICAL";
            WallOrientation[WallOrientation["HORIZONTAL"] = 1] = "HORIZONTAL";
        })(WallOrientation = Description.WallOrientation || (Description.WallOrientation = {}));
        var WallCrossing = (function () {
            function WallCrossing(lethal, daltas) {
                this.lethal = lethal;
                this.daltas = daltas;
            }
            return WallCrossing;
        }());
        Description.WallCrossing = WallCrossing;
    })(Description = Level.Description || (Level.Description = {}));
})(Level || (Level = {}));
///<reference path="BaseEntity.ts"/>
var Level;
(function (Level) {
    var Description;
    (function (Description) {
        var WallSolid = (function (_super) {
            __extends(WallSolid, _super);
            function WallSolid(id, color, x, y, orientation) {
                var _this = _super.call(this, id, Description.EntityType.WALL, color) || this;
                _this.x = x;
                _this.y = y;
                _this.orientation = orientation;
                return _this;
            }
            WallSolid.prototype.cross = function (room, crosser) {
                return new Description.WallCrossing(false, []);
            };
            return WallSolid;
        }(Description.BaseEntity));
        Description.WallSolid = WallSolid;
    })(Description = Level.Description || (Level.Description = {}));
})(Level || (Level = {}));
///<reference path="WallSolid.ts"/>
var Level;
(function (Level) {
    var Description;
    (function (Description) {
        var WallExit = (function (_super) {
            __extends(WallExit, _super);
            function WallExit(id, color, x, y) {
                return _super.call(this, id, color, x, y, Description.WallOrientation.HORIZONTAL) || this;
            }
            WallExit.prototype.cross = function (room, crosser) {
                var color = this.color.union(crosser.getColor());
                var delta = this.recolor(room, color);
                if (this.color.isWhite()) {
                    // level complete
                    delta.addChild(new Description.Delta(this, Description.DeltaType.LevelComplete));
                }
                return new Description.WallCrossing(true, [delta]);
            };
            return WallExit;
        }(Description.WallSolid));
        Description.WallExit = WallExit;
    })(Description = Level.Description || (Level.Description = {}));
})(Level || (Level = {}));
var Level;
(function (Level) {
    var LevelSummary = (function () {
        function LevelSummary(id, name) {
            this.id = id;
            this.name = name;
        }
        return LevelSummary;
    }());
    Level.LevelSummary = LevelSummary;
})(Level || (Level = {}));
var Level;
(function (Level) {
    var Render;
    (function (Render) {
        var BaseEntityRender = (function () {
            function BaseEntityRender(entity, container, tileWidth, tileHeight) {
                this.entity = entity;
                this.container = container;
                this.tileWidth = tileWidth;
                this.tileHeight = tileHeight;
            }
            BaseEntityRender.prototype.setAmbientAnimation = function (ambientAnimation) {
                if (this.ambientAnimation != ambientAnimation) {
                    if (this.ambientAnimation != null) {
                        this.ambientAnimation.stop();
                    }
                    this.ambientAnimation = ambientAnimation;
                    if (this.ambientAnimation != null) {
                        this.ambientAnimation.start();
                    }
                }
            };
            BaseEntityRender.prototype.addChild = function (child) {
                this.recalculateZ(child);
                var index = this.getIndex(child);
                this.container.addChildAt(child, index);
            };
            BaseEntityRender.prototype.reorderChild = function (child) {
                this.container.removeChild(child);
                this.addChild(child);
            };
            BaseEntityRender.prototype.getIndex = function (child) {
                var children = this.container.children;
                var childZ = this.getZ(child);
                for (var i = 0; i < children.length; i++) {
                    var compare = children[i];
                    var z = this.getZ(compare);
                    if (z > childZ) {
                        return i;
                    }
                }
                return children.length;
                /*
                let min = 0;
                let max = children.length - 1;
                while (min < max) {
                    let mid = Math.floor((min + max) / 2);
                    let midValue = children[mid];
                    let midZ = this.getZ(midValue);
                    if (midZ < childZ) {
                        min = mid+1;
                    } else {
                        max = mid;
                    }
                }
                return min;
                */
            };
            BaseEntityRender.prototype.recalculateZ = function (child) {
                var z = this.calculateZ(child);
                child.z = z;
            };
            BaseEntityRender.prototype.calculateZ = function (child) {
                var z = child.y;
                var height = child.height;
                var anchor = child.anchor;
                if (anchor != null && anchor.y != null && height != null) {
                    z += (1 - anchor.y) * height;
                }
                return z;
            };
            BaseEntityRender.prototype.getZ = function (child) {
                var z = child.z;
                if (z == null) {
                    z = 0;
                }
                return z;
            };
            return BaseEntityRender;
        }());
        Render.BaseEntityRender = BaseEntityRender;
    })(Render = Level.Render || (Level.Render = {}));
})(Level || (Level = {}));
var Level;
(function (Level) {
    var Render;
    (function (Render) {
        var CompositeAnimation = (function () {
            function CompositeAnimation(animations) {
                this.animations = animations;
            }
            CompositeAnimation.prototype.onComplete = function (callback) {
                var _this = this;
                if (this.animations.length == 0) {
                    callback();
                }
                else {
                    var count_1 = 0;
                    for (var _i = 0, _a = this.animations; _i < _a.length; _i++) {
                        var animation = _a[_i];
                        animation.onComplete(function () {
                            count_1++;
                            if (count_1 == _this.animations.length) {
                                callback();
                            }
                        });
                    }
                }
            };
            CompositeAnimation.prototype.start = function () {
                for (var _i = 0, _a = this.animations; _i < _a.length; _i++) {
                    var animation = _a[_i];
                    animation.start();
                }
            };
            CompositeAnimation.prototype.stop = function () {
                for (var _i = 0, _a = this.animations; _i < _a.length; _i++) {
                    var animation = _a[_i];
                    animation.stop();
                }
            };
            CompositeAnimation.prototype.finish = function () {
                for (var _i = 0, _a = this.animations; _i < _a.length; _i++) {
                    var animation = _a[_i];
                    animation.finish();
                }
            };
            return CompositeAnimation;
        }());
        Render.CompositeAnimation = CompositeAnimation;
    })(Render = Level.Render || (Level.Render = {}));
})(Level || (Level = {}));
var Level;
(function (Level) {
    var Render;
    (function (Render) {
        var EmptyAnimation = (function () {
            function EmptyAnimation() {
            }
            EmptyAnimation.prototype.finish = function () {
                // done!
            };
            EmptyAnimation.prototype.start = function () {
            };
            EmptyAnimation.prototype.stop = function () {
            };
            EmptyAnimation.prototype.onComplete = function (callback) {
                callback();
            };
            return EmptyAnimation;
        }());
        Render.EmptyAnimation = EmptyAnimation;
    })(Render = Level.Render || (Level.Render = {}));
})(Level || (Level = {}));
/// <reference path="BaseEntityRender.ts" />
var Level;
(function (Level) {
    var Render;
    (function (Render) {
        var MonsterPixiEntityRender = (function (_super) {
            __extends(MonsterPixiEntityRender, _super);
            function MonsterPixiEntityRender(images, entity, container, tileWidth, tileHeight, splitSound, moveSound, deathSound) {
                var _this = _super.call(this, entity, container, tileWidth, tileHeight) || this;
                _this.images = images;
                _this.splitSound = splitSound;
                _this.moveSound = moveSound;
                _this.deathSound = deathSound;
                return _this;
            }
            MonsterPixiEntityRender.prototype.attach = function () {
                var image = this.images[this.entity.getColor().id];
                this.sprite = new PIXI.Sprite(PIXI.Texture.fromCanvas(image));
                this.sprite.anchor.x = 0.5;
                this.sprite.blendMode = PIXI.BLEND_MODES.ADD;
                var x = this.entity.tileX * this.tileWidth + this.tileWidth / 2;
                var y = this.entity.tileY * this.tileHeight + this.tileHeight / 2;
                if (this.entity.monsterType == Level.Description.MonsterType.Boulder) {
                    this.sprite.anchor.y = 0.5;
                    y -= this.sprite.height / 2;
                }
                else {
                    this.sprite.anchor.y = 1;
                }
                this.sprite.x = x;
                this.sprite.y = y;
                this.addChild(this.sprite);
                var animations = [];
                if (this.entity.monsterType != Level.Description.MonsterType.Boulder) {
                    animations.push(new Render.RepeatingTweenAnimation(this.sprite, { rotation: -Math.PI / 20 }, { rotation: Math.PI / 20 }, 600));
                }
                if (!this.entity.sticky) {
                    animations.push(new Render.RepeatingTweenAnimation(this.sprite, { alpha: 0.5 }, { alpha: 1 }, 100));
                }
                if (animations.length > 0) {
                    this.setAmbientAnimation(new Render.CompositeAnimation(animations));
                }
            };
            MonsterPixiEntityRender.prototype.detach = function () {
                this.container.removeChild(this.sprite);
                this.setAmbientAnimation(null);
            };
            MonsterPixiEntityRender.prototype.applyDelta = function (delta) {
                var _this = this;
                if (delta.type == Level.Description.DeltaType.MoveToWall && delta.data instanceof Level.Description.DeltaDataMoveToWall) {
                    var data = delta.data;
                    var animations = [];
                    if (this.entity.monsterType == Level.Description.MonsterType.Player) {
                        var toX = data.fromTileX * this.tileWidth + this.tileWidth / 2 + data.direction.dx * this.tileWidth / 2;
                        var toY = data.fromTileY * this.tileHeight + this.tileHeight / 2 + data.direction.dy * this.tileHeight / 2 - this.tileHeight / 4;
                        animations.push(new Render.TweenAnimation(this.sprite, { x: toX, y: toY }, 100, function () { _this.reorderChild(_this.sprite); }, TWEEN.Easing.Quadratic.In));
                        // play a bit of audio
                        this.moveSound();
                    }
                    else {
                        var toX = data.fromTileX * this.tileWidth + this.tileWidth / 2 + data.direction.dx * this.tileWidth / 2;
                        var toY = data.fromTileY * this.tileHeight + this.tileHeight / 2 + data.direction.dy * this.tileHeight / 2;
                        var to = { x: toX, y: toY };
                        if (this.entity.monsterType == Level.Description.MonsterType.Boulder) {
                            to.y -= this.sprite.height / 2;
                            if (data.direction == Direction.WEST) {
                                to.rotation = -Math.PI;
                            }
                            else {
                                to.rotation = Math.PI;
                            }
                            this.sprite.rotation = 0;
                        }
                        animations.push(new Render.TweenAnimation(this.sprite, to, 200, function () { _this.reorderChild(_this.sprite); }, TWEEN.Easing.Quadratic.In));
                    }
                    return new Render.CompositeAnimation(animations);
                }
                else if (delta.type == Level.Description.DeltaType.MoveToTile && delta.data instanceof Level.Description.DeltaDataMoveToTile) {
                    var data = delta.data;
                    var toX = data.toTileX * this.tileWidth + this.tileWidth / 2;
                    var toY = data.toTileY * this.tileHeight + this.tileHeight / 2;
                    var to = { x: toX, y: toY };
                    if (this.entity.monsterType == Level.Description.MonsterType.Boulder) {
                        to.y -= this.sprite.height / 2;
                        if (data.direction == Direction.WEST) {
                            to.rotation = -Math.PI * 2;
                        }
                        else {
                            to.rotation = Math.PI * 2;
                        }
                    }
                    return new Render.TweenAnimation(this.sprite, to, 200, function () { _this.reorderChild(_this.sprite); }, TWEEN.Easing.Quadratic.Out);
                }
                else if (delta.type == Level.Description.DeltaType.Recolor && delta.data instanceof Level.Description.DeltaDataRecolor) {
                    var data = delta.data;
                    var image = this.images[data.toColor.id];
                    this.sprite.texture = PIXI.Texture.fromCanvas(image);
                    this.splitSound();
                }
                else if (delta.type == Level.Description.DeltaType.MonsterRemoved) {
                    this.detach();
                    if (delta.data instanceof Level.Description.DeltaDataMonsterRemove) {
                        if (delta.data.violent) {
                            this.deathSound();
                        }
                    }
                }
                else {
                    return new Render.EmptyAnimation();
                }
            };
            return MonsterPixiEntityRender;
        }(Render.BaseEntityRender));
        Render.MonsterPixiEntityRender = MonsterPixiEntityRender;
    })(Render = Level.Render || (Level.Render = {}));
})(Level || (Level = {}));
var Level;
(function (Level) {
    var Render;
    (function (Render) {
        var PixiRenderFactory = (function () {
            function PixiRenderFactory(images, renderer, stage, tileWidth, tileHeight, sounds) {
                this.images = images;
                this.renderer = renderer;
                this.stage = stage;
                this.tileWidth = tileWidth;
                this.tileHeight = tileHeight;
                this.sounds = sounds;
            }
            PixiRenderFactory.prototype.create = function () {
                var _this = this;
                return function (entity) {
                    if (entity.entityType == Level.Description.EntityType.WALL) {
                        var images = void 0;
                        var wall = entity;
                        if (wall.orientation == Level.Description.WallOrientation.VERTICAL) {
                            images = _this.images['wall-vertical'];
                        }
                        else {
                            images = _this.images['wall-horizontal'];
                        }
                        return new Render.WallPixiEntityRender(images, wall, _this.stage, _this.tileWidth, _this.tileHeight);
                    }
                    else if (entity.entityType == Level.Description.EntityType.TILE) {
                        var passiveImages = _this.images['tile'];
                        var activeImages = _this.images['tile-active'];
                        var tile = entity;
                        return new Render.TilePixiEntityRender(activeImages, passiveImages, tile, _this.stage, _this.tileWidth, _this.tileHeight, _this.sounds['activate'], _this.sounds['deactivate']);
                    }
                    else if (entity.entityType == Level.Description.EntityType.MONSTER) {
                        var images = void 0;
                        var monster = entity;
                        if (monster.monsterType == Level.Description.MonsterType.Player) {
                            images = _this.images['player'];
                        }
                        else if (monster.monsterType == Level.Description.MonsterType.Dragon) {
                            images = _this.images['dragon'];
                        }
                        else if (monster.monsterType == Level.Description.MonsterType.Boulder) {
                            images = _this.images['boulder'];
                        }
                        else {
                            images = null;
                        }
                        if (images != null) {
                            return new Render.MonsterPixiEntityRender(images, monster, _this.stage, _this.tileWidth, _this.tileHeight, _this.sounds['split'], _this.sounds['move'], _this.sounds['death']);
                        }
                        else {
                            return null;
                        }
                    }
                    else {
                        return null;
                    }
                };
            };
            return PixiRenderFactory;
        }());
        Render.PixiRenderFactory = PixiRenderFactory;
    })(Render = Level.Render || (Level.Render = {}));
})(Level || (Level = {}));
var Level;
(function (Level) {
    var Render;
    (function (Render) {
        var RepeatingTweenAnimation = (function () {
            function RepeatingTweenAnimation(target, from, to, duration) {
                this.target = target;
                this.from = from;
                this.to = to;
                this.duration = duration;
                this.goingTo = true;
            }
            RepeatingTweenAnimation.prototype.finish = function () {
                if (this.tween != null) {
                    this.tween.stop();
                }
                for (var key in this.from) {
                    this.target[key] = this.from[key];
                }
            };
            RepeatingTweenAnimation.prototype.startNextAnimation = function () {
                var _this = this;
                var to;
                if (this.goingTo) {
                    to = this.to;
                }
                else {
                    to = this.from;
                }
                var f = function () {
                    _this.goingTo = !_this.goingTo;
                    _this.startNextAnimation();
                };
                this.tween = new TWEEN.Tween(this.target).to(to, this.duration).easing(TWEEN.Easing.Quadratic.InOut).onComplete(f).start();
                if (this.timeoutHandle != null) {
                    clearTimeout(this.timeoutHandle);
                }
                // work around bug where tweens stop without feedback
                this.timeoutHandle = setTimeout(f, this.duration + 500);
            };
            RepeatingTweenAnimation.prototype.start = function () {
                //weird bug where repeating animations don't start initially
                if (this.tween == null) {
                    this.startNextAnimation();
                }
                else {
                    this.tween.start();
                }
            };
            RepeatingTweenAnimation.prototype.stop = function () {
                clearTimeout(this.timeoutHandle);
                if (this.tween != null) {
                    this.tween.stop();
                }
            };
            RepeatingTweenAnimation.prototype.onComplete = function (callback) {
                // never compeltes
            };
            return RepeatingTweenAnimation;
        }());
        Render.RepeatingTweenAnimation = RepeatingTweenAnimation;
    })(Render = Level.Render || (Level.Render = {}));
})(Level || (Level = {}));
var Level;
(function (Level) {
    var Render;
    (function (Render) {
        var TilePixiEntityRender = (function (_super) {
            __extends(TilePixiEntityRender, _super);
            function TilePixiEntityRender(activeImages, passiveImages, entity, container, tileWidth, tileHeight, activateSound, deactivateSound) {
                var _this = _super.call(this, entity, container, tileWidth, tileHeight) || this;
                _this.activeImages = activeImages;
                _this.passiveImages = passiveImages;
                _this.activateSound = activateSound;
                _this.deactivateSound = deactivateSound;
                return _this;
            }
            TilePixiEntityRender.prototype.attach = function () {
                var color = this.entity.getColor();
                if (!color.isBlack()) {
                    var image = void 0;
                    if (this.entity.isComplete()) {
                        image = this.activeImages[color.id];
                    }
                    else {
                        image = this.passiveImages[color.id];
                    }
                    this.sprite = new PIXI.Sprite(PIXI.Texture.fromCanvas(image));
                    this.sprite.anchor.x = 0.5;
                    this.sprite.anchor.y = 0.75;
                    var x = this.entity.tileX * this.tileWidth + this.tileWidth / 2;
                    var y = this.entity.tileY * this.tileHeight + this.tileHeight / 2;
                    this.sprite.x = x;
                    this.sprite.y = y;
                    this.addChild(this.sprite);
                }
                else {
                    this.sprite = null;
                }
            };
            TilePixiEntityRender.prototype.detach = function () {
                if (this.sprite != null) {
                    this.container.removeChild(this.sprite);
                    this.setAmbientAnimation(null);
                }
            };
            TilePixiEntityRender.prototype.applyDelta = function (delta) {
                if (delta.type == Level.Description.DeltaType.TileActivate) {
                    var image = this.activeImages[this.entity.getColor().id];
                    this.sprite.texture = PIXI.Texture.fromCanvas(image);
                    this.activateSound();
                }
                else if (delta.type == Level.Description.DeltaType.TileDeactivate) {
                    var image = this.passiveImages[this.entity.getColor().id];
                    this.sprite.texture = PIXI.Texture.fromCanvas(image);
                    this.deactivateSound();
                }
                return new Render.EmptyAnimation();
            };
            TilePixiEntityRender.prototype.calculateZ = function (child) {
                return this.entity.tileY * this.tileHeight - this.tileHeight * 100;
            };
            return TilePixiEntityRender;
        }(Render.BaseEntityRender));
        Render.TilePixiEntityRender = TilePixiEntityRender;
    })(Render = Level.Render || (Level.Render = {}));
})(Level || (Level = {}));
var Level;
(function (Level) {
    var Render;
    (function (Render) {
        var TweenAnimation = (function () {
            function TweenAnimation(target, to, duration, updateCallback, easing) {
                var _this = this;
                this.target = target;
                this.to = to;
                this.duration = duration;
                this.updateCallback = updateCallback;
                this.tween = new TWEEN.Tween(this.target).to(to, this.duration).onComplete(function () {
                    _this.callCallback();
                }).onUpdate(function () {
                    if (_this.updateCallback != null) {
                        _this.updateCallback();
                    }
                });
                if (easing != null) {
                    this.tween.easing(easing);
                }
            }
            TweenAnimation.prototype.callCallback = function () {
                if (this.updateCallback != null) {
                    this.updateCallback();
                    this.updateCallback = null;
                }
                if (this.callback != null) {
                    this.callback();
                    this.callback = null;
                }
                if (this.timeoutHandle != null) {
                    clearTimeout(this.timeoutHandle);
                    this.timeoutHandle = null;
                }
            };
            TweenAnimation.prototype.finish = function () {
                this.tween.stop();
                for (var key in this.to) {
                    this.target[key] = this.to[key];
                }
                this.callCallback();
            };
            TweenAnimation.prototype.start = function () {
                var _this = this;
                this.tween.start();
                // sometimes the tweens don't work!
                this.timeoutHandle = setTimeout(function () {
                    _this.callCallback();
                }, this.duration + 500);
            };
            TweenAnimation.prototype.stop = function () {
                this.tween.stop();
            };
            TweenAnimation.prototype.onComplete = function (callback) {
                this.callback = callback;
            };
            return TweenAnimation;
        }());
        Render.TweenAnimation = TweenAnimation;
    })(Render = Level.Render || (Level.Render = {}));
})(Level || (Level = {}));
/// <reference path="BaseEntityRender.ts" />
var Level;
(function (Level) {
    var Render;
    (function (Render) {
        var WallPixiEntityRender = (function (_super) {
            __extends(WallPixiEntityRender, _super);
            function WallPixiEntityRender(images, entity, container, tileWidth, tileHeight) {
                var _this = _super.call(this, entity, container, tileWidth, tileHeight) || this;
                _this.images = images;
                return _this;
            }
            WallPixiEntityRender.prototype.attach = function () {
                var image = this.images[this.entity.getColor().id];
                this.sprite = new PIXI.Sprite(PIXI.Texture.fromCanvas(image));
                var x;
                var y;
                if (this.entity.orientation == Level.Description.WallOrientation.HORIZONTAL) {
                    x = this.entity.x * this.tileWidth;
                    y = this.entity.y * this.tileHeight;
                }
                else {
                    x = this.entity.x * this.tileWidth - this.sprite.width / 2;
                    y = (this.entity.y + 1) * this.tileHeight;
                }
                this.sprite.anchor.y = 1;
                this.sprite.x = x;
                this.sprite.y = y;
                this.addChild(this.sprite);
            };
            WallPixiEntityRender.prototype.detach = function () {
                this.container.removeChild(this.sprite);
            };
            WallPixiEntityRender.prototype.applyDelta = function (delta) {
                if (delta.type == Level.Description.DeltaType.Recolor && delta.data instanceof Level.Description.DeltaDataRecolor) {
                    var data = delta.data;
                    var image = this.images[data.toColor.id];
                    this.sprite.texture = PIXI.Texture.fromCanvas(image);
                    return new Render.EmptyAnimation();
                }
                else {
                    return new Render.EmptyAnimation();
                }
            };
            return WallPixiEntityRender;
        }(Render.BaseEntityRender));
        Render.WallPixiEntityRender = WallPixiEntityRender;
    })(Render = Level.Render || (Level.Render = {}));
})(Level || (Level = {}));
var Level;
(function (Level) {
    var StateFactoryLevel = (function () {
        function StateFactoryLevel(images, sounds, roomFactory) {
            this.images = images;
            this.sounds = sounds;
            this.roomFactory = roomFactory;
        }
        StateFactoryLevel.prototype.create = function () {
            var _this = this;
            return function (stateKey) {
                if (stateKey.data instanceof StateKeyDataLevelPlay) {
                    var data = stateKey.data;
                    var room = _this.roomFactory(data.levelId);
                    return new Level.StateLevel(_this.images, _this.sounds, room, data.levelId, data.levelId + 1);
                }
                else {
                    return null;
                }
            };
        };
        return StateFactoryLevel;
    }());
    Level.StateFactoryLevel = StateFactoryLevel;
})(Level || (Level = {}));
var Level;
(function (Level) {
    var StateLevel = (function () {
        function StateLevel(images, sounds, room, levelId, nextLevelId) {
            this.images = images;
            this.sounds = sounds;
            this.room = room;
            this.levelId = levelId;
            this.nextLevelId = nextLevelId;
            this.levelElementId = 'level';
            this.canvasElementId = 'level-canvas';
            this.victoryElementId = 'level-victory';
            this.helpElementId = 'level-help';
            this.homeElementId = 'level-home';
            this.restartElementId = 'level-restart';
            this.renders = {};
            this.animations = [];
        }
        StateLevel.prototype.start = function (listener) {
            var _this = this;
            this.listener = listener;
            var levelElement = document.getElementById(this.levelElementId);
            var canvasElement = document.getElementById(this.canvasElementId);
            document.body.setAttribute('class', 'noOverflow');
            levelElement.removeAttribute('class');
            var victoryElement = document.getElementById(this.victoryElementId);
            victoryElement.setAttribute('class', 'hidden');
            var homeElement = document.getElementById(this.homeElementId);
            homeElement.onclick = function () {
                listener(new StateEvent(StateEventType.GoHome));
            };
            var restartElement = document.getElementById(this.restartElementId);
            restartElement.onclick = function () {
                listener(new StateEvent(StateEventType.PlayLevel, new StateEventDataLevelPlay(_this.levelId)));
            };
            var helpElement = document.getElementById(this.helpElementId);
            if (this.room.helpText != null) {
                helpElement.removeAttribute('class');
                helpElement.innerText = this.room.helpText;
            }
            else {
                helpElement.setAttribute('class', 'hidden');
            }
            var tileWidth = 64;
            var tileHeight = 48;
            var roomWidth = this.room.width * tileWidth;
            var roomHeight = this.room.height * tileHeight;
            //let expectedRoomWidth = 8 * tileWidth;
            //let expectedRoomHeight = 8 * tileHeight;
            var expectedRoomWidth = roomWidth + tileWidth;
            var expectedRoomHeight = roomHeight + tileHeight;
            var width = document.body.clientWidth;
            var height = document.body.clientHeight;
            var scale = Math.min(width / expectedRoomWidth, height / expectedRoomHeight);
            if (scale < 1) {
                scale = 0.5;
            }
            else {
                scale = Math.floor(scale);
            }
            var options = {
                view: canvasElement,
                backgroundColor: 0x444444,
                width: width,
                height: height
            };
            this.renderer = PIXI.autoDetectRenderer(options);
            this.stage = new PIXI.Container();
            this.stage.x = ((width - roomWidth * scale) / 2);
            this.stage.y = ((height - roomHeight * scale) / 2);
            this.stage.scale.set(scale);
            this.renderFactory = new Level.Render.PixiRenderFactory(this.images, this.renderer, this.stage, tileWidth, tileHeight, this.sounds).create();
            this.hammer = new Hammer(levelElement);
            this.hammer.get('swipe').set({ direction: Hammer.DIRECTION_ALL });
            this.hammer.on('swipe', function (input) {
                if (input.direction == Hammer.DIRECTION_UP) {
                    _this.move(Direction.NORTH);
                }
                else if (input.direction == Hammer.DIRECTION_DOWN) {
                    _this.move(Direction.SOUTH);
                }
                else if (input.direction == Hammer.DIRECTION_LEFT) {
                    _this.move(Direction.WEST);
                }
                else if (input.direction == Hammer.DIRECTION_RIGHT) {
                    _this.move(Direction.EAST);
                }
            });
            this.hammer.on('tap', function (input) {
                _this.move(Direction.NONE);
            });
            document.onkeydown = function (event) {
                switch (event.keyCode) {
                    // w
                    case 87:
                    //up
                    case 38:
                        _this.move(Direction.NORTH);
                        break;
                    // s
                    case 83:
                    // down
                    case 40:
                        _this.move(Direction.SOUTH);
                        break;
                    // a
                    case 65:
                    // left
                    case 37:
                        _this.move(Direction.WEST);
                        break;
                    // d
                    case 68:
                    // right
                    case 39:
                        _this.move(Direction.EAST);
                        break;
                    default:
                        _this.move(Direction.NONE);
                        break;
                }
            };
            this.running = true;
            var animate = function (time) {
                if (_this.running) {
                    requestAnimationFrame(animate);
                    TWEEN.update(time);
                    _this.renderer.render(_this.stage);
                }
            };
            this.rerender();
            requestAnimationFrame(animate);
        };
        StateLevel.prototype.move = function (direction) {
            var helpElement = document.getElementById(this.helpElementId);
            helpElement.setAttribute('class', 'hidden');
            if (this.won) {
                this.listener(new StateEvent(StateEventType.PlayLevel, new StateEventDataLevelPlay(this.nextLevelId)));
            }
            else {
                // cancel any animations
                this.cancellingAnimations = true;
                for (var i = this.animations.length; i > 0;) {
                    i--;
                    var animation = this.animations[i];
                    animation.finish();
                }
                this.animations = [];
                this.cancellingAnimations = false;
                var deltas = this.room.move(direction);
                for (var _i = 0, deltas_1 = deltas; _i < deltas_1.length; _i++) {
                    var delta = deltas_1[_i];
                    this.render(delta);
                }
                if (this.room.isComplete()) {
                    this.won = true;
                    var victoryElement = document.getElementById(this.victoryElementId);
                    victoryElement.removeAttribute('class');
                }
            }
        };
        StateLevel.prototype.render = function (delta) {
            var _this = this;
            var render = this.renders[delta.entity.id];
            if (render == null) {
                render = this.renderFactory(delta.entity);
                if (render != null) {
                    render.attach();
                    this.renders[delta.entity.id] = render;
                }
            }
            if (render != null) {
                var animation_1 = render.applyDelta(delta);
                if (animation_1 != null) {
                    this.animations.push(animation_1);
                    animation_1.onComplete(function () {
                        var index = _this.animations.indexOf(animation_1);
                        if (index >= 0) {
                            _this.animations.splice(index, 1);
                        }
                        for (var _i = 0, _a = delta.children; _i < _a.length; _i++) {
                            var child = _a[_i];
                            _this.render(child);
                        }
                    });
                    if (this.cancellingAnimations) {
                        animation_1.finish();
                    }
                    else {
                        animation_1.start();
                    }
                }
            }
        };
        StateLevel.prototype.rerender = function () {
            for (var key in this.renders) {
                var render = this.renders[key];
                render.detach();
            }
            TWEEN.removeAll();
            this.renders = {};
            // recreate all the entities
            var entities = this.room.getAllEntites();
            for (var _i = 0, entities_1 = entities; _i < entities_1.length; _i++) {
                var entity = entities_1[_i];
                var render = this.renderFactory(entity);
                if (render != null) {
                    render.attach();
                    this.renders[entity.id] = render;
                }
            }
            this.renderer.render(this.stage);
        };
        StateLevel.prototype.stop = function () {
            this.hammer.destroy();
            this.running = false;
            TWEEN.removeAll();
            document.body.removeAttribute('class');
            var levelElement = document.getElementById(this.levelElementId);
            levelElement.setAttribute('class', 'hidden');
        };
        return StateLevel;
    }());
    Level.StateLevel = StateLevel;
})(Level || (Level = {}));
var Loading;
(function (Loading) {
    var StateLoading = (function () {
        function StateLoading(imagePaths, colors) {
            this.imagePaths = imagePaths;
            this.colors = colors;
            this.loadingElementId = 'loading';
            this.progressElementId = 'loading-progress';
            this.assetsElementId = 'loading-assets';
        }
        StateLoading.prototype.start = function (listener) {
            var loadingElement = document.getElementById(this.loadingElementId);
            loadingElement.removeAttribute('class');
            var progressElement = document.getElementById(this.progressElementId);
            progressElement.innerText = '0%';
            var assetsElement = document.getElementById(this.assetsElementId);
            var colors = this.colors;
            var progress = 0;
            var total = 0;
            var images = {};
            for (var key in this.imagePaths) {
                var path = this.imagePaths[key];
                var image = new Image();
                image.src = path;
                image.onload = (function (key) {
                    return function (e) {
                        progress++;
                        var source = this;
                        var coloredImages = [];
                        // rotate though all the colours
                        for (var _i = 0, colors_1 = colors; _i < colors_1.length; _i++) {
                            var color = colors_1[_i];
                            var coloredImage = document.createElement('canvas');
                            coloredImage.width = source.width;
                            coloredImage.height = source.height;
                            var context = coloredImage.getContext('2d');
                            context.drawImage(source, 0, 0);
                            var imageData = context.getImageData(0, 0, coloredImage.width, coloredImage.height);
                            var pixelArray = imageData.data;
                            var length = pixelArray.length / 4; // 4 components - red, green, blue and alpha
                            for (var i = 0; i < length; i++) {
                                var index = 4 * i;
                                var r = pixelArray[index];
                                var g = pixelArray[++index];
                                var b = pixelArray[++index];
                                var a = pixelArray[++index];
                                if (r || g || b) {
                                    var i_1 = Math.max(r, g, b);
                                    if (color.hasBlue()) {
                                        pixelArray[--index] = i_1;
                                    }
                                    else {
                                        pixelArray[--index] = 0;
                                    }
                                    if (color.hasGreen()) {
                                        pixelArray[--index] = i_1;
                                    }
                                    else {
                                        pixelArray[--index] = 0;
                                    }
                                    if (color.hasRed()) {
                                        pixelArray[--index] = i_1;
                                    }
                                    else {
                                        pixelArray[--index] = 0;
                                    }
                                }
                            }
                            context.putImageData(imageData, 0, 0);
                            coloredImages.push(coloredImage);
                        }
                        images[key] = coloredImages;
                        progressElement.innerText = '' + Math.round((progress * 100) / total) + '%';
                        if (progress == total) {
                            var data = new StateEventDataLoadingComplete(images);
                            listener(new StateEvent(StateEventType.LoadingComplete, data));
                        }
                    };
                })(key);
                total++;
            }
        };
        StateLoading.prototype.stop = function () {
            var loadingElement = document.getElementById(this.loadingElementId);
            loadingElement.setAttribute('class', 'hidden');
            var assetsElement = document.getElementById(this.assetsElementId);
            while (assetsElement.firstChild) {
                assetsElement.removeChild(assetsElement.firstChild);
            }
        };
        return StateLoading;
    }());
    Loading.StateLoading = StateLoading;
})(Loading || (Loading = {}));
var Sound;
(function (Sound) {
    function linearRampGain(gain, now, attackVolume, sustainVolume, attackSeconds, decaySeconds, sustainSeconds, durationSeconds) {
        gain.gain.value = 0;
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(attackVolume, now + attackSeconds);
        gain.gain.linearRampToValueAtTime(sustainVolume, now + decaySeconds);
        if (sustainSeconds) {
            gain.gain.linearRampToValueAtTime(sustainVolume, now + sustainSeconds);
        }
        gain.gain.linearRampToValueAtTime(0, now + durationSeconds);
    }
    Sound.linearRampGain = linearRampGain;
})(Sound || (Sound = {}));
var Sound;
(function (Sound) {
    var WebAudioBoomSoundFactory = (function () {
        function WebAudioBoomSoundFactory(audioContext, sampleDurationSeconds) {
            this.audioContext = audioContext;
            this.sampleDurationSeconds = sampleDurationSeconds;
            if (this.audioContext) {
                var frameCount = this.sampleDurationSeconds * this.audioContext.sampleRate;
                this.buffer = audioContext.createBuffer(1, frameCount, this.audioContext.sampleRate);
                var data = this.buffer.getChannelData(0);
                for (var i = 0; i < frameCount; i++) {
                    data[i] = Math.random() * 2 - 1;
                }
            }
        }
        WebAudioBoomSoundFactory.prototype.create = function () {
            var _this = this;
            return function () {
                var intensity = Math.random();
                if (_this.audioContext) {
                    // set up the frequency
                    var now = _this.audioContext.currentTime;
                    var durationSeconds = _this.sampleDurationSeconds;
                    var staticNode = _this.audioContext.createBufferSource();
                    staticNode.buffer = _this.buffer;
                    staticNode.loop = true;
                    var filter = _this.audioContext.createBiquadFilter();
                    filter.type = 'lowpass';
                    filter.Q.value = 1;
                    filter.frequency.value = 1200;
                    //decay
                    var gain = _this.audioContext.createGain();
                    var decay = durationSeconds * 0.5;
                    Sound.linearRampGain(gain, now, intensity / 2, intensity, durationSeconds, decay, null, durationSeconds);
                    staticNode.connect(filter);
                    filter.connect(gain);
                    gain.connect(_this.audioContext.destination);
                    // die
                    setTimeout(function () {
                        filter.disconnect();
                        staticNode.disconnect();
                        staticNode.stop();
                    }, durationSeconds * 1000);
                    staticNode.start();
                }
            };
        };
        return WebAudioBoomSoundFactory;
    }());
    Sound.WebAudioBoomSoundFactory = WebAudioBoomSoundFactory;
})(Sound || (Sound = {}));
var Sound;
(function (Sound) {
    var WebAudioToneSoundFactory = (function () {
        function WebAudioToneSoundFactory(audioContext, oscillatorType, startFrequency, endFrequency, frequencyRange, attackSeconds, decaySeconds, sustainSeconds, durationSeconds, volumeScale) {
            if (volumeScale === void 0) { volumeScale = 1.0; }
            this.audioContext = audioContext;
            this.oscillatorType = oscillatorType;
            this.startFrequency = startFrequency;
            this.endFrequency = endFrequency;
            this.frequencyRange = frequencyRange;
            this.attackSeconds = attackSeconds;
            this.decaySeconds = decaySeconds;
            this.sustainSeconds = sustainSeconds;
            this.durationSeconds = durationSeconds;
            this.volumeScale = volumeScale;
        }
        WebAudioToneSoundFactory.prototype.create = function () {
            var _this = this;
            return function () {
                var intensity = Math.random();
                if (_this.audioContext) {
                    var now = _this.audioContext.currentTime;
                    // base noise
                    var oscillator = _this.audioContext.createOscillator();
                    oscillator.frequency.setValueAtTime(Math.max(1, _this.startFrequency + _this.frequencyRange * intensity), now);
                    oscillator.frequency.linearRampToValueAtTime(Math.max(1, _this.endFrequency + _this.frequencyRange * intensity), now + _this.durationSeconds);
                    oscillator.type = _this.oscillatorType;
                    //decay
                    var gain = _this.audioContext.createGain();
                    Sound.linearRampGain(gain, now, 0.2 * _this.volumeScale, 0.1 * _this.volumeScale, _this.attackSeconds, _this.decaySeconds, _this.sustainSeconds, _this.durationSeconds);
                    // wire up
                    oscillator.connect(gain);
                    gain.connect(_this.audioContext.destination);
                    oscillator.start();
                    // kill
                    setTimeout(function () {
                        oscillator.stop();
                    }, _this.durationSeconds * 1000);
                }
            };
        };
        return WebAudioToneSoundFactory;
    }());
    Sound.WebAudioToneSoundFactory = WebAudioToneSoundFactory;
})(Sound || (Sound = {}));
var Sound;
(function (Sound) {
    var WebAudioVibratoSoundFactory = (function () {
        function WebAudioVibratoSoundFactory(audioContext, startFrequency, endFrequency, vibrations, durationSeconds) {
            this.audioContext = audioContext;
            this.startFrequency = startFrequency;
            this.endFrequency = endFrequency;
            this.vibrations = vibrations;
            this.durationSeconds = durationSeconds;
        }
        WebAudioVibratoSoundFactory.prototype.create = function () {
            var _this = this;
            return function () {
                if (_this.audioContext) {
                    var now = _this.audioContext.currentTime;
                    var oscillator = _this.audioContext.createOscillator();
                    oscillator.frequency.setValueAtTime(_this.startFrequency, now);
                    oscillator.frequency.linearRampToValueAtTime(_this.endFrequency, now + _this.durationSeconds);
                    oscillator.type = 'square';
                    oscillator.start();
                    var gain = _this.audioContext.createGain();
                    Sound.linearRampGain(gain, now, 0.2, 0.1, 0, _this.durationSeconds * 0.1, _this.durationSeconds * 0.2, _this.durationSeconds);
                    var vibrato = _this.audioContext.createOscillator();
                    vibrato.frequency.value = _this.vibrations / _this.durationSeconds;
                    vibrato.type = 'sawtooth';
                    vibrato.start();
                    var vibratoGain = _this.audioContext.createGain();
                    vibratoGain.gain.value = -1000;
                    oscillator.connect(gain);
                    //gain.connect(vibratoGain);
                    vibrato.connect(vibratoGain);
                    vibratoGain.connect(oscillator.detune);
                    gain.connect(_this.audioContext.destination);
                    setTimeout(function () {
                        oscillator.disconnect();
                        gain.disconnect();
                        vibratoGain.disconnect();
                        oscillator.stop();
                        vibrato.stop();
                    }, _this.durationSeconds * 1000);
                }
            };
        };
        return WebAudioVibratoSoundFactory;
    }());
    Sound.WebAudioVibratoSoundFactory = WebAudioVibratoSoundFactory;
})(Sound || (Sound = {}));
var StateEventType;
(function (StateEventType) {
    StateEventType[StateEventType["LoadingComplete"] = 0] = "LoadingComplete";
    StateEventType[StateEventType["GoHome"] = 1] = "GoHome";
    StateEventType[StateEventType["PlayLevel"] = 2] = "PlayLevel";
})(StateEventType || (StateEventType = {}));
var StateEvent = (function () {
    function StateEvent(type, data) {
        this.type = type;
        this.data = data;
    }
    return StateEvent;
}());
var StateEventDataLoadingComplete = (function () {
    function StateEventDataLoadingComplete(images) {
        this.images = images;
    }
    return StateEventDataLoadingComplete;
}());
var StateEventDataLevelPlay = (function () {
    function StateEventDataLevelPlay(id) {
        this.id = id;
    }
    return StateEventDataLevelPlay;
}());
var StateKeyType;
(function (StateKeyType) {
    StateKeyType[StateKeyType["Home"] = 0] = "Home";
    StateKeyType[StateKeyType["LevelPlay"] = 1] = "LevelPlay";
})(StateKeyType || (StateKeyType = {}));
var StateKey = (function () {
    function StateKey(type, data) {
        this.type = type;
        this.data = data;
    }
    return StateKey;
}());
var StateKeyDataLevelPlay = (function () {
    function StateKeyDataLevelPlay(levelId) {
        this.levelId = levelId;
    }
    return StateKeyDataLevelPlay;
}());
//# sourceMappingURL=out.js.map