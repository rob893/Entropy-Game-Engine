import { Animation } from '@entropy-engine/entropy-game-engine';

export class DirectionalAnimation {
  private readonly animationMap: Map<-1 | 0 | 1, Map<-1 | 0 | 1, Animation>>;
  private readonly anims: Animation[] = [];

  public constructor(
    animations: {
      upAnimation: Animation;
      downAnimation: Animation;
      rightAnimation: Animation;
      leftAnimation: Animation;
      upRightAnimation: Animation;
      upLeftAnimation: Animation;
      downRightAnimation: Animation;
      downLeftAnimation: Animation;
    },
    middleAnimation: Animation
  ) {
    this.animationMap = new Map([
      [
        -1,
        new Map([
          [-1, animations.upLeftAnimation],
          [0, animations.leftAnimation],
          [1, animations.downLeftAnimation]
        ])
      ],
      [
        0,
        new Map([
          [-1, animations.upAnimation],
          [0, middleAnimation],
          [1, animations.downAnimation]
        ])
      ],
      [
        1,
        new Map([
          [-1, animations.upRightAnimation],
          [0, animations.rightAnimation],
          [1, animations.downRightAnimation]
        ])
      ]
    ]);

    for (const animMaps of this.animationMap.values()) {
      for (const animation of animMaps.values()) {
        this.anims.push(animation);
      }
    }
  }

  public get animations(): Animation[] {
    return [...this.anims];
  }

  public getDirectionalAnimation(xDirection: -1 | 0 | 1, yDirection: -1 | 0 | 1): Animation {
    const animation = this.animationMap.get(xDirection)?.get(yDirection);

    if (!animation) {
      throw new Error('No animation found!');
    }

    return animation;
  }
}
