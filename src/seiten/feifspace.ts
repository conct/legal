import * as ds from '../datenschutz.js';
import type { Modul } from '../datenschutz.js';
import type { ImpressumOptions } from '../impressum.js';
import type { Preset } from '../presets.js';
import { br, mail, p, txt } from '../types.js';
/**
 * Vorschlag: feif.space an @conct/legal hängen.
 *
 * Quelle: feif.space/impressum.html (Stand 12. September 2026) und
 * feif.space/datenschutz.html (Stand 23. September 2026), abschnittsweise
 * übernommen. Bausteine nur dort, wo sie inhaltlich dasselbe sagen; alles andere
 * wörtlich als ds.freitext, in der Du-Form und Ich-Form des Originals.
 *
 * Einbau:
 *   - PRESETS_FEIFSPACE                → `...PRESETS_FEIFSPACE` in PRESETS (src/presets.ts),
 *     der bisherige Eintrag 'feif.space' samt Kommentar entfällt
 *   - Änderung am Site-Eintrag          → siehe unten, src/sites.ts
 *   - STATIC_SITES['feif.space']        → `dateien` + `eigeneUeberschrift: true`
 *     (scripts/sync-static.mjs), erst NACHDEM das Template eine
 *     <section class="legal"> trägt — sonst bricht der Sync ab.
 *
 * Was NICHT hier steht und im Template bleibt (außerhalb der section):
 *   - <span class="mono"> und <h1> (deshalb eigeneUeberschrift: true; doc.title
 *     wäre „Datenschutzerklärung“, die Seite sagt „Datenschutz“)
 *   - der Vorspann <p class="lede"> im Datenschutz
 *   - <p class="stand"> auf beiden Seiten — wie bei apps-software/klarschiff;
 *     von Hand nachzuziehen, wenn sich hier etwas ändert.
 */

// --- src/sites.ts, Eintrag 'feif.space' ------------------------------------------
//
//   'feif.space': {
//     domain: 'feif.space',
//     name: 'feif.space',
//     externeLinks: [...geschwister, 'Instagram- und TikTok-Profile'],
//     hoster: 'Uberspace (Jonas Pasche, Kaiserstraße 15, 55116 Mainz)',
//     // NEU: Impressum und Verantwortlicher nennen live „Deutschland“ als
//     // letzte Zeile der Anschrift. Wirkt auch auf § 18 MStV (dort stand es
//     // live nicht — unschädlich).
//     anbieter: { land: 'Deutschland' },
//   },
//
// `hoster` und `externeLinks` liest dieses Preset nicht mehr: Der Hosting-
// Abschnitt ist Freitext (Hoster-Wortlaut der Live-Seite, s. u.), und
// „Haftung für Links“ kommt über `wortlaut`. Sie bleiben trotzdem stehen.

// --- Impressum ------------------------------------------------------------------

const impressumFeifspace: ImpressumOptions = {
  // Urheberrecht und Marken/Fanprojekt stehen live NACH „Haftung für Links“,
  // deshalb `ende` statt `zusatz`.
  ende: [
    {
      title: 'Urheberrecht',
      blocks: [
        p(
          txt(
            'Die durch mich erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen Urheberrecht. ' +
              'Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen des ' +
              'Urheberrechts bedürfen meiner schriftlichen Zustimmung. Downloads und Kopien dieser Seite sind nur ' +
              'für den privaten, nicht kommerziellen Gebrauch gestattet.',
          ),
        ),
      ],
    },
    {
      title: 'Hinweis zu Marken und zum Fanprojekt',
      blocks: [
        p(
          txt(
            // Wörtlich, auch das gerade Schlusszeichen in „Pip-Boy" (live so;
            // typografisch richtig wäre „Pip-Boy“).
            'Die genannten Produkt- und Firmennamen sowie Marken sind Eigentum ihrer jeweiligen Inhaber. ' +
              'Das auf der Startseite vorgestellte Projekt „Pip-Boy" ist ein inoffizielles, nicht kommerzielles ' +
              'Fanprojekt und steht in keiner Verbindung zu den Rechteinhabern der zugrunde liegenden Marke.',
          ),
        ),
      ],
    },
  ],
  // Ich-Form statt „wir“, und beide Haftungsabschnitte sind live länger als der
  // Standardwortlaut.
  wortlaut: {
    streitbeilegung: [
      p(
        txt(
          'Ich bin nicht verpflichtet und nicht bereit, an Streitbeilegungsverfahren vor einer ' +
            'Verbraucherschlichtungsstelle teilzunehmen.',
        ),
      ),
    ],
    haftungInhalte: [
      p(
        txt(
          'Als Diensteanbieter bin ich gemäß § 7 Abs. 1 DDG für eigene Inhalte auf diesen Seiten verantwortlich. ' +
            'Nach §§ 8 bis 10 DDG bin ich als Diensteanbieter jedoch nicht verpflichtet, übermittelte oder ' +
            'gespeicherte fremde Informationen zu überwachen oder nach Umständen zu forschen, die auf eine ' +
            'rechtswidrige Tätigkeit hinweisen.',
        ),
      ),
      p(
        txt(
          'Verpflichtungen zur Entfernung oder Sperrung der Nutzung von Informationen nach den allgemeinen Gesetzen ' +
            'bleiben hiervon unberührt. Eine diesbezügliche Haftung ist jedoch erst ab dem Zeitpunkt der Kenntnis ' +
            'einer konkreten Rechtsverletzung möglich. Bei Bekanntwerden entsprechender Rechtsverletzungen entferne ' +
            'ich diese Inhalte unverzüglich.',
        ),
      ),
    ],
    haftungLinks: [
      p(
        txt(
          'Diese Seite verweist auf externe Websites, unter anderem auf die vorgestellten Projekte. Auf deren ' +
            'Inhalte habe ich keinen Einfluss und übernehme für sie keine Gewähr. Für die Inhalte der verlinkten ' +
            'Seiten ist stets der jeweilige Anbieter oder Betreiber verantwortlich. Die verlinkten Seiten wurden ' +
            'zum Zeitpunkt der Verlinkung auf mögliche Rechtsverstöße überprüft; rechtswidrige Inhalte waren nicht ' +
            'erkennbar. Eine permanente inhaltliche Kontrolle der verlinkten Seiten ist ohne konkrete ' +
            'Anhaltspunkte einer Rechtsverletzung nicht zumutbar. Bei Bekanntwerden von Rechtsverletzungen ' +
            'entferne ich solche Links unverzüglich.',
        ),
      ),
    ],
  },
  // Angaben, Kontakt, Umsatzsteuer und § 18 MStV kommen aus impressum() selbst:
  //   - Kontakt: Telefon erscheint als „+49 (0) 611 9458 4300“ (CONCT), live
  //     „0611 94584300“ — dieselbe Nummer, tel:-Link identisch.
  //   - Umsatzsteuer: „§ 27a“ statt live „§ 27 a“.
  //   - § 18 MStV: Anschrift zeilenweise (mit „Deutschland“), live einzeilig.
  // Der HTML-Kommentar der Live-Seite unter „Umsatzsteuer“ — „Die Steuernummer
  // ist etwas anderes und hat in einem Impressum nichts zu suchen. § 5 DDG
  // verlangt die Umsatzsteuer-Identifikationsnummer, und nur wenn eine
  // vorhanden ist.“ — entfällt mit dem Sync; er steht sinngemäß in anbieter.ts.
};

// --- Datenschutz ----------------------------------------------------------------

export const PRESETS_FEIFSPACE: Record<'feif.space', Preset> = {
  // Abschnittsweise aus feif.space/datenschutz.html (Stand 23.09.2026). 13
  // Abschnitte wie live, Du-Form wie live. Bisher stand hier ein Entwurf mit 7
  // Abschnitten in der Sie-Form (siehe README, „Die geprueft-Flagge“).
  'feif.space': {
    tone: 'persoenlich',
    // Bleibt false: Der Text ist wörtlich übernommen, rendert aber nicht
    // wortgleich — Verantwortlicher kommt aus dem Baustein (Reihenfolge
    // E-Mail/Telefon, Telefonschreibweise, Links),
    // Adressblöcke werden <p> statt <address>.
    geprueft: false,
    impressum: impressumFeifspace,
    module: [
      // 1. Original: Name, Straße, Ort, Deutschland, Leerzeile, „Telefon:
      // 0611 94584300“, „E-Mail: mail@feif.space“ (ohne Links). Der Baustein nennt
      // dasselbe aus den Stammdaten, aber E-Mail vor Telefon, ohne Leerzeile,
      // mit Links und „+49 (0) 611 9458 4300“. Braucht `anbieter.land` (s. o.).
      ds.verantwortlicher,
      // 2. Nicht ds.keinDatenschutzbeauftragter: Der Baustein heißt
      // „Ansprechpartner für den Datenschutz“ und lässt die Begründung
      // (Einzelunternehmen ohne umfangreiche Verarbeitung besonderer
      // Datenkategorien) weg.
      ds.freitext({
        titel: 'Datenschutzbeauftragter',
        absaetze: [
          'Es ist kein Datenschutzbeauftragter bestellt. Die Pflicht dazu besteht hier nicht: Es geht um ein Einzelunternehmen ohne umfangreiche Verarbeitung besonderer Datenkategorien (Art. 37 DSGVO, § 38 BDSG). Ansprechpartner in allen Datenschutzfragen ist die oben genannte Adresse.',
        ],
      }),
      /* 3. Nicht ds.hostingMit({ logsTage: 7, adresseGekuerzt: true }), obwohl
         sieben Tage und die Kürzung übereinstimmen: Die Feldliste des Bausteins
         (übertragene Datenmenge, Browsertyp und -version, Betriebssystem) ist
         eine andere als die des Originals (Domain und Port, angeforderte
         Adresse, Statuscode, Größe der Antwort, User-Agent), der Baustein kennt
         den AV-Vertrag nicht, beschreibt die Kürzung mit Bitzahlen statt „vom
         Anbieter“, und nennt als Zweck „Bereitstellung und Absicherung“ statt
         „technischer Betrieb und Abwehr von Angriffen“.

         Hoster wörtlich wie live: „Uberspace, betrieben von Jonas Pasche,
         Kaiserstr. 15“ — SITES['feif.space'].hoster schreibt „Kaiserstraße“ und
         setzt den Betreiber in Klammern. Bewusst nicht aus `hoster` gebaut, damit
         der Satz wortgleich bleibt; ändert sich der Hoster, hier mitziehen.

         HTML-Kommentar des Originals, der mit dem Sync aus der Seite fällt:
           Bei Uberspace sind die Zugriffsprotokolle standardmäßig abgeschaltet
           und werden erst durch "uberspace web log access enable" angelegt.
           Sind sie aus, die drei Absätze nach dem ersten durch einen Satz
           ersetzen: "Zugriffsprotokolle des Webservers sind abgeschaltet; es
           werden keine Protokolldaten über Seitenaufrufe gespeichert." */
      ds.freitext({
        titel: 'Hosting und Server-Protokolle',
        absaetze: [
          'Die Seite läuft bei Uberspace, betrieben von Jonas Pasche, Kaiserstr. 15, 55116 Mainz. Mit dem Anbieter besteht ein Vertrag über die Auftragsverarbeitung nach Art. 28 DSGVO.',
          'Beim Aufruf schreibt der Webserver ein Zugriffsprotokoll mit folgenden Angaben:',
          [
            'aufgerufene Domain und Port',
            'gekürzte IP-Adresse des anfragenden Geräts',
            'Datum und Uhrzeit des Zugriffs',
            'angeforderte Adresse, Statuscode und Größe der Antwort',
            'zuvor besuchte Seite (Referrer), sofern übermittelt',
            'Browser und Betriebssystem (User-Agent)',
          ],
          'Die IP-Adresse wird dabei bereits vom Anbieter gekürzt, sodass sie sich keiner Person mehr zuordnen lässt. Die Protokolldateien werden täglich gewechselt und nach sieben Tagen gelöscht. Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO; das berechtigte Interesse liegt im technischen Betrieb und in der Abwehr von Angriffen.',
        ],
      }),
      // 4. Nicht ds.kontaktformular(): Zeitstempel, SMTP-Versand, IP in der
      // Nachricht, Zähler für zehn Minuten und die Freiwilligkeit kennt der
      // Baustein nicht.
      ds.freitext({
        titel: 'Kontaktformular',
        absaetze: [
          'Das Formular am Ende der Startseite fragt Name, E-Mail-Adresse und Nachricht ab. Zusätzlich werden zwei technische Angaben mitgeschickt: der Zeitpunkt, an dem die Seite geladen wurde, und ein für Menschen unsichtbares Feld. Beides dient allein der Spam-Erkennung und wird nicht gespeichert.',
          'Die Eingaben werden von meinem Server über eine verschlüsselte SMTP-Verbindung an mein Postfach geschickt. Dort bleiben sie so lange, wie es für die Bearbeitung deiner Anfrage nötig ist; anschließend lösche ich sie, sofern keine gesetzlichen Aufbewahrungspflichten entgegenstehen. Beim Versand wird die IP-Adresse der Absendung in die Nachricht aufgenommen, damit Missbrauch nachvollziehbar bleibt. Zur Begrenzung von Spam wird die Anzahl der Absendungen je IP-Adresse für zehn Minuten im Arbeitsspeicher mitgezählt; danach verfällt der Zähler.',
          'Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO, wenn es um die Anbahnung eines Vertrags geht, sonst Art. 6 Abs. 1 lit. f DSGVO — mein berechtigtes Interesse an der Beantwortung von Anfragen. Die Angabe der Daten ist freiwillig; ohne Name, Adresse und Nachricht kann ich die Anfrage nicht beantworten. Du kannst mir stattdessen jederzeit direkt eine E-Mail schreiben oder anrufen.',
        ],
      }),
      ds.freitext({
        titel: 'Anfragen per E-Mail und Telefon',
        absaetze: [
          'Schreibst oder rufst du mich direkt an, verarbeite ich die dabei anfallenden Daten zur Bearbeitung deines Anliegens. Rechtsgrundlage ist Art. 6 Abs. 1 lit. b bzw. f DSGVO. Auch diese Daten lösche ich, sobald sie nicht mehr gebraucht werden und keine Aufbewahrungspflicht besteht.',
        ],
      }),
      ds.freitext({
        titel: 'Schriftarten',
        absaetze: [
          'Die verwendeten Schriften liegen auf dem Server dieser Seite und werden von dort geladen. Es entsteht keine Verbindung zu Google Fonts oder einem anderen fremden Dienst, deine IP-Adresse wird also nicht an Dritte übermittelt.',
        ],
      }),
      // 7. Nicht ds.keineCookies: Speicher im Browser, Werbenetzwerke,
      // Einbettungen und das fehlende Einwilligungsbanner sagt der Baustein nicht.
      ds.freitext({
        titel: 'Keine Cookies, keine Analyse, keine Einbettungen',
        absaetze: [
          'Diese Seite setzt keine Cookies und speichert nichts in deinem Browser. Es laufen keine Analyse- oder Tracking-Dienste, keine Werbenetzwerke und keine eingebetteten Inhalte wie Karten, Videos oder Social-Media-Elemente. Deshalb gibt es auch kein Einwilligungsbanner — es gibt nichts einzuwilligen.',
        ],
      }),
      ds.freitext({
        titel: 'Verschlüsselung',
        absaetze: [
          'Die Seite wird über HTTPS ausgeliefert. Damit sind die Inhalte, die du überträgst, auf dem Weg zum Server gegen Mitlesen geschützt.',
        ],
      }),
      // 9. Nicht ds.externeLinks: anderer Titel, nennt `externeLinks` als
      // Aufzählung und spricht von „unserer Website“.
      ds.freitext({
        titel: 'Links zu anderen Angeboten',
        absaetze: [
          'Die Startseite verlinkt auf externe Angebote, darunter die vorgestellten Projekte. Sobald du einem solchen Link folgst, gilt die Datenschutzerklärung des jeweiligen Angebots; auf deren Datenverarbeitung habe ich keinen Einfluss.',
        ],
      }),
      // 10. Nicht ds.drittland: Inhaltlich gleich („findet nicht statt“), aber
      // das Original nennt zusätzlich EWR, Postfach, Schriften und die Zusage für
      // den Fall einer Änderung.
      ds.freitext({
        titel: 'Übermittlung in Drittländer',
        absaetze: [
          'Es findet keine Übermittlung in Länder außerhalb der EU und des EWR statt. Server und Postfach liegen bei Uberspace in Deutschland, die Schriften liefert diese Seite selbst aus. Sollte sich das je ändern, steht es hier — mitsamt der Grundlage, auf der die Übermittlung dann beruht.',
        ],
      }),
      // 11. Nicht ds.einwilligungWiderruf: Der Baustein ist der zweite Satz ohne
      // „doch einmal“; der erste Satz (keine Einwilligung, lit. b und f) fehlt ihm.
      ds.freitext({
        titel: 'Widerruf einer Einwilligung',
        absaetze: [
          'Diese Seite holt keine Einwilligung ein: Die Verarbeitung stützt sich auf Art. 6 Abs. 1 lit. b und lit. f DSGVO — Bearbeitung deiner Anfrage und berechtigtes Interesse am Betrieb der Seite. Soweit eine Verarbeitung doch einmal auf deiner Einwilligung beruht, kannst du sie jederzeit mit Wirkung für die Zukunft widerrufen (Art. 7 Abs. 3 DSGVO). Was bis dahin verarbeitet wurde, bleibt davon unberührt.',
        ],
      }),
      /* 12. Nicht ds.betroffenenrechte: andere Listeneinträge („Löschung“ ohne
         „deiner Daten“, Widerspruch mit lit. f), Art. 77, Wahl der Behörde und
         deren volle Anschrift mit Postfach, Telefon und E-Mail. Als Modul, damit
         die Kontaktadresse aus den Stammdaten kommt. Die Anschrift der Behörde
         bleibt wörtlich: CONCT.aufsichtsbehoerde kennt Postfach, Telefon und
         E-Mail nicht. Live ist nur mail@feif.space verlinkt, Telefon und E-Mail
         der Behörde nicht — so auch hier. */
      ((ctx) =>
        ds.freitext({
          titel: 'Deine Rechte',
          absaetze: [
            'Du hast jederzeit das Recht auf',
            [
              'Auskunft über die zu dir gespeicherten Daten (Art. 15 DSGVO)',
              'Berichtigung unrichtiger Daten (Art. 16 DSGVO)',
              'Löschung (Art. 17 DSGVO)',
              'Einschränkung der Verarbeitung (Art. 18 DSGVO)',
              'Datenübertragbarkeit (Art. 20 DSGVO)',
              'Widerspruch gegen Verarbeitungen auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO (Art. 21 DSGVO)',
            ],
            p(
              txt('Eine Nachricht an '),
              mail(ctx.anbieter.email),
              txt(
                ' genügt. Außerdem kannst du dich nach Art. 77 DSGVO bei einer Aufsichtsbehörde beschweren — bei der deines Wohnorts oder bei der für mich zuständigen:',
              ),
            ),
            p(
              txt('Sächsische Datenschutz- und Transparenzbeauftragte'),
              br,
              txt('Postfach 11 01 32'),
              br,
              txt('01330 Dresden'),
              br,
              br,
              txt('Besucheradresse: Maternistraße 17, 01067 Dresden'),
              br,
              txt('Telefon: +49 351 85471-101'),
              br,
              txt('E-Mail: post@sdtb.sachsen.de'),
            ),
          ],
        })(ctx)) satisfies Modul,
      // 13. Nicht ds.aktualitaet: anderer Titel und „Es gilt jeweils die hier
      // veröffentlichte Fassung“. Die Stand-Zeile bleibt im Template.
      ds.freitext({
        titel: 'Änderungen',
        absaetze: [
          'Ändert sich an der Seite etwas, das Daten betrifft, ändert sich dieser Text mit. Es gilt jeweils die hier veröffentlichte Fassung.',
        ],
      }),
    ],
  },
};
