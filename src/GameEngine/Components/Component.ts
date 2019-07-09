abstract class Component {

    public readonly gameObject: GameObject;
    public readonly componentName: string;


    public constructor(componentName: string, gameObject: GameObject) {
        this.gameObject = gameObject;
        this.componentName = componentName;
    }

    public start(): void {};

    public update(): void {};
}