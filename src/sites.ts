/** Die seitenspezifischen Angaben — alles, was NICHT für alle Projekte gilt. */
export interface Site {
  /** Domain ohne Protokoll, z.B. "feif.space". */
  domain: string;
  /** Anzeigename, erscheint im Seitentitel. */
  name: string;
  /**
   * Externe Angebote, auf die diese Seite verlinkt. Fließt in "Haftung für
   * Links" (Impressum) und "Externe Links" (Datenschutz) ein.
   */
  externeLinks?: string[];
  /** Hoster, erscheint im Datenschutz-Baustein `hosting`. */
  hoster?: string;
}

const geschwister = [
  'choozy.io',
  'velvet-network.app',
  'unteruns.io',
  'rechnungswerk.conct.de',
  'pip-boy.feif.space',
];

export const SITES = {
  'feif.space': {
    domain: 'feif.space',
    name: 'feif.space',
    externeLinks: [...geschwister, 'Instagram- und TikTok-Profile'],
    hoster: 'Uberspace Entwicklungen GbR',
  },
  'choozy.io': {
    domain: 'choozy.io',
    name: 'Choozy',
    hoster: 'Uberspace Entwicklungen GbR',
  },
  'velvet-network.app': {
    domain: 'velvet-network.app',
    name: 'VELVET',
    hoster: 'Uberspace Entwicklungen GbR',
  },
  'unteruns.io': {
    domain: 'unteruns.io',
    name: 'unteruns',
    hoster: 'Uberspace Entwicklungen GbR',
  },
  'rechnungswerk.conct.de': {
    domain: 'rechnungswerk.conct.de',
    name: 'Rechnungswerk',
    hoster: 'Uberspace Entwicklungen GbR',
  },
  'pip-boy.feif.space': {
    domain: 'pip-boy.feif.space',
    name: 'Pip-Boy',
    hoster: 'Uberspace Entwicklungen GbR',
  },
} as const satisfies Record<string, Site>;

export type SiteKey = keyof typeof SITES;
