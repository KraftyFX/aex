import { AeObject, aex } from '../aex';
import { AEX_CAMERA_LAYER, AEX_ONED_PROPERTY, AEX_THREED_PROPERTY, TEST_TIMEOUT_TIME } from '../constants';
import { cleanupAex, evalAexIntoEstk, openCleanProject, openProject } from '../csinterface';
import { assertAreEqual } from '../utils';

describe('Camera Layer Attributes', function () {
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
            await openProject('testAssets/layer_camera.aep');
            const result = await aex().get(AeObject.ActiveComp);
            comp = result.object;
            console.log('layer_camera', comp);
        });

        it(`Can parse camera options`, async () => {
            assertAreEqual(comp.layers[0].cameraOption, {
                matchName: 'ADBE Camera Options Group',
                properties: [
                    {
                        type: AEX_ONED_PROPERTY,
                        keys: [],
                        matchName: 'ADBE Camera Zoom',
                        name: 'Zoom',
                        value: 1,
                    },
                    {
                        type: AEX_ONED_PROPERTY,
                        keys: [],
                        matchName: 'ADBE Camera Focus Distance',
                        name: 'Focus Distance',
                        value: 2,
                    },
                    {
                        type: AEX_ONED_PROPERTY,
                        keys: [],
                        matchName: 'ADBE Camera Aperture',
                        name: 'Aperture',
                        value: 3,
                    },
                    {
                        type: AEX_ONED_PROPERTY,
                        keys: [],
                        matchName: 'ADBE Camera Blur Level',
                        name: 'Blur Level',
                        value: 4,
                    },
                    {
                        type: AEX_ONED_PROPERTY,
                        keys: [],
                        matchName: 'ADBE Iris Shape',
                        name: 'Iris Shape',
                        value: 4,
                    },
                    {
                        type: AEX_ONED_PROPERTY,
                        keys: [],
                        matchName: 'ADBE Iris Rotation',
                        name: 'Iris Rotation',
                        value: 5,
                    },
                    {
                        type: AEX_ONED_PROPERTY,
                        keys: [],
                        matchName: 'ADBE Iris Roundness',
                        name: 'Iris Roundness',
                        value: 6,
                    },
                    {
                        type: AEX_ONED_PROPERTY,
                        keys: [],
                        matchName: 'ADBE Iris Aspect Ratio',
                        name: 'Iris Aspect Ratio',
                        value: 7,
                    },
                    {
                        type: AEX_ONED_PROPERTY,
                        keys: [],
                        matchName: 'ADBE Iris Diffraction Fringe',
                        name: 'Iris Diffraction Fringe',
                        value: 8,
                    },
                    {
                        type: AEX_ONED_PROPERTY,
                        keys: [],
                        matchName: 'ADBE Iris Highlight Gain',
                        name: 'Highlight Gain',
                        value: 9,
                    },
                    {
                        type: AEX_ONED_PROPERTY,
                        keys: [],
                        matchName: 'ADBE Iris Highlight Threshold',
                        name: 'Highlight Threshold',
                        value: 0.0392,
                    },
                    {
                        type: AEX_ONED_PROPERTY,
                        keys: [],
                        matchName: 'ADBE Iris Hightlight Saturation',
                        name: 'Highlight Saturation',
                        value: 11,
                    },
                ],
            });
        });

        it(`Can parse 2-point cameras`, async () => {
            assertAreEqual(comp.layers[1], {
                label: 4,
                markers: [],
                name: 'Two-Node',
                transform: {
                    pointOfInterest: {
                        type: AEX_THREED_PROPERTY,
                        keys: [],
                        matchName: 'ADBE Anchor Point',
                        name: 'Point of Interest',
                        value: [100, 200, 300],
                    },
                    position: {
                        type: AEX_THREED_PROPERTY,
                        keys: [],
                        matchName: 'ADBE Position',
                        name: 'Position',
                        value: [640, 360, -1777.7778],
                    },
                },
                type: AEX_CAMERA_LAYER,
            });
        });
    });

    describe('Create', async () => {
        before(async () => {
            await openCleanProject();
        });

        it(`Can create camera options`, async () => {
            const layerData = {
                cameraOption: {
                    matchName: 'ADBE Camera Options Group',
                    properties: [
                        {
                            type: AEX_ONED_PROPERTY,
                            keys: [],
                            matchName: 'ADBE Camera Zoom',
                            name: 'Zoom',
                            value: 1,
                        },
                        {
                            type: AEX_ONED_PROPERTY,
                            keys: [],
                            matchName: 'ADBE Camera Focus Distance',
                            name: 'Focus Distance',
                            value: 2,
                        },
                        {
                            type: AEX_ONED_PROPERTY,
                            keys: [],
                            matchName: 'ADBE Camera Aperture',
                            name: 'Aperture',
                            value: 3,
                        },
                        {
                            type: AEX_ONED_PROPERTY,
                            keys: [],
                            matchName: 'ADBE Camera Blur Level',
                            name: 'Blur Level',
                            value: 4,
                        },
                        {
                            type: AEX_ONED_PROPERTY,
                            keys: [],
                            matchName: 'ADBE Iris Shape',
                            name: 'Iris Shape',
                            value: 4,
                        },
                        {
                            type: AEX_ONED_PROPERTY,
                            keys: [],
                            matchName: 'ADBE Iris Rotation',
                            name: 'Iris Rotation',
                            value: 5,
                        },
                        {
                            type: AEX_ONED_PROPERTY,
                            keys: [],
                            matchName: 'ADBE Iris Roundness',
                            name: 'Iris Roundness',
                            value: 6,
                        },
                        {
                            type: AEX_ONED_PROPERTY,
                            keys: [],
                            matchName: 'ADBE Iris Aspect Ratio',
                            name: 'Iris Aspect Ratio',
                            value: 7,
                        },
                        {
                            type: AEX_ONED_PROPERTY,
                            keys: [],
                            matchName: 'ADBE Iris Diffraction Fringe',
                            name: 'Iris Diffraction Fringe',
                            value: 8,
                        },
                        {
                            type: AEX_ONED_PROPERTY,
                            keys: [],
                            matchName: 'ADBE Iris Highlight Gain',
                            name: 'Highlight Gain',
                            value: 9,
                        },
                        {
                            type: AEX_ONED_PROPERTY,
                            keys: [],
                            matchName: 'ADBE Iris Highlight Threshold',
                            name: 'Highlight Threshold',
                            value: 0.0392,
                        },
                        {
                            type: AEX_ONED_PROPERTY,
                            keys: [],
                            matchName: 'ADBE Iris Hightlight Saturation',
                            name: 'Highlight Saturation',
                            value: 11,
                        },
                    ],
                },
                label: 4,
                markers: [],
                name: 'One-Node',
                transform: {},
                type: AEX_CAMERA_LAYER,
            };

            await aex().createTestComp();
            await aex().create(AeObject.ActiveComp, layerData);

            const result = await aex().get(AeObject.Layer(1));
            const layer = result.object;

            assertAreEqual(layer.cameraOption, layerData.cameraOption);
        });

        it(`Can create 2-point cameras`, async () => {
            const layerData = {
                label: 4,
                markers: [],
                name: 'Two-Node',
                transform: {
                    pointOfInterest: {
                        type: AEX_THREED_PROPERTY,
                        keys: [],
                        matchName: 'ADBE Anchor Point',
                        name: 'Point of Interest',
                        value: [100, 200, 300],
                    },
                    position: {
                        type: AEX_THREED_PROPERTY,
                        keys: [],
                        matchName: 'ADBE Position',
                        name: 'Position',
                        value: [640, 360, -1777.7778],
                    },
                },
                type: AEX_CAMERA_LAYER,
            };

            await aex().createTestComp();
            await aex().create(AeObject.ActiveComp, layerData);

            const result = await aex().get(AeObject.Layer(1));
            const layer = result.object;

            assertAreEqual(layer, layerData);
        });
    });

    describe('Update', async () => {
        beforeEach(async () => {
            await openProject('testAssets/layer_camera.aep');
        });

        it(`Can update 1-point cameras`, async () => {
            const layerData = {
                cameraOption: {
                    matchName: 'ADBE Camera Options Group',
                    properties: [
                        {
                            type: AEX_ONED_PROPERTY,
                            keys: [],
                            matchName: 'ADBE Camera Zoom',
                            name: 'Zoom',
                            value: 12,
                        },
                        {
                            type: AEX_ONED_PROPERTY,
                            keys: [],
                            matchName: 'ADBE Camera Focus Distance',
                            name: 'Focus Distance',
                            value: 11,
                        },
                        {
                            type: AEX_ONED_PROPERTY,
                            keys: [],
                            matchName: 'ADBE Camera Aperture',
                            name: 'Aperture',
                            value: 10,
                        },
                        {
                            type: AEX_ONED_PROPERTY,
                            keys: [],
                            matchName: 'ADBE Camera Blur Level',
                            name: 'Blur Level',
                            value: 9,
                        },
                        {
                            type: AEX_ONED_PROPERTY,
                            keys: [],
                            matchName: 'ADBE Iris Shape',
                            name: 'Iris Shape',
                            value: 8,
                        },
                        {
                            type: AEX_ONED_PROPERTY,
                            keys: [],
                            matchName: 'ADBE Iris Rotation',
                            name: 'Iris Rotation',
                            value: 7,
                        },
                        {
                            type: AEX_ONED_PROPERTY,
                            keys: [],
                            matchName: 'ADBE Iris Roundness',
                            name: 'Iris Roundness',
                            value: 6,
                        },
                        {
                            type: AEX_ONED_PROPERTY,
                            keys: [],
                            matchName: 'ADBE Iris Aspect Ratio',
                            name: 'Iris Aspect Ratio',
                            value: 5,
                        },
                        {
                            type: AEX_ONED_PROPERTY,
                            keys: [],
                            matchName: 'ADBE Iris Diffraction Fringe',
                            name: 'Iris Diffraction Fringe',
                            value: 4,
                        },
                        {
                            type: AEX_ONED_PROPERTY,
                            keys: [],
                            matchName: 'ADBE Iris Highlight Gain',
                            name: 'Highlight Gain',
                            value: 3,
                        },
                        {
                            type: AEX_ONED_PROPERTY,
                            keys: [],
                            matchName: 'ADBE Iris Highlight Threshold',
                            name: 'Highlight Threshold',
                            value: 0.2,
                        },
                        {
                            type: AEX_ONED_PROPERTY,
                            keys: [],
                            matchName: 'ADBE Iris Hightlight Saturation',
                            name: 'Highlight Saturation',
                            value: 1,
                        },
                    ],
                },
                label: 8,
                markers: [],
                name: 'Updated One-Node',
                transform: {},
                type: AEX_CAMERA_LAYER,
            };

            await aex().update(AeObject.Layer(1), layerData);

            const result = await aex().get(AeObject.Layer(1));
            const layer = result.object;

            assertAreEqual(layer.cameraOption, layerData.cameraOption);
        });

        it(`Can update 2-point cameras`, async () => {
            const layerData = {
                label: 4,
                markers: [],
                name: 'Two-Node',
                transform: {
                    pointOfInterest: {
                        type: AEX_THREED_PROPERTY,
                        keys: [],
                        matchName: 'ADBE Anchor Point',
                        name: 'Point of Interest',
                        value: [200, 300, 100],
                    },
                    position: {
                        type: AEX_THREED_PROPERTY,
                        keys: [],
                        matchName: 'ADBE Position',
                        name: 'Position',
                        value: [100, 200, -100],
                    },
                },
                type: AEX_CAMERA_LAYER,
            };

            await aex().update(AeObject.Layer(2), layerData);

            const result = await aex().get(AeObject.Layer(2));
            const layer = result.object;

            assertAreEqual(layer.transform, layerData.transform);
        });
    });
});
