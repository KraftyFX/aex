import { AeObject, aex } from '../aex';
import { AEX_COMP_ITEM, AEX_MARKER, AEX_PROJECT } from '../constants';
import { cleanupAex, evalAexIntoEstk, openCleanProject, openProject } from '../csinterface';
import { assertAreEqual } from '../utils';

describe('Comp Markers', function () {
    this.slow(500);
    this.timeout(5000);

    before(async () => {
        await evalAexIntoEstk();
    });

    after(async () => {
        await cleanupAex();
    });

    describe('Get', async () => {
        let project: any;

        before(async () => {
            await openProject('testAssets/comp_markers.aep');
            const result = await aex().get(AeObject.Project);
            project = result.object;
            console.log('comp_markers', project);
        });

        it(`Can parse detailed comp markers`, async () => {
            assertAreEqual(project.comps[0].markers, [
                {
                    duration: 0.2,
                    time: 0.1667,
                    type: AEX_MARKER,
                },
                {
                    comment: 'Some Comment',
                    duration: 1,
                    label: 4,
                    protectedRegion: true,
                    time: 0.4667,
                    type: AEX_MARKER,
                },
                {
                    label: 3,
                    time: 0.7833,
                    type: AEX_MARKER,
                },
                {
                    comment: 'banana',
                    time: 1.8333,
                    type: AEX_MARKER,
                },
                {
                    duration: 0.3333,
                    protectedRegion: true,
                    time: 3.55,
                    type: AEX_MARKER,
                },
            ]);
        });

        it(`Can parse simple comp markers`, async () => {
            assertAreEqual(project.comps[1].markers, [
                {
                    time: 0.1667,
                    type: AEX_MARKER,
                },
                {
                    time: 0.4667,
                    type: AEX_MARKER,
                },
                {
                    time: 0.7833,
                    type: AEX_MARKER,
                },
                {
                    time: 1.8333,
                    type: AEX_MARKER,
                },
                {
                    time: 3.55,
                    type: AEX_MARKER,
                },
            ]);
        });
    });

    describe('Create in New Comp', async () => {
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
                            type: AEX_MARKER,
                        },
                        {
                            comment: 'Some Comment',
                            duration: 1,
                            label: 4,
                            protectedRegion: true,
                            time: 0.4667,
                            type: AEX_MARKER,
                        },
                        {
                            label: 3,
                            time: 0.7833,
                            type: AEX_MARKER,
                        },
                        {
                            comment: 'banana',
                            time: 1.8333,
                            type: AEX_MARKER,
                        },
                        {
                            duration: 0.3333,
                            protectedRegion: true,
                            time: 3.55,
                            type: AEX_MARKER,
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
                            type: AEX_MARKER,
                        },
                        {
                            time: 0.4667,
                            type: AEX_MARKER,
                        },
                        {
                            time: 0.7833,
                            type: AEX_MARKER,
                        },
                        {
                            time: 1.8333,
                            type: AEX_MARKER,
                        },
                        {
                            time: 3.55,
                            type: AEX_MARKER,
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
            await openCleanProject();

            await aex().update(AeObject.Project, projectData);

            const result = await aex().get(AeObject.Project);
            project = result.object;
        });

        it(`Can create detailed markers`, async () => {
            assertAreEqual(project.comps[0].markers, projectData.comps[0].markers);
        });

        it(`Can create simple markers`, async () => {
            assertAreEqual(project.comps[1].markers, projectData.comps[1].markers);
        });
    });

    describe('Create on Existing Comp', async () => {
        before(async () => {
            await openProject('testAssets/layer_basic.aep');
        });

        it(`Can create simple marker`, async () => {
            const markerData = {
                time: 0,
                type: AEX_MARKER,
            };

            await aex().create(AeObject.ActiveComp, markerData);

            const result = await aex().get(AeObject.ActiveComp);
            const comp = result.object;
            const route = comp.markers;

            assertAreEqual(route[route.length - 1], markerData);
        });

        it(`Can create complicated marker`, async () => {
            const markerData = {
                comment: 'Some Comment',
                duration: 1,
                label: 4,
                time: 0.4667,
                type: AEX_MARKER,
            };

            await aex().create(AeObject.ActiveComp, markerData);

            const result = await aex().get(AeObject.ActiveComp);
            const comp = result.object;
            const route = comp.markers;

            assertAreEqual(route[route.length - 1], markerData);
        });
    });
});
