import { expect } from 'chai';
import { AeObject, aex, getProject } from '../aex';
import { AEX_NULL_LAYER, AEX_TWOD_PROPERTY, TEST_TIMEOUT_TIME } from '../constants';
import { cleanupAex, evalAexIntoEstk, openCleanProject } from '../csinterface';
import { assertAreEqual } from '../utils';

describe('Layer Audio', function () {
    this.slow(1000);
    this.timeout(TEST_TIMEOUT_TIME);

    before(async () => {
        await evalAexIntoEstk();
    });

    after(async () => {
        await cleanupAex();
    });

    it(`Get`, async () => {
        const { object: comp } = await getProject('assets/layer_audio.aep', AeObject.ActiveComp);

        console.log('layer_audio', comp);

        expect(comp.layers[0].audio).to.eql(undefined);

        assertAreEqual(comp.layers[1].audio, {
            matchName: 'ADBE Audio Group',
            properties: [
                {
                    type: AEX_TWOD_PROPERTY,
                    keys: [],
                    matchName: 'ADBE Audio Levels',
                    name: 'Audio Levels',
                    value: [12, 12],
                },
            ],
        });
    });

    it(`Create`, async () => {
        const layerData = {
            effects: [
                {
                    matchName: 'ADBE Aud Tone',
                    name: 'Tone',
                    enabled: true,
                },
            ],
            audio: {
                matchName: 'ADBE Audio Group',
                properties: [
                    {
                        type: AEX_TWOD_PROPERTY,
                        keys: [],
                        matchName: 'ADBE Audio Levels',
                        name: 'Audio Levels',
                        value: [12, 12],
                    },
                ],
            },
            type: AEX_NULL_LAYER,
        };

        await openCleanProject();

        await aex.createTestComp();
        await aex.create(AeObject.ActiveComp, layerData);

        const { object: layer } = await aex.get(AeObject.Layer(1));

        assertAreEqual(layer.audio, layerData.audio);
    });
});
