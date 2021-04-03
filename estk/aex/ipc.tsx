declare var ExternalObject: any;
declare var CSXSEvent: any;

(aex as any)._eo = new ExternalObject('lib:PlugPlugExternalObject');

(aex as any)._ipc_invoke = function (id, func, optionsJson) {
    const options = JSON.parse(optionsJson);
    const eventObj = new CSXSEvent();
    eventObj.type = 'aex_result';

    let funcStart: number, funcEnd: number;
    let ipcResponse: any = null;

    try {
        convertCallbacks(id, options);

        funcStart = new Date().valueOf();
        const result = func(options.args);
        funcEnd = new Date().valueOf();

        if (options.ignoreReturn) {
            ipcResponse = {
                id,
                success: true,
            };
        } else {
            ipcResponse = {
                id,
                success: true,
                result,
            };
        }
    } catch (e) {
        funcEnd = new Date().valueOf();

        ipcResponse = {
            id,
            success: false,
            name: e.name,
            message: e.message,
            fileName: e.fileName,
            line: e.line,
        };
    }

    ipcResponse.ipcStats = {
        funcStart,
        funcEnd,
        jsonStart: new Date().valueOf(),
        jsonEnd: 'aex:jsonEnd',
    };

    const dataAsJson = JSON.stringify(ipcResponse);

    eventObj.data = dataAsJson.replace('aex:jsonEnd', new Date().valueOf().toString());

    eventObj.dispatch();
};

(aex as any)._ipc_callback = function (id: string, callbackId: string, args) {
    const eventObj = new CSXSEvent();
    eventObj.type = 'aex_callback';

    eventObj.data = JSON.stringify({
        id,
        callbackId,
        args,
    });

    eventObj.dispatch();
};

function convertCallbacks(id: number, options: any) {
    const args = options.args;

    for (var m in args) {
        if (args.hasOwnProperty(m)) {
            if (args[m] === 'aex:callback') {
                args[m] = (args) => (aex as any)._ipc_callback(id, m, args);
            }
        }
    }
}
