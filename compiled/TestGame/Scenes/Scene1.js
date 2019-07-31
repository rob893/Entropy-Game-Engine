import { Scene1TerrainSpec } from "../Terrains/Scene1TerrainSpec";
import { RectangleBackground } from "../../GameEngine/Core/Helpers/RectangleBackground";
import { Color } from "../../GameEngine/Core/Enums/Color";
import { GameManagerObject } from "../GameObjects/GameManagerObject";
import { Trump } from "../GameObjects/Trump";
export class Scene1 {
    constructor() {
        this.name = 'Scene1';
        this.loadOrder = 1;
        this.terrainSpec = new Scene1TerrainSpec(3);
    }
    getSkybox(gameCanvas) {
        return new RectangleBackground(gameCanvas, Color.Black);
    }
    getStartingGameObjects() {
        return [
            new GameManagerObject("GameManager"),
            new Trump("trump")
        ];
    }
}
//# sourceMappingURL=Scene1.js.map