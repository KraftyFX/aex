function prescanAvLayer(aeAvLayer: AVLayer, state: AexState) {
    prescanAvLayerMask(aeAvLayer, state);
    prescanPropertyGroup(aeAvLayer.audio, state);
    prescanProperty(aeAvLayer.timeRemap, state);
    prescanPropertyGroup(aeAvLayer.effect, state);
    prescanPropertyGroup(aeAvLayer.materialOption, state);
    prescanPropertyGroup(aeAvLayer.geometryOption, state);
}

function getAvLayerAttributes(aeAvLayer: AVLayer, type: AexAvLayerType, state: AexState): AexAVLayerBase {
    const layerAttributes = getLayerAttributes(aeAvLayer, state);

    return {
        ...layerAttributes,
        type,

        adjustmentLayer: getModifiedValue(aeAvLayer.adjustmentLayer, false),
        audioEnabled: getModifiedValue(aeAvLayer.audioEnabled, true),
        autoOrient: getModifiedValue(aeAvLayer.autoOrient, AutoOrientType.NO_AUTO_ORIENT),
        blendingMode: getModifiedValue(aeAvLayer.blendingMode, BlendingMode.NORMAL),
        collapseTransformation: getModifiedValue(aeAvLayer.collapseTransformation, false),
        effectsActive: getModifiedValue(aeAvLayer.effectsActive, true),
        environmentLayer: getModifiedValue(aeAvLayer.environmentLayer, false),
        frameBlendingType: getModifiedValue(aeAvLayer.frameBlendingType, FrameBlendingType.NO_FRAME_BLEND),
        guideLayer: getModifiedValue(aeAvLayer.guideLayer, false),
        motionBlur: getModifiedValue(aeAvLayer.motionBlur, false),
        preserveTransparency: getModifiedValue(aeAvLayer.preserveTransparency, false),
        quality: getModifiedValue(aeAvLayer.quality, LayerQuality.BEST),
        samplingQuality: getModifiedValue(aeAvLayer.samplingQuality, LayerSamplingQuality.BILINEAR),
        threeDLayer: getModifiedValue(aeAvLayer.threeDLayer, false),
        timeRemapEnabled: getModifiedValue(aeAvLayer.timeRemapEnabled, false),
        trackMatteType: getModifiedValue(aeAvLayer.trackMatteType, TrackMatteType.NO_TRACK_MATTE),

        masks: _getAexLayerMasks(aeAvLayer, state),
        audio: getPropertyGroup(aeAvLayer.audio, state),
        timeRemap: getModifiedProperty(aeAvLayer.timeRemap, state),
        effects: getAexAvLayerEffects(aeAvLayer, state),
        materialOption: getPropertyGroup(aeAvLayer.materialOption, state),
        geometryOption: getPropertyGroup(aeAvLayer.geometryOption, state),

        layerStyles: getBoundModifiedValue(aeAvLayer.layerStyle.canSetEnabled, () => _getAvLayerStyles(aeAvLayer.layerStyle, state), undefined),
    };
}

function setAvLayerAttributes(aeAvLayer: AVLayer, aexAvLayer: AexAVLayer, state: AexState): void {
    assignAttributes(aeAvLayer, {
        adjustmentLayer: aexAvLayer.adjustmentLayer,
        audioEnabled: aexAvLayer.audioEnabled,
        autoOrient: aexAvLayer.autoOrient,
        blendingMode: aexAvLayer.blendingMode,
        collapseTransformation: aexAvLayer.collapseTransformation,
        effectsActive: aexAvLayer.effectsActive,
        environmentLayer: aexAvLayer.environmentLayer,
        frameBlendingType: aexAvLayer.frameBlendingType,
        guideLayer: aexAvLayer.guideLayer,
        motionBlur: aexAvLayer.motionBlur,
        preserveTransparency: aexAvLayer.preserveTransparency,
        quality: aexAvLayer.quality,
        samplingQuality: aexAvLayer.samplingQuality,
        threeDLayer: aexAvLayer.threeDLayer,
        timeRemapEnabled: aexAvLayer.timeRemapEnabled,
        trackMatteType: aexAvLayer.trackMatteType,
    });

    // TODO: Find out why setting layer attributes higher up in this function causes "Can create modified 3d AVLayer Null data" test
    setLayerAttributes(aeAvLayer, aexAvLayer, state);
    setAvLayerMasks(aeAvLayer, aexAvLayer, state);
    setAvLayerEffects(aeAvLayer, aexAvLayer, state);

    if (aexAvLayer.audio) {
        setPropertyGroup(aeAvLayer.audio, aexAvLayer.audio, state);
    }

    if (aexAvLayer.timeRemap) {
        aeAvLayer.timeRemapEnabled = true;
        aeAvLayer.timeRemap.removeKey(2);

        setProperty(aeAvLayer.timeRemap, aexAvLayer.timeRemap, state);
    }

    if (aexAvLayer.geometryOption) {
        /**
         * geometryOption only exists if the comp renderer is "Cinema 4D" ("ADBE Ernst")
         * Thus, if we need to deserialize this, we also need to set the renderer
         */
        setCompRenderer(aeAvLayer.containingComp, 'ADBE Ernst');
        setPropertyGroup(aeAvLayer.geometryOption, aexAvLayer.geometryOption, state);
    }

    if (aexAvLayer.materialOption) {
        const compRenderer = getRequiredCompRendererFromProperties(aexAvLayer.materialOption);

        if (compRenderer) {
            setCompRenderer(aeAvLayer.containingComp, compRenderer);
        }

        setPropertyGroup(aeAvLayer.materialOption, aexAvLayer.materialOption, state);
    }

    _setAvLayerStyles(aeAvLayer, aexAvLayer, state);
}
