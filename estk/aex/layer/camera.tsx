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

function createCameraLayer(comp: CompItem, aexCameraLayer: AexCameraLayer, state: AexState): CameraLayer {
    const layer = comp.layers.addCamera(aexCameraLayer.name, _getCameraCenterPoint(comp, aexCameraLayer));
    _setLayerAttributes(layer, aexCameraLayer, state);

    const isOneNode = aeq.isNullOrUndefined(aexCameraLayer.transform.pointOfInterest);

    if (isOneNode) {
        layer.autoOrient = AutoOrientType.NO_AUTO_ORIENT;
    } else {
        layer.autoOrient = AutoOrientType.CAMERA_OR_POINT_OF_INTEREST;
    }

    if (aexCameraLayer.cameraOption) {
        setPropertyGroup(layer.cameraOption, aexCameraLayer.cameraOption, state);
    }

    return layer;
}

function _getCameraCenterPoint(comp: CompItem, aexCameraLayer: AexCameraLayer): TwoDPoint {
    let centerPoint: TwoDPoint;

    const isOneNode = aeq.isNullOrUndefined(aexCameraLayer.transform.pointOfInterest);

    if (isOneNode) {
        centerPoint = [comp.width / 2, comp.height / 2];
    } else {
        const pointOfInterest = aexCameraLayer.transform.pointOfInterest.value;

        centerPoint = [pointOfInterest[0], pointOfInterest[1]];
    }

    return centerPoint;
}
