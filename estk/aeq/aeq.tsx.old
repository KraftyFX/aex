declare var __aeq_ipc_invoke: any;
declare var __aeq_ipc_eo: any;
declare var ExternalObject: any;
declare var CSXSEvent: any;

__aeq_ipc_eo = new ExternalObject('lib:PlugPlugExternalObject');
__aeq_ipc_invoke = function (id: number, func: () => any) {
    var eventObj = new CSXSEvent();
    eventObj.type = 'aeq_result';

    try {
        const result = func();

        eventObj.data = JSON.stringify({
            id,
            success: true,
            result,
        });
    } catch (e) {
        eventObj.data = JSON.stringify({
            id,
            success: false,
            name: e.name,
            message: e.message,
        });
    }

    eventObj.dispatch();
};

function isNullOrUndefined(o: any) {
    // Using truthiness to capture both 'undefined' and 'null'
    return o == null;
}

/**
 * Returns `true` if argument is a boolean (`true` or `false`),
 * `false` otherwise
 * @function
 * @memberof aeq
 * @param  {Any} o The value to check
 * @return {Boolean}
 */
function isBoolean(o: any) {
    return typeof o === 'boolean';
}

/**
 * Returns `true` if argument is a number, `false` otherwise
 * @function
 * @memberof aeq
 * @param  {Any} o The value to check
 * @return {Boolean}
 */
function isNumber(o: any) {
    return typeof o === 'number';
}

/**
 * Returns `true` if argument is a string, `false` otherwise
 * @function
 * @memberof aeq
 * @param  {Any} o The value to check
 * @return {Boolean}
 */
function isString(o: any) {
    return typeof o === 'string';
}

/**
 * Returns `true` if argument is an object, `false` otherwise. This will most
 * likely return `true` most of the time, as most things are objects. Try to
 * use a different function to check the type, if applicable.
 * @function
 * @memberof aeq
 * @param  {Any} o The value to check
 * @return {Boolean}
 */
function isObject(o: any) {
    return o instanceof Object;
}

/**
 * Returns `true` if argument is a plain object, i.e an object created
 * using `{}` or `new Object()`, `false` otherwise
 * @function
 * @memberof aeq
 * @param  {Any} o The value to check
 * @return {Boolean}
 */
function isPlainObject(obj: any) {
    // Not plain objects:
    // - Any object or value whose internal [[Class]] property is not "[object Object]"
    // - After Effects objects
    if (obj === undefined || obj === null) {
        return false;
    }
    if (obj.toString() !== '[object Object]') {
        return false;
    }

    if (obj.constructor && !obj.constructor.prototype.hasOwnProperty('isPrototypeOf')) {
        return false;
    }

    // If the function hasn't returned already, we're confident that
    // |obj| is a plain object, created by {} or constructed with new Object
    return true;
}

/**
 * Returns `true` if argument is an array, `false` otherwise
 * @function
 * @memberof aeq
 * @param  {Any} o The value to check
 * @return {Boolean}
 */
function isArray(o: any) {
    return o instanceof Array;
}

/**
 * Returns `true` if the passed array is empty, `false` otherwise
 * @function
 * @memberof aeq
 * @param  {Array} o The array to check
 * @return {Boolean}
 */
function isEmpty(o: any) {
    return o.length === undefined || o.length === 0;
}

/**
 * Returns `true` if argument is a function, `false` otherwise
 * @function
 * @memberof aeq
 * @param  {Any} o The value to check
 * @return {Boolean}
 */
function isFunc(o: any) {
    return o instanceof Function;
}

/**
 * ???
 * @function
 * @memberof aeq
 * @param  {Any} o The value to check
 * @return {Boolean}
 */
function isAeq(o: any) {
    return o instanceof Object && o.isAeq === true;
}

/**
 * Returns `true` if argument is the Application object, `false` otherwise
 * @function
 * @memberof aeq
 * @param  {Any} o The value to check
 * @return {Boolean}
 */
function isApp(o: any) {
    return o instanceof Application;
}

/**
 * Returns `true` if argument is a Folder object, `false` otherwise
 * @function
 * @memberof aeq
 * @param  {Any} o The value to check
 * @return {Boolean}
 */
function isFolder(o: any) {
    return o instanceof Folder;
}

/**
 * Returns `true` if argument is a File object, `false` otherwise
 * @function
 * @memberof aeq
 * @param  {Any} o The value to check
 * @return {Boolean}
 */
function isFile(o: any) {
    return o instanceof File;
}

/**
 * Returns `true` if argument is a FolderItem, `false` otherwise
 * @function
 * @memberof aeq
 * @param  {Any} o The value to check
 * @return {Boolean}
 */
function isFolderItem(o: any) {
    return o instanceof FolderItem;
}

/**
 * Returns `true` if argument is a FootageItem, `false` otherwise
 * @function
 * @memberof aeq
 * @param  {Any} o The value to check
 * @return {Boolean}
 */
function isFootageItem(o: any) {
    return o instanceof FootageItem;
}

/**
 * Returns `true` if argument is a Compitem, `false` otherwise
 * @function
 * @memberof aeq
 * @param  {Any} o The value to check
 * @return {Boolean}
 */
function isComp(o: any) {
    return o instanceof CompItem;
}

/**
 * Returns `true` if argument is an AVLayer, `false` otherwise
 * @function
 * @memberof aeq
 * @param  {Any} o The value to check
 * @return {Boolean}
 */
function isAVLayer(o: any) {
    return o instanceof AVLayer;
}

/**
 * Returns `true` if argument is a ShapeLayer, `false` otherwise
 * @function
 * @memberof aeq
 * @param  {Any} o The value to check
 * @return {Boolean}
 */
function isShapeLayer(o: any) {
    return o instanceof ShapeLayer;
}

/**
 * Returns `true` if argument is a TextLayer, `false` otherwise
 * @function
 * @memberof aeq
 * @param  {Any} o The value to check
 * @return {Boolean}
 */
function isTextLayer(o: any) {
    return o instanceof TextLayer;
}

/**
 * Returns `true` if argument is a CameraLayer, `false` otherwise
 * @function
 * @memberof aeq
 * @param  {Any} o The value to check
 * @return {Boolean}
 */
function isCameraLayer(o: any) {
    return o instanceof CameraLayer;
}

/**
 * Returns `true` if argument is a LightLayer, `false` otherwise
 * @function
 * @memberof aeq
 * @param  {Any} o The value to check
 * @return {Boolean}
 */
function isLightLayer(o: any) {
    return o instanceof LightLayer;
}

/**
 * Returns `true` if a layer is a precomp, `false` otherwise
 * @function
 * @memberof aeq
 * @param  {Layer} o The layer to check
 * @return {Boolean}
 */
function isPrecomp(o: any) {
    if (!isLayer(o)) return false;
    return isComp(o.source);
}

/**
 * Returns `true` if argument is any kind of layer, `false` otherwise
 * @function
 * @memberof aeq
 * @param  {Any} o The value to check
 * @return {Boolean}
 */
function isLayer(o: any) {
    return isAVLayer(o) || isShapeLayer(o) || isTextLayer(o) || isCameraLayer(o) || isLightLayer(o);
}

/**
 * Returns `true` if argument is a Property, `false` otherwise
 * @function
 * @memberof aeq
 * @param  {Any} o The value to check
 * @return {Boolean}
 */
function isProperty(o: any) {
    return o instanceof Property;
}

/**
 * Returns `true` if argument is a PropertyGroup, `false` otherwise
 * @function
 * @memberof aeq
 * @param  {Any} o The value to check
 * @return {Boolean}
 */
function isPropertyGroup(o: any) {
    return o instanceof PropertyGroup;
}

/**
 * Returns `true` if argument is a MaskPropertyGroup, `false` otherwise
 * @function
 * @memberof aeq
 * @param  {Any} o The value to check
 * @return {Boolean}
 */
function isMaskPropertyGroup(o: any) {
    return o instanceof MaskPropertyGroup;
}

/**
 * Returns `true` if argument is a Panel object, `false` otherwise
 * @function
 * @memberof aeq
 * @param  {Any} o The value to check
 * @return {Boolean}
 */
function isPanel(o: any) {
    return o instanceof Panel;
}

/**
 * Returns `true` if argument is a Window object, `false` otherwise
 * @function
 * @memberof aeq
 * @param  {Any} o The value to check
 * @return {Boolean}
 */
function isWindow(o: any) {
    return o instanceof Window;
}
