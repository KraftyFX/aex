import { AeObject, aex, getFilePath, getProject } from '../aex';
import { AEX_PROJECT, TEST_TIMEOUT_TIME } from '../constants';
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

    describe('Get', async () => {
        it(`Can parse basic footage attributes`, async () => {
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
                type: 'aex:item:av:footage:file',
                file: filePath,
            });
        });
    });

    describe('Create', async () => {
        it(`Can import basic files`, async () => {
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
                        type: 'aex:item:av:footage:file',
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
    });

    describe.skip('Update', async () => {
        it(`TODO: Can update basic footage attributes`, async () => {
            await openCleanProject();

            const projectData = {
                bitsPerChannel: 16,
                comps: [],
                displayStartFrame: 1,
                expressionEngine: 'extendscript',
                feetFramesFilmType: 2412,
                footageTimecodeDisplayStartType: 2213,
                framesCountType: 2613,
                gpuAccelType: 1816,
                items: [],
                linearizeWorkingSpace: true,
                timeDisplayType: 2013,
                type: AEX_PROJECT,
                workingSpace: 'Apple RGB',
            };

            await aex.update(AeObject.Project, projectData);

            const result = await aex.get(AeObject.Project);
            const project = result.object;

            assertAreEqual(project, projectData);
        });
    });
});
