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

    /** Supports creating a layer without targeting a comp */
    if (aeq.isNullOrUndefined(comp)) {
        comp = _createAEComp(undefined, state);
    }

    switch (aexLayer.type) {
        case AEX_FOOTAGE_LAYER:
            createFootageLayer(comp, aexLayer as AexFootageLayer, state);
            break;
        case AEX_SHAPE_LAYER:
            createShapeLayer(comp, aexLayer as AexShapeLayer, state);
            break;
        case AEX_LIGHT_LAYER:
            createLightLayer(comp, aexLayer as AexLightLayer, state);
            break;
        case AEX_CAMERA_LAYER:
            createCameraLayer(comp, aexLayer as AexCameraLayer, state);
            break;
        case AEX_NULL_LAYER:
            createNullLayer(comp, aexLayer as AexNullLayer, state);
            break;
        case AEX_TEXT_LAYER:
            createTextLayer(comp, aexLayer as AexTextLayer, state);
            break;
        default:
            throw new Error(`Unrecognized Layer Type ${aexLayer.type}`);
    }
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
        shy: aexLayer.shy,
        solo: aexLayer.solo,
    });

    _setLayerParent(aexLayer, layer);
    _createLayerMarkers(layer, aexLayer.markers, state);
    _setTransform(layer, aexLayer.transform, state);
}

function _setLayerParent(aexLayer: AexLayer, layer: Layer) {
    if (aeq.isNullOrUndefined(aexLayer.parentLayerIndex)) {
        return;
    }

    const parentIndex = aexLayer.parentLayerIndex;
    const comp = layer.containingComp;

    if (comp.numLayers < parentIndex) {
        throw new Error(`Can't set parent to layer ${parentIndex}; comp only has ${comp.numLayers} layer(s).`);
    }

    if (layer.index === parentIndex) {
        throw new Error(`Can't set layer parent to self.`);
    }

    layer.parent = comp.layer(parentIndex);
}

function _getAexLayerMarkers(layer: Layer) {
    return getAexMarkerProperties(layer.marker);
}

function _createLayerMarkers(layer: Layer, aexMarkers: AexMarkerProperty[], state: AexState) {
    createMarkers(layer.marker, aexMarkers, state);
}
