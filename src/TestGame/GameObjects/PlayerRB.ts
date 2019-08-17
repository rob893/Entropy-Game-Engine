import { GameObject } from '../../GameEngine/Core/GameObject';
import { Component } from '../../GameEngine/Components/Component';
import { RectangleCollider } from '../../GameEngine/Components/RectangleCollider';
import TrumpIdleSprite from '../Assets/Images/trump_idle.png';
import { Animation } from '../../GameEngine/Core/Helpers/Animation';
import { Animator } from '../../GameEngine/Components/Animator';
//import { TrumpMotor } from '../Components/TrumpMotor';
//import { AudioSource } from '../../GameEngine/Components/AudioSource';
import { Rigidbody } from '../../GameEngine/Components/Rigidbody';
import { PhysicalMaterial } from '../../GameEngine/Core/Helpers/PhysicalMaterial';
import { PlayerPhysicsMotor } from '../Components/PlayerPhysicsMotor';
import { Weapon } from './Weapon';

export class PlayerRB extends GameObject {

    public constructor(id: string) {
        super(id, 400, 250);

        const weapon = new Weapon();
        this.transform.addChild(weapon.transform);

        const components: Component[] = [];
        
        const collider = new RectangleCollider(this, 35, 35, 0, -5);
        collider.physicalMaterial = PhysicalMaterial.bouncy;
        components.push(collider);
        components.push(new PlayerPhysicsMotor(this));
        components.push(new Rigidbody(this));
        
        const initialAnimation = new Animation(TrumpIdleSprite, 10, 4, 0.1, [4]);
        components.push(new Animator(this, 75, 75, initialAnimation));
        //components.push(new AudioSource(this));

        this.setComponents(components);
    }
}