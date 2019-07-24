import { ISpriteData } from "./Interfaces/ISpriteData";
import { LevelSpec } from "./LevelSpec";

export class LevelBuilder {

    private builderMap: Map<HTMLImageElement, Map<string, ISpriteData[]>> = new Map<HTMLImageElement, Map<string, ISpriteData[]>>();
    private spriteSheetSet: Set<string> = new Set<string>();
    private readonly context: CanvasRenderingContext2D;
    private readonly canvas: HTMLCanvasElement;
    private currentSpriteSheet: HTMLImageElement;

    private spec: ISpriteData[][] = [
        [' ', ' ', '|', '-', '-', '-', '-', '-', '|'],
        ['-', '-', '-', 'x', 'x', 'x', 'x', 'x', '|'],
        ['x', 'x', 'x', 'x', 'x', 'x', 'x', 'x', '|'],
        ['x', 'x', 'x', 'x', 'x', 'x', 'x', 'x', '|'],
        ['-', '-', '-', 'x', 'x', 'x', 'x', 'x', '|'],
        [' ', ' ', '|', '-', '-', '-', '-', '-', '|']
    ];


    public constructor(width: number = 1024, height: number = 576) {
        this.canvas = document.createElement('canvas');
        this.canvas.width = width;
        this.canvas.height = height;
        this.context = this.canvas.getContext('2d');
    }

    public setSpec(): void {
        //TODO convert spec to be an 
        this.spec = [[]];
    }

    public async using(spriteSheet: string): Promise<LevelBuilder> {
        if (this.spriteSheetSet.has(spriteSheet)) {
            console.warn('This builder is already using this sprite sheet!');
        }

        return new Promise(resolve => {
            this.spriteSheetSet.add(spriteSheet);
        
            let spriteSheetImg = new Image();
            spriteSheetImg.src = spriteSheet;
            spriteSheetImg.onload = () => {
                this.builderMap.set(spriteSheetImg, new Map<string, ISpriteData[]>());
                this.currentSpriteSheet = spriteSheetImg;
                resolve(this);
            }
        });
    }

    public addFloor(floorSpriteSpecs: ISpriteData): LevelBuilder {
        if (this.builderMap.get(this.currentSpriteSheet).has('floor')) {
            this.builderMap.get(this.currentSpriteSheet).get('floor').push(floorSpriteSpecs);
        }
        else {
            this.builderMap.get(this.currentSpriteSheet).set('floor', [floorSpriteSpecs]);
        }

        return this;
    }

    public addWall(wallSpriteSpecs: ISpriteData): LevelBuilder {
        if (this.builderMap.get(this.currentSpriteSheet).has('wall')) {
            this.builderMap.get(this.currentSpriteSheet).get('wall').push(wallSpriteSpecs);
        }
        else {
            this.builderMap.get(this.currentSpriteSheet).set('wall', [wallSpriteSpecs]);
        }

        return this;
    }

    public addTopWall(wallSpriteSpecs: ISpriteData): LevelBuilder {
        if (this.builderMap.get(this.currentSpriteSheet).has('twall')) {
            this.builderMap.get(this.currentSpriteSheet).get('twall').push(wallSpriteSpecs);
        }
        else {
            this.builderMap.get(this.currentSpriteSheet).set('twall', [wallSpriteSpecs]);
        }

        return this;
    }

    public async buildMap(scale: number = 1): Promise<HTMLImageElement> {
        return new Promise(resolve => {
            const spriteSheetMap = this.builderMap.get(this.currentSpriteSheet);

            let x = 0;
            let y = 0;
            for (let i = 0; i < this.spec.length; i++) {
                for (let j = 0; j < this.spec[i].length; j++) {
                    let c = this.spec[i][j];

                    if (c === 'x') {
                        let floor = LevelSpec.floorTile;
                        this.context.drawImage(this.currentSpriteSheet, floor.sliceX, floor.sliceY, floor.sliceWidth, floor.sliceHeight, x, y, floor.sliceWidth * scale, floor.sliceHeight * scale);
                        x = j === this.spec[i].length - 1 ? 0 : x + (floor.sliceWidth * scale);
                        y = j === this.spec[i].length - 1 ? y + (floor.sliceHeight * scale) : y;
                    }
                    else if (c === '-') {
                        let twall = LevelSpec.topWall;
                        this.context.drawImage(this.currentSpriteSheet, twall.sliceX, twall.sliceY, twall.sliceWidth, twall.sliceHeight, x, y, twall.sliceWidth * scale, twall.sliceHeight * scale);
                        x = j === this.spec[i].length - 1 ? 0 : x + (twall.sliceWidth * scale);
                        y = j === this.spec[i].length - 1 ? y + (twall.sliceHeight * scale) : y;
                    }
                    else if (c === '|') {
                        let wall = LevelSpec.rightWall;
                        this.context.drawImage(this.currentSpriteSheet, wall.sliceX, wall.sliceY, wall.sliceWidth, wall.sliceHeight, x, y, wall.sliceWidth * scale, wall.sliceHeight * scale);
                        x = j === this.spec[i].length - 1 ? 0 : x + wall.sliceWidth * scale;
                        y = j === this.spec[i].length - 1 ? y + wall.sliceHeight * scale : y;
                    }
                    else {
                        let floor = LevelSpec.floorTile;
                        x = j === this.spec[i].length - 1 ? 0 : x + floor.sliceWidth * scale;
                        y = j === this.spec[i].length - 1 ? y + floor.sliceHeight * scale : y;
                    }
                }
            }
            // let i = 0;
            // let j = 0;
            // for (let x = 0; x < this.canvas.width; x += i) {
            //     for (let y = 0; y < this.canvas.height; y += j) {
            //         if (x === 0 || x === this.canvas.width) {
            //             this.context.drawImage(this.currentSpriteSheet, wall.sliceX, wall.sliceY, wall.sliceWidth, wall.sliceHeight, x, y, wall.sliceWidth * 2, wall.sliceHeight * 2);
            //             i = wall.sliceWidth * 2;
            //             j = wall.sliceHeight * 2;
            //         }
            //         else {
            //             this.context.drawImage(this.currentSpriteSheet, floor.sliceX, floor.sliceY, floor.sliceWidth, floor.sliceHeight, x, y, floor.sliceWidth * 2, floor.sliceHeight * 2);
            //             i = floor.sliceWidth * 2;
            //             j = floor.sliceHeight * 2;
            //         } 
            //     }
            // }

            let image = new Image();
            image.src = this.canvas.toDataURL();
            image.onload = () => {
                resolve(image);
            }
        });
    }

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