function getFootageItem(item: FootageItem, state: AexState): AexFootageItem {
    const itemSource = item.mainSource;

    if (sourceIsFile(itemSource)) {
        return _getFileItem(item, state);
    } else if (sourceIsSolid(itemSource)) {
        return _getSolidItem(item, state);
    } else if (sourceIsPlaceholder(itemSource)) {
        return _getPlaceholderItem(item, state);
    }
}

function _getFootageItemAttributes(item: FootageItem, state: AexState): AexFootageItemBase {
    const avItemBaseAttributes = getAVItemBaseAttributes(item);
    const itemSource = item.mainSource;

    const alphaMode = getModifiedValue(itemSource.alphaMode, AlphaMode.STRAIGHT);
    const invertAlpha = _getInvertAlphaValue(itemSource, alphaMode);

    state.stats.nonCompItemCount++;

    return {
        ...avItemBaseAttributes,

        conformFrameRate: getModifiedValue(itemSource.conformFrameRate, 0),
        fieldSeparationType: getModifiedValue(itemSource.fieldSeparationType, FieldSeparationType.OFF),
        highQualityFieldSeparation: getModifiedValue(itemSource.highQualityFieldSeparation, false),
        loop: getModifiedValue(itemSource.loop, 1),
        premulColor: getModifiedValue(itemSource.premulColor, [0, 0, 0] as ThreeDColorValue),
        removePulldown: getModifiedValue(itemSource.removePulldown, PulldownPhase.OFF),
        alphaMode,
        invertAlpha,
    };
}

function _getInvertAlphaValue(itemSource: FileSource | SolidSource | PlaceholderSource, alphaMode: AlphaMode) {
    return itemSource.hasAlpha === false || alphaMode === AlphaMode.IGNORE ? undefined : itemSource.invertAlpha;
}

function _createFootageItem(aexFootage: AexFootageItem, state: AexState): FootageItem {
    let footageItem;

    switch (aexFootage.type) {
        case AEX_FILE_FOOTAGE_ITEM:
            break;
        case AEX_SOLID_ITEM:
            footageItem = _createSolid(aexFootage as AexSolidItem, state);
            break;
        case AEX_PLACEHOLDER_ITEM:
            break;
        default:
            return;
    }

    /** @todo - see whether this vvv makes sense to do here, vs within the specific functions above */
    // _setItemAttributes(footageItem, aexFootage);

    return footageItem;
}

function _getSolidItem(item: FootageItem, state: AexState): AexSolidItem {
    const itemAttributes = _getFootageItemAttributes(item, state);
    const itemSource = item.mainSource as SolidSource;

    return {
        ...itemAttributes,
        type: AEX_SOLID_ITEM,

        label: getModifiedValue(item.label, 1),
        color: getModifiedValue(itemSource.color, [0, 0, 0]),
    };
}

function _createSolid(aexSolid: AexSolidItem, state: AexState): FootageItem {
    let solidSettings = {
        color: [0, 0, 0] as ThreeDColorValue,
        name: 'New Solid',
        width: 1920,
        height: 1080,
        pixelAspect: 1,
    };

    if (!aeq.isNullOrUndefined(aexSolid)) {
        assignAttributes(solidSettings, {
            color: aexSolid.color,
            name: aexSolid.name,
            width: aexSolid.width,
            height: aexSolid.height,
            pixelAspect: aexSolid.pixelAspect,
        });
    }

    const tempComp = aeq.comp.create();
    const solid = tempComp.layers.addSolid(
        solidSettings.color,
        solidSettings.name,
        solidSettings.width,
        solidSettings.height,
        solidSettings.pixelAspect,
        0
    );

    const source = solid.source;

    tempComp.remove();

    return source;
}

function _getFileItem(item: FootageItem, state: AexState): AexFileItem {
    const itemAttributes = _getFootageItemAttributes(item, state);
    const itemSource = item.mainSource as FileSource;

    return {
        ...itemAttributes,
        type: AEX_FILE_FOOTAGE_ITEM,

        /** @todo Explore file handling */
        file: itemSource.file.fsName,
    };
}

function _getPlaceholderItem(item: PlaceholderItem, state: AexState): AexPlaceholderItem {
    const itemAttributes = _getFootageItemAttributes(item, state);

    return {
        ...itemAttributes,
        type: AEX_PLACEHOLDER_ITEM,
    };
}
