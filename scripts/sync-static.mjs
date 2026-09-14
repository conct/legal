/**
 * Rendert Impressum und Datenschutz in die HTML-Dateien statischer Seiten,
 * die das Paket nicht als Dependency einbinden können (kein Build-Step).
 *
 * Ersetzt ausschließlich den Inhalt von <section class="legal"><div class="wrap">…</div></section>.
 * Header, Footer, Styles und alles andere im Template bleiben unangetastet.
 *
 *   node scripts/sync-static.mjs <pfad-zum-checkout> <site-key>
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { CONCT, SITES, impressum, datenschutz, ds } from '../dist/index.js';
import { toHtml } from '../dist/render/html.js';

/** Welche Datenschutz-Bausteine die jeweilige statische Seite braucht. */
// Weitere statische Seiten hier eintragen, sobald sie legal-Seiten im
// gleichen Template-Aufbau haben (pip-boy/docs/landing hat noch keine).
const STATIC_SITES = {
  'feif.space': {
    module: [
      ds.verantwortlicher,
      ds.hosting,
      ds.kontaktformular(),
      ds.keineCookies,
      ds.externeLinks,
      ds.betroffenenrechte,
      ds.aktualitaet,
    ],
    tone: 'formell',
    dateien: { impressum: 'impressum.html', datenschutz: 'datenschutz.html' },
  },
};

const SECTION = /(<section class="legal">\s*<div class="wrap">)([\s\S]*?)(<\/div>\s*<\/section>)/;

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
  const treffer = alt.match(SECTION);
  if (!treffer) {
    throw new Error(
      `${pfad}: <section class="legal"><div class="wrap"> nicht gefunden — ` +
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

const docs = {
  impressum: impressum(CONCT, site),
  datenschutz: datenschutz(CONCT, site, { tone: cfg.tone, module: cfg.module }),
};

let geaendert = 0;
for (const [art, datei] of Object.entries(cfg.dateien)) {
  const pfad = join(checkout, datei);
  if (patchen(pfad, toHtml(docs[art]))) {
    console.log(`aktualisiert: ${datei}`);
    geaendert++;
  } else {
    console.log(`unverändert:  ${datei}`);
  }
}

console.log(geaendert > 0 ? `${geaendert} Datei(en) geändert.` : 'Nichts zu tun.');
