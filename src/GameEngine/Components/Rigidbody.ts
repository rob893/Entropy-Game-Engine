class Rigidbody extends Component {

    private transform: Transform;


    public constructor(gameObject: GameObject) {
        super("Rigidbody", gameObject);

        this.transform = gameObject.getTransform();
        Physics.Instance.addRigidbody(this);
    }

    public addGravity(force: number): void {
        this.transform.translate(0, 1, force);
    }
}