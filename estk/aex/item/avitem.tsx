function _getAVItemBaseAttributes(item: AVItem): AexAVItemBase {
    const itemBaseAttributes = getItemBaseAttributes(item);
    const { duration, frameRate, height, pixelAspect, width } = item;

    return {
        ...itemBaseAttributes,

        duration,
        frameRate,
        height,
        pixelAspect,
        width,
    };
}
