import * as fs from 'fs';
import { join, normalize } from 'path';
import { AexObject, AexOptions, AexPrescanResult, AexResult } from './constants';
import { getEvalScriptResult, openProject } from './csinterface';

const SOURCE_DIR = 'BUILDSCRIPT:SOURCE_DIR';
const DEPLOY_DIR = 'BUILDSCRIPT:DEPLOY_DIR';

export const AeObject = {
    ActiveComp: 'app.project.activeItem',
    Project: 'app.project',
    Layer: (num: number) => `app.project.activeItem.layer(${num})`,
    CompProp: (route: string) => `app.project.activeItem.${route}`,
    LayerProp: (num: number, route: string) => `app.project.activeItem.layer(${num}).${route}`,
};

export function aex() {
    return {
        async createTestComp(): Promise<AexResult> {
            return await getEvalScriptResult<AexResult>(`aeq.comp.create().openInViewer()`, undefined, {
                ignoreReturn: false,
            });
        },

        async benchmark(options: { callback: (result: boolean) => void }): Promise<any> {
            return await getEvalScriptResult(`aex.benchmark(aex_args)`, options, { ignoreReturn: false });
        },

        async prescan(aeObject: string, options?: AexOptions): Promise<AexPrescanResult> {
            return await getEvalScriptResult<AexPrescanResult>(`aex.prescan(${aeObject}, aex_args)`, options || {}, {
                ignoreReturn: false,
            });
        },

        async get(aeObject: string, options?: AexOptions): Promise<AexResult> {
            const isLayer = aeObject.match(/app.project.activeItem.layer\(\d+\)/gi);

            if (isLayer || aeObject == AeObject.ActiveComp || aeObject == AeObject.Project) {
                return await getEvalScriptResult<AexResult>(`aex.get(${aeObject}, aex_args)`, options || {}, { ignoreReturn: false });
            } else {
                throw new Error(`Unrecognized AE Object - ${aeObject}`);
            }
        },

        async create(aeObject: string, aexObject: AexObject, options?: AexOptions): Promise<AexResult> {
            return await getEvalScriptResult<AexResult>(`aex.create(${aeObject}, ${JSON.stringify(aexObject)}, aex_args)`, options || {}, {
                ignoreReturn: false,
            });
        },

        async update(aeObject: string, aexObject: AexObject, options?: AexOptions): Promise<AexResult> {
            return await getEvalScriptResult<AexResult>(`aex.update(${aeObject}, ${JSON.stringify(aexObject)}, aex_args)`, options || {}, {
                ignoreReturn: false,
            });
        },
    };
}

/**
 * Looks for a pre-deserialized (cached) version of an aep containing specific aex data. If it
 * doesn't exist then the function will open the aep, save it and return the result. This
 * function is intended to speed up deserialization testing especially on large AEP's but can
 * speed up serialization as well.
 *
 * @param aepPath Path to aep
 * @param aexObject Data to deserialize via aex.
 * @param options Aex and optons to customize the cached filename and location.  Use `repo` to cache
 * files into the source repo and `panel` to read it from the deployed CEP panel.
 * @returns The contents of the cached file or aex().get().
 */
export async function getProject(aepPath: string, aexObject: string, options?: AexOptions & { tag?: string; cacheLocation?: 'repo' | 'panel' }) {
    const cachedProjectFilepath = getCachedProjectFilepath(aepPath);

    try {
        if (await isCachedProjectStale(cachedProjectFilepath)) {
            await openProject(aepPath); // TODO(zlovatt): This chokes on projectFilepath. Seems suspicious.

            const serializedProject = await aex().get(aexObject);

            saveSerializedProjectToFile(cachedProjectFilepath, serializedProject);
        }

        return getSerializedProjectFromFile(cachedProjectFilepath);
    } catch (e: any) {
        throw new Error(`Could not open or read the aep cache for "${aepPath}". ${e.toString()}`);
    }

    function saveSerializedProjectToFile(filepath: string, serializedResult: AexResult) {
        const resultAsJson = JSON.stringify(serializedResult, null, 3);
        fs.writeFileSync(filepath, resultAsJson);
    }

    function getSerializedProjectFromFile(filepath: string) {
        const resultAsJson = fs.readFileSync(filepath).toString();
        const serializedResult = JSON.parse(resultAsJson) as AexResult;

        return serializedResult;
    }

    function getCachedProjectFilepath(aepPath: string) {
        const cacheLocation = options?.cacheLocation || 'panel';
        const cacheRootDir = cacheLocation == 'repo' ? join(SOURCE_DIR, 'test') : DEPLOY_DIR;
        const cachedProjectFilename = aepPath.replace('.aep', `${getAexObjectTag(aexObject)}.json`);

        return join(cacheRootDir, cachedProjectFilename);
    }

    async function isCachedProjectStale(cachedProjectFilepath: string) {
        const projectFilepath = join(SOURCE_DIR, 'test', normalize(aepPath));
        let isProjectNewerThanCachedVersion = false;

        if (await fileExists(cachedProjectFilepath)) {
            isProjectNewerThanCachedVersion = compareLastUpdateTimes(cachedProjectFilepath, projectFilepath) < 0;
        }

        return isProjectNewerThanCachedVersion;
    }

    function getAexObjectTag(aexObject: string) {
        if (options?.tag) {
            return `.${options!.tag!}`;
        } else if (aexObject === AeObject.Project) {
            return '';
        } else if (aexObject === AeObject.ActiveComp) {
            return '.comp';
        } else if (aexObject.startsWith('app.project.activeItem')) {
            return aexObject.replace('app.project.activeItem', '.comp').replace(/\(|\)/g, '');
        } else {
            throw new Error(`Don't know how to make a clear filename to cache "${aexObject}"`);
        }
    }

    function fileExists(path: string) {
        return new Promise<boolean>((resolve, reject) => {
            fs.access(path, fs.constants.O_RDWR, (error) => {
                resolve(!error);
            });
        });
    }

    function compareLastUpdateTimes(file1: string, file2: string) {
        const time1 = lastUpdatedTime(file1);
        const time2 = lastUpdatedTime(file2);

        return time1.valueOf() - time2.valueOf();
    }

    function lastUpdatedTime(path: string) {
        return fs.statSync(path).mtime;
    }
}
