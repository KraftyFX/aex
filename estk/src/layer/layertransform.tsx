function prescanTransform(layer: Layer, state: AexState) {
    const transformGroup = layer.transform;

    prescanProperty(transformGroup.anchorPoint, state);

    if (layer.position.dimensionsSeparated) {
        prescanProperty(transformGroup.xPosition, state);
        prescanProperty(transformGroup.yPosition, state);
        prescanProperty(transformGroup.zPosition, state);
    } else {
        prescanProperty(transformGroup.position, state);
    }

    prescanProperty(transformGroup.scale, state);
    prescanProperty(transformGroup.opacity, state);

    // 3d & Camera properties
    prescanProperty(transformGroup.pointOfInterest, state);
    prescanProperty(transformGroup.orientation, state);
    prescanProperty(transformGroup.xRotation, state);
    prescanProperty(transformGroup.yRotation, state);

    prescanZRotation(layer, transformGroup, state);
}

function getAexTransform(layer: Layer, state: AexState): AexTransform {
    const transformGroup = layer.transform;

    let position: AexProperty<TwoDPoint> | AexProperty<ThreeDPoint>;
    let xPosition: AexProperty<number>;
    let yPosition: AexProperty<number>;
    let zPosition: AexProperty<number>;

    if (layer.position.dimensionsSeparated) {
        xPosition = getModifiedProperty(transformGroup.xPosition, state);
        yPosition = getModifiedProperty(transformGroup.yPosition, state);
        zPosition = getModifiedProperty(transformGroup.zPosition, state);
    } else {
        position = getModifiedProperty(transformGroup.position, state);
    }

    return {
        anchorPoint: getModifiedProperty(transformGroup.anchorPoint, state),
        scale: getModifiedProperty(transformGroup.scale, state),
        opacity: getModifiedProperty(transformGroup.opacity, state),

        // Position values
        xPosition,
        yPosition,
        zPosition,
        position,

        // 3d & Camera properties
        pointOfInterest: getModifiedProperty(transformGroup.pointOfInterest, state),
        orientation: getModifiedProperty(transformGroup.orientation, state),
        xRotation: getModifiedProperty(transformGroup.xRotation, state),
        yRotation: getModifiedProperty(transformGroup.yRotation, state),
        rotation: _getZRotation(layer, transformGroup, state),
    };
}

function updateLayerTransform(aeLayer: Layer, aexTransform: AexTransform, state: AexState): void {
    if (aeq.isNullOrUndefined(aexTransform)) {
        return;
    }

    aeq.forEach(aexTransform, (xformPropertyName: string) => {
        let layerTransformProperty = aeLayer[xformPropertyName];

        // AE madness: handle cases where the property doesn't exist as a layer shortcut but does in the transform property
        if (!layerTransformProperty) {
            layerTransformProperty = aeLayer.transform[xformPropertyName];
        }

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

function prescanZRotation(layer: Layer, transformGroup: _TransformGroup, state: AexState) {
    if (aeq.isCamera(layer) || aeq.isLight(layer) || (aeq.isAVLayer(layer) && layer.threeDLayer)) {
        prescanProperty(transformGroup.zRotation, state);
    } else {
        prescanProperty(transformGroup.rotation, state);
    }
}
