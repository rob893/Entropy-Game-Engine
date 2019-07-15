import { GameObject } from "../../GameEngine/Core/GameObject";
import { Component } from "../../GameEngine/Components/Component";
import { RectangleCollider } from "../../GameEngine/Components/RectangleCollider";
import TrumpIdleSprite from "../../assets/trump_idle.png";
import { Animation } from "../../GameEngine/Core/Animation";
import { Animator } from "../../GameEngine/Components/Animator";

export class Trump extends GameObject {

    public constructor(id: string) {
        super(id, 400, 280, 75, 75);

        let computerComponents: Component[] = [];
        
        computerComponents.push(new RectangleCollider(this));

        let initialAnimation = new Animation(TrumpIdleSprite, 10, 4, 0.1, [4]);
        computerComponents.push(new Animator(this, initialAnimation));

        this.setComponents(computerComponents);
    }
}