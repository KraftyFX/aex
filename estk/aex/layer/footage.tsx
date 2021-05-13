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
        state.stats.layerCount++;

        // TODO: If comp layer, add to getComps queue

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
        const aexSource = aexFootageLayer.source;

        let sourceItem = tryGetExistingItemFromSource(aexSource);

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
