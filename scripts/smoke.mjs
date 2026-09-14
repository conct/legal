import { CONCT, SITES, impressum, datenschutz, ds } from '../dist/index.js';
import { toHtml } from '../dist/render/html.js';
import { toPlainText } from '../dist/render/text.js';

const site = SITES['feif.space'];
console.log('='.repeat(60));
console.log(toPlainText(impressum(CONCT, site)));
console.log('='.repeat(60));
const module = [ds.verantwortlicher, ds.hosting, ds.kontaktformular(), ds.keineCookies, ds.externeLinks, ds.betroffenenrechte, ds.aktualitaet];
console.log(toPlainText(datenschutz(CONCT, site, { module })).slice(0, 900));
console.log('--- PERSÖNLICH (Auszug) ---');
console.log(toPlainText(datenschutz(CONCT, SITES['choozy.io'], { tone: 'persoenlich', module: [ds.betroffenenrechte] })).slice(0, 700));
console.log('--- HTML-FRAGMENT (Auszug) ---');
console.log(toHtml(impressum(CONCT, site)).slice(0, 500));
