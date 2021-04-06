import { AeObject, aex } from '../aex';
import { AEX_COMP_ITEM } from '../constants';
import { cleanupAex, evalAexIntoEstk, openProject } from '../csinterface';
import { assertAreEqual } from '../utils';

describe('Comp', function () {
    this.slow(500);
    this.timeout(2000);

    before(async () => {
        await evalAexIntoEstk();
    });

    after(async () => {
        await cleanupAex();
    });

    it(`Can parse basic comp attributes`, async () => {
        await openProject('testAssets/comp_basic.aep');

        const { object: comp } = await aex().fromAeObject(AeObject.ActiveComp);

        console.log('comp_basic', comp);
        assertAreEqual(comp, {
            aexid: 'comp 1:1',
            duration: 4,
            folder: [],
            frameRate: 60,
            height: 720,
            layers: [],
            markers: [],
            name: 'Comp 1',
            pixelAspect: 1,
            type: AEX_COMP_ITEM,
            width: 1280,
        });
    });
});
