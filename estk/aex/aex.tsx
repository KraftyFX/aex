type Serializable = Project | CompItem | Layer | Property;

interface IAexProject {
    comps: IAexComp[];
}

interface IAexComp {
    layers: IAexLayer[];
}

interface IAexLayer {}

interface IAexOptions {}

function aex(options: IAexOptions) {
    return {
        toObject(item: Serializable | undefined): IAexProject {
            if (isNullOrUndefined(item)) {
                throw new Error(`item is null or undefined`);
            }

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
            }
        },
        visitComp(comp: CompItem): IAexComp {
            return {
                layers: [],
            };
        },
        visitLayer(layer: Layer): IAexLayer {
            return {};
        },
    };
}
