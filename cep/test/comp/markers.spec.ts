import { AEX_COMP_ITEM, AEX_PROJECT } from '../constants';
import { AeObject, aex } from '../aex';
import { cleanupAex, evalAexIntoEstk, openCleanProject, openProject } from '../csinterface';
import { assertAreEqual } from '../utils';

describe('Comp Markers', function () {
    this.slow(500);
    this.timeout(2000);

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
            const result = await aex().fromAeObject(AeObject.Project);
            project = result.object;
            console.log('comp_markers', project);
        });

        it(`Can parse detailed comp markers`, async () => {
            assertAreEqual(project.comps[0].markers, [
                {
                    duration: 0.2,
                    time: 0.16667,
                },
                {
                    comment: 'Some Comment',
                    duration: 1,
                    label: 4,
                    protectedRegion: true,
                    time: 0.46667,
                },
                {
                    label: 3,
                    time: 0.78333,
                },
                {
                    comment: 'banana',
                    time: 1.83333,
                },
                {
                    duration: 0.33333,
                    protectedRegion: true,
                    time: 3.55,
                },
            ]);
        });

        it(`Can parse simple comp markers`, async () => {
            assertAreEqual(project.comps[1].markers, [
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
    });

    describe('Set', async () => {
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
                            time: 0.16667,
                        },
                        {
                            comment: 'Some Comment',
                            duration: 1,
                            label: 4,
                            protectedRegion: true,
                            time: 0.46667,
                        },
                        {
                            label: 3,
                            time: 0.78333,
                        },
                        {
                            comment: 'banana',
                            time: 1.83333,
                        },
                        {
                            duration: 0.33333,
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

            await aex().fromAexObject(projectData);

            const result = await aex().fromAeObject(AeObject.Project);
            project = result.object;
        });

        it(`Can create detailed markers`, async () => {
            assertAreEqual(project.comps[0].markers, projectData.comps[0].markers);
        });

        it(`Can create simple markers`, async () => {
            assertAreEqual(project.comps[1].markers, projectData.comps[1].markers);
        });
    });
});
