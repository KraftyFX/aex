function prescan(aeObject: Serializable, options?: PrescanOptions): PrescanResult {
    assertIsDefined(aeObject, 'aeObject');

    const state: AexState = {
        prescanOptions: options,
        getOptions: null,
        updateOptions: null,
        stats: {
            nonCompItemCount: 0,
            compCount: 0,
            layerCount: 0,
            propertyCount: 0,
            keyCount: 0,
        },
        profile: {},
        log: [],
    };

    assignAttributes(state.getOptions, options || {});

    // TODO: Cover collection types.
    if (isProject(aeObject)) {
        prescanProject(aeObject as Project, state);
    } else if (aeq.isComp(aeObject)) {
        prescanComp(aeObject as CompItem, state);
    } else if (aeq.isLayer(aeObject)) {
        prescanLayer(aeObject as Layer, state);
    } else {
        throw notSupported(`Prescanning a '${getDebugStringForAeType(aeObject)}' is not supported.`);
    }

    const { stats, log } = state;

    return {
        stats,
        log,
    };
}
