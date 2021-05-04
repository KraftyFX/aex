function _getPropertyKeys(aeProperty: Property, isUnreadable: boolean, state: AexState): AEQKeyInfo[] {
    const propertyKeys = aeq.getKeys(aeProperty);
    const keys = propertyKeys.map((key) => {
        const aexKey = {
            time: getRoundedValue(key.getTime()),
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

        // TODO: Refactor this block w.r.t. readability testing
        if (!isUnreadable) {
            const keyInfo = key.getKeyInfo();

            aexKey.value = _getPropertyValue(aeProperty, keyInfo);

            const keyInterpolationType = keyInfo.interpolationType;
            const inInterpolationType = getModifiedValue(keyInterpolationType.inType, KeyframeInterpolationType.LINEAR);
            const outInterpolationType = getModifiedValue(keyInterpolationType.outType, KeyframeInterpolationType.LINEAR);

            if (aeq.isNullOrUndefined(inInterpolationType) && aeq.isNullOrUndefined(outInterpolationType)) {
                aexKey.interpolationType = undefined;
            } else {
                aexKey.interpolationType = {
                    inType: inInterpolationType,
                    outType: outInterpolationType,
                };
            }

            const keyTemporalEase = keyInfo.temporalEase;
            if (!aeq.isNullOrUndefined(keyTemporalEase)) {
                const inTemporalEase = _getKeyframeEases(keyTemporalEase.inEase);
                const outTemporalEase = _getKeyframeEases(keyTemporalEase.outEase);

                if (aeq.isNullOrUndefined(inTemporalEase) && aeq.isNullOrUndefined(outTemporalEase)) {
                    aexKey.temporalEase = undefined;
                } else {
                    aexKey.temporalEase = {
                        inEase: inTemporalEase,
                        outEase: outTemporalEase,
                    };
                }
            }

            const keySpatialTangent = keyInfo.spatialTangent;

            if (!aeq.isNullOrUndefined(keySpatialTangent)) {
                const inSpatialTangent = getModifiedValue(keySpatialTangent.inTangent, [0, 0, 0]);
                const outSpatialTangent = getModifiedValue(keySpatialTangent.outTangent, [0, 0, 0]);

                if (aeq.isNullOrUndefined(inSpatialTangent) && aeq.isNullOrUndefined(outSpatialTangent)) {
                    aexKey.spatialTangent = undefined;
                } else {
                    aexKey.spatialTangent = {
                        inTangent: inSpatialTangent,
                        outTangent: outSpatialTangent,
                    };
                }
            }

            aexKey.temporalAutoBezier = getModifiedValue(keyInfo.temporalAutoBezier, false);
            aexKey.temporalContinuous = getModifiedValue(keyInfo.temporalContinuous, false);
            aexKey.spatialAutoBezier = getModifiedValue(keyInfo.spatialAutoBezier, false);
            aexKey.spatialContinuous = getModifiedValue(keyInfo.spatialContinuous, false);
            aexKey.roving = getModifiedValue(keyInfo.roving, false);
        }

        return aexKey as AEQKeyInfo;
    });

    state.stats.keyCount++;
    return keys;
}

function _setPropertyKeys(aeProperty: Property, aexProperty: AexProperty, state: AexState): void {
    if (aexProperty.keys.length == 0) {
        return;
    }

    const aexKeys = aeq.arrayEx(aexProperty.keys) as AEQArrayEx<AEQKeyInfo>;

    const times = [];
    const values = [];

    aexKeys.forEach((aexKey) => {
        times.push(aexKey.time);

        const aexValue = getAeValue(aeProperty, aexKey.value, state);
        values.push(aexValue);
    });

    aeProperty.setValuesAtTimes(times, values);

    aexKeys.forEach((aexKey, ii) => {
        const keyIndex = ii + 1;

        if (!aeq.isNullOrUndefined(aexKey.temporalEase)) {
            const inEase = _createKeyframeEases(aexKey.temporalEase.inEase);
            const outEase = _createKeyframeEases(aexKey.temporalEase.outEase);

            /** @todo something's broken in types-for-adobe here... */
            /** @ts-ignore */
            aeProperty.setTemporalEaseAtKey(keyIndex, inEase, outEase);
        }

        if (!aeq.isNullOrUndefined(aexKey.temporalAutoBezier) && !aeq.isNullOrUndefined(aexKey.temporalContinuous)) {
            aeProperty.setTemporalAutoBezierAtKey(keyIndex, aexKey.temporalAutoBezier);
            aeProperty.setTemporalContinuousAtKey(keyIndex, aexKey.temporalContinuous);
        }

        if (!aeq.isNullOrUndefined(aexKey.spatialAutoBezier) && !aeq.isNullOrUndefined(aexKey.spatialContinuous)) {
            aeProperty.setSpatialAutoBezierAtKey(keyIndex, aexKey.spatialAutoBezier);
            aeProperty.setSpatialContinuousAtKey(keyIndex, aexKey.spatialContinuous);

            aeProperty.setSpatialTangentsAtKey(keyIndex, aexKey.spatialTangent.inTangent, aexKey.spatialTangent.outTangent);
            aeProperty.setRovingAtKey(keyIndex, aexKey.roving);
        }

        let inType = KeyframeInterpolationType.LINEAR;
        let outType = KeyframeInterpolationType.LINEAR;

        if (!aeq.isNullOrUndefined(aexKey.interpolationType)) {
            inType = aeq.setDefault(aexKey.interpolationType.inType, inType);
            outType = aeq.setDefault(aexKey.interpolationType.outType, outType);
        }

        aeProperty.setInterpolationTypeAtKey(keyIndex, inType, outType);
    });
}

function _getKeyframeEases(ease: KeyframeEase[]): any {
    const easeData = [];

    aeq.forEach(ease, (easeDimension) => {
        easeData.push({
            influence: roundNumber(easeDimension.influence, 5),
            speed: roundNumber(easeDimension.speed, 5),
        });
    });

    return easeData;
}

function _createKeyframeEases(aexEases: KeyframeEase[]) {
    const eases = [];

    aeq.forEach(aexEases, function (aexEase) {
        eases.push(new KeyframeEase(aexEase.speed, aexEase.influence));
    });

    return eases;
}
