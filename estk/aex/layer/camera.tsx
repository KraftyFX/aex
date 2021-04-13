function getCameraLayer(layer: CameraLayer, state: AexState): AexCameraLayer {
    const layerAttributes = getLayer(layer, state);
    layerAttributes.hasVideo = getModifiedValue(layer.hasVideo, false);

    return {
        ...layerAttributes,
        type: AEX_CAMERA_LAYER,
        cameraOption: getPropertyGroup(layer.cameraOption, state),
    };
}
