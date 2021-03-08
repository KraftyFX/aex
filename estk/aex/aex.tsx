function aex(options: AexOptions) {
    return {
        toObject(item: Serializable): AexProject {
            assertIsDefined(item, 'item');

            if (isComp(item)) {
                return {
                    comps: [this.visitComp(item as CompItem)],
                };
            } else if (isLayer(item)) {
                return {
                    comps: [
                        {
                            layers: [this.visitLayer(item as Layer)],
                        },
                    ],
                };
            } else {
                return {
                    comps: [],
                };
            }
        },
        visitComp(comp: CompItem): AexComp {
            return {
                layers: [],
            };
        },
        visitLayer(layer: Layer): AexLayer {
            return {
                props: [],
            };
        },
    };
}
