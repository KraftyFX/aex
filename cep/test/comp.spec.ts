import { expect } from 'chai';
import { AeObject, aex } from './aex';
import { cleanupAeqIpc, cleanupAex, evalAexIntoESTK, openProject } from './csinterface';

describe('Comp', function () {
    this.slow(500);
    this.timeout(2000);

    before(async () => {
        await evalAexIntoESTK();
    });

    after(async () => {
        await cleanupAex();
        await cleanupAeqIpc();
    });

    /** Comp tests */
    it(`Can parse basic comp attributes`, async () => {
        await openProject('testAssets/comp_empty-comp.aep');

        const result = await aex().toObjectWithAeObject(AeObject.ActiveComp);

        console.log('comp_empty-comp', result);
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
        await openProject('testAssets/comp_markers.aep');

        const result = await aex().toObjectWithAeObject(AeObject.Project);

        console.log('comp_markers-comp', result);

        expect(result).property('comps').to.be.of.length(2);

        expect(result.comps[0])
            .property('markers')
            .to.eql([
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
            ]);

        expect(result.comps[1])
            .property('markers')
            .to.eql([
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
            ]);
    });
});
