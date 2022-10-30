import { AeObject, aex, getProject } from '../aex';
import { AEX_KEY, AEX_NULL_LAYER, AEX_ONED_PROPERTY, AEX_SHAPE_PROPERTY, AEX_TWOD_PROPERTY, TEST_TIMEOUT_TIME } from '../constants';
import { cleanupAex, evalAexIntoEstk, openCleanProject } from '../csinterface';
import { assertAreEqual } from '../utils';

describe('Layer Masks', function () {
    this.slow(1000);
    this.timeout(TEST_TIMEOUT_TIME);

    before(async () => {
        await evalAexIntoEstk();
    });

    after(async () => {
        await cleanupAex();
    });

    describe('Simple Mask Paths', async () => {
        it('Get', async () => {
            const { object: comp } = await getProject('assets/layer_masks.aep', AeObject.ActiveComp);

            console.log('layer_masks', comp);

            assertAreEqual(comp.layers[0].masks[0], {
                color: [0.702, 0.7804, 0.702],
                maskPath: {
                    type: AEX_SHAPE_PROPERTY,
                    matchName: 'ADBE Mask Shape',
                    value: {
                        closed: true,
                        inTangents: [
                            [96.5352, 0],
                            [0, -96.5352],
                            [-96.5352, 0],
                            [0, 96.5352],
                        ],
                        outTangents: [
                            [-96.5352, 0],
                            [0, 96.5352],
                            [96.5352, 0],
                            [0, -96.5352],
                        ],
                        vertices: [
                            [279.8491, 92.3774],
                            [105.0566, 267.1698],
                            [279.8491, 441.9623],
                            [454.6415, 267.1698],
                        ],
                    },
                },
                name: 'Basic',
            });
        });

        it('Create', async () => {
            const layerData = {
                masks: [
                    {
                        color: [0.702, 0.7804, 0.702],
                        maskPath: {
                            type: AEX_SHAPE_PROPERTY,
                            matchName: 'ADBE Mask Shape',
                            value: {
                                closed: true,
                                inTangents: [
                                    [96.5352, 0],
                                    [0, -96.5352],
                                    [-96.5352, 0],
                                    [0, 96.5352],
                                ],
                                outTangents: [
                                    [-96.5352, 0],
                                    [0, 96.5352],
                                    [96.5352, 0],
                                    [0, -96.5352],
                                ],
                                vertices: [
                                    [279.8491, 92.3774],
                                    [105.0566, 267.1698],
                                    [279.8491, 441.9623],
                                    [454.6415, 267.1698],
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

            assertAreEqual(layer.masks, layerData.masks);
        });
    });

    describe('Simple Mask Attributes', async () => {
        it('Get', async () => {
            const { object: comp } = await getProject('assets/layer_masks.aep', AeObject.ActiveComp);

            console.log('layer_masks', comp);

            assertAreEqual(comp.layers[0].masks[1], {
                color: [0.5569, 0.1725, 0.6039],
                inverted: true,
                maskExpansion: {
                    type: AEX_ONED_PROPERTY,
                    matchName: 'ADBE Mask Offset',
                    value: 23,
                },
                maskFeather: {
                    type: AEX_TWOD_PROPERTY,
                    matchName: 'ADBE Mask Feather',
                    value: [33, 33],
                },
                maskMode: 6814,
                maskOpacity: {
                    type: AEX_ONED_PROPERTY,
                    matchName: 'ADBE Mask Opacity',
                    value: 73,
                },
                maskPath: {
                    type: AEX_SHAPE_PROPERTY,
                    matchName: 'ADBE Mask Shape',
                    value: {
                        closed: true,
                        inTangents: [
                            [0, 0],
                            [0, 0],
                            [0, 0],
                            [0, 0],
                            [0, 0],
                            [0, 0],
                            [0, 0],
                            [0, 0],
                            [0, 0],
                            [0, 0],
                        ],
                        outTangents: [
                            [0, 0],
                            [0, 0],
                            [0, 0],
                            [0, 0],
                            [0, 0],
                            [0, 0],
                            [0, 0],
                            [0, 0],
                            [0, 0],
                            [0, 0],
                        ],
                        vertices: [
                            [1552.3018, 432.9057],
                            [1381.7354, 528.4669],
                            [1206.3177, 442.1335],
                            [1244.4939, 633.882],
                            [1108.179, 774.0356],
                            [1302.3395, 796.9813],
                            [1393.5099, 969.9342],
                            [1475.3314, 792.3674],
                            [1667.9928, 759.1047],
                            [1524.4009, 626.4165],
                        ],
                    },
                },
                name: 'Attributes',
            });
        });

        it('Create', async () => {
            const layerData = {
                masks: [
                    {
                        color: [0.5569, 0.1725, 0.6039],
                        inverted: true,
                        maskExpansion: {
                            type: AEX_ONED_PROPERTY,
                            matchName: 'ADBE Mask Offset',
                            value: 23,
                        },
                        maskFeather: {
                            type: AEX_TWOD_PROPERTY,
                            matchName: 'ADBE Mask Feather',
                            value: [33, 33],
                        },
                        maskMode: 6814,
                        maskOpacity: {
                            type: AEX_ONED_PROPERTY,
                            matchName: 'ADBE Mask Opacity',
                            value: 73,
                        },
                        maskPath: {
                            type: AEX_SHAPE_PROPERTY,
                            matchName: 'ADBE Mask Shape',
                            value: {
                                closed: true,
                                inTangents: [
                                    [0, 0],
                                    [0, 0],
                                    [0, 0],
                                    [0, 0],
                                    [0, 0],
                                    [0, 0],
                                    [0, 0],
                                    [0, 0],
                                    [0, 0],
                                    [0, 0],
                                ],
                                outTangents: [
                                    [0, 0],
                                    [0, 0],
                                    [0, 0],
                                    [0, 0],
                                    [0, 0],
                                    [0, 0],
                                    [0, 0],
                                    [0, 0],
                                    [0, 0],
                                    [0, 0],
                                ],
                                vertices: [
                                    [1552.3016, 432.9057],
                                    [1381.7654, 528.4669],
                                    [1206.3177, 442.1355],
                                    [1244.4939, 633.822],
                                    [1108.179, 774.0356],
                                    [1302.3395, 796.9813],
                                    [1393.5098, 969.9342],
                                    [1475.3313, 792.3674],
                                    [1667.9926, 759.1047],
                                    [1524.4008, 626.4165],
                                ],
                            },
                        },
                        name: 'Attributes',
                    },
                ],
                type: AEX_NULL_LAYER,
            };

            await openCleanProject();

            await aex.createTestComp();
            await aex.create(AeObject.ActiveComp, layerData);

            const result = await aex.get(AeObject.Layer(1));
            const layer = result.object;

            assertAreEqual(layer.masks, layerData.masks);
        });
    });

    describe('Detail Masks With Feather', async () => {
        it('Get', async () => {
            const { object: comp } = await getProject('assets/layer_masks.aep', AeObject.ActiveComp);

            console.log('layer_masks', comp);

            assertAreEqual(comp.layers[1].masks[0], {
                color: [0.702, 0.7804, 0.702],
                maskPath: {
                    type: AEX_SHAPE_PROPERTY,
                    matchName: 'ADBE Mask Shape',
                    value: {
                        closed: true,
                        featherInterps: [0, 0, 0],
                        featherRadii: [74.2788, 0, 54.6675],
                        featherRelCornerAngles: [0, 0, 0],
                        featherRelSegLocs: [0.9929, 0.9832, 0.8811],
                        featherSegLocs: [1, 2, 3],
                        featherTensions: [0, 0, 0],
                        featherTypes: [0, 0, 0],
                        inTangents: [
                            [96.5352, 0],
                            [0, -96.5352],
                            [-96.5352, 0],
                            [0, 96.5352],
                        ],
                        outTangents: [
                            [-96.5352, 0],
                            [0, 96.5352],
                            [96.5352, 0],
                            [0, -96.5352],
                        ],
                        vertices: [
                            [279.8491, 92.3774],
                            [105.0566, 267.1698],
                            [279.8491, 441.9623],
                            [454.6415, 267.1698],
                        ],
                    },
                },
                name: 'Feather',
            });
        });

        it('Create', async () => {
            const layerData = {
                masks: [
                    {
                        color: [0.702, 0.7804, 0.702],
                        maskPath: {
                            type: AEX_SHAPE_PROPERTY,
                            matchName: 'ADBE Mask Shape',
                            value: {
                                closed: true,
                                featherInterps: [0, 0, 0],
                                featherRadii: [74.2788, 0, 54.6675],
                                featherRelCornerAngles: [0, 0, 0],
                                featherRelSegLocs: [0.9929, 0.9832, 0.8811],
                                featherSegLocs: [1, 2, 3],
                                featherTensions: [0, 0, 0],
                                featherTypes: [0, 0, 0],
                                inTangents: [
                                    [96.5352, 0],
                                    [0, -96.5352],
                                    [-96.5352, 0],
                                    [0, 96.5352],
                                ],
                                outTangents: [
                                    [-96.5352, 0],
                                    [0, 96.5352],
                                    [96.5352, 0],
                                    [0, -96.5352],
                                ],
                                vertices: [
                                    [279.8491, 92.3774],
                                    [105.0566, 267.1698],
                                    [279.8491, 441.9623],
                                    [454.6415, 267.1698],
                                ],
                            },
                        },
                        name: 'Feather',
                    },
                ],
                type: AEX_NULL_LAYER,
            };

            await openCleanProject();

            await aex.createTestComp();
            await aex.create(AeObject.ActiveComp, layerData);

            const result = await aex.get(AeObject.Layer(1));
            const layer = result.object;

            assertAreEqual(layer.masks, layerData.masks);
        });
    });

    describe('Animated Masks', async () => {
        it('Get', async () => {
            const { object: comp } = await getProject('assets/layer_masks.aep', AeObject.ActiveComp);

            console.log('layer_masks', comp);

            assertAreEqual(comp.layers[2].masks[0], {
                name: 'Mask 1',
                color: [0.9098, 0.5725, 0.051],
                maskPath: {
                    type: AEX_SHAPE_PROPERTY,
                    matchName: 'ADBE Mask Shape',
                    value: {
                        closed: true,
                        featherInterps: [0, 0],
                        featherRadii: [0, 0],
                        featherRelCornerAngles: [0, 0],
                        featherRelSegLocs: [0.3818, 0.8822],
                        featherSegLocs: [0, 8],
                        featherTensions: [0, 0],
                        featherTypes: [1, 0],
                        inTangents: [
                            [0, 0],
                            [0, 0],
                            [0, 0],
                            [0, 0],
                            [0, 0],
                            [0, 0],
                            [0, 0],
                            [0, 0],
                            [0, 0],
                            [0, 0],
                        ],
                        outTangents: [
                            [0, 0],
                            [0, 0],
                            [0, 0],
                            [0, 0],
                            [0, 0],
                            [0, 0],
                            [0, 0],
                            [0, 0],
                            [0, 0],
                            [0, 0],
                        ],
                        vertices: [
                            [960, 50.717],
                            [801.298, 372.2825],
                            [446.4295, 423.848],
                            [703.2147, 674.1516],
                            [642.5959, 1027.5861],
                            [960, 860.717],
                            [1277.4039, 1027.5861],
                            [1216.7852, 674.1516],
                            [1473.5703, 423.848],
                            [1118.7019, 372.2825],
                        ],
                    },
                    keys: [
                        {
                            time: 0,
                            type: AEX_KEY,
                            value: {
                                closed: true,
                                featherInterps: [0, 0],
                                featherRadii: [0, 0],
                                featherRelCornerAngles: [0, 0],
                                featherRelSegLocs: [0.3818, 0.8822],
                                featherSegLocs: [0, 8],
                                featherTensions: [0, 0],
                                featherTypes: [1, 0],
                                inTangents: [
                                    [0, 0],
                                    [0, 0],
                                    [0, 0],
                                    [0, 0],
                                    [0, 0],
                                    [0, 0],
                                    [0, 0],
                                    [0, 0],
                                    [0, 0],
                                    [0, 0],
                                ],
                                outTangents: [
                                    [0, 0],
                                    [0, 0],
                                    [0, 0],
                                    [0, 0],
                                    [0, 0],
                                    [0, 0],
                                    [0, 0],
                                    [0, 0],
                                    [0, 0],
                                    [0, 0],
                                ],
                                vertices: [
                                    [960, 50.717],
                                    [801.298, 372.2825],
                                    [446.4295, 423.848],
                                    [703.2147, 674.1516],
                                    [642.5959, 1027.5861],
                                    [960, 860.717],
                                    [1277.4039, 1027.5861],
                                    [1216.7852, 674.1516],
                                    [1473.5703, 423.848],
                                    [1118.7019, 372.2825],
                                ],
                            },
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
                        },
                        {
                            time: 4.9583,
                            type: AEX_KEY,
                            value: {
                                closed: true,
                                featherInterps: [0, 0],
                                featherRadii: [-70.0136, 66.9356],
                                featherRelCornerAngles: [0, 0],
                                featherRelSegLocs: [0.3818, 0.8822],
                                featherSegLocs: [0, 8],
                                featherTensions: [0, 0],
                                featherTypes: [1, 0],
                                inTangents: [
                                    [0, 0],
                                    [0, 0],
                                    [0, 0],
                                    [46.6719, 159.6232],
                                    [0, 0],
                                    [74.2638, -110.2629],
                                    [0, 0],
                                    [0, 0],
                                    [-20.8913, -91.809],
                                    [0, 0],
                                ],
                                outTangents: [
                                    [0, 0],
                                    [0, 0],
                                    [0, 0],
                                    [-46.6719, -159.6232],
                                    [0, 0],
                                    [-74.2639, 110.2629],
                                    [0, 0],
                                    [0, 0],
                                    [20.8913, 91.809],
                                    [0, 0],
                                ],
                                vertices: [
                                    [959.9998, 1027.5862],
                                    [1118.7019, 706.0206],
                                    [1473.5703, 654.4552],
                                    [1216.7852, 404.1516],
                                    [1277.4038, 50.717],
                                    [959.9998, 217.5861],
                                    [642.5959, 50.717],
                                    [703.2147, 404.1516],
                                    [446.4294, 654.4552],
                                    [801.2979, 706.0206],
                                ],
                            },
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
                        },
                    ],
                },
            });
        });

        it('Create', async () => {
            const layerData = {
                masks: [
                    {
                        name: 'Mask 1',
                        color: [0.9098, 0.5725, 0.051],
                        maskPath: {
                            type: AEX_SHAPE_PROPERTY,
                            matchName: 'ADBE Mask Shape',
                            value: {
                                closed: true,
                                featherInterps: [0, 0],
                                featherRadii: [0, 0],
                                featherRelCornerAngles: [0, 0],
                                featherRelSegLocs: [0.3818, 0.8822],
                                featherSegLocs: [0, 8],
                                featherTensions: [0, 0],
                                featherTypes: [1, 0],
                                inTangents: [
                                    [0, 0],
                                    [0, 0],
                                    [0, 0],
                                    [0, 0],
                                    [0, 0],
                                    [0, 0],
                                    [0, 0],
                                    [0, 0],
                                    [0, 0],
                                    [0, 0],
                                ],
                                outTangents: [
                                    [0, 0],
                                    [0, 0],
                                    [0, 0],
                                    [0, 0],
                                    [0, 0],
                                    [0, 0],
                                    [0, 0],
                                    [0, 0],
                                    [0, 0],
                                    [0, 0],
                                ],
                                vertices: [
                                    [960, 50.717],
                                    [801.298, 372.2825],
                                    [446.4295, 423.848],
                                    [703.2147, 674.1516],
                                    [642.5959, 1027.5861],
                                    [960, 860.717],
                                    [1277.4039, 1027.5861],
                                    [1216.7852, 674.1516],
                                    [1473.5703, 423.848],
                                    [1118.7019, 372.2825],
                                ],
                            },
                            keys: [
                                {
                                    time: 0,
                                    type: AEX_KEY,
                                    value: {
                                        closed: true,
                                        featherInterps: [0, 0],
                                        featherRadii: [0, 0],
                                        featherRelCornerAngles: [0, 0],
                                        featherRelSegLocs: [0.3818, 0.8822],
                                        featherSegLocs: [0, 8],
                                        featherTensions: [0, 0],
                                        featherTypes: [1, 0],
                                        inTangents: [
                                            [0, 0],
                                            [0, 0],
                                            [0, 0],
                                            [0, 0],
                                            [0, 0],
                                            [0, 0],
                                            [0, 0],
                                            [0, 0],
                                            [0, 0],
                                            [0, 0],
                                        ],
                                        outTangents: [
                                            [0, 0],
                                            [0, 0],
                                            [0, 0],
                                            [0, 0],
                                            [0, 0],
                                            [0, 0],
                                            [0, 0],
                                            [0, 0],
                                            [0, 0],
                                            [0, 0],
                                        ],
                                        vertices: [
                                            [960, 50.717],
                                            [801.298, 372.2825],
                                            [446.4295, 423.848],
                                            [703.2147, 674.1516],
                                            [642.5959, 1027.5861],
                                            [960, 860.717],
                                            [1277.4039, 1027.5861],
                                            [1216.7852, 674.1516],
                                            [1473.5703, 423.848],
                                            [1118.7019, 372.2825],
                                        ],
                                    },
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
                                },
                                {
                                    time: 4.9583,
                                    type: AEX_KEY,
                                    value: {
                                        closed: true,
                                        featherInterps: [0, 0],
                                        featherRadii: [-70.0136, 66.9356],
                                        featherRelCornerAngles: [0, 0],
                                        featherRelSegLocs: [0.3818, 0.8822],
                                        featherSegLocs: [0, 8],
                                        featherTensions: [0, 0],
                                        featherTypes: [1, 0],
                                        inTangents: [
                                            [0, 0],
                                            [0, 0],
                                            [0, 0],
                                            [46.6719, 159.6232],
                                            [0, 0],
                                            [74.2639, -110.2629],
                                            [0, 0],
                                            [0, 0],
                                            [-20.8913, -91.809],
                                            [0, 0],
                                        ],
                                        outTangents: [
                                            [0, 0],
                                            [0, 0],
                                            [0, 0],
                                            [-46.6719, -159.6232],
                                            [0, 0],
                                            [-74.2639, 110.2629],
                                            [0, 0],
                                            [0, 0],
                                            [20.8913, 91.809],
                                            [0, 0],
                                        ],
                                        vertices: [
                                            [959.9998, 1027.5861],
                                            [1118.7019, 706.0206],
                                            [1473.5703, 654.4552],
                                            [1216.7852, 404.1516],
                                            [1277.4038, 50.717],
                                            [959.9998, 217.5861],
                                            [642.5958, 50.717],
                                            [703.2147, 404.1516],
                                            [446.4294, 654.4552],
                                            [801.2979, 706.0206],
                                        ],
                                    },
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
                                },
                            ],
                        },
                    },
                ],
                type: AEX_NULL_LAYER,
            };

            await openCleanProject();

            await aex.createTestComp();
            await aex.create(AeObject.ActiveComp, layerData);

            const result = await aex.get(AeObject.Layer(1));
            const layer = result.object;

            assertAreEqual(layer.masks, layerData.masks);
        });
    });
});
