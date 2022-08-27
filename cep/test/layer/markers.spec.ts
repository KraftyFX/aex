import { AeObject, aex, getProject } from '../aex';
import { AEX_MARKER, AEX_NULL_LAYER, TEST_TIMEOUT_TIME } from '../constants';
import { cleanupAex, evalAexIntoEstk, openCleanProject, openProject } from '../csinterface';
import { assertAreEqual } from '../utils';

describe('Layer Markers', function () {
    this.slow(500);
    this.timeout(TEST_TIMEOUT_TIME);

    before(async () => {
        await evalAexIntoEstk();
    });

    after(async () => {
        await cleanupAex();
    });

    describe('Get', async () => {
        let comp: any;

        before(async () => {
            const result = await getProject('assets/layer_markers.aep', AeObject.ActiveComp);
            comp = result.object;
            console.log('layer_markers', comp);
        });

        it('Can parse simple layer markers', async () => {
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

        it('Can parse complicated layer markers', async () => {
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
    });

    describe('Create on New Layer', async () => {
        before(async () => {
            await openCleanProject();
        });

        it(`Can create simple layer markers`, async () => {
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
                transform: {},
                type: AEX_NULL_LAYER,
            };

            await aex().createTestComp();
            await aex().create(AeObject.ActiveComp, layerData);

            const result = await aex().get(AeObject.Layer(1));
            const layer = result.object;

            assertAreEqual(layer.markers, layerData.markers);
        });

        it(`Can create complicated layer markers`, async () => {
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
                transform: {},
                type: AEX_NULL_LAYER,
            };

            await aex().createTestComp();
            await aex().create(AeObject.ActiveComp, layerData);

            const result = await aex().get(AeObject.Layer(1));
            const layer = result.object;

            assertAreEqual(layer.markers, layerData.markers);
        });
    });

    describe('Create on Existing Layer', async () => {
        before(async () => {
            await openProject('assets/layer_blank.aep');
        });

        it(`Can create simple layer marker`, async () => {
            const markerData = {
                time: 0,
                type: AEX_MARKER,
            };

            await aex().create(AeObject.Layer(1), markerData);

            const result = await aex().get(AeObject.Layer(1));
            const layer = result.object;
            const route = layer.markers;

            assertAreEqual(route[route.length - 1], markerData);
        });

        it(`Can create complicated layer marker`, async () => {
            const markerData = {
                comment: 'Some Comment',
                duration: 1,
                label: 4,
                time: 0.4667,
                type: AEX_MARKER,
            };

            await aex().create(AeObject.Layer(1), markerData);

            const result = await aex().get(AeObject.Layer(1));
            const layer = result.object;
            const route = layer.markers;

            assertAreEqual(route[route.length - 1], markerData);
        });
    });
});
