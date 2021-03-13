function aex(options: AexOptions) {
    return {
        toObject(item: Serializable): AexProject {
            assertIsDefined(item, 'item');

            if (isProject(item)) {
                return getAexProject(options);
            } else if (aeq.isComp(item)) {
                return {
                    items: [],
                    comps: [getAexComp(item as CompItem, options)],
                };
            } else if (aeq.isLayer(item)) {
                return {
                    items: [],
                    comps: [
                        {
                            layers: [getAexLayer(item as Layer, options)],
                        },
                    ],
                };
            } else {
                return {
                    items: [],
                    comps: [],
                };
            }
        },
    };
}
