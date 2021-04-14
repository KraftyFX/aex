function getAexComp(comp: CompItem, state: AexState): AexComp {
    const avItemBaseAttributes = getAVItemBaseAttributes(comp);

    const aexComp: AexComp = {
        /** Item & AVItem attributes */
        ...avItemBaseAttributes,
        type: AEX_COMP_ITEM,

        /** Comp internal data */
        bgColor: getModifiedValue(comp.bgColor, [0, 0, 0] as ThreeDColorValue),
        displayStartFrame: getModifiedValue(comp.displayStartFrame, 0),
        displayStartTime: getModifiedValue(comp.displayStartTime, 0),
        draft3d: getModifiedValue(comp.draft3d, false),
        dropFrame: getModifiedValue(comp.dropFrame, false),
        frameBlending: getModifiedValue(comp.frameBlending, false),
        hideShyLayers: getModifiedValue(comp.hideShyLayers, false),
        motionBlur: getModifiedValue(comp.motionBlur, false),
        motionBlurAdaptiveSampleLimit: getModifiedValue(comp.motionBlurAdaptiveSampleLimit, 128),
        motionBlurSamplesPerFrame: getModifiedValue(comp.motionBlurSamplesPerFrame, 16),
        preserveNestedFrameRate: getModifiedValue(comp.preserveNestedFrameRate, false),
        preserveNestedResolution: getModifiedValue(comp.preserveNestedResolution, false),
        renderer: getModifiedValue(comp.renderer, 'ADBE Advanced 3d'),
        resolutionFactor: getModifiedValue(comp.resolutionFactor, [1, 1]),
        shutterAngle: getModifiedValue(comp.shutterAngle, 180),
        shutterPhase: getModifiedValue(comp.shutterPhase, 0),
        workAreaStart: getModifiedValue(comp.workAreaStart, 0),
        workAreaDuration: getModifiedValue(comp.workAreaDuration, comp.duration),

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

    comp.openInViewer();
}

function createLayers(comp: CompItem, layers: AexLayer[], state: AexState) {
    /** @todo */
}

function _setCompAttributes(comp: CompItem, aexComp: AexComp, state: AexState): void {
    _setItemAttributes(comp, aexComp, state);

    assignAttributes(comp, {
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
