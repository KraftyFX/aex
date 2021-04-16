function getTextLayer(layer: TextLayer, state: AexState): AexTextLayer {
    const avLayerAttributes = getAVLayer(layer, state);

    /**
     * Voodoo: This property exists on TextLayer but can't be toggled. Meaningless cruft.
     */
    delete avLayerAttributes.collapseTransformation;

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

function createTextLayer(comp: CompItem, aexTextLayer: AexTextLayer, state: AexState) {
    const layer = comp.layers.addText();
    _setAVLayerAttributes(layer, aexTextLayer, state);

    assignAttributes(layer, {
        threeDPerChar: aexTextLayer.threeDPerChar,
    });

    const text = layer.text;
    const animators = text.property('ADBE Text Animators') as PropertyGroup;

    setProperty(text.sourceText, aexTextLayer.sourceText, state);

    if (aexTextLayer.pathOption) {
        setPropertyGroup(text.pathOption, aexTextLayer.pathOption, state);
    }

    if (aexTextLayer.moreOption) {
        setPropertyGroup(text.moreOption, aexTextLayer.pathOption, state);
    }

    if (aexTextLayer.animators) {
        setPropertyGroup(animators, aexTextLayer.animators, state);
    }
}
