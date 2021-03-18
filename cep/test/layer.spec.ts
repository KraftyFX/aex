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

    it(`Can parse camera layer attributes`, async () => {
        await openProject('testAssets/layer_camera.aep');

        const result = await aex().toObjectWithAeObject(AeObject.ActiveComp);

        expect(result).property('comps').to.be.of.length(1);

        console.log('layer_camera', result);
        expect(result.comps[0])
            .property('layers')
            .to.eql([
                {
                    label: 4,
                    layerType: 'CameraLayer',
                    markers: [],
                    masks: [],
                    name: 'One-Node',
                    properties: {
                        cameraOption: {
                            'ADBE Camera Aperture': {
                                keys: [],
                                matchName: 'ADBE Camera Aperture',
                                name: 'Aperture',
                                value: 3,
                            },
                            'ADBE Camera Blur Level': {
                                keys: [],
                                matchName: 'ADBE Camera Blur Level',
                                name: 'Blur Level',
                                value: 4,
                            },
                            'ADBE Camera Focus Distance': {
                                keys: [],
                                matchName: 'ADBE Camera Focus Distance',
                                name: 'Focus Distance',
                                value: 2,
                            },
                            'ADBE Camera Zoom': {
                                keys: [],
                                matchName: 'ADBE Camera Zoom',
                                name: 'Zoom',
                                value: 1,
                            },
                            'ADBE Iris Aspect Ratio': {
                                keys: [],
                                matchName: 'ADBE Iris Aspect Ratio',
                                name: 'Iris Aspect Ratio',
                                value: 7,
                            },
                            'ADBE Iris Diffraction Fringe': {
                                keys: [],
                                matchName: 'ADBE Iris Diffraction Fringe',
                                name: 'Iris Diffraction Fringe',
                                value: 8,
                            },
                            'ADBE Iris Highlight Gain': {
                                keys: [],
                                matchName: 'ADBE Iris Highlight Gain',
                                name: 'Highlight Gain',
                                value: 9,
                            },
                            'ADBE Iris Highlight Threshold': {
                                keys: [],
                                matchName: 'ADBE Iris Highlight Threshold',
                                name: 'Highlight Threshold',
                                value: 0.03921568627451,
                            },
                            'ADBE Iris Hightlight Saturation': {
                                keys: [],
                                matchName: 'ADBE Iris Hightlight Saturation',
                                name: 'Highlight Saturation',
                                value: 11,
                            },
                            'ADBE Iris Rotation': {
                                keys: [],
                                matchName: 'ADBE Iris Rotation',
                                name: 'Iris Rotation',
                                value: 5,
                            },
                            'ADBE Iris Roundness': {
                                keys: [],
                                matchName: 'ADBE Iris Roundness',
                                name: 'Iris Roundness',
                                value: 6,
                            },
                            'ADBE Iris Shape': {
                                keys: [],
                                matchName: 'ADBE Iris Shape',
                                name: 'Iris Shape',
                                value: 4,
                            },
                        },
                    },
                    transform: {},
                    type: 'aex:layer',
                },
                {
                    label: 4,
                    layerType: 'CameraLayer',
                    markers: [],
                    masks: [],
                    name: 'Two-Node',
                    properties: {
                        cameraOption: {},
                    },
                    transform: {
                        pointOfInterest: {
                            keys: [],
                            matchName: 'ADBE Anchor Point',
                            name: 'Point of Interest',
                            value: [100, 200, 300],
                        },
                    },
                    type: 'aex:layer',
                },
            ]);
    });

    it(`Can parse layer audio`, async () => {
        await openProject('testAssets/layer_audio.aep');

        const result = await aex().toObjectWithAeObject(AeObject.ActiveComp);

        console.log('layer_audio', result);
        expect(result).property('comps').to.be.of.length(1);
        expect(result.comps[0].layers[0]).property('audio').to.eql({});
        expect(result.comps[0].layers[1])
            .property('audio')
            .to.eql({
                'ADBE Audio Levels': {
                    keys: [],
                    matchName: 'ADBE Audio Levels',
                    name: 'Audio Levels',
                    value: [12, 12],
                },
            });
    });

    describe('Text Properties', async () => {
        let result: any;

        before(async () => {
            await openProject('testAssets/layer_text.aep');
            result = await aex().toObjectWithAeObject(AeObject.Project);
            console.log('layer_text', result);
        });

        it('Can parse per-character 3d', async () => {
            expect(result.comps[0].layers[0]).property('threeDPerChar').to.eql(true);
        });

        it('Can parse Text Path Options', async () => {
            expect(result.comps[0].layers[1].properties)
                .property('pathOption')
                .to.eql({
                    'ADBE Text First Margin': {
                        name: 'First Margin',
                        matchName: 'ADBE Text First Margin',
                        value: 18,
                        keys: [],
                    },
                    'ADBE Text Force Align Path': {
                        name: 'Force Alignment',
                        matchName: 'ADBE Text Force Align Path',
                        value: 1,
                        keys: [],
                    },
                    'ADBE Text Last Margin': {
                        name: 'Last Margin',
                        matchName: 'ADBE Text Last Margin',
                        value: 20,
                        keys: [],
                    },
                    'ADBE Text Path': {
                        name: 'Path',
                        matchName: 'ADBE Text Path',
                        value: 1,
                        keys: [],
                    },
                    'ADBE Text Reverse Path': {
                        name: 'Reverse Path',
                        matchName: 'ADBE Text Reverse Path',
                        value: 1,
                        keys: [],
                    },
                });
        });

        it('Can parse Text More Options', async () => {
            expect(result.comps[0].layers[2].properties)
                .property('moreOption')
                .to.eql({
                    'ADBE Text Anchor Point Align': {
                        name: 'Grouping Alignment',
                        matchName: 'ADBE Text Anchor Point Align',
                        value: [18, 20],
                        keys: [],
                    },
                    'ADBE Text Anchor Point Option': {
                        name: 'Anchor Point Grouping',
                        matchName: 'ADBE Text Anchor Point Option',
                        value: 2,
                        keys: [],
                    },
                    'ADBE Text Character Blend Mode': {
                        name: 'Inter-Character Blending',
                        matchName: 'ADBE Text Character Blend Mode',
                        value: 9,
                        keys: [],
                    },
                    'ADBE Text Render Order': {
                        name: 'Fill & Stroke',
                        matchName: 'ADBE Text Render Order',
                        value: 2,
                        keys: [],
                    },
                });
        });

        it('Can parse Text Animators', async () => {
            expect(result.comps[1].layers[0].properties)
                .property('animators')
                .to.eql({
                    'ADBE Text Animator': {
                        'ADBE Text Animator Properties': {},
                        'ADBE Text Selectors': {
                            'ADBE Text Selector': {
                                'ADBE Text Range Advanced': {},
                            },
                        },
                    },
                });
            expect(result.comps[1].layers[1].properties)
                .property('animators')
                .to.eql({
                    'ADBE Text Animator': {
                        'ADBE Text Animator Properties': {
                            'ADBE Text Position 3D': {
                                keys: [],
                                matchName: 'ADBE Text Position 3D',
                                name: 'Position',
                                value: [0, 100, 0],
                            },
                        },
                        'ADBE Text Selectors': {
                            'ADBE Text Selector': {
                                'ADBE Text Percent Start': {
                                    keys: [
                                        {
                                            value: 0,
                                            time: 0,
                                            interpolationType: {},
                                            temporalEase: {
                                                inEase: [{ influence: 16.666666667, speed: 0 }],
                                                outEase: [{ influence: 16.666666667, speed: 50 }],
                                            },
                                        },
                                        {
                                            value: 100,
                                            time: 2,
                                            interpolationType: {},
                                            temporalEase: {
                                                inEase: [{ influence: 16.666666667, speed: 50 }],
                                                outEase: [{ influence: 16.666666667, speed: 0 }],
                                            },
                                        },
                                    ],
                                    matchName: 'ADBE Text Percent Start',
                                    name: 'Start',
                                    value: 0,
                                },
                                'ADBE Text Range Advanced': {},
                            },
                        },
                    },
                });
            expect(result.comps[1].layers[2].properties)
                .property('animators')
                .to.eql({
                    'ADBE Text Animator': {
                        'ADBE Text Animator Properties': {},
                        'ADBE Text Selectors': {
                            'ADBE Text Expressible Selector': {
                                'ADBE Text Expressible Amount': {
                                    expression: 'timeToFrames(time * 10) * textIndex/textTotal',
                                    expressionEnabled: true,
                                    keys: [],
                                    matchName: 'ADBE Text Expressible Amount',
                                    name: 'Amount',
                                    value: [100, 100, 100],
                                },
                            },
                            'ADBE Text Selector': {
                                'ADBE Text Range Advanced': {},
                            },
                        },
                    },
                });
            expect(result.comps[1].layers[3].properties)
                .property('animators')
                .to.eql({
                    'ADBE Text Animator': {
                        'ADBE Text Animator Properties': {
                            'ADBE Text Tracking Amount': {
                                keys: [],
                                matchName: 'ADBE Text Tracking Amount',
                                name: 'Tracking Amount',
                                value: 100,
                            },
                        },
                        'ADBE Text Selectors': {
                            'ADBE Text Wiggly Selector': {
                                'ADBE Text Selector Mode': {
                                    keys: [],
                                    matchName: 'ADBE Text Selector Mode',
                                    name: 'Mode',
                                    value: 3,
                                },
                            },
                        },
                    },
                });
        });
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

    describe('Layer Masks', async () => {
        let result: any;

        before(async () => {
            await openProject('testAssets/layer_masks.aep');
            result = await aex().toObjectWithAeObject(AeObject.ActiveComp);
            console.log('layer_masks', result);
        });

        it('Can parse simple masks', async () => {
            expect(result.comps[0].layers[0])
                .property('masks')
                .to.eql([
                    {
                        color: [0.70196078431373, 0.78039215686275, 0.70196078431373],
                        maskPath: {
                            keys: [],
                            matchName: 'ADBE Mask Shape',
                            name: 'Mask Path',
                            value: {
                                closed: true,
                                featherInterps: [],
                                featherRadii: [],
                                featherRelCornerAngles: [],
                                featherRelSegLocs: [],
                                featherSegLocs: [],
                                featherTensions: [],
                                featherTypes: [],
                                inTangents: [
                                    [96.5352172851562, 0],
                                    [0, -96.5352172851562],
                                    [-96.5352020263672, 0],
                                    [0, 96.5351867675781],
                                ],
                                outTangents: [
                                    [-96.5352020263672, 0],
                                    [0, 96.5351867675781],
                                    [96.5352172851562, 0],
                                    [0, -96.5352172851562],
                                ],
                                vertices: [
                                    [279.849060058594, 92.3773651123047],
                                    [105.056610107422, 267.169830322266],
                                    [279.849060058594, 441.962280273438],
                                    [454.641540527344, 267.169830322266],
                                ],
                            },
                        },
                        name: 'Basic',
                    },
                    {
                        color: [0.55686274509804, 0.17254901960784, 0.60392156862745],
                        inverted: true,
                        maskExpansion: {
                            keys: [],
                            matchName: 'ADBE Mask Offset',
                            name: 'Mask Expansion',
                            value: 23,
                        },
                        maskFeather: {
                            keys: [],
                            matchName: 'ADBE Mask Feather',
                            name: 'Mask Feather',
                            value: [33, 33],
                        },
                        maskMode: 6814,
                        maskOpacity: {
                            keys: [],
                            matchName: 'ADBE Mask Opacity',
                            name: 'Mask Opacity',
                            value: 73,
                        },
                        maskPath: {
                            keys: [],
                            matchName: 'ADBE Mask Shape',
                            name: 'Mask Path',
                            value: {
                                closed: true,
                                featherInterps: [],
                                featherRadii: [],
                                featherRelCornerAngles: [],
                                featherRelSegLocs: [],
                                featherSegLocs: [],
                                featherTensions: [],
                                featherTypes: [],
                                inTangents: [
                                    [0, 0],
                                    [0, 0],
                                    [0, 0],
                                    [0, 0],
                                    [0, 0],
                                    [0, 0],
                                    [0, 0],
                                    [0, 0],
                                    [0, 0],
                                    [0, 0],
                                ],
                                outTangents: [
                                    [0, 0],
                                    [0, 0],
                                    [0, 0],
                                    [0, 0],
                                    [0, 0],
                                    [0, 0],
                                    [0, 0],
                                    [0, 0],
                                    [0, 0],
                                    [0, 0],
                                ],
                                vertices: [
                                    [1552.3017578125, 432.905731201172],
                                    [1381.7353515625, 528.466918945312],
                                    [1206.31774902344, 442.133514404297],
                                    [1244.49389648438, 633.881958007812],
                                    [1108.17895507812, 774.03564453125],
                                    [1302.33947753906, 796.981323242188],
                                    [1393.50988769531, 969.934204101562],
                                    [1475.33142089844, 792.367431640625],
                                    [1667.99279785156, 759.104736328125],
                                    [1524.40087890625, 626.41650390625],
                                ],
                            },
                        },
                        name: 'Attributes',
                    },
                ]);
        });

        it('Can parse detailed masks', async () => {
            expect(result.comps[0].layers[1])
                .property('masks')
                .to.eql([
                    {
                        color: [0.70196078431373, 0.78039215686275, 0.70196078431373],
                        maskPath: {
                            keys: [],
                            matchName: 'ADBE Mask Shape',
                            name: 'Mask Path',
                            value: {
                                closed: true,
                                featherInterps: [0, 0, 0],
                                featherRadii: [74.2787603454047, 0, 54.6675452679194],
                                featherRelCornerAngles: [0, 0, 0],
                                featherRelSegLocs: [0.99291693248793, 0.98317569935943, 0.88107259136291],
                                featherSegLocs: [1, 2, 3],
                                featherTensions: [0, 0, 0],
                                featherTypes: [0, 0, 0],
                                inTangents: [
                                    [96.5352172851562, 0],
                                    [0, -96.5352172851562],
                                    [-96.5352020263672, 0],
                                    [0, 96.5351867675781],
                                ],
                                outTangents: [
                                    [-96.5352020263672, 0],
                                    [0, 96.5351867675781],
                                    [96.5352172851562, 0],
                                    [0, -96.5352172851562],
                                ],
                                vertices: [
                                    [279.849060058594, 92.3773651123047],
                                    [105.056610107422, 267.169830322266],
                                    [279.849060058594, 441.962280273438],
                                    [454.641540527344, 267.169830322266],
                                ],
                            },
                        },
                        name: 'Feather',
                    },
                    {
                        color: [0.55686274509804, 0.17254901960784, 0.60392156862745],
                        maskPath: {
                            keys: [],
                            matchName: 'ADBE Mask Shape',
                            name: 'Mask Path',
                            value: {
                                closed: true,
                                featherInterps: [],
                                featherRadii: [],
                                featherRelCornerAngles: [],
                                featherRelSegLocs: [],
                                featherSegLocs: [],
                                featherTensions: [],
                                featherTypes: [],
                                inTangents: [
                                    [0, 0],
                                    [73.961669921875, -5.87274169921875],
                                    [0, 0],
                                    [0, -56.2312622070312],
                                    [0, 0],
                                    [-47.094482421875, -32.6036376953125],
                                    [0, 0],
                                    [-53.385986328125, 53.3859252929688],
                                    [0, 0],
                                    [21.004638671875, 64.9070434570312],
                                ],
                                outTangents: [
                                    [0, 0],
                                    [-73.961669921875, 5.87274169921875],
                                    [0, 0],
                                    [0, 56.2312622070312],
                                    [0, 0],
                                    [47.094482421875, 32.6036376953125],
                                    [0, 0],
                                    [53.385986328125, -53.3859252929688],
                                    [0, 0],
                                    [-21.004638671875, -64.9070434570312],
                                ],
                                vertices: [
                                    [1552.3017578125, 432.905731201172],
                                    [1381.7353515625, 528.466918945312],
                                    [1206.31774902344, 442.133514404297],
                                    [1244.49389648438, 633.881958007812],
                                    [1108.17895507812, 774.03564453125],
                                    [1302.33947753906, 796.981323242188],
                                    [1393.50988769531, 969.934204101562],
                                    [1475.33142089844, 792.367431640625],
                                    [1667.99279785156, 759.104736328125],
                                    [1524.40087890625, 626.41650390625],
                                ],
                            },
                        },
                        name: 'Bezier',
                    },
                ]);
        });

        it('Can parse animated masks', async () => {
            expect(result.comps[0].layers[2].masks[0])
                .property('maskPath')
                .to.eql({
                    keys: [
                        {
                            interpolationType: {},
                            temporalEase: {
                                inEase: [{ influence: 16.666666667, speed: 0 }],
                                outEase: [{ influence: 16.666666667, speed: 1 }],
                            },
                            time: 0,
                            value: {
                                closed: true,
                                featherInterps: [0, 0],
                                featherRadii: [-1e-8, 0],
                                featherRelCornerAngles: [0, 0],
                                featherRelSegLocs: [0.38178384436651, 0.88224978803798],
                                featherSegLocs: [0, 8],
                                featherTensions: [0, 0],
                                featherTypes: [1, 0],
                                inTangents: [
                                    [0, 0],
                                    [0, 0],
                                    [0, 0],
                                    [0, 0],
                                    [0, 0],
                                    [0, 0],
                                    [0, 0],
                                    [0, 0],
                                    [0, 0],
                                    [0, 0],
                                ],
                                outTangents: [
                                    [0, 0],
                                    [0, 0],
                                    [0, 0],
                                    [0, 0],
                                    [0, 0],
                                    [0, 0],
                                    [0, 0],
                                    [0, 0],
                                    [0, 0],
                                    [0, 0],
                                ],
                                vertices: [
                                    [960, 50.7169952392578],
                                    [801.297973632812, 372.282531738281],
                                    [446.429504394531, 423.847961425781],
                                    [703.214721679688, 674.151550292969],
                                    [642.595947265625, 1027.58605957031],
                                    [960, 860.716979980469],
                                    [1277.40393066406, 1027.58605957031],
                                    [1216.78515625, 674.151550292969],
                                    [1473.5703125, 423.847961425781],
                                    [1118.70190429688, 372.282531738281],
                                ],
                            },
                        },
                        {
                            interpolationType: {},
                            temporalEase: {
                                inEase: [{ influence: 16.666666667, speed: 1 }],
                                outEase: [{ influence: 16.666666667, speed: 0 }],
                            },
                            time: 4.95833333333333,
                            value: {
                                closed: true,
                                featherInterps: [0, 0],
                                featherRadii: [-70.0135515570367, 66.9355929759104],
                                featherRelCornerAngles: [0, 0],
                                featherRelSegLocs: [0.38178384436651, 0.88224978803798],
                                featherSegLocs: [0, 8],
                                featherTensions: [0, 0],
                                featherTypes: [1, 0],
                                inTangents: [
                                    [0, 0],
                                    [0, 0],
                                    [0, 0],
                                    [46.671875, 159.623229980469],
                                    [0, 0],
                                    [74.2637939453125, -110.262939453125],
                                    [0, 0],
                                    [0, 0],
                                    [-20.8913269042969, -91.8089599609375],
                                    [0, 0],
                                ],
                                outTangents: [
                                    [0, 0],
                                    [0, 0],
                                    [0, 0],
                                    [-46.671875, -159.623245239258],
                                    [0, 0],
                                    [-74.2638549804688, 110.262939453125],
                                    [0, 0],
                                    [0, 0],
                                    [20.8913269042969, 91.8089599609375],
                                    [0, 0],
                                ],
                                vertices: [
                                    [959.999755859375, 1027.58618164062],
                                    [1118.70190429688, 706.020629882812],
                                    [1473.5703125, 654.455200195312],
                                    [1216.78515625, 404.151550292969],
                                    [1277.40380859375, 50.717041015625],
                                    [959.999755859375, 217.586120605469],
                                    [642.595886230469, 50.717041015625],
                                    [703.214660644531, 404.151550292969],
                                    [446.429443359375, 654.455200195312],
                                    [801.297912597656, 706.020629882812],
                                ],
                            },
                        },
                    ],
                    matchName: 'ADBE Mask Shape',
                    name: 'Mask Path',
                    value: {
                        closed: true,
                        featherInterps: [0, 0],
                        featherRadii: [-1e-8, 0],
                        featherRelCornerAngles: [0, 0],
                        featherRelSegLocs: [0.38178384436651, 0.88224978803798],
                        featherSegLocs: [0, 8],
                        featherTensions: [0, 0],
                        featherTypes: [1, 0],
                        inTangents: [
                            [0, 0],
                            [0, 0],
                            [0, 0],
                            [0, 0],
                            [0, 0],
                            [0, 0],
                            [0, 0],
                            [0, 0],
                            [0, 0],
                            [0, 0],
                        ],
                        outTangents: [
                            [0, 0],
                            [0, 0],
                            [0, 0],
                            [0, 0],
                            [0, 0],
                            [0, 0],
                            [0, 0],
                            [0, 0],
                            [0, 0],
                            [0, 0],
                        ],
                        vertices: [
                            [960, 50.7169952392578],
                            [801.297973632812, 372.282531738281],
                            [446.429504394531, 423.847961425781],
                            [703.214721679688, 674.151550292969],
                            [642.595947265625, 1027.58605957031],
                            [960, 860.716979980469],
                            [1277.40393066406, 1027.58605957031],
                            [1216.78515625, 674.151550292969],
                            [1473.5703125, 423.847961425781],
                            [1118.70190429688, 372.282531738281],
                        ],
                    },
                });
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
