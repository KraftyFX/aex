import { AeObject, aex, getProject } from '../aex';
import { AEX_COMP_ITEM, AEX_MARKER, AEX_PROJECT, TEST_TIMEOUT_TIME } from '../constants';
import { cleanupAex, evalAexIntoEstk, openCleanProject, openProject } from '../csinterface';
import { assertAreEqual, getAexResultFromJson } from '../utils';

describe('Comp Markers', function () {
    this.slow(1000);
    this.timeout(TEST_TIMEOUT_TIME);

    before(async () => {
        await evalAexIntoEstk();
    });

    after(async () => {
        await cleanupAex();
    });

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

    describe('Simple', async () => {
        it(`Get`, async () => {
            const { object: actualProject } = await getProject('assets/comp_markers.aep', AeObject.Project);
            const { object: expectedProject } = getAexResultFromJson('assets/comp_markers.json');

            console.log('comp_markers', actualProject);

            assertAreEqual(actualProject.comps[1].markers, expectedProject.comps[1].markers);
        });

        it(`Create`, async () => {
            await openCleanProject();

            await aex.update(AeObject.Project, projectData);

            const { object: project } = await aex.get(AeObject.Project);

            assertAreEqual(project.comps[1].markers, projectData.comps[1].markers);
        });

        it(`Update`, async () => {
            const markerData = {
                time: 0,
                type: AEX_MARKER,
            };

            await openProject('assets/layer_basic.aep');

            await aex.create(AeObject.ActiveComp, markerData);

            const { object: comp } = await aex.get(AeObject.ActiveComp);
            const route = comp.markers;

            assertAreEqual(route[route.length - 1], markerData);
        });
    });

    describe('Detailed', async () => {
        it(`Get`, async () => {
            const { object: actualProject } = await getProject('assets/comp_markers.aep', AeObject.Project);
            const { object: expectedProject } = getAexResultFromJson('assets/comp_markers.json');

            console.log('comp_markers', actualProject);

            assertAreEqual(actualProject.comps[0].markers, expectedProject.comps[0].markers);
        });

        it(`Create`, async () => {
            await openCleanProject();

            await aex.update(AeObject.Project, projectData);

            const { object: project } = await aex.get(AeObject.Project);

            assertAreEqual(project.comps[0].markers, projectData.comps[0].markers);
        });

        it(`Update`, async () => {
            const markerData = {
                comment: 'Some Comment',
                duration: 1,
                label: 4,
                time: 0.4667,
                type: AEX_MARKER,
            };

            await openProject('assets/layer_basic.aep');

            await aex.create(AeObject.ActiveComp, markerData);

            const { object: comp } = await aex.get(AeObject.ActiveComp);
            const route = comp.markers;

            assertAreEqual(route[route.length - 1], markerData);
        });
    });
});
