function getNullLayer(layer: AVLayer, state: AexState): AexNullLayer {
    const layerAttributes = getFootageLayer(layer, state);
    const nullLayer = getModifiedValue(layer.nullLayer, false);

    return {
        ...layerAttributes,
        type: AEX_NULL_LAYER,

        nullLayer,
    };
}
