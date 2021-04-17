function getUnsupportedProperty(property: Property<UnknownPropertyType>, aexProperty: AexProperty, state: AexState): AexProperty | undefined {
    switch (state.options.unspportedPropertyBehavior) {
        case 'skip':
            return undefined;
        case 'log':
            state.log.push({
                aexProperty,
                message: `Property "${property.matchName}" is unsupported. Skipping.`,
            });
            return undefined;
        case 'throw':
            throw new Error(`Property "${property.matchName}" is unsupported.`);
        case 'metadata':
            return aexProperty;
        default:
            state.options.unspportedPropertyBehavior({
                aexProperty,
                message: `Property "${property.matchName}" is unsupported. Skipping.`,
            });
            return aexProperty;
    }
}

function isUnreadableProperty(property: Property<UnknownPropertyType>) {
    return property.propertyValueType == PropertyValueType.NO_VALUE || property.propertyValueType === PropertyValueType.CUSTOM_VALUE;
}

function isTextDocument(property: Property<UnknownPropertyType>) {
    return property.propertyValueType === PropertyValueType.TEXT_DOCUMENT;
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
