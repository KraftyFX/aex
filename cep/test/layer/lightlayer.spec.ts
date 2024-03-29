import { expect } from 'chai';
import { AeObject, aex, getProject } from '../aex';
import { AEX_COLOR_PROPERTY, AEX_COMP_ITEM, AEX_LIGHT_LAYER, AEX_ONED_PROPERTY, AEX_THREED_PROPERTY, TEST_TIMEOUT_TIME } from '../constants';
import { cleanupAex, evalAexIntoEstk, openCleanProject, openProject } from '../csinterface';
import { assertAreEqual } from '../utils';

describe('Light Layer Attributes', function () {
    this.slow(1000);
    this.timeout(TEST_TIMEOUT_TIME);

    before(async () => {
        await evalAexIntoEstk();
    });

    after(async () => {
        await cleanupAex();
    });

    describe('Light Layer Attributes', async () => {
        it(`Get`, async () => {
            const { object: comp } = await getProject('assets/layer_light.aep', AeObject.ActiveComp);
            assertAreEqual(comp.layers[0], {
                label: 6,
                lightType: 4412,
                name: 'Parallel Light',
                lightOption: {
                    matchName: 'ADBE Light Options Group',
                    properties: [
                        {
                            type: AEX_ONED_PROPERTY,
                            matchName: 'ADBE Light Intensity',
                            value: 76,
                        },
                        {
                            type: AEX_COLOR_PROPERTY,
                            matchName: 'ADBE Light Color',
                            value: [1, 0, 0, 1],
                        },
                        {
                            type: AEX_ONED_PROPERTY,
                            matchName: 'ADBE Light Falloff Type',
                            value: 2,
                        },
                        {
                            type: AEX_ONED_PROPERTY,
                            matchName: 'ADBE Light Falloff Start',
                            value: 453,
                        },
                        {
                            type: AEX_ONED_PROPERTY,
                            matchName: 'ADBE Light Falloff Distance',
                            value: 394,
                        },
                        {
                            type: AEX_ONED_PROPERTY,
                            matchName: 'ADBE Casts Shadows',
                            value: 1,
                        },
                        {
                            type: AEX_ONED_PROPERTY,
                            matchName: 'ADBE Light Shadow Darkness',
                            value: 42,
                        },
                    ],
                },
                transform: {
                    position: {
                        matchName: 'ADBE Position',
                        type: AEX_THREED_PROPERTY,
                        value: [600, 500, 400],
                    },
                },
                type: AEX_LIGHT_LAYER,
            });
        });

        it(`Create`, async () => {
            const layerData = {
                label: 6,
                lightOption: {
                    matchName: 'ADBE Light Options Group',
                    properties: [
                        {
                            type: AEX_ONED_PROPERTY,
                            matchName: 'ADBE Light Intensity',
                            value: 76,
                        },
                        {
                            type: AEX_COLOR_PROPERTY,
                            matchName: 'ADBE Light Color',
                            value: [1, 0, 0, 1],
                        },
                        {
                            type: AEX_ONED_PROPERTY,
                            matchName: 'ADBE Light Falloff Type',
                            value: 2,
                        },
                        {
                            type: AEX_ONED_PROPERTY,
                            matchName: 'ADBE Light Falloff Start',
                            value: 453,
                        },
                        {
                            type: AEX_ONED_PROPERTY,
                            matchName: 'ADBE Light Falloff Distance',
                            value: 394,
                        },
                        {
                            type: AEX_ONED_PROPERTY,
                            matchName: 'ADBE Casts Shadows',
                            value: 1,
                        },
                        {
                            type: AEX_ONED_PROPERTY,
                            matchName: 'ADBE Light Shadow Darkness',
                            value: 42,
                        },
                    ],
                },
                lightType: 4412,
                name: 'Parallel Light',
                type: AEX_LIGHT_LAYER,
            };

            await openCleanProject();
            await aex.createTestComp();
            await aex.create(AeObject.ActiveComp, layerData);

            const result = await aex.get(AeObject.Layer(1));
            const layer = result.object;

            assertAreEqual(layer.lightOption, layerData.lightOption);
        });

        it(`Update`, async () => {
            const layerData = {
                label: 9,
                lightType: 4414,
                name: 'Updated Parallel Light',
                lightOption: {
                    matchName: 'ADBE Light Options Group',
                    properties: [
                        {
                            type: AEX_ONED_PROPERTY,
                            matchName: 'ADBE Light Intensity',
                            value: 12,
                        },
                        {
                            type: AEX_COLOR_PROPERTY,
                            matchName: 'ADBE Light Color',
                            value: [1, 1, 0, 1],
                        },
                        {
                            type: AEX_ONED_PROPERTY,
                            matchName: 'ADBE Light Falloff Type',
                            value: 2,
                        },
                        {
                            type: AEX_ONED_PROPERTY,
                            matchName: 'ADBE Light Falloff Start',
                            value: 100,
                        },
                        {
                            type: AEX_ONED_PROPERTY,
                            matchName: 'ADBE Light Falloff Distance',
                            value: 400,
                        },
                        {
                            type: AEX_ONED_PROPERTY,
                            matchName: 'ADBE Casts Shadows',
                            value: 1,
                        },
                        {
                            type: AEX_ONED_PROPERTY,
                            matchName: 'ADBE Light Shadow Darkness',
                            value: 60,
                        },
                    ],
                },
                transform: {
                    position: {
                        matchName: 'ADBE Position',
                        type: AEX_THREED_PROPERTY,
                        value: [500, 400, 600],
                    },
                },
                type: AEX_LIGHT_LAYER,
            };

            await openProject('assets/layer_light.aep');
            await aex.update(AeObject.Layer(1), layerData);

            const result = await aex.get(AeObject.Layer(1));
            const layer = result.object;

            assertAreEqual(layer, layerData);
        });
    });

    describe('Light Layer Types', async () => {
        it(`Get`, async () => {
            const { object: comp } = await getProject('assets/layer_light.aep', AeObject.ActiveComp);
            expect(comp.layers[1].lightType).to.eql(4413);
            expect(comp.layers[2].lightType).to.eql(4414);
            expect(comp.layers[3].lightType).to.eql(4415);
        });

        it(`Create`, async () => {
            const compData = {
                layers: [
                    {
                        lightType: 4413,
                        name: 'Spot Light',
                        type: AEX_LIGHT_LAYER,
                    },
                    {
                        lightType: 4414,
                        name: 'Point Light',
                        type: AEX_LIGHT_LAYER,
                    },
                    {
                        lightType: 4415,
                        name: 'Ambient Light',
                        type: AEX_LIGHT_LAYER,
                    },
                ],
                type: AEX_COMP_ITEM,
            };

            await openCleanProject();
            await aex.create(AeObject.Project, compData);

            const result = await aex.get(AeObject.ActiveComp);
            const comp = result.object;

            expect(comp.layers[0].lightType).to.eql(compData.layers[0].lightType);
            expect(comp.layers[1].lightType).to.eql(compData.layers[1].lightType);
            expect(comp.layers[2].lightType).to.eql(compData.layers[2].lightType);
        });

        it(`Update`, async () => {
            const layerData = {
                lightType: 4414,
                type: AEX_LIGHT_LAYER,
            };

            await openProject('assets/layer_light.aep');
            await aex.update(AeObject.Layer(1), layerData);

            const result = await aex.get(AeObject.Layer(1));
            const layer = result.object;

            assertAreEqual(layer.lightType, layerData.lightType);
        });
    });
});
