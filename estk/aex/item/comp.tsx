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

function _getAexCompMarkers(comp: CompItem) {
    return getAexMarkerProperties(comp.markerProperty);
}

function setAeCompMarkers(aeComp: CompItem, aexComp: AexComp, state: AexState) {
    if (aeq.isNullOrUndefined(aexComp.markers)) {
        return;
    }

    setAeMarkers(aeComp.markerProperty, aexComp.markers, state);
}

function createAeComp(aexComp: AexComp, state: AexState): CompItem {
    assertIsDefined(aexComp, 'aexComp');

    state.stats.compCount++;

    let compSettings = {
        name: 'Comp',
        width: 1920,
        height: 1080,
        pixelAspect: 1,
        duration: 1,
        frameRate: 24,
    };

    assignAttributes(compSettings, {
        name: aexComp.name,
        width: aexComp.width,
        height: aexComp.height,
        pixelAspect: aexComp.pixelAspect,
        duration: aexComp.duration,
        frameRate: aexComp.frameRate,
    });

    const comp = aeq.comp.create(compSettings);

    comp.openInViewer();

    setAeComp(comp, aexComp, state);

    return comp;
}

function setAeComp(comp: CompItem, aexComp: AexComp, state: AexState): void {
    assertIsDefined(comp, 'comp');

    setItemBaseAttributes(comp, aexComp, state);

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
        resolutionFactor: aexComp.resolutionFactor,
        shutterAngle: aexComp.shutterAngle,
        shutterPhase: aexComp.shutterPhase,
        workAreaDuration: aexComp.workAreaDuration,
        workAreaStart: aexComp.workAreaStart,
    });

    setAeCompMarkers(comp, aexComp, state);
    setAeCompRenderer(comp, aexComp, state);
    _setAeCompLayers(comp, aexComp, state);
}
