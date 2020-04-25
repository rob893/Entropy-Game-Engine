export class PhysicalMaterial {
  /**
   * Friction when object is in motion
   */
  public readonly dynamicFriction: number;

  /**
   * Friction when object is at rest (affects amount of force to get object moving)
   */
  public readonly staticFriction: number;

  /**
   * restitution
   */
  public readonly bounciness: number;

  public constructor(dynamicFriction: number, staticFriction: number, bounciness: number) {
    this.dynamicFriction = dynamicFriction;
    this.staticFriction = staticFriction;
    this.bounciness = bounciness;
  }

  public static get ice(): PhysicalMaterial {
    return new PhysicalMaterial(0.1, 0.1, 0);
  }

  public static get bouncy(): PhysicalMaterial {
    return new PhysicalMaterial(0.3, 0.3, 1);
  }

  public static get maxFriction(): PhysicalMaterial {
    return new PhysicalMaterial(1, 1, 0);
  }

  public static get metal(): PhysicalMaterial {
    return new PhysicalMaterial(0.15, 0.15, 0.597);
  }

  public static get rubber(): PhysicalMaterial {
    return new PhysicalMaterial(1, 1, 0.828);
  }

  public static get wood(): PhysicalMaterial {
    return new PhysicalMaterial(0.45, 0.45, 0.603);
  }

  public static get zero(): PhysicalMaterial {
    return new PhysicalMaterial(0, 0, 0);
  }
}
