import { AexOptions, AexResult } from './constants';
import { getEvalScriptResult } from './csinterface';

export enum AeObject {
    ActiveComp = 'app.project.activeItem',
    Project = 'app.project',
}

export function aex() {
    return {
        async benchmark(options: { callback: (result: boolean) => void }): Promise<any> {
            return await getEvalScriptResult(`aex().benchmark(aex_args)`, options, { ignoreReturn: false });
        },

        async fromAe(item: any, options?: AexOptions): Promise<AexResult> {
            return await getEvalScriptResult<AexResult>(`aex().fromAe(${item || 'undefined'})`, options || {}, { ignoreReturn: false });
        },

        async fromAeObject(aeObject: AeObject, options?: AexOptions): Promise<AexResult> {
            switch (aeObject) {
                case AeObject.ActiveComp:
                case AeObject.Project:
                    return await getEvalScriptResult<AexResult>(`aex().fromAe(${aeObject}, aex_args)`, options || {}, { ignoreReturn: false });
                default:
                    throw new Error(`Unrecognized AE Object - ${aeObject}`);
            }
        },
    };
}
