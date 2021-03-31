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
