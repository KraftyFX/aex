function prescanLayer(aeLayer: Layer, state: AexState) {
    prescanMarkerProperties(aeLayer.marker, state);
    prescanTransform(aeLayer, state);

    switch (getAexLayerType(aeLayer)) {
        case AEX_TEXT_LAYER:
            return prescanTextLayer(aeLayer as TextLayer, state);
        case AEX_SHAPE_LAYER:
            return prescanShapeLayer(aeLayer as ShapeLayer, state);
        case AEX_NULL_LAYER:
        case AEX_FILE_LAYER:
        case AEX_PLACEHOLDER_LAYER:
        case AEX_FILE_LAYER:
        case AEX_COMP_LAYER:
            return prescanFootageLayer(aeLayer as AVLayer, state);
        case AEX_LIGHT_LAYER:
            return prescanLightLayer(aeLayer as LightLayer, state);
        case AEX_CAMERA_LAYER:
            return prescanCameraLayer(aeLayer as CameraLayer, state);
        default:
            throw fail(`Unrecognized Layer Type`);
    }
}

function getAexLayer(aeLayer: Layer, state: AexState): AexLayer {
    return profile(
        'getAexLayer',
        () => {
            switch (getAexLayerType(aeLayer)) {
                case AEX_TEXT_LAYER:
                    return getAexTextLayer(aeLayer as TextLayer, state);
                case AEX_SHAPE_LAYER:
                    return getAexShapeLayer(aeLayer as ShapeLayer, state);
                case AEX_NULL_LAYER:
                case AEX_FILE_LAYER:
                case AEX_PLACEHOLDER_LAYER:
                case AEX_SOLID_LAYER:
                case AEX_COMP_LAYER:
                    return getAexFootageLayer(aeLayer as AVLayer, state);
                case AEX_LIGHT_LAYER:
                    return getAexLightLayer(aeLayer as LightLayer, state);
                case AEX_CAMERA_LAYER:
                    return getAexCameraLayer(aeLayer as CameraLayer, state);
                default:
                    throw fail(`Unrecognized Layer Type`);
            }
        },
        state,
        aeLayer.name
    );
}

function createAeLayer(comp: CompItem, aexLayer: AexLayer, state: AexState) {
    assertIsDefined(comp);

    switch (aexLayer.type as AexLayerType) {
        case AEX_TEXT_LAYER:
            return createAeTextLayer(comp, aexLayer as AexTextLayer, state);
        case AEX_SHAPE_LAYER:
            return createAeShapeLayer(comp, aexLayer as AexShapeLayer, state);
        case AEX_NULL_LAYER:
        case AEX_FILE_LAYER:
        case AEX_PLACEHOLDER_LAYER:
        case AEX_SOLID_LAYER:
        case AEX_COMP_LAYER:
            return createAeFootageLayer(comp, aexLayer as AexFootageLayer, state);
        case AEX_LIGHT_LAYER:
            return createAeLightLayer(comp, aexLayer as AexLightLayer, state);
        case AEX_CAMERA_LAYER:
            return createAeCameraLayer(comp, aexLayer as AexCameraLayer, state);
        default:
            throw fail(`Unrecognized Layer Type ${aexLayer.type}`);
    }
}

function updateAeLayer(aeLayer: Layer, aexLayer: AexLayer, state: AexState) {
    switch (getAexLayerType(aeLayer)) {
        case AEX_TEXT_LAYER:
            return updateAexTextLayer(aeLayer as TextLayer, aexLayer as AexTextLayer, state);
        case AEX_SHAPE_LAYER:
            return updateAexShapeLayer(aeLayer as ShapeLayer, aexLayer as AexShapeLayer, state);
        case AEX_NULL_LAYER:
        case AEX_FILE_LAYER:
        case AEX_PLACEHOLDER_LAYER:
        case AEX_SOLID_LAYER:
        case AEX_COMP_LAYER:
            return updateAexFootageLayer(aeLayer as AVLayer, aexLayer as AexFootageLayer, state);
        case AEX_LIGHT_LAYER:
            return updateAexLightLayer(aeLayer as LightLayer, aexLayer as AexLightLayer, state);
        case AEX_CAMERA_LAYER:
            return updateAexCameraLayer(aeLayer as CameraLayer, aexLayer as AexCameraLayer, state);
        default:
            throw fail(`Unrecognized Layer Type`);
    }
}

function addToAeLayer(aeLayer: Layer, aexPropertyGroup: AexSerializedGroup, state: AexState) {
    assertIsDefined(aeLayer);

    switch (aexPropertyGroup.type as AexPropertyGroupType) {
        case AEX_DROPDOWN_EFFECT_PROPERTYGROUP:
        case AEX_EFFECT_PROPERTYGROUP:
            if (!isVisibleLayer(aeLayer)) {
                throw fail(`Can not add effects to layer '${aeLayer.name}'`);
            }

            return createLayerEffect(aeLayer, aexPropertyGroup as AexEffectPropertyGroup, state);

        case AEX_TEXT_ANIMATOR_PROPERTYGROUP:
            if (!aeq.isTextLayer(aeLayer)) {
                throw fail(`Can not add animator to non-Text Layer '${aeLayer.name}'`);
            }

            const animatorsGroup = aeLayer.text.property('ADBE Text Animators') as PropertyGroup;

            return createTextLayerAnimators(animatorsGroup, [aexPropertyGroup] as AexAnimatorPropertyGroup[], state);

        case AEX_LAYERSTYLE_PROPERTYGROUP:
            if (!isVisibleLayer(aeLayer)) {
                throw fail(`Can not add layer style to layer '${aeLayer.name}'`);
            }

            return setAvLayerStyle(aeLayer.layerStyle, aexPropertyGroup, state);

        case AEX_SHAPEGROUP_PROPERTYGROUP:
        case AEX_SHAPEITEM_PROPERTYGROUP:
            if (!aeq.isShapeLayer(aeLayer)) {
                throw fail(`Can not add shape group to non-Shape Layer '${aeLayer.name}'`);
            }

            const rootVectorsGroups = _getRootVectorsGroup(aeLayer);
            return setShapeContent(rootVectorsGroups, aexPropertyGroup as AexShapePropertyGroup, state);

        default:
            throw notImplemented(`Creating a '${aexPropertyGroup.type}' on a layer`);
    }
}

function getLayerAttributes(layer: Layer, state: AexState): AexLayerBase {
    const containingComp = layer.containingComp;
    const { name, label } = layer;

    return {
        name,
        label,

        comment: getModifiedValue(layer.comment, ''),
        hasVideo: getModifiedValue(layer.hasVideo, true),
        inPoint: getModifiedValue(layer.inPoint, 0),
        outPoint: getModifiedValue(layer.outPoint, containingComp.duration),
        startTime: getModifiedValue(layer.startTime, 0),
        shy: getModifiedValue(layer.shy, false),
        solo: getModifiedValue(layer.solo, false),
        stretch: getModifiedValue(layer.stretch, 100),
        parentLayerIndex: layer.parent ? layer.parent.index : undefined,

        markers: getAexMarkerProperties(layer.marker, state),
        transform: getAexTransform(layer, state),
    };
}

function setLayerAttributes(aeLayer: Layer, aexLayer: AexLayer, state: AexState): void {
    assignAttributes(aeLayer, {
        name: aexLayer.name,
        label: aexLayer.label,
        comment: aexLayer.comment,
        hasVideo: aexLayer.hasVideo,
        shy: aexLayer.shy,
        solo: aexLayer.solo,

        startTime: aexLayer.startTime,
        inPoint: aexLayer.inPoint,
        outPoint: aexLayer.outPoint,
    });

    _setLayerMarkers(aeLayer, aexLayer, state);
    updateLayerTransform(aeLayer, aexLayer.transform, state);
}

function setLayerParent(aeLayer: Layer, aexLayer: AexLayer, state: AexState) {
    if (aeq.isNullOrUndefined(aexLayer.parentLayerIndex)) {
        return;
    }

    const parentIndex = aexLayer.parentLayerIndex;
    const comp = aeLayer.containingComp;

    assertIsFalse(comp.numLayers < parentIndex, `Can't set parent to layer ${parentIndex}; comp only has ${comp.numLayers} layer(s).`);
    assertIsFalse(aeLayer.index === parentIndex, `Can't set layer parent to self.`);

    aeLayer.parent = comp.layer(parentIndex);
}

function _setLayerMarkers(aeLayer: Layer, aexLayer: AexLayer, state: AexState) {
    if (aeq.isNullOrUndefined(aexLayer.markers)) {
        return;
    }

    updateAeMarkers(aeLayer.marker, aexLayer.markers, state);
}

function getAexLayerType(aeLayer: Layer): AexLayerType {
    if (aeq.isTextLayer(aeLayer)) {
        return AEX_TEXT_LAYER;
    } else if (aeq.isShapeLayer(aeLayer)) {
        return AEX_SHAPE_LAYER;
    } else if (aeq.isAVLayer(aeLayer)) {
        return getAexAvFootageLayerType(aeLayer as AVLayer);
    } else if (aeq.isLightLayer(aeLayer)) {
        return AEX_LIGHT_LAYER;
    } else if (aeq.isCameraLayer(aeLayer)) {
        return AEX_CAMERA_LAYER;
    } else {
        throw fail(`Unrecognized Layer Type`);
    }
}
