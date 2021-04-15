function getCameraLayer(layer: CameraLayer, state: AexState): AexCameraLayer {
    const layerAttributes = getLayerAttributes(layer, state);
    layerAttributes.hasVideo = getModifiedValue(layer.hasVideo, false);

    /**
     * Voodoo: Cameras don't have default positions when they're created,
     * so we need to get them explicitly if they're not modified
     */
    if (!layerAttributes.transform.position) {
        layerAttributes.transform.position = getProperty(layer.transform.position, state);
    }

    return {
        ...layerAttributes,
        type: AEX_CAMERA_LAYER,
        cameraOption: getPropertyGroup(layer.cameraOption, state),
    };
}
