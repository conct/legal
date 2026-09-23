import { type Anbieter, anschriftMitKontakt } from './anbieter.js';
import type { Angebotsart, Site } from './sites.js';
import {
  type Inline,
  type LegalDoc,
  type Section,
  type Tone,
  aufzaehlung,
  br,
  mail,
  p,
  tel,
  txt,
  ul,
} from './types.js';

export interface DsContext {
  anbieter: Anbieter;
  site: Site;
  tone: Tone;
}

/**
 * Ein wiederverwendbarer Baustein der Datenschutzerklärung.
 * `null` bedeutet: für diese Seite nicht einschlägig — der Abschnitt
 * entfällt samt Nummer, statt leer dazustehen.
 */
export type Modul = (ctx: DsContext) => Section | null;

/** Wählt zwischen formeller und persönlicher Fassung. */
const v = (ctx: DsContext, formell: string, persoenlich: string): string =>
  ctx.tone === 'formell' ? formell : persoenlich;

/**
 * Formulierungen je Angebotsart. Die 'website'-Zeile ist so gewählt, dass
 * bestehende Seiten wortgleich bleiben.
 */
const ANGEBOT: Record<
  Angebotsart,
  {
    dies: string;
    beiNutzung: string;
    genitiv: string;
    verlinkt: string;
    /** Dativ mit Possessiv: "aus unserer Website heraus". */
    unser: string;
    /** Was die Zugriffsdaten übermittelt — eine native App hat keinen Browser. */
    client: string;
    hostSatz: (hoster: string) => string;
  }
> = {
  website: {
    dies: 'Diese Website',
    beiNutzung: 'Beim Aufruf der Website',
    genitiv: 'der Website',
    verlinkt: 'Diese Seite',
    unser: 'unserer Website',
    client: 'Browser',
    hostSatz: (h) => `Diese Website wird bei ${h} gehostet. `,
  },
  app: {
    dies: 'Diese App',
    beiNutzung: 'Bei der Nutzung der App',
    genitiv: 'der App',
    verlinkt: 'Diese App',
    unser: 'unserer App',
    client: 'Gerät',
    hostSatz: (h) => `Die Server dieser App werden bei ${h} betrieben. `,
  },
  angebot: {
    dies: 'Dieses Angebot',
    beiNutzung: 'Bei der Nutzung des Angebots',
    genitiv: 'des Angebots',
    verlinkt: 'Dieses Angebot',
    unser: 'unserem Angebot',
    client: 'Gerät',
    hostSatz: (h) => `Dieses Angebot wird bei ${h} gehostet. `,
  },
};

/** Die Formulierungen für die Angebotsart dieser Seite. */
const art = (ctx: DsContext) => ANGEBOT[ctx.site.art ?? 'website'];

// --- Bausteine ---

export const verantwortlicher: Modul = (ctx) => ({
  title: 'Verantwortlicher',
  blocks: [anschriftMitKontakt(ctx.anbieter)],
});

export interface HostingOptions {
  /**
   * Nach wie vielen Tagen der Hoster die Protokolldateien löscht.
   *
   * Ohne Angabe bleibt es bei "fuer einen begrenzten Zeitraum" - das ist
   * keine Speicherdauer im Sinne von Art. 13 Abs. 2 lit. a DSGVO, und das
   * eigene Prüfwerkzeug meldet es zu Recht. Die Zahl gehört nachgeschlagen
   * und nicht geschätzt: Bei Uberspace stehen sieben Tage im Handbuch, und
   * die logrotate-Konfiguration auf dem Server sagt dasselbe.
   */
  logsTage?: number;
  /**
   * Speichert der Hoster die Adresse nur gekürzt?
   *
   * Bei Uberspace am 23.09.2026 an 3000 Protokollzeilen nachgemessen:
   * ausnahmslos IPv4 endend auf .0.0 und IPv6 mit nur zwei nicht-leeren
   * Gruppen. Wer das nicht schreibt, nennt in der eigenen Erklaerung mehr
   * Daten, als tatsächlich anfallen.
   */
  adresseGekuerzt?: boolean;
}

export const hostingMit =
  (opt: HostingOptions = {}): Modul =>
  (ctx) => ({
    title: 'Hosting und Server-Logfiles',
    blocks: [
      p(
        txt(
          (ctx.site.hoster ? art(ctx).hostSatz(ctx.site.hoster) : '') +
            `${art(ctx).beiNutzung} erhebt der Hosting-Provider automatisch technische Zugriffsdaten (sog. Server-Logfiles), ` +
            v(
              ctx,
              `die Ihr ${art(ctx).client} automatisch übermittelt`,
              `die dein ${art(ctx).client} automatisch übermittelt`,
            ) +
            ': ' +
            (opt.adresseGekuerzt ? 'eine gekürzte IP-Adresse' : 'IP-Adresse') +
            ', Datum und Uhrzeit der Anfrage, aufgerufene Seite, übertragene Datenmenge, Browsertyp und -version, ' +
            'verwendetes Betriebssystem sowie die zuvor besuchte Seite (Referrer-URL).',
        ),
      ),
      ...(opt.adresseGekuerzt
        ? [
            p(
              txt(
                'Die Adresse wird bereits vor dem Schreiben gekürzt: Bei IPv4 werden nur die ersten ' +
                  '16 Bit gespeichert, bei IPv6 die ersten 32 Bit; der Rest wird auf Null gesetzt. ' +
                  'Ein Rückschluss auf einen einzelnen Anschluss ist daraus nicht möglich.',
              ),
            ),
          ]
        : []),
      p(
        txt(
          `Diese Daten dienen ausschließlich der technischen Bereitstellung und Absicherung ${art(ctx).genitiv}` +
            (opt.adresseGekuerzt
              ? '.'
              : ' und lassen keine ' +
                v(ctx, 'Rückschlüsse auf Ihre Person zu.', 'Rückschlüsse auf dich zu.')) +
            ` Rechtsgrundlage ist unser berechtigtes Interesse an einem sicheren und stabilen Betrieb ${art(ctx).genitiv} ` +
            '(Art. 6 Abs. 1 lit. f DSGVO).' +
            // Entweder die Zahl oder die vage Wendung - nie beides. Wer beides
            // schreibt, laesst den Leser raten, welche Angabe gilt.
            (opt.logsTage
              ? ''
              : ' Die Logfiles werden aus Sicherheitsgründen für einen begrenzten Zeitraum ' +
                'gespeichert und anschließend gelöscht.'),
        ),
      ),
      ...(opt.logsTage
        ? [
            p(
              txt(
                'Speicherdauer: Die Protokolldateien werden täglich gewechselt und nach ' +
                  `${opt.logsTage} Tagen gelöscht.`,
              ),
            ),
          ]
        : []),
    ],
  });

/** Ohne Angaben zum Hoster — die Vorgabe, wortgleich wie bisher. */
export const hosting: Modul = hostingMit();

export interface KontaktformularOptions {
  /** Honeypot-Feld gegen Spam-Bots erwähnen. Default: true. */
  honeypot?: boolean;
}

export const kontaktformular =
  (opts: KontaktformularOptions = {}): Modul =>
  (ctx) => {
    const blocks = [
      p(
        txt(
          v(
            ctx,
            'Wenn Sie uns über das Kontaktformular eine Nachricht senden, verarbeiten wir die von Ihnen angegebenen Daten ' +
              '(Name, E-Mail-Adresse, Nachrichtentext) ausschließlich zum Zweck der Bearbeitung Ihrer Anfrage.',
            'Wenn du uns über das Kontaktformular eine Nachricht schickst, verarbeiten wir die von dir angegebenen Daten ' +
              '(Name, E-Mail-Adresse, Nachrichtentext) ausschließlich, um deine Anfrage zu bearbeiten.',
          ) +
            ' Die Nachricht wird per E-Mail an unser Postfach zugestellt. Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO ' +
            '(Anbahnung bzw. Erfüllung eines Vertrags oder vorvertragliche Maßnahme) bzw. Art. 6 Abs. 1 lit. f DSGVO ' +
            '(berechtigtes Interesse an der Beantwortung von Anfragen), sofern kein Vertragsbezug besteht.',
        ),
      ),
    ];

    if (opts.honeypot !== false) {
      blocks.push(
        p(
          txt(
            'Zum Schutz vor automatisierten Spam-Einsendungen enthält das Formular ein für Menschen unsichtbares Feld ' +
              '(Honeypot). Wird dieses Feld befüllt, wird die Übermittlung als Bot-Zugriff gewertet und nicht weiterverarbeitet.',
          ),
        ),
      );
    }

    blocks.push(
      p(
        txt(
          v(
            ctx,
            'Ihre Angaben werden gelöscht, sobald Ihre Anfrage abschließend bearbeitet ist, sofern keine gesetzlichen ' +
              'Aufbewahrungspflichten entgegenstehen.',
            'Deine Angaben werden gelöscht, sobald deine Anfrage abschließend bearbeitet ist, sofern keine gesetzlichen ' +
              'Aufbewahrungspflichten entgegenstehen.',
          ),
        ),
      ),
    );

    return { title: 'Kontaktformular', blocks };
  };

export const keineCookies: Modul = (ctx) => ({
  title: 'Cookies und Tracking',
  blocks: [
    p(
      txt(
        `${art(ctx).dies} verwendet keine Cookies und keine Analyse- oder Tracking-Dienste. Es findet keine Auswertung ` +
          v(ctx, 'Ihres Nutzungsverhaltens statt.', 'deines Nutzungsverhaltens statt.'),
      ),
    ),
  ],
});

export interface TechnischeCookiesOptions {
  /** Wofür die Cookies nötig sind, z.B. "die Anmeldung und die Sitzungsverwaltung". */
  zweck: string;
}

export const technischeCookies =
  (opts: TechnischeCookiesOptions): Modul =>
  (ctx) => ({
    title: 'Cookies und Tracking',
    blocks: [
      p(
        txt(
          `Wir setzen ausschließlich technisch notwendige Cookies ein, die für ${opts.zweck} erforderlich sind. ` +
            'Sie enthalten keine Profilbildungsdaten und werden nicht für Werbezwecke ausgewertet. Rechtsgrundlage ist ' +
            '§ 25 Abs. 2 Nr. 2 TDDDG sowie unser berechtigtes Interesse am technischen Betrieb des Angebots ' +
            '(Art. 6 Abs. 1 lit. f DSGVO).',
        ),
      ),
      p(
        txt(
          'Analyse- oder Tracking-Dienste Dritter setzen wir nicht ein. Es findet keine Auswertung ' +
            v(ctx, 'Ihres Nutzungsverhaltens statt.', 'deines Nutzungsverhaltens statt.'),
        ),
      ),
    ],
  });

export interface KontoOptions {
  /** Welche Daten beim Anlegen des Kontos erhoben werden. */
  daten: string;
}

export const nutzerkonto =
  (opts: KontoOptions): Modul =>
  (ctx) => ({
    title: 'Nutzerkonto',
    blocks: [
      p(
        txt(
          v(
            ctx,
            `Wenn Sie ein Nutzerkonto anlegen, verarbeiten wir die dabei angegebenen Daten (${opts.daten}), um Ihnen das Angebot bereitzustellen.`,
            `Wenn du ein Nutzerkonto anlegst, verarbeiten wir die dabei angegebenen Daten (${opts.daten}), um dir das Angebot bereitzustellen.`,
          ) + ' Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO (Erfüllung des Nutzungsvertrags).',
        ),
      ),
      p(
        txt(
          v(
            ctx,
            'Ihr Konto können Sie jederzeit löschen. Mit der Löschung werden die zugehörigen Daten entfernt, sofern keine gesetzlichen Aufbewahrungspflichten entgegenstehen.',
            'Dein Konto kannst du jederzeit löschen. Mit der Löschung werden die zugehörigen Daten entfernt, sofern keine gesetzlichen Aufbewahrungspflichten entgegenstehen.',
          ),
        ),
      ),
    ],
  });

export const externeLinks: Modul = (ctx) => {
  const liste = ctx.site.externeLinks?.length
    ? ` (u.a. ${aufzaehlung(ctx.site.externeLinks)})`
    : '';
  return {
    title: 'Externe Links',
    blocks: [
      p(
        txt(
          `${art(ctx).verlinkt} verlinkt auf externe Angebote${liste}. Diese Links führen aus ${art(ctx).unser} heraus; ` +
            'erst mit dem Anklicken werden Daten an den jeweiligen Anbieter übertragen. Für die Datenverarbeitung auf ' +
            'diesen externen Seiten gelten die Datenschutzerklärungen der jeweiligen Anbieter, auf die wir keinen Einfluss haben.',
        ),
      ),
    ],
  };
};

export const betroffenenrechte: Modul = (ctx) => ({
  title: v(ctx, 'Ihre Rechte', 'Deine Rechte'),
  blocks: [
    p(
      txt(
        v(
          ctx,
          'Ihnen stehen als betroffene Person nach der DSGVO folgende Rechte zu:',
          'Dir stehen als betroffene Person nach der DSGVO folgende Rechte zu:',
        ),
      ),
    ),
    ul(
      v(
        ctx,
        'Auskunft über die zu Ihrer Person gespeicherten Daten (Art. 15 DSGVO)',
        'Auskunft über die zu deiner Person gespeicherten Daten (Art. 15 DSGVO)',
      ),
      'Berichtigung unrichtiger Daten (Art. 16 DSGVO)',
      v(ctx, 'Löschung Ihrer Daten (Art. 17 DSGVO)', 'Löschung deiner Daten (Art. 17 DSGVO)'),
      'Einschränkung der Verarbeitung (Art. 18 DSGVO)',
      'Datenübertragbarkeit (Art. 20 DSGVO)',
      'Widerspruch gegen die Verarbeitung (Art. 21 DSGVO)',
    ),
    p(
      txt(
        v(
          ctx,
          'Wenden Sie sich dazu einfach an die oben genannte Kontaktadresse. Ihnen steht zudem ein Beschwerderecht bei einer Datenschutz-Aufsichtsbehörde zu',
          'Wende dich dazu einfach an die oben genannte Kontaktadresse. Dir steht zudem ein Beschwerderecht bei einer Datenschutz-Aufsichtsbehörde zu',
        ) +
          (ctx.anbieter.aufsichtsbehoerde ? ` (${ctx.anbieter.aufsichtsbehoerde})` : '') +
          '.',
      ),
    ),
  ],
});

export const aktualitaet: Modul = () => ({
  title: 'Aktualität dieser Erklärung',
  blocks: [
    p(
      txt(
        'Diese Datenschutzerklärung kann bei Bedarf angepasst werden, etwa bei Weiterentwicklung der Website oder ' +
          'neuen rechtlichen Vorgaben.',
      ),
    ),
  ],
});

export const datenschutzbeauftragter: Modul = (ctx) => {
  const d = ctx.anbieter.datenschutzbeauftragter;
  // null heisst hier wie ueberall: fuer diese Seite nicht einschlaegig. Wer
  // stattdessen ausdruecklich schreiben will, dass keiner bestellt ist,
  // nimmt keinDatenschutzbeauftragter in sein Preset auf - beides zugleich
  // waere ein Abschnitt, der mal Inhalt hat und mal eine Verlegenheit.
  if (!d) return null;

  const v: Inline[] = [txt(d.name), br, txt('E-Mail: '), mail(d.email)];
  if (d.telefon) v.push(br, txt('Telefon: '), tel(d.telefon));

  return {
    title: 'Datenschutzbeauftragter',
    blocks: [{ t: 'p', v }],
  };
};

export const auftragsverarbeitung: Modul = (ctx) => {
  const dienste = ctx.site.drittdienste;
  if (!dienste?.length) return null;

  return {
    title: 'Auftragsverarbeiter',
    blocks: [
      p(
        txt(
          `Für den Betrieb ${art(ctx).genitiv} setzen wir Dienstleister ein, die personenbezogene Daten ` +
            'in unserem Auftrag und nach unserer Weisung verarbeiten. Mit ihnen bestehen Verträge zur ' +
            'Auftragsverarbeitung nach Art. 28 DSGVO.',
        ),
      ),
      ul(
        ...dienste.map((d) =>
          `${d.name} — ${d.zweck}${d.ort ? ` (${d.ort})` : ''}`,
        ),
      ),
    ],
  };
};

/** Der Satz Bausteine, den fast jede Seite braucht. */
/**
 * Übermittlung in Drittländer - oder eben ausdruecklich keine.
 *
 * Art. 13 Abs. 1 lit. f DSGVO verlangt die Angabe, wenn übermittelt wird.
 * Wird nicht übermittelt, verlangt sie niemand - und trotzdem fehlt die
 * Aussage dann an der Stelle, an der jeder Leser sie sucht. Ein Satz, der
 * sagt "findet nicht statt", beantwortet die Frage; Schweigen tut es nicht.
 */
export const drittland: Modul = (ctx) => {
  const auslaendisch = (ctx.site.drittdienste ?? []).filter(
    (d) => d.ort && !/deutschland|österreich|schweiz|\bEU\b|europ/i.test(d.ort),
  );
  if (auslaendisch.length) {
    return {
      title: 'Übermittlung in Drittländer',
      blocks: [
        p(
          txt(
            'Einzelne der oben genannten Dienstleister verarbeiten Daten außerhalb der ' +
              'Europäischen Union: ' +
              auslaendisch.map((d) => `${d.name} (${d.ort})`).join(', ') +
              '. Grundlage sind die Standardvertragsklauseln der EU-Kommission.',
          ),
        ),
      ],
    };
  }
  return {
    title: 'Übermittlung in Drittländer',
    blocks: [
      p(
        txt(
          `Die Server stehen in Deutschland. Eine Übermittlung personenbezogener Daten in ` +
            'Länder außerhalb der Europäischen Union findet nicht statt.',
        ),
      ),
    ],
  };
};

/**
 * Widerruf einer Einwilligung.
 *
 * Auch dort einschlägig, wo gar keine Einwilligung eingeholt wird: Dann ist
 * die Auskunft, dass es nichts zu widerrufen gibt, die Antwort auf die Frage.
 * Art. 7 Abs. 3 DSGVO.
 */
export const einwilligungWiderruf: Modul = (ctx) => ({
  title: 'Widerruf einer Einwilligung',
  blocks: [
    p(
      txt(
        v(
          ctx,
          'Soweit eine Verarbeitung auf Ihrer Einwilligung beruht, können Sie diese jederzeit ' +
            'mit Wirkung für die Zukunft widerrufen (Art. 7 Abs. 3 DSGVO). Die Rechtmäßigkeit ' +
            'der bis dahin erfolgten Verarbeitung bleibt davon unberührt.',
          'Soweit eine Verarbeitung auf deiner Einwilligung beruht, kannst du sie jederzeit mit ' +
            'Wirkung für die Zukunft widerrufen (Art. 7 Abs. 3 DSGVO). Was bis dahin verarbeitet ' +
            'wurde, bleibt davon unberührt.',
        ),
      ),
    ),
  ],
});

/**
 * Kein Datenschutzbeauftragter — und warum keiner nötig ist.
 *
 * Der Verantwortliche kann nicht sein eigener Beauftragter sein: Er muesste
 * sich selbst kontrollieren (Art. 38 Abs. 6 DSGVO). Wo keiner bestellt ist,
 * gehört stattdessen ein Ansprechpartner benannt - sonst weiss der Leser
 * nicht, an wen er sich wendet.
 */
export const keinDatenschutzbeauftragter: Modul = (ctx) => ({
  title: 'Ansprechpartner für den Datenschutz',
  blocks: [
    p(
      txt(
        'Ein Datenschutzbeauftragter ist nicht bestellt; die Voraussetzungen des Art. 37 DSGVO ' +
          'und des § 38 BDSG liegen nicht vor. Ansprechpartner für alle Fragen zum Datenschutz ' +
          `ist der oben genannte Verantwortliche, ${ctx.anbieter.name}, erreichbar unter `,
      ),
      mail(ctx.anbieter.email),
      txt('.'),
    ),
  ],
});

export const STANDARD_MODULE: Modul[] = [
  verantwortlicher,
  datenschutzbeauftragter,
  hosting,
  auftragsverarbeitung,
  // Beide am 23.09.2026 aufgenommen: Das eigene Prüfwerkzeug hat sie auf
  // jeder erzeugten Erklaerung vermisst. Art. 13 Abs. 1 lit. f und
  // Art. 7 Abs. 3 DSGVO - und beide sind auch dann eine Auskunft, wenn die
  // Antwort "findet nicht statt" lautet.
  drittland,
  einwilligungWiderruf,
  keineCookies,
  betroffenenrechte,
  aktualitaet,
];

export interface DatenschutzOptions {
  /** Default: 'formell'. */
  tone?: Tone;
  /** Default: STANDARD_MODULE. */
  module?: Modul[];
}

/**
 * Setzt die Datenschutzerklärung aus Bausteinen zusammen.
 * Die Abschnitte werden beim Rendern automatisch durchnummeriert.
 */
export function datenschutz(
  a: Anbieter,
  s: Site,
  opts: DatenschutzOptions = {},
): LegalDoc {
  const ctx: DsContext = {
    anbieter: a,
    site: s,
    tone: opts.tone ?? 'formell',
  };
  const module = opts.module ?? STANDARD_MODULE;
  return {
    title: 'Datenschutzerklärung',
    numbered: true,
    sections: module
      .map((m) => m(ctx))
      .filter((s): s is Section => s !== null),
  };
}
