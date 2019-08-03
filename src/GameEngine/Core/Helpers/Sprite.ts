export class Sprite {

    private readonly spriteWidth: number;
    private readonly spriteHeight: number;

    private spriteImage: HTMLImageElement;
    private isReady: boolean = false;


    public constructor(spriteSheetUrl: string, locationX: number, loctationY: number, spriteWidth: number, spriteHeight: number) {
        this.spriteWidth = spriteWidth;
        this.spriteHeight = spriteHeight;

        const spriteSheet = new Image();
        spriteSheet.src = spriteSheetUrl;
        spriteSheet.onload = () => {
            const canvas = document.createElement('canvas');
                        
            canvas.width = spriteWidth;
            canvas.height = spriteHeight;

            const context = canvas.getContext('2d');
            context.drawImage(spriteSheet, locationX, loctationY, spriteWidth, spriteHeight, 0, 0, canvas.width, canvas.height);
            const image = new Image();
            image.src = canvas.toDataURL();
            image.onload = () => {
                this.spriteImage = image;
                this.isReady = true;
            };
        };
    }

    public get image(): HTMLImageElement {
        return this.spriteImage;
    }

    public get width(): number {
        return this.spriteWidth;
    }

    public get height(): number {
        return this.spriteHeight;
    }

    public get ready(): boolean {
        return this.isReady;
    }
}