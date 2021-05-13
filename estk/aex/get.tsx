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
        itemsToSerialize: aeq.arrayEx([]),
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
        throw new Error(`Getting a '${getDebugStringForAeType(aeObject)}' is not supported.`);
    }

    const aeComps = state.itemsToSerialize;
    const aexComps: AexComp[] = [];

    while (aeComps.length > 0) {
        const comp = (aeComps.unshift() as unknown) as CompItem;
        aexComps.push(getAexComp(comp, state));
    }

    return {
        type: 'aex:getresult',
        object,
        items: aexComps,
        stats: state.stats,
        profile: state.profile,
        log: state.log,
    };
}

function trackFootageSource(aeAvLayer: AVLayer, state: AexState) {
    const sourceId = aeAvLayer.source.id;

    if (state.itemsToSerialize.find((item) => item.id === sourceId)) {
        return;
    }

    // Voodoo: The item on the footage source is missing some properties
    // like parentFolder. Instead of tracking and serializing the inline
    // version we'll go back to the original and use that instead.
    //    aeq.getItems().find((item) => item.id === sourceId)
    // const item = aeq.getItems().find((item) => item.id === sourceId);

    state.itemsToSerialize.push(aeAvLayer.source);
}
