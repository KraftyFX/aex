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

function createAexItem(aexItem: AexItem, state: AexState): void {
    switch (aexItem.type) {
        case AEX_FILE_FOOTAGE_ITEM:
        case AEX_SOLID_ITEM:
        case AEX_PLACEHOLDER_ITEM:
            return _createFootageItem(aexItem, state);
        case AEX_FOLDER_ITEM:
            return _createFolderItem(aexItem, state);
        default:
            throw new Error(`Unrecognized Item Type ${aexItem.type}`);
    }
}

function getAexComp(comp: CompItem, state: AexState): AexComp {
    const avItemAttributes = _getAVItemAttributes(comp);

    const bgColor = getModifiedValue(comp.bgColor, [0, 0, 0] as ThreeDColorValue);
    const displayStartFrame = getModifiedValue(comp.displayStartFrame, 0);
    const displayStartTime = getModifiedValue(comp.displayStartTime, 0);
    const draft3d = getModifiedValue(comp.draft3d, false);
    const dropFrame = getModifiedValue(comp.dropFrame, true);
    const frameBlending = getModifiedValue(comp.frameBlending, false);
    const hideShyLayers = getModifiedValue(comp.hideShyLayers, false);
    const motionBlur = getModifiedValue(comp.motionBlur, false);
    const motionBlurAdaptiveSampleLimit = getModifiedValue(comp.motionBlurAdaptiveSampleLimit, 128);
    const motionBlurSamplesPerFrame = getModifiedValue(comp.motionBlurSamplesPerFrame, 16);
    const preserveNestedFrameRate = getModifiedValue(comp.preserveNestedFrameRate, false);
    const preserveNestedResolution = getModifiedValue(comp.preserveNestedResolution, false);
    const renderer = getModifiedValue(comp.renderer, 'ADBE Advanced 3d');
    const resolutionFactor = getModifiedValue(comp.resolutionFactor, [1, 1]);
    const shutterAngle = getModifiedValue(comp.shutterAngle, 180);
    const shutterPhase = getModifiedValue(comp.shutterPhase, 0);
    const workAreaStart = getModifiedValue(comp.workAreaStart, 0);
    const workAreaDuration = getModifiedValue(comp.workAreaDuration, comp.duration);

    const aexComp: AexComp = {
        type: AEX_COMP_ITEM,

        /** Item & AVItem attributes */
        ...avItemAttributes,

        /** Comp internal data */
        bgColor,
        displayStartFrame,
        displayStartTime,
        draft3d,
        dropFrame,
        frameBlending,
        hideShyLayers,
        motionBlur,
        motionBlurAdaptiveSampleLimit,
        motionBlurSamplesPerFrame,
        preserveNestedFrameRate,
        preserveNestedResolution,
        renderer,
        resolutionFactor,
        shutterAngle,
        shutterPhase,
        workAreaStart,
        workAreaDuration,

        markers: _getAexCompMarkers(comp),
        layers: _getAexCompLayers(comp, state),
    };

    state.stats.compCount++;
    return aexComp;
}

function createAexComp(aexComp: AexComp, state: AexState): void {
    /** @todo */
}

function _getFootageItemAttributes(item: FootageItem, state: AexState): AexFootageItemBase {
    const avItemAttributes = _getAVItemAttributes(item);
    const itemSource = item.mainSource;

    const conformFrameRate = getModifiedValue(itemSource.conformFrameRate, 0);
    const fieldSeparationType = getModifiedValue(itemSource.fieldSeparationType, FieldSeparationType.OFF);
    const highQualityFieldSeparation = getModifiedValue(itemSource.highQualityFieldSeparation, false);
    const loop = getModifiedValue(itemSource.loop, 1);
    const premulColor = getModifiedValue(itemSource.premulColor, [0, 0, 0] as ThreeDColorValue);
    const removePulldown = getModifiedValue(itemSource.removePulldown, PulldownPhase.OFF);

    const alphaMode = getModifiedValue(itemSource.alphaMode, AlphaMode.STRAIGHT);
    const invertAlpha = _getInvertAlphaValue(itemSource, alphaMode);

    state.stats.nonCompItemCount++;

    return {
        ...avItemAttributes,

        conformFrameRate,
        fieldSeparationType,
        highQualityFieldSeparation,
        loop,
        premulColor,
        removePulldown,
        alphaMode,
        invertAlpha,
    };
}

function _getFootageItem(item: FootageItem, state: AexState): AexFootageItem {
    const itemSource = item.mainSource;

    if (sourceIsFile(itemSource)) {
        return _getFileItem(item, state);
    } else if (sourceIsSolid(itemSource)) {
        return _getSolidItem(item, state);
    } else if (sourceIsPlaceholder(itemSource)) {
        return _getPlaceholderItem(item, state);
    }
}

function _createFootageItem(aexFootage: AexItem, state: AexState): void {
    let footageItem;

    switch (aexFootage.type) {
        case AEX_FILE_FOOTAGE_ITEM:
            break;
        case AEX_SOLID_ITEM:
            footageItem = _createSolid(aexFootage as AexSolidItem, state);
            break;
        case AEX_PLACEHOLDER_ITEM:
            break;
        default:
            return;
    }

    // _setItemAttributes(footageItem, aexFootage);
}

function _getSolidItem(item: FootageItem, state: AexState): AexSolidItem {
    const itemAttributes = _getFootageItemAttributes(item, state);
    const itemSource = item.mainSource as SolidSource;

    return {
        ...itemAttributes,
        type: AEX_SOLID_ITEM,

        label: getModifiedValue(item.label, 1),
        color: getModifiedValue(itemSource.color, [0, 0, 0]),
    };
}

function _createSolid(aexSolid: AexSolidItem, state: AexState): FootageItem {
    const tempComp = aeq.comp.create();
    const solid = tempComp.layers.addSolid([0, 0, 0], aexSolid.name, aexSolid.width, aexSolid.height, aexSolid.pixelAspect, 0);

    const source = solid.source;

    tempComp.remove();

    return source;
}

function _getFileItem(item: FootageItem, state: AexState): AexFileItem {
    const itemAttributes = _getFootageItemAttributes(item, state);
    const itemSource = item.mainSource as FileSource;

    return {
        ...itemAttributes,
        type: AEX_FILE_FOOTAGE_ITEM,

        /** @todo Explore file handling */
        file: itemSource.file.fsName,
    };
}

function _getPlaceholderItem(item: PlaceholderItem, state: AexState): AexPlaceholderItem {
    const itemAttributes = _getFootageItemAttributes(item, state);

    return {
        ...itemAttributes,
        type: AEX_PLACEHOLDER_ITEM,
    };
}

function _getFolderItem(item: FolderItem, state: AexState): AexFolderItem {
    const itemAttributes = _getItemAttributes(item);

    state.stats.nonCompItemCount++;
    return {
        type: AEX_FOLDER_ITEM,
        ...itemAttributes,

        label: getModifiedValue(item.label, 2),
    };
}

function _createFolderItem(aexFolder: AexFolderItem, state: AexState): void {
    const aeFolder = aeq.project.getOrCreateFolder(aexFolder.name);

    _setItemAttributes(aeFolder, aexFolder);
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

function _setItemAttributes(item: Item, aexItem: AexItem): void {
    cloneAttributes(item, aexItem);
    _setParentFolders(item, aexItem.folder);
}

function _getAVItemAttributes(item: AVItem): AexAVItemBase {
    const { duration, frameRate, height, pixelAspect, width } = item;
    const itemAttributes = _getItemAttributes(item);

    return {
        ...itemAttributes,

        duration,
        frameRate,
        height,
        pixelAspect,
        width,
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

function _setParentFolders(item: Item, folders: string[]): void {
    let root = app.project.rootFolder;

    folders.reverse();

    aeq.forEach(folders, (folder) => {
        const newFolder = aeq.project.getOrCreateFolder(folder, root);
        item.parentFolder = newFolder;

        root = newFolder;
    });
}

function _getInvertAlphaValue(itemSource: FileSource | SolidSource | PlaceholderSource, alphaMode: AlphaMode) {
    return itemSource.hasAlpha === false || alphaMode === AlphaMode.IGNORE ? undefined : itemSource.invertAlpha;
}

function _getAexCompLayers(comp: CompItem, state: AexState) {
    let layers = [] as AexLayer[];

    aeq.forEachLayer(comp, (layer: Layer) => {
        let layerData = getAexLayer(layer, state);
        layers.push(layerData);
    });

    return layers;
}

function _getAexCompMarkers(comp: CompItem) {
    return getAexMarkerProperties(comp.markerProperty);
}

function generateItemUID(item: Item): string {
    if (!!item) {
        return `${item.name.toLowerCase()}:${item.id}`;
    } else {
        return undefined;
    }
}
