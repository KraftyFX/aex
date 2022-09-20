function getAexFileItem(item: FootageItem, state: AexState): AexFileItem {
    const itemAttributes = getFootageItemAttributes(item, state);
    const itemSource = item.mainSource as FileSource;

    state.stats.nonCompItemCount++;

    const sequence = !item.mainSource.isStill && itemIsSequence(item) ? true : undefined;
    const alphaMode = itemSource.hasAlpha ? getModifiedValue(itemSource.alphaMode, AlphaMode.IGNORE) : undefined;
    const premulColor = alphaMode == AlphaMode.PREMULTIPLIED ? getModifiedValue(itemSource.premulColor, [0, 0, 0] as ThreeDColorValue) : undefined;

    const conformFrameRate = getModifiedValue(itemSource.conformFrameRate, itemSource.nativeFrameRate);
    // const displayFrameRate = getModifiedValue(itemSource.displayFrameRate, itemSource.nativeFrameRate);
    const fieldSeparationType = getModifiedValue(itemSource.fieldSeparationType, FieldSeparationType.OFF);
    const invertAlpha =
        itemSource.isStill || fieldSeparationType == FieldSeparationType.OFF ? undefined : getModifiedValue(itemSource.invertAlpha, false);
    const loop = itemSource.isStill ? undefined : getModifiedValue(itemSource.loop, 1);
    const removePulldown = itemSource.isStill ? undefined : getModifiedValue(itemSource.removePulldown, PulldownPhase.OFF);

    return {
        ...itemAttributes,
        type: AEX_FILE_FOOTAGE_ITEM,

        file: itemSource.file.fsName,
        sequence,

        alphaMode,
        premulColor,
        conformFrameRate,
        // displayFrameRate,
        fieldSeparationType,
        invertAlpha,
        loop,
        removePulldown,
    };
}

function createAeFileItem(aexFile: AexFileItem, state: AexState): FootageItem {
    const importOptions = new ImportOptions();

    /** @todo Add a check / throw an error if the file doesn't exist! */

    assignAttributes(importOptions, {
        file: new File(aexFile.file),
        forceAlphabetical: false,
        importAs: ImportAsType.FOOTAGE,
        sequence: aexFile.sequence,
    });

    const aeFileItem = app.project.importFile(importOptions as ImportOptions) as FootageItem;

    assignAttributes(aeFileItem.mainSource, {
        alphaMode: aexFile.alphaMode,
        premulColor: aexFile.premulColor,
        conformFrameRate: aexFile.conformFrameRate,
        fieldSeparationType: aexFile.fieldSeparationType,
        invertAlpha: aexFile.invertAlpha,
        loop: aexFile.loop,
        removePulldown: aexFile.removePulldown,
    });

    state.stats.nonCompItemCount++;

    return aeFileItem;
}

function updateAeFileItem(aeFile: FootageItem, aexFootage: AexFileItem, state: AexState) {
    throw notImplemented(`Updating a file item`);
}

function itemIsStillImage(item: FootageItem): boolean {
    return item.mainSource.isStill;
}

function itemIsSequence(item: FootageItem): boolean {
    const itemSource = item.mainSource as FileSource;

    const importedItem = aeq.importFile(itemSource.file) as FootageItem;
    const importIsImage = importedItem.mainSource.isStill;
    importedItem.remove();

    return importIsImage;
}
