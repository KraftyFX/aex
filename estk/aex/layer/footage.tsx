function getFootageLayer(layer: AVLayer, state: AexState): AexFootageLayer {
    const layerAttributes = getAVLayer(layer, state);

    return {
        ...layerAttributes,
        type: AEX_FOOTAGE_LAYER,

        source: generateItemUID(layer.source),
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

    const fillProperties = (propertyGroup: PropertyGroup, aexPropertyGroup: AexPropertyGroup) => {
        aexPropertyGroup.properties = getPropertyGroup(propertyGroup, state)?.properties;
    };

    return getTopLevelPropertyGroups(trackers, fillProperties);
}
