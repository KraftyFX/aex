import 'file-loader!../_build/panel/all.jsx';
const { CSInterface, SystemPath } = require('exports-loader?CSInterface,CSEvent,SystemPath!../lib/CSInterface.js');

export const cs = new CSInterface();
export const extensionId = cs.getExtensionID();
export const ExtensionPath = cs.getSystemPath(SystemPath.EXTENSION);

export function pause(timeout: number) {
    return new Promise((resolve, reject) => {
        setTimeout(resolve, timeout);
    });
}

export async function injectFile(jsxPath: string) {
    const fullyQualifiedPath = JSON.stringify(ExtensionPath + '/' + jsxPath).replace(/ /g, ' ');

    await cs.evalScript(`$.evalFile(${fullyQualifiedPath})`);
}

let requestId = 0;
const requests: any = {};

cs.addEventListener('aeq_result', function (event: any) {
    const request = requests[event.data.id];

    delete requests[event.data.id];

    if (event.data.success) {
        request.resolve(event.data.result);
    } else {
        const err: any = new Error(event.data.message);
        err.isEstkError = true;
        err.name = `(ESTK) ` + event.data.name;

        request.reject(err);
    }
});

export function evalScript(code: string): Promise<void> {
    const request: any = {};

    request.id = requestId++;
    request.promise = new Promise((resolve, reject) => {
        request.resolve = resolve;
        request.reject = reject;

        const wrappedCode = `__aeq_ipc_invoke(${request.id}, function() { return (${code}); })()`;
        cs.evalScript(wrappedCode);
    });

    requests[request.id] = request;

    return request.promise;
}

export async function evalAexIntoESTK() {
    await injectFile('all.jsx');
}

export async function cleanupAex() {
    await evalScript('delete aex');
}

export async function cleanupAeqIpc() {
    await evalScript('delete __aeq_ipc_eo');
    await evalScript('delete __aeq_ipc_invoke');
}

export async function alert(value: string) {
    await evalScript(`alert(${JSON.stringify(value)}, "AEX")`);
}
