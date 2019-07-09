abstract class Motor extends Component {

    protected transform: Transform;
    protected gameCanvas: HTMLCanvasElement;
    protected xVelocity: number = 0;
    protected yVelocity: number = 0;
    protected speed: number = 5


    public constructor(componentName: string, gameObject: GameObject) {
        super(componentName, gameObject);
        this.transform = gameObject.getTransform();
    }

    public start(): void {
        this.gameCanvas = this.gameObject.getGameCanvas();
    }

    public update(): void {
        this.move();
        this.handleOutOfBounds();
    }

    protected abstract move(): void;

    protected abstract handleOutOfBounds(): void;
}