import * as ds from '../datenschutz.js';
import type { Modul } from '../datenschutz.js';
import type { ImpressumOptions } from '../impressum.js';
import type { Preset } from '../presets.js';
import { SITES } from '../sites.js';
import { type Section, link, mail, p, txt } from '../types.js';
/**
 * Vorschlag: Lesestunde (lesestunde.conct.de) an @conct/legal hängen.
 *
 * Quelle: Lesestunde/rechtliches/impressum.md und datenschutz.md (Stand 18.10.2026),
 * abschnittsweise übernommen. Bausteine nur dort, wo sie inhaltlich dasselbe sagen;
 * alles andere wörtlich als ds.freitext, in der Du-Form des Originals.
 *
 * Einbau:
 *   - der innere Eintrag von `sitesEintrag`   → SITES in src/sites.ts
 *   - der innere Eintrag von `presetsEintrag` → PRESETS in src/presets.ts
 *     (dort ohne die Importe; `ds`, `p`, `txt`, `mail` stehen schon bereit bzw.
 *     kommen aus './types.js')
 *
 * Setzt den Stand von src/ nach 1.5.0 voraus: `Preset.impressum` (impressumFuer und
 * der Sync nehmen es als Standard) und `ds.freitext` mit `string[]` als Liste.
 * Fettdruck und `Code` des Originals kennen die Blöcke nicht; sie entfallen.
 */

// --- src/sites.ts, in SITES ---------------------------------------------------


// --- Impressum: Zusätze vor „Verbraucherstreitbeilegung“ -------------------------

const email = SITES['lesestunde.conct.de'].anbieter.email;
const hoster = SITES['lesestunde.conct.de'].hoster;

// Diese drei Abschnitte stehen im Original zwischen § 18 MStV und der
// Verbraucherstreitbeilegung — genau dort fügt impressum() `zusatz` ein.
const impressumLesestunde: ImpressumOptions = {
  zusatz: [
    {
      title: 'Kontaktstelle nach dem Digital Services Act (Art. 11 und 12 DSA)',
      blocks: [
        p(
          txt('Für Behörden, die EU-Kommission und Nutzerinnen und Nutzer: '),
          mail(email),
          txt('. Wir antworten auf Deutsch oder Englisch.'),
        ),
      ],
    },
    {
      title: 'Meldung rechtswidriger oder ungeeigneter Inhalte (Art. 16 DSA)',
      blocks: [
        p(
          txt(
            'Öffentlich geteilte Geschichten lassen sich in der App und auf der Website über „Melden“ kennzeichnen. ' +
              'Ausführliche Meldungen – mit Link zur Geschichte und einer kurzen Begründung – bitte an ',
          ),
          mail(email),
          txt(
            '. Wir prüfen jede Meldung und entfernen Inhalte, die gegen Gesetze oder unsere Regeln verstoßen; ' +
              'wer eine begründete Meldung schickt, erhält eine Rückmeldung.',
          ),
        ),
        // Stand im Original am Ende von „Haftung für Inhalte“. Den Abschnitt
        // schreibt impressum() selbst und ohne diesen Satz — hier bleibt er
        // erhalten, bis es dafür eine Option gibt.
        p(txt('Sobald wir von einer Rechtsverletzung erfahren, entfernen wir den Inhalt umgehend.')),
      ],
    },
    {
      // Kennzeichnung nach Art. 50 KI-VO; README des Projekts: „gegenprüfen“.
      title: 'Hinweis zu KI-erzeugten Inhalten',
      blocks: [
        p(
          txt(
            'Die Geschichten in Lesestunde schreibt ein KI-Modell (Claude von Anthropic); Premium-Vorlesestimmen ' +
              'erzeugt ElevenLabs künstlich. Die App und die Seiten geteilter Geschichten weisen darauf hin.',
          ),
        ),
      ],
    },
  ],
};

// --- src/presets.ts, in PRESETS -------------------------------------------------

export const PRESETS_LESESTUNDE: Record<'lesestunde.conct.de', Preset> = {
  // Expo-App (Android, iOS) und Webfassung, Server auf eigenem Rechner hinter
  // Uberspace. Erzählt Kindern von 2 bis 14 Geschichten (Claude) und liest sie
  // vor (Gerätestimme oder ElevenLabs); Bilder malt OpenAI. Abschnittsweise aus
  // rechtliches/datenschutz.md vom 18.10.2026 übernommen.
  //
  // Fast alles ist Freitext, und das ist hier keine Bequemlichkeit: Die Erklärung
  // sagt zu jedem Empfänger genau, welche Felder er bekommt und welche nicht
  // (Kundennummer, IP, Name des Kindes). Kein Baustein sagt das, und eine Formel
  // an dieser Stelle wäre bei einer Kinder-App die schlechtere Auskunft.
  'lesestunde.conct.de': {
    tone: 'persoenlich',
    // Bleibt false: Der Text ist ein Entwurf, den das Projekt selbst noch als
    // „vor der Veröffentlichung juristisch prüfen“ führt (README), und die DPAs mit
    // ElevenLabs und RevenueCat sind dort als offen vermerkt.
    geprueft: false,
    // DSA-Kontaktstelle, Meldungen nach Art. 16 DSA, KI-Hinweis.
    impressum: impressumLesestunde,
    module: [
      // Original: eine Zeile „Daniel von Lühmann (conct), Hauptstraße 154, …“ und
      // „E-Mail · Telefon“. Der Baustein nennt dasselbe zeilenweise.
      ds.verantwortlicher,
      // Original: zweiter Absatz unter „Verantwortlicher“. Sagt dasselbe — nicht
      // bestellt, keine Pflicht nach Art. 37 DSGVO / § 38 BDSG, Ansprechpartner
      // ist der Verantwortliche —, wird aber ein eigener Abschnitt. Alle
      // folgenden Nummern rücken dadurch um eins.
      ds.keinDatenschutzbeauftragter,
      /* Art. 8 DSGVO: Zielgruppe und wer die Profile anlegt. Der Vorspann des
         Originals (vor Abschnitt 1) steht hier als erster Absatz — eine
         Einleitung ohne Überschrift kennt LegalDoc nicht. */
      ds.freitext({
        titel: 'Für wen Lesestunde gedacht ist',
        absaetze: [
          'Lesestunde erzählt Kindern Geschichten. Wir gehen deshalb besonders sorgsam mit Daten um: kein Konto, keine Werbung, keine Analyse- oder Tracking-Werkzeuge. Hier steht genau, welche Daten wann wohin gehen.',
          'Lesestunde richtet sich an Kinder von 2 bis 14 Jahren und ihre Eltern. Kinderprofile legen Eltern oder andere Erziehungsberechtigte an. Sie entscheiden, welche Angaben sie eintragen, und können Profile und Geschichten jederzeit löschen.',
        ],
      }),
      /* Trägt auch „Wir setzen keine Cookies“ — deshalb kein ds.keineCookies, das
         zusätzlich „keine Analyse- oder Tracking-Dienste“ als eigenen Abschnitt
         wiederholte. */
      ds.freitext({
        titel: 'Was nur auf deinem Gerät gespeichert wird',
        absaetze: [
          [
            'Kinderprofile: Name, Geschlecht, Alter, Vorlieben, Begleiter (Kuscheltier oder Haustier), gewählte Stimme, Tonhöhe und Tempo.',
            '„Meine Märchen“: bis zu 50 Geschichten samt der Angaben, mit denen sie erstellt wurden.',
            'Eine zufällige Kundennummer (Format xxxx-xxxx-xxxx), die die App beim ersten Start erzeugt. Sie enthält keine Angaben über dich oder dein Gerät.',
            'Löschschlüssel für Geschichten, die du teilst.',
          ],
          'In der App liegt das im Speicher des Geräts, im Browser im lokalen Speicher (localStorage) und, für Offline-Nutzung, im Cache des Service Workers. Wir setzen keine Cookies. Diese Daten löschst du, indem du Profile und Geschichten in der App entfernst, die App deinstallierst oder die Websitedaten im Browser löschst.',
        ],
      }),
      /* Anthropic. Verweis „siehe Abschnitt 9“ des Originals zeigt hier auf
         Abschnitt 10 (Server, Hosting und Protokolle) — die einzige Änderung am
         Wortlaut, nötig wegen des zusätzlichen Abschnitts 2. */
      ds.freitext({
        titel: 'Geschichten schreiben',
        absaetze: [
          'Wenn du eine Geschichte erstellst, schickt die App deine Auswahl (Genre, Held, Ort, Thema, Länge, eigene Idee) und aus dem gewählten Kinderprofil Vorname, Geschlecht, Alter, Vorlieben und Begleiter an unseren Server. Nur so kann die Geschichte von deinem Kind handeln.',
          'Unser Server gibt diese Angaben über die Claude-API an Anthropic weiter (Anthropic PBC, USA, bzw. Anthropic Ireland Ltd.), dessen KI-Modell Claude die Geschichte schreibt. Ist die API vorübergehend nicht erreichbar, schreibt Claude über unseren eigenen Claude-Zugang beim selben Anbieter. Anthropic erhält dabei weder deine Kundennummer noch deine IP-Adresse. Unser Server speichert weder die Anfrage noch die fertige Geschichte; sie geht direkt an dein Gerät zurück. Tritt ein Fehler auf, kann ein Auszug der Fehlermeldung im Systemprotokoll des Servers landen (siehe Abschnitt 10).',
          'Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO: Die Geschichte ist die Leistung, die du anforderst. Tipp: Du musst nicht den echten Namen eintragen – ein Spitzname funktioniert genauso.',
          'Ohne Internetverbindung setzt die App eine Geschichte aus Bausteinen auf dem Gerät zusammen; dabei wird nichts übertragen.',
        ],
      }),
      // Gerätestimmen (Google/Microsoft), ElevenLabs mit 90 Tagen, OpenAI für
      // Titel- und Szenenbilder ohne den Namen des Kindes.
      ds.freitext({
        titel: 'Vorlesen',
        absaetze: [
          [
            'Gerätestimme (kostenlos): Die Sprachausgabe deines Geräts liest vor. Manche Stimmen auf Android oder im Browser sind Online-Stimmen von Google oder Microsoft; dann geht der vorgelesene Text an diese Anbieter. Offline-Stimmen übertragen nichts.',
            'Premium-Stimmen: Der Text des Absatzes, den du anhörst, geht über unseren Server an ElevenLabs (Eleven Labs Inc., USA), das daraus Sprache erzeugt. Der Text kann den Namen deines Kindes enthalten, weil die Geschichte davon handelt. ElevenLabs erhält weder Kundennummer noch IP-Adresse. Die fertige Audiodatei speichern wir auf unserem Server, damit erneutes Anhören nichts kostet; der Dateiname ist ein Prüfwert des Textes, nicht deine Kundennummer. Ruft 90 Tage lang niemand eine Datei ab, löschen wir sie automatisch.',
            'Hörproben der Premium-Stimmen liefert unser Server aus. Sie enthalten einen festen Mustertext, keine Daten von dir oder deinem Kind.',
            'Titelbilder (Premium): Zu jeder neuen Geschichte malt OpenAI (OpenAI, L.L.C., USA) ein Bild. Dafür gehen über unseren Server der Titel, die ersten beiden Absätze, das Alter, „Mädchen/Junge/Kind“ und der Begleiter (z. B. das Kuscheltier) an OpenAI – den Namen deines Kindes ersetzen wir vorher durch „das Kind“. OpenAI erhält weder Kundennummer noch IP-Adresse und nutzt die Daten nach eigenen Angaben nicht zum Training. Das fertige Bild speichern wir auf unserem Server; der Dateiname ist ein Prüfwert der Beschreibung.',
            'Szenenbilder (Premium Plus): Zusätzlich malt OpenAI bis zu acht Bilder zu einzelnen Stellen der Geschichte. Dafür gehen der Titel, die jeweiligen Absätze (höchstens drei), dieselben Angaben wie beim Titelbild und das Titelbild selbst als Vorlage an OpenAI – auch hier ohne den Namen deines Kindes.',
          ],
          'Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO.',
        ],
      }),
      /* Art. 8 DSGVO: Einwilligung der Eltern für Kinder unter 16, Elternfreigabe,
         Anonymisierung vor dem Hochladen, ein Jahr Speicherdauer. */
      ds.freitext({
        titel: 'Geschichten teilen',
        absaetze: [
          'Neue Geschichten sind privat. Teilen ist freiwillig:',
          'Vor jedem Hochladen ersetzt die App auf deinem Gerät den Namen deines Kindes und den Namen des Begleiters durch erfundene Namen. Andere Details, die du in deine eigene Idee schreibst, ersetzt sie nicht – lies eine Geschichte deshalb durch, bevor du sie teilst.',
          [
            'Öffentlich unter „Entdecken“: Hochgeladen werden Titel, Text, Genre und Länge. Öffentliche Geschichten sind für alle sichtbar und können von Suchmaschinen gefunden werden.',
            'Link teilen: Die Geschichte wird – ebenfalls anonymisiert – unter einer zufälligen Adresse gespeichert, die nur kennt, wem du den Link schickst. Sie erscheint nicht in „Entdecken“ und wird nicht von Suchmaschinen erfasst.',
          ],
          'Wir speichern zu jeder geteilten Geschichte nur den Text, Titel, Genre, Länge, den Zeitpunkt und die Zahl der Meldungen – keine IP-Adresse, keine Kundennummer. Löschen kannst du sie jederzeit in der App; dabei verschwinden öffentliche Fassung und Link. Spätestens ein Jahr nach dem Teilen löschen wir sie automatisch.',
          'Teilen, „Entdecken“, Käufe und der Elternbereich sind in der App durch eine Elternfreigabe (eine Rechenaufgabe für Erwachsene) geschützt. Rechtsgrundlage ist deine Einwilligung durch das aktive Teilen (Art. 6 Abs. 1 lit. a DSGVO), für Kinder unter 16 die Einwilligung der Eltern (Art. 8 DSGVO).',
          'Jede Geschichte lässt sich melden – öffentliche auf ihrer Seite, eigene in der App. Eine gemeldete Geschichte sperren wir sofort und prüfen sie dann; danach geben wir sie wieder frei oder löschen sie. Meldest du eine eigene, private Geschichte, schickt die App sie dafür anonymisiert an uns; sie ist nur für die Prüfung sichtbar und wird ebenfalls spätestens nach einem Jahr gelöscht. Wer meldet, speichern wir nicht.',
        ],
      }),
      ds.freitext({
        titel: 'Nutzungsgrenzen und Zugang',
        absaetze: [
          'Damit niemand den Dienst überlastet, zählt unser Server, wie viele Geschichten, Vertonungen und geteilte Geschichten pro Tag oder Stunde angefordert werden – je Kundennummer und je IP-Adresse. Die IP-Adresse speichern wir dabei nicht, sondern nur einen Prüfwert, der mit einem täglich wechselnden Zufallswert gebildet wird und sich nicht zurückrechnen lässt. Die Zähler liegen nur im Arbeitsspeicher, werden nicht auf Festplatte geschrieben und am nächsten Tag gelöscht. Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO; unser berechtigtes Interesse ist ein fairer, stabiler Betrieb.',
        ],
      }),
      /* Nicht ds.storeKauf: Der Baustein kennt weder Stripe noch RevenueCat noch die
         Abfrage des Servers, und er sagt „die App fragt beim Store nur ab“ — hier
         fragt RevenueCat bzw. unser Server. */
      ds.freitext({
        titel: 'Premium kaufen',
        absaetze: [
          'Premium kaufst du in der App über Google Play (bzw. Apple App Store) oder im Browser über Stripe. Die Abwicklung übernimmt RevenueCat (RevenueCat Inc., USA). Dafür übermittelt die App deine zufällige Kundennummer an RevenueCat, sobald du den Premium-Bereich öffnest; RevenueCat erhält vom Store außerdem die Kaufdaten (Produkt, Zeitpunkt, Status, Land). Zahlungsdaten sehen weder wir noch RevenueCat – sie bleiben beim Store bzw. bei Stripe. Hat dein Gerät Premium gekauft, wiederhergestellt oder einen Premium-Code eingelöst, fragt unser Server bei RevenueCat ab, ob zu deiner Kundennummer ein aktives Abo besteht; bei Gratis-Nutzung fragt er nicht.',
          'Mit „Code sichern“ kannst du deine Kundennummer als Link speichern, um Premium auf einem anderen Gerät zu nutzen. Behandle diesen Link wie ein Passwort.',
          'Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO; für Kaufbelege gelten die gesetzlichen Aufbewahrungsfristen (Art. 6 Abs. 1 lit. c DSGVO).',
        ],
      }),
      /* Nicht ds.hostingMit({ logsTage: 7, adresseGekuerzt: true }): Der Baustein
         sagt „wird bei … gehostet“, hier betreibt Uberspace nur die Weiterleitung;
         seine Feldliste (Datenmenge, Browsertyp, Betriebssystem) weicht von der des
         Originals ab (Domain, Statuscode); und das Systemprotokoll des eigenen
         Servers (14 Tage, nur Arbeitsspeicher) kennt er nicht. „Etwa einer Woche“
         bleibt bewusst: Die Dateien wechseln dort nach Größe, nicht täglich
         (Commit ece98e7: „die älteste lag bei einer Woche“) — `logsTage` mit
         „täglich gewechselt“ träfe das nicht. */
      ds.freitext({
        titel: 'Server, Hosting und Protokolle',
        absaetze: [
          `Lesestunde läuft auf einem eigenen Server in Deutschland. Die Verbindung zu lesestunde.conct.de nimmt ${hoster} entgegen und leitet sie verschlüsselt an unseren Server weiter; mit Uberspace besteht ein Vertrag über Auftragsverarbeitung (Art. 28 DSGVO).`,
          'Beim Aufruf schreibt der Webserver von Uberspace ein Zugriffsprotokoll mit folgenden Angaben:',
          [
            'aufgerufene Domain und Adresse',
            'gekürzte IP-Adresse des anfragenden Geräts',
            'Datum und Uhrzeit des Zugriffs',
            'Statuscode und Größe der Antwort',
            'zuvor besuchte Seite (Referrer), sofern übermittelt',
            'Browser bzw. App und Betriebssystem (User-Agent)',
          ],
          'Die IP-Adresse kürzt Uberspace bereits beim Schreiben, sodass sie sich keiner Person mehr zuordnen lässt. Die Protokolldateien werden nach etwa einer Woche gelöscht. Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO; das berechtigte Interesse liegt im technischen Betrieb und in der Abwehr von Angriffen.',
          'Unser eigener Server führt kein Zugriffsprotokoll. Fehlermeldungen landen im Systemprotokoll; es liegt nur im Arbeitsspeicher und wird nach spätestens 14 Tagen oder beim Neustart des Servers gelöscht.',
        ],
      }),
      /* Nicht ds.appUpdates({ plattform: 'Android- und iOS', zweck: … }), obwohl
         der erste Absatz daher stammt: Der Baustein schreibt „Inhalte aus der App
         werden dabei nicht gesendet“, das Original nennt ausdrücklich „Profile,
         Geschichten und deine Kundennummer“ — die Kundennummer ist kein Inhalt.
         Außerdem stützt der Baustein die USA-Übermittlung nur auf die SCC, das
         Original in Abschnitt „Übermittlung in Drittländer“ zuerst auf das DPF. */
      ds.freitext({
        titel: 'App-Aktualisierungen',
        absaetze: [
          'Die Android- und iOS-App prüft beim Start, ob es eine neue Version der Oberfläche gibt, und lädt sie gegebenenfalls herunter. Diese Updates liefert der Dienst Expo (650 Industries, Inc., USA) aus. Dabei werden technisch notwendige Angaben übertragen: die IP-Adresse deines Geräts, eine zufällige Installationskennung, die die App beim ersten Start erzeugt (sie enthält keine Geräte- oder Personendaten und wird mit der App gelöscht), die Plattform, die installierte App-Version und der Update-Kanal. Profile, Geschichten und deine Kundennummer werden dabei nicht gesendet. Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO; unser berechtigtes Interesse ist, Fehler schnell zu beheben und die App sicher zu halten.',
        ],
      }),
      /* Nicht ds.drittland: Der Baustein nennt nur die SCC und braucht
         `drittdienste`; das Original nennt DPF zuerst und Art. 46 Abs. 2 lit. c. */
      ds.freitext({
        titel: 'Übermittlung in Drittländer',
        absaetze: [
          'Anthropic, ElevenLabs, OpenAI, RevenueCat und Expo sitzen in den USA. Die Übermittlung stützt sich auf das EU-U.S. Data Privacy Framework, soweit der Anbieter zertifiziert ist, und im Übrigen auf die Standardvertragsklauseln der EU-Kommission (Art. 46 Abs. 2 lit. c DSGVO).',
        ],
      }),
      /* Nicht ds.betroffenenrechte (+ ds.einwilligungWiderruf): Der Satz zur
         Kundennummer — ohne Konto der einzige Weg, Daten zuzuordnen — hätte dort
         keinen Platz. Die Aufsichtsbehörde nennt das Original selbst. */
      ds.freitext({
        titel: 'Deine Rechte',
        absaetze: [
          'Du hast das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung der Verarbeitung, Datenübertragbarkeit und Widerspruch (Art. 15–21 DSGVO) sowie das Recht, eine Einwilligung jederzeit zu widerrufen. Da wir kein Konto führen, können wir Daten nur deiner Kundennummer zuordnen – nenne sie uns bei einer Anfrage. Beschweren kannst du dich bei einer Datenschutz-Aufsichtsbehörde, etwa beim Sächsischen Datenschutz- und Transparenzbeauftragten.',
        ],
      }),
      /* Nicht ds.aktualitaet: „Es gilt die jeweils hier veröffentlichte Fassung“
         sagt der Baustein nicht. Die Stand-Zeile ist von Hand nachzuziehen. */
      ds.freitext({
        titel: 'Änderungen',
        absaetze: [
          'Wenn sich die App ändert, passen wir diese Erklärung an. Es gilt die jeweils hier veröffentlichte Fassung.',
          'Stand: 18. Oktober 2026',
        ],
      }),
    ],
  },
};
