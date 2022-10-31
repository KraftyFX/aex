import { AeObject, aex, getProject } from '../aex';
import {
    AEX_COLOR_PROPERTY,
    AEX_COMP_ITEM,
    AEX_DROPDOWN_EFFECT_PROPERTYGROUP,
    AEX_EFFECT_PROPERTYGROUP,
    AEX_KEY,
    AEX_NULL_LAYER,
    AEX_ONED_PROPERTY,
    AEX_SHAPE_PROPERTY,
    AEX_THREED_PROPERTY,
    AEX_TWOD_PROPERTY,
    TEST_TIMEOUT_TIME,
} from '../constants';
import { cleanupAex, evalAexIntoEstk, openCleanProject, openProject } from '../csinterface';
import { assertAreEqual } from '../utils';

describe('Layer Effects', function () {
    this.slow(1000);
    this.timeout(TEST_TIMEOUT_TIME);

    before(async () => {
        await evalAexIntoEstk();
    });

    after(async () => {
        await cleanupAex();
    });

    describe('Simple Effect - Unmodified', async () => {
        it('Get', async () => {
            const { object: project } = await getProject('assets/layer_effects.aep', AeObject.Project);
            const simpleComp = project.comps.find((comp: any) => comp.name === 'Simple');

            assertAreEqual(simpleComp.layers[0].effects[0], {
                matchName: 'ADBE Fill',
                name: 'Fill - Default',
                type: AEX_EFFECT_PROPERTYGROUP,
            });
        });

        it('Create on comp', async () => {
            const layerData = {
                effects: [
                    {
                        matchName: 'ADBE Fill',
                        name: 'Fill - Default',
                        type: AEX_EFFECT_PROPERTYGROUP,
                    },
                ],
                type: AEX_NULL_LAYER,
            };

            await openCleanProject();
            await aex.createTestComp();
            await aex.create(AeObject.ActiveComp, layerData);

            const result = await aex.get(AeObject.Layer(1));
            const layer = result.object;

            assertAreEqual(layer.effects, layerData.effects);
        });

        it('Create on layer', async () => {
            const effectData = {
                matchName: 'ADBE Fill',
                name: 'Fill - Default',
                type: AEX_EFFECT_PROPERTYGROUP,
            };

            await openProject('assets/layer_blank.aep');
            await aex.create(AeObject.Layer(1), effectData);

            const result = await aex.get(AeObject.Layer(1));
            const layer = result.object;

            assertAreEqual(layer.effects[layer.effects.length - 1], effectData);
        });

        it('Update', async () => {
            const effectData = {
                matchName: 'ADBE Fill',
                name: 'Fill - Updated',
                properties: [
                    {
                        matchName: 'ADBE Fill-0007',
                        type: AEX_ONED_PROPERTY,
                        value: 1,
                    },
                    {
                        matchName: 'ADBE Fill-0002',
                        type: AEX_COLOR_PROPERTY,
                        value: [1, 0.5, 0, 1],
                    },
                    {
                        matchName: 'ADBE Fill-0006',
                        type: AEX_ONED_PROPERTY,
                        value: 1,
                    },
                    {
                        matchName: 'ADBE Fill-0003',
                        type: AEX_ONED_PROPERTY,
                        value: 2.2,
                    },
                    {
                        matchName: 'ADBE Fill-0004',
                        type: AEX_ONED_PROPERTY,
                        value: 2.8,
                    },
                    {
                        matchName: 'ADBE Fill-0005',
                        type: AEX_ONED_PROPERTY,
                        value: 0.79,
                    },
                ],
                type: AEX_EFFECT_PROPERTYGROUP,
            };

            await openProject('assets/layer_effects.aep');
            await aex.update(AeObject.LayerProp(1, 'effect(1)'), effectData);

            const result = await aex.get(AeObject.Layer(1));
            const layer = result.object;

            assertAreEqual(layer.effects[0], effectData);
        });
    });

    describe('Simple Effect - Modified', async () => {
        it('Get', async () => {
            const { object: project } = await getProject('assets/layer_effects.aep', AeObject.Project);
            const simpleComp = project.comps.find((comp: any) => comp.name === 'Simple');

            assertAreEqual(simpleComp.layers[0].effects[1], {
                matchName: 'ADBE Fill',
                name: 'Fill - Modified',
                properties: [
                    {
                        matchName: 'ADBE Fill-0007',
                        type: AEX_ONED_PROPERTY,
                        value: 1,
                    },
                    {
                        matchName: 'ADBE Fill-0002',
                        type: AEX_COLOR_PROPERTY,
                        value: [1, 0.5, 0, 1],
                    },
                    {
                        matchName: 'ADBE Fill-0006',
                        type: AEX_ONED_PROPERTY,
                        value: 1,
                    },
                    {
                        matchName: 'ADBE Fill-0003',
                        type: AEX_ONED_PROPERTY,
                        value: 2.2,
                    },
                    {
                        matchName: 'ADBE Fill-0004',
                        type: AEX_ONED_PROPERTY,
                        value: 2.8,
                    },
                    {
                        matchName: 'ADBE Fill-0005',
                        type: AEX_ONED_PROPERTY,
                        value: 0.79,
                    },
                ],
                type: AEX_EFFECT_PROPERTYGROUP,
            });
        });

        it('Create on comp', async () => {
            const layerData = {
                effects: [
                    {
                        matchName: 'ADBE Fill',
                        name: 'Fill - Modified',
                        properties: [
                            {
                                matchName: 'ADBE Fill-0007',
                                type: AEX_ONED_PROPERTY,
                                value: 1,
                            },
                            {
                                matchName: 'ADBE Fill-0002',
                                type: AEX_COLOR_PROPERTY,
                                value: [1, 0.5, 0, 1],
                            },
                            {
                                matchName: 'ADBE Fill-0006',
                                type: AEX_ONED_PROPERTY,
                                value: 1,
                            },
                            {
                                matchName: 'ADBE Fill-0003',
                                type: AEX_ONED_PROPERTY,
                                value: 2.2,
                            },
                            {
                                matchName: 'ADBE Fill-0004',
                                type: AEX_ONED_PROPERTY,
                                value: 2.8,
                            },
                            {
                                matchName: 'ADBE Fill-0005',
                                type: AEX_ONED_PROPERTY,
                                value: 0.79,
                            },
                        ],
                        type: AEX_EFFECT_PROPERTYGROUP,
                    },
                ],
                type: AEX_NULL_LAYER,
            };

            await openCleanProject();
            await aex.createTestComp();
            await aex.create(AeObject.ActiveComp, layerData);

            const result = await aex.get(AeObject.Layer(1));
            const layer = result.object;

            assertAreEqual(layer.effects, layerData.effects);
        });

        it('Create on layer', async () => {
            const effectData = {
                matchName: 'ADBE Fill',
                name: 'Fill - Modified',
                properties: [
                    {
                        matchName: 'ADBE Fill-0007',
                        type: AEX_ONED_PROPERTY,
                        value: 1,
                    },
                    {
                        matchName: 'ADBE Fill-0002',
                        type: AEX_COLOR_PROPERTY,
                        value: [1, 0.5, 0, 1],
                    },
                    {
                        matchName: 'ADBE Fill-0006',
                        type: AEX_ONED_PROPERTY,
                        value: 1,
                    },
                    {
                        matchName: 'ADBE Fill-0003',
                        type: AEX_ONED_PROPERTY,
                        value: 2.2,
                    },
                    {
                        matchName: 'ADBE Fill-0004',
                        type: AEX_ONED_PROPERTY,
                        value: 2.8,
                    },
                    {
                        matchName: 'ADBE Fill-0005',
                        type: AEX_ONED_PROPERTY,
                        value: 0.79,
                    },
                ],
                type: AEX_EFFECT_PROPERTYGROUP,
            };

            await openProject('assets/layer_blank.aep');
            await aex.create(AeObject.Layer(1), effectData);

            const result = await aex.get(AeObject.Layer(1));
            const layer = result.object;

            assertAreEqual(layer.effects[layer.effects.length - 1], effectData);
        });

        it('Update Effect', async () => {
            const effectData = {
                matchName: 'ADBE Fill',
                name: 'Fill - Updated',
                properties: [
                    {
                        matchName: 'ADBE Fill-0007',
                        type: AEX_ONED_PROPERTY,
                        value: 1,
                    },
                    {
                        matchName: 'ADBE Fill-0002',
                        type: AEX_COLOR_PROPERTY,
                        value: [1, 0.5, 0, 1],
                    },
                    {
                        matchName: 'ADBE Fill-0006',
                        type: AEX_ONED_PROPERTY,
                        value: 1,
                    },
                    {
                        matchName: 'ADBE Fill-0003',
                        type: AEX_ONED_PROPERTY,
                        value: 2.2,
                    },
                    {
                        matchName: 'ADBE Fill-0004',
                        type: AEX_ONED_PROPERTY,
                        value: 2.8,
                    },
                    {
                        matchName: 'ADBE Fill-0005',
                        type: AEX_ONED_PROPERTY,
                        value: 0.79,
                    },
                ],
                type: AEX_EFFECT_PROPERTYGROUP,
            };

            await openProject('assets/layer_effects.aep');
            await aex.update(AeObject.LayerProp(1, 'effect(1)'), effectData);

            const result = await aex.get(AeObject.Layer(1));
            const layer = result.object;

            assertAreEqual(layer.effects[0], effectData);
        });
    });

    describe('Compositing Options', async () => {
        it('Get', async () => {
            const { object: project } = await getProject('assets/layer_effects.aep', AeObject.Project);
            const simpleComp = project.comps.find((comp: any) => comp.name === 'Simple');

            assertAreEqual(simpleComp.layers[0].effects[2], {
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
                                                matchName: 'ADBE Effect Path Stream Ref',
                                                type: AEX_ONED_PROPERTY,
                                                value: 1,
                                            },
                                        ],
                                    },
                                ],
                            },
                            {
                                matchName: 'ADBE Effect Mask Opacity',
                                type: AEX_ONED_PROPERTY,
                                value: 50,
                            },
                        ],
                    },
                ],
                type: AEX_EFFECT_PROPERTYGROUP,
            });
        });

        it('Create', async () => {
            const layerData = {
                effects: [
                    {
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
                                                        matchName: 'ADBE Effect Path Stream Ref',
                                                        type: AEX_ONED_PROPERTY,
                                                        value: 1,
                                                    },
                                                ],
                                            },
                                        ],
                                    },
                                    {
                                        matchName: 'ADBE Effect Mask Opacity',
                                        type: AEX_ONED_PROPERTY,
                                        value: 50,
                                    },
                                ],
                            },
                        ],
                        type: AEX_EFFECT_PROPERTYGROUP,
                    },
                ],
                masks: [
                    {
                        color: [1, 1, 1],
                        maskPath: {
                            type: AEX_SHAPE_PROPERTY,
                            matchName: 'ADBE Mask Shape',
                            name: 'Mask Path',
                            value: {
                                closed: true,
                                inTangents: [
                                    [100, 0],
                                    [0, -100],
                                    [-100, 0],
                                    [0, 100],
                                ],
                                outTangents: [
                                    [-100, 0],
                                    [0, 100],
                                    [100, 0],
                                    [0, -100],
                                ],
                                vertices: [
                                    [200, 100],
                                    [200, 300],
                                    [300, 400],
                                    [400, 300],
                                ],
                            },
                        },
                        name: 'Basic',
                    },
                ],
                type: AEX_NULL_LAYER,
            };

            await openCleanProject();
            await aex.createTestComp();
            await aex.create(AeObject.ActiveComp, layerData);

            const result = await aex.get(AeObject.Layer(1));
            const layer = result.object;

            assertAreEqual(layer.effects, layerData.effects);
        });

        it('Update Effect', async () => {
            const effectData = {
                matchName: 'ADBE Fill',
                name: 'Fill - Updated Compositing Options',
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
                                                matchName: 'ADBE Effect Path Stream Ref',
                                                type: AEX_ONED_PROPERTY,
                                                value: 1,
                                            },
                                        ],
                                    },
                                ],
                            },
                            {
                                matchName: 'ADBE Effect Mask Opacity',
                                type: AEX_ONED_PROPERTY,
                                value: 50,
                            },
                        ],
                    },
                ],
                type: AEX_EFFECT_PROPERTYGROUP,
            };

            await openProject('assets/layer_effects.aep');
            await aex.update(AeObject.LayerProp(1, 'effect(1)'), effectData);

            const result = await aex.get(AeObject.Layer(1));
            const layer = result.object;
            const compOptions = layer.effects[0].properties.find((effect: any) => effect.matchName == 'ADBE Effect Built In Params');

            assertAreEqual(compOptions, effectData.properties[0]);
        });
    });

    describe('Expression Controls - Default', async () => {
        it('Get', async () => {
            const { object: project } = await getProject('assets/layer_effects.aep', AeObject.Project);
            const simpleComp = project.comps.find((comp: any) => comp.name === 'Simple');
            assertAreEqual(simpleComp.layers[1].effects, [
                {
                    name: '3D Point Control',
                    matchName: 'ADBE Point3D Control',
                    type: AEX_EFFECT_PROPERTYGROUP,
                },
                {
                    name: 'Angle Control',
                    matchName: 'ADBE Angle Control',
                    type: AEX_EFFECT_PROPERTYGROUP,
                },
                {
                    name: 'Checkbox Control',
                    matchName: 'ADBE Checkbox Control',
                    type: AEX_EFFECT_PROPERTYGROUP,
                },
                {
                    name: 'Color Control',
                    matchName: 'ADBE Color Control',
                    type: AEX_EFFECT_PROPERTYGROUP,
                },
                {
                    name: 'Dropdown Menu Control',
                    matchName: 'Pseudo/@@DJHhoqupT8S4IxJ3m0KmfQ',
                    properties: [
                        {
                            items: ['Item 1', 'Item 2', 'Item 3'],
                        },
                    ],
                    type: AEX_DROPDOWN_EFFECT_PROPERTYGROUP,
                },
                {
                    name: 'Layer Control',
                    matchName: 'ADBE Layer Control',
                    type: AEX_EFFECT_PROPERTYGROUP,
                },
                {
                    name: 'Point Control',
                    matchName: 'ADBE Point Control',
                    type: AEX_EFFECT_PROPERTYGROUP,
                },
                {
                    name: 'Slider Control',
                    matchName: 'ADBE Slider Control',
                    type: AEX_EFFECT_PROPERTYGROUP,
                },
            ]);
        });

        it('Create', async () => {
            const layerData = {
                effects: [
                    {
                        name: '3D Point Control',
                        matchName: 'ADBE Point3D Control',
                        type: AEX_EFFECT_PROPERTYGROUP,
                    },
                    {
                        name: 'Angle Control',
                        matchName: 'ADBE Angle Control',
                        type: AEX_EFFECT_PROPERTYGROUP,
                    },
                    {
                        name: 'Checkbox Control',
                        matchName: 'ADBE Checkbox Control',
                        type: AEX_EFFECT_PROPERTYGROUP,
                    },
                    {
                        name: 'Color Control',
                        matchName: 'ADBE Color Control',
                        type: AEX_EFFECT_PROPERTYGROUP,
                    },
                    {
                        name: 'Dropdown Menu Control',
                        properties: [
                            {
                                items: ['Item 1', 'Item 2', 'Item 3'],
                            },
                        ],
                        type: AEX_DROPDOWN_EFFECT_PROPERTYGROUP,
                    },
                    {
                        name: 'Layer Control',
                        matchName: 'ADBE Layer Control',
                        type: AEX_EFFECT_PROPERTYGROUP,

                        linkedLayerIndices: [
                            {
                                propertyIndex: 1,
                                layerIndex: 1,
                            },
                        ],
                    },
                    {
                        name: 'Point Control',
                        matchName: 'ADBE Point Control',
                        type: AEX_EFFECT_PROPERTYGROUP,
                    },
                    {
                        name: 'Slider Control',
                        matchName: 'ADBE Slider Control',
                        type: AEX_EFFECT_PROPERTYGROUP,
                    },
                ],
                type: AEX_NULL_LAYER,
            };

            await openCleanProject();
            await aex.createTestComp();
            await aex.create(AeObject.ActiveComp, layerData);

            const result = await aex.get(AeObject.Layer(1));
            const layer = result.object;

            const dropdownEffect = layer.effects.find((effect: any) => effect.name === 'Dropdown Menu Control');
            delete dropdownEffect.matchName;

            assertAreEqual(layer.effects, layerData.effects);
        });
    });

    describe('Expression Controls - Modified', async () => {
        it('Get', async () => {
            const { object: project } = await getProject('assets/layer_effects.aep', AeObject.Project);
            const simpleComp = project.comps.find((comp: any) => comp.name === 'Simple');

            assertAreEqual(simpleComp.layers[2].effects, [
                {
                    name: '3D Point Control',
                    matchName: 'ADBE Point3D Control',
                    properties: [
                        {
                            matchName: 'ADBE Point3D Control-0001',
                            type: AEX_THREED_PROPERTY,
                            value: [0, 0, 0],
                        },
                    ],
                    type: AEX_EFFECT_PROPERTYGROUP,
                },
                {
                    name: 'Angle Control',
                    matchName: 'ADBE Angle Control',
                    properties: [
                        {
                            matchName: 'ADBE Angle Control-0001',
                            type: AEX_ONED_PROPERTY,
                            value: 100,
                        },
                    ],
                    type: AEX_EFFECT_PROPERTYGROUP,
                },
                {
                    name: 'Checkbox Control',
                    matchName: 'ADBE Checkbox Control',
                    properties: [
                        {
                            matchName: 'ADBE Checkbox Control-0001',
                            type: AEX_ONED_PROPERTY,
                            value: 1,
                        },
                    ],
                    type: AEX_EFFECT_PROPERTYGROUP,
                },
                {
                    name: 'Color Control',
                    matchName: 'ADBE Color Control',
                    properties: [
                        {
                            matchName: 'ADBE Color Control-0001',
                            type: AEX_COLOR_PROPERTY,
                            value: [0, 0.5, 1, 1],
                        },
                    ],
                    type: AEX_EFFECT_PROPERTYGROUP,
                },
                {
                    name: 'Dropdown Menu Control',
                    matchName: 'Pseudo/@@DJHhoqupT8S4IxJ3m0KmfQ',
                    properties: [
                        {
                            items: ['Item 1', 'Item 2', 'Item 3'],
                            matchName: 'Pseudo/@@DJHhoqupT8S4IxJ3m0KmfQ-0001',
                            type: AEX_ONED_PROPERTY,
                            value: 3,
                        },
                    ],
                    type: AEX_DROPDOWN_EFFECT_PROPERTYGROUP,
                },
                {
                    name: 'Layer Control',
                    matchName: 'ADBE Layer Control',
                    properties: [
                        {
                            matchName: 'ADBE Layer Control-0001',
                            type: AEX_ONED_PROPERTY,
                            value: 1,
                        },
                    ],
                    type: AEX_EFFECT_PROPERTYGROUP,
                },
                {
                    name: 'Point Control',
                    matchName: 'ADBE Point Control',
                    properties: [
                        {
                            matchName: 'ADBE Point Control-0001',
                            type: AEX_TWOD_PROPERTY,
                            value: [100, 200],
                        },
                    ],
                    type: AEX_EFFECT_PROPERTYGROUP,
                },
                {
                    name: 'Slider Control',
                    matchName: 'ADBE Slider Control',
                    properties: [
                        {
                            matchName: 'ADBE Slider Control-0001',
                            type: AEX_ONED_PROPERTY,
                            value: 300,
                        },
                    ],
                    type: AEX_EFFECT_PROPERTYGROUP,
                },
            ]);
        });

        it('Create on project', async () => {
            const compData = {
                layers: [
                    {
                        effects: [
                            {
                                name: '3D Point Control',
                                matchName: 'ADBE Point3D Control',
                                properties: [
                                    {
                                        matchName: 'ADBE Point3D Control-0001',
                                        type: AEX_THREED_PROPERTY,
                                        value: [0, 0, 0],
                                    },
                                ],
                                type: AEX_EFFECT_PROPERTYGROUP,
                            },
                            {
                                name: 'Angle Control',
                                matchName: 'ADBE Angle Control',
                                properties: [
                                    {
                                        matchName: 'ADBE Angle Control-0001',
                                        type: AEX_ONED_PROPERTY,
                                        value: 100,
                                    },
                                ],
                                type: AEX_EFFECT_PROPERTYGROUP,
                            },
                            {
                                name: 'Checkbox Control',
                                matchName: 'ADBE Checkbox Control',
                                properties: [
                                    {
                                        matchName: 'ADBE Checkbox Control-0001',
                                        type: AEX_ONED_PROPERTY,
                                        value: 1,
                                    },
                                ],
                                type: AEX_EFFECT_PROPERTYGROUP,
                            },
                            {
                                name: 'Color Control',
                                matchName: 'ADBE Color Control',
                                properties: [
                                    {
                                        matchName: 'ADBE Color Control-0001',
                                        type: AEX_COLOR_PROPERTY,
                                        value: [0, 0.5, 1, 1],
                                    },
                                ],
                                type: AEX_EFFECT_PROPERTYGROUP,
                            },
                            {
                                name: 'Dropdown Menu Control',
                                properties: [
                                    {
                                        items: ['Item 1', 'Item 2', 'Item 3'],
                                        type: AEX_ONED_PROPERTY,
                                        value: 3,
                                    },
                                ],
                                type: AEX_DROPDOWN_EFFECT_PROPERTYGROUP,
                            },
                            {
                                name: 'Layer Control',
                                matchName: 'ADBE Layer Control',
                                properties: [
                                    {
                                        matchName: 'ADBE Layer Control-0001',
                                        type: AEX_ONED_PROPERTY,
                                        value: 2,
                                    },
                                ],
                                linkedLayerIndices: [
                                    {
                                        propertyIndex: 1,
                                        layerIndex: 2,
                                    },
                                ],
                                type: AEX_EFFECT_PROPERTYGROUP,
                            },
                            {
                                name: 'Point Control',
                                matchName: 'ADBE Point Control',
                                properties: [
                                    {
                                        matchName: 'ADBE Point Control-0001',
                                        type: AEX_TWOD_PROPERTY,
                                        value: [100, 200],
                                    },
                                ],
                                type: AEX_EFFECT_PROPERTYGROUP,
                            },
                            {
                                name: 'Slider Control',
                                matchName: 'ADBE Slider Control',
                                properties: [
                                    {
                                        matchName: 'ADBE Slider Control-0001',
                                        type: AEX_ONED_PROPERTY,
                                        value: 300,
                                    },
                                ],
                                type: AEX_EFFECT_PROPERTYGROUP,
                            },
                        ],
                        type: AEX_NULL_LAYER,
                    },
                    {
                        type: AEX_NULL_LAYER,
                    },
                ],
                type: AEX_COMP_ITEM,
            };

            await aex.create(AeObject.Project, compData);

            const result = await aex.get(AeObject.Layer(1));
            const layer = result.object;

            const dropdownEffect = layer.effects.find((effect: any) => effect.name === 'Dropdown Menu Control');
            delete dropdownEffect.matchName;
            delete dropdownEffect.properties[0].matchName;

            assertAreEqual(layer.effects, compData.layers[0].effects);
        });

        it('Create on layer', async () => {
            const effectData = {
                name: 'Dropdown Menu Control',
                properties: [
                    {
                        items: ['Item 1', 'Item 2', 'Item 3'],
                        type: AEX_ONED_PROPERTY,
                        value: 3,
                    },
                ],
                type: AEX_DROPDOWN_EFFECT_PROPERTYGROUP,
            };

            await openProject('assets/layer_blank.aep');
            await aex.create(AeObject.Layer(1), effectData);

            const result = await aex.get(AeObject.Layer(1));
            const layer = result.object;

            const dropdownEffect = layer.effects.find((effect: any) => effect.name === 'Dropdown Menu Control');
            delete dropdownEffect.matchName;
            delete dropdownEffect.properties[0].matchName;

            assertAreEqual(layer.effects[layer.effects.length - 1], effectData);
        });

        it('Update', async () => {
            const effectData = {
                name: '3D Point Control',
                matchName: 'ADBE Point3D Control',
                properties: [
                    {
                        matchName: 'ADBE Point3D Control-0001',
                        type: AEX_THREED_PROPERTY,
                        value: [0, 0, 0],
                    },
                ],
                type: AEX_EFFECT_PROPERTYGROUP,
            };

            await openProject('assets/layer_effects.aep');

            await aex.update(AeObject.LayerProp(2, 'effect(1)'), effectData);

            const result = await aex.get(AeObject.Layer(2));
            const layer = result.object;

            assertAreEqual(layer.effects[0], effectData);
        });
    });

    describe('Nested Effect Groups', async () => {
        it('Get', async () => {
            const { object: project } = await getProject('assets/layer_effects.aep', AeObject.Project);
            const simpleComp = project.comps.find((comp: any) => comp.name === 'Simple');

            assertAreEqual(simpleComp.layers[3].effects[0], {
                matchName: 'ADBE Fractal Noise',
                name: 'Fractal Noise',
                properties: [
                    {
                        matchName: 'ADBE Fractal Noise-0010',
                        type: AEX_ONED_PROPERTY,
                        value: 123,
                    },
                ],
                type: AEX_EFFECT_PROPERTYGROUP,
            });
        });

        it('Create on comp', async () => {
            const layerData = {
                effects: [
                    {
                        matchName: 'ADBE Fractal Noise',
                        name: 'Fractal Noise',
                        properties: [
                            {
                                matchName: 'ADBE Fractal Noise-0010',
                                type: AEX_ONED_PROPERTY,
                                value: 123,
                            },
                        ],
                        type: AEX_EFFECT_PROPERTYGROUP,
                    },
                ],
                type: AEX_NULL_LAYER,
            };

            await openCleanProject();
            await aex.createTestComp();
            await aex.create(AeObject.ActiveComp, layerData);

            const result = await aex.get(AeObject.Layer(1));
            const layer = result.object;

            assertAreEqual(layer.effects, layerData.effects);
        });

        it('Create on layer', async () => {
            const effectData = {
                matchName: 'ADBE Fractal Noise',
                name: 'Fractal Noise',
                properties: [
                    {
                        matchName: 'ADBE Fractal Noise-0010',
                        type: AEX_ONED_PROPERTY,
                        value: 123,
                    },
                ],
                type: AEX_EFFECT_PROPERTYGROUP,
            };

            await openProject('assets/layer_blank.aep');
            await aex.create(AeObject.Layer(1), effectData);

            const result = await aex.get(AeObject.Layer(1));
            const layer = result.object;

            assertAreEqual(layer.effects[layer.effects.length - 1], effectData);
        });

        it('Update', async () => {
            const effectData = {
                matchName: 'ADBE Fractal Noise',
                name: 'Updated Fractal Noise',
                properties: [
                    {
                        matchName: 'ADBE Fractal Noise-0010',
                        type: AEX_ONED_PROPERTY,
                        value: 98.76,
                    },
                ],
                type: AEX_EFFECT_PROPERTYGROUP,
            };

            await openProject('assets/layer_effects.aep');
            await aex.update(AeObject.LayerProp(4, 'effect(1)'), effectData);

            const result = await aex.get(AeObject.Layer(4));
            const layer = result.object;

            assertAreEqual(layer.effects[0], effectData);
        });
    });

    describe('Puppet pins', async () => {
        it('Get', async () => {
            const { object: project } = await getProject('assets/layer_effects.aep', AeObject.Project);
            const puppetComp = project.comps.find((comp: any) => comp.name === 'Puppet Pins');
            assertAreEqual(puppetComp.layers[0].effects[0], {
                name: 'Puppet',
                matchName: 'ADBE FreePin3',
                properties: [
                    {
                        matchName: 'ADBE FreePin3 ARAP Group',
                        properties: [
                            {
                                matchName: 'ADBE FreePin3 Mesh Group',
                                properties: [
                                    {
                                        matchName: 'ADBE FreePin3 Mesh Atom',
                                        name: 'Custom Mesh Name',
                                        properties: [
                                            {
                                                type: AEX_ONED_PROPERTY,
                                                matchName: 'ADBE FreePin3 Mesh Tri Count',
                                                value: 50,
                                            },
                                            {
                                                matchName: 'ADBE FreePin3 PosPins',
                                                properties: [
                                                    {
                                                        matchName: 'ADBE FreePin3 PosPin Atom',
                                                        name: 'Puppet Pin 2',
                                                        properties: [
                                                            {
                                                                type: AEX_ONED_PROPERTY,
                                                                matchName: 'ADBE FreePin3 PosPin Vtx Index',
                                                                value: 12,
                                                            },
                                                            {
                                                                type: AEX_TWOD_PROPERTY,
                                                                matchName: 'ADBE FreePin3 PosPin Position',
                                                                value: [13, 482],
                                                            },
                                                        ],
                                                    },
                                                    {
                                                        matchName: 'ADBE FreePin3 PosPin Atom',
                                                        name: 'Custom Pin 1',
                                                        properties: [
                                                            {
                                                                type: AEX_ONED_PROPERTY,
                                                                matchName: 'ADBE FreePin3 PosPin Vtx Index',
                                                                value: 13,
                                                            },
                                                            {
                                                                type: AEX_TWOD_PROPERTY,
                                                                matchName: 'ADBE FreePin3 PosPin Position',
                                                                value: [15, 14],
                                                                keys: [
                                                                    {
                                                                        value: [15, 14],
                                                                        time: 0,
                                                                        type: AEX_KEY,
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
                                                                                    speed: 147.69231,
                                                                                },
                                                                            ],
                                                                        },
                                                                        spatialTangent: {
                                                                            inTangent: [0, 0],
                                                                            outTangent: [0, 0],
                                                                        },
                                                                        spatialContinuous: true,
                                                                    },
                                                                    {
                                                                        value: [15, 254],
                                                                        time: 1.625,
                                                                        type: AEX_KEY,
                                                                        temporalEase: {
                                                                            inEase: [
                                                                                {
                                                                                    influence: 16.66667,
                                                                                    speed: 147.69231,
                                                                                },
                                                                            ],
                                                                            outEase: [
                                                                                {
                                                                                    influence: 16.66667,
                                                                                    speed: 0,
                                                                                },
                                                                            ],
                                                                        },
                                                                        spatialTangent: {
                                                                            inTangent: [0, 0],
                                                                            outTangent: [0, 0],
                                                                        },
                                                                        spatialContinuous: true,
                                                                    },
                                                                ],
                                                            },
                                                        ],
                                                    },
                                                ],
                                            },
                                        ],
                                    },
                                ],
                            },
                        ],
                    },
                ],
                type: AEX_EFFECT_PROPERTYGROUP,
            });
        });
    });

    describe('Rotobrush Effect', async () => {
        it('Get', async () => {
            const { object: project } = await getProject('assets/layer_effects.aep', AeObject.Project);
            const rotobrushComp = project.comps.find((comp: any) => comp.name === 'Rotobrush');
            assertAreEqual(rotobrushComp.layers[0].effects[0], {
                name: 'Roto Brush & Refine Edge',
                matchName: 'ADBE Samurai',
                properties: [
                    {
                        matchName: 'ADBE Samurai Strokes Group',
                        properties: [
                            {
                                matchName: 'ADBE Paint Atom',
                                name: 'Foreground 1',
                                properties: [
                                    {
                                        type: AEX_TWOD_PROPERTY,
                                        matchName: 'ADBE Paint Duration',
                                        value: [0, 1.25],
                                    },
                                    {
                                        matchName: 'ADBE Paint Properties',
                                        properties: [
                                            {
                                                type: AEX_COLOR_PROPERTY,
                                                matchName: 'ADBE Paint Color',
                                                value: [0, 1, 0, 1],
                                            },
                                            {
                                                type: AEX_ONED_PROPERTY,
                                                matchName: 'ADBE Paint Clone Layer',
                                                value: 0,
                                            },
                                        ],
                                    },
                                ],
                            },
                        ],
                    },
                ],
                type: AEX_EFFECT_PROPERTYGROUP,
            });
        });
    });
});
