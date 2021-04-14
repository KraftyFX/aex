function getNullLayer(layer: AVLayer, state: AexState): AexNullLayer {
    const layerAttributes = getFootageLayer(layer, state);

    return {
        ...layerAttributes,
        type: AEX_NULL_LAYER,
    };
}
