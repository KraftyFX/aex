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
        case AEX_NULL_LAYER:
        default:
            throw new Error(`Unrecognized Layer Type ${aexLayer.type}`);
    }

    _setLayerAttributes(layer, aexLayer, state);
}

function getLayerAttributes(layer: Layer, state: AexState): AexLayerBase {
    const containingComp = layer.containingComp;

    const { name, label } = layer;

    const parentLayerIndex = layer.parent ? layer.parent.index : undefined;

    return {
        name,
        label,

        comment: getModifiedValue(layer.comment, ''),
        hasVideo: getModifiedValue(layer.hasVideo, true),
        inPoint: getModifiedValue(layer.inPoint, 0),
        outPoint: getModifiedValue(layer.outPoint, containingComp.duration),
        startTime: getModifiedValue(layer.startTime, 0),
        stretch: getModifiedValue(layer.stretch, 100),
        shy: getModifiedValue(layer.shy, false),
        solo: getModifiedValue(layer.solo, false),
        parentLayerIndex,
        markers: _getAexLayerMarkers(layer),
        transform: _getTransform(layer, state),
    };
}

function _setLayerAttributes(layer: Layer, aexLayer: AexLayer, state: AexState): void {
    assignAttributes(layer, {
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

    return {
        anchorPoint: getModifiedProperty(transformGroup.anchorPoint, state),
        position: getModifiedProperty(transformGroup.position, state),
        scale: getModifiedProperty(transformGroup.scale, state),
        opacity: getModifiedProperty(transformGroup.opacity, state),

        // 3d & Camera properties
        pointOfInterest: getModifiedProperty(transformGroup.pointOfInterest, state),
        orientation: getModifiedProperty(transformGroup.orientation, state),
        xRotation: getModifiedProperty(transformGroup.xRotation, state),
        yRotation: getModifiedProperty(transformGroup.yRotation, state),
        rotation: _getZRotation(layer, transformGroup, state),
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
