import { AeObject, aex, getFilePath, getProject } from '../aex';
import { AEX_FILE_FOOTAGE_ITEM, AEX_FOLDER_ITEM, AEX_PLACEHOLDER_ITEM, AEX_SOLID_ITEM, TEST_TIMEOUT_TIME } from '../constants';
import { cleanupAex, evalAexIntoEstk, openCleanProject } from '../csinterface';
import { assertAreEqual } from '../utils';

describe('Footage', function () {
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
                    frameRate: 30,
                    height: 1080,
                    label: 3,
                    name: 'Placeholder',
                    pixelAspect: 2,
                    type: AEX_PLACEHOLDER_ITEM,
                    width: 1920,
                },
                {
                    aexid: 'solids:37',
                    type: AEX_FOLDER_ITEM,
                    name: 'Solids',
                },
                {
                    aexid: 'black solid 1:38',
                    folder: ['Solids'],
                    height: 500,
                    type: AEX_SOLID_ITEM,
                    name: 'Black Solid 1',
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
                frameRate: 30,
                height: 1080,
                label: 3,
                name: 'Placeholder',
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
                file: transparentPath,
                label: 5,
                name: '14_Alpha_Straight',
                type: AEX_FILE_FOOTAGE_ITEM,
            });

            console.log('alpha_mode_ignore', items[14]);
            assertAreEqual(items[14], {
                aexid: '15_alpha_ignore:19',
                alphaMode: 5413,
                file: transparentPath,
                label: 5,
                name: '15_Alpha_Ignore',
                type: AEX_FILE_FOOTAGE_ITEM,
            });

            console.log('alpha_mode_premult', items[15]);
            assertAreEqual(items[15], {
                aexid: '16_alpha_premult_black:20',
                alphaMode: 5414,
                file: transparentPath,
                label: 5,
                name: '16_Alpha_Premult_Black',
                type: AEX_FILE_FOOTAGE_ITEM,
            });
        });

        it(`Create`, async () => {
            await openCleanProject();

            const footageData = [
                {
                    aexid: '14_alpha_straight:16',
                    alphaMode: 5412,
                    file: transparentPath,
                    label: 5,
                    name: '14_Alpha_Straight',
                    type: AEX_FILE_FOOTAGE_ITEM,
                },
                {
                    aexid: '15_alpha_ignore:17',
                    alphaMode: 5413,
                    file: transparentPath,
                    label: 5,
                    name: '15_Alpha_Ignore',
                    type: AEX_FILE_FOOTAGE_ITEM,
                },
                {
                    aexid: '16_alpha_premult_black:18',
                    alphaMode: 5414,
                    file: transparentPath,
                    label: 5,
                    name: '16_Alpha_Premult_Black',
                    type: AEX_FILE_FOOTAGE_ITEM,
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
        it(`Get`, async () => {
            const result = await getProject('assets/project_footage.aep', AeObject.Project);

            const items = result.object.items;

            console.log('invert_alpha', items[17]);
            assertAreEqual(items[17], {
                aexid: '18_alpha_invert:21',
                alphaMode: 5412,
                file: transparentPath,
                invertAlpha: true,
                label: 5,
                name: '18_Alpha_Invert',
                type: AEX_FILE_FOOTAGE_ITEM,
            });
        });

        it(`Create`, async () => {
            await openCleanProject();

            const footageData = {
                aexid: '18_alpha_invert:3',
                alphaMode: 5412,
                file: transparentPath,
                invertAlpha: true,
                label: 5,
                name: '18_Alpha_Invert',
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

    describe('Premult Color', async () => {
        it(`Get`, async () => {
            const result = await getProject('assets/project_footage.aep', AeObject.Project);

            const items = result.object.items;

            console.log('alpha_premult_black', items[15]);
            assertAreEqual(items[15], {
                aexid: '16_alpha_premult_black:20',
                alphaMode: 5414,
                file: transparentPath,
                label: 5,
                name: '16_Alpha_Premult_Black',
                type: AEX_FILE_FOOTAGE_ITEM,
            });

            console.log('alpha_premult_red', items[16]);
            assertAreEqual(items[16], {
                aexid: '17_alpha_premult_red:22',
                alphaMode: 5414,
                file: transparentPath,
                label: 5,
                name: '17_Alpha_Premult_Red',
                premulColor: [1, 0, 0],
                type: AEX_FILE_FOOTAGE_ITEM,
            });
        });

        it(`Create`, async () => {
            await openCleanProject();

            const footageData = [
                {
                    aexid: '16_alpha_premult_black:20',
                    alphaMode: 5414,
                    file: transparentPath,
                    label: 5,
                    name: '16_Alpha_Premult_Black',
                    type: AEX_FILE_FOOTAGE_ITEM,
                },
                {
                    aexid: '17_alpha_premult_red:2',
                    alphaMode: 5414,
                    file: transparentPath,
                    label: 5,
                    name: '17_Alpha_Premult_Red',
                    premulColor: [1, 0, 0],
                    type: AEX_FILE_FOOTAGE_ITEM,
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
                fieldSeparationType: 5612,
                file: stillPath,
                label: 5,
                name: '01_Still_Fields_Upper',
                type: AEX_FILE_FOOTAGE_ITEM,
            });

            console.log('split_fields_lower', items[2]);
            assertAreEqual(items[2], {
                aexid: '03_still_fields_lower:5',
                fieldSeparationType: 5614,
                file: stillPath,
                label: 5,
                name: '03_Still_Fields_Lower',
                type: AEX_FILE_FOOTAGE_ITEM,
            });
        });

        it(`Create`, async () => {
            await openCleanProject();

            const footageData = [
                {
                    aexid: '01_still_fields_upper:3',
                    conformFrameRate: 30,
                    fieldSeparationType: 5612,
                    file: seqPath,
                    label: 3,
                    name: '01_Still_Fields_Upper',
                    sequence: true,
                    type: AEX_FILE_FOOTAGE_ITEM,
                },
                {
                    aexid: '03_still_fields_lower:2',
                    conformFrameRate: 30,
                    fieldSeparationType: 5614,
                    file: seqPath,
                    label: 3,
                    name: '03_Still_Fields_Lower',
                    sequence: true,
                    type: AEX_FILE_FOOTAGE_ITEM,
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
                fieldSeparationType: 5612,
                highQualityFieldSeparation: true,
                file: stillPath,
                label: 5,
                name: '02_Still_Fields_Upper_PreserveEdges',
                type: AEX_FILE_FOOTAGE_ITEM,
            });

            console.log('split_fields_lower_preserve', items[3]);
            assertAreEqual(items[3], {
                aexid: '04_still_fields_lower_preserveedges:6',
                fieldSeparationType: 5614,
                highQualityFieldSeparation: true,
                file: stillPath,
                label: 5,
                name: '04_Still_Fields_Lower_PreserveEdges',
                type: AEX_FILE_FOOTAGE_ITEM,
            });
        });

        it(`Create`, async () => {
            await openCleanProject();

            const footageData = [
                {
                    aexid: '02_still_fields_upper_preserveedges:3',
                    conformFrameRate: 30,
                    fieldSeparationType: 5612,
                    file: seqPath,
                    highQualityFieldSeparation: true,
                    label: 3,
                    name: '02_still_fields_upper_preserveedges',
                    sequence: true,
                    type: AEX_FILE_FOOTAGE_ITEM,
                },
                {
                    aexid: '04_still_fields_lower_preserveedges:2',
                    conformFrameRate: 30,
                    fieldSeparationType: 5614,
                    file: seqPath,
                    highQualityFieldSeparation: true,
                    label: 3,
                    name: '04_still_fields_lower_preserveedges',
                    sequence: true,
                    type: AEX_FILE_FOOTAGE_ITEM,
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
                frameRate: 2,
                height: 1080,
                label: 3,
                name: '12_ConformFrameRate',
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
                frameRate: 2,
                height: 1080,
                label: 3,
                name: '12_ConformFrameRate',
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
                frameRate: 19.2,
                height: 1080,
                label: 3,
                name: '13_Pulldown',
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
                frameRate: 19.2,
                height: 1080,
                label: 3,
                name: '13_Pulldown',
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
                frameRate: 30,
                height: 1080,
                label: 3,
                loop: 3,
                name: '11_Loop',
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
                frameRate: 30,
                height: 1080,
                label: 3,
                loop: 3,
                name: '11_Loop',
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
});
