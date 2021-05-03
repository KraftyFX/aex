function getProperty(aeProperty: Property, state: AexState): AexProperty {
    const aexProperty: AexProperty = {
        type: _getPropertyType(aeProperty),
        name: aeProperty.name,
        matchName: aeProperty.matchName,
        value: undefined,
        enabled: getModifiedValue(aeProperty.enabled, true),
        expression: getModifiedValue(aeProperty.expression, ''),
        expressionEnabled: getModifiedValue(aeProperty.expressionEnabled, false),
        keys: undefined,
    };

    const isUnreadable = isUnreadableProperty(aeProperty);
    aexProperty.keys = _getPropertyKeys(aeProperty, isUnreadable, state);

    if (isUnreadable) {
        return getUnsupportedProperty(aeProperty, aexProperty, state);
    } else {
        aexProperty.value = _getPropertyValue(aeProperty, aeProperty.value);
    }

    state.stats.propertyCount++;
    return aexProperty;
}

function _createPropertyBase(aePropertyGroup: PropertyGroup, aexProperty: AexPropertyBase, state: AexState): PropertyBase {
    const { matchName } = aexProperty;

    const property = aePropertyGroup.addProperty(matchName);

    const name = property.parentProperty.propertyType === PropertyType.INDEXED_GROUP ? aexProperty.name : undefined;

    assignAttributes(property, {
        name,
        enabled: aexProperty.enabled,
    });

    return property;
}

function isUnreadableProperty(aeProperty: Property<UnknownPropertyType>) {
    return aeProperty.propertyValueType == PropertyValueType.NO_VALUE || aeProperty.propertyValueType === PropertyValueType.CUSTOM_VALUE;
}

function setProperty(aeProperty: Property, aexProperty: AexProperty, state: AexState): void {
    assignAttributes(aeProperty, {
        enabled: aexProperty.enabled,
        expression: aexProperty.expression,
        expressionEnabled: aexProperty.expressionEnabled,
    });

    /**
     * We can only set property names if they're a member of a INDEXED_GROUP
     */
    if (aeProperty.propertyGroup(1).propertyType === PropertyType.INDEXED_GROUP) {
        aeProperty.name = aexProperty.name;
    }

    let aexValue = _createAexValue(aeProperty, aexProperty.value, state);
    _setPropertyValue(aeProperty, aexValue, state);
    _setPropertyKeys(aeProperty, aexProperty, state);

    state.stats.propertyCount++;
}

function _getPropertyType(aeProperty: Property<UnknownPropertyType>): AexPropertyType {
    switch (aeProperty.propertyValueType) {
        case PropertyValueType.OneD:
        case PropertyValueType.MASK_INDEX:
        case PropertyValueType.LAYER_INDEX:
            return AEX_ONED_PROPERTY;
        case PropertyValueType.TwoD:
        case PropertyValueType.TwoD_SPATIAL:
            return AEX_TWOD_PROPERTY;
        case PropertyValueType.ThreeD:
        case PropertyValueType.ThreeD_SPATIAL:
            return AEX_THREED_PROPERTY;
        case PropertyValueType.COLOR:
            return AEX_COLOR_PROPERTY;
        case PropertyValueType.SHAPE:
            return AEX_SHAPE_PROPERTY;
        case PropertyValueType.TEXT_DOCUMENT:
            return AEX_TEXTDOCUMENT_PROPERTY;
        case PropertyValueType.MARKER:
            return AEX_MARKER_PROPERTY;
        case PropertyValueType.NO_VALUE:
            return AEX_NONE_PROPERTY;
        case PropertyValueType.CUSTOM_VALUE:
            return AEX_CUSTOM_PROPERTY;
        default:
            throw new Error(`Unsupported property type "${aeProperty.name}" ${aeProperty.propertyValueType}`);
    }
}

function isShapeProperty(aeProperty: Property<UnknownPropertyType>): boolean {
    return aeProperty.propertyValueType === PropertyValueType.SHAPE;
}
