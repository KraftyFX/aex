function aex() {
    return {
        prescan,
        fromAe: aeToAex,
        toAe: aexToAe,
    };
}

interface AexPrescanOptions {}

interface AexPrescanResult {
    aeObject: Serializable;
    estimatedTotal: number;
}

function prescan(aeObject: Serializable, options: AexOptions): AexPrescanResult {
    return {
        aeObject,
        estimatedTotal: 0,
    };
}

interface ToAexResult<T extends AexSerialized> {
    object: T;
    log: string[];
}

function aeToAex(aeObj: Project, options: AexOptions): ToAexResult<AexProject>;
function aeToAex(aeObj: CompItem, options: AexOptions): ToAexResult<AexComp>;
function aeToAex(aeObj: Layer, options: AexOptions): ToAexResult<AexLayer>;
function aeToAex(aeObj: Serializable, options: AexOptions): ToAexResult<AexSerialized> {
    assertIsDefined(aeObj, 'aeObj');

    const state: AexState = { options, log: [], stats: { nonCompItemCount: 0, compCount: 0, layerCount: 0, propertyCount: 0, keyCount: 0 } };
    state.options = state.options || { unspportedPropertyBehavior: 'skip' };

    let object: AexSerialized;

    // TODO: Cover array/collection types.
    if (isProject(aeObj)) {
        object = getAexProject(aeObj as Project, state);
    } else if (aeq.isComp(aeObj)) {
        object = getAexComp(aeObj as CompItem, state);
    } else if (aeq.isLayer(aeObj)) {
        object = getAexLayer(aeObj as Layer, state);
    } else {
        throw new Error(`Unrecognized item type`);
    }

    return {
        object,
        log: [],
    };
}

function aexToAe(aexObj: AexSerialized, options: {}): void {
    throw new Error(`Not yet implemented`);
}
