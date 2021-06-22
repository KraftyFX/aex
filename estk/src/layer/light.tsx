function prescanLightLayer(aeLightLayer: LightLayer, state: AexState) {
    state.stats.layerCount++;

    prescanProperty(aeLightLayer.transform.position, state);
    prescanPropertyGroup(aeLightLayer.lightOption, state);
}

function getAexLightLayer(aeLightLayer: LightLayer, state: AexState): AexLightLayer {
    const layerAttributes = getLayerAttributes(aeLightLayer, state);
    const { lightType } = aeLightLayer;

    /**
     * Voodoo
     *
     * Lights don't have default positions when they're created,
     * so we need to get them explicitly if they're not modified
     */
    if (!layerAttributes.transform.position) {
        layerAttributes.transform.position = getProperty(aeLightLayer.transform.position, state);
    }

    state.stats.layerCount++;

    return {
        ...layerAttributes,
        type: AEX_LIGHT_LAYER,

        hasVideo: getModifiedValue(aeLightLayer.hasVideo, false),
        lightType,
        lightOption: getPropertyGroup(aeLightLayer.lightOption, state),
    };
}

function createAeLightLayer(aeComp: CompItem, aexLightLayer: AexLightLayer, state: AexState) {
    const aeLightLayer = aeComp.layers.addLight(aexLightLayer.name, [aeComp.width / 2, aeComp.height / 2]);
    setLayerAttributes(aeLightLayer, aexLightLayer, state);

    aeLightLayer.lightType = aexLightLayer.lightType;

    if (aexLightLayer.lightOption) {
        setPropertyGroup(aeLightLayer.lightOption, aexLightLayer.lightOption, state);
    }

    return aeLightLayer;
}

function updateAexLightLayer(aeLightLayer: LightLayer, aexLightLayer: AexLightLayer, state: AexState) {
    throw notImplemented(`Updating a light layer`);
}
