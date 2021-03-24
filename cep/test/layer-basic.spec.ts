import { AeObject, aex } from './aex';
import { AEX_AV_LAYER, AEX_CAMERA_LAYER, AEX_LIGHT_LAYER, AEX_TEXT_LAYER } from './constants';
import { cleanupAeqIpc, cleanupAex, evalAexIntoESTK, openProject } from './csinterface';
import { assertAreEqual } from './utils';

describe('Basic Layer Attributes', function () {
    this.slow(500);
    this.timeout(2000);

    let result: any;

    before(async () => {
        await evalAexIntoESTK();
        await openProject('testAssets/layer_basic.aep');
        result = await aex().toObjectWithAeObject(AeObject.ActiveComp);
        console.log('layer_basic', result);
    });

    after(async () => {
        await cleanupAex();
        await cleanupAeqIpc();
    });

    /** Layer tests */
    it(`Can parse basic CameraLayer properties`, async () => {
        assertAreEqual(result.comps[0].layers[0], {
            label: 4,
            markers: [],
            masks: [],
            name: 'Camera',
            transform: {},
            type: AEX_CAMERA_LAYER,
        });
    });

    it(`Can parse basic TextLayer properties`, async () => {
        assertAreEqual(result.comps[0].layers[1], {
            label: 1,
            markers: [],
            masks: [],
            name: 'Solo Text Layer',
            source: '',
            collapseTransformation: true,
            sourceText: {
                keys: [],
                matchName: 'ADBE Text Document',
                name: 'Source Text',
                value: {
                    applyFill: true,
                    baselineLocs: [-115.33203125, 0, 115.33203125, 0],
                    baselineShift: 0,
                    fillColor: [1, 1, 1],
                    font: 'ArialMT',
                    fontFamily: 'Arial',
                    fontSize: 50,
                    fontStyle: 'Regular',
                    horizontalScale: 1,
                    justification: 7415,
                    leading: 60.0000038146973,
                    text: 'Text Layer',
                    tracking: 0,
                    tsume: 0,
                    verticalScale: 1,
                },
            },
            solo: true,
            transform: {},
            type: AEX_TEXT_LAYER,
        });
    });

    it(`Can parse basic AVLayer properties`, async () => {
        assertAreEqual(result.comps[0].layers[2], {
            label: 1,
            markers: [],
            masks: [],
            name: 'Empty',
            nullLayer: true,
            transform: {},
            source: 'null 1:50',
            type: AEX_AV_LAYER,
        });
    });

    it(`Can parse basic LightLayer properties`, async () => {
        assertAreEqual(result.comps[0].layers[3], {
            inPoint: 0.5,
            label: 1,
            lightType: 4414,
            markers: [],
            masks: [],
            name: 'Timing Light',
            outPoint: 3.06666666666667,
            transform: {},
            type: AEX_LIGHT_LAYER,
        });
    });

    it(`Can parse various Layer flags`, async () => {
        assertAreEqual(result.comps[0].layers[4], {
            adjustmentLayer: true,
            autoOrient: 4213,
            collapseTransformation: true,
            label: 2,
            markers: [],
            masks: [],
            motionBlur: true,
            name: 'Flags',
            nullLayer: true,
            samplingQuality: 4813,
            shy: true,
            source: 'null 1:50',
            threeDLayer: true,
            transform: {},
            type: AEX_AV_LAYER,
        });
    });

    it(`Can parse Layer blend mode & time stretch`, async () => {
        assertAreEqual(result.comps[0].layers[5], {
            blendingMode: 5216,
            label: 1,
            markers: [],
            masks: [],
            name: 'Blend Stretch',
            nullLayer: true,
            outPoint: 1,
            source: 'null 1:50',
            stretch: 25,
            transform: {},
            type: AEX_AV_LAYER,
        });
    });

    it(`Can parse parented layers`, async () => {
        assertAreEqual(result.comps[0].layers[6], {
            label: 1,
            markers: [],
            masks: [],
            name: 'Parented Solid',
            parentLayerIndex: 5,
            source: 'parented solid:61',
            transform: {
                position: {
                    keys: [],
                    matchName: 'ADBE Position',
                    name: 'Position',
                    value: [0, 0, 0],
                },
            },
            type: AEX_AV_LAYER,
        });
    });
});
