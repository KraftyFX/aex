import { AeObject, aex } from '../aex';
import {
    AEX_COLOR_PROPERTY,
    AEX_COMP_ITEM,
    AEX_DROPDOWN_EFFECT_PROPERTYGROUP,
    AEX_EFFECT_PROPERTYGROUP,
    AEX_NULL_LAYER,
    AEX_ONED_PROPERTY,
    AEX_SHAPE_PROPERTY,
    AEX_THREED_PROPERTY,
    AEX_TWOD_PROPERTY,
} from '../constants';
import { cleanupAex, evalAexIntoEstk, openCleanProject, openProject } from '../csinterface';
import { assertAreEqual } from '../utils';

describe('Layer Effects', function () {
    this.slow(500);
    this.timeout(5000);

    before(async () => {
        await evalAexIntoEstk();
    });

    after(async () => {
        await cleanupAex();
    });

    describe('Get', async () => {
        let puppetComp: any;
        let simpleComp: any;
        let rotobrushComp: any;

        before(async () => {
            await openProject('testAssets/layer_effects.aep');

            const result = await aex().get(AeObject.Project);
            const project = result.object;
            puppetComp = project.comps.find((comp: any) => comp.name === 'Puppet Pins');
            simpleComp = project.comps.find((comp: any) => comp.name === 'Simple');
            rotobrushComp = project.comps.find((comp: any) => comp.name === 'Rotobrush');

            console.log('layer_effects', project);
        });

        it('Can parse simple unmodified effect', async () => {
            assertAreEqual(simpleComp.layers[0].effects[0], {
                matchName: 'ADBE Fill',
                name: 'Fill - Default',
                type: AEX_EFFECT_PROPERTYGROUP,
            });
        });

        it('Can parse simple modified effect', async () => {
            assertAreEqual(simpleComp.layers[0].effects[1], {
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
                type: AEX_EFFECT_PROPERTYGROUP,
            });
        });

        it('Can parse effect compositing options', async () => {
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
                type: AEX_EFFECT_PROPERTYGROUP,
            });
        });

        it('Can parse default expression controls', async () => {
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

        it('Can parse modified expression controls', async () => {
            assertAreEqual(simpleComp.layers[2].effects, [
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
                    type: AEX_EFFECT_PROPERTYGROUP,
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
                    type: AEX_EFFECT_PROPERTYGROUP,
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
                    type: AEX_EFFECT_PROPERTYGROUP,
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
                    type: AEX_EFFECT_PROPERTYGROUP,
                },
                {
                    name: 'Dropdown Menu Control',
                    matchName: 'Pseudo/@@DJHhoqupT8S4IxJ3m0KmfQ',
                    properties: [
                        {
                            keys: [],
                            items: ['Item 1', 'Item 2', 'Item 3'],
                            matchName: 'Pseudo/@@DJHhoqupT8S4IxJ3m0KmfQ-0001',
                            name: 'Menu',
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
                            keys: [],
                            matchName: 'ADBE Layer Control-0001',
                            name: 'Layer',
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
                            keys: [],
                            matchName: 'ADBE Point Control-0001',
                            name: 'Point',
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
                            keys: [],
                            matchName: 'ADBE Slider Control-0001',
                            name: 'Slider',
                            type: AEX_ONED_PROPERTY,
                            value: 300,
                        },
                    ],
                    type: AEX_EFFECT_PROPERTYGROUP,
                },
            ]);
        });

        it('Can parse nested effect groups', async () => {
            assertAreEqual(simpleComp.layers[3].effects[0], {
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
                type: AEX_EFFECT_PROPERTYGROUP,
            });
        });

        it('Can parse puppet pins', async () => {
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
                                                name: 'Triangles',
                                                matchName: 'ADBE FreePin3 Mesh Tri Count',
                                                value: 50,
                                                keys: [],
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
                                                                name: 'Vertex Index',
                                                                matchName: 'ADBE FreePin3 PosPin Vtx Index',
                                                                value: 12,
                                                                keys: [],
                                                            },
                                                            {
                                                                type: AEX_TWOD_PROPERTY,
                                                                name: 'Position',
                                                                matchName: 'ADBE FreePin3 PosPin Position',
                                                                value: [13, 482],
                                                                keys: [],
                                                            },
                                                        ],
                                                    },
                                                    {
                                                        matchName: 'ADBE FreePin3 PosPin Atom',
                                                        name: 'Custom Pin 1',
                                                        properties: [
                                                            {
                                                                type: AEX_ONED_PROPERTY,
                                                                name: 'Vertex Index',
                                                                matchName: 'ADBE FreePin3 PosPin Vtx Index',
                                                                value: 13,
                                                                keys: [],
                                                            },
                                                            {
                                                                type: AEX_TWOD_PROPERTY,
                                                                name: 'Position',
                                                                matchName: 'ADBE FreePin3 PosPin Position',
                                                                value: [15, 14],
                                                                keys: [
                                                                    {
                                                                        value: [15, 14],
                                                                        time: 0,
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

        it('Can parse rotobrush effect', async () => {
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
                                        name: 'Duration',
                                        matchName: 'ADBE Paint Duration',
                                        value: [0, 1.25],
                                        keys: [],
                                    },
                                    {
                                        matchName: 'ADBE Paint Properties',
                                        properties: [
                                            {
                                                type: AEX_COLOR_PROPERTY,
                                                name: 'Color',
                                                matchName: 'ADBE Paint Color',
                                                value: [0, 1, 0, 1],
                                                keys: [],
                                            },
                                            {
                                                type: AEX_ONED_PROPERTY,
                                                name: 'Clone Source',
                                                matchName: 'ADBE Paint Clone Layer',
                                                value: 0,
                                                keys: [],
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

    describe('Create', async () => {
        before(async () => {
            await openCleanProject();
        });

        it('Can create simple unmodified effect', async () => {
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

            await aex().createTestComp();
            await aex().create(AeObject.ActiveComp, layerData);

            const result = await aex().get(AeObject.Layer(1));
            const layer = result.object;

            assertAreEqual(layer.effects, layerData.effects);
        });

        it('Can create simple modified effect', async () => {
            const layerData = {
                effects: [
                    {
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
                        type: AEX_EFFECT_PROPERTYGROUP,
                    },
                ],
                type: AEX_NULL_LAYER,
            };

            await aex().createTestComp();
            await aex().create(AeObject.ActiveComp, layerData);

            const result = await aex().get(AeObject.Layer(1));
            const layer = result.object;

            assertAreEqual(layer.effects, layerData.effects);
        });

        it('Can create effect compositing options', async () => {
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
                        type: AEX_EFFECT_PROPERTYGROUP,
                    },
                ],
                masks: [
                    {
                        color: [1, 1, 1],
                        maskPath: {
                            type: AEX_SHAPE_PROPERTY,
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

            await aex().createTestComp();
            await aex().create(AeObject.ActiveComp, layerData);

            const result = await aex().get(AeObject.Layer(1));
            const layer = result.object;

            assertAreEqual(layer.effects, layerData.effects);
        });

        it('Can create default expression controls', async () => {
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

            await aex().createTestComp();
            await aex().create(AeObject.ActiveComp, layerData);

            const result = await aex().get(AeObject.Layer(1));
            const layer = result.object;

            const dropdownEffect = layer.effects.find((effect: any) => effect.name === 'Dropdown Menu Control');
            delete dropdownEffect.matchName;

            assertAreEqual(layer.effects, layerData.effects);
        });

        it('Can create modified expression controls', async () => {
            const compData = {
                layers: [
                    {
                        effects: [
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
                                type: AEX_EFFECT_PROPERTYGROUP,
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
                                type: AEX_EFFECT_PROPERTYGROUP,
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
                                type: AEX_EFFECT_PROPERTYGROUP,
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
                                type: AEX_EFFECT_PROPERTYGROUP,
                            },
                            {
                                name: 'Dropdown Menu Control',
                                properties: [
                                    {
                                        keys: [],
                                        items: ['Item 1', 'Item 2', 'Item 3'],
                                        name: 'Menu',
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
                                        keys: [],
                                        matchName: 'ADBE Layer Control-0001',
                                        name: 'Layer',
                                        type: AEX_ONED_PROPERTY,
                                        value: 2,
                                    },
                                ],
                                type: AEX_EFFECT_PROPERTYGROUP,
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
                                type: AEX_EFFECT_PROPERTYGROUP,
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

            await aex().create(AeObject.Project, compData);

            const result = await aex().get(AeObject.Layer(1));
            const layer = result.object;

            const dropdownEffect = layer.effects.find((effect: any) => effect.name === 'Dropdown Menu Control');
            delete dropdownEffect.matchName;
            delete dropdownEffect.properties[0].matchName;

            assertAreEqual(layer.effects, compData.layers[0].effects);
        });

        it('Can create nested effect groups', async () => {
            const layerData = {
                effects: [
                    {
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
                        type: AEX_EFFECT_PROPERTYGROUP,
                    },
                ],
                type: AEX_NULL_LAYER,
            };

            await aex().createTestComp();
            await aex().create(AeObject.ActiveComp, layerData);

            const result = await aex().get(AeObject.Layer(1));
            const layer = result.object;

            assertAreEqual(layer.effects, layerData.effects);
        });
    });
});
