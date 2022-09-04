if (typeof aeq === 'undefined' || aeq === null) {
    alert(`A required dependency, aequery, was not found.  Go to http://github.com/kraftyfx/aex for details on how to fix this.`);
    throw fail(`AexMissingDependency: aequery`);
}

if (typeof JSON === 'undefined' || JSON === null) {
    alert(`A required dependency, JSON, was not found.  Go to http://github.com/kraftyfx/aex for details on how to fix this.`);
    throw fail(`AexMissingDependency: JSON`);
}

_export_ = {
    prescan,
    get,
    create,
    update,
};
