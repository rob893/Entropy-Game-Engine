import { IRenderableBackground } from "./Interfaces/IRenderableBackground";
import { Vector2 } from "./Vector2";
import { Sprite } from "./Sprite";

export class FloorTile implements IRenderableBackground {
    
    private readonly tileSize: number;
    private readonly tileImage: Sprite;
    private readonly topLeftPosition: Vector2;

    
    public constructor(imageSprite: Sprite, tileSize: number, topLeftPosition: Vector2) {
        this.tileSize = tileSize;
        this.topLeftPosition = topLeftPosition;
        this.tileImage = imageSprite;
    }
    
    public renderBackground(context: CanvasRenderingContext2D): void {
        if (this.tileImage.ready) {
            context.drawImage(this.tileImage.image, this.topLeftPosition.x, this.topLeftPosition.y, this.tileSize, this.tileSize);
        }
    }
}