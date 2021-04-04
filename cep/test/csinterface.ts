import 'file-loader!../_build/panel/all.jsx';
import * as fs from 'fs';
import * as path from 'path';
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
    const jsxPath = 'all.jsx';
    const fullyQualifiedPath = JSON.stringify(ExtensionPath + '/' + jsxPath).replace(/ /g, ' ');

    await evalScript(`$.evalFile(${fullyQualifiedPath})`);
}

export async function cleanupAex() {
    await getEvalScriptResult('delete aex', null, { ignoreReturn: true });
}

export async function alert(value: string) {
    await getEvalScriptResult(`alert(${JSON.stringify(value)}, "AEX")`, null, { ignoreReturn: true });
}

export async function openProject(projectPath: string) {
    await getEvalScriptResult(`aeq.open(aeq.file.joinPath(aeq.getFile($.fileName).parent.fsName, "${projectPath}"))`, null, { ignoreReturn: true });
}

function evalScript(code: string): Promise<void> {
    return new Promise((resolve, reject) => {
        cs.evalScript(code, (result: any) => {
            if (typeof result === 'string' && result.indexOf('EvalScript') >= 0) {
                reject(new Error(`AEX: Call to CSInterface.evalScript failed`));
            } else {
                resolve();
            }
        });
    });
}

let requestId = 0;
const requests: any = {};

export function getEvalScriptResult(code: string, args: any, options: { ignoreReturn: boolean }): Promise<void> {
    const request: any = {};
    options = options || { ignoreReturn: false };

    request.cepStart = new Date().valueOf();
    request.id = requestId++;
    request.code = code;
    request.args = args;
    request.options = options;
    request.callbacks = {};

    request.promise = new Promise((resolve, reject) => {
        request.resolve = resolve;
        request.reject = reject;

        const estkArgs = convertCallbackArgs(request);

        const optionsJson = JSON.stringify({
            ignoreReturn: options.ignoreReturn,
            args: estkArgs,
        });

        const wrappedCode = `aex._ipc_invoke(${request.id}, function(aex_args) { return (${code}); }, ${JSON.stringify(optionsJson)})`;

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

cs.addEventListener('aex_result', function (event: any) {
    const now = new Date().valueOf();
    const data = event.data;
    const request = requests[data.id];

    const ipcStats = data.ipcStats;

    ipcStats.jsonEnd = parseInt(ipcStats.jsonEnd);

    ipcStats.entry = ipcStats.funcStart - request.cepStart;
    ipcStats.func = ipcStats.funcEnd - ipcStats.funcStart;
    ipcStats.json = ipcStats.jsonEnd - ipcStats.jsonStart;
    ipcStats.exit = now - ipcStats.jsonEnd;
    ipcStats.total = now - request.cepStart;

    delete ipcStats.funcStart;
    delete ipcStats.funcEnd;
    delete ipcStats.jsonStart;
    delete ipcStats.jsonEnd;

    console.info(request.code);
    console.info(ipcStats);

    delete requests[data.id];

    if (data.success) {
        if (request.options.ignoreReturn) {
            request.resolve();
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

function convertCallbackArgs(request: any) {
    const args = request.args || {};

    return Object.keys(args).reduce((o, m) => {
        if (typeof args[m] === 'function') {
            o[m] = 'aex:callback';
            request.callbacks[m] = args[m];
        } else {
            o[m] = args[m];
        }
        return o;
    }, {} as any);
}

function getTextNearLine(path: string, line: number, window: number) {
    const userDir = navigator.platform === 'Win32' ? 'C:/Users/Zack' : '/Users/rafikhan';

    try {
        const fileContents: string = fs.readFileSync(path.replace(`~`, userDir).replace('%20', ' ')).toString();
        const lines: string[] = fileContents.split('\n').map((v: string) => '> ' + v);

        lines[line - 1] = lines[line - 1].replace('> ', '* ');

        const start = Math.max(line - window, 0);
        const end = Math.min(line + window, lines.length);

        return lines.slice(start, end).join('\n');
    } catch (e) {
        return `* Unable to get source code snippet for file "${path}" at line ${line}`;
    }
}
