import { AeObject, aex, getFilePath, getProject } from '../aex';
import { AEX_FILE_FOOTAGE_ITEM, AEX_PROJECT, TEST_TIMEOUT_TIME } from '../constants';
import { cleanupAex, evalAexIntoEstk, openCleanProject } from '../csinterface';
import { assertAreEqual } from '../utils';

describe.only('File', function () {
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

    describe('File Paths', async () => {
        it(`Get`, async () => {
            const result = await getProject('assets/file_basic.aep', AeObject.Project);

            const items = result.object.items;

            console.log('file_basic', items[0]);
            assertAreEqual(items[0], {
                name: '01_Still',
                label: 5,
                folder: [],
                aexid: '01_still:1',
                duration: 0,
                frameRate: 0,
                height: 432,
                pixelAspect: 1,
                width: 480,
                type: AEX_FILE_FOOTAGE_ITEM,
                file: filePath,
            });
        });

        it(`Create`, async () => {
            await openCleanProject();

            const itemData = {
                items: [
                    {
                        name: 'Juvenile_Ragdoll.jpg',
                        label: 5,
                        folder: [],
                        aexid: 'juvenile_ragdoll.jpg:1',
                        duration: 0,
                        frameRate: 0,
                        height: 432,
                        pixelAspect: 1,
                        width: 480,
                        type: AEX_FILE_FOOTAGE_ITEM,
                        file: filePath,
                    },
                ],
                type: AEX_PROJECT,
            };

            await aex.update(AeObject.Project, itemData);

            const result = await aex.get(AeObject.Project);
            const items = result.object.items;

            assertAreEqual(items, itemData.items);
        });

        it(`Update`, async () => {
            await openCleanProject();

            const projectData = {
                comps: [],
                items: [
                    {
                        name: 'Juvenile_Ragdoll.jpg',
                        label: 5,
                        folder: [],
                        aexid: 'juvenile_ragdoll.jpg:1',
                        duration: 0,
                        frameRate: 0,
                        height: 432,
                        pixelAspect: 1,
                        width: 480,
                        type: AEX_FILE_FOOTAGE_ITEM,
                        file: filePath,
                    },
                ],
                type: AEX_PROJECT,
            };

            await aex.update(AeObject.Project, projectData);
            const result = await aex.get(AeObject.Project);
            const project = result.object;

            projectData.items[0].aexid = '';
            project.items[0].aexid = '';

            assertAreEqual(project.items, projectData.items);
        });
    });

    describe('Sequences', async () => {
        it.skip(`Get TODO`, async () => {});
        it.skip(`Create TODO`, async () => {});
        it.skip(`Update TODO`, async () => {});
    });
});
