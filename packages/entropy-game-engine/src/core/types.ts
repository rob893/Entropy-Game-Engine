import type { RectangleCollider } from '../components/RectangleCollider';
import type { GameObject } from '../game-objects/GameObject';
import type { Layer } from './enums/Layer';
import type { GameEngine } from './GameEngine';
import type { AssetPool } from './helpers/AssetPool';
import type { CollisionManifold } from './helpers/CollisionManifold';
import type { ISubscribable } from './helpers/types';
import type { Vector2 } from './helpers/Vector2';

export interface IScene {
  name: string;
  sceneId?: number;
  loadOrder?: number;
  gravity?: number;
  terrainSpec?: ITerrainSpec | null;
  getSkybox?(gameEngine: GameEngine): IRenderableBackground | null;
  getStartingGameObjects(gameEngine: GameEngine): GameObject[];
  getAssetPool?(): Promise<AssetPool>;
}

export interface IGameEngineConfiguration {
  gameCanvas: HTMLCanvasElement;
  fpsLimit?: number;
  fixedTimeStep?: number;
  collisionDetectorGenerator?: (gameEngine: GameEngine) => ICollisionDetector;
  collisionResolverGenerator?: (gameEngine: GameEngine) => ICollisionResolver;
}

export interface IGameObjectConstructionParams {
  gameEngine: GameEngine;
  id?: string;
  name?: string;
  x?: number;
  y?: number;
  rotation?: number;
  tag?: string;
  layer?: Layer;
}

export interface IPrefabSettings {
  /**
   * The starting x position of the object.
   */
  x: number;

  /**
   * The starting y position of the object.
   */
  y: number;

  /**
   * The starting rotation (in radians) of the object.
   */
  rotation: number;

  /**
   * An optional stable identifier for the object.
   */
  id?: string;

  /**
   * The human-readable name of the object.
   */
  name: string;

  /**
   * The tag assocaited with the object. Tag can be used to group objects together (ie, 'enemy' tag for all enemies)
   */
  tag: string;

  /**
   * The collision layer the object belongs to.
   */
  layer: Layer;
}

export interface ICollisionDetector {
  readonly onCollisionDetected: ISubscribable<CollisionManifold>;
  readonly colliders: RectangleCollider[];
  detectCollisions(): void;
  addCollider(collider: RectangleCollider): void;
  removeCollider(collider: RectangleCollider): void;
  addColliders(colliders: RectangleCollider[]): void;
}

export interface ICollisionResolver {
  resolveCollisions(collisionManifold: CollisionManifold): void;
}

export interface ISerializedComponent {
  typeName: string;
  data: Record<string, unknown>;
}

export interface ISerializedGameObject {
  id: string;
  name: string;
  tag: string;
  layer: number;
  enabled: boolean;
  components: ISerializedComponent[];
  children: ISerializedGameObject[];
}

export interface ISerializedScene {
  name: string;
  sceneId: number;
  gravity?: number;
  gameObjects: ISerializedGameObject[];
  terrain?: ISerializedTerrain;
}

export interface ISerializedTerrain {
  tileWidth: number;
  tileHeight: number;
  // 0 = empty, positive values = passable tiles, negative values = impassable tiles.
  grid: number[][];
  tileSet?: Record<number, string>;
  layers?: ISerializedTerrainLayer[];
}

export interface ISerializedTerrainLayer {
  name: string;
  grid: number[][];
  tileSet: Record<number, string>;
  visible: boolean;
  opacity: number;
  passability?: boolean[][];
  weights?: number[][];
}

export interface ICanvasMouseEvent extends MouseEvent {
  cursorPositionOnCanvas: Vector2;
}

export interface IRenderable {
  enabled: boolean;
  render(context: CanvasRenderingContext2D): void;
}

export interface IRenderableBackground {
  renderBackground(context: CanvasRenderingContext2D): void;
}

export interface IRenderableGUI {
  enabled: boolean;
  zIndex: number;
  renderGUI(context: CanvasRenderingContext2D): void;
}

export interface IRenderableGizmo {
  enabled: boolean;
  renderGizmo(context: CanvasRenderingContext2D): void;
}

export interface ITerrainLayer {
  name: string;
  grid: number[][];
  tileSet: Record<number, string>;
  visible: boolean;
  opacity: number;
  passability?: boolean[][];
  weights?: number[][];
}

export interface ITerrainSpec {
  spriteSheetUrl?: string;
  scale?: number;
  cellSize?: number;
  getSpec?(): (ITerrainCell | null)[][];
  tileWidth?: number;
  tileHeight?: number;
  grid?: number[][];
  tileSet?: Record<number, string>;
  layers?: ITerrainLayer[];
}

export interface ITerrainCell {
  passable: boolean;
  weight: number;
  spriteData: ISpriteData;
}

export interface ISpriteData {
  sliceX: number;
  sliceY: number;
  sliceWidth: number;
  sliceHeight: number;
}

export interface IGraph<T extends IGraphCell = IGraphCell> {
  cellSize: number;
  graphCells: T[];
  getCell(x: number, y: number): T;
  neighbors(id: Vector2): Iterable<T>;
  addCell(cell: T): void;
}

export interface IGraphCell {
  position: Vector2;
}

export interface IWeightedGraph<T extends IWeightedGraphCell = IWeightedGraphCell> extends IGraph<T> {
  isUnpassable(position: Vector2): boolean;
  cost(a: Vector2, b: Vector2): number;
}

export interface IWeightedGraphCell extends IGraphCell {
  passable: boolean;
  weight: number;
}

export interface IComparable {
  valueOf(): number | string | boolean;
}

// ── Map File Types ──
// Minimal types matching the .entropy-map JSON structure produced by the editor.
// Structurally compatible with the editor's IEditorMapFile — extra fields are ignored.

export interface IMapFile {
  name: string;
  tileWidth: number;
  tileHeight: number;
  layers: IMapLayer[];
  tilesets: IMapTileset[];
}

export interface IMapTileLayer {
  type: 'tile';
  name: string;
  grid: number[][];
  tileSetId: string;
  visible: boolean;
  opacity: number;
  passability?: boolean[][];
  weights?: number[][];
}

export interface IMapObjectLayer {
  type: 'object';
  [key: string]: unknown;
}

export type IMapLayer = IMapTileLayer | IMapObjectLayer;

export interface IMapTileset {
  id: string;
  imagePath: string;
  tileWidth: number;
  tileHeight: number;
  columns: number;
  rows: number;
  tileCount: number;
}

export interface IMapLoaderOptions {
  /** Base path to prepend to relative asset paths (e.g., '/assets' or 'https://cdn.example.com'). */
  basePath?: string;
  /** Custom function to resolve asset paths. Overrides basePath if provided. */
  resolveAssetPath?: (relativePath: string) => string;
}
