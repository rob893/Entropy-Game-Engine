import { ISpriteData } from "./Interfaces/ISpriteData";

export abstract class LevelSpec {
    static readonly topWall: ISpriteData = { sliceX: 16, sliceY: 0, sliceWidth: 16, sliceHeight: 16  };
    static readonly midWall: ISpriteData = { sliceX: 16, sliceY: 16, sliceWidth: 16, sliceHeight: 16  };
    static readonly rightWall: ISpriteData = { sliceX: 0, sliceY: 128, sliceWidth: 16, sliceHeight: 16  };
    static readonly leftWall: ISpriteData = { sliceX: 0, sliceY: 128, sliceWidth: 16, sliceHeight: 16  };
    static readonly bottomWall: ISpriteData = { sliceX: 16, sliceY: 0, sliceWidth: 16, sliceHeight: 16  };
    static readonly floorTile: ISpriteData = { sliceX: 16, sliceY: 64, sliceWidth: 16, sliceHeight: 16 };
}