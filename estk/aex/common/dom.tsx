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

function isVisibleLayer(layer: Layer): layer is AVLayer | TextLayer | ShapeLayer {
    return aeq.isAVLayer(layer) || aeq.isTextLayer(layer) || aeq.isShapeLayer(layer);
}

function isNullLayer(layer: Layer): layer is AVLayer {
    return layer.nullLayer;
}

/**
 * This check is conceptually redundant, however:
 *
 * In AEX we're differentiating between the AVLayer base class (both in AEX and AE)
 * and each of the subclasses (TextLayer, ShapeLayer).
 *
 * This is because in AE, non-TextLayer, non-ShapeLayer AVLayers have unique properties,
 * and so it's cleaner & friendlier to treat AVLayers as three distinct possibilities:
 *   - TextLayer
 *   - ShapeLayer
 *   - FootageLayer
 */
function isFootageLayer(layer: Layer): layer is AVLayer {
    return aeq.isAVLayer(layer);
}

type ForEachPropertyGroupCallback = (property: PropertyBase, i: number, length: number) => void;

function forEachPropertyInGroup(group: PropertyGroup, callback: ForEachPropertyGroupCallback) {
    for (let ii = 1, il = group.numProperties; ii <= il; ii++) {
        const property = group.property(ii) as PropertyBase;

        callback(property, ii - 1, il);
    }
}

type ForEachPropertyKeyValueCallback<T> = (value: T, i: number, length: number) => void;

function forEachPropertyKeyValue<T>(property: Property, callback: ForEachPropertyKeyValueCallback<T>) {
    for (let ii = 1, il = property.numKeys; ii <= il; ii++) {
        const keyValue: T = property.keyValue(ii);

        callback(keyValue as T, ii - 1, il);
    }
}

type GroupByResult<T> = {
    [key: string]: T[];
};

function groupArrayBy<T>(arr: T[], callback: (value: T) => unknown) {
    return aeq.arrayEx(arr).groupBy(callback) as GroupByResult<T>;
}

function groupAeKeysBy<T extends AnyProperty>(property: T, callback: (value: T['value'], i: number) => any) {
    const obj: GroupByResult<T['value']> = {};

    forEachPropertyKeyValue(property, (value: T['value'], i) => {
        const key = callback(value, i);
        const arr = obj[key] || aeq.arrayEx([]);

        arr.push(value);

        obj[key] = arr;
    });

    return obj;
}

function forEachGroup<T>(obj: GroupByResult<T>, callback: (member: keyof T, value: T[]) => void) {
    for (var m in obj) {
        if (obj.hasOwnProperty(m)) {
            callback(m as keyof T, obj[m]);
        }
    }
}

type PropertyPairCallback<V, P extends AnyProperty> = (aexValue: V, aeObject: P['value'], i: number) => void;

function forEachPairByIndex<V, P extends AnyProperty>(aexValues: V[], aeProperty: P, callback: PropertyPairCallback<V, P>) {
    const aeKeysLength = aeProperty.numKeys;

    aeq.arrayEx(aexValues).forEach((v, i) => {
        callback(v, i < aeKeysLength ? aeProperty.keyValue(i + 1) : null, i);
    });
}

function forEachPairByGrouping<V, P extends AnyProperty>(
    aexGroupedValues: GroupByResult<V>,
    aeGroupedValues: GroupByResult<P['value']>,
    callback: PropertyPairCallback<V, P>
) {
    let index = 0;

    forEachGroup(aexGroupedValues, (member, aexValues) => {
        const aeKeyValues = aeGroupedValues[member as string] || [];
        const aeKeyValuesLength = aeKeyValues.length;

        aeq.arrayEx(aexValues).forEach((v, i) => {
            callback(v, i < aeKeyValuesLength ? aeKeyValues[i] : null, index++);
        });
    });
}
