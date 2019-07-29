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
export class LevelBuilder {
    constructor(width = 1024, height = 576) {
        this.builderMap = new Map();
        this.spriteSheetSet = new Set();
        this.canvas = document.createElement('canvas');
        this.canvas.width = width;
        this.canvas.height = height;
        this.context = this.canvas.getContext('2d');
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
    buildMap(roomSpec, scale = 1) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise(resolve => {
                const navGrid = new NavGrid(16);
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
                    resolve(new Terrain(image, navGrid, []));
                };
            });
        });
    }
    static combineImages(spriteSheetUrl, spriteX, spriteY, spriteWidth, spriteHeight, sliceWidth, sliceHeight) {
        return __awaiter(this, void 0, void 0, function* () {
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
                    };
                };
            });
        });
    }
}
//# sourceMappingURL=LevelBuilder.js.map