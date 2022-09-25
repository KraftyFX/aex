import { AeObject, aex, getProject } from '../aex';
import { AEX_COMP_ITEM, TEST_TIMEOUT_TIME } from '../constants';
import { cleanupAex, evalAexIntoEstk, openCleanProject } from '../csinterface';
import { assertAreEqual, getAexResultFromJson } from '../utils';

describe('Comp', function () {
    this.slow(1000);
    this.timeout(TEST_TIMEOUT_TIME);

    before(async () => {
        await evalAexIntoEstk();
    });

    after(async () => {
        await cleanupAex();
    });

    describe('Basic Attributes', async () => {
        it(`Get`, async () => {
            const { object: expectedComp } = await getProject('assets/comp_basic.aep', AeObject.ActiveComp);
            const { object: actualComp } = await getAexResultFromJson(`assets/comp_basic.comp.json`);

            console.log('comp_basic', expectedComp);

            assertAreEqual(expectedComp, actualComp);
        });

        it(`Create`, async () => {
            const compData = {
                aexid: 'comp 1:1',
                duration: 4,
                folder: [],
                frameRate: 60,
                height: 720,
                layers: [],
                markers: [],
                name: 'Comp 1',
                type: AEX_COMP_ITEM,
                width: 1280,
            };

            await openCleanProject();

            await aex.create(AeObject.Project, compData);

            const { object: expectedComp } = await aex.get(AeObject.ActiveComp);

            assertAreEqual(expectedComp, compData);
        });
    });
});
