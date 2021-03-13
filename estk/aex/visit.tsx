function getAexProject(options: AexOptions): AexProject {
    const items = aeq.getItems().filter((item) => !aeq.isComp(item));
    const comps = aeq.getComps();

    const aexProject: AexProject = {
        items: items.map((item) => visitItem(item, options)),
        comps: comps.map((comp) => visitItem(comp, options)),
    };

    return aexProject;
}

function visitItem(item: Item, options: AexOptions): AexItem {
    if (aeq.isComp(item)) {
        return getAexComp(item as CompItem, options);
    }

    const itemParser = getItemParser(options);

    if (aeq.isFootageItem(item)) {
        return itemParser.parseFootageAttributes(item);
    } else {
        return itemParser.parseItemAttributes(item);
    }
}

function getAexComp(comp: CompItem, options: AexOptions): AexComp {
    const itemParser = getItemParser(options);
    const compAttributes = itemParser.parseCompItemAttributes(comp);

    /** @todo explore essential props */
    let essentialProps = [];

    const aexComp: AexComp = {
        ...compAttributes,

        /** Nested objects */
        markers: getAexCompMarkers(comp, options),
        layers: getCompLayers(comp, options),
        essentialProps: essentialProps.length > 0 ? essentialProps : undefined,
    };

    return aexComp;
}
