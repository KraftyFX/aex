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

    setAvLayerAttributes(layer, aexTextLayer, state);

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
        // setPropertyGroup(animators, aexTextLayer.animators, state);
        setTextLayerAnimators(animators, aexTextLayer.animators, state);
    }

    return layer;
}

function setTextLayerAnimators(aeAnimators: PropertyGroup, aexAnimators: AexPropertyGroup[], state: AexState) {
    aeq.arrayEx(aexAnimators).forEach((aexAnimator: AexPropertyGroup) => {
        let animator = aeAnimators.addProperty(aexAnimator.matchName) as PropertyGroup;

        assignAttributes(animator, {
            name: aexAnimator.name,
            enabled: aexAnimator.enabled,
        });

        setPropertyGroup(animator, aexAnimator, state);
    });
}

function updateAexTextLayer(aeTextLayer: TextLayer, aexTextLayer: AexTextLayer, state: AexState) {
    throw notImplemented(`Updating a text layer`);
}
