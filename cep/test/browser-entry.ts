declare var cep_node: any;

import 'mocha/browser-entry';
import '../node_modules/mocha/mocha.css';

mocha.setup({ ui: 'bdd' });

window.addEventListener('load', () => {
    mocha.run();
});
