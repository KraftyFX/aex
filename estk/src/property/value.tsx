function _getPropertyValue(aeProperty: Property, keyInfo?: AEQKeyInfo): any {
    const value = keyInfo ? keyInfo.value : aeProperty.value;

    if (isTextDocument(aeProperty)) {
        return _getTextDocumentProperties(value);
    } else {
        return getRoundedValue(value);
    }
}

function _setPropertyValue(aeProperty: Property, aexProperty: AexProperty, state: AexState) {
    const aeValue = getAeValue(aeProperty, aexProperty.value, state);

    // Skip 'LAYER_INDEX' properties as we handle these elsewhere
    if (aeProperty.propertyValueType === PropertyValueType.LAYER_INDEX) {
        return;
    }

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
    } else {
        return aexObjValue;
    }
}

function _isTimeRemapProperty(aeProperty: Property<UnknownPropertyType>) {
    return aeProperty.matchName === 'ADBE Time Remapping';
}

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
