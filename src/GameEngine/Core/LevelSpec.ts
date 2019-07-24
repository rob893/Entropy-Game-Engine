import { ISpriteData } from "./Interfaces/ISpriteData";

export abstract class LevelSpec {
    static readonly topWall: ISpriteData = { sliceX: 16, sliceY: 0, sliceWidth: 16, sliceHeight: 16  };
    static readonly midWall: ISpriteData = { sliceX: 16, sliceY: 16, sliceWidth: 16, sliceHeight: 16  };
    static readonly rightWall: ISpriteData = { sliceX: 0, sliceY: 128, sliceWidth: 16, sliceHeight: 16  };
    static readonly leftWall: ISpriteData = { sliceX: 16, sliceY: 128, sliceWidth: 16, sliceHeight: 16  };
    static readonly bottomWall: ISpriteData = { sliceX: 32, sliceY: 124, sliceWidth: 16, sliceHeight: 4 };
    static readonly floorTile: ISpriteData = { sliceX: 16, sliceY: 64, sliceWidth: 16, sliceHeight: 16 };


    public static getSpec(): ISpriteData[][] {
        let tw = LevelSpec.topWall;
        let mw = LevelSpec.midWall;
        let rw = LevelSpec.rightWall;
        let lw = LevelSpec.leftWall;
        let bw = LevelSpec.bottomWall;
        let ft = LevelSpec.floorTile;
        let nl = null;
        
        return [
            [nl, nl, nl, tw, tw, tw, tw, tw, nl],
            [tw, tw, tw, mw, mw, mw, mw, mw, lw],
            [mw, mw, mw, ft, ft, ft, ft, ft, lw],
            [ft, ft, ft, ft, ft, ft, ft, ft, lw],
            [ft, ft, ft, ft, ft, ft, ft, ft, lw],
            [bw, bw, rw, ft, ft, ft, ft, ft, lw],
            [nl, nl, nl, bw, bw, bw, bw, bw, nl]
        ];
    }
}