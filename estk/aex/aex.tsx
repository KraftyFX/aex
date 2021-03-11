function aex(options: AexOptions) {
    const itemParsing = itemParser(options);
    const layerParsing = layerParser(options);

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
                markers = me.visitMarkers(comp.markerProperty);
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
        visitMarkers(markerProperty: Property<MarkerValue>): AexMarkerProperty[] {
            let markerData = [] as AexMarkerProperty[];

            for (let ii = 1, il = markerProperty.numKeys; ii <= il; ii++) {
                let time = markerProperty.keyTime(ii);
                let keyValue = markerProperty.keyValue(ii);

                const comment = getModifiedValue(keyValue.comment, '');
                const chapter = getModifiedValue(keyValue.chapter, '');
                const url = getModifiedValue(keyValue.url, '');
                const frameTarget = getModifiedValue(keyValue.frameTarget, '');
                const cuePointName = getModifiedValue(keyValue.cuePointName, '');
                const duration = getModifiedValue(keyValue.duration, 0);
                const parameters = keyValue.getParameters();
                const label = getModifiedValue(keyValue.label, 0);
                const protectedRegion = getModifiedValue(keyValue.protectedRegion, false);

                markerData.push({
                    time,
                    comment,
                    chapter,
                    url,
                    frameTarget,
                    cuePointName,
                    duration,
                    parameters: parameters.toSource() === '({})' ? undefined : parameters,
                    label,
                    protectedRegion,
                });
            }

            return markerData;
        },
        visitLayer(layer: Layer): AexLayer {
            let properties = {} as AexProperties;
            let layerAttributes = {} as AexLayerAttributes;
            if (aeq.isAVLayer(layer)) {
                layerAttributes = layerParsing.parseAVLayerAttributes(layer);
            }

            if (aeq.isLightLayer(layer)) {
                layerAttributes = layerParsing.parseLightLayerAttributes(layer);
            }

            if (aeq.isTextLayer(layer)) {
                layerAttributes = layerParsing.parseTextLayerAttributes(layer);
            }

            return {
                ...layerAttributes,

                properties: properties.toSource() === '({})' ? undefined : properties,
            };
        },
    };
}
