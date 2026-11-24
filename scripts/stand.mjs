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
// Gelesen wird in zwei Schritten, und der zweite ist der wichtigere. Die
// Bindung sagt, was npm installiert - nicht, woraus die Texte im Bundle erzeugt
// wurden. Wer mit LEGAL_PATH aus einem Checkout erzeugt, haengt in der Spalte
// "Bindung" zurueck und liefert trotzdem neueren Wortlaut aus. Genau das war am
// 23.11.2026 bei Kilpro der Fall: Bindung 1.16.0, erzeugte texte.json aus
// 1.24.0 - und ich habe daraus eine Warnung gemacht, die nicht stimmte.
//
// Darum sieht das Skript zuerst in der erzeugten Datei des Produkts nach
// (texte.json) und liest deren Feld "fassung". Steht es da, ist die Zeile ein
// Befund. Steht die Datei da, aber ohne das Feld, sagt das Skript genau das -
// und erfindet keine Auskunft. Liegt keine erzeugte Datei im Baum, rendert das
// Produkt aus dem installierten Paket, und dann entscheidet die Bindung.
//
// Eine alte Bindung heisst uebrigens nicht von selbst alter Text: Ob sich am
// Wortlaut ueberhaupt etwas geaendert hat, sagt `npm run wortlaut`. Diese
// Fassungsnummern sind die Frage, nicht die Antwort.
//
// Dieses Skript beantwortet genau diese Frage und sonst keine. Es aendert nichts.
//
//   node scripts/stand.mjs            # Geschwisterordner neben Zentrale/
//   node scripts/stand.mjs <pfad>     # anderer Suchort
//
// Rueckgabe 1, wenn irgendetwas zurueckhaengt - damit es in einer Pruefkette
// auffaellt und nicht nur auf dem Schirm.

import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { NAME, lies, produkte } from './produkte.mjs';

const HIER = dirname(fileURLToPath(import.meta.url));
const PAKET = resolve(HIER, '..');
const SUCHORT = resolve(process.argv[2] ?? join(PAKET, '..', '..'));

const quelle = lies(join(PAKET, 'package.json'))?.version;
if (!quelle) {
  console.error('Keine Version in package.json gefunden.');
  process.exit(2);
}

const zeilen = produkte(SUCHORT);

if (!zeilen.length) {
  console.log(`Keine Bindung an ${NAME} unter ${SUCHORT} gefunden.`);
  process.exit(0);
}

const breite = Math.max(...zeilen.map((z) => z.wo.length), 7);
console.log(`Quelle ${PAKET}: ${quelle}\n`);
console.log(
  `${'Produkt'.padEnd(breite)}  ${'Bindung'.padEnd(9)} ${'liegt'.padEnd(8)} ${'liefert'.padEnd(8)} Stand`
);

let zurueck = 0;
let unklar = 0;
for (const z of zeilen) {
  const fassungen = [...new Set(z.erzeugt.map((a) => a.fassung))];
  const ohneVermerk = z.erzeugt.find((a) => !a.fassung);
  let liefert = '-';
  let stand;
  if (!z.erzeugt.length) {
    // Keine erzeugte Datei: Das Produkt rendert aus dem installierten Paket,
    // also ist die Bindung die Auskunft.
    const alt = z.tag !== quelle;
    if (alt) zurueck++;
    stand = !z.tag
      ? 'ohne Tag gebunden'
      : alt ? `haengt zurueck (${z.tag} -> ${quelle})` : 'aktuell';
  } else if (ohneVermerk) {
    unklar++;
    liefert = '?';
    stand = `${ohneVermerk.datei} ohne Feld "fassung" - was ausgeliefert wird, sagt hier niemand`;
  } else {
    liefert = fassungen.join(',');
    const alt = fassungen.some((f) => f !== quelle);
    if (alt) zurueck++;
    stand = alt ? `liefert ${liefert} aus (Quelle ${quelle})` : 'aktuell, am erzeugten Text gelesen';
  }
  // Gewarnt wird nur, wenn die Bindung in KEINEM Ordner liegt - im Hauptordner
  // so wenig wie in einem Arbeitsbaum. Liegt sie in einem Baum, ist das die
  // Auskunft und keine Abweichung; der Hauptordner hinkt dann absichtlich.
  const baum = z.tag ? z.baeume.find((x) => x.fassung === z.tag) : null;
  const orte = [
    ...(z.installiert ? [`Hauptordner ${z.installiert}`] : []),
    ...z.baeume.map((x) => `${x.wo} ${x.fassung}`),
  ];
  const abweichend = !z.tag || !orte.length
    ? ''
    : baum
      ? `  (${z.tag} liegt im Arbeitsbaum ${baum.wo}${z.installiert && z.installiert !== z.tag ? `, im Hauptordner ${z.installiert}` : ''})`
      : z.installiert === z.tag
        ? ''
        : `  ACHTUNG: installiert ist ${orte.join(', ')}, gebunden ${z.tag}`;
  console.log(
    `${z.wo.padEnd(breite)}  ${(z.tag ?? '-').padEnd(9)} ${(z.installiert ?? '-').padEnd(8)} ${liefert.padEnd(8)} ${stand}${abweichend}`
  );
}

console.log();
if (zurueck) {
  console.log(`${zurueck} von ${zeilen.length} Produkten haengen zurueck.`);
  console.log('Nachziehen heisst: Tag setzen, in jedem Produkt die Bindung erhoehen,');
  console.log('neu installieren, abgeleitete Texte erzeugen, ausliefern - und vorher');
  console.log('lesen, was sich am Wortlaut aendert. Es sind Rechtstexte.');
  console.log('Was sich aendert, sagt `npm run wortlaut`: Steht dort "gleich",');
  console.log('aendert das Nachziehen am ausgelieferten Text kein Wort.');
}
if (unklar) {
  if (zurueck) console.log();
  console.log(`${unklar} Produkt(e) erzeugen ihre Texte, sagen aber nicht, woraus.`);
  console.log('Diese Zeilen sind ein Verdacht und kein Befund: Die Bindung daneben');
  console.log('sagt nur, was installiert ist. Abhilfe im erzeugenden Skript des');
  console.log('Produkts - die Fassung des geladenen Pakets mitschreiben, egal ob');
  console.log('aus node_modules oder aus LEGAL_PATH:');
  console.log();
  console.log('  const fassung = JSON.parse(readFileSync(join(wurzel, "package.json"), "utf8")).version;');
  console.log('  texte = { fassung, site: key, ... };');
}
if (zurueck) process.exit(1);
if (!unklar) console.log('Alle Produkte liefern den Stand der Quelle aus.');
