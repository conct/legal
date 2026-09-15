import { type Anbieter, anschrift, kontakt } from './anbieter.js';
import type { Site } from './sites.js';
import { type LegalDoc, type Section, aufzaehlung, link, lines, p, txt } from './types.js';

export interface ImpressumOptions {
  /**
   * Zusätzliche Abschnitte, die vor "Haftung für Inhalte" eingefügt werden —
   * z.B. berufsrechtliche Angaben oder eine Aufsichtsbehörde.
   */
  zusatz?: Section[];
  /**
   * Bereit zur Teilnahme an einem Verbraucherschlichtungsverfahren?
   * Default: false.
   */
  schlichtungsbereit?: boolean;
}

/**
 * Baut das Impressum nach § 5 DDG und § 18 Abs. 2 MStV.
 *
 * Der Anbieter wird bewusst übergeben statt importiert: Seiten mit fremden
 * Betreibern (unteruns.io/g/[slug]) nutzen dieselben Textbausteine.
 */
export function impressum(
  a: Anbieter,
  s: Site,
  opts: ImpressumOptions = {},
): LegalDoc {
  const sections: Section[] = [];

  sections.push({
    title: 'Angaben gemäß § 5 DDG',
    blocks: a.rechtlicheStellung
      ? [anschrift(a), p(txt(a.rechtlicheStellung))]
      : [anschrift(a)],
  });

  sections.push({
    title: 'Kontakt',
    blocks: [kontakt(a)],
  });

  if (a.registergericht) {
    sections.push({
      title: 'Registereintrag',
      blocks: [
        lines(
          `Registergericht: ${a.registergericht.gericht}`,
          `Registernummer: ${a.registergericht.nummer}`,
        ),
      ],
    });
  }

  if (a.ustId) {
    sections.push({
      title: 'Umsatzsteuer',
      blocks: [
        p(
          txt(
            'Umsatzsteuer-Identifikationsnummer gemäß § 27a Umsatzsteuergesetz: ',
          ),
          txt(a.ustId),
        ),
      ],
    });
  } else if (a.steuernummer) {
    sections.push({
      title: 'Umsatzsteuer',
      blocks: [p(txt(`Steuernummer: ${a.steuernummer}`))],
    });
  }

  if (a.wirtschaftsId) {
    sections.push({
      title: 'Wirtschafts-Identifikationsnummer',
      blocks: [p(txt(`Wirtschafts-Identifikationsnummer: ${a.wirtschaftsId}`))],
    });
  }

  if (a.berufsrecht) {
    const b = a.berufsrecht;
    const zeilen: (string | ReturnType<typeof link>)[] = [
      `Berufsbezeichnung: ${b.bezeichnung}`,
      `Verliehen in: ${b.verleihungsstaat}`,
      `Zuständige Kammer: ${b.kammer}`,
    ];
    if (b.regelungen) zeilen.push(`Berufsrechtliche Regelungen: ${b.regelungen}`);
    const blocks = [lines(...zeilen)];
    if (b.regelungenUrl) {
      blocks.push(
        p(
          txt('Einsehbar unter: '),
          link(b.regelungenUrl, b.regelungenUrl, true),
        ),
      );
    }
    sections.push({ title: 'Berufsrechtliche Angaben', blocks });
  }

  if (a.berufshaftpflicht) {
    sections.push({
      title: 'Berufshaftpflichtversicherung',
      blocks: [
        lines(
          `Versicherer: ${a.berufshaftpflicht.versicherer}`,
          `Räumlicher Geltungsbereich: ${a.berufshaftpflicht.geltungsraum}`,
        ),
      ],
    });
  }

  sections.push({
    title: 'Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV',
    blocks: [
      a.medienVerantwortlich
        ? lines(a.medienVerantwortlich, a.strasse, `${a.plz} ${a.ort}`)
        : anschrift(a),
    ],
  });

  if (opts.zusatz) sections.push(...opts.zusatz);

  // Die OS-Plattform der EU ist seit dem 20.07.2025 abgeschaltet
  // (VO (EU) 2024/3228). Link und Begleittext müssen seither entfallen —
  // ein stehengebliebener Verweis ist abmahnfähig.
  sections.push({
    title: 'Verbraucherstreitbeilegung',
    blocks: [
      p(
        txt(
          opts.schlichtungsbereit
            ? 'Wir sind bereit, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.'
            : 'Wir sind nicht bereit und nicht verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.',
        ),
      ),
    ],
  });

  sections.push({
    title: 'Haftung für Inhalte',
    blocks: [
      p(
        txt(
          'Als Diensteanbieter sind wir gemäß § 7 Abs. 1 DDG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. ' +
            'Nach §§ 8 bis 10 DDG sind wir als Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen ' +
            'zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen.',
        ),
      ),
    ],
  });

  const links = s.externeLinks?.length
    ? ` (u.a. ${aufzaehlung(s.externeLinks)})`
    : '';
  sections.push({
    title: 'Haftung für Links',
    blocks: [
      p(
        txt(
          `Unser Angebot enthält Links zu externen Webseiten Dritter${links}, auf deren Inhalte wir keinen Einfluss haben. ` +
            'Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der verlinkten Seiten ' +
            'ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich.',
        ),
      ),
    ],
  });

  return { title: 'Impressum', numbered: false, sections };
}
