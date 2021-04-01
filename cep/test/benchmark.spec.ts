import { aex } from './aex';
import { cleanupAex, evalAexIntoESTK, openProject } from './csinterface';

describe.only('Benchmark', function () {
    this.slow(500);
    this.timeout(4000);

    before(async () => {
        await evalAexIntoESTK();
        await openProject('testAssets/property_animated.aep');
    });

    after(async () => {
        await cleanupAex();
    });

    it(`Serialization`, async () => {
        await aex().benchmark();
    });
});
