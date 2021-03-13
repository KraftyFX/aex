function getLayerMarkers(layer: Layer, options: AexOptions) {
    const propertyParser = getPropertyParser(options);

    if (layer.marker.isModified) {
        return propertyParser.parseMarkers(layer.marker);
    } else {
        return undefined;
    }
}

function getLayerParser(options: AexOptions) {
    const propertyParser = getPropertyParser(options);

    return {
        parseLayerAttributes(layer: Layer): AexLayerAttributes {
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

            if (aeq.isShapeLayer(layer)) {
                layerType = 'ShapeLayer';
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
            };
        },
        parseAVLayerAttributes(layer: AVLayer): AexAVLayerAttributes {
            const layerAttributes = this.parseLayerAttributes(layer);
            layerAttributes.layerType = 'AVLayer';

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

            return {
                ...layerAttributes,

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
        },
        parseLightLayerAttributes(layer: LightLayer): AexLightLayerAttributes {
            const layerAttributes = this.parseLayerAttributes(layer);
            layerAttributes.layerType = 'LightLayer';
            layerAttributes.hasVideo = getModifiedValue(layer.hasVideo, false);

            const lightType = layer.lightType;
            return {
                ...layerAttributes,
                lightType,
            };
        },
        parseTextLayerAttributes(layer: TextLayer): AexTextLayerAttributes {
            const layerAttributes = this.parseLayerAttributes(layer);
            layerAttributes.layerType = 'TextLayer';

            const threeDPerChar = layer.threeDLayer ? getModifiedValue(layer.threeDPerChar, false) : undefined;
            return {
                ...layerAttributes,
                threeDPerChar,
            };
        },

        parseTransform(layer: Layer): AexTransform {
            const transformGroup = layer.transform;

            const anchorPoint = propertyParser.getModifiedProperty(transformGroup.anchorPoint);
            const position = propertyParser.getModifiedProperty(transformGroup.position);
            const scale = propertyParser.getModifiedProperty(transformGroup.scale);
            let rotation = propertyParser.getModifiedProperty(transformGroup.rotation);
            const opacity = propertyParser.getModifiedProperty(transformGroup.opacity);

            let pointOfInterest;
            let orientation;
            let xRotation;
            let yRotation;

            if (aeq.isCamera(layer) || aeq.isLight(layer) || (aeq.isAVLayer(layer) && layer.threeDLayer)) {
                pointOfInterest = propertyParser.getModifiedProperty(transformGroup.pointOfInterest);
                orientation = propertyParser.getModifiedProperty(transformGroup.orientation);
                xRotation = propertyParser.getModifiedProperty(transformGroup.xRotation);
                yRotation = propertyParser.getModifiedProperty(transformGroup.yRotation);
                rotation = propertyParser.getModifiedProperty(transformGroup.zRotation);
            }

            return {
                anchorPoint,
                position,
                scale,
                rotation,
                opacity,
                pointOfInterest,
                orientation,
                xRotation,
                yRotation,
            };
        },
    };
}
