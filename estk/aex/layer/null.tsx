function prescanNullLayer(aeNullLayer: Layer, state: AexState) {
    state.stats.layerCount++;

    prescanFootageLayer(aeNullLayer as AVLayer, state);
}

function getAexNullLayer(aeAvLayer: AVLayer, state: AexState): AexNullLayer {
    const layerAttributes = getAexFootageLayer(aeAvLayer, state);

    state.stats.layerCount++;

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

function updateAexNullLayer(aeNullLayer: AVLayer, aexNullLayer: AexNullLayer, state: AexState) {
    throw new Error(`TODO: Zack. Should this even exist?`);
}
