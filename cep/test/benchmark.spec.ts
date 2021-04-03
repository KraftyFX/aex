import { expect } from 'chai';
import { aex } from './aex';
import { cleanupAex, evalAexIntoEstk, openProject } from './csinterface';

describe.only('Benchmark', function () {
    this.slow(500);
    this.timeout(2000);

    before(async () => {
        await evalAexIntoEstk();
        await openProject('testAssets/property_animated.aep');
    });

    after(async () => {
        await cleanupAex();
    });

    it(`Serialization`, async () => {
        let called = false;

        await aex().benchmark({
            callback: (result) => {
                called = true;
                expect(result).to.be.true;
            },
        });

        expect(called, 'callback invoked').to.be.true;
    });
});
