import { expect } from 'chai';
import { AeObject, aex } from './aex';
import { cleanupAeqIpc, cleanupAex, evalAexIntoESTK, openProject } from './csinterface';

describe('Layer', function () {
    this.slow(500);
    this.timeout(2000);

    before(async () => {
        await evalAexIntoESTK();
    });

    after(async () => {
        await cleanupAex();
        await cleanupAeqIpc();
    });

    /** Layer tests */
    it(`Can parse basic layer attributes`, async () => {
        await openProject('testAssets/layer_basic.aep');

        const result = await aex().toObjectWithAeObject(AeObject.ActiveComp);

        expect(result).property('comps').to.be.of.length(1);

        console.log('layer_basic', result);
        expect(result.comps[0])
            .property('layers')
            .to.eql([
                {
                    label: 4,
                    layerType: 'CameraLayer',
                    name: 'Camera',
                    transform: {},
                },
                {
                    label: 1,
                    layerType: 'TextLayer',
                    name: 'Solo Text Layer',
                    solo: true,
                    transform: {},
                },
                {
                    label: 1,
                    layerType: 'AVLayer',
                    name: 'Empty',
                    nullLayer: true,
                    transform: {},
                },
                {
                    inPoint: 0.5,
                    label: 1,
                    layerType: 'LightLayer',
                    lightType: 4414,
                    name: 'Timing Light',
                    outPoint: 3.06666666666667,
                    transform: {},
                },
                {
                    adjustmentLayer: true,
                    autoOrient: 4213,
                    collapseTransformation: true,
                    label: 2,
                    layerType: 'AVLayer',
                    motionBlur: true,
                    name: 'Flags',
                    nullLayer: true,
                    samplingQuality: 4813,
                    shy: true,
                    threeDLayer: true,
                    transform: {},
                },
                {
                    blendingMode: 5216,
                    label: 1,
                    layerType: 'AVLayer',
                    name: 'Blend Stretch',
                    nullLayer: true,
                    outPoint: 1,
                    stretch: 25,
                    transform: {},
                },
                {
                    label: 1,
                    layerType: 'AVLayer',
                    name: 'Parented Solid',
                    parentLayerIndex: 5,
                    transform: {
                        position: {
                            matchName: 'ADBE Position',
                            name: 'Position',
                            value: [0, 0, 0],
                        },
                    },
                },
            ]);
    });

    it(`Can parse light layer attributes`, async () => {
        await openProject('testAssets/layer_light.aep');

        const result = await aex().toObjectWithAeObject(AeObject.ActiveComp);

        expect(result).property('comps').to.be.of.length(1);

        console.log('layer_light', result);
        expect(result.comps[0])
            .property('layers')
            .to.eql([
                {
                    label: 6,
                    layerType: 'LightLayer',
                    lightType: 4412,
                    name: 'Parallel Light',
                    transform: {},
                },
                {
                    label: 6,
                    layerType: 'LightLayer',
                    lightType: 4413,
                    name: 'Spot Light',
                    transform: {},
                },
                {
                    label: 6,
                    layerType: 'LightLayer',
                    lightType: 4414,
                    name: 'Point Light',
                    transform: {},
                },
                {
                    label: 6,
                    layerType: 'LightLayer',
                    lightType: 4415,
                    name: 'Ambient Light',
                    transform: {},
                },
            ]);
    });

    it(`Can parse layer markers`, async () => {
        await openProject('testAssets/layer_markers.aep');

        const result = await aex().toObjectWithAeObject(AeObject.ActiveComp);

        console.log('layer_markers', result);
        expect(result)
            .property('comps')
            .to.eql([
                {
                    duration: 4,
                    frameRate: 60,
                    height: 720,
                    itemType: 'Comp',
                    layers: [
                        {
                            label: 1,
                            layerType: 'AVLayer',
                            markers: [
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
                            ],
                            name: 'PlainMarkers',
                            nullLayer: true,
                            transform: {},
                        },
                        {
                            label: 1,
                            layerType: 'AVLayer',
                            markers: [
                                {
                                    duration: 0.2,
                                    time: 0.16666666666667,
                                },
                                {
                                    comment: 'Some Comment',
                                    duration: 1,
                                    label: 4,
                                    time: 0.46666666666667,
                                },
                                {
                                    time: 0.78333333333333,
                                },
                                {
                                    comment: 'banana',
                                    time: 1.83333333333333,
                                },
                                {
                                    duration: 0.33333333333333,
                                    label: 8,
                                    time: 3.55,
                                },
                            ],
                            name: 'DetailedMarkers',
                            nullLayer: true,
                            transform: {},
                        },
                    ],
                    name: 'Comp 1',
                    pixelAspect: 1,
                    width: 1280,
                },
            ]);
    });

    it(`Can parse layer transform properties`, async () => {
        await openProject('testAssets/layer_transform.aep');

        const result = await aex().toObjectWithAeObject(AeObject.Project);

        console.log('layer_transform', result);
        expect(result)
            .property('comps')
            .to.eql([
                {
                    duration: 4,
                    frameRate: 60,
                    height: 720,
                    itemType: 'Comp',
                    layers: [
                        {
                            label: 4,
                            layerType: 'CameraLayer',
                            name: 'Camera',
                            transform: {},
                        },
                        {
                            label: 6,
                            layerType: 'LightLayer',
                            lightType: 4414,
                            name: 'Light',
                            transform: {},
                        },
                        {
                            label: 1,
                            layerType: 'AVLayer',
                            name: '3d AV Layer',
                            nullLayer: true,
                            threeDLayer: true,
                            transform: {},
                        },
                        {
                            label: 1,
                            layerType: 'AVLayer',
                            name: '2d AV Layer',
                            nullLayer: true,
                            transform: {},
                        },
                    ],
                    name: 'Defaults',
                    pixelAspect: 1,
                    width: 1280,
                },
                {
                    duration: 4,
                    frameRate: 60,
                    height: 720,
                    itemType: 'Comp',
                    layers: [
                        {
                            label: 4,
                            layerType: 'CameraLayer',
                            name: 'Camera',
                            transform: {
                                orientation: {
                                    matchName: 'ADBE Orientation',
                                    name: 'Orientation',
                                    value: [100, 200, 300],
                                },
                                pointOfInterest: {
                                    matchName: 'ADBE Anchor Point',
                                    name: 'Point of Interest',
                                    value: [11, 22, 33],
                                },
                                position: {
                                    matchName: 'ADBE Position',
                                    name: 'Position',
                                    value: [1, 2, -3],
                                },
                                rotation: {
                                    matchName: 'ADBE Rotate Z',
                                    name: 'Z Rotation',
                                    value: 90,
                                },
                                xRotation: {
                                    matchName: 'ADBE Rotate X',
                                    name: 'X Rotation',
                                    value: -90,
                                },
                                yRotation: {
                                    matchName: 'ADBE Rotate Y',
                                    name: 'Y Rotation',
                                    value: -3600,
                                },
                            },
                        },
                        {
                            label: 6,
                            layerType: 'LightLayer',
                            lightType: 4414,
                            name: 'Light',
                            transform: {
                                position: {
                                    matchName: 'ADBE Position',
                                    name: 'Position',
                                    value: [100, 200, 300],
                                },
                            },
                        },
                        {
                            label: 1,
                            layerType: 'AVLayer',
                            name: '3d AV Layer',
                            nullLayer: true,
                            threeDLayer: true,
                            transform: {
                                anchorPoint: {
                                    matchName: 'ADBE Anchor Point',
                                    name: 'Anchor Point',
                                    value: [11, 22, 33],
                                },
                                opacity: {
                                    matchName: 'ADBE Opacity',
                                    name: 'Opacity',
                                    value: 50,
                                },
                                orientation: {
                                    matchName: 'ADBE Orientation',
                                    name: 'Orientation',
                                    value: [100, 200, 300],
                                },

                                position: {
                                    matchName: 'ADBE Position',
                                    name: 'Position',
                                    value: [1, 2, -3],
                                },
                                rotation: {
                                    matchName: 'ADBE Rotate Z',
                                    name: 'Z Rotation',
                                    value: 90,
                                },
                                scale: {
                                    matchName: 'ADBE Scale',
                                    name: 'Scale',
                                    value: [10, 20, 30],
                                },
                                xRotation: {
                                    matchName: 'ADBE Rotate X',
                                    name: 'X Rotation',
                                    value: -90,
                                },
                                yRotation: {
                                    matchName: 'ADBE Rotate Y',
                                    name: 'Y Rotation',
                                    value: -3600,
                                },
                            },
                        },
                        {
                            label: 1,
                            layerType: 'AVLayer',
                            name: '2d AV Layer',
                            nullLayer: true,
                            transform: {
                                anchorPoint: {
                                    matchName: 'ADBE Anchor Point',
                                    name: 'Anchor Point',
                                    value: [11, 22, 0],
                                },
                                opacity: {
                                    matchName: 'ADBE Opacity',
                                    name: 'Opacity',
                                    value: 50,
                                },
                                position: {
                                    matchName: 'ADBE Position',
                                    name: 'Position',
                                    value: [1, 2, 0],
                                },
                                rotation: {
                                    matchName: 'ADBE Rotate Z',
                                    name: 'Rotation',
                                    value: 90,
                                },
                                scale: {
                                    matchName: 'ADBE Scale',
                                    name: 'Scale',
                                    value: [10, 20, 100],
                                },
                            },
                        },
                    ],
                    name: 'Modified',
                    pixelAspect: 1,
                    width: 1280,
                },
            ]);
    });

    it(`Can parse animated transform properties`, async () => {
        await openProject('testAssets/property_animated.aep');

        const result = await aex().toObjectWithAeObject(AeObject.Project);

        console.log('property_animated', result);
        expect(result)
            .property('comps')
            .to.eql([
                {
                    duration: 4,
                    frameRate: 60,
                    height: 720,
                    itemType: 'Comp',
                    layers: [
                        {
                            label: 4,
                            layerType: 'CameraLayer',
                            name: 'Camera',
                            transform: {
                                rotation: {
                                    keys: [
                                        {
                                            interpolationType: {
                                                outType: 6613,
                                            },
                                            temporalEase: {
                                                inEase: [
                                                    {
                                                        influence: 16.666666667,
                                                        speed: 0,
                                                    },
                                                ],
                                                outEase: [
                                                    {
                                                        influence: 33.333332999578,
                                                        speed: 0,
                                                    },
                                                ],
                                            },
                                            time: 0,
                                            value: 0,
                                        },
                                        {
                                            interpolationType: {
                                                inType: 6613,
                                                outType: 6613,
                                            },
                                            temporalEase: {
                                                inEase: [
                                                    {
                                                        influence: 33.333333498752,
                                                        speed: 33.8906198973312,
                                                    },
                                                ],
                                                outEase: [
                                                    {
                                                        influence: 33.3333335012409,
                                                        speed: 33.8906198956625,
                                                    },
                                                ],
                                            },
                                            time: 2,
                                            value: 20,
                                        },
                                        {
                                            interpolationType: {
                                                inType: 6613,
                                            },
                                            temporalEase: {
                                                inEase: [
                                                    {
                                                        influence: 33.3333330004256,
                                                        speed: 0,
                                                    },
                                                ],
                                                outEase: [
                                                    {
                                                        influence: 16.666666667,
                                                        speed: 0,
                                                    },
                                                ],
                                            },
                                            time: 3.98333333333333,
                                            value: 90,
                                        },
                                    ],
                                    matchName: 'ADBE Rotate Z',
                                    name: 'Z Rotation',
                                    value: 20,
                                },
                            },
                        },
                    ],
                    name: 'Eased',
                    pixelAspect: 1,
                    width: 1280,
                },
                {
                    duration: 4,
                    frameRate: 60,
                    height: 720,
                    itemType: 'Comp',
                    layers: [
                        {
                            label: 4,
                            layerType: 'CameraLayer',
                            name: 'Camera',
                            transform: {
                                rotation: {
                                    keys: [
                                        {
                                            interpolationType: {
                                                outType: 6614,
                                            },
                                            time: 0,
                                            value: 0,
                                        },
                                        {
                                            interpolationType: {
                                                inType: 6613,
                                                outType: 6614,
                                            },
                                            time: 2,
                                            value: 20,
                                        },
                                        {
                                            interpolationType: {
                                                inType: 6613,
                                                outType: 6614,
                                            },
                                            time: 3.5,
                                            value: 90,
                                        },
                                    ],
                                    matchName: 'ADBE Rotate Z',
                                    name: 'Z Rotation',
                                    value: 0,
                                },
                            },
                        },
                    ],
                    name: 'Hold',
                    pixelAspect: 1,
                    width: 1280,
                },
                {
                    duration: 4,
                    frameRate: 60,
                    height: 720,
                    itemType: 'Comp',
                    layers: [
                        {
                            label: 4,
                            layerType: 'CameraLayer',
                            name: 'Camera',
                            transform: {
                                rotation: {
                                    keys: [
                                        {
                                            interpolationType: {},
                                            temporalEase: {
                                                inEase: [
                                                    {
                                                        influence: 16.666666667,
                                                        speed: 0,
                                                    },
                                                ],
                                                outEase: [
                                                    {
                                                        influence: 16.666666667,
                                                        speed: 22.5941422594142,
                                                    },
                                                ],
                                            },
                                            time: 0,
                                            value: 0,
                                        },
                                        {
                                            interpolationType: {},
                                            temporalEase: {
                                                inEase: [
                                                    {
                                                        influence: 16.666666667,
                                                        speed: 22.5941422594142,
                                                    },
                                                ],
                                                outEase: [
                                                    {
                                                        influence: 16.666666667,
                                                        speed: 0,
                                                    },
                                                ],
                                            },
                                            time: 3.98333333333333,
                                            value: 90,
                                        },
                                    ],
                                    matchName: 'ADBE Rotate Z',
                                    name: 'Z Rotation',
                                    value: 0,
                                },
                            },
                        },
                    ],
                    name: 'Linear',
                    pixelAspect: 1,
                    width: 1280,
                },
                {
                    duration: 4,
                    frameRate: 60,
                    height: 720,
                    itemType: 'Comp',
                    layers: [
                        {
                            label: 4,
                            layerType: 'CameraLayer',
                            name: 'Camera',
                            transform: {
                                rotation: {
                                    keys: [
                                        {
                                            interpolationType: {
                                                outType: 6613,
                                            },
                                            temporalEase: {
                                                inEase: [
                                                    {
                                                        influence: 16.666666667,
                                                        speed: 0,
                                                    },
                                                ],
                                                outEase: [
                                                    {
                                                        influence: 95.6887529934006,
                                                        speed: 0,
                                                    },
                                                ],
                                            },
                                            time: 0,
                                            value: 0,
                                        },
                                        {
                                            interpolationType: {
                                                outType: 6614,
                                            },
                                            time: 1,
                                            value: 10,
                                        },
                                        {
                                            interpolationType: {
                                                inType: 6613,
                                                outType: 6613,
                                            },
                                            temporalEase: {
                                                inEase: [
                                                    {
                                                        influence: 16.666666667,
                                                        speed: 0,
                                                    },
                                                ],
                                                outEase: [
                                                    {
                                                        influence: 66.5593382363078,
                                                        speed: 0,
                                                    },
                                                ],
                                            },
                                            time: 2,
                                            value: 20,
                                        },
                                        {
                                            interpolationType: {
                                                inType: 6613,
                                            },
                                            temporalEase: {
                                                inEase: [
                                                    {
                                                        influence: 85.2938012922363,
                                                        speed: 0,
                                                    },
                                                ],
                                                outEase: [
                                                    {
                                                        influence: 16.666666667,
                                                        speed: 40.6779661016949,
                                                    },
                                                ],
                                            },
                                            time: 3,
                                            value: 50,
                                        },
                                        {
                                            interpolationType: {},
                                            temporalEase: {
                                                inEase: [
                                                    {
                                                        influence: 16.666666667,
                                                        speed: 40.6779661016949,
                                                    },
                                                ],
                                                outEase: [
                                                    {
                                                        influence: 16.666666667,
                                                        speed: 0,
                                                    },
                                                ],
                                            },
                                            time: 3.98333333333333,
                                            value: 90,
                                        },
                                    ],
                                    matchName: 'ADBE Rotate Z',
                                    name: 'Z Rotation',
                                    value: 0,
                                },
                            },
                        },
                    ],
                    name: 'Mixed',
                    pixelAspect: 1,
                    width: 1280,
                },
            ]);
    });
});