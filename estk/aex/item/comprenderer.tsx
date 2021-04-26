function setCompRenderer(comp: CompItem, renderer: string) {
    const renderers = aeq.arrayEx(comp.renderers);

    if (renderers.indexOf(renderer) > -1) {
        comp.renderer = renderer;
    } else {
        throw new Error(`Can't set comp renderer to ${renderer}`);
    }
}

function setAeCompRenderer2(aeComp: CompItem, aexComp: AexComp, state: AexState) {
    if (aeq.isNullOrUndefined(aexComp.renderer)) {
        return;
    }

    const renderers = aeq.arrayEx(aeComp.renderers);

    if (renderers.indexOf(aexComp.renderer) > -1) {
        aeComp.renderer = aexComp.renderer;
    } else {
        throw new Error(`Can't set renderer on comp ${aexComp.name} to ${aexComp.renderer}.`);
    }
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
