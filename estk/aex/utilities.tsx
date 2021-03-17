function _isObjectEqual(a: object, b: object): boolean {
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
    if (a.length !== b.length) {
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

type GetValueCallback<T> = (value: T) => T;
/**
 * Gets the value of a property if it's different than the internal AE
 * default. This is useful b/c it helps keep the serialized objects
 * small.
 *
 * @param value Property value from AfterEffects
 * @param aeDefault The expected default value provided by AE for the property
 * @returns The property value if and only if the property exists and is
 * set to something other than the default.
 */
function getModifiedValue<T>(value: T, aeDefault: T | GetValueCallback<T>): T | undefined {
    if (aeq.isNullOrUndefined(value)) {
        return undefined;
    }

    const aeDefaultValue = typeof aeDefault === 'function' ? (aeDefault as GetValueCallback<T>)(value) : value;

    return _isEqual(value, aeDefaultValue) ? undefined : value;
}

function sourceIsSolid(source: any): source is SolidSource {
    // @ts-ignore
    return source instanceof SolidSource;
}

function sourceIsFile(source: any): source is FileSource {
    // @ts-ignore
    return source instanceof FileSource;
}

function sourceIsPlaceholder(source: any): source is PlaceholderSource {
    // @ts-ignore
    return source instanceof PlaceholderSource;
}

function isProject(item: any): item is Project {
    // @ts-ignore
    return item instanceof Project;
}

function isVisibleLayer(layer: any): layer is AVLayer | TextLayer | ShapeLayer {
    return aeq.isAVLayer(layer) || aeq.isTextLayer(layer) || aeq.isShapeLayer(layer);
}
