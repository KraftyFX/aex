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

    it(`Can parse empty project`, async () => {
        aex().openProject('testAssets/project_empty.aep');

        const result = await aex().toObjectWithAeObject(AeObject.Project);

        expect(result).property('items').to.be.empty;
        expect(result).property('comps').to.be.empty;
    });

    it(`Can parse essential comp attributes`, async () => {
        aex().openProject('testAssets/comp_empty-comp.aep');

        const result = await aex().toObjectWithAeObject(AeObject.Project);

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

    it(`Unsophisticated test to check comp data parsing`, async () => {
        const result = await aex().toObjectWithAeObject(AeObject.ActiveComp);

        expect(result);
    });

    it(`Unsophisticated test to check project data parsing`, async () => {
        const result = await aex().toObjectWithAeObject(AeObject.Project);

        console.log(result);
        expect(result);
    });
});
