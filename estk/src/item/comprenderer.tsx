function setAeCompRenderer(aeComp: CompItem, aexComp: AexComp, state: AexState) {
    if (aeq.isNullOrUndefined(aexComp.renderer)) {
        return;
    }

    setCompRenderer(aeComp, aexComp.renderer);
}

function setCompRenderer(aeComp: CompItem, renderer: string) {
    const renderers = aeq.arrayEx(aeComp.renderers);

    assertIsTrue(renderers.indexOf(renderer) > -1, `Can't set comp renderer to ${renderer}`);

    aeComp.renderer = renderer;
}

function getRequiredCompRendererFromProperties(aexPropertyGroup: AexPropertyGroup): string {
    const aeqProps: AEQArrayEx<AexPropertyBase> = aeq.arrayEx(aexPropertyGroup.properties);

    const ernstProps = aeq.arrayEx([
        // AVLayer Material Options
        'ADBE Glossiness Coefficient',
        'ADBE Reflection Coefficient',
        'ADBE Fresnel Coefficient',
        'ADBE Appears in Reflections',
    ]);

    const useErnst = aeqProps.some((aexProp) => {
        return ernstProps.indexOf(aexProp.matchName) > -1;
    });

    if (useErnst) {
        return 'ADBE Ernst';
    }

    const adv3dProps = aeq.arrayEx(['ADBE Light Transmission']);

    const useAdvanced3d = aeqProps.some((aexProp) => {
        return adv3dProps.indexOf(aexProp.matchName) > -1;
    });

    if (useAdvanced3d) {
        return 'ADBE Advanced 3d';
    }

    return undefined;
}
