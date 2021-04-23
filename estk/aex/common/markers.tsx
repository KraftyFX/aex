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

    const markers = aeq.arrayEx<{ time: number; marker: MarkerValue }>();

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
            marker,
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

function setCompMarkers2(aeMarkerProperty: MarkerValueProperty, aexMarkers: AexMarkerProperty[], state: AexState) {
    const onMarkerPair = (aexMarker, aeMarkerValue, i) => {
        if (!aeMarkerValue) {
            aeMarkerValue = new MarkerValue(aexMarker.comment || '');
        }

        // TODO: How do you update the comment and time?

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

        aeMarkerProperty.setValueAtTime(aexMarker.time, aeMarkerValue);
    };

    const matchBy = state.toAeOptions.markerMatchBy;

    switch (matchBy) {
        case 'index':
            forEachPairByIndex(aexMarkers, aeMarkerProperty, onMarkerPair);
            break;
        case 'time':
            const aexMarkersByTime = groupArrayBy(aexMarkers, (v) => v.time);
            const aeMarkerValuesByTime = groupAeKeysBy(aeMarkerProperty, (v, i) => aeMarkerProperty.keyTime(i + 1));

            forEachPairByGrouping(aexMarkersByTime, aeMarkerValuesByTime, onMarkerPair);
            break;
        default:
            throw new Error(`Unrecognized marker matching method ${matchBy}`);
    }
}
