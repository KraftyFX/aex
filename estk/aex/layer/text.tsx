function getTextLayer(layer: TextLayer, state: AexState): AexTextLayer {
    const avLayerAttributes = getAVLayer(layer, state);

    const text = layer.text;
    const animators = text.property('ADBE Text Animators') as PropertyGroup;

    return {
        ...avLayerAttributes,
        type: AEX_TEXT_LAYER,

        threeDPerChar: getBoundModifiedValue(layer.threeDLayer, () => layer.threeDPerChar, false),
        sourceText: getModifiedProperty(text.sourceText, state),
        pathOption: getPropertyGroup(text.pathOption, state),
        moreOption: getPropertyGroup(text.moreOption, state),
        animators: getPropertyGroup(animators, state),
    };
}
