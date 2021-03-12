import { evalScript } from './csinterface';

export enum AeObject {
    ActiveComp = 'app.project.activeItem',
    Project = 'app.project',
}

export function aex() {
    return {
        async openProject(projectPath: string) {
            return await evalScript(`aeq.open(aeq.file.joinPath(aeq.getFile($.fileName).parent.fsName, "${projectPath}"))`);
        },
        async toObject(item: any) {
            if (typeof item === 'string') {
                return await evalScript(`aex().toObject("${item.toString()}")`);
            } else {
                return await evalScript(`aex().toObject(${item || 'undefined'})`);
            }
        },
        async toObjectWithAeObject(aeobject: AeObject) {
            switch (aeobject) {
                case AeObject.ActiveComp:
                case AeObject.Project:
                    return await evalScript(`aex().toObject(${aeobject})`);
                default:
                    throw new Error(`Unrecognized AE Object - ${aeobject}`);
            }
        },
    };
}
