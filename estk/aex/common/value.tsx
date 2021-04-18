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
    /**
     * @todo Add AexOption for whether to return default values, vs return undefined
     */
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

    return _isEqual(value, aeDefaultValue) ? undefined : getRoundedValue(value);
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

function _isNumberArray(array: any[]): boolean {
    return aeq.arrayEx(array).every((element) => {
        return typeof element === 'number';
    });
}

/** @todo Add types here */
function getRoundedValue(value: any): any {
    if (typeof value === 'number') {
        return roundNumber(value);
    } else if (value instanceof Array && _isNumberArray(value)) {
        return roundArray(value);
    } else {
        return value;
    }
}

function roundNumber(value: number, precision = 4): number {
    return parseFloat(value.toFixed(precision));
}

function roundArray(values: number[], precision = 4): number[] {
    return aeq.arrayEx(values).map((value) => {
        return roundNumber(value, precision);
    });
}
