function getProperty(property: Property, state: AexState): AexProperty {
    const aexProperty: AexProperty = {
        type: _getPropertyType(property),
        name: property.name,
        matchName: property.matchName,
        value: undefined,
        enabled: getModifiedValue(property.enabled, true),
        expression: getModifiedValue(property.expression, ''),
        expressionEnabled: getModifiedValue(property.expressionEnabled, false),
        keys: undefined,
    };

    const isUnreadable = isUnreadableProperty(property);
    aexProperty.keys = _getPropertyKeys(property, isUnreadable, state);

    if (isUnreadable) {
        return getUnsupportedProperty(property, aexProperty, state);
    } else {
        aexProperty.value = _getPropertyValue(property, property.value);
    }

    state.stats.propertyCount++;
    return aexProperty;
}

function _createPropertyBase(propertyGroup: PropertyGroup, aexProperty: AexPropertyBase, state: AexState): PropertyBase {
    const { matchName } = aexProperty;

    const property = propertyGroup.addProperty(matchName);

    const name = property.parentProperty.propertyType === PropertyType.INDEXED_GROUP ? aexProperty.name : undefined;

    assignAttributes(property, {
        name,
        enabled: aexProperty.enabled,
    });

    return property;
}

function isUnreadableProperty(property: Property<UnknownPropertyType>) {
    return property.propertyValueType == PropertyValueType.NO_VALUE || property.propertyValueType === PropertyValueType.CUSTOM_VALUE;
}

function setProperty(property: Property, aexProperty: AexProperty, state: AexState): void {
    assignAttributes(property, {
        enabled: aexProperty.enabled,
        expression: aexProperty.expression,
        expressionEnabled: aexProperty.expressionEnabled,
    });

    /**
     * We can only set property names if they're a member of a INDEXED_GROUP
     */
    if (property.propertyGroup(1).propertyType === PropertyType.INDEXED_GROUP) {
        property.name = aexProperty.name;
    }

    let aexValue = _createAexValue(property, aexProperty.value, state);
    _setPropertyValue(property, aexValue, state);
    _setPropertyKeys(property, aexProperty, state);

    state.stats.propertyCount++;
}

function _getPropertyType(property: Property<UnknownPropertyType>): AexPropertyType {
    switch (property.propertyValueType) {
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
            throw new Error(`Unsupported property type "${property.name}" ${property.propertyValueType}`);
    }
}

function isShapeProperty(property: Property<UnknownPropertyType>): boolean {
    return property.propertyValueType === PropertyValueType.SHAPE;
}
