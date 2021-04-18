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

function hasDefaultPropertyValue(property: Property<UnknownPropertyType>) {
    /**
     * Voodoo: For Shape Stroke Dashes, we need to check `canSetExpression` instead of `isModified`
     */
    if (property.propertyGroup(1).matchName === 'ADBE Vector Stroke Dashes') {
        return !property.canSetExpression;
    } else {
        return !property.isModified;
    }
}

/**
 * Gets the value of a property if and only if another boolean property is set
 * that dictates if and how it should be read.
 *
 * @param shouldRead Property from AfterEffects that decides if the value should be read.
 * @param callback Function that gets the value that should be serialized
 * @param aeDefaultValue The expected default value provided by AE for the property
 * @returns The property value if and only if the property exists and is
 * set to something other than the default.
 */
function getBoundModifiedValue<T>(shouldRead: boolean, callback: () => T, aeDefaultValue: T): T | undefined {
    /**
     * @todo Add AexOption for whether to return default values, vs return undefined
     */
    return shouldRead ? getModifiedValue<T>(callback(), aeDefaultValue) : undefined;
}

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
