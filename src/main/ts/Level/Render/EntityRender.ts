module Level.Render {

    export interface EntityRender {

        attach(): void;

        detach(): void;

        applyDelta(delta: Level.Description.Delta): Animation;

    }

}