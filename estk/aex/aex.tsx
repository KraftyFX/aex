function aex() {
    return {
        toObject(item: Serializable, options: AexOptions): AexProject {
            const state: AexState = { options, log: [] };
            state.options = state.options || { unspportedPropertyBehavior: 'skip' };

            assertIsDefined(item, 'item');

            if (isProject(item)) {
                return getAexProject(item as Project, state);
            } else if (aeq.isComp(item)) {
                return {
                    type: AEX_PROJECT,
                    items: [],
                    comps: [getAexComp(item as CompItem, state)],
                };
            } else if (aeq.isLayer(item)) {
                return {
                    type: AEX_PROJECT,
                    items: [],
                    comps: [
                        {
                            layers: [getAexLayer(item as Layer, state)],
                        } as AexComp,
                    ],
                };
            } else {
                return {
                    type: AEX_PROJECT,
                    items: [],
                    comps: [],
                };
            }
        },
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

function aeToAex(aeObj: Project, options: AexOptions): AexProject;
function aeToAex(aeObj: CompItem, options: AexOptions): AexComp;
function aeToAex(aeObj: Layer, options: AexOptions): AexLayer;
function aeToAex(aeObj: Serializable, options: AexOptions): AexSerialized {
    assertIsDefined(aeObj, 'item');

    const state: AexState = { options, log: [] };

    // TODO: Cover array/collection types.
    if (isProject(aeObj)) {
        return getAexProject(aeObj as Project, state);
    } else if (aeq.isComp(aeObj)) {
        return getAexComp(aeObj as CompItem, state);
    } else if (aeq.isLayer(aeObj)) {
        return getAexLayer(aeObj as Layer, state);
    } else {
        throw new Error(`Unrecognized item type`);
    }
}

function aexToAe(aexObj: AexSerialized, options: {}): void {
    throw new Error(`Not yet implemented`);
}
