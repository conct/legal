import * as ds from '../datenschutz.js';
import type { Preset } from '../presets.js';

/**
 * Montix (de.conct.montix) — die App für Handwerker und Dienstleister, die
 * beim Kunden arbeiten. Seiten unter feif.space/apps-software/montix/,
 * deshalb der Schlüssel `montix.feif.space` wie bei Farbecho und Klarschiff.
 *
 * Quelle ist nicht ein vorhandener Rechtstext — es gibt keinen. Jeder Absatz
 * unten ist am Code nachgesehen (Repo conct/Kilpro, Stand 13.11.2026,
 * 79a691e):
 *
 *   app.json            plugins, android.permissions, updates.url
 *   src/features/…      license, payment, push, signature, home, customers
 *   src/plan/use-plan   AsyncStorage-Schlüssel des Planeditors
 *   src/features/pdf    Berichts- und Beleg-PDF, Ablage im App-Ordner
 *   src/features/belege Angebot, Lieferschein, Rechnung als E-Rechnung
 *   src/features/company Firmendaten (Absender, Bank, Steuernummer)
 *   src/features/reports/fotos.native.ts  Fotos als Dateien, Kamerarecht
 *
 * `geprueft` bleibt false. Ich habe den Code gelesen, aber niemand sonst hat
 * diesen Text gegen ihn abgenommen, und die App ist in keinem Store. Vor der
 * Veröffentlichung durchgehen — besonders die beiden Stellen, die heute noch
 * im Werden sind (Abgleich über einen Server, Benachrichtigungen).
 */

export const PRESETS_MONTIX: Record<'montix.feif.space', Preset> = {
  'montix.feif.space': {
    // Sie-Form wie auf der Produktseite und wie bei VELVET: Montix wird an
    // Betriebe verkauft, nicht an Privatleute.
    tone: 'formell',
    geprueft: false,
    module: [
      ds.verantwortlicher,
      ds.keinDatenschutzbeauftragter,

      ds.freitext({
        titel: 'Kurz gesagt',
        absaetze: [
          'Montix braucht kein Benutzerkonto und keine Registrierung. Alles, was Sie in der App anlegen — Pläne, Kunden, Artikel, Termine, Unterschriften —, bleibt auf Ihrem Gerät. Es gibt keine Werbung und keine Analyse-, Tracking- oder Absturzmeldedienste.',
          'Die App ist darauf ausgelegt, vollständig ohne Netz zu arbeiten. Verbindungen nach außen gibt es nur in den unten einzeln beschriebenen Fällen.',
        ],
      }),

      ds.freitext({
        titel: 'Was auf dem Gerät gespeichert wird',
        absaetze: [
          'Pläne mit allen Elementen, ein als Vorlage hinterlegtes Foto oder Planbild, die selbst angelegte Symbolbibliothek, Kundendaten, Artikel, Termine, Arbeitsberichte, Belege, Sprachnotizen, die Zusammenstellung Ihrer Startseite, die Kalibrierung der Wasserwaage, die gewählten Firmenfarben, Ihr Firmenlogo sowie Hell- oder Dunkeldarstellung.',
          'Dazu Ihre Belege — Angebote, Lieferscheine und Rechnungen — samt der Nummernstände, die die App je Belegart und Jahr auf dem Gerät weiterzählt.',
          'Dazu die Daten Ihres Betriebs, die als Absender auf Bericht und Beleg kommen: Firmenname, Anschrift, Inhaber, Telefon, E-Mail, Internetseite, Bankverbindung und Steuernummer oder Umsatzsteuer-Identifikationsnummer.',
          'Fotos zu den Arbeitsberichten und die erzeugten PDF-Dateien liegen als Dateien in einem eigenen Ordner der App, nicht in der Bilderrolle Ihres Geräts. Andere Apps kommen dort nicht heran, solange Sie die Dateien nicht selbst weitergeben.',
          'Dazu kommen der Tag des ersten Starts — daran bemisst sich der kostenlose Probemonat — und, falls vorhanden, Ihr Lizenzschlüssel.',
          'Diese Angaben verlassen das Gerät nicht. Sie entfernen sie über „App-Daten löschen“ in den Einstellungen Ihres Geräts oder indem Sie die App deinstallieren.',
          'Für diese Speicherung ist keine Einwilligung erforderlich, weil sie für die von Ihnen gewünschten Funktionen unbedingt erforderlich ist (§ 25 Abs. 2 Nr. 2 TDDDG).',
        ],
      }),

      ds.freitext({
        titel: 'Daten Ihrer Kunden — wer dafür verantwortlich ist',
        absaetze: [
          'Was Sie über Ihre Kunden eintragen — Name, Anschrift, Ansprechpartner, Unterschrift unter einer Abnahme — sind personenbezogene Daten dieser Menschen. Für deren Verarbeitung sind Sie als Betrieb verantwortlich, nicht wir: Die Daten entstehen auf Ihrem Gerät, bleiben dort und sind uns zu keinem Zeitpunkt zugänglich.',
          'Wir erhalten davon nichts und können davon nichts herausgeben. Anfragen Ihrer Kunden auf Auskunft, Berichtigung oder Löschung beantworten deshalb Sie.',
          'Sobald Sie Daten zwischen mehreren Geräten abgleichen lassen, ändert sich das: Dann verarbeitet derjenige, der den Abgleichdienst betreibt, Daten in Ihrem Auftrag, und es braucht einen Vertrag zur Auftragsverarbeitung nach Art. 28 DSGVO. Betreiben Sie den Dienst selbst, bleibt alles bei Ihnen.',
        ],
      }),

      ds.freitext({
        titel: 'Fotos und Kamera',
        absaetze: [
          'Sie können ein Foto oder ein vorhandenes Planbild als Vorlage unter einen Plan legen und darüber zeichnen. Dafür fragt die App beim ersten Mal den Zugriff auf Ihre Bilder ab. Das gewählte Bild wird zum Plan gespeichert und bleibt wie dieser auf dem Gerät.',
          'Zum Arbeitsbericht und beim Messen per Foto können Sie außerdem unmittelbar mit der Kamera aufnehmen. Dafür fragt die App beim ersten Mal das Kamerarecht ab; verweigern Sie es, bleibt der Weg über die Galerie. Die Aufnahmen werden in den Ordner der App kopiert und dort gespeichert, nicht in Ihre Bilderrolle. Übertragen wird nichts.',
        ],
      }),

      ds.freitext({
        titel: 'Codes scannen',
        absaetze: [
          'Unter den Werkzeugen gibt es „Scannen“, und bei der Anmeldung einen Knopf „QR-Code scannen“. Damit liest die App QR-Codes und die gängigen Strichcodes. Dazu wird dieselbe Kameraerlaubnis verwendet wie beim Fotografieren; verweigern Sie sie, entfällt das Scannen und sonst nichts.',
          'Das Kamerabild wird nicht gespeichert und nicht übertragen — es wird nur angesehen, während der Sucher offen ist. Gefunden wird der Code selbst, als Zeichenfolge. Ist es die Einladung eines Betriebs, öffnet die App damit die Anmeldung; jeder andere Code wird Ihnen nur angezeigt, und Sie entscheiden, was damit geschieht. Eine Liste gescannter Codes führt die App nicht.',
        ],
      }),

      ds.freitext({
        titel: 'Arbeitsberichte und Belege als PDF',
        absaetze: [
          'Arbeitsberichte, Angebote, Lieferscheine und Rechnungen entstehen vollständig auf Ihrem Gerät; dafür wird keine Verbindung aufgebaut und nichts an uns oder an Dritte übertragen. Es gibt keinen Server und keinen Versand durch uns. Die fertigen Dateien legt die App in ihrem eigenen Ordner ab und öffnet die Vorschau Ihres Betriebssystems.',
          'Ab da entscheiden Sie: Was Sie von dort aus drucken, per E-Mail versenden, in eine Cloud legen oder in eine andere App geben, richtet sich nach deren Bedingungen und liegt in Ihrer Verantwortung als Betrieb. Beachten Sie dabei, dass ein solches Blatt Anschrift und Kundennummer Ihres Kunden enthält, beim Arbeitsbericht auch dessen Unterschrift und Fotos.',
          'Eine Rechnung erzeugt die App als E-Rechnung im Format ZUGFeRD: Im PDF steckt zusätzlich eine maschinenlesbare Datei (factur-x.xml) mit denselben Angaben — Anschrift, E-Mail und Kundennummer Ihres Kunden sowie Anschrift, Bankverbindung und Steuernummer Ihres Betriebs. Wer das PDF erhält, kann diese Angaben also auch maschinell auslesen; genau dazu ist eine E-Rechnung da.',
        ],
      }),

      ds.freitext({
        titel: 'Die Unterschrift des Kunden',
        absaetze: [
          'Unterschreibt Ihr Kunde einen Arbeitsbericht, entsteht daraus unmittelbar das PDF des Berichts; der Schriftzug wird als Linien hineingesetzt. Danach verwirft die App den Schriftzug. Im Bericht bleiben nur der Name und der Zeitpunkt stehen.',
          'Die Unterschrift Ihres Kunden liegt damit genau einmal vor: in dem Dokument, zu dem sie gehört. Es entsteht keine Sammlung von Unterschriften, die jemand später durchsehen oder verlieren könnte. Berichte aus früheren Fassungen der App tragen ihre Unterschrift noch gespeichert; die bleibt, bis Sie den Bericht löschen.',
        ],
      }),

      ds.freitext({
        titel: 'Sprachnotizen',
        absaetze: [
          'Sie können zu einem Kunden, einem Termin oder einem Bericht eine Sprachnotiz aufnehmen. Die Aufnahme beginnt erst, wenn Sie sie antippen, und endet, wenn Sie sie beenden — die App hört zu keinem anderen Zeitpunkt mit. Beim ersten Mal fragt sie das Mikrofonrecht ab; verweigern Sie es, entfällt die Funktion und sonst nichts.',
          'Die Aufnahme liegt als Datei im Ordner der App, dazu der Zeitpunkt, die Dauer und der Name der Person, die sie aufgenommen hat. Gelöscht wird eine Notiz über den Papierkorb daneben; damit geht auch der Text dazu.',
          'Sie können eine Aufnahme in Text umwandeln lassen — entweder indem Sie statt der Sprachnotiz ein Diktat aufnehmen, dann geschieht es gleich im Anschluss, oder indem Sie bei einer vorhandenen Notiz „Text erkennen“ antippen. Von allein passiert es nicht: Eine gewöhnliche Sprachnotiz bleibt Ton, bis Sie es verlangen. Der erkannte Text wird bei der Notiz gespeichert — und damit behandelt wie die Notiz selbst: Gleicht Ihr Betrieb über einen Server ab, gehen Aufnahme und Text mit dorthin. Was jemand beim Kunden aufgesprochen hat, liegt dann also auch als lesbarer Text auf dem Server Ihres Betriebs.',
          'Die Umwandlung geschieht auf dem Gerät. Die Aufnahme wird dafür nicht übertragen — die App verlangt ausdrücklich Erkennung ohne Netz und bricht ab, wenn das Gerät sie nicht beherrscht. Auf Android erledigt das allerdings nicht die App selbst, sondern der Spracherkennungsdienst, der auf dem Gerät vorinstalliert ist; bei den meisten Geräten stammt er von Google. Fehlt ihm das deutsche Sprachpaket, stößt die App dessen Download an — dieser eine Vorgang ist eine Verbindung zu Google, und er überträgt Ihre Aufnahme nicht, sondern lädt das Sprachmodell herunter. Danach arbeitet die Erkennung ohne Internet.',
          'Auf dem iPhone fragt die App beim ersten Mal zusätzlich das Recht zur Spracherkennung ab. Verweigern Sie es, bleibt die Aufnahme erhalten und nur die Umwandlung entfällt. Im Browser gibt es die Umwandlung nicht.',
        ],
      }),

      ds.freitext({
        titel: 'Ankunft und Abfahrt beim Termin',
        absaetze: [
          'Diese Funktion ist aus, solange Ihr Betrieb sie nicht einschaltet. Ist sie an, hält die App bei einem Termin den Standort des Geräts fest, wenn Sie ankommen und wenn Sie abfahren — jeweils Koordinaten und deren Genauigkeit. Beim ersten Ankommen werden die Koordinaten zusätzlich beim Kunden gespeichert, damit sein Objekt beim nächsten Mal wiedergefunden wird.',
          'Der Standort wird nur abgefragt, während die App offen ist. Es gibt keine Aufzeichnung im Hintergrund und keinen Verlauf. Ein Kartendienst ist nicht beteiligt; die Koordinaten gehen an niemanden.',
          'Für Sie als Betrieb ist das eine Verarbeitung von Beschäftigtendaten: Aus Ankunft und Abfahrt lässt sich ablesen, wann jemand wo war. Gibt es bei Ihnen einen Betriebsrat, ist dessen Mitbestimmung nach § 87 Abs. 1 Nr. 6 BetrVG zu beachten, bevor Sie die Funktion einschalten.',
        ],
      }),

      ds.freitext({
        titel: 'Wie ein Mitarbeiter dazukommt',
        absaetze: [
          'Damit ein zweites Gerät am Abgleich teilnimmt, gibt der Verwalter einen Einladungscode aus. Die App zeigt ihn als QR-Code an; daneben steht „Einladung teilen“, womit der Verwalter ihn über das gewohnte Teilen-Menü seines Handys verschickt — per Nachricht, E-Mail oder wie auch immer er es gewöhnt ist.',
          'Zwei Dinge sollten Sie dabei wissen. Erstens enthält die Einladung den Code und, wenn Ihr Betrieb einen eigenen Server eingetragen hat, dessen Adresse; wer die Einladung bekommt, kann sich damit anmelden. Verschicken Sie sie also so, wie Sie einen Schlüssel verschicken würden. Zweitens entscheiden Sie selbst, welcher Weg das ist: Die App wählt keinen Dienst aus und sendet nichts von sich aus, sie reicht den Text nur an das Teilen-Menü weiter. Was der dort gewählte Dienst damit macht, richtet sich nach dessen eigenen Bedingungen.',
          'Den QR-Code können Sie mit der Kamera-App Ihres Handys lesen, die daraufhin Montix öffnet — oder mit dem Scanner, den Montix selbst mitbringt. In beiden Fällen landen Sie auf der Anmeldung, mit eingetragenem Code.',
        ],
      }),

      ds.freitext({
        titel: 'Nachrichten zwischen Mitarbeitern',
        absaetze: [
          'Nutzt Ihr Betrieb den Abgleich über einen Server, können sich die Mitarbeiter darüber kurze Nachrichten und Sprachnachrichten schicken. Gespeichert werden auf diesem Server Absender, Empfänger — eine Person oder alle —, der Text beziehungsweise die Aufnahme und der Zeitpunkt. Jedes Gerät erhält nur, was an alle, an die jeweilige Person oder von ihr ist.',
          'Es gibt dafür keinen Push-Dienst und keinen fremden Anbieter; die App fragt den Server ab, solange sie offen ist. Auf dem Gerät bleiben die Nachrichten der letzten 90 Tage.',
          'Auf dem Server gilt dieselbe Frist, allerdings mit einer Einschränkung, die Sie kennen sollten: Gelöscht wird beim Abruf, nicht von selbst. Nachrichten, die älter als 90 Tage sind, verschwinden, sobald jemand das nächste Mal Nachrichten abruft. Ruft niemand mehr ab — etwa weil der Betrieb die App nicht mehr benutzt —, bleiben sie liegen, bis wieder abgerufen oder der Betrieb insgesamt gelöscht wird.',
        ],
      }),

      ds.freitext({
        titel: 'Sensoren',
        absaetze: [
          'Wasserwaage und Kompass lesen den Lagesensor und das Magnetfeld des Geräts. Diese Messwerte werden nur angezeigt, nicht gespeichert und nicht übertragen; gespeichert wird allein die einmalige Kalibrierung der Wasserwaage.',
        ],
      }),

      ds.freitext({
        titel: 'NFC',
        absaetze: [
          'Die App kann NFC-Etiketten lesen, um ein Objekt oder ein Gerät wiederzufinden. Ein solches Etikett trägt nur eine Kennung; was dahintersteckt, steht in Ihren eigenen Daten auf dem Gerät.',
        ],
      }),

      ds.freitext({
        titel: 'Kartenzahlung und Standort',
        absaetze: [
          'Wenn Sie vor Ort kassieren, liest das Telefon die Karte mit seinem eigenen NFC-Chip. Den Bezahlvorgang wickelt Stripe über das Stripe-Konto Ihres Betriebs ab. Montix sieht und speichert dabei keine Kartendaten; der geheime Stripe-Schlüssel liegt auf Ihrem Zahlungsdienst, die App kennt nur dessen Adresse und einen Zugangscode.',
          'Für diese Funktion verlangt der Zahlungsanbieter den Standort des Geräts — ohne Standortfreigabe nimmt er keine Karten an. Deshalb und nur deshalb fragt die App Standortrechte ab. Montix selbst zeichnet keinen Standort auf, wertet keinen aus und übermittelt keinen an uns.',
          'Kassieren erscheint in der App überhaupt erst, wenn auf Ihrem Zahlungsdienst ein Stripe-Schlüssel hinterlegt ist. Für die Verarbeitung durch Stripe gilt deren Datenschutzerklärung; Vertragspartner von Stripe sind Sie, nicht wir.',
        ],
      }),

      ds.freitext({
        titel: 'Lizenz',
        absaetze: [
          'Der erste Monat ist kostenlos und braucht keinen Schlüssel; gemerkt wird dafür nur der Tag des ersten Starts auf dem Gerät. Ein später erworbener Lizenzschlüssel wird auf dem Gerät geprüft — die App meldet dazu nichts an uns zurück und fragt bei uns nichts ab.',
        ],
      }),

      // Expo lädt die Aktualisierungen; der Baustein nennt Expo (USA) und die
      // Standardvertragsklauseln selbst. Dieselbe Lage wie bei Farbecho.
      ds.appUpdates({ zweck: 'Fehler schnell beheben zu können' }),

      // Korrigiert am 13.11.2026: Der erste Entwurf behauptete, es werde keine
      // Geraetekennung abgerufen. Das stimmte nicht. registerForPush() haengt
      // in src/app/settings.tsx an der Zeile "Benachrichtigungen erlauben" und
      // holt getExpoPushTokenAsync({ projectId }) - also sehr wohl eine
      // Kennung, und zwar ueber Expo. Ein Rechtstext, der eine Erhebung
      // verschweigt, ist schlimmer als gar keiner.
      ds.freitext({
        titel: 'Benachrichtigungen',
        absaetze: [
          'Benachrichtigungen sind freiwillig und zunächst aus. Erst wenn Sie sie unter „Einstellungen“ einschalten, fragt die App die Erlaubnis Ihres Geräts ab und holt anschließend über den Dienst Expo (650 Industries, Inc., USA) eine Kennung, mit der sich genau dieses Gerät ansprechen lässt. Rechtsgrundlage ist Ihre Einwilligung nach Art. 6 Abs. 1 lit. a DSGVO; Sie widerrufen sie, indem Sie Benachrichtigungen in den Systemeinstellungen Ihres Geräts wieder abschalten.',
          'Diese Kennung wird auf Ihrem Gerät gespeichert und derzeit an keinen Server übertragen. Versendet werden bislang auch keine Benachrichtigungen — die Funktion ist vorbereitet, aber nicht in Gebrauch. Ändert sich das, steht es vorher an dieser Stelle.',
          'Schalten Sie Benachrichtigungen nicht ein, geschieht nichts davon: keine Abfrage, keine Kennung, keine Verbindung zu Expo.',
        ],
      }),

      ds.betroffenenrechte,
    ],
  },
};
