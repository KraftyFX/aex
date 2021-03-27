function getAexProject(project: Project, options: AexState): AexProject {
    const items = aeq.getItems().filter((item) => !aeq.isComp(item));
    const comps = aeq.getComps();

    const aexProject: AexProject = {
        type: AEX_PROJECT,

        items: items.map((item) => getAexItem(item, options)),
        comps: comps.map((comp) => getAexComp(comp, options)),
    };

    return aexProject;
}
