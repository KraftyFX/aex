function getModifiedProperty(property: ShapeProperty, state: AexState): AexProperty<Shape> | undefined;
function getModifiedProperty(property: TextDocumentProperty, state: AexState): AexProperty<AexTextDocument> | undefined;
function getModifiedProperty(property: OneDProperty, state: AexState): AexProperty<number> | undefined;
function getModifiedProperty(property: TwoDProperty, state: AexState): AexProperty<TwoDPoint> | undefined;
function getModifiedProperty(property: ThreeDProperty, state: AexState): AexProperty<ThreeDPoint> | undefined;
function getModifiedProperty(property: TwoDProperty | ThreeDProperty, state: AexState): AexProperty<TwoDPoint> | AexProperty<ThreeDPoint> | undefined;
function getModifiedProperty(property: Property, state: AexState): AexProperty | undefined {
    const hasDefaultPropertyValue = aeq.isNullOrUndefined(property) || !property.isModified;

    if (hasDefaultPropertyValue) {
        return undefined;
    }

    const aexProperty: AexProperty<K> = {
        type: _getPropertyType(property),
        name: property.name,
        matchName: property.matchName,
        value: undefined,
        enabled: getModifiedValue(property.enabled, true),
        expression: getModifiedValue(property.expression, ''),
        expressionEnabled: getModifiedValue(property.expressionEnabled, false),
        keys: undefined,
    };

    const isReadable = isReadableProperty(property);

    if (!isReadable) {
        switch (state.options.unspportedPropertyBehavior) {
            case 'skip':
                return undefined;
            case 'log':
                state.log.push({
                    aeProperty: property,
                    message: `Property "${property.matchName}" is unsupported. Skipping.`,
                });
                return undefined;
            case 'throw':
                throw new Error(`Property "${property.matchName}" is unsupported.`);
            case 'metadata':
                aexProperty.keys = _getPropertyKeys(property, isReadable);
                return aexProperty;
            default:
                state.options.unspportedPropertyBehavior(property, state.log);
                return aexProperty;
        }
    } else {
        if (property.propertyValueType === PropertyValueType.TEXT_DOCUMENT) {
            aexProperty.value = getTextDocumentProperties(property.value);
        } else {
            aexProperty.value = property.value;
        }

        aexProperty.keys = _getPropertyKeys(property, isReadable);
    }

    return aexProperty;
}

function isReadableProperty(property: Property<UnknownPropertyType>) {
    return property.propertyValueType == PropertyValueType.NO_VALUE || property.propertyValueType === PropertyValueType.CUSTOM_VALUE;
}

function _getPropertyType(property: Property<UnknownPropertyType>): AexPropertyType {
    // zlovatt: is this mapping okay?
    switch (property.propertyValueType) {
        case PropertyValueType.OneD:
            return 'aex:property:oned';
        case PropertyValueType.TwoD:
        case PropertyValueType.TwoD_SPATIAL:
            return 'aex:property:twod';
        case PropertyValueType.ThreeD:
        case PropertyValueType.ThreeD_SPATIAL:
            return 'aex:property:threed';
        case PropertyValueType.COLOR:
            return 'aex:property:color';
        case PropertyValueType.SHAPE:
            return 'aex:property:shape';
        case PropertyValueType.TEXT_DOCUMENT:
            return 'aex:property:textdocument';
        case PropertyValueType.MASK_INDEX:
            return 'aex:property:maskindex';
        case PropertyValueType.MARKER:
            return 'aex:property:marker';
        default:
            throw new Error(`Unsupported property type "${property.name}" ${property.propertyValueType}`);
    }
}

function _getPropertyKeys(property: Property, isReadable: boolean): AEQKeyInfo[] {
    const propertyKeys = aeq.getKeys(property);
    const keys = propertyKeys.map((key) => {
        const keyInfo = key.getKeyInfo();

        let value: AEQKeyInfo['value'];

        if (isReadable) {
            if (property.propertyValueType === PropertyValueType.TEXT_DOCUMENT) {
                value = getTextDocumentProperties(keyInfo.value);
            } else {
                value = keyInfo.value;
            }
        } else {
            value = undefined;
        }

        const time = keyInfo.time;

        const keyInterpolationType = keyInfo.interpolationType;
        const interpolationType = {
            inType: getModifiedValue(keyInterpolationType.inType, KeyframeInterpolationType.LINEAR),
            outType: getModifiedValue(keyInterpolationType.outType, KeyframeInterpolationType.LINEAR),
        };

        const keyTemporalEase = keyInfo.temporalEase;
        const temporalEase = keyTemporalEase
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
        const spatialTangent = keySpatialTangent
            ? {
                  inTangent: getModifiedValue(keySpatialTangent.inTangent, [0, 0, 0]),
                  outTangent: getModifiedValue(keySpatialTangent.outTangent, [0, 0, 0]),
              }
            : undefined;

        const temporalAutoBezier = getModifiedValue(keyInfo.temporalAutoBezier, false);
        const temporalContinuous = getModifiedValue(keyInfo.temporalContinuous, false);
        const spatialAutoBezier = getModifiedValue(keyInfo.spatialAutoBezier, false);
        const spatialContinuous = getModifiedValue(keyInfo.spatialContinuous, false);
        const roving = getModifiedValue(keyInfo.roving, false);

        return {
            value,
            time,
            interpolationType,
            temporalEase,
            spatialTangent,
            temporalAutoBezier,
            temporalContinuous,
            spatialAutoBezier,
            spatialContinuous,
            roving,
        };
    });

    return keys;
}

function getPropertyGroup(propertyGroup: PropertyGroup, state: AexState): AexPropertyGroup {
    const properties = [];

    forEachPropertyInGroup(propertyGroup, (property) => {
        let content;

        if (property.propertyType == PropertyType.PROPERTY) {
            content = getModifiedProperty(property as any, state);
        } else {
            content = getPropertyGroup(property as PropertyGroup, state);
        }

        /**
         * If we haven't retrieved any data, don't store the property
         * This helps prevent a _ton_ of objects with empty arrays
         */
        if (!aeq.isNullOrUndefined(content)) {
            properties.push(content);
        }
    });

    /**
     * If there are no properties at all in this group,
     * it's default and we can skip it. Preventing empty data.
     */
    if (properties.length === 0) {
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
        name: name,
        enabled: enabled,

        properties,
    };
}

function getTextDocumentProperties(text: TextDocument): AexTextDocument {
    /**
     * Voodoo: The ternary properties need that boolean check first.
     * If we try to access those properties and the boolean is false, an error will be thrown
     */
    return {
        allCaps: getModifiedValue(text.allCaps, false),
        applyFill: getModifiedValue(text.applyFill, false),
        applyStroke: getModifiedValue(text.applyStroke, false),
        baselineLocs: getModifiedValue(text.baselineLocs, [0, 0]),
        baselineShift: getModifiedValue(text.baselineShift, -1),
        boxTextPos: getBoundModifiedValue(text.boxText, () => text.boxTextPos, [0, 0]), // zlovatt: Why isn't boxText serialized?
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
        pointText: getModifiedValue(text.pointText, true),
        smallCaps: getModifiedValue(text.smallCaps, false),
        strokeColor: getBoundModifiedValue(text.applyStroke, () => text.strokeColor, [0, 0, 0]),
        strokeOverFill: getBoundModifiedValue(text.applyStroke, () => text.strokeOverFill, false),
        strokeWidth: getBoundModifiedValue(text.applyStroke, () => text.strokeWidth, -1),
        subscript: getModifiedValue(text.subscript, false),
        superscript: getModifiedValue(text.superscript, false),
        text: getModifiedValue(text.text, ''),
        tracking: getModifiedValue(text.tracking, -1),
        tsume: getModifiedValue(text.tsume, -1),
        verticalScale: getModifiedValue(text.verticalScale, -1),
    };
}

function getAexMarkerProperties(markerProperty: MarkerValueProperty): AexMarkerProperty[] {
    const markerData = [] as AexMarkerProperty[];

    forEachPropertyKeyValue<MarkerValue>(markerProperty, (keyValue, i) => {
        markerData.push({
            time: markerProperty.keyTime(i + 1), // key indicies are 1-based
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

function _getMarkerParameters(keyValue: MarkerValue): object {
    const parameters = keyValue.getParameters();

    return parameters.toSource() === '({})' ? undefined : parameters;
}
