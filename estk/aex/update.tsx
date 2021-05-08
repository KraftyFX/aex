function update(aeObject: Project, aexObject: AexProject, options?: UpdateOptions): UpdateResult;
function update(aeObject: CompItem, aexObject: AexComp, options?: UpdateOptions): UpdateResult;
function update(aeObject: Layer, aexObject: AexLayer, options?: UpdateOptions): UpdateResult;
function update(aeObject: Project | CompItem | Layer, aexObject: AexProject | AexComp | AexLayer, options?: UpdateOptions): UpdateResult {
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
        updateAeProject(aeObject as Project, aexObject as AexProject, state);
        app.endUndoGroup();
    } else if (isUpdatingComp(aeObject, aexObject)) {
        app.beginUndoGroup('AEX: Update Comp');
        updateAeComp(aeObject as CompItem, aexObject as AexComp, state);
        app.endUndoGroup();
    } else if (isUpdatingNonCompItem(aeObject, aexObject)) {
        throw new Error(`TODO: Add Item to Project`);
    } else if (isUpdatingLayer(aeObject, aexObject)) {
        app.beginUndoGroup('AEX: Update Layer');
        updateAeLayer(aeObject as Layer, aexObject as AexLayer, state);
        app.endUndoGroup();
    } else if (isUpdatingProperty(aeObject, aexObject)) {
        throw new Error(`TODO: Add Item to Project`);
    } else {
        throw new Error(`Updating a '${getDebugStringForAeType(aeObject)}' from a '${aexObject.type}' is not supported.`);
    }

    const { stats, log } = state;

    return {
        stats,
        log,
    };
}

function isUpdatingProject(aeObject: Project | CompItem | Layer, aexObject: AexProject | AexComp | AexLayer) {
    return aeObject instanceof Project && aexObject.type === AEX_PROJECT;
}

function isUpdatingComp(aeObject: Project | CompItem | Layer, aexObject: AexComp | AexLayer | AexProject) {
    return aeObject instanceof CompItem && aexObject.type === AEX_COMP_ITEM;
}

function isUpdatingNonCompItem(aeObject: Project | CompItem | Layer, aexObject: AexComp | AexLayer | AexProject) {
    return (
        aeObject instanceof Item && !(aeObject instanceof CompItem) && aexObject.type !== AEX_COMP_ITEM && aexObject.type.indexOf('aex:item') === 0
    );
}

function isUpdatingLayer(aeObject: Project | CompItem | Layer, aexObject: AexComp | AexLayer | AexProject) {
    return aeq.isLayer(aeObject) && isAexLayer(aexObject);
}

function isUpdatingProperty(aeObject: Project | CompItem | Layer, aexObject: AexComp | AexLayer | AexProject) {
    return aeObject instanceof PropertyBase && isAexLayer(aexObject as AexObject);
}
