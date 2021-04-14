function _getFolderItem(item: FolderItem, state: AexState): AexFolderItem {
    const itemAttributes = getItemBaseAttributes(item);

    state.stats.nonCompItemCount++;
    return {
        type: AEX_FOLDER_ITEM,
        ...itemAttributes,

        label: getModifiedValue(item.label, 2),
    };
}

function _createFolderItem(aexFolder: AexFolderItem, state: AexState): void {
    const aeFolder = aeq.project.getOrCreateFolder(aexFolder.name);

    _setItemAttributes(aeFolder, aexFolder, state);
}
