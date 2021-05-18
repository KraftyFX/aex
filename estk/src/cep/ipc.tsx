declare var aex: any;
declare var ExternalObject: any;
declare var CSXSEvent: any;

aex._eo = new ExternalObject('lib:PlugPlugExternalObject');
aex._ipc_invoke = function (id: number, func: (aex_args: any) => void, ipcOptionsAsJson: string) {
    let funcStart: number;
    let ipcResponse: any = null;

    try {
        const ipcOptions = JSON.parse(ipcOptionsAsJson);

        convertCallbacks(id, ipcOptions);

        funcStart = new Date().valueOf();
        const result = func(ipcOptions.aex_args);

        if (ipcOptions.ignoreReturn) {
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
        ipcResponse = {
            id,
            success: false,
            name: e.name,
            message: e.message,
            fileName: e.fileName,
            line: e.line,
        };
    } finally {
        ipcResponse.ipcStats = {
            funcStart,
            funcEnd: new Date().valueOf(),
            jsonEnd: 'aex:jsonEnd',
        };

        const eventObj = new CSXSEvent();

        eventObj.type = 'aex_result';
        eventObj.data = JSON.stringify(ipcResponse).replace('aex:jsonEnd', new Date().valueOf().toString());

        eventObj.dispatch();
    }
    function convertCallbacks(id: number, options: any) {
        const args = options.aex_args;

        for (var member in args) {
            if (args.hasOwnProperty(member)) {
                if (args[member] === 'aex:callback') {
                    args[member] = (callbackArgs) => raiseCepCallback(id, member, callbackArgs);
                }
            }
        }
    }

    function raiseCepCallback(id: number, callbackId: string, args: any) {
        const eventObj = new CSXSEvent();
        eventObj.type = 'aex_callback';

        eventObj.data = JSON.stringify({
            id,
            callbackId,
            args,
        });

        eventObj.dispatch();
    }
};
