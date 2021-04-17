function getEffects(layer: AVLayer, state: AexState) {
    const fillProperties = (effectGroup: PropertyGroup, aexEffectGroup: AexPropertyGroup) => {
        /**
         * VOODOO: AE supports user defined dropdowns which only appear inside of Layer.effect
         * and only within a top level group. It doesn't exist anywhere else and requires special
         * serialization handling. In all other cases we want to use default property group
         * serialization.
         */
        if (_isDropdownEffect(effectGroup, state)) {
            aexEffectGroup.properties = [_getDropdownProperty(effectGroup, state)];
        } else {
            /**
             * VOODOO: AE has some effect properties that are only used to drive the UI. They do not
             * impact rendering and their values cannot be serialized. These only appear in the
             * Layer.effect hierarchy and should be gracefully skipped over.
             */
            aexEffectGroup.properties = getPropertyGroup(effectGroup, state, _isUiOnlyEffectProperty)?.properties;
        }
    };

    return getTopLevelPropertyGroups(layer.effect, fillProperties);
}

function _isUiOnlyEffectProperty(property: Property): boolean {
    const { propertyDepth, propertyValueType } = property;

    return propertyValueType === PropertyValueType.NO_VALUE && propertyDepth > 2 && property.propertyGroup(propertyDepth - 2).isEffect;
}

function _isDropdownEffect(effect: PropertyGroup, state: AexState): boolean {
    if (effect.isEffect) {
        const dropdownProperty = effect.property(1) as Property;

        return dropdownProperty.isDropdownEffect;
    } else {
        return false;
    }
}

function _getDropdownProperty(effect: PropertyGroup, state: AexState): AexDropdownProperty {
    const dropdownProperty = effect.property(1) as Property;
    let propertyData = getModifiedProperty(dropdownProperty as OneDProperty, state) as AexDropdownProperty;

    if (aeq.isNullOrUndefined(propertyData)) {
        propertyData = {} as AexDropdownProperty;
    }

    propertyData.items = _getDropdownPropertyItems(dropdownProperty, state);
    propertyData.type = AEX_DROPDOWN_PROPERTY;

    return {
        ...propertyData,
        items: _getDropdownPropertyItems(dropdownProperty, state),
    };
}

function _getDropdownPropertyItems(dropdownProperty: Property, state: AexState): string[] {
    const propertyItems: string[] = [];

    /**
     * @todo Replace this with an actual API call when it exists
     *
     * Be sure to check AE version and keep this approach for older AE versions.
     */
    for (let ii = 0, il = dropdownProperty.maxValue; ii < il; ii++) {
        propertyItems.push(`Item ${ii + 1}`);
    }

    return propertyItems;
}
