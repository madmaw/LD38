module Level.Render {
    export interface EntityRenderFactory {
        (entity: Level.Description.Entity): EntityRender;
    }
}