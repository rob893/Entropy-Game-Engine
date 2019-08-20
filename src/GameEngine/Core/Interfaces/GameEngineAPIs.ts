import { Input } from '../Helpers/Input';
import { ObjectManager } from '../Helpers/ObjectManager';
import { Terrain } from '../Helpers/Terrain';
import { ComponentAnalyzer } from '../Helpers/ComponentAnalyzer';
import { SceneManager } from '../Helpers/SceneManager';
import { Time } from '../Time';

export interface GameEngineAPIs {
    input: Input;
    objectManager: ObjectManager;
    terrain: Terrain;
    componentAnalyzer: ComponentAnalyzer;
    gameCanvas: HTMLCanvasElement;
    sceneManager: SceneManager;
    time: Time;
}