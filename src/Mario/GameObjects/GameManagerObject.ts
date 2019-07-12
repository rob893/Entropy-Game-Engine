class GameManagerObject extends GameObject {

    public constructor(id: string) {
        super(id, 0, 0, 0, 0);

        let gameManagerComponents: Component[] = [];
        
        let gameManager = GameManager.createInstance(this);
        gameManagerComponents.push(gameManager);

        this.setComponents(gameManagerComponents);
    }
}