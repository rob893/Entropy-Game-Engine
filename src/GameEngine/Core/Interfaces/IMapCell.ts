import { ISpriteData } from "./ISpriteData";

export interface IMapCell {
    spriteData: ISpriteData;
    passable: boolean;
    terrainWeight: number;
}