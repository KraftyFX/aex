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

    describe('Basic Footage', async () => {
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
                type: 'aex:item:av:footage:file',
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

        it.skip(`Update TODO`, async () => {
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

    describe('Alpha', async () => {
        it.skip(`Get TODO`, async () => {});
        it.skip(`Create TODO`, async () => {});
        it.skip(`Update TODO`, async () => {});
    });

    describe('Frame Rate', async () => {
        it.skip(`Get TODO`, async () => {});
        it.skip(`Create TODO`, async () => {});
        it.skip(`Update TODO`, async () => {});
    });

    describe('Start Timecode', async () => {
        it.skip(`Get TODO`, async () => {});
        it.skip(`Create TODO`, async () => {});
        it.skip(`Update TODO`, async () => {});
    });

    describe('Split Fields', async () => {
        it(`Get`, async () => {
            const result = await getProject('assets/file_detailed.aep', AeObject.Project);

            const items = result.object.items;

            console.log('split_fields', items[0]);
            assertAreEqual(items[0], {
                aexid: '01_still_fields_upper:3',
                conformFrameRate: 0,
                duration: 0,
                fieldSeparationType: 5612,
                file: filePath,
                folder: [],
                frameRate: 30,
                height: 432,
                label: 5,
                name: '01_Still_Fields_Upper',
                pixelAspect: 1,
                type: 'aex:item:av:footage:file',
                width: 480,
            });
        });
        it.skip(`Create TODO`, async () => {});
        it.skip(`Update TODO`, async () => {});
    });

    describe('Remove Pulldown', async () => {
        it.skip(`Get TODO`, async () => {});
        it.skip(`Create TODO`, async () => {});
        it.skip(`Update TODO`, async () => {});
    });

    describe('Pixel Aspect Ratio', async () => {
        it.skip(`Get TODO`, async () => {});
        it.skip(`Create TODO`, async () => {});
        it.skip(`Update TODO`, async () => {});
    });

    describe('Loop', async () => {
        it.skip(`Get TODO`, async () => {});
        it.skip(`Create TODO`, async () => {});
        it.skip(`Update TODO`, async () => {});
    });

    describe('Preserve RGB', async () => {
        it.skip(`Get TODO`, async () => {});
        it.skip(`Create TODO`, async () => {});
        it.skip(`Update TODO`, async () => {});
    });

    describe('Colour Profile', async () => {
        it.skip(`Get TODO`, async () => {});
        it.skip(`Create TODO`, async () => {});
        it.skip(`Update TODO`, async () => {});
    });

    describe('Linear', async () => {
        it.skip(`Get TODO`, async () => {});
        it.skip(`Create TODO`, async () => {});
        it.skip(`Update TODO`, async () => {});
    });

    describe('Linear 32bpc', async () => {
        it.skip(`Get TODO`, async () => {});
        it.skip(`Create TODO`, async () => {});
        it.skip(`Update TODO`, async () => {});
    });
});
