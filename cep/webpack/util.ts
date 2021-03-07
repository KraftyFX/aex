import * as glob from 'glob';

export function resolveGlobs(patterns: string[], cwd: string): string[] {
    const testFiles: string[] = [];

    patterns.forEach((pattern) => testFiles.push(...glob.sync(pattern, { cwd })));

    return testFiles;
}
