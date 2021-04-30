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

function updateAeFootageItem(aeFootage: FootageItem, aexFootage: AexFootageItem, state: AexState) {
    switch (aexFootage.type) {
        case AEX_SOLID_ITEM:
            setAeSolid(aeFootage as FootageItem, aexFootage as AexSolidItem, state);
            break;
        case AEX_PLACEHOLDER_ITEM:
            setAePlaceholder(aeFootage as PlaceholderItem, aexFootage as AexPlaceholderItem, state);
            break;
        case AEX_FILE_FOOTAGE_ITEM:
        default:
            throw new Error(`Unsupported footage type: ${aexFootage.type}`);
    }
}

function createAeFootageItem(aexFootage: AexFootageItem, state: AexState): FootageItem {
    let footageItem;

    switch (aexFootage.type) {
        case AEX_SOLID_ITEM:
            footageItem = _createAeSolid(aexFootage as AexSolidItem, state);
            break;
        case AEX_PLACEHOLDER_ITEM:
            footageItem = _createAePlaceholder(aexFootage as AexPlaceholderItem, state);
            break;
        case AEX_FILE_FOOTAGE_ITEM:
        default:
            throw new Error(`Unsupported footage type: ${aexFootage.type}`);
    }

    /** @todo - see whether this vvv makes sense to do here, vs within the specific functions above */
    // _setItemAttributes(footageItem, aexFootage);

    return footageItem;
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

function _createAeSolid(aexSolid: AexSolidItem, state: AexState): FootageItem {
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

    const solid = tempComp.layers.addSolid(
        solidSettings.color,
        solidSettings.name,
        solidSettings.width,
        solidSettings.height,
        solidSettings.pixelAspect,
        solidSettings.duration
    );

    const source = solid.source;

    tempComp.remove();

    return source;
}

function setAeSolid(aeSolid: FootageItem, aexSolid: AexSolidItem, state: AexState) {
    assignAttributes(aeSolid, {
        color: aexSolid.color,
        name: aexSolid.name,
        width: aexSolid.width,
        height: aexSolid.height,
        pixelAspect: aexSolid.pixelAspect,
        duration: aexSolid.duration,
    });
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

function _createAePlaceholder(aexPlaceholder: AexPlaceholderItem, state: AexState): PlaceholderItem {
    const placeholderSettings = {
        name: 'New Placeholder',
        width: 1920,
        height: 1080,
        frameRate: 30,
        duration: 0,
    };

    assignAttributes(placeholderSettings, aexPlaceholder);

    const aePlaceholder = app.project.importPlaceholder(
        placeholderSettings.name,
        placeholderSettings.width,
        placeholderSettings.height,
        placeholderSettings.frameRate,
        placeholderSettings.duration
    );

    return aePlaceholder;
}

function setAePlaceholder(aePlaceholder: FootageItem, aexPlaceholder: AexPlaceholderItem, state: AexState) {
    assignAttributes(aePlaceholder, {
        name: aexPlaceholder.name,
        width: aexPlaceholder.width,
        height: aexPlaceholder.height,
        frameRate: aexPlaceholder.frameRate,
        duration: aexPlaceholder.duration,
    });
}
