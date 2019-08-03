import { GameManagerObject } from '../GameObjects/GameManagerObject';
import { Player } from '../GameObjects/Player';
import { ImageBackground } from '../../GameEngine/Core/Helpers/ImageBackground';
import Background from '../Assets/Images/background.png';
export class Scene2 {
    constructor() {
        this.name = 'Scene2';
        this.loadOrder = 2;
        this.terrainSpec = null;
    }
    getSkybox(gameCanvas) {
        return new ImageBackground(gameCanvas, Background);
    }
    getStartingGameObjects() {
        return [
            new GameManagerObject('GameManager'),
            new Player('player')
        ];
    }
}
//# sourceMappingURL=Scene2.js.map