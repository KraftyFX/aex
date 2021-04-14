function getAexItem(item: Item, state: AexState): AexItemBase {
    if (aeq.isComp(item)) {
        return getAexComp(item as CompItem, state);
    } else if (aeq.isFootageItem(item)) {
        return _getFootageItem(item, state);
    } else if (aeq.isFolderItem(item)) {
        return _getFolderItem(item, state);
    } else {
        throw new Error(`Unrecognized Item Type`);
    }
}

function _getItemAttributes(item: Item): AexItemBase {
    /**
     * @todo Add AexOption to preserve project folder structure.
     * For now, just get the immediate parent folder name & assume lives in root
     */
    return {
        name: item.name,
        comment: getModifiedValue(item.comment, ''),
        label: getModifiedValue(item.label, 15),
        folder: _getParentFolders(item),

        aexid: generateItemUID(item),
    };
}

function _getParentFolders(item: Item): string[] {
    const folders = [];

    let parent = item.parentFolder;

    while (parent !== app.project.rootFolder) {
        folders.push(parent.name);
        parent = parent.parentFolder;
    }

    return folders;
}

function generateItemUID(item: Item): string {
    if (!!item) {
        return `${item.name.toLowerCase()}:${item.id}`;
    } else {
        return undefined;
    }
}
