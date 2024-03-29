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
const AEX_NONE_PROPERTY = 'aex:property:none';

const AEX_KEY = 'aex:keyframe';
const AEX_MARKER = 'aex:marker';

const AEX_EFFECT_PROPERTYGROUP = 'aex:propertyGroup:effect';
const AEX_DROPDOWN_EFFECT_PROPERTYGROUP = 'aex:propertyGroup:effect:dropdown';
const AEX_SHAPEGROUP_PROPERTYGROUP = 'aex:propertyGroup:shape:group';
const AEX_SHAPEITEM_PROPERTYGROUP = 'aex:propertyGroup:shape:item';
const AEX_TEXT_ANIMATOR_PROPERTYGROUP = 'aex:propertyGroup:text:animator';
const AEX_LAYERSTYLE_PROPERTYGROUP = 'aex:propertyGroup:layerstyle';

function isAexLayer(aexObject: AexObject): aexObject is AexLayer {
    return aexObject.type.indexOf('aex:layer') == 0;
}

function isAexAvLayer(aexObject: AexObject): aexObject is AexAVLayer {
    return aexObject.type.indexOf('aex:layer:av') == 0;
}

function isAexSerializedGroup(aexObject: AexObject) {
    return aexObject.type.indexOf('aex:propertyGroup') == 0;
}

function isAexProperty(aexObject: AexObject): aexObject is AexProperty {
    return aexObject.type.indexOf('aex:property') == 0;
}

function isAexKey(aexObject: AexObject): aexObject is AexKey {
    return aexObject.type.indexOf(AEX_KEY) == 0;
}

function isAexMarker(aexObject: AexObject): aexObject is AexMarkerProperty {
    return aexObject.type.indexOf(AEX_MARKER) == 0;
}
