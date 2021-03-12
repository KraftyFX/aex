function _objectsIdential(a: object, b: object): boolean {
    for (var key in a) {
        if (!a.hasOwnProperty(key)) {
            continue;
        }

        if (!b.hasOwnProperty(key)) {
            return false;
        }

        const srcValue = a[key];
        const destValue = b[key];

        if (!_simpleCompareElements(srcValue, destValue)) {
            return false;
        }
    }

    return true;
}

function _arraysIdentical(a: any[], b: any[]): boolean {
    if (a.length !== b.length) {
        return false;
    }

    for (let ii = 0, il = a.length; ii < il; ii++) {
        let elementA = a[ii];
        let elementB = b[ii];

        if (!_simpleCompareElements(elementA, elementB)) {
            return false;
        }
    }

    return true;
}

/** true if identical */
function _simpleCompareElements(a: any, b: any): boolean {
    if (a instanceof Array && _arraysIdentical(a, b)) {
        return true;
    } else if (typeof a === 'object' && _objectsIdential(a, b)) {
        return true;
    }

    if (a === b) {
        return true;
    }

    return false;
}

function getModifiedValue<T>(value: T, original: T): T | undefined {
    let valueIsDefault = _simpleCompareElements(value, original);

    if (!valueIsDefault) {
        return value;
    }

    return undefined;
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
