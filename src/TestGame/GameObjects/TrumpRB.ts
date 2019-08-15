import { GameObject } from '../../GameEngine/Core/GameObject';
import { Component } from '../../GameEngine/Components/Component';
import { RectangleCollider } from '../../GameEngine/Components/RectangleCollider';
import TrumpIdleSprite from '../Assets/Images/trump_idle.png';
import { Animation } from '../../GameEngine/Core/Helpers/Animation';
import { Animator } from '../../GameEngine/Components/Animator';
import { Rigidbody } from '../../GameEngine/Components/Rigidbody';
import { PhysicalMaterial } from '../../GameEngine/Core/Helpers/PhysicalMaterial';
import { Vector2 } from '../../GameEngine/Core/Helpers/Vector2';

export class TrumpRB extends GameObject {

    public constructor(id: string, startX: number, startY: number) {
        super(id, startX, startY);

        const components: Component[] = [];

        const collider = new RectangleCollider(this, 60, 60, 0, -5);
        collider.physicalMaterial = PhysicalMaterial.bouncy;
        components.push(collider);

        const rb = new Rigidbody(this);
        //rb.addForce(new Vector2(Math.random(), Math.random()).multiplyScalar(1000));
        components.push(rb);

        const initialAnimation = new Animation(TrumpIdleSprite, 10, 4, 0.1, [1]);
        components.push(new Animator(this, 75, 75, initialAnimation));

        this.setComponents(components);
    }
}