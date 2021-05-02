function getAexNullLayer(aeAvLayer: AVLayer, state: AexState): AexNullLayer {
    const layerAttributes = getAexFootageLayer(aeAvLayer, state);

    return {
        ...layerAttributes,
        type: AEX_NULL_LAYER,
    };
}

function createAeNullLayer(aeComp: CompItem, aexNullLayer: AexNullLayer, state: AexState) {
    const aeNullLayer = aeComp.layers.addNull();
    _setAvLayerAttributes(aeNullLayer, aexNullLayer, state);
    return aeNullLayer;
}
