function getAexLayer(layer: Layer, state: AexState): AexLayer & AexObject {
    state.stats.layerCount++;

    if (aeq.isTextLayer(layer)) {
        return _getTextLayer(layer, state);
    } else if (aeq.isShapeLayer(layer)) {
        return _getShapeLayer(layer, state);
    } else if (aeq.isAVLayer(layer)) {
        return _getAVLayer(layer, state);
    } else if (aeq.isLightLayer(layer)) {
        return _getLightLayer(layer, state);
    } else if (aeq.isCameraLayer(layer)) {
        return _getCameraLayer(layer, state);
    } else {
        throw new Error(`Unrecognized Layer Type`);
    }
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

function _getFlatPropertyGroup(propertyGroup: PropertyGroup, state: AexState): AexPropertyGroup[] {
    const result = [];

    forEachPropertyInGroup(propertyGroup, (childPropertyGroup: PropertyGroup) => {
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
        const propertyData = getPropertyGroup(childPropertyGroup, state);
        const properties = propertyData ? propertyData.properties : undefined;

        const { name, matchName } = childPropertyGroup;
        const enabled = getModifiedValue(childPropertyGroup.enabled, true);
        const aexGroup: AexPropertyGroup = {
            name,
            matchName,
            enabled,

            properties,
        };

        if (childPropertyGroup.matchName === 'ADBE Vector Group') {
            const vectorsGroup = childPropertyGroup.property('ADBE Vectors Group') as PropertyGroup;

            aexGroup.contents = _getFlatPropertyGroup(vectorsGroup, state);
        }

        result.push(aexGroup);
    });

    return result;
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

function _getLayer(layer: Layer, state: AexState): AexLayer {
    const containingComp = layer.containingComp;

    const { name, label } = layer;

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
        transform: _getTransform(layer, state),

        // Gets set by derived classes
    };
}

function _getAVLayer(layer: AVLayer, state: AexState): AexAVLayer {
    const layerAttributes = _getLayer(layer, state);

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
    const isTrackMatte = getModifiedValue(layer.isTrackMatte, false);
    const trackMatteType = getModifiedValue(layer.trackMatteType, TrackMatteType.NO_TRACK_MATTE);

    const audio = getPropertyGroup(layer.audio, state);
    const timeRemap = getModifiedProperty(layer.timeRemap, state);
    const effects = _getFlatPropertyGroup(layer.effect, state);
    const materialOption = getPropertyGroup(layer.materialOption, state);
    const geometryOption = getPropertyGroup(layer.geometryOption, state);

    const layerStyles = getBoundModifiedValue(layer.layerStyle.canSetEnabled, () => _getLayerStyles(layer.layerStyle, state), undefined);

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

function _getLightLayer(layer: LightLayer, state: AexState): AexLightLayer {
    const layerAttributes = _getLayer(layer, state);
    layerAttributes.hasVideo = getModifiedValue(layer.hasVideo, false);
    const lightType = layer.lightType;

    return {
        ...layerAttributes,
        type: AEX_LIGHT_LAYER,
        lightType,
        lightOption: getPropertyGroup(layer.lightOption, state),
    };
}

function _getCameraLayer(layer: CameraLayer, state: AexState): AexCameraLayer {
    const layerAttributes = _getLayer(layer, state);
    layerAttributes.hasVideo = getModifiedValue(layer.hasVideo, false);

    return {
        ...layerAttributes,
        type: AEX_CAMERA_LAYER,
        cameraOption: getPropertyGroup(layer.cameraOption, state),
    };
}

function _getShapeLayer(layer: ShapeLayer, state: AexState): AexShapeLayer {
    const avLayerAttributes = _getAVLayer(layer, state);
    const contents = layer.property('ADBE Root Vectors Group') as PropertyGroup;

    return {
        ...avLayerAttributes,
        type: AEX_SHAPE_LAYER,
        contents: _getFlatPropertyGroup(contents, state),
    };
}

function _getTextLayer(layer: TextLayer, state: AexState): AexTextLayer {
    const avLayerAttributes = _getAVLayer(layer, state);
    const threeDPerChar = getBoundModifiedValue(layer.threeDLayer, () => layer.threeDPerChar, false);
    const text = layer.text;
    const animators = text.property('ADBE Text Animators') as PropertyGroup;

    return {
        ...avLayerAttributes,
        type: AEX_TEXT_LAYER,
        threeDPerChar,
        sourceText: getModifiedProperty(text.sourceText, state),
        pathOption: getPropertyGroup(text.pathOption, state),
        moreOption: getPropertyGroup(text.moreOption, state),
        animators: getPropertyGroup(animators, state),
    };
}

function _getNullLayer(layer: Layer, state: AexState): AexNullLayer {
    const layerAttributes = _getLayer(layer, state);

    return {
        ...layerAttributes,
        type: AEX_NULL_LAYER,
    };
}

function _getTransform(layer: Layer, state: AexState): AexTransform {
    const transformGroup = layer.transform;

    const anchorPoint = getModifiedProperty(transformGroup.anchorPoint, state);
    const position = getModifiedProperty(transformGroup.position, state);
    const scale = getModifiedProperty(transformGroup.scale, state);
    const opacity = getModifiedProperty(transformGroup.opacity, state);

    // 3d & Camera properties
    const pointOfInterest = getModifiedProperty(transformGroup.pointOfInterest, state);
    const orientation = getModifiedProperty(transformGroup.orientation, state);
    const xRotation = getModifiedProperty(transformGroup.xRotation, state);
    const yRotation = getModifiedProperty(transformGroup.yRotation, state);
    const rotation = getZRotation(layer, transformGroup, state);

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
function getZRotation(layer: Layer, transformGroup: _TransformGroup, state: AexState) {
    if (aeq.isCamera(layer) || aeq.isLight(layer) || (aeq.isAVLayer(layer) && layer.threeDLayer)) {
        return getModifiedProperty(transformGroup.zRotation, state);
    } else {
        return getModifiedProperty(transformGroup.rotation, state);
    }
}
