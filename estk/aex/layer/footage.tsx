function prescanFootageLayer(aeAvLayer: AVLayer, state: AexState) {
    state.stats.layerCount++;

    prescanAvLayer(aeAvLayer, state);
    prescanPropertyGroup(_getTrackersProperty(aeAvLayer), state);
}

function getAexFootageLayer(aeAvLayer: AVLayer, state: AexState): AexFootageLayer {
    const layerAttributes = getAvLayer(aeAvLayer, state);

    state.stats.layerCount++;

    return {
        ...layerAttributes,
        type: AEX_FOOTAGE_LAYER,

        source: _getFootageSource(aeAvLayer),
        trackers: _getTrackers(aeAvLayer, state),
    };
}

function createAeFootageLayer(aeComp: CompItem, aexFootageLayer: AexFootageLayer, state: AexState) {
    const aexSource = aexFootageLayer.source;

    let sourceItem = getItemFromSource(aexSource);

    if (!sourceItem) {
        if (aexSource.type === AEX_COMP_ITEM) {
            throw new Error(`TODO: Precomp deserialization`);
            // sourceItem = _createAeComp(undefined, state);
            // comp.openInViewer();
        } else {
            sourceItem = createAeFootageItem(
                {
                    type: aexSource.type,
                } as AexFootageItem,
                state
            );
        }
    }

    const aeFootageLayer = aeComp.layers.add(sourceItem);
    _setAvLayerAttributes(aeFootageLayer, aexFootageLayer, state);

    return aeFootageLayer;
}

function _getFootageSource(aeAvLayer: AVLayer): AexFootageSource {
    const source = aeAvLayer.source as AVItem;

    return {
        id: getItemUid(aeAvLayer.source),
        type: getAexItemType(source) as AexAvItemType,
    };
}

function _getTrackers(aeAvLayer: AVLayer, state: AexState): AexPropertyGroup[] {
    const trackers = _getTrackersProperty(aeAvLayer);

    const fillProperties = (propertyGroup: PropertyGroup, aexPropertyGroup: AexPropertyGroup) => {
        aexPropertyGroup.properties = getPropertyGroup(propertyGroup, state)?.properties;
    };

    return getTopLevelPropertyGroups(trackers, fillProperties, state);
}

function _getTrackersProperty(aeAvLayer: AVLayer) {
    return aeAvLayer.property('ADBE MTrackers') as PropertyGroup;
}
