import { expect } from 'chai';
import { AeObject, aex } from './aex';
import { AEX_CAMERA_LAYER } from './constants';
import { cleanupAeqIpc, cleanupAex, evalAexIntoESTK, openProject } from './csinterface';

describe('Camera Layer Attributes', function () {
    this.slow(500);
    this.timeout(2000);

    let result: any;

    before(async () => {
        await evalAexIntoESTK();
        await openProject('testAssets/layer_camera.aep');
        result = await aex().toObjectWithAeObject(AeObject.ActiveComp);
        console.log('layer_camera', result);
    });

    after(async () => {
        await cleanupAex();
        await cleanupAeqIpc();
    });

    it(`Can parse camera options`, async () => {
        expect(result.comps[0].layers[0].cameraOption).to.eql({
            matchName: 'ADBE Camera Options Group',
            properties: [
                {
                    keys: [],
                    matchName: 'ADBE Camera Zoom',
                    name: 'Zoom',
                    value: 1,
                },
                {
                    keys: [],
                    matchName: 'ADBE Camera Focus Distance',
                    name: 'Focus Distance',
                    value: 2,
                },
                {
                    keys: [],
                    matchName: 'ADBE Camera Aperture',
                    name: 'Aperture',
                    value: 3,
                },
                {
                    keys: [],
                    matchName: 'ADBE Camera Blur Level',
                    name: 'Blur Level',
                    value: 4,
                },
                {
                    keys: [],
                    matchName: 'ADBE Iris Shape',
                    name: 'Iris Shape',
                    value: 4,
                },
                {
                    keys: [],
                    matchName: 'ADBE Iris Rotation',
                    name: 'Iris Rotation',
                    value: 5,
                },
                {
                    keys: [],
                    matchName: 'ADBE Iris Roundness',
                    name: 'Iris Roundness',
                    value: 6,
                },
                {
                    keys: [],
                    matchName: 'ADBE Iris Aspect Ratio',
                    name: 'Iris Aspect Ratio',
                    value: 7,
                },
                {
                    keys: [],
                    matchName: 'ADBE Iris Diffraction Fringe',
                    name: 'Iris Diffraction Fringe',
                    value: 8,
                },
                {
                    keys: [],
                    matchName: 'ADBE Iris Highlight Gain',
                    name: 'Highlight Gain',
                    value: 9,
                },
                {
                    keys: [],
                    matchName: 'ADBE Iris Highlight Threshold',
                    name: 'Highlight Threshold',
                    value: 0.03921568627451,
                },
                {
                    keys: [],
                    matchName: 'ADBE Iris Hightlight Saturation',
                    name: 'Highlight Saturation',
                    value: 11,
                },
            ],
        });
    });

    it(`Can parse 2-point cameras`, async () => {
        expect(result.comps[0].layers[1]).to.eql({
            label: 4,
            markers: [],
            masks: [],
            name: 'Two-Node',
            transform: {
                pointOfInterest: {
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
