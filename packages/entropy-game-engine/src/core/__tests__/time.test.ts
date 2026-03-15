import { Time } from '../Time';

describe('Time', () => {
  describe('deltaTime', () => {
    it('should be the difference in time between two calls of updateTime', () => {
      const time = new Time();

      time.updateTime(0);

      expect(time.deltaTime).toEqual(0);

      time.updateTime(16);

      expect(time.deltaTime).toEqual(0.016);

      time.updateTime(20);

      expect(time.deltaTime).toEqual(0.004);
    });

    it('should clamp deltaTime to prevent large frame jumps', () => {
      const time = new Time();

      time.updateTime(0);
      time.updateTime(250);

      expect(time.deltaTime).toEqual(0.1);
    });

    it('should apply timeScale to deltaTime', () => {
      const time = new Time();
      time.timeScale = 0.5;

      time.updateTime(0);
      time.updateTime(16);

      expect(time.deltaTime).toEqual(0.008);
    });

    it('should reset timing so the next frame has zero deltaTime', () => {
      const time = new Time();

      time.updateTime(0);
      time.updateTime(16);
      time.resetTime();
      time.updateTime(1016);

      expect(time.deltaTime).toEqual(0);
    });
  });

  describe('totalTime', () => {
    it('should be total time since game start', () => {
      const time = new Time();

      time.updateTime(0);

      expect(time.totalTime).toEqual(0);

      time.updateTime(16);

      expect(time.totalTime).toEqual(0.016);

      time.updateTime(20);

      expect(time.totalTime).toEqual(0.02);
    });
  });
});
