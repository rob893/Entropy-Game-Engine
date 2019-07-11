/// <reference path="Motor.ts" />

class PlayerMotor extends Motor {

    private movingUp: boolean = false;
    private movingDown: boolean = false;
    private movingRight: boolean = false;
    private movingLeft: boolean = false;


    public constructor(gameObject: GameObject) {
        super("PlayerMotor", gameObject);

        document.addEventListener('keydown', () => this.onKeyDown(<KeyboardEvent>event));
        document.addEventListener('keyup', () => this.onKeyUp(<KeyboardEvent>event));
    }

    protected handleOutOfBounds(): void {
        if(this.transform.position.y <= 0) {
            this.transform.position.y = 0;
        }
        else if(this.transform.position.y + this.transform.height >= this.gameCanvas.height) {
            this.transform.position.y = this.gameCanvas.height - this.transform.height;
        }

        if(this.transform.position.x <= 0) {
            this.transform.position.x = 0;
        }
        else if(this.transform.position.x + this.transform.width >= this.gameCanvas.width) {
            this.transform.position.x = this.gameCanvas.width - this.transform.width;
        }
    }

    protected move(): void {
        this.xVelocity = 0;
        this.yVelocity = 0;
        
        if (this.movingUp) {
            this.yVelocity = -1;
        }
        else if (this.movingDown) {
            this.yVelocity = 1;
        }

        if (this.movingRight) {
            this.xVelocity = 1;
        }
        else if (this.movingLeft) {
            this.xVelocity = -1;
        }

        this.transform.translate(this.xVelocity, this.yVelocity, this.speed);
    }

    private jump(): void {
        
    }

    private onKeyDown(event: KeyboardEvent) {
        if (event.keyCode == Keys.UP) {
            this.movingUp = true;
            this.movingDown = false;
        }
        else if (event.keyCode == Keys.DOWN) {
            this.movingDown = true;
            this.movingUp = false;
        }

        if (event.keyCode == Keys.RIGHT) {
            this.movingRight = true;
            this.movingLeft = false;
        }
        else if (event.keyCode == Keys.LEFT) {
            this.movingRight = false;
            this.movingLeft = true;
        }
    }

    private onKeyUp(event: KeyboardEvent) {
        if (event.keyCode == Keys.UP) {
            this.movingUp = false;
        }
        else if (event.keyCode == Keys.DOWN) {
            this.movingDown = false;
        }

        if (event.keyCode == Keys.RIGHT) {
            this.movingRight = false;
        }
        else if (event.keyCode == Keys.LEFT) {
            this.movingLeft = false;
        }
    }
}