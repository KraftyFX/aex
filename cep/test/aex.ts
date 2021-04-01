import { getEvalScriptResult } from './csinterface';

export enum AeObject {
    ActiveComp = 'app.project.activeItem',
    Project = 'app.project',
}

export function aex() {
    return {
        async benchmark(): Promise<any> {
            return await getEvalScriptResult(`aex().benchmark()`, { ignoreReturn: false });
        },

        async fromAe(item: any): Promise<any> {
            if (typeof item === 'string') {
                return await getEvalScriptResult(`aex().fromAe("${item.toString()}")`);
            } else {
                return await getEvalScriptResult(`aex().fromAe(${item || 'undefined'})`);
            }
        },
        async fromAeObject(aeObject: AeObject): Promise<any> {
            switch (aeObject) {
                case AeObject.ActiveComp:
                case AeObject.Project:
                    return await getEvalScriptResult(`aex().fromAe(${aeObject})`);
                default:
                    throw new Error(`Unrecognized AE Object - ${aeObject}`);
            }
        },
    };
}
