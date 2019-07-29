import { ISpriteData } from "../Interfaces/ISpriteData";
import { IMapCell } from "../Interfaces/IMapCell";
import { NavGrid } from "./NavGrid";
import { Vector2 } from "./Vector2";
import { Terrain } from "./Terrain";

export class TerrainBuilder {

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

    public async using(spriteSheet: string): Promise<TerrainBuilder> {
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

    public async buildTerrain(roomSpec: IMapCell[][],  scale: number = 1): Promise<Terrain> {
        return new Promise(resolve => {
            const navGrid = new NavGrid(16 * scale);

            let x = 0;
            let y = 0;
            for (let i = 0; i < roomSpec.length; i++) {
                for (let j = 0; j < roomSpec[i].length; j++) {
                    const p = roomSpec[i][j];

                    if (p === null) {
                        x = j === roomSpec[i].length - 1 ? 0 : x + 16 * scale;
                        y = j === roomSpec[i].length - 1 ? y + 16 * scale : y;
                        continue;
                    }

                    navGrid.addCell({ passable: p.passable, weight: p.weight, position: new Vector2(x, y) });
                    
                    const c = p.spriteData;

                    this.context.drawImage(this.currentSpriteSheet, c.sliceX, c.sliceY, c.sliceWidth, c.sliceHeight, x, y, c.sliceWidth * scale, c.sliceHeight * scale);
                    x = j === roomSpec[i].length - 1 ? 0 : x + (c.sliceWidth * scale);
                    y = j === roomSpec[i].length - 1 ? y + (c.sliceHeight * scale) : y;
                }
            }

            const image = new Image();
            image.src = this.canvas.toDataURL();
            image.onload = () => {
                console.log(navGrid);
                resolve(new Terrain(image, navGrid, []));
            }
        });
    }
}