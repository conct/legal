// Wer bindet @conct/legal, was liegt dort installiert, was ist daraus erzeugt?
//
// Gemeinsame Grundlage von stand.mjs (welche Fassung liegt wo?) und
// wortlaut.mjs (unterscheidet sich der Text?). Zweimal gesucht waere zweimal zu
// pflegen - und die Fehlalarme vom 23. und 24.11.2026 kamen alle daher, dass
// eine Pruefung an der falschen Stelle nachgesehen hat. Diese Stelle gibt es
// jetzt nur einmal.
//
// Liest ausschliesslich. Fasst keinen fremden Arbeitsbaum an.

import { readFileSync, readdirSync } from 'node:fs';
import { join, dirname, relative } from 'node:path';

export const NAME = '@conct/legal';

export const lies = (p) => {
  try {
    return JSON.parse(readFileSync(p, 'utf8'));
  } catch {
    return null;
  }
};

/**
 * Seiten-Schluessel der Produkte, die ihre Rechtstexte beim Bauen rendern und
 * keine erzeugte Datei im Baum liegen lassen. Dort steht der Schluessel im
 * Quelltext und in keiner Datei, die sich maschinell lesen liesse:
 *
 *   rechnungswerk/apps/website  src/pages/datenschutz.astro, datenschutz-app.astro,
 *                               impressum.astro
 *   Trader/.pruefstand          backen.mjs, `const SITE`
 *   VELVET/apps/dashboard       lib/legal-texte.ts, `export const SITE`
 *
 * Von Hand eingetragen, weil Raten schlimmer ist als Nachsehen: Fehlt ein
 * Eintrag, sagt wortlaut.mjs "Schluessel unbekannt" - und nicht "nichts
 * geaendert".
 */
export const SEITEN_VON_HAND = {
  'rechnungswerk/apps/website': ['rechnungswerk.conct.de', 'rechnungswerk-app'],
  'Trader/.pruefstand': ['walkforward.conct.de'],
  'VELVET/apps/dashboard': ['velvet-network.app'],
};

/** package.json-Dateien einsammeln, node_modules und .git ausgelassen. */
export function sammle(ordner, tiefe = 0, aus = []) {
  if (tiefe > 4) return aus;
  let eintraege;
  try {
    eintraege = readdirSync(ordner, { withFileTypes: true });
  } catch {
    return aus;
  }
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

const paketOrdner = (wurzel) => join(wurzel, 'node_modules', ...NAME.split('/'));

/**
 * Wo das Paket zu dieser package.json wirklich liegt - mit Fassung und Pfad.
 *
 * Zwei Orte zaehlen. Erstens die Kette nach oben: npm hebt Abhaengigkeiten an
 * die Wurzel des Arbeitsbereichs. Zweitens die Arbeitsbaeume unter
 * .claude/worktrees, denn gebaut und ausgeliefert wird oft dort und nicht im
 * Hauptordner, der nur den Stand des Hauptzweigs haelt. Am 24.11.2026 lag im
 * Hauptordner von Kilpro 1.16.0 und im Arbeitsbaum 1.26.0; meine Warnung
 * "installiert ist 1.16.0" war eine ueber den falschen Ordner.
 */
export function installationen(pjad) {
  const aus = [];
  let d = dirname(pjad);
  for (let i = 0; i < 5; i++) {
    const p = paketOrdner(d);
    const v = lies(join(p, 'package.json'))?.version;
    if (v) {
      aus.push({ wo: 'Hauptordner', fassung: v, dist: join(p, 'dist') });
      break;
    }
    const hoch = dirname(d);
    if (hoch === d) break;
    d = hoch;
  }
  const baeume = join(dirname(pjad), '.claude', 'worktrees');
  let eintraege;
  try {
    eintraege = readdirSync(baeume, { withFileTypes: true });
  } catch {
    eintraege = [];
  }
  for (const e of eintraege) {
    if (!e.isDirectory()) continue;
    const p = paketOrdner(join(baeume, e.name));
    const v = lies(join(p, 'package.json'))?.version;
    if (v) aus.push({ wo: e.name, fassung: v, dist: join(p, 'dist') });
  }
  return aus;
}

/**
 * Die erzeugten Rechtstexte eines Produkts. Der Name ist der aus der
 * App-Vorlage (src/features/legal/texte.json), der Ort nicht: Rechnungswerk
 * legt sie unter src/legal, VELVET unter lib/legal.
 *
 * Gelesen werden zwei Felder. "fassung" sagt, woraus die Datei erzeugt wurde -
 * das schreibt das erzeugende Skript des Produkts aus der package.json des
 * Pakets, das es geladen hat, auch wenn das ein Checkout war. "site" sagt,
 * welche Seite gerendert wurde; damit weiss wortlaut.mjs, was es vergleichen
 * muss, ohne dass jemand es ihm sagt.
 */
export function erzeugte(ordner, tiefe = 0, aus = []) {
  if (tiefe > 4) return aus;
  let eintraege;
  try {
    eintraege = readdirSync(ordner, { withFileTypes: true });
  } catch {
    return aus;
  }
  for (const e of eintraege) {
    if (e.isDirectory()) {
      if (['node_modules', '.git', 'dist', '.claude', 'android', 'ios'].includes(e.name)) continue;
      erzeugte(join(ordner, e.name), tiefe + 1, aus);
    } else if (e.name === 'texte.json') {
      const d = lies(join(ordner, e.name));
      // Nur was wirklich Rechtstexte sind - "texte.json" heisst anderswo anderes.
      if (d && (d.datenschutz || d.impressum)) {
        aus.push({
          datei: join(ordner, e.name),
          fassung: d.fassung ?? null,
          site: d.site ?? null,
          // "entwurf" heisst: kein Preset, sondern die Standardbausteine der
          // App-Vorlage, zusammengesetzt im Skript des Produkts. Dazu gibt es
          // in diesem Paket keine Seite, gegen die sich vergleichen liesse.
          entwurf: d.entwurf ?? null,
        });
      }
    }
  }
  return aus;
}

/** Alle Produkte unter dem Suchort, die @conct/legal binden. */
export function produkte(suchort) {
  const zeilen = [];
  for (const pjad of sammle(suchort)) {
    const d = lies(pjad);
    if (!d) continue;
    const gebunden =
      d.dependencies?.[NAME] ?? d.devDependencies?.[NAME] ?? d.optionalDependencies?.[NAME];
    if (!gebunden) continue;
    const ordner = dirname(pjad);
    const wo = relative(suchort, ordner) || '.';
    const orte = installationen(pjad);
    zeilen.push({
      wo,
      schluessel: wo.split(/[\\/]/).join('/'),
      ordner,
      gebunden,
      tag: /#v?([0-9][0-9.]*)/.exec(gebunden)?.[1] ?? null,
      orte,
      installiert: orte.find((o) => o.wo === 'Hauptordner')?.fassung ?? null,
      baeume: orte.filter((o) => o.wo !== 'Hauptordner'),
      erzeugt: erzeugte(ordner).map((a) => ({
        datei: relative(ordner, a.datei),
        fassung: a.fassung,
        site: a.site,
        entwurf: a.entwurf,
      })),
    });
  }
  zeilen.sort((a, b) => a.wo.localeCompare(b.wo));
  return zeilen;
}

/** Die Seiten, die ein Produkt rendert - aus der erzeugten Datei oder von Hand. */
export function seitenVon(zeile) {
  const aus = new Set(zeile.erzeugt.map((a) => a.site).filter(Boolean));
  for (const s of SEITEN_VON_HAND[zeile.schluessel] ?? []) aus.add(s);
  return [...aus];
}

/**
 * Das Paket, aus dem dieses Produkt wirklich baut: der Arbeitsbaum, in dem die
 * gebundene Fassung liegt, sonst der Hauptordner.
 */
export function quelleVon(zeile) {
  return (
    (zeile.tag && zeile.orte.find((o) => o.wo !== 'Hauptordner' && o.fassung === zeile.tag)) ||
    zeile.orte.find((o) => o.wo === 'Hauptordner') ||
    zeile.orte[0] ||
    null
  );
}
