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
        let propertyValue = aexObjValue;

        /**
         * Time Remap keyframes need to be 0 -> 1 normalized for deserialization
         */
        if (property.matchName === 'ADBE Time Remapping') {
            const propLayer = property.propertyGroup(property.propertyDepth) as AVLayer;
            const propSource = propLayer.source as AVItem;
            const propDuration = propSource.duration;

            propertyValue = aexObjValue * propDuration;
        }

        aexValue = propertyValue;
    }

    return aexValue;
}
