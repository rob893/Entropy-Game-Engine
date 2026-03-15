import 'vitest-canvas-mock';
import { describe, expect, it, vi } from 'vitest';
import { Rigidbody } from '../../components/Rigidbody';
import type { GameObject } from '../../game-objects/GameObject';
import { GameEngine } from '../GameEngine';
import { GameLoop } from '../GameLoop';
import type { IGameLoopCallbacks } from '../GameLoop';
import type { CollisionManifold } from '../helpers/CollisionManifold';
import { Topic } from '../helpers/Topic';
import { Vector2 } from '../helpers/Vector2';
import { PhysicsEngine } from '../PhysicsEngine';
import { Time } from '../Time';
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

describe('GameLoop fixed timestep', () => {
  it('should accumulate frame time and run physics at the configured fixed timestep', () => {
    const time = new Time();
    const physicsStep = vi.fn();

    const callbacks: IGameLoopCallbacks = {
      processDestroyQueue: vi.fn(),
      updateTime: (timeStamp: number): number => {
        time.updateTime(timeStamp);
        return time.deltaTime;
      },
      physicsStep,
      updateGameObjects: vi.fn(),
      render: vi.fn(),
      isPaused: () => false
    };

    const loop = new GameLoop(callbacks, 60, 0.02);

    (loop as unknown as { update: (ts: number) => void }).update(0);
    (loop as unknown as { update: (ts: number) => void }).update(10);
    (loop as unknown as { update: (ts: number) => void }).update(25);
    (loop as unknown as { update: (ts: number) => void }).update(35);
    (loop as unknown as { update: (ts: number) => void }).update(45);

    expect(loop.fixedTimeStep).toBe(0.02);
    expect(physicsStep).toHaveBeenNthCalledWith(1, 0.02);
    expect(physicsStep).toHaveBeenNthCalledWith(2, 0.02);
    expect(physicsStep).toHaveBeenCalledTimes(2);
  });
});
