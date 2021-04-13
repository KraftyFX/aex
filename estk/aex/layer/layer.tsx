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

function getLayer(layer: Layer, state: AexState): AexLayer {
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
        markers: getAexMarkerProperties(layer.marker),
        transform: _getTransform(layer, state),
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
