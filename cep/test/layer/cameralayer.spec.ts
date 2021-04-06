import { AeObject, aex } from '../aex';
import { AEX_CAMERA_LAYER, AEX_ONED_PROPERTY, AEX_THREED_PROPERTY } from '../constants';
import { cleanupAex, evalAexIntoEstk, openProject } from '../csinterface';
import { assertAreEqual } from '../utils';

describe('Camera Layer Attributes', function () {
    this.slow(500);
    this.timeout(2000);

    let comp: any;

    before(async () => {
        await evalAexIntoEstk();
        await openProject('testAssets/layer_camera.aep');
        const result = await aex().fromAeObject(AeObject.ActiveComp);
        comp = result.object;
        console.log('layer_camera', comp);
    });

    after(async () => {
        await cleanupAex();
    });

    it(`Can parse camera options`, async () => {
        assertAreEqual(comp.layers[0].cameraOption, {
            matchName: 'ADBE Camera Options Group',
            properties: [
                {
                    type: AEX_ONED_PROPERTY,
                    keys: [],
                    matchName: 'ADBE Camera Zoom',
                    name: 'Zoom',
                    value: 1,
                },
                {
                    type: AEX_ONED_PROPERTY,
                    keys: [],
                    matchName: 'ADBE Camera Focus Distance',
                    name: 'Focus Distance',
                    value: 2,
                },
                {
                    type: AEX_ONED_PROPERTY,
                    keys: [],
                    matchName: 'ADBE Camera Aperture',
                    name: 'Aperture',
                    value: 3,
                },
                {
                    type: AEX_ONED_PROPERTY,
                    keys: [],
                    matchName: 'ADBE Camera Blur Level',
                    name: 'Blur Level',
                    value: 4,
                },
                {
                    type: AEX_ONED_PROPERTY,
                    keys: [],
                    matchName: 'ADBE Iris Shape',
                    name: 'Iris Shape',
                    value: 4,
                },
                {
                    type: AEX_ONED_PROPERTY,
                    keys: [],
                    matchName: 'ADBE Iris Rotation',
                    name: 'Iris Rotation',
                    value: 5,
                },
                {
                    type: AEX_ONED_PROPERTY,
                    keys: [],
                    matchName: 'ADBE Iris Roundness',
                    name: 'Iris Roundness',
                    value: 6,
                },
                {
                    type: AEX_ONED_PROPERTY,
                    keys: [],
                    matchName: 'ADBE Iris Aspect Ratio',
                    name: 'Iris Aspect Ratio',
                    value: 7,
                },
                {
                    type: AEX_ONED_PROPERTY,
                    keys: [],
                    matchName: 'ADBE Iris Diffraction Fringe',
                    name: 'Iris Diffraction Fringe',
                    value: 8,
                },
                {
                    type: AEX_ONED_PROPERTY,
                    keys: [],
                    matchName: 'ADBE Iris Highlight Gain',
                    name: 'Highlight Gain',
                    value: 9,
                },
                {
                    type: AEX_ONED_PROPERTY,
                    keys: [],
                    matchName: 'ADBE Iris Highlight Threshold',
                    name: 'Highlight Threshold',
                    value: 0.03921568627451,
                },
                {
                    type: AEX_ONED_PROPERTY,
                    keys: [],
                    matchName: 'ADBE Iris Hightlight Saturation',
                    name: 'Highlight Saturation',
                    value: 11,
                },
            ],
        });
    });

    it(`Can parse 2-point cameras`, async () => {
        assertAreEqual(comp.layers[1], {
            label: 4,
            markers: [],
            masks: [],
            name: 'Two-Node',
            transform: {
                pointOfInterest: {
                    type: AEX_THREED_PROPERTY,
                    keys: [],
                    matchName: 'ADBE Anchor Point',
                    name: 'Point of Interest',
                    value: [100, 200, 300],
                },
            },
            type: AEX_CAMERA_LAYER,
        });
    });
});