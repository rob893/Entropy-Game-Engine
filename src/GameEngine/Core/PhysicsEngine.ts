import { Rigidbody } from '../Components/Rigidbody';
import { RectangleCollider } from '../Components/RectangleCollider';
import { CollisionDetector } from './Interfaces/CollisionDetector';
import { SpatialHashCollisionDetector } from './Physics/SpatialHashCollisionDetector';
import { CollisionResolver } from './Interfaces/CollisionResolver';
import { ImpulseCollisionResolver } from './Physics/ImpulseCollisionResolver';
import { Layer } from './Enums/Layer';
import { CollisionManifold } from './Helpers/CollisionManifold';
import { Vector2 } from './Helpers/Vector2';
import { Time } from './Time';


export class PhysicsEngine {

    public gravity: number;

    private readonly rigidbodies: Rigidbody[];
    private readonly collisionDetector: CollisionDetector;
    private readonly collisionResolver: CollisionResolver;
    private readonly layerCollisionMatrix = new Map<Layer, Set<Layer>>();


    private constructor(collisionDetector: CollisionDetector, collisionResolver: CollisionResolver) {
        this.rigidbodies = [];
        this.gravity = 665;
        this.collisionDetector = collisionDetector;
        this.collisionResolver = collisionResolver;
        this.collisionDetector.onCollisionDetected.add((manifold) => this.resolveCollisions(manifold));

        const layers = Object.keys(Layer).filter(c => typeof Layer[c as any] === 'number').map(k => Number(Layer[k as any]));

        for (const layer of layers) {
            this.layerCollisionMatrix.set(layer, new Set(layers));
        }
    }

    public static buildPhysicsEngine(gameCanvas: HTMLCanvasElement): PhysicsEngine {
        const layerCollisionMatrix = new Map<Layer, Set<Layer>>();

        const layers = Object.keys(Layer).filter(c => typeof Layer[c as any] === 'number').map(k => Number(Layer[k as any]));
        
        for (const layer of layers) {
            layerCollisionMatrix.set(layer, new Set(layers));
        }

        layerCollisionMatrix.get(Layer.Terrain).delete(Layer.Terrain);

        const collisionDetector = new SpatialHashCollisionDetector(gameCanvas.width, gameCanvas.height, layerCollisionMatrix, 100);
        const collisionResolver = new ImpulseCollisionResolver();

        const engine = new PhysicsEngine(collisionDetector, collisionResolver);
        
        return engine;
    }

    public get colliders(): RectangleCollider[] {
        return this.collisionDetector.colliders;
    }

    public updatePhysics(): void {
        this.collisionDetector.detectCollisions();
        this.rigidbodies.forEach(rb => {
            rb.addForce(Vector2.down.multiplyScalar(this.gravity).multiplyScalar(Time.DeltaTime)); //add gravity
            rb.updatePhysics();
        });
    }

    public addRigidbody(rb: Rigidbody): void {
        this.rigidbodies.push(rb);
    }

    public removeRigidbody(rb: Rigidbody): void {
        if (this.rigidbodies.includes(rb)) {
            this.rigidbodies.splice(this.rigidbodies.indexOf(rb), 1);
        }
    }

    public addCollider(collider: RectangleCollider): void {
        this.collisionDetector.addCollider(collider);
    }

    private resolveCollisions(collisionManifold: CollisionManifold): void {
        this.collisionResolver.resolveCollisions(collisionManifold);
    }
}