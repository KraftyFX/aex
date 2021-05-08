function prescanComp(aeComp: CompItem, state: AexState) {
    state.stats.compCount++;

    prescanCompMarkers(aeComp, state);
    prescanCompLayers(aeComp, state);
}

function getAexComp(aeComp: CompItem, state: AexState): AexComp {
    return profile(
        'getAexComp',
        () => {
            state.stats.compCount++;

            const avItemBaseAttributes = getAvItemBaseAttributes(aeComp);

            const aexComp: AexComp = {
                /** Item & AVItem attributes */
                ...avItemBaseAttributes,
                type: AEX_COMP_ITEM,

                /** Comp internal data */
                bgColor: getModifiedValue(aeComp.bgColor, [0, 0, 0] as ThreeDColorValue),
                displayStartFrame: getModifiedValue(aeComp.displayStartFrame, 0),
                displayStartTime: getModifiedValue(aeComp.displayStartTime, 0),
                draft3d: getModifiedValue(aeComp.draft3d, false),
                dropFrame: getModifiedValue(aeComp.dropFrame, false),
                frameBlending: getModifiedValue(aeComp.frameBlending, false),
                hideShyLayers: getModifiedValue(aeComp.hideShyLayers, false),
                motionBlur: getModifiedValue(aeComp.motionBlur, false),
                motionBlurAdaptiveSampleLimit: getModifiedValue(aeComp.motionBlurAdaptiveSampleLimit, 128),
                motionBlurSamplesPerFrame: getModifiedValue(aeComp.motionBlurSamplesPerFrame, 16),
                preserveNestedFrameRate: getModifiedValue(aeComp.preserveNestedFrameRate, false),
                preserveNestedResolution: getModifiedValue(aeComp.preserveNestedResolution, false),
                renderer: getModifiedValue(aeComp.renderer, 'ADBE Advanced 3d'),
                resolutionFactor: getModifiedValue(aeComp.resolutionFactor, [1, 1]),
                shutterAngle: getModifiedValue(aeComp.shutterAngle, 180),
                shutterPhase: getModifiedValue(aeComp.shutterPhase, 0),
                workAreaStart: getModifiedValue(aeComp.workAreaStart, 0),
                workAreaDuration: getModifiedValue(aeComp.workAreaDuration, aeComp.duration),

                markers: getAexCompMarkers(aeComp, state),
                layers: getAexCompLayers(aeComp, state),
            };

            return aexComp;
        },
        state,
        aeComp.name
    );
}

function createAeComp(aexComp: AexComp, state: AexState): CompItem {
    assertIsDefined(aexComp, 'aexComp');

    state.stats.compCount++;

    const compSettings = {
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

    updateAeComp(comp, aexComp, state);

    // Note: We do not count the comp in the stats
    // because it already counted during update.

    return comp;
}

function updateAeComp(aeComp: CompItem, aexComp: AexComp, state: AexState): void {
    assertIsDefined(aeComp, 'aeComp');

    setItemBaseAttributes(aeComp, aexComp, state);

    assignAttributes(aeComp, {
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

    setAeCompMarkers(aeComp, aexComp, state);
    setAeCompRenderer(aeComp, aexComp, state);
    updateAeCompLayers(aeComp, aexComp, state);

    state.stats.compCount++;
}

function prescanCompMarkers(aeComp: CompItem, state: AexState) {
    prescanProperty(aeComp.markerProperty, state);
}

function getAexCompMarkers(aeComp: CompItem, state: AexState) {
    return getAexMarkerProperties(aeComp.markerProperty, state);
}

function setAeCompMarkers(aeComp: CompItem, aexComp: AexComp, state: AexState) {
    if (aeq.isNullOrUndefined(aexComp.markers)) {
        return;
    }

    updateAeMarkers(aeComp.markerProperty, aexComp.markers, state);
}
