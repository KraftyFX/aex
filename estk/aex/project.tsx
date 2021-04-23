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

function setProject2(aeProject: Project, aexProject: AexProject, state: AexState) {
    const { comps: aexComps } = aexProject;
    const comps = aeq.getComps();

    forEachCompItemPair(aexComps, comps, (aexComp, aeComp) => {
        aeComp = aeComp || _createComp2(aexComp, state);

        _setComp2(aeComp, aexComp, state);
    });
}

function forEachCompItemPair(aexComps: AexComp[], aeComps: CompItem[], callback: (aexComp: AexComp, aeComp: CompItem) => void) {
    const aexCompsArr = aeq.arrayEx(aexComps) as AEQArrayEx<AexComp>;
    const aeCompsLength = aeComps.length;

    aexCompsArr.forEach((v, i) => {
        callback(v, i < aeCompsLength ? aeComps[i] : null);
    });
}
