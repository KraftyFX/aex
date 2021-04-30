function getAexItem(item: Item, state: AexState): AexItem {
    if (aeq.isComp(item)) {
        throw new Error(`Not supported: Getting a comp from getAexItem().  Use getAexComp() instead.`);
    } else if (aeq.isFootageItem(item)) {
        return getAexFootageItem(item, state);
    } else if (aeq.isFolderItem(item)) {
        return _getAexFolderItem(item, state);
    } else {
        throw new Error(`Unrecognized Item Type`);
    }
}

function createAeItem(aexItem: AexItem, state: AexState) {
    switch (aexItem.type) {
        case AEX_COMP_ITEM:
            throw new Error(`Not supported: Creating a comp from createAeItem().  Use createAeComp() instead.`);
        case AEX_FILE_FOOTAGE_ITEM:
        case AEX_SOLID_ITEM:
        case AEX_PLACEHOLDER_ITEM:
            return createAeFootageItem(aexItem as AexFootageItem, state);
        case AEX_FOLDER_ITEM:
            return createAeFolderItem(aexItem as AexFolderItem, state);
        default:
            throw new Error(`Not supported: Setting of project item type "${aexItem.type}"`);
    }
}

function updateAeItem(aeItem: Item, aexItem: AexItem, state: AexState) {
    switch (aexItem.type) {
        case AEX_COMP_ITEM:
            throw new Error(`Not supported: Updating a comp from updateAeItem().  Use updateAeComp() instead.`);
        case AEX_FILE_FOOTAGE_ITEM:
        case AEX_SOLID_ITEM:
        case AEX_PLACEHOLDER_ITEM:
            updateAeFootageItem(aeItem as FootageItem, aexItem as AexFootageItem, state);
            break;
        case AEX_FOLDER_ITEM:
            updateAeFolderItem(aeItem as FolderItem, aexItem as AexFolderItem, state);
            break;
        default:
            throw new Error(`Not supported: Setting of project item type "${aexItem.type}"`);
    }
}

function getItemBaseAttributes(item: Item): AexItemBase {
    /**
     * @todo Add AexOption to preserve project folder structure.
     * For now, just get the immediate parent folder name & assume lives in root
     */
    return {
        name: item.name,
        comment: getModifiedValue(item.comment, ''),
        label: getModifiedValue(item.label, 15),
        folder: getParentFolders(item),

        aexid: generateItemUID(item),
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

function generateItemUID(item: Item): string {
    if (!!item) {
        return `${item.name.toLowerCase()}:${item.id}`;
    } else {
        return undefined;
    }
}

function getItemById(id: AexUID): Item {
    const items = aeq.getItems().filter((item) => {
        return !aeq.isFolderItem(item);
    });

    return items.find((item) => {
        const itemID = generateItemUID(item);

        return itemID === id;
    });
}

function getItemFromSource(source: AexFootageSource): AVItem {
    const existingItem = getItemById(source.id);

    if (existingItem && getItemType(existingItem) === source.type) {
        return existingItem as AVItem;
    } else {
        return undefined;
    }
}

function getItemType(item: Item): AexItemType {
    if (aeq.isComp(item)) {
        return AEX_COMP_ITEM;
    } else if (aeq.isFootageItem(item)) {
        const mainSource = item.mainSource;

        if (sourceIsFile(mainSource)) {
            return AEX_FILE_FOOTAGE_ITEM;
        } else if (sourceIsSolid(mainSource)) {
            return AEX_SOLID_ITEM;
        } else if (sourceIsPlaceholder(mainSource)) {
            return AEX_PLACEHOLDER_ITEM;
        } else {
            throw new Error(`Unrecognized Footage Type`);
        }
    } else if (aeq.isFolderItem(item)) {
        return AEX_FOLDER_ITEM;
    } else {
        throw new Error(`Unrecognized Item Type`);
    }
}
