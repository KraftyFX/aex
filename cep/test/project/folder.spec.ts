import { AeObject, aex, getProject } from '../aex';
import { AEX_FOLDER_ITEM, AEX_PROJECT, TEST_TIMEOUT_TIME } from '../constants';
import { cleanupAex, evalAexIntoEstk, openCleanProject } from '../csinterface';
import { assertAreEqual } from '../utils';

describe('Folders', function () {
    this.slow(500);
    this.timeout(TEST_TIMEOUT_TIME);

    before(async () => {
        await evalAexIntoEstk();
    });

    after(async () => {
        await cleanupAex();
    });

    describe('Project Folders', async () => {
        it(`Get`, async () => {
            const result = await getProject('assets/project_folders-flat.aep', AeObject.Project);

            const project = result.object;

            console.log('project_folders-flat', project);
            assertAreEqual(project.items, [
                {
                    aexid: 'folder a:52',
                    folder: [],
                    type: AEX_FOLDER_ITEM,
                    name: 'Folder A',
                },
                {
                    aexid: 'solids:49',
                    folder: [],
                    type: AEX_FOLDER_ITEM,
                    name: 'Solids',
                },
            ]);
        });

        it(`Update`, async () => {
            await openCleanProject();

            const projectData = {
                comps: [],
                items: [
                    {
                        aexid: 'folder a:1',
                        folder: [],
                        type: AEX_FOLDER_ITEM,
                        name: 'Folder A',
                    },
                    {
                        aexid: 'solids:2',
                        folder: [],
                        type: AEX_FOLDER_ITEM,
                        name: 'Solids',
                    },
                ],
                type: AEX_PROJECT,
            };

            await aex.update(AeObject.Project, projectData);

            const result = await aex.get(AeObject.Project);
            const project = result.object;

            assertAreEqual(project.items, projectData.items);
        });
    });

    describe('Nested Project Folders', async () => {
        it(`Get`, async () => {
            const result = await getProject('assets/project_folders-nested.aep', AeObject.Project);

            const project = result.object;

            console.log('project_folders-nested', project);
            assertAreEqual(project.items, [
                {
                    aexid: 'solids:49',
                    folder: [],
                    name: 'Solids',
                    type: AEX_FOLDER_ITEM,
                },
                {
                    aexid: 'folder a:52',
                    folder: ['Solids'],
                    name: 'Folder A',
                    type: AEX_FOLDER_ITEM,
                },
                {
                    aexid: 'folder c:55',
                    folder: ['Solids', 'Folder A'],
                    name: 'Folder C',
                    type: AEX_FOLDER_ITEM,
                },
                {
                    aexid: 'folder b:54',
                    folder: ['Solids'],
                    name: 'Folder B',
                    type: AEX_FOLDER_ITEM,
                },
            ]);
        });

        it(`Update`, async () => {
            await openCleanProject();

            const projectData = {
                comps: [],
                items: [
                    {
                        aexid: 'solids:1',
                        folder: [],
                        name: 'Solids',
                        type: AEX_FOLDER_ITEM,
                    },
                    {
                        aexid: 'folder a:2',
                        folder: ['Solids'],
                        name: 'Folder A',
                        type: AEX_FOLDER_ITEM,
                    },
                    {
                        aexid: 'folder c:3',
                        folder: ['Solids', 'Folder A'],
                        name: 'Folder C',
                        type: AEX_FOLDER_ITEM,
                    },
                    {
                        aexid: 'folder b:4',
                        folder: ['Solids'],
                        name: 'Folder B',
                        type: AEX_FOLDER_ITEM,
                    },
                ],
                type: AEX_PROJECT,
            };

            await aex.update(AeObject.Project, projectData);

            const result = await aex.get(AeObject.Project);
            const project = result.object;

            assertAreEqual(project.items, projectData.items);
        });
    });
});
