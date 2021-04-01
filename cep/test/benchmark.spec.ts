import { aex } from './aex';
import { cleanupAex, evalAexIntoEstk, openProject } from './csinterface';

describe('Benchmark', function () {
    this.slow(500);
    this.timeout(4000);

    before(async () => {
        await evalAexIntoEstk();
        await openProject('testAssets/property_animated.aep');
    });

    after(async () => {
        await cleanupAex();
    });

    it(`Serialization`, async () => {
        await aex().benchmark();
    });
});
