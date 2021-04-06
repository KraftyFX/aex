import { AeObject, aex } from '../aex';
import { cleanupAex, evalAexIntoEstk, openProject } from '../csinterface';
import { assertAreEqual } from '../utils';

describe('Comp Markers', function () {
    this.slow(500);
    this.timeout(2000);

    let project: any;

    before(async () => {
        await evalAexIntoEstk();
        await openProject('testAssets/comp_markers.aep');
        const result = await aex().fromAeObject(AeObject.Project);
        project = result.object;
        console.log('comp_markers', project);
    });

    after(async () => {
        await cleanupAex();
    });

    it(`Can parse detailed markers`, async () => {
        assertAreEqual(project.comps[0].markers, [
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
        assertAreEqual(project.comps[1].markers, [
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
