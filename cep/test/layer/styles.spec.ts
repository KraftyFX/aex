import { expect } from 'chai';
import { AeObject, aex } from '../aex';
import { AEX_LAYERSTYLE_PROPERTYGROUP, AEX_NULL_LAYER, AEX_ONED_PROPERTY, TEST_TIMEOUT_TIME } from '../constants';
import { cleanupAex, evalAexIntoEstk, openCleanProject, openProject } from '../csinterface';
import { assertAreEqual } from '../utils';

describe('Layer Styles', function () {
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
            await openProject('testAssets/layer_styles.aep');
            const result = await aex().get(AeObject.ActiveComp);
            comp = result.object;
            console.log('layer_styles', comp);
        });

        it('Can parse Drop Shadow style', async () => {
            assertAreEqual(comp.layers[0].layerStyles.properties, [
                {
                    name: 'Blending Options',
                    matchName: 'ADBE Blend Options Group',
                    enabled: true,
                    type: AEX_LAYERSTYLE_PROPERTYGROUP,
                },
                {
                    name: 'Drop Shadow',
                    matchName: 'dropShadow/enabled',
                    enabled: true,
                    type: AEX_LAYERSTYLE_PROPERTYGROUP,
                },
            ]);
        });

        it('Can parse Inner Shadow style', async () => {
            assertAreEqual(comp.layers[1].layerStyles.properties[1], {
                name: 'Inner Shadow',
                matchName: 'innerShadow/enabled',
                enabled: true,
                type: AEX_LAYERSTYLE_PROPERTYGROUP,
            });
        });

        it('Can parse Outer Glow style', async () => {
            assertAreEqual(comp.layers[2].layerStyles.properties[1], {
                name: 'Outer Glow',
                matchName: 'outerGlow/enabled',
                enabled: true,
                type: AEX_LAYERSTYLE_PROPERTYGROUP,
            });
        });

        it('Can parse Outer Glow style', async () => {
            assertAreEqual(comp.layers[3].layerStyles.properties[1], {
                name: 'Inner Glow',
                matchName: 'innerGlow/enabled',
                enabled: true,
                type: AEX_LAYERSTYLE_PROPERTYGROUP,
            });
        });

        it('Can parse Bevel Emboss style', async () => {
            assertAreEqual(comp.layers[4].layerStyles.properties[1], {
                name: 'Bevel and Emboss',
                matchName: 'bevelEmboss/enabled',
                enabled: true,
                type: AEX_LAYERSTYLE_PROPERTYGROUP,
            });
        });

        it('Can parse Satin style', async () => {
            assertAreEqual(comp.layers[5].layerStyles.properties[1], {
                name: 'Satin',
                matchName: 'chromeFX/enabled',
                enabled: true,
                type: AEX_LAYERSTYLE_PROPERTYGROUP,
            });
        });

        it('Can parse Color Overlay style', async () => {
            assertAreEqual(comp.layers[6].layerStyles.properties[1], {
                name: 'Color Overlay',
                matchName: 'solidFill/enabled',
                enabled: true,
                type: AEX_LAYERSTYLE_PROPERTYGROUP,
            });
        });

        it('Can parse Gradient Overlay style', async () => {
            assertAreEqual(comp.layers[7].layerStyles.properties[1], {
                name: 'Gradient Overlay',
                matchName: 'gradientFill/enabled',
                enabled: true,
                type: AEX_LAYERSTYLE_PROPERTYGROUP,
            });
        });

        it('Can parse Stroke style', async () => {
            assertAreEqual(comp.layers[8].layerStyles.properties[1], {
                name: 'Stroke',
                matchName: 'frameFX/enabled',
                enabled: true,
                type: AEX_LAYERSTYLE_PROPERTYGROUP,
            });
        });

        it('Can parse modified layer style', async () => {
            assertAreEqual(comp.layers[9].layerStyles.properties, [
                {
                    name: 'Blending Options',
                    matchName: 'ADBE Blend Options Group',
                    enabled: true,
                    properties: [
                        {
                            type: AEX_ONED_PROPERTY,
                            name: 'Global Light Angle',
                            matchName: 'ADBE Global Angle2',
                            value: 72,
                            keys: [],
                        },
                        {
                            type: AEX_ONED_PROPERTY,
                            name: 'Global Light Altitude',
                            matchName: 'ADBE Global Altitude2',
                            value: 63,
                            keys: [],
                        },
                        {
                            matchName: 'ADBE Adv Blend Group',
                            properties: [
                                {
                                    type: AEX_ONED_PROPERTY,
                                    name: 'Fill Opacity',
                                    matchName: 'ADBE Layer Fill Opacity2',
                                    value: 80,
                                    keys: [],
                                },
                                {
                                    type: AEX_ONED_PROPERTY,
                                    name: 'Red',
                                    matchName: 'ADBE R Channel Blend',
                                    value: 0,
                                    keys: [],
                                },
                                {
                                    type: AEX_ONED_PROPERTY,
                                    name: 'Green',
                                    matchName: 'ADBE G Channel Blend',
                                    value: 0,
                                    keys: [],
                                },
                                {
                                    type: AEX_ONED_PROPERTY,
                                    name: 'Blue',
                                    matchName: 'ADBE B Channel Blend',
                                    value: 0,
                                    keys: [],
                                },
                                {
                                    type: AEX_ONED_PROPERTY,
                                    name: 'Blend Interior Styles as Group',
                                    matchName: 'ADBE Blend Interior',
                                    value: 1,
                                    keys: [],
                                },
                            ],
                        },
                    ],
                    type: AEX_LAYERSTYLE_PROPERTYGROUP,
                },
                {
                    name: 'Drop Shadow',
                    matchName: 'dropShadow/enabled',
                    enabled: true,
                    properties: [
                        {
                            type: AEX_ONED_PROPERTY,
                            name: 'Blend Mode',
                            matchName: 'dropShadow/mode2',
                            value: 16,
                            keys: [],
                        },
                        {
                            type: AEX_ONED_PROPERTY,
                            name: 'Opacity',
                            matchName: 'dropShadow/opacity',
                            value: 45,
                            keys: [],
                        },
                        {
                            type: AEX_ONED_PROPERTY,
                            name: 'Use Global Light',
                            matchName: 'dropShadow/useGlobalAngle',
                            value: 1,
                            keys: [],
                        },
                        {
                            type: AEX_ONED_PROPERTY,
                            name: 'Angle',
                            matchName: 'dropShadow/localLightingAngle',
                            value: 153,
                            keys: [],
                        },
                        {
                            type: AEX_ONED_PROPERTY,
                            name: 'Distance',
                            matchName: 'dropShadow/distance',
                            value: 23,
                            keys: [],
                        },
                        {
                            type: AEX_ONED_PROPERTY,
                            name: 'Spread',
                            matchName: 'dropShadow/chokeMatte',
                            value: 37,
                            keys: [],
                        },
                        {
                            type: AEX_ONED_PROPERTY,
                            name: 'Size',
                            matchName: 'dropShadow/blur',
                            value: 26,
                            keys: [],
                        },
                        {
                            type: AEX_ONED_PROPERTY,
                            name: 'Noise',
                            matchName: 'dropShadow/noise',
                            value: 23,
                            keys: [],
                        },
                        {
                            type: AEX_ONED_PROPERTY,
                            name: 'Layer Knocks Out Drop Shadow',
                            matchName: 'dropShadow/layerConceals',
                            value: 0,
                            keys: [],
                        },
                    ],
                    type: AEX_LAYERSTYLE_PROPERTYGROUP,
                },
            ]);
        });

        it('Can parse specific disabled style', async () => {
            assertAreEqual(comp.layers[10].layerStyles.properties[1], {
                name: 'Drop Shadow',
                matchName: 'dropShadow/enabled',
                enabled: false,
                type: AEX_LAYERSTYLE_PROPERTYGROUP,
            });
        });

        it('Can parse entire styles property disabled', async () => {
            assertAreEqual(comp.layers[11].layerStyles, {
                matchName: 'ADBE Layer Styles',
                name: 'Layer Styles',
                enabled: false,
                properties: [
                    {
                        name: 'Blending Options',
                        matchName: 'ADBE Blend Options Group',
                        enabled: true,
                        type: AEX_LAYERSTYLE_PROPERTYGROUP,
                    },
                    {
                        name: 'Drop Shadow',
                        matchName: 'dropShadow/enabled',
                        enabled: true,
                        type: AEX_LAYERSTYLE_PROPERTYGROUP,
                    },
                ],
            });
        });

        it('Can parse no styles', async () => {
            expect(comp.layers[12].layerStyles).to.be.undefined;
        });
    });

    describe('Create Layer With Styles', async () => {
        before(async () => {
            await openCleanProject();
        });

        it('Can create Drop Shadow style', async () => {
            const layerData = {
                layerStyles: {
                    properties: [
                        {
                            name: 'Blending Options',
                            matchName: 'ADBE Blend Options Group',
                            enabled: true,
                            type: AEX_LAYERSTYLE_PROPERTYGROUP,
                        },
                        {
                            name: 'Drop Shadow',
                            matchName: 'dropShadow/enabled',
                            enabled: true,
                            type: AEX_LAYERSTYLE_PROPERTYGROUP,
                        },
                    ],
                },
                type: AEX_NULL_LAYER,
            };

            await aex().createTestComp();
            await aex().create(AeObject.ActiveComp, layerData);

            const result = await aex().get(AeObject.Layer(1));
            const layer = result.object;

            assertAreEqual(layer.layerStyles.properties, layerData.layerStyles.properties);
        });

        it('Can create Inner Shadow style', async () => {
            const layerData = {
                layerStyles: {
                    properties: [
                        {
                            name: 'Inner Shadow',
                            matchName: 'innerShadow/enabled',
                            enabled: true,
                            type: AEX_LAYERSTYLE_PROPERTYGROUP,
                        },
                    ],
                },
                type: AEX_NULL_LAYER,
            };

            await aex().createTestComp();
            await aex().create(AeObject.ActiveComp, layerData);

            const result = await aex().get(AeObject.ActiveComp);
            const comp = result.object;

            assertAreEqual(comp.layers[0].layerStyles.properties[1], layerData.layerStyles.properties[0]);
        });

        it('Can create Outer Glow style', async () => {
            const layerData = {
                layerStyles: {
                    properties: [
                        {
                            name: 'Outer Glow',
                            matchName: 'outerGlow/enabled',
                            enabled: true,
                            type: AEX_LAYERSTYLE_PROPERTYGROUP,
                        },
                    ],
                },
                type: AEX_NULL_LAYER,
            };

            await aex().createTestComp();
            await aex().create(AeObject.ActiveComp, layerData);

            const result = await aex().get(AeObject.Layer(1));
            const layer = result.object;

            assertAreEqual(layer.layerStyles.properties[1], layerData.layerStyles.properties[0]);
        });

        it('Can create Outer Glow style', async () => {
            const layerData = {
                layerStyles: {
                    properties: [
                        {
                            name: 'Inner Glow',
                            matchName: 'innerGlow/enabled',
                            enabled: true,
                            type: AEX_LAYERSTYLE_PROPERTYGROUP,
                        },
                    ],
                },
                type: AEX_NULL_LAYER,
            };

            await aex().createTestComp();
            await aex().create(AeObject.ActiveComp, layerData);

            const result = await aex().get(AeObject.Layer(1));
            const layer = result.object;

            assertAreEqual(layer.layerStyles.properties[1], layerData.layerStyles.properties[0]);
        });

        it('Can create Bevel Emboss style', async () => {
            const layerData = {
                layerStyles: {
                    properties: [
                        {
                            name: 'Bevel and Emboss',
                            matchName: 'bevelEmboss/enabled',
                            enabled: true,
                            type: AEX_LAYERSTYLE_PROPERTYGROUP,
                        },
                    ],
                },
                type: AEX_NULL_LAYER,
            };

            await aex().createTestComp();
            await aex().create(AeObject.ActiveComp, layerData);

            const result = await aex().get(AeObject.Layer(1));
            const layer = result.object;

            assertAreEqual(layer.layerStyles.properties[1], layerData.layerStyles.properties[0]);
        });

        it('Can create Satin style', async () => {
            const layerData = {
                layerStyles: {
                    properties: [
                        {
                            name: 'Satin',
                            matchName: 'chromeFX/enabled',
                            enabled: true,
                            type: AEX_LAYERSTYLE_PROPERTYGROUP,
                        },
                    ],
                },
                type: AEX_NULL_LAYER,
            };

            await aex().createTestComp();
            await aex().create(AeObject.ActiveComp, layerData);

            const result = await aex().get(AeObject.Layer(1));
            const layer = result.object;

            assertAreEqual(layer.layerStyles.properties[1], layerData.layerStyles.properties[0]);
        });

        it('Can create Color Overlay style', async () => {
            const layerData = {
                layerStyles: {
                    properties: [
                        {
                            name: 'Color Overlay',
                            matchName: 'solidFill/enabled',
                            enabled: true,
                            type: AEX_LAYERSTYLE_PROPERTYGROUP,
                        },
                    ],
                },
                type: AEX_NULL_LAYER,
            };

            await aex().createTestComp();
            await aex().create(AeObject.ActiveComp, layerData);

            const result = await aex().get(AeObject.Layer(1));
            const layer = result.object;

            assertAreEqual(layer.layerStyles.properties[1], layerData.layerStyles.properties[0]);
        });

        it('Can create Gradient Overlay style', async () => {
            const layerData = {
                layerStyles: {
                    properties: [
                        {
                            name: 'Gradient Overlay',
                            matchName: 'gradientFill/enabled',
                            enabled: true,
                            type: AEX_LAYERSTYLE_PROPERTYGROUP,
                        },
                    ],
                },
                type: AEX_NULL_LAYER,
            };

            await aex().createTestComp();
            await aex().create(AeObject.ActiveComp, layerData);

            const result = await aex().get(AeObject.Layer(1));
            const layer = result.object;

            assertAreEqual(layer.layerStyles.properties[1], layerData.layerStyles.properties[0]);
        });

        it('Can create Stroke style', async () => {
            const layerData = {
                layerStyles: {
                    properties: [
                        {
                            name: 'Stroke',
                            matchName: 'frameFX/enabled',
                            enabled: true,
                            type: AEX_LAYERSTYLE_PROPERTYGROUP,
                        },
                    ],
                },
                type: AEX_NULL_LAYER,
            };

            await aex().createTestComp();
            await aex().create(AeObject.ActiveComp, layerData);

            const result = await aex().get(AeObject.Layer(1));
            const layer = result.object;

            assertAreEqual(layer.layerStyles.properties[1], layerData.layerStyles.properties[0]);
        });

        it('Can create modified layer style', async () => {
            const layerData = {
                layerStyles: {
                    properties: [
                        {
                            name: 'Blending Options',
                            matchName: 'ADBE Blend Options Group',
                            enabled: true,
                            properties: [
                                {
                                    type: AEX_ONED_PROPERTY,
                                    name: 'Global Light Angle',
                                    matchName: 'ADBE Global Angle2',
                                    value: 72,
                                    keys: [],
                                },
                                {
                                    type: AEX_ONED_PROPERTY,
                                    name: 'Global Light Altitude',
                                    matchName: 'ADBE Global Altitude2',
                                    value: 63,
                                    keys: [],
                                },
                                {
                                    matchName: 'ADBE Adv Blend Group',
                                    properties: [
                                        {
                                            type: AEX_ONED_PROPERTY,
                                            name: 'Fill Opacity',
                                            matchName: 'ADBE Layer Fill Opacity2',
                                            value: 80,
                                            keys: [],
                                        },
                                        {
                                            type: AEX_ONED_PROPERTY,
                                            name: 'Red',
                                            matchName: 'ADBE R Channel Blend',
                                            value: 0,
                                            keys: [],
                                        },
                                        {
                                            type: AEX_ONED_PROPERTY,
                                            name: 'Green',
                                            matchName: 'ADBE G Channel Blend',
                                            value: 0,
                                            keys: [],
                                        },
                                        {
                                            type: AEX_ONED_PROPERTY,
                                            name: 'Blue',
                                            matchName: 'ADBE B Channel Blend',
                                            value: 0,
                                            keys: [],
                                        },
                                        {
                                            type: AEX_ONED_PROPERTY,
                                            name: 'Blend Interior Styles as Group',
                                            matchName: 'ADBE Blend Interior',
                                            value: 1,
                                            keys: [],
                                        },
                                    ],
                                },
                            ],
                            type: AEX_LAYERSTYLE_PROPERTYGROUP,
                        },
                        {
                            name: 'Drop Shadow',
                            matchName: 'dropShadow/enabled',
                            enabled: true,
                            properties: [
                                {
                                    type: AEX_ONED_PROPERTY,
                                    name: 'Blend Mode',
                                    matchName: 'dropShadow/mode2',
                                    value: 16,
                                    keys: [],
                                },
                                {
                                    type: AEX_ONED_PROPERTY,
                                    name: 'Opacity',
                                    matchName: 'dropShadow/opacity',
                                    value: 45,
                                    keys: [],
                                },
                                {
                                    type: AEX_ONED_PROPERTY,
                                    name: 'Use Global Light',
                                    matchName: 'dropShadow/useGlobalAngle',
                                    value: 1,
                                    keys: [],
                                },
                                {
                                    type: AEX_ONED_PROPERTY,
                                    name: 'Angle',
                                    matchName: 'dropShadow/localLightingAngle',
                                    value: 153,
                                    keys: [],
                                },
                                {
                                    type: AEX_ONED_PROPERTY,
                                    name: 'Distance',
                                    matchName: 'dropShadow/distance',
                                    value: 23,
                                    keys: [],
                                },
                                {
                                    type: AEX_ONED_PROPERTY,
                                    name: 'Spread',
                                    matchName: 'dropShadow/chokeMatte',
                                    value: 37,
                                    keys: [],
                                },
                                {
                                    type: AEX_ONED_PROPERTY,
                                    name: 'Size',
                                    matchName: 'dropShadow/blur',
                                    value: 26,
                                    keys: [],
                                },
                                {
                                    type: AEX_ONED_PROPERTY,
                                    name: 'Noise',
                                    matchName: 'dropShadow/noise',
                                    value: 23,
                                    keys: [],
                                },
                                {
                                    type: AEX_ONED_PROPERTY,
                                    name: 'Layer Knocks Out Drop Shadow',
                                    matchName: 'dropShadow/layerConceals',
                                    value: 0,
                                    keys: [],
                                },
                            ],
                            type: AEX_LAYERSTYLE_PROPERTYGROUP,
                        },
                    ],
                },
                type: AEX_NULL_LAYER,
            };

            await aex().createTestComp();
            await aex().create(AeObject.ActiveComp, layerData);

            const result = await aex().get(AeObject.Layer(1));
            const layer = result.object;

            assertAreEqual(layer.layerStyles.properties, layerData.layerStyles.properties);
        });

        it('Can create specific disabled style', async () => {
            const layerData = {
                layerStyles: {
                    properties: [
                        {
                            name: 'Drop Shadow',
                            matchName: 'dropShadow/enabled',
                            enabled: false,
                            type: AEX_LAYERSTYLE_PROPERTYGROUP,
                        },
                    ],
                },
                type: AEX_NULL_LAYER,
            };

            await aex().createTestComp();
            await aex().create(AeObject.ActiveComp, layerData);

            const result = await aex().get(AeObject.Layer(1));
            const layer = result.object;

            assertAreEqual(layer.layerStyles.properties[1], layerData.layerStyles.properties[0]);
        });

        it('Can create entire styles property disabled', async () => {
            const layerData = {
                layerStyles: {
                    matchName: 'ADBE Layer Styles',
                    name: 'Layer Styles',
                    enabled: false,
                    properties: [
                        {
                            name: 'Blending Options',
                            matchName: 'ADBE Blend Options Group',
                            enabled: true,
                            type: AEX_LAYERSTYLE_PROPERTYGROUP,
                        },
                        {
                            name: 'Drop Shadow',
                            matchName: 'dropShadow/enabled',
                            enabled: true,
                            type: AEX_LAYERSTYLE_PROPERTYGROUP,
                        },
                    ],
                },
                type: AEX_NULL_LAYER,
            };

            await aex().createTestComp();
            await aex().create(AeObject.ActiveComp, layerData);

            const result = await aex().get(AeObject.Layer(1));
            const layer = result.object;

            assertAreEqual(layer.layerStyles, layerData.layerStyles);
        });
    });

    describe('Create Styles on Existing Layer', async () => {
        it('Can create Drop Shadow style', async () => {
            const styleData = {
                name: 'Drop Shadow',
                matchName: 'dropShadow/enabled',
                enabled: true,
                type: AEX_LAYERSTYLE_PROPERTYGROUP,
            };

            await openProject('testAssets/layer_blank.aep');
            await aex().create(AeObject.Layer(1), styleData);

            const result = await aex().get(AeObject.Layer(1));
            const layer = result.object;

            console.log('add drop shadow style to layer', layer);
            assertAreEqual(layer.layerStyles.properties[layer.layerStyles.properties.length - 1], styleData);
        });

        it('Can create modified Drop Shadow style', async () => {
            const styleData = {
                name: 'Drop Shadow',
                matchName: 'dropShadow/enabled',
                enabled: true,
                properties: [
                    {
                        type: AEX_ONED_PROPERTY,
                        name: 'Blend Mode',
                        matchName: 'dropShadow/mode2',
                        value: 16,
                        keys: [],
                    },
                    {
                        type: AEX_ONED_PROPERTY,
                        name: 'Opacity',
                        matchName: 'dropShadow/opacity',
                        value: 45,
                        keys: [],
                    },
                    {
                        type: AEX_ONED_PROPERTY,
                        name: 'Use Global Light',
                        matchName: 'dropShadow/useGlobalAngle',
                        value: 1,
                        keys: [],
                    },
                    {
                        type: AEX_ONED_PROPERTY,
                        name: 'Angle',
                        matchName: 'dropShadow/localLightingAngle',
                        value: 153,
                        keys: [],
                    },
                    {
                        type: AEX_ONED_PROPERTY,
                        name: 'Distance',
                        matchName: 'dropShadow/distance',
                        value: 23,
                        keys: [],
                    },
                    {
                        type: AEX_ONED_PROPERTY,
                        name: 'Spread',
                        matchName: 'dropShadow/chokeMatte',
                        value: 37,
                        keys: [],
                    },
                    {
                        type: AEX_ONED_PROPERTY,
                        name: 'Size',
                        matchName: 'dropShadow/blur',
                        value: 26,
                        keys: [],
                    },
                    {
                        type: AEX_ONED_PROPERTY,
                        name: 'Noise',
                        matchName: 'dropShadow/noise',
                        value: 23,
                        keys: [],
                    },
                    {
                        type: AEX_ONED_PROPERTY,
                        name: 'Layer Knocks Out Drop Shadow',
                        matchName: 'dropShadow/layerConceals',
                        value: 0,
                        keys: [],
                    },
                ],
                type: AEX_LAYERSTYLE_PROPERTYGROUP,
            };

            await openProject('testAssets/layer_blank.aep');
            await aex().create(AeObject.Layer(1), styleData);

            const result = await aex().get(AeObject.Layer(1));
            const layer = result.object;

            console.log('modified drop shadow style to layer', layer);
            assertAreEqual(layer.layerStyles.properties[layer.layerStyles.properties.length - 1], styleData);
        });
    });

    describe('Update Existing Styles', async () => {
        it('Can update style', async () => {
            const styleData = {
                name: 'Drop Shadow',
                matchName: 'dropShadow/enabled',
                enabled: true,
                properties: [
                    {
                        type: AEX_ONED_PROPERTY,
                        name: 'Blend Mode',
                        matchName: 'dropShadow/mode2',
                        value: 12,
                        keys: [],
                    },
                    {
                        type: AEX_ONED_PROPERTY,
                        name: 'Opacity',
                        matchName: 'dropShadow/opacity',
                        value: 12,
                        keys: [],
                    },
                    {
                        type: AEX_ONED_PROPERTY,
                        name: 'Angle',
                        matchName: 'dropShadow/localLightingAngle',
                        value: 100,
                        keys: [],
                    },
                    {
                        type: AEX_ONED_PROPERTY,
                        name: 'Distance',
                        matchName: 'dropShadow/distance',
                        value: 10,
                        keys: [],
                    },
                    {
                        type: AEX_ONED_PROPERTY,
                        name: 'Spread',
                        matchName: 'dropShadow/chokeMatte',
                        value: 7,
                        keys: [],
                    },
                    {
                        type: AEX_ONED_PROPERTY,
                        name: 'Size',
                        matchName: 'dropShadow/blur',
                        value: 18,
                        keys: [],
                    },
                    {
                        type: AEX_ONED_PROPERTY,
                        name: 'Noise',
                        matchName: 'dropShadow/noise',
                        value: 10,
                        keys: [],
                    },
                ],
                type: AEX_LAYERSTYLE_PROPERTYGROUP,
            };

            await openProject('testAssets/layer_styles.aep');
            await aex().update(AeObject.LayerProp(1, 'layerStyle.property(2)'), styleData);

            const result = await aex().get(AeObject.Layer(1));
            const layer = result.object;

            console.log('updated layer style drop shadow', layer.layerStyles);
            assertAreEqual(layer.layerStyles.properties[layer.layerStyles.properties.length - 1], styleData);
        });
    });
});
