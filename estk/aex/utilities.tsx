function getModifiedValue<T>(value: T, original: T): T | undefined {
    if (value === original) {
        return undefined;
    }

    return value;
}
