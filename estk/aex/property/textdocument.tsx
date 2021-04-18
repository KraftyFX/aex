function isTextDocument(property: Property<UnknownPropertyType>) {
    return property.propertyValueType === PropertyValueType.TEXT_DOCUMENT;
}

function _getTextDocumentProperties(text: TextDocument): AexTextDocument {
    const { pointText } = text;

    return {
        pointText,
        text: getModifiedValue(text.text, ''),

        allCaps: getModifiedValue(text.allCaps, false),
        applyFill: getModifiedValue(text.applyFill, false),
        applyStroke: getModifiedValue(text.applyStroke, false),
        baselineLocs: getModifiedValue(text.baselineLocs, [0, 0]),
        baselineShift: getModifiedValue(text.baselineShift, -1),
        boxTextPos: getBoundModifiedValue(text.boxText, () => text.boxTextPos, [0, 0]),
        boxTextSize: getBoundModifiedValue(text.boxText, () => text.boxTextSize, [0, 0]),
        fauxBold: getModifiedValue(text.fauxBold, false),
        fauxItalic: getModifiedValue(text.fauxItalic, false),
        fillColor: getBoundModifiedValue(text.applyFill, () => text.fillColor, [0, 0, 0]),
        font: getModifiedValue(text.font, ''),
        fontFamily: getModifiedValue(text.fontFamily, ''),
        fontSize: getModifiedValue(text.fontSize, 32),
        fontStyle: getModifiedValue(text.fontStyle, ''),
        horizontalScale: getModifiedValue(text.horizontalScale, -1),
        justification: getModifiedValue(text.justification, ParagraphJustification.LEFT_JUSTIFY),
        leading: getModifiedValue(text.leading, -1),
        smallCaps: getModifiedValue(text.smallCaps, false),
        strokeColor: getBoundModifiedValue(text.applyStroke, () => text.strokeColor, [0, 0, 0]),
        strokeOverFill: getBoundModifiedValue(text.applyStroke, () => text.strokeOverFill, false),
        strokeWidth: getBoundModifiedValue(text.applyStroke, () => text.strokeWidth, -1),
        subscript: getModifiedValue(text.subscript, false),
        superscript: getModifiedValue(text.superscript, false),
        tracking: getModifiedValue(text.tracking, -1),
        tsume: getModifiedValue(text.tsume, -1),
        verticalScale: getModifiedValue(text.verticalScale, -1),
    };
}

function _createTextDocument(textDoc: TextDocument, aexTextDocument: AexTextDocument, state: AexState): TextDocument {
    textDoc.resetCharStyle();

    /**
     * These properties are read & serialized, but can't be deserialized:
     *
     * textDoc.allCaps = aexTextDocument.allCaps;
     * textDoc.boxTextPos = aexTextDocument.boxTextPos;
     * textDoc.fauxBold = aexTextDocument.fauxBold;
     * textDoc.fauxItalic = aexTextDocument.fauxItalic;
     * textDoc.fontFamily = aexTextDocument.fontFamily;
     * textDoc.fontStyle = aexTextDocument.fontStyle;
     * textDoc.horizontalScale = aexTextDocument.horizontalScale;
     * textDoc.smallCaps = aexTextDocument.smallCaps;
     * textDoc.subscript = aexTextDocument.subscript;
     * textDoc.superscript = aexTextDocument.superscript;
     * textDoc.tsume = aexTextDocument.tsume;
     * textDoc.verticalScale = aexTextDocument.verticalScale;
     * textDoc.baselineLocs = aexTextDocument.baselineLocs;
     * textDoc.baselineShift = aexTextDocument.baselineShift;
     */
    assignAttributes(textDoc, {
        font: aexTextDocument.font,
        fontSize: aexTextDocument.fontSize,
        justification: aexTextDocument.justification,
        leading: aexTextDocument.leading,
        text: aexTextDocument.text,
        tracking: aexTextDocument.tracking,
    });

    /** If not pointText, then we're using boxText */
    if (!aexTextDocument.pointText) {
        assignAttributes(textDoc, {
            boxTextSize: aexTextDocument.boxTextSize,
        });
    }

    if (!aeq.isNullOrUndefined(aexTextDocument.applyFill)) {
        assignAttributes(textDoc, {
            applyFill: aexTextDocument.applyFill,
            fillColor: aexTextDocument.fillColor,
        });
    }

    if (!aeq.isNullOrUndefined(aexTextDocument.applyStroke)) {
        assignAttributes(textDoc, {
            applyStroke: aexTextDocument.applyStroke,
            strokeColor: aexTextDocument.strokeColor,
            strokeOverFill: aexTextDocument.strokeOverFill,
            strokeWidth: aexTextDocument.strokeWidth,
        });
    }

    return textDoc;
}
