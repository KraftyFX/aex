function prescanCompLayers(aeComp: CompItem, state: AexState) {
    aeq.forEachLayer(aeComp, (layer: Layer) => {
        prescanLayer(layer, state);
    });
}

function getAexCompLayers(aeComp: CompItem, state: AexState) {
    const aexLayers = [] as AexLayer[];

    aeq.forEachLayer(aeComp, (layer: Layer) => {
        const layerData = getAexLayer(layer, state);

        // TODO: Insert the layers in the front, update the tests and get rid of
        // the voodoo during deserialization
        aexLayers.push(layerData);
    });

    return aexLayers;
}

function updateAeCompLayers(aeComp: CompItem, aexComp: AexComp, state: AexState) {
    const onLayerPair = (aexLayer: AexLayer, aeLayer: Layer, i: number) => {
        if (!aeLayer) {
            aeLayer = createAeLayer(aeComp, aexLayer, state);
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
     * But because we add to the AexComp.layers array from top -> bottom, we need to reverse
     * our array to preserve the same layer ordering.
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
            throw new Error(`Unrecognized layer matching method "${matchBy}"`);
    }
}

function forEachLayerPairByIndex(aexLayers: AexLayer[], aeComp: CompItem, callback: (aexLayer: AexLayer, aeLayer: Layer, i) => void) {
    const aeLength = aeComp.numLayers;

    aeq.arrayEx(aexLayers).forEach((v, i) => {
        callback(v, i < aeLength ? aeComp.layer(i + 1) : null, i);
    });
}
