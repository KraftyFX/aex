type Serializable = CompItem | Layer | Property;

function aex() {
    return {
        toObject(item: Serializable | undefined) {
            if (isNullOrUndefined(item)) {
                throw new Error(`item is null or undefined`);
            }

            if (isComp(item)) {
                return 'comp';
            } else {
                return 'unknown';
            }
        },
    };
}
