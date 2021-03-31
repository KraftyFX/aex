import { expect } from 'chai';
import { AeObject, aex } from '../aex';
import { AEX_TWOD_PROPERTY } from '../constants';
import { cleanupAex, evalAexIntoESTK, openProject } from '../csinterface';
import { assertAreEqual } from '../utils';

describe('Layer Audio', function () {
    this.slow(500);
    this.timeout(2000);

    let result: any;

    before(async () => {
        await evalAexIntoESTK();
        await openProject('testAssets/layer_audio.aep');
        result = await aex().toObjectWithAeObject(AeObject.ActiveComp);
        console.log('layer_audio', result);
    });

    after(async () => {
        await cleanupAex();
    });

    it(`Can parse layer audio`, async () => {
        expect(result.comps[0].layers[0].audio).to.eql(undefined);
        assertAreEqual(result.comps[0].layers[1].audio, {
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
