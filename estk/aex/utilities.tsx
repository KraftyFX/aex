function getModifiedValue<T>(value: T, original: T): T | undefined {
    if (value instanceof Array) {
        const arrayMatch = aeq.arrayEx(value).every(function (item, idx) {
            return item === original[idx];
        });

        if (arrayMatch) {
            return undefined;
        }
    }
    if (value === original) {
        return undefined;
    }

    return value;
}
