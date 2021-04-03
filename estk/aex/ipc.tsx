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
        jsonEnd: 'aex:jsonEnd',
    };

    let dataAsJson = JSON.stringify(data);

    eventObj.data = dataAsJson.replace('aex:jsonEnd', new Date().valueOf().toString());

    eventObj.dispatch();
};
