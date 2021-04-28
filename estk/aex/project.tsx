function getAexProject(project: Project, state: AexState): AexProject {
    const items = aeq.getItems().filter((item) => !aeq.isComp(item));
    const comps = aeq.getComps();

    const aexProject: AexProject = {
        type: AEX_PROJECT,

        items: items.map((item) => getAexItem(item, state)),
        comps: comps.map((comp) => getAexComp(comp, state)),
    };

    return aexProject;
}

function setAexProject(aexProject: AexProject, state: AexState) {
    const { items, comps } = aexProject;

    aeq.forEach(items, (item) => {
        createItem(item, state);
    });

    aeq.forEach(comps, (comp) => {
        createComp(comp, state);
    });
}

function setAeProject2(aeProject: Project, aexProject: AexProject, state: AexState) {
    const aexItemsByName = groupArrayBy(aexProject.items, (v) => v.name);
    const aeItemsByName = groupArrayBy(aeq.getItems(), (v) => v.name);

    forEachPairByGroup(aexItemsByName, aeItemsByName, (aexItem, aeItem) => _setAeProjectItem(aexItem, aeItem, state));

    const aexCompsByName = groupArrayBy(aexProject.comps, (v) => v.name);
    const aeCompsByName = groupArrayBy(aeq.getComps(), (v) => v.name);

    forEachPairByGroup(aexCompsByName, aeCompsByName, (aexComp, aeComp) => _setAeProjectComp(aeComp, aexComp, state));
}

function _setAeProjectItem(aexItem: AexItem, aeItem: Item, state: AexState) {
    switch (aexItem.type) {
        case AEX_PLACEHOLDER_ITEM:
            if (!aeItem) {
                _createAePlaceholder(aexItem as AexPlaceholderItem, state);
            } else {
                setAePlaceholder(aeItem as PlaceholderItem, aexItem as AexPlaceholderItem, state);
            }
            break;
        case AEX_SOLID_ITEM:
            if (!aeItem) {
                _createAeSolid2(aexItem as AexSolidItem, state);
            } else {
                setAeSolid2(aeItem as FootageItem, aexItem as AexSolidItem, state);
            }
            break;
        case AEX_FOLDER_ITEM:
            aeItem = aeItem || _createAeFolderItem2(aexItem as AexFolderItem, state);
            setAeFolderItem2(aeItem as FolderItem, aexItem as AexFolderItem, state);
            break;
        case AEX_COMP_ITEM:
            throw new Error(`A comp with name "${(aexItem as AexComp).name}" was found in the item list that should only contain non-comp items`);
        default:
            throw new Error(`Not supported: Setting of project item type "${aexItem.type}"`);
    }
}

function _setAeProjectComp(aeComp: CompItem, aexComp: AexComp, state: AexState) {
    aeComp = aeComp || _createAeComp2(aexComp, state);

    _setAeComp2(aeComp, aexComp, state);
}
