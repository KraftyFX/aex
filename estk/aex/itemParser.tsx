function itemParser(options: AexOptions) {
    function _parseItemAttributes(item: Item): AexItemAttributes {
        const { name, parentFolder } = item;

        let itemType = 'Footage' as AexItemType;

        const comment = getModifiedValue(item.comment, '');
        const label = getModifiedValue(item.label, 15);

        /**
         * @todo Add AexOption to preserve project folder structure.
         * For now, just get the immediate parent folder name & assume lives in root
         **/
        const folder = parentFolder.name === 'Root' ? undefined : parentFolder.name;

        if (aeq.isFolderItem(item)) {
            itemType = 'Folder';
        }

        return {
            name,
            itemType,
            comment,
            label,
            folder,
        };
    }
    function _parseAVItemAttributes(item: AVItem): AexAVItemAttributes {
        const { duration, frameRate, height, pixelAspect, width } = item;
        const itemAttributes = _parseItemAttributes(item);

        return {
            ...itemAttributes,

            duration,
            frameRate,
            height,
            pixelAspect,
            width,
        };
    }

    return {
        parseFootageAttributes(item: FootageItem): AexFootageItemAttributes {
            const avItemAttributes = _parseAVItemAttributes(item);

            const itemSource = item.mainSource;

            const alphaMode = getModifiedValue(itemSource.alphaMode, AlphaMode.STRAIGHT);
            const conformFrameRate = getModifiedValue(itemSource.conformFrameRate, 0);
            const fieldSeparationType = getModifiedValue(itemSource.fieldSeparationType, FieldSeparationType.OFF);
            const highQualityFieldSeparation = getModifiedValue(itemSource.highQualityFieldSeparation, false);
            const loop = getModifiedValue(itemSource.loop, 1);
            const premulColor = getModifiedValue(itemSource.premulColor, [0, 0, 0]);
            const removePulldown = getModifiedValue(itemSource.removePulldown, PulldownPhase.OFF);

            const invertAlpha = itemSource.hasAlpha === false || alphaMode === AlphaMode.IGNORE ? undefined : itemSource.invertAlpha;

            let fileSourceAttributes = {} as AexFileSourceAttributes;
            let solidSourceAttributes = {} as AexSolidSourceAttributes;
            if (sourceIsFile(itemSource)) {
                /** @todo Explore file handling */
                fileSourceAttributes.file = itemSource.file.fsName;
            } else if (sourceIsSolid(itemSource)) {
                solidSourceAttributes.color = getModifiedValue(itemSource.color, [0, 0, 0]);
                avItemAttributes.itemType = 'Solid';
            } else if (sourceIsPlaceholder(itemSource)) {
                avItemAttributes.itemType = 'Placeholder';
            }

            return {
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
        },
        parseCompItemAttributes(comp: CompItem): AexCompItemAttributes {
            const avItemAttributes = _parseAVItemAttributes(comp);
            avItemAttributes.itemType = 'Comp';

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

            return {
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
            };
        },
    };
}
