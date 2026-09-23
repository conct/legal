/**
 * Rendert Impressum und Datenschutz in die HTML-Dateien statischer Seiten,
 * die das Paket nicht als Dependency einbinden können (kein Build-Step).
 *
 * Ersetzt ausschließlich:
 *   - den Inhalt von <section class="legal">…</section> (mit oder ohne
 *     innerem <div class="wrap">, mit oder ohne weitere Klassen)
 *   - den Text zwischen <!--legal:anschrift--> und <!--/legal:anschrift-->,
 *     wo immer er steht — in der Regel in der Fußzeile jeder Seite
 *
 * Header, Footer, Styles und alles andere im Template bleiben unangetastet.
 * Die Marken sind der Vertrag: Was nicht markiert ist, wird nicht angefasst.
 *
 *   node scripts/sync-static.mjs <pfad-zum-checkout> <site-key>
 */
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { SITES, anbieterFuer, impressumFuer, datenschutzFuer, PRESETS } from '../dist/index.js';
import { toHtml } from '../dist/render/html.js';

/**
 * Welche Dateien die jeweilige statische Seite hat. Die Datenschutz-Bausteine
 * stehen in src/presets.ts, nicht hier — sonst gäbe es sie zweimal.
 *
 * Weitere Seiten eintragen, sobald sie legal-Seiten im gleichen
 * Template-Aufbau haben (pip-boy/docs/landing hat noch keine).
 */
const STATIC_SITES = {
  'feif.space': {
    dateien: { impressum: 'impressum.html', datenschutz: 'datenschutz.html' },
  },
  'conct.de': {
    dateien: {
      impressum: 'website/impressum/index.html',
      datenschutz: 'website/datenschutz/index.html',
    },
    // Die Seite bringt ihre Ueberschrift selbst mit (Seitenkopf im Template).
    // Ohne diese Angabe stuende "Impressum" zweimal als h1 auf der Seite -
    // fuer einen Screenreader zwei gleichrangige Dokumentanfaenge.
    eigeneUeberschrift: true,
    // Die Anschrift steht in der Fußzeile jeder Seite — also in jeder Datei
    // unter diesem Ordner, die eine Marke trägt. Ohne Marke wird nichts
    // angefasst; eine Datei ohne Fußzeile bleibt damit von selbst außen vor.
    anschriftIn: 'website',
  },
};

/**
 * Zwei Formen, weil zwei Vorlagen im Umlauf sind:
 *
 *   feif.space   <section class="legal"><div class="wrap">…</div></section>
 *   conct.de     <section class="legal max-w-2xl" lang="de">…</section>
 *
 * Die erste passende gewinnt, und es wird nur der ERSTE Treffer ersetzt:
 * conct.de trägt auf der Datenschutzseite noch einen zweiten legal-Abschnitt
 * mit seitenspezifischem Text, der hier nichts zu suchen hat.
 */
const SECTIONS = [
  /(<section class="legal">\s*<div class="wrap">)([\s\S]*?)(<\/div>\s*<\/section>)/,
  /(<section class="legal[^"]*"[^>]*>)([\s\S]*?)(<\/section>)/,
];

const anschriftMarke =
  /(<!--\s*legal:anschrift\s*-->)([\s\S]*?)(<!--\s*\/legal:anschrift\s*-->)/;

/** Rückt das Fragment auf die Einrücktiefe des Templates ein. */
function einruecken(fragment, tiefe) {
  const pad = ' '.repeat(tiefe);
  return fragment
    .split('\n')
    .map((z) => (z.trim() === '' ? '' : pad + z))
    .join('\n');
}

function patchen(pfad, fragment) {
  const alt = readFileSync(pfad, 'utf8');
  const SECTION = SECTIONS.find((re) => re.test(alt));
  const treffer = SECTION && alt.match(SECTION);
  if (!treffer) {
    throw new Error(
      `${pfad}: <section class="legal"> nicht gefunden — ` +
        'Template geändert? Der Sync bricht bewusst ab, statt die Datei zu zerlegen.',
    );
  }

  // Einrücktiefe aus der ersten Inhaltszeile des bisherigen Blocks übernehmen.
  const ersteZeile = treffer[2].split('\n').find((z) => z.trim() !== '') ?? '';
  const tiefe = ersteZeile.length - ersteZeile.trimStart().length;

  const neu = alt.replace(
    SECTION,
    (_, auf, __, zu) => `${auf}\n${einruecken(fragment, tiefe)}\n${' '.repeat(Math.max(tiefe - 2, 0))}${zu}`,
  );

  if (neu === alt) return false;
  writeFileSync(pfad, neu, 'utf8');
  return true;
}

/** Alle .html-Dateien unterhalb eines Ordners, ohne Abhängigkeit. */
function htmlDateien(wurzel) {
  const gefunden = [];
  for (const eintrag of readdirSync(wurzel, { withFileTypes: true })) {
    const pfad = join(wurzel, eintrag.name);
    if (eintrag.isDirectory()) gefunden.push(...htmlDateien(pfad));
    else if (eintrag.name.endsWith('.html')) gefunden.push(pfad);
  }
  return gefunden;
}

/**
 * Die Anschrift als HTML-Schnipsel — ohne umschließendes Element.
 *
 * Das Element samt Klassen bleibt im Template der Seite: Wie eine Fußzeile
 * aussieht, ist Sache der Seite, was in ihr steht, ist Sache dieses Pakets.
 */
function anschriftFragment(siteKey) {
  const a = anbieterFuer(siteKey);
  const zeilen = [a.name, a.strasse, `${a.plz} ${a.ort}`];
  if (a.land) zeilen.push(a.land);
  const html = zeilen.map((z) => escapeHtml(z)).join('<br>');
  const tel = a.telefon
    ? // Die (0) ist die nationale Verkehrsausscheidungsziffer: Sie entfaellt,
      // sobald die Landesvorwahl davorsteht. Bliebe sie stehen, waehlte das
      // Telefon +49 0 611 - und kaeme nirgends an.
      `<br><a href="tel:${a.telefon.replace(/\(0\)/g, '').replace(/[^+\d]/g, '')}">${escapeHtml(a.telefon)}</a>`
    : '';
  const mail = `<br><a href="mailto:${a.email}">${escapeHtml(a.email)}</a>`;
  return html + tel + mail;
}

const escapeHtml = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function anschriftPatchen(pfad, fragment) {
  const alt = readFileSync(pfad, 'utf8');
  if (!anschriftMarke.test(alt)) return false;
  const neu = alt.replace(anschriftMarke, (_, auf, __, zu) => `${auf}${fragment}${zu}`);
  if (neu === alt) return false;
  writeFileSync(pfad, neu, 'utf8');
  return true;
}

const [checkout, siteKey] = process.argv.slice(2);
if (!checkout || !siteKey) {
  console.error('Aufruf: node scripts/sync-static.mjs <checkout> <site-key>');
  process.exit(1);
}

const cfg = STATIC_SITES[siteKey];
const site = SITES[siteKey];
if (!cfg || !site) {
  console.error(`Unbekannte statische Seite: ${siteKey}`);
  console.error(`Bekannt: ${Object.keys(STATIC_SITES).join(', ')}`);
  process.exit(1);
}

if (!PRESETS[siteKey].geprueft) {
  console.warn(
    `Warnung: Das Datenschutz-Preset für ${siteKey} ist in src/presets.ts noch ` +
      'nicht als geprüft markiert.',
  );
}

const docs = {
  impressum: impressumFuer(siteKey),
  datenschutz: datenschutzFuer(siteKey),
};

let geaendert = 0;
for (const [art, datei] of Object.entries(cfg.dateien)) {
  const pfad = join(checkout, datei);
  const fragment = toHtml(docs[art], {
    includeTitle: !cfg.eigeneUeberschrift,
  });
  if (patchen(pfad, fragment)) {
    console.log(`aktualisiert: ${datei}`);
    geaendert++;
  } else {
    console.log(`unverändert:  ${datei}`);
  }
}

if (cfg.anschriftIn) {
  const fragment = anschriftFragment(siteKey);
  let mitMarke = 0;
  for (const pfad of htmlDateien(join(checkout, cfg.anschriftIn))) {
    if (anschriftPatchen(pfad, fragment)) {
      geaendert++;
      mitMarke++;
    }
  }
  console.log(
    mitMarke > 0
      ? `Anschrift in ${mitMarke} Datei(en) erneuert.`
      : 'Anschrift: keine Datei geändert (Marken fehlen oder Text ist aktuell).',
  );
}

console.log(geaendert > 0 ? `${geaendert} Datei(en) geändert.` : 'Nichts zu tun.');
