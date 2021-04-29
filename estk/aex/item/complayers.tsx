function _getAexCompLayers(comp: CompItem, state: AexState) {
    const layers = [] as AexLayer[];

    aeq.forEachLayer(comp, (layer: Layer) => {
        const layerData = getAexLayer(layer, state);
        layers.push(layerData);
    });

    return layers;
}

function setAeCompLayers(comp: CompItem, aexComp: AexComp, state: AexState) {
    const onLayerPair = (aexLayer: AexLayer, aeLayer: Layer, i: number) => {
        if (!aeLayer) {
            aeLayer = createLayer(comp, aexLayer, state);
        } else {
            setAeLayer(aeLayer, aexLayer, state);
        }
    };

    const matchBy = state.toAeOptions.layerMatchBy;

    /**
     * Voodoo
     *
     * New created layers get placed at the top of the stack.
     *
     * But because we add to the AexComp.layers array from top -> bottom, we need to reverse
     * our array to preserve the same layer ordering.
     */
    aexComp.layers.reverse();

    switch (matchBy) {
        case 'index':
            forEachLayerPairByIndex(aexComp.layers, comp, onLayerPair);
            break;
        case 'name':
            const aexLayersByName = groupArrayBy(aexComp.layers, (v) => v.name);
            const aeLayersByName = groupAeLayersBy(comp, (v) => v.name);

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
