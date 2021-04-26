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

    //
    // The project is a special case b/c there is only ever one.
    //
    // Thoughts:
    //
    // If there is no project open, create one or throw?
    // If merge=false
    //   - delete everything first.
    //   - create as you go along.
    // If merge=true
    //   - walk the project and overwrite props.
    //   - collection based objects get tricky. Need a matching policy (index, name, other?)

    aeq.forEach(items, (item) => {
        createItem(item, state);
    });

    aeq.forEach(comps, (comp) => {
        createComp(comp, state);
    });
}

function setAeProject2(aeProject: Project, aexProject: AexProject, state: AexState) {
    const { comps: aexComps, items: aexItems } = aexProject;

    const aexItemsByName = groupArrayBy(aexItems, (v) => v.name);
    const aeItemsByName = groupArrayBy(aeq.getItems(), (v) => v.name);

    forEachPairByGroup(aexItemsByName, aeItemsByName, (aexItem, aeItem) => _setAeProjectItem2(aexItem, aeItem, state));

    const comps = aeq.getComps();

    forEachPairByIndex(aexComps, comps, (aexComp, aeComp) => _setAeProjectComp(aeComp, aexComp, state));
}

function _setAeProjectItem2(aexItem: AexItem, aeItem: Item, state: AexState) {
    switch (aexItem.type) {
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
