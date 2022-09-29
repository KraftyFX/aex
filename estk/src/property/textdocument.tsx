function isTextDocument(aeProperty: Property<UnknownPropertyType>) {
    return aeProperty.propertyValueType === PropertyValueType.TEXT_DOCUMENT;
}

function _getTextDocumentProperties(aeTextDocument: TextDocument): AexTextDocument {
    const { pointText } = aeTextDocument;

    return {
        pointText,
        text: getModifiedValue(aeTextDocument.text, ''),

        allCaps: getModifiedValue(aeTextDocument.allCaps, false),
        applyFill: getModifiedValue(aeTextDocument.applyFill, false),
        applyStroke: getModifiedValue(aeTextDocument.applyStroke, false),
        baselineLocs: getModifiedValue(aeTextDocument.baselineLocs, [0, 0]),
        baselineShift: getModifiedValue(aeTextDocument.baselineShift, -1),
        boxTextPos: getBoundModifiedValue(aeTextDocument.boxText, () => aeTextDocument.boxTextPos, [0, 0]),
        boxTextSize: getBoundModifiedValue(aeTextDocument.boxText, () => aeTextDocument.boxTextSize, [0, 0]),
        fauxBold: getModifiedValue(aeTextDocument.fauxBold, false),
        fauxItalic: getModifiedValue(aeTextDocument.fauxItalic, false),
        fillColor: getBoundModifiedValue(aeTextDocument.applyFill, () => aeTextDocument.fillColor, [0, 0, 0]),
        font: getModifiedValue(aeTextDocument.font, ''),
        fontFamily: getModifiedValue(aeTextDocument.fontFamily, ''),
        fontSize: getModifiedValue(aeTextDocument.fontSize, 32),
        fontStyle: getModifiedValue(aeTextDocument.fontStyle, ''),
        horizontalScale: getModifiedValue(aeTextDocument.horizontalScale, -1),
        justification: getModifiedValue(aeTextDocument.justification, ParagraphJustification.LEFT_JUSTIFY),
        leading: getModifiedValue(aeTextDocument.leading, -1),
        smallCaps: getModifiedValue(aeTextDocument.smallCaps, false),
        strokeColor: getBoundModifiedValue(aeTextDocument.applyStroke, () => aeTextDocument.strokeColor, [0, 0, 0]),
        strokeOverFill: getBoundModifiedValue(aeTextDocument.applyStroke, () => aeTextDocument.strokeOverFill, false),
        strokeWidth: getBoundModifiedValue(aeTextDocument.applyStroke, () => aeTextDocument.strokeWidth, -1),
        subscript: getModifiedValue(aeTextDocument.subscript, false),
        superscript: getModifiedValue(aeTextDocument.superscript, false),
        tracking: getModifiedValue(aeTextDocument.tracking, -1),
        tsume: getModifiedValue(aeTextDocument.tsume, -1),
        verticalScale: getModifiedValue(aeTextDocument.verticalScale, -1),
    };
}

function _createTextDocument(aeTextDocument: TextDocument, aexTextDocument: AexTextDocument, state: AexState): TextDocument {
    aeTextDocument.resetCharStyle();

    /**
     * These properties are read & serialized, but can't be deserialized
     * @todo issue #53
     *
     * aeTextDocument.allCaps = aexTextDocument.allCaps;
     * aeTextDocument.boxTextPos = aexTextDocument.boxTextPos;
     * aeTextDocument.fauxBold = aexTextDocument.fauxBold;
     * aeTextDocument.fauxItalic = aexTextDocument.fauxItalic;
     * aeTextDocument.fontFamily = aexTextDocument.fontFamily;
     * aeTextDocument.fontStyle = aexTextDocument.fontStyle;
     * aeTextDocument.horizontalScale = aexTextDocument.horizontalScale;
     * aeTextDocument.smallCaps = aexTextDocument.smallCaps;
     * aeTextDocument.subscript = aexTextDocument.subscript;
     * aeTextDocument.superscript = aexTextDocument.superscript;
     * aeTextDocument.tsume = aexTextDocument.tsume;
     * aeTextDocument.verticalScale = aexTextDocument.verticalScale;
     * aeTextDocument.baselineLocs = aexTextDocument.baselineLocs;
     * aeTextDocument.baselineShift = aexTextDocument.baselineShift;
     */
    assignAttributes(aeTextDocument, {
        font: aexTextDocument.font,
        fontSize: aexTextDocument.fontSize,
        justification: aexTextDocument.justification,
        leading: aexTextDocument.leading,
        text: aexTextDocument.text,
        tracking: aexTextDocument.tracking,
    });

    /** If not pointText, then we're using boxText */
    if (!aexTextDocument.pointText) {
        assignAttributes(aeTextDocument, {
            boxTextSize: aexTextDocument.boxTextSize,
        });
    }

    if (!aeq.isNullOrUndefined(aexTextDocument.applyFill)) {
        assignAttributes(aeTextDocument, {
            applyFill: aexTextDocument.applyFill,
            fillColor: aexTextDocument.fillColor,
        });
    }

    if (!aeq.isNullOrUndefined(aexTextDocument.applyStroke)) {
        assignAttributes(aeTextDocument, {
            applyStroke: aexTextDocument.applyStroke,
            strokeColor: aexTextDocument.strokeColor,
            strokeOverFill: aexTextDocument.strokeOverFill,
            strokeWidth: aexTextDocument.strokeWidth,
        });
    }

    return aeTextDocument;
}
