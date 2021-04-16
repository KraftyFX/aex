function getFootageLayer(layer: AVLayer, state: AexState): AexFootageLayer {
    const layerAttributes = getAVLayer(layer, state);

    return {
        ...layerAttributes,
        type: AEX_FOOTAGE_LAYER,

        source: _getFootageSource(layer),
        trackers: _getTrackers(layer, state),
    };
}

function createFootageLayer(comp: CompItem, aexFootageLayer: AexFootageLayer, state: AexState) {
    const aexSource = aexFootageLayer.source;

    let sourceItem: AVItem;

    if (aexSource.type === AEX_COMP_ITEM) {
        sourceItem = getOrCreateAEComp(aexSource);
    } else {
        sourceItem = getOrCreateFootageItem(aexSource, state);
    }

    const layer = comp.layers.add(sourceItem);
    _setAVLayerAttributes(layer, aexFootageLayer, state);

    /**
     * @todo
     *
     * - trackers
     */
}

function _getTrackers(layer: AVLayer, state: AexState) {
    const trackers = layer.property('ADBE MTrackers') as PropertyGroup;

    return getUnnestedPropertyGroup(trackers, null, state);
}

function _getFootageSource(layer: AVLayer): AexFootageSource {
    const source = layer.source as AVItem;

    let type = getItemType(source) as AexAvItemType;

    return {
        id: generateItemUID(layer.source),
        type,
    };
}
