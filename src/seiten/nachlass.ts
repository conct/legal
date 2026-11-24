import * as ds from '../datenschutz.js';
import type { Preset } from '../presets.js';

/**
 * Nachlass (space.feif.nachlass) — ein Spiel an echten Orten: Ein Sonnensturm
 * hat das Handy verändert, Verstorbene rufen an, aber nur dort, wo ihre
 * letzten Daten entstanden sind. Nachfolger des Pip-Boy. Schlüssel nach der
 * Paket-ID, wie bei den übrigen Apps.
 *
 * Bis zum 24.11.2026 hatte die App kein Preset, und das stand im README des
 * Projekts selbst als offener Punkt: "Impressum und Datenschutz sind ein
 * Entwurf (npm run legal), bis es in conct/legal ein Preset für Nachlass
 * gibt." Der Entwurf aus der Vorlage nannte nur die App-Updates — eine App
 * mit Standort, Mikrofon und Kamera beschreibt er nicht.
 *
 * Jeder Absatz unten ist am Code nachgesehen (Repo nachlass, Stand
 * 24.11.2026, Prototyp 0.1.0):
 *
 *   app.json                      expo-camera (nur Selbstansicht, recordAudioAndroid
 *                                 false), expo-location (WhenInUse), expo-speech-
 *                                 recognition mit androidSpeechServicePackages
 *                                 (com.google.android.googlequicksearchbox),
 *                                 expo-secure-store, expo-updates
 *   src/features/standort.tsx     ein GPS-Abo fuer die ganze App, Vergleich der
 *                                 Entfernung auf dem Geraet (logic/geo), Radien
 *                                 35/30/150 m, Simulation statt echtem Ort moeglich
 *   src/features/zuhoeren.ts      Erkennung auf dem Geraet, wo das Handy es kann
 *                                 (supportsOnDeviceRecognition), Audio wird nicht
 *                                 gespeichert
 *   src/features/stimme.ts        Sprachausgabe des Handys (expo-speech)
 *   src/app/anruf.tsx             Videoanruf mit Selbstansicht
 *   src/state/spiel               Spielstand und die beiden selbst gesetzten Orte
 *
 * Nicht gefunden und darum nicht beschrieben: kein fetch, keine URL, kein
 * Server, keine Karte, keine Hintergrundortung, kein Konto, keine Werbung,
 * keine Analyse. Das README sagt dasselbe ("kein Server, keine
 * Hintergrund-Ortung: Die App muss offen sein, damit sie klingelt").
 *
 * `geprueft` bleibt false: Der Text steht gegen den Code, aber abgenommen hat
 * ihn niemand, und der Prototyp wird sich noch aendern — die Stimmen sollen
 * spaeter aus Aufnahmen kommen statt aus der Sprachausgabe.
 *
 * Du-Form, weil das Spiel duzt.
 */
export const PRESETS_NACHLASS: Record<'nachlass.feif.space', Preset> = {
  'nachlass.feif.space': {
    tone: 'persoenlich',
    geprueft: false,
    module: [
      ds.verantwortlicher,
      ds.keinDatenschutzbeauftragter,
      ds.freitext({
        titel: 'Kurz gesagt',
        absaetze: [
          'Nachlass ist ein Spiel. Es gibt kein Nutzerkonto, keine Werbung und keine Analyse-, Tracking- oder Absturzmelde-Dienste. Wir betreiben dafür keinen Server: Dein Spielstand, deine Orte und alles, was du sagst, bleiben auf deinem Handy.',
          'Drei Berechtigungen braucht das Spiel — Standort, Mikrofon und Kamera —, und jede erteilst du selbst. Was damit geschieht, steht in den nächsten Abschnitten. Nach draußen geht von uns aus nur die Frage, ob es eine neue Fassung der App gibt.',
        ],
      }),
      ds.freitext({
        titel: 'Dein Standort',
        absaetze: [
          'Die Bruchstücke melden sich nur an ihrem Ort. Deshalb fragt Nachlass deinen Standort ab, solange die App geöffnet ist — im Hintergrund nicht, die App muss offen sein, damit sie klingelt.',
          'Verglichen wird auf dem Gerät: Das Spiel rechnet die Entfernung zwischen deiner Position und den Orten, die du unter „Einrichten“ selbst festgelegt hast, und reagiert ab etwa 150, 35 und 30 Metern. Deine Position wird nicht gespeichert, nicht übertragen und auf keiner Karte nachgeschlagen — es gibt in der App keine Karte und keinen Kartendienst.',
          'Die beiden Orte, die du festlegst, liegen als Koordinaten im Speicher der App auf deinem Gerät. Zum Ausprobieren kannst du eine Simulation einschalten, die so tut, als stündest du dort; dann wird dein echter Standort gar nicht gebraucht.',
          'Die Berechtigung dafür erteilst du selbst (Art. 6 Abs. 1 lit. a DSGVO) und kannst sie in den Einstellungen deines Handys jederzeit zurücknehmen. Ohne sie läuft das Spiel mit der Simulation weiter.',
        ],
      }),
      ds.freitext({
        titel: 'Sprechen und Zuhören',
        absaetze: [
          'Du kannst mit den Bruchstücken sprechen, statt Antworten anzutippen. Dafür hört das Mikrofon zu, solange du an der Reihe bist. Aufgezeichnet wird dabei nichts: Weder die Aufnahme noch der erkannte Satz werden gespeichert, und zu uns geht beides nie.',
          'Erkannt wird auf deinem Gerät, wo dein Handy das kann. Kann es das nicht, übernimmt der Spracherkennungsdienst deines Handys — auf Android der von Google, auf dem iPhone der von Apple —, und das Gesprochene wird dort verarbeitet. Das ist derselbe Dienst, den auch die Tastatur und die Sprachsuche deines Handys nutzen; was damit geschieht, steht in der Datenschutzerklärung des Herstellers. Wer das nicht möchte, spielt mit den antippbaren Antworten weiter — alles bleibt dann auf dem Gerät.',
          'Die Stimmen der Bruchstücke kommen aus der Sprachausgabe deines Handys.',
          'Die Berechtigung für das Mikrofon erteilst du selbst (Art. 6 Abs. 1 lit. a DSGVO) und nimmst sie in den Einstellungen deines Handys jederzeit zurück.',
        ],
      }),
      ds.freitext({
        titel: 'Die Kamera im Videoanruf',
        absaetze: [
          'Im Videoanruf siehst du dich selbst, und über dein Bild schiebt sich die Gestalt, mit der du sprichst. Das Kamerabild bleibt auf deinem Handy: Es wird nicht aufgezeichnet, nicht gespeichert und nicht übertragen. Es gibt niemanden am anderen Ende der Leitung — der Anruf ist das Spiel.',
          'Auch die Kamera gibst du selbst frei (Art. 6 Abs. 1 lit. a DSGVO) und kannst die Freigabe in den Einstellungen deines Handys jederzeit zurücknehmen; der Videoanruf läuft dann ohne dein Bild.',
        ],
      }),
      ds.freitext({
        titel: 'Speicher auf dem Gerät',
        absaetze: [
          'Nachlass speichert auf deinem Gerät nur, was das Spiel braucht: wie weit du bist, die beiden Orte, die du festgelegt hast, den Stand der Überlagerung und ob die Simulation eingeschaltet ist. Gelöscht ist das mit „App-Daten löschen“ in den Einstellungen deines Handys oder indem du die App deinstallierst.',
          'Für diesen Speicher ist keine Einwilligung erforderlich, weil er für die von dir gewünschten Funktionen unbedingt nötig ist (§ 25 Abs. 2 Nr. 2 TDDDG).',
        ],
      }),
      ds.appUpdates({ zweck: 'Fehler schnell beheben zu können' }),
      ds.drittland,
      ds.einwilligungWiderruf,
      ds.betroffenenrechte,
      ds.aktualitaet,
    ],
  },
};
