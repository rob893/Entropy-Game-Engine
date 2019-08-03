import { GameObject } from '../../GameEngine/Core/GameObject';
import { RectangleCollider } from '../../GameEngine/Components/RectangleCollider';
import { ComputerMotor } from '../Components/ComputerMotor';
import { RectangleRenderer } from '../../GameEngine/Components/RectangleRenderer';
export class Computer extends GameObject {
    constructor(id) {
        super(id, 688, 175);
        const computerComponents = [];
        computerComponents.push(new RectangleCollider(this, 10, 50));
        computerComponents.push(new ComputerMotor(this));
        computerComponents.push(new RectangleRenderer(this, 10, 50, 'white'));
        this.setComponents(computerComponents);
    }
}
//# sourceMappingURL=Computer.js.map