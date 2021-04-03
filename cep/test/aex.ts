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

        async fromAe(item: any): Promise<any> {
            if (typeof item === 'string') {
                return await getEvalScriptResult(`aex().fromAe("${item.toString()}")`, null, { ignoreReturn: false });
            } else {
                return await getEvalScriptResult(`aex().fromAe(${item || 'undefined'})`, null, { ignoreReturn: false });
            }
        },

        async fromAeObject(aeObject: AeObject): Promise<any> {
            switch (aeObject) {
                case AeObject.ActiveComp:
                case AeObject.Project:
                    return await getEvalScriptResult(`aex().fromAe(${aeObject})`, null, { ignoreReturn: false });
                default:
                    throw new Error(`Unrecognized AE Object - ${aeObject}`);
            }
        },
    };
}
