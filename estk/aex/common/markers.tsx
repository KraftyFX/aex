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

function updateAeMarkers(aeMarkerProperty: MarkerValueProperty, aexMarkers: AexMarkerProperty[], state: AexState) {
    const onMarkerPair = (aexMarker: AexMarkerProperty, aeMarkerValue: MarkerValue, i) => {
        if (!aeMarkerValue) {
            aeMarkerValue = createAeMarker(aeMarkerProperty, aexMarker, state);
        } else {
            updateAeMarker(aeMarkerProperty, aeMarkerValue, aexMarker, state);
        }
    };

    const matchBy = state.toAeOptions.markerMatchBy;

    switch (matchBy) {
        case 'index':
            forEachValuePairByIndex(aexMarkers, aeMarkerProperty, onMarkerPair);
            break;
        case 'time':
            const aexMarkersByTime = groupArrayBy(aexMarkers, (v) => v.time);
            const aeMarkerValuesByTime = groupAeKeysBy(aeMarkerProperty, (v, i) => aeMarkerProperty.keyTime(i + 1));

            forEachPairByGroup<AexMarkerProperty, MarkerValue>(aexMarkersByTime, aeMarkerValuesByTime, onMarkerPair);
            break;
        default:
            throw new Error(`Unrecognized marker matching method "${matchBy}"`);
    }
}

function createAeMarker(aeMarkerProperty: MarkerValueProperty, aexMarker: AexMarkerProperty, state: AexState): MarkerValue {
    const aeMarkerValue = new MarkerValue(aexMarker.comment || '');
    updateAeMarker(aeMarkerProperty, aeMarkerValue, aexMarker, state);
    return aeMarkerValue;
}

function updateAeMarker(aeMarkerProperty: MarkerValueProperty, aeMarkerValue: MarkerValue, aexMarker: AexMarkerProperty, state: AexState) {
    assignAttributes(aeMarkerValue, {
        chapter: aexMarker.chapter,
        url: aexMarker.url,
        frameTarget: aexMarker.frameTarget,
        cuePointName: aexMarker.cuePointName,
        duration: aexMarker.duration,
        label: aexMarker.label,
        protectedRegion: aexMarker.protectedRegion,
        parameters: aexMarker.parameters,
    });

    /**
     * Voodoo: Unlike most animated properties, we can't use Property.setValueAtTime() with markers.
     * As a result, we need to set each keyframe individually.
     */
    aeMarkerProperty.setValueAtTime(aexMarker.time, aeMarkerValue);
}

function _getMarkerParameters(keyValue: MarkerValue): object {
    const parameters = keyValue.getParameters();

    return parameters.toSource() === '({})' ? undefined : parameters;
}
