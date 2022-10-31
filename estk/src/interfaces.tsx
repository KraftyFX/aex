type Serializable = Project | CompItem | Layer | PropertyGroup | Property;
type Deserializable = AexSerialized | AexProperty | AexKey | AexMarkerProperty | GetResult<AexSerialized>;

type AexSerialized = AexProject | AexItem | AexLayer | AexSerializedGroup;
type AexSerializedGroup = AexEffectPropertyGroup | AexShapePropertyGroup | AexAnimatorPropertyGroup;

type AexObjectType = 'aex:project' | AexItemType | AexLayerType | AexPropertyType | AexPropertyGroupType | AexKeyType | AexMarkerType;
type AexItemType = AexAvItemType | 'aex:item:folder' | AexFootageItemType;
type AexAvItemType = 'aex:item:av:comp' | AexFootageItemType;
type AexFootageItemType = 'aex:item:av:footage:file' | 'aex:item:av:footage:solid' | 'aex:item:av:footage:placeholder';

type AexLayerType = 'aex:layer:camera' | 'aex:layer:light' | AexAvLayerType;
type AexAvLayerType = 'aex:layer:av:shape' | 'aex:layer:av:text' | AexFootageLayerType;
type AexFootageLayerType = 'aex:layer:av:null' | 'aex:layer:av:file' | 'aex:layer:av:comp' | 'aex:layer:av:solid' | 'aex:layer:av:placeholder';

type AexPropertyType =
    | 'aex:property:no_value'
    | 'aex:property:custom'
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

type AexPropertyGroupType =
    | 'aex:propertyGroup:effect'
    | 'aex:propertyGroup:effect:dropdown'
    | 'aex:propertyGroup:shape:group'
    | 'aex:propertyGroup:shape:item'
    | 'aex:propertyGroup:text:animator'
    | 'aex:propertyGroup:layerstyle';

type AexKeyType = 'aex:keyframe';
type AexMarkerType = 'aex:marker';

type AexUID = string;

type CustomHandler = (log: AexLogEntry) => void;

interface PrescanOptions {}

interface PrescanResult {
    stats: AexStats;
}

type CommonBehavior = 'skip' | 'throw' | CustomHandler;

interface GetOptions {
    unspportedPropertyBehavior: CommonBehavior | 'metadata';
}

interface CreateOptions {
    missingFileBehavior: CommonBehavior;
}

interface GetResult<T = AexSerialized> {
    /** Version of the schema for this interface */
    schema: number;
    /** Version of AE that this blob was serialized with */
    aeversion: number;
    type: 'aex:getresult';
    /** The thing that was just serialized */
    object: T;
    /** Additional footage that was found along the way. This is split up by comps and items. */
    footage: {
        comps: AexComp[];
        items: AexItem[];
    };
    /**
     * Counts of the various elements found while serializing.  Intended to make showing
     * progress bars easier and estimating the complexity of something you plan to process.
     */
    stats: AexStats;
    profile?: {
        [key: string]: { elapsed: number; meta: string }[];
    };
}

interface UpdateOptions {
    projectItemMismatchBehavior: CommonBehavior | 'create';
    markerMatchBy: 'index' | 'time';
    layerMatchBy: 'index' | 'name';
}

interface UpdateResult {
    stats: AexStats;
}

interface AexLogEntry {
    aexObject: AexObject;
    message: string;
}

interface AexStats {
    nonCompItemCount: number;
    compCount: number;
    layerCount: number;
    propertyCount: number;
    keyCount: number;
}

interface AexState {
    prescanOptions: PrescanOptions;
    getOptions: GetOptions;
    createOptions: CreateOptions;
    footageSources?: AEQArrayEx<Item>;
    footageToCreate?: AEQArrayEx<AexItem>;
    footageIdMap?: { [key: string]: number };
    updateOptions: UpdateOptions;
    stats: AexStats;
    profile?: {
        [key: string]: { elapsed: number; meta: string }[];
    };
}

interface AexObject {
    type: AexObjectType;
}

interface AexProjectBase {
    bitsPerChannel: number;
    displayStartFrame: number;
    expressionEngine: string;
    feetFramesFilmType: number;
    footageTimecodeDisplayStartType: number;
    framesCountType: number;
    framesUseFeetFrames: boolean;
    gpuAccelType: number;
    linearBlending: boolean;
    linearizeWorkingSpace: boolean;
    timeDisplayType: number;
    transparencyGridThumbnails: boolean;
    workingGamma: number;
    workingSpace: string;
}

interface AexProject extends AexProjectBase, AexObject {
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
    file: string;
    sequence: boolean;
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
    enabled: boolean;

    comment: string;
    hasVideo: boolean;
    inPoint: number;
    outPoint: number;
    startTime: number;
    shy: boolean;
    solo: boolean;
    stretch: number;
    dimensionsSeparated: boolean;
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

    /**
     * Note: This is a PropertyGroup instead of AexLayerStylePropertyGroup[]
     * because we need the "layerStyles.enabled" boolean that exists on the property
     * If not for that, we would refactor layerStyles to be said array.
     **/
    layerStyles: AexPropertyGroup;

    geometryOption: AexPropertyGroup;
    materialOption: AexPropertyGroup;
    effects: AexEffectPropertyGroup[];
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
    trackers: AexPropertyGroup[];
}

interface AexFootageSource extends AexObject {
    type: AexAvItemType;
    aexid: AexUID;
}

interface AexNullLayer extends AexFootageLayer, AexObject {}

interface AexTextLayer extends AexAVLayerBase, AexObject {
    threeDPerChar: boolean;
    sourceText: AexProperty<AexTextDocument>;
    pathOption: AexPropertyGroup;
    moreOption: AexPropertyGroup;
    animators: AexAnimatorPropertyGroup[];
}

interface AexPropertyBase {
    enabled: boolean;
    matchName: string;
    name?: string;
}

interface AexProperty<T extends AexPropertyValueType = any> extends AexPropertyBase, AexObject {
    expression: string;
    expressionEnabled: boolean;
    value: T;

    type: AexPropertyType;
    keys: AexKey[];
}

interface AexKey extends AEQKeyInfo, AexObject {}

interface AexDropdownProperty extends AexProperty {
    items: string[];
}

interface AexPropertyGroup extends AexPropertyBase {
    properties: AexPropertyBase[];
}

interface AexShapePropertyGroup extends AexPropertyGroup, AexObject {
    contents: AexShapePropertyGroup[];
}

interface AexEffectLinkedLayerIndex {
    /** Property index in the effect that links to a layer */
    propertyIndex: number;

    /** Layer index that the property points to */
    layerIndex: number;
}

interface AexEffectPropertyGroup extends AexPropertyGroup, AexObject {
    /** If the effect contains any properties that link to a specific layer, store those to set in a second pass */
    linkedLayerIndices: AexEffectLinkedLayerIndex[];
}

interface AexAnimatorPropertyGroup extends AexPropertyGroup, AexObject {}

interface AexLayerStylePropertyGroup extends AexPropertyGroup, AexObject {}

interface AexMarkerProperty extends AexObject {
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
    position?: AexProperty<TwoDPoint> | AexProperty<ThreeDPoint>;
    xPosition?: AexProperty<number>;
    yPosition?: AexProperty<number>;
    zPosition?: AexProperty<number>;
    scale: AexProperty<TwoDPoint> | AexProperty<ThreeDPoint>;
    pointOfInterest: AexProperty<ThreeDPoint>;
    orientation: AexProperty<ThreeDPoint>;
    xRotation: AexProperty<number>;
    yRotation: AexProperty<number>;
    rotation: AexProperty<number>;
    opacity: AexProperty<number>;
}
