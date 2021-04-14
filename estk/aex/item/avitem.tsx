function _getAVItemAttributes(item: AVItem): AexAVItemBase {
    const { duration, frameRate, height, pixelAspect, width } = item;
    const itemAttributes = _getItemAttributes(item);

    return {
        ...itemAttributes,

        duration,
        frameRate,
        height,
        pixelAspect,
        width,
    };
}
