import { getScriptResult } from './csinterface';

export enum AeObject {
    ActiveComp = 'app.project.activeItem',
    Project = 'app.project',
}

export function aex() {
    return {
        async fromAe(item: any): Promise<any> {
            if (typeof item === 'string') {
                return await getScriptResult(`aex().fromAe("${item.toString()}")`);
            } else {
                return await getScriptResult(`aex().fromAe(${item || 'undefined'})`);
            }
        },
        async fromAeObject(aeObject: AeObject): Promise<any> {
            switch (aeObject) {
                case AeObject.ActiveComp:
                case AeObject.Project:
                    return await getScriptResult(`aex().fromAe(${aeObject})`);
                default:
                    throw new Error(`Unrecognized AE Object - ${aeObject}`);
            }
        },
    };
}
