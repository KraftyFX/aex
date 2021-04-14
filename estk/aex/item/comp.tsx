function getAexComp(comp: CompItem, state: AexState): AexComp {
    const avItemAttributes = _getAVItemAttributes(comp);

    const bgColor = getModifiedValue(comp.bgColor, [0, 0, 0] as ThreeDColorValue);
    const displayStartFrame = getModifiedValue(comp.displayStartFrame, 0);
    const displayStartTime = getModifiedValue(comp.displayStartTime, 0);
    const draft3d = getModifiedValue(comp.draft3d, false);
    const dropFrame = getModifiedValue(comp.dropFrame, false);
    const frameBlending = getModifiedValue(comp.frameBlending, false);
    const hideShyLayers = getModifiedValue(comp.hideShyLayers, false);
    const motionBlur = getModifiedValue(comp.motionBlur, false);
    const motionBlurAdaptiveSampleLimit = getModifiedValue(comp.motionBlurAdaptiveSampleLimit, 128);
    const motionBlurSamplesPerFrame = getModifiedValue(comp.motionBlurSamplesPerFrame, 16);
    const preserveNestedFrameRate = getModifiedValue(comp.preserveNestedFrameRate, false);
    const preserveNestedResolution = getModifiedValue(comp.preserveNestedResolution, false);
    const renderer = getModifiedValue(comp.renderer, 'ADBE Advanced 3d');
    const resolutionFactor = getModifiedValue(comp.resolutionFactor, [1, 1]);
    const shutterAngle = getModifiedValue(comp.shutterAngle, 180);
    const shutterPhase = getModifiedValue(comp.shutterPhase, 0);
    const workAreaStart = getModifiedValue(comp.workAreaStart, 0);
    const workAreaDuration = getModifiedValue(comp.workAreaDuration, comp.duration);

    const aexComp: AexComp = {
        type: AEX_COMP_ITEM,

        /** Item & AVItem attributes */
        ...avItemAttributes,

        /** Comp internal data */
        bgColor,
        displayStartFrame,
        displayStartTime,
        draft3d,
        dropFrame,
        frameBlending,
        hideShyLayers,
        motionBlur,
        motionBlurAdaptiveSampleLimit,
        motionBlurSamplesPerFrame,
        preserveNestedFrameRate,
        preserveNestedResolution,
        renderer,
        resolutionFactor,
        shutterAngle,
        shutterPhase,
        workAreaStart,
        workAreaDuration,

        markers: _getAexCompMarkers(comp),
        layers: _getAexCompLayers(comp, state),
    };

    state.stats.compCount++;
    return aexComp;
}

function createComp(aexComp: AexComp, state: AexState): void {
    /** @todo */
}

function _getAexCompLayers(comp: CompItem, state: AexState) {
    let layers = [] as AexLayer[];

    aeq.forEachLayer(comp, (layer: Layer) => {
        let layerData = getAexLayer(layer, state);
        layers.push(layerData);
    });

    return layers;
}

function _getAexCompMarkers(comp: CompItem) {
    return getAexMarkerProperties(comp.markerProperty);
}
