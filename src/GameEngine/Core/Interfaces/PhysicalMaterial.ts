export interface PhysicalMaterial {
    
    /**
     * Friction when object is in motion
     */
    dynamicFriction: number;

    /**
     * Friction when object is at rest (affects amount of force to get object moving)
     */
    staticFriction: number;

    /**
     * restitution
     */
    bounciness: number;
}