import { expect } from 'chai';
import { AeObject, aex } from './aex';
import { AEX_COLOR_PROPERTY, AEX_EFFECT_PROPERTYGROUP, AEX_NULL_LAYER, AEX_ONED_PROPERTY, TEST_TIMEOUT_TIME } from './constants';
import { cleanupAex, evalAexIntoEstk, openCleanProject, openProject } from './csinterface';
import { assertAreEqual } from './utils';

describe('Zack Test Stuff', function () {
    this.slow(500);
    this.timeout(TEST_TIMEOUT_TIME);

    before(async () => {
        await evalAexIntoEstk();
    });

    after(async () => {
        await cleanupAex();
    });

    /** Get dup */
    describe.skip('Data Dumps', function () {
        it(`Unsophisticated test to check first layer`, async () => {
            const result = await aex.get(AeObject.Layer(1));
            const layer = result.object;

            console.log('layer', layer);
            expect(layer);
        });

        it(`Unsophisticated test to check comp data parsing`, async () => {
            const result = await aex.get(AeObject.ActiveComp);
            const comp = result.object;

            console.log('comp', comp);
            expect(comp);
        });

        it(`Unsophisticated test to check project data parsing`, async () => {
            const result = await aex.get(AeObject.Project);
            const project = result.object;

            console.log('project', project);
            expect(project);
        });
    });

    describe('Creation', function () {
        it('Can create simple modified effect (add layer to comp)', async () => {
            const layerData = {
                effects: [
                    {
                        matchName: 'ADBE Fill',
                        name: 'Fill - Modified',
                        properties: [
                            {
                                keys: [],
                                matchName: 'ADBE Fill-0007',
                                name: 'All Masks',
                                type: AEX_ONED_PROPERTY,
                                value: 1,
                            },
                            {
                                keys: [],
                                matchName: 'ADBE Fill-0002',
                                name: 'Color',
                                type: AEX_COLOR_PROPERTY,
                                value: [1, 0.5, 0, 1],
                            },
                            {
                                keys: [],
                                matchName: 'ADBE Fill-0006',
                                name: 'Invert',
                                type: AEX_ONED_PROPERTY,
                                value: 1,
                            },
                            {
                                keys: [],
                                matchName: 'ADBE Fill-0003',
                                name: 'Horizontal Feather',
                                type: AEX_ONED_PROPERTY,
                                value: 2.2,
                            },
                            {
                                keys: [],
                                matchName: 'ADBE Fill-0004',
                                name: 'Vertical Feather',
                                type: AEX_ONED_PROPERTY,
                                value: 2.8,
                            },
                            {
                                keys: [],
                                matchName: 'ADBE Fill-0005',
                                name: 'Opacity',
                                type: AEX_ONED_PROPERTY,
                                value: 0.79,
                            },
                        ],
                        type: AEX_EFFECT_PROPERTYGROUP,
                    },
                ],
                type: AEX_NULL_LAYER,
            };

            await aex.createTestComp();
            await aex.create(AeObject.ActiveComp, layerData);

            const result = await aex.get(AeObject.Layer(1));
            const layer = result.object;

            assertAreEqual(layer.effects, layerData.effects);
        });

        it('Can create simple modified effect (add effect to layer)', async () => {
            const effectData = {
                matchName: 'ADBE Fill',
                name: 'Fill - Modified',
                properties: [
                    {
                        keys: [],
                        matchName: 'ADBE Fill-0007',
                        name: 'All Masks',
                        type: AEX_ONED_PROPERTY,
                        value: 1,
                    },
                    {
                        keys: [],
                        matchName: 'ADBE Fill-0002',
                        name: 'Color',
                        type: AEX_COLOR_PROPERTY,
                        value: [1, 0.5, 0, 1],
                    },
                    {
                        keys: [],
                        matchName: 'ADBE Fill-0006',
                        name: 'Invert',
                        type: AEX_ONED_PROPERTY,
                        value: 1,
                    },
                    {
                        keys: [],
                        matchName: 'ADBE Fill-0003',
                        name: 'Horizontal Feather',
                        type: AEX_ONED_PROPERTY,
                        value: 2.2,
                    },
                    {
                        keys: [],
                        matchName: 'ADBE Fill-0004',
                        name: 'Vertical Feather',
                        type: AEX_ONED_PROPERTY,
                        value: 2.8,
                    },
                    {
                        keys: [],
                        matchName: 'ADBE Fill-0005',
                        name: 'Opacity',
                        type: AEX_ONED_PROPERTY,
                        value: 0.79,
                    },
                ],
                type: AEX_EFFECT_PROPERTYGROUP,
            };

            await aex.create(AeObject.Layer(1), effectData);

            const result = await aex.get(AeObject.Layer(1));
            const layer = result.object;

            assertAreEqual(layer.effects[layer.effects.length - 1], effectData);
        });
    });

    describe.skip('Set & Get', function () {
        let initialProject: any;

        before(async () => {
            await openProject('assets/prescan_2_nested_precomps_project.aep');
        });

        it('Can get() test project', async () => {
            const result = await aex.get(AeObject.Project);
            initialProject = result.object;

            console.log('initial conversion', initialProject);
        });

        it('Can rebuild test project', async () => {
            // Clear project
            await openCleanProject();

            // Rebuild project from scan
            await aex.update(AeObject.Project, initialProject);

            // Scan project again
            const result = await aex.get(AeObject.Project);
            const rebuiltProject = result.object;

            console.log('rebuilt project', rebuiltProject);

            assertAreEqual(initialProject, rebuiltProject);
        });
    });
});
