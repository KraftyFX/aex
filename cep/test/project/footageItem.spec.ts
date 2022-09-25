import { AeObject, aex, getFilePath, getProject } from '../aex';
import { AEX_FILE_FOOTAGE_ITEM, AEX_FOLDER_ITEM, AEX_PLACEHOLDER_ITEM, AEX_PROJECT, AEX_SOLID_ITEM, TEST_TIMEOUT_TIME } from '../constants';
import { cleanupAex, evalAexIntoEstk, openCleanProject } from '../csinterface';
import { assertAreEqual } from '../utils';

describe.only('Footage', function () {
    this.slow(500);
    this.timeout(TEST_TIMEOUT_TIME);
    let stillPath: string;
    let seqPath: string;
    let transparentPath: string;

    before(async () => {
        await evalAexIntoEstk();
        stillPath = getFilePath('Juvenile_Ragdoll.jpg');
        seqPath = getFilePath('seq/img.0000.jpg');
        transparentPath = getFilePath('transparent.png');
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
        it(`Get`, async () => {
            const result = await getProject('assets/project_footage.aep', AeObject.Project);

            const items = result.object.items;

            console.log('alpha_mode_straight', items[13]);
            assertAreEqual(items[13], {
                aexid: '14_alpha_straight:18',
                alphaMode: 5412,
                duration: 0,
                file: transparentPath,
                folder: [],
                frameRate: 0,
                height: 50,
                label: 5,
                name: '14_Alpha_Straight',
                pixelAspect: 1,
                type: AEX_FILE_FOOTAGE_ITEM,
                width: 50,
            });

            console.log('alpha_mode_ignore', items[14]);
            assertAreEqual(items[14], {
                aexid: '15_alpha_ignore:19',
                alphaMode: 5413,
                duration: 0,
                file: transparentPath,
                folder: [],
                frameRate: 0,
                height: 50,
                label: 5,
                name: '15_Alpha_Ignore',
                pixelAspect: 1,
                type: AEX_FILE_FOOTAGE_ITEM,
                width: 50,
            });

            console.log('alpha_mode_premult', items[15]);
            assertAreEqual(items[15], {
                aexid: '16_alpha_premult_black:20',
                alphaMode: 5414,
                duration: 0,
                file: transparentPath,
                folder: [],
                frameRate: 0,
                height: 50,
                label: 5,
                name: '16_Alpha_Premult_Black',
                pixelAspect: 1,
                type: AEX_FILE_FOOTAGE_ITEM,
                width: 50,
            });
        });

        it(`Create`, async () => {
            await openCleanProject();

            const footageData = [
                {
                    aexid: '14_alpha_straight:16',
                    alphaMode: 5412,
                    duration: 0,
                    file: transparentPath,
                    folder: [],
                    frameRate: 0,
                    height: 50,
                    label: 5,
                    name: '14_Alpha_Straight',
                    pixelAspect: 1,
                    type: AEX_FILE_FOOTAGE_ITEM,
                    width: 50,
                },
                {
                    aexid: '15_alpha_ignore:17',
                    alphaMode: 5413,
                    duration: 0,
                    file: transparentPath,
                    folder: [],
                    frameRate: 0,
                    height: 50,
                    label: 5,
                    name: '15_Alpha_Ignore',
                    pixelAspect: 1,
                    type: AEX_FILE_FOOTAGE_ITEM,
                    width: 50,
                },
                {
                    aexid: '16_alpha_premult_black:18',
                    alphaMode: 5414,
                    duration: 0,
                    file: transparentPath,
                    folder: [],
                    frameRate: 0,
                    height: 50,
                    label: 5,
                    name: '16_Alpha_Premult_Black',
                    pixelAspect: 1,
                    type: AEX_FILE_FOOTAGE_ITEM,
                    width: 50,
                },
            ];

            await aex.create(AeObject.Project, footageData[0]);
            await aex.create(AeObject.Project, footageData[1]);
            await aex.create(AeObject.Project, footageData[2]);

            const result = await aex.get(AeObject.Project);
            const project = result.object;

            footageData[0].aexid = '';
            project.items[0].aexid = '';
            footageData[1].aexid = '';
            project.items[1].aexid = '';
            footageData[2].aexid = '';
            project.items[2].aexid = '';

            assertAreEqual(project.items, footageData);
        });
    });

    describe('Invert Alpha', async () => {
        it.skip(`Get TODO`, async () => {});
        it.skip(`Create TODO`, async () => {});
    });

    describe('Premult Color', async () => {
        it(`Get`, async () => {
            const result = await getProject('assets/project_footage.aep', AeObject.Project);

            const items = result.object.items;

            console.log('alpha_premult_black', items[15]);
            assertAreEqual(items[15], {
                aexid: '16_alpha_premult_black:20',
                alphaMode: 5414,
                duration: 0,
                file: transparentPath,
                folder: [],
                frameRate: 0,
                height: 50,
                label: 5,
                name: '16_Alpha_Premult_Black',
                pixelAspect: 1,
                type: AEX_FILE_FOOTAGE_ITEM,
                width: 50,
            });

            console.log('alpha_premult_red', items[16]);
            assertAreEqual(items[16], {
                aexid: '17_alpha_premult_red:22',
                alphaMode: 5414,
                duration: 0,
                file: transparentPath,
                folder: [],
                frameRate: 0,
                height: 50,
                label: 5,
                name: '17_Alpha_Premult_Red',
                pixelAspect: 1,
                premulColor: [1, 0, 0],
                type: AEX_FILE_FOOTAGE_ITEM,
                width: 50,
            });
        });

        it(`Create`, async () => {
            await openCleanProject();

            const footageData = [
                {
                    aexid: '16_alpha_premult_black:20',
                    alphaMode: 5414,
                    duration: 0,
                    file: transparentPath,
                    folder: [],
                    frameRate: 0,
                    height: 50,
                    label: 5,
                    name: '16_Alpha_Premult_Black',
                    pixelAspect: 1,
                    type: AEX_FILE_FOOTAGE_ITEM,
                    width: 50,
                },
                {
                    aexid: '17_alpha_premult_red:2',
                    alphaMode: 5414,
                    duration: 0,
                    file: transparentPath,
                    folder: [],
                    frameRate: 0,
                    height: 50,
                    label: 5,
                    name: '17_Alpha_Premult_Red',
                    pixelAspect: 1,
                    premulColor: [1, 0, 0],
                    type: AEX_FILE_FOOTAGE_ITEM,
                    width: 50,
                },
            ];

            await aex.create(AeObject.Project, footageData[0]);
            await aex.create(AeObject.Project, footageData[1]);

            const result = await aex.get(AeObject.Project);
            const project = result.object;

            footageData[0].aexid = '';
            project.items[0].aexid = '';

            assertAreEqual(project.items, footageData);
        });
    });

    describe('Field Separation', async () => {
        it(`Get`, async () => {
            const result = await getProject('assets/project_footage.aep', AeObject.Project);

            const items = result.object.items;

            console.log('split_fields_upper', items[0]);
            assertAreEqual(items[0], {
                aexid: '01_still_fields_upper:3',
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

        it(`Create`, async () => {
            await openCleanProject();

            const footageData = [
                {
                    aexid: '01_still_fields_upper:3',
                    conformFrameRate: 30,
                    duration: 0.06666666666667,
                    fieldSeparationType: 5612,
                    file: seqPath,
                    folder: [],
                    frameRate: 30,
                    height: 432,
                    label: 3,
                    name: '01_Still_Fields_Upper',
                    pixelAspect: 1,
                    sequence: true,
                    type: AEX_FILE_FOOTAGE_ITEM,
                    width: 480,
                },
                {
                    aexid: '03_still_fields_lower:2',
                    conformFrameRate: 30,
                    duration: 0.06666666666667,
                    fieldSeparationType: 5614,
                    file: seqPath,
                    folder: [],
                    frameRate: 30,
                    height: 432,
                    label: 3,
                    name: '03_Still_Fields_Lower',
                    pixelAspect: 1,
                    sequence: true,
                    type: AEX_FILE_FOOTAGE_ITEM,
                    width: 480,
                },
            ];

            await aex.create(AeObject.Project, footageData[0]);
            await aex.create(AeObject.Project, footageData[1]);

            const result = await aex.get(AeObject.Project);
            const project = result.object;

            footageData[0].aexid = '';
            project.items[0].aexid = '';

            assertAreEqual(project.items, footageData);
        });
    });

    describe('High-Quality Field Separation', async () => {
        it(`Get`, async () => {
            const result = await getProject('assets/project_footage.aep', AeObject.Project);

            const items = result.object.items;

            console.log('split_fields_upper_preserve', items[1]);
            assertAreEqual(items[1], {
                aexid: '02_still_fields_upper_preserveedges:4',
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

        it(`Create`, async () => {
            await openCleanProject();

            const footageData = [
                {
                    aexid: '02_still_fields_upper_preserveedges:3',
                    conformFrameRate: 30,
                    duration: 0.06666666666667,
                    fieldSeparationType: 5612,
                    file: seqPath,
                    folder: [],
                    frameRate: 30,
                    height: 432,
                    highQualityFieldSeparation: true,
                    label: 3,
                    name: '02_still_fields_upper_preserveedges',
                    pixelAspect: 1,
                    sequence: true,
                    type: AEX_FILE_FOOTAGE_ITEM,
                    width: 480,
                },
                {
                    aexid: '04_still_fields_lower_preserveedges:2',
                    conformFrameRate: 30,
                    duration: 0.06666666666667,
                    fieldSeparationType: 5614,
                    file: seqPath,
                    folder: [],
                    frameRate: 30,
                    height: 432,
                    highQualityFieldSeparation: true,
                    label: 3,
                    name: '04_still_fields_lower_preserveedges',
                    pixelAspect: 1,
                    sequence: true,
                    type: AEX_FILE_FOOTAGE_ITEM,
                    width: 480,
                },
            ];

            await aex.create(AeObject.Project, footageData[0]);
            await aex.create(AeObject.Project, footageData[1]);

            const result = await aex.get(AeObject.Project);
            const project = result.object;

            footageData[0].aexid = '';
            project.items[0].aexid = '';

            assertAreEqual(project.items, footageData);
        });
    });

    describe('Conform Frame Rate', async () => {
        it(`Get`, async () => {
            const result = await getProject('assets/project_footage.aep', AeObject.Project);

            const items = result.object.items;

            console.log('conform_frame_rate', items[11]);
            assertAreEqual(items[11], {
                aexid: '12_conformframerate:17',
                conformFrameRate: 2,
                duration: 60,
                folder: [],
                frameRate: 2,
                height: 1080,
                label: 3,
                name: '12_ConformFrameRate',
                pixelAspect: 1,
                type: AEX_PLACEHOLDER_ITEM,
                width: 1920,
            });
        });

        it(`Create`, async () => {
            await openCleanProject();

            const footageData = {
                aexid: '12_conformframerate:17',
                conformFrameRate: 2,
                duration: 60,
                folder: [],
                frameRate: 2,
                height: 1080,
                label: 3,
                name: '12_ConformFrameRate',
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

    describe('Remove Pulldown', async () => {
        it(`Get`, async () => {
            const result = await getProject('assets/project_footage.aep', AeObject.Project);

            const items = result.object.items;

            console.log('remove_pulldown', items[12]);
            assertAreEqual(items[12], {
                aexid: '13_pulldown:15',
                conformFrameRate: 24,
                duration: 60,
                fieldSeparationType: 5612,
                folder: [],
                frameRate: 19.1999969482422,
                height: 1080,
                label: 3,
                name: '13_Pulldown',
                pixelAspect: 1,
                removePulldown: 5818,
                type: AEX_PLACEHOLDER_ITEM,
                width: 1920,
            });
        });

        it(`Create`, async () => {
            await openCleanProject();

            const footageData = {
                aexid: '13_pulldown:15',
                conformFrameRate: 24,
                duration: 60,
                fieldSeparationType: 5612,
                folder: [],
                frameRate: 19.1999969482422,
                height: 1080,
                label: 3,
                name: '13_Pulldown',
                pixelAspect: 1,
                removePulldown: 5818,
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

    describe('Loop', async () => {
        it(`Get`, async () => {
            const result = await getProject('assets/project_footage.aep', AeObject.Project);

            const items = result.object.items;

            console.log('loop', items[10]);
            assertAreEqual(items[10], {
                aexid: '11_loop:13',
                conformFrameRate: 30,
                duration: 180,
                folder: [],
                frameRate: 30,
                height: 1080,
                label: 3,
                loop: 3,
                name: '11_Loop',
                pixelAspect: 1,
                type: AEX_PLACEHOLDER_ITEM,
                width: 1920,
            });
        });

        it(`Create`, async () => {
            await openCleanProject();

            const footageData = {
                aexid: '11_loop:13',
                conformFrameRate: 30,
                duration: 180,
                folder: [],
                frameRate: 30,
                height: 1080,
                label: 3,
                loop: 3,
                name: '11_Loop',
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

    describe.skip('Start Timecode [Not API supported]', async () => {
        it(`Get TODO`, async () => {});
        it(`Create TODO`, async () => {});
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
