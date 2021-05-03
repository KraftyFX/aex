/** @todo Add type safety */
function _getPropertyValue(aeProperty: Property, value: any): any {
    if (isTextDocument(aeProperty)) {
        return _getTextDocumentProperties(value);
    } else if (_isTimeRemapProperty(aeProperty)) {
        /**
         * Time Remap keyframes need to be 0 -> 1 normalized for deserialization
         */
        const propLayer = aeProperty.propertyGroup(aeProperty.propertyDepth) as AVLayer;
        const propSource = propLayer.source as AVItem;
        const propDuration = propSource.duration;

        return getRoundedValue(value / propDuration);
    } else {
        return getRoundedValue(value);
    }
}

function _setPropertyValue(aeProperty: Property, aexProperty: AexProperty, state: AexState) {
    /** We can't setValue on an animated property, so back out */
    if (aeProperty.numKeys > 0) {
        // TODO: Discuss with Zack why we return here instead of logging or updating the property to
        // be a static vs animated. Also, shouldn't this be treated as an unsupported property or
        // something similar?
        return;
    }

    const aeValue = getAeValue(aeProperty, aexProperty.value, state);

    try {
        aeProperty.setValue(aeValue);
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

function getAeValue(aeProperty: Property, aexObjValue: any, state: AexState): any {
    if (isTextDocument(aeProperty)) {
        return _createTextDocument(aeProperty.value, aexObjValue, state);
    } else if (isShapeProperty(aeProperty)) {
        return _createShape(aexObjValue);
    } else if (_isTimeRemapProperty(aeProperty)) {
        /**
         * Time Remap keyframes need to be 0 -> 1 normalized for deserialization
         */
        const propLayer = aeProperty.propertyGroup(aeProperty.propertyDepth) as AVLayer;
        const propSource = propLayer.source as AVItem;
        const propDuration = propSource.duration;

        return aexObjValue * propDuration;
    } else {
        return aexObjValue;
    }
}

function _isTimeRemapProperty(aeProperty: Property<UnknownPropertyType>) {
    return aeProperty.matchName === 'ADBE Time Remapping';
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
