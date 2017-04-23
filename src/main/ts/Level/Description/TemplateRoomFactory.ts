module Level.Description {

    export class TemplateRoomFactory {
        private width: number;
        private height: number;
        private lines: string[];
        constructor(template: string, private helpText: string) {
            let lines = template.split('\n');
            let maxLineLength = 0;
            while (lines.length > 0 && lines[0].trim().length == 0) {
                lines.splice(0, 1);
            }
            while (lines.length > 0 && lines[lines.length - 1].trim().length == 0) {
                lines.splice(lines.length - 1, 1);
            }
            for (let i = lines.length; i > 0;) {
                i--;
                let line = lines[i];
                maxLineLength = Math.max(maxLineLength, line.length);
            }
            this.height = Math.floor(lines.length / 2);
            this.width = Math.floor(maxLineLength / 4);
            this.lines = lines;
        }

        public create(): RoomFactory {
            
            return () => {
                let room = new Room(this.width, this.height, this.helpText);

                // horizontal walls and tile color
                let row = 0;
                while (row < this.lines.length) {
                    let line = this.lines[row];
                    let i = 0;
                    let y = Math.floor(row / 2);


                    while (i < line.length) {
                        let x = Math.floor(i / 4);
                        if (y < room.height && x < room.width) {
                            let tileColorChar = line.charAt(i);
                            let tileColor = this.toColor(tileColorChar);
                            if (tileColor != null) {
                                room.getTile(x, y).color = tileColor;
                            }
                        }

                        let colorChar = line.charAt(i + 2);
                        let typeChar = line.charAt(i + 3);
                        if (typeChar != null) {
                            let color = this.toColor(colorChar);
                            if (color != null) {
                                let wall = this.toWall(room, typeChar, color, x, y, WallOrientation.HORIZONTAL);
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
                while (row < this.lines.length) {
                    let y = Math.floor(row / 2);
                    let line = this.lines[row];
                    let i = 0;
                    while (i < line.length) {
                        let wallColorChar = line.charAt(i);
                        let wallTypeChar = line.charAt(i + 1);
                        let x = Math.floor(i / 4);
                        if (wallTypeChar != null) {
                            let wallColor = this.toColor(wallColorChar);
                            if (wallColor != null) {
                                let wall = this.toWall(room, wallTypeChar, wallColor, x, y, WallOrientation.VERTICAL);
                                if (wall != null) {
                                    room.setWall(wall);
                                }
                            }
                        }
                        if (i + 3 < line.length) {
                            let monsterColorChar = line.charAt(i + 2);
                            let monsterTypeChar = line.charAt(i + 3);
                            if (monsterTypeChar != null) {
                                let monsterColor = this.toColor(monsterColorChar);
                                if (monsterColor != null) {
                                    let monster = this.toMonster(room, monsterTypeChar, monsterColor, monsterColorChar.toUpperCase() == monsterColorChar, x, y);
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
            }
        }


        private toMonster(room: Room, typeChar: string, color: Color, sticky: boolean, x: number, y: number): Monster {
            let monster;
            switch (typeChar) {
                case 'P':
                    monster = new MonsterPlayer(room.nextId(), color, x, y);
                    break;
                case 'D':
                    monster = new MonsterDragon(room.nextId(), color, x, y);
                    break;
                case 'B':
                    monster = new MonsterBoulder(room.nextId(), color, x, y);
                    break;
                default:
                    monster = null;
                    break;
            }
            if (monster != null) {
                monster.sticky = sticky;
            }
            return monster;
        } 


        private toWall(room: Room, typeChar: string, color: Color, x: number, y: number, orientation: WallOrientation): Wall {
            switch (typeChar) {
                case '#':
                    return new WallSolid(room.nextId(), color, x, y, orientation);
                case 'E':
                    return new WallExit(room.nextId(), color, x, y);
                default:
                    return null;
            }
        }

        private toColor(c: string): Color {
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
        }

    }

}