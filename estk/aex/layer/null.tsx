function getAexNullLayer(layer: AVLayer, state: AexState): AexNullLayer {
    const layerAttributes = getAexFootageLayer(layer, state);

    return {
        ...layerAttributes,
        type: AEX_NULL_LAYER,
    };
}

function createAeNullLayer(comp: CompItem, aexNullLayer: AexNullLayer, state: AexState) {
    const layer = comp.layers.addNull();
    _setAVLayerAttributes(layer, aexNullLayer, state);
    return layer;
}
