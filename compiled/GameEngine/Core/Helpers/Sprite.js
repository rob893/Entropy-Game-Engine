export class Sprite {
    constructor(spriteSheetUrl, locationX, loctationY, spriteWidth, spriteHeight) {
        this.isReady = false;
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
    get image() {
        return this.spriteImage;
    }
    get width() {
        return this.spriteWidth;
    }
    get height() {
        return this.spriteHeight;
    }
    get ready() {
        return this.isReady;
    }
}
//# sourceMappingURL=Sprite.js.map