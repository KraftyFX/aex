function getFootageLayer(layer: AVLayer, state: AexState): AexFootageLayer {
    const layerAttributes = getAVLayer(layer, state);

    return {
        ...layerAttributes,
        type: AEX_FOOTAGE_LAYER,

        source: _getFootageSource(layer),
    };
}

function createFootageLayer(comp: CompItem, aexFootageLayer: AexFootageLayer, state: AexState) {
    const aexSource = aexFootageLayer.source;

    let sourceItem = getItemFromSource(aexSource);

    if (!sourceItem) {
        if (aexSource.type === AEX_COMP_ITEM) {
            sourceItem = _createAEComp(undefined, state);
            comp.openInViewer();
        } else {
            sourceItem = _createFootageItem(
                {
                    type: aexSource.type,
                } as AexFootageItem,
                state
            );
        }
    }

    const layer = comp.layers.add(sourceItem);
    _setAVLayerAttributes(layer, aexFootageLayer, state);

    /**
     * @todo
     *
     * - source
     */
}

function _getFootageSource(layer: AVLayer): AexFootageSource {
    const source = layer.source as AVItem;

    let type = getItemType(source) as AexAvItemType;

    return {
        id: generateItemUID(layer.source),
        type,
    };
}
