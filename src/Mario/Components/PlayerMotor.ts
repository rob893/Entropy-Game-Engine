/// <reference path="Motor.ts" />

class PlayerMotor extends Motor {

    private movingUp: boolean = false;
    private movingDown: boolean = false;
    private movingRight: boolean = false;
    private movingLeft: boolean = false;


    public constructor(gameObject: GameObject) {
        super(gameObject);

        document.addEventListener('keydown', () => this.onKeyDown(<KeyboardEvent>event));
        document.addEventListener('keyup', () => this.onKeyUp(<KeyboardEvent>event));
    }

    public get isMoving(): boolean { 
        return this.xVelocity !== 0 || this.yVelocity !== 0;
    }

    protected handleOutOfBounds(): void {
        if (this.transform.position.y <= 0) {
            this.transform.position.y = 0;
        }
        else if (this.transform.position.y + this.transform.height >= this.gameCanvas.height) {
            this.transform.position.y = this.gameCanvas.height - this.transform.height;
        }

        if (this.transform.position.x <= 0) {
            this.transform.position.x = 0;
        }
        else if (this.transform.position.x + this.transform.width >= this.gameCanvas.width) {
            this.transform.position.x = this.gameCanvas.width - this.transform.width;
        }
    }

    protected move(): void {
        if (this.movingUp) {
            this.yVelocity = 1;
        }
        else if (this.movingDown) {
            this.yVelocity = -1;
        }
        else {
            this.yVelocity = 0;
        }

        if (this.movingRight) {
            this.xVelocity = 1;
        }
        else if (this.movingLeft) {
            this.xVelocity = -1;
        }
        else {
            this.xVelocity = 0;
        }
        
        if (this.isMoving) {
            this.transform.translate(new Vector2(this.xVelocity, this.yVelocity).multiplyScalar(this.speed));
        }
    }

    private jump(): void {
        
    }

    private onKeyDown(event: KeyboardEvent) {
        if (event.keyCode == Keys.UP || event.keyCode == Keys.W) {
            this.movingUp = true;
            this.movingDown = false;
        }
        else if (event.keyCode == Keys.DOWN || event.keyCode == Keys.S) {
            this.movingDown = true;
            this.movingUp = false;
        }

        if (event.keyCode == Keys.RIGHT || event.keyCode == Keys.D) {
            this.movingRight = true;
            this.movingLeft = false;
        }
        else if (event.keyCode == Keys.LEFT || event.keyCode == Keys.A) {
            this.movingRight = false;
            this.movingLeft = true;
        }
    }

    private onKeyUp(event: KeyboardEvent) {
        if (event.keyCode == Keys.UP || event.keyCode == Keys.W) {
            this.movingUp = false;
        }
        else if (event.keyCode == Keys.DOWN || event.keyCode == Keys.S) {
            this.movingDown = false;
        }

        if (event.keyCode == Keys.RIGHT || event.keyCode == Keys.D) {
            this.movingRight = false;
        }
        else if (event.keyCode == Keys.LEFT || event.keyCode == Keys.A) {
            this.movingLeft = false;
        }
    }
}