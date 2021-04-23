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

function _setTransform(layer: Layer, aexTransform: AexTransform, state: AexState): void {
    if (aeq.isNullOrUndefined(aexTransform)) {
        return;
    }

    aeq.forEach(aexTransform, (xformPropertyName: string) => {
        const layerTransformProperty = layer[xformPropertyName];
        const aexTransformProperty = aexTransform[xformPropertyName];

        setProperty(layerTransformProperty, aexTransformProperty, state);
    });
}
