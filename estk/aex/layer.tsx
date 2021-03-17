function getAexLayer(layer: Layer, options: AexOptions): AexLayer {
    let baseAttributes = {} as AexLayerAttributes;

    let audio, timeRemap, layerStyles, materialOption, geometryOption, effects;

    if (isVisibleLayer(layer)) {
        if (aeq.isTextLayer(layer)) {
            baseAttributes = _getTextLayerAttributes(layer);
        } else if (aeq.isShapeLayer(layer)) {
            // TODO: Factor this out
            baseAttributes = _getLayerAttributes(layer);
            baseAttributes.layerType = 'ShapeLayer';
        } else {
            baseAttributes = _getAVLayerAttributes(layer);
        }

        if (layer.timeRemapEnabled) {
            timeRemap = getModifiedProperty(layer.timeRemap);
        }

        if (layer.hasAudio) {
            audio = getPropertyGroup(layer.audio);
        }

        if (layer.layerStyle.canSetEnabled) {
            layerStyles = _getLayerStyles(layer);
        }

        if (layer.threeDLayer) {
            materialOption = getPropertyGroup(layer.materialOption);
            geometryOption = getPropertyGroup(layer.geometryOption);
        }

        if (layer.effect.isModified) {
            effects = _getEffects(layer);
        }
    } else if (aeq.isLightLayer(layer)) {
        baseAttributes = _getLightLayerAttributes(layer);
    } else if (aeq.isCameraLayer(layer)) {
        // TODO: Factor this out
        baseAttributes = _getLayerAttributes(layer);
        baseAttributes.layerType = 'CameraLayer';
        baseAttributes.hasVideo = getModifiedValue(layer.hasVideo, false);
    } else {
        throw new Error(`Unrecognized Layer Type`);
    }

    const aexLayer: AexLayer = {
        type: AEX_LAYER,

        ...baseAttributes,

        markers: _getAexLayerMarkers(layer, options),
        transform: _getTransform(layer),
        timeRemap,
        effects,
        masks: _getAexLayerMasks(layer),
        audio,
        layerStyles,
        materialOption,
        geometryOption,

        properties: _getProperties(layer),
    };

    return aexLayer;
}

function _getLayerStyles(layer: AVLayer | TextLayer | ShapeLayer) {
    const layerStyles = {
        enabled: layer.layerStyle.enabled,
        ...getPropertyGroup(layer.layerStyle),
    };

    if (layerStyles.hasOwnProperty('patternFill/enabled')) {
        delete layerStyles['patternFill/enabled'];
    }

    return layerStyles;
}

function _getProperties(layer: Layer): AexProperties {
    const properties = {} as AexProperties;

    return properties.toSource() === '({})' ? undefined : properties;
}

function _getEffects(layer: AVLayer | TextLayer | ShapeLayer): AexProperties[] {
    const effectsGroup = layer.effect;
    const effects = [];

    for (let ii = 1, il = effectsGroup.numProperties; ii <= il; ii++) {
        const effect = effectsGroup.property(ii) as PropertyGroup;

        const { name, matchName, enabled } = effect;

        let properties = getPropertyGroup(effect);

        effects.push({
            name,
            matchName,
            enabled,

            properties,
        });
    }
    return effects;
}

function _getAexLayerMasks(layer: Layer): AexProperties[] {
    if (!isVisibleLayer(layer)) {
        return undefined;
    }

    let maskGroup = layer.mask;

    if (!maskGroup.isModified) {
        return undefined;
    }

    let masks = [];

    for (let ii = 1, il = maskGroup.numProperties; ii <= il; ii++) {
        const mask = maskGroup.property(ii) as MaskPropertyGroup;

        const { name, color } = mask;

        const maskMode = getModifiedValue(mask.maskMode, MaskMode.ADD);
        const inverted = getModifiedValue(mask.inverted, false);
        const rotoBezier = getModifiedValue(mask.rotoBezier, false);
        const maskMotionBlur = getModifiedValue(mask.maskMotionBlur, MaskMotionBlur.SAME_AS_LAYER);
        const locked = getModifiedValue(mask.locked, false);

        const maskPath = getModifiedProperty(mask.maskPath);
        const maskFeather = getModifiedProperty(mask.maskFeather);
        const maskOpacity = getModifiedProperty(mask.maskOpacity);
        const maskExpansion = getModifiedProperty(mask.maskExpansion);

        masks.push({
            name,
            maskMode,
            inverted,
            rotoBezier,
            maskMotionBlur,
            locked,
            color,
            maskPath,
            maskFeather,
            maskOpacity,
            maskExpansion,
        });
    }

    return masks;
}

function _getAexLayerMarkers(layer: Layer, options: AexOptions) {
    // zlovatt: Is marker a scalar or an array?
    if (layer.marker.isModified) {
        return getAexMarkerProperties(layer.marker);
    } else {
        return undefined;
    }
}

function _getLayerAttributes(layer: Layer): AexLayerAttributes {
    const containingComp = layer.containingComp;

    const name = layer.name;
    const label = layer.label;

    const comment = getModifiedValue(layer.comment, '');
    const inPoint = getModifiedValue(layer.inPoint, 0);
    const outPoint = getModifiedValue(layer.outPoint, containingComp.duration);
    const startTime = getModifiedValue(layer.startTime, 0);
    const stretch = getModifiedValue(layer.stretch, 100);
    const nullLayer = getModifiedValue(layer.nullLayer, false);
    const shy = getModifiedValue(layer.shy, false);
    const solo = getModifiedValue(layer.solo, false);

    const parentLayerIndex = layer.parent ? layer.parent.index : undefined;

    let layerType: AexLayerType;
    let hasVideo: boolean;

    if (aeq.isShapeLayer(layer)) {
        layerType = 'ShapeLayer';
        hasVideo = getModifiedValue(layer.hasVideo, true);
    } else if (aeq.isCameraLayer(layer)) {
        layerType = 'CameraLayer';
        hasVideo = getModifiedValue(layer.hasVideo, false);
    } else {
        layerType = 'Layer';
        hasVideo = getModifiedValue(layer.hasVideo, true);
    }

    return {
        name,
        label,
        layerType,

        comment,
        hasVideo,
        inPoint,
        outPoint,
        startTime,
        stretch,
        nullLayer,
        shy,
        solo,
        parentLayerIndex,
    };
}

function _getAVLayerAttributes(layer: AVLayer): AexAVLayerAttributes {
    const layerAttributes = _getLayerAttributes(layer);
    layerAttributes.layerType = 'AVLayer';

    /** @todo Handle track matte */
    /** @todo Handle source */
    const source = layer.source;

    const adjustmentLayer = getModifiedValue(layer.adjustmentLayer, false);
    const audioEnabled = getModifiedValue(layer.audioEnabled, true);
    const autoOrient = getModifiedValue(layer.autoOrient, AutoOrientType.NO_AUTO_ORIENT);
    const blendingMode = getModifiedValue(layer.blendingMode, BlendingMode.NORMAL);
    const collapseTransformation = getModifiedValue(layer.collapseTransformation, false);
    const effectsActive = getModifiedValue(layer.effectsActive, true);
    const environmentLayer = getModifiedValue(layer.environmentLayer, false);
    const frameBlending = getModifiedValue(layer.frameBlending, false);
    const frameBlendingType = frameBlending ? getModifiedValue(layer.frameBlendingType, FrameBlendingType.NO_FRAME_BLEND) : undefined;
    const guideLayer = getModifiedValue(layer.guideLayer, false);
    const motionBlur = getModifiedValue(layer.motionBlur, false);
    const preserveTransparency = getModifiedValue(layer.preserveTransparency, false);
    const quality = getModifiedValue(layer.quality, LayerQuality.BEST);
    const samplingQuality = getModifiedValue(layer.samplingQuality, LayerSamplingQuality.BILINEAR);
    const threeDLayer = getModifiedValue(layer.threeDLayer, false);
    const timeRemapEnabled = getModifiedValue(layer.timeRemapEnabled, false);
    const trackMatteType = getModifiedValue(layer.trackMatteType, TrackMatteType.NO_TRACK_MATTE);

    return {
        ...layerAttributes,

        adjustmentLayer,
        audioEnabled,
        autoOrient,
        blendingMode,
        collapseTransformation,
        effectsActive,
        environmentLayer,
        frameBlending,
        frameBlendingType,
        guideLayer,
        motionBlur,
        preserveTransparency,
        quality,
        samplingQuality,
        threeDLayer,
        timeRemapEnabled,
        trackMatteType,
    };
}

function _getLightLayerAttributes(layer: LightLayer): AexLightLayerAttributes {
    const layerAttributes = _getLayerAttributes(layer);
    layerAttributes.layerType = 'LightLayer';
    layerAttributes.hasVideo = getModifiedValue(layer.hasVideo, false);

    const lightType = layer.lightType;
    return {
        ...layerAttributes,
        lightType,
    };
}

function _getTextLayerAttributes(layer: TextLayer): AexTextLayerAttributes {
    const layerAttributes = _getLayerAttributes(layer);
    layerAttributes.layerType = 'TextLayer';

    const threeDPerChar = layer.threeDLayer ? getModifiedValue(layer.threeDPerChar, false) : undefined;
    return {
        ...layerAttributes,
        threeDPerChar,
    };
}

function _getTransform(layer: Layer): AexTransform {
    const transformGroup = layer.transform;

    const anchorPoint = getModifiedProperty(transformGroup.anchorPoint);
    const position = getModifiedProperty(transformGroup.position);
    const scale = getModifiedProperty(transformGroup.scale);
    let rotation = getModifiedProperty(transformGroup.rotation);
    const opacity = getModifiedProperty(transformGroup.opacity);

    let pointOfInterest;
    let orientation;
    let xRotation;
    let yRotation;

    // zlovatt: What does this if condition convey?
    if (aeq.isCamera(layer) || aeq.isLight(layer) || (aeq.isAVLayer(layer) && layer.threeDLayer)) {
        pointOfInterest = getModifiedProperty(transformGroup.pointOfInterest);
        orientation = getModifiedProperty(transformGroup.orientation);
        xRotation = getModifiedProperty(transformGroup.xRotation);
        yRotation = getModifiedProperty(transformGroup.yRotation);
        rotation = getModifiedProperty(transformGroup.zRotation);
    }

    return {
        anchorPoint,
        position,
        scale,
        rotation,
        opacity,
        pointOfInterest,
        orientation,
        xRotation,
        yRotation,
    };
}
