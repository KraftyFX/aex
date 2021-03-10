declare var aeq: AEQuery;

declare interface AEQuery {
    /** Module for interacting with AE itself */
    app: AEQAppClass;

    /** Module for interacting with the command line / system */
    command: AEQCommandClass;

    /** Module dealing with comp objects. */
    comp: AEQCompClass;

    /** Module dealing with files. */
    file: AEQFileClass;

    /** Module dealing with Layer objects. */
    layer: AEQLayerClass;

    /** Module dealing with the AE Project. */
    project: AEQProjectClass;

    /** Module for dealing with Property objects. */
    property: AEQPropertyClass;

    /** Module for dealing with the render queue */
    renderqueue: AEQRenderQueueClass;

    /** Module for dealing with settings */
    settings: AEQSettingsClass;

    /** Module for dealing with ScriptUI */
    ui: AEQUIClass;

    /** Array with some extensions that mimics modern JavaScript. */
    arrayEx(items?: Array<any>): AEQArrayEx<any>;

    /** Converts a CompItem into an aeq.Comp object */
    Comp(comp: CompItem): AEQComp;

    /** Converts a Key into an aeq.Key object */
    Key(property: Property<PropertyValueType>, index: number): AEQKey;

    /** Converts a Layer into an aeq.Layer object */
    Layer(layer: Layer): AEQLayer;

    /** Converts a Property into an aeq.Property object */
    Property(property: Property<PropertyValueType>): AEQProperty<PropertyValueType>;

    /** Checks if value is null. Throws an error if it is not. */
    assertIsNull(o: any, err: string): o is null;

    /** Checks if value is null. Throws an error if it is. */
    assertIsNotNull(o: any, err: string): boolean;

    /** Checks if value is `true`. Throws an error if it is not. */
    assertIsTrue(o: any, err: string): o is true;

    /** Checks if value is `false`. Throws an error if it is not. */
    assertIsFalse(o: any, err: string): o is false;

    /** Checks if array is empty. Throws an error if it is not. */
    assertIsEmpty(o: Array<any>, err: string): boolean;

    /** Checks if array is not empty. Throws an error if it is. */
    assertIsNotEmpty(o: Array<any>, err: string): boolean;

    /** Gets all the item in a folder or project. */
    getItems(folder?: FolderItem, deep?: boolean): AEQArrayEx<Item>;

    /** Returns an aeq.arrayEx with all items in a folder, and items in subfolders. */
    getItemsDeep(folder: FolderItem, returnArrayEx: boolean): AEQArrayEx<Item>;

    /** Gets the all layers where the given Item object is used as a source. */
    getItemInComps(item: Item): AEQArrayEx<Layer>;

    /** Gets all the CompItems in the project. Or all CompItems in the given folder. */
    getCompositions(folder?: FolderItem, deep?: boolean): AEQArrayEx<CompItem>;

    /** Gets the active CompItem. */
    getActiveComposition(): CompItem | null;

    /** Gets the CompItem with the matching name, or `null` if none is found. */
    getComposition(name: string): CompItem | null;

    /** Gets all layers layers in a comp or an array of comps. */
    getLayers(comp: CompItem | CompItem[]): AEQArrayEx<Layer>;

    /** Gets selected layers from a given comp or from the active comp if no comp is given. */
    getSelectedLayers(comp?: CompItem): AEQArrayEx<Layer>;

    /** Gets selected layers, or all layers if none is selected, from a given comp or from the active comp if no comp is given. */
    getSelectedLayersOrAll(comp?: CompItem): AEQArrayEx<Layer>;

    /** Gets the selected properties on a layer or in a comp. Uses the active comp if no argument is given. */
    getSelectedProperties(obj?: CompItem | Layer): AEQArrayEx<Property<PropertyValueType> | PropertyGroup>;

    /** Gets all Property objects of all Layer objects in an array. */
    getProperties(
        layers: Layer[],
        options?: AEQGetPropertyChildrenOptions
    ): AEQArrayEx<Property<PropertyValueType> | PropertyGroup | MaskPropertyGroup>;

    /** Gets all children of the given layer or propertyGroup. */
    getPropertyChildren(
        parent: Layer | PropertyGroup,
        options?: AEQGetPropertyChildrenOptions
    ): AEQArrayEx<Property<PropertyValueType> | PropertyGroup | MaskPropertyGroup>;

    /** Gets the propertyGroups inside the effects group from all layers given. */
    getEffects(layers: Layer | Array<Layer>): AEQArrayEx<PropertyGroup>;

    /** Gets the Marker property group from the given layer or comp. */
    getMarkerGroup(obj: Layer | CompItem): PropertyGroup | null;

    /** Gets all keys on the given property or array of properties. */
    getKeys(prop: Property<PropertyValueType> | Property<PropertyValueType>[]): AEQArrayEx<AEQKey>;

    /** Loops through arrays and objects */
    forEach(obj: any[], callback: forEachArrayCallback<any>, fromIndex?: number): void;
    forEach(obj: object, callback: forEachArrayCallback<any>, fromIndex?: number): void;

    /** Loops through the layers of a comp, array of comps, or all layers in the project, and executes a function for each one. */
    forEachLayer(obj: CompItem | CompItem[], callback: forEachArrayCallback<any>): AEQuery;

    /** Loops through the properties of a Comp, Layer, PropertyGroup, or an array of any of them, and executes a function for each one. */
    forEachProperty(obj: CompItem | Layer | PropertyGroup | any[] | forEachArrayCallback<any>, callback: forEachArrayCallback<any>): AEQuery;

    /** Loops through the effects in a Comp, or on a Layer, and executes a function for each one.. */
    forEachEffect(obj: CompItem | Layer | any[], callback: forEachArrayCallback<any>): AEQuery;

    /** Loops through the comps in a project and executes a function for each one. */
    forEachComp(callback: forEachArrayCallback<CompItem>): void;

    /** Loops through the Project items in a project and executes a function for each one. */
    forEachItem(callback: forEachArrayCallback<Item>): AEQuery;

    /** Loops through the items in the renderqueue and executes a function for each one. */
    forEachRenderQueueItem(callback: forEachArrayCallback<RenderQueueItem>): AEQuery;

    /** Loops through the output modules in the renderqueue and executes a function for each one. */
    forEachOutputModule(callback: forEachArrayCallback<OutputModule>): AEQuery;

    /** Runs callback on each element, and returns a new arrayEx of elements that trigger callback === true */
    filter(obj: any[] | object, callback: boolArrayCallback<any>): AEQArrayEx<any>;

    /** Returns `true` if argument is null or undefined */
    isNullOrUndefined(o: any): o is undefined;

    /** Returns `true` if argument is a boolean */
    isBoolean(o: any): o is boolean;

    /** Returns `true` if argument is a number */
    isNumber(o: any): o is number;

    /** Returns `true` if argument is a string */
    isString(o: any): o is string;

    /** Returns `true` if argument is an object */
    isObject(o: any): o is object;

    /** Returns `true` if argument is a plain object, i.e an object created using `{}` or `new Object()` */
    isPlainObject(o: any): boolean;

    /** Returns `true` if argument is an array */
    isArray(o: any): o is Array<any>;

    /** Returns `true` if the passed array is empty */
    isEmpty(o: Array<any>): boolean;

    /** Returns `true` if argument is a function */
    isFunc(o: any): o is Function;

    /** Returns `true` if argument is... aeq? */
    isAeq(o: any): o is AEQuery;

    /** Returns `true` if argument is the Application object */
    isApp(o: any): o is Application;

    /** Returns `true` if argument is a Folder object */
    isFolder(o: any): o is Folder;

    /** Returns `true` if argument is a File object */
    isFile(o: any): o is File;

    /** Returns `true` if argument is a FolderItem object */
    isFolderItem(o: any): o is FolderItem;

    /** Returns `true` if argument is a FootageItem object */
    isFootageItem(o: any): o is FootageItem;

    /** Returns `true` if argument is a Comp object */
    isComp(o: any): o is CompItem;

    /** Returns `true` if argument is an AVLayer */
    isAVLayer(o: any): o is AVLayer;

    /** Returns `true` if argument is a ShapeLayer */
    isShapeLayer(o: any): o is ShapeLayer;

    /** Returns `true` if argument is a TextLayer */
    isTextLayer(o: any): o is TextLayer;

    /** Returns `true` if argument is a CameraLayer */
    isCameraLayer(o: any): o is CameraLayer;

    /** Returns `true` if argument is a LightLayer */
    isLightLayer(o: any): o is LightLayer;

    /** Returns `true` if argument is a Precomp */
    isPrecomp(o: any): boolean;

    /** Returns `true` if argument is a Layer */
    isLayer(o: any): o is Layer;

    /** Returns `true` if argument is a Property */
    isProperty(o: any): o is Property<any>;

    /** Returns `true` if argument is a PropertyGroup */
    isPropertyGroup(o: any): o is PropertyGroup;

    /** Returns `true` if argument is a MaskPropertyGroup */
    isMaskPropertyGroup(o: any): o is MaskPropertyGroup;

    /** Returns `true` if argument is a Panel object */
    isPanel(o: any): o is Panel;

    /** Returns `true` if argument is a Window object */
    isWindow(o: any): o is Window;

    /** `true` if system is a MacOS */
    isMac: boolean;

    /** `true` if system is a Windows */
    isWindows: boolean;

    /** AEQ Version */
    version: string;

    /** Gets a string containing current OS, AE version and AE language */
    getSystemInfo(): string;

    /** Creates and alerts an aequery error from a JS error */
    error(err: Error, args: any): AEQuery;

    /** Used for setting the default value in functions. Returns the first argument is not undefined, else it returns `defaultVal`. */
    setDefault(value: any, defaultVal: any): any;

    /** Returns a pressed-state object of modifier keys */
    getModifiers(): { meta: boolean; ctrl: boolean; alt: boolean; shift: boolean };

    /** Normalizes a collection */
    normalizeCollection(collection: Array<any>): AEQArrayEx<any>;

    /** Converts frame count to time. */
    framesToTime(frames: number, frameRate: number): number;

    /** Converts time to frame count. */
    timeToFrames(time: number, frameRate: number): number;

    /** Saves object of name:binaryContents pairs to files, returns object of files */
    createResourceFiles(resources: { [name: string]: string }, folder: Folder | string, extension?: string): { name: File };

    /** Takes a file (or file path) and converts it to a binary string */
    getBinaryString(filePath: File | string): string;

    /** Creates an undoGroup and wraps passed function in it */
    createUndoGroup(name: string, callback: Function, args: any | any[]): any;

    // Shortcuts
    activeComp: typeof aeq.getActiveComposition;
    activeComposition: typeof aeq.getActiveComposition;
    AEversion: typeof aeq.app.version;
    callSystem: typeof aeq.command.call;
    copyToClipboard: typeof aeq.command.copyToClipboard;
    forEachComposition: typeof aeq.forEachComp;
    forEachOM: typeof aeq.forEachOutputModule;
    forEachProp: typeof aeq.forEachProperty;
    forEachRQItem: typeof aeq.forEachRenderQueueItem;
    getActiveComp: typeof aeq.getActiveComposition;
    getComp: typeof aeq.getComposition;
    getComps: typeof aeq.getCompositions;
    getFile: typeof aeq.file.getFile;
    getFileObject: typeof aeq.file.getFileObject;
    getFiles: typeof aeq.file.getFiles;
    getFilesRecursive: typeof aeq.file.getFilesRecursive;
    getFolder: typeof aeq.file.getFolder;
    getFolderObject: typeof aeq.file.getFolderObject;
    getSelectedOrAllLayers: typeof aeq.getSelectedLayersOrAll;
    getSelectedProps: typeof aeq.getSelectedProperties;
    getSetting: typeof aeq.settings.get;
    getSettingAsArray: typeof aeq.settings.getAsArray;
    getSettingAsBool: typeof aeq.settings.getAsBool;
    getSettingAsFloat: typeof aeq.settings.getAsFloat;
    getSettingAsInt: typeof aeq.settings.getAsInt;
    haveSetting: typeof aeq.settings.have;
    importFile: typeof aeq.project.importFile;
    importFiles: typeof aeq.project.importFiles;
    importSequence: typeof aeq.project.importSequence;
    isArr: typeof aeq.isArray;
    isBool: typeof aeq.isBoolean;
    isCamera: typeof aeq.isCameraLayer;
    isComposition: typeof aeq.isComp;
    isDir: typeof aeq.isFolder;
    isDirectory: typeof aeq.isFolder;
    isFunction: typeof aeq.isFunc;
    isLight: typeof aeq.isLightLayer;
    isNum: typeof aeq.isNumber;
    isObj: typeof aeq.isObject;
    isProp: typeof aeq.isProperty;
    isStr: typeof aeq.isString;
    isWin: typeof aeq.isWindows;
    loadSettings: typeof aeq.settings.unpack;
    open: typeof aeq.app.open;
    openURL: typeof aeq.command.openURL;
    pathSeparatorSymbol: typeof aeq.file.pathSeparatorSymbol;
    prop: typeof aeq.property;
    quickSave: typeof aeq.project.quickSave;
    readFile: typeof aeq.file.readFile;
    revealFile: typeof aeq.command.revealFile;
    save: typeof aeq.project.save;
    saveSetting: typeof aeq.settings.save;
    selectFiles: typeof aeq.file.selectFiles;
    setSetting: typeof aeq.settings.save;
    undoGroup: typeof aeq.createUndoGroup;
    unpackSettings: typeof aeq.settings.unpack;
    writeFile: typeof aeq.file.writeFile;
}

/** AEQ CALLBACKS **/

declare type forEachArrayCallback<T> = (item: T, index: number, array: Array<T>) => void;
declare type boolArrayCallback<T> = (item: T, index: number, array: Array<T>) => boolean;
declare type anyArrayCallback<T> = (item: T, index: number, array: Array<T>) => any;

/** AEQ MODULES **/

declare interface AEQAppClass {
    /** The After Effects version */
    version: number;

    /** Checks whether AE security pref is enabled */
    securityPrefEnabled(): boolean;

    /** Gets user data folder */
    getUserDataFolder(): Folder;

    /** Gets current script file object */
    getScriptFile(): File;

    /** Gets current AEP file object */
    getAEP(): File;

    /** Gets folder containing current AEP, or null if AEP is not saved */
    getAEPDir(): Folder | null;

    /** Gets filename of current AEP, or null if AEP is not saved */
    getAEPName(): string | null;

    /** Gets array of both default preset folder paths; One in the user directory, one in the AE install directory */
    getPresetsPaths(): string[];

    /** Checks security pref setting, prompting user to enable it if not */
    ensureSecurityPrefEnabled(): void;

    /** Opens an AEP */
    open(filePath: File | string): File;
}

declare interface AEQCommandClass {
    /** Call a command-line/system command. */
    call(windows: string, mac: string, arg?: string): string;

    /** Call a command-line/system command. */
    call(commands?: { win?: string; windows?: string; mac?: string; arg?: string }): string;

    /** Opens the given URL in the default web browser */
    openURL(url: string): void;

    /** Reveals the given file path or file object in Finder/Explorer. */
    revealFile(filePath: File | string): string;

    /** Copies a string to the users clipboard */
    copyToClipboard(text: string): void;
}

declare interface AEQCompClass {
    /** Creates a comp with the given settings */
    create(folder: FolderItem | string, options: AEQCompCreateOptions): CompItem;
    create(options?: AEQCompCreateOptions): CompItem;

    /** Gets the `RenderQueueItem`s that references a given comp. */
    getCompInQueue(comp: CompItem, queuedOnly?: boolean): AEQArrayEx<RenderQueueItem>;

    /** Check if a comp is in the Render Queue, regardless of it being queued or not. */
    isInQueue(comp: CompItem): boolean;

    /** Check if a comp is in the Render Queue and queued. */
    isQueued(comp: CompItem): boolean;
}

declare interface AEQFileClass {
    /** The value of the OS's file system path separator symbol; \ or / */
    pathSeparatorSymbol: string;

    normalizePathArray(parts: string[], allowAboveRoot: boolean): string[];

    /** Checks whether the path starts with the OS separator symbol */
    pathIsAbsolute(path: string): boolean;

    /** Normalizes a path */
    normalizePath(path: string): string;

    /** Joins path components */
    joinPath(...args: (String | File | Folder)[]): string;

    /** Returns the extension of target file */
    getExtension(filePath: File | string): string;

    /** Returns the filename of target file without extension */
    stripExtension(filePath: File | string): string;

    /** Takes a file path or a file object, and returns a file object */
    getFileObject(filePath: File | string): File;

    /** Gets target file by path or file object, or null if doesn't exist */
    getFile(filePath: File | string): File | null;

    /** Gets all files in target path that matches filter (or, all files if no filter) */
    getFiles(folderPath: Folder | string, filter?: string | Function): AEQArrayEx<File> | null;

    /** Gets all files in target path that matches filter (or, all files if no filter) */
    getFilesRecursive(folderPath: Folder | string, filter?: string | Function): AEQArrayEx<File> | null;

    /** Takes a folder path or a folder object, and returns a folder object */
    getFolderObject(folderPath: Folder | string): Folder;

    /** Gets target folder by path or folder object, or null if doesn't exist */
    getFolder(folderPath: Folder | string): Folder | null;

    /** Returns a folder, creating if it doesn't exist */
    ensureFolderExists(folderPath: Folder | string): Folder;

    /** Returns the contents of a specified file */
    readFile(filePath: File | string, encoding?: string): string | null;

    /** Writes data to a file, returns file */
    writeFile(filePath: File | string, contents: string, options?: AEQWriteFileOptions): File | null;

    /** Prompts user to select files */
    selectFiles(extensionList: string[], multiSelect?: false): AEQArrayEx<File> | null;

    // Shortcuts
    get: typeof aeq.file.getFile;
}

declare interface AEQLayerClass {
    /** Copies the state of layer toggles from one layer to another. */
    copyLayerToggles(sourceLayer: Layer, destLayer: Layer): void;

    /** Gets all layers that has the given layer as its parent. */
    children(parentLayer: Layer): AEQArrayEx<Layer>;

    /** Gets all layers that has the given layer as its parent, and all layers that has those layers, and so on. */
    allChildren(parentLayer: Layer): AEQArrayEx<Layer>;

    /** Gets the layers parent chain. I.e This layer's parent's parent, and so on. */
    parents(childLayer: Layer): AEQArrayEx<Layer>;

    /** Gets all parents and all children of a given layer */
    relatedLayers(root: Layer): AEQArrayEx<Layer>;
}

declare interface AEQProjectClass {
    /** Gets all footage items in project */
    getFootage(parentFolder?: FolderItem | string): AEQArrayEx<Item>;

    /** Gets all folders within target folder, or root */
    getFolders(parentFolder?: FolderItem | string): AEQArrayEx<FolderItem>;

    /** Find folder by name in target folder. */
    findFolder(name: string, parentFolder?: FolderItem | string): FolderItem | null;

    /** Gets folder item, or null if can't find */
    getFolder(folder: FolderItem | string, parentFolder?: FolderItem | string): FolderItem | null;

    /** Gets all folder items that are selected */
    getSelectedFolders(): AEQArrayEx<FolderItem>;

    /** Gets all comp items that are selected */
    getSelectedComps(): AEQArrayEx<CompItem>;

    /** Gets selected comps, or all comps if none is selected. */
    getSelectedCompsOrAll(): AEQArrayEx<CompItem>;

    /** Gets all footage items that are selected */
    getSelectedFootage(): AEQArrayEx<FootageItem>;

    /** Gets folder item, or creates it if can't find */
    getOrCreateFolder(folder: FolderItem | string, parentFolder?: FolderItem | string): FolderItem;

    /** Gets folder item, or root if undefined */
    getFolderOrRoot(folder?: FolderItem | string): FolderItem;

    /** Saves current AEP to target path, or prompts user if no path */
    save(path?: string): File;

    /** Saves current AEP to current path */
    quickSave(): File;

    /** Imports a file into After Effects. */
    importFile(file: File | string, folder?: FolderItem | string, options?: { sequence: boolean }): Item;

    /** aeq.project.importFile without the extra */
    simpleImportFile(file: File, options?: { sequence: boolean }): Item;

    /** Imports a sequence by file object or path */
    importSequence(file: File | string, folder?: FolderItem): Item;

    /** Imports array of files or paths to target folder */
    importFiles(fileArray: File[] | string[], folder?: FolderItem, options?: { sequence: boolean }): AEQArrayEx<Item>;

    /** Moves item(s) to specified folder */
    moveToFolder(items: Item | Item[], folder: FolderItem): void;

    /** Reduces current project to only comps that are queued */
    reduceToQueuedComps(): AEQArrayEx<CompItem> | null;
}

declare interface AEQPropertyClass {
    /** Returns the property value type of a Property as a string. */
    valueType(property: Property<PropertyValueType>): string;

    /** Returns the property type as a string. */
    type(property: Property<PropertyValueType>): string;

    /** Gets the layer the given property is contained in. */
    getLayer(property: Property<PropertyValueType>): Layer;
}

declare interface AEQRenderQueueClass {
    /** Add a project item to the render queue. */
    queue(item: Item): RenderQueueItem;

    /** Unqueues all items in the render queue */
    unqueueAll(): void;

    /** Removes all items from the render queue. */
    clear(): void;

    /** Check if an item in the render queue is queued for rendering. */
    isQueued(rqItem: RenderQueueItem): boolean;

    /** Gets all `RenderQueueItem`s in the render queue which are queued for rendering. */
    getQueuedItems(): AEQArrayEx<RenderQueueItem>;

    /** Gets all `CompItem`s that are queued for rendering. */
    getQueuedComps(): AEQArrayEx<CompItem>;

    /** Gets all render queue items. */
    getRQItems(): AEQArrayEx<RenderQueueItem>;

    /** Gets all `compItem`s added to the render queue. */
    getRQComps(): AEQArrayEx<CompItem>;

    /** Gets settings from a `RenderQueueItem` or `OutputModule`. */
    getSettings(renderItem: RenderQueueItem | OutputModule): object;

    /** Checks if the folder where the output module is rendering to exists, if it does not exist, it gets created. */
    ensureRenderPathExists(outputModule: OutputModule): void;

    /** Checks if the given output module template exists. */
    omTemplateExists(templateName: string): boolean;

    /** Checks if the given render queue template exists. */
    rqTemplateExists(templateName: string): boolean;
}

declare interface AEQSettingsClass {
    /** Saves setting if present, else gets setting */
    setting(sectionName: string, keyName: string, value?: string): string;

    /** Initializes a setting, setting it if not present */
    initSetting(sectionName: string, keyName: string, value?: string, overwrite?: boolean): string;

    /** Gets setting from section:key */
    get(sectionName: string, keyName: string): string | undefined;

    /** Gets setting and returns as boolean value, or undefined if not boolean */
    getAsBool(sectionName: string, keyName: string): boolean | undefined;

    /** Gets setting and returns as array */
    getAsArray(sectionName: string, keyName: string): string[] | undefined;

    /** Gets setting and returns as float */
    getAsFloat(sectionName: string, keyName: string): number | undefined;

    /** Gets setting and returns as int */
    getAsInt(sectionName: string, keyName: string): number | undefined;

    /** Checks whether setting has been saved / exists in file */
    have(sectionName: string, keyName: string): boolean;

    /** Saves setting */
    save(sectionName: string, keyName: string, value: string): void;

    /** Checks whether object of key names have saved settings, returns object of saved values of this string */
    unpack(sectionName: string, keyNames: object): object;

    // Shortcuts
    set: typeof aeq.settings.save;
    load: typeof aeq.settings.unpack;
}

/** AEQ CUSTOM OBJECTS **/

declare interface AEQArrayEx<T> extends Array<T> {
    /** Loops through the elements in the array and executes a function */
    forEach(callback: forEachArrayCallback<T>): void;

    /** Loops through the elements in the array and returns `true` if callback returns true for any element */
    some(callback: boolArrayCallback<T>): boolean;

    /** Loops through the elements in the array and returns `true` if callback returns true for all elements */
    every(callback: boolArrayCallback<T>): boolean;

    /** Gets first element in array */
    first(): T;

    /** Returns array element that triggers callback === true */
    find(callback: boolArrayCallback<T>, def?: T): T;

    /** Returns index of array element that triggers callback === true */
    findIndex(callback: boolArrayCallback<T>): number;

    /** Runs callback on each element, and returns a new arrayEx of elements that trigger callback === true */
    filter(callback: boolArrayCallback<T>): AEQArrayEx<T>;

    /** Returns index of searchElement in an array, or -1 if not found */
    indexOf(searchElement: T, fromIndex?: 0): number;

    /** Creates a new array with the results of calling a provided function on every element in the calling array */
    map(callback: anyArrayCallback<T>): AEQArrayEx<any>;

    /** Inserts an element into arrayEx at specified index */
    insertAt(insert: T, index: number): void;
}

declare interface AEQComp extends CompItem {
    /** Get the original object */
    get(): CompItem;

    /** Runs a function on each layer in aeq.Comp object */
    forEachLayer(callback: forEachArrayCallback<Layer>): void;
}

declare interface AEQKey {
    /** Used to check if the key index is the correct for refrensing */
    checkKey(): void;

    /** Gets comp time of current key */
    getTime(): number;

    /** Gets or sets interpolation type of current key */
    interpolationType(
        inType?: KeyframeInterpolationType,
        outType?: KeyframeInterpolationType
    ): { inType: KeyframeInterpolationType; outType: KeyframeInterpolationType } | boolean;

    /** Gets or sets in/out spatial tangents of current key */
    spatialTangent(inType?: number[], outType?: number): { inTangent: number[]; outTangent: number[] };

    /** Gets or sets in/out temporal ease of current key */
    temporalEase(inType?: KeyframeEase[], outType?: KeyframeEase[]): { inEase: KeyframeEase[]; outEase: KeyframeEase[] };

    /** Gets comp time of current key */
    time(): number;

    /** Removes current key from property */
    remove(): void;

    /** Gets key data */
    getKeyInfo(): AEQKeyInfo;

    /** Copies current key to a new property at current (or target) time */
    copyTo(targetProp: Property<PropertyValueType>, time?: number, offset?: number): AEQKey;

    /** Moves current key to new time */
    moveTo(time: number): void;

    /** Checks whether this property type matches argument */
    valueTypeIs(type: string): boolean;
}

declare interface AEQLayer {
    /** Get the original object */
    get(): Layer;

    /** Gets or sets layer parent */
    parent(): Layer | null;

    /** Copies current layer to comp */
    copyToComp(comp: CompItem | AEQComp): AEQLayer;

    /** Removes this layer's parent */
    removeParent(): AEQLayer;

    /** Executes a callback function on each effect on this layer */
    forEachEffect(callback: forEachArrayCallback<Property<PropertyValueType>>): AEQLayer;

    /** Adds effect to layer by name or matchname */
    addEffect(effectName: string): void;

    /** Gets all layers that has the given layer as its parent. */
    children(): AEQArrayEx<AEQLayer>;

    /** Gets all layers that has the given layer as its parent, and all layers that has those layers, and so on. */
    allChildren(): AEQArrayEx<AEQLayer>;

    /** This layer's parent chain */
    parents(): AEQArrayEx<AEQLayer>;

    /** All children and parents of this layer */
    relatedLayers(): AEQArrayEx<AEQLayer>;
}

declare interface AEQProperty<PropertyValueType> {
    /** Get the original object */
    get(): Property<PropertyValueType>;

    /** Gets or sets expression on property */
    expression(newValue?: string): string | boolean;

    /** Gets array of selected keys */
    selectedKeys(): AEQArrayEx<AEQKey>;

    /** Adds & returns a new key at time */
    addKey(time: number): AEQKey;

    /** Retrieves property following passed dimension */
    separationFolloder(dimension: number): Property<PropertyValueType>;

    /** Returns the index of the keyframe nearest to the specified time. */
    nearestKeyIndex(time: number): AEQKey;

    /** Removes key by index or key object */
    removeKey(keyIndex: number | AEQKey): void;

    /** Returns the original multidimensional property for this separated follower */
    separationLeader(): Property<PropertyValueType> | null;

    /** Returns the dimension number it represents in the multidimensional leader */
    separationDimension(): number | null;

    /** Returns maximum permitted value of property */
    maxValue(): number | null;

    /** Returns minimum permitted value of property */
    minValue(): number | null;

    /** Gets or sets property value */
    value(newValue?: any): any | void;

    /** Get or set the value of the current property as evaluated at the specified time */
    valueAtTime(time: number, value?: typeof PropertyValueType): typeof PropertyValueType | number;

    /** Get or sets values for a set of keyframes at specified times */
    valuesAtTimes(times: number[], values?: typeof PropertyValueType[]): typeof PropertyValueType[] | number[];

    /** Runs a function on each key in current property */
    forEachKey(callback: forEachArrayCallback<AEQKey>): void;

    /** Returns a aeq.Key object for specific key index */
    key(keyIndex: number): AEQKey;

    /** Gets all keys of the property */
    getKeys(): AEQArrayEx<AEQKey>;
}

declare interface AEQUIContainer<T> {
    obj: T;

    /** Get the original object */
    get(): T;

    /** Set options for this container */
    set(options: object): void;

    /** Refresh panel */
    update(): void;

    /** Remove an item */
    remove(obj: any): void;

    /** Remove all of the containers children */
    removeChildren(obj: any): void;

    /** Get all of the containers children */
    getChildren(): _Control[];

    /** Remove all items in a container */
    removeAll(): void;

    /** Add a Button to this container */
    addButton(buttonText: string, onClick?: Function, creationProperties?: Partial<_AddControlProperties>): Button;

    /** Add a Checkbox to this container */
    addCheckbox(checkboxLabel: string, onClick?: Function, creationProperties?: Partial<_AddControlProperties>): Checkbox;

    /** Add a DropdownList to this container */
    addDropdownList(items?: string[], onChange?: Function, creationProperties?: Partial<_AddControlPropertiesDropDownList>): DropDownList;

    /** Add a EditText to this container */
    addEditText(text?: string, onChange?: Function, onChanging?: Function, creationProperties?: Partial<_AddControlPropertiesEditText>): EditText;

    /** Add a Group to this container */
    addGroup(properties?: any): AEQUIContainer<Group>;

    /** Add an IconButton to this container */
    addIconButton(icon: File | string, onClick?: Function, creationProperties?: Partial<_AddControlPropertiesIconButton>): IconButton;

    /** Add an Image to this container */
    addImage(image: ScriptUIImage, onClick?: Function, creationProperties?: Partial<_AddControlProperties>): Image;

    /** Add a ListBox to this container */
    addListBox(
        items: string[],
        onChange?: Function,
        onDoubleClick?: Function,
        creationProperties?: Partial<_AddControlPropertiesListBox>
    ): AEQUIListbox;

    /** Add a Panel to this container */
    addPanel(label?: string, creationProperties?: any): AEQUIContainer<Panel>;
    addPanel(creationProperties?: any): AEQUIContainer<Panel>;

    /** Add a Progressbar to this container */
    addProgressbar(value: number, maxValue: number): Progressbar;

    /** Add a RadioButton to this container */
    addRadioButton(label: string, creationProperties?: Partial<_AddControlProperties>): RadioButton;

    /** Add a Scrollbar to this container */
    addScrollbar(value: number, maxValue: number, onChange?: Function, onChanging?: Function): Scrollbar;

    /** Add a Slider to this container */
    addSlider(value: number, minValue: number, maxValue: number, onChange?: Function, onChanging?: Function): Slider;

    /** Add a StaticText to this container */
    addStaticText(text: string, creationProperties?: Partial<_AddControlPropertiesStaticText>): StaticText;

    /** Add a Tab to this container */
    addTab(label: string, creationProperties?: Partial<_AddControlProperties>): AEQUIContainer<Tab>;

    /** Add a TabbedPanel to this container */
    addTabbedPanel(creationProperties?: Partial<_AddControlProperties>): AEQUIContainer<TabbedPanel>;

    /** Add a TreeView to this container */
    addTreeView(items: string[], onChange?: Function, creationProperties?: Partial<_AddControlPropertiesTreeView>): AEQUITreeView;
}

declare interface AEQUIListbox {
    obj: ListBox;

    /** Adds a ListItem to this ListBox */
    add(text: string, image?: ScriptUIImage, index?: number): ListItem;
    addItem(text: string, image?: ScriptUIImage, index?: number): ListItem;

    /** Removes a ListItem from this list */
    removeItem(item: ListItem): void;

    /** Removes all ListItems from this ListBox */
    removeAll(): void;

    /** Gets ancestor of item */
    getAncestor(item: ListItem): ListItem;

    /** Adds a multi-dimensional row to a list */
    addRow(itemArray: string[]): ListItem;

    /** Checks whether a selection in a list is contiguous */
    contiguous(sel: ListItem[]): boolean;

    /** Moves selected item(s) up in a list */
    moveUp(): void;

    /** Moves selected item(s) down in a list */
    moveDown(): void;

    /** Moves selected item(s) to the top of a list */
    moveToTop(): void;

    /** Moves selected item(s) to the bottom of a list */
    moveToBottom(): void;

    /** Swaps two listItems */
    swap(a: ListItem, b: ListItem): void;

    /** Gets the selection in a list */
    getSelection(): AEQArrayEx<ListItem>;
}

declare interface AEQUITreeView extends AEQUIListbox {
    // obj: TreeView;

    /** Reveals (expands) an item in a treeview by name */
    revealItem(name: string): void;

    /** Adds a node to a UITreeView */
    addNode(text: string, image?: ScriptUIImage, index?: number, expanded?: boolean): AEQUITreeView;

    /** Removes ancestor of node */
    removeAncestor(item: ListItem): void;

    /** Expands a node and all children */
    expandNodes(node: ListItem): void;

    /** Collapses a node and all children */
    collapseNodes(node: ListItem): void;

    /** Finds items by name in a node */
    findItemByName(node: ListItem, list: ListItem[], name: string): ListItem[];

    /** Creates a new node or branch based on an existing one */
    copyBranch(node: ListItem, nodeCopy: ListItem): void;

    /** Checks whether an branch is a node */
    isNode(branch: ListItem): boolean;

    /** Checks whether a branch is an item */
    isItem(branch: ListItem): boolean;
}

declare interface AEQUIWindow<T> extends AEQUIContainer<T> {
    obj: T;

    /** Shows a window */
    show(): void;

    /** Hides a window */
    hide(): void;

    /** Closes a window */
    close(result?: number): void;

    /** Updates layout */
    layout(): void;
}

declare interface AEQUIClass {
    /** Creates a UI Main Window */
    createMainWindow(thisObj: Panel, title: string, options?: { resizable: boolean }): AEQUIWindow<Panel | Window>;

    /** Creates a UI Dialog */
    createWindow(title: string, options?: { resizable: boolean }): AEQUIWindow<Window>;

    /** Creates a UI Dialog */
    createDialog(title: string, options?: { resizable: boolean }): AEQUIWindow<Window>;

    /** Sets properties onto an item */
    set(obj: _Control | AEQUIContainer<Panel | Group | Tab | TabbedPanel>, options: object): void;
}

/** AEQ SUBOBJECTS **/

declare interface SpatialTangent {
    /** Tangent for keyIn */
    inTangent: KeyframeSpatialTangent;

    /** Tangent for keyOut */
    outTangent: KeyframeSpatialTangent;
}

declare interface KeyframeSpatialTangent {
    xSpatialTangent: number;
    ySpatialTangent: number;
    zSpatialTangent?: number;
}

declare interface TemporalEase {
    /** TemporalEase for keyIn */
    inTemporalEase: KeyframeTemporalEase;

    /** TemporalEase for keyOut */
    outTemporalEase: KeyframeTemporalEase;
}

declare interface KeyframeTemporalEase {
    xTemporalEase: number;
    yTemporalEase: number;
    zTemporalEase?: number;
}

declare interface AEQKeyInfo {
    /** Prop that the key lives on */
    property: Property<PropertyValueType>;

    /** Key value */
    value: any;

    /** Key time */
    time: number;

    /** In/out interpolation type */
    interpolationType: KeyframeInterpolationType;

    /** In/out temporal ease */
    temporalEase: TemporalEase;

    /** In/out spatial tangents */
    spatialTangent: SpatialTangent;

    /** Whether key has temporal auto-Bezier interpolation */
    temporalAutoBezier: boolean;

    /** Whether key has temporal continuity */
    temporalContinuous: boolean;

    /** Whether key has spatial auto-Bezier interpolation */
    spatialAutoBezier: boolean;

    /** Whether key has spatial continuity */
    spatialContinuous: boolean;

    /** Whether key is roving */
    roving: boolean;
}

declare interface AEQWriteFileOptions {
    /** Whether to overwrite file if already exists */
    overwrite?: boolean;

    /** Encoding method */
    encoding?: string;
}

declare interface AEQCompCreateOptions {
    name?: string;
    width?: number;
    height?: number;
    pixelAspect?: number;
    duration?: number;
    frameRate?: number;
}

declare interface AEQGetPropertyChildrenOptions {
    /** set to true to separate properties */
    separate?: boolean;

    /** whether to include property groups */
    groups?: boolean;

    /** whether to include properties */
    props?: boolean;
}
