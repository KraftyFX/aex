import { AeObject, aex } from '../aex';
import { AEX_COMP_ITEM } from '../constants';
import { cleanupAeqIpc, cleanupAex, evalAexIntoESTK, openProject } from '../csinterface';
import { assertAreEqual } from '../utils';

describe('Comp', function () {
    this.slow(500);
    this.timeout(2000);

    before(async () => {
        await evalAexIntoESTK();
    });

    after(async () => {
        await cleanupAex();
        await cleanupAeqIpc();
    });

    it(`Can parse basic comp attributes`, async () => {
        await openProject('testAssets/comp_basic.aep');

        const result = await aex().toObjectWithAeObject(AeObject.ActiveComp);

        console.log('comp_basic', result);
        assertAreEqual(result.comps, [
            {
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
            },
        ]);
    });
});
