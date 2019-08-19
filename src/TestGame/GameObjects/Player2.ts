import { GameObject } from '../../GameEngine/Core/GameObject';
import { Component } from '../../GameEngine/Components/Component';
import { RectangleCollider } from '../../GameEngine/Components/RectangleCollider';
import TrumpIdleSprite from '../Assets/Images/trump_idle.png';
import { Animation } from '../../GameEngine/Core/Helpers/Animation';
import { Animator } from '../../GameEngine/Components/Animator';
import { Player2Motor } from '../Components/Player2Motor';
import { PhysicalMaterial } from '../../GameEngine/Core/Helpers/PhysicalMaterial';
import { APIs } from '../../GameEngine/Core/Interfaces/APIs';

export class Player2 extends GameObject {

    protected buildInitialComponents(apis: APIs): Component[] {
        const components: Component[] = [];
        
        const collider = new RectangleCollider(this, null, 35, 35, 0, -5);
        collider.physicalMaterial = PhysicalMaterial.bouncy;
        components.push(collider);
        
        const initialAnimation = new Animation(TrumpIdleSprite, 10, 4, 0.1, [4]);
        const animator = new Animator(this, 75, 75, initialAnimation);
        components.push(animator);

        components.push(new Player2Motor(this, apis.gameCanvas, collider, animator, apis.input));

        return components;
    }
}