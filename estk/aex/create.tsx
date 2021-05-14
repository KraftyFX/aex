function create(aeParentObject: Project, aexObject: AexItem | AexComp);
function create(aeParentObject: CompItem, aexObject: AexLayer);
function create(aeParentObject: Layer, aexObject: AexProperty);
function create(aeParentObject: Serializable, aexObject: AexSerialized | AexProperty | GetResult<AexSerialized>) {
    assertIsDefined(aeParentObject, 'aeParentObject');
    assertIsDefined(aexObject, 'aexObject');

    const state: AexState = {
        prescanOptions: null,
        getOptions: null,
        updateOptions: {
            markerMatchBy: 'index',
            layerMatchBy: 'index',
        },
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
        state.footageIdMap = {};
    }

    if (isAddingCompToProject(aeParentObject, aexObject)) {
        app.beginUndoGroup('AEX: Add Comp to Project');
        createAeComp(aexObject, state);
        app.endUndoGroup();
    } else if (isAddingNonCompItemToProject(aeParentObject, aexObject)) {
        throw new Error(`TODO: Add Item to Project`);
    } else if (isAddingLayerToComp(aeParentObject, aexObject)) {
        app.beginUndoGroup('AEX: Add Layer to Comp');
        createAeLayer(aeParentObject as CompItem, aexObject, state);
        app.endUndoGroup();
    } else if (isAddingPropertyToLayer(aeParentObject, aexObject)) {
        throw new Error(`TODO: Add Property to Layer`);
    } else {
        throw new Error(`Creating a '${aexObject.type}' under a '${getDebugStringForAeType(aeParentObject)}' is not supported.`);
    }

    const { stats, log } = state;

    return {
        stats,
        log,
    };
}

function isAddingCompToProject(
    aeParentObject: Serializable,
    aexObject: AexSerialized | AexProperty | GetResult<AexSerialized>
): aexObject is AexComp {
    return aeParentObject instanceof Project && aexObject.type === AEX_COMP_ITEM;
}

function isAddingNonCompItemToProject(
    aeParentObject: Serializable,
    aexObject: AexSerialized | AexProperty | GetResult<AexSerialized>
): aexObject is AexItem {
    return aeParentObject instanceof Project && aexObject.type !== AEX_COMP_ITEM && aexObject.type.indexOf('aex:item') === 0;
}

function isAddingLayerToComp(aeParentObject: Serializable, aexObject: AexSerialized | AexProperty | GetResult<AexSerialized>): aexObject is AexLayer {
    return aeParentObject instanceof CompItem && isAexLayer(aexObject as AexObject);
}

function isAddingPropertyToLayer(
    aeParentObject: Serializable,
    aexObject: AexSerialized | AexProperty | GetResult<AexSerialized>
): aexObject is AexProperty {
    return aeParentObject instanceof Layer && aexObject.type.indexOf('aex:property') === 0;
}
