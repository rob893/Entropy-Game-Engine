export class SpriteSheet {
    
    private readonly frames = new Map<number, HTMLImageElement[]>();

    
    private constructor() {}

    /**
     * @param spriteSheetUrl The location of the sprite sheet (import it as a variable and then use that)
     * @param framesPerRow Number of frames per row (if the sprite sheet is 5 by 5 (5 rows with 5 frames per row), then this should be 5)
     * @param numRows Number of rows the sprite sheet has.
     * @param trimEdgesBy How many pixals to trim the sprite sheet down by. This is applied to each side.
     */
    public static async buildSpriteSheetAsync(spriteSheetUrl: string, framesPerRow: number, numRows: number, 
        trimEdgesBy: number = 0, rowFrameMap: Map<number, number> = new Map()): Promise<SpriteSheet> {
        const spriteSheet = new SpriteSheet();

        await spriteSheet.initializeSpriteSheet(spriteSheetUrl, framesPerRow, numRows, trimEdgesBy, rowFrameMap);

        return spriteSheet;
    }

    public getFrames(rows?: number[] | number): HTMLImageElement[] {
        let frames: HTMLImageElement[] = [];

        if (rows !== undefined && rows !== null) {
            if (typeof rows === 'number') {
                rows = [rows];
            }

            for (const row of rows) {
                if (!this.frames.has(row)) {
                    console.error(`Row ${row} does not exist in this sprite sheet!`);
                    continue;
                }

                const framesInRow = this.frames.get(row);

                if (framesInRow === undefined) {
                    throw new Error('Error getting frames');
                }

                frames = [...frames, ...framesInRow];
            }
        }
        else {
            for (const rowFrames of this.frames.values()) {
                frames = [...frames, ...rowFrames];
            }
        }

        return frames;
    }

    private async initializeSpriteSheet(spriteSheetUrl: string, framesPerRow: number, numRows: number, trimEdgesBy: number, rowFrameMap: Map<number, number>): Promise<void> {
        return new Promise((resolve, reject) => {
            const timer = setTimeout(() => reject(new Error('Timeout when waiting on spritesheet to load.')), 5000);

            let totalNumberOfFramesForSheet = 0;
            for (let i = 1; i <= numRows; i++) {
                const framesForRow = rowFrameMap.get(i);

                if (framesForRow !== undefined) {
                    totalNumberOfFramesForSheet += framesForRow;
                }
                else {
                    totalNumberOfFramesForSheet += framesPerRow;
                }
            }

            let totalFramesCreated = 0;

            const spriteSheet = new Image();
            spriteSheet.src = spriteSheetUrl;
            spriteSheet.onload = () => {
                const spriteWidth = spriteSheet.width / framesPerRow;
                const spriteHeight = spriteSheet.height / numRows;
                
                for (let i = 0; i < numRows; i++) {
                    let numFramesInRow = rowFrameMap.get(i + 1); //rows are defined as starting at index 1, not 0. So add 1

                    if (numFramesInRow === undefined) {
                        numFramesInRow = framesPerRow;
                    }

                    for (let j = 0; j < numFramesInRow; j++) {
                        const canvas = document.createElement('canvas');
                        
                        canvas.width = spriteWidth;
                        canvas.height = spriteHeight;

                        const context = canvas.getContext('2d');

                        if (context === null) {
                            throw new Error('Error making context');
                        }

                        context.drawImage(spriteSheet, (j * spriteWidth) + trimEdgesBy, (i * spriteHeight) + trimEdgesBy, spriteWidth - trimEdgesBy, spriteHeight - trimEdgesBy, 0, 0, canvas.width, canvas.height);
                        const frame = new Image();
                        frame.src = canvas.toDataURL();
                        frame.onload = () => {
                            const row = i + 1;

                            const framesInRow = this.frames.get(row);
                            if (framesInRow !== undefined) {
                                framesInRow.push(frame);
                            }
                            else {
                                this.frames.set(row, [frame]);
                            }
                            
                            totalFramesCreated++;
                            //if (i === numRows - 1 && j === framesPerRow - 1) {
                            if (totalFramesCreated === totalNumberOfFramesForSheet) {
                                clearTimeout(timer);
                                resolve();
                            }
                        };
                    }
                }
            };        
        });
    }
}