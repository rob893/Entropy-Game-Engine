import { Stopwatch } from '../Stopwatch';

describe('Stopwatch', () => {
  it('starts tracking time when started', () => {
    const nowSpy = vi.spyOn(performance, 'now');
    nowSpy.mockReturnValueOnce(100).mockReturnValueOnce(175);
    const stopwatch = new Stopwatch();

    stopwatch.start();
    stopwatch.stop();

    expect(stopwatch.elapsedMilliseconds).toBe(75);

    nowSpy.mockRestore();
  });

  it('pauses elapsed time when stopped', () => {
    const nowSpy = vi.spyOn(performance, 'now');
    nowSpy.mockReturnValueOnce(10).mockReturnValueOnce(40);
    const stopwatch = new Stopwatch();

    stopwatch.start();
    stopwatch.stop();
    nowSpy.mockReturnValue(1000);

    expect(stopwatch.elapsedMilliseconds).toBe(30);

    nowSpy.mockRestore();
  });

  it('resets elapsed time to zero', () => {
    const nowSpy = vi.spyOn(performance, 'now');
    nowSpy.mockReturnValueOnce(5).mockReturnValueOnce(55);
    const stopwatch = new Stopwatch();

    stopwatch.start();
    stopwatch.stop();
    stopwatch.reset();

    expect(stopwatch.elapsedMilliseconds).toBe(0);

    nowSpy.mockRestore();
  });

  it('returns the correct elapsed duration in milliseconds', () => {
    const nowSpy = vi.spyOn(performance, 'now');
    nowSpy
      .mockReturnValueOnce(0)
      .mockReturnValueOnce(25)
      .mockReturnValueOnce(100)
      .mockReturnValueOnce(160);
    const stopwatch = new Stopwatch();

    stopwatch.start();
    stopwatch.stop();
    stopwatch.start();
    stopwatch.stop();

    expect(stopwatch.elapsedMilliseconds).toBe(85);

    nowSpy.mockRestore();
  });
});
