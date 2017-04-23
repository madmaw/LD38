module Level.Description {
    export class Tile extends BaseEntity {
        public monsters: Level.Description.Monster[];
        

        constructor(id: number, color: Color, public tileX: number, public tileY: number) {
            super(id, EntityType.TILE, color);
            this.monsters = [];
        }

        isComplete(): boolean {
            let color = Color.BLACK;
            if (this.color != null && !this.color.isBlack()) {
                let monsters = this.monsters;
                for (let monster of monsters) {
                    color = color.union(monster.getColor());
                }
            }
            return color.contains(this.color);
        }
    }
}
