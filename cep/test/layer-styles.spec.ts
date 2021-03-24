import { expect } from 'chai';
import { AeObject, aex } from './aex';
import { cleanupAeqIpc, cleanupAex, evalAexIntoESTK, openProject } from './csinterface';
import { assertAreEqual } from './utils';

describe('Layer Styles', function () {
    this.slow(500);
    this.timeout(2000);

    let result: any;

    before(async () => {
        await evalAexIntoESTK();
        await openProject('testAssets/layer_styles.aep');
        result = await aex().toObjectWithAeObject(AeObject.ActiveComp);
        console.log('layer_styles', result);
    });

    after(async () => {
        await cleanupAex();
        await cleanupAeqIpc();
    });

    it('Can parse Drop Shadow style', async () => {
        assertAreEqual(result.comps[0].layers[0].layerStyles.properties, [
            {
                name: 'Blending Options',
                matchName: 'ADBE Blend Options Group',
                enabled: true,
            },
            {
                name: 'Drop Shadow',
                matchName: 'dropShadow/enabled',
                enabled: true,
            },
        ]);
    });

    it('Can parse Inner Shadow style', async () => {
        assertAreEqual(result.comps[0].layers[1].layerStyles.properties[1], {
            name: 'Inner Shadow',
            matchName: 'innerShadow/enabled',
            enabled: true,
        });
    });

    it('Can parse Outer Glow style', async () => {
        assertAreEqual(result.comps[0].layers[2].layerStyles.properties[1], {
            name: 'Outer Glow',
            matchName: 'outerGlow/enabled',
            enabled: true,
        });
    });

    it('Can parse Outer Glow style', async () => {
        assertAreEqual(result.comps[0].layers[3].layerStyles.properties[1], {
            name: 'Inner Glow',
            matchName: 'innerGlow/enabled',
            enabled: true,
        });
    });

    it('Can parse Bevel Emboss style', async () => {
        assertAreEqual(result.comps[0].layers[4].layerStyles.properties[1], {
            name: 'Bevel and Emboss',
            matchName: 'bevelEmboss/enabled',
            enabled: true,
        });
    });

    it('Can parse Satin style', async () => {
        assertAreEqual(result.comps[0].layers[5].layerStyles.properties[1], {
            name: 'Satin',
            matchName: 'chromeFX/enabled',
            enabled: true,
        });
    });

    it('Can parse Color Overlay style', async () => {
        assertAreEqual(result.comps[0].layers[6].layerStyles.properties[1], {
            name: 'Color Overlay',
            matchName: 'solidFill/enabled',
            enabled: true,
        });
    });

    it('Can parse Gradient Overlay style', async () => {
        assertAreEqual(result.comps[0].layers[7].layerStyles.properties[1], {
            name: 'Gradient Overlay',
            matchName: 'gradientFill/enabled',
            enabled: true,
        });
    });

    it('Can parse Stroke style', async () => {
        assertAreEqual(result.comps[0].layers[8].layerStyles.properties[1], {
            name: 'Stroke',
            matchName: 'frameFX/enabled',
            enabled: true,
        });
    });

    it('Can parse modified layer style', async () => {
        assertAreEqual(result.comps[0].layers[9].layerStyles.properties, [
            {
                name: 'Blending Options',
                matchName: 'ADBE Blend Options Group',
                enabled: true,
                properties: [
                    {
                        name: 'Global Light Angle',
                        matchName: 'ADBE Global Angle2',
                        value: 72,
                        keys: [],
                    },
                    {
                        name: 'Global Light Altitude',
                        matchName: 'ADBE Global Altitude2',
                        value: 63,
                        keys: [],
                    },
                    {
                        matchName: 'ADBE Adv Blend Group',
                        properties: [
                            {
                                name: 'Fill Opacity',
                                matchName: 'ADBE Layer Fill Opacity2',
                                value: 80,
                                keys: [],
                            },
                            {
                                name: 'Red',
                                matchName: 'ADBE R Channel Blend',
                                value: 0,
                                keys: [],
                            },
                            {
                                name: 'Green',
                                matchName: 'ADBE G Channel Blend',
                                value: 0,
                                keys: [],
                            },
                            {
                                name: 'Blue',
                                matchName: 'ADBE B Channel Blend',
                                value: 0,
                                keys: [],
                            },
                            {
                                name: 'Blend Interior Styles as Group',
                                matchName: 'ADBE Blend Interior',
                                value: 1,
                                keys: [],
                            },
                        ],
                    },
                ],
            },
            {
                name: 'Drop Shadow',
                matchName: 'dropShadow/enabled',
                enabled: true,
                properties: [
                    {
                        name: 'Blend Mode',
                        matchName: 'dropShadow/mode2',
                        value: 16,
                        keys: [],
                    },
                    {
                        name: 'Opacity',
                        matchName: 'dropShadow/opacity',
                        value: 45,
                        keys: [],
                    },
                    {
                        name: 'Use Global Light',
                        matchName: 'dropShadow/useGlobalAngle',
                        value: 1,
                        keys: [],
                    },
                    {
                        name: 'Angle',
                        matchName: 'dropShadow/localLightingAngle',
                        value: 153,
                        keys: [],
                    },
                    {
                        name: 'Distance',
                        matchName: 'dropShadow/distance',
                        value: 23,
                        keys: [],
                    },
                    {
                        name: 'Spread',
                        matchName: 'dropShadow/chokeMatte',
                        value: 37,
                        keys: [],
                    },
                    {
                        name: 'Size',
                        matchName: 'dropShadow/blur',
                        value: 26,
                        keys: [],
                    },
                    {
                        name: 'Noise',
                        matchName: 'dropShadow/noise',
                        value: 23,
                        keys: [],
                    },
                    {
                        name: 'Layer Knocks Out Drop Shadow',
                        matchName: 'dropShadow/layerConceals',
                        value: 0,
                        keys: [],
                    },
                ],
            },
        ]);
    });

    it('Can parse specific disabled style', async () => {
        assertAreEqual(result.comps[0].layers[10].layerStyles.properties[1], {
            name: 'Drop Shadow',
            matchName: 'dropShadow/enabled',
            enabled: false,
        });
    });

    it('Can parse entire styles property disabled', async () => {
        assertAreEqual(result.comps[0].layers[11].layerStyles, {
            matchName: 'ADBE Layer Styles',
            name: 'Layer Styles',
            enabled: false,
            properties: [
                {
                    name: 'Blending Options',
                    matchName: 'ADBE Blend Options Group',
                    enabled: true,
                },
                {
                    name: 'Drop Shadow',
                    matchName: 'dropShadow/enabled',
                    enabled: true,
                },
            ],
        });
    });

    it('Can parse no styles', async () => {
        expect(result.comps[0].layers[12].layerStyles).to.be.undefined;
    });
});
