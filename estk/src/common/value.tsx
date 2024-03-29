/**
 * Gets the value of a property if and only if another boolean property is set
 * that dictates if and how it should be read.
 *
 * @param shouldRead Property from AfterEffects that decides if the value should be read.
 * @param callback Function that gets the value that should be serialized
 * @param aeDefaultValue The expected default value provided by AE for the property
 * @returns The property value if and only if the property exists and is
 * set to something other than the default.
 */
function getBoundModifiedValue<T>(shouldRead: boolean, callback: () => T, aeDefaultValue: T): T | undefined {
    return shouldRead ? getModifiedValue<T>(callback(), aeDefaultValue) : undefined;
}

/**
 * Gets the value of a property if it's different than the internal AE
 * default. This is useful b/c it helps keep the serialized objects
 * small.
 *
 * @param value Property value from AfterEffects
 * @param aeDefaultValue The expected default value provided by AE for the property
 * @returns The property value if and only if the property exists and is
 * set to something other than the default.
 */
function getModifiedValue<T>(value: T, aeDefaultValue: T): T | undefined {
    if (aeq.isNullOrUndefined(value)) {
        return undefined;
    }

    return _isEqual(value, aeDefaultValue) ? undefined : getRoundedValue(value as any);
}

function _isObjectEqual(a: object, b: object): boolean {
    if (typeof b !== 'object') {
        return false;
    }

    for (let key in a) {
        if (!a.hasOwnProperty(key)) {
            continue;
        }

        if (!b.hasOwnProperty(key)) {
            return false;
        }

        const srcValue = a[key];
        const destValue = b[key];

        if (!_isEqual(srcValue, destValue)) {
            return false;
        }
    }

    return true;
}

function _isArrayEqual(a: any[], b: any[]): boolean {
    if (!(b instanceof Array) || a.length !== b.length) {
        return false;
    }

    for (let ii = 0, il = a.length; ii < il; ii++) {
        let elementA = a[ii];
        let elementB = b[ii];

        if (!_isEqual(elementA, elementB)) {
            return false;
        }
    }

    return true;
}

/** true if identical */
function _isEqual(a: any, b: any): boolean {
    if (a instanceof Array) {
        return _isArrayEqual(a, b);
    } else if (typeof a === 'object') {
        return _isObjectEqual(a, b);
    } else {
        return a === b;
    }
}

function getRoundedValue(value: number, precision?): number;
function getRoundedValue(value: number[], precision?): number[];
function getRoundedValue(value: any, precision?): any;
function getRoundedValue(value: number | number[] | any, precision = 4): number | number[] | any {
    if (typeof value === 'number') {
        return roundNumber(value as number, precision);
    } else if (value instanceof Array) {
        return roundArray(value, precision);
    } else if (value instanceof Shape) {
        return roundObject(value, precision);
    } else {
        return value;
    }
}

function roundObject(value: object, precision): any {
    const roundedObject = {};

    for (let key in value) {
        if (!value.hasOwnProperty(key)) {
            continue;
        }

        const keyValue = value[key];
        roundedObject[key] = getRoundedValue(keyValue, precision);
    }

    return roundedObject;
}

function roundNumber(value: number, precision = 4): number {
    return parseFloat(value.toFixed(precision));
}

function roundArray(values: number[], precision = 4): number[] {
    return aeq.arrayEx(values).map((value) => {
        return getRoundedValue(value, precision);
    });
}
