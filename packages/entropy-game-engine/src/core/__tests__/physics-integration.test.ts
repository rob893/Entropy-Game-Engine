import 'vitest-canvas-mock';
import { describe, expect, it, vi } from 'vitest';
import { Rigidbody } from '../../components/Rigidbody';
import type { GameObject } from '../../game-objects/GameObject';
import { GameEngine } from '../GameEngine';
import type { CollisionManifold } from '../helpers/CollisionManifold';
import { Topic } from '../helpers/Topic';
import { Vector2 } from '../helpers/Vector2';
import { PhysicsEngine } from '../PhysicsEngine';
import type { ICollisionDetector } from '../types';
import type { ICollisionResolver } from '../types';

const createFakeGameObject = (): GameObject => {
  const position = new Vector2(0, 0);

  return {
    enabled: true,
    id: 'test-game-object',
    name: 'test-game-object',
    tag: 'test',
    transform: {
      position,
      translate(translation: Vector2): void {
        position.add(translation);
      }
    }
  } as unknown as GameObject;
};

const createCollisionDetector = (): ICollisionDetector => {
  const collisions = new Topic<CollisionManifold>();

  return {
    onCollisionDetected: collisions,
    colliders: [],
    detectCollisions: vi.fn(),
    addCollider: vi.fn(),
    removeCollider: vi.fn(),
    addColliders: vi.fn()
  };
};

const collisionResolver: ICollisionResolver = {
  resolveCollisions: vi.fn()
};

type MutableGameEngine = GameEngine & {
  createEnginesAndAPIs: () => void;
  physicsEngine: PhysicsEngine;
  renderingEngine: { renderScene: () => void };
  update: (timeStamp: number) => void;
};

describe('Rigidbody physics integration', () => {
  it('should translate using velocity scaled by deltaTime', () => {
    const rigidbody = new Rigidbody(createFakeGameObject(), 2);

    rigidbody.velocity.x = 10;
    rigidbody.addForce(new Vector2(4, 0));

    rigidbody.updatePhysics(0.5);

    expect(rigidbody.velocity.x).toBe(12);
    expect(rigidbody.transform.position.x).toBe(6);
  });
});

describe('PhysicsEngine fixed-step integration', () => {
  it('should apply gravity as acceleration and pass the fixed deltaTime to rigidbodies', () => {
    const collisionDetector = createCollisionDetector();
    const physicsEngine = new PhysicsEngine(collisionDetector, collisionResolver);
    const lightBody = new Rigidbody(createFakeGameObject(), 1);
    const heavyBody = new Rigidbody(createFakeGameObject(), 10);

    physicsEngine.addRigidbody(lightBody);
    physicsEngine.addRigidbody(heavyBody);
    physicsEngine.updatePhysics(0.5);

    expect(lightBody.velocity.y).toBe(332.5);
    expect(heavyBody.velocity.y).toBe(332.5);
    expect(lightBody.transform.position.y).toBe(166.25);
    expect(heavyBody.transform.position.y).toBe(166.25);
    expect(collisionDetector.detectCollisions).toHaveBeenCalledTimes(1);
  });
});

describe('GameEngine fixed timestep', () => {
  it('should accumulate frame time and run physics at the configured fixed timestep', () => {
    const gameCanvas = document.createElement('canvas');
    const gameEngine = new GameEngine({ gameCanvas });
    const mutableGameEngine = gameEngine as unknown as MutableGameEngine;

    mutableGameEngine.createEnginesAndAPIs();

    const physicsUpdateSpy = vi.spyOn(mutableGameEngine.physicsEngine, 'updatePhysics');
    vi.spyOn(mutableGameEngine.renderingEngine, 'renderScene').mockImplementation(() => {});

    gameEngine.fixedTimeStep = 0.02;

    mutableGameEngine.update(0);
    mutableGameEngine.update(10);
    mutableGameEngine.update(25);
    mutableGameEngine.update(35);
    mutableGameEngine.update(45);

    expect(gameEngine.fixedTimeStep).toBe(0.02);
    expect(physicsUpdateSpy).toHaveBeenNthCalledWith(1, 0.02);
    expect(physicsUpdateSpy).toHaveBeenNthCalledWith(2, 0.02);
    expect(physicsUpdateSpy).toHaveBeenCalledTimes(2);
  });
});
