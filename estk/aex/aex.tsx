function aex() {
    return {
        benchmark,
        prescan,
        get,
        update,
        create,
    };
}

interface AexPrescanOptions {}

interface AexPrescanResult {
    aeObject: Serializable;
    estimatedTotal: number;
}

function prescan(aeObject: Serializable, options: AexOptions): AexPrescanResult {
    return {
        aeObject,
        estimatedTotal: 0,
    };
}

interface ToAexResult<T extends AexSerialized> {
    object: T;
    log: AexLogEntry[];
}

function benchmark(options: any) {
    options.callback(true);

    // aex().get(app.project as Project, {} as any);
}

function get(aeObj: Project, options: AexOptions): void;
function get(aeObj: CompItem, options: AexOptions): ToAexResult<AexComp>;
function get(aeObj: Layer, options: AexOptions): ToAexResult<AexLayer>;
function get(aeObj: Serializable, options: AexOptions): ToAexResult<AexSerialized> {
    assertIsDefined(aeObj, 'aeObj');

    const state: AexState = {
        options,
        toAeOptions: null,
        log: [],
        stats: { nonCompItemCount: 0, compCount: 0, layerCount: 0, propertyCount: 0, keyCount: 0 },
    };

    // TODO: Make a helper function to deal with this
    state.options = state.options || { unspportedPropertyBehavior: 'skip' };
    state.options.unspportedPropertyBehavior = state.options.unspportedPropertyBehavior || 'skip';

    let object: AexSerialized;

    // TODO: Cover collection types.
    if (isProject(aeObj)) {
        object = getAexProject(aeObj as Project, state);
    } else if (aeq.isComp(aeObj)) {
        object = getAexComp(aeObj as CompItem, state);
    } else if (aeq.isLayer(aeObj)) {
        object = getAexLayer(aeObj as Layer, state);
    } else {
        throw new Error(`Unrecognized item type`);
    }

    return {
        object,
        log: state.log,
    };
}

function create(aeParentObject: Project | CompItem | Layer, aexObject: AexItem | AexComp | AexLayer | AexProperty) {
    const state: AexState = {
        options: null,
        toAeOptions: {
            markerMatchBy: 'index',
            layerMatchBy: 'index',
        },
        log: [],
        stats: { nonCompItemCount: 0, compCount: 0, layerCount: 0, propertyCount: 0, keyCount: 0 },
    };

    if (isAddingCompToProject(aeParentObject, aexObject)) {
        app.beginUndoGroup('AEX: Add Comp to Project');
        createAeComp(aexObject as AexComp, state);
        app.endUndoGroup();
    } else if (isAddingNonCompItemToProject(aeParentObject, aexObject)) {
        throw new Error(`TODO: Add Item to Project`);
    } else if (isAddingLayerToComp(aeParentObject, aexObject)) {
        app.beginUndoGroup('AEX: Add Layer to Comp');
        createAeLayer(aeParentObject as CompItem, aexObject as AexLayer, state);
        app.endUndoGroup();
    } else if (isAddingPropertyToLayer(aeParentObject, aexObject)) {
        throw new Error(`TODO: Add Property to Layer`);
    } else {
        throw new Error(`Creating a '${aexObject.type}' under a '${getDebugStringForAeType(aeParentObject)}' is not supported.`);
    }
}

function isAddingCompToProject(aeParentObject: Project | CompItem | Layer, aexObject: AexItem | AexLayer | AexProperty<any>) {
    return aeParentObject instanceof Project && aexObject.type === AEX_COMP_ITEM;
}

function isAddingNonCompItemToProject(aeParentObject: Project | CompItem | Layer, aexObject: AexItem | AexLayer | AexProperty<any>) {
    return aeParentObject instanceof Project && aexObject.type !== AEX_COMP_ITEM && aexObject.type.indexOf('aex:item') === 0;
}

function isAddingLayerToComp(aeParentObject: Project | CompItem | Layer, aexObject: AexItem | AexLayer | AexProperty<any>) {
    return aeParentObject instanceof CompItem && isAexLayer(aexObject as AexObject);
}

function isAddingPropertyToLayer(aeParentObject: Project | CompItem | Layer, aexObject: AexItem | AexLayer | AexProperty<any>) {
    return aeParentObject instanceof Layer && aexObject.type.indexOf('aex:property') === 0;
}

function update(aeObject: Project | CompItem | Layer, aexObject: AexProject | AexComp | AexLayer) {
    const state: AexState = {
        options: null,
        toAeOptions: {
            markerMatchBy: 'index',
            layerMatchBy: 'index',
        },
        log: [],
        stats: { nonCompItemCount: 0, compCount: 0, layerCount: 0, propertyCount: 0, keyCount: 0 },
    };

    _update(aeObject, aexObject, state);
}

function _update(aeObject: Project | CompItem | Layer, aexObject: AexProject | AexComp | AexLayer, state: AexState) {
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
