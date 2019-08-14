import { GameObject } from '../../GameEngine/Core/GameObject';
import { Layer } from '../../GameEngine/Core/Enums/Layer';
import { Rigidbody } from '../../GameEngine/Components/Rigidbody';
import { RectangleCollider } from '../../GameEngine/Components/RectangleCollider';
import { PhysicalMaterial } from '../../GameEngine/Core/Helpers/PhysicalMaterial';

export class Borders extends GameObject {

    public constructor(id: string) {
        super(id, 0, 0, 'border', Layer.Terrain);

        const rb = new Rigidbody(this, 100000, true);

        const colliders: RectangleCollider[] = [];

        const topBorder = new RectangleCollider(this, 1280, 50, 1280 / 2, 50);
        colliders.push(topBorder);

        const bottomBorder = new RectangleCollider(this, 1280, 50, 1280 / 2, 720);
        colliders.push(bottomBorder);

        const leftBorder = new RectangleCollider(this, 50, 720, 25, 720);
        colliders.push(leftBorder);

        const rightBorder = new RectangleCollider(this, 50, 720, 1280 - 25, 720);
        colliders.push(rightBorder);

        const midBox = new RectangleCollider(this, 150, 20, 640, 520);
        colliders.push(midBox);

        for (const collider of colliders) {
            collider.physicalMaterial = PhysicalMaterial.metal;
        }

        this.setComponents([
            rb,
            topBorder,
            bottomBorder,
            leftBorder,
            rightBorder,
            midBox
        ]);
    }
}