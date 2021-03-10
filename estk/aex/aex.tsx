function aex(options: AexOptions) {
    return {
        toObject(item: Serializable): AexProject {
            assertIsDefined(item, 'item');

            if (aeq.isComp(item)) {
                return {
                    comps: [this.visitComp(item as CompItem)],
                };
            } else if (aeq.isLayer(item)) {
                return {
                    comps: [
                        {
                            layers: [this.visitLayer(item as Layer)],
                        },
                    ],
                };
            } else {
                return {
                    comps: [],
                };
            }
        },
        visitComp(comp: CompItem): AexComp {
            const {
                dropFrame,
                duration,
                frameRate,
                height,
                motionBlurAdaptiveSampleLimit,
                motionBlurSamplesPerFrame,
                name,
                parentFolder,
                pixelAspect,
                renderer,
                shutterAngle,
                shutterPhase,
                width,
            } = comp;

            const bgColor = getModifiedValue(comp.bgColor, [0, 0, 0]);
            const comment = getModifiedValue(comp.comment, '');
            const displayStartFrame = getModifiedValue(comp.displayStartFrame, 0);
            const displayStartTime = getModifiedValue(comp.displayStartTime, 0);
            const draft3d = getModifiedValue(comp.draft3d, false);
            const frameBlending = getModifiedValue(comp.frameBlending, false);
            const hideShyLayers = getModifiedValue(comp.hideShyLayers, false);
            const label = getModifiedValue(comp.label, 15);
            const motionBlur = getModifiedValue(comp.motionBlur, false);
            const preserveNestedFrameRate = getModifiedValue(comp.preserveNestedFrameRate, false);
            const preserveNestedResolution = getModifiedValue(comp.preserveNestedResolution, false);
            const resolutionFactor = getModifiedValue(comp.resolutionFactor, [1, 1]);
            const workAreaStart = getModifiedValue(comp.workAreaStart, 0);
            const workAreaDuration = comp.workAreaDuration === duration ? undefined : comp.workAreaDuration;

            /**
             * @todo Add AexOption to preserve project folder structure.
             * For now, just get the immediate parent folder name & assume lives in root
             **/
            const folder = parentFolder.name === 'Root' ? undefined : parentFolder.name;

            let layers = [] as AexLayer[];
            const me = this;
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
                /** Item data */
                comment,
                label,
                name,

                /** CompItem data */
                duration,
                folder,
                frameRate,
                height,
                pixelAspect,
                width,

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
            return {
                props: [],
            };
        },
    };
}
