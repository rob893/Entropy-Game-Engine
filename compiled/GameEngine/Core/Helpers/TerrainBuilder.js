var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { NavGrid } from "./NavGrid";
import { Vector2 } from "./Vector2";
import { Terrain } from "./Terrain";
export class TerrainBuilder {
    constructor(width = 1024, height = 576) {
        this.builderMap = new Map();
        this.spriteSheetSet = new Set();
        this.canvas = document.createElement('canvas');
        this.canvas.width = width;
        this.canvas.height = height;
        this.context = this.canvas.getContext('2d');
    }
    buildTerrain(terrainSpec) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.using(terrainSpec.spriteSheetUrl);
            return new Promise(resolve => {
                const scale = terrainSpec.scale;
                const terrainGrid = terrainSpec.getSpec();
                const cellSize = terrainSpec.cellSize;
                const navGrid = new NavGrid(cellSize * scale);
                let x = 0;
                let y = 0;
                for (let i = 0; i < terrainGrid.length; i++) {
                    for (let j = 0; j < terrainGrid[i].length; j++) {
                        const gridCell = terrainGrid[i][j];
                        if (gridCell === null) {
                            x = j === terrainGrid[i].length - 1 ? 0 : x + cellSize * scale;
                            y = j === terrainGrid[i].length - 1 ? y + cellSize * scale : y;
                            continue;
                        }
                        navGrid.addCell({ passable: gridCell.passable, weight: gridCell.weight, position: new Vector2(x, y) });
                        const c = gridCell.spriteData;
                        this.context.drawImage(this.currentSpriteSheet, c.sliceX, c.sliceY, c.sliceWidth, c.sliceHeight, x, y, c.sliceWidth * scale, c.sliceHeight * scale);
                        x = j === terrainGrid[i].length - 1 ? 0 : x + (c.sliceWidth * scale);
                        y = j === terrainGrid[i].length - 1 ? y + (c.sliceHeight * scale) : y;
                    }
                }
                const image = new Image();
                image.src = this.canvas.toDataURL();
                image.onload = () => {
                    resolve(new Terrain(image, navGrid, []));
                };
            });
        });
    }
    using(spriteSheet) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.spriteSheetSet.has(spriteSheet)) {
                console.warn('This builder is already using this sprite sheet!');
            }
            return new Promise(resolve => {
                this.spriteSheetSet.add(spriteSheet);
                let spriteSheetImg = new Image();
                spriteSheetImg.src = spriteSheet;
                spriteSheetImg.onload = () => {
                    this.builderMap.set(spriteSheetImg, new Map());
                    this.currentSpriteSheet = spriteSheetImg;
                    resolve(this);
                };
            });
        });
    }
}
//# sourceMappingURL=TerrainBuilder.js.map