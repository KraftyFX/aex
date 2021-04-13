function _getCameraLayer(layer: CameraLayer, state: AexState): AexCameraLayer {
    const layerAttributes = _getLayer(layer, state);
    layerAttributes.hasVideo = getModifiedValue(layer.hasVideo, false);

    return {
        ...layerAttributes,
        type: AEX_CAMERA_LAYER,
        cameraOption: getPropertyGroup(layer.cameraOption, state),
    };
}
