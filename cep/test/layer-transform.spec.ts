import { AeObject, aex } from './aex';
import { AEX_AV_LAYER, AEX_CAMERA_LAYER, AEX_LIGHT_LAYER } from './constants';
import { cleanupAeqIpc, cleanupAex, evalAexIntoESTK, openProject } from './csinterface';
import { assertAreEqual } from './utils';

describe('Layer Transform', function () {
    this.slow(500);
    this.timeout(2000);

    let result: any;

    before(async () => {
        await evalAexIntoESTK();
        await openProject('testAssets/layer_transform.aep');
        result = await aex().toObjectWithAeObject(AeObject.Project);
        console.log('layer_transform', result);
    });

    after(async () => {
        await cleanupAex();
        await cleanupAeqIpc();
    });

    it('Can parse default transform data', async () => {
        assertAreEqual(result.comps[0].layers, [
            {
                label: 4,
                markers: [],
                masks: [],
                name: 'Camera',
                transform: {},
                type: AEX_CAMERA_LAYER,
            },
            {
                label: 6,
                lightType: 4414,
                markers: [],
                masks: [],
                name: 'Light',
                transform: {},
                type: AEX_LIGHT_LAYER,
            },
            {
                effects: [],
                label: 1,
                markers: [],
                masks: [],
                name: '3d AV Layer',
                nullLayer: true,
                source: 'null 1:50',
                threeDLayer: true,
                transform: {},
                type: AEX_AV_LAYER,
            },
            {
                effects: [],
                label: 1,
                markers: [],
                masks: [],
                name: '2d AV Layer',
                nullLayer: true,
                source: 'null 1:50',
                transform: {},
                type: AEX_AV_LAYER,
            },
        ]);
    });

    it('Can parse modified 3d Camera data', async () => {
        assertAreEqual(result.comps[1].layers[0], {
            label: 4,
            markers: [],
            masks: [],
            name: 'Camera',
            transform: {
                orientation: {
                    keys: [],
                    matchName: 'ADBE Orientation',
                    name: 'Orientation',
                    value: [100, 200, 300],
                },
                pointOfInterest: {
                    keys: [],
                    matchName: 'ADBE Anchor Point',
                    name: 'Point of Interest',
                    value: [11, 22, 33],
                },
                position: {
                    keys: [],
                    matchName: 'ADBE Position',
                    name: 'Position',
                    value: [1, 2, -3],
                },
                rotation: {
                    keys: [],
                    matchName: 'ADBE Rotate Z',
                    name: 'Z Rotation',
                    value: 90,
                },
                xRotation: {
                    keys: [],
                    matchName: 'ADBE Rotate X',
                    name: 'X Rotation',
                    value: -90,
                },
                yRotation: {
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
        assertAreEqual(result.comps[1].layers[1], {
            label: 6,
            lightType: 4414,
            markers: [],
            masks: [],
            name: 'Light',
            transform: {
                position: {
                    keys: [],
                    matchName: 'ADBE Position',
                    name: 'Position',
                    value: [100, 200, 300],
                },
            },
            type: AEX_LIGHT_LAYER,
        });
    });

    it('Can parse modified 3d AVLayer data', async () => {
        assertAreEqual(result.comps[1].layers[2], {
            effects: [],
            label: 1,
            markers: [],
            masks: [],
            name: '3d AV Layer',
            nullLayer: true,
            threeDLayer: true,
            source: 'null 1:50',
            transform: {
                anchorPoint: {
                    keys: [],
                    matchName: 'ADBE Anchor Point',
                    name: 'Anchor Point',
                    value: [11, 22, 33],
                },
                opacity: {
                    keys: [],
                    matchName: 'ADBE Opacity',
                    name: 'Opacity',
                    value: 50,
                },
                orientation: {
                    keys: [],
                    matchName: 'ADBE Orientation',
                    name: 'Orientation',
                    value: [100, 200, 300],
                },

                position: {
                    keys: [],
                    matchName: 'ADBE Position',
                    name: 'Position',
                    value: [1, 2, -3],
                },
                rotation: {
                    keys: [],
                    matchName: 'ADBE Rotate Z',
                    name: 'Z Rotation',
                    value: 90,
                },
                scale: {
                    keys: [],
                    matchName: 'ADBE Scale',
                    name: 'Scale',
                    value: [10, 20, 30],
                },
                xRotation: {
                    keys: [],
                    matchName: 'ADBE Rotate X',
                    name: 'X Rotation',
                    value: -90,
                },
                yRotation: {
                    keys: [],
                    matchName: 'ADBE Rotate Y',
                    name: 'Y Rotation',
                    value: -3600,
                },
            },
            type: AEX_AV_LAYER,
        });
    });

    it('Can parse modified 2d AVLayer data', async () => {
        assertAreEqual(result.comps[1].layers[3], {
            effects: [],
            label: 1,
            markers: [],
            masks: [],
            name: '2d AV Layer',
            nullLayer: true,
            source: 'null 1:50',
            transform: {
                anchorPoint: {
                    keys: [],
                    matchName: 'ADBE Anchor Point',
                    name: 'Anchor Point',
                    value: [11, 22, 0],
                },
                opacity: {
                    keys: [],
                    matchName: 'ADBE Opacity',
                    name: 'Opacity',
                    value: 50,
                },
                position: {
                    keys: [],
                    matchName: 'ADBE Position',
                    name: 'Position',
                    value: [1, 2, 0],
                },
                rotation: {
                    keys: [],
                    matchName: 'ADBE Rotate Z',
                    name: 'Rotation',
                    value: 90,
                },
                scale: {
                    keys: [],
                    matchName: 'ADBE Scale',
                    name: 'Scale',
                    value: [10, 20, 100],
                },
            },
            type: AEX_AV_LAYER,
        });
    });
});
