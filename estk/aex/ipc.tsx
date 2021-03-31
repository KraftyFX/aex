declare var __aex_ipc_invoke: any;
declare var __aex_ipc_eo: any;
declare var ExternalObject: any;
declare var CSXSEvent: any;

(aex as any)._eo = new ExternalObject('lib:PlugPlugExternalObject');
(aex as any)._ipc_invoke = function (id, func, options) {
    var eventObj = new CSXSEvent();
    eventObj.type = 'aeq_result';

    try {
        const result = func();

        if (options.ignoreReturn) {
            eventObj.data = JSON.stringify({
                id,
                success: true,
            });
        } else {
            eventObj.data = JSON.stringify({
                id,
                success: true,
                result,
            });
        }
    } catch (e) {
        eventObj.data = JSON.stringify({
            id,
            success: false,
            name: e.name,
            message: e.message,
            fileName: e.fileName,
            line: e.line,
        });
    }

    eventObj.dispatch();
};
