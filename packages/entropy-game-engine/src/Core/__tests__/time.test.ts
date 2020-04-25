import { Time } from '../Time';

describe('Time', () => {
    describe('deltaTime', () => {
        it('should be the difference in time between to calls of updateTime', () => {
            const time = new Time();

            time.updateTime(0);

            expect(time.deltaTime).toEqual(0);

            time.updateTime(16);

            expect(time.deltaTime).toEqual(0.016);

            time.updateTime(20);

            expect(time.deltaTime).toEqual(0.004);
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
