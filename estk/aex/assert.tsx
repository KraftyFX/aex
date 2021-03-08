function assertIsDefined(o: any, name?: string) {
    if (isNullOrUndefined(o)) {
        throw new Error(`${name || 'parameter'} is null or undefined`);
    }
}
