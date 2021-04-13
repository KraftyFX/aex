function getAVLayer(layer: AVLayer, state: AexState): AexAVLayer {
    const layerAttributes = getLayer(layer, state);

    const adjustmentLayer = getModifiedValue(layer.adjustmentLayer, false);
    const audioEnabled = getModifiedValue(layer.audioEnabled, true);
    const autoOrient = getModifiedValue(layer.autoOrient, AutoOrientType.NO_AUTO_ORIENT);
    const blendingMode = getModifiedValue(layer.blendingMode, BlendingMode.NORMAL);
    const collapseTransformation = getModifiedValue(layer.collapseTransformation, false);
    const effectsActive = getModifiedValue(layer.effectsActive, true);
    const environmentLayer = getModifiedValue(layer.environmentLayer, false);
    const frameBlendingType = getModifiedValue(layer.frameBlendingType, FrameBlendingType.NO_FRAME_BLEND);
    const guideLayer = getModifiedValue(layer.guideLayer, false);
    const motionBlur = getModifiedValue(layer.motionBlur, false);
    const preserveTransparency = getModifiedValue(layer.preserveTransparency, false);
    const quality = getModifiedValue(layer.quality, LayerQuality.BEST);
    const samplingQuality = getModifiedValue(layer.samplingQuality, LayerSamplingQuality.BILINEAR);
    const threeDLayer = getModifiedValue(layer.threeDLayer, false);
    const timeRemapEnabled = getModifiedValue(layer.timeRemapEnabled, false);
    const isTrackMatte = getModifiedValue(layer.isTrackMatte, false);
    const trackMatteType = getModifiedValue(layer.trackMatteType, TrackMatteType.NO_TRACK_MATTE);

    const audio = getPropertyGroup(layer.audio, state);
    const timeRemap = getModifiedProperty(layer.timeRemap, state);
    const effects = _getEffects(layer, state);
    const materialOption = getPropertyGroup(layer.materialOption, state);
    const geometryOption = getPropertyGroup(layer.geometryOption, state);

    const layerStyles = getBoundModifiedValue(layer.layerStyle.canSetEnabled, () => _getLayerStyles(layer.layerStyle, state), undefined);

    return {
        ...layerAttributes,
        type: AEX_FOOTAGE_LAYER,

        adjustmentLayer,
        audioEnabled,
        autoOrient,
        blendingMode,
        collapseTransformation,
        effectsActive,
        environmentLayer,
        frameBlendingType,
        guideLayer,
        motionBlur,
        preserveTransparency,
        quality,
        samplingQuality,
        threeDLayer,
        timeRemapEnabled,
        isTrackMatte,
        trackMatteType,

        masks: _getAexLayerMasks(layer, state),
        audio,
        timeRemap,
        effects,
        materialOption,
        geometryOption,

        layerStyles,
    };
}

function _getLayerStyles(styleGroup: PropertyGroup, state: AexState) {
    const styles = {
        name: styleGroup.name,
        matchName: styleGroup.matchName,
        enabled: styleGroup.enabled,
        properties: [],
    };

    forEachPropertyInGroup(styleGroup, (property: Property | PropertyGroup, ii) => {
        /**
         * Voodoo: We always want to parse the first property in this group
         *   (it's a general property that affects all the others)
         *
         * After that, however, layer styles only really exist in the aep if
         * 'canSetEnabled' is true.
         */
        if (ii == 0 || property.canSetEnabled) {
            const { name, matchName, enabled } = property;

            const propertyData = getPropertyGroup(property as PropertyGroup, state);
            const properties = propertyData ? propertyData.properties : undefined;

            styles.properties.push({
                name,
                matchName,
                enabled,

                properties,
            });
        }
    });

    return styles;
}

function _getAexLayerMasks(layer: Layer, state: AexState): AexMask[] {
    const masks = [];

    if (!isVisibleLayer(layer)) {
        return masks;
    }

    forEachPropertyInGroup(layer.mask, (mask: MaskPropertyGroup) => {
        const { name, color } = mask;

        const maskMode = getModifiedValue(mask.maskMode, MaskMode.ADD);
        const inverted = getModifiedValue(mask.inverted, false);
        const rotoBezier = getModifiedValue(mask.rotoBezier, false);
        const maskMotionBlur = getModifiedValue(mask.maskMotionBlur, MaskMotionBlur.SAME_AS_LAYER);
        const locked = getModifiedValue(mask.locked, false);

        const maskPath = getModifiedProperty(mask.maskPath, state);
        const maskFeather = getModifiedProperty(mask.maskFeather, state);
        const maskOpacity = getModifiedProperty(mask.maskOpacity, state);
        const maskExpansion = getModifiedProperty(mask.maskExpansion, state);

        masks.push({
            name,
            color,
            maskMode,
            inverted,
            rotoBezier,
            maskMotionBlur,
            locked,
            maskPath,
            maskFeather,
            maskOpacity,
            maskExpansion,
        });
    });

    return masks;
}

function _getEffects(layer: AVLayer, state: AexState) {
    const callback: CustomPropertyHandler = (propertyGroup, aexPropertyGroup) => {
        /**
         * Voodoo: We need to handle dropdown effects in a unique way
         */
        if (isDropdownEffect(propertyGroup, state)) {
            aexPropertyGroup.properties = [getDropdownProperty(propertyGroup, state)];
        }
    };

    return getUnnestedPropertyGroup(layer.effect, callback, state);
}
