function _getLayerStyles(styleGroup: PropertyGroup, state: AexState) {
    const styles = {
        name: styleGroup.name,
        matchName: styleGroup.matchName,
        enabled: styleGroup.enabled,
        properties: [],
    };

    forEachPropertyInGroup(styleGroup, (property: Property | PropertyGroup, ii) => {
        /**
         * Voodoo: We always want to parse the first property in this group
         *   (it's a general property that affects all the others)
         *
         * After that, however, layer styles only really exist in the aep if
         * 'canSetEnabled' is true.
         */
        if (ii == 0 || property.canSetEnabled) {
            const { name, matchName, enabled } = property;

            const propertyData = getPropertyGroup(property as PropertyGroup, state);

            styles.properties.push({
                name,
                matchName,
                enabled,

                properties: propertyData ? propertyData.properties : undefined,
            });
        }
    });

    return styles;
}

function _setLayerStyles(aeAvLayer: AVLayer, aexAvLayer: AexAVLayer, state: AexState): void {
    const layerStyles: PropertyGroup = aeAvLayer.layerStyle;
    const aexStyleGroup: AexPropertyGroup = aexAvLayer.layerStyles;

    if (aeq.isNullOrUndefined(aexStyleGroup)) {
        return;
    }

    let aexBlendGroup;

    aeq.arrayEx(aexStyleGroup.properties).forEach((aexStyleProperty: AexPropertyGroup) => {
        const { matchName } = aexStyleProperty;
        let styleGroup: PropertyGroup;

        /**
         * Voodoo:
         *
         * We need to set this group _after_ the other style groups, or else it won't be
         * accessible to the API.
         */
        if (matchName === 'ADBE Blend Options Group') {
            aexBlendGroup = aexStyleProperty;
        } else {
            styleGroup = _createStyleGroup(layerStyles, aexStyleProperty, state);

            setPropertyGroup(styleGroup, aexStyleProperty, state);
        }
    });

    if (aexBlendGroup) {
        const blendGroup = layerStyles.property(1) as PropertyGroup;
        setPropertyGroup(blendGroup, aexBlendGroup, state);
    }

    assignAttributes(layerStyles, { enabled: aexStyleGroup.enabled });
}

/**
 * Voodoo:
 *
 * Unlike most other groups, we can't group.addProperty(styleMatchName) because they already exist
 * The only way to "create" them in the UI is to call the commandID revealing it.
 *
 * However, this will operate on _all selected layers_, so we need to ensure only this layer is selected beforehad
 */
function _createStyleGroup(layerStyles: PropertyGroup, aexStyleProperty: AexPropertyGroup, state: AexState): PropertyGroup {
    const layerStyleCommandIDs = {
        'dropShadow/enabled': 9000,
        'innerShadow/enabled': 9001,
        'outerGlow/enabled': 9002,
        'innerGlow/enabled': 9003,
        'bevelEmboss/enabled': 9004,
        'chromeFX/enabled': 9005,
        'solidFill/enabled': 9006,
        'gradientFill/enabled': 9007,
        'frameFX/enabled': 9008,
    };

    const { matchName } = aexStyleProperty;

    const layer = layerStyles.propertyGroup(layerStyles.propertyDepth) as AVLayer;
    const layerWasSelected = layer.selected;

    // Deselect All
    app.executeCommand(2004);

    // make sure only this layer is selected
    layer.selected = true;

    for (let ii = 2; ii <= layerStyles.numProperties; ii++) {
        const styleProp = layerStyles.property(ii) as PropertyGroup;

        if (styleProp.matchName === matchName) {
            if (!styleProp.enabled) {
                // Add the property
                app.executeCommand(layerStyleCommandIDs[matchName]);

                // Set enabled, if eligible
                assignAttributes(styleProp, { enabled: aexStyleProperty.enabled });

                // Reset selected fag
                layer.selected = layerWasSelected;

                return styleProp;
            }
        }
    }
}
