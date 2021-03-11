function aex(options: AexOptions) {
    return {
        toObject(item: Serializable): AexProject {
            assertIsDefined(item, 'item');

            if (isProject(item)) {
                return this.visitProject(item);
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
        visitProject(project: Project): AexProject {
            var me = this;

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
            const { name, parentFolder } = item;

            let layerType = 'Footage' as AexItemType;

            const comment = getModifiedValue(item.comment, '');
            const label = getModifiedValue(item.label, 15);

            /**
             * @todo Add AexOption to preserve project folder structure.
             * For now, just get the immediate parent folder name & assume lives in root
             **/
            const folder = parentFolder.name === 'Root' ? undefined : parentFolder.name;

            if (aeq.isFolderItem(item)) {
                layerType = 'Folder';
            }

            let footageAttributes = {} as AexAVItem;
            if (aeq.isFootageItem(item)) {
                const itemSource = item.mainSource;

                const alphaMode = getModifiedValue(itemSource.alphaMode, AlphaMode.STRAIGHT);
                const conformFrameRate = getModifiedValue(itemSource.conformFrameRate, 0);
                const fieldSeparationType = getModifiedValue(itemSource.fieldSeparationType, FieldSeparationType.OFF);
                const highQualityFieldSeparation = getModifiedValue(itemSource.highQualityFieldSeparation, false);
                const loop = getModifiedValue(itemSource.loop, 1);
                const premulColor = getModifiedValue(itemSource.premulColor, [0, 0, 0]);
                const removePulldown = getModifiedValue(itemSource.removePulldown, PulldownPhase.OFF);

                const invertAlpha = itemSource.hasAlpha === false || alphaMode === AlphaMode.IGNORE ? undefined : itemSource.invertAlpha;

                let fileSourceAttributes = {} as AexFileSourceAttributes;
                let solidSourceAttributes = {} as AexSoldSourceAttributes;
                if (sourceIsFile(itemSource)) {
                    /** @todo Explore file handling */
                    fileSourceAttributes.file = itemSource.file.fsName;
                } else if (sourceIsSolid(itemSource)) {
                    layerType = 'Solid';
                    solidSourceAttributes.color = getModifiedValue(itemSource.color, [0, 0, 0]);
                } else if (sourceIsPlaceholder(itemSource)) {
                    layerType = 'Placeholder';
                }

                const avItemAttributes = this.visitAVItem(item);

                footageAttributes = {
                    alphaMode,
                    conformFrameRate,
                    highQualityFieldSeparation,
                    fieldSeparationType,
                    loop,
                    premulColor,
                    removePulldown,
                    invertAlpha,

                    ...avItemAttributes,
                    ...fileSourceAttributes,
                    ...solidSourceAttributes,
                };
            }
            return {
                name,
                layerType,
                comment,
                label,
                folder,

                ...footageAttributes,
            };
        },
        visitAVItem(item: AVItem): AexAVItem {
            const { duration, frameRate, height, pixelAspect, width } = item;

            return {
                duration,
                frameRate,
                height,
                pixelAspect,
                width,
            };
        },
        visitComp(comp: CompItem): AexComp {
            const { dropFrame, motionBlurAdaptiveSampleLimit, motionBlurSamplesPerFrame, renderer, shutterAngle, shutterPhase } = comp;

            const itemAttributes = this.visitItem(comp);

            const bgColor = getModifiedValue(comp.bgColor, [0, 0, 0]);
            const displayStartFrame = getModifiedValue(comp.displayStartFrame, 0);
            const displayStartTime = getModifiedValue(comp.displayStartTime, 0);
            const draft3d = getModifiedValue(comp.draft3d, false);
            const frameBlending = getModifiedValue(comp.frameBlending, false);
            const hideShyLayers = getModifiedValue(comp.hideShyLayers, false);
            const motionBlur = getModifiedValue(comp.motionBlur, false);
            const preserveNestedFrameRate = getModifiedValue(comp.preserveNestedFrameRate, false);
            const preserveNestedResolution = getModifiedValue(comp.preserveNestedResolution, false);
            const resolutionFactor = getModifiedValue(comp.resolutionFactor, [1, 1]);
            const workAreaStart = getModifiedValue(comp.workAreaStart, 0);
            const workAreaDuration = getModifiedValue(comp.workAreaDuration, comp.duration);

            var me = this;
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
                ...itemAttributes,

                /** Comp internal data */
                bgColor,
                displayStartFrame,
                displayStartTime,
                draft3d,
                dropFrame,
                frameBlending,
                hideShyLayers,
                motionBlur,
                motionBlurAdaptiveSampleLimit,
                motionBlurSamplesPerFrame,
                preserveNestedFrameRate,
                preserveNestedResolution,
                renderer,
                resolutionFactor,
                shutterAngle,
                shutterPhase,
                workAreaDuration,
                workAreaStart,

                /** Nested objects */
                layers,
                markers,
                essentialProps,
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
