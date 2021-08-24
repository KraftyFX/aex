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
     * Voodoo
     *
     * This property exists on TextLayer but can't be toggled. Meaningless cruft.
     */
    delete avLayerAttributes.collapseTransformation;

    const text = aeTextLayer.text;

    state.stats.layerCount++;

    return {
        ...avLayerAttributes,

        threeDPerChar: getBoundModifiedValue(aeTextLayer.threeDLayer, () => aeTextLayer.threeDPerChar, false),
        sourceText: getModifiedProperty(text.sourceText, state),
        pathOption: getPropertyGroup(text.pathOption, state),
        moreOption: getPropertyGroup(text.moreOption, state),
        animators: _getAnimators(aeTextLayer, state),
    };
}

function _getAnimators(aeTextLayer: TextLayer, state: AexState): AexAnimatorPropertyGroup[] {
    const animators = _getAnimatorsProperty(aeTextLayer);

    const fillProperties = (propertyGroup: PropertyGroup, aexPropertyGroup: AexAnimatorPropertyGroup) => {
        aexPropertyGroup.properties = getPropertyGroup(propertyGroup, state)?.properties;
        aexPropertyGroup.type = AEX_TEXT_ANIMATOR_PROPERTYGROUP;
    };

    return getTopLevelPropertyGroups(animators, fillProperties, state);
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

    const text = layer.text;
    const animators = text.property('ADBE Text Animators') as PropertyGroup;

    if (aexTextLayer.animators) {
        createTextLayerAnimators(animators, aexTextLayer.animators, state);
    }

    updateAexTextLayer(layer, aexTextLayer, state);

    return layer;
}

function createTextLayerAnimators(aeAnimators: PropertyGroup, aexAnimators: AexPropertyGroup[], state: AexState) {
    aeq.arrayEx(aexAnimators).forEach((aexAnimator: AexPropertyGroup) => {
        let animator = aeAnimators.addProperty(aexAnimator.matchName) as PropertyGroup;

        setTextLayerAnimator(animator, aexAnimator, state);
    });
}

function setTextLayerAnimator(aeAnimator: PropertyGroup, aexAnimator: AexPropertyGroup, state: AexState) {
    assignAttributes(aeAnimator, {
        name: aexAnimator.name,
        enabled: aexAnimator.enabled,
    });

    setPropertyGroup(aeAnimator, aexAnimator, state);
}

function updateAexTextLayer(aeTextLayer: TextLayer, aexTextLayer: AexTextLayer, state: AexState) {
    setAvLayerAttributes(aeTextLayer, aexTextLayer, state);

    const text = aeTextLayer.text;

    if (aexTextLayer.threeDPerChar) {
        assignAttributes(aeTextLayer, {
            threeDPerChar: aexTextLayer.threeDPerChar,
        });
    }

    if (aexTextLayer.sourceText) {
        setProperty(text.sourceText, aexTextLayer.sourceText, state);
    }

    if (aexTextLayer.pathOption) {
        setPropertyGroup(text.pathOption, aexTextLayer.pathOption, state);
    }

    if (aexTextLayer.moreOption) {
        setPropertyGroup(text.moreOption, aexTextLayer.moreOption, state);
    }
}
