type Serializable = Project | CompItem | Layer | Property;
type AexSerialized = AexProject | AexItem | AexLayer;

type AexObjectType = 'aex:project' | AexItemType | AexLayerType;
type AexItemType = AexAvItemType | 'aex:item:folder' | AexFootageType;
type AexAvItemType = 'aex:item:av:comp' | AexFootageType;
type AexFootageType = 'aex:item:av:footage:file' | 'aex:item:av:footage:solid' | 'aex:item:av:footage:placeholder';

type AexLayerType = 'aex:layer:camera' | 'aex:layer:light' | AexAvLayerType | 'aex:layer:null';
type AexAvLayerType = 'aex:layer:av' | 'aex:layer:av:shape' | 'aex:layer:av:text';

type AexPropertyType =
    | 'aex:property:no_value'
    | 'aex:property:custom'
    | 'aex:property:dropdown'
    | 'aex:property:oned'
    | 'aex:property:twod'
    | 'aex:property:threed'
    | 'aex:property:color'
    | 'aex:property:marker'
    | 'aex:property:shape'
    | 'aex:property:textdocument'
    | 'aex:property:custom'
    | 'aex:property:none';

type AexPropertyValueType = number | TwoDPoint | ThreeDPoint | ColorValue | MarkerValue | Shape | AexTextDocument;

type AexUID = string;

type UnsupportedTypeCallback = (log: AexLogEntry) => void;

interface AexOptions {
    unspportedPropertyBehavior: 'skip' | 'log' | 'throw' | 'metadata' | UnsupportedTypeCallback;
}

interface AexLogEntry {
    aexProperty: AexProperty;
    message: string;
}

interface AexState {
    options: AexOptions;
    stats: {
        nonCompItemCount: number;
        compCount: number;
        layerCount: number;
        propertyCount: number;
        keyCount: number;
    };
    log: AexLogEntry[];
}

interface AexObject {
    type: AexObjectType;
}

interface AexProject extends AexObject {
    items: AexItem[];
    comps: AexComp[];
}

type AexItem = AexComp | AexFootageItem | AexFolderItem;
type AexFootageItem = AexFileItem | AexSolidItem | AexPlaceholderItem;

interface AexItemBase {
    comment: string;
    label: number;
    name: string;
    folder: string[];

    aexid: string;
}

interface AexFolderItem extends AexItemBase, AexObject {}

interface AexAVItemBase extends AexItemBase {
    duration: number;
    frameRate: number;
    height: number;
    pixelAspect: number;
    width: number;
}

interface AexFootageItemBase extends AexAVItemBase {
    alphaMode: AlphaMode;
    conformFrameRate: number;
    fieldSeparationType: FieldSeparationType;
    highQualityFieldSeparation: boolean;
    loop: number;
    premulColor: ThreeDColorValue;
    removePulldown: PulldownPhase;
    invertAlpha: boolean;
}

interface AexFileItem extends AexFootageItemBase, AexObject {
    /** Path to file */
    file: string;
}

interface AexSolidItem extends AexFootageItemBase, AexObject {
    color: ThreeDColorValue;
}

interface AexPlaceholderItem extends AexFootageItemBase, AexObject {}

interface AexComp extends AexAVItemBase, AexObject {
    bgColor: ThreeDColorValue;
    displayStartFrame: number;
    displayStartTime: number;
    draft3d: boolean;
    dropFrame: boolean;
    frameBlending: boolean;
    hideShyLayers: boolean;
    motionBlur: boolean;
    motionBlurAdaptiveSampleLimit: number;
    motionBlurSamplesPerFrame: number;
    preserveNestedFrameRate: boolean;
    preserveNestedResolution: boolean;
    renderer: string;
    resolutionFactor: number[];
    shutterAngle: number;
    shutterPhase: number;
    workAreaDuration: number;
    workAreaStart: number;
    layers: AexLayer[];
    markers: AexMarkerProperty[];
}

type AexLayer = AexAVLayer | AexLightLayer | AexCameraLayer;
type AexAVLayer = AexShapeLayer | AexFootageLayer | AexTextLayer | AexNullLayer;

interface AexLayerBase {
    name: string;
    label: number;
    comment: string;
    hasVideo: boolean;
    inPoint: number;
    outPoint: number;
    startTime: number;
    shy: boolean;
    solo: boolean;

    parentLayerIndex: number;
    markers: AexMarkerProperty[];
    transform: AexTransform;
}
interface AexAVLayerBase extends AexLayerBase, AexObject {
    adjustmentLayer: boolean;
    audioEnabled: boolean;
    autoOrient: AutoOrientType;
    blendingMode: BlendingMode;
    collapseTransformation: boolean;
    effectsActive: boolean;
    environmentLayer: boolean;
    frameBlendingType: FrameBlendingType;
    guideLayer: boolean;
    motionBlur: boolean;
    preserveTransparency: boolean;
    quality: LayerQuality;
    samplingQuality: LayerSamplingQuality;
    threeDLayer: boolean;
    timeRemapEnabled: boolean;
    trackMatteType: TrackMatteType;

    masks: AexMask[];
    timeRemap: AexProperty<number>;
    audio: AexPropertyGroup;
    layerStyles: AexPropertyGroup;
    geometryOption: AexPropertyGroup;
    materialOption: AexPropertyGroup;
    effects: AexPropertyGroup[];
}

interface AexLightLayer extends AexLayerBase, AexObject {
    lightType: LightType;
    lightOption: AexPropertyGroup;
}

interface AexCameraLayer extends AexLayerBase, AexObject {
    cameraOption: AexPropertyGroup;
}

interface AexShapeLayer extends AexAVLayerBase, AexObject {
    contents: AexShapePropertyGroup[];
}

interface AexFootageLayer extends AexAVLayerBase, AexObject {
    source: AexFootageSource;
}

interface AexFootageSource extends AexObject {
    type: AexAvItemType;
    id: AexUID;
}

interface AexNullLayer extends AexFootageLayer, AexObject {}

interface AexTextLayer extends AexAVLayerBase, AexObject {
    threeDPerChar: boolean;
    sourceText: AexProperty<AexTextDocument>;
    pathOption: AexPropertyGroup;
    moreOption: AexPropertyGroup;
    animators: AexPropertyGroup;
}

interface AexPropertyBase {
    enabled: boolean;
    matchName: string;
    name: string;
}

interface AexProperty<T extends AexPropertyValueType = any> extends AexPropertyBase {
    expression: string;
    expressionEnabled: boolean;
    value: T;

    type: AexPropertyType;
    keys: AEQKeyInfo[];
}

interface AexDropdownProperty extends AexProperty {
    items: string[];
}

interface AexPropertyGroup extends AexPropertyBase {
    properties: AexPropertyBase[];
}

interface AexShapePropertyGroup extends AexPropertyGroup {
    contents: AexShapePropertyGroup[];
}

interface AexMarkerProperty {
    time: number;
    comment: string;
    chapter: string;
    url: string;
    frameTarget: string;
    cuePointName: string;
    duration: number;
    parameters: object;
    label: number;
    protectedRegion: boolean;
}

interface AexTextDocument {
    allCaps: boolean;
    applyFill: boolean;
    applyStroke: boolean;
    baselineLocs: number[];
    baselineShift: number;
    boxTextPos: TwoDPoint;
    boxTextSize: TwoDPoint;
    fauxBold: boolean;
    fauxItalic: boolean;
    fillColor: ThreeDColorValue;
    font: string;
    fontFamily: string;
    fontSize: number;
    fontStyle: string;
    horizontalScale: number;
    justification: ParagraphJustification;
    leading: number;
    pointText: boolean;
    smallCaps: boolean;
    strokeColor: ThreeDColorValue;
    strokeOverFill: boolean;
    strokeWidth: number;
    subscript: boolean;
    superscript: boolean;
    text: string;
    tracking: number;
    tsume: number;
    verticalScale: number;
}

interface AexMask {
    name: string;
    color: ThreeDColorValue;
    maskMode: MaskMode;
    inverted: boolean;
    rotoBezier: boolean;
    maskMotionBlur: MaskMotionBlur;
    locked: boolean;

    maskPath: AexProperty<Shape>;
    maskFeather: AexProperty<TwoDPoint>;
    maskOpacity: AexProperty<number>;
    maskExpansion: AexProperty<number>;
}

interface AexTransform {
    anchorPoint: AexProperty<TwoDPoint> | AexProperty<ThreeDPoint>;
    position: AexProperty<TwoDPoint> | AexProperty<ThreeDPoint>;
    scale: AexProperty<TwoDPoint> | AexProperty<ThreeDPoint>;
    pointOfInterest: AexProperty<ThreeDPoint>;
    orientation: AexProperty<ThreeDPoint>;
    xRotation: AexProperty<number>;
    yRotation: AexProperty<number>;
    rotation: AexProperty<number>;
    opacity: AexProperty<number>;
}
