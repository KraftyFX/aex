import { AeObject, aex } from '../aex';
import { AEX_ONED_PROPERTY } from '../constants';
import { cleanupAex, evalAexIntoEstk, openProject } from '../csinterface';
import { assertAreEqual } from '../utils';

describe('Layer Animation', function () {
    this.slow(500);
    this.timeout(2000);

    let project: any;

    before(async () => {
        await evalAexIntoEstk();
        await openProject('testAssets/property_animated.aep');
        const result = await aex().fromAeObject(AeObject.Project);
        project = result.object;
        console.log('property_animated', project);
    });

    after(async () => {
        await cleanupAex();
    });

    it(`Can parse eased keyframes`, async () => {
        assertAreEqual(project.comps[0].layers[0].transform.rotation, {
            type: AEX_ONED_PROPERTY,
            keys: [
                {
                    interpolationType: {
                        outType: 6613,
                    },
                    temporalEase: {
                        inEase: [
                            {
                                influence: 16.666666667,
                                speed: 0,
                            },
                        ],
                        outEase: [
                            {
                                influence: 33.333332999578,
                                speed: 0,
                            },
                        ],
                    },
                    time: 0,
                    value: 0,
                },
                {
                    interpolationType: {
                        inType: 6613,
                        outType: 6613,
                    },
                    temporalEase: {
                        inEase: [
                            {
                                influence: 33.333333498752,
                                speed: 33.8906198973312,
                            },
                        ],
                        outEase: [
                            {
                                influence: 33.3333335012409,
                                speed: 33.8906198956625,
                            },
                        ],
                    },
                    time: 2,
                    value: 20,
                },
                {
                    interpolationType: {
                        inType: 6613,
                    },
                    temporalEase: {
                        inEase: [
                            {
                                influence: 33.3333330004256,
                                speed: 0,
                            },
                        ],
                        outEase: [
                            {
                                influence: 16.666666667,
                                speed: 0,
                            },
                        ],
                    },
                    time: 3.98333333333333,
                    value: 90,
                },
            ],
            matchName: 'ADBE Rotate Z',
            name: 'Z Rotation',
            value: 20,
        });
    });
    it(`Can parse hold keyframes`, async () => {
        assertAreEqual(project.comps[1].layers[0].transform.rotation, {
            type: AEX_ONED_PROPERTY,
            keys: [
                {
                    interpolationType: {
                        outType: 6614,
                    },
                    time: 0,
                    value: 0,
                },
                {
                    interpolationType: {
                        inType: 6613,
                        outType: 6614,
                    },
                    time: 2,
                    value: 20,
                },
                {
                    interpolationType: {
                        inType: 6613,
                        outType: 6614,
                    },
                    time: 3.5,
                    value: 90,
                },
            ],
            matchName: 'ADBE Rotate Z',
            name: 'Z Rotation',
            value: 0,
        });
    });
    it(`Can parse linear keyframes`, async () => {
        assertAreEqual(project.comps[2].layers[0].transform.rotation, {
            type: AEX_ONED_PROPERTY,
            keys: [
                {
                    interpolationType: {},
                    temporalEase: {
                        inEase: [
                            {
                                influence: 16.666666667,
                                speed: 0,
                            },
                        ],
                        outEase: [
                            {
                                influence: 16.666666667,
                                speed: 22.5941422594142,
                            },
                        ],
                    },
                    time: 0,
                    value: 0,
                },
                {
                    interpolationType: {},
                    temporalEase: {
                        inEase: [
                            {
                                influence: 16.666666667,
                                speed: 22.5941422594142,
                            },
                        ],
                        outEase: [
                            {
                                influence: 16.666666667,
                                speed: 0,
                            },
                        ],
                    },
                    time: 3.98333333333333,
                    value: 90,
                },
            ],
            matchName: 'ADBE Rotate Z',
            name: 'Z Rotation',
            value: 0,
        });
    });

    it(`Can parse mixed easing keyframes`, async () => {
        assertAreEqual(project.comps[3].layers[0].transform.rotation, {
            type: AEX_ONED_PROPERTY,
            keys: [
                {
                    interpolationType: {
                        outType: 6613,
                    },
                    temporalEase: {
                        inEase: [
                            {
                                influence: 16.666666667,
                                speed: 0,
                            },
                        ],
                        outEase: [
                            {
                                influence: 95.6887529934006,
                                speed: 0,
                            },
                        ],
                    },
                    time: 0,
                    value: 0,
                },
                {
                    interpolationType: {
                        outType: 6614,
                    },
                    time: 1,
                    value: 10,
                },
                {
                    interpolationType: {
                        inType: 6613,
                        outType: 6613,
                    },
                    temporalEase: {
                        inEase: [
                            {
                                influence: 16.666666667,
                                speed: 0,
                            },
                        ],
                        outEase: [
                            {
                                influence: 66.5593382363078,
                                speed: 0,
                            },
                        ],
                    },
                    time: 2,
                    value: 20,
                },
                {
                    interpolationType: {
                        inType: 6613,
                    },
                    temporalEase: {
                        inEase: [
                            {
                                influence: 85.2938012922363,
                                speed: 0,
                            },
                        ],
                        outEase: [
                            {
                                influence: 16.666666667,
                                speed: 40.6779661016949,
                            },
                        ],
                    },
                    time: 3,
                    value: 50,
                },
                {
                    interpolationType: {},
                    temporalEase: {
                        inEase: [
                            {
                                influence: 16.666666667,
                                speed: 40.6779661016949,
                            },
                        ],
                        outEase: [
                            {
                                influence: 16.666666667,
                                speed: 0,
                            },
                        ],
                    },
                    time: 3.98333333333333,
                    value: 90,
                },
            ],
            matchName: 'ADBE Rotate Z',
            name: 'Z Rotation',
            value: 0,
        });
    });
});
