/// <reference path="./Component.ts" />

class Animator extends Component {

    private frameWidth: number = 0;
    private frameHeight: number = 0;
    private numberOfFrames: number = 0;
    private numberOfRows: number = 0;
    private frameIndex: number = 0;
    private framesPerAnimationFrame: number = 10;
    private animationFrameCount: number = 0;
    private spriteSheet: HTMLImageElement;
    private canvasContext: CanvasRenderingContext2D;
    private transform: Transform;
    private spriteReady: boolean;


    public constructor(gameObject: GameObject, spriteSheetURL: string, numberOfFrames: number, numberOfRows: number) {
        super(gameObject);
        this.spriteReady = false;
        this.spriteSheet = new Image();
        this.spriteSheet.src = spriteSheetURL;
        this.spriteSheet.onload = () => { this.spriteReady = true; };
        this.numberOfFrames = numberOfFrames;
        this.numberOfRows = numberOfRows;
    }

    public start(): void {
        this.canvasContext = this.gameObject.getGameCanvas().getContext("2d");
        this.transform = this.gameObject.getTransform();
    }

    public update(): void {
        this.drawSprite();
    }

    public setAnimationSpeed(numberOfFramesPerAnimationFrame: number) {
        this.framesPerAnimationFrame = numberOfFramesPerAnimationFrame;
    }

    private drawSprite(): void {
        
        if(!this.spriteReady) {
            return;
        }

        this.animationFrameCount++;

        if(this.animationFrameCount >= this.framesPerAnimationFrame) {
            this.frameIndex = (this.frameIndex + 1) % this.numberOfFrames;
            this.animationFrameCount = 0;
        }

        this.frameHeight = this.spriteSheet.height / this.numberOfRows;
        this.frameWidth = this.spriteSheet.width / this.numberOfFrames;

        this.canvasContext.drawImage(this.spriteSheet,
            this.frameIndex * this.frameWidth, 0,   // Start of slice
            this.frameWidth, this.frameHeight, // Size of slice
            this.transform.position.x, this.transform.position.y, this.transform.width, this.transform.height);
    }
}