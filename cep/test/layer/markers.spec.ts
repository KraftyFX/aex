import { AeObject, aex, getProject } from '../aex';
import { AEX_MARKER, AEX_NULL_LAYER, TEST_TIMEOUT_TIME } from '../constants';
import { cleanupAex, evalAexIntoEstk, openCleanProject, openProject } from '../csinterface';
import { assertAreEqual } from '../utils';

describe('Layer Markers', function () {
    this.slow(1000);
    this.timeout(TEST_TIMEOUT_TIME);

    before(async () => {
        await evalAexIntoEstk();
    });

    after(async () => {
        await cleanupAex();
    });

    describe('Simple', async () => {
        it('Get', async () => {
            const { object: comp } = await getProject('assets/layer_markers.aep', AeObject.ActiveComp);

            console.log('layer_markers', comp);

            assertAreEqual(comp.layers[0].markers, [
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

        it('Create', async () => {
            const layerData = {
                label: 4,
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
                type: AEX_NULL_LAYER,
            };

            await openCleanProject();

            await aex.createTestComp();
            await aex.create(AeObject.ActiveComp, layerData);

            const result = await aex.get(AeObject.Layer(1));
            const layer = result.object;

            assertAreEqual(layer.markers, layerData.markers);
        });

        it('Update', async () => {
            const markerData = {
                time: 0,
                type: AEX_MARKER,
            };

            await openProject('assets/layer_blank.aep');

            await aex.create(AeObject.Layer(1), markerData);

            const result = await aex.get(AeObject.Layer(1));
            const layer = result.object;
            const route = layer.markers;

            assertAreEqual(route[route.length - 1], markerData);
        });
    });

    describe('Complex', async () => {
        it('Get', async () => {
            const { object: comp } = await getProject('assets/layer_markers.aep', AeObject.ActiveComp);

            console.log('layer_markers', comp);

            assertAreEqual(comp.layers[1].markers, [
                {
                    duration: 0.2,
                    time: 0.1667,
                    type: AEX_MARKER,
                },
                {
                    comment: 'Some Comment',
                    duration: 1,
                    label: 4,
                    time: 0.4667,
                    type: AEX_MARKER,
                },
                {
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
                    label: 8,
                    time: 3.55,
                    type: AEX_MARKER,
                },
            ]);
        });

        it('Create', async () => {
            const layerData = {
                label: 4,
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
                        time: 0.4667,
                        type: AEX_MARKER,
                    },
                    {
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
                        label: 8,
                        time: 3.55,
                        type: AEX_MARKER,
                    },
                ],
                type: AEX_NULL_LAYER,
            };

            await openCleanProject();

            await aex.createTestComp();
            await aex.create(AeObject.ActiveComp, layerData);

            const result = await aex.get(AeObject.Layer(1));
            const layer = result.object;

            assertAreEqual(layer.markers, layerData.markers);
        });

        it('Update', async () => {
            const markerData = {
                comment: 'Some Comment',
                duration: 1,
                label: 4,
                time: 0.4667,
                type: AEX_MARKER,
            };

            await openProject('assets/layer_blank.aep');

            await aex.create(AeObject.Layer(1), markerData);

            const result = await aex.get(AeObject.Layer(1));
            const layer = result.object;
            const route = layer.markers;

            assertAreEqual(route[route.length - 1], markerData);
        });
    });
});
