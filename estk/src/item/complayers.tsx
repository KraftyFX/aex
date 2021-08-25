function prescanCompLayers(aeComp: CompItem, state: AexState) {
    aeq.forEachLayer(aeComp, (layer: Layer) => {
        prescanLayer(layer, state);
    });
}

function getAexCompLayers(aeComp: CompItem, state: AexState) {
    const aexLayers = [] as AexLayer[];

    aeq.forEachLayer(aeComp, (layer: Layer) => {
        const layerData = getAexLayer(layer, state);

        aexLayers.push(layerData);
    });

    return aexLayers;
}

function updateAeCompLayers(aeComp: CompItem, aexComp: AexComp, state: AexState) {
    const layersWithParents = aeq.arrayEx();

    const onLayerPair = (aexLayer: AexLayer, aeLayer: Layer, i: number) => {
        if (!aeLayer) {
            aeLayer = createAeLayer(aeComp, aexLayer, state);

            /**
             * Voodoo
             *
             * When deserializing entire comps, we need to first create all layers before setting layer parents.
             * To that end, we'll keep track of which layers have parents, and then set the parents below.
             */
            if (aexLayer.parentLayerIndex) {
                layersWithParents.push(aexComp.layers.length - i);
            }
        } else {
            updateAeLayer(aeLayer, aexLayer, state);
        }
    };

    const matchBy = state.updateOptions.layerMatchBy;

    /**
     * Voodoo
     *
     * New created layers get placed at the top of the stack.
     *
     * But because we want AexComp.Layers to be in the same order as the resulting timeline,
     * we need to reverse our layers array to create them to preserve the same layer ordering.
     */
    (aexComp.layers || []).reverse();

    switch (matchBy) {
        case 'index':
            forEachLayerPairByIndex(aexComp.layers, aeComp, onLayerPair);
            break;
        case 'name':
            const aexLayersByName = groupArrayBy(aexComp.layers, (v) => v.name);
            const aeLayersByName = groupAeLayersBy(aeComp, (v) => v.name);

            forEachPairByGroup(aexLayersByName, aeLayersByName, onLayerPair);
            break;
        default:
            throw fail(`Unrecognized layer matching method "${matchBy}"`);
    }

    /**
     * Once all layers have been created, go set the parents & update their transforms
     */
    layersWithParents.forEach(function (parentedLayerIndex) {
        const aeLayer = aeComp.layer(parentedLayerIndex);
        const aexLayer = aexComp.layers[aexComp.layers.length - parentedLayerIndex];

        setLayerParent(aeLayer, aexLayer, state);
        updateLayerTransform(aeLayer, aexLayer.transform, state);
    });
}

function forEachLayerPairByIndex(aexLayers: AexLayer[], aeComp: CompItem, callback: (aexLayer: AexLayer, aeLayer: Layer, i) => void) {
    const aeLength = aeComp.numLayers;

    aeq.arrayEx(aexLayers).forEach((v, i) => {
        callback(v, i < aeLength ? aeComp.layer(i + 1) : null, i);
    });
}
