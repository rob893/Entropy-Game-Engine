var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { GameEngine } from "./GameEngine/Core/GameEngine";
import { Scene1 } from "./TestGame/Scenes/Scene1";
import { Scene2 } from "./TestGame/Scenes/Scene2";
const main = () => __awaiter(this, void 0, void 0, function* () {
    const gameCanvas = document.getElementById("game-canvas");
    const gameEngine = GameEngine.buildGameEngine(gameCanvas);
    gameEngine.renderingEngine.renderGizmos = true;
    gameEngine.setScenes([new Scene1(), new Scene2]);
    gameEngine.loadScene(1);
});
main();
//# sourceMappingURL=index.js.map