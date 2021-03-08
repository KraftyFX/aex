import { expect } from 'chai';
import { aex } from './aex';
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

    it(`Can return 'unknown' for an unrecognized input`, async () => {
        const result = await aex().toObject('Foo');

        expect(result).to.equal('unknown');
    });

    it(`Do something cool`, async () => {
        // const result = await aex().toObjectWithActiveComp();
        // expect(result).to.equal('unknown');
    });
});
