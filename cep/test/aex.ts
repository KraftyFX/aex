import { getScriptResult } from './csinterface';

export enum AeObject {
    ActiveComp = 'app.project.activeItem',
    Project = 'app.project',
}

export function aex() {
    return {
        async toObject(item: any): Promise<any> {
            return await getScriptResult(`aex().toObject(${item || 'undefined'})`);
        },
        async toObjectWithAeObject(aeobject: AeObject): Promise<any> {
            switch (aeobject) {
                case AeObject.ActiveComp:
                case AeObject.Project:
                    return await getScriptResult(`aex().toObject(${aeobject})`);
                default:
                    throw new Error(`Unrecognized AE Object - ${aeobject}`);
            }
        },
    };
}
