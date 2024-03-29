function prescan(aeObject: Serializable, options?: PrescanOptions): PrescanResult {
    assertIsDefined(aeObject, 'aeObject');

    const state: AexState = {
        prescanOptions: options,
        getOptions: null,
        createOptions: null,
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

    if (isProject(aeObject)) {
        prescanProject(aeObject as Project, state);
    } else if (aeq.isComp(aeObject)) {
        prescanComp(aeObject as CompItem, state);
    } else if (aeq.isLayer(aeObject)) {
        prescanLayer(aeObject as Layer, state);
    } else {
        throw notSupported(`Prescanning a '${getDebugStringForAeType(aeObject)}'`);
    }

    const { stats } = state;

    return {
        stats,
    };
}
