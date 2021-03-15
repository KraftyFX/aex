function getModifiedProperty<T>(property: Property<T>): AexProperty<T> | undefined {
    if (aeq.isNullOrUndefined(property) || !property.isModified) {
        return undefined;
    }

    const { matchName, propertyValueType } = property;

    if (propertyValueType == PropertyValueType.NO_VALUE || propertyValueType === PropertyValueType.CUSTOM_VALUE) {
        throw new Error(`Can't parse property: ${matchName}`);
    }

    const aexProperty: AexProperty<T> = {
        name: property.name,
        matchName,
        value: property.value,
        enabled: getModifiedValue(property.enabled, true),
        expression: getModifiedValue(property.expression, ''),
        expressionEnabled: getModifiedValue(property.expressionEnabled, false),
        keys: _getPropertyKeys<T>(property),
    };

    return aexProperty;
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

function getPropertyGroup(propertyGroup: PropertyGroup): AexProperties {
    if (!propertyGroup) {
        return undefined;
    }

    let groupProperties = {};

    for (let ii = 1, il = propertyGroup.numProperties; ii <= il; ii++) {
        const property = propertyGroup.property(ii);
        const matchName = property.matchName;

        if (property.propertyType == PropertyType.PROPERTY) {
            groupProperties[matchName] = getModifiedProperty(property as Property<any>);
            continue;
        }

        groupProperties[matchName] = getPropertyGroup(property as PropertyGroup);
    }

    return groupProperties;
}

function _getPropertyKeys<T>(property: Property<T>): AEQKeyInfo[] {
    if (property.numKeys === 0) {
        return undefined;
    }

    const propertyKeys = aeq.getKeys(property as any);
    const keys = propertyKeys.map((key) => {
        const keyInfo = key.getKeyInfo();

        const value = keyInfo.value;
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

        const temporalAutoBezier = keyInfo.temporalAutoBezier ? getModifiedValue(keyInfo.temporalAutoBezier, false) : undefined;
        const temporalContinuous = keyInfo.temporalContinuous ? getModifiedValue(keyInfo.temporalContinuous, false) : undefined;
        const spatialAutoBezier = keyInfo.spatialAutoBezier ? getModifiedValue(keyInfo.spatialAutoBezier, false) : undefined;
        const spatialContinuous = keyInfo.spatialContinuous ? getModifiedValue(keyInfo.spatialContinuous, false) : undefined;
        const roving = keyInfo.roving ? getModifiedValue(keyInfo.roving, false) : undefined;

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
