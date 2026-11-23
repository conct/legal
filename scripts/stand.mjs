#!/usr/bin/env node
// Welches Produkt haengt auf welcher Fassung der Rechtstexte?
//
// Die Produkte binden @conct/legal ueber einen Git-Tag ("github:conct/legal#v1.6.0").
// Das ist Absicht und kein Versehen: Rechtstexte gehen in App-Store-Pruefungen und
// in Vertraege, und die Bindung haelt fest, mit welchem Wortlaut eine Fassung
// ausgeliefert wurde. Eine Verknuepfung statt einer Bindung wuerde den Wortlaut
// jedes Produkts in dem Augenblick aendern, in dem jemand sites.ts anfasst.
//
// Der Preis der Bindung ist, dass niemand merkt, wenn sie alt wird. Am 15.11.2026
// standen sechs von acht Installationen auf 1.6.0, zwei auf 1.16.0 und die Quelle
// auf 1.19.0 - dazwischen liegen Korrekturen wie "die Grundlage fuer die USA
// benannt" (v1.14.0), die nie bei den Produkten ankamen.
//
// Dieses Skript beantwortet genau diese Frage und sonst keine. Es aendert nichts.
//
//   node scripts/stand.mjs            # Geschwisterordner neben Zentrale/
//   node scripts/stand.mjs <pfad>     # anderer Suchort
//
// Rueckgabe 1, wenn irgendetwas zurueckhaengt - damit es in einer Pruefkette
// auffaellt und nicht nur auf dem Schirm.

import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, dirname, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const HIER = dirname(fileURLToPath(import.meta.url));
const PAKET = resolve(HIER, '..');
const SUCHORT = resolve(process.argv[2] ?? join(PAKET, '..', '..'));
const NAME = '@conct/legal';

const lies = (p) => { try { return JSON.parse(readFileSync(p, 'utf8')); } catch { return null; } };

const quelle = lies(join(PAKET, 'package.json'))?.version;
if (!quelle) { console.error('Keine Version in package.json gefunden.'); process.exit(2); }

// package.json-Dateien einsammeln, node_modules und .git ausgelassen.
function sammle(ordner, tiefe = 0, aus = []) {
  if (tiefe > 4) return aus;
  let eintraege;
  try { eintraege = readdirSync(ordner, { withFileTypes: true }); } catch { return aus; }
  for (const e of eintraege) {
    if (e.isDirectory()) {
      // .claude haelt Arbeitsbaeume - dieselben Produkte ein zweites Mal.
      if (['node_modules', '.git', 'dist', '.claude'].includes(e.name)) continue;
      sammle(join(ordner, e.name), tiefe + 1, aus);
    } else if (e.name === 'package.json') {
      aus.push(join(ordner, e.name));
    }
  }
  return aus;
}

// Die installierte Fassung zu einer package.json finden: npm hebt Abhaengigkeiten
// an die Wurzel des Arbeitsbereichs, also auch dort nachsehen.
function installiert(pjad) {
  let d = dirname(pjad);
  for (let i = 0; i < 5; i++) {
    const p = join(d, 'node_modules', ...NAME.split('/'), 'package.json');
    if (existsSync(p)) return lies(p)?.version ?? '?';
    const hoch = dirname(d);
    if (hoch === d) break;
    d = hoch;
  }
  return null;
}

const zeilen = [];
for (const pjad of sammle(SUCHORT)) {
  const d = lies(pjad);
  if (!d) continue;
  const gebunden =
    d.dependencies?.[NAME] ?? d.devDependencies?.[NAME] ?? d.optionalDependencies?.[NAME];
  if (!gebunden) continue;
  const tag = /#v?([0-9][0-9.]*)/.exec(gebunden)?.[1] ?? null;
  zeilen.push({
    wo: relative(SUCHORT, dirname(pjad)) || '.',
    gebunden,
    tag,
    installiert: installiert(pjad),
  });
}

if (!zeilen.length) {
  console.log(`Keine Bindung an ${NAME} unter ${SUCHORT} gefunden.`);
  process.exit(0);
}

zeilen.sort((a, b) => a.wo.localeCompare(b.wo));
const breite = Math.max(...zeilen.map((z) => z.wo.length), 7);
console.log(`Quelle ${PAKET}: ${quelle}\n`);
console.log(`${'Produkt'.padEnd(breite)}  ${'Bindung'.padEnd(9)} ${'liegt'.padEnd(8)} Stand`);

let zurueck = 0;
for (const z of zeilen) {
  const alt = z.tag !== quelle;
  if (alt) zurueck++;
  const stand = !z.tag ? 'ohne Tag gebunden' : alt ? `haengt zurueck (${z.tag} -> ${quelle})` : 'aktuell';
  const abweichend = z.installiert && z.tag && z.installiert !== z.tag
    ? `  ACHTUNG: installiert ist ${z.installiert}, gebunden ${z.tag}` : '';
  console.log(
    `${z.wo.padEnd(breite)}  ${(z.tag ?? '-').padEnd(9)} ${(z.installiert ?? '-').padEnd(8)} ${stand}${abweichend}`
  );
}

console.log();
if (zurueck) {
  console.log(`${zurueck} von ${zeilen.length} Bindungen haengen zurueck.`);
  console.log('Nachziehen heisst: Tag setzen, in jedem Produkt die Bindung erhoehen,');
  console.log('neu installieren, abgeleitete Texte erzeugen, ausliefern - und vorher');
  console.log('lesen, was sich am Wortlaut aendert. Es sind Rechtstexte.');
  console.log();
  console.log('Gelesen wird dabei nur die Bindung in package.json, nicht der Text,');
  console.log('den das Produkt wirklich ausliefert. Wer seine Texte mit LEGAL_PATH');
  console.log('aus einem Checkout erzeugt, haengt hier zurueck und zeigt trotzdem');
  console.log('einen neueren Wortlaut - bei Kilpro stand am 23.11.2026 die Bindung');
  console.log('auf 1.16.0, die erzeugte texte.json kam aus einem Stand von 1.24.0.');
  console.log('Diese Zeilen sind also ein Verdacht und kein Befund: nachsehen,');
  console.log('woraus die abgeleitete Datei des Produkts erzeugt wurde.');
  process.exit(1);
}
console.log('Alle Bindungen sind aktuell.');
