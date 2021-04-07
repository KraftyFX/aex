import { expect } from 'chai';
import { aex } from '../aex';
import { AEX_COLOR_PROPERTY, AEX_ONED_PROPERTY, AEX_THREED_PROPERTY, AEX_TWOD_PROPERTY, AEX_CUSTOM_PROPERTY } from '../constants';
import { cleanupAex, evalAexIntoEstk, openProject } from '../csinterface';
import { assertAreEqual } from '../utils';

describe('Layer Effects', function () {
    this.slow(500);
    this.timeout(2000);

    before(async () => {
        await evalAexIntoEstk();
        await openProject('testAssets/layer_effects.aep');
    });

    after(async () => {
        await cleanupAex();
    });

    describe('Simple Effects', async () => {
        let comp: any;

        before(async () => {
            const result = await aex().fromAe("aeq.getComp('Simple')");
            comp = result.object;
            console.log('layer_effects_simple', comp);
        });

        it('Can parse simple unmodified effect', async () => {
            assertAreEqual(comp.layers[0].effects[0], {
                matchName: 'ADBE Fill',
                name: 'Fill - Default',
            });
        });

        it('Can parse simple modified effect', async () => {
            assertAreEqual(comp.layers[0].effects[1], {
                matchName: 'ADBE Fill',
                name: 'Fill - Modified',
                properties: [
                    {
                        keys: [],
                        matchName: 'ADBE Fill-0007',
                        name: 'All Masks',
                        type: AEX_ONED_PROPERTY,
                        value: 1,
                    },
                    {
                        keys: [],
                        matchName: 'ADBE Fill-0002',
                        name: 'Color',
                        type: AEX_COLOR_PROPERTY,
                        value: [1, 0.5, 0, 1],
                    },
                    {
                        keys: [],
                        matchName: 'ADBE Fill-0006',
                        name: 'Invert',
                        type: AEX_ONED_PROPERTY,
                        value: 1,
                    },
                    {
                        keys: [],
                        matchName: 'ADBE Fill-0003',
                        name: 'Horizontal Feather',
                        type: AEX_ONED_PROPERTY,
                        value: 2.2,
                    },
                    {
                        keys: [],
                        matchName: 'ADBE Fill-0004',
                        name: 'Vertical Feather',
                        type: AEX_ONED_PROPERTY,
                        value: 2.8,
                    },
                    {
                        keys: [],
                        matchName: 'ADBE Fill-0005',
                        name: 'Opacity',
                        type: AEX_ONED_PROPERTY,
                        value: 0.79,
                    },
                ],
            });
        });

        it('Can parse effect compositing options', async () => {
            assertAreEqual(comp.layers[0].effects[2], {
                matchName: 'ADBE Fill',
                name: 'Fill - Compositing Options',
                properties: [
                    {
                        matchName: 'ADBE Effect Built In Params',
                        properties: [
                            {
                                matchName: 'ADBE Effect Mask Parade',
                                properties: [
                                    {
                                        matchName: 'ADBE Effect Mask',
                                        name: 'Mask Reference 1',
                                        properties: [
                                            {
                                                keys: [],
                                                matchName: 'ADBE Effect Path Stream Ref',
                                                name: 'Mask Reference 1',
                                                type: AEX_ONED_PROPERTY,
                                                value: 1,
                                            },
                                        ],
                                    },
                                ],
                            },
                            {
                                keys: [],
                                matchName: 'ADBE Effect Mask Opacity',
                                name: 'Effect Opacity',
                                type: AEX_ONED_PROPERTY,
                                value: 50,
                            },
                        ],
                    },
                ],
            });
        });

        it('Can parse default expression controls', async () => {
            assertAreEqual(comp.layers[1].effects, [
                {
                    name: '3D Point Control',
                    matchName: 'ADBE Point3D Control',
                },
                {
                    name: 'Angle Control',
                    matchName: 'ADBE Angle Control',
                },
                {
                    name: 'Checkbox Control',
                    matchName: 'ADBE Checkbox Control',
                },
                {
                    name: 'Color Control',
                    matchName: 'ADBE Color Control',
                },
                {
                    name: 'Dropdown Menu Control',
                    matchName: 'Pseudo/@@DJHhoqupT8S4IxJ3m0KmfQ',
                },
                {
                    name: 'Layer Control',
                    matchName: 'ADBE Layer Control',
                },
                {
                    name: 'Point Control',
                    matchName: 'ADBE Point Control',
                },
                {
                    name: 'Slider Control',
                    matchName: 'ADBE Slider Control',
                },
            ]);
        });

        it('Can parse modified expression controls', async () => {
            assertAreEqual(comp.layers[2].effects, [
                {
                    name: '3D Point Control',
                    matchName: 'ADBE Point3D Control',
                    properties: [
                        {
                            keys: [],
                            matchName: 'ADBE Point3D Control-0001',
                            name: '3D Point',
                            type: AEX_THREED_PROPERTY,
                            value: [0, 0, 0],
                        },
                    ],
                },
                {
                    name: 'Angle Control',
                    matchName: 'ADBE Angle Control',
                    properties: [
                        {
                            keys: [],
                            matchName: 'ADBE Angle Control-0001',
                            name: 'Angle',
                            type: AEX_ONED_PROPERTY,
                            value: 100,
                        },
                    ],
                },
                {
                    name: 'Checkbox Control',
                    matchName: 'ADBE Checkbox Control',
                    properties: [
                        {
                            keys: [],
                            matchName: 'ADBE Checkbox Control-0001',
                            name: 'Checkbox',
                            type: AEX_ONED_PROPERTY,
                            value: 1,
                        },
                    ],
                },
                {
                    name: 'Color Control',
                    matchName: 'ADBE Color Control',
                    properties: [
                        {
                            keys: [],
                            matchName: 'ADBE Color Control-0001',
                            name: 'Color',
                            type: AEX_COLOR_PROPERTY,
                            value: [0, 0.5, 1, 1],
                        },
                    ],
                },
                {
                    name: 'Dropdown Menu Control',
                    matchName: 'Pseudo/@@DJHhoqupT8S4IxJ3m0KmfQ',
                    properties: [
                        {
                            keys: [],
                            matchName: 'Pseudo/@@DJHhoqupT8S4IxJ3m0KmfQ-0001',
                            name: 'Menu',
                            type: AEX_ONED_PROPERTY,
                            value: 3,
                        },
                    ],
                },
                {
                    name: 'Layer Control',
                    matchName: 'ADBE Layer Control',
                    properties: [
                        {
                            keys: [],
                            matchName: 'ADBE Layer Control-0001',
                            name: 'Layer',
                            type: AEX_ONED_PROPERTY,
                            value: 1,
                        },
                    ],
                },
                {
                    name: 'Point Control',
                    matchName: 'ADBE Point Control',
                    properties: [
                        {
                            keys: [],
                            matchName: 'ADBE Point Control-0001',
                            name: 'Point',
                            type: AEX_TWOD_PROPERTY,
                            value: [100, 200],
                        },
                    ],
                },
                {
                    name: 'Slider Control',
                    matchName: 'ADBE Slider Control',
                    properties: [
                        {
                            keys: [],
                            matchName: 'ADBE Slider Control-0001',
                            name: 'Slider',
                            type: AEX_ONED_PROPERTY,
                            value: 300,
                        },
                    ],
                },
            ]);
        });

        it('Can parse nested effect groups', async () => {
            assertAreEqual(comp.layers[3].effects[0], {
                matchName: 'ADBE Fractal Noise',
                name: 'Fractal Noise',
                properties: [
                    {
                        keys: [],
                        matchName: 'ADBE Fractal Noise-0010',
                        name: 'Scale',
                        type: AEX_ONED_PROPERTY,
                        value: 123,
                    },
                ],
            });
        });
    });

    describe.skip('Unsupported Effects', async () => {
        it('Can throw on unsupported properties', async () => {
            try {
                await aex().fromAe("aeq.getComp('Unsupported')");
                expect.fail(`Test should have thrown but it completed.`);
            } catch (e) {
                expect(e.isEstkError).to.be.true;
                expect(e.message).to.contain("Can't parse property");
            }
        });

        it('Can skip unsupported properties (with option)', async () => {
            const result = await aex().fromAe("aeq.getComp('Unsupported')");
            const comp = result.object;
            console.log('layer_effects_unsupported_skip', comp);

            assertAreEqual(comp.layers[0].effects[0], {
                matchName: 'ADBE CurvesCustom',
                name: 'Curves',
            });
        });

        it('Can return unsupported property metadata (with option)', async () => {
            const result = await aex().fromAe("aeq.getComp('Unsupported')");
            const comp = result.object;

            console.log('layer_effects_unsupported_metadata', comp);
            assertAreEqual(comp.layers[0].effects[0], {
                matchName: 'ADBE CurvesCustom',
                name: 'Curves',
                properties: [
                    {
                        keys: [],
                        matchName: 'ADBE CurvesCustom-0001',
                        name: 'Curves',
                        type: AEX_CUSTOM_PROPERTY,
                    },
                ],
            });
        });
    });
});
