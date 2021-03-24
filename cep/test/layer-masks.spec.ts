import { AeObject, aex } from './aex';
import { cleanupAeqIpc, cleanupAex, evalAexIntoESTK, openProject } from './csinterface';
import { assertAreEqual } from './utils';

describe('Layer Masks', function () {
    this.slow(500);
    this.timeout(2000);

    let result: any;

    before(async () => {
        await evalAexIntoESTK();
        await openProject('testAssets/layer_masks.aep');
        result = await aex().toObjectWithAeObject(AeObject.ActiveComp);
        console.log('layer_masks', result);
    });

    after(async () => {
        await cleanupAex();
        await cleanupAeqIpc();
    });

    it('Can parse simple mask paths', async () => {
        assertAreEqual(result.comps[0].layers[0].masks[0], {
            color: [0.70196078431373, 0.78039215686275, 0.70196078431373],
            maskPath: {
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
                        [96.5352172851562, 0],
                        [0, -96.5352172851562],
                        [-96.5352020263672, 0],
                        [0, 96.5351867675781],
                    ],
                    outTangents: [
                        [-96.5352020263672, 0],
                        [0, 96.5351867675781],
                        [96.5352172851562, 0],
                        [0, -96.5352172851562],
                    ],
                    vertices: [
                        [279.849060058594, 92.3773651123047],
                        [105.056610107422, 267.169830322266],
                        [279.849060058594, 441.962280273438],
                        [454.641540527344, 267.169830322266],
                    ],
                },
            },
            name: 'Basic',
        });
    });

    it('Can parse simple mask attributes', async () => {
        assertAreEqual(result.comps[0].layers[0].masks[1], {
            color: [0.55686274509804, 0.17254901960784, 0.60392156862745],
            inverted: true,
            maskExpansion: {
                keys: [],
                matchName: 'ADBE Mask Offset',
                name: 'Mask Expansion',
                value: 23,
            },
            maskFeather: {
                keys: [],
                matchName: 'ADBE Mask Feather',
                name: 'Mask Feather',
                value: [33, 33],
            },
            maskMode: 6814,
            maskOpacity: {
                keys: [],
                matchName: 'ADBE Mask Opacity',
                name: 'Mask Opacity',
                value: 73,
            },
            maskPath: {
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
                        [1552.3017578125, 432.905731201172],
                        [1381.7353515625, 528.466918945312],
                        [1206.31774902344, 442.133514404297],
                        [1244.49389648438, 633.881958007812],
                        [1108.17895507812, 774.03564453125],
                        [1302.33947753906, 796.981323242188],
                        [1393.50988769531, 969.934204101562],
                        [1475.33142089844, 792.367431640625],
                        [1667.99279785156, 759.104736328125],
                        [1524.40087890625, 626.41650390625],
                    ],
                },
            },
            name: 'Attributes',
        });
    });

    it('Can parse detailed masks with feather', async () => {
        assertAreEqual(result.comps[0].layers[1].masks[0], {
            color: [0.70196078431373, 0.78039215686275, 0.70196078431373],
            maskPath: {
                keys: [],
                matchName: 'ADBE Mask Shape',
                name: 'Mask Path',
                value: {
                    closed: true,
                    featherInterps: [0, 0, 0],
                    featherRadii: [74.2787603454047, 0, 54.6675452679194],
                    featherRelCornerAngles: [0, 0, 0],
                    featherRelSegLocs: [0.99291693248793, 0.98317569935943, 0.88107259136291],
                    featherSegLocs: [1, 2, 3],
                    featherTensions: [0, 0, 0],
                    featherTypes: [0, 0, 0],
                    inTangents: [
                        [96.5352172851562, 0],
                        [0, -96.5352172851562],
                        [-96.5352020263672, 0],
                        [0, 96.5351867675781],
                    ],
                    outTangents: [
                        [-96.5352020263672, 0],
                        [0, 96.5351867675781],
                        [96.5352172851562, 0],
                        [0, -96.5352172851562],
                    ],
                    vertices: [
                        [279.849060058594, 92.3773651123047],
                        [105.056610107422, 267.169830322266],
                        [279.849060058594, 441.962280273438],
                        [454.641540527344, 267.169830322266],
                    ],
                },
            },
            name: 'Feather',
        });
    });

    it('Can parse animated masks', async () => {
        assertAreEqual(result.comps[0].layers[2].masks[0].maskPath, {
            keys: [
                {
                    interpolationType: {},
                    temporalEase: {
                        inEase: [{ influence: 16.666666667, speed: 0 }],
                        outEase: [{ influence: 16.666666667, speed: 1 }],
                    },
                    time: 0,
                    value: {
                        closed: true,
                        featherInterps: [0, 0],
                        featherRadii: [-1e-8, 0],
                        featherRelCornerAngles: [0, 0],
                        featherRelSegLocs: [0.38178384436651, 0.88224978803798],
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
                            [960, 50.7169952392578],
                            [801.297973632812, 372.282531738281],
                            [446.429504394531, 423.847961425781],
                            [703.214721679688, 674.151550292969],
                            [642.595947265625, 1027.58605957031],
                            [960, 860.716979980469],
                            [1277.40393066406, 1027.58605957031],
                            [1216.78515625, 674.151550292969],
                            [1473.5703125, 423.847961425781],
                            [1118.70190429688, 372.282531738281],
                        ],
                    },
                },
                {
                    interpolationType: {},
                    temporalEase: {
                        inEase: [{ influence: 16.666666667, speed: 1 }],
                        outEase: [{ influence: 16.666666667, speed: 0 }],
                    },
                    time: 4.95833333333333,
                    value: {
                        closed: true,
                        featherInterps: [0, 0],
                        featherRadii: [-70.0135515570367, 66.9355929759104],
                        featherRelCornerAngles: [0, 0],
                        featherRelSegLocs: [0.38178384436651, 0.88224978803798],
                        featherSegLocs: [0, 8],
                        featherTensions: [0, 0],
                        featherTypes: [1, 0],
                        inTangents: [
                            [0, 0],
                            [0, 0],
                            [0, 0],
                            [46.671875, 159.623229980469],
                            [0, 0],
                            [74.2637939453125, -110.262939453125],
                            [0, 0],
                            [0, 0],
                            [-20.8913269042969, -91.8089599609375],
                            [0, 0],
                        ],
                        outTangents: [
                            [0, 0],
                            [0, 0],
                            [0, 0],
                            [-46.671875, -159.623245239258],
                            [0, 0],
                            [-74.2638549804688, 110.262939453125],
                            [0, 0],
                            [0, 0],
                            [20.8913269042969, 91.8089599609375],
                            [0, 0],
                        ],
                        vertices: [
                            [959.999755859375, 1027.58618164062],
                            [1118.70190429688, 706.020629882812],
                            [1473.5703125, 654.455200195312],
                            [1216.78515625, 404.151550292969],
                            [1277.40380859375, 50.717041015625],
                            [959.999755859375, 217.586120605469],
                            [642.595886230469, 50.717041015625],
                            [703.214660644531, 404.151550292969],
                            [446.429443359375, 654.455200195312],
                            [801.297912597656, 706.020629882812],
                        ],
                    },
                },
            ],
            matchName: 'ADBE Mask Shape',
            name: 'Mask Path',
            value: {
                closed: true,
                featherInterps: [0, 0],
                featherRadii: [-1e-8, 0],
                featherRelCornerAngles: [0, 0],
                featherRelSegLocs: [0.38178384436651, 0.88224978803798],
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
                    [960, 50.7169952392578],
                    [801.297973632812, 372.282531738281],
                    [446.429504394531, 423.847961425781],
                    [703.214721679688, 674.151550292969],
                    [642.595947265625, 1027.58605957031],
                    [960, 860.716979980469],
                    [1277.40393066406, 1027.58605957031],
                    [1216.78515625, 674.151550292969],
                    [1473.5703125, 423.847961425781],
                    [1118.70190429688, 372.282531738281],
                ],
            },
        });
    });
});