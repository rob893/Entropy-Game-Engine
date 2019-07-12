/// <reference path="Motor.ts" />

class BallMotor extends Motor {

    private playerCollider: RectangleCollider;
    private computerCollider: RectangleCollider;
    private collider: RectangleCollider;


    public constructor(gameObject: GameObject) {
        super(gameObject);

        this.reset();
    }

    public start(): void {
        super.start();
        
        this.collider = this.gameObject.getComponent<RectangleCollider>(RectangleCollider);
        this.playerCollider = GameEngine.Instance.getGameObjectById("player").getComponent<RectangleCollider>(RectangleCollider);
        this.computerCollider = GameEngine.Instance.getGameObjectById("computer").getComponent<RectangleCollider>(RectangleCollider);

        //this.collider.onCollided.add((other: RectangleCollider) => this.whoIHit(other));
    }

    public update(): void {
        super.update();
        
        this.handleCollisions();
    }

    private whoIHit(other: RectangleCollider): void {
        console.log("I hit " + other.gameObject.id);
    }

    protected handleOutOfBounds(): void {
        if(this.transform.position.y <= 0) {
            this.yVelocity *= -1;
        }
        else if(this.transform.position.y >= this.gameCanvas.height - this.transform.height) {
            this.yVelocity = Math.abs(this.yVelocity);
        }

        if(this.transform.position.x + this.transform.width <= 0) {
            this.reset();
        }
        else if(this.transform.position.x >= this.gameCanvas.width) {
            this.reset();
        }
    }

    protected move(): void {
        this.transform.translate(new Vector2(this.xVelocity, this.yVelocity).multiplyScalar(this.speed));
    }

    private reset(): void {
        this.transform.setPosition(345, 195);
        this.xVelocity = Math.random() < 0.5 ? -1 : 1;
        this.yVelocity = Math.random() < 0.5 ? -1 : 1;
        this.speed = 3;
    }

    private handleCollisions(): void {
        if(this.collider.detectCollision(this.playerCollider)) {
            this.xVelocity = 1;
            this.speed += 0.125;
        }
        else if(this.collider.detectCollision(this.computerCollider)) {
            this.xVelocity = -1;
            this.speed += 0.125;
        }
    }
}