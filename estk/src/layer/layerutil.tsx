type FillCallback<T extends AexPropertyGroup = AexPropertyGroup> = (propertyGroup: PropertyGroup, aexPropertyGroup: T) => void;
type FillShapeCallback = FillCallback<AexShapePropertyGroup>;

/**
 * Some properties on AE classes like AVLayer.effect, Shape.contents, etc. need to preserve the first
 * level of property groups even if they use their default values b/c their mere existence has
 * significance on rendering. This helper method converts just the first level and lets the caller
 * fill the aex group object along the way.
 *
 * @param propertyGroup Group to traverse
 * @param fillPropertyGroup callback to fill additional properties in the AexPropertyGroup
 * @returns Array of AexPropertyGroup's
 */
function getTopLevelPropertyGroups<T extends AexPropertyGroup = AexPropertyGroup>(
    propertyGroup: PropertyGroup,
    fillPropertyGroup: FillCallback<T>,
    state: AexState
): T[] {
    const result: T[] = [];

    forEachPropertyInGroup(
        propertyGroup,
        (childPropertyGroup: PropertyGroup) => {
            const { name, matchName } = childPropertyGroup;

            const aexPropertyGroup = {
                name,
                matchName,
                enabled: getModifiedValue(childPropertyGroup.enabled, true),
                properties: null,
            } as T;

            fillPropertyGroup(childPropertyGroup, aexPropertyGroup);

            result.push(aexPropertyGroup);
        },
        state
    );

    return result;
}
