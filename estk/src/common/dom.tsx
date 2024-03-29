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

function isVisibleLayer(layer: Layer): layer is AVLayer | TextLayer | ShapeLayer {
    return aeq.isAVLayer(layer) || aeq.isTextLayer(layer) || aeq.isShapeLayer(layer);
}

function isEffectPropertyGroup(propertyGroup: PropertyGroup): boolean {
    const propertyDepth = propertyGroup.propertyDepth;
    const rootGroup = propertyGroup.propertyGroup(propertyDepth - 1);

    return rootGroup.matchName === 'ADBE Effect Parade';
}

type ForEachPropertyGroupCallback = (property: PropertyBase, i: number, length: number) => void;

function forEachPropertyInGroup(group: PropertyGroup, callback: ForEachPropertyGroupCallback, state: AexState) {
    state.stats.propertyCount++;

    const il = group.numProperties;
    state.stats.propertyCount += il;

    for (let ii = 1; ii <= il; ii++) {
        const property = group.property(ii) as PropertyBase;

        callback(property, ii - 1, il);
    }

    return il;
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

function groupAeLayersBy(comp: CompItem, callback: (layer: Layer, i: number) => any) {
    const obj: GroupByResult<Layer> = {};

    aeq.forEachLayer(comp, (layer: Layer, i) => {
        const key = callback(layer, i);
        const arr = obj[key] || aeq.arrayEx([]);

        arr.push(layer);

        obj[key] = arr;
    });

    return obj;
}

function forEachGroup<T>(obj: GroupByResult<T>, callback: (member: keyof T, value: T[]) => void) {
    for (var m in obj) {
        if (obj.hasOwnProperty(m)) {
            callback(m as keyof T, obj[m as string]);
        }
    }
}

type PropertyPairCallback<V, P> = (aexValue: V, aeObject: P, i: number) => void;

function forEachValuePairByIndex<V, P extends AnyProperty>(aexValues: V[], aeProperty: P, callback: PropertyPairCallback<V, P['value']>) {
    const aeKeysLength = aeProperty.numKeys;

    aeq.arrayEx(aexValues).forEach((v, i) => {
        callback(v, i < aeKeysLength ? aeProperty.keyValue(i + 1) : null, i);
    });
}

function forEachPairByGroup<V, P>(aexGroupedValues: GroupByResult<V>, aeGroupedValues: GroupByResult<P>, callback: PropertyPairCallback<V, P>) {
    let index = 0;

    forEachGroup(aexGroupedValues, (member, aexValues) => {
        const aeValues = aeGroupedValues[member as string] || [];
        const aeValuesLength = aeValues.length;

        aeq.arrayEx(aexValues).forEach((aexValue, i) => {
            const aeValue = i < aeValuesLength ? aeValues[i] : null;

            callback(aexValue, aeValue, index++);
        });
    });
}

function getDebugStringForAeType(obj: Project | Item | Layer | Layer[] | PropertyBase) {
    if (aeq.isNullOrUndefined(obj)) {
        return 'null or undefined';
    }

    if (obj instanceof Project) {
        return 'project';
    } else if (aeq.isArray(obj)) {
        return 'array';
    } else if (aeq.isProperty(obj)) {
        return 'property';
    } else if (aeq.isTextLayer(obj)) {
        return 'textlayer';
    } else if (aeq.isLightLayer(obj)) {
        return 'lightlayer';
    } else if (aeq.isShapeLayer(obj)) {
        return 'shapelayer';
    } else if (aeq.isCameraLayer(obj)) {
        return 'cameralayer';
    } else if (aeq.isAVLayer(obj)) {
        return 'avlayer';
    } else if (aeq.isPrecomp(obj)) {
        return 'precomplayer';
    } else if (aeq.isFootageItem(obj)) {
        return 'footageitem';
    } else if (aeq.isFolderItem(obj)) {
        return 'folderitem';
    } else if (aeq.isComp(obj)) {
        return 'comp';
    } else {
        return 'unknown';
    }
}
