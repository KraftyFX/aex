function _getFolderItem(item: FolderItem, state: AexState): AexFolderItem {
    const itemAttributes = getItemBaseAttributes(item);

    state.stats.nonCompItemCount++;
    return {
        ...itemAttributes,
        type: AEX_FOLDER_ITEM,

        label: getModifiedValue(item.label, 2),
    };
}

function _createFolderItem(aexFolder: AexFolderItem, state: AexState): void {
    const aeFolder = aeq.project.getOrCreateFolder(aexFolder.name);

    setItemBaseAttributes(aeFolder, aexFolder, state);
}

function _createAeFolderItem2(aexFolder: AexFolderItem, state: AexState): FolderItem {
    return aeq.project.getOrCreateFolder(aexFolder.name);
}

function setAeFolderItem2(aeFolder: FolderItem, aexFolder: AexFolderItem, state: AexState): void {
    setItemBaseAttributes(aeFolder, aexFolder, state);
}

function getParentFolders(item: Item): string[] {
    const folders = [];

    let parent = item.parentFolder;

    while (parent !== app.project.rootFolder) {
        folders.push(parent.name);
        parent = parent.parentFolder;
    }

    return folders;
}

function setParentFolders(item: Item, aexFolders: string[], state: AexState): void {
    let root = app.project.rootFolder;

    // TODO: the folders array should be serialized in a way that does not require this.
    aexFolders.reverse();

    aeq.forEach(aexFolders, (aexFolder) => {
        const newFolder = aeq.project.getOrCreateFolder(aexFolder, root);
        item.parentFolder = newFolder;

        root = newFolder;
    });
}
