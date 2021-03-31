import { expect } from 'chai';
import { AeObject, aex } from '../aex';
import { AEX_TWOD_PROPERTY } from '../constants';
import { cleanupAex, evalAexIntoESTK, openProject } from '../csinterface';
import { assertAreEqual } from '../utils';

describe('Layer Audio', function () {
    this.slow(500);
    this.timeout(2000);

    let comp: any;

    before(async () => {
        await evalAexIntoESTK();
        await openProject('testAssets/layer_audio.aep');
        const result = await aex().fromAeObject(AeObject.ActiveComp);
        comp = result.object;
        console.log('layer_audio', comp);
    });

    after(async () => {
        await cleanupAex();
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
