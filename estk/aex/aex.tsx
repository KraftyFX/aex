function aex(options: AexOptions) {
    const items = itemParser(options);

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
                return items.parseFootageAttributes(item);
            }

            return this.visitComp(item as CompItem);
        },
        visitComp(comp: CompItem): AexComp {
            const compAttributes = items.parseCompItemAttributes(comp);

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
                const label = getModifiedValue(keyValue.label, 0);
                const protectedRegion = getModifiedValue(keyValue.protectedRegion, false);

                const markerParameters = keyValue.getParameters();
                let parameters = markerParameters.toSource() === '({})' ? undefined : markerParameters;

                markerData.push({
                    time,
                    comment,
                    chapter,
                    url,
                    frameTarget,
                    cuePointName,
                    duration,
                    parameters,
                    label,
                    protectedRegion,
                });
            }

            return markerData;
        },
        visitLayer(layer: Layer): AexLayer {
            const containingComp = layer.containingComp;

            const name = layer.name;
            const label = layer.label;
            let layerType = 'Layer' as AexLayerType;

            const comment = getModifiedValue(layer.comment, '');
            let hasVideo = getModifiedValue(layer.hasVideo, true);
            const inPoint = getModifiedValue(layer.inPoint, 0);
            const outPoint = getModifiedValue(layer.outPoint, containingComp.duration);
            const startTime = getModifiedValue(layer.startTime, 0);
            const stretch = getModifiedValue(layer.stretch, 100);
            const nullLayer = getModifiedValue(layer.nullLayer, false);
            const shy = getModifiedValue(layer.shy, false);
            const solo = getModifiedValue(layer.solo, false);

            const parentLayerIndex = layer.parent ? layer.parent.index : undefined;

            let properties = {} as AexProperties;
            let avAttributes = {} as AexAVLayerAttributes;
            if (aeq.isAVLayer(layer)) {
                layerType = 'AVLayer';

                /** @todo Handle track matte */
                /** @todo Handle source */
                const source = layer.source;

                const adjustmentLayer = getModifiedValue(layer.adjustmentLayer, false);
                const audioEnabled = getModifiedValue(layer.audioEnabled, true);
                const autoOrient = getModifiedValue(layer.autoOrient, AutoOrientType.NO_AUTO_ORIENT);
                const blendingMode = getModifiedValue(layer.blendingMode, BlendingMode.NORMAL);
                const collapseTransformation = getModifiedValue(layer.collapseTransformation, false);
                const effectsActive = getModifiedValue(layer.effectsActive, true);
                const environmentLayer = getModifiedValue(layer.environmentLayer, false);
                const frameBlending = getModifiedValue(layer.frameBlending, false);
                const frameBlendingType = frameBlending ? getModifiedValue(layer.frameBlendingType, FrameBlendingType.NO_FRAME_BLEND) : undefined;
                const guideLayer = getModifiedValue(layer.guideLayer, false);
                const motionBlur = getModifiedValue(layer.motionBlur, false);
                const preserveTransparency = getModifiedValue(layer.preserveTransparency, false);
                const quality = getModifiedValue(layer.quality, LayerQuality.BEST);
                const samplingQuality = getModifiedValue(layer.samplingQuality, LayerSamplingQuality.BILINEAR);
                const threeDLayer = getModifiedValue(layer.threeDLayer, false);
                const timeRemapEnabled = getModifiedValue(layer.timeRemapEnabled, false);
                const trackMatteType = getModifiedValue(layer.trackMatteType, TrackMatteType.NO_TRACK_MATTE);

                avAttributes = {
                    adjustmentLayer,
                    audioEnabled,
                    autoOrient,
                    blendingMode,
                    collapseTransformation,
                    effectsActive,
                    environmentLayer,
                    frameBlending,
                    frameBlendingType,
                    guideLayer,
                    motionBlur,
                    preserveTransparency,
                    quality,
                    samplingQuality,
                    threeDLayer,
                    timeRemapEnabled,
                    trackMatteType,
                };
            }

            if (aeq.isShapeLayer(layer)) {
                layerType = 'ShapeLayer';
            }

            let lightAttributes = {} as AexLightLayerAttributes;
            if (aeq.isLightLayer(layer)) {
                hasVideo = getModifiedValue(layer.hasVideo, false);
                layerType = 'LightLayer';

                const lightType = layer.lightType;
                lightAttributes = {
                    lightType,
                };
            }

            let textAttributes = {} as AexTextLayerAttributes;
            if (aeq.isTextLayer(layer)) {
                layerType = 'TextLayer';

                const threeDPerChar = layer.threeDLayer ? getModifiedValue(layer.threeDPerChar, false) : undefined;
                textAttributes = {
                    threeDPerChar,
                };
            }

            if (aeq.isCameraLayer(layer)) {
                hasVideo = getModifiedValue(layer.hasVideo, false);
                layerType = 'CameraLayer';
            }

            return {
                name,
                label,
                layerType,

                comment,
                hasVideo,
                inPoint,
                outPoint,
                startTime,
                stretch,
                nullLayer,
                shy,
                solo,
                parentLayerIndex,

                properties,

                ...avAttributes,
                ...lightAttributes,
                ...textAttributes,
            };
        },
    };
}
