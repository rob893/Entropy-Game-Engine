import { SpriteData } from './SpriteData';

export interface TerrainCell {
  passable: boolean;
  weight: number;
  spriteData: SpriteData;
}
