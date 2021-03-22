import { expect } from 'chai';
import { AeObject, aex } from './aex';
import { AEX_COMP_ITEM } from './constants';
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
        await openProject('testAssets/comp_basic.aep');

        const result = await aex().toObjectWithAeObject(AeObject.ActiveComp);

        console.log('comp_basic', result);
        expect(result)
            .property('comps')
            .to.eql([
                {
                    aexid: 'comp 1:1',
                    duration: 4,
                    folder: [],
                    frameRate: 60,
                    height: 720,
                    layers: [],
                    markers: [],
                    name: 'Comp 1',
                    pixelAspect: 1,
                    type: AEX_COMP_ITEM,
                    width: 1280,
                },
            ]);
    });

    describe('Comp Markers', async () => {
        let result: any;

        before(async () => {
            await openProject('testAssets/comp_markers.aep');
            result = await aex().toObjectWithAeObject(AeObject.Project);
            console.log('comp_markers', result);
        });

        it(`Can parse detailed markers`, async () => {
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
        });

        it(`Can parse simple markers`, async () => {
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
});
