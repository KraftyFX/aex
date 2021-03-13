import { expect } from 'chai';
import { AeObject, aex } from './aex';
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
                { itemType: 'Folder', name: 'Solids' },
                {
                    duration: 0,
                    folder: 'Solids',
                    frameRate: 0,
                    height: 500,
                    itemType: 'Solid',
                    label: 1,
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
                    itemType: 'Folder',
                    name: 'Folder A',
                },
                {
                    itemType: 'Folder',
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
                    itemType: 'Folder',
                    name: 'Solids',
                },
                {
                    folder: 'Solids',
                    itemType: 'Folder',
                    name: 'Folder A',
                },
                {
                    folder: 'Folder A',
                    itemType: 'Folder',
                    name: 'Folder C',
                },
                {
                    folder: 'Solids',
                    itemType: 'Folder',
                    name: 'Folder B',
                },
            ]);
    });
});
