function aex(options: AexOptions) {
    const itemParsing = itemParser(options);
    const layerParsing = layerParser(options);
    const propertyParsing = propertyParser(options);

    return {
        toObject(item: Serializable): AexProject {
            assertIsDefined(item, 'item');

            if (isProject(item)) {
                return this.visitProject();
            } else if (aeq.isComp(item)) {
                return {
                    items: [],
                    comps: [this.visitComp(item as CompItem)],
                };
            } else if (aeq.isLayer(item)) {
                return {
                    items: [],
                    comps: [
                        {
                            layers: [this.visitLayer(item as Layer)],
                        },
                    ],
                };
            } else {
                return {
                    items: [],
                    comps: [],
                };
            }
        },
        visitProject(): AexProject {
            const me = this;

            const items = aeq.getItems().filter(function (item) {
                return !aeq.isComp(item);
            });
            const comps = aeq.getComps();

            return {
                items: [
                    ...items.map(function (item) {
                        return me.visitItem(item);
                    }),
                ],
                comps: [
                    ...comps.map(function (comp) {
                        return me.visitComp(comp);
                    }),
                ],
            };
        },
        visitItem(item: Item): AexItem {
            if (aeq.isFootageItem(item)) {
                return itemParsing.parseFootageAttributes(item);
            }

            if (aeq.isComp(item)) {
                return this.visitComp(item as CompItem);
            }

            return itemParsing.parseItemAttributes(item);
        },
        visitComp(comp: CompItem): AexComp {
            const compAttributes = itemParsing.parseCompItemAttributes(comp);

            const me = this;
            let layers = [] as AexLayer[];
            aeq.forEachLayer(comp, function (layer: Layer) {
                let layerData = me.visitLayer(layer);
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
        },
        visitLayer(layer: Layer): AexLayer {
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

            let properties = layerParsing.parseLayerProperties(layer);

            return {
                ...layerAttributes,
                properties,
            };
        },
    };
}
