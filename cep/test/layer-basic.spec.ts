import { AeObject, aex } from './aex';
import { AEX_AV_LAYER, AEX_CAMERA_LAYER, AEX_LIGHT_LAYER, AEX_SHAPE_LAYER, AEX_TEXT_LAYER } from './constants';
import { cleanupAeqIpc, cleanupAex, evalAexIntoESTK, openProject } from './csinterface';
import { assertAreEqual } from './utils';

describe('Basic Layer Attributes', function () {
    this.slow(500);
    this.timeout(2000);

    let result: any;

    before(async () => {
        await evalAexIntoESTK();
        await openProject('testAssets/layer_basic.aep');
        result = await aex().toObjectWithAeObject(AeObject.ActiveComp);
        console.log('layer_basic', result);
    });

    after(async () => {
        await cleanupAex();
        await cleanupAeqIpc();
    });

    /** Layer tests */
    it(`Can parse basic CameraLayer properties`, async () => {
        assertAreEqual(result.comps[0].layers[0], {
            label: 4,
            markers: [],
            masks: [],
            name: 'Camera',
            transform: {},
            type: AEX_CAMERA_LAYER,
        });
    });

    it(`Can parse basic TextLayer properties`, async () => {
        assertAreEqual(result.comps[0].layers[1], {
            effects: [],
            label: 1,
            markers: [],
            masks: [],
            name: 'Solo Text Layer',
            source: '',
            collapseTransformation: true,
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
            solo: true,
            transform: {},
            type: AEX_TEXT_LAYER,
        });
    });

    it(`Can parse basic AVLayer properties`, async () => {
        assertAreEqual(result.comps[0].layers[2], {
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
        assertAreEqual(result.comps[0].layers[3], {
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
        assertAreEqual(result.comps[0].layers[4], {
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
        assertAreEqual(result.comps[0].layers[5], {
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
        assertAreEqual(result.comps[0].layers[6], {
            effects: [],
            label: 1,
            markers: [],
            masks: [],
            name: 'Parented Solid',
            parentLayerIndex: 5,
            source: 'parented solid:61',
            transform: {
                position: {
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
        assertAreEqual(result.comps[0].layers[7], {
            collapseTransformation: true,
            effects: [],
            geometryOption: {
                matchName: 'ADBE Extrsn Options Group',
                properties: [
                    {
                        keys: [],
                        matchName: 'ADBE Bevel Styles',
                        name: 'Bevel Style',
                        value: 2,
                    },
                    {
                        keys: [],
                        matchName: 'ADBE Bevel Depth',
                        name: 'Bevel Depth',
                        value: 1,
                    },
                    {
                        keys: [],
                        matchName: 'ADBE Hole Bevel Depth',
                        name: 'Hole Bevel Depth',
                        value: 2,
                    },
                    {
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
                        keys: [],
                        matchName: 'ADBE Casts Shadows',
                        name: 'Casts Shadows',
                        value: 1,
                    },
                    {
                        keys: [],
                        matchName: 'ADBE Accepts Shadows',
                        name: 'Accepts Shadows',
                        value: 2,
                    },
                    {
                        keys: [],
                        matchName: 'ADBE Accepts Lights',
                        name: 'Accepts Lights',
                        value: 0,
                    },
                    {
                        keys: [],
                        matchName: 'ADBE Appears in Reflections',
                        name: 'Appears in Reflections',
                        value: 2,
                    },
                    {
                        keys: [],
                        matchName: 'ADBE Ambient Coefficient',
                        name: 'Ambient',
                        value: 1,
                    },
                    {
                        keys: [],
                        matchName: 'ADBE Diffuse Coefficient',
                        name: 'Diffuse',
                        value: 2,
                    },
                    {
                        keys: [],
                        matchName: 'ADBE Specular Coefficient',
                        name: 'Specular Intensity',
                        value: 3,
                    },
                    {
                        keys: [],
                        matchName: 'ADBE Shininess Coefficient',
                        name: 'Specular Shininess',
                        value: 4,
                    },
                    {
                        keys: [],
                        matchName: 'ADBE Metal Coefficient',
                        name: 'Metal',
                        value: 5,
                    },
                    {
                        keys: [],
                        matchName: 'ADBE Reflection Coefficient',
                        name: 'Reflection Intensity',
                        value: 6,
                    },
                    {
                        keys: [],
                        matchName: 'ADBE Glossiness Coefficient',
                        name: 'Reflection Sharpness',
                        value: 7,
                    },
                    {
                        keys: [],
                        matchName: 'ADBE Fresnel Coefficient',
                        name: 'Reflection Rolloff',
                        value: 8,
                    },
                ],
            },
            name: '3d',
            source: '',
            threeDLayer: true,
            transform: {},
            type: AEX_SHAPE_LAYER,
        });
    });
});
