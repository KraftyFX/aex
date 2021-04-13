function _getLightLayer(layer: LightLayer, state: AexState): AexLightLayer {
    const layerAttributes = _getLayer(layer, state);
    layerAttributes.hasVideo = getModifiedValue(layer.hasVideo, false);
    const lightType = layer.lightType;

    return {
        ...layerAttributes,
        type: AEX_LIGHT_LAYER,
        lightType,
        lightOption: getPropertyGroup(layer.lightOption, state),
    };
}
