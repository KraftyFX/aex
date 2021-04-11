import { AeObject, aex } from '../aex';
import { AEX_AV_LAYER, AEX_CAMERA_LAYER, AEX_LIGHT_LAYER, AEX_ONED_PROPERTY, AEX_THREED_PROPERTY } from '../constants';
import { cleanupAex, evalAexIntoEstk, openProject } from '../csinterface';
import { assertAreEqual } from '../utils';

describe('Layer Transform', function () {
    this.slow(500);
    this.timeout(2000);

    let project: any;

    before(async () => {
        await evalAexIntoEstk();
        await openProject('testAssets/layer_transform.aep');
        const result = await aex().fromAeObject(AeObject.Project);
        project = result.object;
        console.log('layer_transform', project);
    });

    after(async () => {
        await cleanupAex();
    });

    it('Can parse default transform data', async () => {
        assertAreEqual(project.comps[0].layers, [
            {
                label: 4,
                markers: [],
                name: 'Camera',
                transform: {},
                type: AEX_CAMERA_LAYER,
            },
            {
                label: 6,
                lightType: 4414,
                markers: [],
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

    it('Can parse modified 3d AVLayer data', async () => {
        assertAreEqual(project.comps[1].layers[2], {
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
            type: AEX_AV_LAYER,
        });
    });

    it('Can parse modified 2d AVLayer data', async () => {
        assertAreEqual(project.comps[1].layers[3], {
            effects: [],
            label: 1,
            markers: [],
            masks: [],
            name: '2d AV Layer',
            nullLayer: true,
            source: 'null 1:50',
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
            type: AEX_AV_LAYER,
        });
    });
});
