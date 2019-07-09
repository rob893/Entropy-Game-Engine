class Player extends GameObject {

    public constructor(id: string) {
        super(id, 2, 175, 10, 50);

        let playerComponents: Component[] = [];
        
        playerComponents.push(new RectangleCollider(this));
        playerComponents.push(new PlayerMotor(this));
        //playerComponents.push(new RectangleRenderer(this, "white"));
        playerComponents.push(new Animator(this, "./src/Mario/Resources/mario.png", 4, 1)); //From where the out file is

        this.setComponents(playerComponents);
    }
}