export class LevelBuilder {

    public static async combineImages(spriteSheetUrl: string, numCols: number, numRows: number, tileSize: number, roomSize: number): Promise<HTMLImageElement> {
        return new Promise(resolve => {
            let spriteSheet = new Image();
            spriteSheet.src = spriteSheetUrl;
            spriteSheet.onload = () => {
                let canvas = document.createElement('canvas');
                            
                canvas.width = 700;
                canvas.height = 400;

                let context = canvas.getContext('2d');

                for (let x = 0; x < canvas.width; x += tileSize) {
                    for (let y = 0; y < canvas.height; y += tileSize) {
                        context.drawImage(spriteSheet, numCols, numRows, tileSize, tileSize, x, y, canvas.width, canvas.height);
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