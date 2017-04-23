module Level.Description {

    export class BaseEntity implements Level.Description.Entity {

        constructor(public id: number, public entityType: EntityType, public color: Color) {

        }

        public getColor() {
            return this.color;
        }

        recolor(room: Room, color: Color): Delta {
            if (color != this.getColor()) {
                this.color = color;
                return new Delta(this, DeltaType.Recolor, new DeltaDataRecolor(color));
            } else {
                return new Delta(this, DeltaType.DoNothing);
            }
        }

    }

}