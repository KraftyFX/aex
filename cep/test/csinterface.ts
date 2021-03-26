import 'file-loader!../_build/panel/all.jsx';
import * as path from 'path';
const fs = (window as any).cep_node.require('fs');
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

export function evalScript(code: string): Promise<void> {
    return new Promise((resolve, reject) => {
        cs.evalScript(code, (result: any) => {
            if (typeof result === 'string' && result.indexOf('EvalScript') >= 0) {
                reject(new Error(`(ESTK) EvalScript failed`));
            } else {
                resolve();
            }
        });
    });
}

export async function injectFile(jsxPath: string) {
    const fullyQualifiedPath = JSON.stringify(ExtensionPath + '/' + jsxPath).replace(/ /g, ' ');

    await evalScript(`$.evalFile(${fullyQualifiedPath})`);
}

export async function openProject(projectPath: string) {
    await getScriptResult(`aeq.open(aeq.file.joinPath(aeq.getFile($.fileName).parent.fsName, "${projectPath}"))`, { ignoreReturn: true });
}

let requestId = 0;
const requests: any = {};

cs.addEventListener('aeq_result', function (event: any) {
    const request = requests[event.data.id];

    delete requests[event.data.id];

    if (event.data.success) {
        if (request.options.ignoreReturn) {
            request.resolve();
        } else {
            request.resolve(event.data.result);
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

function getTextNearLine(path: string, line: number, window: number) {
    const userDir = navigator.platform === 'Win32' ? 'C:/Users/Zack' : '/Users/rafikhan';
    const fileContents: string = fs.readFileSync(path.replace(`~`, userDir).replace('%20', ' ')).toString();
    const lines: string[] = fileContents.split('\n').map((v: string, i: number) => '> ' + v);

    lines[line - 1] = lines[line - 1].replace('> ', '* ');

    const start = Math.max(line - window, 0);
    const end = Math.min(line + window, lines.length);

    return lines.slice(start, end).join('\n');
}

export function getScriptResult(code: string, options?: { ignoreReturn: boolean }): Promise<void> {
    const request: any = {};
    options = options || { ignoreReturn: false };

    request.id = requestId++;
    request.options = options;
    request.promise = new Promise((resolve, reject) => {
        request.resolve = resolve;
        request.reject = reject;

        const wrappedCode = `__aeq_ipc_invoke(${
            request.id
        }, function() { return (${code}); }, { ignoreReturn: ${options!.ignoreReturn.toString()} })()`;
        cs.evalScript(wrappedCode);
    });

    requests[request.id] = request;

    return request.promise;
}

export async function evalAexIntoESTK() {
    await injectFile('all.jsx');
}

export async function cleanupAex() {
    await getScriptResult('delete aex');
}

export async function cleanupAeqIpc() {
    await getScriptResult('delete __aeq_ipc_eo');
    await getScriptResult('delete __aeq_ipc_invoke');
}

export async function alert(value: string) {
    await getScriptResult(`alert(${JSON.stringify(value)}, "AEX")`);
}
