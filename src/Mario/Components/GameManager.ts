class GameManager extends Component {

    private static instance: GameManager;

    private player: Player;
    private playerRenderer: RectangleRenderer;


    private constructor(componentName: string, gameObject: GameObject) {
        super(componentName, gameObject);

        document.getElementById("print-button").addEventListener("click", () => this.printGameData());
        document.getElementById("pause-button").addEventListener("click", () => this.togglePause());
        document.getElementById("add-ball").addEventListener("click", () => this.testInstantiate());
    }

    public start(): void {
        this.player = GameEngine.Instance.getGameObjectById("player");

        try {
            this.playerRenderer = this.player.getComponent<RectangleRenderer>("RectangleRenderer");

            document.getElementById("white-button").addEventListener("click", () => this.setPlayerColor("white"));
            document.getElementById("red-button").addEventListener("click", () => this.setPlayerColor("red"));
            document.getElementById("blue-button").addEventListener("click", () => this.setPlayerColor("blue"));
            document.getElementById("green-button").addEventListener("click", () => this.setPlayerColor("green"));
        }
        catch{
            console.log("The player does not have a rectangle renderer!");
        }
    }

    public static get Instance(): GameManager {
        if(this.instance === null || this.instance === undefined) {
            throw new Error("GameManager has not been created yet. Use the createInstance method first.");
        }

        return this.instance;
    }

    public static createInstance(componentName: string, gameObject: GameObject): GameManager {
        if(this.instance === null || this.instance === undefined) {
            this.instance = new GameManager(componentName, gameObject);
            return this.instance;
        }
        
        throw new Error("More than one GameManager cannot be created!");
    }

    private togglePause(): void {
        GameEngine.Instance.togglePause();
    }

    private printGameData(): void {
        GameEngine.Instance.printGameData();
    }

    private testInstantiate(): void {
        GameEngine.Instance.instantiate(new Ball("ball2"));
    }

    private setPlayerColor(color: string): void {
        this.playerRenderer.setColor(color);
    }
}