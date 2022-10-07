function create(aeParentObject: Project, aexObject: AexItem | AexComp);
function create(aeParentObject: CompItem, aexObject: AexLayer);
function create(aeParentObject: Layer, aexObject: AexProperty);
function create(aeParentObject: PropertyGroup, aexObject: AexSerializedGroup);
function create(aeParentObject: Property, aexObject: AexKey);
function create(aeParentObject: Serializable, aexObject: Deserializable) {
    assertIsDefined(aeParentObject, 'aeParentObject');
    assertIsDefined(aexObject, 'aexObject');

    const state: AexState = {
        prescanOptions: null,
        getOptions: null,
        updateOptions: {
            markerMatchBy: 'index',
            layerMatchBy: 'index',
            projectItemMismatchBehavior: 'create',
        },
        footageToCreate: aeq.arrayEx(),
        footageIdMap: {},
        stats: {
            nonCompItemCount: 0,
            compCount: 0,
            layerCount: 0,
            propertyCount: 0,
            keyCount: 0,
        },
        profile: {},
    };

    if (isGetResult(aexObject)) {
        const getResult = aexObject as GetResult<AexSerialized>;

        aexObject = getResult.object;
        state.footageToCreate = aeq.arrayEx(getResult.footage.items.concat(getResult.footage.comps));
    }

    if (isAddingCompToProject(aeParentObject, aexObject)) {
        undoGroup('AEX: Add Comp to Project', () => {
            createAeComp(aexObject as AexComp, state);
        });
    } else if (isAddingNonCompItemToProject(aeParentObject, aexObject)) {
        undoGroup('AEX: Add Item to Project', () => {
            createAeItem(aexObject as AexItem, state);
        });
    } else if (isAddingMarkerToComp(aeParentObject, aexObject)) {
        undoGroup('AEX: Add Marker to Comp', () => {
            const markerProperty = (aeParentObject as CompItem).markerProperty;
            createAeMarker(markerProperty as MarkerValueProperty, aexObject as AexMarkerProperty, state);
        });
    } else if (isAddingLayerToComp(aeParentObject, aexObject)) {
        undoGroup('AEX: Add Layer(s) to Comp', () => {
            if (aeq.isArray(aexObject)) {
                aeq.arrayEx(aexObject).forEach((layer) => createAeLayer(aeParentObject as CompItem, layer, state));
            } else {
                createAeLayer(aeParentObject as CompItem, aexObject as AexLayer, state);
            }
        });
    } else if (isAddingPropertyGroupToLayer(aeParentObject, aexObject)) {
        undoGroup('AEX: Add Property Group to Layer', () => {
            addToAeLayer(aeParentObject as Layer, aexObject as AexSerializedGroup, state);
        });
    } else if (isAddingMarkerToLayer(aeParentObject, aexObject)) {
        undoGroup('AEX: Add Marker to Layer', () => {
            const markerProperty = (aeParentObject as Layer).marker;
            createAeMarker(markerProperty as MarkerValueProperty, aexObject as AexMarkerProperty, state);
        });
    } else if (isAddingKeyToProperty(aeParentObject, aexObject)) {
        undoGroup('AEX: Add Keys to Property', () => {
            _setPropertyKeys(aeParentObject as Property, [aexObject] as AexKey[], state);
        });
    } else if (isAddingPropertyToLayer(aeParentObject, aexObject)) {
        throw notImplemented(`Creating a '${aexObject.type}' under a '${getDebugStringForAeType(aeParentObject)}'`);
    } else {
        throw notSupported(`Creating a '${aexObject.type}' under a '${getDebugStringForAeType(aeParentObject)}'`);
    }

    const { stats } = state;

    return {
        stats,
    };
}

function isAddingCompToProject(aeParentObject: Serializable, aexObject: Deserializable): aexObject is AexComp {
    return aeParentObject instanceof Project && !aeq.isArray(aexObject) && aexObject.type === AEX_COMP_ITEM;
}

function isAddingNonCompItemToProject(aeParentObject: Serializable, aexObject: Deserializable): aexObject is AexItem {
    return (
        aeParentObject instanceof Project && !aeq.isArray(aexObject) && aexObject.type !== AEX_COMP_ITEM && aexObject.type.indexOf('aex:item') === 0
    );
}

function isAddingLayerToComp(aeParentObject: Serializable, aexObject: Deserializable): aexObject is AexLayer | AexLayer[] {
    return aeParentObject instanceof CompItem && isAexLayerOrAexLayerArray(aexObject);
}

function isAexLayerOrAexLayerArray(aexObject: Deserializable): aexObject is AexLayer | AexLayer[] {
    if (aeq.isArray(aexObject)) {
        return aeq.arrayEx(aexObject).every(isAexLayer);
    } else {
        return isAexLayer(aexObject as AexObject);
    }
}

function isAddingPropertyGroupToLayer(aeParentObject: Serializable, aexObject: Deserializable): aexObject is AexSerializedGroup {
    return aeq.isLayer(aeParentObject) && isAexSerializedGroup(aexObject as AexObject);
}

function isAddingPropertyToLayer(aeParentObject: Serializable, aexObject: Deserializable): aexObject is AexProperty {
    return aeq.isLayer(aeParentObject) && isAexProperty(aexObject as AexObject);
}

function isAddingMarkerToLayer(aeParentObject: Serializable, aexObject: Deserializable): aexObject is AexMarkerProperty {
    return aeq.isLayer(aeParentObject) && isAexMarker(aexObject as AexObject);
}

function isAddingMarkerToComp(aeParentObject: Serializable, aexObject: Deserializable): aexObject is AexMarkerProperty {
    return aeq.isComp(aeParentObject) && isAexMarker(aexObject as AexObject);
}

function isAddingKeyToProperty(aeParentObject: Serializable, aexObject: Deserializable): aexObject is AexKey {
    return aeq.isProperty(aeParentObject) && isAexKey(aexObject as AexObject);
}
