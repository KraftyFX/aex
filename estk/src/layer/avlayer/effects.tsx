function getAexAvLayerEffects(aeAvLayer: AVLayer, state: AexState): AexEffectPropertyGroup[] {
    const fillProperties = (effectGroup: PropertyGroup, aexEffectGroup: AexEffectPropertyGroup) => {
        /**
         * Voodoo
         *
         * AE supports user defined dropdowns which only appear inside of Layer.effect
         * and only within a top level group. It doesn't exist anywhere else and requires special
         * serialization handling. In all other cases we want to use default property group
         * serialization.
         */
        if (_isDropdownEffect(effectGroup, state)) {
            aexEffectGroup.properties = [_getDropdownProperty(effectGroup, state)];
            aexEffectGroup.type = AEX_DROPDOWN_EFFECT_PROPERTYGROUP;
        } else {
            /**
             * Voodoo
             *
             * AE has some effect properties that are only used to drive the UI. They do not
             * impact rendering and their values cannot be serialized. These only appear in the
             * Layer.effect hierarchy and should be gracefully skipped over.
             */
            aexEffectGroup.properties = getPropertyGroup(effectGroup, state, _isUiOnlyEffectProperty)?.properties;
            aexEffectGroup.type = AEX_EFFECT_PROPERTYGROUP;
        }
    };

    return getTopLevelPropertyGroups(aeAvLayer.effect, fillProperties, state);
}

function setAvLayerEffects(aeAvLayer: AVLayer, aexAvLayer: AexAVLayer, state: AexState) {
    const aexEffects: AexEffectPropertyGroup[] = aexAvLayer.effects;

    aeq.arrayEx(aexEffects).forEach((aexEffect: AexEffectPropertyGroup) => {
        createLayerEffect(aeAvLayer, aexEffect, state);
    });
}

function createLayerEffect(aeAvLayer: AVLayer, aexEffect: AexEffectPropertyGroup, state: AexState) {
    const aeLayerEffectGroup: PropertyGroup = aeAvLayer.effect;
    const isDropdownEffect = _isDropdownAexEffect(aexEffect, state);

    let effect;

    if (isDropdownEffect) {
        effect = _createDropdownEffect(aeLayerEffectGroup, aexEffect, state) as PropertyGroup;
    } else {
        effect = aeLayerEffectGroup.addProperty(aexEffect.matchName) as PropertyGroup;
    }

    assignAttributes(effect, {
        name: aexEffect.name,
        enabled: aexEffect.enabled,
    });

    if (!isDropdownEffect) {
        setPropertyGroup(effect, aexEffect, state);
    }
}

function _isUiOnlyEffectProperty(property: Property): boolean {
    const { propertyDepth, propertyValueType } = property;

    return propertyValueType === PropertyValueType.NO_VALUE && propertyDepth > 2 && property.propertyGroup(propertyDepth - 2).isEffect;
}

function _isDropdownAexEffect(aexEffect: AexEffectPropertyGroup, state: AexState): boolean {
    return aexEffect.type === AEX_DROPDOWN_EFFECT_PROPERTYGROUP;
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

    return {
        ...propertyData,
        items: _getDropdownPropertyItems(dropdownProperty, state),
    };
}

function _createDropdownEffect(effects: PropertyGroup, aexEffect: AexEffectPropertyGroup, state: AexState): PropertyGroup {
    const effect = effects.addProperty('ADBE Dropdown Control');

    assignAttributes(effect, {
        name: aexEffect.name,
        enabled: aexEffect.enabled,
    });

    const aexDropdownProperty = aexEffect.properties[0] as AexDropdownProperty;
    const dropdownProperty = effect.property(1) as Property;

    /**
     * Voodoo
     *
     * Calling this function invalidates the reference to the effect and the property itself
     * However, it returns a new reference to the property, so we can return that.
     */
    const updatedProperty = dropdownProperty.setPropertyParameters(aexDropdownProperty.items);

    if (aexDropdownProperty.value) {
        setProperty(updatedProperty as Property, aexDropdownProperty, state);
    }

    const updatedDropdownEffect = updatedProperty.propertyGroup(1) as PropertyGroup;

    return updatedDropdownEffect;
}

function _getDropdownPropertyItems(dropdownProperty: Property, state: AexState): string[] {
    const propertyItems: string[] = [];

    for (let ii = 0, il = dropdownProperty.maxValue; ii < il; ii++) {
        propertyItems.push(`Item ${ii + 1}`);
    }

    return propertyItems;
}
