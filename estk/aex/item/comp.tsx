function getAexComp(comp: CompItem, state: AexState): AexComp {
    const avItemBaseAttributes = getAVItemBaseAttributes(comp);

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
        /** Item & AVItem attributes */
        ...avItemBaseAttributes,
        type: AEX_COMP_ITEM,

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
    const comp = aeq.comp.create({
        name: aexComp.name,
        width: aexComp.width,
        height: aexComp.height,
        pixelAspect: aexComp.pixelAspect,
        duration: aexComp.duration,
        frameRate: aexComp.frameRate,
    });

    _setCompAttributes(comp, aexComp, state);

    createLayers(comp, aexComp.layers, state);
    _createCompMarkers(comp, aexComp.markers, state);
}

function createLayers(comp: CompItem, layers: AexLayer[], state: AexState) {
    /** @todo */
}

function _setCompAttributes(comp: CompItem, aexComp: AexComp, state: AexState): void {
    _setItemAttributes(comp, aexComp, state);

    cloneAttributes(comp, {
        bgColor: aexComp.bgColor,
        displayStartFrame: aexComp.displayStartFrame,
        displayStartTime: aexComp.displayStartTime,
        draft3d: aexComp.draft3d,
        dropFrame: aexComp.dropFrame,
        frameBlending: aexComp.frameBlending,
        hideShyLayers: aexComp.hideShyLayers,
        motionBlur: aexComp.motionBlur,
        motionBlurAdaptiveSampleLimit: aexComp.motionBlurAdaptiveSampleLimit,
        motionBlurSamplesPerFrame: aexComp.motionBlurSamplesPerFrame,
        preserveNestedFrameRate: aexComp.preserveNestedFrameRate,
        preserveNestedResolution: aexComp.preserveNestedResolution,
        renderer: aexComp.renderer,
        resolutionFactor: aexComp.resolutionFactor,
        shutterAngle: aexComp.shutterAngle,
        shutterPhase: aexComp.shutterPhase,
        workAreaDuration: aexComp.workAreaDuration,
        workAreaStart: aexComp.workAreaStart,
    });
}

function _getAexCompLayers(comp: CompItem, state: AexState) {
    const layers = [] as AexLayer[];

    aeq.forEachLayer(comp, (layer: Layer) => {
        const layerData = getAexLayer(layer, state);
        layers.push(layerData);
    });

    return layers;
}

function _getAexCompMarkers(comp: CompItem) {
    return getAexMarkerProperties(comp.markerProperty);
}

function _createCompMarkers(comp: CompItem, markers: AexMarkerProperty[], state: AexState) {
    createMarkers(comp.markerProperty, markers, state);
}
