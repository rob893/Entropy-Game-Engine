import { Subscription } from '../Subscription';
import { Topic } from '../Topic';

describe('Topic', () => {
  it('publishes event data to all subscribers', () => {
    const topic = new Topic<{ score: number }>();
    const firstHandler = vi.fn();
    const secondHandler = vi.fn();
    const eventData = { score: 42 };

    topic.subscribe(firstHandler);
    topic.subscribe(secondHandler);

    topic.publish(eventData);

    expect(firstHandler).toHaveBeenCalledTimes(1);
    expect(firstHandler).toHaveBeenCalledWith(eventData);
    expect(secondHandler).toHaveBeenCalledTimes(1);
    expect(secondHandler).toHaveBeenCalledWith(eventData);
  });

  it('returns a Subscription when subscribing', () => {
    const topic = new Topic<string>();

    const subscription = topic.subscribe(() => undefined);

    expect(subscription).toBeInstanceOf(Subscription);
    expect(subscription.isActive).toBe(true);
  });

  it('prevents future calls after unsubscribing', () => {
    const topic = new Topic<number>();
    const handler = vi.fn();
    const subscription = topic.subscribe(handler);

    topic.publish(1);
    topic.unsubscribe(subscription);
    topic.publish(2);

    expect(handler).toHaveBeenCalledTimes(1);
    expect(handler).toHaveBeenCalledWith(1);
  });

  it('allows unsubscribing the same subscription twice safely', () => {
    const topic = new Topic<string>();
    const subscription = topic.subscribe(() => undefined);

    expect(topic.unsubscribe(subscription)).toBe(true);
    expect(topic.unsubscribe(subscription)).toBe(false);
    expect(subscription.isActive).toBe(false);
  });

  it('removes all subscribers with unsubscribeAll', () => {
    const topic = new Topic<string>();
    const firstHandler = vi.fn();
    const secondHandler = vi.fn();

    topic.subscribe(firstHandler);
    topic.subscribe(secondHandler);
    topic.unsubscribeAll();

    topic.publish('event');

    expect(firstHandler).not.toHaveBeenCalled();
    expect(secondHandler).not.toHaveBeenCalled();
  });

  it('does not throw when publishing with no subscribers', () => {
    const topic = new Topic<string>();

    expect(() => topic.publish('event')).not.toThrow();
  });
});

describe('Subscription', () => {
  it('reflects active state correctly with isActive', () => {
    const subscription = new Subscription(vi.fn(), vi.fn());

    expect(subscription.isActive).toBe(true);

    subscription.unsubscribe();

    expect(subscription.isActive).toBe(false);
  });

  it('publishes to its handler', () => {
    const handler = vi.fn();
    const subscription = new Subscription(vi.fn(), handler);

    subscription.publish('payload');

    expect(handler).toHaveBeenCalledTimes(1);
    expect(handler).toHaveBeenCalledWith('payload');
  });

  it('deactivates when unsubscribe is called', () => {
    const handler = vi.fn();
    const unsubscribeLogic = vi.fn();
    const subscription = new Subscription(unsubscribeLogic, handler);

    subscription.unsubscribe();
    subscription.publish('payload');

    expect(unsubscribeLogic).toHaveBeenCalledTimes(1);
    expect(subscription.isActive).toBe(false);
    expect(handler).not.toHaveBeenCalled();
  });
});
