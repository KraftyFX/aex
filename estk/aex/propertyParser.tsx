function propertyParser(options: AexOptions) {
    function _parsePropertyBase<T>(property: Property<T>): AexPropertyBase {
        const enabled = getModifiedValue(property.enabled, true);
        const matchName = property.matchName;
        const name = property.name;

        return {
            enabled,
            matchName,
            name,
        };
    }

    function _parseKeys<T>(property: Property<T>): AEQKeyInfo[] {
        const propertyKeys = aeq.getKeys(property as any);
        const keys = propertyKeys.map(function (key) {
            const keyInfo = key.getKeyInfo();

            let value = keyInfo.value;
            let time = keyInfo.time;

            let keyInterpolationType = keyInfo.interpolationType;
            let interpolationType = {
                inType: getModifiedValue(keyInterpolationType.inType, KeyframeInterpolationType.LINEAR),
                outType: getModifiedValue(keyInterpolationType.outType, KeyframeInterpolationType.LINEAR),
            };

            let keyTemporalEase = keyInfo.temporalEase;
            let temporalEase = keyTemporalEase
                ? {
                      inEase: getModifiedValue(keyTemporalEase.inEase, [
                          {
                              influence: 16.666666667,
                              speed: 0,
                          },
                      ]),
                      outEase: getModifiedValue(keyTemporalEase.outEase, [
                          {
                              influence: 16.666666667,
                              speed: 0,
                          },
                      ]),
                  }
                : undefined;

            let keySpatialTangent = keyInfo.spatialTangent;
            let spatialTangent = keySpatialTangent
                ? {
                      inTangent: getModifiedValue(keySpatialTangent.inTangent, [0, 0, 0]),
                      outTangent: getModifiedValue(keySpatialTangent.outTangent, [0, 0, 0]),
                  }
                : undefined;

            let temporalAutoBezier = keyInfo.temporalAutoBezier ? getModifiedValue(keyInfo.temporalAutoBezier, false) : undefined;
            let temporalContinuous = keyInfo.temporalContinuous ? getModifiedValue(keyInfo.temporalContinuous, false) : undefined;
            let spatialAutoBezier = keyInfo.spatialAutoBezier ? getModifiedValue(keyInfo.spatialAutoBezier, false) : undefined;
            let spatialContinuous = keyInfo.spatialContinuous ? getModifiedValue(keyInfo.spatialContinuous, false) : undefined;
            let roving = keyInfo.roving ? getModifiedValue(keyInfo.roving, false) : undefined;

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

    return {
        getModifiedProperty<T>(property: Property<T>): AexProperty<T> | undefined {
            if (aeq.isNullOrUndefined(property) || !property.isModified) {
                return undefined;
            }

            return this.parseProperty(property);
        },
        parseProperty<T>(property: Property<T>): AexProperty<T> {
            const { matchName, propertyValueType } = property;

            const propertyBaseProperties = _parsePropertyBase(property);
            const expression = getModifiedValue(property.expression, '');
            const expressionEnabled = getModifiedValue(property.expressionEnabled, false);

            const value = property.value;
            let keys;
            if (property.numKeys > 0) {
                keys = _parseKeys(property);
            }

            return {
                ...propertyBaseProperties,
                expression,
                expressionEnabled,
                value,
                keys,
            };
        },
        parseMarkers(markerProperty: Property<MarkerValue>): AexMarkerProperty[] {
            let markerData = [] as AexMarkerProperty[];

            for (let ii = 1, il = markerProperty.numKeys; ii <= il; ii++) {
                let time = markerProperty.keyTime(ii);
                let keyValue = markerProperty.keyValue(ii);

                const comment = getModifiedValue(keyValue.comment, '');
                const chapter = getModifiedValue(keyValue.chapter, '');
                const url = getModifiedValue(keyValue.url, '');
                const frameTarget = getModifiedValue(keyValue.frameTarget, '');
                const cuePointName = getModifiedValue(keyValue.cuePointName, '');
                const duration = getModifiedValue(keyValue.duration, 0);
                const parameters = keyValue.getParameters();
                const label = getModifiedValue(keyValue.label, 0);
                const protectedRegion = getModifiedValue(keyValue.protectedRegion, false);

                markerData.push({
                    time,
                    comment,
                    chapter,
                    url,
                    frameTarget,
                    cuePointName,
                    duration,
                    parameters: parameters.toSource() === '({})' ? undefined : parameters,
                    label,
                    protectedRegion,
                });
            }

            return markerData;
        },
        parsePropertyGroup(propertyGroup: PropertyGroup): AexProperties {
            let groupProperties = {};

            for (var ii = 1, il = propertyGroup.numProperties; ii <= il; ii++) {
                const property = propertyGroup.property(ii) as Property<any>;
                const matchName = property.matchName;

                if (property.propertyType == PropertyType.PROPERTY) {
                    groupProperties[matchName] = this.getModifiedProperty(property);
                    continue;
                }

                groupProperties[matchName] = this.parsePropertyGroup(property);
            }

            return groupProperties;
        },
    };
}
