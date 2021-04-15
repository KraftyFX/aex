function getTextLayer(layer: TextLayer, state: AexState): AexTextLayer {
    const avLayerAttributes = getAVLayer(layer, state);

    /**
     * Voodoo: This property exists on TextLayer but can't be toggled. Meaningless cruft.
     */
    delete avLayerAttributes.collapseTransformation;

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

function createTextLayer(comp: CompItem, aexTextLayer: AexTextLayer, state: AexState) {
    const layer = comp.layers.addText();
    _setAVLayerAttributes(layer, aexTextLayer, state);

    /**
     * @todo
     *
     * - threeDPerChar
     * - sourceText
     * - pathOption
     * - moreOption
     * - animators
     */
}
