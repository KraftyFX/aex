type OnGroupCallback<T extends AexPropertyGroup = AexPropertyGroup> = (propertyGroup: PropertyGroup, aexPropertyGroup: T) => void;
type OnShapeGroupCallback = OnGroupCallback<AexShapePropertyGroup>;

function getUnnestedPropertyGroup<T extends AexPropertyGroup = AexPropertyGroup>(
    propertyGroup: PropertyGroup,
    onGroup: OnGroupCallback<T> | null,
    state: AexState
): T[] {
    onGroup = onGroup || (() => {});
    const result: T[] = [];

    forEachPropertyInGroup(propertyGroup, (childPropertyGroup: PropertyGroup) => {
        const { name, matchName } = childPropertyGroup;

        const aexGroup = {
            name,
            matchName,
            enabled: getModifiedValue(childPropertyGroup.enabled, true),

            properties: null,
        } as T;

        onGroup(childPropertyGroup, aexGroup);

        if (aexGroup.properties === null) {
            const propertyData = getPropertyGroup(childPropertyGroup, state);
            aexGroup.properties = propertyData ? propertyData.properties : undefined;
        }

        result.push(aexGroup);
    });

    return result;
}
