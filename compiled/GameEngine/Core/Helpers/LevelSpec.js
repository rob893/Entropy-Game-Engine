export class LevelSpec {
    static getSpec() {
        let tw = { spriteData: LevelSpec.topWall, passable: false, terrainWeight: 0 };
        let mw = { spriteData: LevelSpec.midWall, passable: false, terrainWeight: 0 };
        let rw = { spriteData: LevelSpec.rightWall, passable: false, terrainWeight: 0 };
        let lw = { spriteData: LevelSpec.leftWall, passable: false, terrainWeight: 0 };
        let bw = { spriteData: LevelSpec.bottomWall, passable: false, terrainWeight: 0 };
        let ft = { spriteData: LevelSpec.floorTile, passable: true, terrainWeight: 0 };
        const rc = { spriteData: LevelSpec.bottomRCornerWall, passable: false, terrainWeight: 0 };
        const tc = { spriteData: LevelSpec.topRCornerWall, passable: false, terrainWeight: 0 };
        const er = { spriteData: LevelSpec.sideWallEndRight, passable: false, terrainWeight: 0 };
        const el = { spriteData: LevelSpec.sideWallEndLeft, passable: false, terrainWeight: 0 };
        let nl = null;
        return [
            [nl, nl, nl, tw, tw, tw, tw, tw, tw, tw, tw, tw, tw, nl],
            [nl, nl, rw, mw, mw, mw, mw, mw, mw, mw, mw, mw, mw, lw],
            [nl, nl, rw, ft, ft, ft, ft, ft, ft, ft, ft, ft, ft, lw],
            [nl, nl, rw, ft, ft, ft, ft, ft, ft, ft, ft, ft, ft, lw],
            [nl, nl, rw, ft, ft, ft, ft, ft, ft, ft, ft, ft, ft, lw, mw, mw, mw],
            [nl, nl, rw, ft, ft, ft, ft, ft, ft, ft, ft, ft, ft, ft, ft, ft, ft],
            [nl, nl, rw, ft, ft, ft, ft, ft, ft, ft, ft, ft, ft, ft, ft, ft, ft],
            [nl, nl, rw, ft, ft, ft, ft, ft, ft, ft, ft, ft, ft, ft, ft, ft, ft],
            [nl, nl, rw, ft, ft, ft, ft, ft, ft, ft, ft, ft, ft, lw, bw, bw, bw],
            [nl, nl, rw, ft, ft, ft, ft, ft, ft, ft, ft, ft, ft, lw],
            [nl, nl, rw, ft, ft, ft, ft, ft, ft, ft, ft, ft, ft, lw],
            [nl, nl, er, bw, bw, bw, bw, bw, bw, bw, bw, bw, bw, el]
        ];
    }
}
LevelSpec.topWall = { sliceX: 16, sliceY: 0, sliceWidth: 16, sliceHeight: 16 };
LevelSpec.midWall = { sliceX: 16, sliceY: 16, sliceWidth: 16, sliceHeight: 16 };
LevelSpec.rightWall = { sliceX: 0, sliceY: 128, sliceWidth: 16, sliceHeight: 16 };
LevelSpec.leftWall = { sliceX: 16, sliceY: 128, sliceWidth: 16, sliceHeight: 16 };
LevelSpec.bottomWall = { sliceX: 36, sliceY: 124, sliceWidth: 16, sliceHeight: 16 };
LevelSpec.bottomRCornerWall = { sliceX: 48, sliceY: 124, sliceWidth: 16, sliceHeight: 16 };
LevelSpec.topRCornerWall = { sliceX: 48, sliceY: 144, sliceWidth: 16, sliceHeight: 16 };
LevelSpec.sideWallEndRight = { sliceX: 0, sliceY: 144, sliceWidth: 16, sliceHeight: 16 };
LevelSpec.sideWallEndLeft = { sliceX: 16, sliceY: 144, sliceWidth: 16, sliceHeight: 16 };
LevelSpec.floorTile = { sliceX: 16, sliceY: 64, sliceWidth: 16, sliceHeight: 16 };
//# sourceMappingURL=LevelSpec.js.map