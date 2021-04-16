function getAVLayer(layer: AVLayer, state: AexState): AexAVLayerBase {
    const layerAttributes = getLayerAttributes(layer, state);

    return {
        ...layerAttributes,
        type: AEX_FOOTAGE_LAYER,

        adjustmentLayer: getModifiedValue(layer.adjustmentLayer, false),
        audioEnabled: getModifiedValue(layer.audioEnabled, true),
        autoOrient: getModifiedValue(layer.autoOrient, AutoOrientType.NO_AUTO_ORIENT),
        blendingMode: getModifiedValue(layer.blendingMode, BlendingMode.NORMAL),
        collapseTransformation: getModifiedValue(layer.collapseTransformation, false),
        effectsActive: getModifiedValue(layer.effectsActive, true),
        environmentLayer: getModifiedValue(layer.environmentLayer, false),
        frameBlendingType: getModifiedValue(layer.frameBlendingType, FrameBlendingType.NO_FRAME_BLEND),
        guideLayer: getModifiedValue(layer.guideLayer, false),
        motionBlur: getModifiedValue(layer.motionBlur, false),
        preserveTransparency: getModifiedValue(layer.preserveTransparency, false),
        quality: getModifiedValue(layer.quality, LayerQuality.BEST),
        samplingQuality: getModifiedValue(layer.samplingQuality, LayerSamplingQuality.BILINEAR),
        threeDLayer: getModifiedValue(layer.threeDLayer, false),
        timeRemapEnabled: getModifiedValue(layer.timeRemapEnabled, false),
        isTrackMatte: getModifiedValue(layer.isTrackMatte, false),
        trackMatteType: getModifiedValue(layer.trackMatteType, TrackMatteType.NO_TRACK_MATTE),

        masks: _getAexLayerMasks(layer, state),
        audio: getPropertyGroup(layer.audio, state),
        timeRemap: getModifiedProperty(layer.timeRemap, state),
        effects: _getEffects(layer, state),
        materialOption: getPropertyGroup(layer.materialOption, state),
        geometryOption: getPropertyGroup(layer.geometryOption, state),

        layerStyles: getBoundModifiedValue(layer.layerStyle.canSetEnabled, () => _getLayerStyles(layer.layerStyle, state), undefined),
    };
}

function _setAVLayerAttributes(layer: Layer, aexAVLayer: AexAVLayer, state: AexState): void {
    assignAttributes(layer, {
        adjustmentLayer: aexAVLayer.adjustmentLayer,
        audioEnabled: aexAVLayer.audioEnabled,
        autoOrient: aexAVLayer.autoOrient,
        blendingMode: aexAVLayer.blendingMode,
        collapseTransformation: aexAVLayer.collapseTransformation,
        effectsActive: aexAVLayer.effectsActive,
        environmentLayer: aexAVLayer.environmentLayer,
        frameBlendingType: aexAVLayer.frameBlendingType,
        guideLayer: aexAVLayer.guideLayer,
        motionBlur: aexAVLayer.motionBlur,
        preserveTransparency: aexAVLayer.preserveTransparency,
        quality: aexAVLayer.quality,
        samplingQuality: aexAVLayer.samplingQuality,
        threeDLayer: aexAVLayer.threeDLayer,
        timeRemapEnabled: aexAVLayer.timeRemapEnabled,
        isTrackMatte: aexAVLayer.isTrackMatte,
        trackMatteType: aexAVLayer.trackMatteType,
    });

    _setLayerAttributes(layer, aexAVLayer, state);

    /**
     * @todo
     *
     * - masks
     * - audio
     * - timeRemap
     * - effects
     * - materialOption
     * - geometryOption
     * - layerStyles
     */
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

            styles.properties.push({
                name,
                matchName,
                enabled,

                properties: propertyData ? propertyData.properties : undefined,
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

        masks.push({
            name,
            color,
            maskMode: getModifiedValue(mask.maskMode, MaskMode.ADD),
            inverted: getModifiedValue(mask.inverted, false),
            rotoBezier: getModifiedValue(mask.rotoBezier, false),
            maskMotionBlur: getModifiedValue(mask.maskMotionBlur, MaskMotionBlur.SAME_AS_LAYER),
            locked: getModifiedValue(mask.locked, false),
            maskPath: getModifiedProperty(mask.maskPath, state),
            maskFeather: getModifiedProperty(mask.maskFeather, state),
            maskOpacity: getModifiedProperty(mask.maskOpacity, state),
            maskExpansion: getModifiedProperty(mask.maskExpansion, state),
        });
    });

    return masks;
}

function _getEffects(layer: AVLayer, state: AexState) {
    const onGroup: OnGroupCallback = (propertyGroup, aexPropertyGroup) => {
        /**
         * Voodoo: We need to handle dropdown effects in a unique way
         */
        if (isDropdownEffect(propertyGroup, state)) {
            aexPropertyGroup.properties = [getDropdownProperty(propertyGroup, state)];
        }
    };

    return getUnnestedPropertyGroup(layer.effect, onGroup, state);
}
