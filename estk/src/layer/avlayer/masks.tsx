function prescanAvLayerMask(aeAvLayer: AVLayer, state: AexState) {
    state.stats.propertyCount += prescanPropertyGroup(aeAvLayer.mask, state) * 4;
}

function _getAexLayerMasks(layer: AVLayer, state: AexState): AexMask[] {
    const masks = [];

    if (!isVisibleLayer(layer)) {
        return masks;
    }

    forEachPropertyInGroup(
        layer.mask,
        (mask: MaskPropertyGroup) => {
            const { name } = mask;

            masks.push({
                name,
                color: roundArray(mask.color),
                maskMode: getModifiedValue(mask.maskMode, MaskMode.ADD),
                inverted: getModifiedValue(mask.inverted, false),
                rotoBezier: getModifiedValue(mask.rotoBezier, false),
                maskMotionBlur: getModifiedValue(mask.maskMotionBlur, MaskMotionBlur.SAME_AS_LAYER),
                locked: getModifiedValue(mask.locked, false),

                maskPath: getModifiedProperty(mask.maskPath, state),
                maskFeather: getModifiedProperty(mask.maskFeather, state),
                maskOpacity: getModifiedProperty(mask.maskOpacity, state),
                maskExpansion: getModifiedProperty(mask.maskExpansion, state),
            });
        },
        state
    );

    return masks;
}

function setAvLayerMasks(aeAvLayer: AVLayer, aexAvLayer: AexAVLayer, state: AexState) {
    const masks: MaskPropertyGroup = aeAvLayer.mask;
    const aexMasks: AexMask[] = aexAvLayer.masks;

    aeq.arrayEx(aexMasks).forEach((aexMask: AexMask) => {
        const mask = masks.addProperty('ADBE Mask Atom') as MaskPropertyGroup;

        assignAttributes(mask, {
            name: aexMask.name,
            color: aexMask.color,
            maskMode: aexMask.maskMode,
            inverted: aexMask.inverted,
            rotoBezier: aexMask.rotoBezier,
            maskMotionBlur: aexMask.maskMotionBlur,
            locked: aexMask.locked,
        });

        if (!aeq.isNullOrUndefined(aexMask.maskPath)) {
            setProperty(mask.maskPath, aexMask.maskPath, state);
        }

        if (!aeq.isNullOrUndefined(aexMask.maskFeather)) {
            setProperty(mask.maskFeather, aexMask.maskFeather, state);
        }

        if (!aeq.isNullOrUndefined(aexMask.maskOpacity)) {
            setProperty(mask.maskOpacity, aexMask.maskOpacity, state);
        }

        if (!aeq.isNullOrUndefined(aexMask.maskExpansion)) {
            setProperty(mask.maskExpansion, aexMask.maskExpansion, state);
        }
    });
}
