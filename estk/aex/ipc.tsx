declare var __aex_ipc_invoke: any;
declare var __aex_ipc_eo: any;
declare var ExternalObject: any;
declare var CSXSEvent: any;

(aex as any)._eo = new ExternalObject('lib:PlugPlugExternalObject');
(aex as any)._ipc_invoke = function (id, func, options) {
    let funcStart = new Date().valueOf();

    var eventObj = new CSXSEvent();
    eventObj.type = 'aex_result';

    let funcEnd: number;
    let data: any = null;

    try {
        const result = func();
        funcEnd = new Date().valueOf();

        if (options.ignoreReturn) {
            data = {
                id,
                success: true,
            };
        } else {
            data = {
                id,
                success: true,
                result,
            };
        }
    } catch (e) {
        funcEnd = new Date().valueOf();

        data = {
            id,
            success: false,
            name: e.name,
            message: e.message,
            fileName: e.fileName,
            line: e.line,
        };
    }

    data.ipcStats = {
        funcStart,
        funcEnd,
        jsonStart: new Date().valueOf(),
        jsonEnd: 'aex:jsonend',
    };

    let result = JSON.stringify(data);
    const jsonEnd = new Date().valueOf();

    result = result.replace('aex:jsonend', jsonEnd.toString());

    eventObj.data = result;

    eventObj.dispatch();
};
