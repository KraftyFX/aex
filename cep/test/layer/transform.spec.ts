import { AeObject, aex, getProject } from '../aex';
import {
    AEX_CAMERA_LAYER,
    AEX_COMP_ITEM,
    AEX_LIGHT_LAYER,
    AEX_NULL_LAYER,
    AEX_ONED_PROPERTY,
    AEX_THREED_PROPERTY,
    TEST_TIMEOUT_TIME,
} from '../constants';
import { cleanupAex, evalAexIntoEstk, openCleanProject } from '../csinterface';
import { assertAreEqual } from '../utils';

describe('Layer Transform', function () {
    this.slow(1000);
    this.timeout(TEST_TIMEOUT_TIME);

    before(async () => {
        await evalAexIntoEstk();
    });

    after(async () => {
        await cleanupAex();
    });

    describe('Default', async () => {
        it('Get', async () => {
            const { object: project } = await getProject('assets/layer_transform.aep', AeObject.Project);
            assertAreEqual(project.comps[0].layers, [
                {
                    label: 4,
                    name: 'Camera',
                    transform: {
                        position: {
                            matchName: 'ADBE Position',
                            type: AEX_THREED_PROPERTY,
                            value: [640, 360, -1777.7778],
                        },
                    },
                    type: AEX_CAMERA_LAYER,
                },
                {
                    label: 6,
                    lightType: 4414,
                    name: 'Light',
                    transform: {
                        position: {
                            matchName: 'ADBE Position',
                            type: AEX_THREED_PROPERTY,
                            value: [693.3333, 306.6667, -444.4444],
                        },
                    },
                    type: AEX_LIGHT_LAYER,
                },
                {
                    label: 1,
                    name: '3d AV Layer',
                    threeDLayer: true,
                    type: AEX_NULL_LAYER,
                },
                {
                    label: 1,
                    name: '2d AV Layer',
                    type: AEX_NULL_LAYER,
                },
            ]);
        });

        it(`Create`, async () => {
            const compData = {
                layers: [
                    {
                        label: 4,
                        name: 'Camera',
                        transform: {
                            position: {
                                matchName: 'ADBE Position',
                                type: AEX_THREED_PROPERTY,
                                value: [640, 360, -1777.7778],
                            },
                        },
                        type: AEX_CAMERA_LAYER,
                    },
                    {
                        label: 6,
                        lightType: 4414,
                        name: 'Light',
                        transform: {
                            position: {
                                matchName: 'ADBE Position',
                                type: AEX_THREED_PROPERTY,
                                value: [693.3333, 306.6667, -444.4444],
                            },
                        },
                        type: AEX_LIGHT_LAYER,
                    },
                    {
                        label: 1,
                        name: '3d AV Layer',
                        threeDLayer: true,
                        type: AEX_NULL_LAYER,
                    },
                    {
                        label: 1,
                        name: '2d AV Layer',
                        type: AEX_NULL_LAYER,
                    },
                ],
                name: 'Defaults',
                type: AEX_COMP_ITEM,
            };

            await openCleanProject();
            await aex.create(AeObject.Project, compData);

            const result = await aex.get(AeObject.ActiveComp);
            const comp = result.object;

            assertAreEqual(comp.layers, compData.layers);
        });
    });

    describe('3D Camera', async () => {
        it('Get', async () => {
            const { object: project } = await getProject('assets/layer_transform.aep', AeObject.Project);
            assertAreEqual(project.comps[1].layers[0], {
                label: 4,
                name: 'Camera',
                transform: {
                    orientation: {
                        type: AEX_THREED_PROPERTY,
                        matchName: 'ADBE Orientation',
                        value: [100, 200, 300],
                    },
                    pointOfInterest: {
                        type: AEX_THREED_PROPERTY,
                        matchName: 'ADBE Anchor Point',
                        value: [11, 22, 33],
                    },
                    position: {
                        type: AEX_THREED_PROPERTY,
                        matchName: 'ADBE Position',
                        value: [1, 2, -3],
                    },
                    rotation: {
                        type: AEX_ONED_PROPERTY,
                        matchName: 'ADBE Rotate Z',
                        value: 90,
                    },
                    xRotation: {
                        type: AEX_ONED_PROPERTY,
                        matchName: 'ADBE Rotate X',
                        value: -90,
                    },
                    yRotation: {
                        type: AEX_ONED_PROPERTY,
                        matchName: 'ADBE Rotate Y',
                        value: -3600,
                    },
                },
                type: AEX_CAMERA_LAYER,
            });
        });

        it(`Create`, async () => {
            const layerData = {
                label: 4,
                name: 'Camera',
                transform: {
                    orientation: {
                        type: AEX_THREED_PROPERTY,
                        matchName: 'ADBE Orientation',
                        value: [100, 200, 300],
                    },
                    pointOfInterest: {
                        type: AEX_THREED_PROPERTY,
                        matchName: 'ADBE Anchor Point',
                        value: [11, 22, 33],
                    },
                    position: {
                        type: AEX_THREED_PROPERTY,
                        matchName: 'ADBE Position',
                        value: [1, 2, -3],
                    },
                    rotation: {
                        type: AEX_ONED_PROPERTY,
                        matchName: 'ADBE Rotate Z',
                        value: 90,
                    },
                    xRotation: {
                        type: AEX_ONED_PROPERTY,
                        matchName: 'ADBE Rotate X',
                        value: -90,
                    },
                    yRotation: {
                        type: AEX_ONED_PROPERTY,
                        matchName: 'ADBE Rotate Y',
                        value: -3600,
                    },
                },
                type: AEX_CAMERA_LAYER,
            };

            await openCleanProject();
            await aex.createTestComp();
            await aex.create(AeObject.ActiveComp, layerData);

            const result = await aex.get(AeObject.Layer(1));
            const layer = result.object;

            assertAreEqual(layer, layerData);
        });
    });

    describe('3D Light Layer', async () => {
        it('Get', async () => {
            const { object: project } = await getProject('assets/layer_transform.aep', AeObject.Project);
            assertAreEqual(project.comps[1].layers[1], {
                label: 6,
                lightType: 4414,
                name: 'Light',
                transform: {
                    position: {
                        type: AEX_THREED_PROPERTY,
                        matchName: 'ADBE Position',
                        value: [100, 200, 300],
                    },
                },
                type: AEX_LIGHT_LAYER,
            });
        });

        it(`Create`, async () => {
            const layerData = {
                label: 6,
                lightType: 4414,
                name: 'Light',
                transform: {
                    position: {
                        type: AEX_THREED_PROPERTY,
                        matchName: 'ADBE Position',
                        value: [100, 200, 300],
                    },
                },
                type: AEX_LIGHT_LAYER,
            };

            await openCleanProject();
            await aex.createTestComp();
            await aex.create(AeObject.ActiveComp, layerData);

            const result = await aex.get(AeObject.Layer(1));
            const layer = result.object;

            assertAreEqual(layer, layerData);
        });
    });

    describe('3D AVLayer Null', async () => {
        it('Get', async () => {
            const { object: project } = await getProject('assets/layer_transform.aep', AeObject.Project);
            assertAreEqual(project.comps[1].layers[2], {
                label: 1,
                name: '3d AV Layer',
                threeDLayer: true,
                transform: {
                    anchorPoint: {
                        type: AEX_THREED_PROPERTY,
                        matchName: 'ADBE Anchor Point',
                        value: [11, 22, 33],
                    },
                    opacity: {
                        type: AEX_ONED_PROPERTY,
                        matchName: 'ADBE Opacity',
                        value: 50,
                    },
                    orientation: {
                        type: AEX_THREED_PROPERTY,
                        matchName: 'ADBE Orientation',
                        value: [100, 200, 300],
                    },
                    position: {
                        type: AEX_THREED_PROPERTY,
                        matchName: 'ADBE Position',
                        value: [1, 2, -3],
                    },
                    rotation: {
                        type: AEX_ONED_PROPERTY,
                        matchName: 'ADBE Rotate Z',
                        value: 90,
                    },
                    scale: {
                        type: AEX_THREED_PROPERTY,
                        matchName: 'ADBE Scale',
                        value: [10, 20, 30],
                    },
                    xRotation: {
                        type: AEX_ONED_PROPERTY,
                        matchName: 'ADBE Rotate X',
                        value: -90,
                    },
                    yRotation: {
                        type: AEX_ONED_PROPERTY,
                        matchName: 'ADBE Rotate Y',
                        value: -3600,
                    },
                },
                type: AEX_NULL_LAYER,
            });
        });

        it(`Create`, async () => {
            const layerData = {
                label: 1,
                name: '3d AV Layer',
                threeDLayer: true,
                transform: {
                    anchorPoint: {
                        type: AEX_THREED_PROPERTY,
                        matchName: 'ADBE Anchor Point',
                        value: [11, 22, 33],
                    },
                    opacity: {
                        type: AEX_ONED_PROPERTY,
                        matchName: 'ADBE Opacity',
                        value: 50,
                    },
                    orientation: {
                        type: AEX_THREED_PROPERTY,
                        matchName: 'ADBE Orientation',
                        value: [100, 200, 300],
                    },
                    position: {
                        type: AEX_THREED_PROPERTY,
                        matchName: 'ADBE Position',
                        value: [1, 2, -3],
                    },
                    rotation: {
                        type: AEX_ONED_PROPERTY,
                        matchName: 'ADBE Rotate Z',
                        value: 90,
                    },
                    scale: {
                        type: AEX_THREED_PROPERTY,
                        matchName: 'ADBE Scale',
                        value: [10, 20, 30],
                    },
                    xRotation: {
                        type: AEX_ONED_PROPERTY,
                        matchName: 'ADBE Rotate X',
                        value: -90,
                    },
                    yRotation: {
                        type: AEX_ONED_PROPERTY,
                        matchName: 'ADBE Rotate Y',
                        value: -3600,
                    },
                },
                type: AEX_NULL_LAYER,
            };

            await openCleanProject();
            await aex.createTestComp();
            await aex.create(AeObject.ActiveComp, layerData);

            const result = await aex.get(AeObject.Layer(1));
            const layer = result.object;

            assertAreEqual(layer, layerData);
        });
    });

    describe('2D AVLayer Null', async () => {
        it('Get', async () => {
            const { object: project } = await getProject('assets/layer_transform.aep', AeObject.Project);
            assertAreEqual(project.comps[1].layers[3], {
                label: 1,
                name: '2d AV Layer',
                transform: {
                    anchorPoint: {
                        type: AEX_THREED_PROPERTY,
                        matchName: 'ADBE Anchor Point',
                        value: [11, 22, 0],
                    },
                    opacity: {
                        type: AEX_ONED_PROPERTY,
                        matchName: 'ADBE Opacity',
                        value: 50,
                    },
                    position: {
                        type: AEX_THREED_PROPERTY,
                        matchName: 'ADBE Position',
                        value: [1, 2, 0],
                    },
                    rotation: {
                        type: AEX_ONED_PROPERTY,
                        matchName: 'ADBE Rotate Z',
                        value: 90,
                    },
                    scale: {
                        type: AEX_THREED_PROPERTY,
                        matchName: 'ADBE Scale',
                        value: [10, 20, 100],
                    },
                },
                type: AEX_NULL_LAYER,
            });
        });

        it(`Create`, async () => {
            const layerData = {
                label: 1,
                name: '2d AV Layer',
                transform: {
                    anchorPoint: {
                        type: AEX_THREED_PROPERTY,
                        matchName: 'ADBE Anchor Point',
                        value: [11, 22, 0],
                    },
                    opacity: {
                        type: AEX_ONED_PROPERTY,
                        matchName: 'ADBE Opacity',
                        value: 50,
                    },
                    position: {
                        type: AEX_THREED_PROPERTY,
                        matchName: 'ADBE Position',
                        value: [1, 2, 0],
                    },
                    rotation: {
                        type: AEX_ONED_PROPERTY,
                        matchName: 'ADBE Rotate Z',
                        value: 90,
                    },
                    scale: {
                        type: AEX_THREED_PROPERTY,
                        matchName: 'ADBE Scale',
                        value: [10, 20, 100],
                    },
                },
                type: AEX_NULL_LAYER,
            };

            await openCleanProject();
            await aex.createTestComp();
            await aex.create(AeObject.ActiveComp, layerData);

            const result = await aex.get(AeObject.Layer(1));
            const layer = result.object;

            assertAreEqual(layer, layerData);
        });
    });
});
