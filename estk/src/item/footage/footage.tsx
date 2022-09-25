function getAexFootageItem(item: FootageItem, state: AexState): AexFootageItem {
    const type = getAexFootageItemType(item);

    switch (type) {
        case AEX_SOLID_ITEM:
            return getAexSolidItem(item, state);
        case AEX_PLACEHOLDER_ITEM:
            return getAexPlaceholderItem(item, state);
        case AEX_FILE_FOOTAGE_ITEM:
            return getAexFileItem(item, state);
        default:
            throw notSupported(`Footage type: '${type}'`);
    }
}

function createAeFootageItem(aexFootage: AexFootageItem, state: AexState): FootageItem {
    switch (aexFootage.type) {
        case AEX_SOLID_ITEM:
            return createAeSolidItem(aexFootage as AexSolidItem, state);
        case AEX_PLACEHOLDER_ITEM:
            return createAePlaceholderItem(aexFootage as AexPlaceholderItem, state);
        case AEX_FILE_FOOTAGE_ITEM:
            return createAeFileItem(aexFootage as AexFileItem, state);
        default:
            throw notSupported(`Footage type: '${aexFootage.type}'`);
    }
}

function updateAeFootageItem(aeFootage: FootageItem, aexFootage: AexFootageItem, state: AexState) {
    switch (aexFootage.type) {
        case AEX_SOLID_ITEM:
            updateAeSolidItem(aeFootage as FootageItem, aexFootage as AexSolidItem, state);
            break;
        case AEX_PLACEHOLDER_ITEM:
            updateAePlaceholderItem(aeFootage, aexFootage as AexPlaceholderItem, state);
            break;
        case AEX_FILE_FOOTAGE_ITEM:
            updateAeFileItem(aeFootage, aexFootage as AexFileItem, state);
            break;
        default:
            throw notSupported(`Footage type: '${aexFootage.type}'`);
    }
}

function updateAeFootageItemAttributes(aeItem: FootageItem, aexFootageItem: AexFootageItemBase, state: AexState): void {
    assignAttributes(aeItem, {
        name: aexFootageItem.name,
    });

    assignAttributes(aeItem.mainSource, {
        alphaMode: aexFootageItem.alphaMode,
        conformFrameRate: aexFootageItem.conformFrameRate,
        fieldSeparationType: aexFootageItem.fieldSeparationType,
        highQualityFieldSeparation: aexFootageItem.highQualityFieldSeparation,
        invertAlpha: aexFootageItem.invertAlpha,
        loop: aexFootageItem.loop,
        premulColor: aexFootageItem.premulColor,
        removePulldown: aexFootageItem.removePulldown,
    });
}

function getAexFootageItemType(aeFootageItem: FootageItem): AexFootageItemType {
    const { mainSource } = aeFootageItem;

    if (sourceIsFile(mainSource)) {
        return AEX_FILE_FOOTAGE_ITEM;
    } else if (sourceIsSolid(mainSource)) {
        return AEX_SOLID_ITEM;
    } else if (sourceIsPlaceholder(mainSource)) {
        return AEX_PLACEHOLDER_ITEM;
    } else {
        throw fail(`Unrecognized Footage Item Type`);
    }
}

function getFootageItemAttributes(item: FootageItem, state: AexState): AexFootageItemBase {
    assertIsDefined(item, 'item');

    const avItemBaseAttributes = getAvItemBaseAttributes(item);
    const itemSource = item.mainSource;

    const alphaMode = itemSource.hasAlpha ? getModifiedValue(itemSource.alphaMode, AlphaMode.IGNORE) : undefined;
    const invertAlpha = _getInvertAlphaValue(itemSource, alphaMode);
    const loop = itemSource.isStill ? undefined : getModifiedValue(itemSource.loop, 1);
    const removePulldown = _getRemovePulldownValue(itemSource);

    state.stats.nonCompItemCount++;

    return {
        ...avItemBaseAttributes,

        alphaMode,
        invertAlpha,
        premulColor: getModifiedValue(itemSource.premulColor, [0, 0, 0] as ThreeDColorValue),

        fieldSeparationType: getModifiedValue(itemSource.fieldSeparationType, FieldSeparationType.OFF),
        highQualityFieldSeparation: getModifiedValue(itemSource.highQualityFieldSeparation, false),

        conformFrameRate: getModifiedValue(itemSource.conformFrameRate, 0),
        loop,
        removePulldown,
    };
}

function _getRemovePulldownValue(itemSource: FileSource | SolidSource | PlaceholderSource): PulldownPhase {
    return itemSource.isStill && itemSource.fieldSeparationType !== FieldSeparationType.OFF
        ? undefined
        : getModifiedValue(itemSource.removePulldown, PulldownPhase.OFF);
}

function _getInvertAlphaValue(itemSource: FileSource | SolidSource | PlaceholderSource, alphaMode: AlphaMode): boolean {
    return itemSource.hasAlpha === false || alphaMode === AlphaMode.IGNORE ? undefined : getModifiedValue(itemSource.invertAlpha, false);
}
