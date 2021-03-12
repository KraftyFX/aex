function propertyParser(options: AexOptions) {
    function _parsePropertyBase<T>(property: Property<T>): AexPropertyBase {
        const enabled = getModifiedValue(property.enabled, true);
        const matchName = property.matchName;
        const name = property.name;

        return {
            enabled,
            matchName,
            name,
        };
    }

    function _parseKeys<T>(property: Property<T>): AEQKeyInfo[] {
        const propertyKeys = aeq.getKeys(property as any);
        const keys = propertyKeys.map(function (key) {
            const {
                value,
                time,
                interpolationType,
                temporalEase,
                spatialTangent,
                temporalAutoBezier,
                temporalContinuous,
                spatialAutoBezier,
                spatialContinuous,
                roving,
            } = key.getKeyInfo();

            return {
                value,
                time,
                interpolationType,
                temporalEase,
                spatialTangent,
                temporalAutoBezier,
                temporalContinuous,
                spatialAutoBezier,
                spatialContinuous,
                roving,
            };
        });

        return keys;
    }

    return {
        getModifiedProperty<T>(property: Property<T>): AexProperty<T> | undefined {
            if (aeq.isNullOrUndefined(property) || !property.isModified) {
                return undefined;
            }

            return this.parseProperty(property);
        },
        parseProperty<T>(property: Property<T>): AexProperty<T> {
            const propertyBaseProperties = _parsePropertyBase(property);

            const expression = getModifiedValue(property.expression, '');
            const expressionEnabled = getModifiedValue(property.expressionEnabled, false);

            const value = property.value;

            let keys;
            if (property.numKeys > 0) {
                keys = _parseKeys(property);
            }

            return {
                ...propertyBaseProperties,
                expression,
                expressionEnabled,
                value,
                keys,
            };
        },
    };
}
