function prescanFootageLayer(aeAvLayer: AVLayer, state: AexState) {
    state.stats.layerCount++;

    prescanAvLayer(aeAvLayer, state);
    prescanPropertyGroup(_getTrackersProperty(aeAvLayer), state);
}

function getAexFootageLayer(aeAvLayer: AVLayer, state: AexState): AexFootageLayer {
    state.stats.layerCount++;

    const type = getAexAvFootageLayerType(aeAvLayer);
    const layerAttributes = getAvLayerAttributes(aeAvLayer, type, state);

    if (type === AEX_NULL_LAYER) {
        return layerAttributes as AexNullLayer;
    } else {
        _trackFootageSource(aeAvLayer, state);

        return {
            ...layerAttributes,

            source: _getFootageSource(aeAvLayer),
            trackers: _getTrackers(aeAvLayer, state),
        };
    }
}

function createAeFootageLayer(aeComp: CompItem, aexFootageLayer: AexFootageLayer, state: AexState) {
    if (aexFootageLayer.type === AEX_NULL_LAYER) {
        const aeNullLayer = aeComp.layers.addNull();
        setAvLayerAttributes(aeNullLayer, aexFootageLayer, state);

        return aeNullLayer;
    } else {
        const sourceItem = _ensureFootageLayerSourceExists(aexFootageLayer, state);

        const aeFootageLayer = aeComp.layers.add(sourceItem);
        setAvLayerAttributes(aeFootageLayer, aexFootageLayer, state);

        return aeFootageLayer;
    }
}

function _ensureFootageLayerSourceExists(aexFootageLayer: AexFootageLayer, state: AexState) {
    assertCanDoFootageSourceLookups(aexFootageLayer, state);

    const aexFootageSource = aexFootageLayer.source;

    let aeSourceItem = _tryGetAeFootageSourceItem(aexFootageSource, state);

    if (aeq.isNullOrUndefined(aeSourceItem)) {
        const aexItem = _getAexItemForFootageSource(aexFootageSource, state);
        aeSourceItem = createAeItem(aexItem, state) as AVItem;

        state.footageIdMap[aexFootageSource.id] = aeSourceItem.id;
    }

    return aeSourceItem;
}

function _getAexItemForFootageSource(aexFootageSource: AexFootageSource, state: AexState): AexFootageItem | AexComp {
    const { id, type } = aexFootageSource;
    const aexItem = state.footageToCreate.find((item) => item.aexid == id && item.type === type);

    if (aeq.isNullOrUndefined(aexItem)) {
        throw new Error(`An item of type "${type}" with id "${id}" was not found for the footage layer.`);
    }

    return aexItem as AexFootageItem | AexComp;
}

function assertCanDoFootageSourceLookups(aexFootageLayer: AexFootageLayer, state: AexState) {
    if (aeq.isNullOrUndefined(state.footageToCreate) || aeq.isNullOrUndefined(state.footageIdMap)) {
        const { name, type } = aexFootageLayer;
        throw new Error(
            `A footage layer of type "${type}" with name "${name}" references a footage source the serialized object does not contain the details for it.`
        );
    }
}

function _tryGetAeFootageSourceItem(aexFootageSource: AexFootageSource, state: AexState): AVItem {
    const aeItemId = state.footageIdMap[aexFootageSource.id];
    const aexItemType = aexFootageSource.type;

    return aeq.getItems().find(isMatchingFootage) as AVItem;

    function isMatchingFootage(item: Item) {
        return item.id === aeItemId && getAexItemType(item) === aexItemType;
    }
}

function _trackFootageSource(aeAvLayer: AVLayer, state: AexState) {
    const { id } = aeAvLayer.source;
    const footageSources = state.footageSources;

    if (footageSources.find((item) => item.id === id)) {
        return;
    }

    footageSources.push(aeAvLayer.source);
}

function _getFootageSource(aeAvLayer: AVLayer): AexFootageSource {
    const source = aeAvLayer.source;

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

function getAexAvFootageLayerType(aeAvLayer: AVLayer): AexFootageLayerType {
    const aeItem = aeAvLayer.source;

    if (aeq.isComp(aeItem)) {
        return AEX_COMP_LAYER;
    } else if (aeq.isFootageItem(aeItem)) {
        switch (getAexFootageItemType(aeItem)) {
            case AEX_FILE_FOOTAGE_ITEM:
                return AEX_FILE_LAYER;
            case AEX_SOLID_ITEM:
                if (aeAvLayer.nullLayer) {
                    return AEX_NULL_LAYER;
                } else {
                    return AEX_SOLID_LAYER;
                }
            case AEX_PLACEHOLDER_ITEM:
                return AEX_PLACEHOLDER_LAYER;
            default:
                throw new Error(`Unrecognized Footage Layer Type`);
        }
    } else {
        throw new Error(`Unrecognized AVLayer Footage Source Type`);
    }
}
