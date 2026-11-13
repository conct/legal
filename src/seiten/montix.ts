import * as ds from '../datenschutz.js';
import type { Preset } from '../presets.js';

/**
 * Montix (de.conct.montix) — die App für Handwerker und Dienstleister, die
 * beim Kunden arbeiten. Seiten unter feif.space/apps-software/montix/,
 * deshalb der Schlüssel `montix.feif.space` wie bei Farbecho und Klarschiff.
 *
 * Quelle ist nicht ein vorhandener Rechtstext — es gibt keinen. Jeder Absatz
 * unten ist am Code nachgesehen (Repo conct/Kilpro, Stand 13.11.2026,
 * 145f2fa):
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
        titel: 'Die App sperren',
        absaetze: [
          'Unter Einstellungen → Sicherheit können Sie für dieses Gerät eine eigene PIN aus vier bis acht Ziffern vergeben. Ist sie gesetzt, fragt Montix sie beim Start ab und wieder, wenn die App länger als eine Minute im Hintergrund war. Nach fünf Fehlversuchen wartet sie dreißig Sekunden. Die Sperre ist freiwillig und gilt je Gerät — sie wird nicht abgeglichen.',
          'Gespeichert wird die PIN nicht. Abgelegt wird im geschützten Speicher des Betriebssystems nur ein Prüfwert daraus, zusammen mit einem Zufallszusatz und der Länge. Beim Eingeben wird derselbe Prüfwert erneut gebildet und verglichen. Zurückrechnen lässt er sich nicht — was aber nicht heißt, dass er unknackbar wäre: Eine vierstellige PIN hat zehntausend Möglichkeiten, und wer den Prüfwert in die Finger bekäme, könnte sie alle durchprobieren. Getragen wird der Schutz deshalb vom geschützten Speicher, an den andere Apps nicht herankommen — und von der Länge, die Sie wählen. Acht Ziffern sind zehntausendmal besser als vier.',
          'Zusätzlich können Sie Fingerabdruck oder Gesichtserkennung erlauben. Diese Prüfung nimmt Ihnen das Betriebssystem ab; Montix erfährt davon nur, ob sie geklappt hat. Biometrische Merkmale bekommt die App zu keinem Zeitpunkt zu sehen, und sie werden weder gespeichert noch übertragen. Haben Sie Ihre PIN vergessen, können Sie die Sperre über „PIN vergessen?“ aufheben, indem Sie sich gegenüber dem Gerät selbst ausweisen — mit dessen eigener PIN, dem Muster oder dem Finger.',
          'Daran hängt allerdings eine Bedingung, und sie ist wichtig genug, um sie vor dem Einschalten zu lesen: Dieser Ausweg setzt voraus, dass Ihr Gerät überhaupt eine eigene Sperre hat. Hat es keine — kein Muster, keine Geräte-PIN, keinen hinterlegten Finger —, lässt sich auch nichts bestätigen, und eine vergessene App-PIN ist dann nicht mehr zu umgehen. Es bliebe nur, die Daten der App zu löschen: Gleicht Ihr Betrieb ab, kommen sie danach vom Server zurück; arbeiten Sie allein auf dem Gerät, sind sie fort. Richten Sie deshalb erst eine Bildschirmsperre auf dem Gerät ein und danach die der App. Das ist ohnehin die Reihenfolge, die schützt.',
          'Hier gehört eine Grenze hin, damit Sie sich nicht auf etwas verlassen, was die Sperre nicht leistet: Sie hält jemanden davon ab, die App zu öffnen. Sie verschlüsselt Ihre Daten nicht. Pläne, Kunden und Berichte liegen wie zuvor im Ordner der App. Wer ein entsperrtes Gerät in der Hand hält und an die Dateien kommt, kommt auch an diese Daten. Wogegen ein verlorenes Handy wirklich schützt, ist die Verschlüsselung des Geräts selbst — stellen Sie also sicher, dass Ihre Geräte eine Bildschirmsperre haben.',
          'Unabhängig davon verhindert Montix von sich aus — also ohne dass Sie etwas einschalten — Bildschirmfotos und Bildschirmaufnahmen; in der Übersicht der offenen Apps bleibt die Vorschau dann leer, sodass Kundendaten dort nicht mitlaufen. Sie können das im selben Menü abschalten, wenn Sie Aufnahmen brauchen.',
        ],
      }),

      ds.freitext({
        titel: 'Bewegung: der freiwillige Schrittzähler',
        absaetze: [
          'Ihr Betrieb kann eine Aktion ausloben, bei der Schritte gezählt und belohnt werden — gemeinsam, in Etappen oder in Teams. Dieser Abschnitt ist länger als die anderen, weil hier mehr auf dem Spiel steht: Es geht um Daten über Ihren Körper, erhoben im Arbeitsverhältnis, und sie werden Ihren Kolleginnen und Kollegen gezeigt.',
          'Der Schalter heißt „Mitmachen“ und steht unter Bewegung. Er ist ab Werk aus und gilt je Gerät. Solange Sie ihn nicht einschalten, liest die App keine Schritte, fragt kein Recht dazu ab und überträgt nichts. Niemand sonst kann ihn für Sie einschalten — auch der Verwalter nicht. Er legt nur die Aktion an.',
          'Schalten Sie ihn ein, teilt die App je Tag genau eine Zahl: Ihre Schrittzahl. Dazu Ihre Mitarbeiterkennung, Ihr Name und das Datum. Mehr nicht — keine Uhrzeiten, keine Wege, keinen Standort, keine Strecken, keine Herzfrequenz und keinen anderen Gesundheitswert. Gelesen werden die letzten acht Tage, höchstens alle fünfzehn Minuten, und nur während die App offen ist.',
          'Woher die Zahl kommt: Auf Android aus Health Connect, der Sammelstelle von Android für Gesundheitsdaten; die App bittet dort ausschließlich um das Lesen von Schritten und holt die Tagessumme. Auf dem iPhone aus dem Bewegungssensor des Geräts, ohne Apple Health. In beiden Fällen liest die App nur — sie schreibt dort nichts hinein.',
          'Und jetzt der Punkt, den Sie kennen müssen, bevor Sie mitmachen: Ihre Tageszahlen gehen an den Server Ihres Betriebs und von dort auf die Geräte aller Teilnehmenden. Daraus entsteht eine Rangliste mit Namen. Ihre Kolleginnen und Kollegen sehen also, wie viel Sie sich bewegt haben, und Ihr Arbeitgeber sieht es auch. Wer das nicht möchte, schaltet „Mitmachen“ nicht ein — das ist kein Nachteil, den jemand aussprechen dürfte, sondern Ihr gutes Recht.',
          'Schalten Sie wieder aus, löscht die App Ihre Tageswerte und meldet die Löschung über den Abgleich an den Server und an alle Geräte. Danach erscheinen Sie in keiner Rangliste mehr. Der Server nimmt Schrittzahlen überdies nur für die Person entgegen, von deren Gerät sie kommen; fremde Werte im eigenen Namen einzutragen, geht nicht.',
          'Rechtlich ruht das auf Ihrer Einwilligung, und die geben Sie mit dem Schalter — ausdrücklich, widerruflich, ohne Begründung. Zwei Dinge, die ein Betrieb dazu wissen sollte: Aus einer Verweigerung darf kein Nachteil folgen, sonst wäre die Einwilligung nicht freiwillig (§ 26 Abs. 2 BDSG). Und eine namentliche Rangliste ist eine Einrichtung, mit der sich Verhalten überwachen lässt; gibt es einen Betriebsrat, redet der nach § 87 Abs. 1 Nr. 6 BetrVG mit. Das lässt sich nicht dadurch ersetzen, dass alle einzeln zustimmen — das Mitbestimmungsrecht steht dem Gremium zu, nicht den Einzelnen.',
          'Wir selbst werten diese Zahlen nicht aus, verkaufen sie nicht und nutzen sie zu keinem anderen Zweck. Sie liegen in der Datenbankdatei Ihres Betriebs wie die übrigen Daten auch.',
        ],
      }),

      ds.freitext({
        titel: 'Sensoren',
        absaetze: [
          'Die Werkzeuge lesen die Sensoren des Geräts: Wasserwaage den Lagesensor, Kompass das Magnetfeld, der Höhenmesser den Luftdruck. Beim Kalibrieren der Wasserwaage prüft zusätzlich das Gyroskop, ob Sie das Gerät wirklich um 180 Grad gedreht haben.',
          'Diese Messwerte werden nur angezeigt, nicht gespeichert und nicht übertragen. Gespeichert wird allein die einmalige Kalibrierung der Wasserwaage.',
          'Hat das Gerät keinen Luftdrucksensor, nimmt der Höhenmesser die Höhe aus dem Satellitenempfang — dafür fragt er, wenn Sie ihn antippen, den Standort ab, und nur dann. Der Wert wird angezeigt und sonst nirgends hingeschrieben.',
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
          'Wenn Sie vor Ort kassieren, liest das Telefon die Karte mit seinem eigenen NFC-Chip. Den Bezahlvorgang wickelt Stripe über das Stripe-Konto Ihres Betriebs ab. Montix sieht und speichert dabei keine Kartendaten.',
          'Den geheimen Schlüssel Ihres Stripe-Kontos hinterlegt Ihr Verwalter einmal in der App; abgelegt wird er auf dem Server, über den Ihr Betrieb abgleicht, verschlüsselt und ohne je an ein Gerät zurückgegeben zu werden. Betreiben wir diesen Server, steht im Vertrag zur Auftragsverarbeitung, was diese Verschlüsselung leistet und was nicht.',
          'Für diese Funktion verlangt der Zahlungsanbieter den Standort des Geräts — ohne Standortfreigabe nimmt er keine Karten an. Das ist der eine Anlass, bei dem ein Standort das Gerät verlässt.',
          'Damit Sie den Überblick behalten: Nach dem Standort fragt die App an drei Stellen, jedes Mal nur im Vordergrund und nie von selbst. Beim Kassieren, weil der Zahlungsanbieter es verlangt. Bei Ankunft und Abfahrt, falls Ihr Betrieb das eingeschaltet hat. Und beim Höhenmesser, wenn dem Gerät der Luftdrucksensor fehlt. Nur im ersten Fall geht etwas nach draußen; in den beiden anderen bleibt der Wert auf dem Gerät beziehungsweise geht höchstens in den Abgleich Ihres eigenen Betriebs. An uns übermittelt Montix keinen Standort.',
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
