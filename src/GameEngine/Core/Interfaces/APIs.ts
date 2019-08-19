import { Input } from '../Helpers/Input';
import { ObjectManager } from '../Helpers/ObjectManager';
import { Terrain } from '../Helpers/Terrain';
import { ComponentAnalyzer } from '../Helpers/ComponentAnalyzer';

export interface APIs {
    input: Input;
    objectManager: ObjectManager;
    terrain: Terrain;
    componentAnalyzer: ComponentAnalyzer;
    gameCanvas: HTMLCanvasElement
}