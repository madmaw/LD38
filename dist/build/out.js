console.log('test!');
window.onload = function () {
    var view = document.getElementById('canvas');
    var options = {
        forceCanvas: true,
        view: view,
        backgroundColor: 0,
        width: document.body.clientWidth,
        height: document.body.clientHeight
    };
    PIXI.autoDetectRenderer(options);
};
//# sourceMappingURL=out.js.map