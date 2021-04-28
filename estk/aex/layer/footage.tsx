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

    let sourceItem = getItemFromSource(aexSource);

    if (!sourceItem) {
        if (aexSource.type === AEX_COMP_ITEM) {
            sourceItem = _createAeComp(undefined, state);
            comp.openInViewer();
        } else {
            sourceItem = _createAeFootageItem(
                {
                    type: aexSource.type,
                } as AexFootageItem,
                state
            );
        }
    }

    const layer = comp.layers.add(sourceItem);
    _setAVLayerAttributes(layer, aexFootageLayer, state);
    return layer;
}

function _getFootageSource(layer: AVLayer): AexFootageSource {
    const source = layer.source as AVItem;

    let type = getItemType(source) as AexAvItemType;

    return {
        id: generateItemUID(layer.source),
        type,
    };
}

function _getTrackers(layer: AVLayer, state: AexState): AexPropertyGroup[] {
    const trackers = layer.property('ADBE MTrackers') as PropertyGroup;

    const fillProperties = (propertyGroup: PropertyGroup, aexPropertyGroup: AexPropertyGroup) => {
        aexPropertyGroup.properties = getPropertyGroup(propertyGroup, state)?.properties;
    };

    return getTopLevelPropertyGroups(trackers, fillProperties);
}
