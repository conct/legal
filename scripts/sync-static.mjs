/**
 * Rendert Impressum und Datenschutz in die HTML-Dateien statischer Seiten,
 * die das Paket nicht als Dependency einbinden können (kein Build-Step).
 *
 * Ersetzt ausschließlich:
 *   - den Inhalt von <section class="legal">…</section> (mit oder ohne
 *     innerem <div class="wrap">, mit oder ohne weitere Klassen)
 *   - den Text zwischen <!--legal:anschrift--> und <!--/legal:anschrift-->,
 *     bzw. <!--legal:postanschrift--> fuer die Anschrift ohne Telefon
 *     und E-Mail (fuer Seiten, die beides ohnehin einzeln nennen),
 *     wo immer er steht — in der Regel in der Fußzeile jeder Seite
 *   - die Liste `sameAs` im JSON-LD-Knoten, der sich als #organization
 *     ausweist (siehe sameAsPatchen)
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
    // Je Art mehrere Dateien: Die englischen Seiten tragen dieselben
    // deutschen Rechtstexte - ein Impressum nach § 5 DDG ist auf Deutsch zu
    // fuehren. Sie standen bisher nicht im Sync und waren entsprechend
    // veraltet: sechs Abschnitte im Datenschutz statt zehn.
    dateien: {
      impressum: ['website/impressum/index.html', 'website/en/imprint/index.html'],
      datenschutz: ['website/datenschutz/index.html', 'website/en/privacy/index.html'],
    },
    // Die Seite bringt ihre Ueberschrift selbst mit (Seitenkopf im Template).
    // Ohne diese Angabe stuende "Impressum" zweimal als h1 auf der Seite -
    // fuer einen Screenreader zwei gleichrangige Dokumentanfaenge.
    eigeneUeberschrift: true,
    // Die Anschrift steht in der Fußzeile jeder Seite — also in jeder Datei
    // unter diesem Ordner, die eine Marke trägt. Ohne Marke wird nichts
    // angefasst; eine Datei ohne Fußzeile bleibt damit von selbst außen vor.
    anschriftIn: 'website',
    // Dieselbe Wurzel: Die Betriebsauszeichnung steht nur auf den beiden
    // Startseiten, und genau die tragen den #organization-Knoten. Alle
    // anderen Dateien bleiben von selbst aussen vor.
    sameAsIn: 'website',
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

// Zweite Marke: nur die Postanschrift, ohne Telefon und E-Mail. Gedacht fuer
// Seiten, die beide Wege ohnehin einzeln und beschriftet nennen - auf der
// Kontaktseite stand sonst alles doppelt.
const postMarke =
  /(<!--\s*legal:postanschrift\s*-->)([\s\S]*?)(<!--\s*\/legal:postanschrift\s*-->)/;

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
function postFragment(siteKey) {
  const a = anbieterFuer(siteKey);
  const zeilen = [a.name, a.strasse, `${a.plz} ${a.ort}`];
  if (a.land) zeilen.push(a.land);
  return zeilen.map((z) => escapeHtml(z)).join('<br>');
}

function anschriftFragment(siteKey) {
  const a = anbieterFuer(siteKey);
  const html = postFragment(siteKey);
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

/**
 * Die Liste `sameAs` in der Betriebsauszeichnung setzen.
 *
 * Für Anschrift und Rechtstexte gibt es eine Marke im HTML. In JSON-LD gibt es
 * keine, also übernimmt die `@id` ihre Rolle: Angefasst wird nur ein Knoten,
 * der sich selbst als `…#organization` ausweist. Wer diese Kennung setzt, sagt
 * damit, welcher Knoten den Betrieb beschreibt.
 *
 * Geschrieben wird außerdem nur, wenn der Block unverändert wieder
 * herauskommt, wie er hereinkam — sonst schriebe der Sync die Formatierung
 * fremder Blöcke um, und "was nicht markiert ist, bleibt" wäre gebrochen. Ein
 * Block in anderer Form wird gemeldet, nicht stillschweigend übergangen.
 */
const LD_BLOCK = /(<script type="application\/ld\+json">)(\s*)([\s\S]*?)(\s*)(<\/script>)/g;

function sameAsPatchen(pfad, profile) {
  const alt = readFileSync(pfad, 'utf8');
  let neu = alt;
  let getan = false;
  const uebergangen = [];

  for (const m of [...alt.matchAll(LD_BLOCK)]) {
    const roh = m[3];
    let daten;
    try {
      daten = JSON.parse(roh);
    } catch {
      continue;
    }
    const liste = Array.isArray(daten) ? daten : [daten];
    const org = liste.find(
      (o) => o && typeof o === 'object' && String(o['@id'] ?? '').endsWith('#organization'),
    );
    if (!org) continue;
    if (JSON.stringify(daten) !== roh) {
      uebergangen.push(pfad);
      continue;
    }
    const vorher = JSON.stringify(org.sameAs ?? null);
    if (profile && profile.length > 0) org.sameAs = profile;
    else delete org.sameAs;
    if (JSON.stringify(org.sameAs ?? null) === vorher) continue;
    // Eine Funktion als Ersetzung: In einem String würden $& und $' gedeutet.
    const gesetzt = JSON.stringify(daten);
    neu = neu.replace(roh, () => gesetzt);
    getan = true;
  }

  for (const pf of uebergangen) {
    console.warn(
      `Hinweis: ${pf} trägt einen #organization-Knoten in anderer Formatierung — ` +
        'sameAs wurde dort nicht gesetzt, um den Block nicht umzuschreiben.',
    );
  }
  if (!getan) return false;
  writeFileSync(pfad, neu, 'utf8');
  return true;
}

function markePatchen(pfad, marke, fragment) {
  const alt = readFileSync(pfad, 'utf8');
  if (!marke.test(alt)) return false;
  const neu = alt.replace(marke, (_, auf, __, zu) => `${auf}${fragment}${zu}`);
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
for (const [art, wert] of Object.entries(cfg.dateien)) {
  // Eine Datei oder mehrere - dieselbe Fassung, mehrere Ziele.
  for (const datei of Array.isArray(wert) ? wert : [wert]) {
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
}

if (cfg.anschriftIn) {
  const formen = [
    ['Anschrift', anschriftMarke, anschriftFragment(siteKey)],
    ['Postanschrift', postMarke, postFragment(siteKey)],
  ];
  for (const [name, marke, fragment] of formen) {
    let mitMarke = 0;
    for (const pfad of htmlDateien(join(checkout, cfg.anschriftIn))) {
      if (markePatchen(pfad, marke, fragment)) {
        geaendert++;
        mitMarke++;
      }
    }
    console.log(
      mitMarke > 0
        ? `${name} in ${mitMarke} Datei(en) erneuert.`
        : `${name}: keine Datei geändert (Marken fehlen oder Text ist aktuell).`,
    );
  }
}

if (cfg.sameAsIn) {
  const profile = anbieterFuer(siteKey).profile ?? [];
  let mit = 0;
  for (const pfad of htmlDateien(join(checkout, cfg.sameAsIn))) {
    if (sameAsPatchen(pfad, profile)) {
      geaendert++;
      mit++;
    }
  }
  console.log(
    mit > 0
      ? `sameAs in ${mit} Datei(en) erneuert.`
      : 'sameAs: keine Datei geändert (kein #organization-Knoten oder Liste ist aktuell).',
  );
}

console.log(geaendert > 0 ? `${geaendert} Datei(en) geändert.` : 'Nichts zu tun.');
