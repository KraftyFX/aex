function prescanPropertyGroup(aePropertyGroup: PropertyGroup, state: AexState) {
    if (aeq.isNullOrUndefined(aePropertyGroup)) {
        return;
    }

    return forEachPropertyInGroup(
        aePropertyGroup,
        (property) => {
            if (property.propertyType == PropertyType.PROPERTY) {
                prescanProperty(property as Property, state);
            } else {
                prescanPropertyGroup(property as PropertyGroup, state);
            }
        },
        state
    );
}

function getPropertyGroup(aePropertyGroup: PropertyGroup, state: AexState, skip?: (property: PropertyBase) => boolean): AexPropertyGroup {
    skip = skip || (() => false);

    const aexProperties: PropertyBase[] = [];

    forEachPropertyInGroup(
        aePropertyGroup,
        (property) => {
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
        },
        state
    );

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
    const name = aePropertyGroup.parentProperty.propertyType === PropertyType.INDEXED_GROUP ? aePropertyGroup.name : undefined;

    /**
     * Some property groups can be enabled/disabled; if this is one, get the value if it's not false.
     *
     * We need the ternary check to avoid throwing an error when querying 'enabled'.
     */
    const enabled = getBoundModifiedValue(aePropertyGroup.canSetEnabled, () => aePropertyGroup.enabled, true);

    return {
        matchName: aePropertyGroup.matchName,
        name,
        enabled,

        properties: aexProperties,
    };
}

function setPropertyGroup(propertyGroup: PropertyGroup, aexPropertyGroup: AexPropertyGroup, state: AexState): void {
    const aexProperties = aeq.arrayEx(aexPropertyGroup.properties);

    aexProperties.forEach((aexProperty: AexPropertyBase) => {
        const { matchName } = aexProperty;

        let property: PropertyBase;

        /**
         * Voodoo: There are cases where a property will exist, but won't be visible in the UI unless we addProperty() it
         */
        if (propertyGroup.canAddProperty(matchName)) {
            property = _createPropertyBase(propertyGroup, aexProperty, state);
        } else {
            property = propertyGroup.property(matchName);
        }

        assertIsFalse(aeq.isNullOrUndefined(property), `Can't set property '${matchName}' in group '${propertyGroup.matchName}'`);

        if (property.propertyType == PropertyType.PROPERTY) {
            setProperty(property as any, aexProperty as AexProperty, state);
        } else {
            setPropertyGroup(property as PropertyGroup, aexProperty as AexPropertyGroup, state);
        }
    });
}
