function getAvItemBaseAttributes(aeAvItem: AVItem): AexAVItemBase {
    const itemBaseAttributes = getItemBaseAttributes(aeAvItem);
    const { height, pixelAspect, width } = aeAvItem;

    let duration = getModifiedValue(aeAvItem.duration, 0);
    let frameRate = getModifiedValue(aeAvItem.frameRate, 0);

    return {
        ...itemBaseAttributes,

        duration,
        frameRate,
        height,
        pixelAspect,
        width,
    };
}
