function getAexLayer(layer: Layer, options: AexOptions): AexLayer {
    let baseAttributes = {} as AexLayerAttributes;
    let properties = {} as AexProperties | AexTextLayerProperties;

    let audio, timeRemap, layerStyles, materialOption, geometryOption, effects;
    let type: AexObjectType;

    if (aeq.isAVLayer(layer)) {
        if (aeq.isTextLayer(layer)) {
            type = AEX_TEXT_LAYER;
            baseAttributes = _getTextLayerAttributes(layer);
            properties = _getTextLayerProperties(layer);
        } else if (aeq.isShapeLayer(layer)) {
            type = AEX_SHAPE_LAYER;
            baseAttributes = _getShapeLayerAttributes(layer);
        } else {
            throw new Error(`Unrecognized AVLayer Type`);
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
        type = AEX_LIGHT_LAYER;
        baseAttributes = _getLightLayerAttributes(layer);
        properties = _getLightLayerProperties(layer);
    } else if (aeq.isCameraLayer(layer)) {
        type = AEX_CAMERA_LAYER;
        baseAttributes = _getCameraLayerAttributes(layer);
        properties = _getCameraLayerProperties(layer);
    } else {
        throw new Error(`Unrecognized Layer Type`);
    }

    const aexLayer: AexLayer = {
        type,

        ...baseAttributes,
        properties,

        markers: _getAexLayerMarkers(layer),
        transform: _getTransform(layer),
        timeRemap,
        effects,
        masks: _getAexLayerMasks(layer),
        audio,
        layerStyles,
        materialOption,
        geometryOption,
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

function _getEffects(layer: TextLayer | ShapeLayer): AexProperties[] {
    const effectsGroup = layer.effect;
    const effects = [];

    for (let ii = 1, il = effectsGroup.numProperties; ii <= il; ii++) {
        const effect = effectsGroup.property(ii) as PropertyGroup;

        const { name, matchName, enabled } = effect;

        const propertyData = getPropertyGroup(effect);

        /**
         * @todo
         * getPropertyGroup() is set up so that if there's no data, it doesn't return the group at all.
         * This means that if there's a layer effect that has defaults, effects: [] will be empty
         * However, we _always_ want to return the effects if they're present, even if the properties are default.
         *
         * This approach below sucks because we're repeating work.
         * Best would be to still return enabled/matchName/name, with an empty properties array.
         * This could be accomplished by adding an optional parameter to getPropertyGroup for whether to return undefined if empty or not
         * In cases like masks & effects, this would be false. Otherwise true.
         */
        const properties = propertyData ? propertyData.properties : undefined;

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
    let masks = [];

    if (!isVisibleLayer(layer)) {
        return masks;
    }

    let maskGroup = layer.mask;

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

function _getAexLayerMarkers(layer: Layer) {
    return getAexMarkerProperties(layer.marker);
}

function _getLayerAttributes(layer: Layer): AexLayerAttributes {
    const containingComp = layer.containingComp;

    const name = layer.name;
    const label = layer.label;

    const comment = getModifiedValue(layer.comment, '');
    const hasVideo = getModifiedValue(layer.hasVideo, true);
    const inPoint = getModifiedValue(layer.inPoint, 0);
    const outPoint = getModifiedValue(layer.outPoint, containingComp.duration);
    const startTime = getModifiedValue(layer.startTime, 0);
    const stretch = getModifiedValue(layer.stretch, 100);
    const nullLayer = getModifiedValue(layer.nullLayer, false);
    const shy = getModifiedValue(layer.shy, false);
    const solo = getModifiedValue(layer.solo, false);

    const parentLayerIndex = layer.parent ? layer.parent.index : undefined;

    return {
        name,
        label,

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
    layerAttributes.hasVideo = getModifiedValue(layer.hasVideo, false);

    const lightType = layer.lightType;
    return {
        ...layerAttributes,
        lightType,
    };
}

function _getCameraLayerAttributes(layer: CameraLayer): AexLayerAttributes {
    const layerAttributes = _getLayerAttributes(layer);
    layerAttributes.hasVideo = getModifiedValue(layer.hasVideo, false);

    return {
        ...layerAttributes,
    };
}

function _getShapeLayerAttributes(layer: ShapeLayer): AexLayerAttributes {
    const layerAttributes = _getLayerAttributes(layer);

    return {
        ...layerAttributes,
    };
}

function _getTextLayerAttributes(layer: TextLayer): AexTextLayerAttributes {
    const layerAttributes = _getLayerAttributes(layer);

    const threeDPerChar = layer.threeDLayer ? getModifiedValue(layer.threeDPerChar, false) : undefined;
    return {
        ...layerAttributes,
        threeDPerChar,
    };
}

function _getCameraLayerProperties(layer: CameraLayer) {
    return {
        cameraOption: getPropertyGroup(layer.cameraOption),
    };
}

function _getLightLayerProperties(layer: LightLayer) {
    return {
        lightOption: getPropertyGroup(layer.lightOption),
    };
}

function _getTextLayerProperties(layer: TextLayer): AexTextLayerProperties {
    const text = layer.text;
    const animators = text.property('ADBE Text Animators') as PropertyGroup;

    return {
        sourceText: getModifiedProperty(text.sourceText, getTextDocumentProperties),
        pathOption: getPropertyGroup(text.pathOption),
        moreOption: getPropertyGroup(text.moreOption),
        animators: getPropertyGroup(animators),
    };
}

function _getTransform(layer: Layer): AexTransform {
    const transformGroup = layer.transform;

    const anchorPoint = getModifiedProperty(transformGroup.anchorPoint);
    const position = getModifiedProperty(transformGroup.position);
    const scale = getModifiedProperty(transformGroup.scale);
    const opacity = getModifiedProperty(transformGroup.opacity);

    // 3d & Camera properties
    const pointOfInterest = getModifiedProperty(transformGroup.pointOfInterest);
    const orientation = getModifiedProperty(transformGroup.orientation);
    const xRotation = getModifiedProperty(transformGroup.xRotation);
    const yRotation = getModifiedProperty(transformGroup.yRotation);
    const rotation = getZRotation(layer, transformGroup);

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

/**
 * For 3d layers (or camera/lights), we want to use the zRotation property
 * for 'rotation' instead of the standard 'rotation' property.
 *
 * AVLayers have a .threeDLayer member, but Camera & Light do not-- hence this check
 */
function getZRotation(layer: Layer, transformGroup: _TransformGroup) {
    if (aeq.isCamera(layer) || aeq.isLight(layer) || (aeq.isAVLayer(layer) && layer.threeDLayer)) {
        return getModifiedProperty(transformGroup.zRotation);
    } else {
        return getModifiedProperty(transformGroup.rotation);
    }
}
