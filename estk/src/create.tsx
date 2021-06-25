function create(aeParentObject: Project, aexObject: AexItem | AexComp);
function create(aeParentObject: CompItem, aexObject: AexLayer);
function create(aeParentObject: Layer, aexObject: AexProperty);
function create(aeParentObject: PropertyGroup, aexObject: AexTypedGroup);
function create(aeParentObject: Property, aexObject: AexKey);
function create(aeParentObject: Serializable, aexObject: AexSerialized | AexTypedGroup | AexProperty | AexKey | GetResult<AexSerialized>) {
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
        log: [],
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
        app.beginUndoGroup('AEX: Add Comp to Project');
        try {
            createAeComp(aexObject, state);
        } catch (e) {
            throw e;
        } finally {
            app.endUndoGroup();
        }
    } else if (isAddingNonCompItemToProject(aeParentObject, aexObject)) {
        throw notImplemented(`Creating a '${aexObject.type}' under a '${getDebugStringForAeType(aeParentObject)}'`);
    } else if (isAddingLayerToComp(aeParentObject, aexObject)) {
        app.beginUndoGroup('AEX: Add Layer to Comp');
        try {
            createAeLayer(aeParentObject as CompItem, aexObject, state);
        } catch (e) {
            throw e;
        } finally {
            app.endUndoGroup();
        }
    } else if (isAddingPropertyGroupToLayer(aeParentObject, aexObject)) {
        app.beginUndoGroup('AEX: Add Property Group to Layer');
        try {
            addToAeLayer(aeParentObject as Layer, aexObject, state);
        } catch (e) {
            throw e;
        } finally {
            app.endUndoGroup();
        }
    } else if (isAddingKeyToProperty(aeParentObject, aexObject)) {
        app.beginUndoGroup('AEX: Add Keys to Property');
        try {
            _setPropertyKeys(aeParentObject as Property, [aexObject] as AexKey[], state);
        } catch (e) {
            throw e;
        } finally {
            app.endUndoGroup();
        }
    } else if (isAddingPropertyToLayer(aeParentObject, aexObject)) {
        throw notImplemented(`Creating a '${aexObject.type}' under a '${getDebugStringForAeType(aeParentObject)}'`);
    } else {
        throw notSupported(`Creating a '${aexObject.type}' under a '${getDebugStringForAeType(aeParentObject)}'`);
    }

    const { stats, log } = state;

    return {
        stats,
        log,
    };
}

function isAddingCompToProject(
    aeParentObject: Serializable,
    aexObject: AexSerialized | AexTypedGroup | AexProperty | AexKey | GetResult<AexSerialized>
): aexObject is AexComp {
    return aeParentObject instanceof Project && !aeq.isArray(aexObject) && aexObject.type === AEX_COMP_ITEM;
}

function isAddingNonCompItemToProject(
    aeParentObject: Serializable,
    aexObject: AexSerialized | AexTypedGroup | AexProperty | AexKey | GetResult<AexSerialized>
): aexObject is AexItem {
    return (
        aeParentObject instanceof Project && !aeq.isArray(aexObject) && aexObject.type !== AEX_COMP_ITEM && aexObject.type.indexOf('aex:item') === 0
    );
}

function isAddingLayerToComp(
    aeParentObject: Serializable,
    aexObject: AexSerialized | AexTypedGroup | AexProperty | AexKey | GetResult<AexSerialized>
): aexObject is AexLayer {
    return aeParentObject instanceof CompItem && isAexLayer(aexObject as AexObject);
}

function isAddingPropertyGroupToLayer(
    aeParentObject: Serializable,
    aexObject: AexSerialized | AexTypedGroup | AexProperty | AexKey | GetResult<AexSerialized>
): aexObject is AexTypedGroup {
    return aeq.isLayer(aeParentObject) && isAexTypedGroup(aexObject as AexObject);
}

function isAddingPropertyToLayer(
    aeParentObject: Serializable,
    aexObject: AexSerialized | AexTypedGroup | AexProperty | AexKey | GetResult<AexSerialized>
): aexObject is AexProperty {
    return aeq.isLayer(aeParentObject) && isAexProperty(aexObject as AexObject);
}

function isAddingKeyToProperty(
    aeParentObject: Serializable,
    aexObject: AexSerialized | AexTypedGroup | AexProperty | AexKey | GetResult<AexSerialized>
): aexObject is AexKey {
    return aeq.isProperty(aeParentObject) && isAexKey(aexObject as AexObject);
}
