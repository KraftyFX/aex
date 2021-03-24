import { expect } from 'chai';
import { AeObject, aex } from './aex';
import { cleanupAeqIpc, cleanupAex, evalAexIntoESTK, openProject } from './csinterface';

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
        await cleanupAeqIpc();
    });

    it(`Can parse layer audio`, async () => {
        expect(result.comps[0].layers[0].audio).to.be.undefined;
        expect(result.comps[0].layers[1].audio).to.eql({
            matchName: 'ADBE Audio Group',
            properties: [
                {
                    keys: [],
                    matchName: 'ADBE Audio Levels',
                    name: 'Audio Levels',
                    value: [12, 12],
                },
            ],
        });
    });
});
