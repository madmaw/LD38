console.log('test!');

window.onload = function() {
    let view = <HTMLCanvasElement>document.getElementById('canvas');
    let options: PIXI.RendererOptions = {
        forceCanvas: true,
        view: view,
        backgroundColor: 0,
        width: document.body.clientWidth,
        height: document.body.clientHeight
    };
    PIXI.autoDetectRenderer(options);
}
