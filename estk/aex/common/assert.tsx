function assertIsDefined(o: any, name?: string) {
    if (aeq.isNullOrUndefined(o)) {
        throw new Error(`${name || 'parameter'} is null or undefined`);
    }
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
