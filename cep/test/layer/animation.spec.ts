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
                                influence: 16.66667,
                                speed: 0,
                            },
                        ],
                        outEase: [
                            {
                                influence: 33.33333,
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
                                influence: 33.33333,
                                speed: 33.89062,
                            },
                        ],
                        outEase: [
                            {
                                influence: 33.33333,
                                speed: 33.89062,
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
                                influence: 33.33333,
                                speed: 0,
                            },
                        ],
                        outEase: [
                            {
                                influence: 16.66667,
                                speed: 0,
                            },
                        ],
                    },
                    time: 3.9833,
                    value: 90,
                },
            ],
            matchName: 'ADBE Rotate Z',
            name: 'Z Rotation',
            value: 0,
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
                                speed: 22.59414,
                            },
                        ],
                    },
                    time: 0,
                    value: 0,
                },
                {
                    temporalEase: {
                        inEase: [
                            {
                                influence: 16.66667,
                                speed: 22.59414,
                            },
                        ],
                        outEase: [
                            {
                                influence: 16.66667,
                                speed: 0,
                            },
                        ],
                    },
                    time: 3.9833,
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
                                influence: 16.66667,
                                speed: 0,
                            },
                        ],
                        outEase: [
                            {
                                influence: 95.68875,
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
                                influence: 16.66667,
                                speed: 0,
                            },
                        ],
                        outEase: [
                            {
                                influence: 66.55934,
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
                                influence: 85.2938,
                                speed: 0,
                            },
                        ],
                        outEase: [
                            {
                                influence: 16.66667,
                                speed: 40.67797,
                            },
                        ],
                    },
                    time: 3,
                    value: 50,
                },
                {
                    temporalEase: {
                        inEase: [
                            {
                                influence: 16.66667,
                                speed: 40.67797,
                            },
                        ],
                        outEase: [
                            {
                                influence: 16.66667,
                                speed: 0,
                            },
                        ],
                    },
                    time: 3.9833,
                    value: 90,
                },
            ],
            matchName: 'ADBE Rotate Z',
            name: 'Z Rotation',
            value: 0,
        });
    });
});
