function getNullLayer(layer: AVLayer, state: AexState): AexNullLayer {
    const layerAttributes = getFootageLayer(layer, state);

    return {
        ...layerAttributes,
        type: AEX_NULL_LAYER,
    };
}

function createNullLayer(comp: CompItem, aexNullLayer: AexNullLayer, state: AexState) {
    const layer = comp.layers.addNull();
    _setAVLayerAttributes(layer, aexNullLayer, state);
}
