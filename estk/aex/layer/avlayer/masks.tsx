function _getAexLayerMasks(layer: Layer, state: AexState): AexMask[] {
    const masks = [];

    if (!isVisibleLayer(layer)) {
        return masks;
    }

    forEachPropertyInGroup(layer.mask, (mask: MaskPropertyGroup) => {
        const { name, color } = mask;

        masks.push({
            name,
            color,
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
    });

    return masks;
}
