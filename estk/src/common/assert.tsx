function assertIsDefined(o: any, name?: string) {
    if (aeq.isNullOrUndefined(o)) {
        throw fail(`${name || 'parameter'} is null or undefined`);
    }
}

function fail(message: string) {
    return new Error(message);
}

function notSupported(message: string) {
    return new Error(message);
}

function notImplemented() {
    return new Error(`TODO: Zack`);
}

function time() {
    return new Date().valueOf();
}

function profile<T = void>(name: string, fn: () => T, state: AexState, meta?: string): T {
    const start = time();
    const ret = fn();
    let elapsed = time() - start;

    (state.profile[name] = state.profile[name] || []).push({ elapsed, meta });

    return ret;
}
