type Serializable = Project | CompItem | Layer | Property<any>;

interface AexOptions {}

interface AexProject {
    comps: Partial<AexComp>[];
}

interface AexComp {
    comment: string;
    label: number;
    folder: string;

    duration: number;
    frameDuration: number;
    frameRate: number;
    height: number;
    name: string;
    pixelAspect: number;
    width: number;

    bgColor: number[];
    // displayStartFrame: number;
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
    compMarkers: AexMarkerProperty[];
    essentialProps: any[];
}

interface AexLayer {
    props: {}[];
}

interface AexProperty {}

interface AexMarkerProperty {}
