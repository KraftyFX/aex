function getAexFootageItem(item: FootageItem, state: AexState): AexFootageItem {
    const itemSource = item.mainSource;

    if (sourceIsFile(itemSource)) {
        return _getFileItem(item, state);
    } else if (sourceIsSolid(itemSource)) {
        return _getSolidItem(item, state);
    } else if (sourceIsPlaceholder(itemSource)) {
        return _getPlaceholderItem(item, state);
    }
}

function createAeFootageItem(aexFootage: AexFootageItem, state: AexState): FootageItem {
    let footageItem;

    switch (aexFootage.type) {
        case AEX_SOLID_ITEM:
            footageItem = createAeSolid(aexFootage as AexSolidItem, state);
            break;
        case AEX_PLACEHOLDER_ITEM:
            footageItem = createAePlaceholder(aexFootage as AexPlaceholderItem, state);
            break;
        case AEX_FILE_FOOTAGE_ITEM:
        default:
            throw new Error(`Unsupported footage type: ${aexFootage.type}`);
    }

    /** @todo - see whether this vvv makes sense to do here, vs within the specific functions above */
    // _setItemAttributes(footageItem, aexFootage);

    return footageItem;
}

function updateAeFootageItem(aeFootage: FootageItem, aexFootage: AexFootageItem, state: AexState) {
    switch (aexFootage.type) {
        case AEX_SOLID_ITEM:
            updateAeSolid(aeFootage as FootageItem, aexFootage as AexSolidItem, state);
            break;
        case AEX_PLACEHOLDER_ITEM:
            updateAePlaceholder(aeFootage as PlaceholderItem, aexFootage as AexPlaceholderItem, state);
            break;
        case AEX_FILE_FOOTAGE_ITEM:
        default:
            throw new Error(`Unsupported footage type: ${aexFootage.type}`);
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
