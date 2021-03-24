import { expect } from 'chai';
import { AeObject, aex } from './aex';
import { AEX_LIGHT_LAYER } from './constants';
import { cleanupAeqIpc, cleanupAex, evalAexIntoESTK, openProject } from './csinterface';

describe('Light Layer Attributes', function () {
    this.slow(500);
    this.timeout(2000);

    let result: any;

    before(async () => {
        await evalAexIntoESTK();
        await openProject('testAssets/layer_light.aep');
        result = await aex().toObjectWithAeObject(AeObject.ActiveComp);
        console.log('layer_light', result);
    });

    after(async () => {
        await cleanupAex();
        await cleanupAeqIpc();
    });

    it(`Can parse light layer attributes`, async () => {
        expect(result.comps[0].layers[0]).to.eql({
            label: 6,
            lightType: 4412,
            markers: [],
            masks: [],
            name: 'Parallel Light',
            lightOption: {
                matchName: 'ADBE Light Options Group',
                properties: [
                    {
                        keys: [],
                        matchName: 'ADBE Light Intensity',
                        name: 'Intensity',
                        value: 76,
                    },
                    {
                        keys: [],
                        matchName: 'ADBE Light Color',
                        name: 'Color',
                        value: [1, 0, 0, 1],
                    },
                    {
                        keys: [],
                        matchName: 'ADBE Light Falloff Type',
                        name: 'Falloff',
                        value: 2,
                    },
                    {
                        keys: [],
                        matchName: 'ADBE Light Falloff Start',
                        name: 'Radius',
                        value: 453,
                    },
                    {
                        keys: [],
                        matchName: 'ADBE Light Falloff Distance',
                        name: 'Falloff Distance',
                        value: 394,
                    },
                    {
                        keys: [],
                        matchName: 'ADBE Casts Shadows',
                        name: 'Casts Shadows',
                        value: 1,
                    },
                    {
                        keys: [],
                        matchName: 'ADBE Light Shadow Darkness',
                        name: 'Shadow Darkness',
                        value: 42,
                    },
                ],
            },
            transform: {},
            type: AEX_LIGHT_LAYER,
        });
    });

    it(`Can parse light layer types`, async () => {
        expect(result.comps[0].layers[1]).property('lightType').to.eql(4413);
        expect(result.comps[0].layers[2]).property('lightType').to.eql(4414);
        expect(result.comps[0].layers[3]).property('lightType').to.eql(4415);
    });
});
