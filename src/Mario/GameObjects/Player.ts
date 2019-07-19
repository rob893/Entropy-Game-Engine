import { GameObject } from "../../GameEngine/Core/GameObject";
import { Component } from "../../GameEngine/Components/Component";
import { RectangleCollider } from "../../GameEngine/Components/RectangleCollider";
import { PlayerMotor } from "../Components/PlayerMotor";
import { Rigidbody } from "../../GameEngine/Components/Rigidbody";
import { Animator } from "../../GameEngine/Components/Animator";
import MarioSprite from "../../assets/images/mario.png";
import { Animation } from "../../GameEngine/Core/Animation";
import { PlayerHealth } from "../Components/PlayerHealth";

export class Player extends GameObject {

    public constructor(id: string) {
        super(id, 2, 175);

        let playerComponents: Component[] = [];
        
        playerComponents.push(new RectangleCollider(this, 50, 50));
        playerComponents.push(new RectangleCollider(this, 10, 10));
        playerComponents.push(new PlayerMotor(this));
        playerComponents.push(new Rigidbody(this));
        playerComponents.push(new PlayerHealth(this));
        
        let initialAnimation = new Animation(MarioSprite, 4, 1, 0.1);

        playerComponents.push(new Animator(this, 50, 50, initialAnimation));


        this.setComponents(playerComponents);
    }
}