module Level.Render {

    export class BaseEntityRender<EntityType extends Level.Description.Entity> {

        protected ambientAnimation: Animation;

        constructor(
            protected entity: EntityType,
            protected container: PIXI.Container,
            protected tileWidth: number,
            protected tileHeight: number
        ) {
        
        }

        setAmbientAnimation(ambientAnimation: Animation): void {
            if (this.ambientAnimation != ambientAnimation) {
                if (this.ambientAnimation != null) {
                    this.ambientAnimation.stop();
                }
                this.ambientAnimation = ambientAnimation;
                if (this.ambientAnimation != null) {
                    this.ambientAnimation.start();
                }
            } 
        }



        addChild(child: PIXI.DisplayObject): void {
            this.recalculateZ(child);
            let index = this.getIndex(child);

            this.container.addChildAt(child, index);
        }

        reorderChild(child: PIXI.DisplayObject): void {
            this.container.removeChild(child);
            this.addChild(child);
        }

        getIndex(child: PIXI.DisplayObject): number {
            let children = this.container.children;
            let childZ = this.getZ(child);
            for (let i = 0; i < children.length; i++) {
                let compare = children[i];
                let z = this.getZ(compare);
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
        }

        recalculateZ(child: PIXI.DisplayObject): void {
            let z = this.calculateZ(child);
            (<any>child).z = z;
        }


        calculateZ(child: PIXI.DisplayObject): number {
            let z = child.y;
            let height: number = (<any>child).height;
            let anchor: PIXI.ObservablePoint = (<any>child).anchor;
            if (anchor != null && anchor.y != null && height != null) {
                z += (1 - anchor.y) * height;
            }
            return z;
        }


        getZ(child: PIXI.DisplayObject): number {
            let z = (<any>child).z;
            if (z == null) {
                z = 0;
            }
            return z;
        }
    }

}