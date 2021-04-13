function getTextLayer(layer: TextLayer, state: AexState): AexTextLayer {
    const avLayerAttributes = getAVLayer(layer, state);
    const threeDPerChar = getBoundModifiedValue(layer.threeDLayer, () => layer.threeDPerChar, false);
    const text = layer.text;
    const animators = text.property('ADBE Text Animators') as PropertyGroup;

    return {
        ...avLayerAttributes,
        type: AEX_TEXT_LAYER,
        threeDPerChar,
        sourceText: getModifiedProperty(text.sourceText, state),
        pathOption: getPropertyGroup(text.pathOption, state),
        moreOption: getPropertyGroup(text.moreOption, state),
        animators: getPropertyGroup(animators, state),
    };
}
