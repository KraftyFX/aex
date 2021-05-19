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

function updateAexFootageLayer(aeFootageLayer: AVLayer, aexFootageLayer: AexFootageLayer, state: AexState) {
    throw notImplemented();
}

function _ensureFootageLayerSourceExists(aexFootageLayer: AexFootageLayer, state: AexState) {
    const aexFootageSource = aexFootageLayer.source;

    if (aeq.isNullOrUndefined(aexFootageSource)) {
        const type = getAexLayerSourceType(aexFootageLayer);

        return createAeItem({ type } as AexItem, state) as AVItem;
    } else {
        let aeSourceItem = _tryGetAeFootageSourceItem(aexFootageSource, state);

        if (aeq.isNullOrUndefined(aeSourceItem)) {
            const aexItem = _tryGetAexItemForFootageSource(aexFootageSource, state);
            aeSourceItem = createAeItem(aexItem, state) as AVItem;

            state.footageIdMap[aexFootageSource.id] = aeSourceItem.id;
        }

        return aeSourceItem;
    }
}

function _tryGetAexItemForFootageSource(aexFootageSource: AexFootageSource, state: AexState): AexItem {
    const { id, type } = aexFootageSource;

    const aexItem =
        state.footageToCreate.find(isMatchingAexItem) ||
        ({
            type: aexFootageSource.type,
        } as AexItem);

    return aexItem;

    function isMatchingAexItem(item: AexItem): boolean {
        return item.aexid == id && item.type === type;
    }
}

function _tryGetAeFootageSourceItem(aexFootageSource: AexFootageSource, state: AexState): AVItem | null {
    const aeItemId = state.footageIdMap[aexFootageSource.id];
    const aexItemType = aexFootageSource.type;

    return aeq.getItems().find(isMatchingAeItem) as AVItem;

    function isMatchingAeItem(item: Item) {
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

function getAexLayerSourceType(aexLayer: AexFootageLayer): AexAvItemType {
    switch (aexLayer.type) {
        case AEX_COMP_LAYER:
            return AEX_COMP_ITEM;
        case AEX_SOLID_LAYER:
            return AEX_SOLID_ITEM;
        case AEX_PLACEHOLDER_LAYER:
            return AEX_PLACEHOLDER_ITEM;
        case AEX_NULL_LAYER:
        case AEX_SOLID_LAYER:
            return AEX_SOLID_ITEM;
        case AEX_FILE_LAYER:
            return AEX_FILE_FOOTAGE_ITEM;
        default:
            throw fail(`Unrecognized Layer Type ${aexLayer.type}`);
    }
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
                throw fail(`Unrecognized Footage Layer Type`);
        }
    } else {
        throw fail(`Unrecognized AVLayer Footage Source Type`);
    }
}
