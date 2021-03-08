import path = require('path');
const { name } = require('../../cep/package.json');

const system_ae_extension_root =
    process.platform === 'win32' ? `${process.env.APPDATA}\\cep\\extensions\\${name}` : `/Library/Application Support/Adobe/CEP/extensions/${name}`;

const user_ae_extension_root =
    process.platform === 'win32'
        ? `${process.env.APPDATA}\\cep\\extensions\\${name}`
        : `${process.env.HOME}/Library/Application Support/Adobe/CEP/extensions/${name}`;

export const paths = {
    system_ae_extension_root,
    user_ae_extension_root,

    harness: './harness',
    tests: './test',
    estk: '../estk',
    _build: './_build',
};
