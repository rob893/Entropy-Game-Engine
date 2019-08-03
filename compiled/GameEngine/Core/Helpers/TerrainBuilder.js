import { NavGrid } from './NavGrid';
import { Vector2 } from './Vector2';
import { Terrain } from './Terrain';
export class TerrainBuilder {
    constructor(width = 1024, height = 576) {
        this.builderMap = new Map();
        this.spriteSheetSet = new Set();
        this.canvas = document.createElement('canvas');
        this.canvas.width = width;
        this.canvas.height = height;
        this.context = this.canvas.getContext('2d');
    }
    async buildTerrain(terrainSpec) {
        await this.using(terrainSpec.spriteSheetUrl);
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
    }
    async using(spriteSheet) {
        if (this.spriteSheetSet.has(spriteSheet)) {
            console.warn('This builder is already using this sprite sheet!');
        }
        return new Promise(resolve => {
            this.spriteSheetSet.add(spriteSheet);
            const spriteSheetImg = new Image();
            spriteSheetImg.src = spriteSheet;
            spriteSheetImg.onload = () => {
                this.builderMap.set(spriteSheetImg, new Map());
                this.currentSpriteSheet = spriteSheetImg;
                resolve(this);
            };
        });
    }
}
//# sourceMappingURL=TerrainBuilder.js.map