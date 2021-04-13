function _getFootageLayer(layer: AVLayer, state: AexState): AexFootageLayer {
    const layerAttributes = _getAVLayer(layer, state);
    const source = generateItemUID(layer.source);
    const trackers = _getTrackers(layer, state);

    return {
        ...layerAttributes,
        type: AEX_FOOTAGE_LAYER,

        source,
        trackers,
    };
}

function _getTrackers(layer: AVLayer, state: AexState) {
    const trackers = layer.property('ADBE MTrackers') as PropertyGroup;

    return _getUnnestedPropertyGroup(trackers, null, state);
}
