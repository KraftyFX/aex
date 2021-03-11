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

function sourceIsSolid(source: any): source is SolidSource {
    return source instanceof SolidSource;
}

function sourceIsFile(source: any): source is FileSource {
    return source instanceof FileSource;
}

function sourceIsPlaceholder(source: any): source is PlaceholderSource {
    return source instanceof PlaceholderSource;
}

function isProject(item: any): item is Project {
    return item instanceof Project;
}
