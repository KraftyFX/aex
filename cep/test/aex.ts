import { AexObject, AexOptions, AexPrescanResult, AexResult } from './constants';
import { getEvalScriptResult } from './csinterface';

export const AeObject = {
    ActiveComp: 'app.project.activeItem',
    Project: 'app.project',
    Layer: (num: number) => `app.project.activeItem.layer(${num})`
}

export function aex() {
    return {
        async createTestComp(): Promise<AexResult> {
            return await getEvalScriptResult<AexResult>(`aeq.comp.create().openInViewer()`, undefined, {
                ignoreReturn: false,
            });
        },

        async benchmark(options: { callback: (result: boolean) => void }): Promise<any> {
            return await getEvalScriptResult(`aex.benchmark(aex_args)`, options, { ignoreReturn: false });
        },

        async prescan(aeObject: string, options?: AexOptions): Promise<AexPrescanResult> {
            return await getEvalScriptResult<AexPrescanResult>(`aex.prescan(${aeObject}, aex_args)`, options || {}, {
                ignoreReturn: false,
            });
        },

        async get(aeObject: string, options?: AexOptions): Promise<AexResult> {
            const isLayer = aeObject.match(/app.project.activeItem.layer\(\d+\)/gi);

            if (isLayer || aeObject == AeObject.ActiveComp || aeObject == AeObject.Project) {
                return await getEvalScriptResult<AexResult>(`aex.get(${aeObject}, aex_args)`, options || {}, { ignoreReturn: false });
            } else {
                throw new Error(`Unrecognized AE Object - ${aeObject}`);
            }
        },

        async create(aeObject: string, aexObject: AexObject, options?: AexOptions): Promise<AexResult> {
            return await getEvalScriptResult<AexResult>(`aex.create(${aeObject}, ${JSON.stringify(aexObject)}, aex_args)`, options || {}, {
                ignoreReturn: false,
            });
        },

        async update(aeObject: string, aexObject: AexObject, options?: AexOptions): Promise<AexResult> {
            return await getEvalScriptResult<AexResult>(`aex.update(${aeObject}, ${JSON.stringify(aexObject)}, aex_args)`, options || {}, {
                ignoreReturn: false,
            });
        },
    };
}
