import { ISpriteData } from "./ISpriteData";

export interface ITerrainCell {
    passable: boolean;
    weight: number;
    spriteData: ISpriteData;
}