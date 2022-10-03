import { expect } from 'chai';
import { AeObject, aex } from '../aex';
import { TEST_TIMEOUT_TIME } from '../constants';
import { cleanupAex, evalAexIntoEstk, openProject } from '../csinterface';

describe('Serialize Unsupported Properties', function () {
    this.slow(500);
    this.timeout(TEST_TIMEOUT_TIME);

    before(async () => {
        await evalAexIntoEstk();
        await openProject('assets/property_unsupported.aep');
    });

    after(async () => {
        await cleanupAex();
    });

    it(`Callback`, async () => {
        const log: string[] = [];

        const result = await aex.get(AeObject.ActiveComp, {
            unspportedPropertyBehavior: (entry) => {
                log.push(entry.message);
            },
        });

        console.log('unsupported_skip', result);

        expect(result.object).to.be.ok;
        expect(log.length).to.be.greaterThan(0);
    });

    it(`Skip`, async () => {
        const result = await aex.get(AeObject.ActiveComp, {
            unspportedPropertyBehavior: 'skip',
        });

        console.log('unsupported_skip', result);

        expect(result.object).to.be.ok;
    });

    it(`Throw`, async () => {
        try {
            await aex.get(AeObject.ActiveComp, {
                unspportedPropertyBehavior: 'throw',
            });

            expect.fail(`Test should have thrown but it completed.`);
        } catch (e) {
            console.log('unsupported_throw');
            console.dir(e);
            expect(e.isEstkError).to.be.true;
            expect(e.message).to.contain('is not supported.');
        }
    });

    it(`Metadata`, async () => {
        const result = await aex.get(AeObject.Layer(1), {
            unspportedPropertyBehavior: 'metadata',
        });

        console.log('unsupported_metadata', result);

        expect(result.object).to.be.ok;
        expect(result.object.layerStyles.properties[1].properties[0]).to.not.have.property('value');
    });
});
