#!/usr/bin/env node
// Unterscheidet sich der Text, den ein Produkt ausliefert, von dem der Quelle?
//
// stand.mjs vergleicht Fassungsnummern. Die sind die Frage und nicht die
// Antwort: Am 24.11.2026 standen drei Produkte auf 1.22.0 bzw. 1.6.0, waehrend
// die Quelle bei 1.26.0 war - und kein einziges Wort ihrer Rechtstexte war
// anders. Alles, was zwischen 1.6.0 und 1.26.0 passiert ist, betraf andere
// Seiten (Montix, feif.space, Farbecho). Drei Bindungen zu heben, drei Pakete
// zu bauen und dreimal auszuliefern haette daran nichts geaendert.
//
// Darum rendert dieses Skript beide Fassungen und vergleicht den Text selbst:
// das Paket, aus dem das Produkt baut (node_modules oder Arbeitsbaum), gegen
// die dist dieses Checkouts. Gerendert wird beide Male mit dem NEUEN
// Textrenderer, sonst verglichen man zwei Darstellungen und nicht zwei Inhalte.
//
// Welche Seite ein Produkt rendert, steht im Feld "site" seiner erzeugten
// Datei; fuer die Produkte ohne eine solche Datei steht es in
// produkte.mjs (SEITEN_VON_HAND). Ist kein Schluessel bekannt, sagt das Skript
// "Schluessel unbekannt" - und nicht "nichts geaendert".
//
//   node scripts/wortlaut.mjs                 # Geschwisterordner neben Zentrale/
//   node scripts/wortlaut.mjs <pfad>          # anderer Suchort
//   node scripts/wortlaut.mjs --zeigen        # dazu die Unterschiede zeilenweise
//
// Erst `npm run build`, sonst vergleicht es gegen eine alte dist dieses
// Checkouts. Rueckgabe 1, wenn irgendwo ein Wort anders lautet: Dann muss
// jemand ausliefern.

import { existsSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { lies, produkte, quelleVon, seitenVon } from './produkte.mjs';

const HIER = dirname(fileURLToPath(import.meta.url));
const PAKET = resolve(HIER, '..');
const args = process.argv.slice(2);
const zeigen = args.includes('--zeigen');
const SUCHORT = resolve(args.find((a) => !a.startsWith('--')) ?? join(PAKET, '..', '..'));

const quelle = lies(join(PAKET, 'package.json'))?.version;
const NEU = join(PAKET, 'dist');
if (!existsSync(join(NEU, 'index.js'))) {
  console.error(`${NEU} fehlt - erst "npm run build".`);
  process.exit(2);
}

const lade = async (dist) => ({
  kern: await import(pathToFileURL(join(dist, 'index.js')).href),
  text: await import(pathToFileURL(join(dist, 'render', 'text.js')).href),
});

const neu = await lade(NEU);

/** Kuerzeste gemeinsame Teilfolge, zeilenweise - fuer die Ausgabe von --zeigen. */
function unterschied(a, b) {
  const n = a.length;
  const m = b.length;
  const t = Array.from({ length: n + 1 }, () => new Uint32Array(m + 1));
  for (let i = n - 1; i >= 0; i--) {
    for (let j = m - 1; j >= 0; j--) {
      t[i][j] = a[i] === b[j] ? t[i + 1][j + 1] + 1 : Math.max(t[i + 1][j], t[i][j + 1]);
    }
  }
  const aus = [];
  let i = 0;
  let j = 0;
  while (i < n && j < m) {
    if (a[i] === b[j]) {
      i++;
      j++;
    } else if (t[i + 1][j] >= t[i][j + 1]) {
      aus.push(`- ${a[i++]}`);
    } else {
      aus.push(`+ ${b[j++]}`);
    }
  }
  while (i < n) aus.push(`- ${a[i++]}`);
  while (j < m) aus.push(`+ ${b[j++]}`);
  return aus;
}

const alsText = (mod, fn, seite) =>
  neu.text.toMarkdown(mod.kern[fn](seite), { urlsAusschreiben: false });

const zeilen = produkte(SUCHORT);
console.log(`Quelle ${PAKET}: ${quelle}\n`);

let anders = 0;
let offen = 0;
let geprueft = 0;
let entwuerfe = 0;

for (const z of zeilen) {
  const ort = quelleVon(z);
  const seiten = seitenVon(z);
  if (!ort) {
    console.log(`${z.wo}: nicht installiert - nichts zu vergleichen.`);
    offen++;
    continue;
  }
  if (!seiten.length) {
    // Eine erzeugte Datei ohne Seitenschluessel ist ein Entwurf aus den
    // Standardbausteinen der App-Vorlage. Den setzt das Skript des Produkts
    // selbst zusammen; eine Seite, gegen die sich das vergleichen liesse, gibt
    // es hier nicht. Das ist kein fehlender Eintrag, sondern die Auskunft.
    if (z.erzeugt.length && z.erzeugt.every((a) => !a.site)) {
      console.log(
        `${z.wo}: Entwurf aus den Standardbausteinen der App-Vorlage, kein Preset - nichts zu vergleichen.`
      );
      entwuerfe++;
    } else {
      console.log(`${z.wo}: Schluessel unbekannt - in produkte.mjs eintragen (SEITEN_VON_HAND).`);
      offen++;
    }
    continue;
  }
  let alt;
  try {
    alt = await lade(ort.dist);
  } catch (e) {
    console.log(`${z.wo}: ${ort.wo} ${ort.fassung} laesst sich nicht laden - ${e.message}`);
    offen++;
    continue;
  }
  for (const seite of seiten) {
    const teile = [];
    for (const [art, fn] of [
      ['Impressum', 'impressumFuer'],
      ['Datenschutz', 'datenschutzFuer'],
    ]) {
      let a;
      let b;
      try {
        a = alsText(alt, fn, seite);
        b = alsText(neu, fn, seite);
      } catch (e) {
        teile.push(`${art}: nicht vergleichbar (${e.message})`);
        offen++;
        continue;
      }
      geprueft++;
      if (a === b) {
        teile.push(`${art} gleich`);
        continue;
      }
      anders++;
      const d = unterschied(a.split('\n'), b.split('\n'));
      teile.push(`${art} ANDERS (${d.length} Zeilen)`);
      if (zeigen) {
        for (const zeile of d) console.log(`    ${zeile}`);
      }
    }
    console.log(
      `${z.wo}  ${ort.fassung} (${ort.wo})  ${seite}: ${teile.join(', ')}`
    );
  }
}

console.log();
if (anders) {
  console.log(`${anders} Seite(n) lauten anders als die Quelle - dort muss jemand ausliefern.`);
  console.log('Mit --zeigen steht zeilenweise da, was sich aendert. Es sind Rechtstexte:');
  console.log('erst lesen, dann die Bindung heben.');
} else if (geprueft) {
  console.log(`${geprueft} Seite(n) geprueft, alle Wort fuer Wort gleich wie in der Quelle.`);
  console.log('Eine alte Bindung heisst hier also nichts: Nachziehen wuerde den');
  console.log('ausgelieferten Text nicht aendern. Es lohnt sich beim naechsten Mal,');
  console.log('wenn an diesen Seiten wirklich etwas geaendert wurde.');
}
if (entwuerfe) {
  console.log();
  console.log(`${entwuerfe} Produkt(e) liefern einen Entwurf aus der App-Vorlage aus.`);
  console.log('Die haengen an keinem Preset: Was dort steht, bestimmt das Skript des');
  console.log('Produkts aus app.json und den Standardbausteinen. Wer so eine App');
  console.log('ernst nimmt, traegt sie in sites.ts und presets.ts ein - dann ist ihr');
  console.log('Text hier nachlesbar und faellt bei Aenderungen auf.');
}
if (offen) {
  console.log();
  console.log(`${offen} Stelle(n) konnte das Skript nicht vergleichen - siehe oben.`);
}
if (anders) process.exit(1);
