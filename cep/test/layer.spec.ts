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

        console.log('layer_basic', result);
        expect(result).property('comps').to.be.of.length(1);
        expect(result.comps[0])
            .property('layers')
            .to.eql([
                {
                    label: 4,
                    layerType: 'CameraLayer',
                    markers: [],
                    masks: [],
                    name: 'Camera',
                    properties: {
                        cameraOption: {},
                    },
                    transform: {},
                    type: 'aex:layer',
                },
                {
                    label: 1,
                    layerType: 'TextLayer',
                    markers: [],
                    masks: [],
                    name: 'Solo Text Layer',
                    properties: {
                        animators: {},
                        moreOption: {},
                        pathOption: {},
                        sourceText: {
                            keys: [],
                            matchName: 'ADBE Text Document',
                            name: 'Source Text',
                            value: {
                                applyFill: true,
                                baselineLocs: [-115.33203125, 0, 115.33203125, 0],
                                baselineShift: 0,
                                fillColor: [1, 1, 1],
                                font: 'ArialMT',
                                fontFamily: 'Arial',
                                fontSize: 50,
                                fontStyle: 'Regular',
                                horizontalScale: 1,
                                justification: 7415,
                                leading: 60.0000038146973,
                                text: 'Text Layer',
                                tracking: 0,
                                tsume: 0,
                                verticalScale: 1,
                            },
                        },
                    },
                    solo: true,

                    transform: {},
                    type: 'aex:layer',
                },
                {
                    label: 1,
                    layerType: 'AVLayer',
                    markers: [],
                    masks: [],
                    name: 'Empty',
                    nullLayer: true,
                    properties: {},
                    transform: {},
                    type: 'aex:layer',
                },
                {
                    inPoint: 0.5,
                    label: 1,
                    layerType: 'LightLayer',
                    lightType: 4414,
                    markers: [],
                    masks: [],
                    name: 'Timing Light',
                    outPoint: 3.06666666666667,
                    properties: {
                        lightOption: {},
                    },
                    transform: {},
                    type: 'aex:layer',
                },
                {
                    adjustmentLayer: true,
                    autoOrient: 4213,
                    collapseTransformation: true,
                    geometryOption: {},
                    label: 2,
                    layerType: 'AVLayer',
                    markers: [],
                    masks: [],
                    materialOption: {},
                    motionBlur: true,
                    name: 'Flags',
                    nullLayer: true,
                    properties: {},
                    samplingQuality: 4813,
                    shy: true,
                    threeDLayer: true,
                    transform: {},
                    type: 'aex:layer',
                },
                {
                    blendingMode: 5216,
                    label: 1,
                    layerType: 'AVLayer',
                    markers: [],
                    masks: [],
                    name: 'Blend Stretch',
                    nullLayer: true,
                    outPoint: 1,
                    properties: {},
                    stretch: 25,
                    transform: {},
                    type: 'aex:layer',
                },
                {
                    label: 1,
                    layerType: 'AVLayer',
                    markers: [],
                    masks: [],
                    name: 'Parented Solid',
                    parentLayerIndex: 5,
                    properties: {},
                    transform: {
                        position: {
                            keys: [],
                            matchName: 'ADBE Position',
                            name: 'Position',
                            value: [0, 0, 0],
                        },
                    },
                    type: 'aex:layer',
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
                    markers: [],
                    masks: [],
                    name: 'Parallel Light',
                    properties: {
                        lightOption: {
                            'ADBE Casts Shadows': {
                                keys: [],
                                matchName: 'ADBE Casts Shadows',
                                name: 'Casts Shadows',
                                value: 1,
                            },
                            'ADBE Light Color': {
                                keys: [],
                                matchName: 'ADBE Light Color',
                                name: 'Color',
                                value: [1, 0, 0, 1],
                            },
                            'ADBE Light Falloff Distance': {
                                keys: [],
                                matchName: 'ADBE Light Falloff Distance',
                                name: 'Falloff Distance',
                                value: 394,
                            },
                            'ADBE Light Falloff Start': {
                                keys: [],
                                matchName: 'ADBE Light Falloff Start',
                                name: 'Radius',
                                value: 453,
                            },
                            'ADBE Light Falloff Type': {
                                keys: [],
                                matchName: 'ADBE Light Falloff Type',
                                name: 'Falloff',
                                value: 2,
                            },
                            'ADBE Light Intensity': {
                                keys: [],
                                matchName: 'ADBE Light Intensity',
                                name: 'Intensity',
                                value: 76,
                            },
                            'ADBE Light Shadow Darkness': {
                                keys: [],
                                matchName: 'ADBE Light Shadow Darkness',
                                name: 'Shadow Darkness',
                                value: 42,
                            },
                        },
                    },
                    transform: {},
                    type: 'aex:layer',
                },
                {
                    label: 6,
                    layerType: 'LightLayer',
                    lightType: 4413,
                    markers: [],
                    masks: [],
                    name: 'Spot Light',
                    properties: {
                        lightOption: {},
                    },
                    transform: {},
                    type: 'aex:layer',
                },
                {
                    label: 6,
                    layerType: 'LightLayer',
                    lightType: 4414,
                    markers: [],
                    masks: [],
                    name: 'Point Light',
                    properties: {
                        lightOption: {},
                    },
                    transform: {},
                    type: 'aex:layer',
                },
                {
                    label: 6,
                    layerType: 'LightLayer',
                    lightType: 4415,
                    markers: [],
                    masks: [],
                    name: 'Ambient Light',
                    properties: {
                        lightOption: {},
                    },
                    transform: {},
                    type: 'aex:layer',
                },
            ]);
    });

    describe('Layer Markers', async () => {
        let result: any;

        before(async () => {
            await openProject('testAssets/layer_markers.aep');
            result = await aex().toObjectWithAeObject(AeObject.ActiveComp);
            console.log('layer_markers', result);
        });

        it('Can parse simple markers', async () => {
            expect(result.comps[0].layers[0])
                .property('markers')
                .to.eql([
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

        it('Can parse complicated markers', async () => {
            expect(result.comps[0].layers[1])
                .property('markers')
                .to.eql([
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
                ]);
        });
    });

    describe('Layer Transform', async () => {
        let result: any;

        before(async () => {
            await openProject('testAssets/layer_transform.aep');
            result = await aex().toObjectWithAeObject(AeObject.Project);
            console.log('layer_transform', result);
        });

        it('Can parse default transform data', async () => {
            expect(result.comps[0].layers).to.eql([
                {
                    label: 4,
                    layerType: 'CameraLayer',
                    markers: [],
                    masks: [],
                    name: 'Camera',
                    properties: {
                        cameraOption: {},
                    },
                    transform: {},
                    type: 'aex:layer',
                },
                {
                    label: 6,
                    layerType: 'LightLayer',
                    lightType: 4414,
                    markers: [],
                    masks: [],
                    name: 'Light',
                    properties: {
                        lightOption: {},
                    },
                    transform: {},
                    type: 'aex:layer',
                },
                {
                    geometryOption: {},
                    label: 1,
                    layerType: 'AVLayer',
                    materialOption: {},
                    markers: [],
                    masks: [],
                    name: '3d AV Layer',
                    nullLayer: true,
                    properties: {},
                    threeDLayer: true,
                    transform: {},
                    type: 'aex:layer',
                },
                {
                    label: 1,
                    layerType: 'AVLayer',
                    markers: [],
                    masks: [],
                    name: '2d AV Layer',
                    nullLayer: true,
                    properties: {},
                    transform: {},
                    type: 'aex:layer',
                },
            ]);
        });

        it('Can parse modified transform data', async () => {
            expect(result.comps[1].layers).to.eql([
                {
                    label: 4,
                    layerType: 'CameraLayer',
                    markers: [],
                    masks: [],
                    name: 'Camera',
                    properties: {
                        cameraOption: {},
                    },
                    transform: {
                        orientation: {
                            keys: [],
                            matchName: 'ADBE Orientation',
                            name: 'Orientation',
                            value: [100, 200, 300],
                        },
                        pointOfInterest: {
                            keys: [],
                            matchName: 'ADBE Anchor Point',
                            name: 'Point of Interest',
                            value: [11, 22, 33],
                        },
                        position: {
                            keys: [],
                            matchName: 'ADBE Position',
                            name: 'Position',
                            value: [1, 2, -3],
                        },
                        rotation: {
                            keys: [],
                            matchName: 'ADBE Rotate Z',
                            name: 'Z Rotation',
                            value: 90,
                        },
                        xRotation: {
                            keys: [],
                            matchName: 'ADBE Rotate X',
                            name: 'X Rotation',
                            value: -90,
                        },
                        yRotation: {
                            keys: [],
                            matchName: 'ADBE Rotate Y',
                            name: 'Y Rotation',
                            value: -3600,
                        },
                    },
                    type: 'aex:layer',
                },
                {
                    label: 6,
                    layerType: 'LightLayer',
                    lightType: 4414,
                    markers: [],
                    masks: [],
                    name: 'Light',
                    properties: {
                        lightOption: {},
                    },
                    transform: {
                        position: {
                            keys: [],
                            matchName: 'ADBE Position',
                            name: 'Position',
                            value: [100, 200, 300],
                        },
                    },
                    type: 'aex:layer',
                },
                {
                    geometryOption: {},
                    label: 1,
                    layerType: 'AVLayer',
                    markers: [],
                    masks: [],
                    name: '3d AV Layer',
                    nullLayer: true,
                    properties: {},
                    threeDLayer: true,
                    materialOption: {},
                    transform: {
                        anchorPoint: {
                            keys: [],
                            matchName: 'ADBE Anchor Point',
                            name: 'Anchor Point',
                            value: [11, 22, 33],
                        },
                        opacity: {
                            keys: [],
                            matchName: 'ADBE Opacity',
                            name: 'Opacity',
                            value: 50,
                        },
                        orientation: {
                            keys: [],
                            matchName: 'ADBE Orientation',
                            name: 'Orientation',
                            value: [100, 200, 300],
                        },

                        position: {
                            keys: [],
                            matchName: 'ADBE Position',
                            name: 'Position',
                            value: [1, 2, -3],
                        },
                        rotation: {
                            keys: [],
                            matchName: 'ADBE Rotate Z',
                            name: 'Z Rotation',
                            value: 90,
                        },
                        scale: {
                            keys: [],
                            matchName: 'ADBE Scale',
                            name: 'Scale',
                            value: [10, 20, 30],
                        },
                        xRotation: {
                            keys: [],
                            matchName: 'ADBE Rotate X',
                            name: 'X Rotation',
                            value: -90,
                        },
                        yRotation: {
                            keys: [],
                            matchName: 'ADBE Rotate Y',
                            name: 'Y Rotation',
                            value: -3600,
                        },
                    },
                    type: 'aex:layer',
                },
                {
                    label: 1,
                    layerType: 'AVLayer',
                    markers: [],
                    masks: [],
                    name: '2d AV Layer',
                    nullLayer: true,
                    properties: {},
                    transform: {
                        anchorPoint: {
                            keys: [],
                            matchName: 'ADBE Anchor Point',
                            name: 'Anchor Point',
                            value: [11, 22, 0],
                        },
                        opacity: {
                            keys: [],
                            matchName: 'ADBE Opacity',
                            name: 'Opacity',
                            value: 50,
                        },
                        position: {
                            keys: [],
                            matchName: 'ADBE Position',
                            name: 'Position',
                            value: [1, 2, 0],
                        },
                        rotation: {
                            keys: [],
                            matchName: 'ADBE Rotate Z',
                            name: 'Rotation',
                            value: 90,
                        },
                        scale: {
                            keys: [],
                            matchName: 'ADBE Scale',
                            name: 'Scale',
                            value: [10, 20, 100],
                        },
                    },
                    type: 'aex:layer',
                },
            ]);
        });
    });

    describe('Layer Animation', async () => {
        let result: any;

        before(async () => {
            await openProject('testAssets/property_animated.aep');
            result = await aex().toObjectWithAeObject(AeObject.Project);
            console.log('property_animated', result);
        });

        it(`Can parse eased keyframes`, async () => {
            expect(result.comps[0].layers[0])
                .property('transform')
                .to.eql({
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
                });
        });
        it(`Can parse hold keyframes`, async () => {
            expect(result.comps[1].layers[0])
                .property('transform')
                .to.eql({
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
                });
        });
        it(`Can parse linear keyframes`, async () => {
            expect(result.comps[2].layers[0])
                .property('transform')
                .to.eql({
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
                });
        });
        it(`Can parse mixed easing keyframes`, async () => {
            expect(result.comps[3].layers[0])
                .property('transform')
                .to.eql({
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
                });
        });
    });
});
