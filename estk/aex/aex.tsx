function aex(options: AexOptions) {
    return {
        toObject(item: Serializable): AexProject {
            assertIsDefined(item, 'item');

            if (isProject(item)) {
                return visitProject(options);
            } else if (aeq.isComp(item)) {
                return {
                    items: [],
                    comps: [visitComp(item as CompItem, options)],
                };
            } else if (aeq.isLayer(item)) {
                return {
                    items: [],
                    comps: [
                        {
                            layers: [visitLayer(item as Layer, options)],
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
