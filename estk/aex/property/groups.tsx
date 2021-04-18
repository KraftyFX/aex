function getPropertyGroup(propertyGroup: PropertyGroup, state: AexState, skip?: (property: PropertyBase) => boolean): AexPropertyGroup {
    skip = skip || (() => false);

    const aexProperties: PropertyBase[] = [];

    forEachPropertyInGroup(propertyGroup, (property) => {
        if (skip(property)) {
            return;
        }

        let aexProperty;

        if (property.propertyType == PropertyType.PROPERTY) {
            aexProperty = getModifiedProperty(property as any, state);
        } else {
            aexProperty = getPropertyGroup(property as PropertyGroup, state, skip);
        }

        /**
         * If we haven't retrieved any data, don't store the property
         * This helps prevent a _ton_ of objects with empty arrays
         */
        if (!aeq.isNullOrUndefined(aexProperty)) {
            aexProperties.push(aexProperty);
        }
    });

    /**
     * If there are no properties at all in this group,
     * it's default and we can skip it. Preventing empty data.
     */
    if (aexProperties.length === 0) {
        return undefined;
    }

    /**
     * If this property group is in an INDEXED_GROUP, the user can specify its name
     * There's no way to check "isModified" for these names, so we'll dump them no matter what
     */
    const name = propertyGroup.parentProperty.propertyType === PropertyType.INDEXED_GROUP ? propertyGroup.name : undefined;

    /**
     * Some property groups can be enabled/disabled; if this is one, get the value if it's not false.
     *
     * We need the ternary check to avoid throwing an error when querying 'enabled'.
     */
    const enabled = getBoundModifiedValue(propertyGroup.canSetEnabled, () => propertyGroup.enabled, true);

    return {
        matchName: propertyGroup.matchName,
        name,
        enabled,

        properties: aexProperties,
    };
}

function setPropertyGroup(propertyGroup: PropertyGroup, aexPropertyGroup: AexPropertyGroup, state: AexState): void {
    aeq.forEach(aexPropertyGroup.properties, (aexProperty: AexPropertyBase) => {
        const property = propertyGroup.property(aexProperty.matchName);

        if (property.propertyType == PropertyType.PROPERTY) {
            setProperty(property as any, aexProperty as AexProperty, state);
        } else {
            setPropertyGroup(property as PropertyGroup, aexProperty as AexPropertyGroup, state);
        }
    });
}