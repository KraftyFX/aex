import { AeObject, aex, getProject } from './aex';
import { AEX_COMP_ITEM, AEX_PROJECT, TEST_TIMEOUT_TIME } from './constants';
import { cleanupAex, evalAexIntoEstk, IPCStats, openProject, setOnResult } from './csinterface';
import { assertAreEqual } from './utils';

const cepfs = (window as any).cep.fs;

describe.skip('Rafi Test Stuff', function () {
    this.slow(500);
    this.timeout(TEST_TIMEOUT_TIME);

    let project: any;

    const projectData = {
        comps: [
            {
                aexid: 'comp 1:1',
                duration: 4,
                folder: [],
                frameRate: 60,
                height: 720,
                layers: [],
                markers: [
                    {
                        duration: 0.2,
                        time: 0.1667,
                    },
                    {
                        comment: 'Some Comment',
                        duration: 1,
                        label: 4,
                        protectedRegion: true,
                        time: 0.4667,
                    },
                    {
                        label: 3,
                        time: 0.7833,
                    },
                    {
                        comment: 'banana',
                        time: 1.8333,
                    },
                    {
                        duration: 0.3333,
                        protectedRegion: true,
                        time: 3.55,
                    },
                ],
                name: 'DetailedMarkers',
                pixelAspect: 1,
                type: AEX_COMP_ITEM,
                width: 1280,
            },
            {
                aexid: 'comp 2:2',
                duration: 4,
                folder: [],
                frameRate: 60,
                height: 720,
                layers: [],
                markers: [
                    {
                        time: 0.1667,
                    },
                    {
                        time: 0.4667,
                    },
                    {
                        time: 0.7833,
                    },
                    {
                        time: 1.8333,
                    },
                    {
                        time: 3.55,
                    },
                ],
                name: 'PlainMarkers',
                pixelAspect: 1,
                type: AEX_COMP_ITEM,
                width: 1280,
            },
        ],
        items: [],
        type: AEX_PROJECT,
    };

    before(async () => {
        await evalAexIntoEstk();
        // await openProject('assets/prescan_1_flat_project.aep');
    });

    after(async () => {
        await cleanupAex();
        setOnResult();
    });

    it(`Get`, async () => {
        await openProject('assets/comp_markers.aep');
        const result1 = await aex.get(AeObject.Project);
        const result2 = await getProject(`assets/comp_markers.aep`, AeObject.Project);
        assertAreEqual(result1, result2);
    });

    it(`Prescan`, async () => {
        const runtimes: number[] = [];

        setOnResult((stats: IPCStats) => runtimes.push(stats.func));

        const res = await aex.prescan(AeObject.Project);

        const results = {
            stats: res.stats,
        };

        results.stats.totalCount =
            res.stats.compCount + res.stats.nonCompItemCount + res.stats.layerCount + res.stats.propertyCount + res.stats.keyCount;

        const err = new Error();
        err.name = 'Prescan\n';
        err.stack = JSON.stringify(res, null, 3);
        throw err;
    });

    it(`Get`, async () => {
        const runtimes: number[] = [];

        setOnResult((stats: IPCStats) => runtimes.push(stats.func));

        const res = await aex.get(AeObject.Project);
        const totalMs = runtimes.reduce((p, c) => c + p, 0);

        // res.stats.totalMs = res.stats.compCount + res.stats.nonCompItemCount + res.stats.layerCount + res.stats.propertyCount + res.stats.keyCount;

        const profile: any = {};

        const path = '/Users/rafikhan/kraftyfx/aex/cep/_build/stats.csv';
        const lines: string[] = [];

        Object.keys(res.profile).forEach((m) => {
            const data = res.profile[m];

            lines.push(data.map((v) => [m, v.elapsed, v.meta].join(',')).join('\n'));

            const count = data.length;
            const total = data.reduce((p, c) => c.elapsed + p, 0);
            const avg = Math.ceil(total / count);

            profile[m] = { count, avg, total };
        });

        cepfs.writeFile(path, lines.join('\n'));

        const results = {
            stats: res.stats,
            profile,
        };

        results.stats.totalCount =
            res.stats.compCount + res.stats.nonCompItemCount + res.stats.layerCount + res.stats.propertyCount + res.stats.keyCount;
        results.profile.totalMs = totalMs;

        const err = new Error();
        err.name = 'Get\n';
        err.stack = JSON.stringify(results, null, 3);
        throw err;
    });

    /*
    before(async () => {
        await evalAexIntoEstk();
        await openProject('assets/property_unsupported.aep');
    });

    after(async () => {
        await cleanupAex();
    });

    it(`Sanity testing callback mechanism`, async () => {
        let called = false;

        await aex().benchmark({
            callback: (result) => {
                called = true;
                expect(result).to.be.true;
            },
        });

        expect(called, 'callback invoked').to.be.true;
    });

    it(`Can get log of serialization failures`, async () => {
        const result = await aex().fromAeObject(AeObject.ActiveComp, {
            unspportedPropertyBehavior: 'log',
        });

        expect(result.object).to.be.ok;
        expect(result.log[0].message).to.contain('is unsupported');
    });

    it(`Can get a callback during serialization failure`, async () => {
        let called = false;

        await aex().fromAeObject(AeObject.ActiveComp, {
            unspportedPropertyBehavior: ({ aexProperty, message }) => {
                called = true;

                expect(aexProperty).to.deep.contain({
                    type: AEX_NONE_PROPERTY,
                    name: 'Colors',
                });

                expect(message).to.contain('is unsupported');
            },
        });

        expect(called, 'callback invoked').to.be.true;
    });
    */
});
