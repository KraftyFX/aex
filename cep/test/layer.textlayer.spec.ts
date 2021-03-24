import { expect } from 'chai';
import { AeObject, aex } from './aex';
import { cleanupAeqIpc, cleanupAex, evalAexIntoESTK, openProject } from './csinterface';

describe('Text Layer Attributes', function () {
    this.slow(500);
    this.timeout(2000);

    let result: any;

    before(async () => {
        await evalAexIntoESTK();
        await openProject('testAssets/layer_text.aep');
        result = await aex().toObjectWithAeObject(AeObject.Project);
        console.log('layer_text', result);
    });

    after(async () => {
        await cleanupAex();
        await cleanupAeqIpc();
    });

    it('Can parse per-character 3d', async () => {
        expect(result.comps[0].layers[0].threeDPerChar).to.eql(true);
    });

    it('Can parse Text Path Options', async () => {
        expect(result.comps[0].layers[1].pathOption).to.eql({
            matchName: 'ADBE Text Path Options',
            properties: [
                {
                    keys: [],
                    matchName: 'ADBE Text Path',
                    name: 'Path',
                    value: 1,
                },
                {
                    keys: [],
                    matchName: 'ADBE Text Reverse Path',
                    name: 'Reverse Path',
                    value: 1,
                },
                {
                    keys: [],
                    matchName: 'ADBE Text Force Align Path',
                    name: 'Force Alignment',
                    value: 1,
                },
                {
                    keys: [],
                    matchName: 'ADBE Text First Margin',
                    name: 'First Margin',
                    value: 18,
                },
                {
                    keys: [],
                    matchName: 'ADBE Text Last Margin',
                    name: 'Last Margin',
                    value: 20,
                },
            ],
        });
    });

    it('Can parse Text More Options', async () => {
        expect(result.comps[0].layers[2].moreOption).to.eql({
            matchName: 'ADBE Text More Options',
            properties: [
                {
                    keys: [],
                    matchName: 'ADBE Text Anchor Point Option',
                    name: 'Anchor Point Grouping',
                    value: 2,
                },
                {
                    keys: [],
                    matchName: 'ADBE Text Anchor Point Align',
                    name: 'Grouping Alignment',
                    value: [18, 20],
                },
                {
                    keys: [],
                    matchName: 'ADBE Text Render Order',
                    name: 'Fill & Stroke',
                    value: 2,
                },
                {
                    keys: [],
                    matchName: 'ADBE Text Character Blend Mode',
                    name: 'Inter-Character Blending',
                    value: 9,
                },
            ],
        });
    });

    it('Can handle empty Text Animators', async () => {
        expect(result.comps[1].layers[0]).to.not.have.property('animators');
    });

    it('Can parse multiple Text Animators on one layer', async () => {
        expect(result.comps[1].layers[1].animators.properties).to.eql([
            {
                matchName: 'ADBE Text Animator',
                name: 'Animator 1',
                properties: [
                    {
                        matchName: 'ADBE Text Selectors',
                        properties: [
                            {
                                matchName: 'ADBE Text Selector',
                                name: 'Anim 1 Selector 1',
                                properties: [
                                    {
                                        name: 'Start',
                                        matchName: 'ADBE Text Percent Start',
                                        value: 20,
                                        keys: [],
                                    },
                                ],
                            },
                        ],
                    },
                    {
                        matchName: 'ADBE Text Animator Properties',
                        properties: [
                            {
                                name: 'Position',
                                matchName: 'ADBE Text Position 3D',
                                value: [100, 200, 0],
                                keys: [],
                            },
                        ],
                    },
                ],
            },
            {
                matchName: 'ADBE Text Animator',
                name: 'Animator 2',
                enabled: false,
                properties: [
                    {
                        matchName: 'ADBE Text Selectors',
                        properties: [
                            {
                                matchName: 'ADBE Text Selector',
                                name: 'Anim 2 Selector 1',
                                properties: [
                                    {
                                        name: 'End',
                                        matchName: 'ADBE Text Percent End',
                                        value: 50,
                                        keys: [],
                                    },
                                    {
                                        matchName: 'ADBE Text Range Advanced',
                                        properties: [
                                            {
                                                name: 'Amount',
                                                matchName: 'ADBE Text Selector Max Amount',
                                                value: 50,
                                                keys: [],
                                            },
                                        ],
                                    },
                                ],
                            },
                        ],
                    },
                    {
                        matchName: 'ADBE Text Animator Properties',
                        properties: [
                            {
                                name: 'Position',
                                matchName: 'ADBE Text Position 3D',
                                value: [100, 200, 0],
                                keys: [],
                            },
                        ],
                    },
                ],
            },
        ]);
    });

    it('Can parse multiple Text Animator Selectors on one layer', async () => {
        expect(result.comps[1].layers[2].animators.properties).to.eql([
            {
                matchName: 'ADBE Text Animator',
                name: 'Animator 1',
                properties: [
                    {
                        matchName: 'ADBE Text Selectors',
                        properties: [
                            {
                                matchName: 'ADBE Text Selector',
                                name: 'Range Selector 1',
                                properties: [
                                    {
                                        keys: [],
                                        matchName: 'ADBE Text Percent Start',
                                        name: 'Start',
                                        value: 10,
                                    },
                                ],
                            },
                            {
                                matchName: 'ADBE Text Selector',
                                name: 'Range Selector 2',
                                properties: [
                                    {
                                        keys: [],
                                        matchName: 'ADBE Text Percent Start',
                                        name: 'Start',
                                        value: 20,
                                    },
                                ],
                            },
                        ],
                    },
                ],
            },
        ]);
    });

    it('Can parse Text Animator with animated Range Selector', async () => {
        expect(result.comps[1].layers[3].animators.properties).to.eql([
            {
                matchName: 'ADBE Text Animator',
                name: 'Position Animator',
                properties: [
                    {
                        matchName: 'ADBE Text Selectors',
                        properties: [
                            {
                                matchName: 'ADBE Text Selector',
                                name: 'A Range Selector',
                                properties: [
                                    {
                                        name: 'Start',
                                        matchName: 'ADBE Text Percent Start',
                                        value: 0,
                                        keys: [
                                            {
                                                value: 0,
                                                time: 0,
                                                interpolationType: {},
                                                temporalEase: {
                                                    inEase: [
                                                        {
                                                            influence: 16.666666667,
                                                            speed: 0,
                                                        },
                                                    ],
                                                    outEase: [
                                                        {
                                                            influence: 16.666666667,
                                                            speed: 50,
                                                        },
                                                    ],
                                                },
                                            },
                                            {
                                                value: 100,
                                                time: 2,
                                                interpolationType: {},
                                                temporalEase: {
                                                    inEase: [
                                                        {
                                                            influence: 16.666666667,
                                                            speed: 50,
                                                        },
                                                    ],
                                                    outEase: [
                                                        {
                                                            influence: 16.666666667,
                                                            speed: 0,
                                                        },
                                                    ],
                                                },
                                            },
                                        ],
                                    },
                                ],
                            },
                        ],
                    },
                    {
                        matchName: 'ADBE Text Animator Properties',
                        properties: [
                            {
                                keys: [],
                                matchName: 'ADBE Text Position 3D',
                                name: 'Position',
                                value: [0, 100, 0],
                            },
                        ],
                    },
                ],
            },
        ]);
    });

    it('Can parse Text Animator with Expression Selector', async () => {
        expect(result.comps[1].layers[4].animators.properties).to.eql([
            {
                matchName: 'ADBE Text Animator',
                name: 'Colour Animator',
                properties: [
                    {
                        matchName: 'ADBE Text Selectors',
                        properties: [
                            {
                                matchName: 'ADBE Text Expressible Selector',
                                name: 'An Expression Selector',
                                properties: [
                                    {
                                        name: 'Amount',
                                        matchName: 'ADBE Text Expressible Amount',
                                        value: [100, 100, 100],
                                        expression: 'timeToFrames(time * 10) * textIndex/textTotal',
                                        expressionEnabled: true,
                                        keys: [],
                                    },
                                ],
                            },
                        ],
                    },
                ],
            },
        ]);
    });

    it('Can parse Text Animator with Wiggle Selector', async () => {
        expect(result.comps[1].layers[5].animators.properties).to.eql([
            {
                matchName: 'ADBE Text Animator',
                name: 'Tracking Animator',
                properties: [
                    {
                        matchName: 'ADBE Text Selectors',
                        properties: [
                            {
                                matchName: 'ADBE Text Wiggly Selector',
                                name: 'A Wiggly Selector',
                                properties: [
                                    {
                                        name: 'Mode',
                                        matchName: 'ADBE Text Selector Mode',
                                        value: 3,
                                        keys: [],
                                    },
                                ],
                            },
                        ],
                    },
                    {
                        matchName: 'ADBE Text Animator Properties',
                        properties: [
                            {
                                name: 'Tracking Amount',
                                matchName: 'ADBE Text Tracking Amount',
                                value: 100,
                                keys: [],
                            },
                        ],
                    },
                ],
            },
        ]);
    });
});
