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
    const comp = _createAEComp(aexComp, state);

    _setCompAttributes(comp, aexComp, state);
    _createCompMarkers(comp, aexComp.markers, state);
    createLayers(comp, aexComp.layers, state);
}

function _createAEComp(aexComp: AexComp, state: AexState): CompItem {
    state.stats.compCount++;

    let compSettings = {
        name: 'Comp',
        width: 1920,
        height: 1080,
        pixelAspect: 1,
        duration: 1,
        frameRate: 24,
    };

    if (!aeq.isNullOrUndefined(aexComp)) {
        assignAttributes(compSettings, {
            name: aexComp.name,
            width: aexComp.width,
            height: aexComp.height,
            pixelAspect: aexComp.pixelAspect,
            duration: aexComp.duration,
            frameRate: aexComp.frameRate,
        });
    }

    const comp = aeq.comp.create(compSettings);
    comp.openInViewer();

    return comp;
}

function _setCompAttributes(comp: CompItem, aexComp: AexComp, state: AexState): void {
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

    if (aexComp.renderer) {
        setCompRenderer(comp, aexComp.renderer);
    }
}

function _getAexCompLayers(comp: CompItem, state: AexState) {
    const layers = [] as AexLayer[];

    aeq.forEachLayer(comp, (layer: Layer) => {
        const layerData = getAexLayer(layer, state);
        layers.push(layerData);
    });

    return layers;
}

function createLayers(comp: CompItem, aexLayers: AexLayer[], state: AexState) {
    /** Supports creating sets of layers without targeting a specific comp */
    if (aeq.isNullOrUndefined(comp)) {
        comp = _createAEComp(undefined, state);
    }

    /**
     * Voodoo
     *
     * New created layers get placed at the top of the stack.
     *
     * But because we add to the AexComp.layers array from top -> bottom, we need to reverse
     * our array to preserve the same layer ordering.
     */
    aexLayers.reverse();

    aeq.forEach(aexLayers, (aexLayer: AexLayer) => {
        createLayer(comp, aexLayer, state);
    });
}

function _getAexCompMarkers(comp: CompItem) {
    return getAexMarkerProperties(comp.markerProperty);
}

function _createCompMarkers(comp: CompItem, aexMarkers: AexMarkerProperty[], state: AexState) {
    createMarkers(comp.markerProperty, aexMarkers, state);
}

function _createAeComp2(aexComp: AexComp, state: AexState): CompItem {
    state.stats.compCount++;

    const comp = aeq.comp.create({
        name: aexComp.name,
        width: aexComp.width,
        height: aexComp.height,
        pixelAspect: aexComp.pixelAspect,
        duration: aexComp.duration,
        frameRate: aexComp.frameRate,
    });

    comp.openInViewer();

    return comp;
}

function _setAeComp2(comp: CompItem, aexComp: AexComp, state: AexState): void {
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

    if (aexComp.markers) {
        setCompMarkers2(comp.markerProperty, aexComp.markers, state);
    }

    if (aexComp.renderer) {
        setCompRenderer(comp, aexComp.renderer);
    }
}
