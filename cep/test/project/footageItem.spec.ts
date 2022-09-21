import { AeObject, aex, getFilePath, getProject } from '../aex';
import { AEX_FILE_FOOTAGE_ITEM, AEX_FOLDER_ITEM, AEX_PLACEHOLDER_ITEM, AEX_PROJECT, AEX_SOLID_ITEM, TEST_TIMEOUT_TIME } from '../constants';
import { cleanupAex, evalAexIntoEstk, openCleanProject } from '../csinterface';
import { assertAreEqual } from '../utils';

describe.only('Footage', function () {
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

    describe('Basic Footage', async () => {
        it(`Get`, async () => {
            const result = await getProject('assets/project_basic_items.aep', AeObject.Project);

            const project = result.object;

            console.log('project_basic_items', project);
            assertAreEqual(project.items, [
                {
                    aexid: 'placeholder:40',
                    conformFrameRate: 30,
                    duration: 5,
                    folder: [],
                    frameRate: 30,
                    height: 1080,
                    label: 3,
                    name: 'Placeholder',
                    pixelAspect: 1,
                    type: AEX_PLACEHOLDER_ITEM,
                    width: 1920,
                },
                {
                    aexid: 'solids:37',
                    folder: [],
                    type: AEX_FOLDER_ITEM,
                    name: 'Solids',
                },
                {
                    aexid: 'black solid 1:38',
                    duration: 0,
                    folder: ['Solids'],
                    frameRate: 0,
                    height: 500,
                    type: AEX_SOLID_ITEM,
                    name: 'Black Solid 1',
                    pixelAspect: 1,
                    width: 500,
                },
            ]);
        });

        it(`Create`, async () => {
            await openCleanProject();

            const footageData = {
                aexid: 'placeholder:40',
                conformFrameRate: 30,
                duration: 5,
                folder: [],
                frameRate: 30,
                height: 1080,
                label: 3,
                name: 'Placeholder',
                pixelAspect: 1,
                type: AEX_PLACEHOLDER_ITEM,
                width: 1920,
            };

            await aex.create(AeObject.Project, footageData);

            const result = await aex.get(AeObject.Project);
            const project = result.object;

            footageData.aexid = '';
            project.items[0].aexid = '';

            assertAreEqual(project.items[0], footageData);
        });
    });

    describe('Alpha Mode', async () => {
        it.skip(`Get TODO`, async () => {});
        it.skip(`Create TODO`, async () => {});
    });

    describe('Invert Alpha', async () => {
        it.skip(`Get TODO`, async () => {});
        it.skip(`Create TODO`, async () => {});
    });

    describe('Premult Color', async () => {
        it.skip(`Get TODO`, async () => {});
        it.skip(`Create TODO`, async () => {});
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
                file: stillPath,
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
                file: stillPath,
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
                file: stillPath,
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
                file: stillPath,
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
    });

    describe('Conform Frame Rate', async () => {
        it.skip(`Get TODO`, async () => {});
        it.skip(`Create TODO`, async () => {});
    });

    describe('Start Timecode', async () => {
        it.skip(`Get TODO`, async () => {});
        it.skip(`Create TODO`, async () => {});
    });

    describe('Remove Pulldown', async () => {
        it.skip(`Get TODO`, async () => {});
        it.skip(`Create TODO`, async () => {});
    });

    describe('Loop', async () => {
        it.skip(`Get TODO`, async () => {});
        it.skip(`Create TODO`, async () => {});
    });

    describe.skip('Preserve RGB [Not API supported]', async () => {
        it(`Get`, async () => {});
        it(`Create`, async () => {});
    });

    describe.skip('Colour Profile [Not API supported]', async () => {
        it(`Get`, async () => {});
        it(`Create`, async () => {});
    });

    describe.skip('Interpret as Linear [Not API supported]', async () => {
        it(`Get`, async () => {});
        it(`Create`, async () => {});
    });

    describe.skip('Interpret as Linear 32bpc  [Not API supported]', async () => {
        it(`Get`, async () => {});
        it(`Create`, async () => {});
    });
});
