function getLightLayer(layer: LightLayer, state: AexState): AexLightLayer {
    const layerAttributes = getLayer(layer, state);
    layerAttributes.hasVideo = getModifiedValue(layer.hasVideo, false);
    const lightType = layer.lightType;

    return {
        ...layerAttributes,
        type: AEX_LIGHT_LAYER,
        lightType,
        lightOption: getPropertyGroup(layer.lightOption, state),
    };
}
