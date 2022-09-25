import { AeObject, aex, getFilePath, getProject } from '../aex';
import { AEX_FILE_FOOTAGE_ITEM, TEST_TIMEOUT_TIME } from '../constants';
import { cleanupAex, evalAexIntoEstk, openCleanProject } from '../csinterface';
import { assertAreEqual } from '../utils';

describe('Item', function () {
    this.slow(500);
    this.timeout(TEST_TIMEOUT_TIME);
    let filePath: string;

    before(async () => {
        await evalAexIntoEstk();
        filePath = getFilePath('Juvenile_Ragdoll.jpg');
    });

    after(async () => {
        await cleanupAex();
    });

    // Comment, label, name, folder
    describe('Basic Properties', async () => {
        it.skip(`Get TODO`, async () => {});
        it.skip(`Create TODO`, async () => {});
    });

    describe('Duration', async () => {
        it.skip(`Get TODO`, async () => {});
        it.skip(`Create TODO`, async () => {});
    });

    describe('Frame Rate', async () => {
        it.skip(`Get TODO`, async () => {});
        it.skip(`Create TODO`, async () => {});
    });

    describe('Dimensions', async () => {
        it.skip(`Get TODO`, async () => {});
        it.skip(`Create TODO`, async () => {});
    });

    describe('Pixel Aspect Ratio', async () => {
        it(`Get`, async () => {
            const result = await getProject('assets/project_footage.aep', AeObject.Project);

            const items = result.object.items;

            console.log('pixel_aspect_ratio', items[4]);
            assertAreEqual(items[4], {
                aexid: '05_still_par_1.09:7',
                file: filePath,
                folder: [],
                label: 5,
                name: '05_Still_PAR_1.09',
                pixelAspect: 1.094,
                type: AEX_FILE_FOOTAGE_ITEM,
            });
        });

        it(`Create`, async () => {
            await openCleanProject();

            const footageData = {
                file: filePath,
                aexid: 'par_item:40',
                folder: [],
                label: 5,
                name: 'PAR Item',
                pixelAspect: 2,
                type: AEX_FILE_FOOTAGE_ITEM,
            };

            await aex.create(AeObject.Project, footageData);

            const result = await aex.get(AeObject.Project);
            const project = result.object;

            footageData.aexid = '';
            project.items[0].aexid = '';

            assertAreEqual(project.items[0], footageData);
        });
    });
});
