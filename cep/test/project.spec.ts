import { AeObject, aex } from './aex';
import { AEX_FOLDER_ITEM, AEX_SOLID_ITEM } from './constants';
import { cleanupAex, evalAexIntoESTK, openProject } from './csinterface';
import { assertAreEqual } from './utils';

describe('Project', function () {
    this.slow(500);
    this.timeout(2000);

    before(async () => {
        await evalAexIntoESTK();
    });

    after(async () => {
        await cleanupAex();
    });

    it(`Can parse basic project attributes`, async () => {
        await openProject('testAssets/project_basic.aep');

        const result = await aex().fromAeObject(AeObject.Project);
        const project = result.object;

        console.log('project_basic', project);
        assertAreEqual(project.items, [
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

    it(`Can parse flat project folders`, async () => {
        await openProject('testAssets/project_folders-flat.aep');

        const result = await aex().fromAeObject(AeObject.Project);
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

    it(`Can parse nested project folders`, async () => {
        await openProject('testAssets/project_folders-nested.aep');

        const result = await aex().fromAeObject(AeObject.Project);
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
                folder: ['Folder A', 'Solids'],
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
});
