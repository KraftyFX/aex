import { expect } from 'chai';
import { AeObject, aex, getProject } from '../aex';
import { AEX_LAYERSTYLE_PROPERTYGROUP, AEX_NULL_LAYER, AEX_ONED_PROPERTY, TEST_TIMEOUT_TIME } from '../constants';
import { cleanupAex, evalAexIntoEstk, openCleanProject, openProject } from '../csinterface';
import { assertAreEqual } from '../utils';

describe('Layer Styles', function () {
    this.slow(1000);
    this.timeout(TEST_TIMEOUT_TIME);

    before(async () => {
        await evalAexIntoEstk();
    });

    after(async () => {
        await cleanupAex();
    });

    describe('Drop Shadow Style', async () => {
        it('Get', async () => {
            const { object: comp } = await getProject('assets/layer_styles.aep', AeObject.ActiveComp);
            assertAreEqual(comp.layers[0].layerStyles.properties, [
                {
                    matchName: 'ADBE Blend Options Group',
                    enabled: true,
                    type: AEX_LAYERSTYLE_PROPERTYGROUP,
                },
                {
                    matchName: 'dropShadow/enabled',
                    enabled: true,
                    type: AEX_LAYERSTYLE_PROPERTYGROUP,
                },
            ]);
        });

        it('Create on comp', async () => {
            const layerData = {
                layerStyles: {
                    properties: [
                        {
                            matchName: 'ADBE Blend Options Group',
                            enabled: true,
                            type: AEX_LAYERSTYLE_PROPERTYGROUP,
                        },
                        {
                            matchName: 'dropShadow/enabled',
                            enabled: true,
                            type: AEX_LAYERSTYLE_PROPERTYGROUP,
                        },
                    ],
                },
                type: AEX_NULL_LAYER,
            };

            await openCleanProject();
            await aex.createTestComp();
            await aex.create(AeObject.ActiveComp, layerData);

            const result = await aex.get(AeObject.Layer(1));
            const layer = result.object;

            assertAreEqual(layer.layerStyles.properties, layerData.layerStyles.properties);
        });

        it('Create on layer', async () => {
            const styleData = {
                matchName: 'dropShadow/enabled',
                enabled: true,
                type: AEX_LAYERSTYLE_PROPERTYGROUP,
            };

            await openProject('assets/layer_blank.aep');
            await aex.create(AeObject.Layer(1), styleData);

            const result = await aex.get(AeObject.Layer(1));
            const layer = result.object;

            console.log('add drop shadow style to layer', layer);
            assertAreEqual(layer.layerStyles.properties[layer.layerStyles.properties.length - 1], styleData);
        });

        it('Create on layer', async () => {
            const styleData = {
                matchName: 'dropShadow/enabled',
                enabled: true,
                properties: [
                    {
                        type: AEX_ONED_PROPERTY,
                        matchName: 'dropShadow/mode2',
                        value: 16,
                        keys: [],
                    },
                    {
                        type: AEX_ONED_PROPERTY,
                        matchName: 'dropShadow/opacity',
                        value: 45,
                        keys: [],
                    },
                    {
                        type: AEX_ONED_PROPERTY,
                        matchName: 'dropShadow/useGlobalAngle',
                        value: 1,
                        keys: [],
                    },
                    {
                        type: AEX_ONED_PROPERTY,
                        matchName: 'dropShadow/localLightingAngle',
                        value: 153,
                        keys: [],
                    },
                    {
                        type: AEX_ONED_PROPERTY,
                        matchName: 'dropShadow/distance',
                        value: 23,
                        keys: [],
                    },
                    {
                        type: AEX_ONED_PROPERTY,
                        matchName: 'dropShadow/chokeMatte',
                        value: 37,
                        keys: [],
                    },
                    {
                        type: AEX_ONED_PROPERTY,
                        matchName: 'dropShadow/blur',
                        value: 26,
                        keys: [],
                    },
                    {
                        type: AEX_ONED_PROPERTY,
                        matchName: 'dropShadow/noise',
                        value: 23,
                        keys: [],
                    },
                    {
                        type: AEX_ONED_PROPERTY,
                        matchName: 'dropShadow/layerConceals',
                        value: 0,
                        keys: [],
                    },
                ],
                type: AEX_LAYERSTYLE_PROPERTYGROUP,
            };

            await openProject('assets/layer_blank.aep');
            await aex.create(AeObject.Layer(1), styleData);

            const result = await aex.get(AeObject.Layer(1));
            const layer = result.object;

            console.log('modified drop shadow style to layer', layer);
            assertAreEqual(layer.layerStyles.properties[layer.layerStyles.properties.length - 1], styleData);
        });
    });

    describe('Inner Shadow Style', async () => {
        it('Get', async () => {
            const { object: comp } = await getProject('assets/layer_styles.aep', AeObject.ActiveComp);
            assertAreEqual(comp.layers[1].layerStyles.properties[1], {
                matchName: 'innerShadow/enabled',
                enabled: true,
                type: AEX_LAYERSTYLE_PROPERTYGROUP,
            });
        });

        it('Create', async () => {
            const layerData = {
                layerStyles: {
                    properties: [
                        {
                            matchName: 'innerShadow/enabled',
                            enabled: true,
                            type: AEX_LAYERSTYLE_PROPERTYGROUP,
                        },
                    ],
                },
                type: AEX_NULL_LAYER,
            };

            await openCleanProject();
            await aex.createTestComp();
            await aex.create(AeObject.ActiveComp, layerData);

            const result = await aex.get(AeObject.ActiveComp);
            const comp = result.object;

            assertAreEqual(comp.layers[0].layerStyles.properties[1], layerData.layerStyles.properties[0]);
        });
    });

    describe('Outer Glow Style', async () => {
        it('Get', async () => {
            const { object: comp } = await getProject('assets/layer_styles.aep', AeObject.ActiveComp);
            assertAreEqual(comp.layers[2].layerStyles.properties[1], {
                matchName: 'outerGlow/enabled',
                enabled: true,
                type: AEX_LAYERSTYLE_PROPERTYGROUP,
            });
        });

        it('Get', async () => {
            const { object: comp } = await getProject('assets/layer_styles.aep', AeObject.ActiveComp);
            assertAreEqual(comp.layers[3].layerStyles.properties[1], {
                matchName: 'innerGlow/enabled',
                enabled: true,
                type: AEX_LAYERSTYLE_PROPERTYGROUP,
            });
        });

        it('Create on comp', async () => {
            const layerData = {
                layerStyles: {
                    properties: [
                        {
                            matchName: 'outerGlow/enabled',
                            enabled: true,
                            type: AEX_LAYERSTYLE_PROPERTYGROUP,
                        },
                    ],
                },
                type: AEX_NULL_LAYER,
            };

            await openCleanProject();
            await aex.createTestComp();
            await aex.create(AeObject.ActiveComp, layerData);

            const result = await aex.get(AeObject.Layer(1));
            const layer = result.object;

            assertAreEqual(layer.layerStyles.properties[1], layerData.layerStyles.properties[0]);
        });

        it('Create on comp', async () => {
            const layerData = {
                layerStyles: {
                    properties: [
                        {
                            matchName: 'innerGlow/enabled',
                            enabled: true,
                            type: AEX_LAYERSTYLE_PROPERTYGROUP,
                        },
                    ],
                },
                type: AEX_NULL_LAYER,
            };

            await openCleanProject();
            await aex.createTestComp();
            await aex.create(AeObject.ActiveComp, layerData);

            const result = await aex.get(AeObject.Layer(1));
            const layer = result.object;

            assertAreEqual(layer.layerStyles.properties[1], layerData.layerStyles.properties[0]);
        });
    });

    describe('Bevel Emboss', async () => {
        it('Get', async () => {
            const { object: comp } = await getProject('assets/layer_styles.aep', AeObject.ActiveComp);
            assertAreEqual(comp.layers[4].layerStyles.properties[1], {
                matchName: 'bevelEmboss/enabled',
                enabled: true,
                type: AEX_LAYERSTYLE_PROPERTYGROUP,
            });
        });

        it('Create', async () => {
            const layerData = {
                layerStyles: {
                    properties: [
                        {
                            matchName: 'bevelEmboss/enabled',
                            enabled: true,
                            type: AEX_LAYERSTYLE_PROPERTYGROUP,
                        },
                    ],
                },
                type: AEX_NULL_LAYER,
            };

            await openCleanProject();
            await aex.createTestComp();
            await aex.create(AeObject.ActiveComp, layerData);

            const result = await aex.get(AeObject.Layer(1));
            const layer = result.object;

            assertAreEqual(layer.layerStyles.properties[1], layerData.layerStyles.properties[0]);
        });
    });

    describe('Satin Style', async () => {
        it('Get', async () => {
            const { object: comp } = await getProject('assets/layer_styles.aep', AeObject.ActiveComp);
            assertAreEqual(comp.layers[5].layerStyles.properties[1], {
                matchName: 'chromeFX/enabled',
                enabled: true,
                type: AEX_LAYERSTYLE_PROPERTYGROUP,
            });
        });

        it('Create', async () => {
            const layerData = {
                layerStyles: {
                    properties: [
                        {
                            matchName: 'chromeFX/enabled',
                            enabled: true,
                            type: AEX_LAYERSTYLE_PROPERTYGROUP,
                        },
                    ],
                },
                type: AEX_NULL_LAYER,
            };

            await openCleanProject();
            await aex.createTestComp();
            await aex.create(AeObject.ActiveComp, layerData);

            const result = await aex.get(AeObject.Layer(1));
            const layer = result.object;

            assertAreEqual(layer.layerStyles.properties[1], layerData.layerStyles.properties[0]);
        });
    });

    describe('Color Overlay', async () => {
        it('Get', async () => {
            const { object: comp } = await getProject('assets/layer_styles.aep', AeObject.ActiveComp);
            assertAreEqual(comp.layers[6].layerStyles.properties[1], {
                matchName: 'solidFill/enabled',
                enabled: true,
                type: AEX_LAYERSTYLE_PROPERTYGROUP,
            });
        });

        it('Create', async () => {
            const layerData = {
                layerStyles: {
                    properties: [
                        {
                            matchName: 'solidFill/enabled',
                            enabled: true,
                            type: AEX_LAYERSTYLE_PROPERTYGROUP,
                        },
                    ],
                },
                type: AEX_NULL_LAYER,
            };

            await openCleanProject();
            await aex.createTestComp();
            await aex.create(AeObject.ActiveComp, layerData);

            const result = await aex.get(AeObject.Layer(1));
            const layer = result.object;

            assertAreEqual(layer.layerStyles.properties[1], layerData.layerStyles.properties[0]);
        });
    });

    describe('Gradient Overlay', async () => {
        it('Get', async () => {
            const { object: comp } = await getProject('assets/layer_styles.aep', AeObject.ActiveComp);
            assertAreEqual(comp.layers[7].layerStyles.properties[1], {
                matchName: 'gradientFill/enabled',
                enabled: true,
                type: AEX_LAYERSTYLE_PROPERTYGROUP,
            });
        });

        it('Create', async () => {
            const layerData = {
                layerStyles: {
                    properties: [
                        {
                            matchName: 'gradientFill/enabled',
                            enabled: true,
                            type: AEX_LAYERSTYLE_PROPERTYGROUP,
                        },
                    ],
                },
                type: AEX_NULL_LAYER,
            };

            await openCleanProject();
            await aex.createTestComp();
            await aex.create(AeObject.ActiveComp, layerData);

            const result = await aex.get(AeObject.Layer(1));
            const layer = result.object;

            assertAreEqual(layer.layerStyles.properties[1], layerData.layerStyles.properties[0]);
        });
    });

    describe('Stroke Style', async () => {
        it('Get', async () => {
            const { object: comp } = await getProject('assets/layer_styles.aep', AeObject.ActiveComp);
            assertAreEqual(comp.layers[8].layerStyles.properties[1], {
                matchName: 'frameFX/enabled',
                enabled: true,
                type: AEX_LAYERSTYLE_PROPERTYGROUP,
            });
        });

        it('Create', async () => {
            const layerData = {
                layerStyles: {
                    properties: [
                        {
                            matchName: 'frameFX/enabled',
                            enabled: true,
                            type: AEX_LAYERSTYLE_PROPERTYGROUP,
                        },
                    ],
                },
                type: AEX_NULL_LAYER,
            };

            await openCleanProject();
            await aex.createTestComp();
            await aex.create(AeObject.ActiveComp, layerData);

            const result = await aex.get(AeObject.Layer(1));
            const layer = result.object;

            assertAreEqual(layer.layerStyles.properties[1], layerData.layerStyles.properties[0]);
        });
    });

    describe('Modified Layer Style', async () => {
        it('Get', async () => {
            const { object: comp } = await getProject('assets/layer_styles.aep', AeObject.ActiveComp);
            assertAreEqual(comp.layers[9].layerStyles.properties, [
                {
                    matchName: 'ADBE Blend Options Group',
                    enabled: true,
                    properties: [
                        {
                            type: AEX_ONED_PROPERTY,
                            matchName: 'ADBE Global Angle2',
                            value: 72,
                            keys: [],
                        },
                        {
                            type: AEX_ONED_PROPERTY,
                            matchName: 'ADBE Global Altitude2',
                            value: 63,
                            keys: [],
                        },
                        {
                            matchName: 'ADBE Adv Blend Group',
                            properties: [
                                {
                                    type: AEX_ONED_PROPERTY,
                                    matchName: 'ADBE Layer Fill Opacity2',
                                    value: 80,
                                    keys: [],
                                },
                                {
                                    type: AEX_ONED_PROPERTY,
                                    matchName: 'ADBE R Channel Blend',
                                    value: 0,
                                    keys: [],
                                },
                                {
                                    type: AEX_ONED_PROPERTY,
                                    matchName: 'ADBE G Channel Blend',
                                    value: 0,
                                    keys: [],
                                },
                                {
                                    type: AEX_ONED_PROPERTY,
                                    matchName: 'ADBE B Channel Blend',
                                    value: 0,
                                    keys: [],
                                },
                                {
                                    type: AEX_ONED_PROPERTY,
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
                    matchName: 'dropShadow/enabled',
                    enabled: true,
                    properties: [
                        {
                            type: AEX_ONED_PROPERTY,
                            matchName: 'dropShadow/mode2',
                            value: 16,
                            keys: [],
                        },
                        {
                            type: AEX_ONED_PROPERTY,
                            matchName: 'dropShadow/opacity',
                            value: 45,
                            keys: [],
                        },
                        {
                            type: AEX_ONED_PROPERTY,
                            matchName: 'dropShadow/useGlobalAngle',
                            value: 1,
                            keys: [],
                        },
                        {
                            type: AEX_ONED_PROPERTY,
                            matchName: 'dropShadow/localLightingAngle',
                            value: 153,
                            keys: [],
                        },
                        {
                            type: AEX_ONED_PROPERTY,
                            matchName: 'dropShadow/distance',
                            value: 23,
                            keys: [],
                        },
                        {
                            type: AEX_ONED_PROPERTY,
                            matchName: 'dropShadow/chokeMatte',
                            value: 37,
                            keys: [],
                        },
                        {
                            type: AEX_ONED_PROPERTY,
                            matchName: 'dropShadow/blur',
                            value: 26,
                            keys: [],
                        },
                        {
                            type: AEX_ONED_PROPERTY,
                            matchName: 'dropShadow/noise',
                            value: 23,
                            keys: [],
                        },
                        {
                            type: AEX_ONED_PROPERTY,
                            matchName: 'dropShadow/layerConceals',
                            value: 0,
                            keys: [],
                        },
                    ],
                    type: AEX_LAYERSTYLE_PROPERTYGROUP,
                },
            ]);
        });

        it('Create', async () => {
            const layerData = {
                layerStyles: {
                    properties: [
                        {
                            matchName: 'ADBE Blend Options Group',
                            enabled: true,
                            properties: [
                                {
                                    type: AEX_ONED_PROPERTY,
                                    matchName: 'ADBE Global Angle2',
                                    value: 72,
                                    keys: [],
                                },
                                {
                                    type: AEX_ONED_PROPERTY,
                                    matchName: 'ADBE Global Altitude2',
                                    value: 63,
                                    keys: [],
                                },
                                {
                                    matchName: 'ADBE Adv Blend Group',
                                    properties: [
                                        {
                                            type: AEX_ONED_PROPERTY,
                                            matchName: 'ADBE Layer Fill Opacity2',
                                            value: 80,
                                            keys: [],
                                        },
                                        {
                                            type: AEX_ONED_PROPERTY,
                                            matchName: 'ADBE R Channel Blend',
                                            value: 0,
                                            keys: [],
                                        },
                                        {
                                            type: AEX_ONED_PROPERTY,
                                            matchName: 'ADBE G Channel Blend',
                                            value: 0,
                                            keys: [],
                                        },
                                        {
                                            type: AEX_ONED_PROPERTY,
                                            matchName: 'ADBE B Channel Blend',
                                            value: 0,
                                            keys: [],
                                        },
                                        {
                                            type: AEX_ONED_PROPERTY,
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
                            matchName: 'dropShadow/enabled',
                            enabled: true,
                            properties: [
                                {
                                    type: AEX_ONED_PROPERTY,
                                    matchName: 'dropShadow/mode2',
                                    value: 16,
                                    keys: [],
                                },
                                {
                                    type: AEX_ONED_PROPERTY,
                                    matchName: 'dropShadow/opacity',
                                    value: 45,
                                    keys: [],
                                },
                                {
                                    type: AEX_ONED_PROPERTY,
                                    matchName: 'dropShadow/useGlobalAngle',
                                    value: 1,
                                    keys: [],
                                },
                                {
                                    type: AEX_ONED_PROPERTY,
                                    matchName: 'dropShadow/localLightingAngle',
                                    value: 153,
                                    keys: [],
                                },
                                {
                                    type: AEX_ONED_PROPERTY,
                                    matchName: 'dropShadow/distance',
                                    value: 23,
                                    keys: [],
                                },
                                {
                                    type: AEX_ONED_PROPERTY,
                                    matchName: 'dropShadow/chokeMatte',
                                    value: 37,
                                    keys: [],
                                },
                                {
                                    type: AEX_ONED_PROPERTY,
                                    matchName: 'dropShadow/blur',
                                    value: 26,
                                    keys: [],
                                },
                                {
                                    type: AEX_ONED_PROPERTY,
                                    matchName: 'dropShadow/noise',
                                    value: 23,
                                    keys: [],
                                },
                                {
                                    type: AEX_ONED_PROPERTY,
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

            await openCleanProject();
            await aex.createTestComp();
            await aex.create(AeObject.ActiveComp, layerData);

            const result = await aex.get(AeObject.Layer(1));
            const layer = result.object;

            assertAreEqual(layer.layerStyles.properties, layerData.layerStyles.properties);
        });
    });

    describe('Specific Disabled Style', async () => {
        it('Get', async () => {
            const { object: comp } = await getProject('assets/layer_styles.aep', AeObject.ActiveComp);
            assertAreEqual(comp.layers[10].layerStyles.properties[1], {
                matchName: 'dropShadow/enabled',
                enabled: false,
                type: AEX_LAYERSTYLE_PROPERTYGROUP,
            });
        });

        it('Create', async () => {
            const layerData = {
                layerStyles: {
                    properties: [
                        {
                            matchName: 'dropShadow/enabled',
                            enabled: false,
                            type: AEX_LAYERSTYLE_PROPERTYGROUP,
                        },
                    ],
                },
                type: AEX_NULL_LAYER,
            };

            await openCleanProject();
            await aex.createTestComp();
            await aex.create(AeObject.ActiveComp, layerData);

            const result = await aex.get(AeObject.Layer(1));
            const layer = result.object;

            assertAreEqual(layer.layerStyles.properties[1], layerData.layerStyles.properties[0]);
        });
    });

    describe('Entire Style Property Disabled', async () => {
        it('Get', async () => {
            const { object: comp } = await getProject('assets/layer_styles.aep', AeObject.ActiveComp);
            assertAreEqual(comp.layers[11].layerStyles, {
                matchName: 'ADBE Layer Styles',
                name: 'Layer Styles',
                enabled: false,
                properties: [
                    {
                        matchName: 'ADBE Blend Options Group',
                        enabled: true,
                        type: AEX_LAYERSTYLE_PROPERTYGROUP,
                    },
                    {
                        matchName: 'dropShadow/enabled',
                        enabled: true,
                        type: AEX_LAYERSTYLE_PROPERTYGROUP,
                    },
                ],
            });
        });

        it('Create', async () => {
            const layerData = {
                layerStyles: {
                    matchName: 'ADBE Layer Styles',
                    name: 'Layer Styles',
                    enabled: false,
                    properties: [
                        {
                            matchName: 'ADBE Blend Options Group',
                            enabled: true,
                            type: AEX_LAYERSTYLE_PROPERTYGROUP,
                        },
                        {
                            matchName: 'dropShadow/enabled',
                            enabled: true,
                            type: AEX_LAYERSTYLE_PROPERTYGROUP,
                        },
                    ],
                },
                type: AEX_NULL_LAYER,
            };

            await openCleanProject();
            await aex.createTestComp();
            await aex.create(AeObject.ActiveComp, layerData);

            const result = await aex.get(AeObject.Layer(1));
            const layer = result.object;

            assertAreEqual(layer.layerStyles, layerData.layerStyles);
        });
    });

    describe('No Styles', async () => {
        it('Get', async () => {
            const { object: comp } = await getProject('assets/layer_styles.aep', AeObject.ActiveComp);
            expect(comp.layers[12].layerStyles).to.be.undefined;
        });
    });

    describe('Update Existing Styles', async () => {
        it('Can update style', async () => {
            const styleData = {
                matchName: 'dropShadow/enabled',
                enabled: true,
                properties: [
                    {
                        type: AEX_ONED_PROPERTY,
                        matchName: 'dropShadow/mode2',
                        value: 12,
                        keys: [],
                    },
                    {
                        type: AEX_ONED_PROPERTY,
                        matchName: 'dropShadow/opacity',
                        value: 12,
                        keys: [],
                    },
                    {
                        type: AEX_ONED_PROPERTY,
                        matchName: 'dropShadow/localLightingAngle',
                        value: 100,
                        keys: [],
                    },
                    {
                        type: AEX_ONED_PROPERTY,
                        matchName: 'dropShadow/distance',
                        value: 10,
                        keys: [],
                    },
                    {
                        type: AEX_ONED_PROPERTY,
                        matchName: 'dropShadow/chokeMatte',
                        value: 7,
                        keys: [],
                    },
                    {
                        type: AEX_ONED_PROPERTY,
                        matchName: 'dropShadow/blur',
                        value: 18,
                        keys: [],
                    },
                    {
                        type: AEX_ONED_PROPERTY,
                        matchName: 'dropShadow/noise',
                        value: 10,
                        keys: [],
                    },
                ],
                type: AEX_LAYERSTYLE_PROPERTYGROUP,
            };

            await openProject('assets/layer_styles.aep');
            await aex.update(AeObject.LayerProp(1, 'layerStyle.property(2)'), styleData);

            const result = await aex.get(AeObject.Layer(1));
            const layer = result.object;

            console.log('updated layer style drop shadow', layer.layerStyles);
            assertAreEqual(layer.layerStyles.properties[layer.layerStyles.properties.length - 1], styleData);
        });
    });
});
