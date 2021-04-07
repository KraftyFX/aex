import { expect } from 'chai';
import { AeObject, aex } from '../aex';
import { AEX_COLOR_PROPERTY, AEX_LIGHT_LAYER, AEX_ONED_PROPERTY } from '../constants';
import { cleanupAex, evalAexIntoEstk, openProject } from '../csinterface';
import { assertAreEqual } from '../utils';

describe('Light Layer Attributes', function () {
    this.slow(500);
    this.timeout(2000);

    let comp: any;

    before(async () => {
        await evalAexIntoEstk();
        await openProject('testAssets/layer_light.aep');
        const result = await aex().fromAeObject(AeObject.ActiveComp);
        comp = result.object;
        console.log('layer_light', comp);
    });

    after(async () => {
        await cleanupAex();
    });

    it(`Can parse light layer attributes`, async () => {
        assertAreEqual(comp.layers[0], {
            label: 6,
            lightType: 4412,
            markers: [],
            masks: [],
            name: 'Parallel Light',
            lightOption: {
                matchName: 'ADBE Light Options Group',
                properties: [
                    {
                        type: AEX_ONED_PROPERTY,
                        keys: [],
                        matchName: 'ADBE Light Intensity',
                        name: 'Intensity',
                        value: 76,
                    },
                    {
                        type: AEX_COLOR_PROPERTY,
                        keys: [],
                        matchName: 'ADBE Light Color',
                        name: 'Color',
                        value: [1, 0, 0, 1],
                    },
                    {
                        type: AEX_ONED_PROPERTY,
                        keys: [],
                        matchName: 'ADBE Light Falloff Type',
                        name: 'Falloff',
                        value: 2,
                    },
                    {
                        type: AEX_ONED_PROPERTY,
                        keys: [],
                        matchName: 'ADBE Light Falloff Start',
                        name: 'Radius',
                        value: 453,
                    },
                    {
                        type: AEX_ONED_PROPERTY,
                        keys: [],
                        matchName: 'ADBE Light Falloff Distance',
                        name: 'Falloff Distance',
                        value: 394,
                    },
                    {
                        type: AEX_ONED_PROPERTY,
                        keys: [],
                        matchName: 'ADBE Casts Shadows',
                        name: 'Casts Shadows',
                        value: 1,
                    },
                    {
                        type: AEX_ONED_PROPERTY,
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
        expect(comp.layers[1].lightType).to.eql(4413);
        expect(comp.layers[2].lightType).to.eql(4414);
        expect(comp.layers[3].lightType).to.eql(4415);
    });
});
