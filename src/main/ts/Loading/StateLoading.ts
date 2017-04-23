module Loading {


    export class StateLoading implements State {

        private loadingElementId: string;
        private progressElementId: string;
        private assetsElementId: string;

        constructor(private imagePaths: { [_: string]: string }, private colors: Color[]) {
            this.loadingElementId = 'loading';
            this.progressElementId = 'loading-progress';
            this.assetsElementId = 'loading-assets';
        }

        start(listener: StateListener): void {

            let loadingElement = document.getElementById(this.loadingElementId);
            loadingElement.removeAttribute('class');

            let progressElement = document.getElementById(this.progressElementId);
            progressElement.innerText = '0%;';

            let assetsElement = document.getElementById(this.assetsElementId);

            let colors = this.colors;
            let progress = 0;
            let total = 0;
            let images: { [_: string]: HTMLCanvasElement[] } = {};
            for (let key in this.imagePaths) {
                let path = this.imagePaths[key];
                let image = new Image()
                image.src = path;
                image.onload = (function (key: string) {
                    return function (e: Event) {
                        progress++;

                        let source = this;
                        let coloredImages: HTMLCanvasElement[] = [];
                        // rotate though all the colours
                        for (let color of colors) {
                            let coloredImage = document.createElement('canvas');
                            coloredImage.width = source.width;
                            coloredImage.height = source.height;
                            let context = coloredImage.getContext('2d');
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

                                if (r || g || b) { // pixel is not black
                                    let i = Math.max(r, g, b);
                                    if (color.hasBlue()) {
                                        pixelArray[--index] = i; 
                                    } else {
                                        pixelArray[--index] = 0;
                                    }
                                    if (color.hasGreen()) {
                                        pixelArray[--index] = i; 
                                    } else {
                                        pixelArray[--index] = 0;
                                    }
                                    if (color.hasRed()) {
                                        pixelArray[--index] = i; 
                                    } else {
                                        pixelArray[--index] = 0;
                                    }
                                }
                            }

                            context.putImageData(imageData, 0, 0);

                            coloredImages.push(coloredImage);
                            assetsElement.appendChild(coloredImage);
                        }
                        images[key] = coloredImages;

                        progressElement.innerText = '' + Math.round((progress * 100) / total) + '%';

                        if (progress == total) {
                            let data = new StateEventDataLoadingComplete(images);
                            listener(new StateEvent(StateEventType.LoadingComplete, data));
                        }
                    };
                })(key);
                total++;
            }
        }

        stop(): void {
            let loadingElement = document.getElementById(this.loadingElementId);
            loadingElement.setAttribute('class', 'hidden');
            let assetsElement = document.getElementById(this.assetsElementId);
            while (assetsElement.firstChild) {
                assetsElement.removeChild(assetsElement.firstChild);
            }
        }


    }
}
