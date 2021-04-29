import { expect } from 'chai';
import { AeObject, aex } from '../aex';
import { cleanupAex, evalAexIntoEstk, openProject } from '../csinterface';

describe('Unsupported Properties', function () {
    this.slow(500);
    this.timeout(5000);

    before(async () => {
        await evalAexIntoEstk();
        await openProject('testAssets/property_unsupported.aep');
    });

    after(async () => {
        await cleanupAex();
    });

    it(`Can get log of serialization failures`, async () => {
        const result = await aex().get(AeObject.ActiveComp, {
            unspportedPropertyBehavior: 'log',
        });

        console.log('unsupported_log', result);

        expect(result.object).to.be.ok;
        expect(result.log[0].message).to.contain('is unsupported');
    });

    it(`Can skip serialization failures`, async () => {
        const result = await aex().get(AeObject.ActiveComp, {
            unspportedPropertyBehavior: 'skip',
        });

        console.log('unsupported_skip', result);

        expect(result.object).to.be.ok;
        expect(result.log).to.be.empty;
    });

    it(`Can throw on serialization failures`, async () => {
        try {
            await aex().get(AeObject.ActiveComp, {
                unspportedPropertyBehavior: 'throw',
            });

            expect.fail(`Test should have thrown but it completed.`);
        } catch (e) {
            console.log('unsupported_throw');
            console.dir(e);
            expect(e.isEstkError).to.be.true;
            expect(e.message).to.contain('is unsupported');
        }
    });

    it(`Can get metadata on serialization failures`, async () => {
        const result = await aex().get(AeObject.ActiveComp, {
            unspportedPropertyBehavior: 'metadata',
        });

        console.log('unsupported_metadata', result);

        expect(result.object).to.be.ok;
        expect(result.object.layers[0].layerStyles.properties[1].properties[0]).to.not.have.property('value');
    });
});
