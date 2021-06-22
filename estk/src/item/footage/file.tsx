function getAexFileItem(item: FootageItem, state: AexState): AexFileItem {
    const itemAttributes = getFootageItemAttributes(item, state);
    const itemSource = item.mainSource as FileSource;

    state.stats.nonCompItemCount++;

    return {
        ...itemAttributes,
        type: AEX_FILE_FOOTAGE_ITEM,

        file: itemSource.file.fsName,
    };
}

function createAeFileItem(aexFile: AexFileItem, state: AexState): FootageItem {
    throw notImplemented();
}

function updateAeFileItem(aeFile: FootageItem, aexFootage: AexFileItem, state: AexState) {
    throw notImplemented();
}
