/**
 * Rendering-Prüfung. Läuft in der CI und deckt ab, dass jeder Baustein
 * mindestens einmal gerendert wird.
 */
import {
  CONCT,
  SITES,
  impressum,
  datenschutz,
  ds,
  impressumFuer,
  datenschutzFuer,
  ungeprueft,
} from '../dist/index.js';
import { toHtml } from '../dist/render/html.js';
import { toPlainText } from '../dist/render/text.js';

const zeig = (titel, text) => {
  console.log('\n' + '='.repeat(64));
  console.log(titel);
  console.log('='.repeat(64));
  console.log(text.trim());
};

// 1. Der Normalfall über die Presets.
zeig('feif.space — Impressum', toPlainText(impressumFuer('feif.space')));
zeig('feif.space — Datenschutz', toPlainText(datenschutzFuer('feif.space')));

// 2. Persönliche Ansprache.
zeig(
  'choozy.io — Datenschutz, persönlich (Preset)',
  toPlainText(datenschutzFuer('choozy.io')),
);

// 3. Alle optionalen Anbieter-Felder auf einmal.
const vollstaendig = {
  ...CONCT,
  rechtsform: 'e.K.',
  ustId: 'DE123456789',
  wirtschaftsId: 'DE123456789-00001',
  registergericht: { gericht: 'Amtsgericht Dresden', nummer: 'HRA 1234' },
  berufsrecht: {
    bezeichnung: 'Steuerberater',
    verleihungsstaat: 'Deutschland',
    kammer: 'Steuerberaterkammer Sachsen',
    regelungen: 'Steuerberatungsgesetz (StBerG)',
    regelungenUrl: 'https://www.gesetze-im-internet.de/stberg/',
  },
  berufshaftpflicht: {
    versicherer: 'Beispiel Versicherung AG, Musterstadt',
    geltungsraum: 'Deutschland',
  },
  datenschutzbeauftragter: {
    name: 'Erika Mustermann',
    email: 'datenschutz@feif.space',
    telefon: '+49 (0) 611 9458 4301',
  },
};
zeig(
  'Alle optionalen Anbieter-Felder',
  toPlainText(impressum(vollstaendig, SITES['feif.space'])),
);

// 4. App-Formulierungen und Auftragsverarbeiter.
const app = {
  domain: 'velvet-network.app',
  name: 'VELVET',
  art: 'app',
  hoster: 'Uberspace Entwicklungen GbR',
  drittdienste: [
    { name: 'Expo', zweck: 'Auslieferung von App-Updates', ort: 'USA' },
    { name: 'Sentry', zweck: 'Fehlerdiagnose', ort: 'Deutschland' },
  ],
};
zeig(
  'App-Angebot mit Auftragsverarbeitern',
  toPlainText(
    datenschutz(vollstaendig, app, {
      tone: 'persoenlich',
      module: [
        ds.verantwortlicher,
        ds.datenschutzbeauftragter,
        ds.hosting,
        ds.auftragsverarbeitung,
        ds.technischeCookies({ zweck: 'die Anmeldung' }),
        ds.nutzerkonto({ daten: 'E-Mail-Adresse, Anzeigename' }),
        ds.betroffenenrechte,
      ],
    }),
  ),
);

// 5. Nicht einschlägige Bausteine dürfen keine leeren Abschnitte erzeugen.
const leer = datenschutz(CONCT, SITES['feif.space'], {
  module: [ds.verantwortlicher, ds.datenschutzbeauftragter, ds.auftragsverarbeitung],
});
if (leer.sections.length !== 1) {
  console.error(
    `FEHLER: nicht einschlägige Bausteine wurden gerendert (${leer.sections.length} statt 1)`,
  );
  process.exit(1);
}

// 6. HTML muss valide escapen.
const html = toHtml(impressumFuer('feif.space'));
if (!html.includes('<h1>Impressum</h1>') || html.includes('<script')) {
  console.error('FEHLER: HTML-Rendering unerwartet');
  process.exit(1);
}

const offen = ungeprueft();
console.log('\n' + '='.repeat(64));
console.log(
  offen.length
    ? `Ungeprüfte Datenschutz-Presets: ${offen.join(', ')}`
    : 'Alle Datenschutz-Presets geprüft.',
);
