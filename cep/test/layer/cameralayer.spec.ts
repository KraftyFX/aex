import { AeObject, aex, getProject } from '../aex';
import { AEX_CAMERA_LAYER, AEX_ONED_PROPERTY, AEX_THREED_PROPERTY, TEST_TIMEOUT_TIME } from '../constants';
import { cleanupAex, evalAexIntoEstk, openCleanProject, openProject } from '../csinterface';
import { assertAreEqual, getAexResultFromJson } from '../utils';

describe('Camera Layer Attributes', function () {
    this.slow(1000);
    this.timeout(TEST_TIMEOUT_TIME);

    before(async () => {
        await evalAexIntoEstk();
    });

    after(async () => {
        await cleanupAex();
    });

    describe('Camera options', async () => {
        it(`Get`, async () => {
            const { object: actualComp } = await getProject('assets/layer_camera.aep', AeObject.ActiveComp);
            const { object: expectedComp } = getAexResultFromJson('assets/layer_camera.comp.json');

            console.log('layer_camera', actualComp);

            assertAreEqual(actualComp.layers[0].cameraOption, expectedComp.layers[0].cameraOption);
        });

        it(`Create`, async () => {
            const layerData = {
                cameraOption: {
                    matchName: 'ADBE Camera Options Group',
                    properties: [
                        {
                            type: AEX_ONED_PROPERTY,
                            keys: [],
                            matchName: 'ADBE Camera Zoom',
                            value: 1,
                        },
                        {
                            type: AEX_ONED_PROPERTY,
                            keys: [],
                            matchName: 'ADBE Camera Focus Distance',
                            value: 2,
                        },
                        {
                            type: AEX_ONED_PROPERTY,
                            keys: [],
                            matchName: 'ADBE Camera Aperture',
                            value: 3,
                        },
                        {
                            type: AEX_ONED_PROPERTY,
                            keys: [],
                            matchName: 'ADBE Camera Blur Level',
                            value: 4,
                        },
                        {
                            type: AEX_ONED_PROPERTY,
                            keys: [],
                            matchName: 'ADBE Iris Shape',
                            value: 4,
                        },
                        {
                            type: AEX_ONED_PROPERTY,
                            keys: [],
                            matchName: 'ADBE Iris Rotation',
                            value: 5,
                        },
                        {
                            type: AEX_ONED_PROPERTY,
                            keys: [],
                            matchName: 'ADBE Iris Roundness',
                            value: 6,
                        },
                        {
                            type: AEX_ONED_PROPERTY,
                            keys: [],
                            matchName: 'ADBE Iris Aspect Ratio',
                            value: 7,
                        },
                        {
                            type: AEX_ONED_PROPERTY,
                            keys: [],
                            matchName: 'ADBE Iris Diffraction Fringe',
                            value: 8,
                        },
                        {
                            type: AEX_ONED_PROPERTY,
                            keys: [],
                            matchName: 'ADBE Iris Highlight Gain',
                            value: 9,
                        },
                        {
                            type: AEX_ONED_PROPERTY,
                            keys: [],
                            matchName: 'ADBE Iris Highlight Threshold',
                            value: 0.0392,
                        },
                        {
                            type: AEX_ONED_PROPERTY,
                            keys: [],
                            matchName: 'ADBE Iris Hightlight Saturation',
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

            await openCleanProject();

            await aex.createTestComp();
            await aex.create(AeObject.ActiveComp, layerData);

            const { object: layer } = await aex.get(AeObject.Layer(1));

            assertAreEqual(layer.cameraOption, layerData.cameraOption);
        });

        it(`Update`, async () => {
            const layerData = {
                cameraOption: {
                    matchName: 'ADBE Camera Options Group',
                    properties: [
                        {
                            type: AEX_ONED_PROPERTY,
                            keys: [],
                            matchName: 'ADBE Camera Zoom',
                            value: 12,
                        },
                        {
                            type: AEX_ONED_PROPERTY,
                            keys: [],
                            matchName: 'ADBE Camera Focus Distance',
                            value: 11,
                        },
                        {
                            type: AEX_ONED_PROPERTY,
                            keys: [],
                            matchName: 'ADBE Camera Aperture',
                            value: 10,
                        },
                        {
                            type: AEX_ONED_PROPERTY,
                            keys: [],
                            matchName: 'ADBE Camera Blur Level',
                            value: 9,
                        },
                        {
                            type: AEX_ONED_PROPERTY,
                            keys: [],
                            matchName: 'ADBE Iris Shape',
                            value: 8,
                        },
                        {
                            type: AEX_ONED_PROPERTY,
                            keys: [],
                            matchName: 'ADBE Iris Rotation',
                            value: 7,
                        },
                        {
                            type: AEX_ONED_PROPERTY,
                            keys: [],
                            matchName: 'ADBE Iris Roundness',
                            value: 6,
                        },
                        {
                            type: AEX_ONED_PROPERTY,
                            keys: [],
                            matchName: 'ADBE Iris Aspect Ratio',
                            value: 5,
                        },
                        {
                            type: AEX_ONED_PROPERTY,
                            keys: [],
                            matchName: 'ADBE Iris Diffraction Fringe',
                            value: 4,
                        },
                        {
                            type: AEX_ONED_PROPERTY,
                            keys: [],
                            matchName: 'ADBE Iris Highlight Gain',
                            value: 3,
                        },
                        {
                            type: AEX_ONED_PROPERTY,
                            keys: [],
                            matchName: 'ADBE Iris Highlight Threshold',
                            value: 0.2,
                        },
                        {
                            type: AEX_ONED_PROPERTY,
                            keys: [],
                            matchName: 'ADBE Iris Hightlight Saturation',
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

            await openProject('assets/layer_camera.aep');

            await aex.update(AeObject.Layer(1), layerData);

            const { object: layer } = await aex.get(AeObject.Layer(1));

            assertAreEqual(layer.cameraOption, layerData.cameraOption);
        });
    });

    describe('2-point cameras', async () => {
        it(`Get`, async () => {
            const { object: actualComp } = await getProject('assets/layer_camera.aep', AeObject.ActiveComp);
            const { object: expectedComp } = getAexResultFromJson('assets/layer_camera.comp.json');

            console.log('layer_camera', actualComp);

            assertAreEqual(actualComp.layers[1], expectedComp.layers[1]);
        });

        it(`Create`, async () => {
            const layerData = {
                label: 4,
                markers: [],
                name: 'Two-Node',
                transform: {
                    pointOfInterest: {
                        type: AEX_THREED_PROPERTY,
                        keys: [],
                        matchName: 'ADBE Anchor Point',
                        value: [100, 200, 300],
                    },
                    position: {
                        type: AEX_THREED_PROPERTY,
                        keys: [],
                        matchName: 'ADBE Position',
                        value: [640, 360, -1777.7778],
                    },
                },
                type: AEX_CAMERA_LAYER,
            };

            await openCleanProject();

            await aex.createTestComp();
            await aex.create(AeObject.ActiveComp, layerData);

            const { object: layer } = await aex.get(AeObject.Layer(1));

            assertAreEqual(layer, layerData);
        });

        it(`Update`, async () => {
            const layerData = {
                label: 4,
                markers: [],
                name: 'Two-Node',
                transform: {
                    pointOfInterest: {
                        type: AEX_THREED_PROPERTY,
                        keys: [],
                        matchName: 'ADBE Anchor Point',
                        value: [200, 300, 100],
                    },
                    position: {
                        type: AEX_THREED_PROPERTY,
                        keys: [],
                        matchName: 'ADBE Position',
                        value: [100, 200, -100],
                    },
                },
                type: AEX_CAMERA_LAYER,
            };

            await openProject('assets/layer_camera.aep');

            await aex.update(AeObject.Layer(2), layerData);

            const { object: layer } = await aex.get(AeObject.Layer(2));

            assertAreEqual(layer.transform, layerData.transform);
        });
    });
});
