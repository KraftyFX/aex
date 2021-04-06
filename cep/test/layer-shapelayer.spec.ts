import { expect } from 'chai';
import { AeObject, aex } from './aex';
import { AEX_COLOR_PROPERTY, AEX_LIGHT_LAYER, AEX_ONED_PROPERTY, AEX_SHAPE_LAYER } from './constants';
import { cleanupAeqIpc, cleanupAex, evalAexIntoESTK, openProject } from './csinterface';
import { assertAreEqual } from './utils';

describe.only('Shape Layers', function () {
    this.slow(500);
    this.timeout(2000);

    let result: any;

    before(async () => {
        await evalAexIntoESTK();
        await openProject('testAssets/layer_shapelayer.aep');
        result = await aex().toObjectWithAeObject(AeObject.ActiveComp);
        console.log('layer_shapelayer', result);
    });

    after(async () => {
        await cleanupAex();
        await cleanupAeqIpc();
    });

    it(`Can parse empty shape layers`, async () => {
        expect(result.comps[0].layers[0]).property('contents').to.be.empty;
    });

    it(`Can parse default shape layers`, async () => {
        assertAreEqual(result.comps[0].layers[1], {
            collapseTransformation: true,
            contents: [
                {
                    enabled: true,
                    matchName: 'ADBE Vector Group',
                    name: 'Rectangle 1',
                },
            ],
            effects: [],
            label: 8,
            markers: [],
            masks: [],
            name: 'Default',
            transform: {},
            type: AEX_SHAPE_LAYER,
        });
    });

    it(`Can parse modified shape layers`, async () => {
        assertAreEqual(result.comps[0].layers[2].contents[0], {
            enabled: true,
            matchName: 'ADBE Vector Group',
            name: 'Rectangle 1',
            properties: [
                {
                    keys: [],
                    matchName: 'ADBE Vector Blend Mode',
                    name: 'Blend Mode',
                    type: AEX_ONED_PROPERTY,
                    value: 15,
                },
                {
                    matchName: 'ADBE Vectors Group',
                    properties: [
                        {
                            matchName: 'ADBE Vector Shape - Rect',
                            name: 'Rectangle Path 1',
                            enabled: false,
                            properties: [
                                {
                                    keys: [],
                                    matchName: 'ADBE Vector Shape Direction',
                                    name: 'Shape Direction',
                                    type: 'aex:property:oned',
                                    value: 2,
                                },
                                {
                                    keys: [],
                                    matchName: 'ADBE Vector Rect Size',
                                    name: 'Size',
                                    type: 'aex:property:twod',
                                    value: [100, 200],
                                },
                                {
                                    keys: [],
                                    matchName: 'ADBE Vector Rect Position',
                                    name: 'Position',
                                    type: 'aex:property:twod',
                                    value: [30, 40],
                                },
                                {
                                    keys: [],
                                    matchName: 'ADBE Vector Rect Roundness',
                                    name: 'Roundness',
                                    type: 'aex:property:oned',
                                    value: 50,
                                },
                            ],
                        },
                        {
                            matchName: 'ADBE Vector Graphic - Stroke',
                            name: 'Stroke 1',
                            properties: [
                                {
                                    keys: [],
                                    matchName: 'ADBE Vector Blend Mode',
                                    name: 'Blend Mode',
                                    type: 'aex:property:oned',
                                    value: 17,
                                },
                                {
                                    keys: [],
                                    matchName: 'ADBE Vector Composite Order',
                                    name: 'Composite',
                                    type: 'aex:property:oned',
                                    value: 2,
                                },
                                {
                                    keys: [],
                                    matchName: 'ADBE Vector Stroke Color',
                                    name: 'Color',
                                    type: 'aex:property:color',
                                    value: [1, 0.5, 0, 1],
                                },
                                {
                                    keys: [],
                                    matchName: 'ADBE Vector Stroke Opacity',
                                    name: 'Opacity',
                                    type: 'aex:property:oned',
                                    value: 70,
                                },
                                {
                                    keys: [],
                                    matchName: 'ADBE Vector Stroke Width',
                                    name: 'Stroke Width',
                                    type: 'aex:property:oned',
                                    value: 80,
                                },
                                {
                                    keys: [],
                                    matchName: 'ADBE Vector Stroke Line Cap',
                                    name: 'Line Cap',
                                    type: 'aex:property:oned',
                                    value: 2,
                                },
                                {
                                    keys: [],
                                    matchName: 'ADBE Vector Stroke Line Join',
                                    name: 'Line Join',
                                    type: 'aex:property:oned',
                                    value: 2,
                                },
                            ],
                        },
                        {
                            matchName: 'ADBE Vector Graphic - Fill',
                            name: 'Fill 1',
                            properties: [
                                {
                                    keys: [],
                                    matchName: 'ADBE Vector Blend Mode',
                                    name: 'Blend Mode',
                                    type: 'aex:property:oned',
                                    value: 23,
                                },
                                {
                                    keys: [],
                                    matchName: 'ADBE Vector Composite Order',
                                    name: 'Composite',
                                    type: 'aex:property:oned',
                                    value: 2,
                                },
                                {
                                    keys: [],
                                    matchName: 'ADBE Vector Fill Rule',
                                    name: 'Fill Rule',
                                    type: 'aex:property:oned',
                                    value: 2,
                                },
                                {
                                    keys: [],
                                    matchName: 'ADBE Vector Fill Color',
                                    name: 'Color',
                                    type: 'aex:property:color',
                                    value: [1, 0.5, 0, 1],
                                },
                                {
                                    keys: [],
                                    matchName: 'ADBE Vector Fill Opacity',
                                    name: 'Opacity',
                                    type: 'aex:property:oned',
                                    value: 50,
                                },
                            ],
                        },
                    ],
                },
                {
                    matchName: 'ADBE Vector Transform Group',
                    properties: [
                        {
                            type: 'aex:property:twod',
                            name: 'Anchor Point',
                            matchName: 'ADBE Vector Anchor',
                            value: [10, 20],
                            keys: [],
                        },
                        {
                            type: 'aex:property:twod',
                            name: 'Position',
                            matchName: 'ADBE Vector Position',
                            value: [30, 40],
                            keys: [],
                        },
                        {
                            type: 'aex:property:twod',
                            name: 'Scale',
                            matchName: 'ADBE Vector Scale',
                            value: [50, 50],
                            keys: [],
                        },
                        {
                            type: 'aex:property:oned',
                            name: 'Skew',
                            matchName: 'ADBE Vector Skew',
                            value: 60,
                            keys: [],
                        },
                        {
                            type: 'aex:property:oned',
                            name: 'Skew Axis',
                            matchName: 'ADBE Vector Skew Axis',
                            value: 70,
                            keys: [],
                        },
                        {
                            type: 'aex:property:oned',
                            name: 'Rotation',
                            matchName: 'ADBE Vector Rotation',
                            value: 80,
                            keys: [],
                        },
                        {
                            type: 'aex:property:oned',
                            name: 'Opacity',
                            matchName: 'ADBE Vector Group Opacity',
                            value: 90,
                            keys: [],
                        },
                    ],
                },
            ],
        });
    });

    it(`Can parse multiple shapes on one layer`, async () => {
        assertAreEqual(result.comps[0].layers[3], {
            collapseTransformation: true,
            contents: [
                {
                    enabled: true,
                    matchName: 'ADBE Vector Group',
                    name: 'Rectangle 1',
                },
                {
                    enabled: true,
                    matchName: 'ADBE Vector Group',
                    name: 'Rectangle 2',
                },
            ],
            effects: [],
            label: 8,
            markers: [],
            masks: [],
            name: 'Multiple Default',
            transform: {},
            type: AEX_SHAPE_LAYER,
        });
    });

    /** @todo */
    it.skip(`Can parse shape dashes`, async () => {
        assertAreEqual(result.comps[0].layers[4].contents[0].properties, [
            {
                matchName: 'ADBE Vectors Group',
                properties: [
                    {
                        matchName: 'ADBE Vector Graphic - Stroke',
                        name: 'Stroke 1',
                        properties: [
                            {
                                matchName: 'ADBE Vector Stroke Dashes',
                                properties: [
                                    {
                                        keys: [],
                                        matchName: 'ADBE Vector Stroke Dash 1',
                                        name: 'Dash',
                                        type: AEX_ONED_PROPERTY,
                                        value: 10,
                                    },
                                ],
                            },
                        ],
                    },
                ],
            },
        ]);
    });
});
