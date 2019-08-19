import { GameObject } from '../../GameEngine/Core/GameObject';
import { Rigidbody } from '../../GameEngine/Components/Rigidbody';
import { RectangleCollider } from '../../GameEngine/Components/RectangleCollider';
import { PhysicalMaterial } from '../../GameEngine/Core/Helpers/PhysicalMaterial';
import { Component } from '../../GameEngine/Components/Component';
import { APIs } from '../../GameEngine/Core/Interfaces/APIs';

export class Borders extends GameObject {

    protected buildInitialComponents(apis: APIs): Component[] {
        const rb = new Rigidbody(this, 100000, true);

        const colliders: RectangleCollider[] = [];

        const topBorder = new RectangleCollider(this, rb, 1280, 50, 1280 / 2, 50);
        colliders.push(topBorder);

        const bottomBorder = new RectangleCollider(this, rb, 1280, 50, 1280 / 2, 720);
        colliders.push(bottomBorder);

        const leftBorder = new RectangleCollider(this, rb, 50, 720, 25, 720);
        colliders.push(leftBorder);

        const rightBorder = new RectangleCollider(this, rb, 50, 720, 1280 - 25, 720);
        colliders.push(rightBorder);

        const midBox = new RectangleCollider(this, rb, 150, 20, 640, 520);
        colliders.push(midBox);

        for (const collider of colliders) {
            collider.physicalMaterial = PhysicalMaterial.metal;
        }

        return [rb, ...colliders];
    }
}