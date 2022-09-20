import { AeObject, aex, getProject } from '../aex';
import { AEX_KEY, AEX_NULL_LAYER, AEX_ONED_PROPERTY, TEST_TIMEOUT_TIME } from '../constants';
import { cleanupAex, evalAexIntoEstk, openCleanProject, openProject } from '../csinterface';
import { assertAreEqual } from '../utils';

describe('Layer Animation', function () {
    this.slow(1000);
    this.timeout(TEST_TIMEOUT_TIME);

    before(async () => {
        await evalAexIntoEstk();
    });

    after(async () => {
        await cleanupAex();
    });

    describe('Eased Keyframes', async () => {
        it(`Get`, async () => {
            const { object: project } = await getProject('assets/property_animated.aep', AeObject.Project);
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
                        type: AEX_KEY,
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
                        type: AEX_KEY,
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
                        type: AEX_KEY,
                        value: 90,
                    },
                ],
                matchName: 'ADBE Rotate Z',
                name: 'Z Rotation',
                value: 0,
            });
        });

        it(`Create on layer`, async () => {
            const layerData = {
                threeDLayer: true,
                transform: {
                    rotation: {
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
                                type: AEX_KEY,
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
                                type: AEX_KEY,
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
                                type: AEX_KEY,
                                value: 90,
                            },
                        ],
                        matchName: 'ADBE Rotate Z',
                        name: 'Z Rotation',
                        value: 0,
                    },
                },
                type: AEX_NULL_LAYER,
            };

            await openCleanProject();
            await aex.createTestComp();
            await aex.create(AeObject.ActiveComp, layerData);

            const result = await aex.get(AeObject.Layer(1));
            const layer = result.object;

            assertAreEqual(layer.transform.rotation, layerData.transform.rotation);
        });

        it(`Create on property`, async () => {
            const keyData = {
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
                type: AEX_KEY,
                value: 0,
            };

            await openProject('assets/layer_blank.aep');
            await aex.create(AeObject.LayerProp(1, 'transform.rotation'), keyData);

            const result = await aex.get(AeObject.Layer(1));
            const layer = result.object;
            const route = layer.transform.rotation.keys;

            assertAreEqual(route[route.length - 1], keyData);
        });
    });

    describe('Hold Keyframes', async () => {
        it(`Get`, async () => {
            const { object: project } = await getProject('assets/property_animated.aep', AeObject.Project);
            assertAreEqual(project.comps[1].layers[0].transform.rotation, {
                type: AEX_ONED_PROPERTY,
                keys: [
                    {
                        interpolationType: {
                            outType: 6614,
                        },
                        time: 0,
                        type: AEX_KEY,
                        value: 0,
                    },
                    {
                        interpolationType: {
                            inType: 6613,
                            outType: 6614,
                        },
                        time: 2,
                        type: AEX_KEY,
                        value: 20,
                    },
                    {
                        interpolationType: {
                            inType: 6613,
                            outType: 6614,
                        },
                        time: 3.5,
                        type: AEX_KEY,
                        value: 90,
                    },
                ],
                matchName: 'ADBE Rotate Z',
                name: 'Z Rotation',
                value: 0,
            });
        });

        it(`Create on layer`, async () => {
            const layerData = {
                threeDLayer: true,
                transform: {
                    rotation: {
                        type: AEX_ONED_PROPERTY,
                        keys: [
                            {
                                interpolationType: {
                                    outType: 6614,
                                },
                                time: 0,
                                type: AEX_KEY,
                                value: 0,
                            },
                            {
                                interpolationType: {
                                    inType: 6613,
                                    outType: 6614,
                                },
                                time: 2,
                                type: AEX_KEY,
                                value: 20,
                            },
                            {
                                interpolationType: {
                                    inType: 6613,
                                    outType: 6614,
                                },
                                time: 3.5,
                                type: AEX_KEY,
                                value: 90,
                            },
                        ],
                        matchName: 'ADBE Rotate Z',
                        name: 'Z Rotation',
                        value: 0,
                    },
                },
                type: AEX_NULL_LAYER,
            };

            await openCleanProject();
            await aex.createTestComp();
            await aex.create(AeObject.ActiveComp, layerData);

            const result = await aex.get(AeObject.Layer(1));
            const layer = result.object;

            assertAreEqual(layer.transform.rotation, layerData.transform.rotation);
        });

        it(`Create on property`, async () => {
            const keyData = {
                interpolationType: {
                    inType: 6613,
                    outType: 6614,
                },
                time: 2,
                type: AEX_KEY,
                value: 20,
            };

            await openProject('assets/layer_blank.aep');
            await aex.create(AeObject.LayerProp(1, 'transform.rotation'), keyData);

            const result = await aex.get(AeObject.Layer(1));
            const layer = result.object;
            const route = layer.transform.rotation.keys;

            assertAreEqual(route[route.length - 1], keyData);
        });
    });

    describe('Linear Keyframes', async () => {
        it(`Get`, async () => {
            const { object: project } = await getProject('assets/property_animated.aep', AeObject.Project);
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
                        type: AEX_KEY,
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
                        type: AEX_KEY,
                        value: 90,
                    },
                ],
                matchName: 'ADBE Rotate Z',
                name: 'Z Rotation',
                value: 0,
            });
        });

        it(`Create on layer`, async () => {
            const layerData = {
                threeDLayer: true,
                transform: {
                    rotation: {
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
                                            speed: 22.59423,
                                        },
                                    ],
                                },
                                time: 0,
                                type: AEX_KEY,
                                value: 0,
                            },
                            {
                                temporalEase: {
                                    inEase: [
                                        {
                                            influence: 16.66667,
                                            speed: 22.59423,
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
                                type: AEX_KEY,
                                value: 90,
                            },
                        ],
                        matchName: 'ADBE Rotate Z',
                        name: 'Z Rotation',
                        value: 0,
                    },
                },
                type: AEX_NULL_LAYER,
            };

            await openCleanProject();
            await aex.createTestComp();
            await aex.create(AeObject.ActiveComp, layerData);

            const result = await aex.get(AeObject.Layer(1));
            const layer = result.object;

            assertAreEqual(layer.transform.rotation, layerData.transform.rotation);
        });

        it(`Create on property`, async () => {
            const keyData = {
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
                            speed: 0,
                        },
                    ],
                },
                time: 3.9833,
                type: AEX_KEY,
                value: 90,
            };

            await openProject('assets/layer_blank.aep');
            await aex.create(AeObject.LayerProp(1, 'transform.rotation'), keyData);

            const result = await aex.get(AeObject.Layer(1));
            const layer = result.object;
            const route = layer.transform.rotation.keys;

            assertAreEqual(route[route.length - 1], keyData);
        });
    });

    describe('Mixed Keyframes', async () => {
        it(`Get`, async () => {
            const { object: project } = await getProject('assets/property_animated.aep', AeObject.Project);
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
                        type: AEX_KEY,
                        value: 0,
                    },
                    {
                        interpolationType: {
                            outType: 6614,
                        },
                        time: 1,
                        type: AEX_KEY,
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
                        type: AEX_KEY,
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
                        type: AEX_KEY,
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
                        type: AEX_KEY,
                        value: 90,
                    },
                ],
                matchName: 'ADBE Rotate Z',
                name: 'Z Rotation',
                value: 0,
            });
        });

        it(`Create on layer`, async () => {
            const layerData = {
                threeDLayer: true,
                transform: {
                    rotation: {
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
                                            influence: 95.68888,
                                            speed: 0,
                                        },
                                    ],
                                },
                                time: 0,
                                type: AEX_KEY,
                                value: 0,
                            },
                            {
                                interpolationType: {
                                    outType: 6614,
                                },
                                time: 1,
                                type: AEX_KEY,
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
                                type: AEX_KEY,
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
                                            speed: 40.67864,
                                        },
                                    ],
                                },
                                time: 3,
                                type: AEX_KEY,
                                value: 50,
                            },
                            {
                                temporalEase: {
                                    inEase: [
                                        {
                                            influence: 16.66667,
                                            speed: 40.67864,
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
                                type: AEX_KEY,
                                value: 90,
                            },
                        ],
                        matchName: 'ADBE Rotate Z',
                        name: 'Z Rotation',
                        value: 0,
                    },
                },
                type: AEX_NULL_LAYER,
            };

            await openCleanProject();
            await aex.createTestComp();
            await aex.create(AeObject.ActiveComp, layerData);

            const result = await aex.get(AeObject.Layer(1));
            const layer = result.object;

            assertAreEqual(layer.transform.rotation, layerData.transform.rotation);
        });

        // it(`Can create multiple eased keyframes`, async () => {
        //     const keyData = [
        //         {
        //             interpolationType: {
        //                 outType: 6613,
        //             },
        //             temporalEase: {
        //                 inEase: [
        //                     {
        //                         influence: 16.66667,
        //                         speed: 0,
        //                     },
        //                 ],
        //                 outEase: [
        //                     {
        //                         influence: 33.33333,
        //                         speed: 0,
        //                     },
        //                 ],
        //             },
        //             time: 0,
        //             type: AEX_KEY,
        //             value: 0,
        //         },
        //         {
        //             interpolationType: {
        //                 inType: 6613,
        //                 outType: 6613,
        //             },
        //             temporalEase: {
        //                 inEase: [
        //                     {
        //                         influence: 33.33333,
        //                         speed: 33.89062,
        //                     },
        //                 ],
        //                 outEase: [
        //                     {
        //                         influence: 33.33333,
        //                         speed: 33.89062,
        //                     },
        //                 ],
        //             },
        //             time: 2,
        //             type: AEX_KEY,
        //             value: 20,
        //         },
        //         {
        //             interpolationType: {
        //                 inType: 6613,
        //             },
        //             temporalEase: {
        //                 inEase: [
        //                     {
        //                         influence: 33.33333,
        //                         speed: 0,
        //                     },
        //                 ],
        //                 outEase: [
        //                     {
        //                         influence: 16.66667,
        //                         speed: 0,
        //                     },
        //                 ],
        //             },
        //             time: 3.9833,
        //             type: AEX_KEY,
        //             value: 90,
        //         },
        //     ];

        //     await openProject('assets/layer_blank.aep');
        //     await aex().create(AeObject.LayerProp(1, 'transform.rotation'), keyData);

        //     const result = await aex().get(AeObject.Layer(1));
        //     const layer = result.object;
        //     const route = layer.transform.rotation.keys;

        //     assertAreEqual(route, keyData);
        // });
    });
});
