type Serializable = Project | CompItem | Layer | Property<any>;

type AexLayerType = 'Layer' | 'CameraLayer' | 'LightLayer' | 'AVLayer' | 'ShapeLayer' | 'TextLayer';
type AexItemType = 'Folder' | 'Footage' | 'Comp' | 'Solid' | 'Placeholder';

interface AexOptions {}

interface AexProject {
    items: Partial<AexItem>[];
    comps: Partial<AexComp>[];
}

interface AexItem {
    comment: string;
    label: number;
    name: string;
    folder: string;
    layerType: AexItemType;
}

interface AexAVItem {
    duration: number;
    frameRate: number;
    height: number;
    pixelAspect: number;
    width: number;
}

interface AexFileSourceAttributes {
    /** Path to file */
    file: string;
}

interface AexSolidSourceAttributes {
    color: number[];
}

interface AexComp extends AexAVItem, AexItem {
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
    essentialProps: any[];
}

interface AexLayer {
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
    parentLayerIndex: number;

    layerType: AexLayerType;
    properties: AexProperties;
}

interface AexAVLayerAttributes {
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

interface AexLightLayerAttributes {
    lightType: LightType;
}

interface AexTextLayerAttributes {
    threeDPerChar: boolean;
}

interface AexProperties {
    [name: string]: AexProperty;
}

interface AexProperty {}

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
