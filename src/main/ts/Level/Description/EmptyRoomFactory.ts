module Level.Description {

    export class EmptyRoomFactory {
        constructor(public width: number, public height: number) {

        }

        public create(): RoomFactory {
            return () => {
                let room = new Room(this.width, this.height, null);
                // fill out walls
                for (let x = 0; x < this.width; x++) {

                    let topWall;
                    if (x == 3) {
                        topWall = new WallExit(room.nextId(), Color.BLACK, x, 0);
                    } else {
                        topWall = new WallSolid(room.nextId(), Color.WHITE, x, 0, WallOrientation.HORIZONTAL);
                    }
                    room.setWall(topWall);
                    let bottomWall = new WallSolid(room.nextId(), Color.WHITE, x, this.height, WallOrientation.HORIZONTAL);
                    room.setWall(bottomWall);
                    if (x < this.width - 1) {
                        let midWall = new WallSolid(room.nextId(), Color.GREEN, x, Math.floor(this.height / 2), WallOrientation.HORIZONTAL);
                        room.setWall(midWall);
                    }
                }
                for (let y = 0; y < this.height; y++) {
                    let leftWall = new WallSolid(room.nextId(), Color.WHITE, 0, y, WallOrientation.VERTICAL);
                    room.setWall(leftWall);
                    let rightWall = new WallSolid(room.nextId(), Color.WHITE, this.width, y, WallOrientation.VERTICAL);
                    room.setWall(rightWall);
                    if (y < this.height - 1) {
                        let midWall = new WallSolid(room.nextId(), Color.YELLOW, Math.floor(this.width / 2), y, WallOrientation.VERTICAL);
                        room.setWall(midWall);
                    }
                }
                let player1 = new MonsterPlayer(room.nextId(), Color.WHITE, 0, 0);
                player1.sticky = false;
                room.addMonster(player1);

                let dragon = new MonsterDragon(room.nextId(), Color.RED, 4, 4);
                room.addMonster(dragon);
                return room;
            }
        }

    }

}