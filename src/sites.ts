import type { Anbieter } from './anbieter.js';

/** Die seitenspezifischen Angaben — alles, was NICHT für alle Projekte gilt. */
export interface Site {
  /** Domain ohne Protokoll, z.B. "feif.space". */
  domain: string;
  /** Anzeigename, erscheint im Seitentitel. */
  name: string;
  /**
   * Externe Angebote, auf die diese Seite verlinkt. Fließt in "Haftung für
   * Links" (Impressum) und "Externe Links" (Datenschutz) ein.
   */
  externeLinks?: string[];
  /** Hoster, erscheint im Datenschutz-Baustein `hosting`. */
  hoster?: string;
  /**
   * Was das Angebot ist. Steuert die Formulierung ("Diese Website" /
   * "Diese App" / "Dieses Angebot"). Default: 'website'.
   */
  art?: Angebotsart;
  /**
   * Dienstleister, die personenbezogene Daten im Auftrag verarbeiten
   * (Art. 28 DSGVO). Speist den Baustein `auftragsverarbeitung`.
   */
  drittdienste?: Drittdienst[];
  /**
   * Abweichende Stammdaten für diese Seite, über CONCT gelegt.
   * Ein Feld mit `undefined` entfernt die Angabe — so bleibt etwa die
   * Telefonnummer auf einer Seite weg, ohne sie überall zu streichen.
   */
  anbieter?: Partial<Anbieter>;
}

export type Angebotsart = 'website' | 'app' | 'angebot';

export interface Drittdienst {
  /** Name des Dienstes, z.B. "Stripe". */
  name: string;
  /** Wofür er eingesetzt wird, z.B. "Zahlungsabwicklung". */
  zweck: string;
  /** Sitz bzw. Verarbeitungsort, z.B. "Irland" oder "USA". */
  ort?: string;
}

/**
 * Alle Seiten liegen bei Uberspace; Betreiber ist Jonas Pasche (Einzelunternehmen).
 * „Uberspace Entwicklungen GbR“ stand hier frueher und war falsch.
 */
const geschwister = [
  'choozy.io',
  'velvet-network.app',
  'unteruns.io',
  'rechnungswerk.conct.de',
  'pip-boy.feif.space',
];

export const SITES = {
  'feif.space': {
    domain: 'feif.space',
    name: 'feif.space',
    externeLinks: [...geschwister, 'Instagram- und TikTok-Profile'],
    hoster: 'Uberspace (Jonas Pasche, Kaiserstraße 15, 55116 Mainz)',
    anbieter: { land: 'Deutschland' },
  },
  'choozy.io': {
    domain: 'choozy.io',
    name: 'Choozy',
    hoster: 'Uberspace (Jonas Pasche, Kaiserstraße 15, 55116 Mainz)',
  },
  'velvet-network.app': {
    domain: 'velvet-network.app',
    name: 'VELVET',
    // Uberspace 8 (velvet@mab.uberspace.de), siehe VELVET CLAUDE.md. Wird vom
    // Preset heute nicht gelesen (kein Baustein `hosting`), stimmt aber.
    hoster: 'Uberspace (Jonas Pasche, Kaiserstraße 15, 55116 Mainz)',
    // Kein `art`: Dieselbe Erklärung gilt für Dashboard und App, und keiner der
    // gewählten Bausteine formuliert nach der Angebotsart. Kommt `hosting` oder
    // `aktualitaet` dazu, passt 'angebot' für beide.
    //
    // Kein `drittdienste`: Stripe und PayPal treten laut Text als „eigenständige
    // Verantwortliche bzw. Auftragsverarbeiter“ auf. Ein Eintrag hier speiste
    // `auftragsverarbeitung` und behauptete Art.-28-Verträge mit beiden — mehr,
    // als die Erklärung sagt. Dieselbe Abwägung wie bei fibel.uber.space.
    anbieter: {
      // Wie conct.de und rechnungswerk: Support, AGB, Widerrufsbelehrung und die
      // Vereinbarung mit den Locations nennen mail@velvet-network.app. Eine
      // Auskunft von einer Adresse, die im Impressum nicht steht, ist für den
      // Empfänger schwer von einer Fälschung zu unterscheiden.
      email: 'mail@velvet-network.app',
    },
  },
  'unteruns.io': {
    domain: 'unteruns.io',
    name: 'unteruns',
    hoster: 'Uberspace (Jonas Pasche, Kaiserstraße 15, 55116 Mainz)',
  },
  'conct.de': {
    domain: 'conct.de',
    name: 'conct',
    hoster: 'Uberspace (Jonas Pasche, Kaiserstraße 15, 55116 Mainz)',
    // Das Formular der Startseite uebergibt an audit.conct.de - einen
    // eigenen Dienst auf demselben Hoster. Er gehoert in "Externe Links",
    // weil der Besucher die Domain dabei verlaesst.
    externeLinks: ['audit.conct.de'],
    anbieter: {
      // Wie bei rechnungswerk: Die Seite tritt unter conct.de auf, also
      // nennt sie auch eine conct.de-Adresse. Eine Auskunft, die von einer
      // Adresse kommt, die im Impressum nicht steht, ist fuer den Empfaenger
      // schwer von einer Faelschung zu unterscheiden.
      email: 'mail@conct.de',
      land: 'Deutschland',
      rechtlicheStellung: 'Einzelunternehmen. Nicht im Handelsregister eingetragen.',
    },
  },
  // Unverändert. Bewusst kein `drittdienste`: Das Feld speist
  // `auftragsverarbeitung` und `drittland`. Ein Vertrag nach Art. 28 DSGVO
  // besteht laut Seite nur mit dem Hoster; Stripe und PayPal sind Empfänger,
  // keine Auftragsverarbeiter. Ein Eintrag hier behauptete einen AV-Vertrag,
  // den die Seite nicht nennt — und `drittland` sähe Stripe nicht.
  'rechnungswerk.conct.de': {
    domain: 'rechnungswerk.conct.de',
    name: 'Rechnungswerk',
    hoster: 'Uberspace (Jonas Pasche, Kaiserstraße 15, 55116 Mainz)',
    anbieter: {
      // Kaufbestätigung und Widerrufsbelehrung kommen von dieser Adresse. Eine
      // Bestellmail von einer Adresse, die im Impressum nicht steht, ist für
      // den Empfänger schwer von einer Fälschung zu unterscheiden.
      email: 'mail@conct.de',
      marke: 'feif.space',
      land: 'Deutschland',
      rechtlicheStellung: 'Einzelunternehmen. Nicht im Handelsregister eingetragen.',
    },
  },
  // Die native App (Paket de.rechnungswerk.app). Eigener Schlüssel, weil die
  // Stores eine Datenschutz-URL je App verlangen und die App anderes tut als
  // die Website: SQLite statt localStorage, Systembackup, täglicher Abruf der
  // Spezifikationen, wählbarer eigener Dienst, Kauf nur über die Stores.
  // Nicht nach der Paket-ID benannt (wie sektorix.feif.space): umgedreht
  // ergäbe sie app.rechnungswerk.de, eine Domain, die es nicht gibt.
  'rechnungswerk-app': {
    domain: 'rechnungswerk.conct.de',
    name: 'Rechnungswerk',
    art: 'app',
    hoster: 'Uberspace (Jonas Pasche, Kaiserstraße 15, 55116 Mainz)',
    anbieter: {
      // Dieselben Abweichungen wie die Website — die App verweist für den
      // Kauf im Browser auf sie, also dieselbe Adresse.
      email: 'mail@conct.de',
      marke: 'feif.space',
      land: 'Deutschland',
      rechtlicheStellung: 'Einzelunternehmen. Nicht im Handelsregister eingetragen.',
    },
  },
  'pip-boy.feif.space': {
    domain: 'pip-boy.feif.space',
    name: 'Pip-Boy',
    hoster: 'Uberspace (Jonas Pasche, Kaiserstraße 15, 55116 Mainz)',
  },
  // Schlüssel nach der Domain, unter der scripts/server.mjs ausliefert
  // (src/lib/server-url.ts, store/store-texte.md). Die App selbst zeigt keine
  // Rechtstexte: Sie öffnet /impressum und /datenschutz dieses Servers im Browser
  // (src/app/kinder.tsx, src/components/premium-bereich.tsx), die Webfassung
  // verlinkt dieselben Pfade (src/components/ki-hinweis.tsx).
  'lesestunde.conct.de': {
    domain: 'lesestunde.conct.de',
    name: 'Lesestunde',
    // App und Webfassung; das Original spricht von „der App“.
    art: 'app',
    // Der Server ist ein eigener Rechner (Raspberry Pi „ottilie“); Uberspace nimmt
    // nur die Verbindung entgegen und leitet sie weiter. Der Baustein `hosting`
    // trifft das nicht und steht nicht im Preset — der Name wird aber im
    // Freitext „Server, Hosting und Protokolle“ eingesetzt, steht also nicht
    // ungenutzt hier.
    hoster: 'Uberspace (Jonas Pasche, Kaiserstraße 15, 55116 Mainz)',
    //
    // Kein `drittdienste`, obwohl Anthropic, ElevenLabs, OpenAI, RevenueCat und
    // Expo Daten bekommen: Das Feld speist nur `auftragsverarbeitung` und
    // `drittland`, und beide stehen nicht im Preset. Die Rechtsgrundlage ist bei
    // den meisten Art. 6 Abs. 1 lit. b (die angeforderte Leistung), und das
    // Original stützt die USA-Übermittlung auf DPF und SCC — `drittland` nennt nur
    // die SCC.
    //
    // Kein `externeLinks`: Das Impressum bekommt trotzdem „Haftung für Links“ mit
    // dem allgemeinen Satz, den impressum() immer schreibt.
    anbieter: {
      // Wie conct.de: Die Seite tritt unter conct.de auf und nennt im Original
      // mail@conct.de — in Impressum, DSA-Kontaktstelle und Store-Texten.
      email: 'mail@conct.de',
      marke: 'conct',
      land: 'Deutschland',
      rechtlicheStellung: 'Einzelunternehmen. Nicht im Handelsregister eingetragen.',
    },
  },
  'walkforward.conct.de': {
    // Dienst "Prüfstand" aus dem Repo Trader. trader.conct.de leitet dauerhaft
    // hierher um (pruefstand.service, --umleiten-von), traegt also keine eigenen
    // Rechtstexte.
    domain: 'walkforward.conct.de',
    name: 'Prüfstand',
    // Der Abschnitt "Empfänger" nennt den Hoster selbst, wortgleich mit
    // diesem Feld.
    hoster: 'Uberspace (Jonas Pasche, Kaiserstraße 15, 55116 Mainz)',
    //
    // Kein `drittdienste`: Stripe verarbeitet laut Seite "in eigener
    // Verantwortung", nicht im Auftrag. Ein Eintrag hier speiste
    // `auftragsverarbeitung` (Art. 28) und behauptete das Gegenteil.
    //
    // Kein `externeLinks`: Die Seite verlinkt nach draussen nur auf sich selbst.
    anbieter: {
      // Die Seite nennt "Deutschland" in der Anschrift.
      land: 'Deutschland',
      // E-Mail bleibt mail@feif.space (CONCT), obwohl die Domain unter conct.de
      // liegt - conct.de und rechnungswerk nennen mail@conct.de. So steht es
      // heute auf der Seite, und dieselbe Adresse ist Antwort-An der
      // Anmelde- und Kuendigungsmails (PRUEFSTAND_MAILVERSAND_ANTWORT_AN).
      // Wer auf mail@conct.de wechselt, aendert beides zugleich.
    },
  },
  // Schluessel nach der Paket-ID space.feif.sektorix. Die Erklaerung liegt
  // unter feif.space/apps-software/sektorix/, wie bei Klarschiff.
  'sektorix.feif.space': {
    domain: 'feif.space',
    name: 'Sektorix',
    art: 'app',
    // Kein `hoster`: Sektorix hat keinen eigenen Server. Die Updates liefert
    // Expo aus, die Kaeufe wickeln die Stores ab.
    drittdienste: [
      { name: 'Expo (650 Industries, Inc.)', zweck: 'App-Aktualisierungen', ort: 'USA' },
    ],
  },
  // Schluessel nach der Paket-ID space.feif.farbecho. Eine eigene Domain gibt
  // es nicht: Die Erklaerung liegt unter feif.space/apps-software/farbecho/,
  // wie bei Klarschiff und Sektorix.
  'farbecho.feif.space': {
    domain: 'feif.space',
    name: 'Farbecho',
    art: 'app',
    // Kein `hoster`: Farbecho hat keinen eigenen Server. Einzige Verbindung
    // nach draussen ist die Update-Pruefung bei Expo.
    drittdienste: [
      { name: 'Expo (650 Industries, Inc.)', zweck: 'App-Aktualisierungen', ort: 'USA' },
    ],
  },
  // Schluessel nach der Paket-ID space.feif.klarschiff. Eine eigene Domain gibt
  // es nicht: Die Erklaerung liegt unter feif.space/apps-software/klarschiff/.
  'klarschiff.feif.space': {
    domain: 'feif.space',
    name: 'Klarschiff',
    art: 'app',
    // Der einzige Server ist die Bedrohungsdatenbank auf leda
    // (feif.space/klarschiff-api). Die App selbst laeuft auf dem Geraet.
    hoster: 'Uberspace (Jonas Pasche, Kaiserstraße 15, 55116 Mainz)',
  },
  'fibel.uber.space': {
    domain: 'fibel.uber.space',
    name: 'Fibel',
    hoster: 'Uberspace (Jonas Pasche, Kaiserstraße 15, 55116 Mainz)',
    // Kein `drittdienste`, obwohl die Spielwiese Wunsch und Programm an einen
    // KI-Dienst weitergibt: Das Feld speist den Baustein
    // `auftragsverarbeitung` (Art. 28 DSGVO), die Seite stuetzt die
    // Uebermittlung aber auf die Einwilligung des Besuchers (Art. 6 Abs. 1
    // lit. a, fuer die USA Art. 49 Abs. 1 lit. a DSGVO) — er betaetigt
    // "Schreiben lassen". Ein Eintrag hier behauptete eine Rechtsgrundlage,
    // die dort nicht gilt.
    //
    // Auch kein `externeLinks`: Die Rechtstexte dieser Seite werden heute
    // nicht von hier gerendert (siehe scripts/sync-static.mjs), und eine
    // Angabe, die niemand einloest, wird von niemandem widerlegt — das war
    // der Fehler bei feif.space.
  },
} as const satisfies Record<string, Site>;

export type SiteKey = keyof typeof SITES;
