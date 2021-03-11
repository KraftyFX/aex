import { expect } from 'chai';
import { AeObject, aex } from './aex';
import { cleanupAeqIpc, cleanupAex, evalAexIntoESTK } from './csinterface';

describe('aex().toObject()', function () {
    this.timeout(1000);

    before(async () => {
        await evalAexIntoESTK();
    });

    after(async () => {
        await cleanupAex();
        await cleanupAeqIpc();
    });

    it(`Can throw if undefined is passed in`, async () => {
        try {
            await aex().toObject(undefined);

            expect.fail(`Test should have thrown but it completed.`);
        } catch (e) {
            expect(e.isEstkError).to.be.true;
            expect(e.message).to.contain('undefined');
        }
    });

    it(`Random test to show how to compare results`, async () => {
        const result = await aex().toObject('this is a bad test case and should be rewritten');

        expect(result).to.deep.equal({ items: [], comps: [] });
    });

    it.skip(`Cannot serialize if there is no active comp open`, async () => {
        try {
            const result = await aex().toObjectWithAeObject(AeObject.ActiveComp);
            expect(result).to.equal('unknown');
        } catch (e) {
            expect(e.isEstkError).to.be.true;
            expect(e.message).to.contain('undefined');
        }
    });

    it(`Unsophisticated test to check comp data parsing`, async () => {
        const result = await aex().toObjectWithAeObject(AeObject.ActiveComp);

        expect(result);
    });

    it(`Unsophisticated test to check project data parsing`, async () => {
        const result = await aex().toObjectWithAeObject(AeObject.Project);

        console.log(result);
        expect(result);
    });
});
