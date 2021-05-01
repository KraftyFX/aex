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
        trackMatteType: getModifiedValue(layer.trackMatteType, TrackMatteType.NO_TRACK_MATTE),

        masks: _getAexLayerMasks(layer, state),
        audio: getPropertyGroup(layer.audio, state),
        timeRemap: getModifiedProperty(layer.timeRemap, state),
        effects: getEffects(layer, state),
        materialOption: getPropertyGroup(layer.materialOption, state),
        geometryOption: getPropertyGroup(layer.geometryOption, state),

        layerStyles: getBoundModifiedValue(layer.layerStyle.canSetEnabled, () => _getLayerStyles(layer.layerStyle, state), undefined),
    };
}

function _setAVLayerAttributes(avLayer: AVLayer, aexAVLayer: AexAVLayer, state: AexState): void {
    assignAttributes(avLayer, {
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
        trackMatteType: aexAVLayer.trackMatteType,
    });

    // TODO: Find out why setting layer attributes higher up in this function causes "Can create modified 3d AVLayer Null data" test
    setLayerAttributes(avLayer, aexAVLayer, state);
    _setLayerMasks(avLayer.mask, aexAVLayer.masks, state);
    _setEffects(avLayer.effect, aexAVLayer.effects, state);

    if (aexAVLayer.audio) {
        setPropertyGroup(avLayer.audio, aexAVLayer.audio, state);
    }

    if (aexAVLayer.timeRemap) {
        avLayer.timeRemapEnabled = true;
        avLayer.timeRemap.removeKey(2);

        setProperty(avLayer.timeRemap, aexAVLayer.timeRemap, state);
    }

    if (aexAVLayer.geometryOption) {
        /**
         * geometryOption only exists if the comp renderer is "Cinema 4D" ("ADBE Ernst")
         * Thus, if we need to deserialize this, we also need to set the renderer
         */
        setCompRenderer(avLayer.containingComp, 'ADBE Ernst');
        setPropertyGroup(avLayer.geometryOption, aexAVLayer.geometryOption, state);
    }

    if (aexAVLayer.materialOption) {
        const compRenderer = getRequiredCompRendererFromProperties(aexAVLayer.materialOption);

        if (compRenderer) {
            setCompRenderer(avLayer.containingComp, compRenderer);
        }

        setPropertyGroup(avLayer.materialOption, aexAVLayer.materialOption, state);
    }

    if (aexAVLayer.layerStyles) {
        _setLayerStyles(avLayer.layerStyle, aexAVLayer.layerStyles, state);
    }
}
