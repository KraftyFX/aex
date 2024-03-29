function prescanShapeLayer(aeShapeLayer: ShapeLayer, state: AexState) {
    state.stats.layerCount++;

    prescanAvLayer(aeShapeLayer, state);
    prescanPropertyGroup(_getRootVectorsGroup(aeShapeLayer), state);
}

function getAexShapeLayer(aeShapeLayer: ShapeLayer, state: AexState): AexShapeLayer {
    const avLayerAttributes = getAvLayerAttributes(aeShapeLayer, AEX_SHAPE_LAYER, state);

    /**
     * Voodoo
     *
     * This property exists on TextLayer but can't be toggled. Meaningless cruft.
     */
    delete avLayerAttributes.collapseTransformation;

    state.stats.layerCount++;

    return {
        ...avLayerAttributes,

        contents: _getContents(aeShapeLayer, state),
    };
}

function createAeShapeLayer(aeComp: CompItem, aexShapeLayer: AexShapeLayer, state: AexState) {
    const aeShapeLayer = aeComp.layers.addShape();

    updateAexShapeLayer(aeShapeLayer, aexShapeLayer, state);

    return aeShapeLayer;
}

function updateAexShapeLayer(aeShapeLayer: ShapeLayer, aexShapeLayer: AexShapeLayer, state: AexState) {
    setAvLayerAttributes(aeShapeLayer, aexShapeLayer, state);
    _setContents(_getRootVectorsGroup(aeShapeLayer), aexShapeLayer.contents, state);
}

function _getContents(aeShapeLayer: ShapeLayer, state: AexState): AexShapePropertyGroup[] {
    const rootVectorsGroups = _getRootVectorsGroup(aeShapeLayer);

    const fillGroup = (propertyGroup: PropertyGroup, aexPropertyGroup: AexShapePropertyGroup) => {
        /**
         * When we find a vector group we want to serialize all of its properties normally
         * except the vectors group contents so we can clean them up and promote them to the
         * `contents` property.
         */
        if (_isVectorGroup(propertyGroup)) {
            aexPropertyGroup.properties = getPropertyGroup(propertyGroup, state, _isVectorsGroup)?.properties;
            aexPropertyGroup.contents = _getVectorsGroupContents(propertyGroup, fillGroup, state);
            aexPropertyGroup.type = AEX_SHAPEGROUP_PROPERTYGROUP;
        } else {
            aexPropertyGroup.properties = getPropertyGroup(propertyGroup, state)?.properties;
            aexPropertyGroup.type = AEX_SHAPEITEM_PROPERTYGROUP;
        }
    };

    return getTopLevelPropertyGroups(rootVectorsGroups, fillGroup, state);
}

function _setContents(contents: PropertyGroup, aexContents: AexShapePropertyGroup[], state: AexState) {
    aeq.arrayEx(aexContents).forEach((aexContent: AexShapePropertyGroup) => {
        setShapeContent(contents, aexContent, state);
    });
}

function setShapeContent(contents: PropertyGroup, aexContent: AexShapePropertyGroup, state: AexState) {
    const { matchName } = aexContent;

    let shapeGroup: PropertyBase;

    if (contents.canAddProperty(matchName)) {
        shapeGroup = _createPropertyBase(contents, aexContent, state);

        if (_isVectorGroup(aexContent)) {
            _setContents(shapeGroup.property('ADBE Vectors Group') as PropertyGroup, aexContent.contents, state);
        }
    } else {
        shapeGroup = contents.property(matchName);
    }

    setPropertyGroup(shapeGroup as PropertyGroup, aexContent, state);
}

function _getRootVectorsGroup(aeShapeLayer: ShapeLayer): PropertyGroup {
    return aeShapeLayer.property('ADBE Root Vectors Group') as PropertyGroup;
}

function _isVectorGroup(propertyGroup: Property | PropertyGroup | AexShapePropertyGroup) {
    return propertyGroup.matchName === 'ADBE Vector Group';
}

function _isVectorsGroup(property: Property | PropertyGroup) {
    return property.matchName === 'ADBE Vectors Group';
}

function _getVectorsGroupContents(propertyGroup: PropertyGroup, fillVectorContents: FillShapeCallback, state: AexState) {
    const vectorsGroup = propertyGroup.property('ADBE Vectors Group') as PropertyGroup;

    return getTopLevelPropertyGroups(vectorsGroup, fillVectorContents, state);
}
