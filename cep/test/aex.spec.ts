import { expect } from 'chai';
import { AeObject, aex } from './aex';
import { cleanupAex, evalAexIntoEstk } from './csinterface';

describe.skip('Aex', function () {
    this.slow(500);
    this.timeout(5000);

    before(async () => {
        await evalAexIntoEstk();
    });

    after(async () => {
        await cleanupAex();
    });

    /** Meta tests */
    it(`Can throw if undefined is passed in`, async () => {
        try {
            await aex().fromAe(undefined);

            expect.fail(`Test should have thrown but it completed.`);
        } catch (e) {
            expect(e.isEstkError).to.be.true;
            expect(e.message).to.contain('undefined');
        }
    });

    /** Data dumps */
    it(`Unsophisticated test to check comp data parsing`, async () => {
        const result = await aex().fromAeObject(AeObject.ActiveComp);

        console.log('activecomp', result.object);
        expect(result.object);
    });

    it(`Unsophisticated test to check project data parsing`, async () => {
        const result = await aex().fromAeObject(AeObject.Project);

        console.log('full project', result.object);
        expect(result.object);
    });
});
