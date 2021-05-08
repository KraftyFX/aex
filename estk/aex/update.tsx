function update(aeObject: Project, aexObject: AexProject, options?: UpdateOptions): UpdateResult;
function update(aeObject: CompItem, aexObject: AexComp, options?: UpdateOptions): UpdateResult;
function update(aeObject: Layer, aexObject: AexLayer, options?: UpdateOptions): UpdateResult;
function update(aeObject: Serializable, aexObject: AexSerialized, options?: UpdateOptions): UpdateResult {
    assertIsDefined(aeObject, 'aeObject');
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

    assignAttributes(state.updateOptions, options);

    if (isUpdatingProject(aeObject, aexObject)) {
        app.beginUndoGroup('AEX: Update Project');
        updateAeProject(aeObject, aexObject as AexProject, state);
        app.endUndoGroup();
    } else if (isUpdatingComp(aeObject, aexObject)) {
        app.beginUndoGroup('AEX: Update Comp');
        updateAeComp(aeObject, aexObject as AexComp, state);
        app.endUndoGroup();
    } else if (isUpdatingLayer(aeObject, aexObject)) {
        app.beginUndoGroup('AEX: Update Layer');
        updateAeLayer(aeObject, aexObject as AexLayer, state);
        app.endUndoGroup();
    } else {
        throw new Error(`Updating a '${getDebugStringForAeType(aeObject)}' from a '${aexObject.type}' is not supported.`);
    }

    const { stats, log } = state;

    return {
        stats,
        log,
    };
}

function isUpdatingProject(aeObject: Serializable, aexObject: AexSerialized): aeObject is Project {
    return aeObject instanceof Project && aexObject.type === AEX_PROJECT;
}

function isUpdatingComp(aeObject: Serializable, aexObject: AexSerialized): aeObject is CompItem {
    return aeObject instanceof CompItem && aexObject.type === AEX_COMP_ITEM;
}

function isUpdatingLayer(aeObject: Serializable, aexObject: AexSerialized): aeObject is Layer {
    return aeq.isLayer(aeObject) && isAexLayer(aexObject);
}
