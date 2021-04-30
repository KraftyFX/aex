function getAexShapeLayer(layer: ShapeLayer, state: AexState): AexShapeLayer {
    const avLayerAttributes = getAVLayer(layer, state);

    /**
     * Voodoo: This property exists on TextLayer but can't be toggled. Meaningless cruft.
     */
    delete avLayerAttributes.collapseTransformation;

    return {
        ...avLayerAttributes,
        type: AEX_SHAPE_LAYER,

        contents: _getContents(layer, state),
    };
}

function createAeShapeLayer(comp: CompItem, aexShapeLayer: AexShapeLayer, state: AexState) {
    const layer = comp.layers.addShape();
    _setAVLayerAttributes(layer, aexShapeLayer, state);
    _setContents(layer.property('ADBE Root Vectors Group') as PropertyGroup, aexShapeLayer.contents, state);
    return layer;
}

function _getContents(layer: ShapeLayer, state: AexState): AexShapePropertyGroup[] {
    const rootVectorsGroups = layer.property('ADBE Root Vectors Group') as PropertyGroup;

    const fillGroup = (propertyGroup: PropertyGroup, aexPropertyGroup: AexShapePropertyGroup) => {
        /**
         * When we find a vector group we want to serialize all of its properties normally
         * except the vectors group contents so we can clean them up and promote them to the
         * `contents` property.
         */
        if (_isVectorGroup(propertyGroup)) {
            aexPropertyGroup.properties = getPropertyGroup(propertyGroup, state, _isVectorsGroup)?.properties;
            aexPropertyGroup.contents = _getVectorsGroupContents(propertyGroup, fillGroup);
        } else {
            aexPropertyGroup.properties = getPropertyGroup(propertyGroup, state)?.properties;
        }
    };

    return getTopLevelPropertyGroups(rootVectorsGroups, fillGroup);
}

function _setContents(contents: PropertyGroup, aexContents: AexShapePropertyGroup[], state: AexState) {
    aeq.arrayEx(aexContents).forEach((aexContent: AexShapePropertyGroup) => {
        const { matchName } = aexContent;

        let shapeGroup: PropertyBase;

        if (contents.canAddProperty(matchName)) {
            shapeGroup = _createPropertyBase(contents, aexContent, state);

            if (matchName === 'ADBE Vector Group') {
                _setContents(shapeGroup.property('ADBE Vectors Group') as PropertyGroup, aexContent.contents, state);
            }
        } else {
            shapeGroup = contents.property(matchName);
        }

        setPropertyGroup(shapeGroup as PropertyGroup, aexContent, state);
    });
}

function _isVectorGroup(propertyGroup: Property | PropertyGroup) {
    return propertyGroup.matchName === 'ADBE Vector Group';
}

function _isVectorsGroup(property: Property | PropertyGroup) {
    return property.matchName === 'ADBE Vectors Group';
}

function _getVectorsGroupContents(propertyGroup: PropertyGroup, fillVectorContents: FillShapeCallback) {
    const vectorsGroup = propertyGroup.property('ADBE Vectors Group') as PropertyGroup;

    return getTopLevelPropertyGroups(vectorsGroup, fillVectorContents);
}
