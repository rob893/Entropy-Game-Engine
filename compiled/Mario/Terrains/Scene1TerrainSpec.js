import SpriteSheet from "../../../assets/images/DungeonTileset.png";
export class Scene1TerrainSpec {
    constructor(scale = 1) {
        this.cellSize = 16;
        this.scale = 1;
        this.spriteSheetUrl = SpriteSheet;
        this.topWall = { sliceX: 16, sliceY: 0, sliceWidth: this.cellSize, sliceHeight: this.cellSize };
        this.midWall = { sliceX: 16, sliceY: 16, sliceWidth: this.cellSize, sliceHeight: this.cellSize };
        this.rightWall = { sliceX: 0, sliceY: 128, sliceWidth: this.cellSize, sliceHeight: this.cellSize };
        this.leftWall = { sliceX: 16, sliceY: 128, sliceWidth: this.cellSize, sliceHeight: this.cellSize };
        this.bottomWall = { sliceX: 36, sliceY: 124, sliceWidth: this.cellSize, sliceHeight: this.cellSize };
        this.bottomRCornerWall = { sliceX: 48, sliceY: 124, sliceWidth: this.cellSize, sliceHeight: this.cellSize };
        this.topRCornerWall = { sliceX: 48, sliceY: 144, sliceWidth: this.cellSize, sliceHeight: this.cellSize };
        this.sideWallEndRight = { sliceX: 0, sliceY: 144, sliceWidth: this.cellSize, sliceHeight: this.cellSize };
        this.sideWallEndLeft = { sliceX: 16, sliceY: 144, sliceWidth: this.cellSize, sliceHeight: this.cellSize };
        this.floorTile = { sliceX: 16, sliceY: 64, sliceWidth: this.cellSize, sliceHeight: this.cellSize };
        this.floorHole = { sliceX: 96, sliceY: 144, sliceWidth: this.cellSize, sliceHeight: this.cellSize };
        this.scale = scale;
    }
    getSpec() {
        const tw = { spriteData: this.topWall, passable: false, weight: 0 };
        const mw = { spriteData: this.midWall, passable: false, weight: 0 };
        const rw = { spriteData: this.rightWall, passable: false, weight: 0 };
        const lw = { spriteData: this.leftWall, passable: false, weight: 0 };
        const bw = { spriteData: this.bottomWall, passable: false, weight: 0 };
        const ft = { spriteData: this.floorTile, passable: true, weight: 0 };
        const rc = { spriteData: this.bottomRCornerWall, passable: false, weight: 0 };
        const tc = { spriteData: this.topRCornerWall, passable: false, weight: 0 };
        const er = { spriteData: this.sideWallEndRight, passable: false, weight: 0 };
        const el = { spriteData: this.sideWallEndLeft, passable: false, weight: 0 };
        const hl = { spriteData: this.floorHole, passable: false, weight: 0 };
        let nl = null;
        return [
            [nl, nl, nl, tw, tw, tw, tw, tw, tw, tw, tw, tw, tw, nl],
            [nl, nl, rw, mw, mw, mw, mw, mw, mw, mw, mw, mw, mw, lw],
            [nl, nl, rw, ft, ft, ft, ft, ft, ft, ft, ft, ft, ft, lw],
            [nl, nl, rw, ft, ft, ft, ft, ft, ft, ft, ft, ft, ft, lw],
            [nl, nl, rw, ft, hl, ft, hl, ft, ft, ft, hl, ft, ft, lw, mw, mw, mw],
            [nl, nl, rw, ft, ft, hl, hl, ft, ft, ft, hl, ft, ft, ft, ft, ft, ft],
            [nl, nl, rw, ft, ft, hl, hl, ft, hl, ft, hl, ft, ft, ft, ft, ft, ft],
            [nl, nl, rw, ft, hl, ft, hl, ft, hl, ft, ft, ft, ft, ft, ft, ft, ft],
            [nl, nl, rw, ft, ft, ft, ft, ft, hl, ft, hl, hl, hl, lw, bw, bw, bw],
            [nl, nl, rw, ft, ft, ft, ft, ft, hl, ft, ft, ft, ft, lw],
            [nl, nl, rw, ft, ft, ft, ft, ft, ft, ft, ft, ft, ft, lw],
            [nl, nl, er, bw, bw, bw, bw, bw, bw, bw, bw, bw, bw, el]
        ];
    }
}
//# sourceMappingURL=Scene1TerrainSpec.js.map