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

function _setPropertyValue(property: Property, value: any, state: AexState) {
    /** We can't setValue on an animated property, so back out */
    if (property.numKeys > 0) {
        return;
    }

    try {
        property.setValue(value);
    } catch (e) {
        throw e;
    }
}

function _createShape(aexObjValue: Shape): Shape {
    const shape = new Shape();

    assignAttributes(shape, {
        closed: aexObjValue.closed,
        vertices: aexObjValue.vertices,
        inTangents: aexObjValue.inTangents,
        outTangents: aexObjValue.outTangents,
        featherSegLocs: aexObjValue.featherSegLocs,
        featherRelSegLocs: aexObjValue.featherRelSegLocs,
        featherRadii: aexObjValue.featherRadii,
        featherInterps: aexObjValue.featherInterps,
        featherTensions: aexObjValue.featherTensions,
        featherTypes: aexObjValue.featherTypes,
        featherRelCornerAngles: aexObjValue.featherRelCornerAngles,
    });

    return shape;
}

function _createAexValue(property: Property, aexObjValue: any, state: AexState): any {
    let aexValue: any;

    if (isTextDocument(property)) {
        aexValue = _createTextDocument(property.value, aexObjValue, state);
    } else if (isShapeProperty(property)) {
        aexValue = _createShape(aexObjValue);
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

/** @todo Add type safety */
function assignAttributes(aeItem: any, aexItem: any): void {
    for (let key in aexItem) {
        // Skip the internal JS properties
        if (!aexItem.hasOwnProperty(key)) {
            continue;
        }

        // Skip anything not supported by the current version of AE
        if (!aeItem.hasOwnProperty(key)) {
            continue;
        }

        // Skip anything in the aexItem that has no value
        if (aeq.isNullOrUndefined(aexItem[key])) {
            continue;
        }

        aeItem[key] = aexItem[key];
    }
}
