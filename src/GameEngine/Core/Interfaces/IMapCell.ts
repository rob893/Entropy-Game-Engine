import { ISpriteData } from "./ISpriteData";

export interface IMapCell {
    passable: boolean;
    weight: number;
    spriteData: ISpriteData;
}