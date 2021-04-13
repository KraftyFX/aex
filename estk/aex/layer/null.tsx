function _getNullLayer(layer: AVLayer, state: AexState): AexNullLayer {
    const layerAttributes = _getFootageLayer(layer, state);
    const nullLayer = getModifiedValue(layer.nullLayer, false);

    return {
        ...layerAttributes,
        type: AEX_NULL_LAYER,

        nullLayer,
    };
}
