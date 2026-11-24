import * as ds from '../datenschutz.js';
import type { Preset } from '../presets.js';

/**
 * Postwächter (space.feif.postwaechter) — ein Mailprogramm für Anfänger, das
 * jede Nachricht auf dem Gerät auf Betrug prüft. Schlüssel nach der Paket-ID,
 * wie bei Klarschiff, Sektorix, Farbecho und Montix.
 *
 * Bis zum 24.11.2026 hatte die App kein Preset: `npm run legal` erzeugte dort
 * einen Entwurf aus den Standardbausteinen der Vorlage (expo.extra.legal.site
 * stand auf null). Der Entwurf beschrieb die App nicht — er beschrieb eine
 * App, die nichts tut als sich zu aktualisieren. Für ein Mailprogramm, das
 * Zugangsdaten hält und fremde Nachrichten öffnet, ist das zu wenig.
 *
 * Jeder Absatz unten ist am Code nachgesehen (Repo Mailclient, Stand
 * 24.11.2026, c2739d7):
 *
 *   app.json                      plugins (secure-store, updates, sharing), keine
 *                                 Push-, Kamera- oder Standortrechte
 *   src/features/mail/konto.ts    Serverdaten im Klartext, Passwort im Keystore
 *                                 bzw. der Keychain; Anbieterliste mit Hinweisen
 *   src/features/mail/imap.ts     IMAP4rev1 direkt zum Anbieter, eigenes
 *   src/features/mail/smtp.ts     Socket-Modul (modules/mail-socket), TLS
 *   src/features/mail/postfach.ts Speicherschluessel: Ordner, Liste des Eingangs,
 *                                 bis 3000 Bewertungen, bekannte Absender
 *   src/features/schutz/*         Pruefung vollstaendig auf dem Geraet:
 *                                 Domainaehnlichkeit (Levenshtein, Verwechslungs-
 *                                 zeichen), Markenliste in der App, Anhaenge nach
 *                                 Name und Typ, Links, Text
 *   src/app/mail.tsx              HTML-Mail in einer WebView: Bilder blockiert,
 *                                 javaScriptEnabled false, originWhitelist nur
 *                                 about:/data:, jeder Link abgefangen; Anhang in
 *                                 den Cache und ins Teilen-Menue des Systems
 *   src/features/mail/link-pruefung.tsx  Link erst zeigen, dann openBrowserAsync
 *
 * Nicht gefunden und darum nicht beschrieben: kein fetch, keine URL, kein
 * Server von uns, keine Analyse, keine Werbung, kein Konto bei uns. Die
 * einzige Verbindung nach draussen, die nicht der Nutzer selbst eintraegt, ist
 * die Update-Pruefung von Expo.
 *
 * `geprueft` bleibt false: Der Text steht gegen den Code, aber der Betreiber
 * hat ihn nicht abgenommen, und die App ist noch nicht veroeffentlicht. Die
 * Flagge sagt nicht "gut geschrieben", sie sagt "abgenommen".
 *
 * Sie-Form, weil die App selbst siezt ("Damit der Absender nicht erfährt, dass
 * Sie die Mail geöffnet haben").
 */
export const PRESETS_POSTWAECHTER: Record<'postwaechter.feif.space', Preset> = {
  'postwaechter.feif.space': {
    tone: 'formell',
    geprueft: false,
    module: [
      ds.verantwortlicher,
      ds.keinDatenschutzbeauftragter,
      ds.freitext({
        titel: 'Kurz gesagt',
        absaetze: [
          'Postwächter ist ein Mailprogramm. Es gibt kein Nutzerkonto bei uns, keine Werbung und keine Analyse-, Tracking- oder Absturzmelde-Dienste. Wir betreiben für diese App keinen Server: Ihre Nachrichten laufen nicht über uns, und wir sehen weder Ihr Postfach noch Ihre Zugangsdaten.',
          'Die App spricht direkt mit dem Mailanbieter, den Sie selbst eintragen — so wie ein Mailprogramm auf dem Rechner. Alles Übrige geschieht auf Ihrem Gerät.',
        ],
      }),
      ds.freitext({
        titel: 'Ihr Postfach',
        absaetze: [
          'Beim Einrichten tragen Sie Ihre E-Mail-Adresse, den Benutzernamen, das Passwort und die Server Ihres Anbieters ein; für die verbreiteten Anbieter bringt die App diese Serverdaten schon mit. Die App verbindet sich damit über IMAP und SMTP unmittelbar mit diesem Anbieter und holt Ordner, Nachrichten und Anhänge von dort.',
          'Die Verbindung ist immer verschlüsselt: auf den Ports 993 und 465 von Anfang an, sonst über STARTTLS. Bietet ein Server das nicht an, bricht die App ab — unverschlüsselt verbindet sie sich nicht. Das Passwort liegt im Android Keystore bzw. in der iOS Keychain und verlässt Ihr Gerät nur in dieser Verbindung zu Ihrem eigenen Mailserver. Die übrigen Kontoangaben — Adresse, Benutzername, Serveradressen und Ports — liegen im gewöhnlichen Speicher der App.',
          'Für die Verarbeitung in Ihrem Postfach ist Ihr Mailanbieter verantwortlich, nicht wir. Was er speichert und wie lange, steht in seiner Datenschutzerklärung. Wir sind dabei nicht sein Auftragsverarbeiter und auch nicht Ihrer: Wir sind nur das Programm, mit dem Sie ihn erreichen.',
        ],
      }),
      ds.freitext({
        titel: 'Die Prüfung läuft auf Ihrem Gerät',
        absaetze: [
          'Postwächter bewertet jede Nachricht: zuerst nur anhand der Kopfzeilen, danach mit Text, Links und Anhängen. Geprüft wird, ob die Absenderdomain einer bekannten Marke zum Verwechseln ähnlich sieht (Tippfehler, Ziffern statt Buchstaben, fremde Schriftzeichen), ob der angezeigte Linktext zum wirklichen Ziel passt und ob ein Anhang nach einer gefährlichen oder getarnten Datei aussieht — beurteilt nach Name, Typ und Größe, nicht nach Inhalt.',
          'Das geschieht ausschließlich auf Ihrem Gerät. Die Liste der Marken steckt in der App; es wird dafür nichts nachgeladen und nichts gemeldet. Weder wir noch Dritte erfahren, von wem Sie Post bekommen oder wie die App sie bewertet hat.',
          'Als bekannte Absender gelten Adressen, denen Sie selbst geschrieben haben, und solche, die Sie ausdrücklich als vertrauenswürdig markieren.',
        ],
      }),
      ds.freitext({
        titel: 'HTML-Nachrichten, Links und Anhänge',
        absaetze: [
          'Bilder in einer HTML-Nachricht bleiben blockiert, damit der Absender nicht erfährt, dass Sie die Nachricht geöffnet haben. Nachladen können Sie sie mit einem Tippen — dann fragt Ihr Gerät die Adresse ab, die in der Nachricht steht, und der Betreiber dieser Adresse sieht Ihre IP-Adresse. Bei auffälligen Nachrichten bietet die App das nicht an.',
          'Die Nachricht wird ohne JavaScript dargestellt, und kein Link öffnet sich von selbst: Tippen Sie einen an, zeigt die App zuerst das wirkliche Ziel samt Bewertung. Erst danach öffnet sie ihn im Browser Ihres Geräts.',
          'Einen Anhang legt die App zum Öffnen in ihren Zwischenspeicher und übergibt ihn dem Teilen-Dialog des Systems; welche App ihn danach bekommt, entscheiden Sie dort. Was Sie dort weitergeben, verlässt den Bereich von Postwächter.',
        ],
      }),
      ds.freitext({
        titel: 'Speicher auf dem Gerät',
        absaetze: [
          'Auf Ihrem Gerät liegen: die Kontoangaben (Passwort im Keystore bzw. der Keychain), die Liste Ihrer Ordner, die zuletzt geladenen Nachrichten des Eingangs, bis zu 3000 Bewertungen und die Liste der bekannten Absender. Nachrichten holt die App bei Bedarf neu vom Anbieter; gelöscht wird dieser Speicher mit „App-Daten löschen“ in den Einstellungen Ihres Geräts oder indem Sie die App deinstallieren.',
          'Für diesen Speicher ist keine Einwilligung erforderlich, weil er für die von Ihnen gewünschten Funktionen unbedingt nötig ist (§ 25 Abs. 2 Nr. 2 TDDDG).',
        ],
      }),
      ds.appUpdates({ zweck: 'Fehler und Lücken schnell schließen zu können' }),
      ds.drittland,
      ds.betroffenenrechte,
      ds.aktualitaet,
    ],
  },
};
