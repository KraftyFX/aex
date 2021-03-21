import { AssertionError } from 'chai';

export function assertAreEqual(actual: any, expected: any) {
    const differences: string[] = [];

    compareAny('', expected, actual, differences);

    if (differences.length > 0) {
        const error = new AssertionError(`expected object to deeply equal actual`);
        error.stack = '\n - ' + differences.join('\n - ');
        throw error;
    }
}

function compareAny(path: string, expected: any, actual: any, differences: string[]) {
    if (typeof expected !== typeof actual) {
        differences.push(`${path} has a type mismatch of ${typeof expected} vs ${typeof actual}`);
    } else if (Array.isArray(actual)) {
        compareArray(path, expected, actual, differences);
    } else if (actual instanceof Object) {
        compareObject(path, expected, actual, differences);
    } else if (expected !== actual) {
        differences.push(`${path} => ${expected} !== ${actual}`);
    }
}

function compareArray(path: string, expected: any, actual: any[], differences: string[]) {
    const smallerArrayLength = Math.min(expected.length, actual.length);

    for (let i = 0; i < smallerArrayLength; i++) {
        compareAny(`${path}[${i}]`, expected[i], actual[i], differences);
    }

    (expected as Array<any>).slice(smallerArrayLength).map((v, idx) => {
        differences.push(`${path}[${idx}] was not found in actual`);
    });

    (actual as Array<any>).slice(smallerArrayLength).map((v, idx) => {
        differences.push(`${path}[${idx}] was not found in expected`);
    });
}

function compareObject(path: string, expected: any, actual: any, differences: string[]) {
    const expectedKeys = Object.keys(expected);
    const actualKeys = Object.keys(actual);

    const common = compareArrayIgnoreOrder(path, expectedKeys, actualKeys, differences);

    common.forEach((key) => {
        const left = expected[key];
        const right = actual[key];

        compareAny(`${path}.${key}`, left, right, differences);
    });
}

function compareArrayIgnoreOrder(path: string, expected: string[], actual: string[], differences: string[]) {
    const notInExpected = new Set<string>();
    const notInActual = new Set<string>();
    const common = new Set<string>();

    expected.forEach((v) => (actual.indexOf(v) !== -1 ? common.add(v) : notInActual.add(v)));
    actual.forEach((v) => (expected.indexOf(v) !== -1 ? common.add(v) : notInExpected.add(v)));

    notInActual.forEach((missing) => {
        differences.push(`${path}.${missing} was not in actual`);
    });

    notInExpected.forEach((missing) => {
        differences.push(`${path}.${missing} was not in expected`);
    });

    return Array.from(common.keys()) as string[];
}
