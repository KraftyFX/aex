function getAexFileItem(item: FootageItem, state: AexState): AexFileItem {
    const itemAttributes = getFootageItemAttributes(item, state);
    const itemSource = item.mainSource as FileSource;

    state.stats.nonCompItemCount++;

    const sequence = !item.mainSource.isStill && itemIsSequence(item) ? true : undefined;

    // Override irrelevant AV Item base props
    const height = undefined;
    const width = undefined;
    const duration = undefined;
    const frameRate = undefined;

    return {
        ...itemAttributes,
        type: AEX_FILE_FOOTAGE_ITEM,

        file: itemSource.file.fsName,
        sequence,

        height,
        width,
        duration,
        frameRate,
    };
}

function createAeFileItem(aexFile: AexFileItem, state: AexState): FootageItem {
    const importOptions = new ImportOptions();

    const file = new File(aexFile.file);

    if (!file.exists) {
        handleMissingFileAtPath();
    }

    assignAttributes(importOptions, {
        file: file,
        forceAlphabetical: false,
        importAs: ImportAsType.FOOTAGE,
        sequence: aexFile.sequence,
    });

    const aeFileItem = app.project.importFile(importOptions as ImportOptions) as FootageItem;

    updateAeFileItem(aeFileItem, aexFile, state);

    return aeFileItem;

    function handleMissingFileAtPath() {
        const message = `The file at path "${aexFile.file}" does not appear to exist on disk.`;

        switch (state.createOptions.missingFileBehavior) {
            case 'skip':
                break;
            case 'throw':
                throw fail(message);
            default:
                state.createOptions.missingFileBehavior({
                    aexObject: aexFile,
                    message,
                });
                break;
        }
    }
}

function updateAeFileItem(aeFile: FootageItem, aexFile: AexFileItem, state: AexState): FootageItem {
    aexFile.duration = undefined;
    aexFile.frameRate = undefined;

    updateAeFootageItemAttributes(aeFile, aexFile, state);

    state.stats.nonCompItemCount++;

    return aeFile;
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
