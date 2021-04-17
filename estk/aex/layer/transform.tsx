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
    if (aeq.isNullOrUndefined(aexTransform)) {
        return;
    }

    aeq.forEach(aexTransform, (xformPropertyName) => {
        const layerTransformProperty = layer[xformPropertyName];
        const aexTransformProperty = aexTransform[xformPropertyName];

        setProperty(layerTransformProperty, aexTransformProperty, state);
    });
}
