function aex() {
    return {
        prescan,
        get,
        create,
        update,
    };
}

function isGetResult(aexObject: AexSerialized | AexProperty | GetResult<AexSerialized>) {
    return aexObject.type == 'aex:getresult';
}
