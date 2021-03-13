function visitProject(options: AexOptions): AexProject {
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
        return visitComp(item as CompItem, options);
    }

    const itemParser = getItemParser(options);

    if (aeq.isFootageItem(item)) {
        return itemParser.parseFootageAttributes(item);
    } else {
        return itemParser.parseItemAttributes(item);
    }
}

function visitComp(comp: CompItem, options: AexOptions): AexComp {
    const itemParser = getItemParser(options);
    const compAttributes = itemParser.parseCompItemAttributes(comp);

    /** @todo explore essential props */
    let essentialProps = [];

    const aexComp: AexComp = {
        ...compAttributes,

        /** Nested objects */
        markers: getPropertyMarkers(comp, options),
        layers: getCompLayers(comp, options),
        essentialProps: essentialProps.length > 0 ? essentialProps : undefined,
    };

    return aexComp;
}

function visitLayer(layer: Layer, options: AexOptions): AexLayer {
    const layerParser = getLayerParser(options);
    let layerAttributes = {} as AexLayerAttributes;

    if (aeq.isAVLayer(layer)) {
        layerAttributes = layerParser.parseAVLayerAttributes(layer);
    } else if (aeq.isLightLayer(layer)) {
        layerAttributes = layerParser.parseLightLayerAttributes(layer);
    } else if (aeq.isTextLayer(layer)) {
        layerAttributes = layerParser.parseTextLayerAttributes(layer);
    } else {
        layerAttributes = layerParser.parseLayerAttributes(layer);
    }

    const propertyParser = getPropertyParser(options);

    let transform = layerParser.parseTransform(layer);
    let markers;

    if (layer.marker.isModified) {
        markers = propertyParser.parseMarkers(layer.marker);
    }

    let properties = {} as AexProperties;

    const aexLayer: AexLayer = {
        ...layerAttributes,

        markers,
        transform,
        properties: properties.toSource() === '({})' ? undefined : properties,
    };

    return aexLayer;
}
