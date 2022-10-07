function update(aeObject: Project, aexObject: AexProject, options?: UpdateOptions): UpdateResult;
function update(aeObject: CompItem, aexObject: AexComp, options?: UpdateOptions): UpdateResult;
function update(aeObject: Layer, aexObject: AexLayer, options?: UpdateOptions): UpdateResult;
function update(aeObject: PropertyGroup, aexObject: AexSerializedGroup, options?: UpdateOptions): UpdateResult;
function update(aeObject: Serializable, aexObject: AexSerialized | GetResult<AexSerialized>, options?: UpdateOptions): UpdateResult {
    assertIsDefined(aeObject, 'aeObject');
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

    assignAttributes(state.updateOptions, options);

    if (isUpdatingProject(aeObject, aexObject)) {
        undoGroup('AEX: Update Project', () => {
            updateAeProject(aeObject, aexObject as AexProject, state);
        });
    } else if (isUpdatingComp(aeObject, aexObject)) {
        undoGroup('AEX: Update Comp', () => {
            updateAeComp(aeObject, aexObject as AexComp, state);
        });
    } else if (isUpdatingLayer(aeObject, aexObject)) {
        undoGroup('AEX: Update Layer', () => {
            if (aeq.isArray(aeObject)) {
                throw notSupported(`Updating arrays of layers is not supported. Update using a comp instead.`);
            }

            updateAeLayer(aeObject as Layer, aexObject as AexLayer, state);
        });
    } else if (isUpdatingPropertyGroup(aeObject, aexObject)) {
        undoGroup('AEX: Update Property Group', () => {
            updatePropertyGroup(aeObject, aexObject as AexSerializedGroup, state);
        });
    } else {
        throw notSupported(`Updating a '${getDebugStringForAeType(aeObject)}' from a '${aexObject.type}'`);
    }

    const { stats } = state;

    return {
        stats,
    };
}

function isUpdatingProject(aeObject: Serializable, aexObject: AexSerialized | GetResult<AexSerialized>): aeObject is Project {
    return aeObject instanceof Project && !aeq.isArray(aexObject) && aexObject.type === AEX_PROJECT;
}

function isUpdatingComp(aeObject: Serializable, aexObject: AexSerialized | GetResult<AexSerialized>): aeObject is CompItem {
    return aeObject instanceof CompItem && !aeq.isArray(aexObject) && aexObject.type === AEX_COMP_ITEM;
}

function isUpdatingLayer(aeObject: Serializable, aexObject: AexSerialized | GetResult<AexSerialized>): aexObject is AexLayer | AexLayer[] {
    return isLayerOrLayerArray(aeObject) && isAexLayerOrAexLayerArray(aexObject);
}

function isUpdatingPropertyGroup(aeObject: Serializable, aexObject: AexSerialized | GetResult<AexSerialized>): aeObject is PropertyGroup {
    return aeq.isPropertyGroup(aeObject) && !aeq.isArray(aexObject) && isAexSerializedGroup(aexObject as AexObject);
}
