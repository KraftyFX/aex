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
    const comp = _createAEComp(aexComp);

    _setCompAttributes(comp, aexComp, state);
    _createCompMarkers(comp, aexComp.markers, state);
    createLayers(comp, aexComp.layers, state);

    state.stats.compCount++;
}

function _createAEComp(aexComp?: AexComp): CompItem {
    let compSettings = aexComp
        ? {
              name: aexComp.name,
              width: aexComp.width,
              height: aexComp.height,
              pixelAspect: aexComp.pixelAspect,
              duration: aexComp.duration,
              frameRate: aexComp.frameRate,
          }
        : undefined;

    const comp = aeq.comp.create(compSettings);

    comp.openInViewer();

    return comp;
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

function createLayers(comp: CompItem, aexLayers: AexLayer[], state: AexState) {
    /** Supports creating sets of layers without targeting a specific comp */
    if (aeq.isNullOrUndefined(comp)) {
        comp = _createAEComp();
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
    if (aeq.isNullOrUndefined(aexMarkers)) {
        throw new Error(`${comp.name} missing AexMarkers`);
    }

    createMarkers(comp.markerProperty, aexMarkers, state);
}
