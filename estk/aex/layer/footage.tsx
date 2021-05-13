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
        trackFootageSource(aeAvLayer, state);

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
        _setAvLayerAttributes(aeNullLayer, aexFootageLayer, state);

        return aeNullLayer;
    } else {
        const sourceItem = _ensureFootageSourceExists(aexFootageLayer, state);

        const aeFootageLayer = aeComp.layers.add(sourceItem);
        _setAvLayerAttributes(aeFootageLayer, aexFootageLayer, state);

        return aeFootageLayer;
    }
}

function _ensureFootageSourceExists(aexFootageLayer: AexFootageLayer, state: AexState) {
    assertFootageSourceDataExists(aexFootageLayer, state);

    const aexSource = aexFootageLayer.source;
    let aeSourceItem = _tryGetAeFootageSource(aexSource, state);

    if (aeq.isNullOrUndefined(aeSourceItem)) {
        if (aexSource.type === AEX_COMP_ITEM) {
            const aexComp = getCompBySourceId(aexSource.id, state);
            aeSourceItem = createAeComp(aexComp, state);
        } else {
            aeSourceItem = createAeFootageItem(
                {
                    type: aexSource.type,
                } as AexFootageItem,
                state
            );
        }

        state.itemIdMap[aexSource.id] = aeSourceItem.id;
    }

    return aeSourceItem;
}

function getCompBySourceId(sourceId: string, state: AexState) {
    const aexComp = state.itemsToCreate.find((c) => c.aexid == sourceId && c.type === AEX_COMP_ITEM);

    if (aeq.isNullOrUndefined(aexComp)) {
        throw new Error(
            `An aex comp with id "${sourceId}" was not found. This  means the original get() call returned a bad result or the result was later corrupted.`
        );
    }

    return aexComp as AexComp;
}

function assertFootageSourceDataExists(aexFootageLayer: AexFootageLayer, state: AexState) {
    if (aeq.isNullOrUndefined(state.itemsToCreate) || aeq.isNullOrUndefined(state.itemIdMap)) {
        const { name, type } = aexFootageLayer;
        throw new Error(`The provided "${type}" layer "${name}" has a source but there isn't data available to deserialize it.`);
    }
}

function _tryGetAeFootageSource(aexFootageSource: AexFootageSource, state: AexState): AVItem {
    const aeItemId = state.itemIdMap[aexFootageSource.id];
    const aexItemType = aexFootageSource.type;

    return aeq.getItems().find(isMatchingFootage) as AVItem;

    function isMatchingFootage(item: Item) {
        return item.id === aeItemId && getAexItemType(item) === aexItemType;
    }
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

function getAexAvFootageLayerType(aeAvLayer: AVLayer): AexFootageLayerType {
    const aeItem = aeAvLayer.source;

    if (aeq.isComp(aeItem)) {
        return AEX_COMP_LAYER;
    } else if (aeq.isFootageItem(aeItem)) {
        const { mainSource } = aeItem;

        if (sourceIsFile(mainSource)) {
            return AEX_FILE_LAYER;
        } else if (sourceIsSolid(mainSource)) {
            if (aeAvLayer.nullLayer) {
                return AEX_NULL_LAYER;
            } else {
                return AEX_SOLID_LAYER;
            }
        } else if (sourceIsPlaceholder(mainSource)) {
            return AEX_PLACEHOLDER_LAYER;
        } else {
            throw new Error(`Unrecognized Footage Layer Type`);
        }
    } else {
        throw new Error(`Unrecognized AVLayer Footage Source Type`);
    }
}
