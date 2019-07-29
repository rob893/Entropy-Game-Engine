import { ISpriteData } from "../Interfaces/ISpriteData";
import { IMapCell } from "../Interfaces/IMapCell";
import { ITerrainSpec } from "../Interfaces/ITerrainSpec";

export class TerrainSpec implements ITerrainSpec {
    
    public readonly cellSize: number = 16;
    
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


    public getSpec(): IMapCell[][] {
        const tw: IMapCell = { spriteData: this.topWall, passable: false, weight: 0 };
        const mw: IMapCell = { spriteData: this.midWall, passable: false, weight: 0 };
        const rw: IMapCell = { spriteData: this.rightWall, passable: false, weight: 0 };
        const lw: IMapCell = { spriteData: this.leftWall, passable: false, weight: 0 };
        const bw: IMapCell = { spriteData: this.bottomWall, passable: false, weight: 0 };
        const ft: IMapCell = { spriteData: this.floorTile, passable: true, weight: 0 };
        const rc: IMapCell = { spriteData: this.bottomRCornerWall, passable: false, weight: 0 };
        const tc: IMapCell = { spriteData: this.topRCornerWall, passable: false, weight: 0 };
        const er: IMapCell = { spriteData: this.sideWallEndRight, passable: false, weight: 0 };
        const el: IMapCell = { spriteData: this.sideWallEndLeft, passable: false, weight: 0 };
        const hl: IMapCell = { spriteData: this.floorHole, passable: false, weight: 0 };
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