const AEX_PROJECT = 'aex:project';

const AEX_COMP_ITEM = 'aex:item:av:comp';
const AEX_FILE_FOOTAGE_ITEM = 'aex:item:av:footage:file';
const AEX_SOLID_ITEM = 'aex:item:av:footage:solid';
const AEX_PLACEHOLDER_ITEM = 'aex:item:av:footage:placeholder';
const AEX_FOLDER_ITEM = 'aex:item:folder';

const AEX_COMP_LAYER = 'aex:layer:av:comp';
const AEX_FILE_LAYER = 'aex:layer:av:file';
const AEX_NULL_LAYER = 'aex:layer:av:null';
const AEX_SOLID_LAYER = 'aex:layer:av:solid';
const AEX_PLACEHOLDER_LAYER = 'aex:layer:av:placeholder';
const AEX_SHAPE_LAYER = 'aex:layer:av:shape';
const AEX_TEXT_LAYER = 'aex:layer:av:text';
const AEX_CAMERA_LAYER = 'aex:layer:camera';
const AEX_LIGHT_LAYER = 'aex:layer:light';

const AEX_ONED_PROPERTY = 'aex:property:oned';
const AEX_TWOD_PROPERTY = 'aex:property:twod';
const AEX_THREED_PROPERTY = 'aex:property:threed';
const AEX_COLOR_PROPERTY = 'aex:property:color';
const AEX_MARKER_PROPERTY = 'aex:property:marker';
const AEX_SHAPE_PROPERTY = 'aex:property:shape';
const AEX_TEXTDOCUMENT_PROPERTY = 'aex:property:textdocument';
const AEX_CUSTOM_PROPERTY = 'aex:property:custom';
const AEX_DROPDOWN_PROPERTY = 'aex:property:dropdown';
const AEX_NONE_PROPERTY = 'aex:property:none';

const AEX_AUDIO_PROPERTYGROUP = 'aex:propertyGroup:audio';
const AEX_MATERIALOPTION_PROPERTYGROUP = 'aex:propertyGroup:option:material';
const AEX_GEOMETRYOPTION_PROPERTYGROUP = 'aex:propertyGroup:option:geometry';
const AEX_LAYERSTYLES_PROPERTYGROUP = 'aex:propertyGroup:styles:group';
const AEX_LAYERSTYLE_PROPERTYGROUP = 'aex:propertyGroup:styles:item';

function isAexLayer(aexObject: AexObject) {
    return aexObject.type.indexOf('aex:layer') == 0;
}

function isAexAvLayer(aexObject: AexObject) {
    return aexObject.type.indexOf('aex:layer:av') == 0;
}
