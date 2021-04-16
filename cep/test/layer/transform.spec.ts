import { AeObject, aex } from '../aex';
import {
    AEX_CAMERA_LAYER,
    AEX_COMP_ITEM,
    AEX_LIGHT_LAYER,
    AEX_NULL_LAYER,
    AEX_ONED_PROPERTY,
    AEX_PROJECT,
    AEX_SOLID_ITEM,
    AEX_THREED_PROPERTY,
} from '../constants';
import { cleanupAex, evalAexIntoEstk, openCleanProject, openProject } from '../csinterface';
import { assertAreEqual } from '../utils';

describe('Layer Transform', function () {
    this.slow(500);
    this.timeout(2000);

    before(async () => {
        await evalAexIntoEstk();
    });

    after(async () => {
        await cleanupAex();
    });

    describe('Get', async () => {
        let project: any;

        before(async () => {
            await openProject('testAssets/layer_transform.aep');
            const result = await aex().fromAeObject(AeObject.Project);
            project = result.object;
            console.log('layer_transform', project);
        });

        it('Can parse default transform data', async () => {
            assertAreEqual(project.comps[0].layers, [
                {
                    label: 4,
                    markers: [],
                    name: 'Camera',
                    transform: {
                        position: {
                            keys: [],
                            matchName: 'ADBE Position',
                            name: 'Position',
                            type: AEX_THREED_PROPERTY,
                            value: [640, 360, -1777.7778],
                        },
                    },
                    type: AEX_CAMERA_LAYER,
                },
                {
                    label: 6,
                    lightType: 4414,
                    markers: [],
                    name: 'Light',
                    transform: {
                        position: {
                            keys: [],
                            matchName: 'ADBE Position',
                            name: 'Position',
                            type: AEX_THREED_PROPERTY,
                            value: [693.3333, 306.6667, -444.4444],
                        },
                    },
                    type: AEX_LIGHT_LAYER,
                },
                {
                    effects: [],
                    label: 1,
                    markers: [],
                    masks: [],
                    name: '3d AV Layer',
                    source: {
                        type: AEX_SOLID_ITEM,
                        id: 'null 1:50',
                    },
                    threeDLayer: true,
                    trackers: [],
                    transform: {},
                    type: AEX_NULL_LAYER,
                },
                {
                    effects: [],
                    label: 1,
                    markers: [],
                    masks: [],
                    name: '2d AV Layer',
                    source: {
                        type: AEX_SOLID_ITEM,
                        id: 'null 1:50',
                    },
                    trackers: [],
                    transform: {},
                    type: AEX_NULL_LAYER,
                },
            ]);
        });

        it('Can parse modified 3d Camera data', async () => {
            assertAreEqual(project.comps[1].layers[0], {
                label: 4,
                markers: [],
                name: 'Camera',
                transform: {
                    orientation: {
                        type: AEX_THREED_PROPERTY,
                        keys: [],
                        matchName: 'ADBE Orientation',
                        name: 'Orientation',
                        value: [100, 200, 300],
                    },
                    pointOfInterest: {
                        type: AEX_THREED_PROPERTY,
                        keys: [],
                        matchName: 'ADBE Anchor Point',
                        name: 'Point of Interest',
                        value: [11, 22, 33],
                    },
                    position: {
                        type: AEX_THREED_PROPERTY,
                        keys: [],
                        matchName: 'ADBE Position',
                        name: 'Position',
                        value: [1, 2, -3],
                    },
                    rotation: {
                        type: AEX_ONED_PROPERTY,
                        keys: [],
                        matchName: 'ADBE Rotate Z',
                        name: 'Z Rotation',
                        value: 90,
                    },
                    xRotation: {
                        type: AEX_ONED_PROPERTY,
                        keys: [],
                        matchName: 'ADBE Rotate X',
                        name: 'X Rotation',
                        value: -90,
                    },
                    yRotation: {
                        type: AEX_ONED_PROPERTY,
                        keys: [],
                        matchName: 'ADBE Rotate Y',
                        name: 'Y Rotation',
                        value: -3600,
                    },
                },
                type: AEX_CAMERA_LAYER,
            });
        });

        it('Can parse modified 3d LightLayer data', async () => {
            assertAreEqual(project.comps[1].layers[1], {
                label: 6,
                lightType: 4414,
                markers: [],
                name: 'Light',
                transform: {
                    position: {
                        type: AEX_THREED_PROPERTY,
                        keys: [],
                        matchName: 'ADBE Position',
                        name: 'Position',
                        value: [100, 200, 300],
                    },
                },
                type: AEX_LIGHT_LAYER,
            });
        });

        it('Can parse modified 3d AVLayer Null data', async () => {
            assertAreEqual(project.comps[1].layers[2], {
                effects: [],
                label: 1,
                markers: [],
                masks: [],
                name: '3d AV Layer',
                threeDLayer: true,
                source: {
                    type: AEX_SOLID_ITEM,
                    id: 'null 1:50',
                },
                trackers: [],
                transform: {
                    anchorPoint: {
                        type: AEX_THREED_PROPERTY,
                        keys: [],
                        matchName: 'ADBE Anchor Point',
                        name: 'Anchor Point',
                        value: [11, 22, 33],
                    },
                    opacity: {
                        type: AEX_ONED_PROPERTY,
                        keys: [],
                        matchName: 'ADBE Opacity',
                        name: 'Opacity',
                        value: 50,
                    },
                    orientation: {
                        type: AEX_THREED_PROPERTY,
                        keys: [],
                        matchName: 'ADBE Orientation',
                        name: 'Orientation',
                        value: [100, 200, 300],
                    },
                    position: {
                        type: AEX_THREED_PROPERTY,
                        keys: [],
                        matchName: 'ADBE Position',
                        name: 'Position',
                        value: [1, 2, -3],
                    },
                    rotation: {
                        type: AEX_ONED_PROPERTY,
                        keys: [],
                        matchName: 'ADBE Rotate Z',
                        name: 'Z Rotation',
                        value: 90,
                    },
                    scale: {
                        type: AEX_THREED_PROPERTY,
                        keys: [],
                        matchName: 'ADBE Scale',
                        name: 'Scale',
                        value: [10, 20, 30],
                    },
                    xRotation: {
                        type: AEX_ONED_PROPERTY,
                        keys: [],
                        matchName: 'ADBE Rotate X',
                        name: 'X Rotation',
                        value: -90,
                    },
                    yRotation: {
                        type: AEX_ONED_PROPERTY,
                        keys: [],
                        matchName: 'ADBE Rotate Y',
                        name: 'Y Rotation',
                        value: -3600,
                    },
                },
                type: AEX_NULL_LAYER,
            });
        });

        it('Can parse modified 2d AVLayer Null data', async () => {
            assertAreEqual(project.comps[1].layers[3], {
                effects: [],
                label: 1,
                markers: [],
                masks: [],
                name: '2d AV Layer',
                source: {
                    type: AEX_SOLID_ITEM,
                    id: 'null 1:50',
                },
                trackers: [],
                transform: {
                    anchorPoint: {
                        type: AEX_THREED_PROPERTY,
                        keys: [],
                        matchName: 'ADBE Anchor Point',
                        name: 'Anchor Point',
                        value: [11, 22, 0],
                    },
                    opacity: {
                        type: AEX_ONED_PROPERTY,
                        keys: [],
                        matchName: 'ADBE Opacity',
                        name: 'Opacity',
                        value: 50,
                    },
                    position: {
                        type: AEX_THREED_PROPERTY,
                        keys: [],
                        matchName: 'ADBE Position',
                        name: 'Position',
                        value: [1, 2, 0],
                    },
                    rotation: {
                        type: AEX_ONED_PROPERTY,
                        keys: [],
                        matchName: 'ADBE Rotate Z',
                        name: 'Rotation',
                        value: 90,
                    },
                    scale: {
                        type: AEX_THREED_PROPERTY,
                        keys: [],
                        matchName: 'ADBE Scale',
                        name: 'Scale',
                        value: [10, 20, 100],
                    },
                },
                type: AEX_NULL_LAYER,
            });
        });
    });

    describe('Set', async () => {
        before(async () => {
            await openCleanProject();
        });

        it(`Can set default transform data`, async () => {
            const compData = {
                layers: [
                    {
                        label: 4,
                        markers: [],
                        name: 'Camera',
                        transform: {
                            position: {
                                keys: [],
                                matchName: 'ADBE Position',
                                name: 'Position',
                                type: AEX_THREED_PROPERTY,
                                value: [640, 360, -1777.7778],
                            },
                        },
                        type: AEX_CAMERA_LAYER,
                    },
                    {
                        label: 6,
                        lightType: 4414,
                        markers: [],
                        name: 'Light',
                        transform: {
                            position: {
                                keys: [],
                                matchName: 'ADBE Position',
                                name: 'Position',
                                type: AEX_THREED_PROPERTY,
                                value: [693.3333, 306.6667, -444.4444],
                            },
                        },
                        type: AEX_LIGHT_LAYER,
                    },
                    {
                        effects: [],
                        label: 1,
                        markers: [],
                        masks: [],
                        name: '3d AV Layer',
                        source: {
                            type: AEX_SOLID_ITEM,
                            id: 'null 2:16',
                        },
                        threeDLayer: true,
                        trackers: [],
                        transform: {},
                        type: AEX_NULL_LAYER,
                    },
                    {
                        effects: [],
                        label: 1,
                        markers: [],
                        masks: [],
                        name: '2d AV Layer',
                        source: {
                            type: AEX_SOLID_ITEM,
                            id: 'null 1:14',
                        },
                        trackers: [],
                        transform: {},
                        type: AEX_NULL_LAYER,
                    },
                ],
                markers: [],
                name: 'Defaults',
                type: AEX_COMP_ITEM,
            };

            await aex().fromAexObject(compData);

            const result = await aex().fromAeObject(AeObject.ActiveComp);
            const comp = result.object;

            assertAreEqual(comp.layers, compData.layers);
        });

        it(`Can set modified 3d Camera data`, async () => {
            const layerData = {
                label: 4,
                markers: [],
                name: 'Camera',
                transform: {
                    orientation: {
                        type: AEX_THREED_PROPERTY,
                        keys: [],
                        matchName: 'ADBE Orientation',
                        name: 'Orientation',
                        value: [100, 200, 300],
                    },
                    pointOfInterest: {
                        type: AEX_THREED_PROPERTY,
                        keys: [],
                        matchName: 'ADBE Anchor Point',
                        name: 'Point of Interest',
                        value: [11, 22, 33],
                    },
                    position: {
                        type: AEX_THREED_PROPERTY,
                        keys: [],
                        matchName: 'ADBE Position',
                        name: 'Position',
                        value: [1, 2, -3],
                    },
                    rotation: {
                        type: AEX_ONED_PROPERTY,
                        keys: [],
                        matchName: 'ADBE Rotate Z',
                        name: 'Z Rotation',
                        value: 90,
                    },
                    xRotation: {
                        type: AEX_ONED_PROPERTY,
                        keys: [],
                        matchName: 'ADBE Rotate X',
                        name: 'X Rotation',
                        value: -90,
                    },
                    yRotation: {
                        type: AEX_ONED_PROPERTY,
                        keys: [],
                        matchName: 'ADBE Rotate Y',
                        name: 'Y Rotation',
                        value: -3600,
                    },
                },
                type: AEX_CAMERA_LAYER,
            };

            await aex().fromAexObject(layerData);

            const result = await aex().fromAeObject(AeObject.ActiveComp);
            const comp = result.object;

            assertAreEqual(comp.layers[0], layerData);
        });

        it(`Can set modified 3d LightLayer data`, async () => {
            const layerData = {
                label: 6,
                lightType: 4414,
                markers: [],
                name: 'Light',
                transform: {
                    position: {
                        type: AEX_THREED_PROPERTY,
                        keys: [],
                        matchName: 'ADBE Position',
                        name: 'Position',
                        value: [100, 200, 300],
                    },
                },
                type: AEX_LIGHT_LAYER,
            };

            await aex().fromAexObject(layerData);

            const result = await aex().fromAeObject(AeObject.ActiveComp);
            const comp = result.object;

            assertAreEqual(comp.layers[0], layerData);
        });

        it(`Can set modified 3d AVLayer Null data`, async () => {
            const layerData = {
                effects: [],
                label: 1,
                markers: [],
                masks: [],
                name: '3d AV Layer',
                threeDLayer: true,
                source: {
                    type: AEX_SOLID_ITEM,
                    id: 'null 3:58',
                },
                trackers: [],
                transform: {
                    anchorPoint: {
                        type: AEX_THREED_PROPERTY,
                        keys: [],
                        matchName: 'ADBE Anchor Point',
                        name: 'Anchor Point',
                        value: [11, 22, 33],
                    },
                    opacity: {
                        type: AEX_ONED_PROPERTY,
                        keys: [],
                        matchName: 'ADBE Opacity',
                        name: 'Opacity',
                        value: 50,
                    },
                    orientation: {
                        type: AEX_THREED_PROPERTY,
                        keys: [],
                        matchName: 'ADBE Orientation',
                        name: 'Orientation',
                        value: [100, 200, 300],
                    },
                    position: {
                        type: AEX_THREED_PROPERTY,
                        keys: [],
                        matchName: 'ADBE Position',
                        name: 'Position',
                        value: [1, 2, -3],
                    },
                    rotation: {
                        type: AEX_ONED_PROPERTY,
                        keys: [],
                        matchName: 'ADBE Rotate Z',
                        name: 'Z Rotation',
                        value: 90,
                    },
                    scale: {
                        type: AEX_THREED_PROPERTY,
                        keys: [],
                        matchName: 'ADBE Scale',
                        name: 'Scale',
                        value: [10, 20, 30],
                    },
                    xRotation: {
                        type: AEX_ONED_PROPERTY,
                        keys: [],
                        matchName: 'ADBE Rotate X',
                        name: 'X Rotation',
                        value: -90,
                    },
                    yRotation: {
                        type: AEX_ONED_PROPERTY,
                        keys: [],
                        matchName: 'ADBE Rotate Y',
                        name: 'Y Rotation',
                        value: -3600,
                    },
                },
                type: AEX_NULL_LAYER,
            };

            await aex().fromAexObject(layerData);

            const result = await aex().fromAeObject(AeObject.ActiveComp);
            const comp = result.object;

            assertAreEqual(comp.layers[0], layerData);
        });

        it(`Can set modified 2d AVLayer Null data`, async () => {
            const layerData = {
                effects: [],
                label: 1,
                markers: [],
                masks: [],
                name: '2d AV Layer',
                source: {
                    type: AEX_SOLID_ITEM,
                    id: 'null 4:72',
                },
                trackers: [],
                transform: {
                    anchorPoint: {
                        type: AEX_THREED_PROPERTY,
                        keys: [],
                        matchName: 'ADBE Anchor Point',
                        name: 'Anchor Point',
                        value: [11, 22, 0],
                    },
                    opacity: {
                        type: AEX_ONED_PROPERTY,
                        keys: [],
                        matchName: 'ADBE Opacity',
                        name: 'Opacity',
                        value: 50,
                    },
                    position: {
                        type: AEX_THREED_PROPERTY,
                        keys: [],
                        matchName: 'ADBE Position',
                        name: 'Position',
                        value: [1, 2, 0],
                    },
                    rotation: {
                        type: AEX_ONED_PROPERTY,
                        keys: [],
                        matchName: 'ADBE Rotate Z',
                        name: 'Rotation',
                        value: 90,
                    },
                    scale: {
                        type: AEX_THREED_PROPERTY,
                        keys: [],
                        matchName: 'ADBE Scale',
                        name: 'Scale',
                        value: [10, 20, 100],
                    },
                },
                type: AEX_NULL_LAYER,
            };

            await aex().fromAexObject(layerData);

            const result = await aex().fromAeObject(AeObject.ActiveComp);
            const comp = result.object;

            assertAreEqual(comp.layers[0], layerData);
        });
    });
});
