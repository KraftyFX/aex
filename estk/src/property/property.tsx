function prescanProperty(aeProperty: Property, state: AexState) {
    if (aeq.isNullOrUndefined(aeProperty)) {
        return;
    }

    prescanPropertyKeys(aeProperty, state);
}

function getProperty(aeProperty: Property, state: AexState): AexProperty {
    return profile(
        'getProperty',
        () => {
            const aexProperty: AexProperty = {
                type: _getPropertyType(aeProperty),
                matchName: aeProperty.matchName,
                value: undefined,
                enabled: getModifiedValue(aeProperty.enabled, true),
                expression: getModifiedValue(aeProperty.expression, ''),
                expressionEnabled: getModifiedValue(aeProperty.expressionEnabled, false),
                keys: undefined,
            };

            const isUnsupportedProperty = isUnreadableProperty(aeProperty);

            if (isUnsupportedProperty) {
                return handleUnsupportedProperty();
            } else {
                aexProperty.keys = _getPropertyKeys(aeProperty, isUnsupportedProperty, state);
                aexProperty.value = _getPropertyValue(aeProperty);
            }

            return aexProperty;

            function handleUnsupportedProperty() {
                switch (state.getOptions.unspportedPropertyBehavior) {
                    case 'metadata':
                        aexProperty.keys = _getPropertyKeys(aeProperty, isUnsupportedProperty, state);
                        return aexProperty;
                    case 'skip':
                        return undefined;
                    case 'log':
                        state.log.push({
                            aexObject: aexProperty,
                            message: `Property "${aeProperty.matchName}" is unsupported. Skipping.`,
                        });
                        return undefined;
                    case 'throw':
                        throw notSupported(`Property '${aeProperty.matchName}'`);
                    default:
                        state.getOptions.unspportedPropertyBehavior({
                            aexObject: aexProperty,
                            message: `Property '${aeProperty.matchName}'`,
                        });
                        return aexProperty;
                }
            }
        },
        state,
        aeProperty.name
    );
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

    if (aexProperty.keys.length > 0) {
        _setPropertyKeys(aeProperty, aexProperty.keys, state);
    } else {
        _setPropertyValue(aeProperty, aexProperty, state);
    }
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
            throw notSupported(`Property type '${aeProperty.name}' (${aeProperty.propertyValueType})`);
    }
}

function isShapeProperty(aeProperty: Property<UnknownPropertyType>): boolean {
    return aeProperty.propertyValueType === PropertyValueType.SHAPE;
}
