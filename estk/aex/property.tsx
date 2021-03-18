function getModifiedProperty<T>(property: Property<T>, valueParser?: Function): AexProperty<T> | undefined {
    const hasDefaultPropertyValue = aeq.isNullOrUndefined(property) || !property.isModified;

    if (hasDefaultPropertyValue) {
        return undefined;
    }

    assertIsReadableProperty<T>(property);

    const aexProperty: AexProperty<T> = {
        name: property.name,
        matchName: property.matchName,
        value: valueParser ? valueParser(property) : property.value,
        enabled: getModifiedValue(property.enabled, true),
        expression: getModifiedValue(property.expression, ''),
        expressionEnabled: getModifiedValue(property.expressionEnabled, false),
        keys: _getPropertyKeys<T>(property, valueParser),
    };

    return aexProperty;
}

function assertIsReadableProperty<T>(property: Property<T>) {
    if (property.propertyValueType == PropertyValueType.NO_VALUE || property.propertyValueType === PropertyValueType.CUSTOM_VALUE) {
        throw new Error(`Can't parse property: ${property.matchName}`);
    }
}

function getAexMarkerProperties(markerProperty: Property<MarkerValue>): AexMarkerProperty[] {
    const markerData = [] as AexMarkerProperty[];

    for (let ii = 1, il = markerProperty.numKeys; ii <= il; ii++) {
        const keyValue = markerProperty.keyValue(ii);

        markerData.push({
            time: markerProperty.keyTime(ii),
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
    }

    return markerData;
}

function getTextDocumentProperties(sourceText: Property<TextDocument>): AexTextDocumentProperty {
    const text = sourceText.value;

    return {
        allCaps: getModifiedValue(text.allCaps, false),
        applyFill: getModifiedValue(text.applyFill, false),
        applyStroke: getModifiedValue(text.applyStroke, false),
        baselineLocs: getModifiedValue(text.baselineLocs, [0, 0]),
        baselineShift: getModifiedValue(text.baselineShift, -1),
        boxTextPos: text.boxText ? getModifiedValue(text.boxTextPos, [0, 0]) : undefined,
        boxTextSize: text.boxText ? getModifiedValue(text.boxTextSize, [0, 0]) : undefined,
        fauxBold: getModifiedValue(text.fauxBold, false),
        fauxItalic: getModifiedValue(text.fauxItalic, false),
        fillColor: text.applyFill ? getModifiedValue(text.fillColor, [0, 0, 0]) : undefined,
        font: getModifiedValue(text.font, ''),
        fontFamily: getModifiedValue(text.fontFamily, ''),
        fontSize: getModifiedValue(text.fontSize, 32),
        fontStyle: getModifiedValue(text.fontStyle, ''),
        horizontalScale: getModifiedValue(text.horizontalScale, -1),
        justification: getModifiedValue(text.justification, ParagraphJustification.LEFT_JUSTIFY),
        leading: getModifiedValue(text.leading, -1),
        pointText: getModifiedValue(text.pointText, true),
        smallCaps: getModifiedValue(text.smallCaps, false),
        strokeColor: text.applyStroke ? getModifiedValue(text.strokeColor, [0, 0, 0]) : undefined,
        strokeOverFill: text.applyStroke ? getModifiedValue(text.strokeOverFill, false) : undefined,
        strokeWidth: text.applyStroke ? getModifiedValue(text.strokeWidth, -1) : undefined,
        subscript: getModifiedValue(text.subscript, false),
        superscript: getModifiedValue(text.superscript, false),
        text: getModifiedValue(text.text, ''),
        tracking: getModifiedValue(text.tracking, -1),
        tsume: getModifiedValue(text.tsume, -1),
        verticalScale: getModifiedValue(text.verticalScale, -1),
    };
}

function getPropertyGroup(propertyGroup: PropertyGroup, valueParser?: Function): AexProperties {
    // zlovatt: Given the call sites why would this ever be null?
    if (!propertyGroup) {
        return undefined;
    }

    const groupProperties = {};

    for (let ii = 1, il = propertyGroup.numProperties; ii <= il; ii++) {
        const property = propertyGroup.property(ii);
        const matchName = property.matchName;

        if (property.propertyType == PropertyType.PROPERTY) {
            groupProperties[matchName] = getModifiedProperty(property as Property<any>, valueParser);
        } else {
            groupProperties[matchName] = getPropertyGroup(property as PropertyGroup, valueParser);
        }
    }

    return groupProperties;
}

function _getPropertyKeys<T>(property: Property<T>, valueParser?: Function): AEQKeyInfo[] {
    const propertyKeys = aeq.getKeys(property as any);
    const keys = propertyKeys.map((key) => {
        const keyInfo = key.getKeyInfo();

        const value = valueParser ? valueParser(keyInfo) : keyInfo.value;
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

function _getMarkerParameters(keyValue: MarkerValue): object {
    const parameters = keyValue.getParameters();

    return parameters.toSource() === '({})' ? undefined : parameters;
}
