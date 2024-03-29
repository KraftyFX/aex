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
    } else {
        return getProperty(property, state);
    }
}

function hasDefaultPropertyValue(property: Property<UnknownPropertyType>) {
    /**
     * Voodoo
     *
     * For Shape Stroke Dashes, we need to check `canSetExpression` instead of `isModified`
     */
    if (property.propertyGroup(1).matchName === 'ADBE Vector Stroke Dashes') {
        return !property.canSetExpression;
    } else {
        return !property.isModified;
    }
}
