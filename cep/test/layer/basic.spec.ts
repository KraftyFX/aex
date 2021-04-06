import { AeObject, aex } from '../aex';
import {
    AEX_AV_LAYER,
    AEX_CAMERA_LAYER,
    AEX_LIGHT_LAYER,
    AEX_ONED_PROPERTY,
    AEX_SHAPE_LAYER,
    AEX_TEXTDOCUMENT_PROPERTY,
    AEX_TEXT_LAYER,
    AEX_THREED_PROPERTY,
} from '../constants';
import { cleanupAex, evalAexIntoEstk, openProject } from '../csinterface';
import { assertAreEqual } from '../utils';

describe('Basic Layer Attributes', function () {
    this.slow(500);
    this.timeout(2000);

    let comp: any;

    before(async () => {
        await evalAexIntoEstk();
        await openProject('testAssets/layer_basic.aep');
        const result = await aex().fromAeObject(AeObject.ActiveComp);
        comp = result.object;
        console.log('layer_basic', comp);
    });

    after(async () => {
        await cleanupAex();
    });

    /** Layer tests */
    it(`Can parse basic CameraLayer properties`, async () => {
        assertAreEqual(comp.layers[0], {
            label: 4,
            markers: [],
            masks: [],
            name: 'Camera',
            transform: {},
            type: AEX_CAMERA_LAYER,
        });
    });

    it(`Can parse basic TextLayer properties`, async () => {
        assertAreEqual(comp.layers[1], {
            effects: [],
            label: 1,
            markers: [],
            masks: [],
            name: 'Solo Text Layer',
            collapseTransformation: true,
            sourceText: {
                type: AEX_TEXTDOCUMENT_PROPERTY,
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
            solo: true,
            transform: {},
            type: AEX_TEXT_LAYER,
        });
    });

    it(`Can parse basic AVLayer properties`, async () => {
        assertAreEqual(comp.layers[2], {
            effects: [],
            label: 1,
            markers: [],
            masks: [],
            name: 'Empty',
            nullLayer: true,
            transform: {},
            source: 'null 1:50',
            type: AEX_AV_LAYER,
        });
    });

    it(`Can parse basic LightLayer properties`, async () => {
        assertAreEqual(comp.layers[3], {
            inPoint: 0.5,
            label: 1,
            lightType: 4414,
            markers: [],
            masks: [],
            name: 'Timing Light',
            outPoint: 3.06666666666667,
            transform: {},
            type: AEX_LIGHT_LAYER,
        });
    });

    it(`Can parse various Layer flags`, async () => {
        assertAreEqual(comp.layers[4], {
            adjustmentLayer: true,
            autoOrient: 4213,
            collapseTransformation: true,
            effects: [],
            label: 2,
            markers: [],
            masks: [],
            motionBlur: true,
            name: 'Flags',
            nullLayer: true,
            samplingQuality: 4813,
            shy: true,
            source: 'null 1:50',
            transform: {},
            type: AEX_AV_LAYER,
        });
    });

    it(`Can parse Layer blend mode & time stretch`, async () => {
        assertAreEqual(comp.layers[5], {
            blendingMode: 5216,
            effects: [],
            label: 1,
            markers: [],
            masks: [],
            name: 'Blend Stretch',
            nullLayer: true,
            outPoint: 1,
            source: 'null 1:50',
            stretch: 25,
            transform: {},
            type: AEX_AV_LAYER,
        });
    });

    it(`Can parse parented layers`, async () => {
        assertAreEqual(comp.layers[6], {
            effects: [],
            label: 1,
            markers: [],
            masks: [],
            name: 'Parented Solid',
            parentLayerIndex: 5,
            source: 'parented solid:61',
            transform: {
                position: {
                    type: AEX_THREED_PROPERTY,
                    keys: [],
                    matchName: 'ADBE Position',
                    name: 'Position',
                    value: [0, 0, 0],
                },
            },
            type: AEX_AV_LAYER,
        });
    });

    it(`Can parse 3d layers`, async () => {
        assertAreEqual(comp.layers[7], {
            collapseTransformation: true,
            contents: [],
            effects: [],
            geometryOption: {
                matchName: 'ADBE Extrsn Options Group',
                properties: [
                    {
                        type: AEX_ONED_PROPERTY,
                        keys: [],
                        matchName: 'ADBE Bevel Styles',
                        name: 'Bevel Style',
                        value: 2,
                    },
                    {
                        type: AEX_ONED_PROPERTY,
                        keys: [],
                        matchName: 'ADBE Bevel Depth',
                        name: 'Bevel Depth',
                        value: 1,
                    },
                    {
                        type: AEX_ONED_PROPERTY,
                        keys: [],
                        matchName: 'ADBE Hole Bevel Depth',
                        name: 'Hole Bevel Depth',
                        value: 2,
                    },
                    {
                        type: AEX_ONED_PROPERTY,
                        keys: [],
                        matchName: 'ADBE Extrsn Depth',
                        name: 'Extrusion Depth',
                        value: 3,
                    },
                ],
            },
            label: 8,
            markers: [],
            masks: [],
            materialOption: {
                matchName: 'ADBE Material Options Group',
                properties: [
                    {
                        type: AEX_ONED_PROPERTY,
                        keys: [],
                        matchName: 'ADBE Casts Shadows',
                        name: 'Casts Shadows',
                        value: 1,
                    },
                    {
                        type: AEX_ONED_PROPERTY,
                        keys: [],
                        matchName: 'ADBE Accepts Shadows',
                        name: 'Accepts Shadows',
                        value: 2,
                    },
                    {
                        type: AEX_ONED_PROPERTY,
                        keys: [],
                        matchName: 'ADBE Accepts Lights',
                        name: 'Accepts Lights',
                        value: 0,
                    },
                    {
                        type: AEX_ONED_PROPERTY,
                        keys: [],
                        matchName: 'ADBE Appears in Reflections',
                        name: 'Appears in Reflections',
                        value: 2,
                    },
                    {
                        type: AEX_ONED_PROPERTY,
                        keys: [],
                        matchName: 'ADBE Ambient Coefficient',
                        name: 'Ambient',
                        value: 1,
                    },
                    {
                        type: AEX_ONED_PROPERTY,
                        keys: [],
                        matchName: 'ADBE Diffuse Coefficient',
                        name: 'Diffuse',
                        value: 2,
                    },
                    {
                        type: AEX_ONED_PROPERTY,
                        keys: [],
                        matchName: 'ADBE Specular Coefficient',
                        name: 'Specular Intensity',
                        value: 3,
                    },
                    {
                        type: AEX_ONED_PROPERTY,
                        keys: [],
                        matchName: 'ADBE Shininess Coefficient',
                        name: 'Specular Shininess',
                        value: 4,
                    },
                    {
                        type: AEX_ONED_PROPERTY,
                        keys: [],
                        matchName: 'ADBE Metal Coefficient',
                        name: 'Metal',
                        value: 5,
                    },
                    {
                        type: AEX_ONED_PROPERTY,
                        keys: [],
                        matchName: 'ADBE Reflection Coefficient',
                        name: 'Reflection Intensity',
                        value: 6,
                    },
                    {
                        type: AEX_ONED_PROPERTY,
                        keys: [],
                        matchName: 'ADBE Glossiness Coefficient',
                        name: 'Reflection Sharpness',
                        value: 7,
                    },
                    {
                        type: AEX_ONED_PROPERTY,
                        keys: [],
                        matchName: 'ADBE Fresnel Coefficient',
                        name: 'Reflection Rolloff',
                        value: 8,
                    },
                ],
            },
            name: '3d',
            threeDLayer: true,
            transform: {},
            type: AEX_SHAPE_LAYER,
        });
    });

    it(`Can parse time remap enabled (but not modified)`, async () => {
        assertAreEqual(comp.layers[8], {
            effects: [],
            label: 15,
            markers: [],
            masks: [],
            name: 'TR Enabled',
            source: 'precomp:65',
            timeRemap: {
                type: AEX_ONED_PROPERTY,
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
                                    speed: 1,
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
                                    speed: 1,
                                },
                            ],
                            outEase: [
                                {
                                    influence: 16.666666667,
                                    speed: 0,
                                },
                            ],
                        },
                        time: 4,
                        value: 4,
                    },
                ],
                matchName: 'ADBE Time Remapping',
                name: 'Time Remap',
                value: 2,
            },
            timeRemapEnabled: true,
            transform: {},
            type: AEX_AV_LAYER,
        });
    });

    it(`Can parse time remap enabled (and modified)`, async () => {
        assertAreEqual(comp.layers[9], {
            effects: [],
            label: 15,
            markers: [],
            masks: [],
            name: 'TR Remapped',
            source: 'precomp:65',
            timeRemap: {
                type: AEX_ONED_PROPERTY,
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
                                    speed: 2,
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
                                    speed: 2,
                                },
                            ],
                            outEase: [
                                {
                                    influence: 16.666666667,
                                    speed: 0,
                                },
                            ],
                        },
                        time: 2,
                        value: 4,
                    },
                ],
                matchName: 'ADBE Time Remapping',
                name: 'Time Remap',
                value: 4,
            },
            timeRemapEnabled: true,
            transform: {},
            type: AEX_AV_LAYER,
        });
    });
});
