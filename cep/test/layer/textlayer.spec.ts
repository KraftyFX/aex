import { expect } from 'chai';
import { AeObject, aex } from '../aex';
import {
    AEX_ONED_PROPERTY,
    AEX_SHAPE_PROPERTY,
    AEX_TEXTDOCUMENT_PROPERTY,
    AEX_TEXT_LAYER,
    AEX_THREED_PROPERTY,
    AEX_TWOD_PROPERTY,
} from '../constants';
import { cleanupAex, evalAexIntoEstk, openCleanProject, openProject } from '../csinterface';
import { assertAreEqual } from '../utils';

describe('Text Layer Attributes', function () {
    this.slow(500);
    this.timeout(2000);

    before(async () => {
        await evalAexIntoEstk();
    });

    after(async () => {
        await cleanupAex();
    });

    describe('Get', async () => {
        let project: any;

        before(async () => {
            await openProject('testAssets/layer_text.aep');
            const result = await aex().fromAeObject(AeObject.Project);
            project = result.object;
            console.log('layer_text', project);
        });

        it('Can parse per-character 3d', async () => {
            expect(project.comps[0].layers[0].threeDPerChar).to.eql(true);
        });

        it('Can parse Text Path Options', async () => {
            assertAreEqual(project.comps[0].layers[1].pathOption, {
                matchName: 'ADBE Text Path Options',
                properties: [
                    {
                        type: AEX_ONED_PROPERTY,
                        keys: [],
                        matchName: 'ADBE Text Path',
                        name: 'Path',
                        value: 1,
                    },
                    {
                        type: AEX_ONED_PROPERTY,
                        keys: [],
                        matchName: 'ADBE Text Reverse Path',
                        name: 'Reverse Path',
                        value: 1,
                    },
                    {
                        type: AEX_ONED_PROPERTY,
                        keys: [],
                        matchName: 'ADBE Text Force Align Path',
                        name: 'Force Alignment',
                        value: 1,
                    },
                    {
                        type: AEX_ONED_PROPERTY,
                        keys: [],
                        matchName: 'ADBE Text First Margin',
                        name: 'First Margin',
                        value: 18,
                    },
                    {
                        type: AEX_ONED_PROPERTY,
                        keys: [],
                        matchName: 'ADBE Text Last Margin',
                        name: 'Last Margin',
                        value: 20,
                    },
                ],
            });
        });

        it('Can parse Text More Options', async () => {
            assertAreEqual(project.comps[0].layers[2].moreOption, {
                matchName: 'ADBE Text More Options',
                properties: [
                    {
                        type: AEX_ONED_PROPERTY,
                        keys: [],
                        matchName: 'ADBE Text Anchor Point Option',
                        name: 'Anchor Point Grouping',
                        value: 2,
                    },
                    {
                        type: AEX_TWOD_PROPERTY,
                        keys: [],
                        matchName: 'ADBE Text Anchor Point Align',
                        name: 'Grouping Alignment',
                        value: [18, 20],
                    },
                    {
                        type: AEX_ONED_PROPERTY,
                        keys: [],
                        matchName: 'ADBE Text Render Order',
                        name: 'Fill & Stroke',
                        value: 2,
                    },
                    {
                        type: AEX_ONED_PROPERTY,
                        keys: [],
                        matchName: 'ADBE Text Character Blend Mode',
                        name: 'Inter-Character Blending',
                        value: 9,
                    },
                ],
            });
        });

        it('Can handle empty Text Animators', async () => {
            expect(project.comps[1].layers[0]).to.not.have.property('animators');
        });

        it('Can parse multiple Text Animators on one layer', async () => {
            assertAreEqual(project.comps[1].layers[1].animators.properties, [
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
                                            type: AEX_ONED_PROPERTY,
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
                                    type: AEX_THREED_PROPERTY,
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
                                            type: AEX_ONED_PROPERTY,
                                            name: 'End',
                                            matchName: 'ADBE Text Percent End',
                                            value: 50,
                                            keys: [],
                                        },
                                        {
                                            matchName: 'ADBE Text Range Advanced',
                                            properties: [
                                                {
                                                    type: AEX_ONED_PROPERTY,
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
                                    type: AEX_THREED_PROPERTY,
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
            assertAreEqual(project.comps[1].layers[2].animators.properties, [
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
                                            type: AEX_ONED_PROPERTY,
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
                                            type: AEX_ONED_PROPERTY,
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
            assertAreEqual(project.comps[1].layers[3].animators.properties, [
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
                                            type: AEX_ONED_PROPERTY,
                                            name: 'Start',
                                            matchName: 'ADBE Text Percent Start',
                                            value: 0,
                                            keys: [
                                                {
                                                    value: 0,
                                                    time: 0,
                                                    temporalEase: {
                                                        inEase: [
                                                            {
                                                                influence: 16.66667,
                                                                speed: 0,
                                                            },
                                                        ],
                                                        outEase: [
                                                            {
                                                                influence: 16.66667,
                                                                speed: 50,
                                                            },
                                                        ],
                                                    },
                                                },
                                                {
                                                    value: 100,
                                                    time: 2,
                                                    temporalEase: {
                                                        inEase: [
                                                            {
                                                                influence: 16.66667,
                                                                speed: 50,
                                                            },
                                                        ],
                                                        outEase: [
                                                            {
                                                                influence: 16.66667,
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
                                    type: AEX_THREED_PROPERTY,
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
            assertAreEqual(project.comps[1].layers[4].animators.properties, [
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
                                            type: AEX_THREED_PROPERTY,
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
            assertAreEqual(project.comps[1].layers[5].animators.properties, [
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
                                            type: AEX_ONED_PROPERTY,
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
                                    type: AEX_ONED_PROPERTY,
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

    describe('Set', async () => {
        before(async () => {
            await openCleanProject();
        });

        it('Can set per-character 3d', async () => {
            const layerData = {
                threeDPerChar: true,
                sourceText: {
                    type: AEX_TEXTDOCUMENT_PROPERTY,
                    keys: [],
                    matchName: 'ADBE Text Document',
                    name: 'Source Text',
                    value: {
                        applyFill: true,
                        baselineLocs: [-115.332, 0, 115.332, 0],
                        baselineShift: 0,
                        fillColor: [1, 1, 1],
                        font: 'ArialMT',
                        fontFamily: 'Arial',
                        fontSize: 50,
                        fontStyle: 'Regular',
                        horizontalScale: 1,
                        justification: 7415,
                        leading: 60,
                        pointText: true,
                        text: 'Text Layer',
                        tracking: 0,
                        tsume: 0,
                        verticalScale: 1,
                    },
                },
                type: AEX_TEXT_LAYER,
            };

            await aex().fromAexObject(layerData);

            const result = await aex().fromAeObject(AeObject.ActiveComp);
            const comp = result.object;

            assertAreEqual(comp.layers[0].threeDPerChar, layerData.threeDPerChar);
        });

        it('Can set Text Path Options', async () => {
            const layerData = {
                masks: [
                    {
                        color: [1, 1, 1],
                        maskPath: {
                            type: AEX_SHAPE_PROPERTY,
                            keys: [],
                            matchName: 'ADBE Mask Shape',
                            name: 'Mask Path',
                            value: {
                                closed: true,
                                featherInterps: [],
                                featherRadii: [],
                                featherRelCornerAngles: [],
                                featherRelSegLocs: [],
                                featherSegLocs: [],
                                featherTensions: [],
                                featherTypes: [],
                                inTangents: [
                                    [100, 0],
                                    [0, -100],
                                    [-100, 0],
                                    [0, 100],
                                ],
                                outTangents: [
                                    [-100, 0],
                                    [0, 100],
                                    [100, 0],
                                    [0, -100],
                                ],
                                vertices: [
                                    [200, 100],
                                    [200, 300],
                                    [300, 400],
                                    [400, 300],
                                ],
                            },
                        },
                        name: 'Basic',
                    },
                ],
                pathOption: {
                    matchName: 'ADBE Text Path Options',
                    properties: [
                        {
                            type: AEX_ONED_PROPERTY,
                            keys: [],
                            matchName: 'ADBE Text Path',
                            name: 'Path',
                            value: 1,
                        },
                        {
                            type: AEX_ONED_PROPERTY,
                            keys: [],
                            matchName: 'ADBE Text Reverse Path',
                            name: 'Reverse Path',
                            value: 1,
                        },
                        {
                            type: AEX_ONED_PROPERTY,
                            keys: [],
                            matchName: 'ADBE Text Force Align Path',
                            name: 'Force Alignment',
                            value: 1,
                        },
                        {
                            type: AEX_ONED_PROPERTY,
                            keys: [],
                            matchName: 'ADBE Text First Margin',
                            name: 'First Margin',
                            value: 18,
                        },
                        {
                            type: AEX_ONED_PROPERTY,
                            keys: [],
                            matchName: 'ADBE Text Last Margin',
                            name: 'Last Margin',
                            value: 20,
                        },
                    ],
                },
                sourceText: {
                    type: AEX_TEXTDOCUMENT_PROPERTY,
                    keys: [],
                    matchName: 'ADBE Text Document',
                    name: 'Source Text',
                    value: {
                        applyFill: true,
                        baselineLocs: [-115.332, 0, 115.332, 0],
                        baselineShift: 0,
                        fillColor: [1, 1, 1],
                        font: 'ArialMT',
                        fontFamily: 'Arial',
                        fontSize: 50,
                        fontStyle: 'Regular',
                        horizontalScale: 1,
                        justification: 7415,
                        leading: 60,
                        pointText: true,
                        text: 'Text Layer',
                        tracking: 0,
                        tsume: 0,
                        verticalScale: 1,
                    },
                },
                type: AEX_TEXT_LAYER,
            };

            await aex().fromAexObject(layerData);

            const result = await aex().fromAeObject(AeObject.ActiveComp);
            const comp = result.object;

            assertAreEqual(comp.layers[0].pathOption, layerData.pathOption);
        });

        it('Can set Text More Options', async () => {
            const layerData = {
                moreOption: {
                    matchName: 'ADBE Text More Options',
                    properties: [
                        {
                            type: AEX_ONED_PROPERTY,
                            keys: [],
                            matchName: 'ADBE Text Anchor Point Option',
                            name: 'Anchor Point Grouping',
                            value: 2,
                        },
                        {
                            type: AEX_TWOD_PROPERTY,
                            keys: [],
                            matchName: 'ADBE Text Anchor Point Align',
                            name: 'Grouping Alignment',
                            value: [18, 20],
                        },
                        {
                            type: AEX_ONED_PROPERTY,
                            keys: [],
                            matchName: 'ADBE Text Render Order',
                            name: 'Fill & Stroke',
                            value: 2,
                        },
                        {
                            type: AEX_ONED_PROPERTY,
                            keys: [],
                            matchName: 'ADBE Text Character Blend Mode',
                            name: 'Inter-Character Blending',
                            value: 9,
                        },
                    ],
                },
                sourceText: {
                    type: AEX_TEXTDOCUMENT_PROPERTY,
                    keys: [],
                    matchName: 'ADBE Text Document',
                    name: 'Source Text',
                    value: {
                        applyFill: true,
                        baselineLocs: [-115.332, 0, 115.332, 0],
                        baselineShift: 0,
                        fillColor: [1, 1, 1],
                        font: 'ArialMT',
                        fontFamily: 'Arial',
                        fontSize: 50,
                        fontStyle: 'Regular',
                        horizontalScale: 1,
                        justification: 7415,
                        leading: 60,
                        pointText: true,
                        text: 'Text Layer',
                        tracking: 0,
                        tsume: 0,
                        verticalScale: 1,
                    },
                },
                type: AEX_TEXT_LAYER,
            };

            await aex().fromAexObject(layerData);

            const result = await aex().fromAeObject(AeObject.ActiveComp);
            const comp = result.object;

            assertAreEqual(comp.layers[0].moreOption, layerData.moreOption);
        });

        it('Can set multiple Text Animators on one layer', async () => {
            const layerData = {
                animators: {
                    matchName: 'ADBE Text Animators',
                    properties: [
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
                                                    type: AEX_ONED_PROPERTY,
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
                                            type: AEX_THREED_PROPERTY,
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
                                                    type: AEX_ONED_PROPERTY,
                                                    name: 'End',
                                                    matchName: 'ADBE Text Percent End',
                                                    value: 50,
                                                    keys: [],
                                                },
                                                {
                                                    matchName: 'ADBE Text Range Advanced',
                                                    properties: [
                                                        {
                                                            type: AEX_ONED_PROPERTY,
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
                                            type: AEX_THREED_PROPERTY,
                                            name: 'Position',
                                            matchName: 'ADBE Text Position 3D',
                                            value: [100, 200, 0],
                                            keys: [],
                                        },
                                    ],
                                },
                            ],
                        },
                    ],
                },
                sourceText: {
                    type: AEX_TEXTDOCUMENT_PROPERTY,
                    keys: [],
                    matchName: 'ADBE Text Document',
                    name: 'Source Text',
                    value: {
                        applyFill: true,
                        baselineLocs: [-115.332, 0, 115.332, 0],
                        baselineShift: 0,
                        fillColor: [1, 1, 1],
                        font: 'ArialMT',
                        fontFamily: 'Arial',
                        fontSize: 50,
                        fontStyle: 'Regular',
                        horizontalScale: 1,
                        justification: 7415,
                        leading: 60,
                        pointText: true,
                        text: 'Text Layer',
                        tracking: 0,
                        tsume: 0,
                        verticalScale: 1,
                    },
                },
                type: AEX_TEXT_LAYER,
            };

            await aex().fromAexObject(layerData);

            const result = await aex().fromAeObject(AeObject.ActiveComp);
            const comp = result.object;

            assertAreEqual(comp.layers[0].animators, layerData.animators);
        });

        it('Can set multiple Text Animator Selectors on one layer', async () => {
            const layerData = {
                animators: {
                    matchName: 'ADBE Text Animators',
                    properties: [
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
                                                    type: AEX_ONED_PROPERTY,
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
                                                    type: AEX_ONED_PROPERTY,
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
                    ],
                },
                sourceText: {
                    type: AEX_TEXTDOCUMENT_PROPERTY,
                    keys: [],
                    matchName: 'ADBE Text Document',
                    name: 'Source Text',
                    value: {
                        applyFill: true,
                        baselineLocs: [-115.332, 0, 115.332, 0],
                        baselineShift: 0,
                        fillColor: [1, 1, 1],
                        font: 'ArialMT',
                        fontFamily: 'Arial',
                        fontSize: 50,
                        fontStyle: 'Regular',
                        horizontalScale: 1,
                        justification: 7415,
                        leading: 60,
                        pointText: true,
                        text: 'Text Layer',
                        tracking: 0,
                        tsume: 0,
                        verticalScale: 1,
                    },
                },
                type: AEX_TEXT_LAYER,
            };

            await aex().fromAexObject(layerData);

            const result = await aex().fromAeObject(AeObject.ActiveComp);
            const comp = result.object;

            assertAreEqual(comp.layers[0].animators, layerData.animators);
        });

        it('Can set Text Animator with animated Range Selector', async () => {
            const layerData = {
                animators: {
                    matchName: 'ADBE Text Animators',
                    properties: [
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
                                                    type: AEX_ONED_PROPERTY,
                                                    name: 'Start',
                                                    matchName: 'ADBE Text Percent Start',
                                                    value: 0,
                                                    keys: [
                                                        {
                                                            value: 0,
                                                            time: 0,
                                                            temporalEase: {
                                                                inEase: [
                                                                    {
                                                                        influence: 16.66667,
                                                                        speed: 0,
                                                                    },
                                                                ],
                                                                outEase: [
                                                                    {
                                                                        influence: 16.66667,
                                                                        speed: 50,
                                                                    },
                                                                ],
                                                            },
                                                        },
                                                        {
                                                            value: 100,
                                                            time: 2,
                                                            temporalEase: {
                                                                inEase: [
                                                                    {
                                                                        influence: 16.66667,
                                                                        speed: 50,
                                                                    },
                                                                ],
                                                                outEase: [
                                                                    {
                                                                        influence: 16.66667,
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
                                            type: AEX_THREED_PROPERTY,
                                            keys: [],
                                            matchName: 'ADBE Text Position 3D',
                                            name: 'Position',
                                            value: [0, 100, 0],
                                        },
                                    ],
                                },
                            ],
                        },
                    ],
                },
                sourceText: {
                    type: AEX_TEXTDOCUMENT_PROPERTY,
                    keys: [],
                    matchName: 'ADBE Text Document',
                    name: 'Source Text',
                    value: {
                        applyFill: true,
                        baselineLocs: [-115.332, 0, 115.332, 0],
                        baselineShift: 0,
                        fillColor: [1, 1, 1],
                        font: 'ArialMT',
                        fontFamily: 'Arial',
                        fontSize: 50,
                        fontStyle: 'Regular',
                        horizontalScale: 1,
                        justification: 7415,
                        leading: 60,
                        pointText: true,
                        text: 'Text Layer',
                        tracking: 0,
                        tsume: 0,
                        verticalScale: 1,
                    },
                },
                type: AEX_TEXT_LAYER,
            };

            await aex().fromAexObject(layerData);

            const result = await aex().fromAeObject(AeObject.ActiveComp);
            const comp = result.object;

            assertAreEqual(comp.layers[0].animators, layerData.animators);
        });

        it('Can set Text Animator with Expression Selector', async () => {
            const layerData = {
                animators: {
                    matchName: 'ADBE Text Animators',
                    properties: [
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
                                                    type: AEX_THREED_PROPERTY,
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
                    ],
                },
                sourceText: {
                    type: AEX_TEXTDOCUMENT_PROPERTY,
                    keys: [],
                    matchName: 'ADBE Text Document',
                    name: 'Source Text',
                    value: {
                        applyFill: true,
                        baselineLocs: [-115.332, 0, 115.332, 0],
                        baselineShift: 0,
                        fillColor: [1, 1, 1],
                        font: 'ArialMT',
                        fontFamily: 'Arial',
                        fontSize: 50,
                        fontStyle: 'Regular',
                        horizontalScale: 1,
                        justification: 7415,
                        leading: 60,
                        pointText: true,
                        text: 'Text Layer',
                        tracking: 0,
                        tsume: 0,
                        verticalScale: 1,
                    },
                },
                type: AEX_TEXT_LAYER,
            };

            await aex().fromAexObject(layerData);

            const result = await aex().fromAeObject(AeObject.ActiveComp);
            const comp = result.object;

            assertAreEqual(comp.layers[0].animators, layerData.animators);
        });

        it('Can set Text Animator with Wiggle Selector', async () => {
            const layerData = {
                animators: {
                    matchName: 'ADBE Text Animators',
                    properties: [
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
                                                    type: AEX_ONED_PROPERTY,
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
                                            type: AEX_ONED_PROPERTY,
                                            name: 'Tracking Amount',
                                            matchName: 'ADBE Text Tracking Amount',
                                            value: 100,
                                            keys: [],
                                        },
                                    ],
                                },
                            ],
                        },
                    ],
                },
                sourceText: {
                    type: AEX_TEXTDOCUMENT_PROPERTY,
                    keys: [],
                    matchName: 'ADBE Text Document',
                    name: 'Source Text',
                    value: {
                        applyFill: true,
                        baselineLocs: [-115.332, 0, 115.332, 0],
                        baselineShift: 0,
                        fillColor: [1, 1, 1],
                        font: 'ArialMT',
                        fontFamily: 'Arial',
                        fontSize: 50,
                        fontStyle: 'Regular',
                        horizontalScale: 1,
                        justification: 7415,
                        leading: 60,
                        pointText: true,
                        text: 'Text Layer',
                        tracking: 0,
                        tsume: 0,
                        verticalScale: 1,
                    },
                },
                type: AEX_TEXT_LAYER,
            };

            await aex().fromAexObject(layerData);

            const result = await aex().fromAeObject(AeObject.ActiveComp);
            const comp = result.object;

            assertAreEqual(comp.layers[0].animators, layerData.animators);
        });
    });
});
