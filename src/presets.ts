import { CONCT, type Anbieter } from './anbieter.js';
import * as ds from './datenschutz.js';
import { type DatenschutzOptions, type Modul, datenschutz } from './datenschutz.js';
import { type ImpressumOptions, impressum } from './impressum.js';
import { SITES, type Site, type SiteKey } from './sites.js';
import type { LegalDoc, Tone } from './types.js';

/**
 * Welche Datenschutz-Bausteine eine Seite braucht, an einer Stelle statt in
 * jeder App einzeln. Liegt bewusst hier und nicht in `sites.ts`: die Registry
 * darf die Bausteine nicht importieren, sonst entsteht ein Import-Zyklus.
 */
export interface Preset {
  tone: Tone;
  module: Modul[];
  /**
   * Wurde für diese Seite geprüft, dass die Bausteine die tatsächlich
   * stattfindende Datenverarbeitung abbilden?
   *
   * `false` heißt: das ist eine Vermutung aus dem Baukasten, kein geprüfter
   * Text. Vor dem Livegang durchgehen und auf `true` setzen — die Flagge ist
   * dazu da, dass ungeprüfte Seiten sichtbar bleiben statt still zu wirken.
   */
  geprueft: boolean;
}

export const PRESETS: Record<SiteKey, Preset> = {
  // Nicht gegen die Live-Seite abgeglichen — der Vermerk „rendert wortgleich"
  // stand hier, traf aber nie zu und ist am 26.09.2026 nachgemessen worden:
  // feif.space führt 13 Abschnitte in der Du-Form, dieses Preset erzeugt 7 in
  // der Sie-Form, und im Impressum fehlen hier Urheberrecht und der Hinweis
  // zum Fanprojekt. Aufgefallen ist es nie, weil der Sync die Rechtstexte dort
  // gar nicht anfasst (siehe scripts/sync-static.mjs, Eintrag feif.space).
  //
  // Damit ist dieses Preset heute ein Entwurf wie die übrigen: Wer feif.space
  // an die zentrale Quelle hängen will, gleicht es erst an den Live-Text an.
  'feif.space': {
    tone: 'formell',
    geprueft: false,
    module: [
      ds.verantwortlicher,
      ds.hosting,
      ds.kontaktformular(),
      ds.keineCookies,
      ds.externeLinks,
      ds.betroffenenrechte,
      ds.aktualitaet,
    ],
  },

  // Ab hier: Baukasten-Vermutungen. Vor dem Livegang prüfen.
  'choozy.io': {
    tone: 'persoenlich',
    geprueft: false,
    module: ds.STANDARD_MODULE,
  },
  'velvet-network.app': {
    tone: 'persoenlich',
    geprueft: false,
    module: ds.STANDARD_MODULE,
  },
  'unteruns.io': {
    tone: 'persoenlich',
    geprueft: false,
    module: ds.STANDARD_MODULE,
  },
  // conct.de traegt einen eigenen Datenschutztext im Repo: Er beschreibt den
  // Schnellcheck und die Uebergabe an audit.conct.de, und er nennt die
  // Speicherdauer und die Kuerzung der Adressen, die am 23.09.2026 am Server
  // nachgemessen wurden. Von hier kommen die Stammdaten - Anschrift,
  // Telefon, E-Mail - damit eine Adressaenderung ein Commit bleibt.
  //
  // Das Preset steht trotzdem hier: Es ist die Vorlage, falls der Text
  // spaeter doch erzeugt werden soll, und es zeigt, welche Bausteine
  // einschlaegig waeren.
  'conct.de': {
    tone: 'formell',
    // Am 23.09.2026 durchgegangen: Die Bausteine bilden ab, was auf der Seite
    // tatsaechlich passiert - keine Cookies, keine Analyse, keine fremden
    // Ressourcen; Logfiles beim Hoster mit gekuerzter Adresse und sieben
    // Tagen Aufbewahrung, beides am Server nachgemessen; die Uebergabe an
    // audit.conct.de steht im seitenspezifischen Abschnitt, der im Repo der
    // Seite bleibt.
    geprueft: true,
    module: [
      ds.verantwortlicher,
      ds.keinDatenschutzbeauftragter,
      ds.hostingMit({ logsTage: 7, adresseGekuerzt: true }),
      ds.keineCookies,
      ds.drittland,
      ds.einwilligungWiderruf,
      ds.externeLinks,
      ds.betroffenenrechte,
      ds.aktualitaet,
    ],
  },

  // Nutzt dieses Preset nicht: der Datenschutztext von rechnungswerk ist am
  // Quelltext belegt und bleibt im Repo. Von hier kommen nur die Stammdaten
  // (anbieterFuer). Steht hier für den Fall, dass sich das ändert.
  'rechnungswerk.conct.de': {
    tone: 'formell',
    geprueft: false,
    module: ds.STANDARD_MODULE,
  },
  'pip-boy.feif.space': {
    tone: 'persoenlich',
    geprueft: false,
    module: ds.STANDARD_MODULE,
  },

  // Android-, Windows- und Linux-App. Abschnittsweise aus der von Hand
  // geschriebenen Seite feif.space/apps-software/sektorix/datenschutz.html
  // (Stand 14.10.2026) uebernommen; Updates und Kauf sind jetzt Bausteine,
  // weil sie in jeder App aus der Vorlage bzw. mit Kauf wiederkehren.
  'sektorix.feif.space': {
    tone: 'persoenlich',
    geprueft: false,
    module: [
      ds.verantwortlicher,
      ds.keinDatenschutzbeauftragter,
      ds.freitext({
        titel: 'Daten auf deinen Laufwerken',
        absaetze: [
          'Sektorix liest angeschlossene Laufwerke, um ihren Zustand zu prüfen und Dateien wiederzufinden. Diese Daten — SMART-Werte, Partitionen, Dateinamen, gerettete Dateien und Images — werden ausschließlich auf deinem Gerät verarbeitet und nur dort gespeichert, wo du es auswählst. Nichts davon wird an uns oder Dritte übertragen. Den Diagnosebericht kopiert die App nur auf deinen Wunsch in die Zwischenablage.',
        ],
      }),
      ds.freitext({
        titel: 'Auf dem Gerät gespeicherte Einstellungen',
        absaetze: [
          'Die App merkt sich lokal, ob die Vollversion freigeschaltet ist, damit sie auch ohne Internetverbindung startet. Diese Angabe verlässt das Gerät nicht und wird mit der App gelöscht.',
        ],
      }),
      ds.storeKauf({ gegenstand: 'die Vollversion', stores: ['google', 'microsoft'] }),
      ds.appUpdates({ plattform: 'Android' }),
      ds.freitext({
        titel: 'Berechtigungen',
        absaetze: [
          'USB-Zugriff (Android): zum Lesen und – nur nach Bestätigung – Beschreiben des angeschlossenen Laufwerks. Android fragt dafür bei jedem Laufwerk nach.',
          'Internet: nur für App-Aktualisierungen und die Kaufprüfung im Store.',
          'Administratorrechte (Windows): Windows erlaubt den direkten Laufwerkszugriff nur mit Administratorrechten.',
        ],
      }),
      ds.freitext({
        titel: 'Kontaktaufnahme',
        absaetze: [
          'Nutzt du in der App die Links zu Kontakt oder Datenrettung, öffnet sich die Website bzw. dein E-Mail-Programm. Dafür gilt die Datenschutzerklärung der Website feif.space.',
        ],
      }),
      ds.drittland,
      ds.einwilligungWiderruf,
      ds.betroffenenrechte,
      ds.aktualitaet,
    ],
  },

  // Android-App, Paket space.feif.klarschiff. Am Quelltext der App vom
  // 06.11.2026 entlang geschrieben: Ausgewertet wird auf dem Geraet, nach
  // draussen gehen nur die Hashes beim freiwilligen Abgleich. Die
  // Plus-Variante (APK ausserhalb von Play) sieht dieselbe Erklaerung; ihre
  // Zusaetze (Bedienungshilfe, alle Dateien, lokales VPN) bleiben ebenfalls
  // auf dem Geraet und stehen im ersten Freitext.
  'klarschiff.feif.space': {
    tone: 'persoenlich',
    // Bleibt false, bis die Logfiles auf leda nachgemessen sind: Die
    // Angaben in hostingMit sind von conct.de uebernommen.
    geprueft: false,
    module: [
      ds.verantwortlicher,
      ds.keinDatenschutzbeauftragter,
      ds.freitext({
        titel: 'Auswertung auf deinem Gerät',
        absaetze: [
          'Klarschiff hilft beim Aufräumen und prüft dein Gerät und deine Apps auf Sicherheitsrisiken. Dafür liest die App die Liste der installierten Apps mit ihren Berechtigungen und ihrer Herkunft sowie Geräteeinstellungen wie Bildschirmsperre, Stand der Sicherheitsupdates und USB-Debugging.',
          'Schaltest du in den Android-Einstellungen den Nutzungsdatenzugriff für Klarschiff ein, liest die App außerdem den Speicherplatz pro App, wann du eine App zuletzt benutzt hast und wie viele Daten jede App gesendet und empfangen hat. Ordner für die Suche nach großen und doppelten Dateien gibst du einzeln frei.',
          'In der Variante Klarschiff Plus kommen auf deinen Wunsch hinzu: die Bedienungshilfe zum automatischen Leeren des Caches, der Zugriff auf alle Dateien und ein lokales VPN, das aufzeichnet, welche App welche Server anfragt. Das VPN leitet nur Namensabfragen über das Gerät weiter, nicht über unsere Server.',
          'All das wird ausschließlich auf deinem Gerät ausgewertet und nicht an uns oder Dritte übertragen. Es gibt kein Nutzerkonto, keine Werbung und keine Analyse- oder Tracking-Dienste.',
        ],
      }),
      ds.freitext({
        titel: 'Abgleich mit bekannter Schadsoftware',
        absaetze: [
          'Nur wenn du zustimmst und den Abgleich startest, berechnet Klarschiff für jede installierte App einen Fingerabdruck (SHA-256-Hash der Installationsdatei) und schickt diese Fingerabdrücke verschlüsselt an unseren Server. Der Server vergleicht sie mit einer Liste bekannter Schad-Apps, die aus MalwareBazaar (abuse.ch) stammt, und schickt nur die Treffer zurück. App-Namen, Dateien oder Gerätekennungen werden nicht übertragen.',
          'Die Fingerabdrücke werden auf dem Server weder gespeichert noch protokolliert.',
          'Rechtsgrundlage ist deine Einwilligung (Art. 6 Abs. 1 lit. a DSGVO). Ohne sie findet kein Abgleich statt; alle übrigen Funktionen bleiben nutzbar.',
        ],
      }),
      ds.hostingMit({ logsTage: 7, adresseGekuerzt: true }),
      ds.freitext({
        titel: 'Speicher auf dem Gerät',
        absaetze: [
          'Klarschiff speichert auf deinem Gerät nur deine Zustimmung zum Abgleich, den zuletzt gewählten Ordner und in Klarschiff Plus die Liste der Verbindungsziele der letzten 30 Tage. Das alles löschst du über „App-Daten löschen“ in den Android-Einstellungen oder indem du die App deinstallierst.',
          'Für diesen Speicher ist keine Einwilligung erforderlich, weil er für die von dir gewünschten Funktionen unbedingt nötig ist (§ 25 Abs. 2 Nr. 2 TDDDG).',
        ],
      }),
      ds.drittland,
      ds.einwilligungWiderruf,
      ds.betroffenenrechte,
      ds.aktualitaet,
    ],
  },

  // Nutzt dieses Preset nicht: Die Rechtstexte der Fibel-Startseite bleiben in
  // deren Repo. Von hier kommen nur die Stammdaten (anbieterFuer) — wie bei
  // rechnungswerk. Neu ist allein das Ziel: ein Fibel-Programm statt einer
  // HTML-Datei (siehe scripts/sync-static.mjs, Eintrag fibel.uber.space).
  //
  // Warum der Text dort bleibt: Der Datenschutz beschreibt die Uebermittlung
  // von Wunsch und Programm an die Fibel-KI und die Spielwiese. `drittland`
  // und `einwilligungWiderruf` kommen dem nahe, treffen es aber nicht — dort
  // geht es um einen Auftragsverarbeiter, hier um eine Uebermittlung, die der
  // Besucher mit einem Knopfdruck selbst ausloest (Art. 6 Abs. 1 lit. a, fuer
  // die USA Art. 49 Abs. 1 lit. a DSGVO). Wer das umdrehen will, gleicht erst
  // die Bausteine an den Live-Text an und traegt `dateien` danach ein — nicht
  // umgekehrt. Dieselbe Reihenfolge wie bei feif.space.
  'fibel.uber.space': {
    tone: 'formell',
    // Bleibt false: Fibels Quelltext vermerkt den Abschnitt zur Fibel-KI selbst
    // als nicht rechtlich geprueft, und ihn hierher zu verschieben prueft ihn
    // nicht. Was hier steht, ist der Text, der dort stand — abschnittsweise
    // gegen die Live-Seite abgeglichen, nicht anwaltlich abgenommen.
    geprueft: false,
    module: [
      ds.verantwortlicher,
      // Derselbe Hoster wie conct.de, also dieselben nachgemessenen Angaben:
      // gekuerzte Adresse und sieben Tage. Die Seite schrieb bisher "IP-Adresse"
      // und "fuer einen begrenzten Zeitraum" — letzteres ist keine Speicherdauer
      // im Sinne von Art. 13 Abs. 2 lit. a DSGVO, und das eigene Pruefwerkzeug
      // meldet es zu Recht.
      ds.hostingMit({ logsTage: 7, adresseGekuerzt: true }),
      /* Woertlich uebernommen, weil die Seite genauer ist als der Baustein: Sie
         nennt die Kekse beim Namen, ihre Laufzeit und den Speicher fuer die
         Hell-Dunkel-Wahl. technischeCookies() sagt stattdessen allgemein
         "technisch notwendige Cookies" — nicht falsch, aber eine Formel statt
         einer Auskunft. */
      ds.freitext({
        titel: 'Cookies und Speicher im Browser',
        absaetze: [
          'Diese Website setzt ein technisch notwendiges Cookie namens „fibel_marke“. Es enthält nur eine zufällige Kennung und schützt Formulare davor, von fremden Seiten aus abgeschickt zu werden. Es wird nach 30 Tagen gelöscht.',
          'Wer sich in einem der Beispiele anmeldet, erhält zusätzlich das Cookie „fibel_sitzung“ für die Dauer der Anmeldung. Auch dieses enthält nur eine zufällige Kennung.',
          'Wählen Sie über den Knopf oben rechts die helle oder dunkle Darstellung, speichert Ihr Browser diese Wahl („hell“ oder „dunkel“) auf Ihrem Gerät. Sie wird nicht an uns übertragen.',
          'Für technisch notwendige Cookies und Speicher ist keine Einwilligung erforderlich (§ 25 Abs. 2 TDDDG). Analyse- oder Tracking-Dienste werden nicht eingesetzt; es findet keine Auswertung Ihres Nutzungsverhaltens statt.',
        ],
      }),
      /* Nur diese Seite hat Beispiel-Anwendungen zum Ausprobieren. Ein Baustein
         dafuer muesste die Pfade, die Konten, die Felder und die Frage, welche
         App im Browser rechnet, parametrisieren — und haette einen Aufrufer. */
      ds.freitext({
        titel: 'Die Beispiele',
        absaetze: [
          'Unter /karat, /zwitscher, /lieferung, /merker und /notes laufen Beispiel-Anwendungen zum Ausprobieren. Sie sind öffentliche Vorführungen — tragen Sie dort nichts ein, was privat bleiben soll.',
          'Wer in einem Beispiel ein Konto anlegt, gibt einen Namen an und wählt ein Passwort; in Zwitscher kann freiwillig eine E-Mail-Adresse, ein Text über sich und ein Profilbild hinzukommen. Das Passwort wird niemals im Klartext gespeichert, sondern nur als kryptografischer Hashwert. Inhalte, die Sie dort anlegen — etwa Beiträge, Nachrichten, Bilder, Bestellungen oder Unterschriften —, werden auf dem Server gespeichert und sind je nach Beispiel auch für andere Nutzer sichtbar.',
          'Merker und Notes rechnen ganz in Ihrem Browser: Die Listen bleiben auf Ihrem Gerät und werden nicht an uns übertragen.',
          'Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO, da die Verarbeitung für die Nutzung des Kontos erforderlich ist. Konten und Inhalte werden gelöscht, sobald Sie es verlangen.',
        ],
      }),
      /* Dieser Abschnitt traegt Drittland UND Widerruf fuer die Fibel-KI. Genau
         deshalb stehen ds.drittland und ds.einwilligungWiderruf nicht in dieser
         Liste: Sie sind "auch dann eine Auskunft, wenn die Antwort findet nicht
         statt lautet" — hier findet sie aber statt, und die generische Fassung
         behauptete das Gegenteil dessen, was hier steht. */
      ds.freitext({
        titel: 'Spielwiese und Fibel-KI',
        absaetze: [
          'Die Spielwiese unter /spielwiese rechnet in Ihrem Browser. Das Programm, das Sie dort schreiben, und die Einträge in der Vorschau speichert Ihr Browser auf Ihrem Gerät; sie werden nicht an uns übertragen.',
          'Nutzen Sie „Mit der Fibel-KI schreiben“, überträgt Ihr Browser Ihren Wunsch und das Programm im Editor an unseren Server. Dort liegen beide höchstens zehn Minuten im Arbeitsspeicher und werden nicht dauerhaft gespeichert.',
          'Die Fibel-KI ist bis auf Weiteres kein eigenes KI-Modell. Solange wir keine eigene KI betreiben, geben wir Wunsch und Programm zur Bearbeitung an einen externen KI-Dienst weiter, der Standorte auch außerhalb der EU haben kann — derzeit Claude der Anthropic mit Sitz in den USA. Dabei können Daten in die USA übermittelt werden. Ihre IP-Adresse, Cookies oder andere Angaben über Sie geben wir nicht weiter. Für die Verarbeitung bei Anthropic gilt deren Datenschutzerklärung: https://www.anthropic.com/legal/privacy. Wechselt der Dienst, passen wir diesen Abschnitt an.',
          'Die Übermittlung geschieht nur, wenn Sie „Schreiben lassen“ betätigen. Rechtsgrundlage ist Ihre Einwilligung durch diese Handlung (Art. 6 Abs. 1 lit. a DSGVO), für die Übermittlung in die USA Art. 49 Abs. 1 lit. a DSGVO. Sie können sie jederzeit für die Zukunft widerrufen, indem Sie die Funktion nicht mehr nutzen. Geben Sie in Wunsch und Programm keine personenbezogenen Daten ein.',
        ],
      }),
      ds.externeLinks,
      // Nennt die Aufsichtsbehoerde und fuehrt die Rechte als Liste. Die Seite
      // hatte beides als einen Satz ohne die Behoerde.
      ds.betroffenenrechte,
      ds.aktualitaet,
    ],
  },
};

/** Alle Seiten, deren Preset noch nicht geprüft wurde. */
export function ungeprueft(): SiteKey[] {
  return (Object.keys(PRESETS) as SiteKey[]).filter((k) => !PRESETS[k].geprueft);
}

function siteOf(key: SiteKey): Site {
  return SITES[key];
}

/**
 * Stammdaten für eine Seite: CONCT, überlagert mit den Abweichungen aus der
 * Registry. Auch für Texte außerhalb von Impressum und Datenschutz gedacht —
 * Widerrufsformular, Bestellmails, Verantwortlicher im eigenen Datenschutztext.
 */
export function anbieterFuer(key: SiteKey, basis: Anbieter = CONCT): Anbieter {
  return { ...basis, ...siteOf(key).anbieter };
}

/**
 * Impressum für eine registrierte Seite.
 *
 *   impressumFuer('choozy.io')
 */
export function impressumFuer(
  key: SiteKey,
  anbieter: Anbieter = anbieterFuer(key),
  opts?: ImpressumOptions,
): LegalDoc {
  return impressum(anbieter, siteOf(key), opts);
}

/**
 * Datenschutzerklärung für eine registrierte Seite, mit den in `PRESETS`
 * hinterlegten Bausteinen und der dort gewählten Tonlage.
 *
 *   datenschutzFuer('choozy.io')
 *   datenschutzFuer('choozy.io', CONCT, { tone: 'formell' })
 */
export function datenschutzFuer(
  key: SiteKey,
  anbieter: Anbieter = anbieterFuer(key),
  overrides: DatenschutzOptions = {},
): LegalDoc {
  const preset = PRESETS[key];
  return datenschutz(anbieter, siteOf(key), {
    tone: overrides.tone ?? preset.tone,
    module: overrides.module ?? preset.module,
  });
}
