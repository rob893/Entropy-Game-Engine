import { GameObject } from '../../GameEngine/Core/GameObject';
import { Component } from '../../GameEngine/Components/Component';
import { RectangleCollider } from '../../GameEngine/Components/RectangleCollider';
import TrumpIdleSprite from '../Assets/Images/trump_idle.png';
import { Animation } from '../../GameEngine/Core/Helpers/Animation';
import { Animator } from '../../GameEngine/Components/Animator';
import { Rigidbody } from '../../GameEngine/Components/Rigidbody';
import { PhysicalMaterial } from '../../GameEngine/Core/Helpers/PhysicalMaterial';
import { GameEngineAPIs } from '../../GameEngine/Core/Interfaces/GameEngineAPIs';
import { PrefabSettings } from '../../GameEngine/Core/Interfaces/PrefabSettings';
import { Layer } from '../../GameEngine/Core/Enums/Layer';

export class TrumpRB extends GameObject {

    protected buildInitialComponents(gameEngineAPIs: GameEngineAPIs): Component[] {
        const components: Component[] = [];

        const rb = new Rigidbody(this);
        //rb.addForce(new Vector2(Math.random(), Math.random()).multiplyScalar(1000));
        components.push(rb);

        const collider = new RectangleCollider(this, rb, 60, 60, 0, -5);
        collider.physicalMaterial = PhysicalMaterial.bouncy;
        components.push(collider);

        const initialAnimation = new Animation(TrumpIdleSprite, 10, 4, 0.1, [1]);
        components.push(new Animator(this, 75, 75, initialAnimation, gameEngineAPIs.time));

        return components;
    }

    protected getPrefabSettings(): PrefabSettings {
        return {
            x: 400,
            y: 250,
            rotation: 0,
            id: 'trumpRB',
            tag: 'trumpRB',
            layer: Layer.Default
        };
    }
}