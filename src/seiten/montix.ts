import * as ds from '../datenschutz.js';
import type { Preset } from '../presets.js';

/**
 * Montix (de.conct.montix) — die App für Handwerker und Dienstleister, die
 * beim Kunden arbeiten. Seiten unter feif.space/apps-software/montix/,
 * deshalb der Schlüssel `montix.feif.space` wie bei Farbecho und Klarschiff.
 *
 * Quelle ist nicht ein vorhandener Rechtstext — es gibt keinen. Jeder Absatz
 * unten ist am Code nachgesehen (Repo conct/Kilpro, Stand 13.11.2026,
 * ff66f73 und app.json nach der Umbenennung):
 *
 *   app.json            plugins, android.permissions, updates.url
 *   src/features/…      license, payment, push, signature, home, customers
 *   src/plan/use-plan   AsyncStorage-Schlüssel des Planeditors
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
          'Pläne mit allen Elementen, ein als Vorlage hinterlegtes Foto oder Planbild, die selbst angelegte Symbolbibliothek, Unterschriften samt Name, Zweck und Zeitpunkt, Kundendaten, Artikel, Termine, die Zusammenstellung Ihrer Startseite, die Kalibrierung der Wasserwaage, die gewählten Firmenfarben sowie Hell- oder Dunkeldarstellung.',
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

      ds.freitext({
        titel: 'Benachrichtigungen',
        absaetze: [
          'Die App ist technisch darauf vorbereitet, Benachrichtigungen anzuzeigen, verschickt derzeit aber keine. Solange das so ist, wird auch keine Gerätekennung dafür abgerufen oder übertragen. Kommen Benachrichtigungen hinzu, steht es vorher an dieser Stelle.',
        ],
      }),

      ds.betroffenenrechte,
    ],
  },
};
