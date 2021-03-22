function aex(options: AexOptions) {
    return {
        toObject(item: Serializable): AexProject {
            assertIsDefined(item, 'item');

            if (isProject(item)) {
                return getAexProject(item as Project, options);
            } else if (aeq.isComp(item)) {
                return {
                    type: AEX_PROJECT,
                    items: [],
                    comps: [getAexComp(item as CompItem, options)],
                };
            } else if (aeq.isLayer(item)) {
                return {
                    type: AEX_PROJECT,
                    items: [],
                    comps: [
                        {
                            layers: [getAexLayer(item as Layer, options)],
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

// Experimental
function aeToAex(item: Project, options: AexOptions): AexProject;
function aeToAex(item: CompItem, options: AexOptions): AexComp;
function aeToAex(item: Layer, options: AexOptions): AexLayer;
function aeToAex(item: Serializable, options: AexOptions): AexSerialized {
    assertIsDefined(item, 'item');

    // TODO: Cover array/collection types.
    if (isProject(item)) {
        return getAexProject(item as Project, options);
    } else if (aeq.isComp(item)) {
        return getAexComp(item as CompItem, options);
    } else if (aeq.isLayer(item)) {
        return getAexLayer(item as Layer, options);
    } else {
        throw new Error(`Unrecognized item type`);
    }
}

function aexToAe(o: AexSerialized, options: {}): void {
    throw new Error(`Not yet implemented`);
}
