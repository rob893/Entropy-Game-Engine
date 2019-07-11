class Rigidbody extends Component {

    private transform: Transform;
    private mass: number;
    private velocity: Vector2;
    private acceleration: Vector2;


    public constructor(gameObject: GameObject, mass = 1) {
        super("Rigidbody", gameObject);

        this.transform = gameObject.getTransform();
        this.mass = mass;
        this.velocity = new Vector2(0, 0);
        this.acceleration = new Vector2(0, 0);
        Physics.Instance.addRigidbody(this);
    }

    public update(): void {
        this.acceleration.x = 
        this.transform.translate(this.velocity.x, this.velocity.y);
    }

    public addForce(force: Vector2): void {
        this.acceleration.x = force * Math.sin(this.transform.rotation);
    }

    public addGravity(force: number): void {
        this.transform.translate(0, 1, force);
    }
}