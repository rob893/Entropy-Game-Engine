import { ISpriteData } from "./Interfaces/ISpriteData";
import { LevelSpec } from "./LevelSpec";
import { IMapCell } from "./Interfaces/IMapCell";

export class LevelBuilder {

    private builderMap: Map<HTMLImageElement, Map<string, ISpriteData[]>> = new Map<HTMLImageElement, Map<string, ISpriteData[]>>();
    private spriteSheetSet: Set<string> = new Set<string>();
    private readonly context: CanvasRenderingContext2D;
    private readonly canvas: HTMLCanvasElement;
    private currentSpriteSheet: HTMLImageElement;


    public constructor(width: number = 1024, height: number = 576) {
        this.canvas = document.createElement('canvas');
        this.canvas.width = width;
        this.canvas.height = height;
        this.context = this.canvas.getContext('2d');
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

    public async buildMap(roomSpec: IMapCell[][],  scale: number = 1): Promise<HTMLImageElement> {
        return new Promise(resolve => {

            let x = 0;
            let y = 0;
            for (let i = 0; i < roomSpec.length; i++) {
                for (let j = 0; j < roomSpec[i].length; j++) {
                    let p = roomSpec[i][j];

                    if (p === null) {
                        x = j === roomSpec[i].length - 1 ? 0 : x + 16 * scale;
                        y = j === roomSpec[i].length - 1 ? y + 16 * scale : y;
                        continue;
                    }
                    
                    let c = p.spriteData;

                    this.context.drawImage(this.currentSpriteSheet, c.sliceX, c.sliceY, c.sliceWidth, c.sliceHeight, x, y, c.sliceWidth * scale, c.sliceHeight * scale);
                    x = j === roomSpec[i].length - 1 ? 0 : x + (c.sliceWidth * scale);
                    y = j === roomSpec[i].length - 1 ? y + (c.sliceHeight * scale) : y;
                }
            }

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