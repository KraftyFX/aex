function _getPlaceholderItem(item: PlaceholderItem, state: AexState): AexPlaceholderItem {
    const itemAttributes = _getFootageItemAttributes(item, state);

    return {
        ...itemAttributes,
        type: AEX_PLACEHOLDER_ITEM,
    };
}

function createAePlaceholder(aexPlaceholder: AexPlaceholderItem, state: AexState): PlaceholderItem {
    const placeholderSettings = {
        name: 'New Placeholder',
        width: 1920,
        height: 1080,
        frameRate: 30,
        duration: 0,
    };

    assignAttributes(placeholderSettings, aexPlaceholder);

    const aePlaceholder = app.project.importPlaceholder(
        placeholderSettings.name,
        placeholderSettings.width,
        placeholderSettings.height,
        placeholderSettings.frameRate,
        placeholderSettings.duration
    );

    return aePlaceholder;
}

function updateAePlaceholder(aePlaceholder: FootageItem, aexPlaceholder: AexPlaceholderItem, state: AexState) {
    assignAttributes(aePlaceholder, {
        name: aexPlaceholder.name,
        width: aexPlaceholder.width,
        height: aexPlaceholder.height,
        frameRate: aexPlaceholder.frameRate,
        duration: aexPlaceholder.duration,
    });
}
