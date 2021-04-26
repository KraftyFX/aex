function aex() {
    return {
        benchmark,
        prescan,
        fromAe: aeToAex,
        toAe: aexToAe,
        update,
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
    log: AexLogEntry[];
}

function benchmark(options: any) {
    options.callback(true);

    // aex().fromAe(app.project as Project, {} as any);
}

function aeToAex(aeObj: Project, options: AexOptions): void;
function aeToAex(aeObj: CompItem, options: AexOptions): ToAexResult<AexComp>;
function aeToAex(aeObj: Layer, options: AexOptions): ToAexResult<AexLayer>;
function aeToAex(aeObj: Serializable, options: AexOptions): ToAexResult<AexSerialized> {
    assertIsDefined(aeObj, 'aeObj');

    const state: AexState = {
        options,
        toAeOptions: null,
        log: [],
        stats: { nonCompItemCount: 0, compCount: 0, layerCount: 0, propertyCount: 0, keyCount: 0 },
    };

    // TODO: Make a helper function to deal with this
    state.options = state.options || { unspportedPropertyBehavior: 'skip' };
    state.options.unspportedPropertyBehavior = state.options.unspportedPropertyBehavior || 'skip';

    let object: AexSerialized;

    // TODO: Cover collection types.
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
        log: state.log,
    };
}

function aexToAe(aexObj: AexProject, options: ToAeOptions): void;
function aexToAe(aexObj: AexComp, options: ToAeOptions): void;
function aexToAe(aexObj: AexAVLayer, options: ToAeOptions): void;
function aexToAe(aexObj: AexShapeLayer, options: ToAeOptions): void;
function aexToAe(aexObj: AexLightLayer, options: ToAeOptions): void;
function aexToAe(aexObj: AexCameraLayer, options: ToAeOptions): void;
function aexToAe(aexObj: AexFootageLayer, options: ToAeOptions): void;
function aexToAe(aexObj: AexNullLayer, options: ToAeOptions): void;
function aexToAe(aexObj: AexTextLayer, options: ToAeOptions): void;
function aexToAe(aexObj: AexObject, options: ToAeOptions): void {
    assertIsDefined(aexObj, 'aexObj');

    app.beginUndoGroup('AEX to AE');

    const state: AexState = {
        options: null,
        toAeOptions: options,
        log: [],
        stats: { nonCompItemCount: 0, compCount: 0, layerCount: 0, propertyCount: 0, keyCount: 0 },
    };

    switch (aexObj.type) {
        case AEX_PROJECT:
            setAexProject(aexObj as AexProject, state);
            break;
        case AEX_COMP_ITEM:
            createComp(aexObj as AexComp, state);
            break;
        case AEX_FOOTAGE_LAYER:
        case AEX_SHAPE_LAYER:
        case AEX_LIGHT_LAYER:
        case AEX_CAMERA_LAYER:
        case AEX_NULL_LAYER:
        case AEX_TEXT_LAYER:
            createLayer(undefined, aexObj as AexLayer, state);
            break;
        default:
            app.endUndoGroup();
            throw new Error(`AEX Object Type "${aexObj.type}" is not spported.`);
    }

    app.endUndoGroup();
}

function create(aeParentObject: Project | CompItem | Layer, aexObject: AexItem | AexComp | AexLayer | AexProperty) {
    const state: AexState = {
        options: null,
        toAeOptions: {
            markerMatchBy: 'index',
        },
        log: [],
        stats: { nonCompItemCount: 0, compCount: 0, layerCount: 0, propertyCount: 0, keyCount: 0 },
    };

    if (aeParentObject instanceof Project && aexObject.type === AEX_COMP_ITEM) {
        const comp = _createComp2(aexObject as AexComp, state);
        _update(comp, aexObject as AexComp, state);
    } else {
        throw new Error(`Don't know how to create an object of this type.`);
    }
}

function update(aeObject: CompItem | Layer, aexObject: AexComp | AexLayer) {
    const state: AexState = {
        options: null,
        toAeOptions: {
            markerMatchBy: 'index',
        },
        log: [],
        stats: { nonCompItemCount: 0, compCount: 0, layerCount: 0, propertyCount: 0, keyCount: 0 },
    };

    _update(aeObject, aexObject, state);
}

function _update(aeObject: Project | CompItem | Layer, aexObject: AexProject | AexComp | AexLayer, state: AexState) {
    if (aeObject instanceof Project && aexObject.type === AEX_PROJECT) {
        setAexProject2(aeObject as Project, aexObject as AexProject, state);
    } else if (aeObject instanceof CompItem && aexObject.type === AEX_COMP_ITEM) {
        _setComp2(aeObject as CompItem, aexObject as AexComp, state);
    } else {
        throw new Error(`Don't know how to create an object of type '${aexObject.type}'.`);
    }
}
