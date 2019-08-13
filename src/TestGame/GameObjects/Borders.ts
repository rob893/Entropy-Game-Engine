import { GameObject } from '../../GameEngine/Core/GameObject';
import { Layer } from '../../GameEngine/Core/Enums/Layer';
import { Rigidbody } from '../../GameEngine/Components/Rigidbody';
import { RectangleCollider } from '../../GameEngine/Components/RectangleCollider';
import { PhysicalMaterial } from '../../GameEngine/Core/Helpers/PhysicalMaterial';

export class Borders extends GameObject {

    public constructor(id: string) {
        super(id, 0, 0, 'border', Layer.Terrain);

        const rb = new Rigidbody(this, 100000, true);

        const topBorder = new RectangleCollider(this, 1280, 50, 1280 / 2, 50);
        topBorder.physicalMaterial = PhysicalMaterial.bouncy;

        const bottomBorder = new RectangleCollider(this, 1280, 50, 1280 / 2, 720);
        bottomBorder.physicalMaterial = PhysicalMaterial.bouncy;

        const leftBorder = new RectangleCollider(this, 50, 720, 25, 720);
        leftBorder.physicalMaterial = PhysicalMaterial.bouncy;

        const rightBorder = new RectangleCollider(this, 50, 720, 1280 - 25, 720);
        rightBorder.physicalMaterial = PhysicalMaterial.bouncy;

        this.setComponents([
            rb,
            topBorder,
            bottomBorder,
            leftBorder,
            rightBorder
        ]);
    }
}