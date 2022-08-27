import { expect } from 'chai';
import { AeObject, aex, getProject } from '../aex';
import { AEX_NULL_LAYER, AEX_TWOD_PROPERTY } from '../constants';
import { cleanupAex, evalAexIntoEstk, openCleanProject } from '../csinterface';
import { assertAreEqual } from '../utils';

describe('Layer Audio', function () {
    this.slow(500);
    this.timeout(5000);

    before(async () => {
        await evalAexIntoEstk();
    });

    after(async () => {
        await cleanupAex();
    });

    describe('Get', async () => {
        let comp: any;

        before(async () => {
            const result = await getProject('assets/layer_audio.aep', AeObject.ActiveComp);
            comp = result.object;
            console.log('layer_audio', comp);
        });

        it(`Can parse layer audio`, async () => {
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
    });

    describe('Create', async () => {
        before(async () => {
            await openCleanProject();
        });

        it(`Can create layer audio`, async () => {
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

            await aex().createTestComp();
            await aex().create(AeObject.ActiveComp, layerData);

            const result = await aex().get(AeObject.Layer(1));
            const layer = result.object;

            assertAreEqual(layer.audio, layerData.audio);
        });
    });
});
