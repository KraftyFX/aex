import { AeObject, aex } from '../aex';
import {
    AEX_CAMERA_LAYER,
    AEX_COMP_ITEM,
    AEX_COMP_LAYER,
    AEX_LIGHT_LAYER,
    AEX_NULL_LAYER,
    AEX_ONED_PROPERTY,
    AEX_PROJECT,
    AEX_SHAPE_LAYER,
    AEX_SOLID_ITEM,
    AEX_SOLID_LAYER,
    AEX_TEXTDOCUMENT_PROPERTY,
    AEX_TEXT_LAYER,
    AEX_THREED_PROPERTY,
} from '../constants';
import { cleanupAex, evalAexIntoEstk, openCleanProject, openProject } from '../csinterface';
import { assertAreEqual } from '../utils';

describe('Basic Layer Attributes', function () {
    this.slow(500);
    this.timeout(5000);

    before(async () => {
        await evalAexIntoEstk();
    });

    after(async () => {
        await cleanupAex();
    });

    describe('Get', async () => {
        let comp: any;

        before(async () => {
            await openProject('testAssets/layer_basic.aep');
            const result = await aex().get(AeObject.ActiveComp);
            comp = result.object;
            console.log('layer_basic', comp);
        });

        /** Layer tests */
        it(`Can parse basic CameraLayer properties`, async () => {
            assertAreEqual(comp.layers[0], {
                label: 4,
                markers: [],
                name: 'Camera',
                transform: {
                    position: {
                        keys: [],
                        matchName: 'ADBE Position',
                        name: 'Position',
                        type: AEX_THREED_PROPERTY,
                        value: [640, 360, -1777.7778],
                    },
                },
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
                sourceText: {
                    type: AEX_TEXTDOCUMENT_PROPERTY,
                    keys: [],
                    matchName: 'ADBE Text Document',
                    name: 'Source Text',
                    value: {
                        applyFill: true,
                        baselineLocs: [-115.332, 0, 115.332, 0],
                        baselineShift: 0,
                        fillColor: [1, 1, 1],
                        font: 'ArialMT',
                        fontFamily: 'Arial',
                        fontSize: 50,
                        fontStyle: 'Regular',
                        horizontalScale: 1,
                        justification: 7415,
                        leading: 60,
                        pointText: true,
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

        it(`Can parse basic Null layer properties`, async () => {
            assertAreEqual(comp.layers[2], {
                effects: [],
                label: 1,
                markers: [],
                masks: [],
                name: 'Empty',
                trackers: [],
                transform: {},
                source: {
                    type: AEX_SOLID_ITEM,
                    id: 'null 1:50',
                },
                type: AEX_NULL_LAYER,
            });
        });

        it(`Can parse basic LightLayer properties`, async () => {
            assertAreEqual(comp.layers[3], {
                inPoint: 0.5,
                label: 1,
                lightType: 4414,
                markers: [],
                name: 'Timing Light',
                outPoint: 3.0667,
                transform: {
                    position: {
                        keys: [],
                        matchName: 'ADBE Position',
                        name: 'Position',
                        type: AEX_THREED_PROPERTY,
                        value: [600, 500, 400],
                    },
                },
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
                samplingQuality: 4813,
                shy: true,
                source: {
                    type: AEX_SOLID_ITEM,
                    id: 'null 1:50',
                },
                trackers: [],
                transform: {},
                type: AEX_NULL_LAYER,
            });
        });

        it(`Can parse Layer blend mode`, async () => {
            assertAreEqual(comp.layers[5], {
                blendingMode: 5216,
                effects: [],
                label: 1,
                markers: [],
                masks: [],
                name: 'Blend Mode',
                source: {
                    type: AEX_SOLID_ITEM,
                    id: 'null 1:50',
                },
                trackers: [],
                transform: {},
                type: AEX_NULL_LAYER,
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
                source: {
                    type: AEX_SOLID_ITEM,
                    id: 'parented solid:61',
                },
                trackers: [],
                transform: {
                    position: {
                        type: AEX_THREED_PROPERTY,
                        keys: [],
                        matchName: 'ADBE Position',
                        name: 'Position',
                        value: [0, 0, 0],
                    },
                },
                type: AEX_SOLID_LAYER,
            });
        });

        it(`Can parse 3d layers`, async () => {
            assertAreEqual(comp.layers[7], {
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
                source: {
                    type: AEX_COMP_ITEM,
                    id: 'precomp:65',
                },
                timeRemap: {
                    type: AEX_ONED_PROPERTY,
                    keys: [
                        {
                            temporalEase: {
                                inEase: [
                                    {
                                        influence: 16.66667,
                                        speed: 0,
                                    },
                                ],
                                outEase: [
                                    {
                                        influence: 16.66667,
                                        speed: 1,
                                    },
                                ],
                            },
                            time: 0,
                            value: 0,
                        },
                        {
                            temporalEase: {
                                inEase: [
                                    {
                                        influence: 16.66667,
                                        speed: 1,
                                    },
                                ],
                                outEase: [
                                    {
                                        influence: 16.66667,
                                        speed: 0,
                                    },
                                ],
                            },
                            time: 4,
                            value: 1,
                        },
                    ],
                    matchName: 'ADBE Time Remapping',
                    name: 'Time Remap',
                    value: 0.5,
                },
                timeRemapEnabled: true,
                trackers: [],
                transform: {},
                type: AEX_COMP_LAYER,
            });
        });

        it(`Can parse time remap enabled (and modified)`, async () => {
            assertAreEqual(comp.layers[9], {
                effects: [],
                label: 15,
                markers: [],
                masks: [],
                name: 'TR Remapped',
                source: {
                    type: AEX_COMP_ITEM,
                    id: 'precomp:65',
                },
                timeRemap: {
                    type: AEX_ONED_PROPERTY,
                    keys: [
                        {
                            temporalEase: {
                                inEase: [
                                    {
                                        influence: 16.66667,
                                        speed: 0,
                                    },
                                ],
                                outEase: [
                                    {
                                        influence: 16.66667,
                                        speed: 2,
                                    },
                                ],
                            },
                            time: 0,
                            value: 0,
                        },
                        {
                            temporalEase: {
                                inEase: [
                                    {
                                        influence: 16.66667,
                                        speed: 2,
                                    },
                                ],
                                outEase: [
                                    {
                                        influence: 16.66667,
                                        speed: 0,
                                    },
                                ],
                            },
                            time: 2,
                            value: 1,
                        },
                    ],
                    matchName: 'ADBE Time Remapping',
                    name: 'Time Remap',
                    value: 1,
                },
                timeRemapEnabled: true,
                trackers: [],
                transform: {},
                type: AEX_COMP_LAYER,
            });
        });

        it(`Can parse matte and matted layers`, async () => {
            assertAreEqual(comp.layers[10], {
                effects: [],
                label: 9,
                markers: [],
                masks: [],
                name: 'Matte Solid',
                source: {
                    type: AEX_SOLID_ITEM,
                    id: 'parented solid:61',
                },
                trackers: [],
                transform: {},
                type: AEX_SOLID_LAYER,
            });

            assertAreEqual(comp.layers[11], {
                effects: [],
                label: 9,
                markers: [],
                masks: [],
                name: 'Matted Text Layer',
                sourceText: {
                    type: AEX_TEXTDOCUMENT_PROPERTY,
                    keys: [],
                    matchName: 'ADBE Text Document',
                    name: 'Source Text',
                    value: {
                        applyFill: true,
                        baselineLocs: [-198.2544, 0, 198.2544, 0],
                        baselineShift: 0,
                        fillColor: [1, 1, 1],
                        font: 'ArialMT',
                        fontFamily: 'Arial',
                        fontSize: 50,
                        fontStyle: 'Regular',
                        horizontalScale: 1,
                        justification: 7415,
                        leading: 60,
                        pointText: true,
                        text: 'Matted Text Layer',
                        tracking: 0,
                        tsume: 0,
                        verticalScale: 1,
                    },
                },
                transform: {},
                trackMatteType: 5013,
                type: AEX_TEXT_LAYER,
            });
        });
    });

    describe('Create', async () => {
        beforeEach(async () => {
            await openProject('testAssets/comp_basic.aep');
        });

        it(`Can create a basic CameraLayer`, async () => {
            const layerData = {
                label: 4,
                markers: [],
                name: 'Camera',
                transform: {
                    position: {
                        keys: [],
                        matchName: 'ADBE Position',
                        name: 'Position',
                        type: AEX_THREED_PROPERTY,
                        value: [640, 360, -1777.7778],
                    },
                },
                type: AEX_CAMERA_LAYER,
            };

            await aex().create(AeObject.ActiveComp, layerData);

            const result = await aex().get(AeObject.ActiveComp);
            const comp = result.object;

            assertAreEqual(comp.layers[0], layerData);
        });

        it(`Can create a basic TextLayer`, async () => {
            const layerData = {
                effects: [],
                label: 1,
                markers: [],
                masks: [],
                name: 'Solo Text Layer',
                sourceText: {
                    type: AEX_TEXTDOCUMENT_PROPERTY,
                    keys: [],
                    matchName: 'ADBE Text Document',
                    name: 'Source Text',
                    value: {
                        applyFill: true,
                        baselineLocs: [-115.332, 0, 115.332, 0],
                        baselineShift: 0,
                        fillColor: [1, 1, 1],
                        font: 'ArialMT',
                        fontFamily: 'Arial',
                        fontSize: 50,
                        fontStyle: 'Regular',
                        horizontalScale: 1,
                        justification: 7415,
                        leading: 60,
                        pointText: true,
                        text: 'Text Layer',
                        tracking: 0,
                        tsume: 0,
                        verticalScale: 1,
                    },
                },
                solo: true,
                transform: {},
                type: AEX_TEXT_LAYER,
            };

            await aex().create(AeObject.ActiveComp, layerData);

            const result = await aex().get(AeObject.ActiveComp);
            const comp = result.object;

            assertAreEqual(comp.layers[0], layerData);
        });

        it(`Can create a basic Null layer`, async () => {
            const layerData = {
                effects: [],
                label: 1,
                markers: [],
                masks: [],
                name: 'Empty',
                source: {
                    type: AEX_SOLID_ITEM,
                    id: 'null 1:40',
                },
                trackers: [],
                transform: {},
                type: AEX_NULL_LAYER,
            };

            await aex().create(AeObject.ActiveComp, layerData);

            const result = await aex().get(AeObject.ActiveComp);
            const comp = result.object;

            layerData.source.id = '';
            comp.layers[0].source.id = '';

            assertAreEqual(comp.layers[0], layerData);
        });

        it(`Can create a basic LightLayer`, async () => {
            const layerData = {
                inPoint: 0.5,
                label: 1,
                lightType: 4414,
                markers: [],
                name: 'Timing Light',
                outPoint: 3.0667,
                transform: {
                    position: {
                        keys: [],
                        matchName: 'ADBE Position',
                        name: 'Position',
                        type: AEX_THREED_PROPERTY,
                        value: [600, 500, 400],
                    },
                },
                type: AEX_LIGHT_LAYER,
            };

            await aex().create(AeObject.ActiveComp, layerData);

            const result = await aex().get(AeObject.ActiveComp);
            const comp = result.object;

            assertAreEqual(comp.layers[0], layerData);
        });

        it(`Can set various Layer flags`, async () => {
            const layerData = {
                adjustmentLayer: true,
                autoOrient: 4213,
                collapseTransformation: true,
                effects: [],
                label: 2,
                markers: [],
                masks: [],
                motionBlur: true,
                name: 'Flags',
                samplingQuality: 4813,
                shy: true,
                source: {
                    type: AEX_SOLID_ITEM,
                    id: 'null 2:67',
                },
                trackers: [],
                transform: {},
                type: AEX_NULL_LAYER,
            };

            await aex().create(AeObject.ActiveComp, layerData);

            const result = await aex().get(AeObject.ActiveComp);
            const comp = result.object;

            layerData.source.id = '';
            comp.layers[0].source.id = '';

            assertAreEqual(comp.layers[0], layerData);
        });

        it(`Can set Layer blend mode`, async () => {
            const layerData = {
                blendingMode: 5216,
                effects: [],
                label: 1,
                markers: [],
                masks: [],
                name: 'Blend Mode',
                source: {
                    type: AEX_SOLID_ITEM,
                    id: 'null 3:81',
                },
                trackers: [],
                transform: {},
                type: AEX_NULL_LAYER,
            };

            await aex().create(AeObject.ActiveComp, layerData);

            const result = await aex().get(AeObject.ActiveComp);
            const comp = result.object;

            layerData.source.id = '';
            comp.layers[0].source.id = '';

            assertAreEqual(comp.layers[0], layerData);
        });
    });

    describe('Update', async () => {
        beforeEach(async () => {
            await openProject('testAssets/comp_basic.aep');
        });

        it(`Can set parented layers`, async () => {
            const compData = {
                layers: [
                    {
                        effects: [],
                        label: 1,
                        markers: [],
                        masks: [],
                        name: 'Parented Solid',
                        parentLayerIndex: 2,
                        source: {
                            type: AEX_SOLID_ITEM,
                            id: 'new solid:108',
                        },
                        trackers: [],
                        transform: {
                            position: {
                                type: AEX_THREED_PROPERTY,
                                keys: [],
                                matchName: 'ADBE Position',
                                name: 'Position',
                                value: [0, 0, 0],
                            },
                        },
                        type: AEX_SOLID_LAYER,
                    },
                    {
                        markers: [],
                        name: '_Parent Layer',
                        transform: {},
                        type: AEX_CAMERA_LAYER,
                    },
                ],
                markers: [],
                type: AEX_COMP_ITEM,
            };

            await aex().update(AeObject.ActiveComp, compData);

            const result = await aex().get(AeObject.ActiveComp);
            const comp = result.object;

            compData.layers[0].source!.id = '';
            comp.layers[0].source.id = '';

            assertAreEqual(comp.layers[0], compData.layers[0]);
        });

        it(`Can set 3d layers`, async () => {
            const layerData = {
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
            };

            await aex().create(AeObject.ActiveComp, layerData);

            const result = await aex().get(AeObject.ActiveComp);
            const comp = result.object;

            assertAreEqual(comp.layers[0], layerData);
        });

        it(`Can set time remap enabled (but not modified)`, async () => {
            await openCleanProject();

            const projectData = {
                items: [],
                comps: [
                    {
                        aexid: 'precomp 1:1',
                        duration: 4,
                        layers: [],
                        name: 'Precomp 1',
                        type: AEX_COMP_ITEM,
                    },
                    {
                        duration: 4,
                        layers: [
                            {
                                effects: [],
                                label: 15,
                                markers: [],
                                masks: [],
                                name: 'TR Enabled (and not modified)',
                                source: {
                                    type: AEX_COMP_ITEM,
                                    id: 'precomp 1:1',
                                },
                                timeRemap: {
                                    type: AEX_ONED_PROPERTY,
                                    keys: [
                                        {
                                            temporalEase: {
                                                inEase: [
                                                    {
                                                        influence: 16.66667,
                                                        speed: 0,
                                                    },
                                                ],
                                                outEase: [
                                                    {
                                                        influence: 16.66667,
                                                        speed: 1,
                                                    },
                                                ],
                                            },
                                            time: 0,
                                            value: 0,
                                        },
                                        {
                                            temporalEase: {
                                                inEase: [
                                                    {
                                                        influence: 16.66667,
                                                        speed: 1,
                                                    },
                                                ],
                                                outEase: [
                                                    {
                                                        influence: 16.66667,
                                                        speed: 0,
                                                    },
                                                ],
                                            },
                                            time: 4,
                                            value: 1,
                                        },
                                    ],
                                    matchName: 'ADBE Time Remapping',
                                    name: 'Time Remap',
                                    value: 0,
                                },
                                timeRemapEnabled: true,
                                trackers: [],
                                transform: {},
                                type: AEX_COMP_LAYER,
                            },
                        ],
                        type: AEX_COMP_ITEM,
                    },
                ],
                type: AEX_PROJECT,
            };

            await aex().update(AeObject.Project, projectData);

            const result = await aex().get(AeObject.Project);
            const project = result.object;

            assertAreEqual(project.comps[0].layers[0], projectData.comps[1].layers[0]);
        });

        it(`Can set time remap enabled (and modified)`, async () => {
            await openCleanProject();

            const projectData = {
                items: [],
                comps: [
                    {
                        aexid: 'precomp 1:1',
                        duration: 4,
                        layers: [],
                        name: 'Precomp 1',
                        type: AEX_COMP_ITEM,
                    },
                    {
                        duration: 4,
                        layers: [
                            {
                                effects: [],
                                label: 15,
                                markers: [],
                                masks: [],
                                name: 'TR Enabled (and modified)',
                                source: {
                                    type: AEX_COMP_ITEM,
                                    id: 'precomp 1:1',
                                },
                                timeRemap: {
                                    type: AEX_ONED_PROPERTY,
                                    keys: [
                                        {
                                            temporalEase: {
                                                inEase: [
                                                    {
                                                        influence: 16.66667,
                                                        speed: 0,
                                                    },
                                                ],
                                                outEase: [
                                                    {
                                                        influence: 16.66667,
                                                        speed: 2,
                                                    },
                                                ],
                                            },
                                            time: 0,
                                            value: 0,
                                        },
                                        {
                                            temporalEase: {
                                                inEase: [
                                                    {
                                                        influence: 16.66667,
                                                        speed: 2,
                                                    },
                                                ],
                                                outEase: [
                                                    {
                                                        influence: 16.66667,
                                                        speed: 0,
                                                    },
                                                ],
                                            },
                                            time: 2,
                                            value: 1,
                                        },
                                    ],
                                    matchName: 'ADBE Time Remapping',
                                    name: 'Time Remap',
                                    value: 0,
                                },
                                timeRemapEnabled: true,
                                trackers: [],
                                transform: {},
                                type: AEX_COMP_LAYER,
                            },
                        ],
                        type: AEX_COMP_ITEM,
                    },
                ],
                type: AEX_PROJECT,
            };

            await aex().update(AeObject.Project, projectData);

            const result = await aex().get(AeObject.Project);
            const project = result.object;

            assertAreEqual(project.comps[0].layers[0], projectData.comps[1].layers[0]);
        });

        it(`Can set matte and matted layers`, async () => {
            const compData = {
                layers: [
                    {
                        effects: [],
                        label: 9,
                        markers: [],
                        masks: [],
                        name: 'Matte Solid',
                        source: {
                            type: AEX_SOLID_ITEM,
                            id: 'new solid:52',
                        },
                        trackers: [],
                        transform: {},
                        type: AEX_SOLID_LAYER,
                    },
                    {
                        effects: [],
                        label: 9,
                        markers: [],
                        masks: [],
                        name: 'Matted Text Layer',
                        sourceText: {
                            type: AEX_TEXTDOCUMENT_PROPERTY,
                            keys: [],
                            matchName: 'ADBE Text Document',
                            name: 'Source Text',
                            value: {
                                applyFill: true,
                                baselineLocs: [-198.2544, 0, 198.2544, 0],
                                baselineShift: 0,
                                fillColor: [1, 1, 1],
                                font: 'ArialMT',
                                fontFamily: 'Arial',
                                fontSize: 50,
                                fontStyle: 'Regular',
                                horizontalScale: 1,
                                justification: 7415,
                                leading: 60,
                                pointText: true,
                                text: 'Matted Text Layer',
                                tracking: 0,
                                tsume: 0,
                                verticalScale: 1,
                            },
                        },
                        transform: {},
                        trackMatteType: 5013,
                        type: AEX_TEXT_LAYER,
                    },
                ],
                markers: [],
                type: AEX_COMP_ITEM,
            };

            await aex().create(AeObject.Project, compData);

            const result = await aex().get(AeObject.ActiveComp);
            const comp = result.object;

            compData.layers[0].source!.id = '';
            comp.layers[0].source.id = '';

            assertAreEqual(comp.layers[0], compData.layers[0]);
            assertAreEqual(comp.layers[1], compData.layers[1]);
        });
    });
});
