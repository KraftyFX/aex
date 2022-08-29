import 'mocha/browser-entry';
import '../node_modules/mocha/mocha.css';

mocha.setup({ ui: 'bdd' });

(window as any).mocha = mocha;
