function prescanProject(aeProject: Project, state: AexState) {
    const items = aeq.getItems().filter((item) => !aeq.isComp(item));
    const comps = aeq.getComps();

    items.forEach((item) => prescanNonCompItem(item, state));
    comps.forEach((comp) => prescanComp(comp, state));
}

function getAexProject(project: Project, state: AexState): AexProject {
    const projectBaseAttributes = _getProjectBaseAttributes(project);

    const items = aeq.getItems().filter((item) => !aeq.isComp(item));
    const comps = aeq.getComps();

    const aexProject: AexProject = {
        ...projectBaseAttributes,
        type: AEX_PROJECT,

        items: items.map((item) => getAexItem(item, state)),
        comps: [getAexComp(comps[2], state)],
        // comps: comps.map((comp) => getAexComp(comp, state)),
    };

    return aexProject;
}

function updateAeProject(aeProject: Project, aexProject: AexProject, state: AexState) {
    _setProjectBaseAttributes(aeProject, aexProject);

    const aexItemsByName = groupArrayBy(aexProject.items, (v) => v.name);
    const aeItemsByName = groupArrayBy(aeq.getItems(), (v) => v.name);

    forEachPairByGroup(aexItemsByName, aeItemsByName, (aexItem, aeItem) => _setAeProjectItem(aeItem, aexItem, state));

    const aexCompsByName = groupArrayBy(aexProject.comps, (v) => v.name);
    const aeCompsByName = groupArrayBy(aeq.getComps(), (v) => v.name);

    forEachPairByGroup(aexCompsByName, aeCompsByName, (aexComp, aeComp) => _setAeProjectComp(aeComp, aexComp, state));
}

function _setAeProjectItem(aeItem: Item, aexItem: AexItem, state: AexState) {
    if (!aeItem) {
        aeItem = createAeItem(aexItem, state);
    } else {
        updateAeItem(aeItem, aexItem, state);
    }
}

function _setAeProjectComp(aeComp: CompItem, aexComp: AexComp, state: AexState) {
    if (!aeComp) {
        aeComp = createAeComp(aexComp, state);
    } else {
        updateAeComp(aeComp, aexComp, state);
    }
}

function _getProjectBaseAttributes(project: Project): AexProjectBase {
    return {
        bitsPerChannel: getModifiedValue(project.bitsPerChannel, 8),
        displayStartFrame: getModifiedValue(project.displayStartFrame, 0),
        expressionEngine: getModifiedValue(project.expressionEngine, 'javascript-1.0'),
        feetFramesFilmType: getModifiedValue(project.feetFramesFilmType, FeetFramesFilmType.MM35),
        footageTimecodeDisplayStartType: getModifiedValue(
            project.footageTimecodeDisplayStartType,
            FootageTimecodeDisplayStartType.FTCS_USE_SOURCE_MEDIA
        ),
        framesCountType: getModifiedValue(project.framesCountType, FramesCountType.FC_TIMECODE_CONVERSION),
        framesUseFeetFrames: getModifiedValue(project.framesUseFeetFrames, false),
        gpuAccelType: getModifiedValue(project.gpuAccelType, GpuAccelType.CUDA),
        linearBlending: getModifiedValue(project.linearBlending, false),
        linearizeWorkingSpace: getModifiedValue(project.linearizeWorkingSpace, false),
        timeDisplayType: getModifiedValue(project.timeDisplayType, TimeDisplayType.TIMECODE),
        transparencyGridThumbnails: getModifiedValue(project.transparencyGridThumbnails, false),
        workingGamma: getModifiedValue(project.workingGamma, 2.4),
        workingSpace: getModifiedValue(project.workingSpace, 'None'),
    };
}

function _setProjectBaseAttributes(project: Project, aexProject: AexProject) {
    assignAttributes(project, {
        bitsPerChannel: aexProject.bitsPerChannel,
        displayStartFrame: aexProject.displayStartFrame,
        expressionEngine: aexProject.expressionEngine,
        feetFramesFilmType: aexProject.feetFramesFilmType,
        footageTimecodeDisplayStartType: aexProject.footageTimecodeDisplayStartType,
        framesCountType: aexProject.framesCountType,
        framesUseFeetFrames: aexProject.framesUseFeetFrames,
        gpuAccelType: aexProject.gpuAccelType,
        linearBlending: aexProject.linearBlending,
        linearizeWorkingSpace: aexProject.linearizeWorkingSpace,
        timeDisplayType: aexProject.timeDisplayType,
        transparencyGridThumbnails: aexProject.transparencyGridThumbnails,
        workingGamma: aexProject.workingGamma,
        workingSpace: aexProject.workingSpace,
    });
}
