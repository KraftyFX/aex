function getAexPlaceholderItem(item: PlaceholderItem, state: AexState): AexPlaceholderItem {
    const itemAttributes = getFootageItemAttributes(item, state);

    state.stats.nonCompItemCount++;

    return {
        ...itemAttributes,
        type: AEX_PLACEHOLDER_ITEM,
    };
}

function createAePlaceholderItem(aexPlaceholder: AexPlaceholderItem, state: AexState): PlaceholderItem {
    const placeholderSettings = {
        name: 'New Placeholder',
        width: 1920,
        height: 1080,
        frameRate: 30,
        duration: 0,
    };

    assignAttributes(placeholderSettings, aexPlaceholder);

    aexPlaceholder.loop = aexPlaceholder.loop || 1;

    const aePlaceholder = app.project.importPlaceholder(
        placeholderSettings.name,
        placeholderSettings.width,
        placeholderSettings.height,
        placeholderSettings.frameRate,
        placeholderSettings.duration / aexPlaceholder.loop
    );

    updateAeFootageItemAttributes(aePlaceholder, aexPlaceholder, state);

    state.stats.nonCompItemCount++;

    return aePlaceholder;
}

function updateAePlaceholderItem(aePlaceholder: FootageItem, aexPlaceholder: AexPlaceholderItem, state: AexState) {
    state.stats.nonCompItemCount++;

    aexPlaceholder.loop = aexPlaceholder.loop || 1;

    assignAttributes(aePlaceholder, {
        name: aexPlaceholder.name,
        width: aexPlaceholder.width,
        height: aexPlaceholder.height,
        frameRate: aexPlaceholder.frameRate,
        duration: aexPlaceholder.duration / aexPlaceholder.loop,
    });

    updateAeFootageItemAttributes(aePlaceholder, aexPlaceholder, state);
}
