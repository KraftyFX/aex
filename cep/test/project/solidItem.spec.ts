import { AeObject, aex, getFilePath, getProject } from '../aex';
import { AEX_FILE_FOOTAGE_ITEM, AEX_FOLDER_ITEM, AEX_PROJECT, AEX_SOLID_ITEM, TEST_TIMEOUT_TIME } from '../constants';
import { cleanupAex, evalAexIntoEstk, openCleanProject } from '../csinterface';
import { assertAreEqual } from '../utils';

describe.only('Solids', function () {
    this.slow(500);
    this.timeout(TEST_TIMEOUT_TIME);

    before(async () => {
        await evalAexIntoEstk();
    });

    after(async () => {
        await cleanupAex();
    });

    describe('Color', async () => {
        it(`Get`, async () => {
            const result = await getProject('assets/project_basic_items.aep', AeObject.Project);
            const project = result.object;

            console.log('solid_color', project.items[2]);
            assertAreEqual(project.items[2], {
                aexid: 'black solid 1:38',
                duration: 0,
                folder: ['Solids'],
                frameRate: 0,
                height: 500,
                type: AEX_SOLID_ITEM,
                name: 'Black Solid 1',
                pixelAspect: 1,
                width: 500,
            });
        });

        it.skip(`Create TODO`, async () => {});

        it(`Update`, async () => {
            await openCleanProject();
            const projectData = {
                comps: [],
                items: [
                    {
                        aexid: 'solids:1',
                        folder: [],
                        type: AEX_FOLDER_ITEM,
                        name: 'Solids',
                    },
                    {
                        aexid: 'yellow solid 1:14',
                        duration: 0,
                        folder: ['Solids'],
                        frameRate: 0,
                        height: 500,
                        type: AEX_SOLID_ITEM,
                        color: [1, 1, 0],
                        name: 'Yellow Solid 1',
                        pixelAspect: 1,
                        width: 500,
                    },
                ],
                type: AEX_PROJECT,
            };

            await aex.update(AeObject.Project, projectData);
            const result = await aex.get(AeObject.Project);
            const project = result.object;

            projectData.items[1].aexid = '';
            project.items[1].aexid = '';

            assertAreEqual(project.items, projectData.items);
        });
    });
});
