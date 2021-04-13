function getAexLayer(layer: Layer, state: AexState): AexLayer & AexObject {
    state.stats.layerCount++;

    if (aeq.isTextLayer(layer)) {
        return _getTextLayer(layer, state);
    } else if (aeq.isShapeLayer(layer)) {
        return _getShapeLayer(layer, state);
    } else if (isNullLayer(layer)) {
        return _getNullLayer(layer, state);
    } else if (aeq.isAVLayer(layer)) {
        // The if check should be something like isFootageLayer()
        return _getFootageLayer(layer, state);
    } else if (aeq.isLightLayer(layer)) {
        return _getLightLayer(layer, state);
    } else if (aeq.isCameraLayer(layer)) {
        return _getCameraLayer(layer, state);
    } else {
        throw new Error(`Unrecognized Layer Type`);
    }
}

type CustomPropertyHandler<T extends AexPropertyGroup = AexPropertyGroup> = (propertyGroup: PropertyGroup, aexPropertyGroup: T) => void;

function _getUnnestedPropertyGroup<T extends AexPropertyGroup = AexPropertyGroup>(
    propertyGroup: PropertyGroup,
    callback: CustomPropertyHandler<T> | null,
    state: AexState
): T[] {
    callback = callback || (() => {});
    const result: T[] = [];

    forEachPropertyInGroup(propertyGroup, (childPropertyGroup: PropertyGroup) => {
        const { name, matchName } = childPropertyGroup;
        const enabled = getModifiedValue(childPropertyGroup.enabled, true);
        const aexGroup = {
            name,
            matchName,
            enabled,

            properties: null,
        } as T;

        /**
         * @todo
         * getPropertyGroup() is set up so that if there's no data, it doesn't return the group at all.
         * This means that if there's a layer effect that has defaults, effects: [] will be empty
         * However, we _always_ want to return the effects if they're present, even if the properties are default.
         *
         * This approach below sucks because we're repeating work.
         * Best would be to still return enabled/matchName/name, with an empty properties array.
         * This could be accomplished by adding an optional parameter to getPropertyGroup for whether to return undefined if empty or not
         * In cases like masks & effects, this would be false. Otherwise true.
         */

        callback(childPropertyGroup, aexGroup);

        if (aexGroup.properties === null) {
            const propertyData = getPropertyGroup(childPropertyGroup, state);
            aexGroup.properties = propertyData ? propertyData.properties : undefined;
        }

        result.push(aexGroup);
    });

    return result;
}

function _getLayer(layer: Layer, state: AexState): AexLayer {
    const containingComp = layer.containingComp;

    const { name, label } = layer;

    const comment = getModifiedValue(layer.comment, '');
    const hasVideo = getModifiedValue(layer.hasVideo, true);
    const inPoint = getModifiedValue(layer.inPoint, 0);
    const outPoint = getModifiedValue(layer.outPoint, containingComp.duration);
    const startTime = getModifiedValue(layer.startTime, 0);
    const stretch = getModifiedValue(layer.stretch, 100);
    const shy = getModifiedValue(layer.shy, false);
    const solo = getModifiedValue(layer.solo, false);

    const parentLayerIndex = layer.parent ? layer.parent.index : undefined;

    return {
        name,
        label,

        comment,
        hasVideo,
        inPoint,
        outPoint,
        startTime,
        stretch,
        shy,
        solo,
        parentLayerIndex,
        markers: getAexMarkerProperties(layer.marker),
        transform: _getTransform(layer, state),
    };
}

function _getTransform(layer: Layer, state: AexState): AexTransform {
    const transformGroup = layer.transform;

    const anchorPoint = getModifiedProperty(transformGroup.anchorPoint, state);
    const position = getModifiedProperty(transformGroup.position, state);
    const scale = getModifiedProperty(transformGroup.scale, state);
    const opacity = getModifiedProperty(transformGroup.opacity, state);

    // 3d & Camera properties
    const pointOfInterest = getModifiedProperty(transformGroup.pointOfInterest, state);
    const orientation = getModifiedProperty(transformGroup.orientation, state);
    const xRotation = getModifiedProperty(transformGroup.xRotation, state);
    const yRotation = getModifiedProperty(transformGroup.yRotation, state);
    const rotation = getZRotation(layer, transformGroup, state);

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
}

/**
 * For 3d layers (or camera/lights), we want to use the zRotation property
 * for 'rotation' instead of the standard 'rotation' property.
 *
 * AVLayers have a .threeDLayer member, but Camera & Light do not-- hence this check
 */
function getZRotation(layer: Layer, transformGroup: _TransformGroup, state: AexState) {
    if (aeq.isCamera(layer) || aeq.isLight(layer) || (aeq.isAVLayer(layer) && layer.threeDLayer)) {
        return getModifiedProperty(transformGroup.zRotation, state);
    } else {
        return getModifiedProperty(transformGroup.rotation, state);
    }
}
