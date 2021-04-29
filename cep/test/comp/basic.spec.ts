import { AeObject, aex } from '../aex';
import { AEX_COMP_ITEM } from '../constants';
import { cleanupAex, evalAexIntoEstk, openCleanProject, openProject } from '../csinterface';
import { assertAreEqual } from '../utils';

describe('Comp', function () {
    this.slow(500);
    this.timeout(5000);

    before(async () => {
        await evalAexIntoEstk();
    });

    after(async () => {
        await cleanupAex();
    });

    describe('Get', async () => {
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

    describe('Create', async () => {
        it(`Can create basic comp attributes`, async () => {
            await openCleanProject();

            const compData = {
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
            };

            await aex().create(AeObject.Project, compData);

            const result = await aex().fromAeObject(AeObject.ActiveComp);
            const comp = result.object;
            assertAreEqual(comp, compData);
        });
    });
});
