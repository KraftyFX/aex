import { AeObject, aex } from './aex';
import { cleanupAeqIpc, cleanupAex, evalAexIntoESTK, openProject } from './csinterface';
import { assertAreEqual } from './utils';

describe('Layer Markers', function () {
    this.slow(500);
    this.timeout(2000);

    let result: any;

    before(async () => {
        await evalAexIntoESTK();
        await openProject('testAssets/layer_markers.aep');
        result = await aex().toObjectWithAeObject(AeObject.ActiveComp);
        console.log('layer_markers', result);
    });

    after(async () => {
        await cleanupAex();
        await cleanupAeqIpc();
    });

    it('Can parse simple markers', async () => {
        assertAreEqual(result.comps[0].layers[0].markers, [
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

    it('Can parse complicated markers', async () => {
        assertAreEqual(result.comps[0].layers[1].markers, [
            {
                duration: 0.2,
                time: 0.16666666666667,
            },
            {
                comment: 'Some Comment',
                duration: 1,
                label: 4,
                time: 0.46666666666667,
            },
            {
                time: 0.78333333333333,
            },
            {
                comment: 'banana',
                time: 1.83333333333333,
            },
            {
                duration: 0.33333333333333,
                label: 8,
                time: 3.55,
            },
        ]);
    });
});
