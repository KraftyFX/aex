function getAexLayer(layer: Layer, state: AexState): AexLayer {
    state.stats.layerCount++;

    if (aeq.isTextLayer(layer)) {
        return getAexTextLayer(layer, state);
    } else if (aeq.isShapeLayer(layer)) {
        return getAexShapeLayer(layer, state);
    } else if (isNullLayer(layer)) {
        return getAexNullLayer(layer, state);
    } else if (isFootageLayer(layer)) {
        return getAexFootageLayer(layer, state);
    } else if (aeq.isLightLayer(layer)) {
        return getAexLightLayer(layer, state);
    } else if (aeq.isCameraLayer(layer)) {
        return getAexCameraLayer(layer, state);
    } else {
        throw new Error(`Unrecognized Layer Type`);
    }
}

function createAeLayer(comp: CompItem, aexLayer: AexLayer, state: AexState) {
    assertIsDefined(comp);

    state.stats.layerCount++;

    switch (aexLayer.type) {
        case AEX_FOOTAGE_LAYER:
            return createAeFootageLayer(comp, aexLayer as AexFootageLayer, state);
        case AEX_SHAPE_LAYER:
            return createAeShapeLayer(comp, aexLayer as AexShapeLayer, state);
        case AEX_LIGHT_LAYER:
            return createAeLightLayer(comp, aexLayer as AexLightLayer, state);
        case AEX_CAMERA_LAYER:
            return createAeCameraLayer(comp, aexLayer as AexCameraLayer, state);
        case AEX_NULL_LAYER:
            return createAeNullLayer(comp, aexLayer as AexNullLayer, state);
        case AEX_TEXT_LAYER:
            return createAeTextLayer(comp, aexLayer as AexTextLayer, state);
        default:
            throw new Error(`Unrecognized Layer Type ${aexLayer.type}`);
    }
}

function updateAeLayer(aeLayer: Layer, aexLayer: AexLayer, state: AexState) {
    // Go through all the different layer types, create setters for them
    // and call it here just like in the getAexLayer function
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

        markers: _getAexLayerMarkers(layer),
        transform: getAexTransform(layer, state),
    };
}

function _getAexLayerMarkers(aeLayer: Layer) {
    return getAexMarkerProperties(aeLayer.marker);
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
