function getAexFileItem(item: FootageItem, state: AexState): AexFileItem {
    const itemAttributes = _getFootageItemAttributes(item, state);
    const itemSource = item.mainSource as FileSource;

    state.stats.nonCompItemCount++;

    return {
        ...itemAttributes,
        type: AEX_FILE_FOOTAGE_ITEM,

        /** @todo Explore file handling */
        file: itemSource.file.fsName,
    };
}
