function _getFootageItemAttributes(item: FootageItem, state: AexState): AexFootageItemBase {
    const avItemAttributes = _getAVItemAttributes(item);
    const itemSource = item.mainSource;

    const conformFrameRate = getModifiedValue(itemSource.conformFrameRate, 0);
    const fieldSeparationType = getModifiedValue(itemSource.fieldSeparationType, FieldSeparationType.OFF);
    const highQualityFieldSeparation = getModifiedValue(itemSource.highQualityFieldSeparation, false);
    const loop = getModifiedValue(itemSource.loop, 1);
    const premulColor = getModifiedValue(itemSource.premulColor, [0, 0, 0] as ThreeDColorValue);
    const removePulldown = getModifiedValue(itemSource.removePulldown, PulldownPhase.OFF);

    const alphaMode = getModifiedValue(itemSource.alphaMode, AlphaMode.STRAIGHT);
    const invertAlpha = _getInvertAlphaValue(itemSource, alphaMode);

    state.stats.nonCompItemCount++;

    return {
        ...avItemAttributes,

        conformFrameRate,
        fieldSeparationType,
        highQualityFieldSeparation,
        loop,
        premulColor,
        removePulldown,
        alphaMode,
        invertAlpha,
    };
}

function _getFootageItem(item: FootageItem, state: AexState): AexFootageItem {
    const itemSource = item.mainSource;

    if (sourceIsFile(itemSource)) {
        return _getFileItem(item, state);
    } else if (sourceIsSolid(itemSource)) {
        return _getSolidItem(item, state);
    } else if (sourceIsPlaceholder(itemSource)) {
        return _getPlaceholderItem(item, state);
    }
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

function _getInvertAlphaValue(itemSource: FileSource | SolidSource | PlaceholderSource, alphaMode: AlphaMode) {
    return itemSource.hasAlpha === false || alphaMode === AlphaMode.IGNORE ? undefined : itemSource.invertAlpha;
}
