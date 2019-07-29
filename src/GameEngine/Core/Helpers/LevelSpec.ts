import { ISpriteData } from "../Interfaces/ISpriteData";
import { IMapCell } from "../Interfaces/IMapCell";

export abstract class LevelSpec {
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
        const tw: IMapCell = { spriteData: LevelSpec.topWall, passable: false, weight: 0 };
        const mw: IMapCell = { spriteData: LevelSpec.midWall, passable: false, weight: 0 };
        const rw: IMapCell = { spriteData: LevelSpec.rightWall, passable: false, weight: 0 };
        const lw: IMapCell = { spriteData: LevelSpec.leftWall, passable: false, weight: 0 };
        const bw: IMapCell = { spriteData: LevelSpec.bottomWall, passable: false, weight: 0 };
        const ft: IMapCell = { spriteData: LevelSpec.floorTile, passable: true, weight: 0 };
        const rc: IMapCell = { spriteData: LevelSpec.bottomRCornerWall, passable: false, weight: 0 };
        const tc: IMapCell = { spriteData: LevelSpec.topRCornerWall, passable: false, weight: 0 };
        const er: IMapCell = { spriteData: LevelSpec.sideWallEndRight, passable: false, weight: 0 };
        const el: IMapCell = { spriteData: LevelSpec.sideWallEndLeft, passable: false, weight: 0 };
        const hl: IMapCell = { spriteData: LevelSpec.floorHole, passable: false, weight: 0 };
        let nl = null;
        
        return [
            [nl, nl, nl, tw, tw, tw, tw, tw, tw, tw, tw, tw, tw, nl],
            [nl, nl, rw, mw, mw, mw, mw, mw, mw, mw, mw, mw, mw, lw],
            [nl, nl, rw, ft, ft, ft, ft, ft, ft, ft, ft, ft, ft, lw],
            [nl, nl, rw, ft, ft, ft, ft, ft, ft, ft, ft, ft, ft, lw],
            [nl, nl, rw, ft, ft, ft, hl, ft, ft, ft, hl, ft, ft, lw, mw, mw, mw],
            [nl, nl, rw, ft, ft, ft, hl, ft, ft, ft, hl, ft, ft, ft, ft, ft, ft],
            [nl, nl, rw, ft, ft, ft, hl, ft, hl, ft, hl, ft, ft, ft, ft, ft, ft],
            [nl, nl, rw, ft, ft, ft, hl, ft, hl, ft, ft, ft, ft, ft, ft, ft, ft],
            [nl, nl, rw, ft, ft, ft, ft, ft, hl, ft, hl, hl, hl, lw, bw, bw, bw],
            [nl, nl, rw, ft, ft, ft, ft, ft, hl, ft, ft, ft, ft, lw],
            [nl, nl, rw, ft, ft, ft, ft, ft, ft, ft, ft, ft, ft, lw],
            [nl, nl, er, bw, bw, bw, bw, bw, bw, bw, bw, bw, bw, el]
        ];
    }
}