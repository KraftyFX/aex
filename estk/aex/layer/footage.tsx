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
    // const layer = comp.layers.add();
    // _setAVLayerAttributes(layer, aexFootageLayer, state);
    /**
     * @todo
     *
     * - source
     * - trackers
     */
}

function _getTrackers(layer: AVLayer, state: AexState) {
    const trackers = layer.property('ADBE MTrackers') as PropertyGroup;

    return getUnnestedPropertyGroup(trackers, null, state);
}

function _getFootageSource(layer: AVLayer): AexFootageSource {
    const source = layer.source as AVItem;

    let type: AexAvItemType;

    if (aeq.isComp(source)) {
        type = AEX_COMP_ITEM;
    } else {
        const mainSource = (source as FootageItem).mainSource;

        if (sourceIsFile(mainSource)) {
            type = AEX_FILE_FOOTAGE_ITEM;
        } else if (sourceIsSolid(mainSource)) {
            type = AEX_SOLID_ITEM;
        } else if (sourceIsPlaceholder(mainSource)) {
            type = AEX_PLACEHOLDER_ITEM;
        }
    }

    return {
        id: generateItemUID(layer.source),
        type,
    };
}
