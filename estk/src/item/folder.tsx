function getAexFolderItem(aeFolderItem: FolderItem, state: AexState): AexFolderItem {
    const itemAttributes = getItemBaseAttributes(aeFolderItem);

    state.stats.nonCompItemCount++;

    return {
        ...itemAttributes,
        type: AEX_FOLDER_ITEM,

        label: getModifiedValue(aeFolderItem.label, 2),
    };
}

function createAeFolderItem(aexFolderItem: AexFolderItem, state: AexState): FolderItem {
    const aeFolder = aeq.project.getOrCreateFolder(aexFolderItem.name);
    updateAeFolderItem(aeFolder, aexFolderItem, state);
    return aeFolder;
}

function updateAeFolderItem(aeFolder: FolderItem, aexFolder: AexFolderItem, state: AexState): void {
    setItemBaseAttributes(aeFolder, aexFolder, state);
}

function getParentFolders(aeItem: Item): string[] {
    const folders = [];

    let parent = aeItem.parentFolder;

    while (parent !== app.project.rootFolder) {
        folders.push(parent.name);
        parent = parent.parentFolder;
    }

    folders.reverse();

    return folders;
}

function setParentFolders(aeItem: Item, aexItem: AexItemBase, state: AexState): void {
    if (aeq.isNullOrUndefined(aexItem.folder)) {
        return;
    }

    const aexFolders: string[] = aexItem.folder;

    let root = app.project.rootFolder;

    aeq.forEach(aexFolders, (aexFolder) => {
        const newFolder = aeq.project.getOrCreateFolder(aexFolder, root);
        aeItem.parentFolder = newFolder;

        root = newFolder;
    });
}
