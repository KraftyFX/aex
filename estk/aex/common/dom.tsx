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
