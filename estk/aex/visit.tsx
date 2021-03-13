function visitProject(options: AexOptions): AexProject {
    const items = aeq.getItems().filter(function (item) {
        return !aeq.isComp(item);
    });
    const comps = aeq.getComps();

    return {
        items: [
            ...items.map(function (item) {
                return visitItem(item, options);
            }),
        ],
        comps: [
            ...comps.map(function (comp) {
                return visitComp(comp, options);
            }),
        ],
    };
}

function visitItem(item: Item, options: AexOptions): AexItem {
    const itemParsing = itemParser(options);

    if (aeq.isFootageItem(item)) {
        return itemParsing.parseFootageAttributes(item);
    }

    if (aeq.isComp(item)) {
        return visitComp(item as CompItem, options);
    }

    return itemParsing.parseItemAttributes(item);
}

function visitComp(comp: CompItem, options: AexOptions): AexComp {
    const itemParsing = itemParser(options);
    const compAttributes = itemParsing.parseCompItemAttributes(comp);
    const propertyParsing = propertyParser(options);

    let layers = [] as AexLayer[];
    aeq.forEachLayer(comp, function (layer: Layer) {
        let layerData = visitLayer(layer, options);
        layers.push(layerData);
    });

    let markers;
    if (comp.markerProperty.isModified) {
        markers = propertyParsing.parseMarkers(comp.markerProperty);
    }

    /** @todo explore essential props */
    let essentialProps = [];

    return {
        ...compAttributes,

        /** Nested objects */
        markers,
        layers: layers.length > 0 ? layers : undefined,
        essentialProps: essentialProps.length > 0 ? essentialProps : undefined,
    };
}

function visitLayer(layer: Layer, options: AexOptions): AexLayer {
    const layerParsing = layerParser(options);
    let properties = {} as AexProperties;
    let layerAttributes = {} as AexLayerAttributes;
    if (aeq.isAVLayer(layer)) {
        layerAttributes = layerParsing.parseAVLayerAttributes(layer);
    } else if (aeq.isLightLayer(layer)) {
        layerAttributes = layerParsing.parseLightLayerAttributes(layer);
    } else if (aeq.isTextLayer(layer)) {
        layerAttributes = layerParsing.parseTextLayerAttributes(layer);
    } else {
        layerAttributes = layerParsing.parseLayerAttributes(layer);
    }

    const propertyParsing = propertyParser(options);
    let transform = layerParsing.parseTransform(layer);
    let markers;
    if (layer.marker.isModified) {
        markers = propertyParsing.parseMarkers(layer.marker);
    }

    return {
        ...layerAttributes,

        markers,
        transform,
        properties: properties.toSource() === '({})' ? undefined : properties,
    };
}
