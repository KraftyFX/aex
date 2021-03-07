import { evalScript } from './csinterface';

export function aex() {
    return {
        async toObject(item: any) {
            if (typeof item === 'string') {
                return await evalScript(`aex().toObject("${item.toString()}")`);
            } else {
                return await evalScript(`aex().toObject(${item || 'undefined'})`);
            }
        },
    };
}
