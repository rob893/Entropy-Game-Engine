import { ISpriteData } from "../Interfaces/ISpriteData";
import { IMapCell } from "../Interfaces/IMapCell";

export abstract class TerrainSpec {
    static readonly topWall: ISpriteData = { sliceX: 16, sliceY: 0, sliceWidth: 16, sliceHeight: 16  };
    static readonly midWall: ISpriteData = { sliceX: 16, sliceY: 16, sliceWidth: 16, sliceHeight: 16  };
    static readonly rightWall: ISpriteData = { sliceX: 0, sliceY: 128, sliceWidth: 16, sliceHeight: 16  };
    static readonly leftWall: ISpriteData = { sliceX: 16, sliceY: 128, sliceWidth: 16, sliceHeight: 16  };
    static readonly bottomWall: ISpriteData = { sliceX: 36, sliceY: 124, sliceWidth: 16, sliceHeight: 16 };
    static readonly bottomRCornerWall: ISpriteData = { sliceX: 48, sliceY: 124, sliceWidth: 16, sliceHeight: 16 };
    static readonly topRCornerWall: ISpriteData = { sliceX: 48, sliceY: 144, sliceWidth: 16, sliceHeight: 16 };
    static readonly sideWallEndRight: ISpriteData = { sliceX: 0, sliceY: 144, sliceWidth: 16, sliceHeight: 16 };
    static readonly sideWallEndLeft: ISpriteData = { sliceX: 16, sliceY: 144, sliceWidth: 16, sliceHeight: 16 };
    static readonly floorTile: ISpriteData = { sliceX: 16, sliceY: 64, sliceWidth: 16, sliceHeight: 16 };
    static readonly floorHole: ISpriteData = { sliceX: 96, sliceY: 144, sliceWidth: 16, sliceHeight: 16 };


    public static getSpec(): IMapCell[][] {
        const tw: IMapCell = { spriteData: TerrainSpec.topWall, passable: false, weight: 0 };
        const mw: IMapCell = { spriteData: TerrainSpec.midWall, passable: false, weight: 0 };
        const rw: IMapCell = { spriteData: TerrainSpec.rightWall, passable: false, weight: 0 };
        const lw: IMapCell = { spriteData: TerrainSpec.leftWall, passable: false, weight: 0 };
        const bw: IMapCell = { spriteData: TerrainSpec.bottomWall, passable: false, weight: 0 };
        const ft: IMapCell = { spriteData: TerrainSpec.floorTile, passable: true, weight: 0 };
        const rc: IMapCell = { spriteData: TerrainSpec.bottomRCornerWall, passable: false, weight: 0 };
        const tc: IMapCell = { spriteData: TerrainSpec.topRCornerWall, passable: false, weight: 0 };
        const er: IMapCell = { spriteData: TerrainSpec.sideWallEndRight, passable: false, weight: 0 };
        const el: IMapCell = { spriteData: TerrainSpec.sideWallEndLeft, passable: false, weight: 0 };
        const hl: IMapCell = { spriteData: TerrainSpec.floorHole, passable: false, weight: 0 };
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