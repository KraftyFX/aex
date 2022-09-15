function getAexFileItem(item: FootageItem, state: AexState): AexFileItem {
    const itemAttributes = getFootageItemAttributes(item, state);
    const itemSource = item.mainSource as FileSource;

    state.stats.nonCompItemCount++;

    const sequence = !itemIsStillImage(item) && itemIsSequence(item);

    return {
        ...itemAttributes,
        type: AEX_FILE_FOOTAGE_ITEM,

        file: itemSource.file.fsName,
        sequence: sequence,
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
