function getAexItem(item: Item, options: AexOptions): AexItemBase {
    if (aeq.isComp(item)) {
        return getAexComp(item as CompItem, options);
    } else if (aeq.isFootageItem(item)) {
        return _getFootageItem(item);
    } else if (aeq.isFolderItem(item)) {
        return _getFolderItem(item);
    } else {
        throw new Error(`Unrecognized Item Type`);
    }
}

function getAexComp(comp: CompItem, options: AexOptions): AexComp {
    const avItemAttributes = _getAVItemAttributes(comp);

    const bgColor = getModifiedValue(comp.bgColor, [0, 0, 0]);
    const displayStartFrame = getModifiedValue(comp.displayStartFrame, 0);
    const displayStartTime = getModifiedValue(comp.displayStartTime, 0);
    const dropFrame = getModifiedValue(comp.dropFrame, true);
    const draft3d = getModifiedValue(comp.draft3d, false);
    const renderer = getModifiedValue(comp.renderer, 'ADBE Advanced 3d');
    const frameBlending = getModifiedValue(comp.frameBlending, false);
    const hideShyLayers = getModifiedValue(comp.hideShyLayers, false);
    const motionBlur = getModifiedValue(comp.motionBlur, false);
    const preserveNestedFrameRate = getModifiedValue(comp.preserveNestedFrameRate, false);
    const motionBlurAdaptiveSampleLimit = getModifiedValue(comp.motionBlurAdaptiveSampleLimit, 128);
    const motionBlurSamplesPerFrame = getModifiedValue(comp.motionBlurSamplesPerFrame, 16);
    const preserveNestedResolution = getModifiedValue(comp.preserveNestedResolution, false);
    const shutterAngle = getModifiedValue(comp.shutterAngle, 180);
    const shutterPhase = getModifiedValue(comp.shutterPhase, 0);
    const resolutionFactor = getModifiedValue(comp.resolutionFactor, [1, 1]);
    const workAreaStart = getModifiedValue(comp.workAreaStart, 0);
    const workAreaDuration = getModifiedValue(comp.workAreaDuration, comp.duration);

    const aexComp: AexComp = {
        type: AEX_COMP,

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
        workAreaDuration,
        workAreaStart,

        markers: _getAexCompMarkers(comp),
        layers: _getAexCompLayers(comp, options),
        // essentialProps: _getEssentialProperties(comp, options),
    };

    return aexComp;
}

function _getFootageItem(item: FootageItem): AexFootageItem {
    const avItemAttributes = _getAVItemAttributes(item);
    const fileSourceAttributes = {} as AexFileSourceAttributes;
    const solidSourceAttributes = {} as AexSolidSourceAttributes;

    const itemSource = item.mainSource;
    let type: AexItemType;

    if (sourceIsFile(itemSource)) {
        type = AEX_FILE_FOOTAGE;

        /** @todo Explore file handling */
        fileSourceAttributes.file = itemSource.file.fsName;
    } else if (sourceIsSolid(itemSource)) {
        type = AEX_SOLID;
        avItemAttributes.label = getModifiedValue(item.label, 1); // What is the significance of 1?

        solidSourceAttributes.color = getModifiedValue(itemSource.color, [0, 0, 0]);
    } else if (sourceIsPlaceholder(itemSource)) {
        type = AEX_PLACEHOLDER;
    }

    const conformFrameRate = getModifiedValue(itemSource.conformFrameRate, 0);
    const fieldSeparationType = getModifiedValue(itemSource.fieldSeparationType, FieldSeparationType.OFF);
    const highQualityFieldSeparation = getModifiedValue(itemSource.highQualityFieldSeparation, false);
    const loop = getModifiedValue(itemSource.loop, 1);
    const premulColor = getModifiedValue(itemSource.premulColor, [0, 0, 0]);
    const removePulldown = getModifiedValue(itemSource.removePulldown, PulldownPhase.OFF);

    const alphaMode = getModifiedValue(itemSource.alphaMode, AlphaMode.STRAIGHT);
    const invertAlpha = _getInvertAlphaValue(itemSource, alphaMode);

    return {
        type,
        ...avItemAttributes,

        alphaMode,
        conformFrameRate,
        fieldSeparationType,
        highQualityFieldSeparation,
        loop,
        premulColor,
        removePulldown,
        invertAlpha,

        ...fileSourceAttributes,
        ...solidSourceAttributes,
    };
}

function _getFolderItem(item: FolderItem): AexFolderItem {
    const itemAttributes = _getItemAttributes(item);

    return {
        type: AEX_FOLDER,
        ...itemAttributes,

        label: getModifiedValue(item.label, 2),
    };
}

function _getItemAttributes(item: Item) {
    const { name, parentFolder } = item;

    /**
     * @todo Add AexOption to preserve project folder structure.
     * For now, just get the immediate parent folder name & assume lives in root
     **/
    const folder = parentFolder.name === 'Root' ? undefined : parentFolder.name;

    return {
        name,
        comment: getModifiedValue(item.comment, ''),
        label: getModifiedValue(item.label, 15), // What is the significance of 15?
        folder,

        aexid: generateItemUID(item),
    };
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

function _getInvertAlphaValue(itemSource: FileSource | SolidSource | PlaceholderSource, alphaMode: AlphaMode) {
    return itemSource.hasAlpha === false || alphaMode === AlphaMode.IGNORE ? undefined : itemSource.invertAlpha;
}

/** @todo explore whether essential props can be serialized */
function _getEssentialProperties(comp: CompItem, options: AexOptions) {
    let essentialProps = [];

    return essentialProps;
}

function _getAexCompLayers(comp: CompItem, options: AexOptions) {
    let layers = [] as AexLayer[];

    aeq.forEachLayer(comp, (layer: Layer) => {
        let layerData = getAexLayer(layer, options);
        layers.push(layerData);
    });

    return layers;
}

function _getAexCompMarkers(comp: CompItem) {
    return getAexMarkerProperties(comp.markerProperty);
}

function generateItemUID(item: Item): string {
    return `${item.name.toLowerCase()}:${item.id}`;
}
