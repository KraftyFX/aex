function getAexProject(options: AexOptions): AexProject {
    const items = aeq.getItems().filter((item) => !aeq.isComp(item));
    const comps = aeq.getComps();

    const aexProject: AexProject = {
        items: items.map((item) => getAexItem(item, options)),
        comps: comps.map((comp) => getAexComp(comp, options)),
    };

    return aexProject;
}
