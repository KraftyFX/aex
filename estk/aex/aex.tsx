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
            let {
                comment,
                label,
                parentFolder,
                duration,
                frameRate,
                height,
                name,
                pixelAspect,
                width,
                bgColor,
                // displayStartFrame,
                displayStartTime,
                draft3d,
                dropFrame,
                frameBlending,
                frameDuration,
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
            } = comp;

            /**
             * @todo Add AexOption to preserve project folder structure.
             * For now, just get the immediate parent folder name & assume lives in root
             **/
            const folder = parentFolder.name;

            let layers = [] as AexLayer[];
            const me = this;
            aeq.forEachLayer(comp, function (layer: Layer) {
                let layerData = me.visitLayer(layer);
                layers.push(layerData);
            });

            /** @todo parse comp markers */
            let compMarkers = [];

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
                // displayStartFrame,
                displayStartTime,
                draft3d,
                dropFrame,
                frameBlending,
                frameDuration,
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
                compMarkers,
                essentialProps,
            };
        },
        visitLayer(layer: Layer): AexLayer {
            return {
                props: [],
            };
        },
    };
}
