import { Component } from "../../GameEngine/Components/Component";
import { GameObject } from "../../GameEngine/Core/GameObject";
import { GameManager } from "../Components/GameManager";

export class GameManagerObject extends GameObject {

    public constructor(id: string) {
        super(id, 0, 0, 0, 0);

        let gameManagerComponents: Component[] = [];
        
        let gameManager = GameManager.createInstance(this);
        gameManagerComponents.push(gameManager);

        this.setComponents(gameManagerComponents);
    }
}