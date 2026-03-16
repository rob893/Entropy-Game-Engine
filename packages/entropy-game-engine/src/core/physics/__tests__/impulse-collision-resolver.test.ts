import { RectangleCollider } from '../../../components/RectangleCollider';
import { Rigidbody } from '../../../components/Rigidbody';
import type { GameObject } from '../../../game-objects/GameObject';
import { Layer } from '../../enums/Layer';
import { CollisionManifold } from '../../helpers/CollisionManifold';
import { PhysicalMaterial } from '../../helpers/PhysicalMaterial';
import { Vector2 } from '../../helpers/Vector2';
import { ImpulseCollisionResolver } from '../ImpulseCollisionResolver';

interface IColliderOptions {
  readonly mass?: number;
  readonly isKinematic?: boolean;
  readonly x?: number;
  readonly y?: number;
  readonly width?: number;
  readonly height?: number;
  readonly velocityX?: number;
  readonly velocityY?: number;
  readonly physicalMaterial?: PhysicalMaterial;
  readonly isTrigger?: boolean;
}

interface IColliderSetup {
  readonly gameObject: GameObject;
  readonly rigidbody: Rigidbody;
  readonly collider: RectangleCollider;
}

let nextGameObjectId = 0;

const createFakeGameObject = (x: number = 0, y: number = 10): GameObject => {
  const position = new Vector2(x, y);
  nextGameObjectId += 1;

  return {
    enabled: true,
    id: `physics-object-${nextGameObjectId}`,
    name: `physics-object-${nextGameObjectId}`,
    tag: 'test',
    layer: Layer.Default,
    transform: {
      position,
      translate(translation: Vector2): void {
        position.add(translation);
      }
    }
  } as unknown as GameObject;
};

const createColliderSetup = (options: IColliderOptions = {}): IColliderSetup => {
  const gameObject = createFakeGameObject(options.x, options.y);
  const rigidbody = new Rigidbody(gameObject, options.mass ?? 1, options.isKinematic ?? false);
  const collider = new RectangleCollider(gameObject, rigidbody, options.width ?? 10, options.height ?? 10);

  rigidbody.velocity.x = options.velocityX ?? 0;
  rigidbody.velocity.y = options.velocityY ?? 0;
  collider.physicalMaterial = options.physicalMaterial ?? PhysicalMaterial.zero;
  collider.isTrigger = options.isTrigger ?? false;

  return { gameObject, rigidbody, collider };
};

describe('ImpulseCollisionResolver', () => {
  it('modifies velocities for two objects colliding head-on', () => {
    const resolver = new ImpulseCollisionResolver();
    const colliderA = createColliderSetup({ velocityX: 5, physicalMaterial: PhysicalMaterial.zero });
    const colliderB = createColliderSetup({ velocityX: -5, x: 8, physicalMaterial: PhysicalMaterial.zero });
    const manifold = new CollisionManifold(colliderA.collider, colliderB.collider, 1, new Vector2(-1, 0));

    resolver.resolveCollisions(manifold);

    expect(colliderA.rigidbody.velocity.x).toBeCloseTo(0);
    expect(colliderB.rigidbody.velocity.x).toBeCloseTo(0);
  });

  it('only changes the non-kinematic body when hitting an immovable kinematic object', () => {
    const resolver = new ImpulseCollisionResolver();
    const movingCollider = createColliderSetup({ velocityX: 4, physicalMaterial: PhysicalMaterial.zero });
    const wallCollider = createColliderSetup({
      mass: 0,
      isKinematic: true,
      x: 8,
      physicalMaterial: PhysicalMaterial.zero
    });
    const manifold = new CollisionManifold(movingCollider.collider, wallCollider.collider, 1, new Vector2(-1, 0));

    resolver.resolveCollisions(manifold);

    expect(movingCollider.rigidbody.velocity.x).toBeCloseTo(0);
    expect(wallCollider.rigidbody.velocity.x).toBeCloseTo(0);
  });

  it('uses restitution to bounce colliding objects apart', () => {
    const resolver = new ImpulseCollisionResolver();
    const colliderA = createColliderSetup({ velocityX: 5, physicalMaterial: PhysicalMaterial.bouncy });
    const colliderB = createColliderSetup({ velocityX: -5, x: 8, physicalMaterial: PhysicalMaterial.bouncy });
    const manifold = new CollisionManifold(colliderA.collider, colliderB.collider, 1, new Vector2(-1, 0));

    resolver.resolveCollisions(manifold);

    expect(colliderA.rigidbody.velocity.x).toBeCloseTo(-5);
    expect(colliderB.rigidbody.velocity.x).toBeCloseTo(5);
  });

  it('applies friction impulses to tangential velocity', () => {
    const resolver = new ImpulseCollisionResolver();
    const colliderA = createColliderSetup({
      velocityX: 3,
      velocityY: -2,
      physicalMaterial: PhysicalMaterial.maxFriction
    });
    const colliderB = createColliderSetup({ y: 12, physicalMaterial: PhysicalMaterial.maxFriction });
    const manifold = new CollisionManifold(colliderA.collider, colliderB.collider, 1, new Vector2(0, 1));

    resolver.resolveCollisions(manifold);

    expect(colliderA.rigidbody.velocity.x).toBeCloseTo(2);
    expect(colliderB.rigidbody.velocity.x).toBeCloseTo(1);
  });

  it('affects the lighter object more when masses differ', () => {
    const resolver = new ImpulseCollisionResolver();
    const lightCollider = createColliderSetup({ mass: 1, velocityX: 4, physicalMaterial: PhysicalMaterial.zero });
    const heavyCollider = createColliderSetup({ mass: 4, x: 8, physicalMaterial: PhysicalMaterial.zero });
    const manifold = new CollisionManifold(lightCollider.collider, heavyCollider.collider, 1, new Vector2(-1, 0));

    resolver.resolveCollisions(manifold);

    const lightVelocityDelta = Math.abs(lightCollider.rigidbody.velocity.x - 4);
    const heavyVelocityDelta = Math.abs(heavyCollider.rigidbody.velocity.x);

    expect(lightVelocityDelta).toBeGreaterThan(heavyVelocityDelta);
    expect(lightCollider.rigidbody.velocity.x).toBeCloseTo(0.8);
    expect(heavyCollider.rigidbody.velocity.x).toBeCloseTo(0.8);
  });

  it('does not resolve trigger colliders physically', () => {
    const resolver = new ImpulseCollisionResolver();
    const colliderA = createColliderSetup({ velocityX: 5, physicalMaterial: PhysicalMaterial.bouncy });
    const colliderB = createColliderSetup({
      velocityX: -5,
      x: 8,
      isTrigger: true,
      physicalMaterial: PhysicalMaterial.bouncy
    });
    const manifold = new CollisionManifold(colliderA.collider, colliderB.collider, 1, new Vector2(-1, 0));

    resolver.resolveCollisions(manifold);

    expect(colliderA.rigidbody.velocity.x).toBe(5);
    expect(colliderB.rigidbody.velocity.x).toBe(-5);
  });
});
