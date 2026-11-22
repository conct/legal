import * as ds from '../datenschutz.js';
import type { Preset } from '../presets.js';
import { link, p, txt } from '../types.js';

/**
 * Montix (de.conct.montix) — die App für Handwerker und Dienstleister, die
 * beim Kunden arbeiten. Seiten unter feif.space/apps-software/montix/,
 * deshalb der Schlüssel `montix.feif.space` wie bei Farbecho und Klarschiff.
 *
 * Quelle ist nicht ein vorhandener Rechtstext — es gibt keinen. Jeder Absatz
 * unten ist am Code nachgesehen (Repo conct/Kilpro, Stand 14.11.2026,
 * fb37ffb):
 *
 *   app.json            plugins, android.permissions, updates.url
 *   src/features/…      license, payment, push, signature, home, customers
 *   src/plan/use-plan   AsyncStorage-Schlüssel des Planeditors
 *   src/features/pdf    Berichts- und Beleg-PDF, Ablage im App-Ordner
 *   src/features/belege Angebot, Lieferschein, Rechnung als E-Rechnung
 *   src/features/company Firmendaten (Absender, Bank, Steuernummer)
 *   src/features/reports/fotos.native.ts  Fotos als Dateien, Kamerarecht
 *
 * Nachgetragen am 14.11.2026 (Kilpro-Stand mit OTA d631cc91): Termine dem
 * Kunden mitteilen (server/abgleich/terminmitteilung.mjs), Fehler melden
 * (fehler.mjs, src/app/fehler.tsx), Adressvorschläge und „Aktuelle Position
 * verwenden“ (adresse.mjs, src/components/AdressFeld.tsx).
 *
 * Nachgetragen am 15.11.2026 (Kilpro 954a3fd): E-Mail je Mitarbeiter über den
 * Server des Betriebs (server/abgleich/mail.mjs, mail-helfer.py, src/app/mail*).
 * Ebenfalls 15.11.2026: ohne Betrieb direkt vom Gerät (src/features/mail/geraet, react-native-tcp-socket).
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
          'Montix braucht keine Registrierung: kein Kennwort, keine E-Mail-Adresse, kein Profil bei uns. Alles, was Sie in der App anlegen — Pläne, Kunden, Artikel, Termine, Unterschriften —, bleibt auf Ihrem Gerät. Es gibt keine Werbung und keine Analyse-, Tracking- oder Absturzmeldedienste.',
          'Eine einzige Funktion kann mehr verlangen, und auch die nur, wenn Sie sie wollen: Wer die Alleinarbeit ohne Betrieb nutzt, lässt dafür ein Konto auf unserem Server anlegen — mit nichts als einem Namen, ohne Kennwort und ohne Anmeldung. Alles andere in Montix funktioniert ohne das; Einzelheiten unter „Alleinarbeit ohne Betrieb“.',
          'Die App ist darauf ausgelegt, vollständig ohne Netz zu arbeiten. Verbindungen nach außen gibt es nur in den unten einzeln beschriebenen Fällen.',
          p(
            txt('Dieser Text sagt, was wo gespeichert wird und was hinausgeht. Wie die einzelnen Funktionen bedient werden, steht im '),
            link('Benutzerhandbuch zu Montix', '/apps-software/montix/handbuch/'),
            txt(' — dort hat jedes Kapitel einen Abschnitt „Gut zu wissen“, in dem auch die Grenzen stehen.'),
          ),
        ],
      }),

      ds.freitext({
        titel: 'Was auf dem Gerät gespeichert wird',
        absaetze: [
          'Pläne mit allen Elementen, ein als Vorlage hinterlegtes Foto oder Planbild, die selbst angelegte Symbolbibliothek, Kundendaten, Artikel, Termine, Arbeitsberichte, Belege, Sprachnotizen, die Zusammenstellung Ihrer Startseite, die Kalibrierung der Wasserwaage, die gewählten Firmenfarben, Ihr Firmenlogo sowie Hell- oder Dunkeldarstellung.',
          'Dazu Ihre Belege — Angebote, Lieferscheine und Rechnungen — samt der Nummernstände, die die App je Belegart und Jahr auf dem Gerät weiterzählt.',
          'An einer ausgestellten Rechnung kommen mit der Zeit zwei Dinge hinzu, die nicht zu ihrem festgeschriebenen Inhalt gehören: erfasste Zahlungen — jeweils Datum, Betrag, Zahlart und eine mögliche Notiz — und die Mahnstufen mit Datum, Gebühr und neuer Frist. Daraus entsteht auf dem Gerät der Mahnbrief als PDF. Beides sagt etwas über das Zahlungsverhalten Ihres Kunden aus; gehen Sie damit entsprechend um.',
          'An Ihren Kunden können außerdem stehen: die Umsatzsteuer-Identifikationsnummer, die Angabe, dass der Kunde selbst Bauleistungen erbringt (dann rechnet Montix nach § 13b UStG ohne Steuer ab), und bei öffentlichen Auftraggebern die Leitweg-ID. Die Leitweg-ID steht in der XRechnung auch als elektronische Adresse des Käufers — sie geht also mit der Rechnung an den Auftraggeber, was ihr Zweck ist.',
          'Dazu die Daten Ihres Betriebs, die als Absender auf Bericht und Beleg kommen: Firmenname, Anschrift, Inhaber, Telefon, E-Mail, Internetseite, Bankverbindung und Steuernummer oder Umsatzsteuer-Identifikationsnummer.',
          'Fotos zu den Arbeitsberichten und die erzeugten PDF-Dateien liegen als Dateien in einem eigenen Ordner der App, nicht in der Bilderrolle Ihres Geräts. Andere Apps kommen dort nicht heran, solange Sie die Dateien nicht selbst weitergeben.',
          'Dazu kommen der Tag des ersten Starts — daran bemisst sich der kostenlose Probemonat — und, falls vorhanden, Ihr Lizenzschlüssel.',
          'Beim allerersten Start legt die App auf einem noch leeren Gerät Beispiele an — einen Kunden, zwei Artikel, einen Termin und einen Arbeitsbericht als Entwurf, alle mit dem Zusatz „(Beispiel)“ im Namen. Sie sind zum Ausprobieren da und lassen sich auf der Startseite mit einem Tipp entfernen. Melden Sie das Gerät bei einem Betrieb an, verschwinden sie von selbst, damit sie nicht in dessen Datenbestand geraten.',
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
          'Beim Vermessen eines Raumes läuft die Kamera ebenfalls — auf iPhone und iPad über Apples RoomPlan, auf Android über ARCore. Dabei entsteht kein Bild, das irgendwo bliebe: Gespeichert wird allein der Grundriss, also Wände, Türen, Fenster und ihre Maße. Das Kamerabild wird nur ausgewertet, solange die Aufnahme läuft, und weder abgelegt noch übertragen.',
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
          'Eine einzelne Sprachnotiz lässt sich weitergeben — als Abschrift im PDF und als Aufnahme, über einen Link, wie eine geteilte Mappe. Dann verlässt das Gesprochene Ihren Betrieb, und die Empfängerseite kann es im Browser abspielen. Was dabei genau hinausgeht und wie lange es liegt, steht im Abschnitt über das Teilen mit anderen Firmen. Von allein geschieht das nicht: Es braucht den Griff zum Teilen-Zeichen an der Notiz.',
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
          'Die App fragt den Server ab, solange sie offen ist. Haben Sie Benachrichtigungen eingeschaltet, kommt zu einer neuen Nachricht zusätzlich eine Push-Mitteilung mit Ihrem Namen und bis zu 140 Zeichen des Textes — über Expo und Google, siehe den Abschnitt „Benachrichtigungen“. Auf dem Gerät bleiben die Nachrichten der letzten 90 Tage.',
          'Wer eine Nachricht geschickt hat, kann sie löschen. Dann entfernt der Server Text und Aufnahme sofort, und die Geräte der Empfänger löschen sie beim nächsten Abruf. Eine Nachricht von jemand anderem lässt sich nur vom eigenen Gerät entfernen.',
          'Nachrichten in einer anderen Sprache übersetzt die App auf Android auf dem Gerät selbst, mit ML Kit von Google. Dafür lädt sie beim ersten Mal ein Sprachpaket von Servern von Google herunter, etwa 30 MB je Sprache; dabei erfährt Google die IP-Adresse des Geräts und welche Sprache geladen wird. Der Text selbst verlässt das Handy nicht. Ohne den Knopf „Übersetzen“ wird nichts geladen.',
          'Auf dem Server gilt dieselbe Frist, allerdings mit einer Einschränkung, die Sie kennen sollten: Gelöscht wird beim Abruf, nicht von selbst. Nachrichten, die älter als 90 Tage sind, verschwinden, sobald jemand das nächste Mal Nachrichten abruft. Ruft niemand mehr ab — etwa weil der Betrieb die App nicht mehr benutzt —, bleiben sie liegen, bis wieder abgerufen oder der Betrieb insgesamt gelöscht wird.',
        ],
      }),

      ds.freitext({
        titel: 'E-Mail',
        absaetze: [
          'In Montix können Sie Ihr eigenes E-Mail-Postfach einrichten — mit Adresse, Passwort und den Servern Ihres Mailanbieters, wie in jedem Mailprogramm. Das ist freiwillig; wer es nicht einrichtet, bei dem geschieht nichts davon. Wie die Mails laufen, hängt davon ab, ob Sie in einem Betrieb arbeiten.',
          'Ohne Betrieb verbindet sich die App direkt mit dem Mailserver Ihres Anbieters, verschlüsselt, ohne Umweg über uns. Zugangsdaten und Passwort bleiben im geschützten Speicher Ihres Geräts; an uns geht dabei nichts. Für die Verarbeitung bei Ihrem Mailanbieter gelten dessen eigene Bedingungen.',
          'Im Betrieb verbindet sich Montix nicht selbst mit Ihrem Mailanbieter, sondern über den Server Ihres Betriebs: Die App bittet ihn, Ordner und Mails abzurufen oder eine Mail zu verschicken, und er erledigt das beim Mailanbieter. Dafür speichert der Server Ihre Zugangsdaten — Adresse, Name, Server, Benutzername und Passwort —, und zwar verschlüsselt und getrennt je Mitarbeiter. Das Passwort geht einmal beim Einrichten an den Server und kommt nie zurück aufs Gerät; die Kollegen und der Verwalter Ihres Betriebs sehen weder Ihr Postfach noch Ihre Mails.',
          'Die Mails selbst legt der Server nicht ab. Sie gehen bei jedem Abruf durch ihn hindurch zur App und bleiben im Übrigen bei Ihrem Mailanbieter, wie bisher. Die App merkt sich auf dem Gerät nur die zuletzt geladene Liste je Ordner — Absender, Empfänger, Betreff und Datum —, damit sie ohne Netz etwas zeigen kann. Öffnen Sie einen Anhang, wird er auf dem Gerät abgelegt und mit dem System geöffnet.',
          'Entfernen Sie das Postfach in Montix, löscht der Server die Zugangsdaten sofort. Für die Mails bei Ihrem Mailanbieter gelten dessen eigene Bedingungen. Betreiben wir den Server für Ihren Betrieb, verarbeiten wir die Zugangsdaten und die durchgereichten Mails in dessen Auftrag; es gilt der Vertrag zur Auftragsverarbeitung.',
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
        titel: 'Rückmeldung zum Testdruck',
        absaetze: [
          'Nach einem Testdruck fragt die App, ob er geklappt hat. Antworten Sie, geht die Antwort an unseren Server: der Gerätename, wie er im Feld steht, die Art des Druckers (A4, Bon, Etikett), die Verbindung (WLAN oder Bluetooth), bei Bondruckern die Papierbreite, Ja oder Nein und ob es ein Android-Gerät oder ein iPhone ist. Nicht dabei sind Ihr Name, Ihr Betrieb oder eine Kennung Ihres Geräts. Die IP-Adresse nutzt der Server nur kurz im Arbeitsspeicher, um Missbrauch zu bremsen.',
          'Daraus entsteht eine öffentliche Liste der Geräte, die mit Montix funktionieren. Ein Gerät steht dort erst, wenn wir es freigegeben haben. Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO: das Interesse, Käufern zu zeigen, welche Geräte passen. Wer nicht antwortet, schickt nichts.',
        ],
      }),

      ds.freitext({
        titel: 'Fehler melden',
        absaetze: [
          'Unter Einstellungen → Benutzer und System → „Fehler melden“ können Sie uns einen Fehler schicken. Mit Ihrer Beschreibung gehen dann, und nur dann, mit: die Fassung der App und des zuletzt geladenen Updates, Hersteller und Modell des Geräts, die Version des Betriebssystems, die Bildschirmgröße, ob Sie im Betrieb oder allein arbeiten, und die Uhrzeit. Wenn Sie wollen, außerdem eine E-Mail-Adresse für Rückfragen und bis zu drei Bildschirmfotos, die Sie selbst aus der Galerie wählen. Ist Ihr Gerät bei unserem Server angemeldet, stehen Ihr Name, Ihr Betrieb und Ihre Rolle dabei.',
          'Die Meldung geht über unseren Server als E-Mail an unseren Support und wird dort zur Fehlerbehebung gelesen. Der Server selbst speichert sie nicht. Er zählt nur im Arbeitsspeicher, wie viele Meldungen am selben Tag von derselben IP-Adresse kamen, damit ihn niemand mit Meldungen überschwemmt; mit einem Neustart des Dienstes ist das fort. Rechtsgrundlage ist Ihre Anfrage selbst (Art. 6 Abs. 1 lit. b DSGVO) und unser Interesse, Fehler zu beheben (Art. 6 Abs. 1 lit. f DSGVO).',
          'Weil Montix Bildschirmfotos sperrt, lassen sie sich auf dieser Seite für fünfzehn Minuten erlauben. Danach, nach dem Senden oder nach einem Neustart sperrt die App von selbst wieder. Achten Sie darauf, was auf einem Bildschirmfoto zu sehen ist: Steht dort der Name eines Kunden, geht er mit.',
        ],
      }),

      ds.freitext({
        titel: 'Alleinarbeit: wenn niemand sonst da ist',
        absaetze: [
          'Wer allein in einem Keller, auf einem Dach oder in einem Schacht arbeitet, kann in der App „Alleinarbeit“ beginnen und dabei ein Zeitfenster wählen — 15, 30, 60 oder 120 Minuten. Innerhalb dieser Frist tippt er „Alles in Ordnung“, was die Frist verlängert. Bleibt das aus, wird daraus ein Alarm für die Kollegen. „Notruf an Kollegen“ löst sofort aus, „Beenden“ hebt alles wieder auf.',
          'Das ist kein Angebot, sondern Arbeitsschutz. Deshalb stützt sich diese Verarbeitung nicht auf eine Einwilligung, sondern darauf, dass Ihr Arbeitgeber für Ihre Sicherheit zu sorgen hat (§ 26 Abs. 1 BDSG in Verbindung mit dem Arbeitsschutzgesetz). Mit dem Schrittzähler hat sie nichts zu tun: Es werden keine Schritte erfasst, keine Bewegungsdaten ausgewertet, und nichts davon erscheint in einer Rangliste.',
          'Auf dem Server Ihres Betriebs steht, solange die Alleinarbeit läuft oder ein Alarm besteht: Ihre Kennung und Ihr Name, wann Sie begonnen haben, wann die Frist abläuft, welches Zeitfenster Sie gewählt haben, der Stand (läuft, Alarm, beendet), bei einem Alarm dessen Anlass — abgelaufene Frist oder Notruf — und dessen Zeitpunkt sowie der Name des Kollegen, der „Ich kümmere mich“ angetippt hat. Diese Angaben sehen alle aktiven Mitarbeiter Ihres Betriebs; anders wäre ein Alarm sinnlos. Beendete Einträge löscht der Server nach sieben Tagen.',
          'Dazu kommt Ihr Standort, aber nur unter drei Bedingungen: wenn Sie den Schalter „Standort im Alarmfall mitschicken“ an lassen — er ist ab Werk an und lässt sich ausschalten —, nur während die App offen ist, und nur beim Beginnen und bei jedem Bestätigen. Gespeichert wird allein der zuletzt bekannte Ort, kein Verlauf und keine Strecke. Er ist dafür da, dass jemand weiß, wo er nachsehen muss.',
          'Ein Alarm nimmt drei Wege: Kollegen und Angehörige sehen ihn in der App, sie bekommen — wenn Benachrichtigungen eingeschaltet sind — eine Push-Mitteilung, und Notfallkontakte bekommen eine E-Mail. Jeder dieser Wege hat eine Bedingung, die Sie nicht erzwingen können: die App muss offen sein, die Mitteilung muss zugestellt werden, die Post muss gelesen werden. Und alle drei setzen voraus, dass unser Server läuft.',
          'Deshalb bleibt es dabei: Montix ist keine Personen-Notsignal-Anlage im Sinne der einschlägigen Regeln und ersetzt keine. Wenn Ihre Gefährdungsbeurteilung eine solche verlangt, bleibt sie verlangt. Und einen Notruf ersetzt es ohnehin nicht — in Lebensgefahr gilt die 112.',
        ],
      }),

      ds.freitext({
        titel: 'Unterwegs zum Kunden',
        absaetze: [
          'Diese Funktion gibt es nur im Betrieb und nur, wenn der Betrieb den Standort bei Terminen eingeschaltet hat. Ist sie an, kann der Mitarbeiter am Termin „Losfahren“ antippen. Der Server legt dafür eine Adresse an, die der Mitarbeiter dem Kunden selbst schickt — über das Teilen-Menü seines Handys, nicht von uns aus.',
          'Was Ihr Kunde auf dieser Seite sieht, ist bewusst wenig: den Vornamen des Mitarbeiters, den Namen Ihres Betriebs, bei wem der Termin ist, und eine gerundete Entfernung — „gleich da“, „weniger als 1 km“, „etwa 4 km“. Keine Karte, keine Koordinaten, keine Adresse. Dazu, wann zuletzt aktualisiert wurde, und der Hinweis, dass es sich um Luftlinie handelt. Die Seite ist von Suchmaschinen ausgenommen.',
          'Die App meldet die Position etwa jede Minute, solange sie offen ist; gespeichert wird nur die letzte, kein Verlauf. Eine Ortung im Hintergrund gibt es nicht — schließt der Mitarbeiter die App, bleibt die Seite beim letzten Stand stehen und sagt das auch. Mit „Angekommen“ endet die Fahrt, der Ort wird gelöscht, und vierundzwanzig Stunden später ist die Adresse nicht mehr erreichbar.',
          'Die Entfernung kann die App nur nennen, wenn sie den Ort des Kunden schon kennt — gelernt beim ersten Ankommen dort. Sonst steht auf der Seite nur „Auf dem Weg“.',
          'Im Betrieb sehen die Kollegen im Kalender dasselbe: wer gerade unterwegs ist, zu wem, und wie weit es ungefähr noch ist. Für Sie als Betrieb heißt das: Hier werden Beschäftigte geortet, und zwar sichtbar für Kollegen und für Kunden. Gibt es einen Betriebsrat, ist dessen Mitbestimmung nach § 87 Abs. 1 Nr. 6 BetrVG zu beachten, bevor Sie den Schalter umlegen.',
        ],
      }),

      ds.freitext({
        titel: 'Touren: Fahrer, Disposition und Standort',
        absaetze: [
          'Das Modul Touren ist für Speditionen und andere Betriebe mit Fahrzeugen gedacht. Es ist aus, bis der Verwalter es einschaltet, und es gibt es nur im Betrieb mit Abgleich. Die Daten liegen auf dem Server, über den Ihr Betrieb abgleicht — auf unserem oder auf Ihrem eigenen.',
          'Gespeichert werden die Touren, wie die Disposition sie plant: Datum, Fahrzeug, zuständiger Fahrer und die Stopps mit Name des Empfängers, Anschrift, Ansprechpartner, Telefonnummer und E-Mail-Adresse, soweit eingetragen, dazu Zeitfenster, Sendungsnummer, Packstücke und Hinweise. Was unterwegs geschieht, hält die App als Meldung fest: Start, Ankunft, Beginn und Ende des Ladens, Abfahrt, Pause, Störung und Abweichung — jeweils mit Zeitpunkt, mit dem Ort, an dem getippt wurde, und mit dem Namen der Person, die gemeldet hat. Bei der Quittung kommen der Name der Person, die die Ware annimmt, und ihre Unterschrift dazu, bei einer Abweichung auf Wunsch Fotos, beim Scannen die gelesenen Codes. Touren und Meldungen bleiben, bis der Betrieb sie löscht.',
          'Während eine Tour läuft, meldet das Handy des Fahrers seinen Standort an den Server: etwa jede Minute, solange die App offen ist, und ab der Fassung mit dem Vordergrunddienst auch bei geschlossener App — dann alle 45 Sekunden oder alle 150 Meter. Dass das geschieht, zeigt eine dauerhafte Mitteilung „Tour läuft“; mit dem Ende der Tour hört die Ortung auf. Außerhalb einer Tour wird nicht geortet. Android fragt dafür eigens nach der Erlaubnis, den Standort immer zu verwenden; ohne sie bleibt es bei der Ortung bei offener App.',
          'Auf dem Server liegen die letzte Position jeder Tour und ein Verlauf mit höchstens einer Position je Minute, aus dem die Disposition die gefahrene Strecke sieht. Beides löscht der Server dreißig Tage nach der Aufzeichnung. Die Position sehen die Disposition — Verwalter und wer das Recht „Disposition“ hat — und, nur für die eigene Tour, der Fahrer selbst. In der App öffnet die Disposition die Karte aller Fahrzeuge über einen Link, der zwölf Stunden gilt und nur, solange die Person die Disposition hat; auf dem Server liegt davon nur eine Prüfsumme. Wer diesen Link hat, sieht in dieser Zeit die Positionen ohne Anmeldung — er ist deshalb nicht zum Weitergeben gedacht.',
          'Ist das Fahrzeug weniger als 150 Meter vom nächsten Stopp entfernt, schlägt die App einmal vor, die Ankunft zu melden. Das rechnet das Handy selbst aus, die Mitteilung entsteht auf dem Gerät und geht nicht über Expo; gemeldet wird erst, wenn der Fahrer es bestätigt.',
          'Für Sie als Betrieb ist das eine Ortung von Beschäftigten, und zwar laufend, solange sie fahren. Rechtsgrundlage ist in der Regel § 26 BDSG in Verbindung mit Art. 88 DSGVO oder eine Betriebsvereinbarung. Gibt es einen Betriebsrat, ist dessen Mitbestimmung nach § 87 Abs. 1 Nr. 6 BetrVG zu beachten, bevor Sie das Modul einschalten. Betreiben wir den Server, verarbeiten wir diese Daten in Ihrem Auftrag nach dem Vertrag zur Auftragsverarbeitung.',
        ],
      }),

      ds.freitext({
        titel: 'Adressen, Fahrzeiten und Karten bei Touren',
        absaetze: [
          'Damit der Server Ankunftszeiten schätzen kann, braucht er zu jedem Stopp Koordinaten. Fehlen sie, sucht er die Anschrift in einem eigenen Adressverzeichnis, das auf demselben Server liegt — erzeugt aus den Daten von OpenStreetMap. Die Anschrift verlässt den Server dabei nicht. Die Ankunftszeit rechnet er dann selbst aus der Luftlinie.',
          'Hat der Betreiber des Servers einen Zugang zu openrouteservice eingerichtet (HeiGIT gGmbH, Heidelberg), fragt der Server dort die Lkw-Fahrzeit bis zum nächsten Stopp ab. Dabei gehen nur zwei Koordinatenpaare hinaus: die letzte Position des Fahrzeugs und der Stopp, ohne Namen und ohne Kennung des Fahrzeugs.',
          'Die Karte der Fahrzeuge für die Disposition im Browser und die Karte auf der Seite für den Empfänger laden Programmbibliothek und Kartendaten vom Server Ihres Betriebs. Auf unserem Server liegen dafür die Kartendaten für Deutschland, aus OpenStreetMap und aufbereitet von Protomaps; ein fremder Kartendienst ist nicht beteiligt und erfährt nicht, wer eine Karte ansieht. Außerhalb Deutschlands bleibt die Karte vorerst ohne Hintergrund.',
          'Betreibt Ihr Betrieb einen eigenen Server ohne diese Kartendaten, holt der Browser die Kartenbilder stattdessen von den Servern der OpenStreetMap Foundation (Vereinigtes Königreich). Dann erfährt die OpenStreetMap Foundation die IP-Adresse des Browsers und welchen Kartenausschnitt er lädt — nicht aber, wessen Fahrzeug dort steht.',
        ],
      }),

      ds.freitext({
        titel: 'Der Link für den Empfänger',
        absaetze: [
          'Zu jedem Stopp kann die Disposition einen Link erzeugen, unter dem der Empfänger seine Lieferung verfolgt. Den Link gibt sie entweder selbst weiter, über das Teilen-Menü — dann gilt, was oben zur Einladung von Mitarbeitern steht —, oder der Server schickt ihn per E-Mail im Namen Ihres Betriebs an die Adresse, die am Stopp eingetragen ist. Eine eigene Liste der Empfängeradressen führt der Server nicht; die Adresse steht nur am Stopp der Tour.',
          'Auf der Seite sieht der Empfänger: den Namen Ihres Betriebs, den Namen des Stopps und die Sendungsnummer, den geplanten Tag und das Zeitfenster, wie viele Stopps noch vor ihm liegen, die geschätzte Ankunft und, falls gemeldet, den Grund einer Verzögerung oder dass der Fahrer Pause macht. Läuft eine Sendung über mehrere Abschnitte — Lkw, Bahn, Schiff —, stehen deren Stationen mit Zeit darunter.',
          'Eine Karte mit der Position des Fahrzeugs erscheint erst, wenn das Fahrzeug als Nächstes zu genau diesem Empfänger fährt, weniger als 25 Kilometer entfernt ist und die Position nicht älter als fünfzehn Minuten ist. Vorher sieht der Empfänger nicht, wo das Fahrzeug ist. Den Namen des Fahrers, das Kennzeichen und die übrigen Stopps zeigt die Seite nie.',
          'Nach der Zustellung zeigt die Seite einen Zustellnachweis: Datum und Uhrzeit, den Namen der Person, die angenommen hat, und deren Unterschrift. Das sollten Sie wissen, denn es betrifft auch diese Person: Wer den Link hat, sieht Name und Unterschrift. Dreißig Tage nach der Zustellung ist die Seite nicht mehr erreichbar, neunzig Tage nach seiner Erstellung löscht der Server den Link.',
          'Die Seite verlangt keine Anmeldung und ist von Suchmaschinen ausgenommen. Der Schutz liegt im Link: Er enthält einen zufälligen Schlüssel, und auf dem Server liegt nur dessen Prüfsumme. Wir können einen verlorenen Link also nicht wiederherstellen, und jeder kommt hinein, der ihn hat.',
        ],
      }),

      ds.freitext({
        titel: 'Fremdfahrer und Partnerbetriebe',
        absaetze: [
          'Ein Betrieb kann Subunternehmer an seinen Touren beteiligen, ohne dass diese eine eigene Lizenz brauchen. Die Disposition erzeugt dafür einen Code; wer ihn einlöst, bekommt beim Betrieb ein Gastkonto als Fremdfahrer oder als Partnerbetrieb. Dieses Konto sieht nur die Touren, die ihm zugeteilt sind, und als Ansprechpartner nur die Disposition — nicht die übrigen Mitarbeiter, nicht die Kunden, nicht die übrigen Daten des Betriebs. Umgekehrt sieht der Betrieb vom Gast nur, was dieser zu den zugeteilten Touren meldet, samt Standort während der Tour. Die Daten der beiden Firmen bleiben getrennt, auch auf dem Handy.',
          'Ein Partnerbetrieb kann eine solche Tour in seinen eigenen Betrieb übernehmen und dort einem eigenen Fahrer geben, auch wenn er einen anderen Server benutzt. Dann bewahrt der Server des Partners den Zugang zum Server des auftraggebenden Betriebs auf und schickt ihm jede Minute die Meldungen seines Fahrers zu dieser Tour — mit dessen Namen — und die letzte Position; Änderungen an der Tour holt er von dort ab. Andere Touren und Daten des Partners gehen nicht hinaus.',
          'Für diese Weitergabe ist jede Firma für ihren Teil selbst verantwortlich. Der Partnerbetrieb entscheidet, die Daten seines Fahrers an den Auftraggeber zu geben; ob die beiden dafür eine Vereinbarung brauchen und wie sie ihre Fahrer informieren, klären sie miteinander. Sperrt die Disposition einen Gast, bekommt dessen Gerät keine Touren mehr.',
        ],
      }),

      ds.freitext({
        titel: 'Termine dem Kunden mitteilen',
        absaetze: [
          'Am Termin können Sie Ihrem Kunden Datum, Uhrzeit und Ort mitteilen und ihn bestätigen lassen. Dafür legt der Server, über den Ihr Betrieb abgleicht, zu diesem Termin einen Eintrag an: Titel, Beginn, Dauer und bei mehrtägigen Terminen den letzten Tag, Name, E-Mail-Adresse und Anschrift des Kunden, soweit eingetragen, Ihre Nachricht an ihn, Ihren Namen und wer für den Termin zuständig ist. Dazu eine zufällige, nicht zu erratende Adresse, unter der Ihr Kunde den Termin sieht.',
          'Diese Adresse erreicht den Kunden auf einem von zwei Wegen. Entweder schickt der Server ihm eine E-Mail im Namen Ihres Betriebs. Oder Sie geben den Link selbst weiter, über das Teilen-Menü Ihres Handys — dann gilt, was oben zur Einladung von Mitarbeitern steht: Welchen Dienst Sie dort wählen, entscheiden Sie.',
          'Auf der Seite tippt der Kunde „Termin bestätigen“ oder „Passt nicht“ und kann einen Wunschtermin oder ein paar Worte dazuschreiben. Gespeichert werden seine Wahl, dieser Text und der Zeitpunkt. Die Antwort kommt in Ihre App zurück und, wenn Benachrichtigungen eingeschaltet sind, als Push-Mitteilung an Sie und die Zuständigen. Auf Wunsch erinnert der Server den Kunden am Tag vor dem Termin einmal per E-Mail. Die Seite ist von Suchmaschinen ausgenommen.',
          'Dreißig Tage nach dem letzten Tag des Termins löscht der Server den Eintrag samt Antwort, und der Link führt ins Leere. Für Sie als Betrieb ist das eine Verarbeitung von Kundendaten; betreiben wir den Server, tun wir das in Ihrem Auftrag, und es gilt der Vertrag zur Auftragsverarbeitung.',
        ],
      }),

      ds.freitext({
        titel: 'Mappen mit anderen Firmen teilen',
        absaetze: [
          'Diese Funktion gibt es nur im Betrieb. Sie stellen eine Mappe zusammen und teilen sie über einen Link oder einen QR-Code mit jemandem außerhalb Ihres Betriebs, etwa einer anderen Firma auf derselben Baustelle. Geteilt wird ein Stand, also eine Kopie. Niemand bekommt dadurch Zugang zu Ihrem Betrieb, zu Ihren Kunden oder zu Ihren Berichten.',
          'Teilen können Sie jeden einzelnen Inhalt: einen Lageplan, eine Zeichnung, einen Arbeitsbericht, einen Beleg oder eine Sprachnotiz. Fotos lassen sich jeweils dazulegen, und eine Mappe nur aus Fotos geht auch. Was dabei hinausgeht, ist von der Art abhängig, und weil es Daten Ihrer Kunden sind, steht es hier einzeln:',
          'Ein Plan und eine Zeichnung gehen als Bild und als PDF hinaus. Ein Arbeitsbericht geht als PDF — ist er unterschrieben, ist es genau das damals unterschriebene Blatt, die Unterschrift Ihres Kunden also mit darin. Darin stehen außerdem Name und Adresse des Kunden, die Tätigkeiten, das Material und die Zeiten. Ein Beleg geht als PDF, eine Rechnung dabei als E-Rechnung; bei ihr stecken die Rechnungsdaten zusätzlich maschinenlesbar in der Datei. Eine Sprachnotiz geht als Abschrift im PDF und als Aufnahme — gibt es noch keine Abschrift, nur als Aufnahme. In der Aufnahme ist die Stimme derer zu hören, die gesprochen haben, und auf der Abschrift steht, wann sie aufgenommen wurde und von wem.',
          'Überlegen Sie deshalb vor jedem Teilen, ob der Empfänger das wirklich alles braucht. Ein unterschriebener Bericht und eine Rechnung enthalten mehr über Ihren Kunden, als eine Baustellenfrage meist verlangt.',
          'Auf unserem Server liegen dann: der Titel, auf Wunsch eine Objektadresse und eine Notiz, die Dateien selbst, und der Name der Person, die geteilt hat. Dazu, wann die Mappe angelegt und zuletzt geändert wurde, die wievielte Fassung es ist, wie oft sie abgerufen wurde und wann zuletzt. IP-Adressen der Abrufenden speichern wir nicht, und wer eine Mappe ansieht, erfahren wir nicht.',
          'Wer die Mappe öffnet, sieht davon nur einen Teil: den Namen Ihres Betriebs, den Titel, die Objektadresse und die Notiz, soweit Sie welche eingetragen haben, dazu die Dateien. Der Name der Person, die geteilt hat, steht nicht auf dieser Seite — den sehen nur Sie selbst in der Liste Ihrer Freigaben. Eine Ausnahme gehört dazu: In den Dateien selbst kann ein Name stehen. Die Abschrift einer Sprachnotiz nennt, wer sie aufgenommen hat, und ein Arbeitsbericht nennt, wer gearbeitet hat.',
          'Die Seite dazu ist öffentlich in dem Sinne, dass sie keine Anmeldung verlangt. Sie ist von Suchmaschinen ausgenommen, wird nicht zwischengespeichert und gibt beim Weiterklicken keine Herkunft preis. Der Schutz liegt allein im Link: Er enthält einen zufälligen Schlüssel, und auf dem Server liegt nur dessen Prüfsumme. Das hat zwei Folgen, die Sie kennen sollten. Erstens können auch wir den Link nicht wiederherstellen, wenn er verloren geht — dann teilen Sie neu. Zweitens kommt jeder hinein, der ihn hat. Behandeln Sie ihn wie einen Schlüssel und stellen Sie ihn nicht irgendwohin, wo ihn Unbeteiligte finden.',
          'Zusätzlich können Sie eine PIN setzen. Nach zehn falschen Eingaben ist die Mappe fünfzehn Minuten gesperrt. Wer die richtige PIN eingegeben hat, kommt eine Stunde lang ohne erneute Eingabe hinein.',
          'Sie wählen beim Teilen, wie lange der Link gelten soll: sieben Tage, dreißig Tage, ein Jahr oder unbefristet. Läuft die Frist ab, ist die Mappe sofort nicht mehr abrufbar, und ein Aufräumlauf entfernt die Dateien vom Server — er läuft stündlich, spätestens eine Stunde nach Ablauf sind sie also weg. Stehen bleibt nur die Zeile in Ihrer eigenen Liste, mit Titel, Zeitpunkten und der Zahl der Abrufe; die Dateien sind daraus nicht wiederherzustellen.',
          'Schneller geht es mit „Zurückziehen“: Das entfernt die Dateien unmittelbar und macht den Link tot. Nehmen Sie das, wenn eine Mappe nicht erst in sieben Tagen verschwinden soll. Wird der ganze Betrieb gelöscht, verschwinden ohnehin alle Mappen mit ihm, weil sie in derselben Datei liegen.',
          'Löschen Sie Ihr eigenes Konto, bleiben Mappen bestehen, die Sie geteilt haben — sie gehören dem Betrieb, so wie Berichte und Belege auch. Ihr Name verschwindet dabei: Er wird in diesen Mappen durch „gelöscht“ ersetzt, genau wie überall sonst. Wollen Sie auch die Mappen selbst los sein, ziehen Sie sie vor dem Löschen zurück.',
          'Aufnehmen lassen sich Bilder (JPEG, PNG, WebP), Zeichnungen (SVG), PDF-Dateien, Tabellen als CSV und Tonaufnahmen (M4A beziehungsweise MP4, WebM, WAV, MP3), höchstens zwanzig Stück und zusammen 25 MB je Mappe; ein Betrieb kann insgesamt 500 MB geteilt halten. Der Server prüft bei jeder Datei, ob sie wirklich dem angegebenen Typ entspricht — er sieht sich dazu die Kennbytes am Anfang an —, nimmt Zeichnungen nur ohne eingebettete Skripte an und CSV-Dateien nur ohne Nullbytes.',
          'Eine Tonaufnahme bekommt auf der Seite einen Abspieler. Wer den Link hat, kann sie also unmittelbar im Browser hören, ohne sie herunterzuladen; geladen wird sie erst beim Antippen. Das ist bequem und heißt zugleich: Gesprochenes ist dort so leicht zugänglich wie ein Bild.',
          'Den Link können Sie selbst verschicken oder uns verschicken lassen. Im zweiten Fall geben Sie eine Empfängeradresse an, und unser Server schickt eine E-Mail im Namen Ihres Betriebs: darin der Titel, die Objektadresse, Ihre optionale Nachricht, der Link, bis wann er gilt und, falls Sie eine PIN gesetzt haben, der Hinweis, dass diese getrennt kommt. Die Dateien selbst hängen nie an einer solchen Mail. Als Absender steht der Name Ihres Betriebs, nicht der einer Person.',
          'Diese Empfängeradresse speichern wir nicht — sie wird für den Versand benutzt und danach nicht abgelegt. Es gibt keine Liste, wem Sie etwas geschickt haben. Damit niemand unseren Server als Schleuder benutzt, gehen höchstens hundert solcher Mails je Betrieb und Tag hinaus, und der Server lässt sich nur einen Link schicken, der wirklich zu dieser Mappe gehört.',
          'Über die Weitergabe entscheiden Sie als Betrieb. Sie sind dafür der Verantwortliche: Was in der Mappe landet, bestimmen Sie, und ob Ihr Kunde damit einverstanden ist, dass sein Lageplan oder Fotos seines Hauses eine andere Firma erreichen, klären Sie. Wir speichern und stellen bereit, in Ihrem Auftrag und nach dem Vertrag zur Auftragsverarbeitung.',
        ],
      }),

      ds.freitext({
        titel: 'Buchhaltung: der Stapel für die Kanzlei',
        absaetze: [
          'Aus Ihren ausgestellten Rechnungen und Stornorechnungen erzeugt Montix einen Buchungsstapel im DATEV-Format, den Ihre Kanzlei einlesen kann. Angebote und Lieferscheine sind keine Buchungen und kommen darin nicht vor, Entwürfe ebenso wenig.',
          'Das geschieht in der App, auf Ihrem Gerät. Wir sehen dabei nichts, und ein Stapel entsteht nicht von selbst — Sie lösen ihn aus. Sie können ihn als Datei weitergeben, dann berührt er unseren Server überhaupt nicht.',
          'Wählen Sie stattdessen „An die Kanzlei senden“, wird daraus eine geteilte Mappe mit der Tabelle darin: Sie liegt dreißig Tage auf unserem Server, und die Kanzlei bekommt den Link per E-Mail. Dann gilt alles, was im Abschnitt zu den Mappen steht — auch, dass der Link der Schlüssel ist. In dieser Tabelle stehen Rechnungsdaten Ihrer Kunden, also Namen, Beträge und Konten. Überlegen Sie deshalb, ob der kurze Weg über uns der richtige ist oder ob Sie die Datei lieber unmittelbar übergeben.',
          'Für diese Funktion speichert Montix ein paar Angaben zusätzlich: an Ihren Firmendaten die Berater- und die Mandantennummer, den Beginn Ihres Wirtschaftsjahres, den Kontenrahmen und die E-Mail-Adresse Ihrer Kanzlei; an Ihren Kunden deren Debitorennummer. Nutzen Sie den Abgleich, liegen diese Angaben wie die übrigen Stammdaten auf dem Server Ihres Betriebs.',
          'Dieselbe Seite gibt auch eine Rechnungsliste als Tabelle aus — dieselben Rechnungen mit Fälligkeit, erfassten Zahlungen und Zahlstand. Sie entsteht ebenfalls auf Ihrem Gerät und geht nur dorthin, wohin Sie sie geben.',
          'Eine Grenze, die zur Ehrlichkeit gehört: Der Stapel prüft sich nicht selbst. Ob die Kontierung zu Ihrem Betrieb passt, entscheidet Ihre Kanzlei — lassen Sie den ersten Stapel dort bestätigen, bevor Sie sich darauf verlassen.',
        ],
      }),

      ds.freitext({
        titel: 'Gemeinsame Bereiche für ein Objekt',
        absaetze: [
          'Auch diese Funktion gibt es nur im Betrieb. Sie legen zu einem Objekt einen Bereich an und laden ein, wer dort mitarbeitet: andere Firmen und den Auftraggeber. Jede und jeder bekommt einen eigenen Link. Darin lassen sich Punkte und Mängel anlegen, abhaken, Notizen schreiben und Fotos anhängen — im Browser, ohne Konto und ohne dass die Gegenseite Montix braucht. Bei jedem Eintrag steht, wer ihn geschrieben hat.',
          'Der Link ist dabei der Ausweis. Wer ihn hat, schreibt unter dem Namen, für den er ausgestellt wurde. Geben Sie ihn also jeweils einer Person und sagen Sie der Gegenseite, dass sie ihn nicht weiterreichen soll — sonst steht am Ende unter einem Eintrag ein Name, der nicht dazugehört. Entfernen Sie eine Beteiligte oder einen Beteiligten, ist der zugehörige Link sofort tot.',
          'Hier ist ein Unterschied zu den geteilten Mappen wichtig, und wir sagen ihn offen: Bei einer Mappe liegt auf dem Server nur die Prüfsumme des Schlüssels, wir können den Link also selbst nicht wiederherstellen. Bei einem Bereich liegt er zusätzlich verschlüsselt, weil der Server ihn in die Benachrichtigungen schreiben muss. Der Schutz ist damit etwas schwächer als bei einer Mappe.',
          'Auf dem Server liegen: Name, Rolle und, falls Sie eine angeben, die E-Mail-Adresse jeder beteiligten Person; die Punkte mit Titel, Text, Zuständigkeit, Stand, Fotos sowie Name und Zeitpunkt dessen, der sie geschrieben und der sie erledigt hat; die Notizen ebenso; und je Beteiligtem, wann er den Bereich zuletzt aufgerufen hat. IP-Adressen speichern wir nicht. Gegen Missbrauch nimmt der Server je Zugang höchstens dreißig Eingaben in der Minute an.',
          'Untereinander sehen die Beteiligten die Namen aller, die dabei sind, und natürlich, wer was geschrieben hat. Die E-Mail-Adressen sehen sie nicht — die kennt nur Ihr Betrieb, und auch den Zeitpunkt des letzten Aufrufs sehen nur Sie.',
          'Für vertrauliche Hinweise — in der Praxis vor allem der Türcode zum Objekt — gibt es einen eigenen Weg. Ein solcher Hinweis wird verschlüsselt abgelegt (AES-256-GCM mit einem Schlüssel, der nur auf unserem Server liegt), er ist nur für die von Ihnen ausgewählten Beteiligten und für Ihren Betrieb sichtbar, und er steht niemals in einer E-Mail oder in einer Mitteilung aufs Handy. Jedes Ansehen wird mit Namen und Zeitpunkt festgehalten, damit später nachvollziehbar ist, wer den Code kannte. Nach der gewählten Frist löscht ihn der Server von selbst: Das Formular im Browser bietet einen Tag, sieben, dreißig oder neunzig Tage an, über die App sind bis zu 365 Tage möglich, voreingestellt sind dreißig. Der Aufräumlauf arbeitet stündlich.',
          'Benachrichtigt wird per E-Mail von einer Adresse unter feif.space. Die Einladung geht sofort hinaus. Alles Weitere wird gesammelt: Der erste neue Eintrag öffnet ein Fenster von einer Viertelstunde, und alles, was darin dazukommt, steht in derselben Nachricht — höchstens also eine Sammelnachricht je Beteiligtem und Bereich in fünfzehn Minuten, mit bis zu dreißig Zeilen. Was jemand selbst getan hat, steht nicht in seiner eigenen Nachricht. An entfernte Beteiligte und in geschlossene Bereiche geht nichts mehr. In Ihren Betrieb geht zusätzlich eine Mitteilung aufs Handy, und zwar an die Person, die den Bereich angelegt hat, und an die Verwalter.',
          'Zum Schließen: „Schließen“ macht alle Links tot und löscht Fotos und vertrauliche Hinweise sofort; die Punkte bleiben für Ihren Betrieb lesbar, weil sie zum Objekt gehören und oft noch gebraucht werden. Wird der ganze Betrieb gelöscht, verschwindet alles mit ihm. Löscht eine einzelne Person ihr Konto, bleiben ihre Einträge bestehen, ihr Name wird darin aber durch „gelöscht“ ersetzt — auch bei „erledigt von“ und in den festgehaltenen Einsichten in einen Code.',
          'Verantwortlicher für all das sind Sie als Betrieb. Dreierlei liegt damit bei Ihnen und nicht bei uns: Sie entscheiden, wen Sie einladen, und übermitteln uns dabei Namen und E-Mail-Adressen von Menschen, die bei anderen Firmen arbeiten oder Ihre Kunden sind — dafür brauchen Sie einen Grund nach Artikel 6 DSGVO, in aller Regel die Durchführung des Auftrags. Sie entscheiden, was in den Bereich geschrieben und fotografiert wird. Und Sie entscheiden, wer den Türcode sehen darf. Wir speichern, stellen bereit und benachrichtigen, in Ihrem Auftrag und nach dem Vertrag zur Auftragsverarbeitung.',
        ],
      }),

      ds.freitext({
        titel: 'Notfallkontakte: wer eine E-Mail bekommt',
        absaetze: [
          'Zur Alleinarbeit können Sie bis zu fünf Notfallkontakte hinterlegen — Name und E-Mail-Adresse, gern auch Angehörige. Entsteht ein Alarm, verschickt unser Server genau eine E-Mail an diese Adressen: Ihr Name, ob die Frist ablief oder Sie den Notruf gedrückt haben, der Zeitpunkt, und falls Sie den Standort mitschicken lassen, dessen Koordinaten als Kartenlink. Dazu der Hinweis, sofort zu versuchen Sie zu erreichen, und dass in Lebensgefahr die 112 gilt. Melden Sie sich danach, geht eine Entwarnung hinterher.',
          'Verschickt wird über den Mailversand unseres eigenen Servers, Absender ist eine Adresse unter feif.space. Es ist kein Versanddienstleister beteiligt, und die Adressen Ihrer Kontakte werden für nichts anderes benutzt — kein Newsletter, keine Werbung, keine Weitergabe.',
          'Diese Adressen gehören nicht Ihnen, sondern den Menschen dahinter. Deshalb bekommt jede neu eingetragene Adresse einmal eine Nachricht: dass Sie sie als Notfallkontakt eingetragen haben, was im Alarmfall kommt, und dass sie Ihnen Bescheid sagen oder antworten kann, wenn sie das nicht möchte. Tragen Sie dieselbe Adresse später erneut ein, geht keine zweite Nachricht hinaus.',
          'Das ist keine Zustimmung, die erst abgewartet wird — die Funktion trägt sofort, sonst wäre sie im Ernstfall nutzlos. Es ist eine Mitteilung, und sie hat einen zweiten Zweck: Sie fängt Tippfehler ab. Ohne sie erführe ein Fremder erst im Ernstfall, dass es Ihnen schlecht geht, und unter Umständen auch wo Sie sind. Sprechen Sie trotzdem vorher mit den Betreffenden; die Nachricht ersetzt das nicht.',
          'In jeder dieser Nachrichten steht, wer für die Daten verantwortlich ist — bei einem Privatkonto wir, bei einem Betrieb der Betrieb, in dessen Auftrag wir verarbeiten.',
          'Zum Kartenlink: Der Standort steht als Verweis auf OpenStreetMap in der E-Mail. Die Koordinaten selbst stehen damit bereits in der Nachricht; ruft der Empfänger den Verweis auf, erfährt OpenStreetMap, welche Stelle angesehen wird. Wer das nicht möchte, kann die Koordinaten aus der Nachricht auch in eine andere Karte eingeben, und wer gar keinen Standort mitschicken will, schaltet das in der App ab.',
          'Entfernen können Sie einen Kontakt jederzeit in der App; dann bekommt er keine Nachricht mehr. Gespeichert bleiben die Kontakte, solange Sie sie stehen lassen.',
        ],
      }),

      ds.freitext({
        titel: 'Angehörige als Empfänger',
        absaetze: [
          'Sie können einer Person außerhalb des Betriebs — etwa jemandem zu Hause — einen Empfänger-Zugang geben. Dazu erzeugt die App einen Code als QR-Bild, so wie bei einer Einladung. Wer ihn einlöst, sieht auf seinem Gerät ausschließlich Ihre Alleinarbeit: ob sie läuft, ob ein Alarm besteht, und kann „Ich kümmere mich“ antippen.',
          'Sonst nichts. Kein Abgleich, keine Kunden, keine Berichte, keine Kollegenliste, keine Lizenz. Der Server lässt für einen solchen Zugang nur diesen einen Weg zu und auch den nur für die Person, zu der er gehört. In den Mitarbeiterlisten Ihres Betriebs taucht er nicht auf. Entfernen Sie den Empfänger, ist dessen Gerät abgemeldet.',
        ],
      }),

      ds.freitext({
        titel: 'Alleinarbeit ohne Betrieb: das Privatkonto',
        absaetze: [
          'Die Alleinarbeit lässt sich auch ohne Betrieb nutzen. Die App legt dafür auf unserem Server ein Konto für Sie allein an — Sie geben nur einen Namen an, kein Kennwort, keine E-Mail-Adresse, keine Anmeldung.',
          'Hier gilt etwas anderes als im ganzen übrigen Text, und das ist der Grund, warum dieser Abschnitt existiert: Bei einem Betrieb verarbeiten wir in dessen Auftrag, und der Betrieb ist Verantwortlicher. Bei einem Privatkonto gibt es keinen Auftraggeber. Dort sind wir selbst Verantwortliche im Sinne der DSGVO, und Sie wenden sich mit Auskunft, Berichtigung und Löschung an uns, nicht an jemand anderen. Die Anschrift steht oben unter 1.',
          'Auf dem Server liegen dabei nur die Angaben, die diese eine Funktion braucht: Ihr Name, Beginn und Frist der laufenden Alleinarbeit, deren Stand, Ihre Notfallkontakte, etwaige Empfänger und — falls eingeschaltet — der zuletzt bekannte Standort. Ihre Kunden, Pläne, Berichte und Belege bleiben auf dem Gerät; für ein Privatkonto ist der Abgleich auf dem Server gesperrt. Rechtsgrundlage ist die Erfüllung dieser von Ihnen gewünschten Leistung, beim Standort zudem der Schutz Ihrer lebenswichtigen Interessen.',
          'Damit nicht jemand massenhaft Konten anlegt, nimmt der Server höchstens fünf neue Konten je Internetanschluss und Tag an. Dazu wird die IP-Adresse gezählt, aber nur im Arbeitsspeicher und ohne sie zu speichern.',
          'Hier stand bis zum 14. November 2026, für das Löschen eines Privatkontos gebe es noch keine Schaltfläche und wir erledigten es auf Zuruf. Das stimmt nicht mehr: Auf der Seite Alleinarbeit steht „Konto löschen“, und damit verschwindet der ganze Bestand dieses Privatkontos vom Server — Name, Fristen, Notfallkontakte, Empfänger und der letzte Standort. Auf Zuruf tun wir es weiterhin, wenn Sie das vorziehen. Beendete Einträge zur Alleinarbeit verschwinden ohnehin nach sieben Tagen von selbst.',
          'Eine Einschränkung, die Sie kennen sollten, wenn Sie in einem Betrieb der einzige Verwalter sind: Ihre eigene Person lässt sich dann nicht löschen. Der Server lehnt es ab, weil ein Betrieb ohne Verwalter niemanden mehr hätte, der ihn verwaltet. Bestimmen Sie zuerst einen zweiten Verwalter, oder löschen Sie den ganzen Betrieb.',
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
          'Eines bleibt allerdings stehen, und das mit Absicht: ein Vermerk darüber, dass Sie zugestimmt haben — Ihre Kennung, Ihr Name, der Zeitpunkt, die Fassung des Hinweises und ob der Schalter an oder aus ist. Nach dem Ausschalten steht dort „aus“. Dieser Vermerk enthält keine Schrittzahl. Er ist nötig, weil Ihr Betrieb nachweisen können muss, dass eine Einwilligung vorlag und wann sie widerrufen wurde; ohne ihn stünde Aussage gegen Aussage. Gelöscht wird er, wenn die Daten Ihres Betriebs insgesamt gelöscht werden.',
          'Rechtlich ruht das auf Ihrer Einwilligung, und die geben Sie mit dem Schalter — ausdrücklich, widerruflich, ohne Begründung. Zwei Dinge, die ein Betrieb dazu wissen sollte: Aus einer Verweigerung darf kein Nachteil folgen, sonst wäre die Einwilligung nicht freiwillig (§ 26 Abs. 2 BDSG). Und eine namentliche Rangliste ist eine Einrichtung, mit der sich Verhalten überwachen lässt; gibt es einen Betriebsrat, redet der nach § 87 Abs. 1 Nr. 6 BetrVG mit. Das lässt sich nicht dadurch ersetzen, dass alle einzeln zustimmen — das Mitbestimmungsrecht steht dem Gremium zu, nicht den Einzelnen.',
          'Wir selbst werten diese Zahlen nicht aus, verkaufen sie nicht und nutzen sie zu keinem anderen Zweck. Sie liegen in der Datenbankdatei Ihres Betriebs wie die übrigen Daten auch.',
        ],
      }),

      ds.freitext({
        titel: 'Adressvorschläge',
        absaetze: [
          'Beim Tippen in „Straße und Hausnummer“ — beim Kunden, in Ihren Firmendaten und bei Tour-Stopps — schlägt die App ab drei Zeichen passende Anschriften vor. Dafür schickt sie den bis dahin getippten Text an den Server, über den Ihr Betrieb abgleicht, ohne Abgleich an unseren. Der sucht in einem eigenen Adressverzeichnis, das auf demselben Server liegt und aus den Daten von OpenStreetMap erzeugt ist (© OpenStreetMap-Mitwirkende, ODbL). Ein fremder Dienst ist nicht beteiligt; der Text verlässt den Server nicht.',
          'Unter dem Feld steht außerdem „Aktuelle Position verwenden“. Erst wenn Sie das antippen, fragt die App einmal den Standort ab und schickt ihn, auf etwa zehn Meter gerundet, auf demselben Weg, um die Anschriften in der Nähe zu erfahren.',
          'Gespeichert wird dabei nichts. Der Server zählt nur im Arbeitsspeicher, wie viele Anfragen am Tag von derselben IP-Adresse kommen, um Missbrauch zu bremsen; das ist mit einem Neustart des Dienstes fort. Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO: das Interesse, Anschriften schnell und richtig zu erfassen.',
          'Den Text schickt die App, solange Sie in diesem einen Feld schreiben. Ohne Netz gibt es keine Vorschläge, und das Feld bleibt ein gewöhnliches Eingabefeld. Soll eine Anschrift gar nicht hinausgehen, ist das Netz abzuschalten der sichere Weg.',
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
          'Die App kann NFC-Etiketten lesen und beschreiben, um ein Objekt oder ein Gerät wiederzufinden. Ein solches Etikett trägt nur eine Kennung; was dahintersteckt, steht in Ihren eigenen Daten auf dem Gerät. Beim Beschreiben wandert also kein Name, keine Anschrift und keine andere Angabe Ihres Kunden auf das Etikett — nur der Verweis. Wer das Etikett ohne Montix ausliest oder den dahinterliegenden Eintrag nicht hat, erfährt daraus nichts.',
          'Auf das Etikett geschrieben wird nur, wenn Sie es ausdrücklich anstoßen und das Etikett dabei an das Gerät halten. Was vorher darauf stand, wird dabei überschrieben.',
        ],
      }),

      ds.freitext({
        titel: 'Kartenzahlung und Standort',
        absaetze: [
          'Wenn Sie vor Ort mit dem Telefon kassieren, liest es die Karte mit seinem eigenen NFC-Chip. Den Bezahlvorgang wickelt Stripe über das Stripe-Konto Ihres Betriebs ab. Montix sieht und speichert dabei keine Kartendaten.',
          'Daneben kann Montix an einem SumUp-Kartenleser kassieren, der über Bluetooth am Telefon hängt — nur unter Android, und nur wenn Ihre App-Fassung das mitbringt. Dann liest der Leser die Karte, und den Vorgang wickelt SumUp über das SumUp-Konto Ihres Betriebs ab. Angemeldet wird einmal je Gerät im Anmeldefenster von SumUp; dieses Fenster gehört SumUp, Ihre Zugangsdaten bekommen wir nicht zu sehen und wir speichern sie nicht. Es gilt dann die Datenschutzerklärung von SumUp, und Vertragspartner von SumUp sind Sie, nicht wir. Anders als bei Stripe prüft unser Server eine SumUp-Zahlung nicht nach.',
          'Den geheimen Schlüssel Ihres Stripe-Kontos hinterlegt Ihr Verwalter einmal in der App; abgelegt wird er auf dem Server, über den Ihr Betrieb abgleicht, verschlüsselt und ohne je an ein Gerät zurückgegeben zu werden. Betreiben wir diesen Server, steht im Vertrag zur Auftragsverarbeitung, was diese Verschlüsselung leistet und was nicht.',
          'Für diese Funktion verlangt der Zahlungsanbieter den Standort des Geräts — ohne Standortfreigabe nimmt er keine Karten an. Das ist der eine Anlass, bei dem ein Standort das Gerät verlässt.',
          'Damit Sie den Überblick behalten: Nach dem Standort fragt die App nur an diesen Stellen, jedes Mal nur im Vordergrund und nie von selbst. Beim Kassieren, weil der Zahlungsanbieter es verlangt. Bei Ankunft und Abfahrt, falls Ihr Betrieb das eingeschaltet hat. Beim Höhenmesser, wenn dem Gerät der Luftdrucksensor fehlt. Bei „Aktuelle Position verwenden“ in einem Adressfeld. Und, wie oben beschrieben, bei Alleinarbeit, unterwegs zum Kunden und während einer Tour. Beim Kassieren geht der Standort an den Zahlungsanbieter; bei „Aktuelle Position verwenden“ an den Server Ihres Betriebs, der darin die nächsten Anschriften sucht, ohne ihn zu speichern. Sonst bleibt er auf dem Gerät oder geht höchstens in den Abgleich Ihres eigenen Betriebs.',
          'Kassieren erscheint in der App überhaupt erst, wenn einer der beiden Wege eingerichtet ist: ein Stripe-Schlüssel auf Ihrem Zahlungsdienst oder ein eingerichteter SumUp-Leser. Für die Verarbeitung durch Stripe gilt deren Datenschutzerklärung; Vertragspartner von Stripe sind Sie, nicht wir.',
        ],
      }),

      ds.freitext({
        titel: 'Lizenz und Kauf',
        absaetze: [
          'Der erste Monat ist kostenlos und braucht keinen Schlüssel; gemerkt wird dafür nur der Tag des ersten Starts auf dem Gerät. Die App zählt diesen Monat selbst, ohne Zahlungsdaten und ohne uns zu fragen.',
          'Für einen einzelnen Arbeitsplatz ändert sich daran nichts: Ob Sie in Google Play oder im App Store kaufen oder einen Lizenzschlüssel eintippen — geprüft wird auf dem Gerät. Die App meldet dazu nichts an uns zurück und fragt bei uns nichts ab.',
          'Beim Team-Abo geht das nicht ohne uns, denn es gilt für alle Geräte eines Betriebs und nicht nur für das kaufende. Die App schickt deshalb den Kaufbeleg an unseren Server — bei Google den Kauf-Token, bei Apple die von Apple signierte Transaktion. Unser Server fragt damit bei Google den Stand des Abos ab beziehungsweise prüft die Unterschrift von Apple nach. Gespeichert werden danach: die Kennung Ihres Betriebs, welches Produkt gekauft wurde, für wie viele Plätze es gilt, bis wann es läuft, sein Stand und die Kennung, unter der der Store den Kauf führt. Google und Apple melden uns später von sich aus, wenn ein Abo verlängert, gekündigt oder erstattet wird; wir schreiben dann den Stand fort.',
          'Zahlungsdaten bekommen wir dabei nie zu sehen. Wer bezahlt hat und womit, wissen Google und Apple; uns erreicht nur die Auskunft, dass dieser Kauf gültig ist und bis wann. Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO — ohne diese Prüfung könnten wir die gekaufte Leistung nicht freischalten.',
          'Einen Mehrplatz-Kauf oder eine Enterprise-Fassung rechnen wir weiter auf Rechnung ab. Dabei entsteht ein Lizenzschlüssel, den wir Ihnen per Mail schicken und den Ihre Geräte eintippen; dafür gelten die üblichen Angaben eines Geschäftsvorgangs und die steuerlichen Aufbewahrungsfristen.',
        ],
      }),

      ds.freitext({
        titel: 'Testbetrieb',
        absaetze: [
          'Sie können einen Betrieb direkt in der App zum Ausprobieren einrichten; er läuft dreißig Tage. Zahlungsdaten brauchen wir dafür nicht, und es wird daraus von selbst nichts Kostenpflichtiges.',
          'Angegeben werden dabei der Name des Betriebs und Ihr Name; eine E-Mail-Adresse ist freiwillig und dient nur dazu, dass wir uns melden können, wenn etwas klemmt oder der Test ausläuft. Gespeichert werden diese Angaben samt dem Tag, an dem der Test endet. Wir bekommen darüber eine Hinweis-Mail, damit wir wissen, dass jemand angefangen hat.',
          'Wird daraus nichts, löschen wir den Betrieb von Hand, und zwar dreißig Tage nach dem Ende des Tests. Vorher können Sie uns jederzeit sagen, dass er sofort weg soll. Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO für die Einrichtung selbst und Art. 6 Abs. 1 lit. f DSGVO für die Hinweis-Mail — unser berechtigtes Interesse daran, einen beginnenden Test zu bemerken und ansprechbar zu sein.',
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
          'An dieser Stelle stand bis zum 13. November 2026, die Kennung werde an keinen Server übertragen und es würden keine Benachrichtigungen versendet — mit dem Zusatz, dass eine Änderung vorher hier stehen würde. Das ist hiermit geschehen: Gleicht Ihr Betrieb über einen Server ab, meldet Ihr Gerät diese Kennung dorthin, zusammen mit Ihrer Mitarbeiterkennung und der Angabe, ob es ein Android-Gerät oder ein iPhone ist.',
          'Verschickt werden damit vier Arten von Mitteilungen: der Alarm einer Alleinarbeit und dessen Entwarnung an Kollegen und Angehörige der betroffenen Person, neue Nachrichten an deren Empfänger, und die Antwort eines Kunden auf einen mitgeteilten Termin an die Person, die ihn mitgeteilt hat, und an die Zuständigen. In der Mitteilung stehen der Name der absendenden oder betroffenen Person und ein kurzer Text; bei einer Nachricht sind das bis zu 140 Zeichen des Geschriebenen, bei einer Terminantwort der Titel des Termins und bis zu 120 Zeichen dessen, was der Kunde dazugeschrieben hat.',
          'Den Weg dorthin nimmt die Mitteilung über Expo und von dort über den Mitteilungsdienst von Google, auf dem iPhone später über den von Apple. Daraus folgt etwas, das Sie wissen sollten: Diese Unternehmen können den Inhalt einer Mitteilung sehen, und Expo sitzt in den Vereinigten Staaten. Behandeln Sie eine Push-Mitteilung deshalb nicht als vertraulich. Der Nachrichtentext selbst liegt weiterhin nur auf dem Server Ihres Betriebs; was hinausgeht, ist der Auszug in der Mitteilung.',
          'Für diese Übermittlung in die Vereinigten Staaten gibt es zwei Grundlagen, und wir haben beide am 14. November 2026 nachgesehen. Das Unternehmen hinter Expo, 650 Industries, Inc., ist in der amtlichen Liste zum EU-U.S. Data Privacy Framework geführt — damit greift der Angemessenheitsbeschluss der Kommission nach Art. 45 DSGVO. Und die Nutzungsbedingungen von Expo verpflichten sich in Abschnitt 3.2 auf Modul zwei der Standardvertragsklauseln (C/2021/3972) für die Rolle als Auftragsverarbeiter. Zur Ehrlichkeit gehört: Der Eintrag im Framework stand bei unserer Prüfung auf „Active – Re-certification under Review“ und beruht auf einer Selbstbewertung, nicht auf einer fremden Prüfung.',
          'Wollen Sie das nicht, schalten Sie Benachrichtigungen ab — dann meldet Ihr Gerät keine Kennung und bekommt keine Mitteilungen. Die Nachrichten und Alarme selbst sehen Sie weiterhin, sobald Sie die App öffnen.',
          'Schalten Sie Benachrichtigungen nicht ein, geschieht nichts davon: keine Abfrage, keine Kennung, keine Verbindung zu Expo.',
        ],
      }),

      ds.betroffenenrechte,
    ],
  },
};
