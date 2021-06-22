import { expect } from 'chai';
import { AeObject, aex } from './aex';
import { cleanupAex, evalAexIntoEstk } from './csinterface';

describe.only('Zack Test Stuff', function () {
    this.slow(500);
    this.timeout(5000);

    before(async () => {
        await evalAexIntoEstk();
    });

    after(async () => {
        await cleanupAex();
    });

    /** Data dumps */
    it(`Unsophisticated test to check first layer`, async () => {
        const result = await aex().get(AeObject.Layer(1));
        const layer = result.object;

        console.log('layer', layer);
        expect(layer);
    });

    it(`Unsophisticated test to check comp data parsing`, async () => {
        const result = await aex().get(AeObject.ActiveComp);
        const comp = result.object;

        console.log('comp', comp);
        expect(comp);
    });

    it(`Unsophisticated test to check project data parsing`, async () => {
        const result = await aex().get(AeObject.Project);
        const project = result.object;

        console.log('project', project);
        expect(project);
    });
});
