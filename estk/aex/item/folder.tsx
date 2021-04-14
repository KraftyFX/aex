function _getFolderItem(item: FolderItem, state: AexState): AexFolderItem {
    const itemAttributes = _getItemAttributes(item);

    state.stats.nonCompItemCount++;
    return {
        type: AEX_FOLDER_ITEM,
        ...itemAttributes,

        label: getModifiedValue(item.label, 2),
    };
}
