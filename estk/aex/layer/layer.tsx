function prescanLayer(aeLayer: Layer, state: AexState) {
    prescanMarkerProperties(aeLayer.marker, state);
    prescanTransform(aeLayer, state);

    if (aeq.isTextLayer(aeLayer)) {
        return prescanTextLayer(aeLayer, state);
    } else if (aeq.isShapeLayer(aeLayer)) {
        return prescanShapeLayer(aeLayer, state);
    } else if (isNullLayer(aeLayer)) {
        return prescanNullLayer(aeLayer, state);
    } else if (isFootageLayer(aeLayer)) {
        return prescanFootageLayer(aeLayer, state);
    } else if (aeq.isLightLayer(aeLayer)) {
        return prescanLightLayer(aeLayer, state);
    } else if (aeq.isCameraLayer(aeLayer)) {
        return prescanCameraLayer(aeLayer, state);
    } else {
        throw new Error(`Unrecognized Layer Type`);
    }
}

function getAexLayer(aeLayer: Layer, state: AexState): AexLayer {
    return profile(
        'getAexLayer',
        () => {
            if (aeq.isTextLayer(aeLayer)) {
                return getAexTextLayer(aeLayer, state);
            } else if (aeq.isShapeLayer(aeLayer)) {
                return getAexShapeLayer(aeLayer, state);
            } else if (isNullLayer(aeLayer)) {
                return getAexNullLayer(aeLayer, state);
            } else if (isFootageLayer(aeLayer)) {
                return getAexFootageLayer(aeLayer, state);
            } else if (aeq.isLightLayer(aeLayer)) {
                return getAexLightLayer(aeLayer, state);
            } else if (aeq.isCameraLayer(aeLayer)) {
                return getAexCameraLayer(aeLayer, state);
            } else {
                throw new Error(`Unrecognized Layer Type`);
            }
        },
        state,
        aeLayer.name
    );
}

function createAeLayer(comp: CompItem, aexLayer: AexLayer, state: AexState) {
    assertIsDefined(comp);

    switch (aexLayer.type) {
        case AEX_TEXT_LAYER:
            return createAeTextLayer(comp, aexLayer as AexTextLayer, state);
        case AEX_SHAPE_LAYER:
            return createAeShapeLayer(comp, aexLayer as AexShapeLayer, state);
        case AEX_NULL_LAYER:
            return createAeNullLayer(comp, aexLayer as AexNullLayer, state);
        case AEX_FOOTAGE_LAYER:
            return createAeFootageLayer(comp, aexLayer as AexFootageLayer, state);
        case AEX_LIGHT_LAYER:
            return createAeLightLayer(comp, aexLayer as AexLightLayer, state);
        case AEX_CAMERA_LAYER:
            return createAeCameraLayer(comp, aexLayer as AexCameraLayer, state);
        default:
            throw new Error(`Unrecognized Layer Type ${aexLayer.type}`);
    }
}

function updateAeLayer(aeLayer: Layer, aexLayer: AexLayer, state: AexState) {
    // Go through all the different layer types, create setters for them
    // and call it here just like in the getAexLayer function. For each
    // update function make sure to count the stats and double check that
    // it's not being double counted during created.

    throw new Error(`TODO: Zack`);
}

function getLayerAttributes(layer: Layer, state: AexState): AexLayerBase {
    const containingComp = layer.containingComp;
    const { name, label } = layer;

    return {
        name,
        label,

        comment: getModifiedValue(layer.comment, ''),
        hasVideo: getModifiedValue(layer.hasVideo, true),
        inPoint: getModifiedValue(layer.inPoint, 0),
        outPoint: getModifiedValue(layer.outPoint, containingComp.duration),
        startTime: getModifiedValue(layer.startTime, 0),
        shy: getModifiedValue(layer.shy, false),
        solo: getModifiedValue(layer.solo, false),
        stretch: getModifiedValue(layer.stretch, 100),
        parentLayerIndex: layer.parent ? layer.parent.index : undefined,

        markers: getAexMarkerProperties(layer.marker, state),
        transform: getAexTransform(layer, state),
    };
}

function setLayerAttributes(aeLayer: Layer, aexLayer: AexLayer, state: AexState): void {
    assignAttributes(aeLayer, {
        name: aexLayer.name,
        label: aexLayer.label,
        comment: aexLayer.comment,
        hasVideo: aexLayer.hasVideo,
        inPoint: aexLayer.inPoint,
        outPoint: aexLayer.outPoint,
        startTime: aexLayer.startTime,
        shy: aexLayer.shy,
        solo: aexLayer.solo,
    });

    _setLayerParent(aeLayer, aexLayer, state);
    _setLayerMarkers(aeLayer, aexLayer, state);
    updateLayerTransform(aeLayer, aexLayer.transform, state);
}

function _setLayerParent(aeLayer: Layer, aexLayer: AexLayer, state: AexState) {
    if (aeq.isNullOrUndefined(aexLayer.parentLayerIndex)) {
        return;
    }

    const parentIndex = aexLayer.parentLayerIndex;
    const comp = aeLayer.containingComp;

    if (comp.numLayers < parentIndex) {
        throw new Error(`Can't set parent to layer ${parentIndex}; comp only has ${comp.numLayers} layer(s).`);
    }

    if (aeLayer.index === parentIndex) {
        throw new Error(`Can't set layer parent to self.`);
    }

    aeLayer.parent = comp.layer(parentIndex);
}

function _setLayerMarkers(aeLayer: Layer, aexLayer: AexLayer, state: AexState) {
    if (aeq.isNullOrUndefined(aexLayer.markers)) {
        return;
    }

    updateAeMarkers(aeLayer.marker, aexLayer.markers, state);
}
