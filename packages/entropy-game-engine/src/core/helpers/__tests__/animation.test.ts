import { Animation } from '../Animation';

const createFrames = (count: number): HTMLImageElement[] =>
  Array.from({ length: count }, () => ({}) as HTMLImageElement);

describe('Animation', () => {
  test('constructs with frames and returns the first frame initially', () => {
    const frames = createFrames(3);
    const animation = new Animation(frames, 100);

    expect(animation.currentFrame).toBe(frames[0]);
    expect(animation.speedPercentage).toBe(100);
  });

  test('advances frames based on deltaTime', () => {
    const frames = createFrames(3);
    const animation = new Animation(frames, 100);

    animation.updateAnimation(50);
    expect(animation.currentFrame).toBe(frames[0]);

    animation.updateAnimation(50);
    expect(animation.currentFrame).toBe(frames[1]);

    animation.updateAnimation(100);
    expect(animation.currentFrame).toBe(frames[2]);
  });

  test('cycles back to the start when loop is true', () => {
    const frames = createFrames(3);
    const animation = new Animation(frames, 100);

    animation.updateAnimation(100);
    animation.updateAnimation(100);
    animation.updateAnimation(100);

    expect(animation.currentFrame).toBe(frames[0]);
    expect(animation.isComplete).toBe(false);
  });

  test('stops at the last frame and marks complete when loop is false', () => {
    const frames = createFrames(3);
    const animation = new Animation(frames, 100);
    animation.loop = false;

    animation.updateAnimation(100);
    animation.updateAnimation(100);
    expect(animation.currentFrame).toBe(frames[2]);
    expect(animation.isComplete).toBe(false);

    animation.updateAnimation(100);

    expect(animation.currentFrame).toBe(frames[2]);
    expect(animation.isComplete).toBe(true);
  });

  test('reset returns the animation to the first frame', () => {
    const frames = createFrames(2);
    const animation = new Animation(frames, 100);
    animation.loop = false;

    animation.updateAnimation(100);
    animation.updateAnimation(100);
    expect(animation.isComplete).toBe(true);

    animation.reset();

    expect(animation.currentFrame).toBe(frames[0]);
    expect(animation.isComplete).toBe(false);

    animation.updateAnimation(50);
    expect(animation.currentFrame).toBe(frames[0]);
  });

  test('speedPercentage scales frame timing', () => {
    const frames = createFrames(2);
    const animation = new Animation(frames, 100);

    animation.speedPercentage = 200;

    expect(animation.speedPercentage).toBeCloseTo(200);

    animation.updateAnimation(49);
    expect(animation.currentFrame).toBe(frames[0]);

    animation.updateAnimation(1);
    expect(animation.currentFrame).toBe(frames[1]);
  });

  test('fires onAnimationComplete when a non-looping animation reaches the end', () => {
    const frames = createFrames(2);
    const animation = new Animation(frames, 100);
    const onComplete = vi.fn();

    animation.loop = false;
    animation.onAnimationComplete.subscribe(onComplete);

    animation.updateAnimation(100);
    animation.updateAnimation(100);
    animation.updateAnimation(100);

    expect(onComplete).toHaveBeenCalledTimes(1);
  });
});
