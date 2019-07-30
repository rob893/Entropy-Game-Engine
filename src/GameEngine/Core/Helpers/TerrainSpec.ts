import { ISpriteData } from "../Interfaces/ISpriteData";
import { ITerrainCell } from "../Interfaces/ITerrainCell";
import { ITerrainSpec } from "../Interfaces/ITerrainSpec";
import SpriteSheet from "../../../assets/images/DungeonTileset.png";


export class TerrainSpec implements ITerrainSpec {
    
    public readonly cellSize: number = 16;
    public readonly scale: number = 1;
    public readonly spriteSheetUrl: string = SpriteSheet;
    
    private readonly topWall: ISpriteData = { sliceX: 16, sliceY: 0, sliceWidth: this.cellSize, sliceHeight: this.cellSize  };
    private readonly midWall: ISpriteData = { sliceX: 16, sliceY: 16, sliceWidth: this.cellSize, sliceHeight: this.cellSize  };
    private readonly rightWall: ISpriteData = { sliceX: 0, sliceY: 128, sliceWidth: this.cellSize, sliceHeight: this.cellSize  };
    private readonly leftWall: ISpriteData = { sliceX: 16, sliceY: 128, sliceWidth: this.cellSize, sliceHeight: this.cellSize  };
    private readonly bottomWall: ISpriteData = { sliceX: 36, sliceY: 124, sliceWidth: this.cellSize, sliceHeight: this.cellSize };
    private readonly bottomRCornerWall: ISpriteData = { sliceX: 48, sliceY: 124, sliceWidth: this.cellSize, sliceHeight: this.cellSize };
    private readonly topRCornerWall: ISpriteData = { sliceX: 48, sliceY: 144, sliceWidth: this.cellSize, sliceHeight: this.cellSize };
    private readonly sideWallEndRight: ISpriteData = { sliceX: 0, sliceY: 144, sliceWidth: this.cellSize, sliceHeight: this.cellSize };
    private readonly sideWallEndLeft: ISpriteData = { sliceX: 16, sliceY: 144, sliceWidth: this.cellSize, sliceHeight: this.cellSize };
    private readonly floorTile: ISpriteData = { sliceX: 16, sliceY: 64, sliceWidth: this.cellSize, sliceHeight: this.cellSize };
    private readonly floorHole: ISpriteData = { sliceX: 96, sliceY: 144, sliceWidth: this.cellSize, sliceHeight: this.cellSize };


    public constructor(scale: number = 1) {
        this.scale = scale;
    }

    public getSpec(): ITerrainCell[][] {
        const tw: ITerrainCell = { spriteData: this.topWall, passable: false, weight: 0 };
        const mw: ITerrainCell = { spriteData: this.midWall, passable: false, weight: 0 };
        const rw: ITerrainCell = { spriteData: this.rightWall, passable: false, weight: 0 };
        const lw: ITerrainCell = { spriteData: this.leftWall, passable: false, weight: 0 };
        const bw: ITerrainCell = { spriteData: this.bottomWall, passable: false, weight: 0 };
        const ft: ITerrainCell = { spriteData: this.floorTile, passable: true, weight: 0 };
        const rc: ITerrainCell = { spriteData: this.bottomRCornerWall, passable: false, weight: 0 };
        const tc: ITerrainCell = { spriteData: this.topRCornerWall, passable: false, weight: 0 };
        const er: ITerrainCell = { spriteData: this.sideWallEndRight, passable: false, weight: 0 };
        const el: ITerrainCell = { spriteData: this.sideWallEndLeft, passable: false, weight: 0 };
        const hl: ITerrainCell = { spriteData: this.floorHole, passable: false, weight: 0 };
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