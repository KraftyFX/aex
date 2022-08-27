import { expect } from 'chai';
import { AeObject, aex, getProject } from '../aex';
import { AEX_COLOR_PROPERTY, AEX_COMP_ITEM, AEX_LIGHT_LAYER, AEX_ONED_PROPERTY, AEX_THREED_PROPERTY } from '../constants';
import { cleanupAex, evalAexIntoEstk, openCleanProject } from '../csinterface';
import { assertAreEqual } from '../utils';

describe('Light Layer Attributes', function () {
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
            const result = await getProject('assets/layer_light.aep', AeObject.ActiveComp);
            comp = result.object;
            console.log('layer_light', comp);
        });

        it(`Can parse light layer attributes`, async () => {
            assertAreEqual(comp.layers[0], {
                label: 6,
                lightType: 4412,
                markers: [],
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
                transform: {
                    position: {
                        keys: [],
                        matchName: 'ADBE Position',
                        name: 'Position',
                        type: AEX_THREED_PROPERTY,
                        value: [600, 500, 400],
                    },
                },
                type: AEX_LIGHT_LAYER,
            });
        });

        it(`Can parse light layer types`, async () => {
            expect(comp.layers[1].lightType).to.eql(4413);
            expect(comp.layers[2].lightType).to.eql(4414);
            expect(comp.layers[3].lightType).to.eql(4415);
        });
    });

    describe('Create', async () => {
        before(async () => {
            await openCleanProject();
        });

        it(`Can create light layer attributes`, async () => {
            const layerData = {
                label: 6,
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
                lightType: 4412,
                markers: [],
                name: 'Parallel Light',
                transform: {},
                type: AEX_LIGHT_LAYER,
            };

            await aex().createTestComp();
            await aex().create(AeObject.ActiveComp, layerData);

            const result = await aex().get(AeObject.Layer(1));
            const layer = result.object;

            assertAreEqual(layer.lightOption, layerData.lightOption);
        });

        it(`Can create light layer types`, async () => {
            const compData = {
                layers: [
                    {
                        lightType: 4413,
                        markers: [],
                        name: 'Spot Light',
                        transform: {},
                        type: AEX_LIGHT_LAYER,
                    },
                    {
                        lightType: 4414,
                        markers: [],
                        name: 'Point Light',
                        transform: {},
                        type: AEX_LIGHT_LAYER,
                    },
                    {
                        lightType: 4415,
                        markers: [],
                        name: 'Ambient Light',
                        transform: {},
                        type: AEX_LIGHT_LAYER,
                    },
                ],
                markers: [],
                type: AEX_COMP_ITEM,
            };

            await aex().create(AeObject.Project, compData);

            const result = await aex().get(AeObject.ActiveComp);
            const comp = result.object;

            expect(comp.layers[0].lightType).to.eql(compData.layers[0].lightType);
            expect(comp.layers[1].lightType).to.eql(compData.layers[1].lightType);
            expect(comp.layers[2].lightType).to.eql(compData.layers[2].lightType);
        });
    });
});
