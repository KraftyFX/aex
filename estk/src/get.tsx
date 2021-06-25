function get(aeObject: Project, options?: GetOptions): GetResult<AexProject>;
function get(aeObject: CompItem, options?: GetOptions): GetResult<AexComp>;
function get(aeObject: Layer, options?: GetOptions): GetResult<AexLayer>;
function get(aeObject: Serializable, options?: GetOptions): GetResult<AexSerialized> {
    assertIsDefined(aeObject, 'aeObject');

    const state: AexState = {
        prescanOptions: null,
        getOptions: {
            unspportedPropertyBehavior: 'skip',
        },
        footageSources: aeq.arrayEx([]),
        updateOptions: null,
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

    assignAttributes(state.getOptions, options || {});

    let object: AexSerialized;

    // TODO: Cover collection types.
    if (isProject(aeObject)) {
        object = getAexProject(aeObject as Project, state);
    } else if (aeq.isComp(aeObject)) {
        object = getAexComp(aeObject as CompItem, state);
    } else if (aeq.isLayer(aeObject)) {
        object = getAexLayer(aeObject as Layer, state);
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

    return {
        type: 'aex:getresult',
        object,
        footage: {
            comps: aexComps,
            items: aexItems,
        },
        stats: state.stats,
        profile: state.profile,
        log: state.log,
    };
}

function isGetResult(aexObject: Deserializable): aexObject is GetResult<AexSerialized> {
    return aexObject.type == 'aex:getresult';
}
