function getAexLightLayer(layer: LightLayer, state: AexState): AexLightLayer {
    const layerAttributes = getLayerAttributes(layer, state);
    const { lightType } = layer;

    /**
     * Voodoo: Lights don't have default positions when they're created,
     * so we need to get them explicitly if they're not modified
     */
    if (!layerAttributes.transform.position) {
        layerAttributes.transform.position = getProperty(layer.transform.position, state);
    }

    return {
        ...layerAttributes,
        type: AEX_LIGHT_LAYER,

        hasVideo: getModifiedValue(layer.hasVideo, false),
        lightType,
        lightOption: getPropertyGroup(layer.lightOption, state),
    };
}

function createAeLightLayer(comp: CompItem, aexLightLayer: AexLightLayer, state: AexState) {
    const layer = comp.layers.addLight(aexLightLayer.name, [comp.width / 2, comp.height / 2]);
    _setLayerAttributes(layer, aexLightLayer, state);

    layer.lightType = aexLightLayer.lightType;

    if (aexLightLayer.lightOption) {
        setPropertyGroup(layer.lightOption, aexLightLayer.lightOption, state);
    }
    return layer;
}
