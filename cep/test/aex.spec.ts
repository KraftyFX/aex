import { expect } from 'chai';
import { AeObject, aex } from './aex';
import { cleanupAeqIpc, cleanupAex, evalAexIntoESTK } from './csinterface';

describe('aex().toObject()', function () {
    this.timeout(2000);

    before(async () => {
        await evalAexIntoESTK();
    });

    after(async () => {
        await cleanupAex();
        await cleanupAeqIpc();
    });

    /** Meta tests */
    it(`Can throw if undefined is passed in`, async () => {
        try {
            await aex().toObject(undefined);

            expect.fail(`Test should have thrown but it completed.`);
        } catch (e) {
            expect(e.isEstkError).to.be.true;
            expect(e.message).to.contain('undefined');
        }
    });

    it(`Random test to show how to compare results`, async () => {
        const result = await aex().toObject('this is a bad test case and should be rewritten');

        expect(result).to.deep.equal({ items: [], comps: [] });
    });

    it.skip(`Cannot serialize if there is no active comp open`, async () => {
        try {
            const result = await aex().toObjectWithAeObject(AeObject.ActiveComp);
            expect(result).to.equal('unknown');
        } catch (e) {
            expect(e.isEstkError).to.be.true;
            expect(e.message).to.contain('undefined');
        }
    });

    /** Project tests */
    it(`Can parse basic project attributes`, async () => {
        aex().openProject('testAssets/project_basic.aep');

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
        expect(result).property('comps').to.be.empty;
    });

    it(`Can parse flat project folders`, async () => {
        aex().openProject('testAssets/project_folders-flat.aep');

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
        expect(result).property('comps').to.be.empty;
    });

    it(`Can parse nested project folders`, async () => {
        aex().openProject('testAssets/project_folders-nested.aep');

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
        expect(result).property('comps').to.be.empty;
    });

    /** Comp tests */
    it(`Can parse basic comp attributes`, async () => {
        aex().openProject('testAssets/comp_empty-comp.aep');

        const result = await aex().toObjectWithAeObject(AeObject.Project);

        console.log('comp_empty-comp', result);
        expect(result).property('items').to.be.empty;
        expect(result)
            .property('comps')
            .to.eql([
                {
                    duration: 4,
                    frameRate: 60,
                    height: 720,
                    itemType: 'Comp',
                    name: 'Comp 1',
                    pixelAspect: 1,
                    width: 1280,
                },
            ]);
    });

    it(`Can parse comp markers`, async () => {
        aex().openProject('testAssets/comp_markers.aep');

        const result = await aex().toObjectWithAeObject(AeObject.Project);

        console.log('comp_markers-comp', result);
        expect(result).property('items').to.be.empty;
        expect(result)
            .property('comps')
            .to.eql([
                {
                    duration: 4,
                    frameRate: 60,
                    height: 720,
                    itemType: 'Comp',
                    markers: [
                        {
                            duration: 0.2,
                            time: 0.16666666666667,
                        },
                        {
                            comment: 'Some Comment',
                            duration: 1,
                            label: 4,
                            protectedRegion: true,
                            time: 0.46666666666667,
                        },
                        {
                            label: 3,
                            time: 0.78333333333333,
                        },
                        {
                            comment: 'banana',
                            time: 1.83333333333333,
                        },
                        {
                            duration: 0.33333333333333,
                            protectedRegion: true,
                            time: 3.55,
                        },
                    ],
                    name: 'DetailedMarkers',
                    pixelAspect: 1,
                    width: 1280,
                },
                {
                    duration: 4,
                    frameRate: 60,
                    height: 720,
                    itemType: 'Comp',
                    markers: [
                        {
                            time: 0.16666666666667,
                        },
                        {
                            time: 0.46666666666667,
                        },
                        {
                            time: 0.78333333333333,
                        },
                        {
                            time: 1.83333333333333,
                        },
                        {
                            time: 3.55,
                        },
                    ],
                    name: 'PlainMarkers',
                    pixelAspect: 1,
                    width: 1280,
                },
            ]);
    });

    /** Layer tests */
    it(`Can parse basic layer attributes`, async () => {
        aex().openProject('testAssets/layer_basic.aep');

        const result = await aex().toObjectWithAeObject(AeObject.ActiveComp);

        console.log('layer_basic', result);
        expect(result).property('items').to.be.empty;
        expect(result)
            .property('comps')
            .to.eql([
                {
                    duration: 4,
                    frameRate: 60,
                    height: 720,
                    itemType: 'Comp',
                    layers: [
                        {
                            label: 1,
                            layerType: 'AVLayer',
                            name: 'Solo',
                            nullLayer: true,
                            solo: true,
                        },
                        {
                            label: 1,
                            layerType: 'AVLayer',
                            name: 'Empty',
                            nullLayer: true,
                        },
                        {
                            inPoint: 0.5,
                            label: 1,
                            layerType: 'AVLayer',
                            name: 'Timing',
                            nullLayer: true,
                            outPoint: 3.06666666666667,
                        },
                        {
                            adjustmentLayer: true,
                            autoOrient: 4213,
                            collapseTransformation: true,
                            label: 2,
                            layerType: 'AVLayer',
                            motionBlur: true,
                            name: 'Flags',
                            nullLayer: true,
                            samplingQuality: 4813,
                            shy: true,
                            threeDLayer: true,
                        },
                        {
                            blendingMode: 5216,
                            label: 1,
                            layerType: 'AVLayer',
                            name: 'Blend Stretch',
                            nullLayer: true,
                            outPoint: 1,
                            stretch: 25,
                        },
                        {
                            label: 1,
                            layerType: 'AVLayer',
                            name: 'Parented',
                            nullLayer: true,
                            parentLayerIndex: 4,
                        },
                    ],
                    name: 'Comp 1',
                    pixelAspect: 1,
                    width: 1280,
                },
            ]);
    });

    it(`Can parse light layer attributes`, async () => {
        aex().openProject('testAssets/layer_light.aep');

        const result = await aex().toObjectWithAeObject(AeObject.ActiveComp);

        console.log('layer_light', result);
        expect(result).property('items').to.be.empty;
        expect(result)
            .property('comps')
            .to.eql([
                {
                    duration: 4,
                    frameRate: 60,
                    height: 720,
                    itemType: 'Comp',
                    layers: [
                        {
                            label: 6,
                            layerType: 'LightLayer',
                            lightType: 4412,
                            name: 'Parallel Light',
                        },
                        {
                            label: 6,
                            layerType: 'LightLayer',
                            lightType: 4413,
                            name: 'Spot Light',
                        },
                        {
                            label: 6,
                            layerType: 'LightLayer',
                            lightType: 4414,
                            name: 'Point Light',
                        },
                        {
                            label: 6,
                            layerType: 'LightLayer',
                            lightType: 4415,
                            name: 'Ambient Light',
                        },
                    ],
                    name: 'Comp 1',
                    pixelAspect: 1,
                    width: 1280,
                },
            ]);
    });

    /** Data dumps */
    it(`Unsophisticated test to check comp data parsing`, async () => {
        const result = await aex().toObjectWithAeObject(AeObject.ActiveComp);

        console.log('activecomp', result);
        expect(result);
    });

    it(`Unsophisticated test to check project data parsing`, async () => {
        const result = await aex().toObjectWithAeObject(AeObject.Project);

        console.log('full project', result);
        expect(result);
    });
});
