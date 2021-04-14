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
    app.beginUndoGroup('Set AEX Project');

    const { items, comps } = aexProject;

    aeq.forEach(items, (item) => {
        createItem(item, state);
    });

    aeq.forEach(comps, (comp) => {
        createComp(comp, state);
    });

    app.endUndoGroup();
}
