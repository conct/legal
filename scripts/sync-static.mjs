/**
 * Rendert Impressum und Datenschutz in die HTML-Dateien statischer Seiten,
 * die das Paket nicht als Dependency einbinden können (kein Build-Step).
 *
 * Eine Seite kann dabei auch nur einen Teil beziehen: Wer kein `dateien`
 * einträgt, behält seine Rechtstexte selbst und bekommt nur, was er sonst
 * angibt (heute: feif.space, dort die Profile sichtbar und als `sameAs`).
 *
 * Ersetzt ausschließlich:
 *   - den Inhalt von <section class="legal">…</section> (mit oder ohne
 *     innerem <div class="wrap">, mit oder ohne weitere Klassen)
 *   - den Text zwischen <!--legal:anschrift--> und <!--/legal:anschrift-->,
 *     bzw. <!--legal:postanschrift--> fuer die Anschrift ohne Telefon
 *     und E-Mail (fuer Seiten, die beides ohnehin einzeln nennen),
 *     wo immer er steht — in der Regel in der Fußzeile jeder Seite
 *   - den Text zwischen <!--legal:profile--> und <!--/legal:profile-->: die
 *     hinterlegten Profile als sichtbare Links, dieselbe Liste wie in sameAs
 *   - die Liste `sameAs` in dem JSON-LD-Knoten, den die Seite dafuer benennt
 *     (Default #organization, je Seite ueber sameAsId anders; siehe
 *     sameAsPatchen)
 *
 * Header, Footer, Styles und alles andere im Template bleiben unangetastet.
 * Die Marken sind der Vertrag: Was nicht markiert ist, wird nicht angefasst.
 *
 *   node scripts/sync-static.mjs <pfad-zum-checkout> <site-key>
 */
import { existsSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { SITES, anbieterFuer, impressumFuer, datenschutzFuer, PRESETS } from '../dist/index.js';
import { toHtml } from '../dist/render/html.js';
import { toMarkdown } from '../dist/render/text.js';

/**
 * Welche Dateien die jeweilige statische Seite hat. Die Datenschutz-Bausteine
 * stehen in src/presets.ts, nicht hier — sonst gäbe es sie zweimal.
 *
 * Weitere Seiten eintragen, sobald sie legal-Seiten im gleichen
 * Template-Aufbau haben (pip-boy/docs/landing hat noch keine).
 */
const STATIC_SITES = {
  'feif.space': {
    // Kein `dateien`, und das ist eine Entscheidung, kein Versehen: Impressum
    // und Datenschutz stehen dort von Hand im Template und sind ausfuehrlicher
    // als das, was das Preset hier erzeugt — im Impressum ein Absatz zu
    // Urheberrecht und einer, der Pip-Boy als Fanprojekt einordnet; im
    // Datenschutz sechs Abschnitte mehr (Datenschutzbeauftragter, Anfragen per
    // E-Mail und Telefon, Schriftarten, Verschluesselung, Drittlaender,
    // Widerruf), dazu die Du-Form. Ein Sync wuerde den laengeren Text durch den
    // kuerzeren ersetzen. Wer das aendern will, gleicht erst das Preset in
    // src/presets.ts an den Live-Text an und traegt `dateien` danach wieder
    // ein — nicht umgekehrt.
    //
    // Der Preis steht dabei: Eine Adressaenderung hier erreicht feif.space
    // nicht. Sie ist dort von Hand nachzuziehen.
    //
    // Nur die Startseite traegt eine Auszeichnung — deshalb hier eine Liste
    // von Dateien statt einer Wurzel. Ein Ordner waere hier die Wurzel des
    // Checkouts, und der Sync liefe durch .git, server/ und werkzeug/, um am
    // Ende dieselbe eine Datei anzufassen.
    sameAsIn: ['index.html'],
    // Anders als conct.de: Die Startseite handelt von der Person (mainEntity
    // ist #person), und das hinterlegte Profil ist ein Personenprofil. Die
    // Profile gehoeren deshalb an #person, nicht an den Betriebsknoten
    // #betrieb — der beschreibt hier dieselbe Einzelunternehmung, aber ein
    // Xing-Profil ist kein Betriebsprofil.
    sameAsId: '#person',
    // Dieselbe Liste noch einmal, diesmal sichtbar: eine Zeile "Profile" im
    // Kontaktblock. `sameAs` steht in einem script-Block und wird von keinem
    // Browser dargestellt — wer die Profile auf der Seite sehen will, braucht
    // Anker im Inhalt. Beides aus derselben Quelle, sonst pflegt man zwei
    // Wahrheiten.
    profileIn: ['index.html'],
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
    // sameAsId fehlt: #organization ist der Default.
  },
  'fibel.uber.space': {
    /* Die Startseite von Fibel ist selbst ein Fibel-Programm — das erste Ziel,
       das kein HTML ist. Deshalb wird hier nicht ein Abschnitt in einer Datei
       ersetzt, sondern eine Markdown-Datei daneben geschrieben; die Seite holt
       sie mit dem Baustein "dokument".

       Der Weg dorthin war die Reihenfolge, die feif.space vorgibt: Erst wurde
       PRESETS['fibel.uber.space'] abschnittsweise an den Live-Text angeglichen
       — samt zwei freitext-Abschnitten fuer die Beispiele und die Fibel-KI, fuer
       die es keinen Baustein gibt — und erst danach kam dieser Eintrag. Nicht
       umgekehrt. */
    format: 'fibel',
    dateien: {
      impressum: ['startseite/impressum.md'],
      datenschutz: ['startseite/datenschutz.md'],
    },
    /* Kein `anschriftIn`: Die Stammdaten kamen bis hierher ueber Marken im
       Programm. Jetzt kommt der ganze Text von hier, und die Marken sind mit
       den Seiten verschwunden, die sie trugen. Die Fibel-Marken in MARKEN
       bleiben trotzdem — fuer eine Seite, die nur die Stammdaten will. */
    /* Fibel liefert eine security.txt neben dem Programm unter
       /.well-known/security.txt aus. Die Kontaktadresse ist dieselbe wie im
       Impressum — sie kommt aus denselben Stammdaten. */
    sicherheitIn: 'startseite/security.txt',
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

// Dritte Marke: die Profile als sichtbare Links. `sameAs` in der Auszeichnung
// ist maschinenlesbar und steht in einem script-Block - ein Browser stellt
// davon nichts dar. Wer die Profile auf der Seite sehen will, braucht Anker im
// Inhalt, und die kommen aus derselben Liste. Sonst pflegt man zwei Wahrheiten:
// eine fuer Suchmaschinen, eine fuer Menschen.
const profilMarke =
  /(<!--\s*legal:profile\s*-->)([\s\S]*?)(<!--\s*\/legal:profile\s*-->)/;

/**
 * Eine ganze Datei schreiben, statt einen Abschnitt darin zu ersetzen.
 *
 * Bei HTML gehoert die Datei der Seite: Header, Footer und Styles stehen darin,
 * und der Sync fasst nur den markierten Abschnitt an. Eine Markdown-Datei neben
 * einem Fibel-Programm gehoert dagegen vollstaendig dem Sync — sie enthaelt
 * nichts als den Rechtstext. Dort braucht "was nicht markiert ist, bleibt"
 * keine Marke: Es ist nichts da, was bleiben muesste.
 *
 * Das Zeilenende der vorhandenen Datei wird uebernommen, aus demselben Grund
 * wie bei patchen(): Ein Wechsel von CRLF auf LF zeigt im ersten Pull Request
 * die ganze Datei als geaendert, obwohl kein Wort anders lautet.
 */
function mdSchreiben(pfad, text) {
  const alt = existsSync(pfad) ? readFileSync(pfad, 'utf8') : null;
  const neu = aufZeilenende(text, alt ? zeilenende(alt) : '\n');
  if (neu === alt) return false;
  writeFileSync(pfad, neu, 'utf8');
  return true;
}

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

  const eol = zeilenende(alt);
  const neu = alt.replace(SECTION, (_, auf, __, zu) =>
    aufZeilenende(
      `${auf}\n${einruecken(fragment, tiefe)}\n${' '.repeat(Math.max(tiefe - 2, 0))}${zu}`,
      eol,
    ),
  );

  if (neu === alt) return false;
  writeFileSync(pfad, neu, 'utf8');
  return true;
}

/**
 * Das Zeilenende, das in dieser Datei ueberwiegt.
 *
 * Der Sync setzt Text in fremde Dateien ein, und die Vorlagen sind nicht alle
 * gleich: conct.de liegt mit CRLF im Repo, die erzeugten Fragmente tragen LF.
 * Ohne diese Ruecksicht wuerde aus einer CRLF-Datei eine gemischte, und der
 * erste Pull Request zeigte den ganzen Abschnitt als geaendert, obwohl kein
 * Wort anders lautet. Ein Diff, der Rauschen anzeigt, wird nicht gelesen.
 */
function zeilenende(text) {
  const crlf = (text.match(/\r\n/g) ?? []).length;
  const lf = (text.match(/\n/g) ?? []).length - crlf;
  return crlf > lf ? '\r\n' : '\n';
}

/** Einen Textbaustein auf das Zeilenende der Zieldatei bringen. */
const aufZeilenende = (text, eol) => (eol === '\r\n' ? text.replace(/\r?\n/g, '\r\n') : text);

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

/**
 * Wie ein Profil heisst, an seiner Adresse abgelesen.
 *
 * Nur die Dienste, die tatsaechlich vorkommen — ein Verzeichnis aller Netzwerke
 * der Welt waere Pflege ohne Nutzen. Was nicht drinsteht, bekommt seinen
 * Hostnamen als Namen; das ist nie falsch, nur schmucklos, und faellt beim
 * Ansehen sofort auf.
 */
const PROFIL_NAMEN = [
  [/(^|\.)xing\.com$/, 'Xing'],
  [/(^|\.)github\.com$/, 'GitHub'],
  [/(^|\.)gitlab\.com$/, 'GitLab'],
  [/(^|\.)linkedin\.com$/, 'LinkedIn'],
];

function profilName(adresse) {
  let host;
  try {
    host = new URL(adresse).hostname.replace(/^www\./, '');
  } catch {
    return adresse;
  }
  for (const [muster, name] of PROFIL_NAMEN) if (muster.test(host)) return name;
  return host;
}

/**
 * Die Profile als sichtbare Links, durch einen Mittelpunkt getrennt.
 *
 * `rel="me"` sagt dasselbe wie `sameAs` in der Auszeichnung, nur im Inhalt:
 * Das hier bin ich. `noopener` gehoert zu `target="_blank"`.
 *
 * Ohne Profile wird `null` zurueckgegeben, und der Bereich bleibt, wie er ist.
 * Die Marke leerzuraeumen hiesse, eine beschriftete Zeile ohne Inhalt stehen
 * zu lassen — was dann dort steht, entscheidet die Seite, nicht der Sync.
 */
function profilFragment(siteKey) {
  const profile = anbieterFuer(siteKey).profile ?? [];
  if (profile.length === 0) return null;
  return profile
    .map(
      (p) =>
        `<a href="${escapeHtml(p)}" target="_blank" rel="me noopener">${escapeHtml(profilName(p))}</a>`,
    )
    .join(' · ');
}

const escapeHtml = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/**
 * Dasselbe fuer ein Fibel-Programm statt einer HTML-Datei.
 *
 * Fibels Startseite ist das erste Ziel, das kein HTML ist: Dort steht die
 * Anschrift als `text "..."`-Zeilen in einer .fibel-Datei. Geaendert wird
 * wieder nur, was markiert ist — die Marke ist ein Fibel-Kommentar:
 *
 *   # legal:postanschrift
 *   text "..."
 *   # /legal:postanschrift
 *
 * Global, anders als bei HTML: Eine Fibel-Datei traegt das ganze Angebot, und
 * die Anschrift steht darin zweimal — beim Anbieter und beim
 * Medienverantwortlichen nach § 18 Abs. 2 MStV. Ein Ersatz nur des ersten
 * Treffers liesse den zweiten auseinanderlaufen.
 */
const fibelMarke = (name) =>
  new RegExp(
    `(^[ \\t]*#[ \\t]*legal:${name}[ \\t]*\\r?\\n)([\\s\\S]*?)(^[ \\t]*#[ \\t]*\\/legal:${name}[ \\t]*$)`,
    'gm',
  );

/**
 * Eine Textzeile fuer Fibel. Ein Anfuehrungszeichen im Wert liesse sich hier
 * nicht sicher aufloesen — also melden statt eine Zeile bauen, die der
 * Zerteiler nicht liest.
 */
function fibelText(wert) {
  const s = String(wert);
  if (s.includes('"')) {
    throw new Error(`Anfuehrungszeichen in "${s}" — daraus laesst sich keine Fibel-Zeile bauen.`);
  }
  return `text "${s}"`;
}

const fibelZeilen = (einzug, zeilen) => zeilen.map((z) => `${einzug}${fibelText(z)}\n`).join('');

const fibelPost = (siteKey) => (einzug) => {
  const a = anbieterFuer(siteKey);
  const zeilen = [a.name, a.strasse, `${a.plz} ${a.ort}`];
  if (a.land) zeilen.push(a.land);
  return fibelZeilen(einzug, zeilen);
};

const fibelKontakt = (siteKey) => (einzug) => {
  const a = anbieterFuer(siteKey);
  const zeilen = [];
  if (a.telefon) zeilen.push(`Telefon: ${a.telefon}`);
  zeilen.push(`E-Mail: ${a.email}`);
  return fibelZeilen(einzug, zeilen);
};

/* Ohne USt-IdNr bleibt der Bereich, wie er ist: Ein leeres Fragment liesse die
   Ueberschrift "Umsatzsteuer" ohne Angabe darunter stehen, und das waere
   schlechter als ein unveraenderter Text. */
const fibelUstId = (siteKey) => (einzug) => {
  const a = anbieterFuer(siteKey);
  if (!a.ustId) return null;
  return fibelZeilen(einzug, [
    `Umsatzsteuer-Identifikationsnummer gemäß § 27 a Umsatzsteuergesetz: ${a.ustId}`,
  ]);
};

/* Der Verantwortliche im Datenschutz nennt Anschrift und beide Kontaktwege in
   einem Block — dieselbe Reihenfolge wie anschriftMitKontakt() im Paket, wo sie
   fuer genau diesen Abschnitt gedacht ist. Ohne diese Marke erreichte eine
   Adressaenderung das Impressum, aber nicht den Datenschutz, und die beiden
   widersprachen sich. */
const fibelVerantwortlich = (siteKey) => (einzug) => {
  const a = anbieterFuer(siteKey);
  const zeilen = [a.name];
  if (a.marke) zeilen.push(a.marke);
  zeilen.push(a.strasse, `${a.plz} ${a.ort}`);
  if (a.land) zeilen.push(a.land);
  zeilen.push(`E-Mail: ${a.email}`);
  if (a.telefon) zeilen.push(`Telefon: ${a.telefon}`);
  return fibelZeilen(einzug, zeilen);
};

/**
 * security.txt nach RFC 9116.
 *
 * `Contact` kommt aus denselben Stammdaten wie das Impressum. Eine Adresse, die
 * dort nicht steht, ist für den Empfänger schwer von einer Fälschung zu
 * unterscheiden — dasselbe Argument wie bei den Bestellmails von rechnungswerk.
 *
 * `Expires` ist Pflicht und darf nicht in der Vergangenheit liegen; ein Jahr ist
 * die übliche Wahl. Damit veraltet die Datei von selbst. Fibel meldet das beim
 * Prüfen, und ein neuer Sync setzt die Frist neu.
 */
function sicherheitText(siteKey) {
  const a = anbieterFuer(siteKey);
  const frist = new Date();
  frist.setUTCFullYear(frist.getUTCFullYear() + 1);
  return [
    '# Sicherheitslücken bitte an die Adresse unten melden.',
    `Contact: mailto:${a.email}`,
    `Expires: ${frist.toISOString().replace(/\.\d{3}Z$/, 'Z')}`,
    'Preferred-Languages: de, en',
    `Canonical: https://${SITES[siteKey].domain}/.well-known/security.txt`,
    '',
  ].join('\n');
}

/**
 * Welche Marken ein Zielformat kennt.
 *
 * HTML fuehrt Anschrift und Kontakt in einer Marke zusammen, Fibel trennt sie:
 * Dort stehen sie unter eigenen Ueberschriften — genau der Fall, fuer den es
 * die Postanschrift-Marke schon gab.
 */
const MARKEN = {
  html: [
    ['Anschrift', anschriftMarke, (k) => () => anschriftFragment(k)],
    ['Postanschrift', postMarke, (k) => () => postFragment(k)],
  ],
  fibel: [
    ['Postanschrift', fibelMarke('postanschrift'), fibelPost],
    ['Kontakt', fibelMarke('kontakt'), fibelKontakt],
    ['USt-IdNr', fibelMarke('ustid'), fibelUstId],
    ['Verantwortlicher', fibelMarke('verantwortlicher'), fibelVerantwortlich],
  ],
};

/**
 * Die Liste `sameAs` in dem Knoten setzen, den die Seite dafür benennt.
 *
 * Für Anschrift und Rechtstexte gibt es eine Marke im HTML. In JSON-LD gibt es
 * keine, also übernimmt die `@id` ihre Rolle: Angefasst wird nur ein Knoten,
 * dessen `@id` auf die vereinbarte Kennung endet — `#organization`, wenn die
 * Seite nichts anderes sagt. Wer diese Kennung setzt, sagt damit, welcher
 * Knoten gemeint ist.
 *
 * Gesucht wird auf oberster Ebene **und** in `@graph`. Beide Formen sind
 * gebräuchlich: conct.de liefert ein Array von Knoten, feif.space einen
 * Wrapper mit `@context` und `@graph`. Vorher sah der Sync nur die erste
 * Form und übersprang die zweite wortlos — der Knoten stand da, nur eine
 * Ebene tiefer.
 *
 * Geschrieben wird **nur die Liste**, nicht der Block. Ein `JSON.stringify`
 * des ganzen Blocks wäre einfacher, presst aber eine von Hand gesetzte
 * Einrückung in eine Zeile, und "was nicht markiert ist, bleibt" wäre
 * gebrochen. Stattdessen wird die Textstelle des Knotens gesucht und darin
 * genau der Wert von `sameAs` ersetzt; fehlt er, kommt er als eigene Zeile
 * hinter die `@id` mit deren Einrückung. Was der Sync nicht sicher findet,
 * meldet er, statt zu raten.
 */
const LD_BLOCK = /(<script type="application\/ld\+json">)(\s*)([\s\S]*?)(\s*)(<\/script>)/g;

/**
 * Die innerste geschweifte Klammer, die `pos` einschließt — als [start, ende).
 *
 * Ein Zähler über den Rohtext, der Zeichenketten und Escapes achtet: Eine
 * geschweifte Klammer in einer URL oder Beschreibung darf nicht mitzählen.
 * Der erste Block, der nach `pos` schließt und vor `pos` geöffnet wurde, ist
 * der innerste — deshalb genügt der erste Treffer.
 */
function objektSpanne(text, pos) {
  const offen = [];
  let inText = false;
  let esc = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (esc) {
      esc = false;
      continue;
    }
    if (c === '\\') {
      if (inText) esc = true;
      continue;
    }
    if (c === '"') {
      inText = !inText;
      continue;
    }
    if (inText) continue;
    if (c === '{') offen.push(i);
    else if (c === '}') {
      const auf = offen.pop();
      if (auf !== undefined && auf <= pos && i >= pos) return [auf, i + 1];
    }
  }
  return null;
}

/**
 * Das Ende des JSON-Werts, der bei `von` beginnt. Deckt ab, was als `sameAs`
 * vorkommen kann: eine Liste oder eine einzelne Zeichenkette.
 */
function wertEnde(text, von) {
  const c = text[von];
  let inText = c === '"';
  let esc = false;
  let tiefe = c === '[' ? 1 : 0;
  if (c !== '[' && c !== '"') return -1;
  for (let i = von + 1; i < text.length; i++) {
    const z = text[i];
    if (esc) {
      esc = false;
      continue;
    }
    if (z === '\\') {
      if (inText) esc = true;
      continue;
    }
    if (z === '"') {
      inText = !inText;
      if (!inText && tiefe === 0) return i + 1;
      continue;
    }
    if (inText) continue;
    if (z === '[') tiefe++;
    else if (z === ']') {
      tiefe--;
      if (tiefe === 0) return i + 1;
    }
  }
  return -1;
}

/**
 * Die Textstelle eines Knotens als [von, bis, idStelleImBlock).
 *
 * Gesucht wird ueber die `@id`, aber nicht ueber ihr erstes Vorkommen: Eine
 * `@id` steht auch in jedem Verweis auf den Knoten ("publisher": {"@id": …}),
 * und der kann frueher stehen als der Knoten selbst. Genommen wird die
 * Fundstelle, deren umschliessendes Objekt nach dem Parsen genau dieser Knoten
 * ist — das ist eindeutig, weil zwei Knoten nicht dieselbe `@id` tragen.
 */
function knotenSpanne(roh, knoten) {
  const nadel = `"${knoten['@id']}"`;
  const soll = JSON.stringify(knoten);
  for (let ab = roh.indexOf(nadel); ab !== -1; ab = roh.indexOf(nadel, ab + 1)) {
    const spanne = objektSpanne(roh, ab);
    if (!spanne) continue;
    const [von, bis] = spanne;
    try {
      if (JSON.stringify(JSON.parse(roh.slice(von, bis))) === soll) return [von, bis, ab - von];
    } catch {
      // Kein vollstaendiges Objekt an dieser Stelle — naechste Fundstelle.
    }
  }
  return null;
}

function sameAsPatchen(pfad, profile, kennung = '#organization') {
  const alt = readFileSync(pfad, 'utf8');
  let neu = alt;
  let getan = false;
  let knotenGesehen = false;
  const uebergangen = [];

  for (const m of [...alt.matchAll(LD_BLOCK)]) {
    const roh = m[3];
    let daten;
    try {
      daten = JSON.parse(roh);
    } catch {
      continue;
    }
    const liste = Array.isArray(daten)
      ? daten
      : Array.isArray(daten?.['@graph'])
        ? daten['@graph']
        : [daten];
    const knoten = liste.find(
      (o) => o && typeof o === 'object' && String(o['@id'] ?? '').endsWith(kennung),
    );
    if (!knoten) continue;
    // Gesehen heisst noch nicht geaendert — aber es unterscheidet "hier gibt es
    // nichts zu pflegen" von "hier stimmt schon alles".
    knotenGesehen = true;

    const wunsch = profile && profile.length > 0 ? profile : null;
    if (JSON.stringify(knoten.sameAs ?? null) === JSON.stringify(wunsch)) continue;

    // Die Textstelle des Knotens. Die @id allein genuegt dafuer nicht: Sie
    // steht auch in jedem Verweis auf den Knoten, und bei conct.de kommt der
    // erste davon frueher als der Knoten selbst ("publisher":{"@id":…}). Also
    // jede Fundstelle durchgehen und die nehmen, deren umschliessendes Objekt
    // wirklich dieser Knoten ist.
    const spanne = knotenSpanne(roh, knoten);
    if (!spanne) {
      uebergangen.push([pfad, 'die Textstelle des Knotens war nicht auffindbar']);
      continue;
    }
    const [von, bis, idStelle] = spanne;
    const block = roh.slice(von, bis);

    let ersetzt = null;
    const schluessel = block.search(/"sameAs"\s*:/);
    if (schluessel !== -1) {
      const doppelpunkt = block.indexOf(':', schluessel);
      const wertVon = block.slice(doppelpunkt + 1).search(/\S/) + doppelpunkt + 1;
      const wertBis = wertEnde(block, wertVon);
      if (wertBis === -1) {
        uebergangen.push([pfad, 'der bestehende Wert von sameAs war nicht lesbar']);
        continue;
      }
      if (wunsch) {
        ersetzt = block.slice(0, wertVon) + JSON.stringify(wunsch) + block.slice(wertBis);
      } else {
        // Ohne Profile faellt die ganze Zeile weg, samt Komma und Umbruch —
        // bei CRLF auch dem \r, sonst bliebe eine Zeile aus einem einzelnen
        // Wagenruecklauf stehen.
        const zeileVon = block.lastIndexOf('\n', schluessel) + 1;
        const nachKomma = block[wertBis] === ',' ? wertBis + 1 : wertBis;
        const nachCr = block[nachKomma] === '\r' ? nachKomma + 1 : nachKomma;
        const zeileBis = block[nachCr] === '\n' ? nachCr + 1 : nachKomma;
        ersetzt = block.slice(0, zeileVon) + block.slice(zeileBis);
      }
    } else if (wunsch) {
      // Neu anlegen: hinter die @id-Zeile, mit deren Einrückung. Die Zeile
      // muss auf ein Komma enden — sonst waere die @id die letzte Angabe des
      // Knotens, und ein eingeschobenes Komma stuende an der falschen Stelle.
      const zeileVon = block.lastIndexOf('\n', idStelle) + 1;
      const zeileBis = block.indexOf('\n', idStelle);
      const zeile = zeileBis === -1 ? block.slice(zeileVon) : block.slice(zeileVon, zeileBis);
      if (zeileBis === -1 || !zeile.trimEnd().endsWith(',')) {
        uebergangen.push([pfad, 'hinter der @id war keine Stelle zum Einfuegen']);
        continue;
      }
      // Das Zeilenende der Datei uebernehmen, nicht das eigene: Eine
      // CRLF-Datei bekaeme sonst eine einzelne LF-Zeile eingeschoben.
      const eol = zeile.endsWith('\r') ? '\r\n' : '\n';
      const einzug = zeile.match(/^\s*/)[0];
      ersetzt =
        block.slice(0, zeileBis + 1) +
        `${einzug}"sameAs": ${JSON.stringify(wunsch)},${eol}` +
        block.slice(zeileBis + 1);
    } else {
      continue;
    }

    // Gegenprobe: Der Block muss danach noch dasselbe bedeuten wie die
    // Daten, die wir gesetzt haben. Ein Textersatz, der JSON zerlegt, faellt
    // hier auf, bevor er in die Datei kommt.
    const rohNeu = roh.slice(0, von) + ersetzt + roh.slice(bis);
    try {
      const probe = JSON.parse(rohNeu);
      const pListe = Array.isArray(probe)
        ? probe
        : Array.isArray(probe?.['@graph'])
          ? probe['@graph']
          : [probe];
      const pKnoten = pListe.find(
        (o) => o && typeof o === 'object' && String(o['@id'] ?? '').endsWith(kennung),
      );
      if (JSON.stringify(pKnoten?.sameAs ?? null) !== JSON.stringify(wunsch)) {
        uebergangen.push([pfad, 'die Gegenprobe ergab eine andere Liste']);
        continue;
      }
    } catch {
      uebergangen.push([pfad, 'nach dem Ersetzen war der Block kein gueltiges JSON']);
      continue;
    }

    // Eine Funktion als Ersetzung: In einem String würden $& und $' gedeutet.
    neu = neu.replace(roh, () => rohNeu);
    getan = true;
  }

  for (const [pf, grund] of uebergangen) {
    console.warn(
      `Hinweis: ${pf} trägt einen ${kennung}-Knoten, aber ${grund} — ` +
        'sameAs wurde dort nicht gesetzt.',
    );
  }
  /* Wie bei markePatchen: Was geschehen ist, nicht bloss ob. Ohne den
     Unterschied hiess es "kein Knoten oder Liste ist aktuell" — und wer eine
     Seite neu anhaengt, braucht genau diese Unterscheidung. */
  if (!getan) return knotenGesehen ? 'aktuell' : 'ohne-knoten';
  writeFileSync(pfad, neu, 'utf8');
  return 'erneuert';
}

/**
 * Den Inhalt zwischen zwei Marken ersetzen.
 *
 * `bauen(einzug)` liefert das Fragment und bekommt die Einrueckung der
 * Anfangsmarke mit — HTML braucht sie nicht, ein Fibel-Programm schon, dort
 * ist Einrueckung Struktur. Gibt `bauen` `null` zurueck, fehlen die Daten und
 * der Bereich bleibt, wie er ist.
 *
 * `lastIndex` wird zurueckgesetzt: Die Fibel-Marken sind global, und `test()`
 * merkt sich bei einem globalen Ausdruck die Fundstelle.
 *
 * Zurueck kommt, WAS geschehen ist: 'erneuert', 'aktuell' (Marke da, Text
 * stimmte schon), 'ohne-marke' oder 'ausgelassen' (die Daten fehlen). Vorher
 * war es true/false, also "geaendert oder nicht" — und die Meldung musste
 * daraus "Marken fehlen oder Text ist aktuell" machen: zwei sehr verschiedene
 * Lagen in einem Satz. Genau dieser Unterschied ist der wichtigste, wenn
 * jemand den Sync fuer eine Seite einrichtet. Eine Marke, die nicht gefunden
 * wird, sah im Log aus wie Erfolg.
 */
function markePatchen(pfad, marke, bauen) {
  const alt = readFileSync(pfad, 'utf8');
  marke.lastIndex = 0;
  if (!marke.test(alt)) return 'ohne-marke';
  marke.lastIndex = 0;
  const eol = zeilenende(alt);
  let ausgelassen = false;
  const neu = alt.replace(marke, (ganz, auf, __, zu) => {
    const fragment = bauen(auf.match(/^[ \t]*/)[0]);
    if (fragment === null) {
      ausgelassen = true;
      return ganz;
    }
    return aufZeilenende(`${auf}${fragment}${zu}`, eol);
  });
  if (ausgelassen) {
    console.warn(
      `Hinweis: ${pfad} — für eine Marke fehlen die Daten in den Stammdaten, ` +
        'der Bereich blieb unverändert.',
    );
  }
  if (neu === alt) return ausgelassen ? 'ausgelassen' : 'aktuell';
  writeFileSync(pfad, neu, 'utf8');
  return 'erneuert';
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

// Nur wenn die Seite ihre Rechtstexte auch von hier bezieht. Wo sie das nicht
// tut, sagt das Preset nichts ueber den Text, der dort steht — und eine
// Warnung dazu waere ein Hinweis auf etwas, das niemanden betrifft.
if (cfg.dateien && !PRESETS[siteKey].geprueft) {
  console.warn(
    `Warnung: Das Datenschutz-Preset für ${siteKey} ist in src/presets.ts noch ` +
      'nicht als geprüft markiert.',
  );
}

let geaendert = 0;
if (cfg.dateien) {
  const docs = {
    impressum: impressumFuer(siteKey),
    datenschutz: datenschutzFuer(siteKey),
  };
  for (const [art, wert] of Object.entries(cfg.dateien)) {
    // Eine Datei oder mehrere - dieselbe Fassung, mehrere Ziele.
    for (const datei of Array.isArray(wert) ? wert : [wert]) {
      const pfad = join(checkout, datei);
      /* urlsAusschreiben: false — sonst stuende auf der Seite
         "mail@feif.space (mailto:mail@feif.space)". Der Textrenderer schreibt
         Verweise fuer Mails und App-Stores aus, wo kein Klick moeglich ist; auf
         einer Webseite liest das niemand. Fibel macht aus der Adresse ohnehin
         einen Verweis. */
      const getan = (cfg.format ?? 'html') === 'fibel'
        ? mdSchreiben(pfad, toMarkdown(docs[art], { urlsAusschreiben: false }))
        : patchen(pfad, toHtml(docs[art], { includeTitle: !cfg.eigeneUeberschrift }));
      if (getan) {
        console.log(`aktualisiert: ${datei}`);
        geaendert++;
      } else {
        console.log(`unverändert:  ${datei}`);
      }
    }
  }
} else {
  console.log('Rechtstexte: diese Seite pflegt sie selbst — nicht angefasst.');
}

if (cfg.anschriftIn) {
  /* Eine Wurzel, unter der gesucht wird — oder gleich die Dateien, wie es
     sameAsIn schon erlaubt. Fuer ein Fibel-Programm ist die Liste der einzige
     Weg: htmlDateien() sucht nach .html und fand eine .fibel nie. */
  const pfade = Array.isArray(cfg.anschriftIn)
    ? cfg.anschriftIn.map((datei) => join(checkout, datei))
    : htmlDateien(join(checkout, cfg.anschriftIn));
  for (const [name, marke, bauen] of MARKEN[cfg.format ?? 'html']) {
    const zaehler = { erneuert: 0, aktuell: 0, ausgelassen: 0, 'ohne-marke': 0 };
    for (const pfad of pfade) {
      const stand = markePatchen(pfad, marke, bauen(siteKey));
      zaehler[stand]++;
      if (stand === 'erneuert') geaendert++;
    }
    /* Dateien ohne Marke werden nicht gezaehlt: Bei einer Wurzel mit vielen
       Dateien tragen die meisten keine, und das ist der Normalfall. Traegt
       KEINE eine, ist das die Auskunft, auf die es ankommt. */
    const teile = [];
    if (zaehler.erneuert) teile.push(`${zaehler.erneuert} erneuert`);
    if (zaehler.aktuell) teile.push(`${zaehler.aktuell} schon aktuell`);
    if (zaehler.ausgelassen) teile.push(`${zaehler.ausgelassen} ohne Daten übersprungen`);
    console.log(
      teile.length > 0
        ? `${name}: ${teile.join(', ')}.`
        : `${name}: keine Marke gefunden — dieser Bereich wird nicht gepflegt.`,
    );
  }
}

/* Die sichtbare Entsprechung zu sameAs: dieselbe Liste, aber als Anker im
   Inhalt. Eigener Schalter, weil eine Seite das eine ohne das andere wollen
   kann — conct.de fuehrt die Profile heute nur maschinenlesbar. */
if (cfg.profileIn) {
  const pfade = Array.isArray(cfg.profileIn)
    ? cfg.profileIn.map((datei) => join(checkout, datei))
    : htmlDateien(join(checkout, cfg.profileIn));
  const zaehler = { erneuert: 0, aktuell: 0, ausgelassen: 0, 'ohne-marke': 0 };
  for (const pfad of pfade) {
    const stand = markePatchen(pfad, profilMarke, () => profilFragment(siteKey));
    zaehler[stand]++;
    if (stand === 'erneuert') geaendert++;
  }
  const teile = [];
  if (zaehler.erneuert) teile.push(`${zaehler.erneuert} erneuert`);
  if (zaehler.aktuell) teile.push(`${zaehler.aktuell} schon aktuell`);
  if (zaehler.ausgelassen) teile.push(`${zaehler.ausgelassen} ohne Profile übersprungen`);
  console.log(
    teile.length > 0
      ? `Profile (sichtbar): ${teile.join(', ')}.`
      : 'Profile (sichtbar): keine Marke gefunden — dieser Bereich wird nicht gepflegt.',
  );
}

if (cfg.sameAsIn) {
  const profile = anbieterFuer(siteKey).profile ?? [];
  const kennung = cfg.sameAsId ?? '#organization';
  // Eine Wurzel, unter der gesucht wird — oder gleich die Dateien, wenn die
  // Seite weiss, welche es sind.
  const pfade = Array.isArray(cfg.sameAsIn)
    ? cfg.sameAsIn.map((datei) => join(checkout, datei))
    : htmlDateien(join(checkout, cfg.sameAsIn));
  const zaehler = { erneuert: 0, aktuell: 0, 'ohne-knoten': 0 };
  for (const pfad of pfade) {
    const stand = sameAsPatchen(pfad, profile, kennung);
    zaehler[stand]++;
    if (stand === 'erneuert') geaendert++;
  }
  const teile = [];
  if (zaehler.erneuert) teile.push(`${zaehler.erneuert} erneuert`);
  if (zaehler.aktuell) teile.push(`${zaehler.aktuell} schon aktuell`);
  console.log(
    teile.length > 0
      ? `sameAs: ${teile.join(', ')}.`
      : `sameAs: kein ${kennung}-Knoten gefunden — nichts zu pflegen.`,
  );
}

if (cfg.sicherheitIn) {
  const pfad = join(checkout, cfg.sicherheitIn);
  const neu = sicherheitText(siteKey);
  const alt = existsSync(pfad) ? readFileSync(pfad, 'utf8') : null;
  /* Die Frist allein ist kein Grund zu schreiben: Sonst zeigte jeder Lauf eine
     Änderung, die niemand gewollt hat, und ein Pull Request mit Rauschen wird
     nicht gelesen. Neu geschrieben wird, wenn sich etwas anderes geändert hat —
     oder wenn die Frist in weniger als 30 Tagen abläuft. */
  const ohneFrist = (t) => String(t ?? '').replace(/^Expires:.*$/im, '');
  const alteFrist = new Date((/^Expires:[ \t]*(.+)$/im.exec(alt ?? '') ?? [])[1] ?? '');
  const laeuftAus =
    Number.isNaN(alteFrist.getTime()) || alteFrist.getTime() - Date.now() < 30 * 24 * 60 * 60 * 1000;
  if (alt && ohneFrist(alt) === ohneFrist(neu) && !laeuftAus) {
    console.log(`security.txt: schon aktuell, Frist bis ${alteFrist.toISOString().slice(0, 10)}.`);
  } else if (mdSchreiben(pfad, neu)) {
    console.log(`aktualisiert: ${cfg.sicherheitIn}`);
    geaendert++;
  } else {
    console.log(`unverändert:  ${cfg.sicherheitIn}`);
  }
}

console.log(geaendert > 0 ? `${geaendert} Datei(en) geändert.` : 'Nichts zu tun.');
