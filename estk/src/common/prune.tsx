/**
 * Recursively iterates over all members of @obj and removes all members that are
 * `null`, `undefined`, an empty array, or an empty pain object.  Before arrays and
 * plain objects are checked for emptiness they get recursively pruned.
 *
 * @param obj Object to scan
 * @returns true if all members of the object were pruned.  False otherwise.
 */
function prune<T>(obj: T): T {
    pruneFromParent(obj);

    return obj;
}

function _pruneObjectMembers(obj: any): boolean {
    let memberCount = 0;
    let deletedCount = 0;

    _forEachMember(obj, (m: string, value: any) => {
        memberCount++;

        if (pruneFromParent(value)) {
            deletedCount++;
            delete obj[m];
        }
    });

    return memberCount === deletedCount;
}

function _pruneArrayElements(arr: any[]): boolean {
    _forEachArrayElt(arr, (value: any, idx: number) => {
        if (pruneFromParent(value)) {
            arr.splice(idx, 1);
        }
    });

    return arr.length === 0;
}

function pruneFromParent(value: any) {
    return isNullOrUndefined(value) || isEmptyArrayAfterPruning(value) || isEmptyObjectAfterPruning(value);
}

function isNullOrUndefined(value: any) {
    return typeof value === 'undefined' || value === null;
}

function isEmptyArrayAfterPruning(value: any) {
    return aeq.isArray(value) && _pruneArrayElements(value);
}

function isEmptyObjectAfterPruning(value: any) {
    const isObject = value === Object(value);

    return isObject && _pruneObjectMembers(value);
}

function _forEachMember(obj: any, fn: (m: string, v: any) => void) {
    for (var m in obj) {
        if (!obj.hasOwnProperty(m)) {
            continue;
        }

        fn(m, obj[m]);
    }
}

function _forEachArrayElt(obj: any[], fn: (v: any, idx: number) => void) {
    for (let i = obj.length - 1; i >= 0; i--) {
        fn(obj[i], i);
    }
}
