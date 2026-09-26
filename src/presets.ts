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
