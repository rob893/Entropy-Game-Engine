import SpriteSheet from '../Assets/Images/DungeonTileset.png';
import { SpriteData, TerrainSpec, TerrainCell } from '@rherber/typescript-game-engine';

export class Scene1TerrainSpec implements TerrainSpec {
    public readonly cellSize: number = 16;
    public readonly scale: number = 1;
    public readonly spriteSheetUrl: string = SpriteSheet;

    private readonly topWall: SpriteData = {
        sliceX: 16,
        sliceY: 0,
        sliceWidth: this.cellSize,
        sliceHeight: this.cellSize
    };
    private readonly midWall: SpriteData = {
        sliceX: 16,
        sliceY: 16,
        sliceWidth: this.cellSize,
        sliceHeight: this.cellSize
    };
    private readonly rightWall: SpriteData = {
        sliceX: 0,
        sliceY: 128,
        sliceWidth: this.cellSize,
        sliceHeight: this.cellSize
    };
    private readonly leftWall: SpriteData = {
        sliceX: 16,
        sliceY: 128,
        sliceWidth: this.cellSize,
        sliceHeight: this.cellSize
    };
    private readonly bottomWall: SpriteData = {
        sliceX: 36,
        sliceY: 124,
        sliceWidth: this.cellSize,
        sliceHeight: this.cellSize
    };
    //private readonly bottomRCornerWall: ISpriteData = { sliceX: 48, sliceY: 124, sliceWidth: this.cellSize, sliceHeight: this.cellSize };
    //private readonly topRCornerWall: ISpriteData = { sliceX: 48, sliceY: 144, sliceWidth: this.cellSize, sliceHeight: this.cellSize };
    private readonly sideWallEndRight: SpriteData = {
        sliceX: 0,
        sliceY: 144,
        sliceWidth: this.cellSize,
        sliceHeight: this.cellSize
    };
    private readonly sideWallEndLeft: SpriteData = {
        sliceX: 16,
        sliceY: 144,
        sliceWidth: this.cellSize,
        sliceHeight: this.cellSize
    };
    private readonly floorTile: SpriteData = {
        sliceX: 16,
        sliceY: 64,
        sliceWidth: this.cellSize,
        sliceHeight: this.cellSize
    };
    private readonly floorHole: SpriteData = {
        sliceX: 96,
        sliceY: 144,
        sliceWidth: this.cellSize,
        sliceHeight: this.cellSize
    };

    public constructor(scale: number = 1) {
        this.scale = scale;
    }

    public getSpec(): (TerrainCell | null)[][] {
        const tw: TerrainCell = { spriteData: this.topWall, passable: false, weight: 0 };
        const mw: TerrainCell = { spriteData: this.midWall, passable: false, weight: 0 };
        const rw: TerrainCell = { spriteData: this.rightWall, passable: false, weight: 0 };
        const lw: TerrainCell = { spriteData: this.leftWall, passable: false, weight: 0 };
        const bw: TerrainCell = { spriteData: this.bottomWall, passable: false, weight: 0 };
        const ft: TerrainCell = { spriteData: this.floorTile, passable: true, weight: 0 };
        //const rc: ITerrainCell = { spriteData: this.bottomRCornerWall, passable: false, weight: 0 };
        //const tc: ITerrainCell = { spriteData: this.topRCornerWall, passable: false, weight: 0 };
        const er: TerrainCell = { spriteData: this.sideWallEndRight, passable: false, weight: 0 };
        const el: TerrainCell = { spriteData: this.sideWallEndLeft, passable: false, weight: 0 };
        const hl: TerrainCell = { spriteData: this.floorHole, passable: false, weight: 0 };
        const nl: TerrainCell | null = null;

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
