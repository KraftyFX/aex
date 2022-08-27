import 'file-loader!../_build/panel/aexcep-lite.jsx';
import * as fs from 'fs';
import * as path from 'path'
import * as os from 'os'
import 'source-map-support/register';
const { CSInterface, SystemPath } = require('exports-loader?CSInterface,CSEvent,SystemPath!../lib/CSInterface.js');

export const cs = new CSInterface();
export const extensionId = cs.getExtensionID();
export const ExtensionPath = cs.getSystemPath(SystemPath.EXTENSION);
export const UserDataPath = cs.getSystemPath(SystemPath.USER_DATA);

export function pause(timeout: number) {
    return new Promise((resolve, reject) => {
        setTimeout(resolve, timeout);
    });
}

export async function evalAexIntoEstk() {
    await evalScript(`if (typeof aeq === 'undefined') { $.evalFile(${getFilePath('aequery.jsx')}) }`);
    await evalScript(`if (typeof JSON === 'undefined') { $.evalFile(${getFilePath('json2.jsx')}) }`);
    await evalScript(`$.evalFile(${getFilePath('aexcep-lite.jsx')})`);
}

function getFilePath(fileName: string) {
    return JSON.stringify(ExtensionPath + '/' + fileName).replace(/ /g, ' ');
}

export async function cleanupAex() {
    await getEvalScriptResult('delete aex', null, { ignoreReturn: true });
    // await getEvalScriptResult('$.gc()', null, { ignoreReturn: true });
}

export async function alert(value: string) {
    await getEvalScriptResult(`alert(${JSON.stringify(value)}, "AEX")`, null, { ignoreReturn: true });
}

export async function openProject(projectPath: string) {
    await getEvalScriptResult(
        `app.project.close(CloseOptions.DO_NOT_SAVE_CHANGES) && aeq.open(aeq.file.joinPath(aeq.getFile($.fileName).parent.fsName, "${projectPath}"))`,
        null,
        { ignoreReturn: true }
    );
}

export async function openCleanProject() {
    await getEvalScriptResult(`app.project.close(CloseOptions.DO_NOT_SAVE_CHANGES)`, null, { ignoreReturn: true });
}

function evalScript(code: string): Promise<void> {
    return new Promise((resolve, reject) => {
        cs.evalScript(code, (result: any) => {
            if (typeof result === 'string' && result.indexOf('EvalScript') >= 0) {
                reject(getEvalScriptError(`AEX: Call to CSInterface.evalScript failed`));
            } else {
                resolve();
            }
        });
    });

    function getEvalScriptError(message: string) {
        const err = new Error(message);
        err.message = err.message + '\n\nCode:\n' + code + '\n\nStack:';
        return err;
    }
}

interface IPCRequest {
    promise: Promise<any>;
    resolve: (value: any) => void;
    reject: (reason?: any) => void;
    id: number;
    code: string;
    args: any;
    callbacks: any;
    options: {
        ignoreReturn: boolean;
    };

    cepStart: number;
}

let requestId = 0;
const requests: { [key: string]: IPCRequest } = {};

export function getEvalScriptResult<T = void>(code: string, args: any, options: { ignoreReturn: boolean }): Promise<T> {
    const request = {} as IPCRequest;

    options = options || { ignoreReturn: false };

    request.cepStart = new Date().valueOf();
    request.id = requestId++;

    request.promise = new Promise<T>((resolve, reject) => {
        request.resolve = resolve;
        request.reject = reject;

        request.code = code;
        request.args = args;
        request.options = options;

        const ipcOptionsAsJson = JSON.stringify({
            ignoreReturn: options.ignoreReturn,
            aex_args: convertCallbacks(request),
        });

        const wrappedCode = `aex._ipc_invoke(${request.id}, function(aex_args) { return (${code}); }, ${JSON.stringify(ipcOptionsAsJson)})`;

        cs.evalScript(wrappedCode, (result: any) => {
            if (typeof result === 'string' && result.indexOf('EvalScript') >= 0) {
                reject(new Error(`AEX: Call to CSInterface.evalScript failed`));
            }
        });
    });

    requests[request.id] = request;

    return request.promise;
}

cs.addEventListener('aex_callback', function (event: any) {
    const { id, callbackId, args } = event.data;

    requests[id].callbacks[callbackId](args);
});

export interface IPCStats {
    func: number;
    json: number;
    total: number;
}

type CB = (stats: IPCStats) => void;
let onResult: CB | undefined = () => {};

function setOnResult(value?: CB) {
    onResult = value;
}

export { setOnResult };

cs.addEventListener('aex_result', function (event: any) {
    const now = new Date().valueOf();
    const data = event.data;
    const request = requests[data.id];

    const ipcStats = data.ipcStats;

    ipcStats.jsonEnd = parseInt(ipcStats.jsonEnd);

    ipcStats.entry = ipcStats.funcStart - request.cepStart;
    ipcStats.func = ipcStats.funcEnd - ipcStats.funcStart;
    ipcStats.json = ipcStats.jsonEnd - ipcStats.funcEnd;
    ipcStats.exit = now - ipcStats.jsonEnd;
    ipcStats.total = now - request.cepStart;

    if (onResult) {
        onResult(ipcStats);
    }

    delete ipcStats.funcStart;
    delete ipcStats.funcEnd;
    delete ipcStats.jsonEnd;

    delete requests[data.id];

    if (data.success) {
        if (request.options.ignoreReturn) {
            request.resolve(void 0);
        } else {
            request.resolve(data.result);
        }
    } else {
        const estkError = event.data;

        const { name, message, fileName, line } = estkError;
        const err: any = new Error(message);

        err.isEstkError = true;
        err.name = `(ESTK) ` + name;
        err.line = line;
        err.fileName = fileName;
        err.stack = `\n\n> -------- ${path.basename(fileName)}:${line} --------\n${getTextNearLine(
            fileName,
            line,
            5
        )}\n> --------------------------------`;

        request.reject(err);
    }
});

/**
 * Looks at the arguments being sent to ESTK and converts the callbacks to magic
 * strings that can be used to reference and eventually raise them from ESTK.
 * This function is lazy and only goes one layer deep.
 *
 * @param request IPC Request
 * @returns Serializable arugments that can be sent to ESTK
 */
function convertCallbacks(request: IPCRequest) {
    const args = request.args || {};
    request.callbacks = {};

    return Object.keys(args).reduce((o, m) => {
        if (typeof o[m] === 'function') {
            request.callbacks[m] = o[m];
            o[m] = 'aex:callback';
        }
        return o;
    }, args);
}

function getTextNearLine(estkPath: string, line: number, window: number) {
    try {
        const fileContents: string = fs.readFileSync(cleanPathForNodeJS()).toString();
        const lines: string[] = fileContents.split('\n').map((v: string) => '> ' + v);

        lines[line - 1] = lines[line - 1].replace('> ', '* ');

        const start = Math.max(line - window, 0);
        const end = Math.min(line + window, lines.length);

        return lines.slice(start, end).join('\n');
    } catch (e) {
        return `* Unable to get source code snippet for file "${estkPath}" at line ${line}`;
    }

    function cleanPathForNodeJS(): number | fs.PathLike {
        return estkPath.replace(`~`, os.homedir()).replace(/%20/g, ' ');
    }
}
