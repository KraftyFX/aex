import { AeObject, aex, getProject } from '../aex';
import { AEX_FOLDER_ITEM, AEX_PLACEHOLDER_ITEM, AEX_PROJECT, AEX_SOLID_ITEM, TEST_TIMEOUT_TIME } from '../constants';
import { cleanupAex, evalAexIntoEstk, openCleanProject } from '../csinterface';
import { assertAreEqual } from '../utils';

describe('Project', function () {
    this.slow(500);
    this.timeout(TEST_TIMEOUT_TIME);

    before(async () => {
        await evalAexIntoEstk();
    });

    after(async () => {
        await cleanupAex();
    });

    describe('Basic Project Attributes', async () => {
        it(`Get`, async () => {
            const result = await getProject('assets/project_basic.aep', AeObject.Project);

            const project = result.object;

            console.log('project_basic', project);
            assertAreEqual(project, {
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
                workingGamma: 2.4,
                workingSpace: 'Apple RGB',
            });
        });

        it(`Update`, async () => {
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
                items: [
                    {
                        aexid: 'placeholder:1',
                        conformFrameRate: 30,
                        duration: 5,
                        folder: [],
                        frameRate: 30,
                        height: 1080,
                        label: 3,
                        name: 'Placeholder',
                        type: AEX_PLACEHOLDER_ITEM,
                        width: 1920,
                    },
                    {
                        aexid: 'solids:2',
                        folder: [],
                        type: AEX_FOLDER_ITEM,
                        name: 'Solids',
                    },
                    {
                        aexid: 'black solid 1:15',
                        folder: ['Solids'],
                        height: 500,
                        type: AEX_SOLID_ITEM,
                        name: 'Black Solid 1',
                        width: 500,
                    },
                ],
                linearizeWorkingSpace: true,
                timeDisplayType: 2013,
                type: AEX_PROJECT,
                workingGamma: 2.4,
                workingSpace: 'Apple RGB',
            };

            await aex.update(AeObject.Project, projectData);

            const result = await aex.get(AeObject.Project);
            const project = result.object;
            console.log(project);
            assertAreEqual(project, projectData);
        });
    });
});
