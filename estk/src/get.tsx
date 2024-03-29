function get(aeObject: Project, options?: GetOptions): GetResult<AexProject>;
function get(aeObject: CompItem, options?: GetOptions): GetResult<AexComp>;
function get(aeObject: Layer | Layer[], options?: GetOptions): GetResult<AexLayer>;
function get(aeObject: Serializable, options?: GetOptions): GetResult<AexSerialized> {
    assertIsDefined(aeObject, 'aeObject');

    const state: AexState = {
        prescanOptions: null,
        getOptions: {
            unspportedPropertyBehavior: 'skip',
        },
        createOptions: null,
        footageSources: aeq.arrayEx([]),
        updateOptions: null,
        stats: {
            nonCompItemCount: 0,
            compCount: 0,
            layerCount: 0,
            propertyCount: 0,
            keyCount: 0,
        },
        profile: {},
    };

    assignAttributes(state.getOptions, options || {});

    let object: AexSerialized;

    if (isProject(aeObject)) {
        object = getAexProject(aeObject as Project, state);
    } else if (aeq.isComp(aeObject)) {
        object = getAexComp(aeObject as CompItem, state);
    } else if (isLayerOrLayerArray(aeObject)) {
        if (aeq.isArray(aeObject)) {
            object = aeq.arrayEx(aeObject).map((layer) => getAexLayer(layer, state));
        } else {
            object = getAexLayer(aeObject, state);
        }
    } else {
        throw notSupported(`Getting a '${getDebugStringForAeType(aeObject)}'`);
    }

    const footageSources = state.footageSources;
    const aexComps: AexComp[] = [];
    const aexItems: AexItem[] = [];

    while (footageSources.length > 0) {
        const aexItem = getAexItem(footageSources.shift(), state);

        if (aexItem.type === AEX_COMP_ITEM) {
            aexComps.push(aexItem as AexComp);
        } else {
            aexItems.push(aexItem);
        }
    }

    return prune<GetResult>({
        schema: 1.0,
        aeversion: 0.0, // TODO(zlovatt): Get this value
        type: 'aex:getresult',
        object,
        footage: {
            comps: aexComps,
            items: aexItems,
        },
        stats: state.stats,
    });
}

function isLayerOrLayerArray(aeObject: Serializable | Layer[]): aeObject is Layer | Layer[] {
    if (aeq.isArray(aeObject)) {
        return aeq.arrayEx(aeObject).every(aeq.isLayer);
    } else {
        return aeq.isLayer(aeObject);
    }
}

function isGetResult(aexObject: Deserializable): aexObject is GetResult<AexSerialized> {
    return !aeq.isArray(aexObject) && aexObject.type == 'aex:getresult';
}
