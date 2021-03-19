type Serializable = Project | CompItem | Layer | Property<any>;
type AexSerialized = AexProject | AexItem | AexLayer;

type AexObjectType = 'aex:project' | AexItemType | 'aex:layer';
type AexItemType = AexAvItemType | 'aex:item:folder' | AexFootageType;
type AexAvItemType = 'aex:item:av:comp' | AexFootageType;
type AexFootageType = 'aex:item:av:footage:file' | 'aex:item:av:footage:solid' | 'aex:item:av:footage:placeholder';
type AexLayerType = 'Layer' | 'CameraLayer' | 'LightLayer' | 'AVLayer' | 'ShapeLayer' | 'TextLayer';
type AexValueType = number | [number, number] | [number, number, number] | [number, number, number, number] | MarkerValue | Shape | TextDocument;

type AexUID = string;

interface AexOptions {}

interface AexObject {
    type: AexObjectType;
}

interface AexProject extends AexObject {
    items: AexItem[];
    comps: AexComp[];
}

type AexItem = AexComp | AexFootageItem | AexFolderItem;

interface AexItemBase {
    comment: string;
    label: number;
    name: string;
    folder: string;

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

interface AexFootageItem extends AexAVItemBase, AexObject {
    alphaMode: AlphaMode;
    conformFrameRate: number;
    fieldSeparationType: FieldSeparationType;
    highQualityFieldSeparation: boolean;
    loop: number;
    premulColor: number[];
    removePulldown: PulldownPhase;
    invertAlpha: boolean;
}

interface AexFileSourceAttributes {
    /** Path to file */
    file: string;
}

interface AexSolidSourceAttributes {
    color: number[];
}

interface AexComp extends AexAVItemBase, AexObject {
    bgColor: number[];
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
    // essentialProps: any[];
}

interface AexLayerAttributes {
    name: string;
    label: number;
    comment: string;
    hasVideo: boolean;
    inPoint: number;
    outPoint: number;
    startTime: number;
    stretch: number;
    nullLayer: boolean;
    shy: boolean;
    solo: boolean;

    /** AEX-specific properties */
    parentLayerIndex: number;
    layerType: AexLayerType;
}

interface AexAVLayerAttributes extends AexLayerAttributes {
    source: AexUID;

    adjustmentLayer: boolean;
    audioEnabled: boolean;
    autoOrient: AutoOrientType;
    blendingMode: BlendingMode;
    collapseTransformation: boolean;
    effectsActive: boolean;
    environmentLayer: boolean;
    frameBlending: boolean;
    frameBlendingType: FrameBlendingType;
    guideLayer: boolean;
    motionBlur: boolean;
    preserveTransparency: boolean;
    quality: LayerQuality;
    samplingQuality: LayerSamplingQuality;
    threeDLayer: boolean;
    timeRemapEnabled: boolean;
    trackMatteType: TrackMatteType;
}

interface AexLightLayerAttributes extends AexLayerAttributes {
    lightType: LightType;
}

interface AexTextLayerAttributes extends AexLayerAttributes {
    threeDPerChar: boolean;
}

interface AexLayer extends AexObject, Partial<AexAVLayerAttributes>, Partial<AexLightLayerAttributes>, Partial<AexTextLayerAttributes> {
    audio: AexProperties;
    geometryOption: AexProperties;
    layerStyles: AexProperties;
    materialOption: AexProperties;
    timeRemap: AexProperty<number>;
    markers: AexMarkerProperty[];
    transform: AexTransform;
    masks: AexProperties[];
    effects: AexProperties[];

    properties: AexProperties | AexTextLayerProperties;
}

interface AexProperties {
    [name: string]: AexProperty<any> | AexPropertyGroup | AexPropertyGroup[];
}

interface AexPropertyBase {
    enabled: boolean;
    matchName: string;
    name: string;
}

interface AexProperty<T> extends AexPropertyBase {
    expression: string;
    expressionEnabled: boolean;
    value: T;

    /** AEX-specific properties */
    keys: AEQKeyInfo[];
}

interface AexPropertyGroup extends AexPropertyBase {
    properties: (AexProperty<any> | AexPropertyGroup)[];
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

interface AexTextLayerProperties {
    sourceText: AexProperty<TextDocument>;
    pathOption: AexPropertyGroup;
    moreOption: AexPropertyGroup;
    animators: AexPropertyGroup;
}

interface AexTextDocumentProperty {
    allCaps: boolean;
    applyFill: boolean;
    applyStroke: boolean;
    baselineLocs: number[];
    baselineShift: number;
    boxTextPos: [number, number];
    boxTextSize: [number, number];
    fauxBold: boolean;
    fauxItalic: boolean;
    fillColor: [number, number, number];
    font: string;
    fontFamily: string;
    fontSize: number;
    fontStyle: string;
    horizontalScale: number;
    justification: ParagraphJustification;
    leading: number;
    pointText: boolean;
    smallCaps: boolean;
    strokeColor: [number, number, number];
    strokeOverFill: boolean;
    strokeWidth: number;
    subscript: boolean;
    superscript: boolean;
    text: string;
    tracking: number;
    tsume: number;
    verticalScale: number;
}

interface AexTransform {
    anchorPoint: AexProperty<[number, number] | [number, number, number]>;
    position: AexProperty<[number, number] | [number, number, number]>;
    scale: AexProperty<[number, number] | [number, number, number]>;
    pointOfInterest: AexProperty<[number, number, number]>;
    orientation: AexProperty<[number, number, number]>;
    xRotation: AexProperty<number>;
    yRotation: AexProperty<number>;
    rotation: AexProperty<number>;
    opacity: AexProperty<number>;
}
