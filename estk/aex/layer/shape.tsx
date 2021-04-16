function getShapeLayer(layer: ShapeLayer, state: AexState): AexShapeLayer {
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

function createShapeLayer(comp: CompItem, aexShapeLayer: AexShapeLayer, state: AexState) {
    const layer = comp.layers.addShape();
    _setAVLayerAttributes(layer, aexShapeLayer, state);

    /**
     * @todo
     *
     * - contents
     */
}

function _getContents(layer: ShapeLayer, state: AexState): AexShapePropertyGroup[] {
    const vectorsGroups = layer.property('ADBE Root Vectors Group') as PropertyGroup;

    const onGroup: OnShapeGroupCallback = (propertyGroup, aexPropertyGroup) => {
        if (isVectorGroup(propertyGroup)) {
            aexPropertyGroup.contents = getVectorsGroup(propertyGroup, onGroup, state);
        }
    };

    return getUnnestedPropertyGroup(vectorsGroups, onGroup, state);
}
