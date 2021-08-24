import { expect } from 'chai';
import { AeObject, aex } from '../aex';
import {
    AEX_COLOR_PROPERTY,
    AEX_ONED_PROPERTY,
    AEX_SHAPEGROUP_PROPERTYGROUP,
    AEX_SHAPEITEM_PROPERTYGROUP,
    AEX_SHAPE_LAYER,
    AEX_TWOD_PROPERTY,
} from '../constants';
import { cleanupAex, evalAexIntoEstk, openCleanProject, openProject } from '../csinterface';
import { assertAreEqual } from '../utils';

describe('Shape Layers', function () {
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
            await openProject('testAssets/layer_shapelayer.aep');
            const result = await aex().get(AeObject.ActiveComp);
            comp = result.object;
            console.log('layer_shapelayer', comp);
        });

        it(`Can parse empty shape layers`, async () => {
            expect(comp.layers[0]).property('contents').to.be.empty;
        });

        it(`Can parse default shape layers`, async () => {
            assertAreEqual(comp.layers[1], {
                contents: [
                    {
                        matchName: 'ADBE Vector Group',
                        name: 'Rectangle 1',
                        contents: [
                            {
                                matchName: 'ADBE Vector Shape - Rect',
                                name: 'Rectangle Path 1',
                                type: AEX_SHAPEITEM_PROPERTYGROUP,
                            },
                            {
                                matchName: 'ADBE Vector Graphic - Stroke',
                                name: 'Stroke 1',
                                type: AEX_SHAPEITEM_PROPERTYGROUP,
                            },
                            {
                                matchName: 'ADBE Vector Graphic - Fill',
                                name: 'Fill 1',
                                type: AEX_SHAPEITEM_PROPERTYGROUP,
                            },
                        ],
                        type: AEX_SHAPEGROUP_PROPERTYGROUP,
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
            assertAreEqual(comp.layers[2].contents[0], {
                contents: [
                    {
                        enabled: false,
                        matchName: 'ADBE Vector Shape - Rect',
                        name: 'Rectangle Path 1',
                        properties: [
                            {
                                keys: [],
                                matchName: 'ADBE Vector Shape Direction',
                                name: 'Shape Direction',
                                type: AEX_ONED_PROPERTY,
                                value: 2,
                            },
                            {
                                keys: [],
                                matchName: 'ADBE Vector Rect Size',
                                name: 'Size',
                                type: AEX_TWOD_PROPERTY,
                                value: [100, 200],
                            },
                            {
                                keys: [],
                                matchName: 'ADBE Vector Rect Position',
                                name: 'Position',
                                type: AEX_TWOD_PROPERTY,
                                value: [30, 40],
                            },
                            {
                                keys: [],
                                matchName: 'ADBE Vector Rect Roundness',
                                name: 'Roundness',
                                type: AEX_ONED_PROPERTY,
                                value: 50,
                            },
                        ],
                        type: AEX_SHAPEITEM_PROPERTYGROUP,
                    },
                    {
                        matchName: 'ADBE Vector Graphic - Stroke',
                        name: 'Stroke 1',
                        properties: [
                            {
                                keys: [],
                                matchName: 'ADBE Vector Blend Mode',
                                name: 'Blend Mode',
                                type: AEX_ONED_PROPERTY,
                                value: 17,
                            },
                            {
                                keys: [],
                                matchName: 'ADBE Vector Composite Order',
                                name: 'Composite',
                                type: AEX_ONED_PROPERTY,
                                value: 2,
                            },
                            {
                                keys: [],
                                matchName: 'ADBE Vector Stroke Color',
                                name: 'Color',
                                type: AEX_COLOR_PROPERTY,
                                value: [1, 0.5, 0, 1],
                            },
                            {
                                keys: [],
                                matchName: 'ADBE Vector Stroke Opacity',
                                name: 'Opacity',
                                type: AEX_ONED_PROPERTY,
                                value: 70,
                            },
                            {
                                keys: [],
                                matchName: 'ADBE Vector Stroke Width',
                                name: 'Stroke Width',
                                type: AEX_ONED_PROPERTY,
                                value: 80,
                            },
                            {
                                keys: [],
                                matchName: 'ADBE Vector Stroke Line Cap',
                                name: 'Line Cap',
                                type: AEX_ONED_PROPERTY,
                                value: 2,
                            },
                            {
                                keys: [],
                                matchName: 'ADBE Vector Stroke Line Join',
                                name: 'Line Join',
                                type: AEX_ONED_PROPERTY,
                                value: 2,
                            },
                        ],
                        type: AEX_SHAPEITEM_PROPERTYGROUP,
                    },
                    {
                        matchName: 'ADBE Vector Graphic - Fill',
                        name: 'Fill 1',
                        properties: [
                            {
                                keys: [],
                                matchName: 'ADBE Vector Blend Mode',
                                name: 'Blend Mode',
                                type: AEX_ONED_PROPERTY,
                                value: 23,
                            },
                            {
                                keys: [],
                                matchName: 'ADBE Vector Composite Order',
                                name: 'Composite',
                                type: AEX_ONED_PROPERTY,
                                value: 2,
                            },
                            {
                                keys: [],
                                matchName: 'ADBE Vector Fill Rule',
                                name: 'Fill Rule',
                                type: AEX_ONED_PROPERTY,
                                value: 2,
                            },
                            {
                                keys: [],
                                matchName: 'ADBE Vector Fill Color',
                                name: 'Color',
                                type: AEX_COLOR_PROPERTY,
                                value: [1, 0.5, 0, 1],
                            },
                            {
                                keys: [],
                                matchName: 'ADBE Vector Fill Opacity',
                                name: 'Opacity',
                                type: AEX_ONED_PROPERTY,
                                value: 50,
                            },
                        ],
                        type: AEX_SHAPEITEM_PROPERTYGROUP,
                    },
                ],
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
                        matchName: 'ADBE Vector Transform Group',
                        properties: [
                            {
                                type: AEX_TWOD_PROPERTY,
                                name: 'Anchor Point',
                                matchName: 'ADBE Vector Anchor',
                                value: [10, 20],
                                keys: [],
                            },
                            {
                                type: AEX_TWOD_PROPERTY,
                                name: 'Position',
                                matchName: 'ADBE Vector Position',
                                value: [30, 40],
                                keys: [],
                            },
                            {
                                type: AEX_TWOD_PROPERTY,
                                name: 'Scale',
                                matchName: 'ADBE Vector Scale',
                                value: [50, 50],
                                keys: [],
                            },
                            {
                                type: AEX_ONED_PROPERTY,
                                name: 'Skew',
                                matchName: 'ADBE Vector Skew',
                                value: 60,
                                keys: [],
                            },
                            {
                                type: AEX_ONED_PROPERTY,
                                name: 'Skew Axis',
                                matchName: 'ADBE Vector Skew Axis',
                                value: 70,
                                keys: [],
                            },
                            {
                                type: AEX_ONED_PROPERTY,
                                name: 'Rotation',
                                matchName: 'ADBE Vector Rotation',
                                value: 80,
                                keys: [],
                            },
                            {
                                type: AEX_ONED_PROPERTY,
                                name: 'Opacity',
                                matchName: 'ADBE Vector Group Opacity',
                                value: 90,
                                keys: [],
                            },
                        ],
                    },
                ],
                type: AEX_SHAPEGROUP_PROPERTYGROUP,
            });
        });

        it(`Can parse multiple shapes on one layer`, async () => {
            assertAreEqual(comp.layers[3], {
                contents: [
                    {
                        contents: [
                            {
                                matchName: 'ADBE Vector Shape - Rect',
                                name: 'Rectangle Path 1',
                                type: AEX_SHAPEITEM_PROPERTYGROUP,
                            },
                            {
                                matchName: 'ADBE Vector Graphic - Stroke',
                                name: 'Stroke 1',
                                type: AEX_SHAPEITEM_PROPERTYGROUP,
                            },
                            {
                                matchName: 'ADBE Vector Graphic - Fill',
                                name: 'Fill 1',
                                type: AEX_SHAPEITEM_PROPERTYGROUP,
                            },
                        ],
                        matchName: 'ADBE Vector Group',
                        name: 'Rectangle 1',
                        type: AEX_SHAPEGROUP_PROPERTYGROUP,
                    },
                    {
                        contents: [
                            {
                                matchName: 'ADBE Vector Shape - Rect',
                                name: 'Rectangle Path 1',
                                type: AEX_SHAPEITEM_PROPERTYGROUP,
                            },
                            {
                                matchName: 'ADBE Vector Graphic - Stroke',
                                name: 'Stroke 1',
                                type: AEX_SHAPEITEM_PROPERTYGROUP,
                            },
                            {
                                matchName: 'ADBE Vector Graphic - Fill',
                                name: 'Fill 1',
                                type: AEX_SHAPEITEM_PROPERTYGROUP,
                            },
                        ],
                        matchName: 'ADBE Vector Group',
                        name: 'Rectangle 2',
                        type: AEX_SHAPEGROUP_PROPERTYGROUP,
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

        it(`Can parse ungrouped shape items`, async () => {
            assertAreEqual(comp.layers[4], {
                contents: [
                    {
                        matchName: 'ADBE Vector Shape - Rect',
                        name: 'Rectangle Path 1',
                        type: AEX_SHAPEITEM_PROPERTYGROUP,
                    },
                    {
                        matchName: 'ADBE Vector Graphic - Stroke',
                        name: 'Stroke 1',
                        type: AEX_SHAPEITEM_PROPERTYGROUP,
                    },
                    {
                        matchName: 'ADBE Vector Graphic - Fill',
                        name: 'Fill 1',
                        type: AEX_SHAPEITEM_PROPERTYGROUP,
                    },
                ],
                effects: [],
                label: 8,
                markers: [],
                masks: [],
                name: 'Ungrouped Default',
                transform: {},
                type: AEX_SHAPE_LAYER,
            });
        });

        it(`Can parse stroke dashes`, async () => {
            assertAreEqual(comp.layers[5].contents[0], {
                contents: [
                    {
                        matchName: 'ADBE Vector Shape - Rect',
                        name: 'Rectangle Path 1',
                        type: AEX_SHAPEITEM_PROPERTYGROUP,
                    },
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
                                    {
                                        keys: [],
                                        matchName: 'ADBE Vector Stroke Offset',
                                        name: 'Offset',
                                        type: AEX_ONED_PROPERTY,
                                        value: 0,
                                    },
                                ],
                            },
                        ],
                        type: AEX_SHAPEITEM_PROPERTYGROUP,
                    },
                ],
                matchName: 'ADBE Vector Group',
                name: 'Rectangle 1',
                type: AEX_SHAPEGROUP_PROPERTYGROUP,
            });
        });

        it(`Can parse all stroke dashes`, async () => {
            assertAreEqual(comp.layers[6].contents[0], {
                contents: [
                    {
                        matchName: 'ADBE Vector Shape - Rect',
                        name: 'Rectangle Path 1',
                        type: AEX_SHAPEITEM_PROPERTYGROUP,
                    },
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
                                    {
                                        keys: [],
                                        matchName: 'ADBE Vector Stroke Gap 1',
                                        name: 'Gap',
                                        type: AEX_ONED_PROPERTY,
                                        value: 10,
                                    },
                                    {
                                        keys: [],
                                        matchName: 'ADBE Vector Stroke Dash 2',
                                        name: 'Dash 2',
                                        type: AEX_ONED_PROPERTY,
                                        value: 10,
                                    },
                                    {
                                        keys: [],
                                        matchName: 'ADBE Vector Stroke Gap 2',
                                        name: 'Gap 2',
                                        type: AEX_ONED_PROPERTY,
                                        value: 10,
                                    },
                                    {
                                        keys: [],
                                        matchName: 'ADBE Vector Stroke Dash 3',
                                        name: 'Dash 3',
                                        type: AEX_ONED_PROPERTY,
                                        value: 10,
                                    },
                                    {
                                        keys: [],
                                        matchName: 'ADBE Vector Stroke Gap 3',
                                        name: 'Gap 3',
                                        type: AEX_ONED_PROPERTY,
                                        value: 10,
                                    },
                                    {
                                        keys: [],
                                        matchName: 'ADBE Vector Stroke Offset',
                                        name: 'Offset',
                                        type: AEX_ONED_PROPERTY,
                                        value: 0,
                                    },
                                ],
                            },
                        ],
                        type: AEX_SHAPEITEM_PROPERTYGROUP,
                    },
                ],
                matchName: 'ADBE Vector Group',
                name: 'Rectangle 1',
                type: AEX_SHAPEGROUP_PROPERTYGROUP,
            });
        });

        it(`Can parse modified stroke dashes`, async () => {
            assertAreEqual(comp.layers[7].contents[0], {
                contents: [
                    {
                        matchName: 'ADBE Vector Shape - Rect',
                        name: 'Rectangle Path 1',
                        type: AEX_SHAPEITEM_PROPERTYGROUP,
                    },
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
                                        value: 1,
                                    },
                                    {
                                        keys: [],
                                        matchName: 'ADBE Vector Stroke Gap 1',
                                        name: 'Gap',
                                        type: AEX_ONED_PROPERTY,
                                        value: 2,
                                    },
                                    {
                                        keys: [],
                                        matchName: 'ADBE Vector Stroke Dash 2',
                                        name: 'Dash 2',
                                        type: AEX_ONED_PROPERTY,
                                        value: 3,
                                    },
                                    {
                                        keys: [],
                                        matchName: 'ADBE Vector Stroke Offset',
                                        name: 'Offset',
                                        type: AEX_ONED_PROPERTY,
                                        value: 4,
                                    },
                                ],
                            },
                        ],
                        type: AEX_SHAPEITEM_PROPERTYGROUP,
                    },
                ],
                matchName: 'ADBE Vector Group',
                name: 'Rectangle 1',
                type: AEX_SHAPEGROUP_PROPERTYGROUP,
            });
        });
    });

    describe('Create Shape Layer', async () => {
        before(async () => {
            await openCleanProject();
        });

        it(`Can create empty shape layers`, async () => {
            const layerData = {
                contents: [],
                type: AEX_SHAPE_LAYER,
            };

            await aex().createTestComp();
            await aex().create(AeObject.ActiveComp, layerData);

            const result = await aex().get(AeObject.Layer(1));
            const layer = result.object;

            assertAreEqual(layer.contents, layerData.contents);
        });

        it(`Can create default shape layers`, async () => {
            const layerData = {
                contents: [
                    {
                        matchName: 'ADBE Vector Group',
                        name: 'Rectangle 1',
                        contents: [
                            {
                                matchName: 'ADBE Vector Shape - Rect',
                                name: 'Rectangle Path 1',
                                type: AEX_SHAPEITEM_PROPERTYGROUP,
                            },
                            {
                                matchName: 'ADBE Vector Graphic - Stroke',
                                name: 'Stroke 1',
                                type: AEX_SHAPEITEM_PROPERTYGROUP,
                            },
                            {
                                matchName: 'ADBE Vector Graphic - Fill',
                                name: 'Fill 1',
                                type: AEX_SHAPEITEM_PROPERTYGROUP,
                            },
                        ],
                        type: AEX_SHAPEGROUP_PROPERTYGROUP,
                    },
                ],
                type: AEX_SHAPE_LAYER,
            };

            await aex().createTestComp();
            await aex().create(AeObject.ActiveComp, layerData);

            const result = await aex().get(AeObject.Layer(1));
            const layer = result.object;

            assertAreEqual(layer.contents, layerData.contents);
        });

        it(`Can create modified shape layers`, async () => {
            const layerData = {
                contents: [
                    {
                        contents: [
                            {
                                enabled: false,
                                matchName: 'ADBE Vector Shape - Rect',
                                name: 'Rectangle Path 1',
                                properties: [
                                    {
                                        keys: [],
                                        matchName: 'ADBE Vector Shape Direction',
                                        name: 'Shape Direction',
                                        type: AEX_ONED_PROPERTY,
                                        value: 2,
                                    },
                                    {
                                        keys: [],
                                        matchName: 'ADBE Vector Rect Size',
                                        name: 'Size',
                                        type: AEX_TWOD_PROPERTY,
                                        value: [100, 200],
                                    },
                                    {
                                        keys: [],
                                        matchName: 'ADBE Vector Rect Position',
                                        name: 'Position',
                                        type: AEX_TWOD_PROPERTY,
                                        value: [30, 40],
                                    },
                                    {
                                        keys: [],
                                        matchName: 'ADBE Vector Rect Roundness',
                                        name: 'Roundness',
                                        type: AEX_ONED_PROPERTY,
                                        value: 50,
                                    },
                                ],
                                type: AEX_SHAPEITEM_PROPERTYGROUP,
                            },
                            {
                                matchName: 'ADBE Vector Graphic - Stroke',
                                name: 'Stroke 1',
                                properties: [
                                    {
                                        keys: [],
                                        matchName: 'ADBE Vector Blend Mode',
                                        name: 'Blend Mode',
                                        type: AEX_ONED_PROPERTY,
                                        value: 17,
                                    },
                                    {
                                        keys: [],
                                        matchName: 'ADBE Vector Composite Order',
                                        name: 'Composite',
                                        type: AEX_ONED_PROPERTY,
                                        value: 2,
                                    },
                                    {
                                        keys: [],
                                        matchName: 'ADBE Vector Stroke Color',
                                        name: 'Color',
                                        type: AEX_COLOR_PROPERTY,
                                        value: [1, 0.5, 0, 1],
                                    },
                                    {
                                        keys: [],
                                        matchName: 'ADBE Vector Stroke Opacity',
                                        name: 'Opacity',
                                        type: AEX_ONED_PROPERTY,
                                        value: 70,
                                    },
                                    {
                                        keys: [],
                                        matchName: 'ADBE Vector Stroke Width',
                                        name: 'Stroke Width',
                                        type: AEX_ONED_PROPERTY,
                                        value: 80,
                                    },
                                    {
                                        keys: [],
                                        matchName: 'ADBE Vector Stroke Line Cap',
                                        name: 'Line Cap',
                                        type: AEX_ONED_PROPERTY,
                                        value: 2,
                                    },
                                    {
                                        keys: [],
                                        matchName: 'ADBE Vector Stroke Line Join',
                                        name: 'Line Join',
                                        type: AEX_ONED_PROPERTY,
                                        value: 2,
                                    },
                                ],
                                type: AEX_SHAPEITEM_PROPERTYGROUP,
                            },
                            {
                                matchName: 'ADBE Vector Graphic - Fill',
                                name: 'Fill 1',
                                properties: [
                                    {
                                        keys: [],
                                        matchName: 'ADBE Vector Blend Mode',
                                        name: 'Blend Mode',
                                        type: AEX_ONED_PROPERTY,
                                        value: 23,
                                    },
                                    {
                                        keys: [],
                                        matchName: 'ADBE Vector Composite Order',
                                        name: 'Composite',
                                        type: AEX_ONED_PROPERTY,
                                        value: 2,
                                    },
                                    {
                                        keys: [],
                                        matchName: 'ADBE Vector Fill Rule',
                                        name: 'Fill Rule',
                                        type: AEX_ONED_PROPERTY,
                                        value: 2,
                                    },
                                    {
                                        keys: [],
                                        matchName: 'ADBE Vector Fill Color',
                                        name: 'Color',
                                        type: AEX_COLOR_PROPERTY,
                                        value: [1, 0.5, 0, 1],
                                    },
                                    {
                                        keys: [],
                                        matchName: 'ADBE Vector Fill Opacity',
                                        name: 'Opacity',
                                        type: AEX_ONED_PROPERTY,
                                        value: 50,
                                    },
                                ],
                                type: AEX_SHAPEITEM_PROPERTYGROUP,
                            },
                        ],
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
                                matchName: 'ADBE Vector Transform Group',
                                properties: [
                                    {
                                        type: AEX_TWOD_PROPERTY,
                                        name: 'Anchor Point',
                                        matchName: 'ADBE Vector Anchor',
                                        value: [10, 20],
                                        keys: [],
                                    },
                                    {
                                        type: AEX_TWOD_PROPERTY,
                                        name: 'Position',
                                        matchName: 'ADBE Vector Position',
                                        value: [30, 40],
                                        keys: [],
                                    },
                                    {
                                        type: AEX_TWOD_PROPERTY,
                                        name: 'Scale',
                                        matchName: 'ADBE Vector Scale',
                                        value: [50, 50],
                                        keys: [],
                                    },
                                    {
                                        type: AEX_ONED_PROPERTY,
                                        name: 'Skew',
                                        matchName: 'ADBE Vector Skew',
                                        value: 60,
                                        keys: [],
                                    },
                                    {
                                        type: AEX_ONED_PROPERTY,
                                        name: 'Skew Axis',
                                        matchName: 'ADBE Vector Skew Axis',
                                        value: 70,
                                        keys: [],
                                    },
                                    {
                                        type: AEX_ONED_PROPERTY,
                                        name: 'Rotation',
                                        matchName: 'ADBE Vector Rotation',
                                        value: 80,
                                        keys: [],
                                    },
                                    {
                                        type: AEX_ONED_PROPERTY,
                                        name: 'Opacity',
                                        matchName: 'ADBE Vector Group Opacity',
                                        value: 90,
                                        keys: [],
                                    },
                                ],
                            },
                        ],
                        type: AEX_SHAPEGROUP_PROPERTYGROUP,
                    },
                ],
                type: AEX_SHAPE_LAYER,
            };

            await aex().createTestComp();
            await aex().create(AeObject.ActiveComp, layerData);

            const result = await aex().get(AeObject.Layer(1));
            const layer = result.object;

            assertAreEqual(layer.contents, layerData.contents);
        });

        it(`Can create multiple shapes on one layer`, async () => {
            const layerData = {
                contents: [
                    {
                        contents: [
                            {
                                matchName: 'ADBE Vector Shape - Rect',
                                name: 'Rectangle Path 1',
                                type: AEX_SHAPEITEM_PROPERTYGROUP,
                            },
                            {
                                matchName: 'ADBE Vector Graphic - Stroke',
                                name: 'Stroke 1',
                                type: AEX_SHAPEITEM_PROPERTYGROUP,
                            },
                            {
                                matchName: 'ADBE Vector Graphic - Fill',
                                name: 'Fill 1',
                                type: AEX_SHAPEITEM_PROPERTYGROUP,
                            },
                        ],
                        matchName: 'ADBE Vector Group',
                        name: 'Rectangle 1',
                        type: AEX_SHAPEGROUP_PROPERTYGROUP,
                    },
                    {
                        contents: [
                            {
                                matchName: 'ADBE Vector Shape - Rect',
                                name: 'Rectangle Path 1',
                                type: AEX_SHAPEITEM_PROPERTYGROUP,
                            },
                            {
                                matchName: 'ADBE Vector Graphic - Stroke',
                                name: 'Stroke 1',
                                type: AEX_SHAPEITEM_PROPERTYGROUP,
                            },
                            {
                                matchName: 'ADBE Vector Graphic - Fill',
                                name: 'Fill 1',
                                type: AEX_SHAPEITEM_PROPERTYGROUP,
                            },
                        ],
                        matchName: 'ADBE Vector Group',
                        name: 'Rectangle 2',
                        type: AEX_SHAPEGROUP_PROPERTYGROUP,
                    },
                ],
                type: AEX_SHAPE_LAYER,
            };

            await aex().createTestComp();
            await aex().create(AeObject.ActiveComp, layerData);

            const result = await aex().get(AeObject.Layer(1));
            const layer = result.object;

            assertAreEqual(layer.contents, layerData.contents);
        });

        it(`Can create ungrouped shape items`, async () => {
            const layerData = {
                contents: [
                    {
                        matchName: 'ADBE Vector Shape - Rect',
                        name: 'Rectangle Path 1',
                        type: AEX_SHAPEITEM_PROPERTYGROUP,
                    },
                    {
                        matchName: 'ADBE Vector Graphic - Stroke',
                        name: 'Stroke 1',
                        type: AEX_SHAPEITEM_PROPERTYGROUP,
                    },
                    {
                        matchName: 'ADBE Vector Graphic - Fill',
                        name: 'Fill 1',
                        type: AEX_SHAPEITEM_PROPERTYGROUP,
                    },
                ],
                type: AEX_SHAPE_LAYER,
            };

            await aex().createTestComp();
            await aex().create(AeObject.ActiveComp, layerData);

            const result = await aex().get(AeObject.Layer(1));
            const layer = result.object;

            assertAreEqual(layer.contents, layerData.contents);
        });

        it(`Can create stroke dashes`, async () => {
            const layerData = {
                contents: [
                    {
                        contents: [
                            {
                                matchName: 'ADBE Vector Shape - Rect',
                                name: 'Rectangle Path 1',
                                type: AEX_SHAPEITEM_PROPERTYGROUP,
                            },
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
                                            {
                                                keys: [],
                                                matchName: 'ADBE Vector Stroke Offset',
                                                name: 'Offset',
                                                type: AEX_ONED_PROPERTY,
                                                value: 0,
                                            },
                                        ],
                                    },
                                ],
                                type: AEX_SHAPEITEM_PROPERTYGROUP,
                            },
                        ],
                        matchName: 'ADBE Vector Group',
                        name: 'Rectangle 1',
                        type: AEX_SHAPEGROUP_PROPERTYGROUP,
                    },
                ],
                type: AEX_SHAPE_LAYER,
            };

            await aex().createTestComp();
            await aex().create(AeObject.ActiveComp, layerData);

            const result = await aex().get(AeObject.Layer(1));
            const layer = result.object;

            assertAreEqual(layer.contents, layerData.contents);
        });

        it(`Can create all stroke dashes`, async () => {
            const layerData = {
                contents: [
                    {
                        contents: [
                            {
                                matchName: 'ADBE Vector Shape - Rect',
                                name: 'Rectangle Path 1',
                                type: AEX_SHAPEITEM_PROPERTYGROUP,
                            },
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
                                            {
                                                keys: [],
                                                matchName: 'ADBE Vector Stroke Gap 1',
                                                name: 'Gap',
                                                type: AEX_ONED_PROPERTY,
                                                value: 10,
                                            },
                                            {
                                                keys: [],
                                                matchName: 'ADBE Vector Stroke Dash 2',
                                                name: 'Dash 2',
                                                type: AEX_ONED_PROPERTY,
                                                value: 10,
                                            },
                                            {
                                                keys: [],
                                                matchName: 'ADBE Vector Stroke Gap 2',
                                                name: 'Gap 2',
                                                type: AEX_ONED_PROPERTY,
                                                value: 10,
                                            },
                                            {
                                                keys: [],
                                                matchName: 'ADBE Vector Stroke Dash 3',
                                                name: 'Dash 3',
                                                type: AEX_ONED_PROPERTY,
                                                value: 10,
                                            },
                                            {
                                                keys: [],
                                                matchName: 'ADBE Vector Stroke Gap 3',
                                                name: 'Gap 3',
                                                type: AEX_ONED_PROPERTY,
                                                value: 10,
                                            },
                                            {
                                                keys: [],
                                                matchName: 'ADBE Vector Stroke Offset',
                                                name: 'Offset',
                                                type: AEX_ONED_PROPERTY,
                                                value: 0,
                                            },
                                        ],
                                    },
                                ],
                                type: AEX_SHAPEITEM_PROPERTYGROUP,
                            },
                        ],
                        matchName: 'ADBE Vector Group',
                        name: 'Rectangle 1',
                        type: AEX_SHAPEGROUP_PROPERTYGROUP,
                    },
                ],
                type: AEX_SHAPE_LAYER,
            };

            await aex().createTestComp();
            await aex().create(AeObject.ActiveComp, layerData);

            const result = await aex().get(AeObject.Layer(1));
            const layer = result.object;

            assertAreEqual(layer.contents, layerData.contents);
        });

        it(`Can create modified stroke dashes`, async () => {
            const layerData = {
                contents: [
                    {
                        contents: [
                            {
                                matchName: 'ADBE Vector Shape - Rect',
                                name: 'Rectangle Path 1',
                                type: AEX_SHAPEITEM_PROPERTYGROUP,
                            },
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
                                                value: 1,
                                            },
                                            {
                                                keys: [],
                                                matchName: 'ADBE Vector Stroke Gap 1',
                                                name: 'Gap',
                                                type: AEX_ONED_PROPERTY,
                                                value: 2,
                                            },
                                            {
                                                keys: [],
                                                matchName: 'ADBE Vector Stroke Dash 2',
                                                name: 'Dash 2',
                                                type: AEX_ONED_PROPERTY,
                                                value: 3,
                                            },
                                            {
                                                keys: [],
                                                matchName: 'ADBE Vector Stroke Offset',
                                                name: 'Offset',
                                                type: AEX_ONED_PROPERTY,
                                                value: 4,
                                            },
                                        ],
                                    },
                                ],
                                type: AEX_SHAPEITEM_PROPERTYGROUP,
                            },
                        ],
                        matchName: 'ADBE Vector Group',
                        name: 'Rectangle 1',
                        type: AEX_SHAPEGROUP_PROPERTYGROUP,
                    },
                ],
                type: AEX_SHAPE_LAYER,
            };

            await aex().createTestComp();
            await aex().create(AeObject.ActiveComp, layerData);

            const result = await aex().get(AeObject.Layer(1));
            const layer = result.object;

            assertAreEqual(layer.contents, layerData.contents);
        });
    });

    describe('Create Shape on Existing Layer', async () => {
        before(async () => {
            await openProject('testAssets/layer_shapelayer_blank.aep');
        });

        it(`Can create default shape item`, async () => {
            const shapeData = {
                matchName: 'ADBE Vector Group',
                name: 'Rectangle 1',
                contents: [
                    {
                        matchName: 'ADBE Vector Shape - Rect',
                        name: 'Rectangle Path 1',
                        type: AEX_SHAPEITEM_PROPERTYGROUP,
                    },
                    {
                        matchName: 'ADBE Vector Graphic - Stroke',
                        name: 'Stroke 1',
                        type: AEX_SHAPEITEM_PROPERTYGROUP,
                    },
                    {
                        matchName: 'ADBE Vector Graphic - Fill',
                        name: 'Fill 1',
                        type: AEX_SHAPEITEM_PROPERTYGROUP,
                    },
                ],
                type: AEX_SHAPEGROUP_PROPERTYGROUP,
            };

            await aex().create(AeObject.Layer(1), shapeData);

            const result = await aex().get(AeObject.Layer(1));
            const layer = result.object;

            assertAreEqual(layer.contents[layer.contents.length - 1], shapeData);
        });

        it(`Can create modified shape layers`, async () => {
            const shapeData = {
                contents: [
                    {
                        enabled: false,
                        matchName: 'ADBE Vector Shape - Rect',
                        name: 'Rectangle Path 1',
                        properties: [
                            {
                                keys: [],
                                matchName: 'ADBE Vector Shape Direction',
                                name: 'Shape Direction',
                                type: AEX_ONED_PROPERTY,
                                value: 2,
                            },
                            {
                                keys: [],
                                matchName: 'ADBE Vector Rect Size',
                                name: 'Size',
                                type: AEX_TWOD_PROPERTY,
                                value: [100, 200],
                            },
                            {
                                keys: [],
                                matchName: 'ADBE Vector Rect Position',
                                name: 'Position',
                                type: AEX_TWOD_PROPERTY,
                                value: [30, 40],
                            },
                            {
                                keys: [],
                                matchName: 'ADBE Vector Rect Roundness',
                                name: 'Roundness',
                                type: AEX_ONED_PROPERTY,
                                value: 50,
                            },
                        ],
                        type: AEX_SHAPEITEM_PROPERTYGROUP,
                    },
                    {
                        matchName: 'ADBE Vector Graphic - Stroke',
                        name: 'Stroke 1',
                        properties: [
                            {
                                keys: [],
                                matchName: 'ADBE Vector Blend Mode',
                                name: 'Blend Mode',
                                type: AEX_ONED_PROPERTY,
                                value: 17,
                            },
                            {
                                keys: [],
                                matchName: 'ADBE Vector Composite Order',
                                name: 'Composite',
                                type: AEX_ONED_PROPERTY,
                                value: 2,
                            },
                            {
                                keys: [],
                                matchName: 'ADBE Vector Stroke Color',
                                name: 'Color',
                                type: AEX_COLOR_PROPERTY,
                                value: [1, 0.5, 0, 1],
                            },
                            {
                                keys: [],
                                matchName: 'ADBE Vector Stroke Opacity',
                                name: 'Opacity',
                                type: AEX_ONED_PROPERTY,
                                value: 70,
                            },
                            {
                                keys: [],
                                matchName: 'ADBE Vector Stroke Width',
                                name: 'Stroke Width',
                                type: AEX_ONED_PROPERTY,
                                value: 80,
                            },
                            {
                                keys: [],
                                matchName: 'ADBE Vector Stroke Line Cap',
                                name: 'Line Cap',
                                type: AEX_ONED_PROPERTY,
                                value: 2,
                            },
                            {
                                keys: [],
                                matchName: 'ADBE Vector Stroke Line Join',
                                name: 'Line Join',
                                type: AEX_ONED_PROPERTY,
                                value: 2,
                            },
                        ],
                        type: AEX_SHAPEITEM_PROPERTYGROUP,
                    },
                    {
                        matchName: 'ADBE Vector Graphic - Fill',
                        name: 'Fill 1',
                        properties: [
                            {
                                keys: [],
                                matchName: 'ADBE Vector Blend Mode',
                                name: 'Blend Mode',
                                type: AEX_ONED_PROPERTY,
                                value: 23,
                            },
                            {
                                keys: [],
                                matchName: 'ADBE Vector Composite Order',
                                name: 'Composite',
                                type: AEX_ONED_PROPERTY,
                                value: 2,
                            },
                            {
                                keys: [],
                                matchName: 'ADBE Vector Fill Rule',
                                name: 'Fill Rule',
                                type: AEX_ONED_PROPERTY,
                                value: 2,
                            },
                            {
                                keys: [],
                                matchName: 'ADBE Vector Fill Color',
                                name: 'Color',
                                type: AEX_COLOR_PROPERTY,
                                value: [1, 0.5, 0, 1],
                            },
                            {
                                keys: [],
                                matchName: 'ADBE Vector Fill Opacity',
                                name: 'Opacity',
                                type: AEX_ONED_PROPERTY,
                                value: 50,
                            },
                        ],
                        type: AEX_SHAPEITEM_PROPERTYGROUP,
                    },
                ],
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
                        matchName: 'ADBE Vector Transform Group',
                        properties: [
                            {
                                type: AEX_TWOD_PROPERTY,
                                name: 'Anchor Point',
                                matchName: 'ADBE Vector Anchor',
                                value: [10, 20],
                                keys: [],
                            },
                            {
                                type: AEX_TWOD_PROPERTY,
                                name: 'Position',
                                matchName: 'ADBE Vector Position',
                                value: [30, 40],
                                keys: [],
                            },
                            {
                                type: AEX_TWOD_PROPERTY,
                                name: 'Scale',
                                matchName: 'ADBE Vector Scale',
                                value: [50, 50],
                                keys: [],
                            },
                            {
                                type: AEX_ONED_PROPERTY,
                                name: 'Skew',
                                matchName: 'ADBE Vector Skew',
                                value: 60,
                                keys: [],
                            },
                            {
                                type: AEX_ONED_PROPERTY,
                                name: 'Skew Axis',
                                matchName: 'ADBE Vector Skew Axis',
                                value: 70,
                                keys: [],
                            },
                            {
                                type: AEX_ONED_PROPERTY,
                                name: 'Rotation',
                                matchName: 'ADBE Vector Rotation',
                                value: 80,
                                keys: [],
                            },
                            {
                                type: AEX_ONED_PROPERTY,
                                name: 'Opacity',
                                matchName: 'ADBE Vector Group Opacity',
                                value: 90,
                                keys: [],
                            },
                        ],
                    },
                ],
                type: AEX_SHAPEGROUP_PROPERTYGROUP,
            };

            await aex().create(AeObject.Layer(1), shapeData);

            const result = await aex().get(AeObject.Layer(1));
            const layer = result.object;

            assertAreEqual(layer.contents[layer.contents.length - 1], shapeData);
        });

        it(`Can create ungrouped shape item`, async () => {
            const shapeData = {
                matchName: 'ADBE Vector Shape - Rect',
                name: 'Rectangle Path 1',
                type: AEX_SHAPEITEM_PROPERTYGROUP,
            };

            await aex().create(AeObject.Layer(1), shapeData);

            const result = await aex().get(AeObject.Layer(1));
            const layer = result.object;

            assertAreEqual(layer.contents[layer.contents.length - 1], shapeData);
        });

        it(`Can create stroke dashes`, async () => {
            const shapeData = {
                contents: [
                    {
                        matchName: 'ADBE Vector Shape - Rect',
                        name: 'Rectangle Path 1',
                        type: AEX_SHAPEITEM_PROPERTYGROUP,
                    },
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
                                    {
                                        keys: [],
                                        matchName: 'ADBE Vector Stroke Offset',
                                        name: 'Offset',
                                        type: AEX_ONED_PROPERTY,
                                        value: 0,
                                    },
                                ],
                            },
                        ],
                        type: AEX_SHAPEITEM_PROPERTYGROUP,
                    },
                ],
                matchName: 'ADBE Vector Group',
                name: 'Rectangle 1',
                type: AEX_SHAPEGROUP_PROPERTYGROUP,
            };

            await aex().create(AeObject.Layer(1), shapeData);

            const result = await aex().get(AeObject.Layer(1));
            const layer = result.object;

            assertAreEqual(layer.contents[layer.contents.length - 1], shapeData);
        });

        it(`Can create all stroke dashes`, async () => {
            const shapeData = {
                contents: [
                    {
                        matchName: 'ADBE Vector Shape - Rect',
                        name: 'Rectangle Path 1',
                        type: AEX_SHAPEITEM_PROPERTYGROUP,
                    },
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
                                    {
                                        keys: [],
                                        matchName: 'ADBE Vector Stroke Gap 1',
                                        name: 'Gap',
                                        type: AEX_ONED_PROPERTY,
                                        value: 10,
                                    },
                                    {
                                        keys: [],
                                        matchName: 'ADBE Vector Stroke Dash 2',
                                        name: 'Dash 2',
                                        type: AEX_ONED_PROPERTY,
                                        value: 10,
                                    },
                                    {
                                        keys: [],
                                        matchName: 'ADBE Vector Stroke Gap 2',
                                        name: 'Gap 2',
                                        type: AEX_ONED_PROPERTY,
                                        value: 10,
                                    },
                                    {
                                        keys: [],
                                        matchName: 'ADBE Vector Stroke Dash 3',
                                        name: 'Dash 3',
                                        type: AEX_ONED_PROPERTY,
                                        value: 10,
                                    },
                                    {
                                        keys: [],
                                        matchName: 'ADBE Vector Stroke Gap 3',
                                        name: 'Gap 3',
                                        type: AEX_ONED_PROPERTY,
                                        value: 10,
                                    },
                                    {
                                        keys: [],
                                        matchName: 'ADBE Vector Stroke Offset',
                                        name: 'Offset',
                                        type: AEX_ONED_PROPERTY,
                                        value: 0,
                                    },
                                ],
                            },
                        ],
                        type: AEX_SHAPEITEM_PROPERTYGROUP,
                    },
                ],
                matchName: 'ADBE Vector Group',
                name: 'Rectangle 1',
                type: AEX_SHAPEGROUP_PROPERTYGROUP,
            };

            await aex().create(AeObject.Layer(1), shapeData);

            const result = await aex().get(AeObject.Layer(1));
            const layer = result.object;

            assertAreEqual(layer.contents[layer.contents.length - 1], shapeData);
        });

        it(`Can create modified stroke dashes`, async () => {
            const shapeData = {
                contents: [
                    {
                        matchName: 'ADBE Vector Shape - Rect',
                        name: 'Rectangle Path 1',
                        type: AEX_SHAPEITEM_PROPERTYGROUP,
                    },
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
                                        value: 1,
                                    },
                                    {
                                        keys: [],
                                        matchName: 'ADBE Vector Stroke Gap 1',
                                        name: 'Gap',
                                        type: AEX_ONED_PROPERTY,
                                        value: 2,
                                    },
                                    {
                                        keys: [],
                                        matchName: 'ADBE Vector Stroke Dash 2',
                                        name: 'Dash 2',
                                        type: AEX_ONED_PROPERTY,
                                        value: 3,
                                    },
                                    {
                                        keys: [],
                                        matchName: 'ADBE Vector Stroke Offset',
                                        name: 'Offset',
                                        type: AEX_ONED_PROPERTY,
                                        value: 4,
                                    },
                                ],
                            },
                        ],
                        type: AEX_SHAPEITEM_PROPERTYGROUP,
                    },
                ],
                matchName: 'ADBE Vector Group',
                name: 'Rectangle 1',
                type: AEX_SHAPEGROUP_PROPERTYGROUP,
            };

            await aex().create(AeObject.Layer(1), shapeData);

            const result = await aex().get(AeObject.Layer(1));
            const layer = result.object;

            assertAreEqual(layer.contents[layer.contents.length - 1], shapeData);
        });

        it(`Can update existing shape groups`, async () => {
            const shapeItemData = {
                properties: [
                    {
                        matchName: 'ADBE Vector Graphic - Fill',
                        name: 'Fill 3',
                        type: AEX_SHAPEITEM_PROPERTYGROUP,
                    },
                ],
                type: AEX_SHAPEITEM_PROPERTYGROUP,
            };

            await openProject('testAssets/layer_shapelayer.aep');
            await aex().update(AeObject.LayerProp(2, "property('ADBE Root Vectors Group').property(1).property(2)"), shapeItemData);

            const result = await aex().get(AeObject.Layer(2));
            const layer = result.object;
            const shapeGroup = layer.contents[0];
            const contents = shapeGroup.contents;

            assertAreEqual(contents[contents.length - 1], shapeItemData.properties[0]);
        });

        //   it(`Can create ungrouped shape items`, async () => {
        //     const shapeData = {
        //         contents: [
        //             {
        //                 matchName: 'ADBE Vector Shape - Rect',
        //                 name: 'Rectangle Path 1',
        //                 type: AEX_SHAPEITEM_PROPERTYGROUP,
        //             },
        //             {
        //                 matchName: 'ADBE Vector Graphic - Stroke',
        //                 name: 'Stroke 1',
        //                 type: AEX_SHAPEITEM_PROPERTYGROUP,
        //             },
        //             {
        //                 matchName: 'ADBE Vector Graphic - Fill',
        //                 name: 'Fill 1',
        //                 type: AEX_SHAPEITEM_PROPERTYGROUP,
        //             },
        //         ],
        //         type: AEX_SHAPEGROUP_PROPERTYGROUP,
        //     };

        //     await aex().create(AeObject.Layer(1), shapeData);

        //     const result = await aex().get(AeObject.Layer(1));
        //     const layer = result.object;

        //     assertAreEqual(layer.contents[layer.contents.length - 1], shapeData);
        // });

        // it(`Can create multiple shapes on one layer`, async () => {
        //     const shapeData = [
        //         {
        //             contents: [
        //                 {
        //                     matchName: 'ADBE Vector Shape - Rect',
        //                     name: 'Rectangle Path 1',
        //                     type: AEX_SHAPEITEM_PROPERTYGROUP,
        //                 },
        //                 {
        //                     matchName: 'ADBE Vector Graphic - Stroke',
        //                     name: 'Stroke 1',
        //                     type: AEX_SHAPEITEM_PROPERTYGROUP,
        //                 },
        //                 {
        //                     matchName: 'ADBE Vector Graphic - Fill',
        //                     name: 'Fill 1',
        //                     type: AEX_SHAPEITEM_PROPERTYGROUP,
        //                 },
        //             ],
        //             matchName: 'ADBE Vector Group',
        //             name: 'Rectangle 1',
        //             type: AEX_SHAPEGROUP_PROPERTYGROUP,
        //         },
        //         {
        //             contents: [
        //                 {
        //                     matchName: 'ADBE Vector Shape - Rect',
        //                     name: 'Rectangle Path 1',
        //                     type: AEX_SHAPEITEM_PROPERTYGROUP,
        //                 },
        //                 {
        //                     matchName: 'ADBE Vector Graphic - Stroke',
        //                     name: 'Stroke 1',
        //                     type: AEX_SHAPEITEM_PROPERTYGROUP,
        //                 },
        //                 {
        //                     matchName: 'ADBE Vector Graphic - Fill',
        //                     name: 'Fill 1',
        //                     type: AEX_SHAPEITEM_PROPERTYGROUP,
        //                 },
        //             ],
        //             matchName: 'ADBE Vector Group',
        //             name: 'Rectangle 2',
        //             type: AEX_SHAPEGROUP_PROPERTYGROUP,
        //         },
        //     ];

        //     await aex().create(AeObject.Layer(1), shapeData);

        //     const result = await aex().get(AeObject.Layer(1));
        //     const layer = result.object;

        //     assertAreEqual(layer.contents[layer.contents.length - 1], shapeData);
        // });
    });
});
