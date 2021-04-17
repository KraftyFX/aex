function getModifiedProperty(property: ShapeProperty, state: AexState): AexProperty<Shape> | undefined;
function getModifiedProperty(property: TextDocumentProperty, state: AexState): AexProperty<AexTextDocument> | undefined;
function getModifiedProperty(property: OneDProperty, state: AexState): AexProperty<number> | undefined;
function getModifiedProperty(property: TwoDProperty, state: AexState): AexProperty<TwoDPoint> | undefined;
function getModifiedProperty(property: ThreeDProperty, state: AexState): AexProperty<ThreeDPoint> | undefined;
function getModifiedProperty(property: TwoDProperty | ThreeDProperty, state: AexState): AexProperty<TwoDPoint> | AexProperty<ThreeDPoint> | undefined;
function getModifiedProperty(property: Property, state: AexState): AexProperty | undefined {
    if (aeq.isNullOrUndefined(property)) {
        return undefined;
    }

    if (hasDefaultPropertyValue(property)) {
        return undefined;
    }

    return getProperty(property, state);
}

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
    _setPropertyKeys(property, aexProperty.keys, state);

    state.stats.propertyCount++;
}
