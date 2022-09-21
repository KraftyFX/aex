import { AeObject, aex, getFilePath, getProject } from '../aex';
import { AEX_FILE_FOOTAGE_ITEM, AEX_PROJECT, TEST_TIMEOUT_TIME } from '../constants';
import { cleanupAex, evalAexIntoEstk, openCleanProject } from '../csinterface';
import { assertAreEqual } from '../utils';

describe('File', function () {
    this.slow(500);
    this.timeout(TEST_TIMEOUT_TIME);
    let stillPath: string;
    let seqPath: string;

    before(async () => {
        await evalAexIntoEstk();
        stillPath = getFilePath('Juvenile_Ragdoll.jpg');
        seqPath = getFilePath('seq/img.0000.jpg');
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
                aexid: '01_still:1',
                duration: 0,
                file: stillPath,
                folder: [],
                frameRate: 0,
                height: 432,
                label: 5,
                name: '01_Still',
                pixelAspect: 1,
                type: AEX_FILE_FOOTAGE_ITEM,
                width: 480,
            });
        });

        it(`Create`, async () => {
            await openCleanProject();

            const itemData = {
                items: [
                    {
                        aexid: 'juvenile_ragdoll.jpg:1',
                        duration: 0,
                        file: stillPath,
                        folder: [],
                        frameRate: 0,
                        height: 432,
                        label: 5,
                        name: 'Juvenile_Ragdoll.jpg',
                        pixelAspect: 1,
                        type: AEX_FILE_FOOTAGE_ITEM,
                        width: 480,
                    },
                ],
                type: AEX_PROJECT,
            };

            await aex.create(AeObject.Project, itemData);

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
                        aexid: 'juvenile_ragdoll.jpg:1',
                        duration: 0,
                        file: stillPath,
                        folder: [],
                        frameRate: 0,
                        height: 432,
                        label: 5,
                        name: 'Juvenile_Ragdoll.jpg',
                        pixelAspect: 1,
                        type: AEX_FILE_FOOTAGE_ITEM,
                        width: 480,
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
        it(`Get`, async () => {
            const result = await getProject('assets/file_basic.aep', AeObject.Project);

            const items = result.object.items;

            console.log('file_sequence', items[1]);
            assertAreEqual(items[1], {
                aexid: '02_sequence:2',
                conformFrameRate: 30,
                duration: 0.06666666666667,
                file: seqPath,
                folder: [],
                frameRate: 30,
                height: 432,
                label: 3,
                name: '02_Sequence',
                pixelAspect: 1,
                sequence: true,
                type: AEX_FILE_FOOTAGE_ITEM,
                width: 480,
            });
        });

        it(`Create`, async () => {
            await openCleanProject();

            const itemData = {
                items: [
                    {
                        aexid: 'img.[0000-0001].jpg:1',
                        conformFrameRate: 30,
                        duration: 0.06666666666667,
                        file: seqPath,
                        folder: [],
                        frameRate: 30,
                        height: 432,
                        label: 3,
                        name: 'img.[0000-0001].jpg',
                        pixelAspect: 1,
                        sequence: true,
                        type: AEX_FILE_FOOTAGE_ITEM,
                        width: 480,
                    },
                ],
                type: AEX_PROJECT,
            };

            await aex.create(AeObject.Project, itemData);

            const result = await aex.get(AeObject.Project);
            const items = result.object.items;

            assertAreEqual(items, itemData.items);
        });

        it(`Update`, async () => {
            await openCleanProject();

            const itemData = {
                items: [
                    {
                        aexid: 'img.[0000-0001].jpg:1',
                        conformFrameRate: 30,
                        duration: 0.06666666666667,
                        file: seqPath,
                        folder: [],
                        frameRate: 30,
                        height: 432,
                        label: 3,
                        name: 'img.[0000-0001].jpg',
                        pixelAspect: 1,
                        sequence: true,
                        type: AEX_FILE_FOOTAGE_ITEM,
                        width: 480,
                    },
                ],
                type: AEX_PROJECT,
            };

            await aex.update(AeObject.Project, itemData);

            const result = await aex.get(AeObject.Project);
            const items = result.object.items;

            assertAreEqual(items, itemData.items);
        });
    });
});
