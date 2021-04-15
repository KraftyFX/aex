import { AeObject, aex } from '../aex';
import { cleanupAex, evalAexIntoEstk, openProject } from '../csinterface';
import { assertAreEqual } from '../utils';

describe('Layer Markers', function () {
    this.slow(500);
    this.timeout(2000);

    let comp: any;

    before(async () => {
        await evalAexIntoEstk();
        await openProject('testAssets/layer_markers.aep');
        const result = await aex().fromAeObject(AeObject.ActiveComp);
        comp = result.object;
        console.log('layer_markers', comp);
    });

    after(async () => {
        await cleanupAex();
    });

    it('Can parse simple layer markers', async () => {
        assertAreEqual(comp.layers[0].markers, [
            {
                time: 0.16667,
            },
            {
                time: 0.46667,
            },
            {
                time: 0.78333,
            },
            {
                time: 1.83333,
            },
            {
                time: 3.55,
            },
        ]);
    });

    it('Can parse complicated layer markers', async () => {
        assertAreEqual(comp.layers[1].markers, [
            {
                duration: 0.2,
                time: 0.16667,
            },
            {
                comment: 'Some Comment',
                duration: 1,
                label: 4,
                time: 0.46667,
            },
            {
                time: 0.78333,
            },
            {
                comment: 'banana',
                time: 1.83333,
            },
            {
                duration: 0.33333,
                label: 8,
                time: 3.55,
            },
        ]);
    });
});
