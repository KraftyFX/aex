import path = require('path');
const { name } = require('../../cep/package.json');

const system_ae_extension_root =
    process.platform === 'win32'
        ? `c:\\Program Files (x86)\\Common Files\\Adobe\\cep\\extensions\\${name}`
        : `/Library/Application Support/Adobe/CEP/extensions/${name}`;

const user_ae_extension_root =
    process.platform === 'win32'
        ? `c:\\Program Files (x86)\\Common Files\\Adobe\\cep\\extensions\\${name}`
        : `/Users/rafikhan/Library/Application Support/Adobe/CEP/extensions/${name}`;

export const paths = {
    system_ae_extension_root,
    user_ae_extension_root,

    harness: './harness',
    tests: './test',
    estk: '../estk',
    _build: './_build',
};
