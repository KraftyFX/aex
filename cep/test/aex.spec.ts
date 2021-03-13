import { expect } from 'chai';
import { AeObject, aex } from './aex';
import { cleanupAeqIpc, cleanupAex, evalAexIntoESTK } from './csinterface';

describe('Aex', function () {
    this.slow(500);
    this.timeout(2000);

    before(async () => {
        await evalAexIntoESTK();
    });

    after(async () => {
        await cleanupAex();
        await cleanupAeqIpc();
    });

    /** Meta tests */
    it(`Can throw if undefined is passed in`, async () => {
        try {
            await aex().toObject(undefined);

            expect.fail(`Test should have thrown but it completed.`);
        } catch (e) {
            expect(e.isEstkError).to.be.true;
            expect(e.message).to.contain('undefined');
        }
    });

    /** Data dumps */
    it.skip(`Unsophisticated test to check comp data parsing`, async () => {
        const result = await aex().toObjectWithAeObject(AeObject.ActiveComp);

        console.log('activecomp', result);
        expect(result);
    });

    it.skip(`Unsophisticated test to check project data parsing`, async () => {
        const result = await aex().toObjectWithAeObject(AeObject.Project);

        console.log('full project', result);
        expect(result);
    });
});
