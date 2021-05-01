function getAexSolidItem(item: FootageItem, state: AexState): AexSolidItem {
    const itemAttributes = _getFootageItemAttributes(item, state);
    const itemSource = item.mainSource as SolidSource;

    return {
        ...itemAttributes,
        type: AEX_SOLID_ITEM,

        label: getModifiedValue(item.label, 1),
        color: getModifiedValue(itemSource.color, [0, 0, 0]),
    };
}

function createAeSolid(aexSolid: AexSolidItem, state: AexState): FootageItem {
    const tempComp = aeq.comp.create();

    const solidSettings = {
        color: [0, 0, 0] as ThreeDColorValue,
        name: 'New Solid',
        width: 1920,
        height: 1080,
        pixelAspect: 1,
        duration: 0,
    };

    assignAttributes(solidSettings, aexSolid);

    const aeSolid = tempComp.layers.addSolid(
        solidSettings.color,
        solidSettings.name,
        solidSettings.width,
        solidSettings.height,
        solidSettings.pixelAspect,
        solidSettings.duration
    );

    const source = aeSolid.source; // Types for adobe needs to be AVItem

    tempComp.remove();

    return source as FootageItem;
}

function updateAeSolid(aeSolid: FootageItem, aexSolid: AexSolidItem, state: AexState) {
    assignAttributes(aeSolid, {
        color: aexSolid.color,
        name: aexSolid.name,
        width: aexSolid.width,
        height: aexSolid.height,
        pixelAspect: aexSolid.pixelAspect,
        duration: aexSolid.duration,
    });
}
