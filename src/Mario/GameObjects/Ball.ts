class Ball extends GameObject {

    public constructor(id: string) {
        super(id, 345, 195, 10, 10);

        let ballComponents: Component[] = [];
        
        ballComponents.push(new RectangleCollider(this));
        ballComponents.push(new BallMotor(this));
        ballComponents.push(new RectangleRenderer(this, "white"));

        this.setComponents(ballComponents);
    }
}