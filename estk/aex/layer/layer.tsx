function getAexLayer(layer: Layer, state: AexState): AexLayer & AexObject {
    state.stats.layerCount++;

    if (aeq.isTextLayer(layer)) {
        return getTextLayer(layer, state);
    } else if (aeq.isShapeLayer(layer)) {
        return getShapeLayer(layer, state);
    } else if (isNullLayer(layer)) {
        return getNullLayer(layer, state);
    } else if (isFootageLayer(layer)) {
        return getFootageLayer(layer, state);
    } else if (aeq.isLightLayer(layer)) {
        return getLightLayer(layer, state);
    } else if (aeq.isCameraLayer(layer)) {
        return getCameraLayer(layer, state);
    } else {
        throw new Error(`Unrecognized Layer Type`);
    }
}

function createLayer(comp: CompItem, aexLayer: AexLayer, state: AexState) {
    state.stats.layerCount++;

    let layer;

    switch (aexLayer.type) {
        case AEX_FOOTAGE_LAYER:
        case AEX_SHAPE_LAYER:
        case AEX_TEXT_LAYER:
        case AEX_CAMERA_LAYER:
            layer = createCameraLayer(comp, aexLayer as AexCameraLayer, state);
            break;
        case AEX_LIGHT_LAYER:
            layer = createLightLayer(comp, aexLayer as AexLightLayer, state);
            break;
        case AEX_NULL_LAYER:
            layer = createNullLayer(comp, aexLayer as AexNullLayer, state);
            break;
        default:
            throw new Error(`Unrecognized Layer Type ${aexLayer.type}`);
    }

    _setLayerAttributes(layer, aexLayer, state);
}

function getLayerAttributes(layer: Layer, state: AexState): AexLayerBase {
    const containingComp = layer.containingComp;

    const { name, label } = layer;

    const comment = getModifiedValue(layer.comment, '');
    const hasVideo = getModifiedValue(layer.hasVideo, true);
    const inPoint = getModifiedValue(layer.inPoint, 0);
    const outPoint = getModifiedValue(layer.outPoint, containingComp.duration);
    const startTime = getModifiedValue(layer.startTime, 0);
    const stretch = getModifiedValue(layer.stretch, 100);
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
        shy,
        solo,
        parentLayerIndex,
        markers: _getAexLayerMarkers(layer),
        transform: _getTransform(layer, state),
    };
}

function _setLayerAttributes(layer: Layer, aexLayer: AexLayer, state: AexState): void {
    assignAttributes(layer, {
        name: aexLayer.name,
        label: aexLayer.label,
        comment: aexLayer.comment,
        hasVideo: aexLayer.hasVideo,
        inPoint: aexLayer.inPoint,
        outPoint: aexLayer.outPoint,
        startTime: aexLayer.startTime,
        stretch: aexLayer.stretch,
        shy: aexLayer.shy,
        solo: aexLayer.solo,
        parentLayerIndex: aexLayer.parentLayerIndex,
    });

    _createLayerMarkers(layer, aexLayer.markers, state);
    _setTransform(layer, aexLayer.transform, state);
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
    const rotation = _getZRotation(layer, transformGroup, state);

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

function _setTransform(layer: Layer, aexTransform: AexTransform, state: AexState): void {
    aeq.forEach(aexTransform, (xformPropertyName) => {
        const layerTransformProperty = layer[xformPropertyName];
        const aexTransformProperty = aexTransform[xformPropertyName];

        setProperty(layerTransformProperty, aexTransformProperty, state);
    });
}

/**
 * For 3d layers (or camera/lights), we want to use the zRotation property
 * for 'rotation' instead of the standard 'rotation' property.
 *
 * AVLayers have a .threeDLayer member, but Camera & Light do not-- hence this check
 */
function _getZRotation(layer: Layer, transformGroup: _TransformGroup, state: AexState) {
    if (aeq.isCamera(layer) || aeq.isLight(layer) || (aeq.isAVLayer(layer) && layer.threeDLayer)) {
        return getModifiedProperty(transformGroup.zRotation, state);
    } else {
        return getModifiedProperty(transformGroup.rotation, state);
    }
}

function _getAexLayerMarkers(layer: Layer) {
    return getAexMarkerProperties(layer.marker);
}

function _createLayerMarkers(layer: Layer, aexMarkers: AexMarkerProperty[], state: AexState) {
    createMarkers(layer.marker, aexMarkers, state);
}
