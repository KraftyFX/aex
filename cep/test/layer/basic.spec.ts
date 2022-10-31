import { AeObject, aex, getProject } from '../aex';
import {
    AEX_CAMERA_LAYER,
    AEX_COMP_ITEM,
    AEX_COMP_LAYER,
    AEX_KEY,
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
    TEST_TIMEOUT_TIME,
} from '../constants';
import { cleanupAex, evalAexIntoEstk, openCleanProject, openProject } from '../csinterface';
import { assertAreEqual } from '../utils';

describe('Basic Layer Attributes', function () {
    this.slow(1000);
    this.timeout(TEST_TIMEOUT_TIME);

    before(async () => {
        await evalAexIntoEstk();
    });

    after(async () => {
        await cleanupAex();
    });

    it(`Can update AVLayer attributes`, async () => {
        const layerData = {
            adjustmentLayer: true,
            guideLayer: true,
            motionBlur: true,
            name: 'Updated Text Layer',
            type: AEX_TEXT_LAYER,
        };

        await openProject('assets/layer_basic.aep');
        await aex.update(AeObject.Layer(2), layerData);

        const result = await aex.get(AeObject.Layer(2));
        const layer = result.object;

        assertAreEqual(layer.adjustmentLayer, layerData.adjustmentLayer);
        assertAreEqual(layer.guideLayer, layerData.guideLayer);
        assertAreEqual(layer.motionBlur, layerData.motionBlur);
        assertAreEqual(layer.name, layerData.name);
    });

    describe('CameraLayer', async () => {
        it(`Get`, async () => {
            const { object: comp } = await getProject('assets/layer_basic.aep', AeObject.ActiveComp);
            assertAreEqual(comp.layers[0], {
                label: 4,
                name: 'Camera',
                transform: {
                    position: {
                        matchName: 'ADBE Position',
                        type: AEX_THREED_PROPERTY,
                        value: [640, 360, -1777.7778],
                    },
                },
                type: AEX_CAMERA_LAYER,
            });
        });

        it(`Create`, async () => {
            const layerData = {
                label: 4,
                name: 'Camera',
                transform: {
                    position: {
                        matchName: 'ADBE Position',
                        type: AEX_THREED_PROPERTY,
                        value: [640, 360, -1777.7778],
                    },
                },
                type: AEX_CAMERA_LAYER,
            };

            await openProject('assets/comp_basic.aep');
            await aex.create(AeObject.ActiveComp, layerData);

            const result = await aex.get(AeObject.Layer(1));
            const layer = result.object;

            assertAreEqual(layer, layerData);
        });
    });

    describe('Text Layer', async () => {
        it(`Get`, async () => {
            const { object: comp } = await getProject('assets/layer_basic.aep', AeObject.ActiveComp);
            assertAreEqual(comp.layers[1], {
                label: 1,
                name: 'Solo Text Layer',
                sourceText: {
                    type: AEX_TEXTDOCUMENT_PROPERTY,
                    matchName: 'ADBE Text Document',
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
                type: AEX_TEXT_LAYER,
            });
        });

        it(`Create`, async () => {
            const layerData = {
                label: 1,
                name: 'Solo Text Layer',
                sourceText: {
                    type: AEX_TEXTDOCUMENT_PROPERTY,
                    matchName: 'ADBE Text Document',
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
                type: AEX_TEXT_LAYER,
            };

            await openProject('assets/comp_basic.aep');
            await aex.create(AeObject.ActiveComp, layerData);

            const result = await aex.get(AeObject.Layer(1));
            const layer = result.object;

            assertAreEqual(layer, layerData);
        });
    });

    describe('Null Layer', async () => {
        it(`Get`, async () => {
            const { object: comp } = await getProject('assets/layer_basic.aep', AeObject.ActiveComp);
            assertAreEqual(comp.layers[2], {
                label: 1,
                name: 'Empty',
                type: AEX_NULL_LAYER,
            });
        });

        it(`Create`, async () => {
            const layerData = {
                label: 1,
                name: 'Empty',
                type: AEX_NULL_LAYER,
            };

            await openProject('assets/comp_basic.aep');
            await aex.create(AeObject.ActiveComp, layerData);

            const result = await aex.get(AeObject.Layer(1));
            const layer = result.object;

            assertAreEqual(layer, layerData);
        });
    });

    describe('LightLayer', async () => {
        it(`Get`, async () => {
            const { object: comp } = await getProject('assets/layer_basic.aep', AeObject.ActiveComp);
            assertAreEqual(comp.layers[3], {
                inPoint: 0.5,
                label: 1,
                lightType: 4414,
                name: 'Timing Light',
                outPoint: 3.0667,
                transform: {
                    position: {
                        matchName: 'ADBE Position',
                        type: AEX_THREED_PROPERTY,
                        value: [600, 500, 400],
                    },
                },
                type: AEX_LIGHT_LAYER,
            });
        });

        it(`Create`, async () => {
            const layerData = {
                inPoint: 0.5,
                label: 1,
                lightType: 4414,
                name: 'Timing Light',
                outPoint: 3.0667,
                transform: {
                    position: {
                        matchName: 'ADBE Position',
                        type: AEX_THREED_PROPERTY,
                        value: [600, 500, 400],
                    },
                },
                type: AEX_LIGHT_LAYER,
            };

            await openProject('assets/comp_basic.aep');
            await aex.create(AeObject.ActiveComp, layerData);

            const result = await aex.get(AeObject.Layer(1));
            const layer = result.object;

            assertAreEqual(layer, layerData);
        });
    });

    describe('Layer Flags', async () => {
        it(`Get`, async () => {
            const { object: comp } = await getProject('assets/layer_basic.aep', AeObject.ActiveComp);
            assertAreEqual(comp.layers[4], {
                adjustmentLayer: true,
                autoOrient: 4213,
                collapseTransformation: true,
                enabled: false,
                label: 2,
                motionBlur: true,
                name: 'Flags',
                samplingQuality: 4813,
                shy: true,
                type: AEX_NULL_LAYER,
            });
        });

        it(`Create`, async () => {
            const layerData = {
                adjustmentLayer: true,
                autoOrient: 4213,
                collapseTransformation: true,
                label: 2,
                motionBlur: true,
                name: 'Flags',
                samplingQuality: 4813,
                shy: true,
                type: AEX_NULL_LAYER,
            };

            await openProject('assets/comp_basic.aep');
            await aex.create(AeObject.ActiveComp, layerData);

            const result = await aex.get(AeObject.Layer(1));
            const layer = result.object;

            assertAreEqual(layer, layerData);
        });
    });

    describe('Parented Layers', async () => {
        it(`Get`, async () => {
            const { object: comp } = await getProject('assets/layer_basic.aep', AeObject.ActiveComp);
            assertAreEqual(comp.layers[6], {
                label: 1,
                name: 'Parented Solid',
                parentLayerIndex: 5,
                source: {
                    type: AEX_SOLID_ITEM,
                    aexid: 'parented solid:61',
                },
                transform: {
                    position: {
                        type: AEX_THREED_PROPERTY,
                        matchName: 'ADBE Position',
                        value: [0, 0, 0],
                    },
                },
                type: AEX_SOLID_LAYER,
            });
        });

        it(`Update`, async () => {
            const compData = {
                layers: [
                    {
                        label: 1,
                        name: 'Parented Solid',
                        parentLayerIndex: 2,
                        transform: {
                            position: {
                                type: AEX_THREED_PROPERTY,
                                matchName: 'ADBE Position',
                                value: [0, 0, 0],
                            },
                        },
                        type: AEX_SOLID_LAYER,
                    },
                    {
                        name: '_Parent Layer',
                        type: AEX_CAMERA_LAYER,
                    },
                ],
                type: AEX_COMP_ITEM,
            };

            await openProject('assets/comp_basic.aep');
            await aex.update(AeObject.ActiveComp, compData);

            const result = await aex.get(AeObject.Layer(1));
            const layer = result.object;

            (compData.layers[0] as any).source = layer.source;

            assertAreEqual(layer, compData.layers[0]);
        });
    });

    describe('3D Layers', async () => {
        it(`Get`, async () => {
            const { object: comp } = await getProject('assets/layer_basic.aep', AeObject.ActiveComp);
            assertAreEqual(comp.layers[7], {
                geometryOption: {
                    matchName: 'ADBE Extrsn Options Group',
                    properties: [
                        {
                            type: AEX_ONED_PROPERTY,
                            matchName: 'ADBE Bevel Styles',
                            value: 2,
                        },
                        {
                            type: AEX_ONED_PROPERTY,
                            matchName: 'ADBE Bevel Depth',
                            value: 1,
                        },
                        {
                            type: AEX_ONED_PROPERTY,
                            matchName: 'ADBE Hole Bevel Depth',
                            value: 2,
                        },
                        {
                            type: AEX_ONED_PROPERTY,
                            matchName: 'ADBE Extrsn Depth',
                            value: 3,
                        },
                    ],
                },
                label: 8,
                materialOption: {
                    matchName: 'ADBE Material Options Group',
                    properties: [
                        {
                            type: AEX_ONED_PROPERTY,
                            matchName: 'ADBE Casts Shadows',
                            value: 1,
                        },
                        {
                            type: AEX_ONED_PROPERTY,
                            matchName: 'ADBE Accepts Shadows',
                            value: 2,
                        },
                        {
                            type: AEX_ONED_PROPERTY,
                            matchName: 'ADBE Accepts Lights',
                            value: 0,
                        },
                        {
                            type: AEX_ONED_PROPERTY,
                            matchName: 'ADBE Appears in Reflections',
                            value: 2,
                        },
                        {
                            type: AEX_ONED_PROPERTY,
                            matchName: 'ADBE Ambient Coefficient',
                            value: 1,
                        },
                        {
                            type: AEX_ONED_PROPERTY,
                            matchName: 'ADBE Diffuse Coefficient',
                            value: 2,
                        },
                        {
                            type: AEX_ONED_PROPERTY,
                            matchName: 'ADBE Specular Coefficient',
                            value: 3,
                        },
                        {
                            type: AEX_ONED_PROPERTY,
                            matchName: 'ADBE Shininess Coefficient',
                            value: 4,
                        },
                        {
                            type: AEX_ONED_PROPERTY,
                            matchName: 'ADBE Metal Coefficient',
                            value: 5,
                        },
                        {
                            type: AEX_ONED_PROPERTY,
                            matchName: 'ADBE Reflection Coefficient',
                            value: 6,
                        },
                        {
                            type: AEX_ONED_PROPERTY,
                            matchName: 'ADBE Glossiness Coefficient',
                            value: 7,
                        },
                        {
                            type: AEX_ONED_PROPERTY,
                            matchName: 'ADBE Fresnel Coefficient',
                            value: 8,
                        },
                    ],
                },
                name: '3d',
                threeDLayer: true,
                type: AEX_SHAPE_LAYER,
            });
        });

        it(`Create`, async () => {
            const layerData = {
                geometryOption: {
                    matchName: 'ADBE Extrsn Options Group',
                    properties: [
                        {
                            type: AEX_ONED_PROPERTY,
                            matchName: 'ADBE Bevel Styles',
                            value: 2,
                        },
                        {
                            type: AEX_ONED_PROPERTY,
                            matchName: 'ADBE Bevel Depth',
                            value: 1,
                        },
                        {
                            type: AEX_ONED_PROPERTY,
                            matchName: 'ADBE Hole Bevel Depth',
                            value: 2,
                        },
                        {
                            type: AEX_ONED_PROPERTY,
                            matchName: 'ADBE Extrsn Depth',
                            value: 3,
                        },
                    ],
                },
                label: 8,
                materialOption: {
                    matchName: 'ADBE Material Options Group',
                    properties: [
                        {
                            type: AEX_ONED_PROPERTY,
                            matchName: 'ADBE Casts Shadows',
                            value: 1,
                        },
                        {
                            type: AEX_ONED_PROPERTY,
                            matchName: 'ADBE Accepts Shadows',
                            value: 2,
                        },
                        {
                            type: AEX_ONED_PROPERTY,
                            matchName: 'ADBE Accepts Lights',
                            value: 0,
                        },
                        {
                            type: AEX_ONED_PROPERTY,
                            matchName: 'ADBE Appears in Reflections',
                            value: 2,
                        },
                        {
                            type: AEX_ONED_PROPERTY,
                            matchName: 'ADBE Ambient Coefficient',
                            value: 1,
                        },
                        {
                            type: AEX_ONED_PROPERTY,
                            matchName: 'ADBE Diffuse Coefficient',
                            value: 2,
                        },
                        {
                            type: AEX_ONED_PROPERTY,
                            matchName: 'ADBE Specular Coefficient',
                            value: 3,
                        },
                        {
                            type: AEX_ONED_PROPERTY,
                            matchName: 'ADBE Shininess Coefficient',
                            value: 4,
                        },
                        {
                            type: AEX_ONED_PROPERTY,
                            matchName: 'ADBE Metal Coefficient',
                            value: 5,
                        },
                        {
                            type: AEX_ONED_PROPERTY,
                            matchName: 'ADBE Reflection Coefficient',
                            value: 6,
                        },
                        {
                            type: AEX_ONED_PROPERTY,
                            matchName: 'ADBE Glossiness Coefficient',
                            value: 7,
                        },
                        {
                            type: AEX_ONED_PROPERTY,
                            matchName: 'ADBE Fresnel Coefficient',
                            value: 8,
                        },
                    ],
                },
                name: '3d',
                threeDLayer: true,
                type: AEX_SHAPE_LAYER,
            };

            await openProject('assets/comp_basic.aep');
            await aex.create(AeObject.ActiveComp, layerData);

            const result = await aex.get(AeObject.Layer(1));
            const layer = result.object;

            assertAreEqual(layer, layerData);
        });
    });

    describe('Time Remap Enabled (not modified)', async () => {
        it(`Get`, async () => {
            const { object: comp } = await getProject('assets/layer_basic.aep', AeObject.ActiveComp);
            assertAreEqual(comp.layers[8], {
                enabled: false,
                label: 15,
                name: 'TR Enabled',
                source: {
                    type: AEX_COMP_ITEM,
                    aexid: 'precomp:65',
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
                            type: AEX_KEY,
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
                            type: AEX_KEY,
                            value: 4,
                        },
                    ],
                    matchName: 'ADBE Time Remapping',
                    value: 2,
                },
                timeRemapEnabled: true,
                type: AEX_COMP_LAYER,
            });
        });

        it(`Can update Time Remap attributes`, async () => {
            const layerData = {
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
                            type: AEX_KEY,
                            value: 1,
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
                            time: 2,
                            type: AEX_KEY,
                            value: 3,
                        },
                    ],
                    matchName: 'ADBE Time Remapping',
                    value: 3,
                },
                timeRemapEnabled: true,
                type: AEX_COMP_LAYER,
            };

            await openProject('assets/layer_basic.aep');
            await aex.update(AeObject.Layer(9), layerData);

            const result = await aex.get(AeObject.Layer(9));
            const layer = result.object;

            assertAreEqual(layer.timeRemap, layerData.timeRemap);
        });

        it(`Update`, async () => {
            const projectData = {
                comps: [
                    {
                        aexid: 'precomp 1:1',
                        duration: 4,
                        name: 'Precomp 1',
                        type: AEX_COMP_ITEM,
                    },
                    {
                        duration: 4,
                        layers: [
                            {
                                label: 15,
                                name: 'TR Enabled (and not modified)',
                                source: {
                                    type: AEX_COMP_ITEM,
                                    aexid: 'precomp 1:1',
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
                                            type: AEX_KEY,
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
                                            type: AEX_KEY,
                                            value: 4,
                                        },
                                    ],
                                    matchName: 'ADBE Time Remapping',
                                    value: 0,
                                },
                                timeRemapEnabled: true,
                                type: AEX_COMP_LAYER,
                            },
                        ],
                        type: AEX_COMP_ITEM,
                    },
                ],
                type: AEX_PROJECT,
            };

            await openCleanProject();
            await aex.update(AeObject.Project, projectData);

            const result = await aex.get(AeObject.Layer(1));
            const layer = result.object;

            assertAreEqual(layer, projectData.comps[1].layers![0]);
        });
    });

    describe('Time Remap Enabled (modified)', async () => {
        it(`Get`, async () => {
            const { object: comp } = await getProject('assets/layer_basic.aep', AeObject.ActiveComp);
            assertAreEqual(comp.layers[9], {
                enabled: false,
                label: 15,
                name: 'TR Remapped',
                source: {
                    type: AEX_COMP_ITEM,
                    aexid: 'precomp:65',
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
                            type: AEX_KEY,
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
                            type: AEX_KEY,
                            value: 4,
                        },
                    ],
                    matchName: 'ADBE Time Remapping',
                    value: 4,
                },
                timeRemapEnabled: true,
                type: AEX_COMP_LAYER,
            });
        });

        it(`Update`, async () => {
            await openCleanProject();

            const projectData = {
                comps: [
                    {
                        aexid: 'precomp 1:1',
                        duration: 4,
                        name: 'Precomp 1',
                        type: AEX_COMP_ITEM,
                    },
                    {
                        duration: 4,
                        layers: [
                            {
                                label: 15,
                                name: 'TR Enabled (and modified)',
                                source: {
                                    type: AEX_COMP_ITEM,
                                    aexid: 'precomp 1:1',
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
                                            type: AEX_KEY,
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
                                            type: AEX_KEY,
                                            value: 4,
                                        },
                                    ],
                                    matchName: 'ADBE Time Remapping',
                                    value: 0,
                                },
                                timeRemapEnabled: true,
                                type: AEX_COMP_LAYER,
                            },
                        ],
                        type: AEX_COMP_ITEM,
                    },
                ],
                type: AEX_PROJECT,
            };

            await aex.update(AeObject.Project, projectData);

            const result = await aex.get(AeObject.Project);
            const project = result.object;

            assertAreEqual(project.comps[0].layers[0], projectData.comps[1].layers![0]);
        });
    });

    describe('Matte and Matted Layers', async () => {
        it(`Get`, async () => {
            const { object: comp } = await getProject('assets/layer_basic.aep', AeObject.ActiveComp);
            assertAreEqual(comp.layers[10], {
                enabled: false,
                label: 9,
                name: 'Matte Solid',
                source: {
                    type: AEX_SOLID_ITEM,
                    aexid: 'parented solid:61',
                },
                type: AEX_SOLID_LAYER,
            });

            assertAreEqual(comp.layers[11], {
                label: 9,
                name: 'Matted Text Layer',
                sourceText: {
                    type: AEX_TEXTDOCUMENT_PROPERTY,
                    matchName: 'ADBE Text Document',
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
                trackMatteType: 5013,
                type: AEX_TEXT_LAYER,
            });
        });

        it(`Create`, async () => {
            const compData = {
                layers: [
                    {
                        label: 9,
                        name: 'Matte Solid',
                        type: AEX_SOLID_LAYER,
                    },
                    {
                        label: 9,
                        name: 'Matted Text Layer',
                        sourceText: {
                            type: AEX_TEXTDOCUMENT_PROPERTY,
                            matchName: 'ADBE Text Document',
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
                        trackMatteType: 5013,
                        type: AEX_TEXT_LAYER,
                    },
                ],
                type: AEX_COMP_ITEM,
            };

            await openProject('assets/comp_basic.aep');
            await aex.create(AeObject.Project, compData);

            const result = await aex.get(AeObject.ActiveComp);
            const comp = result.object;

            (compData.layers[0] as any).source = comp.layers[0].source;

            assertAreEqual(comp.layers[0], compData.layers[0]);
            assertAreEqual(comp.layers[1], compData.layers[1]);
        });
    });

    describe('Layer Blend Mode', async () => {
        it(`Get`, async () => {
            const { object: comp } = await getProject('assets/layer_basic.aep', AeObject.ActiveComp);
            assertAreEqual(comp.layers[5], {
                blendingMode: 5216,
                label: 1,
                name: 'Blend Mode',
                type: AEX_NULL_LAYER,
            });
        });

        it(`Create`, async () => {
            const layerData = {
                blendingMode: 5216,
                label: 1,
                name: 'Blend Mode',
                type: AEX_NULL_LAYER,
            };

            await openProject('assets/comp_basic.aep');
            await aex.create(AeObject.ActiveComp, layerData);

            const result = await aex.get(AeObject.Layer(1));
            const layer = result.object;

            assertAreEqual(layer, layerData);
        });
    });
});
