function getLightLayer(layer: LightLayer, state: AexState): AexLightLayer {
    const layerAttributes = getLayerAttributes(layer, state);
    layerAttributes.hasVideo = getModifiedValue(layer.hasVideo, false);
    const lightType = layer.lightType;

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
        lightType,
        lightOption: getPropertyGroup(layer.lightOption, state),
    };
}

function createLightLayer(comp: CompItem, aexLightLayer: AexLightLayer, state: AexState) {
    const layer = comp.layers.addLight(aexLightLayer.name, [comp.width / 2, comp.height / 2]);
    _setLayerAttributes(layer, aexLightLayer, state);

    layer.lightType = aexLightLayer.lightType;

    if (aexLightLayer.lightOption) {
        setPropertyGroup(layer.lightOption, aexLightLayer.lightOption, state);
    }
}
