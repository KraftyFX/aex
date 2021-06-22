function prescanNonCompItem(aeItem: Item, state: AexState) {
    state.stats.nonCompItemCount++;
}

function getAexItem(aeItem: Item, state: AexState): AexItem {
    if (aeq.isComp(aeItem)) {
        return getAexComp(aeItem, state);
    } else if (aeq.isFootageItem(aeItem)) {
        return getAexFootageItem(aeItem, state);
    } else if (aeq.isFolderItem(aeItem)) {
        return getAexFolderItem(aeItem, state);
    } else {
        throw fail(`Unrecognized Item Type`);
    }
}

function createAeItem(aexItem: AexItem, state: AexState) {
    switch (aexItem.type) {
        case AEX_COMP_ITEM:
            return createAeComp(aexItem as AexComp, state);
        case AEX_FILE_FOOTAGE_ITEM:
        case AEX_SOLID_ITEM:
        case AEX_PLACEHOLDER_ITEM:
            return createAeFootageItem(aexItem as AexFootageItem, state);
        case AEX_FOLDER_ITEM:
            return createAeFolderItem(aexItem as AexFolderItem, state);
        default:
            throw notSupported(`Setting of project item type '${aexItem.type}'`);
    }
}

function updateAeItem(aeItem: Item, aexItem: AexItem, state: AexState) {
    switch (aexItem.type) {
        case AEX_COMP_ITEM:
            updateAeComp(aeItem as CompItem, aexItem as AexComp, state);
        case AEX_FILE_FOOTAGE_ITEM:
        case AEX_SOLID_ITEM:
        case AEX_PLACEHOLDER_ITEM:
            updateAeFootageItem(aeItem as FootageItem, aexItem as AexFootageItem, state);
            break;
        case AEX_FOLDER_ITEM:
            updateAeFolderItem(aeItem as FolderItem, aexItem as AexFolderItem, state);
            break;
        default:
            throw notSupported(`Setting of project item type '${aexItem.type}'`);
    }
}

function getItemBaseAttributes(aeItem: Item): AexItemBase {
    return {
        name: aeItem.name,
        comment: getModifiedValue(aeItem.comment, ''),
        label: getModifiedValue(aeItem.label, 15),
        folder: getParentFolders(aeItem),

        aexid: getItemUid(aeItem),
    };
}

function setItemBaseAttributes(aeItem: Item, aexItem: AexItemBase, state: AexState): void {
    assignAttributes(aeItem, {
        comment: aexItem.comment,
        label: aexItem.label,
        name: aexItem.name,
    });

    setParentFolders(aeItem, aexItem, state);
}

function getItemUid(aeItem: Item): string {
    if (!!aeItem) {
        return `${aeItem.name.toLowerCase()}:${aeItem.id}`;
    } else {
        return undefined;
    }
}

function getAexItemType(aeItem: Item): AexItemType {
    if (aeq.isComp(aeItem)) {
        return AEX_COMP_ITEM;
    } else if (aeq.isFolderItem(aeItem)) {
        return AEX_FOLDER_ITEM;
    } else if (aeq.isFootageItem(aeItem)) {
        return getAexFootageItemType(aeItem);
    } else {
        throw fail(`Unrecognized Item Type`);
    }
}
