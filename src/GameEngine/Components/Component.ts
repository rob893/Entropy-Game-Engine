abstract class Component {

    public readonly gameObject: GameObject;


    public constructor(gameObject: GameObject) {
        this.gameObject = gameObject;
    }

    public start(): void {};

    public update(): void {};
}