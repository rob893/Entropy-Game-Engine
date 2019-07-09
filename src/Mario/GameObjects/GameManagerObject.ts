class GameManagerObject extends GameObject {

    public constructor(id: string) {
        super(id, 0, 0, 0, 0);

        let gameManagerComponents: Component[] = [];
        
        let gameManager = GameManager.createInstance(id, this);
        gameManagerComponents.push(gameManager);

        this.setComponents(gameManagerComponents);
    }
}