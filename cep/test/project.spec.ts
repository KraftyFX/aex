import { expect } from 'chai';
import { AeObject, aex } from './aex';
import { AEX_FOLDER, AEX_SOLID } from './constants';
import { cleanupAeqIpc, cleanupAex, evalAexIntoESTK, openProject } from './csinterface';

describe('Project', function () {
    this.slow(500);
    this.timeout(2000);

    before(async () => {
        await evalAexIntoESTK();
    });

    after(async () => {
        await cleanupAex();
        await cleanupAeqIpc();
    });

    it(`Can parse basic project attributes`, async () => {
        await openProject('testAssets/project_basic.aep');

        const result = await aex().toObjectWithAeObject(AeObject.Project);

        console.log('project_basic', result);
        expect(result)
            .property('items')
            .to.eql([
                {
                    aexid: 'solids:37',
                    folder: [],
                    type: AEX_FOLDER,
                    name: 'Solids',
                },
                {
                    aexid: 'black solid 1:38',
                    duration: 0,
                    folder: ['Solids'],
                    frameRate: 0,
                    height: 500,
                    type: AEX_SOLID,
                    name: 'Black Solid 1',
                    pixelAspect: 1,
                    width: 500,
                },
            ]);
    });

    it(`Can parse flat project folders`, async () => {
        await openProject('testAssets/project_folders-flat.aep');

        const result = await aex().toObjectWithAeObject(AeObject.Project);

        console.log('project_folders-flat', result);
        expect(result)
            .property('items')
            .to.eql([
                {
                    aexid: 'folder a:52',
                    folder: [],
                    type: AEX_FOLDER,
                    name: 'Folder A',
                },
                {
                    aexid: 'solids:49',
                    folder: [],
                    type: AEX_FOLDER,
                    name: 'Solids',
                },
            ]);
    });

    it(`Can parse nested project folders`, async () => {
        await openProject('testAssets/project_folders-nested.aep');

        const result = await aex().toObjectWithAeObject(AeObject.Project);

        console.log('project_folders-nested', result);
        expect(result)
            .property('items')
            .to.eql([
                {
                    aexid: 'solids:49',
                    folder: [],
                    name: 'Solids',
                    type: AEX_FOLDER,
                },
                {
                    aexid: 'folder a:52',
                    folder: ['Solids'],
                    name: 'Folder A',
                    type: AEX_FOLDER,
                },
                {
                    aexid: 'folder c:55',
                    folder: ['Folder A', 'Solids'],
                    name: 'Folder C',
                    type: AEX_FOLDER,
                },
                {
                    aexid: 'folder b:54',
                    folder: ['Solids'],
                    name: 'Folder B',
                    type: AEX_FOLDER,
                },
            ]);
    });
});
