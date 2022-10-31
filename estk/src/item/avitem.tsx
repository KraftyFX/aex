function getAvItemBaseAttributes(aeAvItem: AVItem): AexAVItemBase {
    const itemBaseAttributes = getItemBaseAttributes(aeAvItem);
    const { height, width } = aeAvItem;

    const duration = getModifiedValue(aeAvItem.duration, 0);
    const frameRate = getModifiedValue(aeAvItem.frameRate, 0);
    const pixelAspect = getModifiedValue(aeAvItem.pixelAspect, 1);

    return {
        ...itemBaseAttributes,

        duration,
        frameRate,
        height,
        pixelAspect,
        width,
    };
}

function setAvItemBaseAttributes(aeItem: AVItem, aexItem: AexAVItemBase, state: AexState): void {
    setItemBaseAttributes(aeItem, aexItem, state);

    assignAttributes(aeItem, {
        duration: aexItem.duration,
        frameRate: aexItem.frameRate,
        pixelAspect: aexItem.pixelAspect,

        height: aeItem instanceof SolidSource || aeItem instanceof CompItem ? aexItem.height : undefined,
        width: aeItem instanceof SolidSource || aeItem instanceof CompItem ? aexItem.width : undefined,
    });
}
