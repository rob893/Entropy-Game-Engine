import { Animation } from '../../core/helpers/Animation';
import type { GameObject } from '../../game-objects/GameObject';
import { Animator } from '../Animator';

const createFrames = (count: number): HTMLImageElement[] =>
  Array.from({ length: count }, () => ({}) as HTMLImageElement);

const createGameObject = (deltaTime: number = 0): GameObject =>
  ({
    enabled: true,
    time: { deltaTime }
  }) as unknown as GameObject;

describe('Animator', () => {
  test('setAnimation stores the animation and currentAnimation returns it', () => {
    const initialAnimation = new Animation(createFrames(2), 100);
    const animator = new Animator(createGameObject(), 16, 16, initialAnimation);
    const nextAnimation = new Animation(createFrames(2), 100);

    animator.setAnimation(nextAnimation);

    expect(animator.currentAnimation).toBe(nextAnimation);
  });

  test('update calls updateAnimation on the current animation with deltaTime', () => {
    const animation = new Animation(createFrames(2), 100);
    const animator = new Animator(createGameObject(0.25), 16, 16, animation);
    const updateAnimationSpy = vi.spyOn(animation, 'updateAnimation');

    animator.update();

    expect(updateAnimationSpy).toHaveBeenCalledWith(0.25);
  });

  test('setting a new animation replaces the animation without resetting the previous one', () => {
    const initialFrames = createFrames(2);
    const initialAnimation = new Animation(initialFrames, 100);
    const animator = new Animator(createGameObject(), 16, 16, initialAnimation);
    const nextAnimation = new Animation(createFrames(2), 100);
    const resetSpy = vi.spyOn(initialAnimation, 'reset');

    initialAnimation.updateAnimation(100);
    expect(initialAnimation.currentFrame).toBe(initialFrames[1]);

    animator.setAnimation(nextAnimation);

    expect(resetSpy).not.toHaveBeenCalled();
    expect(initialAnimation.currentFrame).toBe(initialFrames[1]);
    expect(animator.currentAnimation).toBe(nextAnimation);
  });

  test('playToFinish prevents interruption until the animation completes', () => {
    const initialAnimation = new Animation(createFrames(2), 100);
    initialAnimation.loop = false;
    initialAnimation.playToFinish = true;

    const animator = new Animator(createGameObject(100), 16, 16, initialAnimation);
    const nextAnimation = new Animation(createFrames(2), 100);

    animator.setAnimation(nextAnimation);
    expect(animator.currentAnimation).toBe(initialAnimation);

    animator.update();
    animator.update();
    expect(initialAnimation.isComplete).toBe(true);

    animator.setAnimation(nextAnimation);
    expect(animator.currentAnimation).toBe(nextAnimation);
  });
});
