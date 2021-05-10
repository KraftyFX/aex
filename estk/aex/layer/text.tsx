function prescanTextLayer(aeTextLayer: TextLayer, state: AexState) {
    state.stats.layerCount++;

    prescanAvLayer(aeTextLayer, state);

    const text = aeTextLayer.text;

    prescanPropertyGroup(text.pathOption, state);
    prescanPropertyGroup(text.moreOption, state);
    prescanPropertyGroup(_getAnimatorsProperty(aeTextLayer), state);
}

function _getAnimatorsProperty(aeTextLayer: TextLayer): PropertyGroup {
    return aeTextLayer.text.property('ADBE Text Animators') as PropertyGroup;
}

function getAexTextLayer(aeTextLayer: TextLayer, state: AexState): AexTextLayer {
    const avLayerAttributes = getAvLayerAttributes(aeTextLayer, AEX_TEXT_LAYER, state);

    /**
     * Voodoo: This property exists on TextLayer but can't be toggled. Meaningless cruft.
     */
    delete avLayerAttributes.collapseTransformation;

    const text = aeTextLayer.text;

    state.stats.layerCount++;

    return {
        ...avLayerAttributes,
        type: AEX_TEXT_LAYER,

        threeDPerChar: getBoundModifiedValue(aeTextLayer.threeDLayer, () => aeTextLayer.threeDPerChar, false),
        sourceText: getModifiedProperty(text.sourceText, state),
        pathOption: getPropertyGroup(text.pathOption, state),
        moreOption: getPropertyGroup(text.moreOption, state),
        animators: getPropertyGroup(_getAnimatorsProperty(aeTextLayer), state),
    };
}

function createAeTextLayer(aeComp: CompItem, aexTextLayer: AexTextLayer, state: AexState) {
    let layer: TextLayer;

    const textValue = aexTextLayer.sourceText.value.text;

    if (aexTextLayer.sourceText.value.pointText) {
        layer = aeComp.layers.addText(textValue);
    } else {
        const boxSize = aexTextLayer.sourceText.value.boxTextSize;
        layer = aeComp.layers.addBoxText(boxSize, textValue);
    }

    _setAvLayerAttributes(layer, aexTextLayer, state);

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
