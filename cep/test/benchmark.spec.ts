import { expect } from 'chai';
import { AeObject, aex } from './aex';
import { AEX_NO_VALUE_PROPERTY } from './constants';
import { cleanupAex, evalAexIntoEstk, openProject } from './csinterface';

describe.skip('Benchmark', function () {
    this.slow(500);
    this.timeout(2000);

    before(async () => {
        await evalAexIntoEstk();
        await openProject('testAssets/property_unsupported.aep');
    });

    after(async () => {
        await cleanupAex();
    });

    it(`Sanity testing callback mechanism`, async () => {
        let called = false;

        await aex().benchmark({
            callback: (result) => {
                called = true;
                expect(result).to.be.true;
            },
        });

        expect(called, 'callback invoked').to.be.true;
    });

    it(`Can get log of serialization failures`, async () => {
        const result = await aex().fromAeObject(AeObject.ActiveComp, {
            unspportedPropertyBehavior: 'log',
        });

        expect(result.object).to.be.ok;
        expect(result.log[0].message).to.contain('is unsupported');
    });

    it(`Can get a callback during serialization failure`, async () => {
        let called = false;

        await aex().fromAeObject(AeObject.ActiveComp, {
            unspportedPropertyBehavior: ({ aexProperty, message }) => {
                called = true;

                expect(aexProperty).to.deep.contain({
                    type: AEX_NO_VALUE_PROPERTY,
                    name: 'Colors',
                });

                expect(message).to.contain('is unsupported');
            },
        });

        expect(called, 'callback invoked').to.be.true;
    });
});
