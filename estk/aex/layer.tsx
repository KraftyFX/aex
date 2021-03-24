function getAexLayer(layer: Layer, options: AexOptions): AexLayer {
    if (aeq.isTextLayer(layer)) {
        return _getTextLayer(layer);
    } else if (aeq.isShapeLayer(layer)) {
        return _getShapeLayer(layer);
    } else if (aeq.isAVLayer(layer)) {
        return _getAVLayer(layer);
    } else if (aeq.isLightLayer(layer)) {
        return _getLightLayer(layer);
    } else if (aeq.isCameraLayer(layer)) {
        return _getCameraLayer(layer);
    } else {
        throw new Error(`Unrecognized Layer Type`);
    }
}

function _getLayerStyles(styleGroup: PropertyGroup) {
    const styles = {
        name: styleGroup.name,
        matchName: styleGroup.matchName,
        enabled: styleGroup.enabled,
        properties: [],
    };

    if (!styleGroup.canSetEnabled) {
        return styles;
    }

    forEachPropertyInGroup(styleGroup, (property: Property<any> | PropertyGroup, ii) => {
        const { name, matchName, enabled, canSetEnabled } = property;

        /**
         * Voodoo: We always want to parse the first property in this group
         *   (it's a general property that affects all the others)
         *
         * After that, however, layer styles only really exist in the aep if
         * 'canSetEnabled' is true.
         */
        if (ii > 1 && !canSetEnabled) {
            return;
        }

        const propertyData = getPropertyGroup(property as PropertyGroup);
        const properties = propertyData ? propertyData.properties : undefined;

        styles.properties.push({
            name,
            matchName,
            enabled,

            properties,
        });
    });

    return styles;
}

function _getEffects(layer: TextLayer | ShapeLayer): AexPropertyGroup[] {
    const effects = [];

    forEachPropertyInGroup(layer.effect, (effect) => {
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

        const { name, matchName, enabled } = effect;

        effects.push({
            name,
            matchName,
            enabled,

            properties,
        });
    });

    return effects;
}

function _getAexLayerMasks(layer: Layer): AexPropertyGroup[] {
    const masks = [];

    if (!isVisibleLayer(layer)) {
        return masks;
    }

    forEachPropertyInGroup<MaskPropertyGroup>(layer.mask, (mask) => {
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
    });

    return masks;
}

function _getLayer(layer: Layer): AexLayer {
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
        markers: getAexMarkerProperties(layer.marker),
        transform: _getTransform(layer),
        masks: _getAexLayerMasks(layer),

        // Gets set by derived classes
        timeRemap: undefined,
        effects: undefined,
        audio: undefined,
        layerStyles: undefined,
        materialOption: undefined,
        geometryOption: undefined,
    };
}

function _getAVLayer(layer: AVLayer): AexAVLayer {
    const layerAttributes = _getLayer(layer);

    /** @todo Handle track matte */
    /** @todo Handle source */
    const source = generateItemUID(layer.source);

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
    const trackMatteType = getModifiedValue(layer.trackMatteType, TrackMatteType.NO_TRACK_MATTE);

    const audio = getPropertyGroup(layer.audio);
    const timeRemap = getModifiedProperty(layer.timeRemap);
    const materialOption = getPropertyGroup(layer.materialOption);
    const geometryOption = getPropertyGroup(layer.geometryOption);
    const effects = _getEffects(layer);

    let layerStyles;
    if (layer.layerStyle.canSetEnabled) {
        layerStyles = _getLayerStyles(layer.layerStyle);
    }

    return {
        ...layerAttributes,
        type: AEX_AV_LAYER,

        source,

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
        trackMatteType,

        timeRemap,
        effects,
        audio,
        layerStyles,
        materialOption,
        geometryOption,
    };
}

function _getLightLayer(layer: LightLayer): AexLightLayer {
    const layerAttributes = _getLayer(layer);
    layerAttributes.hasVideo = getModifiedValue(layer.hasVideo, false);
    const lightType = layer.lightType;

    return {
        ...layerAttributes,
        type: AEX_LIGHT_LAYER,
        lightType,
        lightOption: getPropertyGroup(layer.lightOption),
    };
}

function _getCameraLayer(layer: CameraLayer): AexCameraLayer {
    const layerAttributes = _getLayer(layer);
    layerAttributes.hasVideo = getModifiedValue(layer.hasVideo, false);

    return {
        ...layerAttributes,
        type: AEX_CAMERA_LAYER,
        cameraOption: getPropertyGroup(layer.cameraOption),
    };
}

function _getShapeLayer(layer: ShapeLayer): AexShapeLayer {
    const avLayerAttributes = _getAVLayer(layer);

    return {
        ...avLayerAttributes,
        type: AEX_SHAPE_LAYER,
    };
}

function _getTextLayer(layer: TextLayer): AexTextLayer {
    const avLayerAttributes = _getAVLayer(layer);
    const threeDPerChar = layer.threeDLayer ? getModifiedValue(layer.threeDPerChar, false) : undefined;
    const text = layer.text;
    const animators = text.property('ADBE Text Animators') as PropertyGroup;

    return {
        ...avLayerAttributes,
        type: AEX_TEXT_LAYER,
        threeDPerChar,
        sourceText: getModifiedProperty(text.sourceText, getTextDocumentProperties),
        pathOption: getPropertyGroup(text.pathOption),
        moreOption: getPropertyGroup(text.moreOption),
        animators: getPropertyGroup(animators),
    };
}

function _getNullLayer(layer: Layer): AexNullLayer {
    const layerAttributes = _getLayer(layer);

    return {
        ...layerAttributes,
        type: AEX_NULL_LAYER,
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
