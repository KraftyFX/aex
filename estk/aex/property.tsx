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

/** @todo Add type safety */
function _getPropertyValue(property: Property, value: any): any {
    if (isTextDocument(property)) {
        return _getTextDocumentProperties(value);
    } else {
        let propertyValue = value;

        /**
         * Time Remap keyframes need to be 0 -> 1 normalized for deserialization
         */
        if (property.matchName === 'ADBE Time Remapping') {
            const propLayer = property.propertyGroup(property.propertyDepth) as AVLayer;
            const propSource = propLayer.source as AVItem;
            const propDuration = propSource.duration;

            propertyValue = value / propDuration;
        }

        return getRoundedValue(propertyValue);
    }
}

/** We can't setValue on an animated property, so back out */
function _setPropertyValue(property: Property, value: any, state: AexState) {
    if (property.numKeys > 0) {
        return;
    }

    try {
        property.setValue(value);
    } catch (e) {
        throw e;
    }
}

function _createAexValue(property: Property, aexObjValue: any, state: AexState): any {
    let aexValue: any;

    if (isTextDocument(property)) {
        aexValue = _createTextDocument(property.value, aexObjValue, state);
    } else {
        aexValue = aexObjValue;
    }

    return aexValue;
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

function _getPropertyKeys(property: Property, isUnreadable: boolean, state: AexState): AEQKeyInfo[] {
    const propertyKeys = aeq.getKeys(property);
    const keys = propertyKeys.map((key) => {
        const aexKey = {
            time: key.getTime(),
            value: undefined,
            interpolationType: undefined,
            temporalEase: undefined,
            spatialTangent: undefined,
            temporalAutoBezier: undefined,
            temporalContinuous: undefined,
            spatialAutoBezier: undefined,
            spatialContinuous: undefined,
            roving: undefined,
        };

        if (!isUnreadable) {
            const keyInfo = key.getKeyInfo();

            aexKey.value = _getPropertyValue(property, keyInfo.value);

            const keyInterpolationType = keyInfo.interpolationType;
            aexKey.interpolationType = {
                inType: getModifiedValue(keyInterpolationType.inType, KeyframeInterpolationType.LINEAR),
                outType: getModifiedValue(keyInterpolationType.outType, KeyframeInterpolationType.LINEAR),
            };

            const keyTemporalEase = keyInfo.temporalEase;
            aexKey.temporalEase = keyTemporalEase
                ? {
                      inEase: getModifiedValue(keyTemporalEase.inEase, [
                          {
                              influence: 16.666666667,
                              speed: 0,
                          } as KeyframeEase,
                      ]),
                      outEase: getModifiedValue(keyTemporalEase.outEase, [
                          {
                              influence: 16.666666667,
                              speed: 0,
                          } as KeyframeEase,
                      ]),
                  }
                : undefined;

            const keySpatialTangent = keyInfo.spatialTangent;
            aexKey.spatialTangent = keySpatialTangent
                ? {
                      inTangent: getModifiedValue(keySpatialTangent.inTangent, [0, 0, 0]),
                      outTangent: getModifiedValue(keySpatialTangent.outTangent, [0, 0, 0]),
                  }
                : undefined;

            aexKey.temporalAutoBezier = getModifiedValue(keyInfo.temporalAutoBezier, false);
            aexKey.temporalContinuous = getModifiedValue(keyInfo.temporalContinuous, false);
            aexKey.spatialAutoBezier = getModifiedValue(keyInfo.spatialAutoBezier, false);
            aexKey.spatialContinuous = getModifiedValue(keyInfo.spatialContinuous, false);
            aexKey.roving = getModifiedValue(keyInfo.roving, false);
        }

        return aexKey;
    });

    state.stats.keyCount++;
    return keys;
}

function _setPropertyKeys(property: Property, aexKeys: AEQKeyInfo[], state: AexState): void {
    const keys = aeq.arrayEx(aexKeys) as AEQArrayEx<AEQKeyInfo>;

    const times = [];
    const values = [];

    keys.forEach((aexKey) => {
        times.push(aexKey.time);

        const aexValue = _createAexValue(property, aexKey.value, state);
        values.push(aexValue);
    });

    if (keys.length > 0) {
        property.setValuesAtTimes(times, values);

        keys.forEach((aexKey, ii) => {
            if (!aeq.isNullOrUndefined(aexKey.temporalEase)) {
                property.setTemporalEaseAtKey(ii, aexKey.temporalEase[0], aexKey.temporalEase[1]);
            }

            if (!aeq.isNullOrUndefined(aexKey.interpolationType)) {
                property.setInterpolationTypeAtKey(ii, aexKey.interpolationType[0], aexKey.interpolationType[1]);
            }

            if (!aeq.isNullOrUndefined(aexKey.temporalAutoBezier) && !aeq.isNullOrUndefined(aexKey.temporalContinuous)) {
                property.setTemporalAutoBezierAtKey(ii, aexKey.temporalAutoBezier);
                property.setTemporalContinuousAtKey(ii, aexKey.temporalContinuous);
            }

            if (!aeq.isNullOrUndefined(aexKey.spatialAutoBezier) && !aeq.isNullOrUndefined(aexKey.spatialContinuous)) {
                property.setSpatialAutoBezierAtKey(ii, aexKey.spatialAutoBezier);
                property.setSpatialContinuousAtKey(ii, aexKey.spatialContinuous);

                property.setSpatialTangentsAtKey(ii, aexKey.spatialTangent[0], aexKey.spatialTangent[1]);
                property.setRovingAtKey(ii, aexKey.roving);
            }
        });
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

function getPropertyGroup(propertyGroup: PropertyGroup, state: AexState, skip?: (property: PropertyBase) => boolean): AexPropertyGroup {
    skip = skip || (() => false);

    const aexProperties: PropertyBase[] = [];

    forEachPropertyInGroup(propertyGroup, (property) => {
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
    });

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
    const name = propertyGroup.parentProperty.propertyType === PropertyType.INDEXED_GROUP ? propertyGroup.name : undefined;

    /**
     * Some property groups can be enabled/disabled; if this is one, get the value if it's not false.
     *
     * We need the ternary check to avoid throwing an error when querying 'enabled'.
     */
    const enabled = getBoundModifiedValue(propertyGroup.canSetEnabled, () => propertyGroup.enabled, true);

    return {
        matchName: propertyGroup.matchName,
        name,
        enabled,

        properties: aexProperties,
    };
}

function setPropertyGroup(propertyGroup: PropertyGroup, aexPropertyGroup: AexPropertyGroup, state: AexState): void {
    aeq.forEach(aexPropertyGroup.properties, (aexProperty: AexPropertyBase) => {
        const property = propertyGroup.property(aexProperty.matchName);

        if (property.propertyType == PropertyType.PROPERTY) {
            setProperty(property as any, aexProperty as AexProperty, state);
        } else {
            setPropertyGroup(property as PropertyGroup, aexProperty as AexPropertyGroup, state);
        }
    });
}

function _getTextDocumentProperties(text: TextDocument): AexTextDocument {
    const { pointText } = text;

    return {
        pointText,
        text: getModifiedValue(text.text, ''),

        allCaps: getModifiedValue(text.allCaps, false),
        applyFill: getModifiedValue(text.applyFill, false),
        applyStroke: getModifiedValue(text.applyStroke, false),
        baselineLocs: getModifiedValue(text.baselineLocs, [0, 0]),
        baselineShift: getModifiedValue(text.baselineShift, -1),
        boxTextPos: getBoundModifiedValue(text.boxText, () => text.boxTextPos, [0, 0]),
        boxTextSize: getBoundModifiedValue(text.boxText, () => text.boxTextSize, [0, 0]),
        fauxBold: getModifiedValue(text.fauxBold, false),
        fauxItalic: getModifiedValue(text.fauxItalic, false),
        fillColor: getBoundModifiedValue(text.applyFill, () => text.fillColor, [0, 0, 0]),
        font: getModifiedValue(text.font, ''),
        fontFamily: getModifiedValue(text.fontFamily, ''),
        fontSize: getModifiedValue(text.fontSize, 32),
        fontStyle: getModifiedValue(text.fontStyle, ''),
        horizontalScale: getModifiedValue(text.horizontalScale, -1),
        justification: getModifiedValue(text.justification, ParagraphJustification.LEFT_JUSTIFY),
        leading: getModifiedValue(text.leading, -1),
        smallCaps: getModifiedValue(text.smallCaps, false),
        strokeColor: getBoundModifiedValue(text.applyStroke, () => text.strokeColor, [0, 0, 0]),
        strokeOverFill: getBoundModifiedValue(text.applyStroke, () => text.strokeOverFill, false),
        strokeWidth: getBoundModifiedValue(text.applyStroke, () => text.strokeWidth, -1),
        subscript: getModifiedValue(text.subscript, false),
        superscript: getModifiedValue(text.superscript, false),
        tracking: getModifiedValue(text.tracking, -1),
        tsume: getModifiedValue(text.tsume, -1),
        verticalScale: getModifiedValue(text.verticalScale, -1),
    };
}

function _createTextDocument(textDoc: TextDocument, aexTextDocument: AexTextDocument, state: AexState): TextDocument {
    textDoc.resetCharStyle();

    /**
     * These properties are read & serialized, but can't be deserialized:
     *
     * textDoc.allCaps = aexTextDocument.allCaps;
     * textDoc.boxTextPos = aexTextDocument.boxTextPos;
     * textDoc.fauxBold = aexTextDocument.fauxBold;
     * textDoc.fauxItalic = aexTextDocument.fauxItalic;
     * textDoc.fontFamily = aexTextDocument.fontFamily;
     * textDoc.fontStyle = aexTextDocument.fontStyle;
     * textDoc.horizontalScale = aexTextDocument.horizontalScale;
     * textDoc.smallCaps = aexTextDocument.smallCaps;
     * textDoc.subscript = aexTextDocument.subscript;
     * textDoc.superscript = aexTextDocument.superscript;
     * textDoc.tsume = aexTextDocument.tsume;
     * textDoc.verticalScale = aexTextDocument.verticalScale;
     * textDoc.baselineLocs = aexTextDocument.baselineLocs;
     * textDoc.baselineShift = aexTextDocument.baselineShift;
     */
    assignAttributes(textDoc, {
        font: aexTextDocument.font,
        fontSize: aexTextDocument.fontSize,
        justification: aexTextDocument.justification,
        leading: aexTextDocument.leading,
        text: aexTextDocument.text,
        tracking: aexTextDocument.tracking,
    });

    /** If not pointText, then we're using boxText */
    if (!aexTextDocument.pointText) {
        assignAttributes(textDoc, {
            boxTextSize: aexTextDocument.boxTextSize,
        });
    }

    if (!aeq.isNullOrUndefined(aexTextDocument.applyFill)) {
        assignAttributes(textDoc, {
            applyFill: aexTextDocument.applyFill,
            fillColor: aexTextDocument.fillColor,
        });
    }

    if (!aeq.isNullOrUndefined(aexTextDocument.applyStroke)) {
        assignAttributes(textDoc, {
            applyStroke: aexTextDocument.applyStroke,
            strokeColor: aexTextDocument.strokeColor,
            strokeOverFill: aexTextDocument.strokeOverFill,
            strokeWidth: aexTextDocument.strokeWidth,
        });
    }

    return textDoc;
}

function getAexMarkerProperties(markerProperty: MarkerValueProperty): AexMarkerProperty[] {
    const markerData = [] as AexMarkerProperty[];

    forEachPropertyKeyValue<MarkerValue>(markerProperty, (keyValue, i) => {
        markerData.push({
            time: roundNumber(markerProperty.keyTime(i + 1)), // key indicies are 1-based
            comment: getModifiedValue(keyValue.comment, ''),
            chapter: getModifiedValue(keyValue.chapter, ''),
            url: getModifiedValue(keyValue.url, ''),
            frameTarget: getModifiedValue(keyValue.frameTarget, ''),
            cuePointName: getModifiedValue(keyValue.cuePointName, ''),
            duration: getModifiedValue(keyValue.duration, 0),
            label: getModifiedValue(keyValue.label, 0),
            protectedRegion: getModifiedValue(keyValue.protectedRegion, false),
            parameters: _getMarkerParameters(keyValue),
        });
    });

    return markerData;
}

function createMarkers(markerProperty: MarkerValueProperty, aexMarkers: AexMarkerProperty[], state: AexState): void {
    if (aeq.isNullOrUndefined(aexMarkers)) {
        return;
    }

    const markers = aeq.arrayEx();

    aeq.forEach(aexMarkers, (aexMarker) => {
        const marker = new MarkerValue(aexMarker.comment || '');

        assignAttributes(marker, {
            chapter: aexMarker.chapter,
            url: aexMarker.url,
            frameTarget: aexMarker.frameTarget,
            cuePointName: aexMarker.cuePointName,
            duration: aexMarker.duration,
            label: aexMarker.label,
            protectedRegion: aexMarker.protectedRegion,
            parameters: aexMarker.parameters,
        });

        markers.push({
            time: aexMarker.time,
            marker: marker,
        });
    });

    /**
     * Voodoo: Unlike most animated properties, we can't use Property.setValueAtTime() with markers.
     * As a result, we need to set each keyframe individually.
     */
    markers.forEach((marker) => {
        markerProperty.setValueAtTime(marker.time, marker.marker);
    });

    state.stats.propertyCount++;
}

function _getMarkerParameters(keyValue: MarkerValue): object {
    const parameters = keyValue.getParameters();

    return parameters.toSource() === '({})' ? undefined : parameters;
}
