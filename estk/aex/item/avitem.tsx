function getAvItemBaseAttributes(aeAvItem: AVItem): AexAVItemBase {
    const itemBaseAttributes = getItemBaseAttributes(aeAvItem);
    const { duration, frameRate, height, pixelAspect, width } = aeAvItem;

    return {
        ...itemBaseAttributes,

        duration,
        frameRate,
        height,
        pixelAspect,
        width,
    };
}
