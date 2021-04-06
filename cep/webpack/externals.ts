import * as webpack from 'webpack';

export function getHandleNodeImportsConfig(): webpack.Configuration {
    const nodeLibsAvailableInCep: webpack.Node = {
        process: false,
        Buffer: false,

        fs: false,
        module: false,
        os: false,
        net: false,
        assert: false,
        crypto: false,
        http: false,
        https: false,
        stream: false,
        console: false,
        xmlhttprequest: false,
        path: false,
        url: false,
        dns: false,
        server: false,
        socket: false,
        session: false,
        inspector: false,
        child_process: false,
        setImmediate: false,
        setTimeout: false,
        util: false,
        events: false,
        error: false,
    };

    return {
        // We're executing in CEP however a vast majority of node libraries are only
        // available via the cep_node global variable. The only globals are require, process
        // and Buffer. When a library needs a native module we will redirect the require
        // lookup to use cep_node.require().
        // node: nodeLibsAvailableInCep,
        externals(context: any, request: string, callback: (next?: any, code?: string) => void) {
            if (request in nodeLibsAvailableInCep) {
                return callback(null, "cep_node.require('" + request + "')");
            }

            callback();
        },
    };
}
