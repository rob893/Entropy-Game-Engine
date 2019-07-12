class Transform extends Component {

    public width: number = 0;
    public height: number = 0;
    //Position is the top left of the agent with width growing right and height growing down.
    public readonly position: Vector2;
    //Rotation in radians
    public rotation: number;

    private readonly onMove = new LiteEvent<void>();

    
    public constructor(gameObject: GameObject, x: number, y: number, width: number, height: number) {
        super("Transform", gameObject);
        this.width = width;
        this.height = height;
        this.position = new Vector2(x, y);
        this.rotation = 0;
    }

    public translate(xVelocity: number, yVelocity: number, speed: number = 1): void {
        this.position.x += xVelocity * Time.DeltaTime; //* speed;
        this.position.y += yVelocity * Time.DeltaTime; //* speed;
        this.onMove.trigger();
    }

    public setPosition(x: number, y: number): void {
        this.position.x = x;
        this.position.y = y;
        this.onMove.trigger();
    }

    public get onMoved() { 
        return this.onMove.expose(); 
    }

    public getCenter(): Vector2 {
        return new Vector2(this.position.x + (this.width / 2), this.position.y + (this.height / 2));
    }

    public getBottomCenter(): Vector2 {
        return new Vector2(this.position.x + (this.width / 2), this.position.y + this.height);
    }
}