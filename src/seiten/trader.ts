import * as ds from '../datenschutz.js';
import type { Modul } from '../datenschutz.js';
import type { ImpressumOptions } from '../impressum.js';
import type { Preset } from '../presets.js';
import { SITES } from '../sites.js';
import { type Section, link, mail, p, txt } from '../types.js';
/**
 * Vorschlag: Trader / Prüfstand (walkforward.conct.de) an @conct/legal hängen.
 *
 * Zwei Teile zum Einfügen:
 *   - TRADER_SITE   → als Eintrag 'walkforward.conct.de' in SITES (src/sites.ts)
 *   - TRADER_PRESET → als Eintrag 'walkforward.conct.de' in PRESETS (src/presets.ts)
 *
 * Quelle: das Objekt TEXTE im Seitenskript von Trader/.pruefstand/index.html,
 * Schlüssel de["impressum-inhalt"] und de["datenschutz-inhalt"] (Stand
 * Datenschutz 15.09.2026). Die englische Fassung TEXTE.en ist eine von Hand
 * gepflegte Parallelübersetzung derselben Abschnitte; @conct/legal rendert nur
 * Deutsch.
 *
 * AGB, Widerrufsbelehrung und das Kündigungsformular (§ 312k BGB) gehören
 * NICHT hierher - sie bleiben in Trader.
 *
 * Setzt den Stand von Zentrale/legal nach 1.5.0 voraus: `Preset.impressum`,
 * `ImpressumOptions.wortlaut` und `ds.freitext` mit Listen und Blöcken.
 */

// ---------------------------------------------------------------------------
// SITES
// ---------------------------------------------------------------------------


// ---------------------------------------------------------------------------
// Impressum-Zusaetze
// ---------------------------------------------------------------------------

/* Drei Abschnitte, die das Paket-Impressum nicht kennt. Sie landen
   ueber `zusatz` vor "Verbraucherstreitbeilegung" - "Vertragliches" steht
   damit an derselben Stelle wie auf der Seite, "Urheberrecht" und "Keine
   Anlageberatung" ruecken vor die Haftungsabschnitte. Die Ich-Form der Seite
   bleibt in diesen Absaetzen stehen; der Rest des Impressums spricht als
   "wir". */
const vertragliches: Section = {
  title: 'Vertragliches',
  blocks: [
    p(
      txt('Es gelten unsere '),
      link('Allgemeinen Geschäftsbedingungen', '#agb'),
      txt('. Ein bestehendes Abonnement beendest du über die Schaltfläche '),
      link('„Verträge hier kündigen“', '#kuendigung'),
      txt('; das Widerrufsrecht steht in der '),
      link('Widerrufsbelehrung', '#widerruf'),
      txt('.'),
    ),
  ],
};

const urheberrecht: Section = {
  title: 'Urheberrecht',
  blocks: [
    p(
      txt(
        'Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen des ' +
          'Urheberrechts bedürfen meiner schriftlichen Zustimmung. Von Nutzern eingereichte Strategien bleiben ' +
          'deren Werk; die Rechte daran regelt ',
      ),
      link('§ 7 der AGB', '#agb'),
      txt('.'),
    ),
  ],
};

const keineAnlageberatung: Section = {
  title: 'Keine Anlageberatung',
  blocks: [
    p(
      txt(
        'Die Prüfergebnisse beruhen auf historischen Kursdaten und sind eine technische Auswertung, keine ' +
          'Anlageberatung und keine Empfehlung zum Kauf oder Verkauf von Finanzinstrumenten. Vergangene ' +
          'Ergebnisse lassen keinen verlässlichen Schluss auf künftige zu. Für Entscheidungen, die auf ' +
          'Grundlage dieser Auswertungen getroffen werden, wird keine Haftung übernommen.',
      ),
    ),
  ],
};

// ---------------------------------------------------------------------------
// PRESETS
// ---------------------------------------------------------------------------

/* Abschnittsweise aus TEXTE.de["datenschutz-inhalt"] (Fassung 15.09.2026)
   uebernommen. Bausteine nur, wo sie dasselbe sagen; der Rest woertlich als
   freitext, in der Du-Form der Seite. Die Liste in "Was ohne Konto passiert"
   ist wieder eine Liste, aber eine ungeordnete: Block kennt nur `ul`, die
   Seite hatte `ol`. Fett, Kursiv und <code> gibt es als Inline nicht - der
   Text bleibt, die Auszeichnung entfaellt; jeder Listenpunkt beginnt mit
   seiner bisherigen Fettzeile.

   Geaendert gegenueber dem Original sind nur die Querverweise: Die Seite
   schrieb "Abschnitt 5" und "Abschnitt 6". Mit dem eigenen Abschnitt fuer
   den Datenschutz-Ansprechpartner verschiebt sich die Zaehlung um eins, und
   jede weitere Aenderung an der Modulliste verschoebe sie wieder. Deshalb
   verweisen die Absaetze jetzt mit dem Titel statt mit der Nummer.

   NICHT uebernommen, weil es Arbeitsnotizen sind und kein Erklaerungstext -
   sie gehoeren in die Seite neben den Block oder in `geprueft`:
   - der Vorspann "Entwurf. Diese Erklärung beschreibt, was die Seite
     tatsächlich tut. Sobald Hosting, Zahlungsanbieter und Mailversand
     feststehen, müssen die entsprechenden Abschnitte um Namen, Sitz und
     Vertragsgrundlage ergänzt werden. Vor dem Start juristisch prüfen
     lassen." (Hosting und Mailversand sind inzwischen benannt.)
   - im Verantwortlichen: "Vor dem Start prüfen — bei mehr als 20 ständig
     mit Datenverarbeitung befassten Personen ändert sich das."

   NEU gegenueber dem Live-Text ist genau ein Abschnitt: "Kündigung über
   die Schaltfläche" - am Quelltext von Trader geschrieben (pruefstand/
   endpunkt.py, quittung.py), siehe dort.

   OFFEN: Stripe/PayPal stehen im Text, sind im Code aber noch nicht
   angebunden. */
export const PRESETS_TRADER: Record<'walkforward.conct.de', Preset> = { 'walkforward.conct.de': {
  tone: 'persoenlich',
  // Bleibt false: Die Seite vermerkt selbst "Vor dem Start juristisch prüfen
  // lassen", und der Umzug hierher prueft nichts.
  geprueft: false,
  module: [
    // Die Seite: "Verantwortlich im Sinne von Art. 4 Nr. 7 DSGVO ist:" und die
    // Anschrift in einer Zeile mit E-Mail. Der Baustein nennt dasselbe in
    // Zeilen, dazu Land und Telefon - nur ohne die Artikelangabe.
    ds.verantwortlicher,
    // Die Seite: "Ein Datenschutzbeauftragter ist nicht bestellt; die
    // Voraussetzungen des § 38 BDSG liegen nicht vor." Der Baustein sagt
    // dasselbe, nennt Art. 37 DSGVO mit und den Ansprechpartner - als eigener
    // Abschnitt statt als zweiter Absatz unter "Verantwortlicher".
    ds.keinDatenschutzbeauftragter,
    /* Nicht hostingMit: Die Seite zaehlt andere Felder auf (Verweisseite,
       Browserkennung, keine Datenmenge, kein Betriebssystem), erklaert das
       Kontingent und das IP-Kuerzel und nennt zwei Zwecke mehr. Gekuerzte
       Adresse und sieben Tage stimmen mit dem Baustein ueberein. */
    ds.freitext({
      titel: 'Was ohne Konto passiert',
      absaetze: [
        'Du kannst Strategien prüfen, ohne dich anzumelden und ohne eine E-Mail-Adresse anzugeben. Dabei fallen an:',
        [
          'Server-Protokolle. Bei jedem Aufruf speichert der Server Zeitpunkt, aufgerufene Adresse, Verweisseite, Browserkennung und deine IP-Adresse — diese allerdings gekürzt: von einer IPv4-Adresse werden nur die ersten 16 Bit protokolliert, von einer IPv6-Adresse die ersten 32 Bit, der Rest wird auf Null gesetzt. Aus 82.98.87.93 wird also 82.98.0.0. Das übernimmt unser Hoster so, wir schalten es nicht ab. Zweck ist der Betrieb, die Abwehr von Missbrauch und die Einhaltung des Tageskontingents. Das Kontingent wird an zwei Stellen gezählt: in deinem Browser, damit du den Stand siehst, und auf dem Server, damit das Leeren des Browserspeichers es nicht zurücksetzt. Auf dem Server steht dafür nicht deine IP-Adresse, sondern ein Kürzel, das aus ihr mit einem Schlüssel berechnet wird. Der Schlüssel liegt nur im Arbeitsspeicher und entsteht bei jedem Neustart neu; ohne ihn lässt sich das Kürzel nicht auf deine Adresse zurückführen. Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO — unser berechtigtes Interesse an einem funktionierenden, nicht überlasteten Dienst. Die Protokolle werden täglich rotiert und nach sieben Tagen gelöscht.',
          'Die ungekürzte IP-Adresse — aber nur im Arbeitsspeicher. Für das Stundenlimit muss der Server unterscheiden können, ob zwei Anfragen von derselben Verbindung kommen. Die vollständige Adresse liegt dafür bis zu eine Stunde im Arbeitsspeicher und wird nirgends auf die Festplatte geschrieben. Nach Ablauf des Zeitfensters ist sie weg, spätestens beim nächsten Neustart.',
          'Die eingereichte Strategie. Indikatoren, Regeln, Marktauswahl und Kerzenlänge werden gespeichert, damit das Ergebnis unter seiner festen Adresse abrufbar bleibt und im Register erscheinen kann. Gespeichert bleibt sie, solange der Registereintrag besteht; eine noch nicht geprüfte Einreichung löschen wir auf Verlangen sofort.',
          'Drei Einträge im Speicher deines Browsers. Die gewählte Sprache, der Zähler der heute verbrauchten Prüfungen und deine Kennung fürs Register. Sprache und Zähler verlassen deinen Rechner nie. Die Kennung wird nur dann übertragen, wenn du eine Strategie einreichst — sie steht dann im Register.',
        ],
      ],
    }),
    /* Weder keineCookies (es gibt ein Cookie) noch technischeCookies (die
       Seite nennt Name, Laufzeit, die drei Speichereintraege und begruendet
       jeden einzeln). */
    ds.freitext({
      titel: 'Warum es keinen Zustimmungsbanner gibt',
      absaetze: [
        'Diese Seite setzt keine Cookies zu Werbe-, Analyse- oder Wiedererkennungszwecken und bindet keine fremden Dienste ein. Die drei Einträge im Browserspeicher sind für den ausdrücklich gewünschten Dienst unbedingt erforderlich im Sinne von § 25 Abs. 2 Nr. 2 TDDDG: ohne den Zähler ließe sich das kostenlose Kontingent nicht begrenzen, ohne die Kennung wäre keine Einreichung einer früheren zuzuordnen, und ohne die Sprachwahl stünde die Seite bei jedem Aufruf wieder in der falschen Sprache. Eine Einwilligung ist dafür nicht erforderlich — und wird deshalb auch nicht erfragt.',
        'Wer sich anmeldet, bekommt genau ein Cookie: pruefstand_sitzung. Es hält die Anmeldung fest, gilt 30 Tage und wird beim Abmelden gelöscht. Es enthält einen zufälligen Schlüssel, keine Adresse, und ist für Skripte nicht lesbar. Auch dieses Cookie ist unbedingt erforderlich im Sinne von § 25 Abs. 2 Nr. 2 TDDDG: ohne es müsstest du dich bei jedem Aufruf neu anmelden.',
        'Diese Einordnung ist vor dem Start anwaltlich zu bestätigen. Sobald Statistik, Werbung oder eingebettete Dienste hinzukommen, ändert sie sich, und dann braucht es eine echte Einwilligungslösung.',
      ],
    }),
    ds.freitext({
      titel: 'E-Mail-Adresse für die Vorwärtsprüfung',
      absaetze: [
        'Wenn du eine Adresse hinterlässt, speichern wir sie, um dich zu benachrichtigen, sobald das Vorwärts-Urteil zu deiner Einreichung vorliegt — einmal je Einreichung, auf der Werkbank stattdessen wöchentlich, solange das Abonnement läuft. Dieselbe Adresse dient der Anmeldung, weil es kein Passwort gibt. Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO, da die Benachrichtigung die von dir angeforderte Leistung ist. Die Adresse wird nicht für Werbung verwendet und nicht weitergegeben. Jede Nachricht enthält einen Abmeldelink; nach Abmeldung oder nach Zustellung des letzten ausstehenden Urteils wird die Adresse gelöscht, spätestens nach 24 Monaten ohne Aktivität.',
        // Original: "gilt stattdessen Abschnitt 5:"
        'Hast du mit derselben Adresse ein Konto (Stufe 2 oder 3), gilt stattdessen der Abschnitt „Konto und Bezahlstufe“: sie bleibt, solange das Konto besteht. Sonst würde dir dieser Abschnitt eine Löschung versprechen, die dein eigenes Konto verhindert.',
      ],
    }),
    /* Nicht nutzerkonto(): Der Baustein verspricht "Dein Konto kannst du
       jederzeit löschen" - davon steht hier nichts, dafuer Anmeldelink,
       Sitzungen, Pruefsummen und die Bezahlung. storeKauf passt nicht: Stripe
       im Web, kein App-Store. */
    ds.freitext({
      titel: 'Konto und Bezahlstufe',
      absaetze: [
        'Für die Stufen mit Anmeldung speichern wir deine E-Mail-Adresse, den Zeitpunkt der ersten Anmeldung, die Zeitpunkte deiner letzten zehn Anmeldungen und deine Einreichungen (Art. 6 Abs. 1 lit. b DSGVO). Ein Passwort gibt es nicht; die Anmeldung erfolgt über einen Link per E-Mail. Der Link gilt 15 Minuten und nur einmal. Von ihm und von deinen Sitzungen (höchstens fünf, je 30 Tage) speichern wir nur Prüfsummen, nicht die Schlüssel selbst.',
        'Wer einen Link anfordert, ihn aber nie benutzt, bekommt kein Konto: die Adresse wird nach Ablauf des Links gelöscht. Für Angemeldete zählt das Tageskontingent je Konto; auf dem Server steht dafür eine Prüfsumme der Adresse, nicht die Adresse selbst.',
        'Für die kostenpflichtige Stufe verarbeitet Stripe (Stripe Payments Europe, Limited, Irland) die Zahlungsdaten in eigener Verantwortung. Kartennummern oder Kontodaten erreichen uns nicht. Wir erhalten nur die Information, ob eine Zahlung erfolgreich war.',
        'Zahlst du per PayPal, läuft das ebenfalls über Stripe — PayPal ist dort eine Zahlungsart, kein zweiter Vertragspartner von uns. Deine Zahlung sieht PayPal trotzdem, denn sie wird über dein PayPal-Konto abgewickelt.',
        'Rechnungsdaten bewahren wir nach § 147 AO und § 257 HGB zehn Jahre auf; diese Aufbewahrung geht einem Löschverlangen vor.',
      ],
    }),
    /* NEU - steht nicht im Live-Text. Gehoert hinein: Das Formular erhebt
       personenbezogene Daten (Art. 13 DSGVO verlangt die Auskunft), und es ist
       ohne Anmeldung erreichbar, gilt also auch fuer Leser ohne Konto.
       Belegt am Quelltext vom 06.11.2026: pruefstand/quittung.py
       (Kuendigung, quittungstext, sende_quittung), pruefstand/endpunkt.py
       (verarbeite, Stundenlimit je IP). Die Formulardaten werden nirgends
       abgelegt; das Journal vermerkt "Quittung an <adresse> versendet,
       Vertragsende <datum>". Wie lange das Journal auf leda aufbewahrt wird,
       ist nicht nachgemessen - deshalb die eckige Klammer im dritten Absatz,
       die vor dem Livegang durch eine Zahl zu ersetzen ist. */
    ds.freitext({
      titel: 'Kündigung über die Schaltfläche',
      absaetze: [
        'Kündigst du über die Schaltfläche „Verträge hier kündigen“, verarbeiten wir, was du im Formular angibst:',
        [
          'Name und E-Mail-Adresse,',
          'den Vertrag, die Art der Kündigung und das gewünschte Vertragsende,',
          'freiwillig deine Anschrift, die Vertragsnummer und einen Grund.',
        ],
        'Der Server ergänzt den Zeitpunkt des Eingangs. Daraus entsteht die Bestätigung, die § 312k Abs. 2 BGB verlangt: Sie nennt den Inhalt der Kündigung, den Eingang und das Vertragsende, geht ausschließlich an die angegebene Adresse und wird dir zusätzlich sofort auf der Seite angezeigt. Versendet wird sie über den Mailversand bei Uberspace (siehe „Empfänger“). Rechtsgrundlage ist Art. 6 Abs. 1 lit. c DSGVO in Verbindung mit § 312k Abs. 2 BGB, für die Beendigung des Vertrags Art. 6 Abs. 1 lit. b DSGVO.',
        'Das Formular selbst speichern wir nicht. Im Betriebsprotokoll des Dienstes steht nur, dass eine Bestätigung versendet wurde und wann der Vertrag endet — ohne deine Adresse.',
        'Damit das Formular nicht zum Versand fremder Post missbraucht wird, gilt je Verbindung ein Stundenlimit. Dafür gilt, was unter „Was ohne Konto passiert“ zur ungekürzten IP-Adresse steht.',
      ],
    }),
    // Kern des Dienstes, gibt es nur hier.
    ds.freitext({
      titel: 'Das öffentliche Register',
      absaetze: [
        'Jede geprüfte Strategie erscheint mit Name der Strategie, Kennung, Versuchszähler und Urteil in einem öffentlich einsehbaren Register. Das ist keine Nebenwirkung, sondern der Kern des Dienstes: die sichtbare Misserfolgsquote ist das, was die Ergebnisse glaubwürdig macht. Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO.',
        'Voreingestellt ist eine zufällige Kennung, kein Name. Sie wird in deinem Browser erzeugt; wir bekommen einen Klarnamen gar nicht erst zu sehen, solange du keinen einträgst. Das ist die datenschutzfreundliche Voreinstellung nach Art. 25 Abs. 2 DSGVO: genannt wird nur, wer das ausdrücklich will.',
        'Die Kennung bleibt über deine Einreichungen hinweg dieselbe. Das ist nötig, weil der Versuchszähler sonst durch einen Namenswechsel zu umgehen wäre — und er ist die halbe Methode. Auf Verlangen ersetzen wir eine veröffentlichte Kennung durch eine neue zufällige. Das ändert, was im Register steht — nicht, was gezählt wird: deine Einreichungen bleiben einander zugeordnet und der Versuchszähler läuft weiter. Wäre es anders, wäre der Tausch genau das Schlupfloch, das der vorige Absatz schließt. Die Bewertung selbst bleibt ebenfalls stehen — ein Register, aus dem sich missratene Ergebnisse entfernen ließen, wäre wertlos.',
      ],
    }),
    /* Traegt Hoster, Auftragsverarbeitung UND Drittland. Deshalb fehlen
       ds.hosting, ds.auftragsverarbeitung und ds.drittland: drittland ohne
       drittdienste sagte "findet nicht statt" - bei der Bezahlstufe findet
       sie aber statt (USA, Indien). Dieselbe Begruendung wie bei
       fibel.uber.space. */
    ds.freitext({
      titel: 'Empfänger',
      absaetze: [
        // Original: "(siehe Abschnitt 5)"
        'Seite und Mailversand laufen bei Uberspace (Jonas Pasche, Kaiserstraße 15, 55116 Mainz); es besteht ein Vertrag zur Auftragsverarbeitung nach Art. 28 DSGVO. Solange du nichts bezahlst, ist das der einzige Dienstleister, der Daten von dir zu sehen bekommt; bei der Bezahlstufe kommt Stripe dazu (siehe „Konto und Bezahlstufe“).',
        'Weitere Empfänger gibt es nicht: keine Analysedienste, keine Werbenetzwerke, keine Karten. Auch die Schriftarten liefern wir vom eigenen Server aus und nicht über Google Fonts — sonst bekäme Google bei jedem Aufruf deine IP-Adresse zu sehen. Kursdaten holen wir von öffentlichen Börsenschnittstellen; dabei geht keine Angabe über dich hinaus.',
        'Drittländer: Solange du nichts bezahlst, verlassen deine Daten die EU nicht. Beim Bezahlen ist das anders: Stripe übermittelt Daten nach eigener Angabe in die USA und nach Indien, gestützt auf die EU-Standardvertragsklauseln und das EU-U.S. Data Privacy Framework. Das lässt sich nicht abwählen, ohne auf die Bezahlstufe zu verzichten — deshalb steht es hier und nicht im Kleingedruckten.',
      ],
    }),
    /* Sagt dasselbe wie die ersten beiden Absaetze der Seite: Rechte nach
       Art. 15-21 als Liste, Kontakt, Beschwerderecht. Unterschiede: Art. 21
       ohne die Einschraenkung "auf Grundlage berechtigter Interessen", kein
       "(Art. 77 DSGVO)", dafuer die Behoerde mit heutigem Namen und Anschrift
       statt "die Sächsische Datenschutzbeauftragte". */
    ds.betroffenenrechte,
    /* Der dritte Absatz unter "Deine Rechte". Eigener Abschnitt, weil der
       Baustein keinen Anhang kennt; der Titel ist neu, der Text woertlich bis
       auf den Querverweis (Original: "— siehe Abschnitt 6."). */
    ds.freitext({
      titel: 'Löschung von Registereinträgen',
      absaetze: [
        'Eine Einschränkung, damit sie nicht überrascht: Die Löschung eines bereits veröffentlichten Registereintrags können wir nicht zusagen — siehe „Das öffentliche Register“. Was wir auf Verlangen tun, ist die Kennung zu ersetzen, so dass der Eintrag dir nicht mehr zuzuordnen ist. Ob das im Einzelfall genügt, entscheidet die Aufsichtsbehörde, nicht wir.',
      ],
    }),
    // Die Seite: "Eine erteilte Einwilligung kannst du jederzeit mit Wirkung
    // für die Zukunft widerrufen." Der Baustein sagt dasselbe, mit Art. 7 Abs. 3.
    ds.einwilligungWiderruf,
    // Art. 22 DSGVO - gibt es nur hier, ein Baustein haette einen Aufrufer.
    ds.freitext({
      titel: 'Keine automatisierte Entscheidung im Rechtssinn',
      absaetze: [
        'Das Urteil über eine Strategie entsteht automatisch. Es entfaltet dir gegenüber weder rechtliche Wirkung noch beeinträchtigt es dich in ähnlicher Weise erheblich, da es ausschließlich eine eingereichte Rechenvorschrift bewertet und keine Aussage über deine Person trifft. Eine automatisierte Entscheidung im Einzelfall nach Art. 22 DSGVO liegt daher nicht vor.',
      ],
    }),
    /* Nicht ds.aktualitaet: Die Seite nennt die Fassung mit Datum, und aus
       genau diesem Datum liest Trader/.pruefstand/backen.mjs die Stand-Wache
       (erstes TT.MM.JJJJ im Text). Beim Umzug ist es auf den Tag zu setzen, an
       dem die Seite den Text von hier bezieht - der Wortlaut aendert sich
       dabei (Bausteine statt Originalsaetze). */
    ds.freitext({
      titel: 'Änderungen',
      absaetze: [
        'Diese Erklärung gilt in der Fassung vom 06.11.2026 — das ist der Tag der letzten inhaltlichen Änderung, nicht der Tag deines Aufrufs. AGB und Datenschutzerklärung tragen jeweils ihr eigenes Datum, weil sie sich unabhängig voneinander ändern; steht dort dasselbe, wurden sie am selben Tag angefasst.',
      ],
    }),
  ],

  /* Aus den Stammdaten, ohne Zutun: Angaben gemaess § 5 DDG, Kontakt
     (Reihenfolge Telefon/E-Mail getauscht, Nummer gleich), Umsatzsteuer
     (DE339476714 statt "[wird nachgetragen]"), Verantwortlich nach § 18
     Abs. 2 MStV. Woertlich von der Seite: die drei Zusaetze und die drei
     Abschnitte unter `wortlaut`. */
  impressum: {
    zusatz: [vertragliches, urheberrecht, keineAnlageberatung],
    wortlaut: {
      // Paket: derselbe Satz ohne "(§ 36 VSBG)" und ohne den Hinweis.
      streitbeilegung: [
        p(txt('Wir sind nicht bereit und nicht verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen (§ 36 VSBG).')),
        p(txt('Hinweis: Die Online-Streitbeilegungsplattform der EU wurde am 20. Juli 2025 eingestellt. Der früher übliche Link darauf gehört nicht mehr ins Impressum.')),
      ],
      // Paket: "sind wir", ohne Entfernungspflicht und Kenntnis-Satz.
      haftungInhalte: [
        p(txt('Als Diensteanbieter bin ich gemäß § 7 Abs. 1 DDG für eigene Inhalte auf diesen Seiten verantwortlich. Verpflichtungen zur Überwachung übermittelter oder gespeicherter fremder Informationen bestehen nach §§ 8 bis 10 DDG nicht. Verpflichtungen zur Entfernung oder Sperrung der Nutzung von Informationen nach den allgemeinen Gesetzen bleiben davon unberührt; eine diesbezügliche Haftung ist jedoch erst ab dem Zeitpunkt der Kenntnis einer konkreten Rechtsverletzung möglich. Bei Bekanntwerden entsprechender Rechtsverletzungen werden diese Inhalte unverzüglich entfernt.')),
      ],
      // Paket: "keinen Einfluss ... keine Gewähr" - die Seite sagt "geprüft
      // zum Zeitpunkt der Verlinkung" und verspricht die Entfernung.
      haftungLinks: [
        p(txt('Verlinkte externe Seiten wurden zum Zeitpunkt der Verlinkung auf mögliche Rechtsverstöße überprüft. Für ihre Inhalte ist stets der jeweilige Anbieter verantwortlich. Bei bekannt werdenden Rechtsverletzungen werden solche Links unverzüglich entfernt.')),
      ],
    },
  },
} };
