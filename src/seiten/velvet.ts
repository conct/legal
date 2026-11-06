import * as ds from '../datenschutz.js';
import type { Modul } from '../datenschutz.js';
import type { ImpressumOptions } from '../impressum.js';
import type { Preset } from '../presets.js';
import { SITES } from '../sites.js';
import { type Section, link, mail, p, txt } from '../types.js';
/**
 * Vorschlag für conct/legal: VELVET (velvet-network.app).
 *
 * Kein eigenständiges Modul — die beiden Objekte unten sind zum Einsetzen
 * gedacht:
 *   SITE   → src/sites.ts,   ersetzt den Eintrag 'velvet-network.app'
 *   PRESET → src/presets.ts, ersetzt den Eintrag 'velvet-network.app'
 * Die Imports stehen nur hier, damit die Datei für sich typgeprüft werden kann
 * (Pfade wie in src/).
 *
 * Quelle: VELVET packages/shared/src/legal.ts (IMPRESSUM_SECTIONS,
 * DATENSCHUTZ_SECTIONS, LEGAL_OPERATOR), Stand 06.11.2026.
 */

// --- src/sites.ts -----------------------------------------------------------


// --- src/presets.ts ---------------------------------------------------------

export const PRESETS_VELVET: Record<'velvet-network.app', Preset> = {
  // Abschnittsweise aus packages/shared/src/legal.ts übernommen, Sie-Form wie
  // dort (bisher stand hier 'persoenlich' mit STANDARD_MODULE — das hätte u. a.
  // „keine Cookies“ und „keine Übermittlung in Drittländer“ behauptet, obwohl
  // Stripe/PayPal ausdrücklich außerhalb der EU übermitteln können).
  //
  // Fast alles ist Freitext: Bewertungen, Netzwerk-Sichtbarkeit, gemeinsame
  // Verantwortlichkeit nach Art. 26 und Nachrichten gibt es nur hier.
  'velvet-network.app': {
    tone: 'formell',
    // Bleibt false: Kauf in der iOS-App und appUpdates sind neu gegenüber dem Live-Text
    // (beides läuft im Code, stand aber nicht in der Erklärung) und noch von
    // niemandem gegen den Code abgenommen. Listen oder Links hatte das
    // Original nicht — alle Abschnitte waren reine Absätze.
    geprueft: false,
    module: [
      ds.verantwortlicher,
      // Steht für „Kontakt für Datenschutzanfragen“ (dort nur die Adresse) und
      // nennt dieselbe Adresse. Neu ist der Satz, dass kein Beauftragter
      // bestellt ist — für einen Einzelunternehmer zutreffend, wie bei
      // sektorix und klarschiff.
      ds.keinDatenschutzbeauftragter,
      ds.freitext({
        titel: 'Welche Daten VELVET verarbeitet',
        absaetze: [
          'Registrierung & Login: E-Mail-Adresse, Passwort (ausschließlich als Hash gespeichert, im Klartext nicht einsehbar), Vor- und Nachname sowie das Geburtsdatum.',
          'Geburtsdatum: bei der Registrierung erhoben, um das in den Nutzungsbedingungen vorausgesetzte Mindestalter von 18 Jahren zu prüfen und nachweisen zu können. Es ist für teilnehmende Locations nicht sichtbar und wird zu keinem anderen Zweck verwendet.',
          'Profilfoto: freiwillig hochgeladen, dient der Identifikation am Einlass.',
          'Bewertungen & Status: von Türsteher:innen vergebene Sterne-Bewertung und Merkmale (z. B. „Freundlich“, „Ärger gemacht“), daraus errechneter globaler Status und Score.',
          'Einlass-Historie: Zeitpunkt und Location eines QR-Scans am Einlass.',
          'Interne Notizen: standortbezogene Vermerke des Personals, für Gäste nicht einsehbar.',
          'Team-Zugänge: E-Mail-Adresse, Name und Rolle von Mitarbeitenden teilnehmender Locations.',
          'Premium-Abonnement: Abo-Status, Laufzeit und Zahlungsanbieter (nicht die Zahlungsdaten selbst, siehe unten).',
          'Widerrufs-Zustimmung: beim Abschluss eines Premium-Abos der Wortlaut der Zustimmung zum sofortigen Beginn, die gewählte Sprachfassung, Zahlungsanbieter, Laufzeit und Zeitpunkt — als Nachweis nach § 356 Abs. 5 BGB.',
          'Private Nachrichten: Inhalte von Nachrichten zwischen Premium-Mitgliedern, die sich am selben Abend in derselben Location aufgehalten haben.',
        ],
      }),
      ds.freitext({
        titel: 'Zwecke und Rechtsgrundlagen',
        absaetze: [
          'Bereitstellung der App-Funktionen (Profil, Einlass per QR-Code, Bewertungsverlauf): Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung).',
          'Zutrittskontrolle und Sicherheit am Einlass im Interesse der teilnehmenden Locations: Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse).',
        ],
      }),
      ds.freitext({
        titel: 'Empfänger der Daten',
        absaetze: [
          'Profilfoto, globaler Status und Bewertungsverlauf sind für Türsteher:innen, Sicherheitspersonal und Management aller am Netzwerk teilnehmenden Locations einsehbar — nicht nur der zuletzt besuchten. Das ist Kernfunktion von VELVET: ein an einer Location vergebenes Hausverbot ist an jeder anderen Tür im Netzwerk sichtbar.',
          'Eine Weitergabe an Dritte außerhalb des Netzwerks teilnehmender Locations findet nicht statt.',
        ],
      }),
      // Als Modul statt als nackter Freitext, weil der dritte Absatz die
      // Anlaufstelle nennt: Sie kommt aus den Stammdaten, damit eine
      // Adressänderung auch diesen Satz erreicht.
      ((ctx) =>
        ds.freitext({
          titel: 'Gemeinsame Verantwortlichkeit mit den teilnehmenden Locations',
          absaetze: [
            'Eine teilnehmende Location entscheidet selbst, ob sie einen Gast einlässt, und vergibt Bewertungen, Merkmale und Hausverbote in eigener Verantwortung. Sie verfolgt damit einen eigenen Zweck — die Ausübung ihres Hausrechts. VELVET und die jeweilige Location sind für diese Verarbeitung deshalb gemeinsam Verantwortliche im Sinne des Art. 26 DSGVO.',
            'Der wesentliche Inhalt der dazu geschlossenen Vereinbarung ist unter velvet-network.app/location-bedingungen als Anlage 1 abrufbar. Danach betreibt VELVET die Plattform, berechnet Status und Score, erfüllt die Informationspflichten und ist zentrale Anlaufstelle für Anfragen; die Location verantwortet die Richtigkeit ihrer Einträge und die Zugänge ihres Personals.',
            `Unabhängig von dieser Aufteilung können Sie Ihre Rechte gegenüber jedem der beiden Verantwortlichen geltend machen. Als gemeinsame Anlaufstelle steht Ihnen ${ctx.anbieter.email} zur Verfügung; Anfragen, die eine einzelne Location betreffen, leiten wir dorthin weiter und holen eine Stellungnahme ein.`,
            'Halten Sie eine Bewertung oder ein Hausverbot für unzutreffend, prüfen wir den Sachverhalt gemeinsam mit der Location. Ein unzutreffender Eintrag wird berichtigt oder gelöscht.',
          ],
        })(ctx)) satisfies Modul,
      // Stripe und PayPal bleiben Freitext: Das ist der Kauf im Dashboard und in
      // der Android-App (apps/mobile/lib/iap.ts ist dort ein Platzhalter).
      ds.freitext({
        titel: 'Premium-Abonnement & Zahlungen',
        absaetze: [
          'Für das kostenpflichtige Premium-Abonnement (monatlich oder jährlich) bieten wir Zahlungen über Stripe und PayPal an. Zahlungsdaten (z. B. Kartennummern oder PayPal-Zugangsdaten) werden ausschließlich von Stripe bzw. PayPal als Zahlungsdienstleister verarbeitet — VELVET selbst sieht oder speichert diese Daten nicht, sondern erhält von Stripe/PayPal nur den Abo-Status, die Laufzeit (monatlich/jährlich) und das Verlängerungsdatum.',
          'Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO (Erfüllung des Abo-Vertrags). Stripe und PayPal agieren dabei als eigenständige Verantwortliche bzw. Auftragsverarbeiter außerhalb des VELVET-Standortnetzwerks; je nach vertraglicher Konstellation kann dies eine Datenübermittlung außerhalb der EU einschließen — Details entnehmen Sie den Datenschutzhinweisen von Stripe und PayPal.',
          'Vor dem Abschluss fragt der Checkout ausdrücklich ab, ob die Leistung sofort — also vor Ablauf der 14-tägigen Widerrufsfrist — beginnen soll und ob die Kenntnis vom Erlöschen des Widerrufsrechts bestätigt wird (§ 356 Abs. 5 BGB). Diese Erklärung wird mit dem angezeigten Wortlaut, der Sprachfassung und dem Zeitpunkt gespeichert; Rechtsgrundlage ist Art. 6 Abs. 1 lit. c DSGVO (rechtliche Verpflichtung) in Verbindung mit dem berechtigten Interesse an der Beweisbarkeit nach Art. 6 Abs. 1 lit. f DSGVO. Die Aufzeichnung wird mit dem Konto gelöscht.',
        ],
      }),
      ds.freitext({
        titel: 'Private Nachrichten (Premium)',
        absaetze: [
          'Premium-Mitglieder, die nachweislich am selben Abend in derselben Location eingecheckt waren, können sich gegenseitig Nachrichten schreiben, um sich zu verabreden. Ohne diese gemeinsame, verifizierte Anwesenheit ist kein Nachrichtenkontakt zwischen Gästen möglich.',
          'Nachrichteninhalte werden gespeichert, damit beide Beteiligten den Verlauf einsehen können, und sind ausschließlich für die beiden am Gespräch beteiligten Personen sichtbar. Zum Schutz vor Missbrauch können Nutzer:innen andere blockieren oder einzelne Nachrichten melden; gemeldete Inhalte werden zur Prüfung aufbewahrt.',
          'Der Betreiber kann im Einzelfall zur Aufklärung gemeldeter Verstöße auf Nachrichteninhalte zugreifen — mit derselben Offenheit, mit der auch die standortübergreifende Sichtbarkeit von Bewertungen oben beschrieben ist.',
        ],
      }),
      // NEU gegenüber dem Live-Text: Unter iOS kauft die App das Abo über
      // StoreKit (apps/mobile/lib/iap.ios.ts, expo-iap); Android und Web nicht.
      // Nicht ds.storeKauf: Der Kauf läuft nur unter iOS über Apple, und
      // Apple meldet ihn per App Store Server Notifications an den Server,
      // verknüpft über ein appAccountToken (UUID je Konto).
      // Der Baustein sagte „die App fragt nur ab“ und kennt keine Plattform.
      ds.freitext({
        titel: 'Kauf in der iOS-App',
        absaetze: [
          'Unter iOS schließen Sie das Premium-Abonnement über den App Store ab. Den Bezahlvorgang wickelt allein Apple ab; wir erhalten dabei keine Zahlungsdaten. Damit das Abonnement Ihrem Konto zugeordnet werden kann, übergibt die App beim Kauf eine zufällige Kennung Ihres Kontos (appAccountToken), und Apple teilt unserem Server über die App Store Server Notifications mit, ob das Abonnement besteht, verlängert oder beendet wurde. Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO. Für die Verarbeitung durch Apple gilt deren Datenschutzerklärung.',
        ],
      }),
      // Nicht nutzerkonto(): Der Baustein verspricht zusätzlich, dass das Konto
      // „jederzeit“ gelöscht werden kann, und nennt die Daten in einer Klammer —
      // hier stehen sie schon oben, ausführlicher.
      ds.freitext({
        titel: 'Speicherdauer',
        absaetze: [
          'Daten werden gespeichert, solange ein Konto besteht. Nach Löschung des Kontos werden die Daten entfernt, soweit keine gesetzlichen Aufbewahrungspflichten entgegenstehen.',
        ],
      }),
      // Nicht hosting/hostingMit: Der Baustein zählt Logfelder auf und nennt
      // eine Frist, die auf dem conct.de-Host gemessen wurde, nicht auf
      // mab.uberspace.de — und die Express-API schreibt womöglich eigene Logs.
      // Erst nachmessen, dann ds.hostingMit({ logsTage, adresseGekuerzt })
      // statt dieses Freitexts; der Satz zum Serverstandort steckt dann in
      // `hoster` (Uberspace, Deutschland) — oder bleibt als eigener Absatz.
      ds.freitext({
        titel: 'Hosting und technische Infrastruktur',
        absaetze: [
          'VELVET wird bei Uberspace (Jonas Pasche, Kaiserstraße 15, 55116 Mainz) mit Serverstandort Deutschland betrieben. Zugriffsdaten werden ausschließlich zum technischen Betrieb der Anwendung verarbeitet.',
        ],
      }),
      // Nicht keineCookies/technischeCookies: Der Text spricht von Local Storage
      // und sicherem Gerätespeicher, nicht von Cookies, und schließt nur
      // Tracking- und Werbe-Cookies aus.
      ds.freitext({
        titel: 'Lokale Speicherung',
        absaetze: [
          'Der Anmeldestatus wird technisch notwendig lokal gespeichert (im Dashboard über den Local Storage des Browsers, in der App über den sicheren Gerätespeicher). Es werden keine Tracking- oder Werbe-Cookies eingesetzt.',
        ],
      }),
      // NEU gegenüber dem Live-Text: Die Mobile-App (iOS und Android) lädt
      // OTA-Updates über Expo (expo-updates, updates.url in app.json). Ohne
      // `plattform` heißt es „Die App“ — das Dashboard lädt keine Updates.
      // Der Baustein nennt Expo (USA) und die Standardvertragsklauseln selbst;
      // ein Eintrag in SITE.drittdienste ist dafür nicht nötig.
      ds.appUpdates(),
      // Fasst drei Abschnitte zusammen: „Rechte der betroffenen Personen“
      // (dieselben sechs Rechte, jetzt als Liste mit Artikel je Recht),
      // „Beschwerderecht“ (jetzt mit der Sächsischen Datenschutz- und
      // Transparenzbeauftragten) und den Verweis auf die Kontaktadresse.
      ds.betroffenenrechte,


      // --- Im Original nicht vorhanden. Erst aufnehmen, wenn VELVET es so will:
      //
      // ds.einwilligungWiderruf,  // keine Einwilligung im Text — Auskunft „nichts zu widerrufen“
      // ds.aktualitaet,
      //
      // Nicht ds.drittland: Ohne drittdienste sagte er „findet nicht statt“ —
      // das widerspräche dem Absatz zu Stripe und PayPal.
    ],
  },
};
