export class LevelBuilder {

    public static async combineImages(spriteSheetUrl: string, spriteX: number, spriteY: number, spriteWidth: number, spriteHeight: number, sliceWidth: number, sliceHeight: number): Promise<HTMLImageElement> {
        return new Promise(resolve => {
            let spriteSheet = new Image();
            spriteSheet.src = spriteSheetUrl;
            spriteSheet.onload = () => {
                let canvas = document.createElement('canvas');
                            
                canvas.width = 700;
                canvas.height = 400;

                let context = canvas.getContext('2d');

                for (let x = 0; x < canvas.width; x += sliceWidth) {
                    for (let y = 0; y < canvas.height; y += sliceHeight) {
                        context.drawImage(spriteSheet, spriteX, spriteY, spriteWidth, spriteHeight, x, y, sliceWidth, sliceWidth);
                    }
                }

                let image = new Image();
                image.src = canvas.toDataURL();
                image.onload = () => {
                    resolve(image);
                }
            }
        });
    }
}