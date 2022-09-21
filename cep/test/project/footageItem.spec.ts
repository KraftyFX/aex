import { AeObject, aex, getFilePath, getProject } from '../aex';
import { AEX_FILE_FOOTAGE_ITEM, AEX_PROJECT, TEST_TIMEOUT_TIME } from '../constants';
import { cleanupAex, evalAexIntoEstk, openCleanProject } from '../csinterface';
import { assertAreEqual } from '../utils';

describe.only('Footage', function () {
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

            console.log('footage_basic', items[0]);
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

        it.skip(`Update TODO`, async () => {});
    });

    describe('Alpha Mode', async () => {
        it.skip(`Get TODO`, async () => {});
        it.skip(`Create TODO`, async () => {});
        it.skip(`Update TODO`, async () => {});
    });

    describe('Invert Alpha', async () => {
        it.skip(`Get TODO`, async () => {});
        it.skip(`Create TODO`, async () => {});
        it.skip(`Update TODO`, async () => {});
    });

    describe('Premult Color', async () => {
        it.skip(`Get TODO`, async () => {});
        it.skip(`Create TODO`, async () => {});
        it.skip(`Update TODO`, async () => {});
    });

    describe('Field Separation', async () => {
        it(`Get`, async () => {
            const result = await getProject('assets/file_detailed.aep', AeObject.Project);

            const items = result.object.items;

            console.log('split_fields_upper', items[0]);
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
                type: AEX_FILE_FOOTAGE_ITEM,
                width: 480,
            });

            console.log('split_fields_lower', items[2]);
            assertAreEqual(items[2], {
                aexid: '03_still_fields_lower:5',
                conformFrameRate: 0,
                duration: 0,
                fieldSeparationType: 5614,
                file: filePath,
                folder: [],
                frameRate: 30,
                height: 432,
                label: 5,
                name: '03_Still_Fields_Lower',
                pixelAspect: 1,
                type: AEX_FILE_FOOTAGE_ITEM,
                width: 480,
            });
        });
        it.skip(`Create TODO`, async () => {});
        it.skip(`Update TODO`, async () => {});
    });

    describe('High-Quality Field Separation', async () => {
        it(`Get`, async () => {
            const result = await getProject('assets/file_detailed.aep', AeObject.Project);

            const items = result.object.items;

            console.log('split_fields_upper_preserve', items[1]);
            assertAreEqual(items[1], {
                aexid: '02_still_fields_upper_preserveedges:4',
                conformFrameRate: 0,
                duration: 0,
                fieldSeparationType: 5612,
                highQualityFieldSeparation: true,
                file: filePath,
                folder: [],
                frameRate: 30,
                height: 432,
                label: 5,
                name: '02_Still_Fields_Upper_PreserveEdges',
                pixelAspect: 1,
                type: AEX_FILE_FOOTAGE_ITEM,
                width: 480,
            });

            console.log('split_fields_lower_preserve', items[3]);
            assertAreEqual(items[3], {
                aexid: '04_still_fields_lower_preserveedges:6',
                conformFrameRate: 0,
                duration: 0,
                fieldSeparationType: 5614,
                highQualityFieldSeparation: true,
                file: filePath,
                folder: [],
                frameRate: 30,
                height: 432,
                label: 5,
                name: '04_Still_Fields_Lower_PreserveEdges',
                pixelAspect: 1,
                type: AEX_FILE_FOOTAGE_ITEM,
                width: 480,
            });
        });
        it.skip(`Create TODO`, async () => {});
        it.skip(`Update TODO`, async () => {});
    });

    describe('Conform Frame Rate', async () => {
        it.skip(`Get TODO`, async () => {});
        it.skip(`Create TODO`, async () => {});
        it.skip(`Update TODO`, async () => {});
    });

    describe('Start Timecode', async () => {
        it.skip(`Get TODO`, async () => {});
        it.skip(`Create TODO`, async () => {});
        it.skip(`Update TODO`, async () => {});
    });

    describe('Remove Pulldown', async () => {
        it.skip(`Get TODO`, async () => {});
        it.skip(`Create TODO`, async () => {});
        it.skip(`Update TODO`, async () => {});
    });

    describe('Loop', async () => {
        it.skip(`Get TODO`, async () => {});
        it.skip(`Create TODO`, async () => {});
        it.skip(`Update TODO`, async () => {});
    });

    describe.skip('Preserve RGB [Not API supported]', async () => {
        it(`Get`, async () => {});
        it(`Create`, async () => {});
        it(`Update`, async () => {});
    });

    describe.skip('Colour Profile [Not API supported]', async () => {
        it(`Get`, async () => {});
        it(`Create`, async () => {});
        it(`Update`, async () => {});
    });

    describe.skip('Interpret as Linear [Not API supported]', async () => {
        it(`Get`, async () => {});
        it(`Create`, async () => {});
        it(`Update`, async () => {});
    });

    describe.skip('Interpret as Linear 32bpc  [Not API supported]', async () => {
        it(`Get`, async () => {});
        it(`Create`, async () => {});
        it(`Update`, async () => {});
    });
});
