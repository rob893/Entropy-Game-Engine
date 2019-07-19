import { GameObject } from "../../GameEngine/Core/GameObject";
import { Component } from "../../GameEngine/Components/Component";
import { RectangleCollider } from "../../GameEngine/Components/RectangleCollider";
import TrumpIdleSprite from "../../assets/images/trump_idle.png";
import { Animation } from "../../GameEngine/Core/Animation";
import { Animator } from "../../GameEngine/Components/Animator";
import { TrumpMotor } from "../Components/TrumpMotor";
import { AudioSource } from "../../GameEngine/Components/AudioSource";

export class Trump extends GameObject {

    public constructor(id: string) {
        super(id, 400, 355);

        let components: Component[] = [];
        
        components.push(new RectangleCollider(this, 60, 60));
        //components.push(new TrumpMotor(this));

        let initialAnimation = new Animation(TrumpIdleSprite, 10, 4, 0.1, [4]);
        components.push(new Animator(this, 75, 75, initialAnimation));
        //components.push(new AudioSource(this));

        this.setComponents(components);
    }
}