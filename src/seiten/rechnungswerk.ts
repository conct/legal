import * as ds from '../datenschutz.js';
import type { Modul } from '../datenschutz.js';
import type { ImpressumOptions } from '../impressum.js';
import type { Preset } from '../presets.js';
import { SITES } from '../sites.js';
import { type Section, link, mail, p, txt } from '../types.js';
/**
 * Vorschlag für @conct/legal: rechnungswerk.conct.de (Website + Webapp) und
 * rechnungswerk-app (iOS/Android, apps/mobile).
 *
 * Quelle des Website-Texts: rechnungswerk/apps/website/src/pages/datenschutz.astro,
 * Stand 15.09.2026. Abschnittsweise übernommen; Bausteine nur, wo sie dasselbe
 * sagen, sonst ds.freitext mit dem Wortlaut der Seite. Listen bleiben Listen
 * (string[]), die Verweise auf /kontakt und /widerruf Links (Block), die Anker
 * #kontaktformular und #widerruf bleiben (id). Ohne Entsprechung im Paket:
 * <strong> und <code> — der Wortlaut bleibt, nur die Auszeichnung fehlt.
 *
 * Bleibt in datenschutz.astro (ohne Abschnittsnummer, wie die Einleitung im
 * Impressum): der Absatz „Kurz vorweg …“ vor dem Fragment und „Stand: …“ danach.
 *
 * Einfügen:
 *  - SITES_NEU  → src/sites.ts, in SITES (rechnungswerk.conct.de unverändert,
 *                 rechnungswerk-app neu)
 *  - RW         → src/presets.ts, vor PRESETS (gemeinsame Abschnitte)
 *  - PRESETS_NEU→ src/presets.ts, in PRESETS (ersetzt den bisherigen
 *                 STANDARD_MODULE-Eintrag samt Kommentar „Nutzt dieses Preset nicht“)
 *  - presets.ts braucht zusätzlich: import { link, p, txt } from './types.js';
 *  - setzt freitext mit id und string[]/Block voraus (Stand legal nach 1.5.0)
 */

// ---------------------------------------------------------------------------
// (a) SITES
// ---------------------------------------------------------------------------


// ---------------------------------------------------------------------------
// Gemeinsame Abschnitte. Wörtlich aus datenschutz.astro, soweit nicht anders
// vermerkt; Website und App teilen sie, damit eine Änderung beide erreicht.
// ---------------------------------------------------------------------------

export const RW = {
  renderdienst: ds.freitext({
    titel: 'Erzeugen einer Rechnung über den Renderdienst',
    absaetze: [
      'In der kostenlosen Stufe wird das PDF auf unserem Server erzeugt. Dabei übermitteln Sie die Rechnungsdaten — darunter Namen und Anschriften Ihrer Kundinnen und Kunden.',
      [
        'Zweck: Erzeugung des angeforderten Dokuments',
        'Rechtsgrundlage: Artikel 6 Absatz 1 Buchstabe b DSGVO — Erfüllung des Nutzungsvertrags',
        'Speicherdauer: keine. Die Daten werden im Arbeitsspeicher verarbeitet und mit der Antwort verworfen; sie werden weder in eine Datei noch in eine Datenbank geschrieben.',
        'Empfänger: keine. Es findet keine Weitergabe statt.',
      ],
      'In den kostenpflichtigen Stufen entsteht das PDF auf Ihrem Gerät. Dann verlassen die Rechnungsdaten das Gerät überhaupt nicht.',
    ],
  }),

  storeKauf: ds.freitext({
    // Nicht ds.storeKauf: Die Seite sagt mehr (Firmen der Stores, „weder Ihren
    // Namen noch Ihre E-Mail-Adresse“), der Baustein verlinkt dafür die
    // Datenschutzhinweise. Fachlich deckungsgleich, wörtlich nicht.
    titel: 'Kauf in der App über App Store oder Play Store',
    absaetze: [
      'Kaufen Sie die Stufe innerhalb der App für iPhone oder Android, wickelt der jeweilige Store den Kauf vollständig ab: Apple Inc. beziehungsweise Google Ireland Limited. Wir erhalten dabei weder Ihren Namen noch Ihre E-Mail-Adresse oder Zahlungsdaten — die App fragt beim Store lediglich ab, ob ein gültiger Kauf vorliegt. Für die Verarbeitung durch die Stores gelten deren Datenschutzerklärungen.',
    ],
  }),

  reichweite: ds.freitext({
    // Nicht ds.keineCookies: Der Baustein sagt „keine Cookies“, die Seite
    // „keine, die nicht erforderlich sind“, und nennt Profiling/automatisierte
    // Entscheidung, die der Baustein nicht kennt.
    titel: 'Keine Reichweitenmessung',
    absaetze: [
      'Wir setzen keine Analysewerkzeuge, keine Zählpixel und keine Dienste zur Reichweitenmessung ein. Es findet kein Profiling und keine automatisierte Entscheidungsfindung statt.',
    ],
  }),

  /**
   * Nicht ds.betroffenenrechte: Der Baustein nennt den Widerspruch ohne die
   * Einschränkung „gegen Verarbeitungen, die auf berechtigtem Interesse
   * beruhen“ und kennt den Satz zur Zuständigkeit der Behörde nicht. Kein
   * freitext, weil die Behörde aus den Stammdaten kommt (wie bisher über
   * anbieterFuer) — ein fest eingetragener Name liefe beim nächsten Umzug der
   * Behörde auseinander.
   */
  rechte: ((ctx) => ({
    title: 'Ihre Rechte',
    blocks: [
      p(
        txt(
          'Sie haben das Recht auf Auskunft (Artikel 15), Berichtigung (Artikel 16), Löschung (Artikel 17), Einschränkung der Verarbeitung (Artikel 18), Datenübertragbarkeit (Artikel 20) sowie Widerspruch gegen Verarbeitungen, die auf berechtigtem Interesse beruhen (Artikel 21 DSGVO). Wenden Sie sich dazu an die oben genannte Adresse.',
        ),
      ),
      p(
        txt(
          'Unabhängig davon können Sie sich bei einer Datenschutz-Aufsichtsbehörde beschweren.' +
            (ctx.anbieter.aufsichtsbehoerde
              ? ` Zuständig ist die Behörde am Sitz des Verantwortlichen: die ${ctx.anbieter.aufsichtsbehoerde}.`
              : ''),
        ),
      ),
    ],
  })) satisfies Modul,
};

// ---------------------------------------------------------------------------
// (b) PRESETS
// ---------------------------------------------------------------------------

export const PRESETS_RECHNUNGSWERK = {
  // Website und Webapp (/app). Abschnittsweise aus
  // apps/website/src/pages/datenschutz.astro (Stand 15.09.2026), dort am
  // Quelltext belegt (Kommentarkopf der Seite nennt die Dateien).
  'rechnungswerk.conct.de': {
    tone: 'formell',
    // Bleibt false: abgebildet, nicht geprüft. Offen vor dem Umstellen:
    //  - „Begrenzung der kostenlosen Stufe“ nannte auf der Live-Seite eine
    //    Gerätekennung im Anfragekopf. Der Dienst liest x-geraet-id
    //    (services/api/src/server.ts), aber weder App noch Webapp schicken sie
    //    (nur tools/validate) — hier deshalb korrigiert auf die IP-Adresse.
    //  - Die Texterkennung der Webapp liefert Worker, Kern und Sprachmodell
    //    seit dem 06.11.2026 selbst aus (/app/texterkennung/), nichts mehr von
    //    cdn.jsdelivr.net — „Schriftarten“ stimmt damit wieder.
    geprueft: false,
    module: [
      // Nennt zusätzlich Marke, Land und Telefon — die Seite nur Name,
      // Anschrift und E-Mail. Alles davon steht ohnehin im Impressum.
      ds.verantwortlicher,
      // Die Seite: „…; die Voraussetzungen nach Paragraf 38 BDSG liegen nicht
      // vor.“ Der Baustein sagt dasselbe, nennt Art. 37 DSGVO mit und benennt
      // den Ansprechpartner — eigener Abschnitt statt Absatz unter 1.
      ds.keinDatenschutzbeauftragter,
      // Nicht hostingMit: Der Baustein sagt, der Hoster erhebe Logfiles und
      // speichere sie sieben Tage. Hier ist das Protokoll abgeschaltet.
      ds.freitext({
        titel: 'Aufruf der Seiten',
        absaetze: [
          'Beim Abruf jeder Seite überträgt Ihr Browser technisch notwendige Daten an unseren Server: IP-Adresse, Zeitpunkt, abgerufene Adresse, übertragene Datenmenge, Verweisseite sowie Browser- und Betriebssystemkennung. Sie werden verarbeitet, um die Seite auszuliefern. Ein Zugriffsprotokoll führen wir nicht — es ist beim Hoster abgeschaltet.',
          [
            'Zweck: Auslieferung der Seite, Betriebssicherheit, Fehlersuche',
            'Rechtsgrundlage: Artikel 6 Absatz 1 Buchstabe f DSGVO — berechtigtes Interesse am sicheren und störungsfreien Betrieb',
            'Speicherdauer: keine, solange das Zugriffsprotokoll abgeschaltet ist. Schalten wir es zur Fehlersuche vorübergehend ein, kürzt der Hoster die IP-Adresse vor dem Schreiben auf die ersten 16 Bit (IPv4) beziehungsweise 32 Bit (IPv6); die Dateien werden täglich gewechselt und nach sieben Tagen gelöscht.',
          ],
        ],
      }),
      // Trägt Drittland (nein, für den Hoster) und den AV-Vertrag. Deshalb
      // weder ds.drittland noch ds.auftragsverarbeitung: drittland sagte
      // pauschal „findet nicht statt“ — für Stripe stimmt das nicht.
      ds.freitext({
        titel: 'Hosting',
        absaetze: [
          'Die Seiten werden bei Uberspace (Jonas Pasche, Kaiserstraße 15, 55116 Mainz) betrieben. Der Serverstandort liegt in Deutschland; eine Übermittlung in Drittländer findet nicht statt. Mit dem Hoster besteht ein Vertrag über Auftragsverarbeitung nach Artikel 28 DSGVO. Beim selben Hoster liegen auch unser Postfach und der Versanddienst, über den die Formulare dieser Seite ihre Nachrichten verschicken.',
        ],
      }),
      ds.freitext({
        titel: 'Der Prüfer verlässt Ihren Browser nicht',
        absaetze: [
          'Die Prüfung einer Rechnung findet vollständig in Ihrem Browser statt. Die ausgewählte Datei wird nicht hochgeladen, nicht an uns übermittelt, nicht gespeichert und nicht weitergegeben. Sie können den Netzwerkverkehr Ihres Browsers mitlesen und sich davon überzeugen.',
        ],
      }),
      ds.freitext({
        titel: 'Die App speichert auf Ihrem Gerät',
        absaetze: [
          'Rechnungen, Kunden, Artikelvorlagen und Ihr Absenderprofil legt die App im Speicher Ihres Browsers beziehungsweise Ihres Geräts ab (im Web: localStorage). Diese Daten werden nicht an uns übertragen. Löschen Sie die Websitedaten Ihres Browsers, sind sie fort — auch für uns nicht wiederherstellbar, weil wir sie nie hatten.',
          'Es werden keine Cookies gesetzt, die für den Betrieb nicht erforderlich sind. Eine Einwilligungsabfrage entfällt deshalb.',
        ],
      }),
      RW.renderdienst,
      ds.freitext({
        titel: 'Begrenzung der kostenlosen Stufe',
        absaetze: [
          'Um die kostenlose Stufe auf fünf Rechnungen je Dreißigtagezeitraum zu begrenzen, zählen wir die Aufrufe des Renderdienstes je IP-Adresse.',
          [
            'Zweck: Einhaltung der zugesagten Freimenge, Schutz vor Missbrauch',
            'Rechtsgrundlage: Artikel 6 Absatz 1 Buchstabe f DSGVO',
            'Speicherdauer: Der Zähler liegt ausschließlich im Arbeitsspeicher des Dienstes und ist mit jedem Neustart fort, spätestens nach dreißig Tagen.',
          ],
        ],
      }),
      // Nicht ds.kontaktformular: der Baustein nennt einen Honeypot und keine
      // IP-Adresse, keine Kopie unter „Gesendet“, keinen Mengenzähler.
      // Anker #kontaktformular: verlinkt aus kontakt.astro.
      ds.freitext({
        titel: 'Kontaktformular',
        id: 'kontaktformular',
        absaetze: [
          p(
            txt('Schreiben Sie uns über das '),
            link('Kontaktformular', '/kontakt'),
            txt(
              ', übermittelt Ihr Browser Name, E-Mail-Adresse und Nachricht an unseren Server. Von dort geht die Nachricht als E-Mail in unser Postfach; mitgeschickt werden der Zeitpunkt und die IP-Adresse, von der das Formular abgeschickt wurde. An Sie selbst verschicken wir dabei nichts.',
            ),
          ),
          [
            'Zweck: Beantwortung Ihrer Anfrage; die IP-Adresse zur Abwehr von Missbrauch',
            'Rechtsgrundlage: Artikel 6 Absatz 1 Buchstabe b DSGVO, soweit Ihre Anfrage einen Vertrag betrifft oder vorbereitet, sonst Buchstabe f — berechtigtes Interesse an der Beantwortung von Anfragen. Für die IP-Adresse Buchstabe f.',
            'Speicherdauer: Die Nachricht liegt in unserem Postfach, bis Ihr Anliegen erledigt ist, und wird danach gelöscht, soweit keine Aufbewahrungspflicht besteht. Zusätzlich legt unser Versanddienst von jeder verschickten Nachricht eine Kopie im Ordner „Gesendet" seines Postfachs ab; diese Kopien werden nach drei Jahren automatisch gelöscht. Zur Abwehr von Missbrauch zählt der Dienst Anfragen je IP-Adresse im Arbeitsspeicher; dieser Zähler verfällt nach zehn Minuten.',
            'Empfänger: keine. Es findet keine Weitergabe statt.',
          ],
        ],
      }),
      // Anker #widerruf: verlinkt aus widerruf.astro.
      ds.freitext({
        titel: 'Widerruf über das Formular',
        id: 'widerruf',
        absaetze: [
          p(
            txt('Übermitteln Sie einen Widerruf über das Formular auf der Seite '),
            link('Widerrufsbelehrung', '/widerruf'),
            txt(
              ', verarbeiten wir die Angaben aus dem Formular — Vertragsgegenstand, Bestell- und Erhaltdatum, Name, Anschrift, E-Mail-Adresse und Datum — sowie den Zeitpunkt und die IP-Adresse der Übermittlung. Der Widerruf geht als E-Mail in unser Postfach. Den Eingang bestätigen wir per E-Mail an die angegebene Adresse; diese Bestätigung enthält nur den Zeitpunkt und eine Eingangsnummer, keine Angaben aus dem Formular.',
            ),
          ),
          [
            'Zweck: Bearbeitung des Widerrufs, die gesetzlich vorgeschriebene Eingangsbestätigung und der Nachweis von Widerruf und Bestätigung; die IP-Adresse zur Abwehr von Missbrauch',
            'Rechtsgrundlage: Artikel 6 Absatz 1 Buchstabe c DSGVO in Verbindung mit Paragraf 355 und Paragraf 356 Absatz 1 BGB. Für die IP-Adresse und die Mengengrenzen Buchstabe f.',
            'Speicherdauer: Widerruf und Bestätigung bewahren wir drei Jahre auf — so lange können Ansprüche aus dem Vertrag geltend gemacht werden (Paragraf 195 BGB). Die Kopien im Ordner „Gesendet" löscht der Versanddienst danach automatisch. Damit niemand über das Formular fremde Postfächer mit Bestätigungen füllt, zählt der Dienst Widerrufe je IP-Adresse und Bestätigungen je E-Mail-Adresse; diese Zähler liegen nur im Arbeitsspeicher und verfallen nach 24 Stunden.',
            'Empfänger: keine. Es findet keine Weitergabe statt.',
          ],
        ],
      }),
      // Trägt die Drittlandübermittlung (Stripe, Inc., USA) selbst.
      ds.freitext({
        titel: 'Kauf einer kostenpflichtigen Stufe',
        absaetze: [
          'Der Kauf im Browser läuft über den Zahlungsdienstleister Stripe, wahlweise mit Karte oder über PayPal. Zahlungsdaten sehen wir nicht. Kartennummer beziehungsweise PayPal-Zugangsdaten geben Sie unmittelbar bei Stripe ein; sie erreichen unseren Server zu keinem Zeitpunkt.',
          [
            'Verarbeitete Daten: Ihre E-Mail-Adresse (von Stripe erhoben), die gewählte Stufe, der Betrag, die Kaufkennung sowie der Zeitpunkt der beiden Bestätigungen, die Sie vor der Zahlung abgeben.',
            'Zweck: Abwicklung des Kaufvertrags, Ausstellung und Zusendung des Lizenzschlüssels sowie der Nachweis, dass Sie dem sofortigen Beginn zugestimmt haben.',
            'Rechtsgrundlage: Artikel 6 Absatz 1 Buchstabe b DSGVO — Erfüllung des Kaufvertrags. Für den Nachweis der Zustimmung zusätzlich Buchstabe c in Verbindung mit den handels- und steuerrechtlichen Aufbewahrungspflichten.',
            'Empfänger: Stripe Payments Europe, Ltd., 1 Grand Canal Street Lower, Dublin, Irland. Bei Zahlung über PayPal zusätzlich PayPal (Europe) S.à r.l. et Cie, S.C.A., Luxemburg.',
            'Drittlandübermittlung: Stripe kann Daten an die Stripe, Inc. in den Vereinigten Staaten übermitteln. Grundlage sind die Standardvertragsklauseln der EU-Kommission sowie die Zertifizierung nach dem EU-US Data Privacy Framework.',
            'Speicherdauer bei uns: Wir führen keine Kundendatenbank. E-Mail-Adresse und Kaufkennung liegen ausschließlich im Arbeitsspeicher des Dienstes, solange der Lizenzschlüssel ausgestellt und versandt wird, und sind spätestens mit dem nächsten Neustart fort. Die aufbewahrungspflichtigen Belege liegen in unserem Konto beim Zahlungsdienstleister; für dessen Speicherdauer gilt dessen Datenschutzerklärung.',
          ],
          'Es entsteht kein Benutzerkonto. Der Lizenzschlüssel wird auf Ihrem Gerät geprüft — ohne Anmeldung und ohne Verbindung zu uns. Wir erfahren daher nicht, ob, wann oder wie oft Sie ihn einlösen.',
        ],
      }),
      ds.freitext({
        titel: 'Versand des Lizenzschlüssels',
        absaetze: [
          'Den Lizenzschlüssel und die Bestellbestätigung senden wir an die E-Mail-Adresse, die Sie bei der Zahlung angegeben haben. Der Versand läuft über unseren eigenen Versanddienst beim selben Hoster; eine Weitergabe an einen Versanddienstleister findet nicht statt. Von dieser E-Mail wird keine Kopie gespeichert — auch nicht im Ordner „Gesendet". Rechtsgrundlage ist Artikel 6 Absatz 1 Buchstabe b DSGVO. Ein Newsletter wird nicht versandt, und Ihre Adresse wird nicht für Werbung verwendet.',
        ],
      }),
      RW.storeKauf,
      ds.freitext({
        titel: 'Schriftarten',
        absaetze: [
          'Die verwendeten Schriften liegen auf unserem eigenen Server. Es werden keine Schriften, Symbole oder Skripte von Google oder anderen Anbietern nachgeladen; Ihre IP-Adresse gelangt dadurch an niemanden sonst.',
        ],
      }),
      RW.reichweite,
      RW.rechte,
      // Kein ds.drittland (stünde im Widerspruch zu Stripe, siehe oben), kein
      // ds.einwilligungWiderruf (die Seite holt keine Einwilligung ein) und
      // kein ds.aktualitaet (die Seite hat stattdessen „Stand: …“).
    ],
  },

  // Native App, apps/mobile (Expo, de.rechnungswerk.app). NEUER Text — es gibt
  // keine Vorlage. Am Quelltext vom 06.11.2026 entlang geschrieben:
  //  - Speicher: src/storage/index.native.ts (SQLite im Dokumentordner, vom
  //    Systembackup erfasst)
  //  - Netz: src/render.ts (POST /v1/render, nur kostenlose Stufe),
  //    src/specifications.ts (GET /v1/spezifikationen, höchstens alle 24 h),
  //    src/dienst.ts (GET /health beim Einstellen einer eigenen Adresse)
  //  - Kauf: src/kauf/index.native.ts (expo-iap), Schlüssel offline geprüft
  //  - Kein expo-updates, keine Analyse, keine Absturzberichte, keine
  //    Texterkennung auf dem Gerät (texterkennung.native.ts)
  'rechnungswerk-app': {
    tone: 'formell',
    // Bleibt false: Entwurf. Vor dem Livegang nachsehen, ob das abgeschaltete
    // Zugriffsprotokoll auch für den Dienst unter /api gilt.
    geprueft: false,
    module: [
      ds.verantwortlicher,
      ds.keinDatenschutzbeauftragter,
      ds.freitext({
        titel: 'Ihre Rechnungen bleiben auf Ihrem Gerät',
        absaetze: [
          'Rechnungen, Kunden, Artikelvorlagen und Ihr Absenderprofil legt die App in einer Datenbank auf Ihrem Gerät ab. Diese Daten werden nicht an uns übertragen.',
          'Die Datenbank liegt im Dokumentordner der App und wird deshalb von der Datensicherung Ihres Geräts erfasst, sofern Sie diese eingeschaltet haben. Für diese Sicherung gelten die Bedingungen von Apple beziehungsweise Google. Deinstallieren Sie die App, wird die Datenbank auf dem Gerät gelöscht.',
          'Teilen oder exportieren Sie eine Rechnung, übergibt die App die Datei an die App, die Sie dafür auswählen. Dateien, die Sie einlesen, verarbeitet die App auf dem Gerät.',
        ],
      }),
      RW.renderdienst,
      ds.freitext({
        // Abweichend von der Website: Die App schickt keine Gerätekennung mit
        // (render.ts), gezählt wird also nach IP-Adresse.
        titel: 'Begrenzung der kostenlosen Stufe',
        absaetze: [
          'Um die kostenlose Stufe auf fünf Rechnungen je Dreißigtagezeitraum zu begrenzen, zählen wir die Aufrufe des Renderdienstes je IP-Adresse.',
          [
            'Zweck: Einhaltung der zugesagten Freimenge, Schutz vor Missbrauch',
            'Rechtsgrundlage: Artikel 6 Absatz 1 Buchstabe f DSGVO',
            'Speicherdauer: Der Zähler liegt ausschließlich im Arbeitsspeicher des Dienstes und ist mit jedem Neustart fort, spätestens nach dreißig Tagen.',
          ],
        ],
      }),
      ds.freitext({
        titel: 'Abruf der Spezifikationskennungen',
        absaetze: [
          'Damit Ihre Rechnungen die gültigen Kennungen der E-Rechnungs-Standards tragen, fragt die App beim Start höchstens einmal täglich bei unserem Server den aktuellen Stand ab. Dabei werden keine Rechnungsdaten und keine Kennung übertragen; unser Server erhält technisch bedingt die IP-Adresse Ihres Geräts und den Zeitpunkt. Ein Zugriffsprotokoll führen wir nicht.',
          [
            'Zweck: Erzeugung gültiger Rechnungen',
            'Rechtsgrundlage: Artikel 6 Absatz 1 Buchstabe f DSGVO',
            'Speicherdauer: keine. Der abgerufene Stand wird auf Ihrem Gerät zwischengespeichert.',
          ],
        ],
      }),
      ds.freitext({
        titel: 'Eigener Dienst',
        absaetze: [
          'In den Einstellungen können Sie statt unseres Servers einen eigenen Renderdienst eintragen, etwa einen Rechner in Ihrem eigenen Netz. Die App prüft die Adresse vorab mit einer Anfrage an diesen Dienst. Danach gehen Renderaufträge und der Abruf der Spezifikationskennungen an diesen Dienst und nicht an uns; für die Verarbeitung dort ist verantwortlich, wer ihn betreibt.',
        ],
      }),
      ds.freitext({
        // Aus „Hosting“ der Website, ohne den Satz zu Postfach und Formularen.
        titel: 'Hosting',
        absaetze: [
          'Unser Server wird bei Uberspace (Jonas Pasche, Kaiserstraße 15, 55116 Mainz) betrieben. Der Serverstandort liegt in Deutschland; eine Übermittlung in Drittländer findet nicht statt. Mit dem Hoster besteht ein Vertrag über Auftragsverarbeitung nach Artikel 28 DSGVO.',
        ],
      }),
      RW.storeKauf,
      ds.freitext({
        titel: 'Lizenzschlüssel und Kauf im Browser',
        absaetze: [
          '„Im Browser kaufen“ öffnet die Kaufseite unserer Website in Ihrem Browser. Für den Kauf dort gilt die Datenschutzerklärung der Website rechnungswerk.conct.de.',
          'Es entsteht kein Benutzerkonto. Der Lizenzschlüssel wird auf Ihrem Gerät geprüft — ohne Anmeldung und ohne Verbindung zu uns. Wir erfahren daher nicht, ob, wann oder wie oft Sie ihn einlösen.',
        ],
      }),
      ds.freitext({
        titel: 'Keine Reichweitenmessung',
        absaetze: [
          'Wir setzen keine Analysewerkzeuge, keine Dienste zur Reichweitenmessung und keine Absturzberichte ein. Die App lädt keine Aktualisierungen an den Stores vorbei. Es findet kein Profiling und keine automatisierte Entscheidungsfindung statt.',
        ],
      }),
      RW.rechte,
      ds.aktualitaet,
    ],
  },
} satisfies Record<string, Preset>;
