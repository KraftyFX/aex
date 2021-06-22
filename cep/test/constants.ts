export const AEX_PROJECT = 'aex:project';

export const AEX_COMP_ITEM = 'aex:item:av:comp';
export const AEX_FILE_FOOTAGE_ITEM = 'aex:item:av:footage:file';
export const AEX_SOLID_ITEM = 'aex:item:av:footage:solid';
export const AEX_PLACEHOLDER_ITEM = 'aex:item:av:footage:placeholder';
export const AEX_FOLDER_ITEM = 'aex:item:folder';

export const AEX_COMP_LAYER = 'aex:layer:av:comp';
export const AEX_FILE_LAYER = 'aex:layer:av:file';
export const AEX_NULL_LAYER = 'aex:layer:av:null';
export const AEX_SOLID_LAYER = 'aex:layer:av:solid';
export const AEX_PLACEHOLDER_LAYER = 'aex:layer:av:placeholder';
export const AEX_SHAPE_LAYER = 'aex:layer:av:shape';
export const AEX_TEXT_LAYER = 'aex:layer:av:text';
export const AEX_CAMERA_LAYER = 'aex:layer:camera';
export const AEX_LIGHT_LAYER = 'aex:layer:light';

export const AEX_DROPDOWN_PROPERTY = 'aex:property:dropdown';
export const AEX_CUSTOM_PROPERTY = 'aex:property:custom';
export const AEX_ONED_PROPERTY = 'aex:property:oned';
export const AEX_TWOD_PROPERTY = 'aex:property:twod';
export const AEX_THREED_PROPERTY = 'aex:property:threed';
export const AEX_COLOR_PROPERTY = 'aex:property:color';
export const AEX_MARKER_PROPERTY = 'aex:property:marker';
export const AEX_SHAPE_PROPERTY = 'aex:property:shape';
export const AEX_TEXTDOCUMENT_PROPERTY = 'aex:property:textdocument';
export const AEX_NONE_PROPERTY = 'aex:property:none';

export const AEX_AUDIO_PROPERTYGROUP = 'aex:propertyGroup:audio';
export const AEX_MATERIALOPTION_PROPERTYGROUP = 'aex:propertyGroup:option:material';
export const AEX_GEOMETRYOPTION_PROPERTYGROUP = 'aex:propertyGroup:option:geometry';
export const AEX_LAYERSTYLES_PROPERTYGROUP = 'aex:propertyGroup:styles:group';
export const AEX_LAYERSTYLE_PROPERTYGROUP = 'aex:propertyGroup:styles:item';

export interface AexPrescanResult {
    log: {
        message: string;
    }[];
    stats: any;
}
export interface AexResult {
    object: any;
    log: {
        message: string;
    }[];
    stats: any;
    profile: {
        [key: string]: { elapsed: number; meta: string }[];
    };
}
export interface AexLogEntry {
    aexProperty: any;
    message: string;
}

export interface AexObject {
    type: string;
}

export type UnsupportedTypeCallback = (log: AexLogEntry) => void;

export interface AexOptions {
    unspportedPropertyBehavior: 'skip' | 'log' | 'throw' | 'metadata' | UnsupportedTypeCallback;
}
