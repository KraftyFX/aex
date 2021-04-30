function getAexTextLayer(layer: TextLayer, state: AexState): AexTextLayer {
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

function createAeTextLayer(comp: CompItem, aexTextLayer: AexTextLayer, state: AexState) {
    let layer: TextLayer;

    const textValue = aexTextLayer.sourceText.value.text;

    if (aexTextLayer.sourceText.value.pointText) {
        layer = comp.layers.addText(textValue);
    } else {
        const boxSize = aexTextLayer.sourceText.value.boxTextSize;
        layer = comp.layers.addBoxText(boxSize, textValue);
    }

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
        setPropertyGroup(text.moreOption, aexTextLayer.moreOption, state);
    }

    if (aexTextLayer.animators) {
        setPropertyGroup(animators, aexTextLayer.animators, state);
    }
    return layer;
}
