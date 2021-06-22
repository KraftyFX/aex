function prescanCameraLayer(aeCameraLayer: CameraLayer, state: AexState) {
    state.stats.layerCount++;

    prescanProperty(aeCameraLayer.transform.position, state);
    prescanPropertyGroup(aeCameraLayer.cameraOption, state);
}

function getAexCameraLayer(aeCameraLayer: CameraLayer, state: AexState): AexCameraLayer {
    const layerAttributes = getLayerAttributes(aeCameraLayer, state);

    /**
     * Voodoo
     *
     * Cameras don't have default positions when they're created,
     * so we need to get them explicitly if they're not modified
     */
    if (!layerAttributes.transform.position) {
        layerAttributes.transform.position = getProperty(aeCameraLayer.transform.position, state);
    }

    state.stats.layerCount++;

    return {
        ...layerAttributes,
        type: AEX_CAMERA_LAYER,

        hasVideo: getModifiedValue(aeCameraLayer.hasVideo, false),
        cameraOption: getPropertyGroup(aeCameraLayer.cameraOption, state),
    };
}

function createAeCameraLayer(aeComp: CompItem, aexCameraLayer: AexCameraLayer, state: AexState) {
    const aeCameraLayer = aeComp.layers.addCamera(aexCameraLayer.name, _getCameraCenterPoint(aeComp, aexCameraLayer));
    setLayerAttributes(aeCameraLayer, aexCameraLayer, state);

    /** We're inferring 'One-Node' vs 'Two-Node' based on whether this property exists, as opposed to serializing an additional property */
    const isOneNode = aeq.isNullOrUndefined(aexCameraLayer.transform.pointOfInterest);

    if (isOneNode) {
        aeCameraLayer.autoOrient = AutoOrientType.NO_AUTO_ORIENT;
    } else {
        aeCameraLayer.autoOrient = AutoOrientType.CAMERA_OR_POINT_OF_INTEREST;
    }

    if (aexCameraLayer.cameraOption) {
        setPropertyGroup(aeCameraLayer.cameraOption, aexCameraLayer.cameraOption, state);
    }

    return aeCameraLayer;
}

function updateAexCameraLayer(aeCameraLayer: CameraLayer, aexCameraLayer: AexCameraLayer, state: AexState) {
    throw notImplemented();
}

function _getCameraCenterPoint(aeComp: CompItem, aexCameraLayer: AexCameraLayer): TwoDPoint {
    let centerPoint: TwoDPoint;

    const isOneNode = aeq.isNullOrUndefined(aexCameraLayer.transform.pointOfInterest);

    if (isOneNode) {
        centerPoint = [aeComp.width / 2, aeComp.height / 2];
    } else {
        const pointOfInterest = aexCameraLayer.transform.pointOfInterest.value;

        centerPoint = [pointOfInterest[0], pointOfInterest[1]];
    }

    return centerPoint;
}
